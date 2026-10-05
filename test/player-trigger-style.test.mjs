import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createPlayerTriggerStylePreference} from '../src/player-trigger-style.js';

const storageKey='uos_player_floating_style_v1';

test('floating style defaults to mascot and restores a saved simple preference',()=>{
  const empty=createPlayerTriggerStylePreference({localStorage:{getItem:()=>null}});
  assert.equal(empty.get(),'mascot');
  const saved=createPlayerTriggerStylePreference({localStorage:{getItem:key=>key===storageKey?'simple':null}});
  assert.equal(saved.get(),'simple');
});

test('floating style changes immediately and persists only supported values',()=>{
  const values=new Map(),preference=createPlayerTriggerStylePreference({localStorage:{getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)}});
  assert.deepEqual(preference.set('simple'),{value:'simple',saved:true});
  assert.equal(values.get(storageKey),'simple');
  assert.deepEqual(preference.set('unknown'),{value:'mascot',saved:true});
  assert.equal(values.get(storageKey),'mascot');
});

test('storage denial keeps the selected style active for the current run',()=>{
  const preference=createPlayerTriggerStylePreference({get localStorage(){throw Error('blocked')}});
  assert.equal(preference.get(),'mascot');
  assert.deepEqual(preference.set('simple'),{value:'simple',saved:false});
  assert.equal(preference.get(),'simple');
});
