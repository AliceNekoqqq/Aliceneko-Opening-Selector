import assert from 'node:assert/strict';
import {test} from 'node:test';
import {authorSetupPlan,initializeAuthorCard,AUTHOR_ENTRY_TEXT} from '../src/author-setup.js';
import {openingStamp} from '../src/opening-generation.js';
const clone=structuredClone;
function fixture(first='原主开场\n<content>原文保持</content>'){
  const card={avatar:'demo.png',data:{first_mes:first,alternate_greetings:['备用甲','备用乙'],extensions:{universal_opening_selector:{entries:[{title:'主开场',image:'cover-a'},{title:'备用甲'}]},other:{keep:true}}}};
  let server=clone(card),writes=0,syncs=0;const context={characterId:0,characters:[card],chatId:'fresh',getRequestHeaders:()=>({})},message={role:'assistant',swipe_id:0,swipes:[first,...card.data.alternate_greetings]};
  const host={fetch:async(url,options)=>{if(url.endsWith('/get'))return {ok:true,status:200,json:async()=>clone(server)};writes++;Object.assign(server.data,JSON.parse(options.body).data);return {ok:true,status:200}}};
  const helper={getChatMessages:()=>[message],getLastMessageId:()=>0,setChatMessages:async([value])=>{syncs++;Object.assign(message,value)}};
  const args={host,getContext:()=>context,helper,identity:{characterId:0,avatar:card.avatar,chatId:'fresh'},expectedStamp:openingStamp(card)};
  return {card,context,message,helper,host,args,get server(){return server},get writes(){return writes},get syncs(){return syncs}};
}
test('confirmed setup preserves complete main text and original alternate order and extensions',async()=>{
  const f=fixture(),first=f.card.data.first_mes,settings=clone(f.server.data.extensions);
  const result=await initializeAuthorCard(f.args);assert.equal(result.migrated,true);
  assert.equal(f.server.data.first_mes,AUTHOR_ENTRY_TEXT);assert.deepEqual(f.server.data.alternate_greetings,[first,'备用甲','备用乙']);assert.deepEqual(f.server.data.extensions,settings);
  assert.deepEqual(f.message.swipes,[AUTHOR_ENTRY_TEXT,first,'备用甲','备用乙']);assert.equal(f.writes,1);
});
test('empty main adds only marker; already initialized cards do not migrate twice',async()=>{
  const empty=fixture('');await initializeAuthorCard(empty.args);assert.deepEqual(empty.server.data.alternate_greetings,['备用甲','备用乙']);
  const ready=fixture(AUTHOR_ENTRY_TEXT);await initializeAuthorCard(ready.args);assert.equal(ready.writes,0);
  assert.throws(()=>authorSetupPlan({data:{alternate_greetings:'invalid'}}));
});
test('server conflict, replaced role and disposed prompt prevent migration writes',async()=>{
  for(const kind of ['server','role','disposed']){const f=fixture();if(kind==='server')f.server.data.alternate_greetings.push('新开场');if(kind==='disposed')f.args.isActive=()=>false;if(kind==='role')f.context.characters[0]=clone(f.card);
    if(kind==='role'){const fetch=f.host.fetch;f.host.fetch=async(...args)=>{const r=await fetch(...args);f.context.characters[0]=clone(f.card);return r}}
    await assert.rejects(initializeAuthorCard(f.args));assert.equal(f.writes,0);
  }
});
test('ongoing or edited chats retain their original messages after explicit card migration',async()=>{
  for(const kind of ['continued','edited','otherChat']){const f=fixture();if(kind==='continued')f.helper.getLastMessageId=()=>3;if(kind==='edited')f.message.swipes[0]='聊天改文';if(kind==='otherChat')f.context.chatId='other';const before=clone(f.message);await initializeAuthorCard(f.args);assert.deepEqual(f.message,before);assert.equal(f.syncs,0);assert.equal(f.writes,1)}
});
test('failed migration persistence/verification retains local card',async()=>{
  for(const kind of ['write','verify']){const f=fixture(),before=clone(f.card),fetch=f.host.fetch;f.host.fetch=async(url,options)=>{if(kind==='write'&&url.endsWith('/merge-attributes'))return {ok:false,status:500};const r=await fetch(url,options);if(kind==='verify'&&f.writes&&url.endsWith('/get'))return {ok:true,status:200,json:async()=>before};return r};await assert.rejects(initializeAuthorCard(f.args));assert.deepEqual(f.card,before)}
});
test('real V2 whole-card merge replaces the marker and refreshes only an unchanged editor field',async()=>{
  for(const editing of [false,true]){
    const f=fixture('<opening>\n完整原主开场\n</opening>'),first=f.card.data.first_mes,field={value:editing?'还没保存的手动修改':first};
    // Simulate ST: merge into the entire stored V2 card; /get copies canonical
    // data.first_mes to the compatibility first_mes. A flat write is ignored.
    let stored={spec:'chara_card_v2',first_mes:first,...structuredClone(f.card)};
    const merge=(target,source)=>{const result={...target};for(const [key,value] of Object.entries(source)){result[key]=value&&typeof value==='object'&&!Array.isArray(value)?merge(result[key]||{},value):structuredClone(value)}return result};
    f.host.document={querySelector:selector=>selector==='#firstmessage_textarea'?field:null};
    f.host.fetch=async(url,options)=>{
      if(url.endsWith('/get'))return {ok:true,status:200,json:async()=>({...structuredClone(stored),first_mes:stored.data.first_mes})};
      stored=merge(stored,JSON.parse(options.body).data);return {ok:true,status:200};
    };
    await initializeAuthorCard(f.args);assert.equal(stored.data.first_mes,AUTHOR_ENTRY_TEXT);assert.equal(stored.first_mes,AUTHOR_ENTRY_TEXT);assert.deepEqual(stored.data.alternate_greetings,[first,'备用甲','备用乙']);
    assert.equal(field.value,editing?'还没保存的手动修改':AUTHOR_ENTRY_TEXT);assert.deepEqual(stored.data.extensions,f.card.data.extensions);
  }
});
