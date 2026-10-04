import {test} from 'node:test';
import assert from 'node:assert/strict';
import {blindBoxPool,drawOpening} from '../src/opening-blind-draw.js';
import {createOpeningBlindBox,openingBlindBoxButton,updateBlindBoxButton} from '../src/opening-blind-box.js';

const items=()=>[{id:2,number:3,coverIndex:2,title:'雨夜',description:'<img onerror=alert(1)>',body:'第二条完整原文',coverSlot:4,coverFocus:{x:20,y:70}},{id:7,number:8,title:'重逢',body:'第七条完整原文'},{id:9,number:10,title:'当前',body:'当前正文',isCurrent:true}];
function fixture({reduced=false,onChoose}={}){
  const doc={activeElement:null},timers=new Map();let timerId=0,alive=true,pool=items();const effects=[];
  function el(tag,cls='',text){
    const listeners=new Map();
    const node={tag,ownerDocument:doc,className:cls,textContent:text,children:[],dataset:{},attrs:{},isConnected:true,open:false,style:{setProperty(key,value){this[key]=value}},classList:{add(){}},
      setAttribute(key,value){this.attrs[key]=value},append(...nodes){for(const child of nodes){child.parent=this;this.children.push(child)}},replaceChildren(...nodes){this.children=[];this.append(...nodes)},
      addEventListener(key,fn){if(!listeners.has(key))listeners.set(key,new Set());listeners.get(key).add(fn)},removeEventListener(key,fn){listeners.get(key)?.delete(fn)},dispatch(key,event={}){for(const fn of [...listeners.get(key)||[]])fn(event)},
      showModal(){this.open=true},close(){this.open=false;this.dispatch('close')},remove(){this.isConnected=false;if(this.parent)this.parent.children=this.parent.children.filter(child=>child!==this)},focus(){doc.activeElement=this}};
    return node;
  }
  doc.createElement=el;doc.head=el('head');doc.body=el('body');doc.documentElement=el('html');doc.defaultView={getComputedStyle:()=>({getPropertyValue:key=>key})};
  const host={setTimeout(fn,ms){timers.set(++timerId,{fn,ms});return timerId},clearTimeout:id=>timers.delete(id),matchMedia:()=>({matches:reduced})};
  const palette=el('div');palette.dataset.theme='theatre';const trigger=el('button');
  const box=createOpeningBlindBox({doc,host,getItems:()=>pool,getPalette:()=>palette,isActive:()=>alive,random:()=>0,
    onPreview:(item,button)=>effects.push({action:'preview',id:item.id,button,windows:doc.body.children.length}),onChoose:item=>{effects.push({action:'choose',id:item.id,windows:doc.body.children.length});return onChoose?.(item)},onUnavailable:()=>effects.push({action:'unavailable'}),onError:error=>effects.push({action:'error',message:error.message})});
  function run(ms){for(const [id,timer] of [...timers])if(timer.ms<=ms){timers.delete(id);timer.fn()}}
  const all=(node,predicate)=>[...(predicate(node)?[node]:[]),...node.children.flatMap(child=>all(child,predicate))];
  return {doc,box,trigger,timers,effects,el,run,get dialog(){return doc.body.children[0]},find:cls=>all(doc.body,node=>node.className===cls)[0],button:text=>all(doc.body,node=>node.tag==='button'&&node.textContent===text)[0],setItems:value=>pool=value,deactivate:()=>alive=false};
}

test('draw pool respects caller filters, original IDs, duplicate IDs, empty bodies and current opening',()=>{
  const original=items(),copy=structuredClone(original);assert.deepEqual(blindBoxPool([original[1],original[2],{id:12,body:''},original[1]]).map(item=>item.id),[7]);
  assert.equal(drawOpening([],null),null);const pool=blindBoxPool(original);assert.equal(drawOpening(pool,null,()=>0).id,2);assert.equal(drawOpening(pool,null,()=>1).id,7);
  assert.equal(drawOpening(pool,2,()=>0).id,7);assert.equal(drawOpening(pool,7,()=>1).id,2);assert.equal(drawOpening([original[1]],7,()=>NaN).id,7);assert.deepEqual(original,copy);
});
test('animated draw conceals content, locks, then reveals without starting any transaction',()=>{
  const f=fixture();f.box.open(f.trigger);assert.equal(f.dialog.dataset.phase,'shuffle');assert.equal(f.find('uos-blind-result').hidden,true);assert.equal(f.find('uos-blind-title'),undefined);assert.equal(f.button('进入此开场').disabled,true);
  f.button('进入此开场').onclick();f.button('预览正文').onclick();assert.deepEqual(f.effects,[]);assert.equal(f.timers.size,2);
  f.run(1500);assert.equal(f.dialog.dataset.phase,'locking');f.run(2200);assert.equal(f.dialog.dataset.phase,'revealed');assert.equal(f.find('uos-blind-title').textContent,'雨夜');assert.equal(f.find('uos-blind-description').textContent,'<img onerror=alert(1)>');assert.equal(f.timers.size,0);assert.deepEqual(f.effects,[]);
  assert.equal(f.dialog.dataset.theme,'theatre');assert.equal(f.find('uos-blind-cover').style.backgroundImage,'var(--uos-default-cover-4)');assert.equal(f.find('uos-blind-cover').style.backgroundPosition,'20% 70%');f.box.dispose();
});
test('rerolls cannot stack timers and avoid the immediately previous original ID',()=>{
  const f=fixture();f.box.open();f.button('再抽一次').onclick();assert.equal(f.timers.size,2);f.run(2200);assert.equal(f.find('uos-blind-title').textContent,'雨夜');
  const reroll=f.button('再抽一次');reroll.focus();reroll.onclick();assert.equal(f.find('uos-blind-result').hidden,true);reroll.onclick();assert.equal(f.timers.size,2);f.run(2200);assert.equal(f.find('uos-blind-title').textContent,'重逢');assert.equal(f.doc.activeElement,f.button('预览正文'));assert.deepEqual(f.effects,[]);f.box.dispose();
});
test('preview and explicit entry close first and call only their respective existing transaction',()=>{
  const f=fixture({reduced:true});f.box.open(f.trigger);f.button('预览正文').onclick();assert.deepEqual(f.effects,[{action:'preview',id:2,button:f.trigger,windows:0}]);assert.equal(f.doc.activeElement,f.trigger);
  f.box.open(f.trigger);f.button('进入此开场').onclick();assert.deepEqual(f.effects[1],{action:'choose',id:7,windows:0});assert.equal(f.doc.body.children.length,0);f.box.dispose();
});
test('close and disposal cancel animations, remove owned styles and guard retained old handlers',()=>{
  const f=fixture();f.box.open(f.trigger);const oldDialog=f.dialog,oldExit=f.button('关闭盲盒'),oldChoose=f.button('进入此开场'),late=[...f.timers.values()].map(timer=>timer.fn);f.box.close();assert.equal(f.timers.size,0);assert.equal(f.doc.activeElement,f.trigger);
  f.box.open(f.trigger);oldExit.onclick();oldChoose.onclick();oldDialog.dispatch('cancel',{preventDefault(){}});for(const fn of late)fn();assert.equal(f.doc.body.children.length,1);assert.equal(f.dialog.dataset.phase,'shuffle');
  f.box.dispose();f.box.dispose();assert.equal(f.doc.head.children.length,0);assert.equal(f.doc.body.children.length,0);assert.equal(f.timers.size,0);assert.equal(f.box.open(f.trigger),false);assert.deepEqual(f.effects,[]);
});
test('character change aborts a pending reveal and an already revealed entry',()=>{
  const f=fixture();f.box.open();f.deactivate();f.run(1500);assert.equal(f.doc.body.children.length,0);assert.equal(f.timers.size,0);assert.deepEqual(f.effects,[{action:'unavailable'}]);f.box.dispose();
  const ready=fixture({reduced:true});ready.box.open();ready.deactivate();ready.button('进入此开场').onclick();assert.deepEqual(ready.effects,[{action:'unavailable'}]);assert.equal(ready.doc.body.children.length,0);ready.box.dispose();
});
test('single candidate and reduced motion have honest counts, disabled reroll and no unnecessary timers',()=>{
  const f=fixture({reduced:true});f.setItems([items()[1]]);assert.equal(f.box.open(),true);assert.equal(f.dialog.dataset.phase,'revealed');assert.equal(f.timers.size,0);assert.equal(f.button('再抽一次').disabled,true);assert.equal(f.find('uos-blind-scope').textContent,'当前筛选 · 1 个候选开场');f.box.dispose();
  const empty=fixture();empty.setItems([items()[2]]);assert.equal(empty.box.open(),false);assert.equal(empty.doc.body.children.length,0);const trigger=openingBlindBoxButton(empty.el);updateBlindBoxButton(trigger,items(),{readonly:true});assert.equal(trigger.disabled,true);assert.equal(trigger.textContent,'✦ 命运盲盒 · 2');updateBlindBoxButton(trigger,[]);assert.equal(trigger.disabled,true);empty.box.dispose();
});
test('Escape, native close and busy / revealed keyboard traps clean up and remain reachable',()=>{
  const f=fixture();f.box.open(f.trigger);const exit=f.button('关闭盲盒');let prevented=0;f.dialog.dispatch('keydown',{key:'Tab',preventDefault(){prevented++}});assert.equal(f.doc.activeElement,exit);assert.equal(prevented,1);
  f.run(2200);f.button('进入此开场').focus();f.dialog.dispatch('keydown',{key:'Tab',preventDefault(){prevented++}});assert.equal(f.doc.activeElement,exit);
  f.dialog.dispatch('keydown',{key:'Escape',preventDefault(){},stopPropagation(){}});assert.equal(f.doc.body.children.length,0);f.box.open(f.trigger);f.dialog.close();assert.equal(f.timers.size,0);assert.equal(f.doc.activeElement,f.trigger);f.box.dispose();
});
test('pending entry blocks a second draw, and a failed transaction releases that guard',async()=>{
  let reject;const pending=new Promise((_,no)=>reject=no),f=fixture({reduced:true,onChoose:()=>pending});f.box.open();const choose=f.button('进入此开场');choose.onclick();choose.onclick();assert.equal(f.effects.filter(effect=>effect.action==='choose').length,1);assert.equal(f.box.open(),false);
  reject(Error('save failed'));await new Promise(resolve=>setImmediate(resolve));assert.deepEqual(f.effects.at(-1),{action:'error',message:'save failed'});assert.equal(f.box.open(),true);f.box.dispose();
});
