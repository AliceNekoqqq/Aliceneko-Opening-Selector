import assert from 'node:assert/strict';
import {test} from 'node:test';
import {savePlayerCardSettings} from '../src/player-card-settings.js';
import {openingStamp} from '../src/opening-generation.js';

const KEY='universal_opening_selector';
function fixture(){
  const card={avatar:'a.png',data:{first_mes:'开场',alternate_greetings:['备用'],extensions:{[KEY]:{theme:'old',entries:[{title:'旧标题',names:'旧人物',cover:'custom'},{}]}}}};
  let server=structuredClone(card),reads=0,writes=0,active=true,beforeRead=()=>{},afterMerge=()=>{};
  const sync=[];
  const context={characterId:0,characters:[card],getRequestHeaders:()=>({token:'test'}),writeExtensionField:async(...args)=>sync.push(args)};
  const host={fetch:async(url,options)=>{
    const payload=JSON.parse(options.body);
    if(url.endsWith('/get')){reads++;await beforeRead(reads);assert.equal(payload.avatar_url,'a.png');return {ok:true,json:async()=>structuredClone(server)}}
    assert.equal(payload.avatar,'a.png');writes++;
    server.data.extensions[KEY]=payload.data.extensions[KEY];await afterMerge();return {ok:true};
  }};
  return {card,context,sync,host,save:changes=>savePlayerCardSettings({host,getContext:()=>context,identity:{characterId:0,avatar:'a.png'},expectedStamp:openingStamp(card),isActive:()=>active,changes}),
    get server(){return server},get reads(){return reads},get writes(){return writes},
    setRead:fn=>{beforeRead=fn},setMerge:fn=>{afterMerge=fn},close:()=>{active=false}};
}
test('save uses latest server config, preserves unrelated metadata and verifies before local sync',async()=>{
  const f=fixture();f.server.data.extensions[KEY].theme='new';f.server.data.extensions[KEY].entries[0].cover='latest-cover';
  f.setMerge(()=>assert.equal(f.sync.length,0));
  const result=await f.save({edits:{0:{title:'新标题'}},personAliases:'林安=小林'});
  assert.equal(result.theme,'new');assert.equal(result.entries[0].cover,'latest-cover');assert.equal(result.entries[0].title,'新标题');
  assert.equal(Object.hasOwn(result.entries[0],'names'),false);assert.equal(result.excludedPersonTags,'');
  assert.equal(result.entries.length,2);assert.equal(f.reads,2);assert.equal(f.writes,1);assert.equal(f.sync.length,1);
});
test('server mismatch or retained deleted fields cannot report success or sync locally',async()=>{
  for(const corrupt of [config=>config.personAliases='wrong',config=>config.entries[0].names='旧人物']){
    const f=fixture();f.setMerge(()=>corrupt(f.server.data.extensions[KEY]));
    await assert.rejects(f.save({personAliases:'正确',edits:{0:{title:'新标题'}}}),/复核不一致/);
    assert.equal(f.sync.length,0);
  }
});
test('failed readback distinguishes a submitted write and leaves local settings untouched',async()=>{
  const f=fixture();f.setRead(n=>{if(n===2)throw Error('offline')});
  await assert.rejects(f.save({excludedTags:'时间'}),/写入请求已提交.*复核失败/);assert.equal(f.writes,1);assert.equal(f.sync.length,0);
});
test('opening changes on server prevent metadata being applied to different indices',async()=>{
  const f=fixture();f.server.data.alternate_greetings.unshift('新增');
  await assert.rejects(f.save({edits:{0:{title:'新标题'}}}),/开场列表已变化/);assert.equal(f.writes,0);
});
test('character replacement, local opening edits and disposal during initial read prevent writes',async()=>{
  for(const change of [f=>{f.context.characters[0]=structuredClone(f.card)},f=>{f.card.data.first_mes='变化'},f=>f.close()]){
    const f=fixture();f.setRead(n=>{if(n===1)change(f)});
    await assert.rejects(f.save({personAliases:'林安'}),/变化/);assert.equal(f.writes,0);assert.equal(f.sync.length,0);
  }
});
test('switching or disposing after remote merge prevents local writes to another character',async()=>{
  for(const change of [f=>{f.context.characterId=1},f=>f.close()]){
    const f=fixture();f.setMerge(()=>change(f));
    await assert.rejects(f.save({excludedTags:'地点'}),/原角色卡已保存/);assert.equal(f.writes,1);assert.equal(f.sync.length,0);
  }
});
test('HTTP write failure never performs readback or local sync',async()=>{
  const f=fixture(),fetch=f.host.fetch;
  f.host.fetch=(url,options)=>url.endsWith('/merge-attributes')?Promise.resolve({ok:false,status:500}):fetch(url,options);
  await assert.rejects(f.save({personAliases:'林安'}),/HTTP 500/);assert.equal(f.reads,1);assert.equal(f.sync.length,0);
});
