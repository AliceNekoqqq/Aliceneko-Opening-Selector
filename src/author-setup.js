import {openingStamp} from './opening-generation.js';
import {requestCharacterCard} from './character-card-request.js';

export const AUTHOR_ENTRY_TEXT='<UniversalOpeningSelector/>\n【请选择开场】如果选择页没有出现，请使用酒馆首条消息的翻页箭头。';
const dataOf=card=>card?.data||card||{};
export function authorSetupPlan(card){
  const data=dataOf(card),first=String(data.first_mes??card?.first_mes??''),alternates=data.alternate_greetings??card?.alternate_greetings??[];
  if(!Array.isArray(alternates))throw Error('备用开场格式异常，请先检查角色卡。');
  const ready=first.trimStart().startsWith('<UniversalOpeningSelector/>');
  return {ready,first,alternates:alternates.slice(),nextAlternates:ready?alternates.slice():first.trim()?[first,...alternates]:alternates.slice()};
}

// Called only after the user confirms the exact migration shown in the menu.
export async function initializeAuthorCard({host,getContext,helper,identity,expectedStamp,isActive=()=>true}){
  const context=getContext(),card=context?.characters?.[identity.characterId];
  const current=()=>isActive()&&getContext()?.characterId===identity.characterId&&getContext()?.characters?.[identity.characterId]===card&&card?.avatar===identity.avatar;
  if(!current()||openingStamp(card)!==expectedStamp)throw Error('角色或开场已变化，请重新打开入口后再确认。');
  if(typeof context.getRequestHeaders!=='function')throw Error('当前酒馆未提供角色卡保存接口。');
  const headers=context.getRequestHeaders(),read=async()=>{
    const r=await requestCharacterCard(host,'/api/characters/get',{method:'POST',headers,body:JSON.stringify({avatar_url:identity.avatar})},{readJson:true});
    if(!r.ok)throw Error(`角色卡读取失败（HTTP ${r.status}）`);return r.data;
  };
  const latest=await read();if(openingStamp(latest)!==expectedStamp)throw Error('服务器上的开场已变化，未迁移；请重新打开入口。');
  const plan=authorSetupPlan(latest);if(plan.ready)return {migrated:false};
  if(!current()||openingStamp(card)!==expectedStamp)throw Error('角色或开场已变化，未迁移。');
  const r=await requestCharacterCard(host,'/api/characters/merge-attributes',{method:'POST',headers,body:JSON.stringify({avatar:identity.avatar,data:{first_mes:AUTHOR_ENTRY_TEXT,alternate_greetings:plan.nextAlternates}})});
  if(!r.ok)throw Error(`迁移保存失败（HTTP ${r.status}）`);
  const saved=dataOf(await read());
  if(saved.first_mes!==AUTHOR_ENTRY_TEXT||JSON.stringify(saved.alternate_greetings)!==JSON.stringify(plan.nextAlternates))throw Error('迁移请求已提交，但复核失败；请重新打开角色卡检查。');
  if(!current())throw Error('原角色卡已迁移，但当前角色或窗口已变化，请重新打开角色卡。');
  card.first_mes=AUTHOR_ENTRY_TEXT;card.alternate_greetings=plan.nextAlternates.slice();if(card.data){card.data.first_mes=AUTHOR_ENTRY_TEXT;card.data.alternate_greetings=plan.nextAlternates.slice()}
  // Never alter an ongoing or independently edited chat.
  try{
    const message=helper?.getChatMessages?.(0,{include_swipes:true})?.[0],matches=Array.isArray(message?.swipes)?JSON.stringify(message.swipes)===JSON.stringify([plan.first,...plan.alternates]):message?.message===plan.first;
    if(current()&&getContext()?.chatId===identity.chatId&&Number(helper?.getLastMessageId?.()??0)===0&&Number(message?.swipe_id??0)===0&&message?.role==='assistant'&&matches&&typeof helper?.setChatMessages==='function')await helper.setChatMessages([{message_id:0,swipe_id:0,swipes:[AUTHOR_ENTRY_TEXT,...plan.nextAlternates]}],{refresh:'none'});
  }catch{}
  return {migrated:true};
}
