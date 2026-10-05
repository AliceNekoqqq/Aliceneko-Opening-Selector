import {writeAuthorCss} from './build/write-author-css.mjs';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
writeAuthorCss();
const files=fs.readdirSync('test').filter(name=>name.endsWith('.test.mjs')&&!/(?:^|\.)ui\.test\.mjs$/.test(name)).sort().map(name=>`test/${name}`);
const result=spawnSync(process.execPath,['--test',...files],{stdio:'inherit'});
if(result.error)throw result.error;
process.exit(result.status??1);
