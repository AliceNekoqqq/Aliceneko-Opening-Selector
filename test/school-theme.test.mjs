import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import {THEMES,THEME_IDS,themeDraw} from '../src/themes.js';
import {themeAssetRef,themeAssetCandidates,SCHOOL_THEME_ASSET_REF,DEFAULT_COVER_ASSET_REF,BLIND_BOX_THEME_ASSET_REF} from '../src/asset-source.js';
import {themeBackgroundCandidates} from '../src/theme-backgrounds.js';
import {THEME_ART} from '../src/theme-art.js';
import {defaultCoverStyles} from '../src/default-covers.js';
import {buildAuthorHtml} from '../src/author-template.js';

test('school theme has nine immutable independent assets and preserves existing theme resources',()=>{
 const paths=['assets/theme-background-school.webp','assets/theme-icon-school.webp','assets/theme-ornament-school.webp','assets/blind-box/card-backs/school.webp',...Array.from({length:5},(_,i)=>`assets/default-covers/school-${i+1}.webp`)];
 const hashes=paths.map(path=>{
   assert.equal(themeAssetRef(path),SCHOOL_THEME_ASSET_REF);assert.equal(themeAssetCandidates(path).length,3);
   const pinned=execFileSync('git',['rev-parse',`${SCHOOL_THEME_ASSET_REF}:${path}`],{encoding:'utf8'}).trim(),local=execFileSync('git',['hash-object',path],{encoding:'utf8'}).trim();assert.equal(local,pinned);
   const bytes=fs.readFileSync(path);assert.equal(bytes.toString('ascii',0,4),'RIFF');assert.equal(bytes.toString('ascii',8,12),'WEBP');return local;
 });
 assert.equal(new Set(hashes).size,9);assert.equal(themeAssetRef('assets/default-covers/japan-1.webp'),DEFAULT_COVER_ASSET_REF);assert.equal(themeAssetRef('assets/blind-box/card-backs/japan.webp'),BLIND_BOX_THEME_ASSET_REF);
 assert.equal(THEME_IDS.length,17);assert.deepEqual(THEMES.at(-1),['school','放学以后']);assert.equal(themeDraw('school').title,'放课后奇遇');
});
test('school author template includes its full art and all five defaults without embedding image binaries',()=>{
 const html=buildAuthorHtml({theme:'school',title:'放学以后',entries:[]},0),css=defaultCoverStyles('.uos');
 assert.ok(html.includes('.uos[data-theme=school]'),'author template includes school theme styles');assert.ok(html.includes(themeBackgroundCandidates('school')[0]));assert.ok(html.includes(THEME_ART.schoolIcon));assert.ok(html.includes(THEME_ART.schoolOrnament));
 for(let i=1;i<=5;i++)assert.ok(css.includes(themeAssetCandidates(`assets/default-covers/school-${i}.webp`)[0]));
 assert.doesNotMatch(html,/data:image\/webp;base64,/);assert.doesNotMatch(css,/\\n/,'CSS rules are separated by actual newlines');
});
