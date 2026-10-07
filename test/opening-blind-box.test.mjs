import {test} from 'node:test';
import assert from 'node:assert/strict';
import {blindBoxPool,drawOpening,drawOpeningHand} from '../src/opening-blind-draw.js';
import {THEME_IDS,themeDraw} from '../src/themes.js';
import {createOpeningBlindBox,openingBlindBoxButton,updateBlindBoxButton,setBlindBoxTheme} from '../src/opening-blind-box.js';

const items=()=>[{id:2,number:3,coverIndex:2,title:'雨夜',description:'<img onerror=alert(1)>',body:'第二条完整原文',coverSlot:4,coverFocus:{x:20,y:70}},{id:7,number:8,title:'重逢',body:'第七条完整原文'},{id:9,number:10,title:'当前',body:'当前正文',isCurrent:true}];
function fixture({reduced=false,onChoose,storage,avatar}={}){
  const doc={activeElement:null},timers=new Map();let timerId=0,alive=true,pool=items(),allPool=null,previewScope=null;const effects=[];
  function el(tag,cls='',text){
    const listeners=new Map();
    const node={tag,ownerDocument:doc,className:cls,textContent:text,children:[],dataset:{},attrs:{},isConnected:true,open:false,style:{setProperty(key,value){this[key]=value}},classList:{add(){}},
      setAttribute(key,value){this.attrs[key]=value},append(...nodes){for(const child of nodes){child.parent=child.parentElement=this;this.children.push(child)}},replaceChildren(...nodes){this.children=[];this.append(...nodes)},
      addEventListener(key,fn){if(!listeners.has(key))listeners.set(key,new Set());listeners.get(key).add(fn)},removeEventListener(key,fn){listeners.get(key)?.delete(fn)},dispatch(key,event={}){for(const fn of [...listeners.get(key)||[]])fn(event)},
      showModal(){this.open=true},close(){this.open=false;this.dispatch('close')},remove(){this.isConnected=false;if(this.parent)this.parent.children=this.parent.children.filter(child=>child!==this)},focus(){doc.activeElement=this}};
    return node;
  }
  doc.createElement=el;doc.head=el('head');doc.body=el('body');doc.documentElement=el('html');doc.defaultView={getComputedStyle:()=>({getPropertyValue:key=>key})};
  const host={localStorage:storage,setTimeout(fn,ms){timers.set(++timerId,{fn,ms});return timerId},clearTimeout:id=>timers.delete(id),matchMedia:()=>({matches:reduced})};
  const palette=el('div');palette.dataset.theme='theatre';const trigger=el('button');
  const box=createOpeningBlindBox({doc,host,avatar,getItems:()=>pool,getAllItems:()=>allPool||pool,getPalette:()=>palette,isActive:()=>alive,random:()=>0,
    onRangeChange:result=>effects.push({action:'range',persisted:result.persisted}),onPreview:(item,button,scope)=>{previewScope=scope;effects.push({action:'preview',id:item.id,button,windows:doc.body.children.length})},onChoose:item=>{effects.push({action:'choose',id:item.id,windows:doc.body.children.length});return onChoose?.(item)},onUnavailable:()=>effects.push({action:'unavailable'}),onError:error=>effects.push({action:'error',message:error.message})});
  function run(ms){for(const [id,timer] of [...timers])if(timer.ms<=ms){timers.delete(id);timer.fn()}}
  const all=(node,predicate)=>[...(predicate(node)?[node]:[]),...node.children.flatMap(child=>all(child,predicate))];
  return {doc,box,trigger,timers,effects,el,run,get dialog(){return doc.body.children[0]},get previewScope(){return previewScope},find:cls=>all(doc.body,node=>node.className===cls)[0],all:predicate=>all(doc.body,predicate),pick:(index=0)=>{const card=all(doc.body,node=>node.className==='uos-blind-card')[index];card.focus();card.onclick()},button:text=>all(doc.body,node=>node.tag==='button'&&node.textContent===text)[0],setTheme:value=>palette.dataset.theme=value,setItems:value=>pool=value,setAllItems:value=>allPool=value,deactivate:()=>alive=false};
}

test('draw pool respects caller filters, original IDs, duplicate IDs, empty bodies and current opening',()=>{
  const original=items(),copy=structuredClone(original);assert.deepEqual(blindBoxPool([original[1],original[2],{id:12,body:''},original[1]]).map(item=>item.id),[7]);
  assert.equal(drawOpening([],null),null);const pool=blindBoxPool(original);assert.equal(drawOpening(pool,null,()=>0).id,2);assert.equal(drawOpening(pool,null,()=>1).id,7);
  assert.equal(drawOpening(pool,2,()=>0).id,7);assert.equal(drawOpening(pool,7,()=>1).id,2);assert.equal(drawOpening([original[1]],7,()=>NaN).id,7);assert.deepEqual(original,copy);
});
test('hands sample at most three distinct original openings without replacement or modifying the pool',()=>{
  const pool=Array.from({length:6},(_,i)=>({id:i*4,body:`正文 ${i}`})),copy=structuredClone(pool);
  assert.deepEqual(drawOpeningHand([],null),[]);
  assert.deepEqual(drawOpeningHand(pool,null,()=>0).map(item=>item.id),[0,4,8]);
  assert.deepEqual(drawOpeningHand(pool,20,()=>1).map(item=>item.id),[16,12,8]);
  assert.deepEqual(drawOpeningHand(pool.slice(0,2),0,()=>NaN).map(item=>item.id),[4]);
  assert.deepEqual(drawOpeningHand(pool.slice(0,1),0,()=>-1).map(item=>item.id),[0]);assert.deepEqual(pool,copy);
  // Each of three positions can receive every candidate under a uniform random stream.
  const counts=Array.from({length:3},()=>Array(4).fill(0));
  for(let a=0;a<4;a++)for(let b=0;b<3;b++)for(let c=0;c<2;c++){
    const values=[(a+.5)/4,(b+.5)/3,(c+.5)/2],hand=drawOpeningHand(pool.slice(0,4),null,()=>values.shift());
    assert.equal(new Set(hand.map(item=>item.id)).size,3);hand.forEach((item,i)=>counts[i][item.id/4]++);
  }
  assert.deepEqual(counts,[Array(4).fill(6),Array(4).fill(6),Array(4).fill(6)]);
});
test('three clickable backs conceal titles, accept only one pick and retain the picked original ID',()=>{
  const f=fixture();f.setItems([...items(),{id:15,title:'隐藏支线',body:'支线原文'}]);f.box.open();
  const cards=f.all(node=>node.className==='uos-blind-card');assert.equal(cards.length,3);assert(cards.every(card=>card.disabled));assert.equal(f.find('uos-blind-face-title'),undefined);
  cards[2].onclick();assert.equal(f.dialog.dataset.phase,'shuffle');f.run(1800);assert(cards.every(card=>!card.disabled));assert.equal(f.find('uos-blind-title'),undefined);
  f.pick(2);cards[0].onclick();assert.equal(f.timers.size,2);assert.equal(cards[2].dataset.picked,'true');assert.equal(cards[0].dataset.picked,undefined);f.run(1180);assert.equal(f.find('uos-blind-title').textContent,'隐藏支线');f.button('进入此开场').onclick();assert.equal(f.effects[0].id,15);f.box.dispose();
});
test('reshuffle rejects an old card handler and closing during a flip cancels late reveal callbacks',()=>{
  const f=fixture();f.box.open();f.run(1800);const oldCard=f.find('uos-blind-card');f.button('再抽一次').onclick();f.run(1800);oldCard.onclick();assert.equal(f.dialog.dataset.phase,'ready');assert.equal(f.timers.size,0);
  f.pick();const late=[...f.timers.values()].map(timer=>timer.fn);f.box.close();assert.equal(f.timers.size,0);f.box.open();for(const fn of late)fn();assert.equal(f.dialog.dataset.phase,'shuffle');assert.equal(f.find('uos-blind-title'),undefined);assert.deepEqual(f.effects,[]);f.box.dispose();
});
test('animated draw conceals content, waits for a card click, then flips without starting any transaction',()=>{
  const f=fixture();f.box.open(f.trigger);assert.equal(f.dialog.dataset.phase,'shuffle');assert.equal(f.find('uos-blind-result').hidden,true);assert.equal(f.find('uos-blind-title'),undefined);assert.equal(f.button('进入此开场').disabled,true);
  f.button('进入此开场').onclick();f.button('预览正文').onclick();assert.deepEqual(f.effects,[]);assert.equal(f.timers.size,1);
  f.run(1800);assert.equal(f.dialog.dataset.phase,'ready');assert.equal(f.find('uos-blind-title'),undefined);assert.equal(f.timers.size,0);f.pick();assert.equal(f.dialog.dataset.phase,'flipping');assert.equal(f.timers.size,2);f.run(260);assert.equal(f.find('uos-blind-card').dataset.opened,'true');f.run(1180);assert.equal(f.dialog.dataset.phase,'revealed');assert.equal(f.find('uos-blind-title').textContent,'雨夜');assert.equal(f.find('uos-blind-description').textContent,'<img onerror=alert(1)>');assert.equal(f.timers.size,0);assert.deepEqual(f.effects,[]);
  assert.equal(f.dialog.dataset.theme,'theatre');assert.equal(f.find('uos-blind-cover').style.backgroundImage,'var(--uos-default-cover-4)');assert.equal(f.find('uos-blind-cover').style.backgroundPosition,'20% 70%');f.box.dispose();
});
test('rerolls cannot stack timers and avoid the immediately previous original ID',()=>{
  const f=fixture();f.box.open();f.button('再抽一次').onclick();assert.equal(f.timers.size,1);f.run(1800);f.pick();f.run(1180);assert.equal(f.find('uos-blind-title').textContent,'雨夜');
  const reroll=f.button('再抽一次');reroll.focus();reroll.onclick();assert.equal(f.find('uos-blind-result').hidden,true);reroll.onclick();assert.equal(f.timers.size,1);f.run(1800);f.pick();f.run(1180);assert.equal(f.find('uos-blind-title').textContent,'重逢');assert.equal(f.doc.activeElement,f.button('预览正文'));assert.deepEqual(f.effects,[]);f.box.dispose();
});
test('preview and explicit entry close first and call only their respective existing transaction',()=>{
  const f=fixture({reduced:true});f.box.open(f.trigger);f.pick();f.button('预览正文').onclick();assert.deepEqual(f.effects,[{action:'preview',id:2,button:f.trigger,windows:0}]);assert.equal(f.doc.activeElement,f.trigger);
  f.box.open(f.trigger);f.pick();f.button('进入此开场').onclick();assert.deepEqual(f.effects[1],{action:'choose',id:7,windows:0});assert.equal(f.doc.body.children.length,0);f.box.dispose();
});
test('close and disposal cancel animations, remove owned styles and guard retained old handlers',()=>{
  const f=fixture();f.box.open(f.trigger);const oldDialog=f.dialog,oldExit=f.button('关闭盲盒'),oldChoose=f.button('进入此开场'),late=[...f.timers.values()].map(timer=>timer.fn);f.box.close();assert.equal(f.timers.size,0);assert.equal(f.doc.activeElement,f.trigger);
  f.box.open(f.trigger);oldExit.onclick();oldChoose.onclick();oldDialog.dispatch('cancel',{preventDefault(){}});for(const fn of late)fn();assert.equal(f.doc.body.children.length,1);assert.equal(f.dialog.dataset.phase,'shuffle');
  f.box.dispose();f.box.dispose();assert.equal(f.doc.head.children.length,0);assert.equal(f.doc.body.children.length,0);assert.equal(f.timers.size,0);assert.equal(f.box.open(f.trigger),false);assert.deepEqual(f.effects,[]);
});
test('character change aborts a pending reveal and an already revealed entry',()=>{
  const f=fixture();f.box.open();f.deactivate();f.run(1800);assert.equal(f.doc.body.children.length,0);assert.equal(f.timers.size,0);assert.deepEqual(f.effects,[{action:'unavailable'}]);f.box.dispose();
  const ready=fixture({reduced:true});ready.box.open();ready.pick();ready.deactivate();ready.button('进入此开场').onclick();assert.deepEqual(ready.effects,[{action:'unavailable'}]);assert.equal(ready.doc.body.children.length,0);ready.box.dispose();
});
test('single candidate and reduced motion have honest counts, disabled reroll and no unnecessary timers',()=>{
  const f=fixture({reduced:true});f.setItems([items()[1]]);assert.equal(f.box.open(),true);assert.equal(f.dialog.dataset.phase,'ready');assert.equal(f.timers.size,0);assert.equal(f.all(node=>node.className==='uos-blind-card').length,1);f.pick();assert.equal(f.dialog.dataset.phase,'revealed');assert.equal(f.button('再抽一次').disabled,true);assert.equal(f.find('uos-blind-scope').textContent,'当前筛选 · 1 个候选开场');f.box.dispose();
  const empty=fixture();empty.setItems([items()[2]]);assert.equal(empty.box.open(),false);assert.equal(empty.doc.body.children.length,0);const trigger=openingBlindBoxButton(empty.el);updateBlindBoxButton(trigger,items(),{readonly:true});assert.equal(trigger.disabled,true);assert.equal(trigger.__uosBlindCount.textContent,'2 个开场');updateBlindBoxButton(trigger,[]);assert.equal(trigger.disabled,true);assert.equal(trigger.__uosBlindCount.textContent,'暂无候选');empty.box.dispose();
});
test('Escape, native close and busy / revealed keyboard traps clean up and remain reachable',()=>{
  const f=fixture();f.box.open(f.trigger);const help=f.all(node=>node.dataset.moduleHelpTopic==='blind')[0];let prevented=0;f.dialog.dispatch('keydown',{key:'Tab',preventDefault(){prevented++}});assert.equal(f.doc.activeElement,help);assert.equal(prevented,1);
  f.run(1800);f.pick();f.run(1180);f.button('进入此开场').focus();f.dialog.dispatch('keydown',{key:'Tab',preventDefault(){prevented++}});assert.equal(f.doc.activeElement,help);
  f.dialog.dispatch('keydown',{key:'Escape',preventDefault(){},stopPropagation(){}});assert.equal(f.doc.body.children.length,0);f.box.open(f.trigger);f.dialog.close();assert.equal(f.timers.size,0);assert.equal(f.doc.activeElement,f.trigger);f.box.dispose();
});
test('pending entry blocks a second draw, and a failed transaction releases that guard',async()=>{
  let reject;const pending=new Promise((_,no)=>reject=no),f=fixture({reduced:true,onChoose:()=>pending});f.box.open();f.pick();const choose=f.button('进入此开场');choose.onclick();choose.onclick();assert.equal(f.effects.filter(effect=>effect.action==='choose').length,1);assert.equal(f.box.open(),false);
  reject(Error('save failed'));await new Promise(resolve=>setImmediate(resolve));assert.deepEqual(f.effects.at(-1),{action:'error',message:'save failed'});assert.equal(f.box.open(),true);f.box.dispose();
});

test('decorative entrance survives count updates and warms the card art without activating a draw',()=>{
 const f=fixture();let opened=0;const trigger=openingBlindBoxButton(f.el,button=>{assert.equal(button,trigger);opened++});
 const [art,copy,action]=trigger.children,illustration=art.children[1],texture=art.children[2];
 assert.equal(trigger.attrs['aria-label'],'未封档案（命运盲盒）');assert.equal(copy.children[0].textContent,'未封档案');
 assert.ok(illustration.src.endsWith('/assets/blind-box/card-backs/archive.webp'));assert.ok(texture.src.endsWith('/assets/blind-box/card-backs/archive.webp'));
 assert.equal(illustration.loading,'eager');assert.equal(texture.loading,'eager');assert.equal(illustration.alt,'');
 const originalChildren=[...trigger.children];updateBlindBoxButton(trigger,items());updateBlindBoxButton(trigger,[items()[1]]);
 assert.deepEqual(trigger.children,originalChildren);assert.equal(action.children[0].textContent,'1 个开场');assert.equal(opened,0);assert.equal(f.timers.size,0);
 trigger.onclick();assert.equal(opened,1);f.box.dispose();
});

test('art fallback advances through immutable sources, keeps the draw operational and ignores detached images',()=>{
 const f=fixture();f.box.open(f.trigger);const card=f.find('uos-blind-card').children[0].children[0],image=card.children[0];
 assert.match(image.src,/cdn\.jsdelivr\.net\/gh\/.+@[a-f0-9]{40}\//);image.onerror();assert.match(image.src,/testingcf\.jsdelivr/);
 image.onerror();assert.match(image.src,/raw\.githubusercontent/);image.onerror();assert.equal(image.dataset.failed,'true');assert.equal(card.dataset.artReady,undefined);
 f.run(1800);f.pick();f.run(1180);assert.equal(f.dialog.dataset.phase,'revealed');assert.equal(f.button('进入此开场').disabled,false);assert.deepEqual(f.effects,[]);
 const trigger=openingBlindBoxButton(f.el),art=trigger.children[0],entrance=art.children[1];entrance.onload();assert.equal(entrance.dataset.ready,'true');assert.equal(art.dataset.artReady,'true');
 const pending=art.children[2],first=pending.src;pending.isConnected=false;pending.onerror();pending.onload();assert.equal(pending.src,first);assert.equal(pending.dataset.ready,undefined);f.box.dispose();
});

test('theme changes replace only decorative cards and title while count and actions remain intact',()=>{
 const f=fixture(),trigger=openingBlindBoxButton(f.el);updateBlindBoxButton(trigger,items());const count=trigger.__uosBlindCount;
 setBlindBoxTheme(trigger,'japan');assert.equal(trigger.attrs['aria-label'],'月下御签（命运盲盒）');assert.equal(count.textContent,'2 个开场');
 assert.ok(trigger.children[0].children.slice(1).every(image=>image.src.endsWith('/card-backs/japan.webp')));
 const same=trigger.children[0].children[1];updateBlindBoxButton(trigger,[items()[1]],{theme:'japan'});assert.equal(trigger.children[0].children[1],same);assert.equal(count.textContent,'1 个开场');f.box.dispose();
});

test('manual range can draw and preview a hidden original opening, persists locally and never performs a greeting write',()=>{
 const data=new Map(),storage={getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)},f=fixture({reduced:true,storage,avatar:'甲.png'});
 f.setAllItems(items());f.setItems([items()[0]]);f.box.openRange(f.trigger);assert.equal(f.timers.size,0);f.button('全部清空').onclick();
 const checkbox=f.all(node=>node.tag==='input'&&node.type==='checkbox'&&node.attrs['aria-label'].includes('重逢'))[0];checkbox.checked=true;checkbox.onchange();
 assert.equal(f.find('uos-blind-range-count').textContent,'手动范围 · 1 个可抽取开场');f.button('应用抽卡设置').onclick();
 assert.equal(f.doc.body.children.length,0);assert.deepEqual(f.effects,[{action:'range',persisted:true}]);assert.deepEqual(f.box.poolItems().map(item=>item.id),[7]);
 f.box.open(f.trigger);f.pick();assert.equal(f.find('uos-blind-title').textContent,'重逢');assert.equal(f.find('uos-blind-scope').textContent,'手动范围 · 1 个候选开场');f.button('预览正文').onclick();assert.deepEqual(f.previewScope.map(item=>item.id),[7]);
 const next=fixture({reduced:true,storage,avatar:'甲.png'});next.setAllItems(items());next.setItems([]);assert.deepEqual(next.box.poolItems().map(item=>item.id),[7]);next.box.dispose();f.box.dispose();
});

test('empty manual selection disables drawing, current greeting stays ineligible, cancellation and stale controls never save',()=>{
 const f=fixture({reduced:true});f.box.openRange(f.trigger);const oldSave=f.button('应用抽卡设置'),oldNone=f.button('全部清空');
 const current=f.all(node=>node.tag==='input'&&node.type==='checkbox'&&node.attrs['aria-label'].includes('当前'))[0];assert.equal(current.disabled,true);
 f.button('全部清空').onclick();f.button('关闭设置').onclick();assert.equal(f.box.rangeMode(),'filtered');assert.equal(f.effects.length,0);
 f.box.openRange(f.trigger);oldSave.onclick();oldNone.onclick();assert.equal(f.effects.length,0);assert.equal(f.doc.body.children.length,1);
 f.button('全部清空').onclick();f.button('应用抽卡设置').onclick();assert.equal(f.box.open(),false);assert.deepEqual(f.box.poolItems(),[]);
 f.box.openRange();f.button('仅选当前筛选').onclick();f.button('应用抽卡设置').onclick();assert.deepEqual(f.box.poolItems().map(item=>item.id),[2,7]);
 f.box.openRange();const expired=f.button('应用抽卡设置');f.deactivate();expired.onclick();assert.equal(f.doc.body.children.length,0);assert.equal(f.effects.at(-1).action,'unavailable');f.box.dispose();assert.equal(f.doc.head.children.length,0);
});

test('named pool creation, switching, update, rename and deletion apply together with draw settings',()=>{
 const f=fixture({reduced:true});f.setItems([items()[0]]);f.setAllItems(items());
 f.box.openRange();f.find('uos-blind-pool-name').value='主线';f.button('保存为新卡池').onclick();f.find('uos-blind-hand-size').value='5';f.find('uos-blind-show-setting').value='simple';f.button('关闭设置').onclick();assert.equal(f.box.rangeMode(),'filtered');assert.match(f.box.rangeSummary(),/三张$/);
 f.box.openRange();assert.equal(f.find('uos-blind-pool-select').children.length,1);f.find('uos-blind-pool-name').value='主线';f.button('保存为新卡池').onclick();f.find('uos-blind-hand-size').value='5';f.find('uos-blind-show-setting').value='simple';f.button('应用抽卡设置').onclick();assert.match(f.box.rangeSummary(),/主线 · 五张$/);assert.deepEqual(f.box.poolItems().map(item=>item.id),[2]);
 f.box.openRange();f.button('全部清空').onclick();const checkbox=f.all(node=>node.tag==='input'&&node.type==='checkbox'&&node.attrs['aria-label'].includes('重逢'))[0];checkbox.checked=true;checkbox.onchange();f.button('更新卡池内容').onclick();f.find('uos-blind-pool-name').value='番外';f.button('重命名').onclick();f.button('应用抽卡设置').onclick();assert.match(f.box.rangeSummary(),/番外/);assert.deepEqual(f.box.poolItems().map(item=>item.id),[7]);
 f.box.openRange();f.button('全部勾选').onclick();f.find('uos-blind-pool-name').value='全部故事';f.button('保存为新卡池').onclick();const select=f.find('uos-blind-pool-select');assert.equal(select.children.length,3);select.value='pool-1';select.onchange();f.button('应用抽卡设置').onclick();assert.deepEqual(f.box.poolItems().map(item=>item.id),[7]);
 f.box.open();assert.equal(f.find('uos-blind-performance').hidden,true);f.pick();f.button('预览正文').onclick();assert.equal(f.effects.at(-1).id,7);
 f.box.openRange();f.button('删除卡池').onclick();f.button('应用抽卡设置').onclick();assert.match(f.box.rangeSummary(),/手动范围/);assert.deepEqual(f.box.poolItems().map(item=>item.id),[7]);f.box.openRange();assert.equal(f.find('uos-blind-pool-select').children.length,2);f.box.dispose();
});
test('pool name validation, empty saved pools and stale controls cannot broaden or overwrite a new scope',()=>{
 const f=fixture({reduced:true});f.box.openRange();f.button('保存为新卡池').onclick();assert.equal(f.find('uos-blind-pool-select').children.length,1);
 f.find('uos-blind-pool-name').value='空池';f.button('全部清空').onclick();f.button('保存为新卡池').onclick();const old=f.button('保存为新卡池');old.onclick();assert.equal(f.find('uos-blind-pool-select').children.length,2);f.button('应用抽卡设置').onclick();assert.deepEqual(f.box.poolItems(),[]);assert.equal(f.box.open(),false);
 f.box.openRange();old.onclick();assert.equal(f.find('uos-blind-pool-select').children.length,2);f.button('全部勾选').onclick();const oldCheckbox=f.all(node=>node.tag==='input'&&node.type==='checkbox')[0];const select=f.find('uos-blind-pool-select');select.value='pool-1';select.onchange();oldCheckbox.checked=true;oldCheckbox.onchange();f.button('应用抽卡设置').onclick();assert.deepEqual(f.box.poolItems(),[]);f.box.dispose();
});
test('five-card setting creates five different backs, keeps mobile positions and respects limited candidates',()=>{
 const pool=Array.from({length:7},(_,i)=>({id:i*3,title:`故事 ${i}`,body:`原文 ${i}`})),f=fixture();f.setItems(pool);f.box.openRange();f.find('uos-blind-hand-size').value='5';f.find('uos-blind-show-setting').value='simple';f.button('应用抽卡设置').onclick();
 f.box.open();assert.equal(f.find('uos-blind-performance').hidden,true);assert.equal(f.find('uos-blind-deck').dataset.count,'5');const cards=f.all(node=>node.className==='uos-blind-card');assert.equal(cards.length,5);assert.equal(cards[4].style['--mobile-card'],.5);assert.equal(cards[4].style['--mobile-row'],'60px');f.run(1900);f.pick(4);f.run(1180);assert.equal(f.find('uos-blind-title').textContent,'故事 4');f.button('再抽一次').onclick();f.run(1900);f.pick(4);f.run(1180);assert.notEqual(f.find('uos-blind-title').textContent,'故事 4');f.box.close();
 f.setItems(pool.slice(0,2));f.box.open();assert.equal(f.all(node=>node.className==='uos-blind-card').length,2);f.box.dispose();
});
test('all theme scenes follow the draw lifecycle while reduced motion suppresses decorative performance',()=>{
 assert.equal(new Set(THEME_IDS.map(id=>themeDraw(id).scene)).size,THEME_IDS.length);
 for(const id of THEME_IDS){const f=fixture();f.setTheme(id);f.box.open();assert.equal(f.find('uos-blind-performance').dataset.theme,id);assert.equal(f.find('uos-blind-performance-caption').textContent,themeDraw(id).scene);assert.equal(f.dialog.dataset.show,'on');f.run(1800);f.pick();assert.equal(f.dialog.dataset.phase,'flipping');f.box.dispose();assert.equal(f.timers.size,0)}
 const reduced=fixture({reduced:true});reduced.box.open();assert.equal(reduced.find('uos-blind-performance').hidden,true);assert.equal(reduced.dialog.dataset.phase,'ready');assert.equal(reduced.timers.size,0);reduced.pick();assert.equal(reduced.dialog.dataset.phase,'revealed');reduced.box.dispose();
});
