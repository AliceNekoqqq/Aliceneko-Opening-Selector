import assert from 'node:assert/strict';
import {test} from 'node:test';
import {openingMetadata,openingFacets,matchesOpening,partitionOpenings} from '../src/opening-categories.js';
import {createOpeningCategoryFilters,createOpeningGroupRenderer,openingTagChips} from '../src/opening-category-ui.js';

function el(tag,className='',textContent=''){
 const listeners=new Map();let value='';
 return {tag,className,textContent,attrs:{},children:[],dataset:{},hidden:false,isConnected:true,open:false,
  get value(){return tag==='select'&&!value?this.children[0]?.value||'':value},set value(next){value=next},
  setAttribute(key,v){this.attrs[key]=v},append(...children){this.children.push(...children)},replaceChildren(...children){this.children=children;value=''},
  addEventListener(key,fn){listeners.set(key,fn)},dispatch(key){listeners.get(key)?.()}};
}
const rows=[{id:0,title:'清晨',description:'',label:'主线入口',body:'正文',names:['甲'],group:'主线',tags:['重逢','清晨']},{id:1,title:'雨夜',body:'原文',names:['甲','乙'],group:'番外',tags:['重逢','雨夜']},{id:2,title:'支线',body:'原文',names:['乙'],group:'主线',tags:['雨夜']},{id:3,title:'未分类',body:'独立正文',names:[],group:'',tags:[]}];
test('metadata accepts legacy empty entries, trims and bounds only explicit author categories',()=>{
 assert.deepEqual(openingMetadata(null),{group:'',tags:[]});assert.deepEqual(openingMetadata({label:'旧标签'}),{group:'',tags:[]});
 assert.deepEqual(openingMetadata({group:' 主线 ',tags:'重逢， 雨夜、重逢\n清晨'}),{group:'主线',tags:['重逢','雨夜','清晨']});
 const result=openingMetadata({group:'a'.repeat(70),tags:[null,{},'',' '.repeat(3),...Array.from({length:20},(_,i)=>`${i}`+'t'.repeat(40))]});assert.equal(result.group.length,60);assert.equal(result.tags.length,12);assert.ok(result.tags.every(tag=>tag.length<=30));
});
test('query, person, group and tag intersect; descriptions and existing labels remain searchable',()=>{
 assert.deepEqual(rows.filter(row=>matchesOpening(row,{person:'甲',group:'番外',tag:'重逢',query:'雨夜'})).map(row=>row.id),[1]);
 assert.deepEqual(rows.filter(row=>matchesOpening(row,{tag:'雨夜',group:'主线'})).map(row=>row.id),[2]);
 assert.deepEqual(rows.filter(row=>matchesOpening(row,{group:''})).map(row=>row.id),[3]);
 assert.equal(matchesOpening(rows[0],{query:'主线入口'}),true);assert.equal(matchesOpening({...rows[0],description:'完整简介'},{query:'简介'}),true);assert.equal(matchesOpening(rows[1],{query:'正文'}),false);
});
test('groups retain first appearance and original IDs, while plain cards keep their order',()=>{
 const baseline=JSON.stringify(rows),groups=partitionOpenings(rows);assert.deepEqual(groups.map(group=>group.group),['主线','番外','']);assert.deepEqual(groups.flatMap(group=>group.rows.map(row=>row.id)),[0,2,1,3]);assert.equal(JSON.stringify(rows),baseline);
 const plain=rows.map(row=>({...row,group:''}));assert.equal(partitionOpenings(plain)[0].group,null);assert.deepEqual(partitionOpenings(plain)[0].rows.map(row=>row.id),[0,1,2,3]);
 assert.deepEqual(openingFacets(rows),{groups:['主线','番外',''],tags:['重逢','清晨','雨夜']});
 assert.deepEqual(partitionOpenings([rows[1],rows[2]],openingFacets(rows).groups).map(group=>group.group),['主线','番外'],'filtering retains the complete list group order');
});
test('filter controls preserve valid choices, reset removed choices and hide unavailable categories',()=>{
 let changes=0;const filters=createOpeningCategoryFilters({el,onChange:()=>changes++});filters.update(rows);const group=filters.element.children[0].children[1],tag=filters.element.children[1].children[1];
 group.value='g:番外';tag.value='雨夜';filters.update(rows);assert.deepEqual(filters.values(),{group:'番外',tag:'雨夜'});group.onchange();assert.equal(changes,1);
 group.value='g:';assert.deepEqual(filters.values(),{group:'',tag:'雨夜'});filters.update([{group:'g:',tags:['雨夜']}]);group.value='g:g:';assert.equal(filters.values().group,'g:');
 filters.update([{group:'',tags:[]}]);assert.equal(filters.element.hidden,true);assert.deepEqual(filters.values(),{group:null,tag:''});
});
test('collapse state survives rerenders without skipping cards or changing IDs',()=>{
 const renderer=createOpeningGroupRenderer({el,gridClass:'uos-grid'}),container=el('div');let rendered=[];
 renderer.render(rows,container,(row,target)=>{rendered.push(row.id);target.append(el('article','',row.id))});assert.deepEqual(rendered,[0,2,1,3]);assert.equal(container.dataset.grouped,'true');
 const section=container.children[0];section.open=false;section.dispatch('toggle');section.isConnected=false;section.open=true;section.dispatch('toggle');container.replaceChildren();rendered=[];
 renderer.render(rows,container,(row,target)=>{rendered.push(row.id);target.append(el('article','',row.id))});assert.equal(container.children[0].open,false);assert.deepEqual(rendered,[0,2,1,3]);
});
test('overview shows three tags and a count; full metadata remains intact',()=>{
 const tags=['一','二','三','四','五'],chips=openingTagChips(el,tags);assert.deepEqual(chips.children.map(node=>node.textContent),['一','二','三','+2']);assert.equal(tags.length,5);assert.equal(openingTagChips(el,[]),null);
});
test('an immediate filter rerender retains a click even before the queued native toggle',()=>{
 const renderer=createOpeningGroupRenderer({el,gridClass:'uos-grid'}),container=el('div');renderer.render(rows,container,()=>{});
 const section=container.children[0];section.children[0].dispatch('click');section.open=false;container.replaceChildren();renderer.render([rows[2]],container,()=>{},rows);assert.equal(container.children[0].open,false);
});
