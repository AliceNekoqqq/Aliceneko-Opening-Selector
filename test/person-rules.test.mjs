import assert from 'node:assert/strict';
import {extractWorldbookPeople,extractPersonIdentities} from '../src/worldbook-people.js';
import {detectGreetingPeople,detectGreetingCollection,personAliases,resolveDisplayEntry} from '../src/player.js';
const book=(entries,diagnostics=[])=>extractWorldbookPeople([{name:'规则审查书',entries}],{diagnostics});
const trusted=entries=>book(entries).filter(p=>p.trusted).map(p=>p.name).sort();
const negatives=[
 ['weapon JSON',{name:'武器图鉴',content:'{"type":"weapon","name":"月光"}'}],
 ['organization JSON',{name:'设定',content:'{"name":"黑潮","type":"organization"}'}],
 ['item display name',{name:'物品档案',content:'物品名称：许愿石\n名字：许愿石'}],
 ['item personal-shaped field',{name:'武器档案',content:'姓名：青霜'}],
 ['item XML in a person profile',{name:'人物档案',content:'<item><name>青霜</name></item>'}],
 ['place named in prose',{name:'地理',content:'这座城市名叫黑潮。'}],
 ['negated prose',{name:'规则',content:'她不叫做苏晚。'}],
 ['unscoped name',{name:'资料',content:'name: Black Tide'}],
 ['unscoped 名字',{name:'资料',content:'名字：月光'}],
 ['quoted example',{name:'世界',content:'## 字段示例\n姓名：月光'}],
 ['XML example',{name:'资料',content:'<example>姓名：月光</example>'}],
 ['cast XML example',{name:'人物速览',content:'<example>\n- 月光：示例角色\n</example>\n- 林安安：同学'},['林安安']],
 ['JSON example',{name:'资料',content:'<example>{"type":"person","name":"月光"}</example>'}],
 ['inventory object',{name:'人物档案',content:'{"type":"person","name":"林安安","inventory":{"type":"weapon","name":"青霜"}}'},['林安安']],
 ['item JSON in XML person',{name:'人物档案',content:'<character>{"name":"青霜","type":"item"}</character>'}],
 ['cast sibling sections',{name:'世界',content:'## 人物速览\n- 林安安：同学\n## 天气\n- 阴雨：常见天气\n## 物资\n- 白雾：烟幕弹'},['林安安']],
 ['cast entry subsection',{name:'人物名单',content:'- 林安安：同学\n## 天气\n- 阴雨：常见天气'},['林安安']],
 ['narrative mentions a cast list',{name:'世界',content:'这份人物名单里写着：\n- 白雾：天气'}],
 ['cast name column changes',{name:'人物速览',content:'| 姓名 | 身份 |\n| --- | --- |\n| 林安安 | 同学 |\n\n| 地点 | 状态 |\n| --- | --- |\n| 阴雨 | 安全 |'},['林安安']],
];
for(const [label,entry,expected=[]] of negatives)assert.deepEqual(trusted([entry]),expected,label);
assert.deepEqual(book([{name:'月光',content:'{"name":"月光","type":"weapon"}'}]),[],'a definite non-person entity must not leak back as a title candidate');
const openings=[
 ['人物名单：\n- 白雾弥漫的走廊',[]],
 ['姓名：林安安\n在场角色：\n- 林安安的照片',['林安安']],
 ['<item>姓名：青霜</item>',[]],
 ['## 字段示例\n姓名：月光',[]],
 ['<example>姓名：月光</example>',[]],
 ['<example>登场人物：月光</example>',[]],
 ['<example>在场角色：\n- 张三\n</example>',[]],
];
for(const [text,expected] of openings)assert.deepEqual(detectGreetingPeople(text).names,expected,text);
const mislinked=book([{name:'张三',content:'姓名：张三'},{name:'人物资料',keys:['张三'],content:'别名：李四'}]);
assert.deepEqual(mislinked.find(p=>p.name==='张三').aliases,[]);
assert.deepEqual(detectGreetingPeople('李四来了。',{worldbookPeople:mislinked}).names,[]);
const nestedAlias=book([{name:'人物档案',content:'姓名：张三\n昵称：阿三\n<item>\n名字：青霜\n昵称：阿霜\n</item>'}]);
assert.deepEqual(nestedAlias[0].aliases,['阿三']);
const collision=[{name:'王明',trusted:true,aliases:[]},{name:'王明月',trusted:false,aliases:[]}];
assert.deepEqual(detectGreetingPeople('王明月站在门口。',{worldbookPeople:collision}).names,[]);
assert.deepEqual(detectGreetingPeople('王明站在门口。',{worldbookPeople:collision}).names,['王明']);
const rules='张三=小张\n李四=小张';
assert.deepEqual(personAliases(rules).conflicts,['小张']);
assert.deepEqual(detectGreetingPeople('小张来了。',{aliases:rules}).names,[]);
assert.deepEqual(detectGreetingPeople('姓名：小张',{aliases:rules}).names,[]);
assert.deepEqual(detectGreetingPeople('小张来了。',{aliases:rules,worldbookPeople:[{name:'张三',trusted:true,aliases:['小张']}]}).names,[]);
assert.deepEqual(detectGreetingPeople('小张来了。',{aliases:'张三=小张'}).names,['张三']);
assert.deepEqual(detectGreetingPeople('姓名：小张',{aliases:rules,characterName:'小张'}).names,[]);
assert.deepEqual(detectGreetingPeople('小张来了。',{aliases:rules,worldbookPeople:[{name:'小张',trusted:true,aliases:[]}]}).names,['小张'],'an independently confirmed canonical name keeps its own identity');
for(const content of ['姓名：林安安','{"type":"person","name":"林安安"}','{"name":"林安安","gender":"female"}','<character><name>林安安</name></character>','她名叫林安安。','| 姓名 | 林安安 |'])assert.deepEqual(trusted([{name:'资料',content}]),['林安安'],content);
assert.deepEqual(trusted([{name:'人物资料',content:'name: Alice Winter'}]),['Alice Winter']);
assert.deepEqual(trusted([{name:'人物速览',content:'姓名 | 别名\n--- | ---\n林安安 | 安安'}]),['林安安']);
assert.deepEqual(detectGreetingCollection(['姓名：林安安','林安安站在窗边。']).map(x=>x.names),[['林安安'],['林安安']]);
assert.deepEqual(resolveDisplayEntry({body:'正文',names:[],index:0},{names:'人工特殊姓名'}).names,['人工特殊姓名']);
assert.deepEqual(resolveDisplayEntry({body:'正文',names:['林安安'],index:0},{names:''}).names,[]);
assert.deepEqual(extractPersonIdentities('姓名：林安安\n\n物品名称：许愿石\n名字：许愿石').filter(p=>p.trusted).map(p=>p.name),['林安安'],'unrelated paragraphs must not suppress a person field');
const asyncPrimary=await (await import('../src/worldbook-people.js')).createWorldbookPeopleReader({getCurrentCharPrimaryLorebook:async()=> '人物书',getWorldbook:async()=>[{name:'人物档案',content:'姓名：林安安'}]})({avatar:'async.png'});
assert.deepEqual(asyncPrimary.people.map(p=>p.name),['林安安']);
console.log('Person-rule audit: scoped fields, cast boundaries, false list splitting, alias ownership/conflicts, overlap, manual overrides and positive identities passed');
