import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const payload=JSON.parse(fs.readFileSync('dist/红豆粉开场白选择器_测试版脚本_v1.0.10.json','utf8'));
const remote=fs.readFileSync('remote.js','utf8');
const localUrl='data:text/javascript;base64,'+Buffer.from(remote).toString('base64');
const loader=payload.content.replace(/https:\/\/cdn\.jsdelivr\.net\/gh\/AliceNekoqqq\/Aliceneko-Opening-Selector@[^\"\\]+\/remote\.js/,localUrl);
const first='<UniversalOpeningSelector/>\n\n【请选择开场】';
const card={avatar:'test.png',data:{first_mes:'原主开场。',alternate_greetings:['<SceneInfo>在场角色：\n- 张子薇制服</SceneInfo>\n<content>雨夜车站的重逢。</content>'],extensions:{}}};
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage();
  const runtimeRef=payload.content.match(/fallbackRef='([a-f0-9]{40})'/)[1];
  await page.route('**/scripts/runtime-ref-preview.txt',route=>route.fulfill({status:200,body:runtimeRef,headers:{'access-control-allow-origin':'*'}}));
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.setContent('<style>.mes_text iframe{pointer-events:none!important}</style><div id="chat"><div class="mes" mesid="0"><div class="mes_text">原主开场。</div></div></div>');
  await page.evaluate(card=>{
    const state={characters:[card],characterId:0,groupId:null,swipe:0};
    window.SillyTavern={getContext:()=>state};
    window.TavernHelper={
      getChatMessages:()=>[{role:'assistant',swipe_id:state.swipe,swipes:[card.data.first_mes,...card.data.alternate_greetings]}],
      getLastMessageId:()=>0,
      getCharWorldbookNames:()=>({primary:'测试角色书',additional:[]}),
      getWorldbook:async()=>[{name:'人物速览',content:'- 张子薇：同学'},{name:'张子薇',content:'姓名：张子薇\n性别：女',strategy:{keys:['张子薇','子薇']}}],
      setChatMessages:async([{swipe_id}])=>{state.swipe=swipe_id},
    };
    window.__state=state;
  },card);
  await page.evaluate(()=>{const frame=document.createElement('iframe');frame.id='uos-test-runner';document.body.append(frame)});
  const runner=page.frames().find(frame=>frame.parentFrame()===page.mainFrame());
  await runner.addScriptTag({content:loader});
  await page.locator('.uos-user-trigger').waitFor();
  assert.equal(await page.locator('[data-uos-author-hint]').count(),0);
  await page.locator('.uos-user-trigger').click();
  await page.locator('dialog.uos-user-overlay').getByText('选择故事的起点').waitFor();
  const rules=page.locator('dialog.uos-user-overlay details').filter({has:page.getByText('人物识别规则',{exact:true})});
  await rules.locator('summary').click();
  await rules.locator('.uos-worldbook-people').getByText('张子薇',{exact:true}).waitFor();
  assert.match(await rules.locator('.uos-worldbook-people').textContent(),/子薇/);
  assert.match(await rules.locator('.uos-worldbook-people').textContent(),/测试角色书/);
  // A successful empty read must not erase explicit people already present in openings.
  await page.evaluate(()=>window.TavernHelper.getWorldbook=async()=>[]);
  await rules.getByText('重新读取世界书',{exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('dialog.uos-user-overlay').textContent.includes('提取人物：0 人'));
  assert.match(await page.locator('.uos-user-list').textContent(),/张子薇/);
  // Old helper names and old entry keywords must work through the complete mounted UI.
  await page.evaluate(()=>{
    delete window.TavernHelper.getCharWorldbookNames;delete window.TavernHelper.getWorldbook;
    window.TavernHelper.getCharLorebooks=()=>({primary:'旧接口角色书',additional:[]});
    window.TavernHelper.getLorebookEntries=async()=>[{comment:'人物：张子薇',enabled:true,content:'姓名：张子薇\n性别：女',keys:['张子薇','子薇']}];
  });
  await rules.getByText('重新读取世界书',{exact:true}).click();
  await rules.locator('.uos-worldbook-people').getByText('张子薇',{exact:true}).waitFor();
  assert.match(await rules.locator('.uos-worldbook-people').textContent(),/子薇/);
  assert.match(await rules.textContent(),/旧接口角色书/);
  await page.locator('.uos-user-close').click();
  await page.evaluate(first=>{
    const card=window.__state.characters[0];
    card.data.alternate_greetings.unshift(card.data.first_mes);
    card.data.first_mes=first;
    document.querySelector('.mes_text').textContent=first;
    document.__uosPlayer.scan();
    document.__uosAuthor.scan();
  },first);
  const selector=page.frameLocator('iframe[data-uos-author-frame]');
  await selector.locator('.uos-card').first().waitFor();
  assert.equal(await page.locator('.uos-user-trigger').count(),0);
  assert.match(await selector.locator('.uos-card-names').nth(1).textContent(),/张子薇/);
  assert.equal(await selector.locator('.uos-card-details').count(),2);
  await selector.getByLabel('搜索作者开场').fill('张子薇');
  assert.equal(await selector.locator('.uos-card').count(),1);
  await selector.getByLabel('搜索作者开场').fill('');
  await selector.getByLabel('按人物筛选作者开场').selectOption('张子薇');
  assert.equal(await selector.locator('.uos-card').count(),1);
  await selector.getByLabel('按人物筛选作者开场').selectOption('');
  assert.match(await selector.locator('.uos-version-badge').textContent(),/v?1\.0\.9-beta\.13/);
  await selector.locator('.uos-card-details summary').first().click();
  assert.match(await selector.locator('.uos-card-details pre').first().textContent(),/原主开场/);
  assert.equal(await page.locator('iframe[data-uos-author-frame]').evaluate(node=>getComputedStyle(node).pointerEvents),'auto');

  await selector.locator('[data-theme-button]').click();
  const dialog=page.frameLocator('iframe[data-uos-frame]');
  const themeRect=await page.locator('iframe[data-uos-frame]').boundingBox();
  assert.ok(themeRect.width<620 && themeRect.height<page.viewportSize().height);
  assert.equal(await dialog.locator('[data-uos-overlay]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
  assert.equal(await dialog.locator('.uos-sheet').evaluate(el=>getComputedStyle(el).boxShadow),'none');
  const head=await dialog.locator('.uos-sheet-head').boundingBox();
  await page.mouse.move(head.x+35,head.y+20);await page.mouse.down();await page.mouse.move(head.x+105,head.y+60,{steps:5});await page.mouse.up();
  const moved=await page.locator('iframe[data-uos-frame]').boundingBox();
  assert.ok(moved.x>themeRect.x+40 && moved.y>themeRect.y+20,'theme window can be dragged');
  await dialog.getByText('锦书古风',{exact:true}).click();
  assert.equal(await selector.locator('[data-uos]').getAttribute('data-theme'),'ancient');
  await selector.locator('[data-theme-button]').click();
  await dialog.getByText('星海航图',{exact:true}).click();
  assert.equal(await selector.locator('[data-uos]').getAttribute('data-theme'),'starmap');
  await selector.locator('[data-theme-button]').click();
  await dialog.getByText('霓虹夜',{exact:true}).click();
  assert.equal(await selector.locator('[data-uos]').getAttribute('data-theme'),'neon');

  await selector.locator('[data-settings-button]').click();
  const settingsRect=await page.locator('iframe[data-uos-frame]').boundingBox();
  assert.ok(settingsRect.width<page.viewportSize().width && settingsRect.height<page.viewportSize().height);
  await dialog.getByText('第 1 条开场').waitFor();
  await dialog.locator('[data-close="[data-settings-dialog]"]').click();

  await selector.locator('.uos-card').first().click();
  await page.waitForFunction(()=>window.__state.swipe===1);
  assert.deepEqual(errors,[]);
  console.log('One script switches player and author modes; author buttons work under hostile chat CSS');
}finally{await browser.close()}
