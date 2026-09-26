/* Universal Opening Selector — embedded card runtime, no external dependencies. */
(() => {
  'use strict';
  const KEY = 'universal_opening_selector';
  const THEMES = [['archive','旧档案'],['neon','霓虹夜'],['paper','纸与墨'],['noir','黑白电影'],['meadow','林间信']];
  const root = document.querySelector('[data-uos]');
  if (!root) return;
  const seed = JSON.parse(document.getElementById('uos-seed').textContent);
  let host = window;
  for (let i=0;i<8;i++) {
    try { if (host.SillyTavern?.getContext) break; if (host.parent===host) break; void host.parent.document; host=host.parent; }
    catch { break; }
  }
  const context = () => host.SillyTavern?.getContext?.();
  const character = () => { const c=context(); return c?.characters?.[c.characterId]; };
  const stored = character()?.data?.extensions?.[KEY];
  let config = normalize(stored || seed);
  let displayTheme = localTheme() || config.theme;
  const $ = (s, base=root) => base.querySelector(s);
  const el = (tag, cls, content) => { const n=document.createElement(tag); if(cls)n.className=cls; if(content!=null)n.textContent=String(content); return n; };
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
      music:{title:String(x.music?.title||''),audio:String(x.music?.audio||''),lyrics:String(x.music?.lyrics||'')},
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
  function setTheme(value,remember=true){displayTheme=value;root.dataset.theme=value;if(remember)try{host.localStorage.setItem('uos_theme_'+(character()?.avatar||character()?.name||'current'),value)}catch{}}
  function status(message){$('[data-status]').textContent=message}
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
    const player=$('[data-player]');player.hidden=!config.music.audio;
    const audio=$('audio',player);if(audio.src!==config.music.audio)audio.src=config.music.audio;
    $('[data-music-title]').textContent=config.music.title||'开场音乐';
  }
  async function choose(target){
    const c=context();if(!c?.chat?.length || c.chat.length!==1){status('聊天已经开始，请新建聊天后选择开场。');return}
    if(target>greetingList().length){status('这条开场不存在。请检查角色卡中的备用开场。');return}
    status(`正在进入第 ${target} 条开场…`);
    // Use SillyTavern's own swipe control so it performs its normal persistence/rendering.
    for(let attempts=0;attempts<target+2;attempts++){
      const current=Number(context()?.chat?.[0]?.swipe_id||0);
      if(current===target){status('已进入开场。');return}
      const selector=host.document.querySelector('.mes[mesid="0"] .swipe_right, .mes[mesid="0"] .swipe_right_button, .mes[mesid="0"] .swipe_right_button_wrapper');
      if(!selector){status('找不到酒馆翻页按钮。请使用首条消息的翻页箭头。');return}
      selector.click();await new Promise(resolve=>host.setTimeout(resolve,180));
    }
    status('未能完成切换，请使用首条消息的翻页箭头。');
  }
  function openThemes(){const dlg=$('[data-theme-dialog]');dlg.hidden=false;const grid=$('[data-theme-grid]');grid.replaceChildren();THEMES.forEach(([id,name])=>{const b=el('button','uos-theme-choice',name);b.type='button';b.setAttribute('aria-pressed',String(id===displayTheme));b.onclick=()=>{setTheme(id);dlg.hidden=true};grid.append(b)});}
  function field(label,value,change,multiline=false){const wrap=el('label','uos-field');wrap.append(el('span','',label));const input=el(multiline?'textarea':'input');input.value=value||'';input.addEventListener('input',()=>change(input.value));wrap.append(input);return wrap}
  function fileField(label,accept,max,onload){const wrap=el('label','uos-field');wrap.append(el('span','',label));const input=el('input');input.type='file';input.accept=accept;input.onchange=async()=>{const file=input.files?.[0];if(!file)return;if(file.size>max){status(`${label}超过 ${Math.round(max/1048576)} MB 限制`);input.value='';return}try{const result=await readFile(file);await onload(result,file);status(`${label}已载入，点击保存后随角色卡导出。`)}catch(e){status(`文件读取失败：${e.message}`)}};wrap.append(input);return wrap}
  const readFile=file=>new Promise((ok,fail)=>{const reader=new FileReader();reader.onload=()=>ok(String(reader.result));reader.onerror=()=>fail(reader.error);reader.readAsDataURL(file)});
  async function lyricsText(file){const text=await file.text();return text.slice(0,300000)}
  function openSettings(){
    const dlg=$('[data-settings-dialog]');dlg.hidden=false;
    const draft=normalize(config);const fields=$('[data-settings-fields]');fields.replaceChildren();
    fields.append(field('页面标题',draft.title,v=>draft.title=v),field('页面导语',draft.subtitle,v=>draft.subtitle=v,true));
    const list=el('div');fields.append(list);
    const items=entries();items.forEach((entry,i)=>{
      draft.entries[i]={...entry};const box=el('section','uos-entry');box.append(el('strong','',`第 ${i+1} 条开场`));
      const group=el('div','uos-fields');group.append(
        field('标题',entry.title,v=>draft.entries[i].title=v),
        field('标签',entry.label,v=>draft.entries[i].label=v),
        field('简介',entry.description,v=>draft.entries[i].description=v,true),
        fileField('上传封面（1 MB 内）','image/png,image/jpeg,image/webp,image/gif',1048576,v=>draft.entries[i].image=v));
      box.append(group);const clear=el('button','uos-icon','移除封面');clear.type='button';clear.onclick=()=>{draft.entries[i].image='';status(`第 ${i+1} 条已改用主题排版封面`)};box.append(clear);list.append(box);
    });
    const music=el('section','uos-entry');music.append(el('h3','', '音乐与歌词'));
    music.append(field('曲名',draft.music.title,v=>draft.music.title=v),
      fileField('上传音乐（8 MB 内）','audio/mpeg,audio/mp4,audio/ogg,audio/wav',8*1048576,v=>draft.music.audio=v),
      fileField('上传歌词（LRC 或 TXT）','.lrc,.txt,text/plain',300000,async(_data,file)=>{draft.music.lyrics=await lyricsText(file)}));
    const clearMusic=el('button','uos-icon','移除音乐');clearMusic.type='button';clearMusic.onclick=()=>{draft.music={title:'',audio:'',lyrics:''};status('已移除音乐，点击保存生效')};music.append(clearMusic);
    music.append(el('p','uos-help','请仅上传你有权分享的歌曲及歌词。下载与非商用不自动授予再分发许可。'));
    fields.append(music);
    $('[data-save]').onclick=async()=>{
      const c=context();if(!c || c.characterId==null || !c.writeExtensionField){status('无法写入角色卡：请在支持角色卡扩展字段的酒馆中编辑。');return}
      try{
        draft.theme=displayTheme;
        await c.writeExtensionField(c.characterId,KEY,draft);
        config=normalize(draft);render();dlg.hidden=true;status('已保存到角色卡。导出角色卡时会带上配置和素材。');
      }catch(e){status(`保存失败：${e.message||e}`)}
    };
  }
  function currentLyric(time){
    const lines=config.music.lyrics.split(/\r?\n/);let line='';
    for(const raw of lines){const match=/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)/.exec(raw);if(!match)continue;
      if(+match[1]*60+(+match[2])+(+('0.'+(match[3]||'0')))<=time)line=match[4].trim();}
    return line||'♫';
  }
  $('[data-theme-button]').onclick=openThemes;
  $('[data-settings-button]').onclick=openSettings;
  root.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>$(b.dataset.close).hidden=true);
  const audio=$('[data-player] audio');
  $('[data-play]').onclick=()=>{if(audio.paused)audio.play().catch(()=>status('无法播放该音乐文件'));else audio.pause()};
  audio.ontimeupdate=()=>{$('[data-lyric]').textContent=currentLyric(audio.currentTime)};
  audio.onplay=()=>{$('[data-play]').textContent='暂停'};audio.onpause=()=>{$('[data-play]').textContent='播放'};
  render();
})();
