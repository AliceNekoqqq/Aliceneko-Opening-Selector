import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readingPreferences,createReadingPreferences,READING_STORAGE_KEY} from '../src/reading-preferences.js';

test('reading preferences whitelist supported settings and reject malformed stored shapes',()=>{
 const defaults={fontSize:'standard',lineSpacing:'standard',focusBody:false};
 for(const value of [undefined,null,[],42,'large',{fontSize:'huge',lineSpacing:99,focusBody:'true'}])assert.deepEqual(readingPreferences(value),defaults);
 assert.deepEqual(readingPreferences({fontSize:'large',lineSpacing:'relaxed',focusBody:true,characterId:7}),{fontSize:'large',lineSpacing:'relaxed',focusBody:true});
});
test('author and player services see each other’s latest saved browser preference',()=>{
 const data=new Map([['unrelated','unchanged']]),host={localStorage:{getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)}};
 const author=createReadingPreferences(host),player=createReadingPreferences(host);author.read();player.set({fontSize:'large'});
 assert.equal(author.read().fontSize,'large');author.set({focusBody:true});assert.deepEqual(player.read(),{fontSize:'large',lineSpacing:'standard',focusBody:true});
 const snapshot=player.read();snapshot.fontSize='small';assert.equal(player.read().fontSize,'large');assert.equal(data.get('unrelated'),'unchanged');assert.deepEqual([...data.keys()],['unrelated',READING_STORAGE_KEY]);
});
test('missing, corrupt and unavailable storage cannot block reading or in-session changes',()=>{
 let raw='{broken';const corrupt=createReadingPreferences({localStorage:{getItem:()=>raw,setItem:()=>{throw Error('quota')}}});assert.equal(corrupt.read().fontSize,'standard');
 corrupt.set({fontSize:'large',lineSpacing:'relaxed'});assert.equal(corrupt.read().fontSize,'large');raw='{"fontSize":"small"}';assert.deepEqual(corrupt.read(),{fontSize:'small',lineSpacing:'standard',focusBody:false});
 const denied=createReadingPreferences({get localStorage(){throw Error('denied')}});assert.equal(denied.set({focusBody:true}).focusBody,true);assert.equal(denied.read().focusBody,true);
 const missing=createReadingPreferences({});missing.set({lineSpacing:'relaxed'});assert.equal(missing.read().lineSpacing,'relaxed');
});
