import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createPlayerButtonDrag} from '../src/player-button-drag.js';

function fixture({saved=null,captureFails=false}={}) {
  function target() {
    const listeners=new Map();
    return {addEventListener(type,fn){if(!listeners.has(type))listeners.set(type,new Set());listeners.get(type).add(fn)},
      removeEventListener(type,fn){listeners.get(type)?.delete(fn)},
      send(type,values={}){const event={type,pointerId:1,button:0,isPrimary:true,clientX:50,clientY:80,preventDefault(){this.prevented=true},stopPropagation(){this.stopped=true},...values};for(const fn of [...listeners.get(type)||[]])fn(event);return event},
      count(){return [...listeners.values()].reduce((sum,fns)=>sum+fns.size,0)}};
  }
  const frames=new Map(),storage=new Map(saved==null?[]:[['uos_player_button_position',saved]]);
  let next=0,captured=null;
  const host=Object.assign(target(),{innerWidth:400,innerHeight:700,visualViewport:Object.assign(target(),{offsetLeft:0,offsetTop:0,width:400,height:700}),
    localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value)},
    requestAnimationFrame:fn=>{frames.set(++next,fn);return next},cancelAnimationFrame:id=>frames.delete(id)});
  const doc=Object.assign(target(),{defaultView:host,body:{append(node){node.parentNode=this}}}),chat={scrollTop:0};
  const button=Object.assign(target(),{ownerDocument:doc,parentNode:chat,style:{},dataset:{},
    getBoundingClientRect(){return {left:this.parentNode===doc.body?parseFloat(this.style.left)||0:30,top:this.parentNode===doc.body?parseFloat(this.style.top)||0:60-chat.scrollTop,width:120,height:40}},
    setPointerCapture(id){assert.equal(this.parentNode,doc.body,'capture follows the DOM move');if(captureFails)throw Error('capture unsupported');captured=id},
    hasPointerCapture:id=>captured===id,releasePointerCapture(id){if(captured===id)captured=null}});
  const drag=createPlayerButtonDrag(button);
  return {host,doc,chat,button,drag,frames,storage,flush(){for(const [id,fn] of [...frames]){frames.delete(id);fn()}},position(){return [parseFloat(button.style.left),parseFloat(button.style.top)]}};
}

test('a tap preserves the inline entry, while a drag floats outside chat and stays at release coordinates',()=>{
  const f=fixture();f.button.send('pointerdown');f.doc.send('pointermove',{clientX:53,clientY:83});f.doc.send('pointerup',{clientX:53,clientY:83});
  assert.equal(f.button.parentNode,f.chat);assert.equal(f.drag.suppressClick(f.button.send('click',{detail:1})),false);
  f.button.send('pointerdown');f.doc.send('pointermove',{clientX:130,clientY:180});f.flush();assert.deepEqual(f.position(),[110,160]);assert.equal(f.button.parentNode,f.doc.body);
  f.chat.scrollTop=300;assert.deepEqual(f.position(),[110,160]);
  f.doc.send('pointerup',{clientX:150,clientY:200});assert.deepEqual(f.position(),[130,180]);assert.equal(f.frames.size,0);
  assert.deepEqual(JSON.parse(f.storage.get('uos_player_button_position')),{x:130/400,y:180/700});
  const click=f.button.send('click',{detail:1});assert.equal(f.drag.suppressClick(click),true);assert.equal(click.prevented,true);
  f.button.send('pointerdown',{clientX:150,clientY:200});f.doc.send('pointerup',{clientX:150,clientY:200});assert.equal(f.drag.suppressClick(f.button.send('click',{detail:1})),false,'next intentional tap opens immediately');f.drag.dispose();
});

test('repeated drags start at the last visible position and ignore secondary pointers',()=>{
  const f=fixture();f.button.send('pointerdown');f.doc.send('pointermove',{clientX:130,clientY:180});f.doc.send('pointerup',{clientX:130,clientY:180});
  f.button.send('pointerdown',{clientX:135,clientY:185});f.button.send('pointerdown',{pointerId:2,isPrimary:false,clientX:0,clientY:0});f.doc.send('pointerup',{pointerId:2});
  f.doc.send('pointermove',{clientX:155,clientY:215});f.flush();assert.deepEqual(f.position(),[130,190]);f.doc.send('pointerup',{clientX:155,clientY:215});assert.deepEqual(f.position(),[130,190]);f.drag.dispose();
});

test('cancel and lost capture finish the drag; a capture exception still allows document events',()=>{
  for(const type of ['pointercancel','lostpointercapture']) {
    const f=fixture({captureFails:true});f.button.send('pointerdown');f.doc.send('pointermove',{clientX:130,clientY:180});
    (type==='pointercancel'?f.doc:f.button).send(type);assert.deepEqual(f.position(),[110,160]);assert.equal(f.frames.size,0);
    f.doc.send('pointermove',{clientX:250,clientY:300});f.flush();assert.deepEqual(f.position(),[110,160]);
    assert.equal(f.drag.suppressClick(f.button.send('click',{detail:0})),false,'keyboard activation is preserved');f.drag.dispose();
  }
});

test('saved coordinates stay compatible and clamp to the visible viewport after rotation or keyboard changes',()=>{
  const f=fixture({saved:JSON.stringify({x:.9,y:.95})});f.drag.restore();assert.equal(f.button.parentNode,f.doc.body);assert.deepEqual(f.position(),[272,652]);
  Object.assign(f.host.visualViewport,{offsetLeft:10,offsetTop:100,width:250,height:300});f.host.visualViewport.send('resize');assert.deepEqual(f.position(),[132,352]);f.drag.dispose();
  const invalid=fixture({saved:'{"x":null,"y":0}'});invalid.drag.restore();assert.equal(invalid.button.parentNode,invalid.chat);invalid.drag.dispose();
});

test('removing the entry cancels queued frames and releases all listeners without stale moves',()=>{
  const f=fixture();f.button.send('pointerdown');f.doc.send('pointermove',{clientX:130,clientY:180});assert.equal(f.frames.size,1);
  f.drag.dispose();f.drag.dispose();assert.equal(f.frames.size,0);for(const t of [f.button,f.doc,f.host,f.host.visualViewport])assert.equal(t.count(),0);
  const before=f.position();f.flush();f.doc.send('pointerup',{clientX:350,clientY:600});assert.deepEqual(f.position(),before);assert.equal(f.storage.size,0);assert.equal(f.button.hasPointerCapture(1),false);
});
