import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createAuthorPopupSession} from '../src/author-popup-session.js';
function events(){
  const listeners=new Map();
  return {
    addEventListener(type,fn){if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(fn)},
    removeEventListener(type,fn){listeners.get(type)?.delete(fn)},
    dispatch(type,event={}){for(const fn of [...listeners.get(type)||[]])fn(event)},
    count(){return [...listeners.values()].reduce((n,set)=>n+set.size,0)},
  };
}
function fixture({dirty=false,prompt=async()=> 'stay',save=async()=>true,canClose=()=>true}={}){
  let mutation,disconnected=0,cancelled=0,capture=null;
  const viewport={...events(),innerWidth:800,innerHeight:600,MutationObserver:class{
    constructor(fn){mutation=fn}observe(){}disconnect(){disconnected++}
  }};
  const doc={...events(),querySelector:()=>null};
  const drag={...events(),setPointerCapture:id=>{capture=id},hasPointerCapture:id=>capture===id,releasePointerCapture:()=>{capture=null}};
  const position={};
  const frame={contentDocument:doc,ownerDocument:{defaultView:viewport,body:{}},isConnected:true,
    offsetWidth:300,offsetHeight:200,offsetLeft:30,offsetTop:40,style:{setProperty:(key,value)=>{position[key]=value}}};
  const cleaned=[],errors=[];
  const session=createAuthorPopupSession({frame,sheet:{querySelector:()=>drag},isActive:()=>true,canClose,
    hasUnsaved:()=>dirty,prompt,save,cancelPrompt:()=>{cancelled++},
    onCleanup:value=>cleaned.push(value),onError:error=>errors.push(error)});
  return {session,frame,viewport,doc,drag,position,cleaned,errors,mutate:()=>mutation(),
    get cancelled(){return cancelled},get capture(){return capture},get disconnected(){return disconnected}};
}
test('drag, pointer cancellation and host resize clamp the popup; disposal removes all listeners once',()=>{
  const f=fixture();let prevented=0;
  f.drag.dispatch('pointerdown',{target:{closest:()=>false},screenX:0,screenY:0,pointerId:1,preventDefault(){prevented++}});
  f.drag.dispatch('pointermove',{screenX:900,screenY:-100});assert.deepEqual(f.position,{left:'500px',top:'0px'});
  assert.equal(f.capture,1);f.drag.dispatch('pointercancel');assert.equal(f.capture,null);assert.equal(f.drag.count(),1);
  f.viewport.dispatch('resize');assert.deepEqual(f.position,{left:'30px',top:'40px'});
  f.session.dispose();f.session.dispose();assert.deepEqual(f.cleaned,[true]);assert.equal(f.cancelled,1);
  assert.equal(f.drag.count()+f.viewport.count()+f.doc.count(),0);assert.equal(f.disconnected,1);assert.equal(prevented,1);
});
test('close decisions preserve stay and failed saves, and distinguish saved from discarded drafts',async()=>{
  for(const [choice,saved,expected] of [['stay',true,[]],['save',false,[]],['save',true,[false]],['discard',true,[true]]]){
    const f=fixture({dirty:true,prompt:async()=>choice,save:async()=>saved});
    assert.equal(await f.session.complete(),expected.length===1);assert.deepEqual(f.cleaned,expected);f.session.dispose();
  }
});
test('overlapping closes prompt only once; force disposal blocks late decisions and late saves',async()=>{
  for(const phase of ['prompt','save']){
    let finish,prompts=0;
    const pending=()=>new Promise(resolve=>{finish=resolve});
    const f=fixture({dirty:true,prompt:()=>{prompts++;return phase==='prompt'?pending():Promise.resolve('save')},save:pending});
    const closing=f.session.complete();await Promise.resolve();assert.equal(await f.session.complete(),false);
    f.session.dispose();finish(phase==='prompt'?'discard':true);assert.equal(await closing,false);
    assert.deepEqual(f.cleaned,[true]);assert.equal(prompts,1);
  }
});
test('external iframe removal disposes immediately; throwing saves retain the live window for retry',async()=>{
  const removed=fixture();removed.frame.isConnected=false;removed.mutate();assert.deepEqual(removed.cleaned,[true]);
  let fail=true;
  const f=fixture({dirty:true,prompt:async()=> 'save',save:async()=>{if(fail)throw Error('network');return true}});
  assert.equal(await f.session.complete(),false);assert.equal(f.errors[0].message,'network');assert.deepEqual(f.cleaned,[]);
  fail=false;assert.equal(await f.session.complete(),true);assert.deepEqual(f.cleaned,[false]);
});
test('an external save blocks close prompts and retries while busy, then allows normal close',async()=>{
  let busy=true,prompts=0;
  const f=fixture({dirty:true,canClose:()=>!busy,prompt:async()=>{prompts++;return 'discard'}});
  assert.equal(await f.session.complete(),false);f.doc.dispatch('keydown',{key:'Escape',preventDefault(){}});
  assert.equal(prompts,0);assert.deepEqual(f.cleaned,[]);
  busy=false;assert.equal(await f.session.complete(),true);assert.equal(prompts,1);assert.deepEqual(f.cleaned,[true]);
});
