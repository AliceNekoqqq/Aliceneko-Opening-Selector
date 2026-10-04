import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createWorldbookPresetEditor} from '../src/worldbook-preset-editor.js';
import {createPlayerDraftGuard,showPlayerUnsavedPrompt,unsavedPlayerGroups} from '../src/player-draft-guard.js';

function documentStub() {
  const doc={listeners:new Map(),defaultView:{crypto:{randomUUID:()=>String(Math.random())},getComputedStyle:()=>({getPropertyValue:()=>''})},
    addEventListener(type,fn){this.listeners.set(type,fn)},removeEventListener(type){this.listeners.delete(type)}};
  function el(tag,cls='',content='') {
    const node={tag,className:cls,textContent:String(content),value:'',dataset:{},attrs:{},children:[],listeners:{},style:{setProperty(){},getPropertyValue:()=>''},
      append(...nodes){for(const child of nodes){child.parent=this;this.children.push(child)}},
      replaceChildren(){this.children=[]},setAttribute(key,value){this.attrs[key]=value},
      addEventListener(type,fn){this.listeners[type]=fn},focus(){doc.activeElement=this},
      remove(){if(this.parent)this.parent.children=this.parent.children.filter(child=>child!==this)},
      querySelectorAll(selector){return descendants(this).filter(child=>selector==='button'?child.tag==='button':selector==='[data-worldbook-presets-status]'?child.dataset.worldbookPresetsStatus!==undefined:false)},
      querySelector(selector){return this.querySelectorAll(selector)[0]||null}};
    return node;
  }
  doc.createElement=el;doc.body=el('body');return {doc,el};
}
function descendants(node) {return node.children.flatMap(child=>[child,...descendants(child)])}
function editorFixture() {
  const {doc,el}=documentStub(),panel=el('section'),messages=[];
  const data={books:[{name:'人物',entries:[{uid:1,name:'甲',enabled:true,keys:['hero']},{uid:2,name:'乙',disable:true}]}],warnings:[],entryCount:2};
  let draft={worldbookPresets:[],entries:[{title:'开场甲'},{title:'开场乙'}]},avatar='card.png',read=async()=>data,confirm=async()=>true;
  const editor=createWorldbookPresetEditor({doc,el,query:selector=>selector==='[data-worldbook-presets]'?panel:panel.querySelector(selector),
    getDraft:()=>draft,entries:()=>draft.entries,manager:{read:()=>read()},character:()=>({avatar}),isConnected:()=>true,
    status:message=>messages.push(message),confirmPresetDelete:()=>confirm()});
  const find=predicate=>{const node=descendants(panel).find(predicate);assert.ok(node,'control not found');return node};
  return {editor,panel,messages,data,get draft(){return draft},replace(value){draft=value},setAvatar(value){avatar=value},setRead(fn){read=fn},setConfirm(fn){confirm=fn},
    button:text=>find(node=>node.tag==='button'&&node.textContent===text),
    named:name=>find(node=>node.attrs['aria-label']===name)};
}

test('preset creation, assignment, copy, rename validation and undo remain a two-step save',async()=>{
  const fixture=editorFixture();await fixture.editor.refresh();
  fixture.button('新建预设').onclick();assert.equal(fixture.editor.hasUnsaved(),true);
  assert.equal(fixture.draft.worldbookPresets.length,0,'new preset is initially an edit copy');
  fixture.button('保存新预设').onclick();assert.equal(fixture.editor.hasUnsaved(),false);
  assert.equal(fixture.draft.worldbookPresets.length,1);
  const original=fixture.draft.worldbookPresets[0],assignment=fixture.named('开场甲 世界书预设');
  assignment.value=original.id;assignment.onchange();assert.equal(fixture.draft.entries[0].worldbookPresetId,original.id);
  fixture.button('复制为新预设').onclick();fixture.button('保存新预设').onclick();
  assert.equal(fixture.draft.worldbookPresets.length,2);
  assert.notEqual(fixture.draft.worldbookPresets[1].id,original.id);
  const name=fixture.named('预设名称');name.value=original.name;name.oninput();
  assert.equal(fixture.editor.commitPending(),false);assert.match(fixture.messages.at(-1),/同名/);
  fixture.button('撤销修改').onclick();assert.equal(fixture.editor.hasUnsaved(),false);
  const renamed=fixture.named('预设名称');renamed.value='重新命名';renamed.oninput();
  assert.equal(fixture.editor.commitPending(),true);assert.equal(fixture.draft.worldbookPresets[1].name,'重新命名');
  assert.equal(original.name,'世界书预设 1');
});

test('preset search changes only matching UID entries and remains reversible until confirmed',async()=>{
  const fixture=editorFixture();await fixture.editor.refresh();fixture.button('新建预设').onclick();fixture.button('保存新预设').onclick();
  const search=fixture.named('搜索预设条目');search.value='hero';search.oninput();
  fixture.button('在预设中停用搜索结果').onclick();
  assert.equal(fixture.draft.worldbookPresets[0].books[0].entries[0].enabled,true,'saved preset stays unchanged');
  assert.equal(fixture.editor.hasUnsaved(),true);fixture.editor.commitPending();
  const entries=fixture.draft.worldbookPresets[0].books[0].entries;
  assert.equal(entries[0].enabled,false);assert.equal(entries[1].enabled,false);
  fixture.button('复制当前世界书开关').onclick();assert.equal(fixture.editor.hasUnsaved(),true);
  fixture.button('撤销修改').onclick();assert.equal(fixture.draft.worldbookPresets[0].books[0].entries[0].enabled,false);
});

test('deletion clears assignments, while delayed deletion cannot edit a replacement draft',async()=>{
  const fixture=editorFixture();await fixture.editor.refresh();fixture.button('新建预设').onclick();fixture.button('保存新预设').onclick();
  fixture.draft.entries[0].worldbookPresetId=fixture.draft.worldbookPresets[0].id;
  await fixture.button('删除预设').onclick();assert.equal(fixture.draft.worldbookPresets.length,0);assert.equal(fixture.draft.entries[0].worldbookPresetId,undefined);
  fixture.button('新建预设').onclick();fixture.button('保存新预设').onclick();
  let answer;fixture.setConfirm(()=>new Promise(resolve=>{answer=resolve}));
  const old=fixture.draft,removal=fixture.button('删除预设').onclick();
  fixture.replace({worldbookPresets:[],entries:[]});fixture.editor.reset();answer(true);await removal;
  assert.equal(old.worldbookPresets.length,1);assert.deepEqual(fixture.draft,{worldbookPresets:[],entries:[]});
});

test('late worldbook reads after character change or close cannot replace the editor view',async()=>{
  const fixture=editorFixture();await fixture.editor.refresh();const before=fixture.panel.children;
  let finish;fixture.setRead(()=>new Promise(resolve=>{finish=resolve}));const reading=fixture.editor.refresh();
  fixture.setAvatar('other.png');finish({...fixture.data,entryCount:99});await reading;
  assert.equal(fixture.panel.children,before);
  const next=fixture.editor.refresh();fixture.editor.close();finish(fixture.data);await next;
  assert.equal(fixture.panel.children,before);assert.equal(fixture.editor.commitPending(),false);
});

function guardFixture(choice='stay',groups=['people']) {
  const saved=[],messages=[];let restored=0;
  const guard=createPlayerDraftGuard({getGroups:()=>groups,prompt:async()=>choice,restore:()=>{restored++},
    saveCard:async value=>{saved.push(['card',value]);return true},saveLocal:value=>{saved.push(['local',value]);return true},status:value=>messages.push(value)});
  return {guard,saved,messages,get restored(){return restored}};
}

test('player guard keeps stay, discard, local and card decisions independent of storage',async()=>{
  assert.deepEqual(unsavedPlayerGroups({people:'a',labels:[]},{people:'b',labels:[]}),['people']);
  for(const choice of ['stay','discard','local','card']) {
    const fixture=guardFixture(choice);assert.equal(await fixture.guard.confirm(),choice!=='stay');
    assert.equal(fixture.restored,choice==='discard'?1:0);
    assert.equal(fixture.saved.length,['local','card'].includes(choice)?1:0);
    fixture.guard.close();
  }
  const clean=guardFixture('stay',[]);assert.equal(await clean.guard.confirm(),true);
});

test('player guard blocks duplicate prompts and prevents a stale prompt closing a new panel',async()=>{
  let answer,prompts=0,restored=0;
  const guard=createPlayerDraftGuard({getGroups:()=>['labels'],prompt:()=>{prompts++;return new Promise(resolve=>{answer=resolve})},
    restore:()=>{restored++},saveLocal:()=>true,saveCard:()=>true,status:()=>{}});
  const pending=guard.confirm();assert.equal(await guard.confirm(),false);assert.equal(prompts,1);
  guard.close();answer('discard');assert.equal(await pending,false);assert.equal(restored,0);
});

test('failed player saves keep the panel open and report thrown errors',async()=>{
  const messages=[];let fail=false;
  const guard=createPlayerDraftGuard({getGroups:()=>['people'],prompt:async()=> 'card',restore:()=>{},saveLocal:()=>true,
    saveCard:async()=>{if(fail)throw Error('disk');return false},status:value=>messages.push(value)});
  assert.equal(await guard.confirm(),false);fail=true;assert.equal(await guard.confirm(),false);assert.match(messages[0],/disk/);guard.close();
});

test('player prompt traps focus, handles Escape and abort, and removes key listeners',async()=>{
  const {doc,el}=documentStub(),dialog=el('dialog'),panel=el('section'),previous=el('input');previous.focus();
  const controller=new AbortController(),prompt=showPlayerUnsavedPrompt(doc,dialog,panel,['labels'],false,{signal:controller.signal});
  const buttons=dialog.querySelectorAll('button');assert.equal(buttons.length,3);assert.equal(doc.activeElement,buttons.at(-1));
  let prevented=false;doc.listeners.get('keydown')({key:'Tab',preventDefault(){prevented=true}});
  assert.equal(prevented,true);assert.equal(doc.activeElement,buttons[0]);
  controller.abort();assert.equal(await prompt,'stay');assert.equal(dialog.children.length,0);assert.equal(doc.listeners.size,0);assert.equal(doc.activeElement,previous);
  const escape=showPlayerUnsavedPrompt(doc,dialog,panel,['people'],true);
  doc.listeners.get('keydown')({key:'Escape',preventDefault(){},stopImmediatePropagation(){}});
  assert.equal(await escape,'stay');assert.equal(doc.listeners.size,0);
});
