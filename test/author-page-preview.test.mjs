import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createAuthorOpeningCard} from '../src/author-opening-card.js';
import {createAuthorPagePreview} from '../src/author-page-preview.js';

function fixture(){
  const timers=new Map(),events=new Map();let timerId=0,disconnected=0;
  const view={setTimeout(fn){timers.set(++timerId,fn);return timerId},clearTimeout(id){timers.delete(id)},
    addEventListener(key,fn){events.set(key,fn)},removeEventListener(key,fn){if(events.get(key)===fn)events.delete(key)},
    ResizeObserver:class{observe(){}disconnect(){disconnected++}}};
  function makeDocument(){
    const doc={defaultView:view};
    const matches=(node,selector)=>selector.startsWith('.')?node.className.split(' ').includes(selector.slice(1)):selector.startsWith('#')?node.id===selector.slice(1):selector.startsWith('[')?node.attrs[selector.slice(1,-1)]!==undefined:node.tag===selector;
    const all=(node,selector)=>[...((selector.split(',').some(part=>matches(node,part)))?[node]:[]),...node.children.flatMap(child=>all(child,selector))];
    function el(tag,cls='',text=''){
      const listeners=new Map();
      const node={tag,className:cls,textContent:text,children:[],attrs:{},dataset:{},isConnected:true,open:false,clientWidth:600,style:{setProperty(key,value){this[key]=value}},
        classList:{add(cls){node.className+=' '+cls}},setAttribute(key,value){this.attrs[key]=value},
        append(...nodes){for(const child of nodes){child.parent=this;this.children.push(child)}},replaceChildren(...nodes){for(const child of this.children)child.remove();this.children=[];this.append(...nodes)},
        before(child){const i=this.parent.children.indexOf(this);child.parent=this.parent;this.parent.children.splice(i,0,child)},after(child){const i=this.parent.children.indexOf(this);child.parent=this.parent;this.parent.children.splice(i+1,0,child)},
        remove(){this.isConnected=false;for(const child of this.children)child.isConnected=false;if(this.parent)this.parent.children=this.parent.children.filter(child=>child!==this)},
        querySelectorAll(selector){return this.children.flatMap(child=>all(child,selector))},querySelector(selector){return this.querySelectorAll(selector)[0]},
        addEventListener(key,fn){if(!listeners.has(key))listeners.set(key,new Set());listeners.get(key).add(fn)},removeEventListener(key,fn){listeners.get(key)?.delete(fn)},dispatch(key){for(const fn of [...listeners.get(key)||[]])fn()},listenerCount(key){return listeners.get(key)?.size||0}};
      node.ownerDocument=doc;if(tag==='iframe')node.contentDocument=makeDocument();return node;
    }
    doc.createElement=el;doc.body=el('body');doc.head=el('head');doc.querySelectorAll=selector=>doc.body.querySelectorAll(selector);doc.querySelector=selector=>doc.body.querySelector(selector);
    doc.open=()=>{};doc.close=()=>{};
    doc.write=()=>{
      const root=el('main','uos');root.setAttribute('data-uos','');doc.body.append(root);
      for(const [tag,key] of [['h1','title'],['p','subtitle'],['p','opening-count'],['div','grid']]){const n=el(tag);n.setAttribute('data-'+key,'');root.append(n)}
      const player=el('section');player.setAttribute('data-player','');for(const key of ['music-title','lyrics']){const n=el('div');n.setAttribute('data-'+key,'');player.append(n)}player.append(el('audio'));root.append(player);
      root.append(el('button','uos-icon'));const dialog=el('div','uos-dialog');root.append(dialog);const seed=el('script');seed.id='uos-seed';doc.body.append(seed);
    };
    return doc;
  }
  const doc=makeDocument(),watch=doc.createElement('section');doc.body.append(watch);
  const requests=[],service={cached:()=>null,load:theme=>new Promise(resolve=>requests.push({theme,resolve})),close(){throw Error('borrowed service must remain alive')}};
  return {doc,watch,service,requests,timers,events,get disconnected(){return disconnected},flush(){const queue=[...timers.values()];timers.clear();for(const fn of queue)fn()}};
}
const initial=()=>({title:'选择起点',subtitle:'草稿导语',theme:'theatre',layout:'gallery',music:{enabled:true,title:'夜曲',audio:'data:audio/mpeg;base64,AA==',lyrics:'[00:01]第一行'},items:[
 {id:0,title:'<img onerror=alert(1)>',description:'完整简介',names:['甲','乙','丙','丁'],group:'主线',tags:['雨夜'],body:'第一条原始正文',coverSlot:3,coverFocus:{x:20,y:75}},
 {id:1,title:'支线',names:[],group:'番外',tags:[],body:'第二条原始正文'},
 {id:2,title:'第三条',names:[],group:'主线',tags:[],body:'第三条原始正文'}]});

test('shared author cards preserve original selection IDs and a visual preview has no actions',()=>{
 const f=fixture(),el=(tag,cls,text)=>{const n=f.doc.createElement(tag);n.className=cls||'';n.textContent=text||'';return n},entry=initial().items[0];let chosen=0,read=0;
 const active=createAuthorOpeningCard({el,entry,index:7,body:entry.body,host:{},onChoose:id=>chosen=id,onPreview:id=>read=id});
 active.querySelector('.uos-card').dispatch('click');active.querySelector('.uos-card-preview-button').onclick();assert.equal(chosen,8);assert.equal(read,8);
 const baseline=JSON.stringify(entry),readonly=createAuthorOpeningCard({el,entry,index:7,body:entry.body,host:{}});
 assert.equal(readonly.querySelector('.uos-card').disabled,true);assert.equal(readonly.querySelector('.uos-card').listenerCount('click'),0);assert.equal(readonly.querySelector('.uos-card-preview-button').disabled,true);
 assert.equal(readonly.querySelector('strong').textContent,entry.title);assert.equal(readonly.querySelector('.uos-cover').style.backgroundPosition,'20% 75%');assert.equal(JSON.stringify(entry),baseline);
});

test('opening a preview reads the latest draft, retains grouped IDs and renders no executable media',()=>{
 const f=fixture();let model=initial(),reads=0;const baseline=JSON.stringify(model);
 const preview=createAuthorPagePreview({doc:f.doc,watch:f.watch,host:{},backgroundService:f.service,readModel:()=>{reads++;return model}});f.watch.append(preview.element);
 preview.refresh();f.flush();assert.equal(reads,0);assert.equal(preview.element.querySelector('iframe'),undefined);
 preview.element.open=true;preview.element.dispatch('toggle');f.flush();const frame=preview.element.querySelector('iframe'),root=frame.contentDocument.querySelector('[data-uos]');
 assert.equal(reads,1);assert.equal(frame.attrs.sandbox,'allow-same-origin');assert.equal(root.inert,true);assert.equal(root.dataset.theme,'theatre');assert.equal(root.dataset.layout,'gallery');
 assert.deepEqual(root.querySelectorAll('.uos-number').map(n=>n.textContent),['01','03','02']);assert.equal(root.querySelector('[data-grid]').querySelector('strong').textContent,model.items[0].title);
 assert.ok(root.querySelectorAll('button,input,select').every(n=>n.disabled));assert.equal(frame.contentDocument.querySelector('audio'),undefined);assert.equal(frame.contentDocument.querySelector('.uos-dialog'),undefined);assert.equal(root.querySelector('[data-music-title]').textContent,'夜曲');assert.equal(JSON.stringify(model),baseline);
 preview.dispose();
});

test('rapid edits coalesce without reloading the iframe, and width controls do not modify the draft',()=>{
 const f=fixture();let model=initial(),reads=0;const preview=createAuthorPagePreview({doc:f.doc,watch:f.watch,host:{},backgroundService:f.service,readModel:()=>{reads++;return model}});f.watch.append(preview.element);preview.element.open=true;preview.refresh();f.flush();const frame=preview.element.querySelector('iframe');
 model.title='实时标题';f.watch.dispatch('input');model.layout='catalog';f.watch.dispatch('change');model.items[0].coverFocus.x=80;preview.refresh();assert.equal(f.timers.size,1);f.flush();assert.equal(reads,2);assert.equal(preview.element.querySelector('iframe'),frame);assert.equal(frame.contentDocument.querySelector('[data-title]').textContent,'实时标题');assert.equal(frame.contentDocument.querySelector('.uos-cover').style.backgroundPosition,'80% 75%');
 const baseline=JSON.stringify(model),buttons=preview.element.querySelectorAll('.uos-icon');buttons[1].onclick();assert.equal(frame.style.width,'900px');assert.equal(buttons[1].attrs['aria-pressed'],'true');buttons[0].onclick();assert.equal(frame.style.width,'390px');assert.equal(JSON.stringify(model),baseline);assert.equal(reads,2);
 preview.element.open=false;model.title='收起后的修改';f.watch.dispatch('input');f.flush();assert.equal(reads,2);preview.element.open=true;preview.element.dispatch('toggle');f.flush();assert.equal(frame.contentDocument.querySelector('[data-title]').textContent,'收起后的修改');preview.dispose();
});

test('author whole-page preview follows the local blind-box switch without changing opening content',()=>{
 const f=fixture(),model=initial(),before=JSON.stringify(model.items);
 const preview=createAuthorPagePreview({doc:f.doc,watch:f.watch,host:{},backgroundService:f.service,readModel:()=>model});f.watch.append(preview.element);preview.element.open=true;preview.refresh();f.flush();
 const root=preview.element.querySelector('iframe').contentDocument.querySelector('[data-uos]');
 assert.equal(root.querySelector('.uos-blind-trigger').hidden,false);
 model.blindBoxEnabled=false;preview.refresh();f.flush();assert.equal(root.querySelector('.uos-blind-trigger').hidden,true);assert.equal(root.querySelector('.uos-blind-range-trigger').hidden,true);
 model.blindBoxEnabled=true;preview.refresh();f.flush();assert.equal(root.querySelector('.uos-blind-trigger').hidden,false);assert.equal(root.querySelector('.uos-blind-range-trigger').hidden,false);
 assert.equal(JSON.stringify(model.items),before);preview.dispose();
});

test('dispose cancels queued edits, listeners and late background writes without stopping the shared service',async()=>{
 const f=fixture(),preview=createAuthorPagePreview({doc:f.doc,watch:f.watch,host:{},backgroundService:f.service,readModel:initial});f.watch.append(preview.element);preview.element.open=true;preview.refresh();f.flush();const frame=preview.element.querySelector('iframe'),root=frame.contentDocument.querySelector('[data-uos]');
 f.watch.dispatch('input');const stale=[...f.timers.values()][0],before=root.style['--uos-theme-bg-active'];preview.dispose();preview.dispose();stale();preview.refresh();f.flush();
 f.requests[0].resolve('late.jpg');await Promise.resolve();await Promise.resolve();assert.equal(root.style['--uos-theme-bg-active'],before);assert.equal(f.timers.size,0);assert.equal(f.watch.listenerCount('input'),0);assert.equal(f.watch.listenerCount('change'),0);assert.equal(f.events.size,0);assert.equal(f.disconnected,1);assert.equal(frame.isConnected,false);assert.equal(preview.element.isConnected,false);
});
