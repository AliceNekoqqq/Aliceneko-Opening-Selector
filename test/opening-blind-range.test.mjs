import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createOpeningDrawRange,drawRangePool,keyedDrawItems,normalizeDrawRange} from '../src/opening-blind-range.js';
import {THEME_IDS,themeDraw} from '../src/themes.js';
import {blindBoxAssetCandidates} from '../src/asset-source.js';

const defaults={handSize:3,performances:true,pools:[],activePoolId:null};
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
 assert.deepEqual(b.read(),{...defaults,mode:'manual',keys:[key]});assert.equal(c.read().mode,'filtered');
 a.set({...defaults,mode:'manual',keys:[]});assert.deepEqual(b.read(),{...defaults,mode:'manual',keys:[]});
 const denied=createOpeningDrawRange({localStorage:{getItem(){throw Error('denied')},setItem(){throw Error('denied')}}},'甲.png');
 assert.equal(denied.set({mode:'manual',keys:[key]}).persisted,false);assert.deepEqual(denied.read(),{...defaults,mode:'manual',keys:[key]});
 assert.deepEqual(normalizeDrawRange({mode:'bad',keys:['invalid']}),{...defaults,mode:'filtered',keys:[]});
});
test('all catalog themes have distinct draw names and distinct immutable matching card-back URLs',()=>{
 assert.equal(new Set(THEME_IDS.map(id=>themeDraw(id).title)).size,THEME_IDS.length);
 const urls=THEME_IDS.map(id=>blindBoxAssetCandidates('card-back',id));
 assert.equal(new Set(urls.map(value=>value[0])).size,THEME_IDS.length);
 for(let i=0;i<urls.length;i++){assert.equal(urls[i].length,3);assert.match(urls[i][0],new RegExp('@[a-f0-9]{40}/assets/blind-box/card-backs/'+THEME_IDS[i]+'\\.webp$'))}
 assert.deepEqual(themeDraw('bad'),themeDraw('archive'));assert.deepEqual(blindBoxAssetCandidates('card-back','bad'),blindBoxAssetCandidates('card-back','archive'));
});
test('old v1 ranges retain their selections and acquire safe draw defaults without rewriting storage',()=>{
 const key=keyedDrawItems(all())[1].drawKey,raw=JSON.stringify({version:1,mode:'manual',keys:[key]});let writes=0;
 const store=createOpeningDrawRange({localStorage:{getItem:()=>raw,setItem:()=>writes++}},'旧卡.png');
 assert.deepEqual(store.read(),{...defaults,mode:'manual',keys:[key]});assert.equal(writes,0);
 assert.deepEqual(drawRangePool(all(),[],store.read()).map(item=>item.id),[7]);
});
test('named pools validate identity and settings, detach edited scopes and never expand empty pools',()=>{
 const key=keyedDrawItems(all())[1].drawKey,prefs=normalizeDrawRange({mode:'manual',keys:[key],handSize:'5',performances:false,activePoolId:'pool-1',pools:[{id:'pool-1',name:'  番外  ',keys:[key,key,'bad']},{id:'pool-1',name:'重复',keys:[]},{id:'unsafe/id',name:'bad'},{id:'empty',name:'空池',keys:[]}]});
 assert.equal(prefs.handSize,5);assert.equal(prefs.performances,false);assert.equal(prefs.activePoolId,'pool-1');assert.equal(prefs.pools.length,2);assert.equal(prefs.pools[0].name,'番外');
 assert.equal(normalizeDrawRange({...prefs,keys:[]}).activePoolId,null);assert.equal(normalizeDrawRange({...prefs,mode:'filtered'}).activePoolId,null);
 assert.equal(normalizeDrawRange({handSize:100,performances:'bad'}).handSize,3);assert.equal(normalizeDrawRange({performances:'bad'}).performances,true);
 const empty=normalizeDrawRange({...prefs,keys:[],activePoolId:'empty'});assert.equal(empty.activePoolId,'empty');assert.deepEqual(drawRangePool(all(),all(),empty),[]);
});
test('pool settings persist by avatar, deep copies cannot mutate storage and memberships follow original bodies',()=>{
 const data=new Map(),host={localStorage:{getItem:key=>data.get(key)||null,setItem:(key,value)=>data.set(key,value)}},key=keyedDrawItems(all())[1].drawKey;
 const a=createOpeningDrawRange(host,'甲.png'),b=createOpeningDrawRange(host,'甲.png');a.set({mode:'manual',keys:[key],handSize:5,performances:false,activePoolId:'pool-1',pools:[{id:'pool-1',name:'番外',keys:[key]}]});
 const prefs=b.read();prefs.pools[0].keys.length=0;prefs.keys.length=0;assert.equal(b.read().pools[0].keys.length,1);assert.equal(b.read().handSize,5);assert.equal(createOpeningDrawRange(host,'乙.png').read().pools.length,0);
 assert.deepEqual(drawRangePool([{...all()[1],id:99,title:'改名'},all()[0]],[],b.read()).map(item=>item.id),[99]);
 assert.deepEqual(drawRangePool([{...all()[1],body:'新正文'}],[],b.read()),[]);
});
