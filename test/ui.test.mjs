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
html=html.replace(/<link rel="stylesheet"[^>]+>/,`<style>${fs.readFileSync(path.resolve('src/selector.css'),'utf8')}</style>`)
  .replace(/<script type="module">import\([^<]+<\/script>/,
    `<script type="module">${fs.readFileSync(path.resolve('src/selector.js'),'utf8')}\nmountInDocument(document);</script>`);
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage({viewport:{width:1100,height:850}});
  await page.addInitScript(({card})=>{
    const state={characters:[card.data],characterId:0,chat:[{swipe_id:0}]};
    state.characters[0].data=state.characters[0];
    state.writeExtensionField=async (_id,key,value)=>{state.characters[0].extensions[key]=value};
    window.SillyTavern={getContext:()=>state};
    window.__state=state;
  },{card});
  await page.setContent(html);
  assert.equal(await page.locator('.uos-card').count(),2);
  await page.locator('[data-theme-button]').click();
  await page.getByText('霓虹夜',{exact:true}).click();
  assert.equal(await page.locator('.uos').getAttribute('data-theme'),'neon');
  await page.locator('[data-settings-button]').click();
  await page.getByText('第 1 条开场').waitFor();
  await page.locator('[data-settings-fields] input').first().fill('新的起点');
  await page.locator('[data-save]').click();
  assert.equal(await page.locator('h1').innerText(),'新的起点');
  const stored=await page.evaluate(()=>window.__state.characters[0].extensions.universal_opening_selector);
  assert.equal(stored.title,'新的起点');assert.equal(stored.theme,'neon');
  // Native swipe is the only way to switch; the selector never overwrites story text.
  await page.evaluate(()=>{
    const mes=document.createElement('div');mes.className='mes';mes.setAttribute('mesid','0');
    const swipe=document.createElement('button');swipe.className='swipe_right';
    swipe.onclick=()=>window.__state.chat[0].swipe_id++;
    mes.append(swipe);document.body.append(mes);
  });
  await page.locator('.uos-card').nth(1).click();
  await page.waitForFunction(()=>window.__state.chat[0].swipe_id===2);
  await page.screenshot({path:path.resolve('examples/selector-preview.png'),fullPage:true});
  fs.writeFileSync(path.resolve('examples/selector-preview.html'),html);
  console.log('UI, theme, save, and native swipe checks passed');
}finally{await browser.close();fs.rmSync(dir,{recursive:true,force:true})}
