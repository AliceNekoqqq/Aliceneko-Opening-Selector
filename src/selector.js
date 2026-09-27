/* 红豆粉开场白选择器 / Aliceneko Opening Selector — embedded card runtime. */
export function mountInDocument(doc = document) {
  const KEY = 'universal_opening_selector';
  const VERSION = '0.1.0-beta.15';
  const THEMES = [['archive','旧档案'],['neon','霓虹夜'],['paper','纸与墨'],['noir','黑白电影'],['meadow','林间信']];
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
      entries:Array.isArray(x.entries)?x.entries.map((e,i)=>({
        title:String(e?.title||`开场 ${i+1}`).slice(0,100),
        description:String(e?.description||'').slice(0,300),
        label:String(e?.label||'').slice(0,60),
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
    const clean=String(text||'').replace(/<[^>]*>/g,' ').replace(/\{\{[^}]*\}\}/g,' ').replace(/[#*_`>\[\]()]/g,' ').replace(/\s+/g,' ').trim();
    return {title:clean.slice(0,20)||`开场 ${i+1}`,description:clean.slice(20,88)};
  }
  function entries(){
    const greetings=greetingList();
    const count=greetings.length || config.entries.length;
    return Array.from({length:count},(_,i)=>({...infer(greetings[i],i),...(config.entries[i]||{})}));
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
    if(hostDoc===doc){status('无法在酒馆页面打开弹窗：请确认角色卡内的酒馆助手 Loader 已启用。');return null}
    const frame=hostDoc.createElement('iframe');
    frame.setAttribute('title',selector.includes('theme')?'切换主题':'作者设置');
    frame.setAttribute('data-uos-frame','');
    frame.style.cssText='position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border:0!important;margin:0!important;padding:0!important;z-index:2147483647!important;background:transparent!important;display:block!important';
    try{
      (hostDoc.body||hostDoc.documentElement).append(frame);
      const frameDoc=frame.contentDocument;
      if(!frameDoc)throw Error('设置 iframe 无法访问');
      const css=doc.getElementById('uos-css')?.textContent||'';
      frameDoc.open();frameDoc.write(`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}</style><style>${css}</style><style>.uos-dialog{display:grid!important;position:fixed!important;inset:0!important;z-index:1!important;pointer-events:auto!important;background:#08141b44!important}.uos-sheet{max-height:calc(100dvh - 24px)!important}.uos-sheet-head{position:sticky;top:-20px;z-index:2;background:var(--bg);padding:8px 0}.uos-save{position:sticky;bottom:0;z-index:2;box-shadow:0 0 0 8px var(--bg)}@media(max-width:600px){.uos-dialog{padding:12px!important}.uos-sheet{width:min(88vw,620px)!important;height:auto!important;max-height:min(72dvh,650px)!important;border-radius:16px!important;padding:16px!important}.uos-sheet-head{top:-16px}body[data-kind="theme"] .uos-sheet{width:min(84vw,420px)!important;max-height:55dvh!important}body[data-kind="theme"] .uos-theme-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}</style></head><body data-kind="${selector.includes('theme')?'theme':'settings'}"><div class="uos-dialog" data-uos-overlay></div></body></html>`);frameDoc.close();
      const overlay=frameDoc.querySelector('[data-uos-overlay]');overlay.append(sheet);
      portaled=[sheet];syncDialogTheme();
      const close=()=>{original.append(sheet);portaled=[];frame.remove();activePopup=null};
      activePopup={complete:close,frame,original,sheet};
      overlay.addEventListener('click',e=>{if(e.target===overlay)close()});
      frameDoc.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    }catch(e){original.append(sheet);portaled=[];frame.remove();activePopup=null;status(`弹窗打开失败：${e.message||e}`);return null}
    return sheet;
  }
  function status(message){$('[data-status]').textContent=message;const top=$('[data-top-status]');if(top)top.textContent=message;const inDialog=$('[data-save-state]');if(inDialog)inDialog.textContent=message}
  function render(){
    setTheme(displayTheme,false);
    $('[data-title]').textContent=config.title;
    $('[data-subtitle]').textContent=config.subtitle;
    const grid=$('[data-grid]'); grid.replaceChildren();
    entries().forEach((entry,i)=>{
      const card=el('button','uos-card');card.type='button';card.setAttribute('aria-label',`选择 ${entry.title}`);
      const cover=el('div','uos-cover');
      if (/^(data:image\/(?:png|jpeg|webp|gif);base64,|https?:\/\/)/i.test(entry.image)) {
        cover.classList.add('has-image');cover.style.backgroundImage=`linear-gradient(0deg,#0005,transparent),url("${entry.image.replace(/["\\]/g,'')}")`;
      }
      cover.append(el('span','uos-number',String(i+1).padStart(2,'0')));
      const body=el('div','uos-card-body');body.append(el('span','uos-label',entry.label||`OPENING ${String(i+1).padStart(2,'0')}`),el('strong','',entry.title),el('div','uos-description',entry.description));
      card.append(cover,body);card.addEventListener('click',()=>choose(i+1));grid.append(card);
    });
    renderMusic(config.music);
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
  function openThemes(){const dlg=showSheet('[data-theme-dialog]');if(!dlg)return;const grid=$('[data-theme-grid]');grid.replaceChildren();THEMES.forEach(([id,name])=>{const b=el('button','uos-theme-choice',name);b.type='button';b.setAttribute('aria-pressed',String(id===displayTheme));b.onclick=()=>{setTheme(id);activePopup?.complete(null)};grid.append(b)});}
  function field(label,value,change,multiline=false){const wrap=el('label','uos-field');wrap.append(el('span','',label));const input=el(multiline?'textarea':'input');input.value=value||'';input.addEventListener('input',()=>change(input.value));wrap.append(input);return wrap}
  function toggleField(label,value,change){const wrap=el('label','uos-toggle');const input=el('input');input.type='checkbox';input.checked=Boolean(value);input.onchange=()=>change(input.checked);wrap.append(input,el('span','',label));return wrap}
  function fileField(label,accept,max,onload){const wrap=el('label','uos-field');wrap.append(el('span','',label));const input=el('input');input.type='file';input.accept=accept;input.onchange=async()=>{const file=input.files?.[0];if(!file)return;if(file.size>max){status(`${label}超过 ${Math.round(max/1048576)} MB 限制`);input.value='';return}try{const result=await readFile(file);await onload(result,file);status(`${label}已载入，点击保存后随角色卡导出。`)}catch(e){status(`文件读取失败：${e.message}`)}};wrap.append(input);return wrap}
  const readFile=file=>new Promise((ok,fail)=>{const reader=new FileReader();reader.onload=()=>ok(String(reader.result));reader.onerror=()=>fail(reader.error);reader.readAsDataURL(file)});
  async function lyricsText(file){const text=await file.text();return text.slice(0,300000)}
  function openSettings(){
    const dlg=showSheet('[data-settings-dialog]');if(!dlg)return;
    draft ||= normalize(config);const fields=$('[data-settings-fields]');fields.replaceChildren();
    fields.append(field('页面标题',draft.title,v=>draft.title=v),field('页面导语',draft.subtitle,v=>draft.subtitle=v,true));
    const list=el('div');fields.append(list);
    const items=entries();items.forEach((entry,i)=>{
      draft.entries[i] ||= {...entry};entry=draft.entries[i];const box=el('section','uos-entry');box.append(el('strong','',`第 ${i+1} 条开场`));
      const group=el('div','uos-fields');group.append(
        field('标题',entry.title,v=>draft.entries[i].title=v),
        field('标签',entry.label,v=>draft.entries[i].label=v),
        field('简介',entry.description,v=>draft.entries[i].description=v,true),
        fileField('上传封面（1 MB 内）','image/png,image/jpeg,image/webp,image/gif',1048576,v=>draft.entries[i].image=v));
      box.append(group);const clear=el('button','uos-icon','移除封面');clear.type='button';clear.onclick=()=>{draft.entries[i].image='';status(`第 ${i+1} 条已改用主题排版封面`)};box.append(clear);list.append(box);
    });
    const music=$('[data-bgm-fields]');music.replaceChildren();
    music.append(toggleField('启用 BGM 播放器',draft.music.enabled,v=>{draft.music.enabled=v;renderMusic(draft.music);loaded.textContent=v?'BGM 已启用，保存后生效。':'BGM 已关闭，播放器已隐藏；保存后生效。'}),field('曲名',draft.music.title,v=>draft.music.title=v),
      fileField('上传音乐（8 MB 内）','audio/mpeg,audio/mp4,audio/ogg,audio/wav',8*1048576,v=>{draft.music.audio=v;renderMusic(draft.music);$('[data-bgm-loaded]').textContent=draft.music.enabled?'音乐已载入，可在选择页预览；点击保存写入角色卡。':'音乐已载入。勾选启用 BGM 后显示播放器，点击保存写入角色卡。'}),
      fileField('上传歌词（LRC 或 TXT）','.lrc,.txt,text/plain',300000,async(_data,file)=>{draft.music.lyrics=await lyricsText(file);renderMusic(draft.music);$('[data-bgm-loaded]').textContent='歌词已载入；点击保存写入角色卡。'}));
    const loaded=el('p','uos-help');loaded.dataset.bgmLoaded='';loaded.textContent=draft.music.audio?'已载入音乐'+(draft.music.lyrics?'及歌词':'')+'。保存后随卡导出。':'尚未上传音乐';music.append(loaded);
    const clearMusic=el('button','uos-icon','移除音乐');clearMusic.type='button';clearMusic.onclick=()=>{draft.music={enabled:false,title:'',audio:'',lyrics:''};renderMusic(draft.music);loaded.textContent='音乐已移除，点击保存生效'};music.append(clearMusic);
    music.append(el('p','uos-help','请仅上传你有权分享的歌曲及歌词。下载与非商用不自动授予再分发许可。'));
    dlg.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>{
      dlg.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===button)));
      dlg.querySelectorAll('[data-tab-panel]').forEach(panel=>panel.hidden=panel.dataset.tabPanel!==button.dataset.tab);
    });
    $('[data-save]').onclick=async()=>{
      const c=context();if(!c || c.characterId==null || !c.writeExtensionField){status('无法写入角色卡：请在支持角色卡扩展字段的酒馆中编辑。');return}
      const button=$('[data-save]');button.disabled=true;button.textContent='正在保存…';
      try{
        draft.theme=displayTheme;
        // ST may update the in-memory character while a failed server merge is
        // only logged. Verify persistence before reporting export readiness.
        if(typeof c.getRequestHeaders!=='function')throw Error('当前酒馆未提供保存请求接口');
        const card=character();if(!card?.avatar)throw Error('无法确认当前角色卡的文件名');
        const response=await host.fetch('/api/characters/merge-attributes',{method:'POST',headers:c.getRequestHeaders(),body:JSON.stringify({avatar:card.avatar,data:{extensions:{[KEY]:draft}}})});
        if(!response.ok)throw Error(`角色卡写入失败（HTTP ${response.status}），请检查卡片大小或酒馆日志`);
        await c.writeExtensionField(c.characterId,KEY,draft);
        config=normalize(draft);draft=null;render();activePopup?.complete(null);status('已保存到角色卡。导出角色卡时会带上配置和素材。');
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
