import assert from 'node:assert/strict';
import fs from 'node:fs';
import {payload,stable,runtimeVersion,bootstrapFile,bootstrapScript} from './release-fixture.mjs';
if(stable){
 assert.equal(payload.enabled,true);assert.equal(payload.export_with.data,true);
 assert.equal(payload.id,'b499bdc3-d6c2-46cc-a56a-80eef52df75c');
 assert.match(payload.content,/"channel":"stable"/);assert.match(bootstrapScript,/main\/scripts\/runtime-ref.txt/);assert.doesNotMatch(payload.content,/develop\/scripts/);
 const old=bootstrapScript.match(/"fallbackRef":"([a-f0-9]{40})"/)[1],next='abcdefabcdefabcdefabcdefabcdefabcdefabcd';
 const targetVersion='1.0.14';
 const source=fs.readFileSync(bootstrapFile,'utf8');
 const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;
 const execute=new AsyncFunction('globalThis','document','fetch','loadModule','return '+payload.content.replace('await import(url)','await loadModule(url)'));
 async function run({accept=false,candidateVersion=targetVersion,autoCheck=false,stored=null,dismissed=null,notes=true,pointer=next,bootstrapFailures=0,guard=null,lateGuard=null}={}){
  const storage=new Map([['uos-auto-check-stable',String(autoCheck)],['uos-auto-check-preview','true']]),imports=[],entryImports=[],mounts=[],prompts=[],messages=[];
  if(stored)storage.set('uos-approved-runtime-stable',JSON.stringify(stored));
  if(dismissed)storage.set('uos-dismissed-update-stable',dismissed);
  const host={setTimeout,clearTimeout,localStorage:{getItem:key=>storage.get(key),setItem:(key,v)=>storage.set(key,v),removeItem:key=>storage.delete(key)}};
  const doc={defaultView:host,activeElement:null,querySelector:()=>null};
  function el(tag){return {tag,style:{},children:[],setAttribute(){},addEventListener(){},append(...items){this.children.push(...items)},remove(){},focus(){},showModal(){prompts.push(this);queueMicrotask(()=>this.children.at(-1).children[accept?1:0].onclick())}}}
  doc.head=el('head');doc.body=el('body');doc.createElement=el;
  if(guard)doc.__uosPlayer={prepareForUpdate:guard};
  const globals={$:()=>[{ownerDocument:doc}],toastr:{info:x=>messages.push(x),error:x=>messages.push(x)},addEventListener(){},removeEventListener(){}};
  const fetchMock=async url=>{if(pointer===null)throw Error('pointer offline');if(url.endsWith('/CHANGELOG.md')){if(!notes)throw Error('release notes offline');return {ok:true,text:async()=>`## v${targetVersion}\n- 正式更新。\n## v1.0.15-beta.1\n- 不得展示此测试版。`}}return {ok:true,text:async()=>pointer}};
  const loadModule=async url=>{
   if(url.endsWith('/'+bootstrapFile)){
    entryImports.push(url);if(entryImports.length<=bootstrapFailures)throw Error('bootstrap unavailable');
    return new AsyncFunction('globalThis','document','fetch','loadModule',source.replace(/^export /gm,'').replace('await import(url)','await loadModule(url)')+'\nreturn {BOOTSTRAP_CHANNEL,BOOTSTRAP_PROTOCOL,start}')(globals,doc,fetchMock,loadModule);
   }
   imports.push(url);if(url.includes(next)&&lateGuard)doc.__uosAuthor={prepareForUpdate:lateGuard};
   return {OPENING_SELECTOR_VERSION:url.includes(next)?candidateVersion:runtimeVersion,mountUniversalSelector:()=>mounts.push(url)};
  };
  await execute(globals,doc,fetchMock,loadModule);
  if(doc.__uosUpdater)assert.equal(doc.__uosUpdater.autoCheckEnabled,autoCheck,'preview preference does not override stable preference');
  return {storage,imports,entryImports,mounts,prompts,messages,doc};
 }
 const fullText=node=>[node?.textContent||'',...(node?.children||[]).map(fullText)].join('\n');
 function verifyPrompt(run){
  const text=fullText(run.prompts[0]);assert.doesNotMatch(text,/1\.0\.15-beta/);
  assert.ok(text.includes(`正式通道 · v${runtimeVersion} → v${targetVersion}`),'prompt shows current and target versions');
  assert.match(text,/【v1\.0\.14】\s+• 正式更新。/,'prompt shows target release contents');
 }
 const autoCancel=await run({autoCheck:true});verifyPrompt(autoCancel);assert.equal(autoCancel.imports.length,1);assert.equal(autoCancel.mounts.length,1,'startup prompt does not download until approved');
 assert.equal(autoCancel.storage.get('uos-dismissed-update-stable'),next);
 const autoAccept=await run({accept:true,autoCheck:true});verifyPrompt(autoAccept);assert.equal(autoAccept.mounts.length,2);
 const cancel=await run();assert.equal(cancel.prompts.length,0,'disabled startup check stays silent');await cancel.doc.__uosUpdater.check(true);verifyPrompt(cancel);assert.equal(cancel.imports.length,1);
 const approved=await run({accept:true});await approved.doc.__uosUpdater.check(true);verifyPrompt(approved);assert.equal(approved.mounts.length,2);assert.equal(JSON.parse(approved.storage.get('uos-approved-runtime-stable')).ref,next);assert.equal(approved.doc.__uosUpdater.currentVersion,targetVersion);
 const restart=await run({stored:{bootstrap:old,ref:next},autoCheck:true});assert.ok(restart.imports[0].includes(next));assert.equal(restart.prompts.length,0,'approved runtime persists across restart');assert.equal(restart.mounts.length,1);
 const dismissed=await run({autoCheck:true,dismissed:next});assert.equal(dismissed.prompts.length,0);assert.equal(dismissed.doc.__uosUpdater.hasUpdate,true);
 const beta=await run({accept:true,candidateVersion:'1.0.14-beta.1'});await beta.doc.__uosUpdater.check(true);assert.equal(beta.mounts.length,1);assert.equal(beta.imports.length,4);assert.equal(beta.storage.has('uos-approved-runtime-stable'),false);
 const missing=await run({notes:false,autoCheck:true});assert.equal(missing.prompts.length,0);assert.equal(missing.mounts.length,1);assert.match(missing.messages.at(-1),/无法读取更新说明/);
 const mismatch=await run({accept:true,autoCheck:true,candidateVersion:'1.0.15'});assert.equal(mismatch.mounts.length,1);assert.match(mismatch.messages.at(-1),/不一致/);
 const offline=await run({autoCheck:true,pointer:null});assert.equal(offline.mounts.length,1);assert.match(offline.messages.at(-1),/继续使用当前版本/);
 const blocked=await run({accept:true,autoCheck:true,guard:async()=>false});assert.equal(blocked.imports.length,1);assert.equal(blocked.mounts.length,1);
 const lateBlocked=await run({accept:true,autoCheck:true,lateGuard:async()=>false});assert.equal(lateBlocked.imports.length,2);assert.equal(lateBlocked.mounts.length,1);assert.equal(lateBlocked.storage.has('uos-approved-runtime-stable'),false);
 const retry=await run({bootstrapFailures:2});assert.equal(retry.entryImports.length,3);assert.equal(retry.mounts.length,1);
 const failure=await run({bootstrapFailures:3});assert.equal(failure.mounts.length,0);assert.match(failure.messages.at(-1),/远程加载失败/);
 const api=approved.doc.__uosUpdater;api.close();assert.equal(approved.doc.__uosUpdater,undefined);await api.check(true);assert.equal(approved.mounts.length,2);
 console.log('Stable JSON → CDN bootstrap → runtime: confirmation, preference isolation, cancellation, persistence, failures, beta rejection, draft guards and cleanup passed');
}else console.log('Current stable artifact regression runs with UOS_TEST_CHANNEL=stable');
