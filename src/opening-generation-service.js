import {buildOpeningPrompt,generationResultText,openingStamp,openingNames} from './opening-generation.js';

let activeRequest=null;
const resolve=(sources,name)=>{const owner=(typeof sources==='function'?sources():sources).find(source=>typeof source?.[name]==='function');return owner?owner[name].bind(owner):null};
export function createOpeningGenerationService(sources){
  let request=null,closed=false;
  return {
    async generate(options,context){
      if(closed)throw Error('生成窗口已关闭。');
      if(activeRequest)throw Error('上一条生成请求仍在结束，请稍候再试。');
      const generate=resolve(sources,options.preset==='raw'?'generateRaw':'generate');
      if(!generate)throw Error('当前酒馆助手未提供所选生成接口，请更新酒馆助手或切换生成方式。');
      const job={id:`uos-opening-${Date.now()}-${Math.random().toString(36).slice(2)}`,cancelled:false};request=job;activeRequest=job;
      try{
        const config={generation_id:job.id,user_input:buildOpeningPrompt(options,context),should_stream:false,should_silence:true,max_chat_history:0,
          overrides:{chat_history:{prompts:[],author_note:''}}};
        if(options.preset==='raw')config.ordered_prompts=['world_info_before','persona_description','char_description','char_personality','scenario','world_info_after','dialogue_examples','chat_history','user_input'];
        const result=await generate(config);
        if(job.cancelled||closed)throw Error('已取消本次生成。');
        return generationResultText(result);
      }finally{if(activeRequest===job)activeRequest=null;if(request===job)request=null}
    },
    cancel(){if(!request)return;request.cancelled=true;try{resolve(sources,'stopGenerationById')?.(request.id)}catch{}},
    close(){closed=true;this.cancel()},
  };
}

const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const dataOf=card=>card?.data||card||{};
export async function appendGeneratedOpening({host,getContext,helper,identity,mode,expectedStamp,body,title,names}){
  body=String(body||'').trim();if(!body||body.length>50000)throw Error('请填写 1–50000 字的开场正文。');
  if(body.startsWith('<UniversalOpeningSelector/>'))throw Error('备用开场不能使用选择器标记。');
  const key='universal_opening_selector',context=getContext(),card=context?.characters?.[context.characterId];
  if(!card?.avatar||card.avatar!==identity.avatar||context.characterId!==identity.characterId)throw Error('角色已切换，草稿已保留；请回到原角色再保存。');
  if(typeof context.getRequestHeaders!=='function'||typeof host.fetch!=='function')throw Error('当前酒馆未提供角色卡保存接口。');
  if(openingStamp(card)!==expectedStamp)throw Error('备用开场已发生变化，草稿已保留；请重新打开生成器后再保存。');
  const headers=context.getRequestHeaders();
  const read=async()=>{const response=await host.fetch('/api/characters/get',{method:'POST',headers,body:JSON.stringify({avatar_url:identity.avatar})});if(!response.ok)throw Error(`角色卡读取失败（HTTP ${response.status}）`);return response.json()};
  const latest=await read(),data=dataOf(latest),first=String(data.first_mes??latest.first_mes??'');
  if(openingStamp(latest)!==expectedStamp)throw Error('服务器上的开场已变化，未覆盖；请重新打开生成器后再保存。');
  const author=first.trimStart().startsWith('<UniversalOpeningSelector/>');if(author!==(mode==='author'))throw Error('角色卡模式已变化，请重新打开生成器。');
  const oldAlternates=data.alternate_greetings??latest.alternate_greetings??[];
  if(!Array.isArray(oldAlternates))throw Error('角色卡备用开场格式异常，未写入。');
  if(oldAlternates.some(value=>String(value).trim()===body))throw Error('备用开场中已有相同正文，请修改后再添加。');
  const index=oldAlternates.length+(author?0:1),alternates=[...oldAlternates,body];
  const existing=data.extensions?.[key]??latest.extensions?.[key]??{},entries=Array.isArray(existing.entries)?existing.entries.slice():[];
  while(entries.length<index)entries.push({});
  entries[index]={title:String(title||`新开场 ${index+1}`).trim().slice(0,100),names:openingNames(names).join('、')};
  const settings={...existing,entries};
  // Recheck after asynchronous read. Never write to a newly selected character.
  if(getContext()?.characterId!==identity.characterId||getContext()?.characters?.[identity.characterId]?.avatar!==identity.avatar||openingStamp(card)!==expectedStamp)throw Error('角色或备用开场已变化，未写入。');
  const response=await host.fetch('/api/characters/merge-attributes',{method:'POST',headers,body:JSON.stringify({avatar:identity.avatar,data:{alternate_greetings:alternates,extensions:{[key]:settings}}})});
  if(!response.ok)throw Error(`备用开场写入失败（HTTP ${response.status}），草稿已保留。`);
  let verified;
  try{verified=dataOf(await read())}catch{throw Error('写入请求已提交，但复核失败；请检查角色卡是否已添加，草稿仍保留。')}
  if(!same(verified.alternate_greetings,alternates)||!same(verified.extensions?.[key]?.entries?.[index],entries[index]))throw Error('写入请求已提交，但复核结果不一致；请检查角色卡，草稿仍保留。');
  // Update only the original card object, even if the user switched during the write.
  card.alternate_greetings=alternates.slice();if(card.data)card.data.alternate_greetings=alternates.slice();
  card.extensions={...card.extensions,[key]:settings};if(card.data)card.data.extensions={...card.data.extensions,[key]:settings};
  let chatSynced=false,warning='已添加并复核备用开场。新建聊天即可使用。';
  try{
    const current=getContext(),sameChat=current?.characterId===identity.characterId&&current?.characters?.[identity.characterId]?.avatar===identity.avatar&&current?.chatId===identity.chatId;
    if(sameChat&&Number(helper?.getLastMessageId?.()??0)===0){
      const message=helper.getChatMessages(0,{include_swipes:true})?.[0],expected=[first,...oldAlternates];
      if(message?.role==='assistant'&&same(message.swipes,expected)){
        await helper.setChatMessages([{message_id:0,swipes:[...message.swipes,body],swipe_id:Number(message.swipe_id)||0}],{refresh:'none'});
        chatSynced=same(helper.getChatMessages(0,{include_swipes:true})?.[0]?.swipes,[...expected,body]);
      }
    }
    if(chatSynced)warning='已添加并复核备用开场；当前聊天的开场列表也已更新。';
  }catch{warning='备用开场已保存；当前聊天刷新失败，请新建聊天使用。'}
  return {index,settings,chatSynced,message:warning};
}
