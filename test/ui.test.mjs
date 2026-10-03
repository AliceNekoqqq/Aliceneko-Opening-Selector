import assert from 'node:assert/strict';
import fs from 'node:fs';
import {launchTestBrowser} from './browser.mjs';
import {payload,bootstrapFile,bootstrapScript,pointerFile} from './release-fixture.mjs';
const remote=fs.readFileSync('remote.js','utf8');
const bootstrap=fs.readFileSync(bootstrapFile,'utf8');
const runtimeRef=bootstrapScript.match(/"fallbackRef":"([a-f0-9]{40})"/)[1];
const browser=await launchTestBrowser();
try{
 const page=await browser.newPage({viewport:{width:1100,height:850}}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));
 await page.route('https://uos.test/**',route=>route.fulfill({body:'<div id="chat"><div class="mes" mesid="0"><div class="mes_text">主开场</div></div></div>',contentType:'text/html'}));
 await page.route(`**/${bootstrapFile}`,route=>route.fulfill({body:bootstrap,contentType:'text/javascript',headers:{'access-control-allow-origin':'*'}}));
 await page.route('**/remote.js',route=>route.fulfill({body:remote,contentType:'text/javascript',headers:{'access-control-allow-origin':'*'}}));
 await page.route(`**/${pointerFile}`,route=>route.fulfill({body:runtimeRef,headers:{'access-control-allow-origin':'*'}}));
 await page.goto('https://uos.test/');
 await page.evaluate(()=>{
  const card={avatar:'test.png',data:{name:'测试卡',first_mes:'<UniversalOpeningSelector/>',alternate_greetings:['钟楼的清晨。','雨夜车站。'],extensions:{universal_opening_selector:{entries:[{},{worldbookPresetId:'second'}],worldbookPresets:[{id:'second',name:'第二开场预设',books:[{name:'测试世界书',entries:[{uid:5,enabled:false}]}]}]}}}};
  const state={characters:[card],characterId:0,groupId:null,swipe:0,getRequestHeaders:()=>({})};
  state.writeExtensionField=async(id,key,value)=>{state.characters[id].data.extensions[key]=structuredClone(value)};
  const books={'测试世界书':[{uid:5,name:'目标条目',enabled:true,content:'保留正文'}]};
  const networkFetch=window.fetch.bind(window);window.fetch=async(url,options)=>{
   if(url==='/api/characters/merge-attributes'){state.saved=JSON.parse(options.body);return {ok:true,status:200}}
   if(url==='/api/characters/get')return {ok:true,status:200,json:async()=>structuredClone(state.saved)};
   return networkFetch(url,options);
  };
  window.SillyTavern={getContext:()=>state};
  window.TavernHelper={getChatMessages:()=>[{role:'assistant',swipe_id:state.swipe,swipes:[card.data.first_mes,...card.data.alternate_greetings]}],getLastMessageId:()=>0,setChatMessages:async([{swipe_id}])=>{state.swipe=swipe_id},getCharWorldbookNames:()=>({primary:'测试世界书',additional:[]}),getWorldbook:async name=>structuredClone(books[name]),updateWorldbookWith:async(name,updater)=>{books[name]=await updater(books[name])}};
  window.__state=state;window.__worldbooks=books;
 });
 await page.evaluate(()=>{const frame=document.createElement('iframe');frame.id='uos-entry-audit';document.body.append(frame)});
 // Run the shipped JSON unchanged in the hidden script frame, as Tavern Helper does.
 await page.frames().find(frame=>frame.parentFrame()===page.mainFrame()).addScriptTag({content:payload.content});
 await page.frameLocator('iframe[data-uos-author-frame]').locator('[data-settings-button]').waitFor();
 await page.waitForFunction(()=>document.__uosUpdater&&!document.__uosUpdater.busy);
 const selector=page.frameLocator('iframe[data-uos-author-frame]'),dialog=page.frameLocator('iframe[data-uos-frame]');
 await selector.locator('[data-settings-button]').click();
 await dialog.locator('[data-tab="openings"]').click();
 await dialog.locator('[data-settings-fields] input').first().fill('新的起点');
 await dialog.locator('[data-tab="bgm"]').click();
 await dialog.getByRole('checkbox',{name:'启用 BGM 播放器'}).check();
 await dialog.locator('[data-bgm-fields] input[type=file]').first().setInputFiles({name:'sample.mp3',mimeType:'audio/mpeg',buffer:Buffer.from('ID3test')});
 await dialog.getByText('音乐已载入，可在选择页预览',{exact:false}).waitFor();
 await dialog.locator('[data-save]').click();
 await page.locator('iframe[data-uos-frame]').waitFor({state:'detached'});
 const stored=await page.evaluate(()=>__state.characters[0].data.extensions.universal_opening_selector);
 assert.equal(stored.title,'新的起点');assert.match(stored.music.audio,/^data:audio\/mpeg;base64,/);assert.equal(stored.music.enabled,true);
 // Updating must respect the existing author unsaved prompt.
 await selector.locator('[data-settings-button]').click();
 await dialog.locator('[data-tab="openings"]').click();
 await dialog.locator('[data-settings-fields] input').first().fill('不要丢掉');
 await page.evaluate(()=>{window.__prepare=document.__uosAuthor.prepareForUpdate()});
 await dialog.locator('[data-uos-unsaved-prompt]').getByRole('button',{name:'继续编辑'}).click();
 assert.equal(await page.evaluate(()=>window.__prepare),false);
 assert.equal(await dialog.locator('[data-settings-fields] input').first().inputValue(),'不要丢掉');
 await page.evaluate(()=>{window.__prepare=document.__uosAuthor.prepareForUpdate()});
 await dialog.locator('[data-uos-unsaved-prompt]').getByRole('button',{name:'放弃更改'}).click();
 assert.equal(await page.evaluate(()=>window.__prepare),true);
 // A delayed author save must not write settings into a newly selected card.
 await selector.locator('[data-settings-button]').click();
 await dialog.locator('[data-tab="openings"]').click();
 await dialog.locator('[data-settings-fields] input').first().fill('保存旧角色');
 await page.evaluate(()=>{const original=window.fetch;window.fetch=async(url,options)=>{const result=await original(url,options);if(url==='/api/characters/get'){__state.characters.push({avatar:'other.png',data:{extensions:{}}});__state.characterId=1}return result};window.__extensionWrites=0;__state.writeExtensionField=async()=>window.__extensionWrites++});
 await dialog.locator('[data-save]').click();
 await page.waitForFunction(()=>__state.characterId===1);
 assert.equal(await page.evaluate(()=>window.__extensionWrites),0);
 await page.evaluate(()=>{__state.characterId=0;__state.characters[0].data.first_mes='钟楼的清晨。';__state.characters[0].data.alternate_greetings=['雨夜车站。'];document.__uosAuthor.scan();document.__uosPlayer.scan();__state.writeExtensionField=async(id,key,value)=>{__state.characters[id].data.extensions[key]=structuredClone(value)}});
 await page.locator('.uos-user-trigger').click();
 const player=page.locator('dialog.uos-user-overlay');
 await page.addStyleTag({content:'select{background:#333!important;color:#111!important;color-scheme:dark!important}'});
 await player.getByLabel('选择主题').selectOption('paper');
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.uos-user-panel select')).backgroundColor==='rgb(249, 242, 228)');
 for(const name of ['选择主题','按人物筛选']){
  const style=await player.getByLabel(name).evaluate(el=>{const s=getComputedStyle(el);return {background:s.backgroundColor,color:s.color,scheme:s.colorScheme}});
  assert.deepEqual(style,{background:'rgb(249, 242, 228)',color:'rgb(41, 41, 38)',scheme:'light'},`${name} respects paper theme under hostile Tavern styles`);
 }
 await player.getByLabel('选择主题').selectOption('neon');
 assert.equal(await player.getByLabel('按人物筛选').evaluate(el=>getComputedStyle(el).colorScheme),'dark');
 for(const theme of ['deepsea','amber','theatre','lasttrain','aurora','glasshouse','japan']){
  await player.getByLabel('选择主题').selectOption(theme);
  assert.notEqual(await player.evaluate(()=>getComputedStyle(document.querySelector('.uos-user-panel')).getPropertyValue('--uos-user-background').trim()),'none',`${theme} player theme has a background image`);
 }
 await player.getByLabel('选择主题').selectOption('paper');
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('.uos-user-panel select')).backgroundColor==='rgb(249, 242, 228)');
 await page.setViewportSize({width:375,height:812});
 await page.screenshot({path:'/tmp/uos-player-paper-controls.png'});
 await player.locator('summary').filter({hasText:'修正标题和登场人物'}).click();
 const title=player.locator('.uos-user-label-settings').nth(2).locator('input').first();
 await title.fill('玩家未保存标题');
 await page.evaluate(()=>{window.__prepare=document.__uosPlayer.prepareForUpdate()});
 await player.locator('[data-uos-player-unsaved]').getByRole('button',{name:'继续编辑'}).click();
 assert.equal(await page.evaluate(()=>window.__prepare),false);assert.equal(await title.inputValue(),'玩家未保存标题');
 await player.locator('.uos-user-select').nth(1).click();
 await player.locator('[data-uos-player-unsaved]').getByRole('button',{name:'继续编辑'}).click();
 assert.equal(await page.evaluate(()=>__state.swipe),0);
 await player.locator('.uos-user-close').click();
 await player.locator('[data-uos-player-unsaved]').getByRole('button',{name:'保存到本机并关闭'}).click();
 await player.waitFor({state:'detached'});
 assert.ok(await page.evaluate(()=>Object.keys(localStorage).some(key=>key.includes('_edits_')&&localStorage.getItem(key).includes('玩家未保存标题'))));
 await page.locator('.uos-user-trigger').click();
 await player.locator('summary').filter({hasText:'修正标题和登场人物'}).click();
 await title.fill('玩家卡片标题');
 await player.locator('.uos-user-close').click();
 await player.locator('[data-uos-player-unsaved]').getByRole('button',{name:'保存到角色卡并关闭'}).click();
 await player.waitFor({state:'detached'});
 assert.equal(await page.evaluate(()=>__state.characters[0].data.extensions.universal_opening_selector.entries[0].title),'玩家卡片标题');
 await page.locator('.uos-user-trigger').click();
 await player.locator('.uos-user-select').nth(1).click();
 await page.waitForFunction(()=>__state.swipe===1&&__worldbooks['测试世界书'][0].enabled===false);
 assert.deepEqual(errors,[]);
 console.log('Music persistence, author/player update guards, save-switch race, local/card saves and preset swipe passed');
}finally{await browser.close()}
