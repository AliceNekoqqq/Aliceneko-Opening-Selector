import assert from 'node:assert/strict';
import fs from 'node:fs';
import {readPlayerState} from '../src/player.js';
import {resolveDisplayEntry,isLegacyGeneratedEntry,detectGreetingPeople,detectGreetingCollection,unsavedPlayerGroups,switchOpeningWithPreset} from '../src/player.js';

const switchOrder=[];
await switchOpeningWithPreset(null,null,async()=>switchOrder.push('opening'));
assert.deepEqual(switchOrder,['opening'],'unassigned openings switch without touching worldbooks');
switchOrder.length=0;
let rolledBack=false;
await switchOpeningWithPreset({id:'preset'},{apply:async()=>{switchOrder.push('preset');return{rollback:async()=>{rolledBack=true;switchOrder.push('rollback')}}}},async()=>{switchOrder.push('opening');throw Error('swipe failed')}).then(
  ()=>assert.fail('failed opening switch must reject'),
  error=>assert.match(error.message,/swipe failed/),
);
assert.deepEqual(switchOrder,['preset','opening','rollback'],'preset applies before opening and rolls back when switching fails');
assert.equal(rolledBack,true);
await assert.rejects(
  switchOpeningWithPreset({id:'preset'},{apply:async()=>({rollback:async()=>{throw Error('restore failed')}})},async()=>{throw Error('swipe failed')}),
  /swipe failed；世界书状态恢复失败：restore failed/,
);

assert.match(fs.readFileSync('src/player.js','utf8'),/唯一来源Discord:♡Aliceneko♡\/红豆粉丨本插件完全免费/);

const character={avatar:'example.png',data:{first_mes:'第一条开场。',alternate_greetings:['第二条开场。','第三条开场。']}};
const context={characters:[character],characterId:0,groupId:null};
let swipeId=0,lastId=0;
const helper={getChatMessages:()=>[{role:'assistant',swipe_id:swipeId,swipes:[character.data.first_mes,...character.data.alternate_greetings]}],getLastMessageId:()=>lastId,setChatMessages:async()=>{}};
const state=readPlayerState(context,helper);
assert.deepEqual(state.entries.map(x=>x.index),[0,1,2]);
assert.equal(state.entries[0].body,'第一条开场。');
assert.equal(state.entries[2].body,'第三条开场。');
assert.equal(state.entries[0].title,'第一条开场。');
assert.equal(state.entries[0].description,'');
character.data.first_mes='<status>时间：凌晨；地点：车站</status>\n<角色档案>她带着两张车票。</角色档案>\n<正文>雨停以后，站台只剩下一盏灯。她在等你。</正文>';
character.data.alternate_greetings[0]='```yaml\ntime: midnight\n```\n<时间>凌晨</时间>\n<地点>电话亭</地点>\n<content>凌晨的电话铃响起。屏幕上的名字很熟悉。</content>';
const tagged=readPlayerState(context,helper);
assert.equal(tagged.entries[0].title,'雨停以后，站台只剩下一盏灯。');
assert.equal(tagged.entries[1].title,'凌晨的电话铃响起。');
assert.equal(tagged.entries[0].body,character.data.first_mes);
assert.deepEqual(tagged.entries[0].names,[]);
character.data.first_mes='<角色档案>姓名：沈挽昼\n年龄：23</角色档案>\n<正文>雨停以后，她站在车站。</正文>';
character.data.alternate_greetings[0]='<content>电话响了。\n沈挽昼：别开门。\n地点：旧车站</content>';
const named=readPlayerState(context,helper);
assert.deepEqual(named.entries[0].names,['沈挽昼']);
assert.deepEqual(named.entries[1].names,['沈挽昼']);
assert.equal(named.entries[0].title,'雨停以后，她站在车站。');
character.data.first_mes='<scene>只用于设定的内容。</scene>';
assert.equal(readPlayerState(context,helper).entries[0].title,'开场 1');
character.data.first_mes='第一条开场。';
character.data.alternate_greetings[0]='第二条开场。';
swipeId=2;
assert.equal(readPlayerState(context,helper).swipeId,2);
lastId=1;
assert.equal(readPlayerState(context,helper),null);
lastId=0;
character.data.first_mes='<UniversalOpeningSelector/>';
assert.equal(readPlayerState(context,helper),null);
character.data.first_mes='正文里引用 <UniversalOpeningSelector/> 这个字符串。';
assert.ok(readPlayerState(context,helper));
character.data.first_mes='第一条开场。';
context.groupId=1;
assert.equal(readPlayerState(context,helper),null);
console.log('Player mode maps ordinary greetings and guards active chats');

// beta.31 的搜索、人物修正与标签排除逻辑不得丢失。
const taggedBody='<SceneInfo>\n在场角色：\n- 张子薇制服\n</SceneInfo>\n<content>她走进走廊。</content>';
const sceneCard={avatar:'scene.png',data:{first_mes:taggedBody,alternate_greetings:['另一幕。']}};
const scene=readPlayerState({characters:[sceneCard],characterId:0,groupId:null},helper);
assert.deepEqual(scene.entries[0].names,['张子薇']);
assert.equal(scene.entries[0].title,'她走进走廊。');
assert.equal(resolveDisplayEntry(scene.entries[0],{title:'作者标题',names:'李明、王小雨'}).namesSource,'作者填写');
assert.deepEqual(resolveDisplayEntry(scene.entries[0],{title:'作者标题',names:'李明'},{title:'玩家标题',names:''}).names,[]);
assert.equal(resolveDisplayEntry({index:0,body:'<跳过>元信息。</跳过><content>正文标题。</content>',names:[]},{},{},['跳过']).title,'正文标题。');
const playerSource=fs.readFileSync('src/player.js','utf8');
assert.deepEqual(unsavedPlayerGroups({people:'旧规则',labels:['甲']},{people:'新规则',labels:['乙']}),['people','labels']);
assert.deepEqual(unsavedPlayerGroups({people:'规则'},{people:'规则'}),[]);
for(const action of ['保存到本机并关闭','保存到角色卡并关闭','放弃更改并关闭','继续编辑'])assert.ok(playerSource.includes(action),action);
assert.match(playerSource,/\.uos-user-background\{[^}]*background-size:cover/);
for(const feature of ['uos-user-search','修正标题和登场人物','排除标题中的 <字段>','自定义开场标签','预览完整正文','data-number','THEME_CAPTIONS','THEME_BACKGROUND_IMAGES','uos-user-background'])assert.ok(playerSource.includes(feature),feature);

const oldBody='<SceneInfo>地点：车站</SceneInfo>\n<content>她走到站台。</content>';
const oldPlain=oldBody.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const oldAuto={title:oldPlain.slice(0,20),description:oldPlain.slice(20,88)};
assert.equal(isLegacyGeneratedEntry(oldBody,oldAuto,0),true);
const oldCard={avatar:'old.png',data:{first_mes:oldBody,alternate_greetings:['另一幕。'],extensions:{universal_opening_selector:{entries:[oldAuto]}}}};
assert.equal(readPlayerState({characters:[oldCard],characterId:0,groupId:null},helper).entries[0].title,'她走到站台。');

const personCases=detectGreetingCollection([
  '<角色档案>姓名：沈挽昼</角色档案><正文>她在门边等你。</正文>',
  '<content>登场人物：林安安\n沈挽昼握紧消防斧。\n林安安：别出声。</content>',
  '<沈挽昼>“别开门。”</沈挽昼><正文>林安安回过头。</正文>',
],{aliases:'沈挽昼=挽昼,小沈'});
assert.deepEqual(personCases[0].names,['沈挽昼']);
assert.deepEqual(personCases[1].names,['林安安','沈挽昼']);
assert.equal(personCases[1].evidence['沈挽昼'],'正文提及');
assert.equal(personCases[1].evidence['林安安'],'明确标注');
assert.deepEqual(personCases[2].names,['沈挽昼','林安安']);
assert.equal(personCases[2].evidence['沈挽昼'],'人物标签');
assert.deepEqual(detectGreetingPeople('<正文>小沈推开门。</正文>',{aliases:'沈挽昼=小沈'}).names,['沈挽昼']);
assert.deepEqual(detectGreetingPeople('<SceneInfo>场景类型：末日\n时间：凌晨</SceneInfo><正文>雨停了。</正文>').names,[]);
assert.deepEqual(detectGreetingPeople('<无关设定>姓名：张三</无关设定><content>李四：快跑！</content>',{excludedPersonTags:['无关设定']}).names,['张三']);
const candidate=detectGreetingPeople('<正文>沈挽昼走过走廊。</正文>');
assert.deepEqual(candidate.names,[]);
assert.deepEqual(candidate.suggestions,['沈挽昼']);
assert.equal(resolveDisplayEntry({index:0,body:'沈挽昼：走。',names:['沈挽昼'],nameEvidence:{沈挽昼:'台词署名'}}).namesSource,'自动提取：台词署名');

// Card display names are title hints, not an automatically confirmed person dictionary.
for(const title of ['莉娜的楼书','莉娜的故事','沈挽昼的日记',"Alice's Diary"]){
 const detected=detectGreetingCollection([`<header>${title}</header>\n姓名：莉娜\n莉娜走到门边。`],{characterName:title});
 assert.deepEqual(detected[0].names,['莉娜']);
 assert.ok(!detected[0].suggestions.includes(title));
}
assert.deepEqual(detectGreetingPeople('莉娜站在窗边。',{characterName:'莉娜'}).names,[]);
assert.deepEqual(detectGreetingPeople('莉娜站在窗边。',{characterName:'莉娜'}).suggestions,['莉娜']);
const confirmedHint=detectGreetingCollection(['姓名：莉娜\n莉娜：请进。','莉娜站在窗边。'],{characterName:'莉娜'});
assert.deepEqual(confirmedHint.map(result=>result.names),[['莉娜'],['莉娜']]);
assert.ok(confirmedHint.every(result=>!result.suggestions.includes('莉娜')));
assert.deepEqual(detectGreetingPeople('<莉娜>“请进。”</莉娜>',{characterName:'莉娜'}).suggestions,['莉娜']);
assert.deepEqual(detectGreetingPeople('莉娜走到门边。',{characterName:'莉娜',worldbookPeople:[{name:'莉娜',trusted:true,aliases:[]}]}).names,['莉娜']);
assert.deepEqual(detectGreetingPeople('名字：莉娜的故事\n姓名：莉娜\n莉娜：请进。').names,['莉娜'],'an arbitrary name label does not confirm an owner phrase');
assert.deepEqual(detectGreetingPeople('莉娜的故事：请进。',{aliases:'莉娜的故事'}).names,['莉娜的故事'],'explicit user confirmation can preserve an unusual fictional name');
const titledCard={avatar:'title.png',data:{name:'莉娜的楼书',first_mes:'<header>莉娜的楼书</header>\n姓名：莉娜',alternate_greetings:['莉娜端着盘子。']}};
const titleHelper={getChatMessages:()=>[{role:'assistant',swipe_id:0,swipes:[titledCard.data.first_mes,...titledCard.data.alternate_greetings]}],getLastMessageId:()=>0,setChatMessages:async()=>{}};
assert.deepEqual(readPlayerState({characters:[titledCard],characterId:0,groupId:null},titleHelper).entries.map(entry=>entry.names),[['莉娜'],['莉娜']]);
assert.deepEqual(resolveDisplayEntry({index:0,body:'标题',names:[]},{names:'莉娜的故事'}).names,['莉娜的故事'],'saved explicit person fields are not silently erased');
console.log('Card title hints, possessive phrases, explicit confirmation and preserved manual names passed');

const unconfirmed=detectGreetingCollection(['林安安：快走。','<林安安>“等等。”</林安安>','林安安站在窗边。'],{characterName:'林安安'});
assert.ok(unconfirmed.every(result=>result.names.length===0&&result.suggestions.includes('林安安')));
for(const text of ['书里有个姓名：月色温柔。','台词中的名字：月色温柔。'])assert.deepEqual(detectGreetingPeople(text).names,[],'mid-sentence labels must not create explicit identities');
for(const text of ['{"姓名":"林安安"}','- **姓名**：林安安','<场景>登场人物：林安安</场景>']){
 assert.deepEqual(detectGreetingPeople(text).names,['林安安']);
}
assert.deepEqual(detectGreetingCollection(['姓名：林安安','林安安：快走。','<林安安>“等等。”</林安安>']).map(p=>p.names),[['林安安'],['林安安'],['林安安']]);
console.log('Unconfirmed dialogue/tag candidates stay pending; explicit identities still propagate passed');
