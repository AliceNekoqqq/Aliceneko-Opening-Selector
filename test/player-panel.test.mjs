import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createPlayerPanelSession} from '../src/player-panel-session.js';
import {createPlayerSettingsLayout} from '../src/player-settings-layout.js';
import {createPlayerDraftGuard} from '../src/player-draft-guard.js';

function element(tag,cls='',text='') {
  const listeners=new Map();
  return {tag,className:cls,textContent:text,attrs:{},children:[],open:false,removed:0,closes:0,
    setAttribute(key,value){this.attrs[key]=value},append(...nodes){this.children.push(...nodes)},
    replaceChildren(...nodes){this.children=[...nodes]},
    addEventListener(type,fn){if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(fn)},
    removeEventListener(type,fn){listeners.get(type)?.delete(fn)},
    dispatch(type,event={}){for(const fn of [...listeners.get(type)||[]])fn(event)},
    handler(type){return [...listeners.get(type)||[]][0]},listenerCount(){return [...listeners.values()].reduce((sum,set)=>sum+set.size,0)},
    showModal(){this.open=true},close(){this.open=false;this.closes++;this.dispatch('close')},
    remove(){this.removed++},focus(){this.focused=true}};
}

test('settings layout preserves every group, disclosure controls and accessibility labels',()=>{
  const layout=createPlayerSettingsLayout(element);
  const sheets=Object.fromEntries(['exclusion','people','edits','labels','updates'].map(key=>[key,element('details')]));
  sheets.floatingStyle=element('label','uos-user-floating-style');
  sheets.brandVisibility=element('div','uos-user-brand-visibility');
  layout.assemble(sheets);
  assert.equal(layout.settings.hidden,true);assert.equal(layout.button.attrs['aria-controls'],layout.settings.id);
  layout.button.onclick();assert.equal(layout.settings.hidden,false);assert.equal(layout.button.attrs['aria-expanded'],'true');
  const [,common,appearance,advanced,system]=layout.settings.children;
  assert.deepEqual(common.children.slice(1),[sheets.edits,sheets.labels]);
  assert.deepEqual(appearance.children.slice(1),[sheets.floatingStyle,sheets.brandVisibility]);
  assert.deepEqual(advanced.children.slice(1),[sheets.exclusion,sheets.people]);assert.deepEqual(system.children.slice(1),[sheets.updates]);
  sheets.people.open=true;sheets.edits.open=true;sheets.people.dispatch('toggle');
  assert.equal(sheets.people.open,true);assert.equal(sheets.edits.open,false);
  layout.assemble(sheets);assert.equal(sheets.people.listenerCount(),1,'assembling again does not accumulate listeners');
  layout.close();layout.close();assert.equal(layout.button.onclick,null);for(const sheet of Object.values(sheets))assert.equal(sheet.listenerCount(),0);
});

test('cancel and outside clicks respect unsaved decisions before closing the dialog',async()=>{
  const dialog=element('dialog'),button=element('button');let allow=false,confirmations=0,stops=0;
  const session=createPlayerPanelSession(dialog);session.own(()=>stops++);
  session.setGuard({confirm:async()=>{confirmations++;return allow},close:()=>{}});session.show(button);
  assert.equal(button.focused,true);
  let prevented=false;dialog.dispatch('cancel',{preventDefault(){prevented=true}});await new Promise(resolve=>setImmediate(resolve));
  assert.equal(prevented,true);assert.equal(session.disposed,false);assert.equal(stops,0);
  dialog.dispatch('click',{target:button});assert.equal(confirmations,1,'inside click does not close');
  allow=true;dialog.dispatch('click',{target:dialog});await new Promise(resolve=>setImmediate(resolve));
  assert.equal(session.disposed,true);assert.equal(stops,1);assert.equal(dialog.removed,1);assert.equal(dialog.listenerCount(),0);
});

test('native close and force close dispose all owned resources exactly once',()=>{
  const dialog=element('dialog');let disposed=0,background=0,updates=0,guard=0;
  const session=createPlayerPanelSession(dialog,{onDispose:()=>disposed++});
  session.own(()=>background++);session.own(()=>updates++);session.setGuard({confirm:async()=>true,close:()=>guard++});session.show();
  dialog.close();session.close();dialog.dispatch('close');
  assert.deepEqual([disposed,background,updates,guard],[1,1,1,1]);assert.equal(dialog.removed,1);
});

test('a delayed old close event cannot stop the replacement panel resources',()=>{
  let current=null,oldStops=0,newStops=0;
  const firstDialog=element('dialog'),first=createPlayerPanelSession(firstDialog,{onDispose:session=>{if(current===session)current=null}});
  current=first;first.own(()=>oldStops++);first.show();const queuedOldClose=firstDialog.handler('close');first.close();
  const next=createPlayerPanelSession(element('dialog'),{onDispose:session=>{if(current===session)current=null}});
  current=next;next.own(()=>newStops++);next.show();queuedOldClose();
  assert.equal(current,next);assert.equal(oldStops,1);assert.equal(newStops,0);assert.equal(next.disposed,false);next.close();
});

test('force close aborts pending prompts without waiting for user input',async()=>{
  const dialog=element('dialog');let aborted=false;
  const session=createPlayerPanelSession(dialog);
  const guard=createPlayerDraftGuard({getGroups:()=>['people'],prompt:(_groups,_canSave,signal)=>new Promise(resolve=>{
    signal.addEventListener('abort',()=>{aborted=true;resolve('stay')},{once:true});
  }),restore:()=>assert.fail('must not discard'),saveCard:()=>true,saveLocal:()=>true,status:()=>{}});
  session.setGuard(guard);session.show();const closing=session.requestClose();session.close();
  assert.equal(await closing,false);assert.equal(aborted,true);assert.equal(session.disposed,true);
});

test('failed modal opening cleans resources, and one cleanup error cannot skip other resources',()=>{
  const dialog=element('dialog'),errors=[];let stopped=0;
  dialog.showModal=()=>{throw Error('modal unavailable')};
  const session=createPlayerPanelSession(dialog,{onError:error=>errors.push(error.message)});
  session.own(()=>stopped++);session.own(()=>{throw Error('cleanup failed')});
  assert.throws(()=>session.show(),/modal unavailable/);
  assert.equal(stopped,1);assert.deepEqual(errors,['cleanup failed']);assert.equal(session.disposed,true);assert.equal(dialog.listenerCount(),0);
});

test('update preparation uses the guard without closing or discarding the panel',async()=>{
  const dialog=element('dialog');let called=0;
  const session=createPlayerPanelSession(dialog);session.setGuard({confirm:async()=>{called++;return true},close:()=>{}});session.show();
  assert.equal(await session.prepareForUpdate(),true);assert.equal(called,1);assert.equal(session.disposed,false);assert.equal(dialog.open,true);
  session.close();assert.equal(await session.prepareForUpdate(),true);assert.equal(called,1);
});
