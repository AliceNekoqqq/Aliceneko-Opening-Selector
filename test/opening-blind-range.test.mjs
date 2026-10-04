import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createOpeningDrawRange,drawRangePool,keyedDrawItems,normalizeDrawRange} from '../src/opening-blind-range.js';
import {THEME_IDS,themeDraw} from '../src/themes.js';
import {blindBoxAssetCandidates} from '../src/asset-source.js';

const all=()=>[{id:2,title:'清晨',body:'清晨原文'},{id:7,title:'隐藏雨夜',body:'雨夜原文'},{id:9,body:'当前原文',isCurrent:true},{id:12,body:''}];
test('filtered mode preserves the existing eligible intersection and never broadens an empty result',()=>{
 assert.deepEqual(drawRangePool(all(),[all()[1],all()[2]],normalizeDrawRange()).map(item=>item.id),[7]);
 assert.deepEqual(drawRangePool(all(),[],normalizeDrawRange()),[]);
});
test('manual range includes selected hidden original IDs, excludes current/empty bodies and never falls back',()=>{
 const items=all(),original=JSON.stringify(items),keyed=keyedDrawItems(items);
 assert.deepEqual(drawRangePool(items,[items[0]],{mode:'manual',keys:[keyed[1].drawKey,keyed[2].drawKey]}).map(item=>item.id),[7]);
 assert.deepEqual(drawRangePool(items,items,{mode:'manual',keys:[]}),[]);assert.equal(JSON.stringify(items),original);
});
test('saved identities follow different bodies through reordering and rename, but reset when text changes',()=>{
 const items=all(),key=keyedDrawItems(items)[1].drawKey;
 assert.deepEqual(drawRangePool([{...items[1],id:0,title:'改名'},items[0]],[],{mode:'manual',keys:[key]}).map(item=>item.id),[0]);
 assert.deepEqual(drawRangePool([{...items[1],body:'已修改正文'}],[],{mode:'manual',keys:[key]}),[]);
 const duplicated=keyedDrawItems([items[0],{...items[0],id:8}]);assert.notEqual(duplicated[0].drawKey,duplicated[1].drawKey);
});
test('preferences are shared by avatar, isolated between cards, validated and retained temporarily on denied storage',()=>{
 const data=new Map(),host={localStorage:{getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)}};
 const a=createOpeningDrawRange(host,'甲.png'),b=createOpeningDrawRange(host,'甲.png'),c=createOpeningDrawRange(host,'乙.png');
 const key=keyedDrawItems(all())[1].drawKey;assert.equal(a.set({mode:'manual',keys:[key,key,'invalid']}).persisted,true);
 assert.deepEqual(b.read(),{mode:'manual',keys:[key]});assert.equal(c.read().mode,'filtered');
 a.set({mode:'manual',keys:[]});assert.deepEqual(b.read(),{mode:'manual',keys:[]});
 const denied=createOpeningDrawRange({localStorage:{getItem(){throw Error('denied')},setItem(){throw Error('denied')}}},'甲.png');
 assert.equal(denied.set({mode:'manual',keys:[key]}).persisted,false);assert.deepEqual(denied.read(),{mode:'manual',keys:[key]});
 assert.deepEqual(normalizeDrawRange({mode:'bad',keys:['invalid']}),{mode:'filtered',keys:[]});
});
test('all sixteen catalog themes have distinct draw names and distinct immutable matching card-back URLs',()=>{
 assert.equal(new Set(THEME_IDS.map(id=>themeDraw(id).title)).size,16);
 const urls=THEME_IDS.map(id=>blindBoxAssetCandidates('card-back',id));
 assert.equal(new Set(urls.map(value=>value[0])).size,16);
 for(let i=0;i<urls.length;i++){assert.equal(urls[i].length,3);assert.match(urls[i][0],new RegExp('@[a-f0-9]{40}/assets/blind-box/card-backs/'+THEME_IDS[i]+'\\.webp$'))}
 assert.deepEqual(themeDraw('bad'),themeDraw('archive'));assert.deepEqual(blindBoxAssetCandidates('card-back','bad'),blindBoxAssetCandidates('card-back','archive'));
});
