import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createOpeningOrderEditor} from '../src/opening-order-editor.js';
class Element{
  constructor(tag,cls='',text=''){this.tag=tag;this.children=[];this.className=cls;this.textContent=text;this.attributes={};this.classList={add(){},remove(){}}}
  append(...nodes){for(const n of nodes){n.remove();n.parent=this;this.children.push(n)}}
  remove(){if(this.parent){const i=this.parent.children.indexOf(this);this.parent.children.splice(i,1);this.parent=null}}
  insertBefore(node,target){node.remove();const i=this.children.indexOf(target);node.parent=this;this.children.splice(i<0?this.children.length:i,0,node)}
  setAttribute(k,v){this.attributes[k]=v}focus(){this.focused=true}closest(){return null}
  setPointerCapture(id){this.captured=id}releasePointerCapture(){this.captured=null}
  getBoundingClientRect(){const i=this.parent.children.indexOf(this);return {top:i*60,bottom:(i+1)*60}}
}
function fixture(count=3){
  let order=Array.from({length:count},(_,i)=>i),changes=0,disabled=false;const frames=new Set();
  const editor=createOpeningOrderEditor({el:(...args)=>new Element(...args),doc:{defaultView:{requestAnimationFrame:fn=>{frames.add(fn);return fn},cancelAnimationFrame:fn=>frames.delete(fn)}},getOrder:()=>order,getItems:()=>Array.from({length:count},(_,i)=>({title:'开场'+i})),isDisabled:()=>disabled,onChange:value=>{order=value;changes++}});
  const list=editor.element.children[2],original=list.children.slice();
  return {editor,list,original,get order(){return order},get changes(){return changes},get frames(){return frames.size},set disabled(value){disabled=value}};
}
const event=(y=0,id=1)=>({button:0,isPrimary:true,pointerId:id,clientY:y,preventDefault(){},stopPropagation(){}});
test('pointer dragging changes draft only, retains capture and DOM order, cancellation restores start order',()=>{
  const f=fixture(),handle=f.original[0].children[0];handle.onpointerdown(event(30));handle.onpointermove(event(175));
  assert.deepEqual(f.order,[1,2,0]);assert.deepEqual(f.list.children,[f.original[1],f.original[2],f.original[0]]);assert.equal(handle.captured,1);
  handle.onpointerup(event(175));assert.equal(f.frames,0);
  const last=f.original[0].children[0];last.onpointerdown(event(150));last.onpointermove(event(0));assert.deepEqual(f.order,[0,1,2]);last.onpointercancel(event());assert.deepEqual(f.order,[1,2,0]);
  f.editor.dispose();assert.equal(f.frames,0);
});
test('arrows, keyboard, restore and disabled/small lists behave consistently',()=>{
  const f=fixture(),handle=f.original[2].children[0];handle.onkeydown({key:'ArrowUp',preventDefault(){}});assert.deepEqual(f.order,[0,2,1]);
  f.original[2].children[3].children[0].onclick();assert.deepEqual(f.order,[2,0,1]);
  f.editor.element.children[4].onclick();assert.deepEqual(f.order,[0,1,2]);
  f.disabled=true;handle.onpointerdown(event(150));handle.onkeydown({key:'ArrowUp',preventDefault(){}});assert.deepEqual(f.order,[0,1,2]);
  for(const n of [0,1]){const small=fixture(n);assert.equal(small.editor.element.children[4].disabled,true);if(n)assert.equal(small.original[0].children[0].disabled,true);small.editor.dispose()}
  f.editor.dispose();
});
