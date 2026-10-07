import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createOpeningGenerator} from '../src/opening-generator.js';

/* Minimal DOM harness for event/state paths, not a browser layout assertion. */
function documentFixture(){
  const doc={activeElement:null};
  function element(tag){
    const node={tag,children:[],attrs:{},dataset:{},value:'',textContent:'',hidden:false,disabled:false,parent:null,listeners:new Map(),style:{setProperty(){}},className:'',
      classList:{add(){}},append(...items){for(const item of items){item.parent=this;this.children.push(item)}},
      replaceChildren(...items){this.children=[];this.append(...items)},setAttribute(name,value){this.attrs[name]=value},focus(){doc.activeElement=this},showModal(){this.open=true},remove(){if(this.parent)this.parent.children=this.parent.children.filter(item=>item!==this)},
      addEventListener(name,fn){this.listeners.set(name,fn)},querySelector(selector){return this.querySelectorAll(selector)[0]||null},
      querySelectorAll(selector){const all=this.children.flatMap(child=>[child,...child.querySelectorAll('*')]);if(selector==='*')return all;return all.filter(child=>selector.split(',').some(part=>{
        if(part.startsWith('[data-')){const match=/\[data-([\w-]+)(?:="([^"]*)")?\]/.exec(part);const key=match[1].replace(/-([a-z])/g,(_,char)=>char.toUpperCase());return key in child.dataset&&(match[2]===undefined||child.dataset[key]===match[2])}
        return child.tag===part;
      }))}};
    return node;
  }
  doc.createElement=element;doc.body=element('body');return doc;
}
function setup({storage,readWorldbook,generate}={}){
  const doc=documentFixture(),map=new Map(),card={avatar:'draft.png',data:{name:'林安',first_mes:'原主开场',alternate_greetings:[],extensions:{}}};
  const context={characters:[card],characterId:0,chatId:'c',getRequestHeaders:()=>({})};let server=structuredClone(card),calls=[],swipes=['原主开场'];
  const host={localStorage:storage||{getItem:key=>map.get(key)||null,setItem:(key,value)=>map.set(key,value)}};
  host.fetch=async(url,options)=>{if(url.endsWith('/get'))return {ok:true,json:async()=>structuredClone(server)};const update=JSON.parse(options.body).data;server.data={...server.data,...update};return {ok:true}};
  const helper={generate:async config=>{calls.push(config);return generate?generate(config):'<content>林安推开门。</content>'},getChatMessages:()=>[{role:'assistant',swipe_id:0,swipes}],getLastMessageId:()=>0,setChatMessages:async([value])=>swipes=value.swipes};
  const saved=[];
  const api=createOpeningGenerator({doc,host,sources:()=>[helper],getContext:()=>context,helper,
    readWorldbook:readWorldbook||(async()=>({people:[{name:'林安',trusted:true,sources:[]}],worldbooks:[],warnings:[]})),onSaved:value=>saved.push(value)});
  const dialog=()=>doc.body.querySelector('dialog'),field=name=>dialog().querySelector(`[data-generation-field="${name}"]`),button=text=>dialog().querySelectorAll('button').find(node=>node.textContent===text);
  const fill=(name,value)=>{field(name).value=value;field(name).oninput()};
  return {api,doc,dialog,field,button,fill,map,calls,card,saved,context};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));

test('workshop generates, edits, refines, restores earlier draft and appends on confirmation',async()=>{
  const f=setup();await f.api.open();await tick();
  f.fill('names','林安');f.fill('idea','一封错寄的信');await f.button('生成开场白').onclick();
  assert.equal(f.calls.length,1);assert.match(f.calls[0].user_input,/一封错寄的信/);assert.equal(f.saved.length,0);
  f.fill('candidateTitle','错寄来信');f.fill('candidateBody','<content>编辑后的正文</content>');f.fill('refinement','减少旁白');
  await f.button('按修改方向生成新版本').onclick();assert.equal(f.calls.length,2);assert.match(f.calls[1].user_input,/编辑后的正文/);
  const version=f.field('versionChoice');version.value='0';version.onchange();assert.equal(f.field('candidateBody').value,'<content>编辑后的正文</content>');assert.equal(f.field('candidateTitle').value,'错寄来信');
  await f.button('关闭').onclick();assert.equal(f.dialog(),null);
  await f.api.open();await tick();assert.equal(f.field('candidateBody').value,'<content>编辑后的正文</content>');
  await f.button('加入新建备用开场白').onclick();assert.equal(f.dialog(),null);assert.equal(f.saved.length,1);assert.deepEqual(f.card.data.alternate_greetings,['<content>编辑后的正文</content>']);assert.equal(f.card.data.extensions.universal_opening_selector.entries[1].title,'错寄来信');f.api.dispose();
});

test('changed inputs do not change an in-flight candidate, disposal discards late results',async()=>{
  let finish;
  const f=setup({generate:()=>new Promise(resolve=>finish=resolve)});await f.api.open();await tick();f.fill('names','林安');
  const pending=f.button('生成开场白').onclick();await tick();f.fill('names','乔乔');finish('林安的开场');await pending;
  assert.equal(f.field('candidateNames').value,'林安');
  const another=f.button('生成开场白').onclick();await tick();f.api.dispose();finish('不应保存的迟到结果');await another;
  const saved=JSON.parse([...f.map.values()][0]);assert.equal(saved.versions.length,1);assert.equal(saved.versions[0].body,'林安的开场');assert.equal(f.dialog(),null);
});

test('cancel during worldbook loading never starts an API call',async()=>{
  let loaded;const f=setup({readWorldbook:()=>new Promise(resolve=>loaded=resolve)});await f.api.open();const pending=f.button('生成开场白').onclick();f.button('取消生成').onclick();loaded({people:[],worldbooks:[],warnings:[]});await pending;assert.equal(f.calls.length,0);f.api.dispose();
});

test('storage failure protects draft on ordinary close; switched characters cannot save',async()=>{
  const f=setup({storage:{getItem:()=>null,setItem(){throw Error('quota')}}});await f.api.open();await tick();await f.button('生成开场白').onclick();
  f.context.characterId=1;await f.button('加入新建备用开场白').onclick();assert.equal(f.saved.length,0);
  f.button('关闭').onclick();assert.ok(f.dialog());assert.ok(f.button('仍然关闭'));assert.equal(await f.api.prepareForUpdate(),false);
  f.button('仍然关闭').onclick();assert.equal(f.dialog(),null);f.api.dispose();
});
