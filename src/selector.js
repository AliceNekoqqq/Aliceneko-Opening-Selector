import {readPeopleRoster,applyPeopleRoster} from './opening-people.js';
import {createOpeningPeopleEditor} from './opening-people-editor.js';
import {createWorldbookPresetEditor} from './worldbook-preset-editor.js';
import {bindBrandImages,createMascotNote} from './brand-mark.js';
import {applyBrandVisibility,normalizeBrandVisibility} from './brand-visibility.js';
import {optimizeCoverData} from './media-files.js';
import {createMediaPlayer} from './media-player.js';
import {createSettingsFields} from './settings-fields.js';
import {renderMusicSettings} from './music-settings.js';
import {RUNTIME_VERSION} from './version.js';
import {createOpeningBlindBox,openingBlindBoxButton,updateBlindBoxButton,openingBlindRangeButton,setBlindBoxTheme} from './opening-blind-box.js';
import {createOpeningFavorites} from './opening-favorites.js';
import {createOpeningFavoritesUI} from './opening-favorites-ui.js';
import {createAuthorOpeningCard} from './author-opening-card.js';
import {createAuthorPagePreview} from './author-page-preview.js';
import {createThemeBackgroundController} from './theme-backgrounds.js';
import {THEMES} from './themes.js';
import {defaultCoverStyles} from './default-covers.js';
import {OPENING_LAYOUTS,openingLayout,coverPresentation,applyOpeningCover} from './opening-presentation.js';
import {createCoverSettings} from './cover-settings.js';
import {createOpeningPreview} from './opening-preview.js';
import {openingMetadata,matchesOpening} from './opening-categories.js';
import {createOpeningCategoryFilters,createOpeningGroupRenderer} from './opening-category-ui.js';
import {bindUpdateControl} from './update-control.js';
import {greetingTitle,detectGreetingCollection,narrativeStart,excludedTags,isLegacyGeneratedEntry,personAliases} from './greeting-analysis.js';
import {createWorldbookPeopleReader,renderWorldbookPeopleList,formatWorldbookPeopleStatus} from './worldbook-people.js';
import {createOpeningGenerator} from './opening-generator.js';
import {createWorldbookPresetManager,migrateWorldbookPresetAssignments} from './worldbook-presets.js';
/* 红豆粉开场白选择器 / Aliceneko Opening Selector — author UI runtime. */
export {optimizeCoverData} from './media-files.js';
export function mountInDocument(doc = document, helperApi = null, {backgroundService=null}={}) {
  const KEY = 'universal_opening_selector';
  const VERSION = RUNTIME_VERSION;
  const WATERMARK = '唯一来源Discord:♡Aliceneko♡/红豆粉丨本插件完全免费';
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
  root.__uosDispose?.();
  const stopMascot=bindBrandImages(root);
  const backgroundControl=createThemeBackgroundController(root,'--uos-theme-bg-active',doc.defaultView,{service:backgroundService});
  let mediaPlayer,settingsFields,worldbookEditor,openingPreview,pagePreview,favoriteUI,blindBox,generator,peopleEditor;
  let previewItems=[],allDrawItems=[];
  root.__uosDispose=()=>{peopleEditor?.dispose();generator?.dispose();stopMascot();blindBox?.dispose();favoriteUI?.dispose();pagePreview?.dispose();openingPreview?.dispose();backgroundControl?.close();mediaPlayer?.close();settingsFields?.close();worldbookEditor?.close()};
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
  const readWorldbookPeople=createWorldbookPeopleReader(()=>[helperApi,doc.defaultView?.TavernHelper,doc.defaultView,host.TavernHelper,host]);
  const worldbookPresetManager=createWorldbookPresetManager(()=>[helperApi,doc.defaultView?.TavernHelper,doc.defaultView,host.TavernHelper,host],character);
  let worldbookPeople=[],worldbookDiagnostics=[],worldbookMessage='正在读取角色世界书人物名单…';
  let settingsDraftBaseline=null,pendingSettingsTasks=0,saveSettingsToCard=async()=>false;
  async function refreshWorldbookPeople(refresh=false){
    const card=character(),identity=card?.avatar;
    try{const result=await readWorldbookPeople(card,{refresh});if(root.isConnected===false||character()?.avatar!==identity)return;
      worldbookPeople=applyPeopleRoster(result.people,readPeopleRoster(host,identity));worldbookDiagnostics=result.diagnostics||[];worldbookMessage=formatWorldbookPeopleStatus(result);render();
    }catch{worldbookMessage='世界书读取失败，继续识别正文中的明确姓名；可重新读取。'}
    pagePreview?.refresh();
    const note=$('[data-worldbook-status]');if(note)note.textContent=worldbookMessage;const list=$('[data-worldbook-list]');if(list)renderWorldbookPeopleList(doc,list,worldbookPeople,worldbookDiagnostics);
  }
  const stored = character()?.data?.extensions?.[KEY] ?? character()?.extensions?.[KEY];
  let config = normalize(stored || seed);
  let draft = null;
  let displayTheme = localTheme() || config.theme;
  let portaled = [];
  let activePopup = null;
  const $ = (s, base=root) => base.querySelector(s) || (base === root ? portaled.find(x=>x.matches(s)) || portaled.map(x=>x.querySelector(s)).find(Boolean) : null);
  const el = (tag, cls, content) => { const n=doc.createElement(tag); if(cls)n.className=cls; if(content!=null)n.textContent=String(content); return n; };
  mediaPlayer=createMediaPlayer(root,{status});
  const renderMusic=music=>{mediaPlayer.render(music);pagePreview?.refresh()};
  settingsFields=createSettingsFields({el,view:doc.defaultView||globalThis,
    getDraft:()=>draft,status,onPendingChange:count=>{pendingSettingsTasks=count}});
  const {field,fileField}=settingsFields;
  generator=createOpeningGenerator({doc:host.document,host,helper:helper(),getContext:context,mode:'author',
    sources:()=>[helperApi,doc.defaultView?.TavernHelper,doc.defaultView,host.TavernHelper,host],readWorldbook:readWorldbookPeople,getPalette:()=>root,
    getKnownNames:()=>[...entries().flatMap(entry=>String(entry.names||'').split(/[、,，]/)),...personAliases(config.personAliases).values()],
    beforeOpen:async()=>{if(activePopup){await activePopup.complete();if(activePopup)return false}return true},
    onSaved:result=>{config=normalize(result.settings);render();status(result.message)}});
  peopleEditor=createOpeningPeopleEditor({doc:host.document,host,getContext:context,readWorldbook:readWorldbookPeople,getPalette:()=>root,
    getKnownNames:()=>[...entries().flatMap(entry=>String(entry.names||'').split(/[、,，]/)),...personAliases(config.personAliases).values()],
    beforeOpen:async()=>{if(!await generator.prepareForUpdate())return false;if(activePopup){await activePopup.complete();if(activePopup)return false}return true},onSaved:()=>{void refreshWorldbookPeople()}});
  const openingGroups=createOpeningGroupRenderer({el,gridClass:'uos-grid'});
  const previewAvatar=character()?.avatar,previewCharacterId=context()?.characterId;
  const favoritesStore=createOpeningFavorites(host,previewAvatar);
  favoriteUI=createOpeningFavoritesUI({el,store:favoritesStore,onChange:()=>render(),
    isActive:()=>root.isConnected!==false&&character()?.avatar===previewAvatar&&context()?.characterId===previewCharacterId,
    onUnavailable:()=>status('浏览器未能保存，收藏暂时只在当前窗口有效。')});
  openingPreview=createOpeningPreview({doc:host.document,host,getItems:()=>previewItems,getPalette:()=>root,
    onChoose:async item=>{if(context()?.characterId!==previewCharacterId||character()?.avatar!==previewAvatar||root.isConnected===false){status('角色或聊天已变化，请重新打开选择器。');return}await choose(item.id)}});
  blindBox=createOpeningBlindBox({doc:host.document,host,getItems:()=>previewItems,getAllItems:()=>allDrawItems,avatar:previewAvatar,getPalette:()=>root,
    onRangeChange:result=>{render();if(!result.persisted)status('浏览器未能保存，抽卡设置暂时只在当前页面有效。')},
    isActive:()=>root.isConnected!==false&&character()?.avatar===previewAvatar&&context()?.characterId===previewCharacterId,
    onPreview:(item,trigger,pool)=>{if(!openingPreview.open(item.id,trigger,pool))status('筛选结果已变化，请重新抽取。')},
    onChoose:item=>choose(item.id),onUnavailable:()=>status('角色或聊天已变化，请重新打开选择器。'),
    onError:error=>status(`进入开场失败：${error?.message||error}`)});
  const blindTrigger=openingBlindBoxButton(el,button=>{if(activePopup){status('请先关闭当前主题或设置窗口。');return}blindBox.open(button)},displayTheme);
  const blindRangeTrigger=openingBlindRangeButton(el,button=>{if(activePopup){status('请先关闭当前主题或设置窗口。');return}blindBox.openRange(button)});
  worldbookEditor=createWorldbookPresetEditor({doc,el,query:$,getDraft:()=>draft,entries,
    manager:worldbookPresetManager,character,isConnected:()=>root.isConnected!==false,
    status,confirmPresetDelete});
  function normalize(input) {
    const x=input && typeof input==='object' ? input : {};
    const worldbookConfig=migrateWorldbookPresetAssignments(x.entries,x.worldbookPresets);
    return {
      version:1, title:String(x.title||'选择故事的起点').slice(0,100),
      subtitle:String(x.subtitle||'选择一个开场，故事将从那里继续。').slice(0,400),
      theme:THEMES.some(t=>t[0]===x.theme)?x.theme:'archive',
      branding:normalizeBrandVisibility(x.branding),
      layout:openingLayout(x.layout),
      excludedTags:String(x.excludedTags||'').slice(0,500),
      personAliases:String(x.personAliases||'').slice(0,1500),
      entries:worldbookConfig.entries.map((e,i)=>({
        title:String(e?.title||'开场 '+(i+1)).slice(0,100),
        description:String(e?.description||'').slice(0,300),
        label:String(e?.label||'').slice(0,60),
        ...openingMetadata(e),
        ...(typeof e?.names==='string'?{names:e.names.slice(0,200)}:{}),
        ...(typeof e?.worldbookPresetId==='string'&&worldbookConfig.presets.some(preset=>preset.id===e.worldbookPresetId)?{worldbookPresetId:e.worldbookPresetId}:{}),
        image:String(e?.image||''),
        ...coverPresentation(e),
      })),
      worldbookPresets:worldbookConfig.presets,
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
  function infer(text,i,people,settings=config){
    const source=String(text||''),excluded=excludedTags(settings.excludedTags);
    const title=greetingTitle(source,i,excluded),body=narrativeStart(source,excluded);
    const detected=people||detectGreetingCollection([source],{aliases:settings.personAliases,worldbookPeople})[0];
    return {title,description:body.slice(title.length).trim().slice(0,140),names:detected.names.join('、'),nameSuggestions:detected.suggestions};
  }
  function suggest(text,i){return infer(text,i)}
  function entries(settings=config){
    const greetings=greetingList();
    const count=greetings.length;
    const people=detectGreetingCollection(greetings,{characterName:character()?.data?.name||character()?.name,knownNames:settings.entries.flatMap(entry=>typeof entry.names==='string'?entry.names.split(/[、，,\/]/).map(x=>x.trim()):[]),aliases:settings.personAliases,worldbookPeople});
    return Array.from({length:count},(_,i)=>{const generated=infer(greetings[i],i,people[i],settings),saved=settings.entries[i]||{};return isLegacyGeneratedEntry(greetings[i],saved,i)?{...generated,...saved,title:generated.title,description:generated.description}:{...generated,...saved}});
  }
  function localTheme(){try{return host.localStorage.getItem('uos_theme_'+(character()?.avatar||character()?.name||'current'))}catch{return null}}
  const defaultCoverStyle=doc.createElement('style');defaultCoverStyle.textContent=defaultCoverStyles('.uos');root.append(defaultCoverStyle);
  function setTheme(value,remember=true){displayTheme=value;root.dataset.theme=value;setBlindBoxTheme(blindTrigger,value);void backgroundControl?.setTheme(value);syncDialogTheme();pagePreview?.refresh();if(remember)try{host.localStorage.setItem('uos_theme_'+(character()?.avatar||character()?.name||'current'),value)}catch{}}
  function syncDialogTheme(){const style=doc.defaultView.getComputedStyle(root);for(const dlg of portaled){dlg.style.setProperty('color-scheme',style.colorScheme);for(const key of ['--bg','--panel','--text','--muted','--accent','--line','--art',...Array.from({length:5},(_,i)=>`--uos-default-cover-${i+1}`)])dlg.style.setProperty(key,style.getPropertyValue(key));}}
  function hasUnsavedSettings(){
    if(!draft)return false;
    if(worldbookEditor.hasUnsaved()||pendingSettingsTasks>0)return true;
    try{return settingsDraftBaseline!==null&&JSON.stringify(normalize({...draft,theme:displayTheme}))!==settingsDraftBaseline}catch{return true}
  }
  function showUnsavedSettingsPrompt(frameDoc,sheet){
    return new Promise(resolve=>{
      const previous=frameDoc.activeElement,overlay=frameDoc.createElement('div');
      overlay.dataset.uosUnsavedPrompt='';overlay.setAttribute('role','presentation');
      overlay.style.cssText='position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:16px;background:#0009;color:var(--text)';
      for(const key of ['--bg','--panel','--text','--muted','--accent','--line'])overlay.style.setProperty(key,sheet.style.getPropertyValue(key));
      const panel=frameDoc.createElement('section');panel.setAttribute('role','alertdialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-labelledby','uos-unsaved-title');panel.setAttribute('aria-describedby','uos-unsaved-description');
      panel.style.cssText='width:min(420px,100%);padding:20px;border:1px solid var(--accent);border-radius:14px;background:var(--bg);color:var(--text);box-shadow:0 18px 54px #000b';
      const title=frameDoc.createElement('h2');title.id='uos-unsaved-title';title.textContent='有未保存的改动';title.style.cssText='margin:0 0 8px;font-size:18px';
      const description=frameDoc.createElement('p');description.id='uos-unsaved-description';description.textContent='这些设置还没有写入角色卡。';description.style.cssText='margin:0 0 18px;color:var(--muted);font-size:13px;line-height:1.5';
      const actions=frameDoc.createElement('div');actions.style.cssText='display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px';
      let settled=false;const buttons=[];
      const finish=value=>{if(settled)return;settled=true;frameDoc.removeEventListener('keydown',onKeyDown,true);overlay.remove();try{previous?.focus?.()}catch{}resolve(value)};
      const makeButton=(label,className,value)=>{const button=frameDoc.createElement('button');button.type='button';button.className=className;button.textContent=label;button.onclick=()=>finish(value);buttons.push(button);actions.append(button);return button};
      const save=makeButton('保存并关闭','uos-save','save');makeButton('放弃更改','uos-icon','discard');makeButton('继续编辑','uos-icon','stay');
      const onKeyDown=event=>{
        if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();finish('stay');return}
        if(event.key==='Tab'){
          const index=buttons.indexOf(frameDoc.activeElement);
          if(event.shiftKey&&(index<=0)){event.preventDefault();buttons.at(-1).focus()}
          else if(!event.shiftKey&&(index===buttons.length-1)){event.preventDefault();buttons[0].focus()}
        }
      };
      overlay.addEventListener('pointerdown',event=>{if(event.target===overlay)finish('stay')});
      panel.append(title,description,actions);overlay.append(panel);frameDoc.body.append(overlay);frameDoc.addEventListener('keydown',onKeyDown,true);save.focus();
    });
  }
  function confirmPresetDelete(name){
    const frameDoc=activePopup?.frame?.contentDocument;if(!frameDoc)return Promise.resolve(false);
    return new Promise(resolve=>{
      const dialog=frameDoc.createElement('dialog');dialog.dataset.uosPresetDelete='';
      dialog.style.cssText='width:min(420px,calc(100% - 32px));padding:20px;border:1px solid var(--accent);border-radius:14px;background:var(--bg);color:var(--text)';
      for(const key of ['--bg','--panel','--text','--accent'])dialog.style.setProperty(key,activePopup.sheet.style.getPropertyValue(key));
      const text=frameDoc.createElement('p');text.textContent='删除预设“'+name+'”？已分配的开场也会清空。';
      const actions=frameDoc.createElement('div');actions.style.cssText='display:flex;justify-content:flex-end;gap:8px';
      const cancel=frameDoc.createElement('button'),remove=frameDoc.createElement('button');cancel.type=remove.type='button';cancel.className='uos-icon';remove.className='uos-save';cancel.textContent='取消';remove.textContent='删除预设';
      let settled=false;const finish=value=>{if(settled)return;settled=true;dialog.remove();resolve(value)};
      cancel.onclick=()=>finish(false);remove.onclick=()=>finish(true);
      dialog.addEventListener('cancel',event=>{event.preventDefault();finish(false)});
      dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation();finish(false)}});
      actions.append(cancel,remove);dialog.append(text,actions);frameDoc.body.append(dialog);
      try{dialog.showModal()}catch{dialog.setAttribute('open','');dialog.style.cssText+=';position:fixed;inset:0;margin:auto;height:fit-content;z-index:2147483647';dialog.setAttribute('role','alertdialog');dialog.setAttribute('aria-modal','true')}
      cancel.focus();
    });
  }
  function showSheet(selector){
    if(activePopup && !activePopup.frame?.isConnected){pagePreview?.dispose();pagePreview=null;activePopup.original.append(activePopup.sheet);activePopup=null;portaled=[]}
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
    frame.style.cssText=`position:fixed!important;left:${Math.max(12,(viewport.innerWidth-width)/2)}px!important;top:${Math.max(12,(viewport.innerHeight-height)/2)}px!important;width:${width}px!important;height:${height}px!important;border:0!important;margin:0!important;padding:0!important;z-index:99990!important;background:transparent!important;border-radius:16px!important;clip-path:inset(0 round 16px)!important;color-scheme:normal!important;display:block!important;pointer-events:auto!important`;
    try{
      (hostDoc.body||hostDoc.documentElement).append(frame);
      const frameDoc=frame.contentDocument;
      if(!frameDoc)throw Error('设置 iframe 无法访问');
      const css=doc.getElementById('uos-css')?.textContent||'';
      frameDoc.open();frameDoc.write(`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}</style><style>${css}</style><style>html,body{background:transparent!important;color-scheme:normal!important}.uos-dialog{display:block!important;position:static!important;width:100%!important;height:100%!important;padding:0!important;overflow:hidden!important;background:transparent!important}.uos-sheet{width:100%!important;height:100%!important;max-height:100%!important;max-width:100%!important;overflow:auto!important;box-shadow:none!important}.uos-sheet-head{position:sticky;top:-20px;z-index:2;background:var(--bg);padding:8px 0;cursor:grab;touch-action:none;user-select:none}.uos-sheet-head:active{cursor:grabbing}.uos-sheet-head button{cursor:pointer;touch-action:auto}.uos-save{position:sticky;bottom:0;z-index:2;box-shadow:0 0 0 8px var(--bg)}body[data-kind="theme"] .uos-theme-grid{grid-template-columns:repeat(2,minmax(0,1fr))}@media(max-width:600px){.uos-sheet{border-radius:16px!important;padding:16px!important}.uos-sheet-head{top:-16px}}</style></head><body data-kind="${kind}"><div class="uos-dialog" data-uos-overlay></div></body></html>`);frameDoc.close();
      const overlay=frameDoc.querySelector('[data-uos-overlay]');overlay.append(sheet);
      portaled=[sheet];syncDialogTheme();
      const drag=sheet.querySelector('.uos-sheet-head');
      let origin=null;
      const move=e=>{if(!origin)return;const left=Math.max(0,Math.min(viewport.innerWidth-frame.offsetWidth,origin.left+e.screenX-origin.x));const top=Math.max(0,Math.min(viewport.innerHeight-frame.offsetHeight,origin.top+e.screenY-origin.y));frame.style.setProperty('left',`${left}px`,'important');frame.style.setProperty('top',`${top}px`,'important')};
      const stop=()=>{origin=null;drag?.removeEventListener('pointermove',move);drag?.removeEventListener('pointerup',stop)};
      drag?.addEventListener('pointerdown',e=>{if(e.target.closest('button,input,textarea,select,a'))return;origin={x:e.screenX,y:e.screenY,left:frame.offsetLeft,top:frame.offsetTop};drag.setPointerCapture(e.pointerId);drag.addEventListener('pointermove',move);drag.addEventListener('pointerup',stop);e.preventDefault()});
      const clampWindow=()=>{frame.style.setProperty('left',`${Math.max(0,Math.min(viewport.innerWidth-frame.offsetWidth,frame.offsetLeft))}px`,'important');frame.style.setProperty('top',`${Math.max(0,Math.min(viewport.innerHeight-frame.offsetHeight,frame.offsetTop))}px`,'important')};
      viewport.addEventListener('resize',clampWindow);
      let closeInProgress=false;
      const cleanup=discarded=>{
        stop();viewport.removeEventListener('resize',clampWindow);original.append(sheet);portaled=[];frame.remove();activePopup=null;
        if(selector.includes('settings')){pagePreview?.dispose();pagePreview=null;const hadDraft=Boolean(draft);draft=null;settingsDraftBaseline=null;applyBrandVisibility(root,config.branding);worldbookEditor.reset();renderMusic(config.music);if(discarded&&hadDraft)status('未保存的设置已放弃。')}
      };
      const close=async()=>{
        if(closeInProgress)return;closeInProgress=true;
        if(selector.includes('settings')&&hasUnsavedSettings()){
          const choice=await showUnsavedSettingsPrompt(frameDoc,sheet);
          if(choice==='stay'){closeInProgress=false;return}
          if(choice==='save'){
            const saved=await saveSettingsToCard({closeOnSuccess:false,commitPresetDraft:true});
            if(!saved){closeInProgress=false;return}
            cleanup(false);return;
          }
          cleanup(true);return;
        }
        cleanup(false);
      };
      activePopup={complete:close,frame,original,sheet};
      frameDoc.addEventListener('keydown',e=>{if(e.key==='Escape'&&!frameDoc.querySelector('[data-uos-unsaved-prompt]')){e.preventDefault();void close()}});
    }catch(e){original.append(sheet);portaled=[];frame.remove();activePopup=null;status(`弹窗打开失败：${e.message||e}`);return null}
    return sheet;
  }
  function status(message){$('[data-status]').textContent=message;const top=$('[data-top-status]');if(top)top.textContent=message;const inDialog=$('[data-save-state]');if(inDialog)inDialog.textContent=message}
  function render(){
    setTheme(displayTheme,false);
    applyBrandVisibility(root,draft?.branding||config.branding);
    root.dataset.layout=config.layout;
    $('[data-title]').textContent=config.title;
    $('[data-subtitle]').textContent=config.subtitle==='选择一个开场，故事将从那里继续。'?'':config.subtitle;
    const grid=$('[data-grid]');grid.replaceChildren();
    previewItems=[];
    let filters=root.querySelector('.uos-search');
    if(!filters){filters=el('div','uos-search');const input=el('input'),person=el('select');input.type='search';input.placeholder='搜索标题、人物或正文';input.setAttribute('aria-label','搜索作者开场');person.setAttribute('aria-label','按人物筛选作者开场');input.oninput=()=>render();person.onchange=()=>render();filters.append(input,person);grid.before(filters)}
    const query=filters.querySelector('input').value.trim().toLocaleLowerCase(),person=filters.querySelector('select'),selected=person.value;
    const items=entries(),greetings=greetingList(),people=new Set();
    const rows=favoriteUI.update(items.map((entry,i)=>({...entry,...openingMetadata(entry),id:i,body:greetings[i]||'',names:String(entry.names||'').split(/[、，,\/]/).map(name=>name.trim()).filter(Boolean)})));
    if(!filters.contains(favoriteUI.element))filters.append(favoriteUI.element);
    if(!filters.__uosCategories){filters.__uosCategories=createOpeningCategoryFilters({el,onChange:()=>render()});filters.append(filters.__uosCategories.element)}filters.__uosCategories.update(rows);
    if(!filters.contains(blindTrigger))filters.append(blindTrigger,blindRangeTrigger);
    allDrawItems=rows.filter(entry=>entry.body).map(entry=>({...entry,id:entry.id+1,number:entry.id+1,coverIndex:entry.id}));
    const openingCount=$('[data-opening-count]');if(openingCount)openingCount.textContent=`共 ${items.length} 个开场`;
    for(const entry of items)for(const name of String(entry.names||'').split(/[、，,\/]/).map(x=>x.trim()).filter(Boolean))people.add(name);
    person.replaceChildren();const all=el('option','','全部人物');all.value='';person.append(all);for(const name of people){const option=el('option','',name);option.value=name;person.append(option)}person.value=selected;
    const categoryValues=filters.__uosCategories.values(),filtered=rows.filter(row=>(!favoriteUI.onlyFavorites()||row.favorite)&&matchesOpening(row,{query,person:person.value,...categoryValues})),visible=filtered.length;
    openingGroups.render(filtered,grid,(entry,target)=>{
      const i=entry.id,source=greetings[i];
      if(source)previewItems.push({...entry,id:i+1,number:i+1,coverIndex:i,body:source,names:entry.names,suggestions:entry.nameSuggestions});
      target.append(createAuthorOpeningCard({el,entry,index:i,body:source,host,onChoose:choose,favoriteButton:favoriteUI.button(entry),
        onPreview:(id,button)=>{if(activePopup){status('请先关闭当前主题或设置窗口。');return}openingPreview.open(id,button)}}));
    },rows);
    updateBlindBoxButton(blindTrigger,blindBox.poolItems(),{theme:displayTheme,manual:blindBox.rangeMode()==='manual'});blindRangeTrigger.textContent=blindBox.rangeSummary();
    let result=root.querySelector('.uos-results');if(!result){result=el('p','uos-results');result.setAttribute('role','status');grid.before(result)}result.textContent=favoriteUI.onlyFavorites()||query||person.value||categoryValues.group!==null||categoryValues.tag?`找到 ${visible} / ${items.length} 个开场`:`${items.length} 个开场 · 点击卡片进入`;
    if(!visible)grid.append(createMascotNote(el,'search',favoriteUI.onlyFavorites()?'没有匹配的收藏开场；关闭「只看收藏」，点击卡片旁的 ☆ 添加收藏。':'没有匹配的开场，请调整关键词或筛选条件。','uos-search-empty').element);
    renderMusic(config.music);
    const actions=root.querySelector('.uos-actions');if(actions&&!actions.querySelector('.uos-version-badge'))actions.append(el('small','uos-version-badge',`v${VERSION}`));
    let watermark=root.querySelector('[data-uos-watermark]');
    if(!watermark){watermark=el('p','uos-watermark',WATERMARK);watermark.dataset.uosWatermark='';watermark.append(el('span','uos-version',`v${VERSION}`));root.append(watermark)}
  }
  async function choose(target){
    const h=helper();if(!h){status('酒馆助手尚未就绪，请稍后重试或用首条消息翻页箭头。');return}
    let first;try{first=h.getChatMessages(0,{include_swipes:true})?.[0]}catch(e){status(`读取开场失败：${e?.message||e}`);return}
    if(!first || first.role!=='assistant' || !Array.isArray(first.swipes) || target>=first.swipes.length){status('开场尚未载入，请刷新后新建聊天。');return}
    if(Number(h.getLastMessageId?.()??0)>0){status('聊天已经开始，请新建聊天后选择开场。');return}
    if(first.swipe_id!==0 || !String(first.swipes[0]||'').includes('<UniversalOpeningSelector/>')){status('当前已离开选择页，请新建聊天后重试。');return}
    status(`正在进入第 ${target} 条开场…`);
    root.querySelectorAll('.uos-card').forEach(b=>b.disabled=true);
    const openingCharacterId=context()?.characterId,openingAvatar=character()?.avatar;
    let worldbookChange=null;
    try{
      const presetId=entries()[target-1]?.worldbookPresetId;
      const preset=config.worldbookPresets.find(value=>value.id===presetId);
      if(preset){status('正在应用此开场的世界书条目预设…');worldbookChange=await worldbookPresetManager.apply(preset)}
      if(context()?.characterId!==openingCharacterId||character()?.avatar!==openingAvatar||Number(h.getLastMessageId?.()??0)>0)throw Error('角色或聊天已变化，请重新打开选择器');
      await h.setChatMessages([{message_id:0,swipe_id:target}],{refresh:'all'});
      const current=h.getChatMessages(0,{include_swipes:true})?.[0];
      if(current?.swipe_id!==target)throw new Error('消息页未切换');
    }catch(e){
      let rollbackMessage='';
      if(worldbookChange)try{await worldbookChange.rollback()}catch(rollbackError){rollbackMessage=`；世界书状态恢复失败：${rollbackError?.message||rollbackError}`}
      status(`切换失败：${e?.message||e}${rollbackMessage}。可使用首条消息翻页箭头。`);root.querySelectorAll('.uos-card').forEach(b=>b.disabled=false)
    }
  }
  function openThemes(){const dlg=showSheet('[data-theme-dialog]');if(!dlg)return;const grid=$('[data-theme-grid]');grid.replaceChildren();THEMES.forEach(([id,name])=>{const b=el('button','uos-theme-choice');b.type='button';b.setAttribute('aria-label',`切换到${name}`);b.setAttribute('aria-pressed',String(id===displayTheme));const swatch=el('span','uos-theme-swatch');swatch.dataset.theme=id;swatch.append(el('span','uos-theme-swatch-cover','01'),el('span','uos-theme-swatch-lines','Aa · 故事开场'));const icon=el('span','uos-theme-swatch-art');icon.dataset.theme=id;icon.setAttribute('aria-hidden','true');swatch.append(icon);b.append(swatch,el('span','',name));b.onclick=()=>{setTheme(id);activePopup?.complete(null)};grid.append(b)});}
  function diagnostics(){
    const card=character(),data=card?.data||card||{},ext=data.extensions||{},greetings=greetingList();
    const roleScript=Array.isArray(ext.tavern_helper?.scripts)&&ext.tavern_helper.scripts.some(x=>/红豆粉开场白选择器 · (?:通用脚本|作者角色脚本)/.test(x.name||'')&&x.enabled&&x.export_with?.data);
    const legacy=Array.isArray(ext.regex_scripts)&&ext.regex_scripts.some(x=>x.findRegex==='<UniversalOpeningSelector/>'&&!x.disabled);
    const saved=Boolean(ext[KEY]);let size=0;try{size=new Blob([JSON.stringify(card||{})]).size}catch{}
    const media=entries().reduce((n,e)=>n+(e.image?.length||0),0)+(config.music.audio?.length||0);
    return [['正式开场',`${greetings.length} 条`],['选择页运行方式',roleScript?'作者角色脚本随卡导出':legacy?'旧版打包卡':'未检测到可导出的作者脚本'],['作者配置',saved?'已载入角色卡扩展字段':'当前使用默认配置'],['当前角色数据大小',size?`${(size/1048576).toFixed(2)} MB`:'无法估算'],['其中封面与音频数据',`${(media/1048576).toFixed(2)} MB`]];
  }
  function ensureUpdateSettings(dlg){
    if(dlg.querySelector('[data-tab="updates"]'))return;
    const tabs=dlg.querySelector('.uos-tabs');if(!tabs)return;
    const tab=el('button','');tab.type='button';tab.dataset.tab='updates';tab.setAttribute('aria-selected','false');const art=el('span','uos-tab-art');art.dataset.tabArt='updates';art.setAttribute('aria-hidden','true');tab.append(art,el('span','','更新'));
    const panel=el('section','uos-update-section');panel.dataset.tabPanel='updates';panel.hidden=true;
    const version=el('p','uos-help',`当前运行版本：v${VERSION}`);
    const auto=el('label','uos-toggle'),autoCheck=el('input');autoCheck.type='checkbox';auto.append(autoCheck,el('span','','启动时自动检查更新'));
    const hint=el('p','uos-help','关闭后下次启动不自动检查；仍可手动检查更新。');
    const check=el('button','uos-icon','检查更新');check.type='button';
    panel.append(version,auto,hint,check);tabs.after(panel);tabs.append(tab);
    bindUpdateControl(check,host.document,{versionElements:[...root.querySelectorAll('.uos-version-badge,.uos-version')],autoCheckInput:autoCheck,autoCheckHint:hint});
  }
  function openSettings(){
    const dlg=showSheet('[data-settings-dialog]');if(!dlg)return;
    ensureUpdateSettings(dlg);
    draft ||= normalize(config);pagePreview?.dispose();const manuallyEditedNames=new Set(),fields=$('[data-settings-fields]');fields.replaceChildren();
    const pageFields=el('section','uos-settings-group');pageFields.append(el('h3','','页面信息'),el('p','uos-help','先设置选择页的标题与导语，再编辑每条开场。'),field('页面标题',draft.title,v=>draft.title=v),field('页面导语',draft.subtitle,v=>draft.subtitle=v,true));fields.append(pageFields);
    const brandOptions=el('div','uos-branding-options');brandOptions.append(el('strong','uos-branding-title','页眉显示'));
    const addBrandToggle=(key,label)=>{const row=el('label','uos-toggle'),input=el('input');input.type='checkbox';input.checked=draft.branding[key];input.setAttribute('aria-label',label);row.append(input,el('span','',label));input.onchange=()=>{draft.branding[key]=input.checked;applyBrandVisibility(root,draft.branding);pagePreview?.refresh()};brandOptions.append(row)};
    addBrandToggle('mascot','显示看板娘 Logo');addBrandToggle('title','显示「红豆粉开场白选择器」大标题');brandOptions.append(el('p','uos-help','底部来源信息会一直保留。'));pageFields.append(brandOptions);
    const layoutField=el('label','uos-layout-field'),layoutSelect=el('select');layoutField.append(el('span','','页面版式'),layoutSelect);layoutSelect.setAttribute('aria-label','页面版式');
    for(const [id,name] of OPENING_LAYOUTS){const option=el('option','',name);option.value=id;layoutSelect.append(option)}layoutSelect.value=draft.layout;
    layoutSelect.onchange=()=>{draft.layout=openingLayout(layoutSelect.value);for(const preview of fields.querySelectorAll('.uos-layout-preview'))preview.dataset.layout=draft.layout};pageFields.append(layoutField,el('p','uos-help','版式与主题可以自由搭配；原有卡片保留当前排列。'));
    const previewDraft=draft;
    pagePreview=createAuthorPagePreview({doc:activePopup.frame.contentDocument,watch:dlg,host,backgroundService,
      readModel:()=>{
        if(draft!==previewDraft||root.isConnected===false||character()?.avatar!==previewAvatar||context()?.characterId!==previewCharacterId)return null;
        const settings=normalize({...draft,theme:displayTheme,entries:draft.entries.map((entry,i)=>{
          if(manuallyEditedNames.has(i)||typeof config.entries[i]?.names==='string')return entry;
          const {names,...automatic}=entry;return automatic;
        })}),greetings=greetingList();
        const favoriteKeys=favoritesStore.keys(greetings),savedFavorites=favoritesStore.snapshot();
        return {...settings,items:entries(settings).map((entry,i)=>({...entry,...openingMetadata(entry),id:i,body:greetings[i]||'',favoriteKey:favoriteKeys[i],favorite:savedFavorites.has(favoriteKeys[i]),names:String(entry.names||'').split(/[、，,\/]/).map(name=>name.trim()).filter(Boolean)}))};
      }});fields.append(pagePreview.element);
    const recognition=el('details','uos-settings-group');recognition.append(el('summary','','高级 · 标题与人物识别'),field('标题中排除的 <字段>（逗号分隔）',draft.excludedTags,v=>draft.excludedTags=v));fields.append(recognition);
    const personRules=el('details','uos-person-rules');personRules.append(el('summary','','人物识别规则'));recognition.append(personRules);
    const worldbookList=el('ul');worldbookList.dataset.worldbookList='';renderWorldbookPeopleList(doc,worldbookList,worldbookPeople,worldbookDiagnostics);
    const aliasWarning=el('p','uos-help');aliasWarning.textContent=personAliases(draft.personAliases).conflicts.length?`重复别名未参与匹配：${personAliases(draft.personAliases).conflicts.join('、')}。请只保留一个归属。`:'';personRules.append(aliasWarning);
    const worldbookNote=el('p','uos-help',worldbookMessage);worldbookNote.dataset.worldbookStatus='';const reloadWorldbook=el('button','uos-icon','重新读取世界书');reloadWorldbook.type='button';reloadWorldbook.onclick=async()=>{reloadWorldbook.disabled=true;await refreshWorldbookPeople(true);reloadWorldbook.disabled=false};personRules.append(worldbookNote,worldbookList,reloadWorldbook,el('p','uos-help','仅读取角色绑定的世界书，明确姓名参与全文匹配，包含所有标签。普通触发关键词需手动确认；缺少明确姓名证据的标题、台词署名和人物标签先列为候选。'),field('人物与别名（每行一人：沈挽昼=挽昼,小沈）',draft.personAliases,v=>{draft.personAliases=v;aliasWarning.textContent=personAliases(v).conflicts.length?`重复别名未参与匹配：${personAliases(v).conflicts.join('、')}。请只保留一个归属。`:''},true));
    const list=el('div','uos-settings-entries');list.append(el('h3','','开场卡片'),el('p','uos-help','展开要修改的开场。收起只隐藏编辑项，不会清除修改。'));fields.append(list);
    const greetings=greetingList();const items=entries();items.forEach((entry,i)=>{
      draft.entries[i]={...entry,...draft.entries[i]};entry=draft.entries[i];const box=el('details','uos-entry uos-settings-entry');box.open=i===0;const entryHeading=el('summary','',`第 ${i+1} 条 · ${entry.title||'未命名开场'}`);box.append(entryHeading);box.addEventListener('toggle',()=>{if(box.open)for(const other of list.querySelectorAll('.uos-settings-entry'))if(other!==box)other.open=false});
      if(greetings[i]){const source=el('details','uos-source');source.append(el('summary','','查看原开场正文'),el('pre','',greetings[i]));box.append(source)}
      box.append(el('p','uos-help','卡片实时预览 · 保存后才会写入角色卡'));
      const previewWrap=el('div','uos-layout-preview');previewWrap.dataset.layout=draft.layout;
      const preview=el('div','uos-card uos-card-preview'),cover=el('div','uos-cover'),body=el('div','uos-card-body');
      cover.append(el('span','uos-number',String(i+1).padStart(2,'0')));
      const label=el('span','uos-label'),title=el('strong'),description=el('div','uos-description'),namesPreview=el('p','uos-card-names'),categoryPreview=el('div','uos-opening-tags');body.append(label,title,description,namesPreview,categoryPreview);preview.append(cover,body);previewWrap.append(preview);box.append(previewWrap);
      let coverSettings;
      const updatePreview=()=>{entryHeading.textContent=`第 ${i+1} 条 · ${entry.title||'未命名开场'}`;label.textContent=entry.label||`OPENING ${String(i+1).padStart(2,'0')}`;title.textContent=entry.title;description.textContent=entry.description;namesPreview.textContent=`登场人物 · ${typeof entry.names==='string'?entry.names||'未识别':'保存后重新自动识别'}`;applyOpeningCover(cover,entry,greetings[i]||entry.title,i,host,{shade:true});const metadata=openingMetadata(entry);categoryPreview.replaceChildren();for(const text of [metadata.group?`分组 · ${metadata.group}`:'',...metadata.tags].filter(Boolean))categoryPreview.append(el('span','',text));coverSettings?.refresh();pagePreview?.refresh()};updatePreview();
      const group=el('div','uos-fields');group.append(
        field('标题',entry.title,v=>{entry.title=v;updatePreview()}),
        field('卡片标注',entry.label,v=>{entry.label=v;updatePreview()}),
        field('登场人物（逗号分隔；留空恢复自动，输入“无”隐藏）',entry.names===''?'无':entry.names||'',v=>{if(v.trim()==='')delete entry.names;else entry.names=v.trim()==='无'?'':v;manuallyEditedNames.add(i);updatePreview()}),
        field('简介',entry.description,v=>{entry.description=v;updatePreview()},true),
        fileField('上传封面（原图 8 MB 内）','image/png,image/jpeg,image/webp,image/gif',8*1048576,async(v,file,settings)=>{const next=await optimizeCoverData(v,file,doc);if(!settingsFields.isCurrent(settings))return;if(next.length>1400000)throw Error('压缩后仍超过约 1 MB，请换更小的图片；GIF 动图不会压缩');entry.image=next;updatePreview();return next.length<v.length?`封面已压缩：${Math.round(v.length/1024)} KB → ${Math.round(next.length/1024)} KB，保存后随卡导出。`:'封面已载入；原图更小或不支持压缩，保存后随卡导出。'}));
      box.append(group);
      const categories=el('div','uos-fields');categories.append(field('分组（留空表示未分组）',entry.group,v=>{entry.group=openingMetadata({group:v}).group;updatePreview()}),field('筛选标签（逗号分隔）',openingMetadata(entry).tags.join('、'),v=>{entry.tags=openingMetadata({tags:v}).tags;updatePreview()}));box.append(categories,el('p','uos-help','同名分组会自动合并。筛选标签最多 12 个，每个最多 30 字，例如：雨夜、重逢。'));
      coverSettings=createCoverSettings({el,entry,onChange:updatePreview});box.append(coverSettings.element);
      if(entry.nameSuggestions?.length){const accept=el('button','uos-icon',`采纳候选：${entry.nameSuggestions.join('、')}`);accept.type='button';accept.onclick=()=>{entry.names=[...new Set([...(entry.names||'').split(/[、，,\/]/).filter(Boolean),...entry.nameSuggestions])].join('、');manuallyEditedNames.add(i);group.querySelectorAll('input,textarea')[2].value=entry.names;updatePreview();status('候选已填入人物字段，请检查后保存。')};box.append(accept)}
      if(greetings[i]){const propose=el('button','uos-icon','从原文生成文案建议');propose.type='button';propose.onclick=()=>{const next=suggest(greetings[i],i);entry.title=next.title;entry.description=next.description;const inputs=group.querySelectorAll('input,textarea');inputs[0].value=entry.title;inputs[3].value=entry.description;updatePreview();status(`第 ${i+1} 条建议已填入，检查后再保存。`)};box.append(propose)}
      const clear=el('button','uos-icon','移除封面');clear.type='button';clear.onclick=()=>{entry.image='';updatePreview();status(`第 ${i+1} 条已改用主题排版封面`)};box.append(clear);list.append(box);
    });
    renderMusicSettings({root:dlg,settings:draft,isCurrent:settingsFields.isCurrent,
      fields:settingsFields,renderMusic});
    const diag=$('[data-diagnostics]');diag.replaceChildren();for(const [key,value] of diagnostics()){const row=el('div','uos-diagnostic-row');row.append(el('span','',key),el('strong','',value));diag.append(row)}
    worldbookEditor.render();void worldbookEditor.refresh();
    dlg.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>{
      dlg.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===button)));
      dlg.querySelectorAll('[data-tab-panel]').forEach(panel=>panel.hidden=panel.dataset.tabPanel!==button.dataset.tab);
    });
    settingsDraftBaseline=JSON.stringify(normalize({...draft,theme:displayTheme}));
    saveSettingsToCard=async({closeOnSuccess=true,commitPresetDraft=false}={})=>{
      if(pendingSettingsTasks>0){status('文件仍在处理，请稍候后再保存。');return false}
      if(worldbookEditor.hasUnsaved()){
        if(!commitPresetDraft){status('当前预设尚未保存；请先点「保存预设」或「撤销修改」。');return false}
        if(!worldbookEditor.commitPending())return false;
      }
      const c=context();if(!c || c.characterId==null || !c.writeExtensionField){status('无法写入角色卡：请在支持角色卡扩展字段的酒馆中编辑。');return false}
      const button=$('[data-save]'),controls=[...dlg.querySelectorAll('input,textarea,select,button')],disabled=controls.map(control=>control.disabled);controls.forEach(control=>control.disabled=true);button.textContent='正在保存…';
      try{
        const saveData={...draft,theme:displayTheme,entries:draft.entries.slice(0,greetingList().length).map((entry,i)=>{
          const {nameSuggestions,...saved}=entry;
          if(manuallyEditedNames.has(i)||typeof config.entries[i]?.names==='string')return saved;
          const {names,...rest}=saved;return rest;
        })};
        // ST may update the in-memory character while a failed server merge is
        // only logged. Verify persistence before reporting export readiness.
        if(typeof c.getRequestHeaders!=='function')throw Error('当前酒馆未提供保存请求接口');
        const card=character(),saveCharacterId=c.characterId;if(!card?.avatar)throw Error('无法确认当前角色卡的文件名');
        const response=await host.fetch('/api/characters/merge-attributes',{method:'POST',headers:c.getRequestHeaders(),body:JSON.stringify({avatar:card.avatar,data:{extensions:{[KEY]:saveData}}})});
        if(!response.ok)throw Error(`角色卡写入失败（HTTP ${response.status}），请检查卡片大小或酒馆日志`);
        const verified=await host.fetch('/api/characters/get',{method:'POST',headers:c.getRequestHeaders(),body:JSON.stringify({avatar_url:card.avatar})});
        if(!verified.ok)throw Error(`角色卡复核失败（HTTP ${verified.status}），请重新打开角色卡检查保存结果`);
        const persisted=await verified.json();
        const saved=persisted?.data?.extensions?.[KEY]??persisted?.extensions?.[KEY];
        const same=(actual,expected)=>{if(expected&&typeof expected==='object'){if(!actual||typeof actual!=='object')return false;return Object.keys(expected).every(key=>same(actual[key],expected[key]))}return actual===expected};
        if(!same(saved,saveData))throw Error('角色卡复核未找到刚保存的设置，请重新打开角色卡检查');
        if(context()?.characterId!==saveCharacterId||character()?.avatar!==card.avatar)throw Error('原角色卡已保存，但当前角色已切换，请重新打开设置');
        await c.writeExtensionField(saveCharacterId,KEY,saveData);
        config=normalize(saveData);draft=null;settingsDraftBaseline=null;worldbookEditor.reset();render();status('已保存并复核角色卡。导出角色卡时会带上配置和素材。');
        if(closeOnSuccess)void activePopup?.complete(null);
        return true;
      }catch(e){status(`保存失败：${e.message||e}`);return false}
      finally{controls.forEach((control,index)=>{if(control.isConnected)control.disabled=disabled[index]});button.textContent='保存到角色卡'}
    };
    $('[data-save]').onclick=()=>{void saveSettingsToCard()};
  }
  $('[data-theme-button]').onclick=openThemes;
  $('[data-settings-button]').onclick=openSettings;
  const generateButton=root.querySelector('[data-generate-opening]')||el('button','uos-icon','＋ 生成开场白');generateButton.type='button';generateButton.dataset.generateOpening='';generateButton.onclick=()=>{void generator.open()};root.querySelector('.uos-actions')?.prepend(generateButton);
  const peopleButton=el('button','uos-icon','人物列表');peopleButton.type='button';peopleButton.dataset.peopleList='';peopleButton.onclick=()=>{void peopleEditor.open()};root.querySelector('.uos-actions')?.prepend(peopleButton);
  root.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>activePopup?.complete(null));
  render();
  ensureUpdateSettings($('[data-settings-dialog]'));
  void refreshWorldbookPeople();
  void worldbookEditor.refresh();
  root.dataset.uosMounted = '1';
  root.__uosPrepareForUpdate=async()=>{peopleEditor?.close();if(!await generator.prepareForUpdate())return false;if(!hasUnsavedSettings())return true;await activePopup?.complete();return !hasUnsavedSettings()};
  root.dataset.uosVersion = VERSION;
  return true;
}
