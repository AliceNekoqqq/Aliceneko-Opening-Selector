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
  const card={avatar:'blind-box.png',data:{name:'命运盲盒测试',first_mes:'<UniversalOpeningSelector/>',alternate_greetings:['第一条清晨原文','第二条雨夜原文','第三条支线原文'],extensions:{universal_opening_selector:{theme:'theatre',entries:[{title:'清晨',description:'日光下的约定',names:'甲',group:'主线',tags:['清晨']},{title:'雨夜',description:'雨声里的秘密',names:'乙',group:'番外',tags:['重逢']},{title:'支线',names:'甲',group:'主线',tags:['重逢']}]}}}};
  const state={characters:[card],characterId:0,groupId:null,swipe:0,writes:0,saves:0,getRequestHeaders:()=>({}),writeExtensionField:async(_id,key,value)=>{state.saves++;card.data.extensions[key]=structuredClone(value)}};
  window.__state=state;window.SillyTavern={getContext:()=>state};window.TavernHelper={getChatMessages:()=>[{role:'assistant',swipe_id:state.swipe,swipes:[card.data.first_mes,...card.data.alternate_greetings]}],getLastMessageId:()=>0,setChatMessages:async([{swipe_id}])=>{state.writes++;state.swipe=swipe_id},getCharWorldbookNames:()=>({primary:null,additional:[]})};
  const nativeFetch=window.fetch.bind(window);window.fetch=async(url,options)=>{if(url==='/api/characters/merge-attributes'){state.saves++;card.data.extensions=JSON.parse(options.body).data.extensions;return {ok:true,status:200}}if(url==='/api/characters/get')return {ok:true,status:200,json:async()=>structuredClone(card)};return nativeFetch(url,options)};
  (await import(url)).mountUniversalSelector(document,window.TavernHelper);
 },moduleUrl);
 const author=page.frameLocator('[data-uos-author-frame]');await author.getByLabel('按分组筛选',{exact:true}).selectOption('g:主线');
 const trigger=author.locator('.uos-blind-trigger');assert.equal(await trigger.locator('.uos-blind-trigger-count').textContent(),'2 个开场');assert.equal(await trigger.locator('.uos-blind-trigger-title').textContent(),'今夜开幕');assert.equal(await trigger.locator('.uos-blind-art').count(),3);await trigger.click();
 assert.equal(await page.locator('.uos-blind-box').getAttribute('data-phase'),'shuffle');assert.equal(await page.getByRole('button',{name:'进入此开场',exact:true}).isDisabled(),true);
 assert.equal(await page.locator('.uos-blind-card').first().evaluate(node=>getComputedStyle(node).animationName),'uos-blind-orbit');
 await page.locator('.uos-blind-box[data-phase=revealed]').waitFor();const first=await page.locator('.uos-blind-title').textContent();assert.equal(['清晨','支线'].includes(first),true);await page.getByRole('button',{name:'再抽一次',exact:true}).click();await page.locator('.uos-blind-box[data-phase=revealed]').waitFor();assert.notEqual(await page.locator('.uos-blind-title').textContent(),first);
 const chosenTitle=await page.locator('.uos-blind-title').textContent();await page.getByRole('button',{name:'预览正文',exact:true}).click();assert.equal(await page.locator('.uos-blind-box').count(),0);assert.equal(await page.locator('.uos-preview-body').textContent(),chosenTitle==='清晨'?'第一条清晨原文':'第三条支线原文');await page.getByRole('button',{name:'关闭预览',exact:true}).click();assert.deepEqual(await page.evaluate(()=>[__state.writes,__state.saves]),[0,0]);
 // Cancellation in the middle of the animation cannot reveal a late result.
 await trigger.click();await page.getByRole('button',{name:'关闭盲盒',exact:true}).click();await page.waitForTimeout(2400);assert.equal(await page.locator('.uos-blind-box').count(),0);
 await author.locator('[data-settings-button]').click();const settings=page.frameLocator('[data-uos-frame]');await settings.locator('.uos-page-preview>summary').click();assert.equal(await settings.frameLocator('.uos-page-preview-frame').locator('.uos-blind-trigger').isDisabled(),true);await settings.locator('[data-close]').click();await page.locator('[data-uos-frame]').waitFor({state:'detached'});
 await page.evaluate(()=>{document.__uosAuthor.close();const card=__state.characters[0];card.data.first_mes=card.data.alternate_greetings.shift();document.__uosPlayer.scan()});await page.locator('.uos-user-trigger').click();const player=page.locator('.uos-user-panel');
 await player.getByLabel('按标签筛选',{exact:true}).selectOption('重逢');assert.equal(await player.locator('.uos-blind-trigger').locator('.uos-blind-trigger-count').textContent(),'2 个开场');
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const width of [320,768]){
  await page.setViewportSize({width,height:900});const entrance=player.locator('.uos-blind-trigger');assert.equal(await entrance.evaluate(node=>node.scrollWidth<=node.clientWidth+1),true);assert.equal(await entrance.locator('.uos-blind-trigger-art').evaluate(node=>getComputedStyle(node).animationName),'none');await entrance.click();assert.equal(await page.locator('.uos-blind-box').getAttribute('data-phase'),'revealed');assert.equal(await page.locator('.uos-blind-box').evaluate(node=>node.scrollWidth<=node.clientWidth+1),true);assert.equal(await page.locator('.uos-blind-actions').evaluate(node=>node.scrollWidth<=node.clientWidth+1),true);assert.equal(await page.locator('.uos-blind-result').evaluate(node=>getComputedStyle(node).animationName),'none');await page.getByRole('button',{name:'关闭盲盒',exact:true}).click();
 }
 // Manual range intentionally overrides the homepage filter, with an original-ID preview.
 await player.locator('.uos-user-search input[type=search]').fill('雨夜');
 await player.getByRole('button',{name:'设置抽取范围',exact:true}).click();
 await page.getByRole('button',{name:'全部清空',exact:true}).click();
 await page.locator('.uos-blind-range-row').filter({hasText:'支线'}).locator('input').check();
 await page.getByRole('button',{name:'应用抽取范围',exact:true}).click();
 assert.equal(await player.locator('.uos-blind-trigger').getAttribute('data-scope'),'manual');
 await player.locator('.uos-blind-trigger').click();assert.equal(await page.locator('.uos-blind-title').textContent(),'支线');
 await page.getByRole('button',{name:'预览正文',exact:true}).click();assert.equal(await page.locator('.uos-preview-body').textContent(),'第三条支线原文');
 await page.getByRole('button',{name:'关闭预览',exact:true}).click();
 await player.getByRole('button',{name:'设置抽取范围',exact:true}).click();await page.getByLabel('抽取范围模式',{exact:true}).selectOption('filtered');
 await page.getByRole('button',{name:'应用抽取范围',exact:true}).click();await player.locator('.uos-user-search input[type=search]').fill('');
 // A favorite-only single candidate keeps its original swipe ID.
 await player.getByRole('button',{name:'收藏：支线',exact:true}).click();await player.getByRole('button',{name:'只看收藏',exact:true}).click();assert.equal(await player.locator('.uos-blind-trigger').locator('.uos-blind-trigger-count').textContent(),'1 个开场');await player.locator('.uos-blind-trigger').click();assert.equal(await page.locator('.uos-blind-title').textContent(),'支线');assert.equal(await page.getByRole('button',{name:'再抽一次',exact:true}).isDisabled(),true);assert.deepEqual(await page.evaluate(()=>[__state.writes,__state.saves]),[0,0]);await page.getByRole('button',{name:'进入此开场',exact:true}).click();await page.locator('.uos-user-overlay').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>__state.swipe),2);assert.equal(await page.evaluate(()=>__state.writes),1);assert.deepEqual(errors,[]);
}finally{await browser.close()}
console.log('Blind-box animation, cancellation, combined author/player filters, reduced motion, readonly preview and original selection passed');
