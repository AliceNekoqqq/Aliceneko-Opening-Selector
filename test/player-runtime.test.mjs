import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mountPlayerSelector} from '../src/player.js';

// Event/state integration harness. It deliberately makes no layout claims.
function documentFixture(){
  const events=()=>{
    const handlers=new Map();return {
      addEventListener(type,fn){if(!handlers.has(type))handlers.set(type,new Set());handlers.get(type).add(fn)},
      removeEventListener(type,fn){handlers.get(type)?.delete(fn)},
      dispatch(type,event={}){for(const fn of [...handlers.get(type)||[]])fn(event)},
    };
  };
  const doc={...events(),activeElement:null};
  function element(tag){
    let text='';const properties=new Map();
    const node={...events(),tag,tagName:tag.toUpperCase(),ownerDocument:doc,children:[],parentNode:null,
      attrs:{},dataset:{},value:'',checked:false,disabled:false,hidden:false,className:'',
      style:{setProperty:(k,v)=>properties.set(k,v),getPropertyValue:k=>properties.get(k)||'',removeProperty:k=>properties.delete(k)},
      get textContent(){return text+this.children.map(child=>child.textContent).join('')},
      set textContent(value){text=String(value??'');this.replaceChildren()},
      get isConnected(){return this===doc.documentElement||!!this.parentNode?.isConnected},
      get nextElementSibling(){return this.parentNode?.children[this.parentNode.children.indexOf(this)+1]},
      classList:{add(){},remove(){},toggle(){}},
      append(...nodes){for(const child of nodes){child.remove();child.parentNode=this;this.children.push(child)}},
      prepend(...nodes){for(const child of nodes.reverse()){child.remove();child.parentNode=this;this.children.unshift(child)}},
      replaceChildren(...nodes){for(const child of this.children)child.parentNode=null;this.children=[];this.append(...nodes)},
      remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(child=>child!==this);this.parentNode=null},
      before(child){this.parentNode.insertBefore(child,this)},
      after(child){this.parentNode.insertBefore(child,this.nextElementSibling)},
      insertBefore(child,reference){child.remove();child.parentNode=this;const at=this.children.indexOf(reference);this.children.splice(at<0?this.children.length:at,0,child)},
      replaceWith(child){this.before(child);this.remove()},
      setAttribute(key,value){this.attrs[key]=String(value)},getAttribute(key){return this.attrs[key]},
      focus(){doc.activeElement=this},showModal(){this.open=true},close(){this.open=false;this.dispatch('close')},
      getBoundingClientRect(){return {left:0,top:0,width:156,height:54}},
      matches(selector){
        if(selector.startsWith('.'))return this.className?.split(' ').includes(selector.slice(1));
        const attr=/^\[([^=\]]+)(?:="([^"]*)")?\]$/.exec(selector);
        if(attr){
          const value=attr[1].startsWith('data-')?this.dataset[attr[1].slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase())]:this.attrs[attr[1]];
          return value!==undefined&&(attr[2]===undefined||value===attr[2]);
        }
        return selector==='*'||selector===this.tag;
      },
      querySelectorAll(selector){return this.children.flatMap(child=>[child,...child.querySelectorAll('*')])
        .filter(child=>selector.split(',').some(part=>child.matches(part.trim())))},
      querySelector(selector){return this.querySelectorAll(selector)[0]||null},
    };
    return node;
  }
  doc.createElement=element;doc.documentElement=element('html');doc.head=element('head');doc.body=element('body');
  doc.documentElement.append(doc.head,doc.body);
  const first=element('article');doc.body.append(first);
  doc.querySelector=selector=>selector.startsWith('#chat ')?first:doc.documentElement.querySelector(selector);
  const storage=new Map();
  const host={...events(),document:doc,innerWidth:1000,innerHeight:800,
    localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,value),removeItem:key=>storage.delete(key)},
    MutationObserver:class{observe(){}disconnect(){}},setInterval:()=>1,clearInterval(){},
    setTimeout,clearTimeout,getComputedStyle:()=>({getPropertyValue:()=>''}),
  };
  host.parent=host;doc.defaultView=host;return {doc,host,storage};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));
function runtimeFixture(){
  const {doc,host,storage}=documentFixture(),key='universal_opening_selector';
  const card={avatar:'a.png',data:{name:'林安',first_mes:'林安推开门。',alternate_greetings:[],extensions:{[key]:{theme:'archive'}}}};
  let server=structuredClone(card),reads=0,syncs=0;
  const context={characterId:0,characters:[card],getRequestHeaders:()=>({}),writeExtensionField:async(id,key,value)=>{
    syncs++;card.data.extensions={...card.data.extensions,[key]:structuredClone(value)};
  }};
  host.SillyTavern={getContext:()=>context};
  host.fetch=async(url,options)=>{
    if(url.endsWith('/get')){reads++;return {ok:true,json:async()=>structuredClone(server)}}
    server.data.extensions[key]=JSON.parse(options.body).data.extensions[key];return {ok:true};
  };
  const helper={getLastMessageId:()=>0,getChatMessages:()=>[{role:'assistant',swipe_id:0,swipes:[card.data.first_mes]}],setChatMessages:async()=>{},
    getCharWorldbookNames:async()=>({primary:'人物',additional:[]}),getWorldbook:async()=>[{name:'人物：林安',content:'姓名：林安',keys:['林安'],enabled:true}]};
  const api=mountPlayerSelector(doc,helper);
  return {api,doc,host,storage,helper,context,card,get server(){return server},get reads(){return reads},get syncs(){return syncs}};
}
test('ordinary-card player panel opens, reads people and saves a selected group through verified transaction',async()=>{
  const f=runtimeFixture(),{api,doc}=f,key='universal_opening_selector';
  try{
    doc.querySelector('.uos-user-trigger').onclick({detail:0});await tick();
    const panel=doc.querySelector('.uos-user-panel');assert.ok(panel);assert.equal(doc.querySelector('dialog').open,true);
    assert.ok(panel.querySelector('.uos-user-card'));assert.match(panel.textContent,/林安/);
    const rules=panel.querySelectorAll('textarea').find(input=>input.placeholder==='沈挽昼=挽昼,小沈');assert.ok(rules);rules.value='林安=小林';
    const section=panel.querySelectorAll('details').find(node=>node.querySelector('summary')?.textContent.startsWith('人物识别规则'));
    await section.querySelectorAll('button').find(button=>button.textContent==='保存到角色卡（作者）').onclick();
    assert.equal(f.reads,2);assert.equal(f.syncs,1);assert.equal(f.server.data.extensions[key].personAliases,'林安=小林');
    assert.ok(panel.querySelectorAll('.uos-user-status').some(node=>/已写入并复核角色卡/.test(node.textContent)));
  }finally{api.close()}
  assert.equal(doc.querySelector('.uos-user-panel'),null);
});

const deferred=()=>{let resolve;const promise=new Promise(done=>{resolve=done});return {promise,resolve}};
test('real player refresh ignores an older completion while the newest read owns the button',async()=>{
  const f=runtimeFixture(),old=deferred(),fresh=deferred();let calls=0;
  f.helper.getWorldbook=()=>++calls===1?old.promise:fresh.promise;
  try{
    f.doc.querySelector('.uos-user-trigger').onclick({detail:0});await tick();assert.equal(calls,1);
    const panel=f.doc.querySelector('.uos-user-panel');
    const button=panel.querySelectorAll('button').find(node=>node.textContent==='重新读取世界书');
    const pending=button.onclick();await tick();assert.equal(calls,2);assert.equal(button.disabled,true);
    old.resolve([{name:'人物：旧人物',content:'姓名：旧人物',enabled:true}]);await tick();
    assert.equal(button.disabled,true);assert.ok(!panel.textContent.includes('旧人物'));
    fresh.resolve([{name:'人物：新人物',content:'姓名：新人物',enabled:true}]);await pending;
    assert.equal(button.disabled,false);assert.ok(panel.textContent.includes('新人物'));assert.ok(!panel.textContent.includes('旧人物'));
  }finally{f.api.close()}
});
test('player write controls block duplicate saves and late reads after forced close never write',async()=>{
  const f=runtimeFixture(),read=deferred(),fetch=f.host.fetch;let requests=0;
  try{
    f.doc.querySelector('.uos-user-trigger').onclick({detail:0});await tick();
    const panel=f.doc.querySelector('.uos-user-panel');
    const section=panel.querySelectorAll('details').find(node=>node.querySelector('summary')?.textContent.startsWith('人物识别规则'));
    const button=section.querySelectorAll('button').find(node=>node.textContent==='保存到角色卡（作者）');
    f.host.fetch=async(url,options)=>{requests++;await read.promise;return fetch(url,options)};
    const pending=button.onclick();assert.equal(button.disabled,true);assert.equal(await button.onclick(),false);assert.equal(requests,1);
    f.api.close();read.resolve();assert.equal(await pending,false);assert.equal(f.syncs,0);assert.equal(requests,1);
    assert.equal(f.doc.querySelector('.uos-user-panel'),null);
  }finally{f.api.close()}
});
test('failed override cleanup warns without undoing verified card saves or reviving old values on reopen',async()=>{
  for(const group of ['people','edits','exclusion']){
    const f=runtimeFixture();
    const open=async()=>{f.doc.querySelector('.uos-user-trigger').onclick({detail:0});await tick();return f.doc.querySelector('.uos-user-panel')};
    const section=panel=>panel.querySelectorAll('details').find(node=>node.querySelector('summary')?.textContent.startsWith(
      group==='people'?'人物识别规则':group==='edits'?'修正标题和登场人物':'排除标题'));
    const input=panel=>group==='people'?panel.querySelectorAll('textarea').find(node=>node.placeholder==='沈挽昼=挽昼,小沈')
      :group==='edits'?section(panel).querySelectorAll('input').find(node=>node.maxLength===100)
      :panel.querySelector('[aria-label="要排除的尖括号字段"]');
    const old=group==='people'?'林安=旧别名':group==='edits'?'旧标题':'旧字段';
    const next=group==='people'?'林安=新别名':group==='edits'?'新标题':'新字段';
    try{
      let panel=await open();assert.ok(section(panel));input(panel).value=old;
      section(panel).querySelectorAll('button').find(node=>node.textContent===(group==='exclusion'?'保存排除字段':'仅保存到本机')).onclick();
      const key=[...f.storage.keys()].find(key=>key.includes(group==='people'?'person_rules':group==='edits'?'_edits_':'_excluded_'));
      assert.ok(key);const disk=f.storage.get(key);
      f.host.localStorage.removeItem=()=>{throw Error('denied')};f.host.localStorage.setItem=()=>{throw Error('denied')};
      input(panel).value=next;
      await section(panel).querySelectorAll('button').find(node=>node.textContent==='保存到角色卡（作者）').onclick();
      assert.equal(f.syncs,1);assert.equal(f.storage.get(key),disk);
      assert.ok(panel.querySelectorAll('.uos-user-status').some(node=>/已写入并复核.*本机旧覆盖尚未清除/.test(node.textContent)));
      panel.querySelector('.uos-user-close').onclick();await tick();panel=await open();
      assert.notEqual(input(panel).value,old);if(group!=='exclusion')assert.equal(input(panel).value,next);
      assert.ok(panel.querySelectorAll('.uos-user-status').some(node=>/本机旧覆盖尚未清除/.test(node.textContent)));
      f.host.localStorage.removeItem=key=>f.storage.delete(key);
      panel.querySelector('.uos-user-close').onclick();await tick();panel=await open();
      assert.equal(f.storage.has(key),false);assert.ok(!panel.textContent.includes('本机旧覆盖尚未清除'));
    }finally{f.api.close()}
  }
});
test('hung write times out, preserves inputs, unlocks controls and ignores late server completion',async()=>{
  const f=runtimeFixture();let expire,finish,signal;
  try{
    f.doc.querySelector('.uos-user-trigger').onclick({detail:0});await tick();
    const panel=f.doc.querySelector('.uos-user-panel'),rules=panel.querySelectorAll('textarea').find(node=>node.placeholder==='沈挽昼=挽昼,小沈');
    const section=panel.querySelectorAll('details').find(node=>node.querySelector('summary')?.textContent.startsWith('人物识别规则'));
    const button=section.querySelectorAll('button').find(node=>node.textContent==='保存到角色卡（作者）');
    const fetch=f.host.fetch;f.host.fetch=(url,options)=>{
      if(url.endsWith('/get'))return fetch(url,options);
      signal=options.signal;return new Promise(resolve=>{finish=resolve});
    };
    f.host.setTimeout=fn=>{expire=fn;return 1};f.host.clearTimeout=()=>{};
    rules.value='保留这份编辑';const pending=button.onclick();await tick();assert.ok(finish);assert.equal(button.disabled,true);
    expire();assert.equal(await pending,false);assert.equal(signal.aborted,true);assert.equal(button.disabled,false);
    assert.equal(rules.value,'保留这份编辑');assert.equal(f.syncs,0);
    assert.ok(panel.querySelectorAll('.uos-user-status').some(node=>/写入等待超时.*可能已提交/.test(node.textContent)));
    finish({ok:true});await tick();assert.equal(f.syncs,0);assert.ok(f.doc.querySelector('.uos-user-panel'));
  }finally{f.api.close()}
});
