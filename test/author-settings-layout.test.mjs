import assert from 'node:assert/strict';
import {test} from 'node:test';
import {createSettingsViews,createOpeningPicker} from '../src/author-settings-layout.js';
const el=(tag,cls='',text='')=>({tag,className:cls,textContent:text,children:[],attrs:{},append(...nodes){this.children.push(...nodes)},prepend(...nodes){this.children.unshift(...nodes)},setAttribute(key,value){this.attrs[key]=value}});
test('settings navigation shows one section, keeping pending input nodes intact',()=>{
  const fields=el('div'),page=el('section'),preview=el('details'),order=el('section'),edit=el('section');edit.input={value:'未保存修改'};
  const layout=createSettingsViews({el,fields,views:[{id:'page',label:'页面',nodes:[page,preview]},{id:'order',label:'顺序',nodes:[order]},{id:'edit',label:'编辑',nodes:[edit]}],initial:'edit'});
  assert.equal(page.hidden,true);assert.equal(edit.hidden,false);layout.select('order');assert.equal(order.hidden,false);assert.equal(edit.hidden,true);layout.select('edit');assert.equal(edit.input.value,'未保存修改');
});
test('opening picker shows only selected editor and preserves unsaved edits when switching',()=>{
  const container=el('div'),rows=[el('details'),el('details')],entries=[{title:'第一条'},{title:'第二条'}];rows[0].draft='未保存正文';
  const picker=createOpeningPicker({el,container,rows,getEntries:()=>entries}),tools=container.children[0],select=tools.children[0].children[1];
  assert.equal(rows[0].hidden,false);assert.equal(rows[1].hidden,true);tools.children[2].onclick();assert.equal(rows[1].hidden,false);assert.equal(rows[0].open,false);
  entries[0].title='标题已改';picker.refresh();assert.match(select.children[0].textContent,/标题已改/);tools.children[1].onclick();assert.equal(rows[0].draft,'未保存正文');
});
