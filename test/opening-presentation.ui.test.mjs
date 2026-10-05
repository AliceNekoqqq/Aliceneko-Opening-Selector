import assert from 'node:assert/strict';
import fs from 'node:fs';
import {launchTestBrowser} from './browser.mjs';
const moduleUrl='data:text/javascript;base64,'+Buffer.from(fs.readFileSync('remote.js','utf8')).toString('base64');
const browser=await launchTestBrowser();
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('https://uos.test/**',route=>route.fulfill({contentType:'text/html',body:'<div id="chat"><div class="mes" mesid="0"><div class="mes_text">选择页</div></div></div>'}));
 await page.route(/https:\/\/(?:cdn\.jsdelivr\.net|testingcf\.jsdelivr\.net|raw\.githubusercontent\.com)\//,route=>route.abort());
 await page.goto('https://uos.test/');
 await page.evaluate(async moduleUrl=>{
  const card={avatar:'layout.png',data:{name:'版式测试',first_mes:'<UniversalOpeningSelector/>',alternate_greetings:['第一条开场的完整正文。','第二条开场的完整正文。'],extensions:{universal_opening_selector:{entries:[{title:'雨夜相逢',image:'data:image/png;base64,iVBORw0KGgo='},{title:'钟楼清晨'}]}}}};
  const state={characters:[card],characterId:0,groupId:null,swipe:0,getRequestHeaders:()=>({}),writeExtensionField:async(_id,key,value)=>card.data.extensions[key]=structuredClone(value)};
  window.__state=state;window.SillyTavern={getContext:()=>state};window.TavernHelper={getChatMessages:()=>[{role:'assistant',swipe_id:state.swipe,swipes:[card.data.first_mes,...card.data.alternate_greetings]}],getLastMessageId:()=>0,setChatMessages:async([{swipe_id}])=>state.swipe=swipe_id,getCharWorldbookNames:()=>({primary:null,additional:[]})};
  const nativeFetch=window.fetch.bind(window);window.fetch=async(url,options)=>{
   if(url==='/api/characters/merge-attributes'){card.data.extensions=JSON.parse(options.body).data.extensions;return {ok:true,status:200}}
   if(url==='/api/characters/get')return {ok:true,status:200,json:async()=>structuredClone(card)};return nativeFetch(url,options);
  };
  const runtime=await import(moduleUrl);runtime.mountUniversalSelector(document,window.TavernHelper);
 },moduleUrl);
 const author=page.frameLocator('[data-uos-author-frame]'),settings=page.frameLocator('[data-uos-frame]');
 await author.locator('[data-settings-button]').click();
 await settings.getByLabel('页面版式',{exact:true}).selectOption('catalog');
 const first=settings.locator('.uos-settings-entry').first();await first.locator('.uos-cover-settings>summary').click();
 await first.getByRole('button',{name:'使用默认封面 3',exact:true}).click();
 await first.getByLabel('横向焦点',{exact:true}).evaluate(el=>{el.value='20';el.dispatchEvent(new Event('input',{bubbles:true}))});
 assert.equal(await first.locator('.uos-cover-choice[aria-pressed=true]').textContent(),'封面 3');
 await settings.locator('[data-close]').click();await settings.getByRole('button',{name:'放弃更改',exact:true}).click();
 assert.equal(await author.locator('[data-uos]').getAttribute('data-layout'),'classic');
 assert.equal(await page.evaluate(()=>__state.characters[0].data.extensions.universal_opening_selector.layout),undefined);
 await author.locator('[data-settings-button]').click();await settings.getByLabel('页面版式',{exact:true}).selectOption('gallery');
 await settings.locator('.uos-settings-entry').first().locator('.uos-cover-settings>summary').click();
 await settings.getByRole('button',{name:'使用默认封面 3',exact:true}).first().click();await settings.getByLabel('横向焦点',{exact:true}).first().evaluate(el=>{el.value='20';el.dispatchEvent(new Event('input',{bubbles:true}))});
 await settings.locator('[data-save]').click();await page.locator('[data-uos-frame]').waitFor({state:'detached'});
 const stored=await page.evaluate(()=>__state.characters[0].data.extensions.universal_opening_selector);
 assert.equal(stored.layout,'gallery');assert.equal(stored.entries[0].coverSlot,3);assert.equal(stored.entries[0].image,'');assert.equal(stored.entries[0].coverFocus.x,20);
 assert.match(await author.locator('.uos-cover').first().evaluate(el=>el.style.backgroundImage),/default-cover-3/);
 await author.getByRole('searchbox').fill('钟楼');assert.equal(await author.locator('.uos-card-shell').count(),1);await author.getByRole('searchbox').fill('');
 for(const width of [320,768]){
  await page.setViewportSize({width,height:900});
  for(const layout of ['gallery','catalog','dossier']){
   await author.locator('[data-settings-button]').click();await settings.getByLabel('页面版式',{exact:true}).selectOption(layout);await settings.locator('[data-save]').click();await page.locator('[data-uos-frame]').waitFor({state:'detached'});
   assert.equal(await author.locator('[data-uos]').evaluate(el=>el.scrollWidth<=el.clientWidth+1),true,`author ${layout} ${width}`);
   assert.equal(await author.locator('.uos-card-shell').count(),2);
  }
 }
 // The saved presentation also works when the card uses the ordinary-player entry.
 await page.evaluate(()=>{const state=__state;state.characters[0].data.first_mes='普通主开场正文';document.__uosAuthor.close();document.__uosPlayer.scan()});
 await page.locator('.uos-user-trigger').click();const player=page.locator('.uos-user-panel');
 for(const width of [320,768]){await page.setViewportSize({width,height:900});for(const layout of ['gallery','catalog','dossier']){
  await player.getByLabel('选择版式',{exact:true}).selectOption(layout);assert.equal(await player.evaluate(el=>el.scrollWidth<=el.clientWidth+1),true,`player ${layout} ${width}`);
  assert.equal(await player.locator('.uos-user-select').count(),3);
 }}
 await player.getByRole('searchbox').fill('钟楼');assert.equal(await player.locator('.uos-user-card').count(),1);await player.getByRole('button',{name:'预览完整正文',exact:true}).first().click();assert.match(await page.locator('.uos-preview-body').textContent(),/第二条开场/);await page.getByRole('button',{name:'关闭预览',exact:true}).click();
 assert.deepEqual(errors,[]);
}finally{await browser.close()}
console.log('Author save / discard, fixed cover focus, filtering and six responsive layouts passed');
