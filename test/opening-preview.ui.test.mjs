import assert from 'node:assert/strict';
import fs from 'node:fs';
import {launchTestBrowser} from './browser.mjs';
const moduleUrl='data:text/javascript;base64,'+Buffer.from(fs.readFileSync('remote.js','utf8')).toString('base64');
const browser=await launchTestBrowser();
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.route('https://uos.test/**',route=>route.fulfill({contentType:'text/html',body:'<div id="chat"><div class="mes" mesid="0"><div class="mes_text">普通开场</div></div></div>'}));
 await page.route(/https:\/\/(?:cdn\.jsdelivr\.net|testingcf\.jsdelivr\.net|raw\.githubusercontent\.com)\//,route=>route.abort());
 await page.goto('https://uos.test/');
 await page.evaluate(async url=>{
  const card={avatar:'preview.png',data:{name:'预览测试',first_mes:'原主开场全文',alternate_greetings:['第二条完整正文','第三条完整正文'],extensions:{universal_opening_selector:{layout:'catalog',entries:[{title:'当前开场'},{title:'支线雨夜',description:'完整的多行简介\n第二行',names:'甲、乙、丙、丁',coverSlot:4,coverFocus:{x:20,y:75}},{title:'支线清晨',names:'甲'}]}}}};
  const state={characters:[card],characterId:0,groupId:null,swipe:0,writes:0,getRequestHeaders:()=>({})};
  window.__state=state;window.SillyTavern={getContext:()=>state};window.TavernHelper={getChatMessages:()=>[{role:'assistant',swipe_id:state.swipe,swipes:[card.data.first_mes,...card.data.alternate_greetings]}],getLastMessageId:()=>0,setChatMessages:async([{swipe_id}])=>{state.writes++;state.swipe=swipe_id},getCharWorldbookNames:()=>({primary:null,additional:[]})};
  (await import(url)).mountUniversalSelector(document,window.TavernHelper);
 },moduleUrl);
 await page.locator('.uos-user-trigger').click();const player=page.locator('.uos-user-panel');
 // Simulate a host theme overriding generic button appearance.
 await page.addStyleTag({content:'button{background:#999!important;color:#000!important;border-radius:0!important;border:2px dotted #888!important;margin:5px 0}'});
 for(const theme of ['theatre','paper','neon']){
  await player.evaluate((el,theme)=>el.dataset.theme=theme,theme);
  const appearance=await player.locator('.uos-user-preview-button').first().evaluate(el=>{const css=getComputedStyle(el);return {color:css.color,bg:css.backgroundColor,radius:css.borderRadius,border:css.borderStyle,height:el.getBoundingClientRect().height}});
  assert.notEqual(appearance.color,'rgb(0, 0, 0)');assert.notEqual(appearance.bg,'rgb(153, 153, 153)');assert.equal(appearance.radius,'12px');assert.equal(appearance.border,'solid');assert.ok(appearance.height>=44);
  assert.equal(await player.locator('.uos-user-preview-button').first().getAttribute('type'),'button');
 }
 for(const width of [320,768]){await page.setViewportSize({width,height:760});assert.equal(await player.locator('.uos-user-card').first().evaluate(el=>el.scrollWidth<=el.clientWidth+1),true)}
 await player.getByRole('searchbox').fill('支线');assert.equal(await player.locator('.uos-user-card').count(),2);
 await player.getByRole('button',{name:'预览完整正文',exact:true}).first().click();const preview=page.locator('.uos-opening-preview');
 assert.equal(await preview.locator('.uos-preview-cast span').count(),4);assert.match(await preview.locator('.uos-preview-description').textContent(),/第二行/);
 assert.equal(await preview.locator('.uos-preview-cover').evaluate(el=>el.style.backgroundPosition),'20% 75%');
 await preview.locator('.uos-preview-reading>summary').click();await preview.getByLabel('正文字号',{exact:true}).selectOption('large');await preview.getByLabel('正文行距',{exact:true}).selectOption('relaxed');
 const typography=await preview.locator('.uos-preview-body').evaluate(el=>{const css=getComputedStyle(el);return {font:css.fontSize,line:css.lineHeight}});assert.deepEqual(typography,{font:'18px',line:'36px'});
 await preview.getByRole('button',{name:'专注正文',exact:true}).click();assert.equal(await preview.locator('.uos-preview-cover').isVisible(),false);assert.equal(await preview.locator('.uos-preview-cast').isVisible(),false);assert.equal(await preview.locator('.uos-preview-title').isVisible(),true);
 assert.equal(await preview.getByRole('button',{name:'上一条',exact:true}).isDisabled(),true);
 await preview.getByRole('button',{name:'下一条',exact:true}).click();assert.equal(await preview.locator('.uos-preview-title').textContent(),'支线清晨');assert.match(await preview.locator('.uos-preview-body').textContent(),/第三条/);
 assert.equal(await page.evaluate(()=>__state.writes),0,'navigation never switches greetings');
 for(const width of [320,768]){await page.setViewportSize({width,height:760});
 const geometry=await preview.locator('.uos-preview-reading-controls').evaluate(el=>{const fields=[...el.querySelectorAll('select')],button=el.querySelector('.uos-preview-focus');return [...fields,button].map(node=>{const r=node.getBoundingClientRect();return {height:r.height,bottom:r.bottom,width:r.width}})});assert.ok(geometry.every(r=>Math.abs(r.height-44)<1));if(width>480){assert.ok(Math.abs(geometry[0].bottom-geometry[2].bottom)<1);assert.ok(Math.abs(geometry[1].bottom-geometry[2].bottom)<1)}else{assert.ok(geometry[2].width>geometry[0].width);assert.ok(geometry[2].bottom>geometry[0].bottom)}
 assert.equal(await preview.evaluate(el=>el.scrollWidth<=el.clientWidth+1),true);const bounds=await preview.boundingBox();assert.ok(bounds.x>=0&&bounds.y>=0&&bounds.x+bounds.width<=width+1&&bounds.y+bounds.height<=761)}
 await preview.getByRole('button',{name:'关闭预览',exact:true}).click();assert.equal(await player.locator('.uos-user-card').count(),2);assert.equal(await player.getByRole('searchbox').inputValue(),'支线');
 // Reopen from the same filtered list: local typography and focus preferences survive.
 await player.getByRole('button',{name:'预览完整正文',exact:true}).first().click();await preview.locator('.uos-preview-reading>summary').click();assert.equal(await preview.getByLabel('正文字号',{exact:true}).inputValue(),'large');assert.equal(await preview.getByLabel('正文行距',{exact:true}).inputValue(),'relaxed');assert.equal(await preview.locator('.uos-preview-cover').isVisible(),false);
 await preview.getByRole('button',{name:'专注正文',exact:true}).click();assert.equal(await preview.locator('.uos-preview-cover').isVisible(),true);assert.equal(await preview.locator('.uos-preview-cast span').count(),4);await preview.getByRole('button',{name:'关闭预览',exact:true}).click();
 // A preview selection must keep the existing player draft decision in control.
 await player.getByRole('button',{name:'设置',exact:true}).click();const edits=player.locator('details').filter({has:player.getByText('修正标题和登场人物',{exact:true})});await edits.locator('summary').first().click();
 await edits.locator('input').first().fill('未保存的修正');
 await player.getByRole('button',{name:'预览完整正文',exact:true}).last().click();await preview.getByRole('button',{name:'选择此开场',exact:true}).click();
 await player.getByRole('button',{name:'继续编辑',exact:true}).click();assert.equal(await page.evaluate(()=>__state.writes),0);
 await player.getByRole('button',{name:'预览完整正文',exact:true}).last().click();await preview.getByRole('button',{name:'选择此开场',exact:true}).click();await player.getByRole('button',{name:'放弃更改并关闭',exact:true}).click();
 await page.locator('.uos-user-overlay').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>__state.swipe),2);assert.equal(await page.evaluate(()=>__state.writes),1);
 assert.deepEqual(errors,[]);
}finally{await browser.close()}
console.log('Filtered preview navigation, all metadata, viewport fit and guarded original swipe selection passed');
