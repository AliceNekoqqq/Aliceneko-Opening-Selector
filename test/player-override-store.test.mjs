import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createPlayerOverrideStore} from '../src/player-override-store.js';
function fixture(){
  const disk=new Map([['a','old'],['b','unrelated']]);let removeDenied=false,writeDenied=false;
  const store=createPlayerOverrideStore({localStorage:{getItem:key=>disk.get(key)||null,
    removeItem:key=>{if(removeDenied)throw Error('denied');disk.delete(key)},
    setItem:(key,value)=>{if(writeDenied)throw Error('quota');disk.set(key,value)}}});
  return {store,disk,deny:(remove,write)=>{removeDenied=remove;writeDenied=write}};
}
test('successful clearing affects only the selected override; denied removal falls back to empty storage',()=>{
  const f=fixture();assert.equal(f.store.clear('a'),true);assert.equal(f.store.read('a'),null);assert.equal(f.store.read('b'),'unrelated');
  f.disk.set('a','old');f.deny(true,false);assert.equal(f.store.clear('a'),true);
  assert.equal(f.disk.get('a'),'');assert.equal(f.store.hasPending('a'),false);
});
test('failed cleanup masks old values across reads and retries when storage recovers',()=>{
  const f=fixture();f.deny(true,true);assert.equal(f.store.clear('a'),false);assert.equal(f.disk.get('a'),'old');
  assert.equal(f.store.read('a'),null);assert.equal(f.store.hasPending('a'),true);assert.equal(f.store.read('b'),'unrelated');
  f.deny(false,false);assert.equal(f.store.read('a'),null);assert.equal(f.disk.has('a'),false);assert.equal(f.store.hasPending('a'),false);
});
test('new local saves replace pending cleanup only when the write succeeds',()=>{
  const f=fixture();f.deny(true,true);f.store.clear('a');
  assert.throws(()=>f.store.write('a','new'),/quota/);assert.equal(f.store.hasPending('a'),true);
  f.deny(true,false);f.store.write('a','new');assert.equal(f.store.hasPending('a'),false);assert.equal(f.store.read('a'),'new');
});
