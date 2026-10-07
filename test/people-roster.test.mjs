import assert from 'node:assert/strict';
import {test} from 'node:test';
import {normalizePeopleRoster,applyPeopleRoster,filterRosterNames} from '../src/people-roster-rules.js';
import {detectGreetingCollection} from '../src/greeting-analysis.js';
import {resolveDisplayEntry} from '../src/player.js';
const people=[{name:'林安',trusted:true},{name:'楚泽',trusted:true,aliases:['哥哥']},{name:'陈清',trusted:false}];
const roster=normalizePeopleRoster({managed:true,confirmed:['林安','陈清'],excluded:['楚泽'],added:[]});
test('removed names cannot return through identities, manual metadata, aliases, card names or propagation',()=>{
  for(const body of ['姓名：楚泽\n楚泽推开门。','楚泽推开门。','哥哥推开门。','<楚泽>“来吧。”</楚泽>']){
    const result=detectGreetingCollection([body],{worldbookPeople:people,knownNames:['楚泽'],aliases:'楚泽=哥哥',characterName:'楚泽',peopleRoster:roster})[0];
    assert.deepEqual(result.names,[]);assert.ok(!result.suggestions.includes('楚泽'));
  }
  assert.deepEqual(detectGreetingCollection(['姓名：楚泽','楚泽推开门。'],{worldbookPeople:people,peopleRoster:roster}).map(result=>result.names),[[],[]]);
});
test('confirmed vocabulary promotes uncertain identities, unknown identities remain candidates and empty managed lists stay empty',()=>{
  const result=detectGreetingCollection(['陈清推开门。\n姓名：乔乔'],{worldbookPeople:people,peopleRoster:roster})[0];assert.deepEqual(result.names,['陈清']);assert.ok(result.suggestions.includes('乔乔'));
  assert.equal(applyPeopleRoster(people,roster).find(person=>person.name==='陈清').trusted,true);
  const empty=normalizePeopleRoster({managed:true,confirmed:[],excluded:[],added:[]});assert.deepEqual(detectGreetingCollection(['姓名：林安'],{worldbookPeople:people,peopleRoster:empty})[0].names,[]);
  assert.deepEqual(detectGreetingCollection(['林安推开门。'],{peopleRoster:roster})[0].names,['林安'],'confirmed people work before/on failed worldbook loading');
});
test('final display enforces roster without overwriting saved card or local fields',()=>{
  const entry={index:0,body:'林安推开门。',names:['林安'],nameEvidence:{林安:'世界书匹配'}},author={names:'楚泽、林安、乔乔'},local={names:'楚泽、陈清'};
  const original=JSON.stringify({entry,author,local});assert.deepEqual(resolveDisplayEntry(entry,author,{},[],roster).names,['林安']);assert.deepEqual(resolveDisplayEntry(entry,author,local,[],roster).names,['陈清']);assert.equal(JSON.stringify({entry,author,local}),original);
  assert.deepEqual(filterRosterNames('楚泽、林安、陈清',roster),['林安','陈清']);
});
test('excluded long names reserve spans, live aliases keep boundaries and full-body matching',()=>{
  const policy=normalizePeopleRoster({managed:true,confirmed:['王明','林安'],excluded:['王明月'],added:[]});
  const result=detectGreetingCollection(['王明月推开门。<!--小林--><content>她站着。</content>'],{worldbookPeople:[{name:'王明',trusted:true},{name:'王明月',aliases:['阿月'],trusted:true},{name:'林安',aliases:['小林'],trusted:true}],peopleRoster:policy})[0];assert.deepEqual(result.names,['林安']);
});
test('legacy selections keep explicit exclusions effective; absent or restored automatic policy preserves legacy recognition',()=>{
  const legacy=normalizePeopleRoster({excluded:['楚泽'],added:['乔乔']});assert.equal(legacy.managed,false);assert.deepEqual(detectGreetingCollection(['姓名：楚泽\n乔乔推开门。'],{peopleRoster:legacy})[0].names,['乔乔']);
  assert.deepEqual(detectGreetingCollection(['姓名：楚泽'],{peopleRoster:normalizePeopleRoster({managed:false,confirmed:[],excluded:[],added:[]})})[0].names,['楚泽']);
});
