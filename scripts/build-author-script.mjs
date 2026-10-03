#!/usr/bin/env node
// Maintainer build step. The same JSON runs in a global or character script.
import fs from 'node:fs';
import {stampRuntimeVersion} from './runtime-version.mjs';
import {cdnLoader} from './cdn-loader.mjs';
import {confirmedLoader} from './confirmed-loader.mjs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

const channel=process.argv[2]==='--preview'?'preview':process.argv[2]==='--stable'?'stable':null;
if(!channel||process.argv.length!==3)throw Error('Specify exactly one build channel: --preview or --stable');
const branch=execFileSync('git',['branch','--show-current'],{encoding:'utf8'}).trim();
if(branch!==(channel==='preview'?'develop':'main'))throw Error(`${channel} build must run on ${channel==='preview'?'develop':'main'}, current branch: ${branch||'(detached)'}`);
const version=channel==='preview'?'1.0.10-beta.12':'1.0.14';
const pointerBranch=channel==='preview'?'develop':'main';
const pointerFile=channel==='preview'?'scripts/runtime-ref-preview.txt':'scripts/runtime-ref.txt';
const versionPattern=channel==='preview'?String.raw`\d+\.\d+\.\d+-beta\.\d+`:String.raw`\d+\.\d+\.\d+`;

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'uos-author-'));
try{
  const source=path.join(temp,'card.json'),output=path.join(temp,'packed.json');
  fs.writeFileSync(source,JSON.stringify({name:'Template',first_mes:'示例开场。',data:{name:'Template',first_mes:'示例开场。',alternate_greetings:[],extensions:{}}}));
  execFileSync(process.execPath,[path.resolve('pack.mjs'),source,output],{stdio:'pipe'});
  const card=JSON.parse(fs.readFileSync(output,'utf8'));
  const regex=card.data.extensions.regex_scripts.at(-1).replaceString;
  const html=regex.replace(/^```html\n/,'').replace(/\n```$/,'').replace(/<script type="module">[\s\S]*?<\/script>/,'');
  fs.writeFileSync('src/author-template.js',`/* Generated from legacy pack template assets. */\nexport const AUTHOR_HTML=${JSON.stringify(html)};\n`);
  const runtime=fs.readFileSync('src/selector.js','utf8').replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
  const author=fs.readFileSync('src/author.js','utf8').replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
  const player=fs.readFileSync('src/player.js','utf8').replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
  const worldbook=fs.readFileSync('src/worldbook-people.js','utf8').replace(/^export /gm,'');
  const worldbookPresets=fs.readFileSync('src/worldbook-presets.js','utf8').replace(/^export /gm,'');
  const updateControl=fs.readFileSync('src/update-control.js','utf8').replace(/^export /gm,'');
  const runtimeBody=stampRuntimeVersion(`const AUTHOR_HTML=${JSON.stringify(html).replace(/</g,'\\u003c')};\n${worldbook}\n${worldbookPresets}\n${updateControl}\n${runtime}\n${author}\n${player}`,version);
  const moduleSource=`${runtimeBody}\nexport const OPENING_SELECTOR_VERSION='${version}';\nexport function mountUniversalSelector(startDocument=document,helperApi=null){const doc=startDocument?.nodeType===9?startDocument:document;const helper=helperApi||globalThis.TavernHelper||(typeof globalThis.getChatMessages==='function'?globalThis:null);mountPlayerSelector(doc,helper);mountAuthorSelector(doc,helper,{showSetupHints:true});return {player:doc.__uosPlayer,author:doc.__uosAuthor}};\n`;
  fs.writeFileSync('remote.js',moduleSource);
  // Each channel reads only its own pointer, then imports a module by immutable SHA.
  const ref=fs.readFileSync(pointerFile,'utf8').trim();
  if(!/^[0-9a-f]{40}$/.test(ref))throw Error(`${pointerFile} must contain a commit SHA`);
  const pointerUrls=[
    `https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/${pointerBranch}/${pointerFile}`,
  ];
  // Keep the remote bootstrap's first known-good runtime fixed across releases.
  // Only runtime-ref advances; this preserves confirmed versions and update prompts.
  const anchorFile=channel==='preview'?'scripts/bootstrap-ref-preview.txt':'scripts/bootstrap-ref.txt';
  if(!fs.existsSync(anchorFile))fs.writeFileSync(anchorFile,ref+'\n');
  const anchor=fs.readFileSync(anchorFile,'utf8').trim();
  if(!/^[0-9a-f]{40}$/.test(anchor))throw Error('Invalid bootstrap anchor');
  const bootstrapFile=channel==='preview'?'bootstrap-preview.js':'bootstrap-stable.js';
  fs.writeFileSync(bootstrapFile,`// Generated remote bootstrap.\nexport const BOOTSTRAP_CHANNEL=${JSON.stringify(channel)};\nexport const BOOTSTRAP_PROTOCOL=1;\nexport async function start(){return (${confirmedLoader.toString()})(${JSON.stringify({fallbackRef:anchor,pointerUrls,versionPattern,channel})})}\n`);
  const urls=[`https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${pointerBranch}/${bootstrapFile}`,`https://testingcf.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${pointerBranch}/${bootstrapFile}`,`https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/${pointerBranch}/${bootstrapFile}`];
  const loader=`(${cdnLoader.toString()})(${JSON.stringify({urls,channel})});`;
  const payload={type:'script',enabled:channel==='stable',name:channel==='preview'?`红豆粉开场白选择器 · 测试版确认更新脚本 v${version}`:`红豆粉开场白选择器 · 确认更新通用脚本 v${version}`,id:channel==='preview'?'b499bdc3-d6c2-46cc-a56a-80eef52df75d':'b499bdc3-d6c2-46cc-a56a-80eef52df75c',content:loader,info:channel==='preview'?'仅供测试，从 develop 检查更新，经用户确认才更新；更新入口在设置中，可关闭启动时自动检查；更新前显示逐版本更新说明。请勿与正式版同时启用。作者设置、封面、音乐与歌词保存在角色卡扩展字段。唯一来源Discord:♡Aliceneko♡/红豆粉丨本插件完全免费':'玩家全局脚本／作者角色脚本通用。启动时检查新版本，经用户确认才更新，也可主动点击检查更新；作者设置、封面、音乐与歌词保存在角色卡扩展字段。唯一来源Discord:♡Aliceneko♡/红豆粉丨本插件完全免费',button:{enabled:false,buttons:[]},data:{},export_with:{data:channel==='stable',button:channel==='stable'}};
  fs.mkdirSync('dist',{recursive:true});
  const filename=channel==='preview'?`红豆粉开场白选择器_测试版脚本_v${version}.json`:`红豆粉开场白选择器_通用脚本_v${version}.json`;
  fs.writeFileSync(`dist/${filename}`,JSON.stringify(payload,null,2));
}finally{fs.rmSync(temp,{recursive:true,force:true})}
