import assert from 'node:assert/strict';
import {captureWorldbookPreset,createWorldbookPresetManager,migrateWorldbookPresetAssignments,normalizeWorldbookPreset,normalizeWorldbookPresetLibrary} from '../src/worldbook-presets.js';

const card={avatar:'preset-test.png',data:{extensions:{world:'Role book'}}};
const initial={
  'Role book':[
    {uid:1,name:'基础人物',enabled:true,content:'keep this content'},
    {uid:2,name:'临时角色',enabled:false,content:'do not overwrite'},
  ],
  'Extra book':[{uid:'npc-3',name:'额外人物',enabled:true}],
  'Unbound book':[{uid:99,name:'不应访问',enabled:true}],
};
const books=structuredClone(initial),renders=[];
const helper={
  getCharWorldbookNames:()=>({primary:'Role book',additional:['Extra book']}),
  getWorldbook:async name=>structuredClone(books[name]),
  updateWorldbookWith:async(name,updater,options)=>{renders.push(options?.render);books[name]=await updater(books[name])},
};
const manager=createWorldbookPresetManager(()=>[helper],()=>card);
const listed=await manager.read();
assert.deepEqual(listed.bindings,['Role book','Extra book']);
assert.deepEqual(listed.books.map(book=>book.name),['Role book','Extra book']);
assert.equal(listed.entryCount,3);

const preset=captureWorldbookPreset(listed.books);
assert.deepEqual(preset.books[0].entries.map(entry=>[entry.uid,entry.enabled]),[[1,true],[2,false]]);
const library=normalizeWorldbookPresetLibrary([
  {id:'same-id',name:'同名预设',...preset},
  {id:'same-id',name:'同名预设',...preset},
]);
assert.equal(library.length,2);
assert.notEqual(library[0].id,library[1].id);
assert.notEqual(library[0].name,library[1].name);
const migrated=migrateWorldbookPresetAssignments([
  {title:'开场甲',worldbookPreset:preset},
  {title:'开场乙',worldbookPreset:preset},
],[]);
assert.equal(migrated.presets.length,2,'beta.1 per-opening snapshots migrate into the shared preset library');
assert.notEqual(migrated.entries[0].worldbookPresetId,migrated.entries[1].worldbookPresetId);
assert.ok(migrated.presets.every(value=>value.books[0].entries.length===2));
assert.ok(migrated.entries.every(value=>!Object.hasOwn(value,'worldbookPreset')));
const shared=migrateWorldbookPresetAssignments([
  {title:'开场甲',worldbookPresetId:'shared'},
  {title:'开场乙',worldbookPresetId:'shared'},
],[{id:'shared',name:'公共预设',...preset}]);
assert.deepEqual(shared.entries.map(value=>value.worldbookPresetId),['shared','shared']);
assert.equal(shared.presets.length,1);
preset.books[0].entries[0].enabled=false;
preset.books[0].entries[1].enabled=true;
preset.books[1].entries[0].enabled=false;
const transaction=await manager.apply(preset);
assert.equal(transaction.changedBooks,2);
assert.equal(transaction.changedEntries,3);
assert.deepEqual(books['Role book'].map(entry=>entry.enabled),[false,true]);
assert.deepEqual(books['Extra book'].map(entry=>entry.enabled),[false]);
assert.equal(books['Role book'][0].content,'keep this content');
assert.deepEqual(renders,['immediate','immediate']);
await transaction.rollback();
assert.deepEqual(books['Role book'].map(entry=>entry.enabled),[true,false]);
assert.deepEqual(books['Extra book'].map(entry=>entry.enabled),[true]);
assert.equal(books['Unbound book'][0].enabled,true);

await assert.rejects(manager.apply({version:1,books:[{name:'Unbound book',entries:[{uid:99,name:'不应访问',enabled:false}]}]}),/当前未绑定或无法读取/);
const changedBindings=createWorldbookPresetManager(()=>[{
  getCharWorldbookNames:()=>({primary:'Role book',additional:['Extra book','New book']}),
  getWorldbook:async name=>structuredClone(books[name]||[{uid:100,name:'新条目',enabled:true}]),
  updateWorldbookWith:async()=>{throw Error('should not write')},
}],()=>card);
await assert.rejects(changedBindings.apply(preset),/新增了尚未记录/);
const stale=structuredClone(preset);stale.books[0].entries.push({uid:404,name:'已删除',enabled:true});
await assert.rejects(manager.apply(stale),/已删除或编号变化/);
assert.deepEqual(books['Role book'].map(entry=>entry.enabled),[true,false],'preflight failure makes no changes');
assert.equal(normalizeWorldbookPreset({books:[{name:'',entries:[]},{name:'Role book',entries:[{uid:1,enabled:false},{uid:1,enabled:true},{name:'bad',enabled:false}]}]}).books[0].entries.length,1);

let call=0;
const partialBooks={'A':[{uid:1,enabled:true}],'B':[{uid:2,enabled:true}]};
const failing=createWorldbookPresetManager(()=>[{
  getCharWorldbookNames:()=>({primary:'A',additional:['B']}),
  getWorldbook:async name=>structuredClone(partialBooks[name]),
  updateWorldbookWith:async(name,updater)=>{call++;if(call===2)throw Error('simulated failure');partialBooks[name]=await updater(partialBooks[name])},
}],()=>card);
await assert.rejects(failing.apply({books:[{name:'A',entries:[{uid:1,enabled:false}]},{name:'B',entries:[{uid:2,enabled:false}]}]}),/已恢复切换前状态/);
assert.deepEqual([partialBooks.A[0].enabled,partialBooks.B[0].enabled],[true,true],'partial writes roll back before the caller switches openings');

let partialWriteCount=0;
const partialRead=createWorldbookPresetManager(()=>[{
  getCharWorldbookNames:()=>({primary:'Readable',additional:['Unavailable']}),
  getWorldbook:async name=>{if(name==='Unavailable')throw Error('unavailable');return [{uid:3,enabled:true}]},
  updateWorldbookWith:async()=>{partialWriteCount++},
}],()=>card);
const partialResult=await partialRead.read();
assert.equal(partialResult.books.length,1);
assert.equal(partialResult.warnings.length,1);
await assert.rejects(partialRead.apply({books:[{name:'Readable',entries:[{uid:3,enabled:false}]}]}),/未能全部读取/);
assert.equal(partialWriteCount,0,'incomplete bindings must never be applied as a partial preset');

const setBooks={'Legacy':[{uid:8,disable:false}]};
const legacy=createWorldbookPresetManager(()=>[{
  getCharLorebooks:()=>({primary:'Legacy',additional:[]}),
  getLorebookEntries:async()=>structuredClone(setBooks.Legacy),
  setLorebookEntries:async(_name,updates)=>{for(const update of updates){const entry=setBooks.Legacy.find(value=>value.uid===update.uid);if(entry)Object.assign(entry,update)}},
}],()=>card);
await legacy.apply({books:[{name:'Legacy',entries:[{uid:8,enabled:false}]}]});
assert.equal(setBooks.Legacy[0].disable,true,'supports the older setLorebookEntries patch API');

console.log('Worldbook presets: bound books, UID snapshots, rollback, stale entries and helper compatibility passed');
