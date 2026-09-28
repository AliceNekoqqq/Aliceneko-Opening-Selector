#!/usr/bin/env node
// Maintainer build step. The same JSON runs in a global or character script.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';

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
  const player=fs.readFileSync('src/player.js','utf8').replace(/^export /gm,'');
  const version='1.0.8';
  const runtimeBody=`const AUTHOR_HTML=${JSON.stringify(html).replace(/</g,'\\u003c')};\n${runtime}\n${author}\n${player}`;
  const moduleSource=`${runtimeBody}\nexport const OPENING_SELECTOR_VERSION='${version}';\nexport function mountUniversalSelector(startDocument=document,helperApi=null){const doc=startDocument?.nodeType===9?startDocument:document;const helper=helperApi||globalThis.TavernHelper||(typeof globalThis.getChatMessages==='function'?globalThis:null);mountPlayerSelector(doc,helper);mountAuthorSelector(doc,helper,{showSetupHints:true});return {player:doc.__uosPlayer,author:doc.__uosAuthor}};\n`;
  fs.writeFileSync('remote.js',moduleSource);
  // The installed JSON is a stable bootstrap. It checks a tiny pointer file
  // on main, then imports the actual self-contained module by immutable SHA.
  const ref=fs.readFileSync('scripts/runtime-ref.txt','utf8').trim();
  if(!/^(main|[0-9a-f]{40})$/.test(ref))throw Error('scripts/runtime-ref.txt must contain a commit SHA');
  const pointerUrls=[
    `https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/main/scripts/runtime-ref.txt`,
  ];
  const loader=`(async()=>{const fallbackRef='${ref}';\nconst pointerUrls=${JSON.stringify(pointerUrls)};let ref=fallbackRef;const pointerErrors=[];\nfor(const url of pointerUrls){try{const response=await fetch(url,{cache:'no-store',credentials:'omit'});if(!response.ok)throw Error('HTTP '+response.status);const candidate=(await response.text()).trim();if(!/^[a-f0-9]{40}$/.test(candidate))throw Error('提交 SHA 格式错误');ref=candidate;break}catch(error){pointerErrors.push(String(error?.message||error))}}\nconst urls=[\`https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@\${ref}/remote.js\`,\`https://testingcf.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@\${ref}/remote.js\`,\`https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/\${ref}/remote.js\`];let loaded=false;const errors=[];\nfor(const url of urls){try{const module=await import(url);if(!/^\\d+\\.\\d+\\.\\d+$/.test(module.OPENING_SELECTOR_VERSION)||typeof module.mountUniversalSelector!=='function')throw Error('运行模块格式不兼容');module.mountUniversalSelector(globalThis.$?.('body')?.[0]?.ownerDocument||document,globalThis.TavernHelper||(typeof globalThis.getChatMessages==='function'?globalThis:null));loaded=true;break}catch(error){errors.push(String(error?.message||error))}}\nif(!loaded){const message='红豆粉开场白选择器自动更新加载失败：'+[...pointerErrors,...errors].join(' | ');console.error(message);globalThis.toastr?.error?.(message)}})();`;
  const payload={type:'script',enabled:true,name:`红豆粉开场白选择器 · 自动更新通用脚本 v${version}`,id:'b499bdc3-d6c2-46cc-a56a-80eef52df75c',content:loader,info:'玩家全局脚本／作者角色脚本通用。首次导入后自动检查 GitHub 版本指针并加载最新运行模块，后续更新无需重新导入；作者设置、封面、音乐与歌词保存在角色卡扩展字段。唯一来源Discord:♡Aliceneko♡/红豆粉丨本插件完全免费',button:{enabled:false,buttons:[]},data:{},export_with:{data:true,button:true}};
  fs.mkdirSync('dist',{recursive:true});
  fs.writeFileSync(`dist/红豆粉开场白选择器_通用脚本_v${version}.json`,JSON.stringify(payload,null,2));
}finally{fs.rmSync(temp,{recursive:true,force:true})}
