import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createModuleHelp} from '../src/module-help.js';
import {MODULE_HELP} from '../src/module-help-content.js';

// Models dialog events and document adoption, not browser layout.
function documentFixture(){
  const doc={activeElement:null,observers:[]};
  doc.defaultView={MutationObserver:class{
    constructor(callback){this.callback=callback;doc.observers.push(this)}
    observe(){this.connected=true}
    disconnect(){this.connected=false}
  }};
  doc.createElement=tag=>({tagName:tag.toUpperCase(),ownerDocument:doc,dataset:{},attrs:{},children:[],parent:null,style:{values:{},setProperty(k,v){this.values[k]=v}},listeners:{},
    get isConnected(){return this===doc.body||Boolean(this.parent?.isConnected)},
    get textContent(){return (this.text||'')+this.children.map(child=>child.textContent).join('')},set textContent(value){this.text=value;this.children=[]},
    append(...nodes){for(const node of nodes){node.remove();node.parent=this;this.children.push(node)}},
    prepend(node){this.append(node);this.children.unshift(this.children.pop())},
    before(node){const index=this.parent.children.indexOf(this);node.parent=this.parent;this.parent.children.splice(index,0,node)},
    remove(){if(this.parent){this.parent.children=this.parent.children.filter(child=>child!==this);this.parent=null}},
    setAttribute(k,v){this.attrs[k]=v},focus(){doc.activeElement=this},showModal(){this.open=true},
    addEventListener(k,callback){(this.listeners[k]||=[]).push(callback)},
    emit(k,event={}){for(const callback of this.listeners[k]||[])callback(event)},
    querySelector(selector){return this.querySelectorAll(selector)[0]||null},
    querySelectorAll(selector){const all=this.children.flatMap(child=>[child,...child.querySelectorAll('*')]);if(selector==='*')return all;
      const match=/^\[data-([\w-]+)(?:="([^"]*)")?\]$/.exec(selector);
      return all.filter(child=>match?child.dataset[match[1].replace(/-([a-z])/g,(_,s)=>s.toUpperCase())]!==undefined&&(match[2]===undefined||child.dataset[match[1].replace(/-([a-z])/g,(_,s)=>s.toUpperCase())]===match[2]):child.tagName===selector.toUpperCase());
    },
  });
  doc.body=doc.createElement('body');doc.documentElement=doc.body;
  return doc;
}
function fixture(topic='people'){
  const doc=documentFixture(),host=doc.createElement('section'),title=doc.createElement('summary');title.textContent='本页模块';host.append(title);doc.body.append(host);
  const help=createModuleHelp({doc}),button=help.attach(title,topic);
  return {doc,host,title,help,button,reader:()=>doc.body.querySelector('[data-module-help]')};
}

test('local help opens from a disclosure without toggling it; closing restores focus and preserves edits',()=>{
  const f=fixture(),field=f.doc.createElement('textarea');field.value='未保存的名单草稿';f.host.append(field);
  let prevented=false,stopped=false;f.button.onclick({preventDefault(){prevented=true},stopPropagation(){stopped=true}});
  assert.equal(prevented&&stopped,true);assert.equal(f.reader().dataset.moduleHelp,'people');
  assert.match(f.reader().textContent,/确认已勾选人物/);assert.match(f.reader().textContent,/删除未勾选/);assert.doesNotMatch(f.reader().textContent,/BGM 与歌词|当前预设／独立创作提示/);
  const chapters=f.reader().querySelectorAll('details');assert.deepEqual(chapters.map(chapter=>chapter.open),[true,false,false]);
  f.reader().emit('keydown',{key:'Escape',preventDefault(){},stopPropagation(){stopped=true}});
  assert.equal(f.reader(),null);assert.equal(f.doc.activeElement,f.button);assert.equal(field.value,'未保存的名单草稿');assert.equal(f.host.isConnected,true);
});

test('help follows the source document after adoption and inserts before close without duplicates',()=>{
  const initial=documentFixture(),target=documentFixture(),head=target.createElement('header'),exit=target.createElement('button');head.append(exit);target.body.append(head);
  const help=createModuleHelp({doc:initial}),button=help.attach(head,'authorSettings',{before:exit});
  assert.equal(help.attach(head,'authorSettings'),button);assert.equal(head.children[0],button);
  assert.equal(button.attrs['aria-haspopup'],'dialog');assert.match(button.attrs['aria-label'],/作者设置/);
  button.onclick();assert.equal(initial.body.querySelector('dialog'),null);assert.equal(target.body.querySelector('dialog').dataset.moduleHelp,'authorSettings');
  target.body.querySelector('dialog').emit('close');assert.equal(target.body.querySelector('dialog'),null);
});

test('switching modules has one reader; source removal and disposal clear it and prevent stale opens',()=>{
  const f=fixture(),other=f.help.attach(f.host,'generation');f.button.onclick();other.onclick();
  assert.equal(f.doc.body.querySelectorAll('dialog').length,1);assert.equal(f.reader().dataset.moduleHelp,'generation');
  f.host.remove();for(const observer of f.doc.observers)if(observer.connected)observer.callback();assert.equal(f.reader(),null);assert.equal(other.onclick(),false);
  f.doc.body.append(f.host);f.button.onclick();f.help.dispose();assert.equal(f.reader(),null);assert.equal(f.button.onclick(),false);
});

test('headers reserve a readable right edge and each major page has complete explanatory content',()=>{
  const f=fixture();assert.equal(f.title.style.values['padding-right'],'52px');assert.equal(f.title.style.values['min-height'],'44px');
  for(const [topic,guide] of Object.entries(MODULE_HELP)){
    assert.ok(guide.title&&guide.purpose,topic);assert.ok(guide.steps.length&&guide.options.length&&guide.buttons.length&&guide.notes.length,topic);
    for(const row of [...guide.options,...guide.buttons])assert.ok(row.length===2&&row.every(value=>typeof value==='string'&&value.length),topic);
  }
});

test('author homepage help uses the host viewport, copies source colors and watches both documents',()=>{
  const source=documentFixture(),host=documentFixture(),frame=host.createElement('iframe');host.body.append(frame);source.defaultView.frameElement=frame;
  source.defaultView.getComputedStyle=()=>({getPropertyValue:key=>key==='--bg'?'#abc':''});
  const heading=source.createElement('header');source.body.append(heading);
  const help=createModuleHelp({doc:source,getDialogDocument:owner=>owner===source?host:owner}),button=help.attach(heading,'openings');
  button.onclick();assert.equal(source.body.querySelector('dialog'),null);
  let reader=host.body.querySelector('dialog');assert.ok(reader);assert.equal(reader.style.values['--bg'],'#abc');
  reader.querySelector('button').onclick();assert.equal(host.body.querySelector('dialog'),null);assert.equal(source.activeElement,button);
  button.onclick();heading.remove();for(const observer of source.observers)if(observer.connected)observer.callback();assert.equal(host.body.querySelector('dialog'),null);
  source.body.append(heading);button.onclick();frame.remove();for(const observer of host.observers)if(observer.connected)observer.callback();assert.equal(host.body.querySelector('dialog'),null);
  assert.equal([...source.observers,...host.observers].every(observer=>!observer.connected),true);help.dispose();
});

test('author settings help retains its own window viewport when the homepage is portaled',()=>{
  const source=documentFixture(),host=documentFixture(),settings=documentFixture(),heading=settings.createElement('header');settings.body.append(heading);
  const help=createModuleHelp({doc:source,getDialogDocument:owner=>owner===source?host:owner});help.attach(heading,'authorSettings').onclick();
  assert.equal(host.body.querySelector('dialog'),null);assert.ok(settings.body.querySelector('dialog'));help.dispose();assert.equal(settings.body.querySelector('dialog'),null);
});
