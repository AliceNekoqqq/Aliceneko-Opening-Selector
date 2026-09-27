import {greetingTitle,greetingNames,narrativeStart,excludedTags,isLegacyGeneratedEntry} from './player.js';
/* 红豆粉开场白选择器 / Aliceneko Opening Selector — embedded card runtime. */
export async function optimizeCoverData(source,file,doc=document){
  if(file?.type==='image/gif'||!/^data:image\/(?:png|jpeg|webp);base64,/i.test(source))return source;
  try{
    const ImageClass=doc.defaultView?.Image||Image;
    const image=new ImageClass();
    await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=source});
    const width=image.naturalWidth||image.width,height=image.naturalHeight||image.height;
    if(!width||!height)return source;
    const scale=Math.min(1,960/Math.max(width,height));
    const canvas=doc.createElement('canvas');canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
    const context=canvas.getContext('2d');if(!context)return source;
    context.drawImage(image,0,0,canvas.width,canvas.height);
    const optimized=canvas.toDataURL('image/webp',.82);
    return optimized.startsWith('data:image/webp;base64,')&&optimized.length<source.length?optimized:source;
  }catch{return source}
}
export function mountInDocument(doc = document, helperApi = null) {
  const KEY = 'universal_opening_selector';
  const VERSION = '0.1.0-beta.37';
  const WATERMARK = '唯一来源Discord:♡Aliceneko♡/红豆粉丨本插件完全免费';
  const THEMES = [['archive','旧档案'],['neon','霓虹夜'],['paper','纸与墨'],['noir','黑白电影'],['meadow','林间信'],['ancient','锦书古风'],['starmap','星海航图'],['rose','绯色契约'],['wasteland','末日警报']];
  const root = doc.querySelector('[data-uos]');
  if (!root || root.dataset.uosVersion === VERSION) return false;
  if (root.dataset.uosMounted === '1') {
    let top=doc.defaultView;
    try { while(top.parent!==top){void top.parent.document;top=top.parent} } catch {}
    for(const wrap of top.document.querySelectorAll('[data-uos-portal]')) {
      const dialogs=wrap.shadowRoot?.querySelectorAll('[data-theme-dialog],[data-settings-dialog]');
      if(dialogs?.length===2){for(const dialog of dialogs){dialog.hidden=true;root.append(dialog)}wrap.remove()}
    }
    delete root.dataset.uosMounted;
  }
  const seed = JSON.parse(doc.getElementById('uos-seed').textContent);
  let host = doc.defaultView || window;
  for (let i=0;i<8;i++) {
    try { if (host.SillyTavern?.getContext) break; if (host.parent===host) break; void host.parent.document; host=host.parent; }
    catch { break; }
  }
  const context = () => host.SillyTavern?.getContext?.();
  const helper = () => {
    if (typeof helperApi?.setChatMessages === 'function') return helperApi;
    let w = doc.defaultView;
    for (let i=0;w && i<8;i++) {
      try { if (typeof w.TavernHelper?.setChatMessages === 'function') return w.TavernHelper;
        if (typeof w.setChatMessages === 'function') return w;
        if (w.parent === w) break; void w.parent.document; w=w.parent;
      } catch { break; }
    }
    return null;
  };
  const character = () => { const c=context(); return c?.characters?.[c.characterId]; };
  const stored = character()?.data?.extensions?.[KEY] ?? character()?.extensions?.[KEY];
  let config = normalize(stored || seed);
  let draft = null;
  let displayTheme = localTheme() || config.theme;
  let portaled = [];
  let activePopup = null;
  const $ = (s, base=root) => base.querySelector(s) || (base === root ? portaled.find(x=>x.matches(s)) || portaled.map(x=>x.querySelector(s)).find(Boolean) : null);
  const el = (tag, cls, content) => { const n=doc.createElement(tag); if(cls)n.className=cls; if(content!=null)n.textContent=String(content); return n; };
  function normalize(input) {
    const x=input && typeof input==='object' ? input : {};
    return {
      version:1, title:String(x.title||'选择故事的起点').slice(0,100),
      subtitle:String(x.subtitle||'选择一个开场，故事将从那里继续。').slice(0,400),
      theme:THEMES.some(t=>t[0]===x.theme)?x.theme:'archive',
      excludedTags:String(x.excludedTags||'').slice(0,500),
      entries:Array.isArray(x.entries)?x.entries.map((e,i)=>({
        title:String(e?.title||`开场 ${i+1}`).slice(0,100),
        description:String(e?.description||'').slice(0,300),
        label:String(e?.label||'').slice(0,60),
        ...(typeof e?.names==='string'?{names:e.names.slice(0,200)}:{}),
        image:String(e?.image||''),
      })):[],
      music:{enabled:x.music?.enabled == null ? Boolean(x.music?.audio) : Boolean(x.music.enabled),title:String(x.music?.title||''),audio:String(x.music?.audio||''),lyrics:String(x.music?.lyrics||'')},
    };
  }
  function greetingList(){
    const c=character();
    const first=c?.data?.first_mes ?? c?.first_mes ?? '';
    const alts=c?.data?.alternate_greetings ?? c?.alternate_greetings ?? [];
    // This packaged card reserves the main greeting (swipe 0) for the selector.
    return String(first).includes('<UniversalOpeningSelector/>') ? alts : [];
  }
  function infer(text,i){
    const source=String(text||''),excluded=excludedTags(config.excludedTags);
    const title=greetingTitle(source,i,excluded),body=narrativeStart(source,excluded);
    return {title,description:body.slice(title.length).trim().slice(0,140),names:greetingNames(source).join('、')};
  }
  function suggest(text,i){return infer(text,i)}
  function entries(){
    const greetings=greetingList();
    const count=greetings.length || config.entries.length;
    return Array.from({length:count},(_,i)=>{const generated=infer(greetings[i],i),saved=config.entries[i]||{};return isLegacyGeneratedEntry(greetings[i],saved,i)?{...generated,...saved,title:generated.title,description:generated.description}:{...generated,...saved}});
  }
  function localTheme(){try{return host.localStorage.getItem('uos_theme_'+(character()?.avatar||character()?.name||'current'))}catch{return null}}
  function setTheme(value,remember=true){displayTheme=value;root.dataset.theme=value;syncDialogTheme();if(remember)try{host.localStorage.setItem('uos_theme_'+(character()?.avatar||character()?.name||'current'),value)}catch{}}
  function syncDialogTheme(){const style=doc.defaultView.getComputedStyle(root);for(const dlg of portaled)for(const key of ['--bg','--panel','--text','--muted','--accent','--line','--art'])dlg.style.setProperty(key,style.getPropertyValue(key));}
  function showSheet(selector){
    if(activePopup && !activePopup.frame?.isConnected){activePopup.original.append(activePopup.sheet);activePopup=null;portaled=[]}
    if(activePopup){status('弹窗已打开，请先关闭当前窗口。');return null}
    const original=$(selector),sheet=original?.querySelector('.uos-sheet');
    if(!sheet){status('设置界面尚未就绪，请刷新页面重试。');return null}
    let hostDoc=root.__uosHostDocument;
    if(!hostDoc){let w=doc.defaultView;try{while(w.parent!==w){void w.parent.document;w=w.parent}}catch{}hostDoc=w.document}
    if(hostDoc===doc){status('无法在酒馆页面打开弹窗：请确认角色卡内的作者脚本已启用。');return null}
    const frame=hostDoc.createElement('iframe');
    frame.setAttribute('title',selector.includes('theme')?'切换主题':'作者设置');
    frame.setAttribute('data-uos-frame','');
    const kind=selector.includes('theme')?'theme':'settings';
    const viewport=hostDoc.defaultView;
    const width=Math.min(kind==='theme'?460:780,Math.max(260,viewport.innerWidth-24));
    const height=Math.min(kind==='theme'?520:740,Math.max(260,viewport.innerHeight-24));
    frame.style.cssText=`position:fixed!important;left:${Math.max(12,(viewport.innerWidth-width)/2)}px!important;top:${Math.max(12,(viewport.innerHeight-height)/2)}px!important;width:${width}px!important;height:${height}px!important;border:0!important;margin:0!important;padding:0!important;z-index:2147483647!important;background:transparent!important;display:block!important;pointer-events:auto!important`;
    try{
      (hostDoc.body||hostDoc.documentElement).append(frame);
      const frameDoc=frame.contentDocument;
      if(!frameDoc)throw Error('设置 iframe 无法访问');
      const css=doc.getElementById('uos-css')?.textContent||'';
      frameDoc.open();frameDoc.write(`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}</style><style>${css}</style><style>.uos-dialog{display:block!important;position:static!important;width:100%!important;height:100%!important;padding:0!important;overflow:hidden!important;background:transparent!important}.uos-sheet{width:100%!important;height:100%!important;max-height:100%!important;max-width:100%!important;overflow:auto!important;box-shadow:none!important}.uos-sheet-head{position:sticky;top:-20px;z-index:2;background:var(--bg);padding:8px 0;cursor:grab;touch-action:none;user-select:none}.uos-sheet-head:active{cursor:grabbing}.uos-sheet-head button{cursor:pointer;touch-action:auto}.uos-save{position:sticky;bottom:0;z-index:2;box-shadow:0 0 0 8px var(--bg)}body[data-kind="theme"] .uos-theme-grid{grid-template-columns:repeat(2,minmax(0,1fr))}@media(max-width:600px){.uos-sheet{border-radius:16px!important;padding:16px!important}.uos-sheet-head{top:-16px}}</style></head><body data-kind="${kind}"><div class="uos-dialog" data-uos-overlay></div></body></html>`);frameDoc.close();
      const overlay=frameDoc.querySelector('[data-uos-overlay]');overlay.append(sheet);
      portaled=[sheet];syncDialogTheme();
      const drag=sheet.querySelector('.uos-sheet-head');
      let origin=null;
      const move=e=>{if(!origin)return;const left=Math.max(0,Math.min(viewport.innerWidth-frame.offsetWidth,origin.left+e.screenX-origin.x));const top=Math.max(0,Math.min(viewport.innerHeight-frame.offsetHeight,origin.top+e.screenY-origin.y));frame.style.setProperty('left',`${left}px`,'important');frame.style.setProperty('top',`${top}px`,'important')};
      const stop=()=>{origin=null;drag?.removeEventListener('pointermove',move);drag?.removeEventListener('pointerup',stop)};
      drag?.addEventListener('pointerdown',e=>{if(e.target.closest('button,input,textarea,select,a'))return;origin={x:e.screenX,y:e.screenY,left:frame.offsetLeft,top:frame.offsetTop};drag.setPointerCapture(e.pointerId);drag.addEventListener('pointermove',move);drag.addEventListener('pointerup',stop);e.preventDefault()});
      const clampWindow=()=>{frame.style.setProperty('left',`${Math.max(0,Math.min(viewport.innerWidth-frame.offsetWidth,frame.offsetLeft))}px`,'important');frame.style.setProperty('top',`${Math.max(0,Math.min(viewport.innerHeight-frame.offsetHeight,frame.offsetTop))}px`,'important')};
      viewport.addEventListener('resize',clampWindow);
      const close=()=>{stop();viewport.removeEventListener('resize',clampWindow);original.append(sheet);portaled=[];frame.remove();activePopup=null;if(selector.includes('settings') && draft){draft=null;renderMusic(config.music);status('未保存的设置已撤销。')}};
      activePopup={complete:close,frame,original,sheet};
      frameDoc.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    }catch(e){original.append(sheet);portaled=[];frame.remove();activePopup=null;status(`弹窗打开失败：${e.message||e}`);return null}
    return sheet;
  }
  function status(message){$('[data-status]').textContent=message;const top=$('[data-top-status]');if(top)top.textContent=message;const inDialog=$('[data-save-state]');if(inDialog)inDialog.textContent=message}
  function render(){
    setTheme(displayTheme,false);
    $('[data-title]').textContent=config.title;
    $('[data-subtitle]').textContent=config.subtitle;
    const grid=$('[data-grid]');grid.replaceChildren();
    let filters=root.querySelector('.uos-search');
    if(!filters){filters=el('div','uos-search');const input=el('input'),person=el('select');input.type='search';input.placeholder='搜索标题、人物或正文';input.setAttribute('aria-label','搜索作者开场');person.setAttribute('aria-label','按人物筛选作者开场');input.oninput=()=>render();person.onchange=()=>render();filters.append(input,person);grid.before(filters)}
    const query=filters.querySelector('input').value.trim().toLocaleLowerCase(),person=filters.querySelector('select'),selected=person.value;
    const items=entries(),greetings=greetingList(),people=new Set();
    for(const entry of items)for(const name of String(entry.names||'').split(/[、，,\/]/).map(x=>x.trim()).filter(Boolean))people.add(name);
    person.replaceChildren();const all=el('option','','全部人物');all.value='';person.append(all);for(const name of people){const option=el('option','',name);option.value=name;person.append(option)}person.value=selected;
    let visible=0;
    items.forEach((entry,i)=>{
      const names=typeof entry.names==='string'?entry.names.trim():'';
      if(person.value&&!names.split(/[、，,\/]/).map(x=>x.trim()).includes(person.value))return;
      if(query&&![entry.title,entry.description,entry.label,names,greetings[i]].some(x=>String(x||'').toLocaleLowerCase().includes(query)))return;
      visible++;
      const shell=el('article','uos-card-shell');
      const card=el('button','uos-card');card.type='button';card.setAttribute('aria-label',`选择 ${entry.title}`);
      const cover=el('div','uos-cover');
      if (/^(data:image\/(?:png|jpeg|webp|gif);base64,|https?:\/\/)/i.test(entry.image)) {
        cover.classList.add('has-image');cover.style.backgroundImage=`linear-gradient(0deg,#0005,transparent),url("${entry.image.replace(/["\\]/g,'')}")`;
      }
      cover.append(el('span','uos-number',String(i+1).padStart(2,'0')));
      const body=el('div','uos-card-body');body.append(el('span','uos-label',entry.label||`OPENING ${String(i+1).padStart(2,'0')}`),el('strong','',entry.title));
      if(entry.description)body.append(el('div','uos-description',entry.description));
      body.append(el('p','uos-card-names',`登场人物 · ${names?names.replace(/[,，]/g,' / '):'未识别'}`));
      card.append(cover,body);card.addEventListener('click',()=>choose(i+1));shell.append(card);
      const source=greetings[i];
      if(source){const details=el('details','uos-card-details');details.append(el('summary','','预览完整正文'),el('pre','',source));shell.append(details)}
      grid.append(shell);
    });
    if(!visible)grid.append(el('p','uos-search-empty','没有匹配的开场，请换个关键词或人物。'));
    renderMusic(config.music);
    const kicker=root.querySelector('.uos-kicker');if(kicker&&!kicker.querySelector('.uos-version-badge'))kicker.append(el('small','uos-version-badge',`v${VERSION}`));
    let watermark=root.querySelector('[data-uos-watermark]');
    if(!watermark){watermark=el('p','uos-watermark',WATERMARK);watermark.dataset.uosWatermark='';watermark.append(el('span','uos-version',`v${VERSION}`));root.append(watermark)}
  }
  function formatTime(s){const n=Math.max(0,Math.floor(Number(s)||0));return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`}
  function lyricRows(source){
    const rows=[];
    for(const line of String(source||'').split(/\r?\n/)){
      const m=/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)/.exec(line);
      if(m)rows.push({time:+m[1]*60+(+m[2])+(+('0.'+(m[3]||'0'))),text:m[4].trim()});
    }
    return rows.sort((a,b)=>a.time-b.time);
  }
  function renderMusic(music){
    const player=$('[data-player]'),audio=$('audio',player),box=$('[data-lyrics]');
    player.hidden=!music.enabled;
    const source=music.enabled?music.audio:'';
    if(audio.getAttribute('src')!==source){audio.pause();if(source)audio.src=source;else audio.removeAttribute('src');audio.load()}
    $('[data-play]').disabled=!source;
    $('[data-music-title]').textContent=music.title||'开场音乐';
    box.replaceChildren();
    const rows=lyricRows(music.lyrics);
    if(rows.length){for(const row of rows){const b=el('button','uos-lyric-row',row.text);b.type='button';b.dataset.time=String(row.time);b.onclick=()=>{audio.currentTime=row.time};box.append(b)}}
    else box.textContent=music.lyrics?.trim()||'♫';
    updatePlayer();
  }
  function updatePlayer(){
    const audio=$('[data-player] audio'),duration=Number.isFinite(audio.duration)?audio.duration:0;
    $('[data-seek]').value=String(duration?Math.round(audio.currentTime/duration*1000):0);
    $('[data-clock]').textContent=`${formatTime(audio.currentTime)} / ${formatTime(duration)}`;
    $('[data-play]').textContent=audio.paused?'▶':'Ⅱ';
    const rows=Array.from($('[data-lyrics]').querySelectorAll('[data-time]'));
    let active=-1;rows.forEach((row,i)=>{if(+row.dataset.time<=audio.currentTime+.08)active=i;row.classList.toggle('is-active',i===active)});
    if(active>=0 && rows[active]!==updatePlayer.lastRow){const box=$('[data-lyrics]'),row=rows[active];box.scrollTo({top:row.offsetTop-box.offsetTop-(box.clientHeight-row.clientHeight)/2,behavior:'smooth'});updatePlayer.lastRow=row}
  }
  async function choose(target){
    const h=helper();if(!h){status('酒馆助手尚未就绪，请稍后重试或用首条消息翻页箭头。');return}
    let first;try{first=h.getChatMessages(0,{include_swipes:true})?.[0]}catch(e){status(`读取开场失败：${e?.message||e}`);return}
    if(!first || first.role!=='assistant' || !Array.isArray(first.swipes) || target>=first.swipes.length){status('开场尚未载入，请刷新后新建聊天。');return}
    if(Number(h.getLastMessageId?.()??0)>0){status('聊天已经开始，请新建聊天后选择开场。');return}
    if(first.swipe_id!==0 || !String(first.swipes[0]||'').includes('<UniversalOpeningSelector/>')){status('当前已离开选择页，请新建聊天后重试。');return}
    status(`正在进入第 ${target} 条开场…`);
    root.querySelectorAll('.uos-card').forEach(b=>b.disabled=true);
    try{
      await h.setChatMessages([{message_id:0,swipe_id:target}],{refresh:'all'});
      const current=h.getChatMessages(0,{include_swipes:true})?.[0];
      if(current?.swipe_id!==target)throw new Error('消息页未切换');
    }catch(e){status(`切换失败：${e?.message||e}。可使用首条消息翻页箭头。`);root.querySelectorAll('.uos-card').forEach(b=>b.disabled=false)}
  }
  function openThemes(){const dlg=showSheet('[data-theme-dialog]');if(!dlg)return;const grid=$('[data-theme-grid]');grid.replaceChildren();THEMES.forEach(([id,name])=>{const b=el('button','uos-theme-choice');b.type='button';b.setAttribute('aria-label',`切换到${name}`);b.setAttribute('aria-pressed',String(id===displayTheme));const swatch=el('span','uos-theme-swatch');swatch.dataset.theme=id;swatch.append(el('span','uos-theme-swatch-cover','01'),el('span','uos-theme-swatch-lines','Aa · 故事开场'));b.append(swatch,el('span','',name));b.onclick=()=>{setTheme(id);activePopup?.complete(null)};grid.append(b)});}
  function diagnostics(){
    const card=character(),data=card?.data||card||{},ext=data.extensions||{},greetings=greetingList();
    const roleScript=Array.isArray(ext.tavern_helper?.scripts)&&ext.tavern_helper.scripts.some(x=>/红豆粉开场白选择器 · (?:通用脚本|作者角色脚本)/.test(x.name||'')&&x.enabled&&x.export_with?.data);
    const legacy=Array.isArray(ext.regex_scripts)&&ext.regex_scripts.some(x=>x.findRegex==='<UniversalOpeningSelector/>'&&!x.disabled);
    const saved=Boolean(ext[KEY]);let size=0;try{size=new Blob([JSON.stringify(card||{})]).size}catch{}
    const media=entries().reduce((n,e)=>n+(e.image?.length||0),0)+(config.music.audio?.length||0);
    return [['正式开场',`${greetings.length} 条`],['选择页运行方式',roleScript?'作者角色脚本随卡导出':legacy?'旧版打包卡':'未检测到可导出的作者脚本'],['作者配置',saved?'已载入角色卡扩展字段':'当前使用默认配置'],['当前角色数据大小',size?`${(size/1048576).toFixed(2)} MB`:'无法估算'],['其中封面与音频数据',`${(media/1048576).toFixed(2)} MB`]];
  }
  function field(label,value,change,multiline=false){const wrap=el('label','uos-field');wrap.append(el('span','',label));const input=el(multiline?'textarea':'input');input.value=value||'';input.addEventListener('input',()=>change(input.value));wrap.append(input);return wrap}
  function toggleField(label,value,change){const wrap=el('label','uos-toggle');const input=el('input');input.type='checkbox';input.checked=Boolean(value);input.onchange=()=>change(input.checked);wrap.append(input,el('span','',label));return wrap}
  function fileField(label,accept,max,onload){const wrap=el('label','uos-field');wrap.append(el('span','',label));const input=el('input');input.type='file';input.accept=accept;input.onchange=async()=>{const file=input.files?.[0];if(!file)return;if(file.size>max){status(`${label}超过 ${Math.round(max/1048576)} MB 限制`);input.value='';return}try{const result=await readFile(file);const message=await onload(result,file);status(message||`${label}已载入，点击保存后随角色卡导出。`)}catch(e){status(`文件读取失败：${e.message}`)}};wrap.append(input);return wrap}
  const readFile=file=>new Promise((ok,fail)=>{const reader=new FileReader();reader.onload=()=>ok(String(reader.result));reader.onerror=()=>fail(reader.error);reader.readAsDataURL(file)});
  async function lyricsText(file){const text=await file.text();return text.slice(0,300000)}
  function openSettings(){
    const dlg=showSheet('[data-settings-dialog]');if(!dlg)return;
    draft ||= normalize(config);const fields=$('[data-settings-fields]');fields.replaceChildren();
    fields.append(field('页面标题',draft.title,v=>draft.title=v),field('页面导语',draft.subtitle,v=>draft.subtitle=v,true),field('标题中排除的 <字段>（逗号分隔）',draft.excludedTags,v=>draft.excludedTags=v));
    const list=el('div');fields.append(list);
    const greetings=greetingList();const items=entries();items.forEach((entry,i)=>{
      draft.entries[i] ||= {...entry};entry=draft.entries[i];const box=el('section','uos-entry');box.append(el('strong','',`第 ${i+1} 条开场`));
      if(greetings[i]){const source=el('details','uos-source');source.append(el('summary','','查看原开场正文'),el('pre','',greetings[i]));box.append(source)}
      box.append(el('p','uos-help','卡片实时预览 · 保存后才会写入角色卡'));
      const preview=el('div','uos-card uos-card-preview'),cover=el('div','uos-cover'),body=el('div','uos-card-body');
      cover.append(el('span','uos-number',String(i+1).padStart(2,'0')));
      const label=el('span','uos-label'),title=el('strong'),description=el('div','uos-description'),namesPreview=el('p','uos-card-names');body.append(label,title,description,namesPreview);preview.append(cover,body);box.append(preview);
      const updatePreview=()=>{label.textContent=entry.label||`OPENING ${String(i+1).padStart(2,'0')}`;title.textContent=entry.title;description.textContent=entry.description;namesPreview.textContent=`登场人物 · ${entry.names||'未识别'}`;const image=/^(data:image\/(?:png|jpeg|webp|gif);base64,|https?:\/\/)/i.test(entry.image);cover.classList.toggle('has-image',image);cover.style.backgroundImage=image?`linear-gradient(0deg,#0005,transparent),url("${entry.image.replace(/["\\]/g,'')}")`:''};updatePreview();
      const group=el('div','uos-fields');group.append(
        field('标题',entry.title,v=>{entry.title=v;updatePreview()}),
        field('标签',entry.label,v=>{entry.label=v;updatePreview()}),
        field('登场人物（逗号分隔，输入“无”可隐藏误判）',entry.names===''?'无':entry.names||'',v=>{entry.names=v.trim()==='无'?'':v;updatePreview()}),
        field('简介',entry.description,v=>{entry.description=v;updatePreview()},true),
        fileField('上传封面（原图 8 MB 内）','image/png,image/jpeg,image/webp,image/gif',8*1048576,async(v,file)=>{const next=await optimizeCoverData(v,file,doc);if(next.length>1400000)throw Error('压缩后仍超过约 1 MB，请换更小的图片；GIF 动图不会压缩');entry.image=next;updatePreview();return next.length<v.length?`封面已压缩：${Math.round(v.length/1024)} KB → ${Math.round(next.length/1024)} KB，保存后随卡导出。`:'封面已载入；原图更小或不支持压缩，保存后随卡导出。'}));
      box.append(group);
      if(greetings[i]){const propose=el('button','uos-icon','从原文生成文案建议');propose.type='button';propose.onclick=()=>{const next=suggest(greetings[i],i);entry.title=next.title;entry.description=next.description;const inputs=group.querySelectorAll('input,textarea');inputs[0].value=entry.title;inputs[3].value=entry.description;updatePreview();status(`第 ${i+1} 条建议已填入，检查后再保存。`)};box.append(propose)}
      const clear=el('button','uos-icon','移除封面');clear.type='button';clear.onclick=()=>{entry.image='';updatePreview();status(`第 ${i+1} 条已改用主题排版封面`)};box.append(clear);list.append(box);
    });
    const music=$('[data-bgm-fields]');music.replaceChildren();
    music.append(toggleField('启用 BGM 播放器',draft.music.enabled,v=>{draft.music.enabled=v;renderMusic(draft.music);loaded.textContent=v?'BGM 已启用，保存后生效。':'BGM 已关闭，播放器已隐藏；保存后生效。'}),field('曲名',draft.music.title,v=>draft.music.title=v),
      fileField('上传音乐（8 MB 内）','audio/mpeg,audio/mp4,audio/ogg,audio/wav',8*1048576,v=>{draft.music.audio=v;renderMusic(draft.music);$('[data-bgm-loaded]').textContent=draft.music.enabled?'音乐已载入，可在选择页预览；点击保存写入角色卡。':'音乐已载入。勾选启用 BGM 后显示播放器，点击保存写入角色卡。'}),
      fileField('上传歌词（LRC 或 TXT）','.lrc,.txt,text/plain',300000,async(_data,file)=>{draft.music.lyrics=await lyricsText(file);renderMusic(draft.music);$('[data-bgm-loaded]').textContent='歌词已载入；点击保存写入角色卡。'}));
    const loaded=el('p','uos-help');loaded.dataset.bgmLoaded='';loaded.textContent=draft.music.audio?'已载入音乐'+(draft.music.lyrics?'及歌词':'')+'。保存后随卡导出。':'尚未上传音乐';music.append(loaded);
    const clearMusic=el('button','uos-icon','移除音乐');clearMusic.type='button';clearMusic.onclick=()=>{draft.music={enabled:false,title:'',audio:'',lyrics:''};renderMusic(draft.music);loaded.textContent='音乐已移除，点击保存生效'};music.append(clearMusic);
    music.append(el('p','uos-help','请仅上传你有权分享的歌曲及歌词。下载与非商用不自动授予再分发许可。'));
    const diag=$('[data-diagnostics]');diag.replaceChildren();for(const [key,value] of diagnostics()){const row=el('div','uos-diagnostic-row');row.append(el('span','',key),el('strong','',value));diag.append(row)}
    dlg.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>{
      dlg.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===button)));
      dlg.querySelectorAll('[data-tab-panel]').forEach(panel=>panel.hidden=panel.dataset.tabPanel!==button.dataset.tab);
    });
    $('[data-save]').onclick=async()=>{
      const c=context();if(!c || c.characterId==null || !c.writeExtensionField){status('无法写入角色卡：请在支持角色卡扩展字段的酒馆中编辑。');return}
      const button=$('[data-save]');button.disabled=true;button.textContent='正在保存…';
      try{
        draft.theme=displayTheme;
        draft.entries=draft.entries.slice(0,greetingList().length);
        // ST may update the in-memory character while a failed server merge is
        // only logged. Verify persistence before reporting export readiness.
        if(typeof c.getRequestHeaders!=='function')throw Error('当前酒馆未提供保存请求接口');
        const card=character();if(!card?.avatar)throw Error('无法确认当前角色卡的文件名');
        const response=await host.fetch('/api/characters/merge-attributes',{method:'POST',headers:c.getRequestHeaders(),body:JSON.stringify({avatar:card.avatar,data:{extensions:{[KEY]:draft}}})});
        if(!response.ok)throw Error(`角色卡写入失败（HTTP ${response.status}），请检查卡片大小或酒馆日志`);
        const verified=await host.fetch('/api/characters/get',{method:'POST',headers:c.getRequestHeaders(),body:JSON.stringify({avatar_url:card.avatar})});
        if(!verified.ok)throw Error(`角色卡复核失败（HTTP ${verified.status}），请重新打开角色卡检查保存结果`);
        const persisted=await verified.json();
        const saved=persisted?.data?.extensions?.[KEY]??persisted?.extensions?.[KEY];
        const same=(actual,expected)=>{if(expected&&typeof expected==='object'){if(!actual||typeof actual!=='object')return false;return Object.keys(expected).every(key=>same(actual[key],expected[key]))}return actual===expected};
        if(!same(saved,draft))throw Error('角色卡复核未找到刚保存的设置，请重新打开角色卡检查');
        await c.writeExtensionField(c.characterId,KEY,draft);
        config=normalize(draft);draft=null;render();activePopup?.complete(null);status('已保存并复核角色卡。导出角色卡时会带上配置和素材。');
      }catch(e){status(`保存失败：${e.message||e}`)}
      finally{button.disabled=false;button.textContent='保存到角色卡'}
    };
  }
  $('[data-theme-button]').onclick=openThemes;
  $('[data-settings-button]').onclick=openSettings;
  root.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>activePopup?.complete(null));
  const audio=$('[data-player] audio');
  $('[data-play]').onclick=()=>{if(audio.paused)audio.play().catch(()=>status('无法播放该音乐文件'));else audio.pause()};
  $('[data-player]').querySelectorAll('[data-skip]').forEach(b=>b.onclick=()=>{audio.currentTime=Math.max(0,Math.min(audio.duration||Infinity,audio.currentTime+Number(b.dataset.skip)));updatePlayer()});
  $('[data-seek]').oninput=e=>{if(Number.isFinite(audio.duration))audio.currentTime=audio.duration*Number(e.target.value)/1000};
  audio.ontimeupdate=updatePlayer;audio.onloadedmetadata=updatePlayer;audio.onplay=updatePlayer;audio.onpause=updatePlayer;
  render();
  root.dataset.uosMounted = '1';
  root.dataset.uosVersion = VERSION;
  return true;
}
