import assert from 'node:assert/strict';
import fs from 'node:fs';
import {launchTestBrowser} from './browser.mjs';
const moduleUrl='data:text/javascript;base64,'+Buffer.from(fs.readFileSync('remote.js','utf8')).toString('base64');
const browser=await launchTestBrowser();
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('https://uos.test/**',route=>route.fulfill({contentType:'text/html',body:'<div id="chat"><div class="mes" mesid="0"><div class="mes_text">选择页</div></div></div>'}));
 await page.route(/https:\/\/(?:cdn\.jsdelivr\.net|testingcf\.jsdelivr\.net|raw\.githubusercontent\.com)\//,route=>route.abort());await page.goto('https://uos.test/');
 await page.evaluate(async url=>{
  const card={avatar:'groups.png',data:{name:'分类测试',first_mes:'<UniversalOpeningSelector/>',alternate_greetings:['第一条清晨原文','第二条雨夜原文','第三条支线原文','第四条独立原文'],extensions:{universal_opening_selector:{entries:[{title:'清晨',names:'甲'},{title:'雨夜',names:'甲、乙'},{title:'支线',names:'乙'},{title:'独立',names:''}]}}}};
  const state={characters:[card],characterId:0,groupId:null,swipe:0,writes:0,getRequestHeaders:()=>({}),writeExtensionField:async(_id,key,value)=>card.data.extensions[key]=structuredClone(value)};
  window.__state=state;window.SillyTavern={getContext:()=>state};window.TavernHelper={getChatMessages:()=>[{role:'assistant',swipe_id:state.swipe,swipes:[card.data.first_mes,...card.data.alternate_greetings]}],getLastMessageId:()=>0,setChatMessages:async([{swipe_id}])=>{state.writes++;state.swipe=swipe_id},getCharWorldbookNames:()=>({primary:null,additional:[]})};
  const nativeFetch=window.fetch.bind(window);window.fetch=async(url,options)=>{if(url==='/api/characters/merge-attributes'){card.data.extensions=JSON.parse(options.body).data.extensions;return {ok:true,status:200}}if(url==='/api/characters/get')return {ok:true,status:200,json:async()=>structuredClone(card)};return nativeFetch(url,options)};
  (await import(url)).mountUniversalSelector(document,window.TavernHelper);
 },moduleUrl);
 const author=page.frameLocator('[data-uos-author-frame]'),settings=page.frameLocator('[data-uos-frame]');
 assert.equal(await author.getByLabel('按分组筛选',{exact:true}).isVisible(),false);
 async function fillCategories(){for(const [i,group,tags] of [[0,'主线','清晨、重逢'],[1,'番外','雨夜、重逢'],[2,'主线','雨夜']]){
  const box=settings.locator('.uos-settings-entry').nth(i);if(!await box.evaluate(node=>node.open))await box.locator('summary').first().click();await box.getByLabel('分组（留空表示未分组）',{exact:true}).fill(group);await box.getByLabel('筛选标签（逗号分隔）',{exact:true}).fill(tags);
 }}
 await author.locator('[data-settings-button]').click();await fillCategories();await settings.locator('[data-close]').click();await settings.getByRole('button',{name:'放弃更改',exact:true}).click();assert.equal(await author.locator('.uos-opening-group').count(),0);
 await author.locator('[data-settings-button]').click();await fillCategories();await settings.locator('[data-save]').click();await page.locator('[data-uos-frame]').waitFor({state:'detached'});
 const card=await page.evaluate(()=>structuredClone(__state.characters[0]));assert.equal(card.data.first_mes,'<UniversalOpeningSelector/>');assert.deepEqual(card.data.alternate_greetings,['第一条清晨原文','第二条雨夜原文','第三条支线原文','第四条独立原文']);assert.equal(card.data.extensions.universal_opening_selector.entries[1].group,'番外');assert.deepEqual(card.data.extensions.universal_opening_selector.entries[1].tags,['雨夜','重逢']);
 assert.deepEqual(await author.locator('.uos-opening-group-title').allTextContents(),['主线','番外','未分组']);assert.deepEqual(await author.locator('.uos-card-shell .uos-number').allTextContents(),['01','03','02','04']);
 await author.locator('.uos-opening-group>summary').first().click();await author.getByLabel('按标签筛选',{exact:true}).selectOption('雨夜');assert.equal(await author.locator('.uos-opening-group').first().evaluate(node=>node.open),false);await author.locator('.uos-opening-group>summary').first().click();
 await author.getByLabel('按分组筛选',{exact:true}).selectOption('g:番外');await author.getByLabel('按人物筛选作者开场',{exact:true}).selectOption('甲');await author.getByLabel('搜索作者开场',{exact:true}).fill('雨');assert.equal(await author.locator('.uos-card-shell').count(),1);assert.equal(await author.locator('.uos-card-shell .uos-number').textContent(),'02');
 await author.getByRole('button',{name:'预览完整正文',exact:true}).click();assert.match(await page.locator('.uos-preview-body').textContent(),/第二条/);assert.match(await page.locator('.uos-preview-taxonomy').textContent(),/番外/);await page.getByRole('button',{name:'关闭预览',exact:true}).click();
 await page.evaluate(()=>{const data=__state.characters[0].data;data.first_mes=data.alternate_greetings[0];data.alternate_greetings=data.alternate_greetings.slice(1);document.__uosAuthor.close();document.__uosPlayer.scan()});
 await page.locator('.uos-user-trigger').click();const player=page.locator('.uos-user-panel');await player.getByLabel('按分组筛选',{exact:true}).selectOption('g:主线');await player.getByLabel('按标签筛选',{exact:true}).selectOption('雨夜');assert.equal(await player.locator('.uos-user-card').count(),1);assert.equal(await player.locator('.uos-user-card').getAttribute('data-number'),'03');
 for(const width of [320,768]){await page.setViewportSize({width,height:900});assert.equal(await player.evaluate(node=>node.scrollWidth<=node.clientWidth+1),true)}
 await player.getByRole('button',{name:'预览完整正文',exact:true}).click();assert.match(await page.locator('.uos-preview-body').textContent(),/第三条/);await page.getByRole('button',{name:'选择此开场',exact:true}).click();await page.locator('.uos-user-overlay').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>__state.swipe),2);assert.equal(await page.evaluate(()=>__state.writes),1);assert.deepEqual(errors,[]);
}finally{await browser.close()}
console.log('Category draft save / discard, stable collapse, intersected filters, original indexes and responsive player selection passed');
