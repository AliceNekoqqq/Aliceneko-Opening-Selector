import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createAuthorMenu} from '../src/author-menu.js';
import {AUTHOR_ENTRY_TEXT} from '../src/author-setup.js';
class Element{
  constructor(tag,text=''){this.tag=tag;this.textContent=text;this.children=[];this.dataset={};this.style={};this.attrs={};this.listeners={}}
  append(...nodes){for(const node of nodes){node.remove();node.parentElement=this;this.children.push(node)}}
  remove(){if(this.parentElement){this.parentElement.children=this.parentElement.children.filter(n=>n!==this);this.parentElement=null}}
  setAttribute(k,v){this.attrs[k]=v}addEventListener(k,fn){this.listeners[k]=fn}focus(){}click(){this.onclick?.()}showModal(){this.open=true}
}
function fixture(existing=true){
  const body=new Element('body'),target=new Element('div'),legacy=new Element('div');let allowClose=true,disposed=0;
  const root={__uosPrepareForUpdate:async()=>allowClose,__uosDispose:()=>disposed++,querySelector:()=>({click:()=>opened++})};
  const doc={body,createElement:tag=>{const node=new Element(tag);if(tag==='iframe')node.contentDocument={open(){},write(){},close(){},querySelector:()=>root};return node},querySelector:selector=>selector==='#extensionsMenu'?target:selector==='#options .options-content'?legacy:null};
  const card={avatar:'demo.png',data:{first_mes:'原主开场',alternate_greetings:['原备用'],extensions:{keep:true}}},context={characterId:0,groupId:null,characters:[card],getRequestHeaders:()=>({})};let server=structuredClone(card),writes=0,opened=0;const notices=[];
  const host={toastr:{info:text=>notices.push(text)},fetch:async(url,options)=>{if(url.endsWith('/get'))return {ok:true,status:200,json:async()=>structuredClone(server)};writes++;Object.assign(server.data,JSON.parse(options.body).data);return {ok:true,status:200}}};
  const menu=createAuthorMenu({doc,host,helper:{getLastMessageId:()=>2},getContext:()=>context,getExistingRoot:()=>existing?root:null,authorHtml:()=>'',mount:()=>true});
  return {menu,body,target,legacy,card,context,notices,get writes(){return writes},get opened(){return opened},set allowClose(value){allowClose=value},get disposed(){return disposed}};
}
test('menu has the exact requested name, remains unique and cancel performs no write',()=>{
  const f=fixture();f.menu.scan();f.menu.scan();assert.equal(f.target.children.length,1);assert.equal(f.legacy.children.length,0,'no entry is added to the ordinary chat menu');assert.equal(f.target.children[0].children[1].textContent,'开场白选择器入口');
  f.menu.open();const dialog=f.body.children[0];assert.equal(dialog.dataset.uosSetup,'');dialog.children.at(-1).children[0].onclick();assert.equal(f.writes,0);assert.equal(f.card.data.first_mes,'原主开场');f.menu.close();assert.equal(f.target.children.length,0);
});
test('explicit confirmation migrates before opening settings; existing markers skip confirmation',async()=>{
  const f=fixture();f.menu.scan();f.menu.open();const dialog=f.body.children[0];await dialog.children.at(-1).children[1].onclick();assert.equal(f.writes,1);assert.equal(f.opened,1);assert.equal(f.card.data.first_mes,AUTHOR_ENTRY_TEXT);assert.deepEqual(f.card.data.alternate_greetings,['原主开场','原备用']);
  f.menu.open();assert.equal(f.opened,2);assert.equal(f.body.children.length,0);assert.equal(f.writes,1);f.menu.close();
});
test('no selection/group chat gets a clear hint and role switching removes stale confirmation',()=>{
  const f=fixture();f.menu.scan();f.context.groupId=2;f.menu.open();assert.equal(f.body.children.length,0);assert.match(f.notices[0],/单人角色卡/);
  f.context.groupId=null;f.menu.open();assert.equal(f.body.children.length,1);f.context.characterId=null;f.menu.scan();assert.equal(f.body.children.length,0);assert.equal(f.writes,0);f.menu.close();
});
test('independent workshop opens on an ongoing chat and respects unsaved-close/update guards',async()=>{
  const f=fixture(false);f.card.data.first_mes=AUTHOR_ENTRY_TEXT;f.menu.scan();f.menu.open();assert.equal(f.body.children[0].dataset.uosWorkshop,'');assert.equal(f.opened,1);assert.equal(f.writes,0);
  f.allowClose=false;assert.equal(await f.menu.prepareForUpdate(),false);assert.equal(f.body.children.length,1);f.allowClose=true;assert.equal(await f.menu.prepareForUpdate(),true);assert.equal(f.body.children.length,0);assert.equal(f.disposed,1);f.menu.close();
});
