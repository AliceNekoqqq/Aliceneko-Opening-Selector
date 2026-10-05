import assert from 'node:assert/strict';
import {build} from 'esbuild';
for(const version of ['1.0.15-beta.1','1.0.16']){
 const result=await build({entryPoints:['src/main.js'],bundle:true,write:false,format:'esm',platform:'browser',charset:'utf8',define:{__UOS_BUILD_VERSION__:JSON.stringify(version)},metafile:true});
 const api=await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString('base64')}`);
 assert.equal(api.OPENING_SELECTOR_VERSION,version);
 assert.equal(typeof api.mountUniversalSelector,'function');
 for(const name of ['src/player.js','src/author.js','src/selector.js','src/version.js'])assert.ok(result.metafile.inputs[name],name);
 assert.doesNotMatch(result.outputFiles[0].text,/__UOS_BUILD_VERSION__|^import /m);
}
console.log('Standard module graph resolves source dependencies and injects stable / preview runtime versions');
