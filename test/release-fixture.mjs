import fs from 'node:fs';
const runtimeModule=await import('../remote.js');
export const runtimeVersion=runtimeModule.OPENING_SELECTOR_VERSION;
export const stable=process.env.UOS_TEST_CHANNEL?process.env.UOS_TEST_CHANNEL==='stable':!runtimeVersion.includes('-beta.');
export const pointerFile=stable?'scripts/runtime-ref.txt':'scripts/runtime-ref-preview.txt';
export const payload=JSON.parse(fs.readFileSync(stable?`dist/红豆粉开场白选择器_通用脚本_v${runtimeVersion}.json`:`dist/红豆粉开场白选择器_测试版脚本_v${runtimeVersion}.json`,'utf8'));

export const bootstrapFile=stable?'bootstrap-stable.js':'bootstrap-preview.js';
export const bootstrapScript=payload.content.includes('BOOTSTRAP_PROTOCOL')?'(async()=>{'+fs.readFileSync(bootstrapFile,'utf8').replace(/^export /gm,'')+'\nreturn await start()})();':payload.content;
