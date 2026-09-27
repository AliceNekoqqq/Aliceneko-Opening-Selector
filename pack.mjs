#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const VERSION = 'v0.1.0-beta.13';
const CDN = `https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${VERSION}`;
const LOADER_NAME = '红豆粉开场白选择器 Loader';

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error('Usage: node pack.mjs character.json output.json');
  process.exit(2);
}
const card = JSON.parse(fs.readFileSync(input, 'utf8'));
const data = card.data || card;
const first = String(data.first_mes ?? card.first_mes ?? '');
const oldAlts = Array.isArray(data.alternate_greetings) ? data.alternate_greetings : [];
const hasSelector = first.includes('<UniversalOpeningSelector/>');
const greetings = hasSelector ? oldAlts : [first, ...oldAlts].filter(Boolean);
if (!greetings.length) throw new Error('角色卡至少需要一条开场白');

const infer = (s, i) => {
  const clean = String(s).replace(/<[^>]*>/g, ' ').replace(/\{\{[^}]*\}\}/g, ' ').replace(/[#*_`>\[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
  return {title: clean.slice(0, 20) || `开场 ${i+1}`, description: clean.slice(20, 88), label: `OPENING ${String(i+1).padStart(2, '0')}`, image: ''};
};
const previous = data.extensions?.universal_opening_selector || {};
const config = {
  version: 1,
  title: previous.title || '选择故事的起点',
  subtitle: previous.subtitle || '选择一个开场，故事将从那里继续。',
  theme: previous.theme || 'archive',
  entries: greetings.map((s,i) => previous.entries?.[i] || infer(s,i)),
  music: {enabled:previous.music?.enabled ?? Boolean(previous.music?.audio),title:previous.music?.title||'',audio:previous.music?.audio||'',lyrics:previous.music?.lyrics||''},
};

const css = fs.readFileSync(new URL('./src/selector.css',import.meta.url),'utf8').replace(/<\/style/gi,'<\\/style');
const html = `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style id="uos-css">${css}</style></head><body>
<main class="uos" data-uos data-theme="archive"><div class="uos-top"><span class="uos-kicker">CHOOSE YOUR BEGINNING</span><div class="uos-actions"><button type="button" class="uos-icon" data-theme-button aria-label="切换主题">◈ 主题</button><button type="button" class="uos-icon" data-settings-button aria-label="作者设置">⚙ 设置</button></div></div>
<h1 data-title></h1><p class="uos-intro" data-subtitle></p><section class="uos-player" data-player hidden aria-label="开场音乐播放器"><div class="uos-player-head"><span class="uos-player-record" aria-hidden="true"></span><div class="uos-player-meta"><span class="uos-player-kicker">SOUNDTRACK · 开场音乐</span><strong data-music-title></strong></div><div class="uos-player-controls"><button type="button" data-skip="-10" aria-label="快退10秒">↶</button><button type="button" data-play aria-label="播放">▶</button><button type="button" data-skip="10" aria-label="快进10秒">↷</button></div></div><div class="uos-player-track"><input type="range" data-seek min="0" max="1000" value="0" aria-label="音乐播放进度"><span data-clock>0:00 / 0:00</span></div><div class="uos-lyrics" data-lyrics>♫</div><audio preload="metadata"></audio></section><div class="uos-grid" data-grid></div>
<p class="uos-footer">选择后进入对应的正式开场。也可使用酒馆首条消息的翻页箭头。当前聊天开始后不能重新选择。</p><div class="uos-status" data-status role="status"></div>
<div class="uos-dialog" data-theme-dialog hidden><div class="uos-sheet"><div class="uos-sheet-head"><h2>切换主题</h2><button type="button" class="uos-icon" data-close="[data-theme-dialog]">关闭</button></div><div class="uos-theme-grid" data-theme-grid></div></div></div>
<div class="uos-dialog" data-settings-dialog hidden><div class="uos-sheet"><div class="uos-sheet-head"><h2>作者设置</h2><button type="button" class="uos-icon" data-close="[data-settings-dialog]">关闭</button></div><nav class="uos-tabs" aria-label="设置分类"><button type="button" data-tab="openings" aria-selected="true">开场白</button><button type="button" data-tab="bgm" aria-selected="false">BGM</button></nav><section data-tab-panel="openings"><p class="uos-help">已读取 ${greetings.length} 条正式开场。修改后点击下方保存，并从酒馆导出更新的角色卡。</p><div data-settings-fields></div></section><section data-tab-panel="bgm" hidden><p class="uos-help">上传音乐和 LRC/TXT 歌词。文件会在选择页预览，保存后随角色卡导出。</p><div data-bgm-fields></div><p class="uos-help">音频内嵌会增加角色卡体积。请确认分享权利；可在 https://www.gequhai.com/ 查找曲目。</p></section><button type="button" class="uos-save" data-save>保存到角色卡</button><p class="uos-help" data-save-state role="status"></p></div></div>
</main><script type="application/json" id="uos-seed">${JSON.stringify(config).replace(/</g,'\\u003c')}</script><script type="module">
const urls = [
  '${CDN}/index.js',
  'https://testingcf.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${VERSION}/index.js',
  'https://fastly.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${VERSION}/index.js'
];
const errors = [];
for (const url of urls) {
  try {
    const module = await import(url);
    if (module.OPENING_SELECTOR_VERSION !== '${VERSION.slice(1)}') throw new Error('版本不符');
    if (module.mountOpeningSelector()) break;
    throw new Error('页面未挂载');
  } catch (error) { errors.push(error?.message || String(error)); }
}
if (errors.length === urls.length) document.querySelector('[data-status]').textContent = '选择器加载失败：' + errors.join(' | ');
</script></body></html>`;

data.first_mes = '<UniversalOpeningSelector/>\n\n【请选择开场】如果选择页没有出现，请使用酒馆首条消息的翻页箭头。';
data.alternate_greetings = greetings;
data.extensions ||= {};
data.extensions.universal_opening_selector = config;
data.extensions.regex_scripts ||= [];
data.extensions.regex_scripts = data.extensions.regex_scripts.filter(x => x.findRegex !== '<UniversalOpeningSelector/>');
data.extensions.regex_scripts.push({
  id: crypto.randomUUID(), scriptName: `红豆粉开场白选择器 / Aliceneko Opening Selector ${VERSION}`, disabled: false,
  runOnEdit: true, findRegex:'<UniversalOpeningSelector/>', replaceString:'```html\n'+html+'\n```',
  trimStrings:[], placement:[2], substituteRegex:0, minDepth:null,maxDepth:null,
  markdownOnly:true,promptOnly:false,
});
// Tavern Helper scripts are separate from regex scripts. Importing a card must
// bring both entries along, while preserving unrelated author scripts.
data.extensions.tavern_helper ||= {};
data.extensions.tavern_helper.scripts ||= [];
data.extensions.tavern_helper.variables ||= {};
const loaderContent = `const urls = [\n  '${CDN}/index.js',\n  'https://testingcf.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${VERSION}/index.js',\n  'https://fastly.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${VERSION}/index.js'\n];\nlet selector, errors = [];\nfor (const url of urls) {\n  try {\n    selector = await import(url);\n    if (selector.OPENING_SELECTOR_VERSION === '${VERSION.slice(1)}') break;\n    throw new Error('版本不符');\n  } catch (error) { errors.push(error?.message || String(error)); selector = null; }\n}\nif (!selector) throw new Error('红豆粉开场白选择器加载失败：' + errors.join(' | '));\nselector.mountOpeningSelector(globalThis.$?.('body')?.[0]?.ownerDocument || document);`;
const scripts = data.extensions.tavern_helper.scripts;
const existing = scripts.find(x => x.name?.startsWith(LOADER_NAME));
const loader = {
  type:'script', enabled:true, name:`${LOADER_NAME} ${VERSION}`,
  id:existing?.id || crypto.randomUUID(), content:loaderContent,
  info:'加载当前角色卡的开场选择页；配置和媒体保存在角色卡内。',
  button:{enabled:false,buttons:[]}, data:{}, export_with:{data:true,button:true},
};
data.extensions.tavern_helper.scripts = scripts.filter(x => !x.name?.startsWith(LOADER_NAME));
data.extensions.tavern_helper.scripts.push(loader);
if (card.data) {
  card.first_mes=data.first_mes;
  // Some consumers read top-level fields, others read data fields.
  card.alternate_greetings=data.alternate_greetings;
}
fs.mkdirSync(path.dirname(path.resolve(output)), {recursive:true});
fs.writeFileSync(output,JSON.stringify(card,null,2));
console.log(`Packed ${greetings.length} openings into ${output}`);
