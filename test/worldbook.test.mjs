import assert from 'node:assert/strict';
import {extractWorldbookPeople,createWorldbookPeopleReader,renderWorldbookPeopleList} from '../src/worldbook-people.js';
import {detectGreetingPeople,detectGreetingCollection} from '../src/player.js';

const entries=[
  {name:'人物速览',enabled:true,content:'| 编号 | 姓名 | 身份 |\n| --- | --- | --- |\n| 1 | 沈挽昼 | 同伴 |\n| 2 | 林安安 | 同学 |\n- Alice：旅人\n- 爱丽丝·温特（女）：医生'},
  {name:'【人物】沈挽昼',enabled:true,content:'姓名：沈挽昼\n年龄：18',strategy:{keys:['沈挽昼','挽昼','小沈','哥哥']}},
  {name:'陆斯年',enabled:true,content:'他背着一把枪。',strategy:{keys:['陆斯年','斯年','魔法']}},
  {name:'暮迟市',enabled:true,content:'城市设定'},
  {name:'红色预警',enabled:true,content:'危险提示'},
  {name:'【人物】禁用角色',enabled:false,content:'姓名：张三'},
];
const people=extractWorldbookPeople([{name:'暮迟人物书',entries}]);
assert.deepEqual(people.map(x=>x.name),['沈挽昼','林安安','Alice','爱丽丝·温特','陆斯年']);
assert.equal(people.find(x=>x.name==='沈挽昼').trusted,true);
assert.deepEqual(people.find(x=>x.name==='沈挽昼').aliases,['挽昼','小沈']);
assert.equal(people.find(x=>x.name==='陆斯年').trusted,true);
assert.deepEqual(new Set(detectGreetingPeople('<正文>小沈推开门，林安安站在走廊里。</正文>',{worldbookPeople:people}).names),new Set(['沈挽昼','林安安']));
assert.equal(detectGreetingPeople('Alice：快跑。',{worldbookPeople:people}).evidence.Alice,'台词署名');
assert.deepEqual(detectGreetingPeople('姓名：爱丽丝·温特').names,['爱丽丝·温特']);
assert.deepEqual(detectGreetingPeople('登场人物：沈挽昼、林安安').names,['沈挽昼','林安安']);
assert.deepEqual(detectGreetingPeople('场景名称：暮迟一中\n<红色预警>“危险，请撤离。”</红色预警>').names,[]);
const matched=detectGreetingCollection(['陆斯年看向你。','只有雨声。'],{worldbookPeople:people});
assert.deepEqual(matched[0].names,['陆斯年']);assert.deepEqual(matched[0].suggestions,[]);assert.deepEqual(matched[1].names,[]);
assert.ok(people[0].sources.some(source=>source.includes('人物速览')));
const mixed=extractWorldbookPeople([{name:'混合书',entries:[{name:'世界设定',content:'## 人物速览\n- 林安安：同学\n## 地点\n- 槐安公寓：住处'}]}]);
assert.deepEqual(mixed.map(x=>x.name),['林安安']);

let reads=0;
const helper={getCharWorldbookNames:()=>({primary:'主世界书',additional:['主世界书','附加世界书']}),getWorldbook:async name=>{reads++;return name==='主世界书'?entries:[{name:'人物速览',content:'楚泽：哥哥'}]}};
const read=createWorldbookPeopleReader(helper),card={avatar:'a.png',data:{character_book:{entries:[{comment:'人物档案',content:'姓名：王小雨',key:['小雨']}]}}};
const result=await read(card);assert.equal(reads,2);assert.ok(!result.people.some(x=>x.name==='王小雨'));assert.ok(result.people.some(x=>x.name==='楚泽'));
await read(card);assert.equal(reads,2);
await read(card,{refresh:true});assert.equal(reads,4);
await read({...card,avatar:'b.png'});assert.equal(reads,6);
const failed=createWorldbookPeopleReader({getCharWorldbookNames:()=>({primary:'失效书',additional:[]}),getWorldbook:async()=>{throw Error('missing')}});
const fallback=await failed(card);assert.deepEqual(fallback.people.map(x=>x.name),[]);assert.ok(fallback.warnings.length);
const unsupported=await createWorldbookPeopleReader({})(card);assert.deepEqual(unsupported.people.map(x=>x.name),[]);assert.ok(unsupported.warnings.length);
console.log('Worldbook cast overview, aliases, matching, caching and bound-only reads passed');

// The initial dictionary must be accurate before any greeting is considered.
const tricky=extractWorldbookPeople([{name:'绑定书',entries:[
 {name:'人物速览',content:'| 身份 | 别名 | 姓名 |\n| --- | --- | --- |\n| 同学 | 小林 | 林安安 |\n### 王明月\n这是一段描述人物的文字。\n她是医生\n## 地点\n- 梧桐公寓：宿舍'},
 {name:'林安安',content:'没有姓名字段的详细经历。',strategy:{keys:['林安安','安安','小月','教室']}},
 {name:'【角色】王明月',content:'年龄：20',strategy:{keys:['王明月','小月']}},
 {name:'人物：王明',content:'性别：男'},
 {name:'蓝色雨幕',content:'普通环境描述'},
 {name:'槐安公寓',content:'地点：宿舍',strategy:{keys:['槐安公寓']}},
 {name:'人物档案',content:'<name>爱丽丝·温特</name>\n昵称：丽丝',strategy:{keys:['爱丽丝·温特']}},
 {name:'人物档案',content:'{"name":"Alice Winter","age":18}',strategy:{keys:['Alice']}},
 {name:'双人档案',content:'姓名：张三\n姓名：李四',strategy:{keys:['小张']}},
]}]);
assert.deepEqual(tricky.map(p=>p.name),['林安安','王明月','王明','爱丽丝·温特','Alice Winter','张三','李四']);
assert.deepEqual(tricky[0].aliases,['小林','安安','小月']);
assert.deepEqual(tricky[0].ambiguousAliases,['小月']);
assert.ok(!tricky.find(p=>p.name==='张三').aliases.includes('小张'));
assert.deepEqual(detectGreetingPeople('小月到了。',{worldbookPeople:tricky}).names,[],'conflicting keyword is not silently assigned');
assert.deepEqual(detectGreetingPeople('王明月端着盘子。',{worldbookPeople:tricky}).names,['王明月'],'shorter canonical name is masked');
assert.deepEqual(detectGreetingPeople('<隐藏 data-person="安安">小林端着盘子</隐藏><!-- 丽丝 -->```Alice Winter```',{worldbookPeople:tricky}).names.sort(),['林安安','爱丽丝·温特','Alice Winter'].sort());
assert.deepEqual(detectGreetingPeople('<王明月/>',{worldbookPeople:tricky}).names,['王明月']);
assert.deepEqual(detectGreetingPeople('Malice Alice2 _Alice Alice',{worldbookPeople:tricky}).names,['Alice Winter']);
assert.deepEqual(detectGreetingPeople('姓名：蓝色雨幕\n沈挽昼：你好。',{worldbookPeople:tricky}).names,[],'dictionary mode does not guess new people');
assert.deepEqual(detectGreetingPeople('小月到了。',{worldbookPeople:tricky,aliases:'王明月=小月'}).names,['王明月']);
assert.deepEqual(detectGreetingPeople('姓名：张三',{worldbookPeople:[]}).names,[]);
assert.deepEqual(extractWorldbookPeople([{name:'无依据',entries:[{name:'陆斯年',content:'他背着一把枪。'}]}]),[]);
const readOnlyBound=createWorldbookPeopleReader({getCharWorldbookNames:()=>({primary:'绑定书',additional:[]}),getWorldbook:async name=>{assert.equal(name,'绑定书');return []}});
assert.deepEqual((await readOnlyBound(card)).people,[]);

// Source text is displayed literally; nothing from the worldbook becomes HTML.
const fakeDoc={createElement(tag){return {tag,textContent:'',children:[],append(...nodes){this.children.push(...nodes)},replaceChildren(...nodes){this.children=nodes}}}};
const list=fakeDoc.createElement('ul');
renderWorldbookPeopleList(fakeDoc,list,[{name:'林安安',aliases:['安安'],ambiguousAliases:['安安'],sources:['<img src=x onerror=alert(1)>']}]);
assert.equal(list.children.length,1);assert.equal(list.children[0].children[0].textContent,'林安安');
assert.match(list.children[0].children[1].textContent,/冲突别名不自动匹配：安安/);
assert.equal(list.children[0].children[2].textContent,'来源：<img src=x onerror=alert(1)>');
renderWorldbookPeopleList(fakeDoc,list,[]);assert.equal(list.children.length,1);assert.match(list.children[0].textContent,/未提取/);

assert.deepEqual(extractWorldbookPeople([{name:'人物书',entries:[{name:'人物档案',content:'姓名：那维莱特'},{name:'人物档案',content:'姓名：我妻由乃'}]}]).map(p=>p.name),['那维莱特','我妻由乃']);
