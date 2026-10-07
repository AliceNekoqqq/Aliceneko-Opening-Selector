import assert from 'node:assert/strict';
import {test} from 'node:test';
import {requestCharacterCard} from '../src/character-card-request.js';
function fixture(fetch){
  const timers=new Map();let signal;
  const host={setTimeout(fn,ms){assert.equal(ms,60000);timers.set(1,fn);return 1},clearTimeout:id=>timers.delete(id),
    fetch:(url,options)=>{signal=options.signal;return fetch(url,options)}};
  return {host,timers,expire:()=>timers.get(1)(),get signal(){return signal}};
}
test('normal, HTTP error and rejected requests clear their deadline timers',async()=>{
  for(const fetch of [async()=>({ok:true,json:async()=>({saved:true})}),async()=>({ok:false,status:500}),async()=>{throw Error('offline')}]){
    const f=fixture(fetch);
    await requestCharacterCard(f.host,'/api/characters/get',{}, {readJson:true}).catch(error=>assert.equal(error.message,'offline'));
    assert.equal(f.timers.size,0);assert.equal(f.signal.aborted,false);
  }
});
test('a hung write aborts waiting with an explicit possibly-submitted message and ignores late results',async()=>{
  let finish;const f=fixture(()=>new Promise(resolve=>{finish=resolve}));
  const pending=requestCharacterCard(f.host,'/api/characters/merge-attributes',{});
  f.expire();await assert.rejects(pending,error=>error.code==='CHARACTER_REQUEST_TIMEOUT'&&/可能已提交/.test(error.message));
  assert.equal(f.signal.aborted,true);assert.equal(f.timers.size,0);
  finish({ok:true});await Promise.resolve();
});
test('the deadline includes a hung JSON body and consumes late body rejection',async()=>{
  let fail;const f=fixture(async()=>({ok:true,json:()=>new Promise((_,reject)=>{fail=reject})}));
  const pending=requestCharacterCard(f.host,'/api/characters/get',{}, {readJson:true});await Promise.resolve();
  assert.ok(fail);f.expire();await assert.rejects(pending,/读取等待超时/);assert.equal(f.timers.size,0);
  fail(Error('late abort'));await Promise.resolve();
});
