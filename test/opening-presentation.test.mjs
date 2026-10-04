import assert from 'node:assert/strict';
import {test} from 'node:test';
import {openingLayout,coverPresentation,applyOpeningCover} from '../src/opening-presentation.js';
import {createCoverSettings} from '../src/cover-settings.js';

function el(tag,className='',textContent=''){
  return {tag,className,textContent,children:[],attrs:{},style:{},classList:{add(){}},
    setAttribute(key,value){this.attrs[key]=value},append(...children){this.children.push(...children)}};
}
test('old and malformed settings retain classic layout and stable automatic covers',()=>{
  assert.equal(openingLayout(), 'classic');assert.equal(openingLayout('bad'),'classic');
  for(const id of ['gallery','catalog','dossier'])assert.equal(openingLayout(id),id);
  assert.deepEqual(coverPresentation(),{coverSlot:0,coverFocus:{x:50,y:50}});
  assert.deepEqual(coverPresentation({coverSlot:6,coverFocus:{x:-30,y:200}}),{coverSlot:0,coverFocus:{x:0,y:100}});
  assert.deepEqual(coverPresentation({coverSlot:'2',coverFocus:{x:'25',y:NaN}}),{coverSlot:0,coverFocus:{x:50,y:50}});
  const first=el('div'),second=el('div');applyOpeningCover(first,{},'body',3,{});applyOpeningCover(second,{},'body',3,{});
  assert.equal(first.style.backgroundImage,second.style.backgroundImage);
});
test('fixed cover slots survive filtering / machine seeds and custom images take priority',()=>{
  const cover=el('div'),entry={coverSlot:3,coverFocus:{x:20,y:75}};
  applyOpeningCover(cover,entry,'body',4,{});assert.equal(cover.style.backgroundImage,'var(--uos-default-cover-3)');assert.equal(cover.style.backgroundPosition,'20% 75%');
  applyOpeningCover(cover,entry,'other body',0,{});assert.equal(cover.style.backgroundImage,'var(--uos-default-cover-3)');
  applyOpeningCover(cover,{...entry,image:'https://example.com/cover.webp'},'body',4,{}, {shade:true});assert.match(cover.style.backgroundImage,/linear-gradient.*url\("https:\/\/example.com\/cover.webp"\)/);
  applyOpeningCover(cover,{...entry,image:'javascript:alert(1)'},'body',4,{});assert.equal(cover.style.backgroundImage,'var(--uos-default-cover-3)');
});
test('cover edits change only the supplied draft and refresh pressed states / focus',()=>{
  const saved={image:'https://example.com/a.webp',coverSlot:0},entry=structuredClone(saved);let changes=0;
  const settings=createCoverSettings({el,entry,onChange:()=>changes++});
  const [,choices,note,random,,controls,reset]=settings.element.children;
  assert.match(note.textContent,/自定义封面/);choices.children[3].onclick();
  assert.equal(entry.image,'');assert.equal(entry.coverSlot,3);assert.equal(choices.children[3].attrs['aria-pressed'],'true');
  assert.equal(saved.image,'https://example.com/a.webp');random.onclick();assert.notEqual(entry.coverSlot,3);assert.ok(entry.coverSlot>=1&&entry.coverSlot<=5);
  const x=controls.children[0].children[1];x.value='15';x.oninput();assert.equal(entry.coverFocus.x,15);
  reset.onclick();assert.deepEqual(entry.coverFocus,{x:50,y:50});assert.equal(x.value,'50');assert.equal(changes,4);
});
