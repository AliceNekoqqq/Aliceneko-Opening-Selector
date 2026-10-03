import assert from 'node:assert/strict';
import fs from 'node:fs';
const payload=JSON.parse(fs.readFileSync('dist/红豆粉开场白选择器_测试版脚本_v1.0.10-beta.9.json'));
assert.match(payload.name,/确认更新/);
assert.equal(payload.enabled,false);assert.equal(payload.export_with.data,false);
const old=payload.content.match(/"fallbackRef":"([a-f0-9]{40})"/)[1];
const next='abcdefabcdefabcdefabcdefabcdefabcdefabcd';
const nextReleaseNotes='# 更新日志\n\n## v1.0.10-beta.9\n- 更新入口移入设置。\n- 更新前显示逐版本说明。\n\n## v1.0.10-beta.6\n- 玩家切换开场前先处理未保存改动。\n';
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
async function run({accept=false,stored=null,pointer=next,fail=false,storageFails=false,notes=nextReleaseNotes,moduleVersion='1.0.10-beta.9',currentVersion='1.0.10-beta.6',autoCheck=null,dismissed=null,holdPrompt=false,modalFails=false,timeout=false}={}){
 const imports=[],mounts=[],prompts=[],messages=[],requests=[],storage=new Map(stored?[["uos-approved-runtime-preview",JSON.stringify(stored)]]:[]);
 if(autoCheck!==null)storage.set('uos-auto-check-preview',String(autoCheck));
 if(dismissed!==null)storage.set('uos-dismissed-update-preview',dismissed);
 let activeDialog;
 const host={setTimeout:(fn,ms)=>setTimeout(fn,timeout?1:ms),clearTimeout,localStorage:{getItem:key=>storage.get(key),setItem:(key,value)=>{if(storageFails)throw Error('storage blocked');storage.set(key,value)},removeItem:key=>storage.delete(key)},confirm:()=>{throw Error('native confirm is unsupported')},alert:()=>{throw Error('native alert is unsupported')}};
 const fullText=element=>[element.textContent||'',...element.children.map(fullText)].join('\n');
 function element(tag){return {tag,style:{},children:[],listeners:{},setAttribute(key,value){this[key]=value},addEventListener(type,fn){this.listeners[type]=fn},append(...items){this.children.push(...items)},remove(){this.removed=true},focus(){doc.activeElement=this},showModal(){if(modalFails)throw Error('showModal unsupported');show(this)}}}
 function show(dialog){if(activeDialog===dialog)return;activeDialog=dialog;prompts.push(fullText(dialog));if(!holdPrompt)queueMicrotask(()=>dialog.children.at(-1).children[accept?1:0].onclick())}
 const doc={defaultView:host,createElement:element,querySelector:()=>null};doc.head=element('head');doc.body=element('body');
 const append=doc.body.append.bind(doc.body);doc.body.append=(...items)=>{append(...items);if(modalFails)items.filter(item=>item.tag==='dialog').forEach(show)};
 const runnerDoc={defaultView:{parent:{document:doc}}};
 const globals={$:()=>[{ownerDocument:runnerDoc}],toastr:{info:text=>messages.push(text),error:text=>messages.push(text)},addEventListener(){},removeEventListener(){}};
 let pointerChecks=0,notesChecks=0;
 const script=payload.content.replace('await import(url)','await loadModule(url)');
 await new AsyncFunction('globalThis','document','fetch','loadModule',`return ${script}`)(globals,doc,async(url)=>{
   requests.push(url);
   if(timeout)return new Promise(()=>{});
   if(url.endsWith('/CHANGELOG.md')){notesChecks++;if(notes===null)throw Error('offline');return {ok:true,text:async()=>notes}}
   pointerChecks++;if(pointer===null)throw Error('offline');return {ok:true,text:async()=>pointer};
 },async url=>{imports.push(url);if(fail&&url.includes(next))throw Error('offline module');return {OPENING_SELECTOR_VERSION:url.includes(next)?moduleVersion:currentVersion,mountUniversalSelector:()=>mounts.push(url)}});
 return {doc,imports,mounts,prompts,messages,storage,requests,get activeDialog(){return activeDialog},get pointerChecks(){return pointerChecks},get notesChecks(){return notesChecks}};
}
const cancelled=await run();assert.equal(cancelled.prompts.length,1);assert.equal(cancelled.imports.length,1,'cancel never imports the new runtime');assert.equal(cancelled.doc.__uosUpdater.hasUpdate,true);assert.match(cancelled.prompts[0],/【v1\.0\.10-beta\.9】/);assert.doesNotMatch(cancelled.prompts[0],/【v1\.0\.10-beta\.6】/,'already-installed version notes are omitted');assert.ok(cancelled.storage.get('uos-dismissed-update-preview'),'cancel stores the dismissed candidate');
await cancelled.doc.__uosUpdater.check(true);assert.equal(cancelled.prompts.length,2,'manual check may show notes again after cancel');assert.equal(cancelled.imports.length,1);
const silentlyDismissed=await run({stored:{bootstrap:old,ref:old},autoCheck:true,dismissed:next});assert.equal(silentlyDismissed.prompts.length,0,'cancelled candidate does not repeat the startup prompt');assert.equal(silentlyDismissed.doc.__uosUpdater.hasUpdate,true);assert.equal(silentlyDismissed.notesChecks,0,'a dismissed candidate does not reload unchanged notes');
const newTarget='bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';
const laterNotes=nextReleaseNotes+'\n## v1.0.10-beta.10\n- 新增新版本内容。\n';
const newRelease=await run({stored:{bootstrap:old,ref:old},pointer:newTarget,notes:laterNotes});assert.equal(newRelease.prompts.length,1,'a different candidate prompts once');assert.match(newRelease.prompts[0],/【v1\.0\.10-beta\.10】/);
const projectNotes=fs.readFileSync('CHANGELOG.md','utf8');
for(let version=1;version<=9;version++){
 const header=`## v1.0.10-beta.${version}`;const section=projectNotes.split(/^## /m).find(part=>part.startsWith(header.slice(3)));
 assert.ok(section,`CHANGELOG includes ${header}`);assert.match(section,/^\s*-\s+\S/m,`${header} has user-facing notes`);
}
const multiVersion=await run({currentVersion:'1.0.10-beta.3',notes:projectNotes});
const shownVersions=[4,5,6,7,8,9].map(version=>`【v1.0.10-beta.${version}】`);
let lastPosition=-1;for(const version of shownVersions){const position=multiVersion.prompts[0].indexOf(version);assert.ok(position>lastPosition,`${version} is included in chronological order`);lastPosition=position}
assert.doesNotMatch(multiVersion.prompts[0],/【v1\.0\.10-beta\.[123]】/,'installed and older release notes are omitted');
const approved=await run({accept:true});assert.equal(approved.imports.length,2);assert.equal(approved.mounts.length,2);assert.equal(JSON.parse(approved.storage.get('uos-approved-runtime-preview')).ref,next);assert.equal(approved.storage.has('uos-dismissed-update-preview'),false);
const restarted=await run({stored:{bootstrap:old,ref:next},pointer:next});assert.equal(restarted.imports.length,1);assert.ok(restarted.imports[0].includes(next));assert.equal(restarted.prompts.length,0,'approved version persists');
await restarted.doc.__uosUpdater.check(true);assert.match(restarted.messages.at(-1),/最新版本/);
const disabled=await run({autoCheck:false});assert.equal(disabled.pointerChecks,0,'disabled startup check does not read the update pointer');assert.equal(disabled.prompts.length,0);await disabled.doc.__uosUpdater.check(true);assert.equal(disabled.pointerChecks,1,'manual check remains available when auto-check is off');assert.equal(disabled.prompts.length,1);
const offline=await run({pointer:null});assert.equal(offline.mounts.length,1);assert.equal(offline.prompts.length,0);assert.match(offline.messages[0],/继续使用当前版本/);
const missingNotes=await run({notes:null});assert.equal(missingNotes.prompts.length,0,'update is not offered without readable notes');assert.match(missingNotes.messages[0],/无法读取更新说明/);
const invalid=await run({pointer:'invalid'});assert.equal(invalid.imports.length,1);
const failure=await run({accept:true,fail:true});assert.equal(failure.mounts.length,1);assert.equal(failure.storage.has('uos-approved-runtime-preview'),false);assert.equal(failure.doc.__uosUpdater.hasUpdate,true);assert.equal(failure.imports.length,4,'all update providers fail without changing selected runtime');
const mismatch=await run({accept:true,moduleVersion:'1.0.10-beta.6'});assert.equal(mismatch.mounts.length,1,'candidate runtime must match its release notes');assert.equal(mismatch.storage.has('uos-approved-runtime-preview'),false);
const storageBlocked=await run({accept:true,storageFails:true});assert.match(storageBlocked.messages.at(-1),/无法保存/);
const stale=await run({stored:{bootstrap:next,ref:next},pointer:old});assert.ok(stale.imports[0].includes(old),'new import resets the bootstrap');const updater=stale.doc.__uosUpdater;updater.close();const count=stale.pointerChecks;await updater.check(true);assert.equal(stale.pointerChecks,count);
assert.doesNotMatch(payload.content,/host\.(?:confirm|alert)\(/,'no dependency on native JS dialogs');
const fallback=await run({modalFails:true});assert.equal(fallback.prompts.length,1);assert.equal(fallback.activeDialog.removed,true,'fallback window supports cancellation');
const timedOut=await run({timeout:true});assert.match(timedOut.doc.__uosUpdater.statusMessage,/请求超时/);assert.equal(timedOut.doc.__uosUpdater.busy,false,'timed-out request releases the check button');
const closing=await run({autoCheck:false,holdPrompt:true});const pending=closing.doc.__uosUpdater.check(true);
while(!closing.activeDialog)await new Promise(resolve=>setImmediate(resolve));
assert.equal(closing.imports.length,1,'confirmation window does not download a runtime');
closing.doc.__uosUpdater.close();await pending;
assert.equal(closing.activeDialog.removed,true,'closing the loader removes its window');assert.equal(closing.storage.has('uos-dismissed-update-preview'),false,'unload does not count as a user cancellation');
const escape=await run({autoCheck:false,holdPrompt:true});const escapeCheck=escape.doc.__uosUpdater.check(true);
while(!escape.activeDialog)await new Promise(resolve=>setImmediate(resolve));
escape.activeDialog.listeners.cancel({preventDefault(){}});await escapeCheck;assert.equal(escape.imports.length,1);assert.ok(escape.storage.get('uos-dismissed-update-preview'),'Escape remembers the dismissed candidate');
console.log('Confirmed update: channel preference, release notes, per-version prompts, cancellation memory, manual retry, persistence, failures and cleanup passed');
