import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const payload=JSON.parse(fs.readFileSync('dist/红豆粉开场白选择器_测试版脚本_v1.0.10-beta.9.json','utf8'));
const remote=fs.readFileSync('remote.js','utf8');
const localUrl='data:text/javascript;base64,'+Buffer.from(remote).toString('base64');
const loader=payload.content.replace('`https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${target}/remote.js`',`'${localUrl}'`);
const first='<UniversalOpeningSelector/>\n\n【请选择开场】';
const card={avatar:'test.png',data:{first_mes:'原主开场。',alternate_greetings:['<SceneInfo>在场角色：\n- 张子薇制服</SceneInfo>\n<content>雨夜车站的重逢。</content>'],extensions:{}}};
const browser=await chromium.launch({headless:true});
try{
  const page=await browser.newPage();
  const runtimeRef=payload.content.match(/\"fallbackRef\":\"([a-f0-9]{40})\"/)[1];
  await page.route('**/scripts/runtime-ref-preview.txt',route=>route.fulfill({status:200,body:runtimeRef,headers:{'access-control-allow-origin':'*'}}));
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.setContent('<style>.mes_text iframe{pointer-events:none!important}</style><div id="chat"><div class="mes" mesid="0"><div class="mes_text">原主开场。</div></div></div>');
  await page.evaluate(card=>{
    const worldbooks={'测试角色书':[{uid:1,name:'人物速览',content:'- 张子薇：同学',enabled:true},{uid:2,name:'张子薇',content:'姓名：张子薇\n性别：女',enabled:false,strategy:{keys:['张子薇','子薇']}}],'旧接口角色书':[{uid:9,name:'旧接口人物',comment:'人物：张子薇',enabled:true,content:'姓名：张子薇\n性别：女',keys:['张子薇','子薇']}]};
    const state={characters:[card],characterId:0,groupId:null,swipe:0,getRequestHeaders:()=>({}),writeExtensionField:async(_id,key,value)=>{card.data.extensions[key]=JSON.parse(JSON.stringify(value))}};
    window.SillyTavern={getContext:()=>state};
    window.TavernHelper={
      getChatMessages:()=>[{role:'assistant',swipe_id:state.swipe,swipes:[card.data.first_mes,...card.data.alternate_greetings]}],
      getLastMessageId:()=>0,
      getCharWorldbookNames:()=>({primary:'测试角色书',additional:[]}),
      getWorldbook:async name=>worldbooks[name]||[],
      updateWorldbookWith:async(name,updater)=>{worldbooks[name]=await updater(worldbooks[name]||[])},
      setChatMessages:async([{swipe_id}])=>{state.swipe=swipe_id},
    };
    const nativeFetch=window.fetch.bind(window);window.fetch=async(url,options={})=>{
      if(url==='/api/characters/merge-attributes'){const body=JSON.parse(options.body);card.data.extensions={...card.data.extensions,...body.data.extensions};return {ok:true,status:200}}
      if(url==='/api/characters/get')return {ok:true,status:200,json:async()=>JSON.parse(JSON.stringify(card))};
      return nativeFetch(url,options);
    };
    window.__state=state;window.__worldbooks=worldbooks;
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
    window.TavernHelper.getLorebookEntries=async name=>window.__worldbooks[name]||[{uid:9,comment:'人物：张子薇',name:'旧接口人物',enabled:true,content:'姓名：张子薇\n性别：女',keys:['张子薇','子薇']}];
    window.TavernHelper.updateWorldbookWith=async(name,updater)=>{window.__worldbooks[name]=await updater(window.__worldbooks[name]||[])};
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
  assert.match(await selector.locator('.uos-version-badge').textContent(),/v?1\.0\.10-beta\.6/);
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
  assert.ok(Number(await page.locator('iframe[data-uos-frame]').evaluate(el=>getComputedStyle(el).zIndex))<999999,'Tavern notifications are above the settings frame');
  assert.equal(await page.locator('iframe[data-uos-frame]').evaluate(el=>getComputedStyle(el).borderRadius),'16px');
  assert.equal(await dialog.locator('html').evaluate(el=>getComputedStyle(el).colorScheme),'normal');
  assert.equal(await dialog.locator('html').evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');
  await dialog.getByText('第 1 条开场').waitFor();
  await dialog.locator('[data-tab="worldbooks"]').click();
  assert.match(await dialog.locator('[data-tab-art="worldbooks"]').evaluate(el=>getComputedStyle(el).backgroundImage),/^url\("data:image\/webp;base64,/,'worldbook tab has its bundled artwork');
  const newPresetName=dialog.locator('input[placeholder="新预设名称（可留空）"]');
  await newPresetName.fill('测试角色预设');
  await dialog.getByRole('button',{name:'新建预设',exact:true}).click();
  const presetRows=dialog.locator('.uos-worldbook-presets-list');
  await presetRows.getByText('旧接口人物',{exact:true}).waitFor();
  const presetToggle=presetRows.locator('.uos-worldbook-entry-toggle input').first();
  assert.equal(await presetToggle.isChecked(),true,'worldbook settings show current entry state');
  await dialog.locator('[data-close="[data-settings-dialog]"]').click();
  await dialog.locator('[data-uos-unsaved-prompt]').getByRole('button',{name:'继续编辑'}).click();
  await presetRows.getByText('旧接口人物',{exact:true}).waitFor();
  await dialog.locator('[data-save]').click();
  assert.equal(await page.evaluate(()=>Boolean(window.__state.characters[0].data.extensions.universal_opening_selector)),false,'card save waits for the preset draft to be saved');
  await dialog.getByRole('button',{name:'保存新预设',exact:true}).click();
  await presetToggle.uncheck();
  await dialog.getByRole('button',{name:'保存预设',exact:true}).click();
  const presetName=dialog.locator('input[aria-label="预设名称"]');
  await presetName.fill('旧接口独立预设');
  await dialog.getByRole('button',{name:'保存预设',exact:true}).click();
  await dialog.getByRole('button',{name:'复制为新预设',exact:true}).click();
  await dialog.getByRole('button',{name:'保存新预设',exact:true}).click();
  const assignment=dialog.locator('.uos-worldbook-assignment select').first();
  await assignment.selectOption({label:'旧接口独立预设 副本'});
  page.once('dialog',dialog=>dialog.accept());
  await dialog.getByRole('button',{name:'删除预设',exact:true}).click();
  assert.equal(await assignment.inputValue(),'','deleting a preset clears its opening assignments');
  await assignment.selectOption({label:'旧接口独立预设'});
  await dialog.locator('[data-save]').click();
  await page.waitForFunction(()=>{const data=window.__state.characters[0].data.extensions.universal_opening_selector;const preset=data.worldbookPresets.find(item=>item.name==='旧接口独立预设');return preset&&data.entries[0].worldbookPresetId===preset.id&&preset.books[0].entries.find(e=>e.uid===9).enabled===false});

  const savedTitle=await page.evaluate(()=>window.__state.characters[0].data.extensions.universal_opening_selector.entries[0].title);
  await selector.locator('[data-settings-button]').click();
  await dialog.locator('.uos-entry .uos-fields input').first().fill('这项改动将放弃');
  await dialog.locator('[data-close="[data-settings-dialog]"]').click();
  await dialog.locator('[data-uos-unsaved-prompt]').getByRole('button',{name:'继续编辑'}).click();
  assert.equal(await page.locator('iframe[data-uos-frame]').count(),1,'continue editing keeps settings open');
  await dialog.locator('[data-close="[data-settings-dialog]"]').click();
  await dialog.locator('[data-uos-unsaved-prompt]').getByRole('button',{name:'放弃更改'}).click();
  await page.locator('iframe[data-uos-frame]').waitFor({state:'detached'});
  assert.equal(await page.evaluate(()=>window.__state.characters[0].data.extensions.universal_opening_selector.entries[0].title),savedTitle,'discard leaves character-card settings unchanged');

  await selector.locator('[data-settings-button]').click();
  await dialog.locator('.uos-entry .uos-fields input').first().fill('这项改动会保存');
  await dialog.locator('[data-close="[data-settings-dialog]"]').click();
  await dialog.locator('[data-uos-unsaved-prompt]').getByRole('button',{name:'保存并关闭'}).click();
  await page.waitForFunction(()=>window.__state.characters[0].data.extensions.universal_opening_selector.entries[0].title==='这项改动会保存');
  await page.locator('iframe[data-uos-frame]').waitFor({state:'detached'});
  await selector.locator('[data-settings-button]').click();
  await dialog.locator('[data-close="[data-settings-dialog]"]').click();
  await page.locator('iframe[data-uos-frame]').waitFor({state:'detached'});

  await selector.locator('.uos-card').first().click();
  await page.waitForFunction(()=>window.__state.swipe===1&&window.__worldbooks['旧接口角色书'][0].enabled===false);
  assert.deepEqual(errors,[]);
  console.log('One script switches player and author modes; author buttons work under hostile chat CSS');
}finally{await browser.close()}
