import {openingBlindBoxButton,updateBlindBoxButton,openingBlindRangeButton,setBlindBoxTheme} from './opening-blind-box.js';
import {openingFavoritesFilter} from './opening-favorites-ui.js';
import {buildAuthorHtml} from './author-template.js';
import {createAuthorOpeningCard} from './author-opening-card.js';
import {createOpeningGroupRenderer,createOpeningCategoryFilters} from './opening-category-ui.js';
import {defaultCoverStyles} from './default-covers.js';
import {createThemeBackgroundController} from './theme-backgrounds.js';
import {lyricRows} from './media-player.js';
import {RUNTIME_VERSION} from './version.js';
import {bindBrandImages,createMascotNote} from './brand-mark.js';
import {applyBrandVisibility} from './brand-visibility.js';

// No author mount, helper, persistence or audio source in this visual-only view.
export function renderAuthorPagePreview({doc,model,host,groups}){
  const el=(tag,cls='',text)=>{const node=doc.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=String(text);return node};
  const root=doc.querySelector('[data-uos]');root.dataset.theme=model.theme;root.dataset.layout=model.layout;root.inert=true;applyBrandVisibility(root,model.branding);
  root.querySelector('[data-title]').textContent=model.title;
  root.querySelector('[data-subtitle]').textContent=model.subtitle==='选择一个开场，故事将从那里继续。'?'':model.subtitle;
  root.querySelector('[data-opening-count]').textContent=`共 ${model.items.length} 个开场`;
  let filters=root.querySelector('.uos-search');
  if(!filters){filters=el('div','uos-search');root.querySelector('[data-grid]').before(filters)}
  filters.replaceChildren();const search=el('input'),people=el('select');search.type='search';search.placeholder='搜索标题、人物或正文';search.disabled=true;
  const all=el('option','','全部人物');all.value='';people.append(all);for(const name of new Set(model.items.flatMap(item=>item.names))){const option=el('option','',name);option.value=name;people.append(option)}people.disabled=true;filters.append(search,people,openingFavoritesFilter(el,model.items.filter(item=>item.favorite).length));
  const categories=createOpeningCategoryFilters({el,onChange:()=>{}});categories.update(model.items);filters.append(categories.element);
  const blindTrigger=openingBlindBoxButton(el,null,model.theme);updateBlindBoxButton(blindTrigger,model.items,{readonly:true,theme:model.theme});filters.append(blindTrigger,openingBlindRangeButton(el));
  for(const select of categories.element.querySelectorAll('select'))select.disabled=true;
  let result=root.querySelector('.uos-results');if(!result){result=el('p','uos-results');filters.after(result)}result.textContent=`${model.items.length} 个开场 · 点击卡片进入`;
  const grid=root.querySelector('[data-grid]');grid.replaceChildren();groups.render(model.items,grid,(entry,target)=>target.append(createAuthorOpeningCard({el,entry,index:entry.id,body:entry.body,host})));
  if(!model.items.length)grid.append(createMascotNote(el,'search','暂无开场，请先在角色卡中添加备用开场。','uos-search-empty').element);
  const music=model.music||{};root.querySelector('[data-player]').hidden=!music.enabled;
  root.querySelector('[data-music-title]').textContent=music.title||'开场音乐';
  const lyrics=root.querySelector('[data-lyrics]'),rows=lyricRows(music.lyrics);lyrics.replaceChildren();
  if(rows.length)for(const row of rows){const line=el('button','uos-lyric-row',row.text);line.type='button';line.disabled=true;line.dataset.time=String(row.time);lyrics.append(line)}else lyrics.textContent=music.lyrics?.trim()||'♫';
  for(const control of root.querySelectorAll('button,input,select'))control.disabled=true;
  let watermark=root.querySelector('[data-uos-watermark]');if(!watermark){watermark=el('p','uos-watermark','唯一来源Discord:♡Aliceneko♡/红豆粉丨本插件完全免费');watermark.dataset.uosWatermark='';watermark.append(el('span','uos-version',`v${RUNTIME_VERSION}`));root.append(watermark)}
  return root;
}

export function createAuthorPagePreview({doc,readModel,host,backgroundService,watch}){
  const view=doc.defaultView,el=(tag,cls='',text)=>{const node=doc.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=String(text);return node};
  const element=el('details','uos-page-preview'),summary=el('summary'),tools=el('div','uos-page-preview-tools'),phone=el('button','uos-icon','手机 · 390px'),desktop=el('button','uos-icon','桌面 · 900px');
  const icon=el('span','uos-page-preview-icon','▣'),copy=el('span','uos-page-preview-copy'),action=el('span','uos-page-preview-action','展开预览');icon.setAttribute('aria-hidden','true');
  copy.append(el('strong','','点击预览整个选择页'),el('small','','查看手机／电脑效果，修改后实时更新'));summary.append(icon,copy,action);
  phone.type=desktop.type='button';tools.setAttribute('role','group');tools.setAttribute('aria-label','整页预览宽度');tools.append(phone,desktop);
  const stage=el('div','uos-page-preview-stage');element.append(summary,el('p','uos-help','编辑时自动同步；预览只用于查看，点击保存后写入角色卡。'),tools,stage);
  let width=390,frame=null,background=null,groups=null,timer=null,observer=null,disposed=false,stopMascot=()=>{};
  const controls=()=>{phone.setAttribute('aria-pressed',String(width===390));desktop.setAttribute('aria-pressed',String(width===900))};controls();
  function fit(){
    if(!frame||disposed)return;
    if(stage.clientWidth<=0)return;
    const scale=Math.min(1,stage.clientWidth/width);
    frame.style.width=`${width}px`;frame.style.height=`${Math.ceil(420/scale)}px`;frame.style.transform=`scale(${scale})`;
  }
  function initialize(){
    if(frame)return;
    frame=el('iframe','uos-page-preview-frame');frame.style.width=`${width}px`;frame.setAttribute('title','整页实时预览');frame.setAttribute('sandbox','allow-same-origin');stage.append(frame);
    const previewDoc=frame.contentDocument;previewDoc.open();previewDoc.write(buildAuthorHtml({},0));previewDoc.close();
    for(const node of previewDoc.querySelectorAll('.uos-dialog,#uos-seed,audio'))node.remove();
    const style=previewDoc.createElement('style');style.textContent=defaultCoverStyles('.uos')+'\nhtml{height:auto}body{margin:0;background:transparent}.uos{border-radius:0;box-shadow:none}.uos button:disabled{cursor:default}.uos-top-status,.uos-status[data-status]{display:none}';previewDoc.head.append(style);
    const root=previewDoc.querySelector('[data-uos]');root.inert=true;
    stopMascot=bindBrandImages(root);
    groups=createOpeningGroupRenderer({el:(tag,cls='',text)=>{const node=previewDoc.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=String(text);return node},gridClass:'uos-grid'});
    background=createThemeBackgroundController(root,'--uos-theme-bg-active',previewDoc.defaultView,{service:backgroundService});
    if(view.ResizeObserver){observer=new view.ResizeObserver(fit);observer.observe(stage)}view.addEventListener('resize',fit);fit();
  }
  function update(){
    timer=null;if(disposed||!element.open||element.isConnected===false)return;
    initialize();const model=readModel();if(!model)return;
    renderAuthorPagePreview({doc:frame.contentDocument,model,host,groups});void background.setTheme(model.theme);fit();
  }
  function refresh(){if(disposed||!element.open||timer!==null)return;timer=view.setTimeout(update,80)}
  const onToggle=()=>{if(disposed)return;action.textContent=element.open?'收起预览':'展开预览';if(element.open)refresh()};element.addEventListener('toggle',onToggle);
  watch?.addEventListener('input',refresh);watch?.addEventListener('change',refresh);
  phone.onclick=()=>{if(disposed)return;width=390;controls();fit()};desktop.onclick=()=>{if(disposed)return;width=900;controls();fit()};
  return {element,refresh,dispose(){if(disposed)return;disposed=true;if(timer!==null)view.clearTimeout(timer);element.removeEventListener('toggle',onToggle);watch?.removeEventListener('input',refresh);watch?.removeEventListener('change',refresh);view.removeEventListener('resize',fit);observer?.disconnect();stopMascot();background?.close();frame?.remove();element.remove()}};
}
