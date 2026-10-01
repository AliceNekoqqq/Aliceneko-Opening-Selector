import assert from 'node:assert/strict';
import {extractWorldbookPeople,createWorldbookPeopleReader,renderWorldbookPeopleList,formatWorldbookPeopleStatus} from '../src/worldbook-people.js';
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
assert.deepEqual(tricky.filter(p=>p.trusted).map(p=>p.name),['林安安','王明月','王明','爱丽丝·温特','Alice Winter','张三','李四']);
assert.deepEqual(tricky[0].aliases,['小林','安安','小月']);
assert.deepEqual(tricky[0].ambiguousAliases,['小月']);
assert.ok(!tricky.find(p=>p.name==='张三').aliases.includes('小张'));
assert.deepEqual(detectGreetingPeople('小月到了。',{worldbookPeople:tricky}).names,[],'conflicting keyword is not silently assigned');
assert.deepEqual(detectGreetingPeople('王明月端着盘子。',{worldbookPeople:tricky}).names,['王明月'],'shorter canonical name is masked');
assert.deepEqual(detectGreetingPeople('<隐藏 data-person="安安">小林端着盘子</隐藏><!-- 丽丝 -->```Alice Winter```',{worldbookPeople:tricky}).names.sort(),['林安安','爱丽丝·温特','Alice Winter'].sort());
assert.deepEqual(detectGreetingPeople('<王明月/>',{worldbookPeople:tricky}).names,['王明月']);
assert.deepEqual(detectGreetingPeople('Malice Alice2 _Alice Alice',{worldbookPeople:tricky}).names,['Alice Winter']);
assert.deepEqual(detectGreetingPeople('姓名：蓝色雨幕\n沈挽昼：你好。',{worldbookPeople:tricky}).names,['蓝色雨幕'],'explicit name fields supplement an incomplete dictionary without guessing dialogue labels');
assert.deepEqual(detectGreetingPeople('小月到了。',{worldbookPeople:tricky,aliases:'王明月=小月'}).names,['王明月']);
assert.deepEqual(detectGreetingPeople('姓名：张三',{worldbookPeople:[]}).names,['张三']);
assert.deepEqual(extractWorldbookPeople([{name:'人物线索',entries:[{name:'陆斯年',content:'他背着一把枪。'}]}]).map(p=>p.name),['陆斯年']);
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

// beta.5 regression: loading an empty/failed book used to erase all explicit people.
const openingBodies=[
 '<SceneInfo>在场角色：沈挽昼、林安安</SceneInfo><正文>她们站在门边。</正文>',
 '<姓名>沈挽昼</姓名><content>林安安：快走。</content>',
 '<正文>沈挽昼端着盘子，林安安整理绷带。</正文>',
];
const failedRead=await failed(card);
const emptyRead=await readOnlyBound(card);
for(const result of [failedRead,emptyRead,unsupported]){
 const identified=detectGreetingCollection(openingBodies,{worldbookPeople:result.people});
 for(const opening of identified)assert.deepEqual(new Set(opening.names),new Set(['沈挽昼','林安安']));
 assert.match(formatWorldbookPeopleStatus(result),/继续识别正文/);
}
const partialPeople=[{name:'沈挽昼',aliases:['小沈'],sources:[]}];
const partial=detectGreetingCollection(['<姓名>林安安</姓名>','林安安端着盘子。小沈整理绷带。'],{worldbookPeople:partialPeople});
assert.deepEqual(partial[0].names,['林安安']);assert.deepEqual(new Set(partial[1].names),new Set(['林安安','沈挽昼']));
assert.deepEqual(detectGreetingPeople('小月到了。',{worldbookPeople:tricky}).names,[],'fallback must not reassign ambiguous aliases');

// Official deprecated helper APIs use comment/keys, not name/strategy.keys.
const legacyCard={avatar:'legacy.png',data:{extensions:{world:'角色绑定书'},character_book:{entries:[{name:'人物档案',content:'姓名：不该读取'}]}}};
const legacyEntries=[{comment:'人物档案：沈挽昼',enabled:true,content:'性别：女',keys:['沈挽昼','小沈']},{comment:'人物速览',enabled:true,content:'- 林安安：同学'}];
let legacyBooks=[];
const legacyHelper={marker:true,getCharLorebooks(options){assert.equal(this.marker,true);assert.deepEqual(options,{name:'current',type:'all'});return {primary:'角色绑定书',additional:[]}},getLorebookEntries(name){legacyBooks.push(name);return Promise.resolve(legacyEntries)}};
const legacyResult=await createWorldbookPeopleReader(legacyHelper)(legacyCard);
assert.deepEqual(legacyBooks,['角色绑定书']);assert.equal(legacyResult.warnings.length,0);
assert.deepEqual(legacyResult.people.map(p=>p.name),['沈挽昼','林安安']);
assert.deepEqual(legacyResult.people[0].aliases,['小沈']);
assert.deepEqual(new Set(detectGreetingPeople('小沈端着盘子。<人物>林安安</人物>',{worldbookPeople:legacyResult.people}).names),new Set(['沈挽昼','林安安']));
assert.match(formatWorldbookPeopleStatus(legacyResult),/已读取 1\/1 本，2 条/);

let boundOnlyCalls=[];
const cardBindingResult=await createWorldbookPeopleReader({getWorldbook(name){boundOnlyCalls.push(name);return Promise.resolve(legacyEntries)}})(legacyCard);
assert.deepEqual(boundOnlyCalls,['角色绑定书']);assert.ok(cardBindingResult.people.some(p=>p.name==='沈挽昼'));
assert.ok(cardBindingResult.warnings.some(x=>x.includes('保存的主世界书绑定')));
assert.ok(!cardBindingResult.people.some(p=>p.name==='不该读取'));

// Methods can be exposed on different frames and arrive after the first mount.
let lateSources=[{setChatMessages(){}}];const readLate=createWorldbookPeopleReader(()=>lateSources);
assert.equal((await readLate(card)).people.length,0);
lateSources=[{getCharWorldbookNames:()=>({primary:'角色绑定书',additional:[]})},{getLorebookEntries:async()=>legacyEntries}];
assert.deepEqual((await readLate(card)).people.map(p=>p.name),['沈挽昼','林安安']);
const mixedApiResult=await createWorldbookPeopleReader({
 getCharWorldbookNames(){throw Error('new API unavailable')},getCharLorebooks:()=>({primary:'角色绑定书',additional:[]}),
 getWorldbook(){throw Error('new entry API unavailable')},getLorebookEntries:async()=>legacyEntries,
})(legacyCard);
assert.equal(mixedApiResult.people.length,2);assert.deepEqual(mixedApiResult.warnings,[]);
const noBindingResult=await createWorldbookPeopleReader({getCharWorldbookNames:()=>({primary:null,additional:[]}),getWorldbook(){throw Error('must not read unbound embedded book')}})(legacyCard);
assert.deepEqual(noBindingResult.people,[]);assert.match(formatWorldbookPeopleStatus(noBindingResult),/未绑定世界书/);
assert.deepEqual(extractWorldbookPeople([{name:'人物书',entries:[{name:'[人设]沈挽昼',content:'性别：女',keys:['沈挽昼']},{name:'林安安角色介绍',content:'年龄：18',keys:['林安安']}]}]).map(p=>p.name),['沈挽昼','林安安']);
console.log('Empty-list regression, explicit-name fallback, legacy helper compatibility and delayed APIs passed');

assert.deepEqual(detectGreetingPeople('姓名：小月',{worldbookPeople:tricky}).names,[],'explicit fields cannot invent a canonical person for an ambiguous alias');
assert.deepEqual(detectGreetingPeople('在场角色：\n- 王明月制服',{worldbookPeople:tricky}).names,['王明月']);

// Formats commonly used in real character worldbooks, not just the original narrow fixtures.
const richDiagnostics=[];
const rich=extractWorldbookPeople([{name:'复杂人物书',entries:[
 {name:'01. 【NPC】【核心】沈挽昼（基础设定）',content:'外貌：琥珀色眼瞳',key:['挽昼','小沈']},
 {name:'【角色资料】林安安',content:'| 字段 | 内容 |\n| --- | --- |\n| 姓名 | 「林安安」 |\n| 年龄 | 18 |',keys:['安安']},
 {name:'陆斯年',content:'他背着一把枪。',key:['斯年']},
 {name:'楚泽_人物资料',content:'穿着白色研究服。',key:['楚泽','阿泽']},
 {name:'人物档案',content:'- **全名** = 『爱丽丝·温特』 年龄：20\n- **昵称**：丽丝',key:['Alice']},
 {name:'XML档案',content:'<character name="月"><age>20</age></character>',key:['月']},
 {name:'人物档案',content:'<姓名 class="label">綾波レイ</姓名>',key:['レイ']},
 {name:'人物档案',content:'本名：２Ｂ',key:['2B','ヨルハ二号B型']},
 {name:'人物 · 速览',content:'① 洛青：同学\n②苏晚 - 医生\n3. 顾云 高三女生\n## 宋遥\n简介：她是护士。\n## 地点\n- 青石公寓：住处'},
 {name:'朔夜',content:'纯标题，没有其他人物线索。'},
 {name:'河西医院',content:'地点：暮迟市'},
 {name:'世界规则',content:'请遵守剧情设定。'},
 {name:'人物：禁用姓名',enabled:false,content:'姓名：不可见'},
]}],{diagnostics:richDiagnostics});
assert.deepEqual(rich.filter(p=>p.trusted).map(p=>p.name),['沈挽昼','林安安','陆斯年','楚泽','爱丽丝·温特','月','綾波レイ','2B','洛青','苏晚','顾云','宋遥']);
assert.deepEqual(rich.find(p=>p.name==='沈挽昼').aliases,['挽昼','小沈']);
assert.ok(rich.find(p=>p.name==='林安安').aliases.includes('安安'));
assert.ok(rich.find(p=>p.name==='爱丽丝·温特').aliases.includes('丽丝'));
assert.equal(rich.find(p=>p.name==='朔夜').trusted,false);
assert.ok(richDiagnostics.some(d=>d.title==='河西医院'));
assert.ok(richDiagnostics.some(d=>d.reason.includes('停用')));
const richMatched=detectGreetingPeople('<status>小沈端着盘子，安安收拾绷带，斯年沉默。</status>阿泽来了。丽丝整理药箱。<月/>レイ坐在窗边。２Ｂ站在门口。洛青、苏晚、顾云、宋遥。',{worldbookPeople:rich});
assert.deepEqual(new Set(richMatched.names),new Set(['沈挽昼','林安安','陆斯年','楚泽','爱丽丝·温特','月','綾波レイ','2B','洛青','苏晚','顾云','宋遥']));
assert.deepEqual(detectGreetingPeople('月亮照着雪地。',{worldbookPeople:rich}).names,[],'one-character person must not match within ordinary words');
assert.deepEqual(detectGreetingPeople('朔夜整理药箱。',{worldbookPeople:rich}).names,[]);
assert.deepEqual(detectGreetingPeople('朔夜整理药箱。',{worldbookPeople:rich}).suggestions,['朔夜']);
assert.deepEqual(detectGreetingPeople('姓名：朔夜',{worldbookPeople:rich}).names,['朔夜']);
assert.deepEqual(detectGreetingPeople('朔夜整理药箱。',{worldbookPeople:rich,knownNames:['朔夜']}).names,['朔夜']);
renderWorldbookPeopleList(fakeDoc,list,[],richDiagnostics);
assert.equal(list.children[1].children[0].children[0].tag,'summary');
assert.match(list.children[1].children[0].children[0].textContent,/未采纳原因/);
console.log('Decorated titles, profile tables, full names, XML attributes, cast descriptions and Japanese/digit names passed');

const variants=extractWorldbookPeople([{name:'人物书',entries:[
 {name:'【NPC·003】沈挽昼[异化模式]',keys:['沈挽昼','小沈'],content:'外貌：琥珀色眼瞳'},
 {name:'人物档案',keys:['林安安','安安'],content:'性别：女\n年龄：18'},
 {name:'空标题资料',content:'她名叫苏晚，是医院的护士。'},
 {name:'人物档案',content:'姓名：田中 太郎',keys:['太郎']},
 {name:'急救箱',content:'物品名称：急救箱'},
]}]);
assert.deepEqual(variants.filter(p=>p.trusted).map(p=>p.name),['沈挽昼','林安安','苏晚','田中 太郎']);
assert.ok(variants.find(p=>p.name==='沈挽昼').aliases.includes('小沈'));
assert.ok(variants.find(p=>p.name==='林安安').aliases.includes('安安'));
assert.ok(variants.find(p=>p.name==='田中 太郎').aliases.includes('田中太郎'));
assert.ok(!variants.some(p=>p.name==='急救箱'));
assert.deepEqual(detectGreetingPeople('田中太郎端着盘子。',{worldbookPeople:variants}).names,['田中 太郎']);
assert.deepEqual(detectGreetingPeople('蓝色雨幕遮住走廊。',{worldbookPeople:tricky}).names,[],'title-only setting candidate must not enter filters');
assert.deepEqual(detectGreetingPeople('蓝色雨幕遮住走廊。',{worldbookPeople:tricky}).suggestions,['蓝色雨幕']);

const weakOnly=extractWorldbookPeople([{name:'环境书',entries:[{name:'蓝色雨幕',content:'落雨的景象。'}]}]);
assert.deepEqual(detectGreetingPeople('林安安：快走。',{worldbookPeople:weakOnly}).names,['林安安'],'a weak-only list must not disable ordinary explicit recognition');
assert.deepEqual(detectGreetingPeople('<姓名>月</姓名>').names,['月']);
const large=extractWorldbookPeople([{name:'多人书',entries:Array.from({length:220},(_,i)=>({name:'人物档案',content:'姓名：顾'+String.fromCodePoint(0x4e00+i)}))}]);
assert.equal(large.length,220,'more than 200 explicit people must be read');

assert.deepEqual(extractWorldbookPeople([{name:'Cast overview',entries:[{name:'Cast',content:'- Alice: doctor\nShe is kind.\nThis is a cast overview.'}]}]).filter(p=>p.trusted).map(p=>p.name),['Alice']);

const itemTitles=extractWorldbookPeople([{name:'物资书',entries:[{name:'消防斧',keys:['消防斧'],content:'长柄的救援工具。'},{name:'急救箱',keys:['急救箱'],content:'内有绷带与消炎药。'}]}]);
assert.ok(itemTitles.every(p=>p.trusted===false),'a Chinese item title matching its own keyword is not enough to confirm a person');
assert.deepEqual(detectGreetingPeople('拿起消防斧和急救箱。',{worldbookPeople:itemTitles}).names,[]);

// User screenshot: NPC·姓名·NSFW used to merge many entries into a person named NSFW.
const cruiseNames=['范婼慧','尹以菽','洛言舟','陆斯年','顾之遥','裴衍','沈既明','江曜'];
const cruise=extractWorldbookPeople([{name:'银趴邮轮世界书',entries:cruiseNames.map((name,i)=>({
 name:`NPC·${name}·NSFW`,keys:['NSFW',name,`小${name.slice(1)}`,'SFW',cruiseNames[(i+1)%cruiseNames.length]],content:'性格：沉稳',
}))}]);
assert.deepEqual(cruise.map(p=>p.name),cruiseNames);
assert.ok(cruise.every(p=>p.trusted&&p.sources.length===1));
assert.ok(cruise.every(p=>!p.aliases.includes('NSFW')&&!p.aliases.includes('SFW')));
assert.deepEqual(cruise[0].aliases,['小婼慧'],'other canonical names in relationship activation keys are not aliases');
for(const name of cruiseNames)assert.deepEqual(detectGreetingPeople(`<正文>${name}走进房间。</正文>`,{worldbookPeople:cruise}).names,[name]);
assert.deepEqual(detectGreetingPeople('NSFW SFW R18',{worldbookPeople:cruise}).names,[]);
assert.deepEqual(detectGreetingPeople('姓名：NSFW\n<NSFW>提示</NSFW>').names,[]);

const taggedNames=extractWorldbookPeople([{name:'标题格式书',entries:[
 {name:'NSFW·NPC·沈挽昼·基础·核心',keys:['NSFW','沈挽昼','小沈'],content:'性别：女'},
 {name:'【NPC·003】【NSFW】林安安【SFW】',keys:['NSFW','林安安','安安'],content:'年龄：18'},
 {name:'NPC｜陆斯年｜SFW',keys:['SFW','陆斯年'],content:''},
 {name:'NPC/楚泽/R-18',keys:['R18','楚泽'],content:''},
 {name:'人物：爱丽丝·温特·NSFW',keys:['NSFW','爱丽丝·温特','丽丝'],content:''},
 {name:'NPC·Alice-Marie·SFW',keys:['Alice-Marie','SFW'],content:''},
 {name:'NPC·SFW·NSFW',keys:['NSFW','SFW'],content:'性别：女'},
 {name:'NSFW',keys:['NSFW'],content:'这是内容评级提示。'},
 {name:'人物资料',keys:['NSFW','沈挽昼','小沈'],content:'性格：冷静'},
 {name:'NPC·洛言舟·NSFW',keys:['洛言舟','NSFW'],content:'姓名：洛言舟·Winter\n英文名：Luo'},
]}]);
assert.deepEqual(taggedNames.map(p=>p.name),['沈挽昼','林安安','陆斯年','楚泽','爱丽丝·温特','Alice-Marie','洛言舟·Winter']);
assert.ok(taggedNames.find(p=>p.name==='洛言舟·Winter').aliases.includes('洛言舟'));
assert.ok(taggedNames.find(p=>p.name==='洛言舟·Winter').aliases.includes('Luo'));
assert.ok(taggedNames.every(p=>!p.aliases.some(alias=>/^(NSFW|SFW|R18)$/i.test(alias))));
const titleDiagnostics=[];
const uncertainTitle=extractWorldbookPeople([{name:'多人标题书',entries:[{name:'NPC·沈挽昼·林安安·NSFW',keys:['NSFW','沈挽昼','林安安'],content:'性格：冷静'}]}],{diagnostics:titleDiagnostics});
assert.deepEqual(uncertainTitle,[],'multiple title people must not be picked by keyword length or assigned as aliases');
assert.match(titleDiagnostics[0].reason,/多个姓名/);
console.log('Real NPC·name·NSFW titles, category keys, rating variants and canonical alias ownership passed');

// Generalization: these labels are deliberately absent from every fixed category list.
for(const [prefix,suffix] of [['CrewBlue','PrivateSheet'],['舟组','夜册'],['CustomAlpha','CustomOmega']]){
 const diagnostic=[];
 const names=['沈挽昼','林安安','陆斯年'];
 const entries=names.map(name=>({name:`${prefix}·${name}·${suffix}`,keys:[suffix,name,'共同触发'],content:'年龄：18'}));
 const inferred=extractWorldbookPeople([{name:'自定义格式',entries}],{diagnostics:diagnostic});
 assert.deepEqual(inferred.map(p=>p.name),names,'unknown repeated wrappers are resolved through independent identities');
 assert.ok(inferred.every(p=>p.trusted&&p.aliases.length===0));
 assert.ok(diagnostic.some(item=>item.reason.includes(prefix)&&item.reason.includes(suffix)));
 assert.ok(diagnostic.some(item=>item.reason.includes('共同触发')));
 assert.deepEqual(detectGreetingPeople('林安安走进房间。共同触发。',{worldbookPeople:inferred}).names,['林安安']);
 assert.deepEqual(extractWorldbookPeople([{name:'自定义格式',entries:[...entries].reverse()}]).map(p=>p.name).sort(),names.sort(),'decisions must not depend on entry order');
}

const sameFamily=extractWorldbookPeople([{name:'复合姓名',entries:['Alice','Bob','Charlie'].map(name=>({name:`${name}·Winter`,keys:[`${name}·Winter`],content:'年龄：20'}))}]);
assert.deepEqual(sameFamily.map(p=>p.name),['Alice·Winter','Bob·Winter','Charlie·Winter'],'a repeated surname inside full confirmed names is preserved');
const scoped=extractWorldbookPeople([
 {name:'甲书',entries:['沈挽昼','林安安','陆斯年'].map(name=>({name:`CrewBlue·${name}·PrivateSheet`,keys:[name,'PrivateSheet'],content:'年龄：20'}))},
 {name:'乙书',entries:[{name:'人物资料',content:'姓名：PrivateSheet'}]},
]);
assert.ok(scoped.some(p=>p.name==='PrivateSheet'&&p.trusted),'learned categories do not leak to another bound book');
assert.ok(scoped.some(p=>p.name==='林安安'&&p.trusted));

const triggerOnly=extractWorldbookPeople([{name:'身份不确定',entries:[{name:'人物档案',keys:['神秘组','沈挽昼','小沈'],content:'年龄：18'}]}]);
assert.ok(triggerOnly.length&&triggerOnly.every(p=>p.trusted===false),'ambiguous keys are candidates, never resolved by array order');
assert.deepEqual(detectGreetingPeople('沈挽昼站在门口。',{worldbookPeople:triggerOnly}).names,[]);
assert.ok(detectGreetingPeople('沈挽昼站在门口。',{worldbookPeople:triggerOnly}).suggestions.includes('沈挽昼'));

const bodyIdentity=extractWorldbookPeople([{name:'姓名优先',entries:[{name:'CrewBlue·沈挽昼·PrivateSheet',keys:['PrivateSheet','沈挽昼','小沈'],content:'姓名：沈挽昼\n昵称：小沈'}]}]);
assert.deepEqual(bodyIdentity.map(p=>p.name),['沈挽昼']);
assert.ok(!bodyIdentity[0].aliases.includes('CrewBlue·沈挽昼·PrivateSheet'),'an opaque decorated title is not automatically an alias');

const explicitShared=extractWorldbookPeople([{name:'共享明确别名',entries:['沈挽昼','林安安','陆斯年'].map(name=>({name:`人物：${name}`,keys:[name,'小月'],content:'别名：小月'}))}]);
assert.ok(explicitShared.every(p=>p.aliases.includes('小月')&&p.ambiguousAliases.includes('小月')),'explicit aliases remain visible even when shared');
assert.deepEqual(detectGreetingPeople('小月站在门口。',{worldbookPeople:explicitShared}).names,[]);

const objects=extractWorldbookPeople([{name:'物品模板',entries:['消防斧','急救箱','手电筒'].map(name=>({name:`CrewBlue·${name}·PrivateSheet`,keys:[name,'PrivateSheet'],content:'物品名称：'+name}))}]);
assert.ok(!objects.some(p=>p.trusted),'repeated formatting without human identity evidence cannot confirm people');
console.log('Book-wide unknown title patterns, evidence priority, scoped categories, compound names and uncertain keys passed');
const repeatedProfiles=extractWorldbookPeople([{name:'同一人物多条资料',entries:['白天','夜晚','雨天'].map(mode=>({name:`人物：沈挽昼（${mode}）`,keys:['沈挽昼','小沈'],content:'年龄：18'}))}]);
assert.deepEqual(repeatedProfiles.map(p=>p.name),['沈挽昼']);
assert.deepEqual(repeatedProfiles[0].aliases,['小沈'],'repeated profiles of one identity must not turn its alias into a generic key');
const unorderedEntries=[{name:'人物档案',keys:['神秘组','沈挽昼','小沈'],content:'年龄：18'},{name:'人物：沈挽昼',keys:['沈挽昼'],content:'性格：温柔'}];
const summarize=rows=>extractWorldbookPeople([{name:'顺序检查',entries:rows}]).map(p=>({name:p.name,trusted:p.trusted,aliases:p.aliases.slice().sort()})).sort((a,b)=>a.name.localeCompare(b.name));
assert.deepEqual(summarize(unorderedEntries),summarize([...unorderedEntries].reverse()),'generic keyword entries must see all confirmed titles');
assert.deepEqual(extractWorldbookPeople([{name:'物品含年龄属性',entries:[{name:'人物档案：许愿石',keys:['许愿石'],content:'物品名称：许愿石\n年龄：18'}]}]),[],'explicit item identity is stronger than a generic age attribute or decorative title');
