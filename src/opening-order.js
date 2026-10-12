import {openingStamp} from './opening-generation.js';
import {requestCharacterCard} from './character-card-request.js';

export function validateOpeningOrder(order,count){
  if(!Array.isArray(order)||order.length!==count||new Set(order).size!==count||order.some(i=>!Number.isInteger(i)||i<0||i>=count))throw Error('开场顺序无效，请重新打开设置。');
  return order;
}
export function moveOpening(order,from,to){
  validateOpeningOrder(order,order.length);
  if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||to<0||from>=order.length||to>=order.length)return order.slice();
  const next=order.slice(),[item]=next.splice(from,1);next.splice(to,0,item);return next;
}
const dataOf=card=>card?.data||card||{};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);

// Save the real greetings and their metadata together, then verify before
// updating local state. A stale workshop must never overwrite another edit.
export async function saveOpeningOrder({host,getContext,helper,identity,expectedStamp,expectedSettings,order,settings,isActive=()=>true}){
  const key='universal_opening_selector',context=getContext(),card=context?.characters?.[identity.characterId];
  const current=()=>isActive()&&getContext()?.characterId===identity.characterId&&getContext()?.characters?.[identity.characterId]===card&&card?.avatar===identity.avatar;
  if(!current()||openingStamp(card)!==expectedStamp)throw Error('角色或开场已变化，请重新打开设置后排序。');
  if(typeof context.getRequestHeaders!=='function')throw Error('当前酒馆未提供保存请求接口');
  const headers=context.getRequestHeaders();
  const read=async()=>{
    const r=await requestCharacterCard(host,'/api/characters/get',{method:'POST',headers,body:JSON.stringify({avatar_url:identity.avatar})},{readJson:true});
    if(!r.ok)throw Error(`角色卡读取失败（HTTP ${r.status}）`);return r.data;
  };
  const latest=await read(),data=dataOf(latest),existing=data.extensions?.[key]??latest.extensions?.[key];
  if(openingStamp(latest)!==expectedStamp||!same(existing,expectedSettings))throw Error('服务器上的开场或设置已变化，未覆盖；请重新打开设置。');
  const first=String(data.first_mes??latest.first_mes??''),original=data.alternate_greetings??latest.alternate_greetings??[];
  if(!first.trimStart().startsWith('<UniversalOpeningSelector/>')||!Array.isArray(original))throw Error('角色卡已不处于作者模式，请重新打开设置。');
  validateOpeningOrder(order,original.length);
  const alternates=order.map(i=>original[i]);
  if(!current()||openingStamp(card)!==expectedStamp)throw Error('角色或开场已变化，未写入。');
  const response=await requestCharacterCard(host,'/api/characters/merge-attributes',{method:'POST',headers,body:JSON.stringify({avatar:identity.avatar,data:{alternate_greetings:alternates,extensions:{[key]:settings}}})});
  if(!response.ok)throw Error(`开场排序写入失败（HTTP ${response.status}），编辑仍保留。`);
  const persisted=dataOf(await read());
  if(!same(persisted.alternate_greetings,alternates)||!same(persisted.extensions?.[key],settings))throw Error('排序请求已提交，但复核结果不一致；请检查角色卡，编辑仍保留。');
  if(!current())throw Error('原角色卡已保存，但当前角色或窗口已变化，请重新打开角色卡。');
  card.alternate_greetings=alternates.slice();if(card.data)card.data.alternate_greetings=alternates.slice();
  card.extensions={...card.extensions,[key]:settings};if(card.data)card.data.extensions={...card.data.extensions,[key]:settings};
  let chatSynced=false;
  try{
    const c=getContext(),message=helper?.getChatMessages?.(0,{include_swipes:true})?.[0];
    if(current()&&c.chatId===identity.chatId&&Number(helper?.getLastMessageId?.()??0)===0&&Number(message?.swipe_id??0)===0&&message?.role==='assistant'&&same(message.swipes,[first,...original])&&typeof helper.setChatMessages==='function'){
      await helper.setChatMessages([{message_id:0,swipes:[first,...alternates],swipe_id:0}],{refresh:'none'});
      chatSynced=same(helper.getChatMessages(0,{include_swipes:true})?.[0]?.swipes,[first,...alternates]);
    }
  }catch{}
  return {chatSynced,message:chatSynced?'已保存开场顺序与设置，当前选择页立即生效。':'已保存开场顺序与设置；当前聊天未同步，请新建聊天使用。'};
}
