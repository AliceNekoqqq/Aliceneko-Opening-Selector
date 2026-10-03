import assert from 'node:assert/strict';
import fs from 'node:fs';
import {stampRuntimeVersion} from '../scripts/runtime-version.mjs';
const source=['selector','author','player'].map(name=>fs.readFileSync(`src/${name}.js`,'utf8')).join('\n');
for(const version of ['1.0.10-beta.11','1.0.11']){
 const stamped=stampRuntimeVersion(source,version),found=[...stamped.matchAll(/^\s*const (?:VERSION|AUTHOR_VERSION)\s*=\s*"([^"]+)"/gm)];
 assert.equal(found.length,3);assert.ok(found.every(match=>match[1]===version));
}
assert.throws(()=>stampRuntimeVersion(source,'bad'),/Invalid/);assert.throws(()=>stampRuntimeVersion('', '1.0.11'),/Expected three/);
console.log('Preview and stable builds stamp displayed and lifecycle versions consistently');
