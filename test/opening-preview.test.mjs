import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createOpeningPreview} from '../src/opening-preview.js';

function documentFixture(){
  const doc={activeElement:null};
  function element(tag){
    const listeners=new Map();
    return {tag,ownerDocument:doc,children:[],dataset:{},attrs:{},isConnected:true,open:false,style:{setProperty(key,value){this[key]=value}},classList:{add(){}},
      setAttribute(key,value){this.attrs[key]=value},append(...nodes){for(const node of nodes){node.parent=this;this.children.push(node)}},replaceChildren(...nodes){this.children=[];this.append(...nodes)},
      addEventListener(key,fn){if(!listeners.has(key))listeners.set(key,new Set());listeners.get(key).add(fn)},removeEventListener(key,fn){listeners.get(key)?.delete(fn)},
      dispatch(key,event={}){for(const fn of [...listeners.get(key)||[]])fn(event)},showModal(){this.open=true},close(){this.open=false;this.dispatch('close')},
      remove(){this.isConnected=false;if(this.parent)this.parent.children=this.parent.children.filter(node=>node!==this)},focus(){doc.activeElement=this}};
  }
  doc.createElement=element;doc.head=element('head');doc.body=element('body');doc.documentElement=element('html');doc.defaultView={getComputedStyle:()=>({getPropertyValue:key=>key==='--panel'?'surface':key})};
  const palette=element('div');palette.dataset.theme='paper';return {doc,palette,element};
}
const all=(node,predicate)=>[...(predicate(node)?[node]:[]),...node.children.flatMap(child=>all(child,predicate))];
const button=(doc,text)=>all(doc.body,node=>node.tag==='button'&&node.textContent===text)[0];
const byClass=(doc,cls)=>all(doc.body,node=>node.className===cls)[0];
function setup(){
 const fixture=documentFixture(),effects=[];let items=[{id:2,number:3,coverIndex:2,title:'第一条',description:'完整简介',label:'主线',names:['甲','乙','丙','丁'],body:'<content>完整原文 & 不执行标签</content>',coverSlot:4,coverFocus:{x:20,y:70}},{id:7,number:8,title:'第二条',names:[],body:'另一条原文'}];
 const preview=createOpeningPreview({...fixture,getItems:()=>items,getPalette:()=>fixture.palette,onChoose:item=>effects.push({id:item.id,windows:fixture.doc.body.children.length})});
 return {...fixture,preview,effects,setItems:value=>items=value};
}
test('navigation preserves filtered original IDs and all names without selection side effects',()=>{
 const {doc,preview,effects,element}=setup(),trigger=element('button');assert.equal(preview.open(2,trigger),true);
 assert.equal(button(doc,'上一条').disabled,true);assert.equal(byClass(doc,'uos-preview-pager').textContent,'1 / 2');assert.equal(byClass(doc,'uos-preview-cast').children.length,5);
 assert.equal(byClass(doc,'uos-preview-body').textContent,'<content>完整原文 & 不执行标签</content>');
 button(doc,'下一条').onclick();assert.equal(byClass(doc,'uos-preview-title').textContent,'第二条');assert.equal(button(doc,'下一条').disabled,true);assert.deepEqual(effects,[]);
 button(doc,'选择此开场').onclick();assert.deepEqual(effects,[{id:7,windows:0}]);assert.equal(doc.activeElement,trigger);preview.dispose();
});
test('cover, theme and focus use the same author / player presentation rules',()=>{
 const {doc,preview}=setup();preview.open(2);
 assert.equal(doc.body.children[0].dataset.theme,'paper');assert.equal(byClass(doc,'uos-preview-cover').style.backgroundImage,'var(--uos-default-cover-4)');assert.equal(byClass(doc,'uos-preview-cover').style.backgroundPosition,'20% 70%');preview.dispose();
});
test('close, Escape, native close and disposal restore focus and remove owned resources',()=>{
 const {doc,preview,element,effects}=setup(),trigger=element('button');preview.open(2,trigger);let dialog=doc.body.children[0];
 dialog.dispatch('keydown',{key:'Escape',preventDefault(){},stopPropagation(){}});assert.equal(doc.body.children.length,0);assert.equal(doc.activeElement,trigger);
 preview.open(7,trigger);doc.body.children[0].close();assert.equal(doc.body.children.length,0);
 preview.open(2,trigger);const stale=button(doc,'选择此开场');preview.dispose();preview.dispose();stale.onclick();assert.equal(doc.head.children.length,0);assert.equal(doc.body.children.length,0);assert.deepEqual(effects,[]);assert.equal(preview.open(2,trigger),false);
});
test('current opening and stale replaced windows cannot start a selection',()=>{
 const {doc,preview,setItems,effects}=setup();setItems([{id:0,number:1,title:'当前',body:'正文',isCurrent:true}]);preview.open(0);
 assert.equal(button(doc,'当前开场').disabled,true);button(doc,'当前开场').onclick();assert.deepEqual(effects,[]);
 setItems([{id:1,number:2,title:'新开场',body:'原文'}]);preview.open(1);const stale=button(doc,'选择此开场');preview.open(1);stale.onclick();assert.deepEqual(effects,[]);assert.equal(doc.body.children.length,1);preview.dispose();
});
test('missing filtered entries do not open a window or invoke the caller',()=>{
 const {doc,preview,effects}=setup();assert.equal(preview.open(999),false);assert.equal(doc.body.children.length,0);assert.deepEqual(effects,[]);preview.dispose();
});

test('draw scope overrides the homepage filter only for this preview and keeps original selection IDs',()=>{
 const {doc,preview,effects,element}=setup(),trigger=element('button'),item={id:13,number:14,title:'手动范围中的隐藏开场',body:'完整隐藏原文'};
 assert.equal(preview.open(13,trigger),false);assert.equal(preview.open(13,trigger,[item]),true);assert.equal(byClass(doc,'uos-preview-body').textContent,'完整隐藏原文');
 button(doc,'选择此开场').onclick();assert.deepEqual(effects,[{id:13,windows:0}]);assert.equal(preview.open(13,trigger),false);assert.equal(preview.open(2,trigger),true);preview.dispose();
});

test('reading changes preserve raw text, navigation, scroll state and show complete information again',()=>{
 const {doc,preview,effects}=setup();preview.open(2);const dialog=doc.body.children[0],content=byClass(doc,'uos-preview-content'),body=byClass(doc,'uos-preview-body');content.scrollTop=137;
 const font=byClass(doc,'uos-preview-font-size'),spacing=byClass(doc,'uos-preview-line-spacing');font.value='large';font.onchange();spacing.value='relaxed';spacing.onchange();
 assert.equal(dialog.style['--uos-reading-font-size'],'18px');assert.equal(dialog.style['--uos-reading-line-height'],'2');assert.equal(content.scrollTop,137);assert.equal(byClass(doc,'uos-preview-body'),body);assert.equal(body.textContent,'<content>完整原文 & 不执行标签</content>');
 button(doc,'专注正文').onclick();assert.equal(button(doc,'专注正文').attrs['aria-pressed'],'true');for(const cls of ['uos-preview-cover','uos-preview-label','uos-preview-description','uos-preview-cast'])assert.equal(byClass(doc,cls).hidden,true);assert.equal(byClass(doc,'uos-preview-title').textContent,'第一条');
 button(doc,'下一条').onclick();assert.equal(byClass(doc,'uos-preview-cover').hidden,true);assert.equal(byClass(doc,'uos-preview-body').textContent,'另一条原文');assert.equal(dialog.style['--uos-reading-font-size'],'18px');assert.deepEqual(effects,[]);
 button(doc,'上一条').onclick();button(doc,'专注正文').onclick();assert.equal(byClass(doc,'uos-preview-cover').hidden,false);assert.equal(byClass(doc,'uos-preview-cast').hidden,false);assert.equal(byClass(doc,'uos-preview-cast').children.length,5);preview.dispose();
});

test('reopening restores preferences and old reading controls cannot change a replacement dialog',()=>{
 const fixture=documentFixture(),data=new Map(),host={localStorage:{getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)}},items=[{id:4,number:5,title:'原开场',body:'原文'}];
 const preview=createOpeningPreview({...fixture,host,getItems:()=>items,getPalette:()=>fixture.palette,onChoose:()=>{throw Error('reading cannot choose')}});preview.open(4);
 const oldFont=byClass(fixture.doc,'uos-preview-font-size'),oldFocus=button(fixture.doc,'专注正文');oldFont.value='large';oldFont.onchange();oldFocus.onclick();preview.close();preview.open(4);
 assert.equal(byClass(fixture.doc,'uos-preview-font-size').value,'large');assert.equal(byClass(fixture.doc,'uos-preview-cover').hidden,true);const saved=[...data.values()][0];oldFont.value='small';oldFont.onchange();oldFocus.onclick();assert.equal([...data.values()][0],saved);assert.equal(byClass(fixture.doc,'uos-preview-font-size').value,'large');
 preview.dispose();oldFont.onchange();assert.equal([...data.values()][0],saved);
});

test('keyboard users can reach reading controls when the only opening is already current',()=>{
 const {doc,preview,setItems}=setup();setItems([{id:0,number:1,title:'当前',body:'正文',isCurrent:true}]);preview.open(0);
 const dialog=doc.body.children[0],exit=button(doc,'关闭预览'),reading=byClass(doc,'uos-preview-reading'),summary=reading.children[0];let prevented=0;
 const tab=shiftKey=>dialog.dispatch('keydown',{key:'Tab',shiftKey,preventDefault(){prevented++}});
 exit.focus();tab(false);assert.equal(prevented,0);summary.focus();tab(false);assert.equal(doc.activeElement,exit);assert.equal(prevented,1);
 reading.open=true;exit.focus();tab(true);assert.equal(doc.activeElement,button(doc,'专注正文'));assert.equal(prevented,2);preview.dispose();
});
