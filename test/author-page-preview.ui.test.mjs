import assert from 'node:assert/strict';
import fs from 'node:fs';
import {launchTestBrowser} from './browser.mjs';
const moduleUrl='data:text/javascript;base64,'+Buffer.from(fs.readFileSync('remote.js','utf8')).toString('base64');
const browser=await launchTestBrowser();
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('https://uos.test/**',route=>route.fulfill({contentType:'text/html',body:'<div id="chat"><div class="mes" mesid="0"><div class="mes_text">选择页</div></div></div>'}));
 await page.route(/https:\/\/(?:cdn\.jsdelivr\.net|testingcf\.jsdelivr\.net|raw\.githubusercontent\.com)\//,route=>route.abort());await page.setViewportSize({width:1100,height:900});await page.goto('https://uos.test/');
 await page.evaluate(async url=>{
  const card={avatar:'live-preview.png',data:{name:'实时预览测试',first_mes:'<UniversalOpeningSelector/>',alternate_greetings:['第一条原文','第二条原文'],extensions:{universal_opening_selector:{title:'原标题',layout:'gallery',entries:[{title:'清晨',names:'甲'},{title:'雨夜',names:'乙'}]}}}};
  const state={characters:[card],characterId:0,groupId:null,swipe:0,writes:0,saves:0,getRequestHeaders:()=>({}),writeExtensionField:async(_id,key,value)=>card.data.extensions[key]=structuredClone(value)};
  window.__state=state;window.SillyTavern={getContext:()=>state};window.TavernHelper={getChatMessages:()=>[{role:'assistant',swipe_id:state.swipe,swipes:[card.data.first_mes,...card.data.alternate_greetings]}],getLastMessageId:()=>0,setChatMessages:async([{swipe_id}])=>{state.writes++;state.swipe=swipe_id},getCharWorldbookNames:()=>({primary:null,additional:[]})};
  const nativeFetch=window.fetch.bind(window);window.fetch=async(url,options)=>{if(url==='/api/characters/merge-attributes'){state.saves++;card.data.extensions=JSON.parse(options.body).data.extensions;return {ok:true,status:200}}if(url==='/api/characters/get')return {ok:true,status:200,json:async()=>structuredClone(card)};return nativeFetch(url,options)};
  (await import(url)).mountUniversalSelector(document,window.TavernHelper);
 },moduleUrl);
 const author=page.frameLocator('[data-uos-author-frame]'),settings=page.frameLocator('[data-uos-frame]'),preview=settings.frameLocator('.uos-page-preview-frame');
 await author.locator('[data-settings-button]').click();assert.equal(await settings.locator('.uos-page-preview-frame').count(),0);
 assert.match(await settings.locator('.uos-page-preview>summary').textContent(),/点击预览整个选择页/);assert.equal(await settings.locator('.uos-page-preview-copy small').isVisible(),true);assert.equal(await settings.locator('.uos-page-preview-action').textContent(),'展开预览');
 await settings.locator('.uos-page-preview>summary').click();await preview.locator('[data-title]').filter({hasText:'原标题'}).waitFor();assert.equal(await settings.locator('.uos-page-preview-action').textContent(),'收起预览');
 assert.equal(await preview.locator('audio').count(),0);assert.equal(await preview.locator('[data-uos]').evaluate(node=>node.inert),true);assert.equal(await preview.locator('.uos-card-preview-button').first().isDisabled(),true);
 await settings.getByLabel('页面标题',{exact:true}).fill('实时草稿标题');await preview.locator('[data-title]').filter({hasText:'实时草稿标题'}).waitFor();assert.equal(await author.locator('[data-title]').textContent(),'原标题');
 await settings.getByLabel('页面版式',{exact:true}).selectOption('catalog');await preview.locator('[data-uos][data-layout=catalog]').waitFor();
 const entry=settings.locator('.uos-settings-entry').first();await entry.getByLabel('分组（留空表示未分组）',{exact:true}).fill('主线');await entry.getByLabel('筛选标签（逗号分隔）',{exact:true}).fill('重逢、清晨');await preview.locator('.uos-opening-group-title').filter({hasText:'主线'}).waitFor();await preview.locator('.uos-opening-tags').filter({hasText:'重逢'}).waitFor();
 await entry.locator('.uos-cover-settings>summary').click();await entry.getByRole('button',{name:'使用默认封面 3',exact:true}).click();
 await entry.getByLabel('横向焦点',{exact:true}).evaluate(node=>{node.value='20';node.dispatchEvent(new Event('input',{bubbles:true}))});
 await preview.locator('.uos-cover[style*="20% 50%"]').waitFor();
 await settings.getByRole('button',{name:'桌面 · 900px',exact:true}).click();assert.equal(await preview.locator('html').evaluate(node=>node.ownerDocument.defaultView.innerWidth),900);
 await settings.getByRole('button',{name:'手机 · 390px',exact:true}).click();assert.equal(await preview.locator('html').evaluate(node=>node.ownerDocument.defaultView.innerWidth),390);
 assert.equal(await page.evaluate(()=>__state.writes),0);assert.equal(await page.evaluate(()=>__state.saves),0);
 await settings.locator('[data-close]').click();await settings.getByRole('button',{name:'继续编辑',exact:true}).click();assert.equal(await settings.locator('.uos-page-preview-frame').count(),1);
 await settings.locator('[data-close]').click();await settings.getByRole('button',{name:'放弃更改',exact:true}).click();await page.locator('[data-uos-frame]').waitFor({state:'detached'});assert.equal(await author.locator('[data-title]').textContent(),'原标题');assert.equal(await page.evaluate(()=>__state.saves),0);
 await author.locator('[data-settings-button]').click();await settings.locator('.uos-page-preview>summary').click();await preview.locator('[data-title]').filter({hasText:'原标题'}).waitFor();
 await settings.getByLabel('页面标题',{exact:true}).fill('已保存标题');await preview.locator('[data-title]').filter({hasText:'已保存标题'}).waitFor();await settings.locator('[data-save]').click();await page.locator('[data-uos-frame]').waitFor({state:'detached'});assert.equal(await author.locator('[data-title]').textContent(),'已保存标题');assert.equal(await page.evaluate(()=>__state.saves),1);
 // The preview viewport stays fixed while the settings window fits a narrow host.
 for(const width of [320,768]){
  await page.setViewportSize({width,height:900});await author.locator('[data-settings-button]').click();await settings.locator('.uos-page-preview>summary').click();await preview.locator('[data-title]').filter({hasText:'已保存标题'}).waitFor();
  assert.equal(await settings.locator('.uos-sheet').evaluate(node=>node.scrollWidth<=node.clientWidth+1),true);assert.equal(await preview.locator('[data-uos]').evaluate(node=>node.scrollWidth<=node.clientWidth+1),true);
  await settings.getByRole('button',{name:'桌面 · 900px',exact:true}).click();assert.equal(await preview.locator('html').evaluate(node=>node.ownerDocument.defaultView.innerWidth),900);assert.equal(await settings.locator('.uos-sheet').evaluate(node=>node.scrollWidth<=node.clientWidth+1),true);
  await settings.locator('[data-close]').click();await page.locator('[data-uos-frame]').waitFor({state:'detached'});
 }
 assert.equal(await page.evaluate(()=>__state.writes),0);assert.deepEqual(errors,[]);
}finally{await browser.close()}
console.log('Whole-page draft preview, readonly controls, save / discard and fixed responsive viewports passed');
