import assert from 'node:assert/strict';
import {test} from 'node:test';
import {buildOpeningPrompt,openingNames,openingStamp,selectedWorldbookContext,generationResultText} from '../src/opening-generation.js';
import {createOpeningGenerationService,appendGeneratedOpening} from '../src/opening-generation-service.js';

test('prompt preserves independent starts, selected profiles, formats and refinement',()=>{
  assert.deepEqual(openingNames('林安、林安, Mira;乔乔'),['林安','Mira','乔乔']);
  const result={people:[{name:'林安',sources:['故事书 · 人物林安（姓名字段）']}],worldbooks:[{name:'故事书',entries:[{name:'人物林安',content:'林安的秘密资料',enabled:true},{name:'人物林安',content:'停用的秘密',enabled:false},{name:'人物他人',content:'他人的资料',enabled:true}]}]};
  const context=selectedWorldbookContext(result,['林安']);assert.match(context,/林安的秘密资料/);assert.doesNotMatch(context,/停用|他人的资料/);
  const prompt=buildOpeningPrompt({names:['林安'],seed:'secret',language:'English',format:'reference',reference:'<content>旧开场</content>',refinement:'减少旁白'}, {worldbookContext:context,previous:'旧草稿'});
  for(const text of ['林安','English','不是续写当前聊天','不要替 {{user}}','秘密','<content>旧开场</content>','旧草稿','减少旁白'])assert.ok(prompt.includes(text),text);
  assert.doesNotMatch(buildOpeningPrompt({useWorldbook:false},{worldbookContext:'不能传出的资料'}),/不能传出的资料/);
  assert.equal(generationResultText({content:'<think>内部思考</think>\n```html\n<content>正文</content>\n```',reasoning:'不使用'}),'<content>正文</content>');
  assert.throws(()=>generationResultText({reasoning:'只有思考'}),/未返回正文/);
  assert.throws(()=>generationResultText('<think>只有思考</think>'),/没有开场正文/);
});

test('current and raw generation use main API, exclude history, cancel only own request',async()=>{
  let resolveJob,config,cancelId;
  const helper={generate:cfg=>{config=cfg;return new Promise(resolve=>resolveJob=resolve)},stopGenerationById:id=>cancelId=id};
  const first=createOpeningGenerationService(()=>[helper]),other=createOpeningGenerationService(()=>[helper]);
  const request=first.generate({names:['林安'],preset:'current'},{});
  assert.equal(config.max_chat_history,0);assert.deepEqual(config.overrides.chat_history.prompts,[]);assert.equal(config.should_silence,true);assert.equal(config.custom_api,undefined);
  await assert.rejects(other.generate({},{}),/上一条生成/);
  first.cancel();assert.equal(cancelId,config.generation_id);resolveJob('被取消的结果');await assert.rejects(request,/已取消/);
  let raw;
  const service=createOpeningGenerationService(()=>[{generateRaw:async cfg=>{raw=cfg;return '新正文'}}]);
  assert.equal(await service.generate({preset:'raw'},{}),'新正文');assert.ok(raw.ordered_prompts.includes('world_info_before'));assert.ok(raw.ordered_prompts.includes('char_description'));assert.deepEqual(raw.overrides.chat_history.prompts,[]);
  first.close();await assert.rejects(first.generate({},{}),/已关闭/);other.close();service.close();
});

function fixture(mode='player',alternate=['原备用']){
  const card={avatar:'card.png',data:{name:'林安',first_mes:mode==='author'?'<UniversalOpeningSelector/>':'原主开场',alternate_greetings:alternate,extensions:{other:{keep:true},universal_opening_selector:{theme:'school',branding:{title:false},worldbookPresets:[{id:'p'}],entries:mode==='author'?[{title:'原备用',image:'cover'}]:[{title:'原主开场',image:'cover'},{title:'原备用'}]}}}};
  let server=structuredClone(card),swipes=[card.data.first_mes,...alternate],swipe=0,writes=0;
  const context={characters:[card],characterId:0,chatId:'chat-a',getRequestHeaders:()=>({'Content-Type':'application/json'})};
  const helper={getLastMessageId:()=>0,getChatMessages:()=>[{role:'assistant',swipe_id:swipe,swipes:swipes.slice()}],setChatMessages:async([message])=>{swipes=message.swipes;swipe=message.swipe_id}};
  const host={fetch:async(url,options)=>{
    if(url==='/api/characters/get')return {ok:true,json:async()=>structuredClone(server)};
    writes++;const update=JSON.parse(options.body).data;server.data.alternate_greetings=update.alternate_greetings;server.data.extensions={...server.data.extensions,...update.extensions};return {ok:true};
  }};
  const input={host,getContext:()=>context,helper,identity:{avatar:card.avatar,characterId:0,chatId:context.chatId},mode,expectedStamp:openingStamp(card),body:'新的开场正文',title:'秘密来信',names:'林安'};
  return {input,card,context,helper,server:()=>server,swipes:()=>swipes,writes:()=>writes};
}

test('append preserves all original greetings/settings, aligns each mode and syncs only unchanged chat',async()=>{
  for(const mode of ['player','author']){
    const f=fixture(mode),result=await appendGeneratedOpening(f.input),data=f.server().data;
    assert.deepEqual(data.alternate_greetings,['原备用','新的开场正文']);assert.equal(result.index,mode==='author'?1:2);assert.equal(result.chatSynced,true);assert.equal(f.swipes().at(-1),'新的开场正文');
    assert.deepEqual(data.extensions.other,{keep:true});assert.equal(result.settings.theme,'school');assert.equal(result.settings.branding.title,false);assert.equal(result.settings.entries[0].image,'cover');assert.equal(result.settings.entries[result.index].title,'秘密来信');assert.equal(result.settings.entries[result.index].names,'林安');
    assert.equal(f.card.data.first_mes,mode==='author'?'<UniversalOpeningSelector/>':'原主开场');
  }
  const empty=fixture('author',[]);assert.equal((await appendGeneratedOpening(empty.input)).index,0);
  const changedChat=fixture();changedChat.context.chatId='another-chat';assert.equal((await appendGeneratedOpening(changedChat.input)).chatSynced,false);assert.equal(changedChat.swipes().length,2);
});

test('changed card, server conflict, duplicate and failed verification preserve draft instead of overwriting',async()=>{
  const switched=fixture();switched.context.characterId=1;await assert.rejects(appendGeneratedOpening(switched.input),/角色已切换/);assert.equal(switched.writes(),0);
  const edited=fixture();edited.card.data.alternate_greetings.push('其他编辑');await assert.rejects(appendGeneratedOpening(edited.input),/已发生变化/);assert.equal(edited.writes(),0);
  const remote=fixture();remote.server().data.alternate_greetings.push('服务器新增');await assert.rejects(appendGeneratedOpening(remote.input),/服务器上的开场已变化/);assert.equal(remote.writes(),0);
  const duplicate=fixture();duplicate.input.body='原备用';await assert.rejects(appendGeneratedOpening(duplicate.input),/已有相同正文/);assert.equal(duplicate.writes(),0);
  const failed=fixture();failed.input.host.fetch=async url=>url.endsWith('/get')?{ok:true,json:async()=>structuredClone(failed.card)}:{ok:true};await assert.rejects(appendGeneratedOpening(failed.input),/复核结果不一致/);assert.deepEqual(failed.card.data.alternate_greetings,['原备用']);
});

test('replacing a card object during server read cannot bypass the opening conflict check',async()=>{
  const f=fixture(),fetch=f.input.host.fetch;
  f.input.host.fetch=async(url,options)=>{
    const response=await fetch(url,options);
    if(url.endsWith('/get')){const replacement=structuredClone(f.card);replacement.data.alternate_greetings.push('并发修改');f.context.characters[0]=replacement}
    return response;
  };
  await assert.rejects(appendGeneratedOpening(f.input),/角色或备用开场已变化/);
  assert.equal(f.writes(),0);assert.deepEqual(f.context.characters[0].data.alternate_greetings,['原备用','并发修改']);
});

test('a rejected asynchronous cancellation does not leak a rejection or accept the cancelled response',async()=>{
  let complete;
  const service=createOpeningGenerationService(()=>[{generate:()=>new Promise(resolve=>{complete=resolve}),stopGenerationById:async()=>{throw Error('取消接口失败')}}]);
  const pending=service.generate({},{});service.cancel();await new Promise(resolve=>setImmediate(resolve));complete('迟到正文');
  await assert.rejects(pending,/已取消/);service.close();
});
