import fs from 'node:fs';
export const runtimeVersion=fs.readFileSync('remote.js','utf8').match(/export const OPENING_SELECTOR_VERSION='([^']+)'/)[1];
export const stable=process.env.UOS_TEST_CHANNEL?process.env.UOS_TEST_CHANNEL==='stable':!runtimeVersion.includes('-beta.');
export const pointerFile=stable?'scripts/runtime-ref.txt':'scripts/runtime-ref-preview.txt';
export const payload=JSON.parse(fs.readFileSync(stable?`dist/红豆粉开场白选择器_通用脚本_v${runtimeVersion}.json`:'dist/红豆粉开场白选择器_测试版脚本_v1.0.10-beta.11.json','utf8'));
