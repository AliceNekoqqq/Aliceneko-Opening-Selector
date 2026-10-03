import assert from 'node:assert/strict';
import {payload,stable,runtimeVersion} from './release-fixture.mjs';
if(stable){
 assert.equal(payload.enabled,true);assert.equal(payload.export_with.data,true);
 assert.match(payload.content,/"channel":"stable"/);assert.match(payload.content,/main\/scripts\/runtime-ref.txt/);assert.doesNotMatch(payload.content,/develop\/scripts/);
 const old=payload.content.match(/"fallbackRef":"([a-f0-9]{40})"/)[1],next='abcdefabcdefabcdefabcdefabcdefabcdefabcd';
 const execute=new (Object.getPrototypeOf(async function(){}).constructor)('globalThis','document','fetch','loadModule','return '+payload.content.replace('await import(url)','await loadModule(url)'));
 async function run(accept,candidateVersion='1.0.13',autoCheck=false){
  const storage=new Map([['uos-auto-check-stable',String(autoCheck)],['uos-auto-check-preview','true']]),imports=[],mounts=[],prompts=[];
  const host={setTimeout,clearTimeout,localStorage:{getItem:key=>storage.get(key),setItem:(key,v)=>storage.set(key,v),removeItem:key=>storage.delete(key)}};
  const doc={defaultView:host,activeElement:null,querySelector:()=>null};
  function el(tag){return {tag,style:{},children:[],setAttribute(){},addEventListener(){},append(...items){this.children.push(...items)},remove(){},focus(){},showModal(){prompts.push(this);queueMicrotask(()=>this.children.at(-1).children[accept?1:0].onclick())}}}
  doc.head=el('head');doc.body=el('body');doc.createElement=el;
  await execute({$:()=>[{ownerDocument:doc}],toastr:{info(){},error(){}},addEventListener(){},removeEventListener(){}},doc,async url=>({ok:true,text:async()=>url.endsWith('/CHANGELOG.md')?'## v1.0.13\n- 正式更新。\n## v1.0.14-beta.1\n- 不得展示此测试版。':next}),async url=>{imports.push(url);return {OPENING_SELECTOR_VERSION:url.includes(next)?candidateVersion:runtimeVersion,mountUniversalSelector:()=>mounts.push(url)}});
  assert.ok(imports[0].includes(old));assert.equal(doc.__uosUpdater.autoCheckEnabled,autoCheck,'preview preference does not override stable preference');
  if(!autoCheck){assert.equal(imports.length,1,'disabled stable startup does not load a candidate');await doc.__uosUpdater.check(true)}
  const fullText=node=>[node.textContent||'',...node.children.map(fullText)].join('\n');assert.doesNotMatch(fullText(prompts[0]),/1\.0\.14-beta/);
  assert.ok(fullText(prompts[0]).includes(`正式通道 · v${runtimeVersion} → v1.0.13`),'prompt shows current and target versions');
  assert.match(fullText(prompts[0]),/【v1\.0\.13】\s+• 正式更新。/,'prompt shows the target release contents');
  return {storage,imports,mounts,doc};
 }
 const autoCancel=await run(false,'1.0.13',true);assert.equal(autoCancel.imports.length,1);assert.equal(autoCancel.mounts.length,1,'startup prompt does not download until approved');
 const autoAccept=await run(true,'1.0.13',true);assert.equal(autoAccept.mounts.length,2);
 const cancel=await run(false);assert.equal(cancel.imports.length,1);assert.equal(cancel.mounts.length,1);
 const approved=await run(true);assert.equal(approved.mounts.length,2);assert.equal(JSON.parse(approved.storage.get('uos-approved-runtime-stable')).ref,next);assert.equal(approved.doc.__uosUpdater.currentVersion,'1.0.13');
 const beta=await run(true,'1.0.13-beta.1');assert.equal(beta.mounts.length,1);assert.equal(beta.imports.length,4);assert.equal(beta.storage.has('uos-approved-runtime-stable'),false);
 console.log('Current stable artifact: startup preference, manual approval, note filtering, beta rejection and persistence passed');
}else console.log('Current stable artifact regression runs with UOS_TEST_CHANNEL=stable');
