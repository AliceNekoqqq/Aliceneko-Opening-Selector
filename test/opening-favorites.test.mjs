import {test} from 'node:test';
import assert from 'node:assert/strict';
import {openingFavoriteKeys,createOpeningFavorites} from '../src/opening-favorites.js';
import {createOpeningFavoritesUI,openingFavoriteButton,openingFavoritesFilter} from '../src/opening-favorites-ui.js';
import {matchesOpening} from '../src/opening-categories.js';

function storage(){
  const values=new Map();let denied=false;
  return {values,set denied(value){denied=value},getItem:key=>values.get(key)??null,setItem(key,value){if(denied)throw Error('quota');values.set(key,value)}};
}
const bodies=['第一条清晨原文','第二条雨夜原文','第三条支线原文'];
function elements(){
  let focused;
  const el=(tag,className='',textContent='')=>({tag,className,textContent,dataset:{},attrs:{},children:[],isConnected:true,
    setAttribute(key,value){this.attrs[key]=value},append(...nodes){this.children.push(...nodes)},focus(){focused=this},remove(){this.isConnected=false}});
  return {el,get focused(){return focused}};
}
function uiFixture(){
  const disk=storage(),store=createOpeningFavorites({localStorage:disk},'shared.png'),nodes=elements();let visible=[],rendered=[],active=true,unavailable=0;
  const rows=bodies.map((body,index)=>({id:index+10,title:['清晨','雨夜','支线'][index],body,names:['甲'],group:index===1?'番外':'主线',tags:['重逢']}));
  const ui=createOpeningFavoritesUI({el:nodes.el,store,isActive:()=>active,onUnavailable:()=>unavailable++,onChange:render});
  function render(){for(const node of rendered)node.isConnected=false;visible=ui.update(rows).filter(row=>!ui.onlyFavorites()||row.favorite);rendered=visible.map(row=>ui.button(row))}
  render();return {ui,rows,store,disk,nodes,render,get visible(){return visible},get buttons(){return rendered},get unavailable(){return unavailable},deactivate(){active=false}};
}

test('favorite identity follows original bodies across reorder, with separate duplicate slots',()=>{
  const original=bodies.slice(),keys=openingFavoriteKeys(original);
  assert.deepEqual(openingFavoriteKeys([bodies[2],bodies[0],bodies[1]]),[keys[2],keys[0],keys[1]]);
  assert.notEqual(openingFavoriteKeys([bodies[0]+'修改'])[0],keys[0]);
  const duplicate=openingFavoriteKeys([bodies[0],bodies[0],'']);assert.notEqual(duplicate[0],duplicate[1]);assert.equal(duplicate[2],null);
  assert.deepEqual(original,bodies);
});

test('author and player instances share avatar favorites without changing unrelated storage',()=>{
  const disk=storage(),host={localStorage:disk};disk.values.set('other','preserved');
  const author=createOpeningFavorites(host,'角色.png'),player=createOpeningFavorites(host,'角色.png'),other=createOpeningFavorites(host,'另一个.png'),key=author.keys(bodies)[1];
  assert.deepEqual(author.toggle(key),{selected:true,persisted:true});assert.equal(player.snapshot().has(key),true);assert.equal(other.snapshot().size,0);
  assert.equal(createOpeningFavorites(host,'角色.png').snapshot().has(key),true);
  assert.deepEqual(player.toggle(key),{selected:false,persisted:true});assert.equal(author.snapshot().has(key),false);assert.equal(disk.values.get('other'),'preserved');
  assert.equal([...disk.values.values()].some(value=>value.includes(bodies[1])),false);
});

test('quota failures preserve pending additions and removals over old disk values until recovery',()=>{
  const disk=storage(),host={localStorage:disk},store=createOpeningFavorites(host,'quota.png'),keys=store.keys(bodies);
  store.toggle(keys[0]);disk.denied=true;
  assert.equal(store.toggle(keys[1]).persisted,false);assert.equal(store.toggle(keys[0]).persisted,false);
  assert.deepEqual([...store.snapshot()],[keys[1]]);assert.equal(createOpeningFavorites(host,'quota.png').snapshot().has(keys[0]),true);
  disk.denied=false;createOpeningFavorites(host,'quota.png').toggle(keys[2]);
  store.toggle(keys[0]);assert.deepEqual(new Set(createOpeningFavorites(host,'quota.png').snapshot()),new Set(keys));
});

test('malformed and unavailable storage are tolerated, with session-only favorites explicitly reported',()=>{
  const disk=storage();disk.values.set('uos_favorites_v1_bad','{bad');const store=createOpeningFavorites({localStorage:disk},'bad');assert.equal(store.snapshot().size,0);
  disk.values.set('uos_favorites_v1_bad',JSON.stringify({version:1,keys:['not-valid',null,openingFavoriteKeys(bodies)[0]]}));assert.equal(store.snapshot().size,1);
  const denied=createOpeningFavorites({get localStorage(){throw Error('security')}},'denied'),key=denied.keys(bodies)[0];assert.equal(denied.toggle(key).persisted,false);assert.equal(denied.snapshot().has(key),true);assert.equal(denied.toggle(key).selected,false);
  const f=uiFixture();f.disk.denied=true;f.buttons[1].onclick();assert.equal(f.unavailable,1);assert.equal(f.visible[1].favorite,true);
});

test('favorites intersect existing filters while preserving original IDs and complete-collection count',()=>{
  const f=uiFixture();f.buttons[1].onclick();f.buttons[2].onclick();f.ui.element.onclick();assert.deepEqual(f.visible.map(row=>row.id),[11,12]);
  assert.deepEqual(f.visible.filter(row=>matchesOpening(row,{query:'雨夜',person:'甲',group:'番外',tag:'重逢'})).map(row=>row.id),[11]);
  assert.equal(f.visible.filter(row=>matchesOpening(row,{group:'不存在'})).length,0);assert.equal(f.ui.element.textContent,'★ 只看收藏 · 2');
  f.ui.element.onclick();assert.equal(f.visible.length,3);assert.equal(f.rows.some(row=>Object.hasOwn(row,'favorite')),false);
});

test('rerender restores star focus and removing the last visible favorite focuses its filter',()=>{
  const f=uiFixture(),old=f.buttons[1];old.onclick();assert.equal(f.nodes.focused,f.buttons[1]);assert.notEqual(old,f.buttons[1]);
  const saved=[...f.store.snapshot()];old.onclick();assert.deepEqual([...f.store.snapshot()],saved);
  f.ui.element.onclick();assert.equal(f.visible.length,1);f.buttons[0].onclick();assert.equal(f.visible.length,0);assert.equal(f.nodes.focused,f.ui.element);assert.equal(f.ui.element.textContent,'★ 只看收藏 · 0');
});

test('disposed or changed-character controls cannot mutate storage; obsolete bodies do not inflate count',()=>{
  const f=uiFixture();f.buttons[0].onclick();f.rows[0].body+='修改';f.render();assert.equal(f.ui.element.textContent,'☆ 只看收藏 · 0');
  const button=f.buttons[1],filter=f.ui.element;f.deactivate();button.onclick();filter.onclick();assert.equal(f.store.snapshot().size,1);assert.equal(f.ui.onlyFavorites(),false);
  f.ui.dispose();button.onclick();assert.equal(f.store.snapshot().size,1);assert.equal(filter.isConnected,false);
});

test('readonly page favorite controls are disabled without business callbacks',()=>{
  const {el}=elements(),button=openingFavoriteButton(el,{key:'example',title:'开场',selected:true}),filter=openingFavoritesFilter(el,1);
  assert.equal(button.disabled,true);assert.equal(button.onclick,undefined);assert.equal(button.attrs['aria-label'],'取消收藏：开场');assert.equal(button.attrs['aria-pressed'],'true');assert.equal(button.children[0].textContent,'★');
  assert.equal(filter.disabled,true);assert.equal(filter.onclick,undefined);
});
