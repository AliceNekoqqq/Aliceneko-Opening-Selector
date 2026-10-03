import {THEME_ART} from '../src/theme-art.js';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import {THEME_IDS} from '../src/themes.js';
import {themeBackgroundCandidates,THEME_BACKGROUND_REF,createThemeBackgroundController,createThemeBackgroundService} from '../src/theme-backgrounds.js';
import {buildAuthorHtml} from '../src/author-template.js';

for(const id of THEME_IDS){
  const asset=`assets/theme-background-${id}.webp`;
  const expected=execFileSync('git',['rev-parse',`${THEME_BACKGROUND_REF}:${asset}`],{encoding:'utf8'}).trim();
  assert.equal(execFileSync('git',['hash-object',asset],{encoding:'utf8'}).trim(),expected,'pinned file matches current image');
}
assert.deepEqual(themeBackgroundCandidates('../bad'),[]);
const config={entries:[],title:'模板'};
const remote=buildAuthorHtml(config,0);
for(const id of THEME_IDS){
  const encoded=fs.readFileSync(`assets/theme-background-${id}.webp`).toString('base64');
  assert.ok(!remote.includes(encoded));
  assert.ok(remote.includes(themeBackgroundCandidates(id)[0]));
}
assert.doesNotMatch(remote,/data:image\/webp;base64,/,'author template has no image binaries');

function fixture(behavior){
  const requests=[],values=new Map();
  class MockImage{
    set src(url){if(!url)return;requests.push(url);const action=behavior(url);if(action==='pending')return;queueMicrotask(()=>this[action==='ok'?'onload':'onerror']?.());}
  }
  return {requests,values,element:{style:{setProperty:(key,value)=>values.set(key,value)}},view:{Image:MockImage,setTimeout,clearTimeout}};
}
// First CDN fails, backup succeeds; revisiting uses the resolved URL.
const backup=fixture(url=>url.includes('testingcf')?'ok':'error');
const control=createThemeBackgroundController(backup.element,'--background',backup.view);
const loaded=await control.setTheme('archive');assert.match(loaded,/testingcf/);
assert.equal(backup.requests.length,2);assert.equal(await control.setTheme('archive'),loaded);
assert.equal(backup.requests.length,2);control.close();
// All sources time out: retain the theme surface without an image.
const failed=fixture(()=> 'pending');
const timeouts=createThemeBackgroundController(failed.element,'--background',failed.view,{timeoutMs:1});
assert.equal(await timeouts.setTheme('neon'),null);assert.equal(failed.requests.length,3);
assert.equal(failed.values.get('--background'),'none');timeouts.close();
// A previous theme must not overwrite the new one; closing cancels probing.
const rapid=fixture(url=>url.includes('paper')?'pending':'ok');
const switching=createThemeBackgroundController(rapid.element,'--background',rapid.view);
const old=switching.setTheme('paper');const next=switching.setTheme('noir');
assert.equal(await old,null);assert.match(await next,/noir/);
assert.match(rapid.values.get('--background'),/noir/);
const pending=switching.setTheme('paper');switching.close();assert.equal(await pending,null);
assert.equal(await switching.setTheme('rose'),null);
console.log('Pinned resources, preload sharing, backup, timeout, cached retry, rapid switching and close passed');


// Script-start preload starts every theme and shares its in-flight requests with UI.
const images=[],preloadRequests=[];
class PreloadImage {
 constructor(){images.push(this)}
 set src(url){if(url)preloadRequests.push(url)}
}
const preloadService=createThemeBackgroundService({Image:PreloadImage,setTimeout,clearTimeout});
const all=preloadService.preload();
assert.equal(preloadRequests.length,16);
const joined=preloadService.load('archive');
assert.equal(preloadRequests.length,16,'opening the selector does not duplicate startup preload');
const sharedValues=new Map();
const joinedUi=createThemeBackgroundController({style:{setProperty:(key,value)=>sharedValues.set(key,value)}},'--background',null,{service:preloadService});
const painted=joinedUi.setTheme('archive');images[0].onload();
assert.equal(await joined,themeBackgroundCandidates('archive')[0]);
assert.equal(await painted,themeBackgroundCandidates('archive')[0]);
joinedUi.close();
assert.equal(preloadRequests.length,16,'closing UI leaves script preloading intact');
preloadService.close();await all;
assert.equal(preloadRequests.length,16,'script close cancels remaining images without starting backups');
console.log('Script-start preload starts all sixteen backgrounds and shares in-flight images with the selector');

for(const url of Object.values(THEME_ART)){
 const asset=url.slice(url.indexOf('/assets/')+1);
 const expected=execFileSync('git',['rev-parse',`${THEME_BACKGROUND_REF}:${asset}`],{encoding:'utf8'}).trim();
 assert.equal(execFileSync('git',['hash-object',asset],{encoding:'utf8'}).trim(),expected);
}
console.log('All shared theme artwork references existing immutable repository files');
