import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createPlayerBrandVisibilityPreference} from '../src/player-brand-visibility.js';

function makeHost(initial={}){
  const values=new Map(Object.entries(initial));
  return {values,localStorage:{getItem(key){return values.get(key)??null},setItem(key,value){values.set(key,String(value))}}};
}

test('player visibility inherits card defaults then persists a per-character override',()=>{
  const host=makeHost(),defaults={mascot:false,title:true};
  const preference=createPlayerBrandVisibilityPreference(host,'alice.png',defaults);
  assert.deepEqual(preference.get(),defaults);
  const result=preference.set({mascot:true,title:false});
  assert.equal(result.saved,true);assert.deepEqual(result.value,{mascot:true,title:false});
  assert.deepEqual(createPlayerBrandVisibilityPreference(host,'alice.png',defaults).get(),{mascot:true,title:false});
  assert.deepEqual(createPlayerBrandVisibilityPreference(host,'bob.png',defaults).get(),defaults);
  assert.deepEqual(defaults,{mascot:false,title:true},'preferences do not mutate card config');
});

test('missing player settings default to visible and unavailable storage keeps the current choice',()=>{
  const host={localStorage:{getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}}};
  const preference=createPlayerBrandVisibilityPreference(host,'alice.png');
  assert.deepEqual(preference.get(),{mascot:true,title:true});
  const result=preference.set({mascot:false,title:true});
  assert.equal(result.saved,false);assert.deepEqual(result.value,{mascot:false,title:true});
  assert.deepEqual(preference.get(),{mascot:false,title:true});
});
