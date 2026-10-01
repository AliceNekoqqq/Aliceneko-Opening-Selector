import assert from 'node:assert/strict';
import fs from 'node:fs';

const payload=JSON.parse(fs.readFileSync('dist/红豆粉开场白选择器_通用脚本_v1.0.8.json','utf8'));
const preview=JSON.parse(fs.readFileSync('dist/红豆粉开场白选择器_测试版脚本_v1.0.9-beta.6.json','utf8'));
assert.notEqual(preview.id,payload.id,'test and release scripts need separate identities');
assert.match(preview.name,/测试版/);
assert.equal(preview.enabled,false,'test script must require explicit enabling');
assert.equal(preview.export_with.data,false,'test script must not be exported with character cards');
assert.equal(payload.export_with.data,true);
assert.match(preview.content,/develop\/scripts\/runtime-ref-preview\.txt/);
assert.match(payload.content,/main\/scripts\/runtime-ref\.txt/);
const AsyncFunction=Object.getPrototypeOf(async function(){}).constructor;

async function run({fetchPointer,loadModule,script=payload.content}){
  const loader=script.replace('await import(url)','await loadModule(url)');
  assert.notEqual(loader,script,'test shim must replace dynamic import');
  const doc={nodeType:9};
  const helper={name:'mock Tavern Helper'};
  const errors=[];
  const host={
    $:selector=>selector==='body'?[{ownerDocument:doc}]:[],
    TavernHelper:helper,
    toastr:{error:message=>errors.push(message)},
  };
  const execute=new AsyncFunction('fetch','loadModule','globalThis','document','console',`return ${loader}`);
  await execute(fetchPointer,loadModule,host,doc,{error:()=>{}});
  return {doc,helper,errors};
}

const publishedSha='1234567890abcdef1234567890abcdef12345678';
const fetchOptions=[];
const importUrls=[];
let mountCall;
const latest=await run({
  fetchPointer:async(_url,options)=>{
    fetchOptions.push(options);
    return {ok:true,text:async()=>`\n${publishedSha}\n`};
  },
  loadModule:async url=>{
    importUrls.push(url);
    if(importUrls.length===1)throw Error('simulated first CDN outage');
    return {OPENING_SELECTOR_VERSION:'1.0.9',mountUniversalSelector:(doc,helper)=>{mountCall={doc,helper}}};
  },
});
assert.deepEqual(fetchOptions,[{cache:'no-store',credentials:'omit'}]);
assert.equal(importUrls.length,2,'try the second runtime provider after the first fails');
assert.ok(importUrls.every(url=>url.includes(`@${publishedSha}/remote.js`)));
assert.equal(latest.errors.length,0);
assert.equal(mountCall.doc,latest.doc);
assert.equal(mountCall.helper,latest.helper);

const fallbackRef=payload.content.match(/const fallbackRef='([a-f0-9]{40})'/)?.[1];
assert.ok(fallbackRef,'loader must embed a known-good fallback SHA');
const fallbackUrls=[];
const fallback=await run({
  fetchPointer:async()=>{throw Error('simulated pointer outage')},
  loadModule:async url=>{
    fallbackUrls.push(url);
    return {OPENING_SELECTOR_VERSION:'1.0.8',mountUniversalSelector:()=>{}};
  },
});
assert.equal(fallbackUrls.length,1);
assert.ok(fallbackUrls[0].includes(`@${fallbackRef}/remote.js`));
assert.equal(fallback.errors.length,0,'a successful fallback must not report a load error');

const malformedUrls=[];
await run({
  fetchPointer:async()=>({ok:true,text:async()=>'not-a-commit-sha'}),
  loadModule:async url=>{
    malformedUrls.push(url);
    return {OPENING_SELECTOR_VERSION:'1.0.8',mountUniversalSelector:()=>{}};
  },
});
assert.equal(malformedUrls.length,1,'reject malformed pointers and use fallback');
assert.ok(malformedUrls[0].includes(`@${fallbackRef}/remote.js`));

const failedUrls=[];
const totalFailure=await run({
  fetchPointer:async()=>({ok:true,text:async()=>publishedSha}),
  loadModule:async url=>{failedUrls.push(url);throw Error('simulated runtime outage')},
});
assert.equal(failedUrls.length,3,'try all configured runtime providers');
assert.equal(totalFailure.errors.length,1);
assert.match(totalFailure.errors[0],/自动更新加载失败/);
assert.match(totalFailure.errors[0],/simulated runtime outage/);

let betaMounts=0;
const previewRun=await run({
  script:preview.content,
  fetchPointer:async()=>({ok:true,text:async()=>publishedSha}),
  loadModule:async()=>({OPENING_SELECTOR_VERSION:'1.0.9-beta.6',mountUniversalSelector:()=>{betaMounts++}}),
});
assert.equal(betaMounts,1,'test script can load a beta module');
assert.equal(previewRun.errors.length,0);

const rejectedUrls=[];
const rejected=await run({
  fetchPointer:async()=>({ok:true,text:async()=>publishedSha}),
  loadModule:async url=>{rejectedUrls.push(url);return {OPENING_SELECTOR_VERSION:'1.0.9-beta.6',mountUniversalSelector:()=>{betaMounts++}}},
});
assert.equal(rejectedUrls.length,3,'release script rejects beta modules from every provider');
assert.equal(betaMounts,1,'release script must never mount a beta module');
assert.match(rejected.errors[0],/运行模块格式不兼容/);

console.log('Release and test channel isolation, pointer fallback, provider retry and load failure checks passed');
