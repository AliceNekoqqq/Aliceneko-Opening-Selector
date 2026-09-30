import assert from 'node:assert/strict';
import {extractWorldbookPeople,createWorldbookPeopleReader} from '../src/worldbook-people.js';
import {detectGreetingPeople,detectGreetingCollection} from '../src/player.js';

const entries=[
  {name:'人物速览',enabled:true,content:'| 编号 | 姓名 | 身份 |\n| --- | --- | --- |\n| 1 | 沈挽昼 | 同伴 |\n| 2 | 林安安 | 同学 |\n- Alice：旅人\n- 爱丽丝·温特（女）：医生'},
  {name:'【人物】沈挽昼',enabled:true,content:'姓名：沈挽昼\n年龄：18',strategy:{keys:['沈挽昼','挽昼','小沈','哥哥']}},
  {name:'陆斯年',enabled:true,content:'他背着一把枪。'},
  {name:'暮迟市',enabled:true,content:'城市设定'},
  {name:'红色预警',enabled:true,content:'危险提示'},
  {name:'【人物】禁用角色',enabled:false,content:'姓名：张三'},
];
const people=extractWorldbookPeople([{name:'暮迟人物书',entries}]);
assert.deepEqual(people.map(x=>x.name),['沈挽昼','林安安','Alice','爱丽丝·温特','陆斯年']);
assert.equal(people.find(x=>x.name==='沈挽昼').trusted,true);
assert.deepEqual(people.find(x=>x.name==='沈挽昼').aliases,['挽昼','小沈']);
assert.equal(people.find(x=>x.name==='陆斯年').trusted,false);
assert.deepEqual(new Set(detectGreetingPeople('<正文>小沈推开门，林安安站在走廊里。</正文>',{worldbookPeople:people}).names),new Set(['沈挽昼','林安安']));
assert.equal(detectGreetingPeople('Alice：快跑。',{worldbookPeople:people}).evidence.Alice,'台词署名');
assert.deepEqual(detectGreetingPeople('姓名：爱丽丝·温特').names,['爱丽丝·温特']);
assert.deepEqual(detectGreetingPeople('登场人物：沈挽昼、林安安').names,['沈挽昼','林安安']);
assert.deepEqual(detectGreetingPeople('场景名称：暮迟一中\n<红色预警>“危险，请撤离。”</红色预警>').names,[]);
const matched=detectGreetingCollection(['陆斯年看向你。','只有雨声。'],{worldbookPeople:people});
assert.deepEqual(matched[0].names,[]);assert.deepEqual(matched[0].suggestions,['陆斯年']);assert.deepEqual(matched[1].names,[]);
assert.ok(people[0].sources.some(source=>source.includes('人物速览')));
const mixed=extractWorldbookPeople([{name:'混合书',entries:[{name:'世界设定',content:'## 人物速览\n- 林安安：同学\n## 地点\n- 槐安公寓：住处'}]}]);
assert.deepEqual(mixed.map(x=>x.name),['林安安']);

let reads=0;
const helper={getCharWorldbookNames:()=>({primary:'主世界书',additional:['主世界书','附加世界书']}),getWorldbook:async name=>{reads++;return name==='主世界书'?entries:[{name:'人物速览',content:'楚泽：哥哥'}]}};
const read=createWorldbookPeopleReader(helper),card={avatar:'a.png',data:{character_book:{entries:[{comment:'人物档案',content:'姓名：王小雨',key:['小雨']}]}}};
const result=await read(card);assert.equal(reads,2);assert.ok(result.people.some(x=>x.name==='王小雨'));assert.ok(result.people.some(x=>x.name==='楚泽'));
await read(card);assert.equal(reads,2);
await read(card,{refresh:true});assert.equal(reads,4);
await read({...card,avatar:'b.png'});assert.equal(reads,6);
const failed=createWorldbookPeopleReader({getCharWorldbookNames:()=>({primary:'失效书',additional:[]}),getWorldbook:async()=>{throw Error('missing')}});
const fallback=await failed(card);assert.deepEqual(fallback.people.map(x=>x.name),['王小雨']);assert.ok(fallback.warnings.length);
const unsupported=await createWorldbookPeopleReader({})(card);assert.deepEqual(unsupported.people.map(x=>x.name),['王小雨']);assert.ok(unsupported.warnings.length);
console.log('Worldbook cast overview, aliases, matching, caching and read fallback passed');
