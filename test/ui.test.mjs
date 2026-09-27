import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const dir=fs.mkdtempSync(path.join(os.tmpdir(),'uos-ui-'));
const input=path.join(dir,'input.json'), output=path.join(dir,'output.json');
fs.writeFileSync(input,JSON.stringify({name:'测试卡',data:{name:'测试卡',first_mes:'钟楼的清晨。',alternate_greetings:['雨夜车站，最后一次相见。'],extensions:{regex_scripts:[]}}}));
execFileSync(process.execPath,[path.resolve('pack.mjs'),input,output]);
const card=JSON.parse(fs.readFileSync(output));
let html=card.data.extensions.regex_scripts[0].replaceString.replace(/^```html\n/,'').replace(/\n```$/,'');
const freshMarkup=html.match(/<main class="uos"[\s\S]*?<\/main>/)?.[0];
assert.ok(freshMarkup);
const entry=fs.readFileSync(path.resolve('index.js'),'utf8').replace(/^import .*?;\s*/,'');
html=html.replace(/<link rel="stylesheet"[^>]+>/,`<style>${fs.readFileSync(path.resolve('src/selector.css'),'utf8')}</style>`)
  .replace(/<script type="module">[\s\S]*?<\/script>/,
    `<script type="module">${fs.readFileSync(path.resolve('src/selector.js'),'utf8')}\n${entry}\nmountOpeningSelector(document);</script>`);
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1100,height:850}});
  await page.addInitScript(({card})=>{
    const state={characters:[card.data],characterId:0,chat:[{swipe_id:0}]};
    state.characters[0].data=state.characters[0];
    state.characters[0].avatar='test.png';
    state.getRequestHeaders=()=>({'Content-Type':'application/json'});
    window.fetch=async(url,options)=>{if(url==='/api/characters/merge-attributes'){state.savedOnServer=JSON.parse(options.body);return {ok:true,status:200}};throw Error('Unexpected request')};
    state.writeExtensionField=async (_id,key,value)=>{state.characters[0].extensions[key]=value};
    window.SillyTavern={getContext:()=>state};
    window.TavernHelper={
      getChatMessages:()=>[{role:'assistant',swipe_id:state.chat[0].swipe_id,swipes:[card.data.first_mes,...card.data.alternate_greetings]}],
      getLastMessageId:()=>0,
      setChatMessages:async([{swipe_id}])=>{state.chat[0].swipe_id=swipe_id},
    };
    window.__state=state;
  },{card});
  await page.setContent(html);
  assert.equal(await page.locator('.uos-card').count(),2);
  const dialog=page.frameLocator('iframe[data-uos-frame]');
  await page.locator('[data-theme-button]').click();
  await dialog.getByText('霓虹夜',{exact:true}).click();
  assert.equal(await page.locator('.uos').getAttribute('data-theme'),'neon');
  await page.locator('[data-settings-button]').click();
  await dialog.getByText('第 1 条开场').waitFor();
  await dialog.locator('[data-settings-fields] input').first().fill('新的起点');
  await dialog.locator('[data-tab="bgm"]').click();
  await dialog.locator('.uos-toggle input').check();
  await dialog.locator('[data-bgm-fields] input[type=file]').first().setInputFiles({name:'sample.mp3',mimeType:'audio/mpeg',buffer:Buffer.from('ID3test')});
  await dialog.getByText('音乐已载入，可在选择页预览',{exact:false}).waitFor();
  assert.equal(await page.locator('[data-player]').isVisible(),true);
  await dialog.locator('[data-save]').click();
  assert.equal(await page.locator('h1').innerText(),'新的起点');
  const stored=await page.evaluate(()=>window.__state.characters[0].extensions.universal_opening_selector);
  assert.equal(stored.title,'新的起点');assert.equal(stored.theme,'neon');
  assert.match(stored.music.audio,/^data:audio\/mpeg;base64,/);
  assert.equal(stored.music.enabled,true);
  assert.equal(await page.evaluate(()=>window.__state.savedOnServer.data.extensions.universal_opening_selector.title),'新的起点');
  await page.locator('[data-settings-button]').click();
  await dialog.locator('[data-tab="bgm"]').click();
  await dialog.getByText('已载入音乐',{exact:false}).waitFor();
  await dialog.locator('[data-close="[data-settings-dialog]"]').click();
  await page.locator('.uos-card').nth(1).click();
  await page.waitForFunction(()=>window.__state.chat[0].swipe_id===2);
  await page.evaluate(markup=>{document.querySelector('[data-uos]').outerHTML=markup;window.__state.chat[0].swipe_id=0},freshMarkup);
  await page.locator('.uos-card').first().waitFor();
  await page.locator('[data-theme-button]').click();
  await dialog.getByText('霓虹夜',{exact:true}).waitFor();
  console.log('UI, music save, swipe, and selector re-entry checks passed');
}finally{await browser.close();fs.rmSync(dir,{recursive:true,force:true})}
