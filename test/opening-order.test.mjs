import assert from 'node:assert/strict';
import {test} from 'node:test';
import {validateOpeningOrder,moveOpening,saveOpeningOrder} from '../src/opening-order.js';
import {openingStamp} from '../src/opening-generation.js';
import {applyOpeningCover,coverPresentation} from '../src/opening-presentation.js';
const key='universal_opening_selector',first='<UniversalOpeningSelector/>',copy=value=>structuredClone(value);
test('automatic cover allocation follows its original identity through repeated reorders',()=>{
  const host={localStorage:{getItem:()=> 'fixed-seed'}},cover=()=>({classList:{add(){}},style:{}});
  const before=cover();applyOpeningCover(before,{},'正文A',2,host);
  const after=cover();applyOpeningCover(after,coverPresentation({coverSeedIndex:2}),'正文A',0,host);
  assert.equal(after.style.backgroundImage,before.style.backgroundImage);
  const again=cover();applyOpeningCover(again,{coverSeedIndex:2},'正文A',1,host);assert.equal(again.style.backgroundImage,before.style.backgroundImage);
});
function fixture(){
  const entries=[{title:'A',image:'cover-a',worldbookPresetId:'a',names:'林安安'},{title:'B',image:'cover-b',worldbookPresetId:'b',names:'沈挽昼'},{title:'C',tags:['重逢']}];
  const card={avatar:'demo.png',data:{first_mes:first,alternate_greetings:['正文A','正文B','正文C'],extensions:{[key]:{entries},unrelated:{keep:true}}}};
  let server=copy(card),writes=0,syncs=0;const chat={role:'assistant',swipe_id:0,swipes:[first,...card.data.alternate_greetings]};
  const context={characterId:0,characters:[card],chatId:'fresh',getRequestHeaders:()=>({})};
  const host={fetch:async(url,options)=>{
    if(url.endsWith('/get'))return {ok:true,status:200,json:async()=>copy(server)};
    writes++;const body=JSON.parse(options.body).data;server.data={...server.data,...body,extensions:{...server.data.extensions,...body.extensions}};return {ok:true,status:200};
  }};
  const helper={getLastMessageId:()=>0,getChatMessages:()=>[chat],setChatMessages:async([value])=>{syncs++;Object.assign(chat,value)}};
  const settings={entries:[entries[2],entries[0],entries[1]],title:'新标题'};
  const args={host,getContext:()=>context,helper,identity:{characterId:0,avatar:card.avatar,chatId:'fresh'},expectedStamp:openingStamp(card),expectedSettings:copy(card.data.extensions[key]),order:[2,0,1],settings};
  return {args,card,chat,context,helper,host,settings,get server(){return server},set server(value){server=value},get writes(){return writes},get syncs(){return syncs}};
}
test('move supports both directions and rejects incomplete/duplicate/out of range permutations',()=>{
  assert.deepEqual(moveOpening([0,1,2],2,0),[2,0,1]);assert.deepEqual(moveOpening([0,1,2],0,2),[1,2,0]);
  for(const order of [[0,0,1],[0,1],[-1,0,1],[0,1,3]])assert.throws(()=>validateOpeningOrder(order,3));
});
test('save keeps selector main greeting fixed, moves actual bodies with metadata and synchronizes a fresh chat',async()=>{
  const f=fixture(),result=await saveOpeningOrder(f.args);
  assert.deepEqual(f.server.data.alternate_greetings,['正文C','正文A','正文B']);assert.equal(f.server.data.first_mes,first);
  assert.deepEqual(f.server.data.extensions[key],f.settings);assert.deepEqual(f.server.data.extensions.unrelated,{keep:true});
  assert.deepEqual(f.card.data.alternate_greetings,f.server.data.alternate_greetings);assert.deepEqual(f.chat.swipes,[first,'正文C','正文A','正文B']);
  assert.equal(result.chatSynced,true);assert.equal(f.writes,1);
});
test('server greeting/settings conflicts and a replacement card prevent writes',async()=>{
  for(const kind of ['body','settings','replacement']){
    const f=fixture();if(kind==='body')f.server.data.alternate_greetings.push('其他人新写的正文');
    if(kind==='settings')f.server.data.extensions[key].title='其他人的设置';
    if(kind==='replacement'){const fetch=f.host.fetch;f.host.fetch=async(...args)=>{const result=await fetch(...args);f.context.characters[0]=copy(f.card);return result}};
    await assert.rejects(saveOpeningOrder(f.args));assert.equal(f.writes,0);
  }
});
test('continued or changed chats are untouched while saved order remains ready for new chats',async()=>{
  for(const kind of ['continued','otherChat','otherSwipe','chatEdited']){
    const f=fixture();if(kind==='continued')f.helper.getLastMessageId=()=>2;if(kind==='otherChat')f.context.chatId='other';
    if(kind==='otherSwipe')f.chat.swipe_id=1;if(kind==='chatEdited')f.chat.swipes[1]='聊天里的改文';
    const before=copy(f.chat),result=await saveOpeningOrder(f.args);assert.equal(result.chatSynced,false);assert.deepEqual(f.chat,before);assert.equal(f.syncs,0);
  }
});
test('failed writes or verification do not update local card/chat, and late disposal is rejected',async()=>{
  for(const phase of ['write','verify','dispose']){
    const f=fixture(),before=copy(f.card),fetch=f.host.fetch;let active=true;
    f.args.isActive=()=>active;
    f.host.fetch=async(url,options)=>{
      if(phase==='write'&&url.endsWith('/merge-attributes'))return {ok:false,status:500};
      const r=await fetch(url,options);
      if(f.writes&&url.endsWith('/get')){if(phase==='verify')return {ok:true,status:200,json:async()=>before};if(phase==='dispose')active=false}return r;
    };
    await assert.rejects(saveOpeningOrder(f.args));assert.deepEqual(f.card,before);assert.equal(f.syncs,0);
  }
});
