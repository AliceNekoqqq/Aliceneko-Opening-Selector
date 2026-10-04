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
  const card={avatar:'favorites.png',data:{name:'收藏测试',first_mes:'<UniversalOpeningSelector/>',alternate_greetings:['第一条清晨原文','第二条雨夜原文','第三条支线原文'],extensions:{universal_opening_selector:{layout:'gallery',entries:[{title:'清晨',names:'甲',group:'主线',tags:['清晨']},{title:'雨夜',names:'乙',group:'番外',tags:['重逢']},{title:'支线',names:'甲',group:'主线',tags:['重逢']}]}}}};
  const state={characters:[card],characterId:0,groupId:null,swipe:0,writes:0,saves:0,getRequestHeaders:()=>({}),writeExtensionField:async(_id,key,value)=>{state.saves++;card.data.extensions[key]=structuredClone(value)}};
  window.__state=state;window.SillyTavern={getContext:()=>state};window.TavernHelper={getChatMessages:()=>[{role:'assistant',swipe_id:state.swipe,swipes:[card.data.first_mes,...card.data.alternate_greetings]}],getLastMessageId:()=>0,setChatMessages:async([{swipe_id}])=>{state.writes++;state.swipe=swipe_id},getCharWorldbookNames:()=>({primary:null,additional:[]})};
  const nativeFetch=window.fetch.bind(window);window.fetch=async(url,options)=>{if(url==='/api/characters/merge-attributes'){state.saves++;card.data.extensions=JSON.parse(options.body).data.extensions;return {ok:true,status:200}}if(url==='/api/characters/get')return {ok:true,status:200,json:async()=>structuredClone(card)};return nativeFetch(url,options)};
  (await import(url)).mountUniversalSelector(document,window.TavernHelper);
 },moduleUrl);
 const author=page.frameLocator('[data-uos-author-frame]');
 await author.getByRole('button',{name:'收藏：雨夜',exact:true}).click();assert.equal(await author.getByRole('button',{name:'取消收藏：雨夜',exact:true}).getAttribute('aria-pressed'),'true');
 await author.getByRole('button',{name:'只看收藏',exact:true}).click();assert.equal(await author.locator('.uos-card-shell').count(),1);assert.equal(await author.locator('.uos-number').textContent(),'02');
 await author.getByLabel('搜索作者开场',{exact:true}).fill('清晨');assert.equal(await author.locator('.uos-card-shell').count(),0);await author.getByLabel('搜索作者开场',{exact:true}).fill('');
 await author.getByLabel('按分组筛选',{exact:true}).selectOption('g:主线');assert.equal(await author.locator('.uos-card-shell').count(),0);await author.getByLabel('按分组筛选',{exact:true}).selectOption('');
 await author.getByLabel('按人物筛选作者开场',{exact:true}).selectOption('乙');assert.equal(await author.locator('.uos-number').textContent(),'02');
 await author.locator('.uos-card-preview-button').click();assert.equal(await page.locator('.uos-preview-body').textContent(),'第二条雨夜原文');await page.getByRole('button',{name:'关闭预览',exact:true}).click();
 await author.locator('[data-settings-button]').click();const settings=page.frameLocator('[data-uos-frame]');await settings.locator('.uos-page-preview>summary').click();const preview=settings.frameLocator('.uos-page-preview-frame');
 assert.equal(await preview.getByRole('button',{name:'取消收藏：雨夜',exact:true}).isDisabled(),true);assert.equal(await preview.getByRole('button',{name:'只看收藏',exact:true}).isDisabled(),true);
 await settings.locator('[data-close]').click();await page.locator('[data-uos-frame]').waitFor({state:'detached'});
 assert.deepEqual(await page.evaluate(()=>[__state.writes,__state.saves]),[0,0]);
 // The same original collection in ordinary-player mode reuses the author favorite.
 await page.evaluate(()=>{document.__uosAuthor.close();const card=__state.characters[0];card.data.first_mes=card.data.alternate_greetings.shift();document.__uosPlayer.scan()});
 await page.locator('.uos-user-trigger').click();await page.getByRole('button',{name:'只看收藏',exact:true}).click();assert.equal(await page.locator('.uos-user-card').count(),1);assert.equal(await page.locator('.uos-user-card').getAttribute('data-number'),'02');
 for(const layout of ['gallery','catalog','dossier'])for(const width of [320,768]){
  await page.setViewportSize({width,height:900});await page.locator('.uos-user-panel').evaluate((node,value)=>node.dataset.layout=value,layout);
  assert.equal(await page.locator('.uos-user-card-actions').evaluate(node=>node.scrollWidth<=node.clientWidth+1),true);
  const previewBox=await page.locator('.uos-user-preview-button').boundingBox(),starBox=await page.getByRole('button',{name:'取消收藏：雨夜',exact:true}).boundingBox();assert.equal(Math.abs(previewBox.y-starBox.y)<1,true);assert.equal(starBox.width>=44,true);
 }
 await page.getByRole('button',{name:'取消收藏：雨夜',exact:true}).click();assert.equal(await page.locator('.uos-user-card').count(),0);assert.equal(await page.getByRole('button',{name:'只看收藏',exact:true}).evaluate(node=>node===node.ownerDocument.activeElement),true);
 await page.getByRole('button',{name:'只看收藏',exact:true}).click();await page.getByRole('button',{name:'收藏：雨夜',exact:true}).click();
 assert.deepEqual(await page.evaluate(()=>[__state.writes,__state.saves]),[0,0]);
 await page.getByRole('button',{name:'只看收藏',exact:true}).click();await page.locator('.uos-user-preview-button').click();assert.equal(await page.locator('.uos-preview-body').textContent(),'第二条雨夜原文');
 await page.getByRole('button',{name:'选择此开场',exact:true}).click();await page.locator('.uos-user-overlay').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>__state.swipe),1);assert.equal(await page.evaluate(()=>__state.writes),1);assert.deepEqual(errors,[]);
}finally{await browser.close()}
console.log('Author/player shared favorites, intersected filters, readonly preview, responsive actions and original swipe selection passed');
