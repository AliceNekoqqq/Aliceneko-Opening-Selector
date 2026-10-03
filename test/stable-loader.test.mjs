import assert from 'node:assert/strict';
import fs from 'node:fs';
const p=JSON.parse(fs.readFileSync('test/fixtures/红豆粉开场白选择器_通用脚本_v1.0.10.json'));
assert.equal(p.enabled,true);assert.equal(p.export_with.data,true);assert.match(p.content,/main\/scripts\/runtime-ref.txt/);assert.doesNotMatch(p.content,/develop\/scripts/);
// This is a historical stable-loader fixture; develop's runtime is a newer beta.
const execute=new (Object.getPrototypeOf(async function(){}).constructor)('globalThis','document','fetch','loadModule','return '+p.content.replace('await import(url)','await loadModule(url)'));
async function run(accept,version){let mounts=0,prompts=0,imports=0;const saved=[];
const host={confirm:()=>{prompts++;return accept},localStorage:{getItem:()=>null,setItem:(_k,v)=>saved.push(v)},alert(){}};
const doc={defaultView:host,body:{append(){}},createElement:()=>({style:{},append(){},setAttribute(){},remove(){}})};
await execute({$:()=>[{ownerDocument:doc}]},doc,async()=>({ok:true,text:async()=>'abcdefabcdefabcdefabcdefabcdefabcdefabcd'}),async()=>({OPENING_SELECTOR_VERSION:++imports===1?'1.0.10':version,mountUniversalSelector:()=>mounts++}));return {mounts,prompts,imports,saved};}
const cancel=await run(false,'1.0.11');assert.equal(cancel.mounts,1);assert.equal(cancel.imports,1);assert.equal(cancel.prompts,1);
const update=await run(true,'1.0.11');assert.equal(update.mounts,2);assert.equal(update.saved.length,1);
const beta=await run(true,'1.0.11-beta.1');assert.equal(beta.mounts,1);assert.equal(beta.saved.length,0);assert.equal(beta.imports,4);
console.log('v1.0.10 stable loader: approval, persistence, cancellation and beta rejection passed');
