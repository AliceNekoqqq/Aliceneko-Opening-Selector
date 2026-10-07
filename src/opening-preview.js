import {createModuleHelp} from './module-help.js';
import {applyOpeningCover} from './opening-presentation.js';
import {defaultCoverStyles} from './default-covers.js';
import {openingMetadata} from './opening-categories.js';
import {createReadingPreferences,READING_FONT_SIZES,READING_LINE_SPACING} from './reading-preferences.js';

const CSS=`
dialog.uos-opening-preview{position:fixed;inset:0;width:min(760px,calc(100vw - 24px));max-width:calc(100vw - 24px);height:min(850px,calc(100vh - 24px));height:min(850px,calc(100dvh - 24px));max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);margin:auto;padding:0;border:1px solid var(--line);border-radius:16px;background:var(--bg);color:var(--text);box-shadow:0 22px 70px #0007;font:14px/1.7 system-ui,sans-serif;z-index:2147483646;overflow:hidden;color-scheme:dark}
dialog.uos-opening-preview:is([data-theme=paper],[data-theme=school]){color-scheme:light}
.uos-opening-preview::backdrop{background:#0009}
.uos-opening-preview,.uos-opening-preview *{box-sizing:border-box}
.uos-opening-preview [hidden]{display:none!important}
.uos-opening-preview .uos-preview-window{display:flex;flex-direction:column;height:100%;min-height:0}
.uos-opening-preview .uos-preview-header,.uos-opening-preview .uos-preview-footer{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 18px;background:var(--surface);flex:none}
.uos-opening-preview .uos-preview-header{justify-content:space-between;border-bottom:1px solid var(--line)}
.uos-opening-preview .uos-preview-footer{border-top:1px solid var(--line)}
.uos-opening-preview .uos-preview-pager{margin:0 auto 0 0;color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.uos-opening-preview button{appearance:none!important;min-height:44px;padding:8px 13px!important;border:1px solid var(--line)!important;border-radius:8px!important;background:var(--surface)!important;color:var(--text)!important;font:inherit!important;cursor:pointer;box-shadow:none!important}
.uos-opening-preview button:disabled{opacity:.45;cursor:default}
.uos-opening-preview :is(button,select,summary):focus-visible{outline:2px solid var(--accent)!important;outline-offset:2px}
.uos-opening-preview .uos-preview-select{background:var(--accent)!important;color:var(--bg)!important;font-weight:600!important}
.uos-opening-preview .uos-preview-reading{flex-basis:100%;min-width:0;color:var(--muted);font-size:12px}
.uos-opening-preview .uos-preview-reading>summary{min-height:32px;padding:5px 0;color:var(--accent);cursor:pointer}
.uos-opening-preview .uos-preview-reading-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr)) auto;align-items:end;gap:10px;padding:6px 0}
.uos-opening-preview .uos-preview-reading-controls label{display:grid;gap:4px;min-width:0;margin:0!important;padding:0!important}
.uos-opening-preview .uos-preview-reading-controls :is(select,.uos-preview-focus){height:44px!important;min-height:44px!important;max-height:44px!important;box-sizing:border-box!important;margin:0!important;font:14px/1.5 system-ui,sans-serif!important;align-self:end}
.uos-opening-preview .uos-preview-reading-controls select{min-width:0;width:100%;padding:8px 10px!important;border:1px solid var(--line)!important;border-radius:8px!important;background:var(--surface)!important;color:var(--text)!important;color-scheme:inherit}
.uos-opening-preview .uos-preview-focus{display:flex;align-items:center;justify-content:center;white-space:nowrap}
@media(max-width:480px){.uos-opening-preview .uos-preview-reading-controls{grid-template-columns:repeat(2,minmax(0,1fr))}.uos-opening-preview .uos-preview-focus{grid-column:1/-1;width:100%}}
.uos-opening-preview .uos-preview-focus[aria-pressed=true]{border-color:var(--accent)!important;background:var(--bg)!important;color:var(--accent)!important;box-shadow:inset 0 0 0 1px var(--accent)!important}
.uos-opening-preview .uos-preview-content{overflow:auto;min-height:0;flex:1;overscroll-behavior:contain;padding:18px;scrollbar-width:thin}
.uos-opening-preview .uos-preview-cover{width:100%;height:clamp(130px,27vw,300px);background-size:cover;background-position:center;background-color:var(--surface);border-radius:10px;margin:0 0 18px}
.uos-opening-preview .uos-preview-title{margin:0;color:var(--text);font:600 24px/1.5 Georgia,"Noto Serif SC",serif;overflow-wrap:anywhere}
.uos-opening-preview .uos-preview-label{margin:6px 0 12px;color:var(--accent);font-size:12px;overflow-wrap:anywhere}
.uos-opening-preview .uos-preview-description{white-space:pre-wrap;overflow-wrap:anywhere;margin:12px 0;color:var(--muted)}
.uos-opening-preview .uos-preview-cast{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin:16px 0}
.uos-opening-preview .uos-preview-cast span{padding:3px 9px;border:1px solid var(--line);border-radius:6px;font-size:12px;color:var(--text);overflow-wrap:anywhere;max-width:100%}
.uos-opening-preview .uos-preview-cast-label{color:var(--muted);font-size:12px}
.uos-opening-preview .uos-preview-taxonomy{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0;color:var(--muted);font-size:12px;overflow-wrap:anywhere}
.uos-opening-preview .uos-preview-taxonomy span{padding:3px 8px;border:1px solid var(--line);border-radius:5px;max-width:100%}
.uos-opening-preview .uos-preview-body{white-space:pre-wrap;overflow-wrap:anywhere;margin:18px 0 0;padding:18px 0;border-top:1px solid var(--line);color:var(--text);font:inherit;font-size:var(--uos-reading-font-size,16px);line-height:var(--uos-reading-line-height,1.7);word-break:normal}
.uos-opening-preview .uos-preview-diagnostics{margin:12px 0;color:var(--muted);font-size:12px}
.uos-opening-preview .uos-preview-diagnostics summary{cursor:pointer;color:var(--accent)}
.uos-opening-preview .uos-preview-diagnostics p{overflow-wrap:anywhere;margin:8px 0}
@media(max-width:480px){dialog.uos-opening-preview{width:calc(100vw - 16px);height:calc(100vh - 16px);height:calc(100dvh - 16px);max-height:calc(100vh - 16px);max-height:calc(100dvh - 16px);border-radius:12px}.uos-opening-preview .uos-preview-content{padding:14px}.uos-opening-preview .uos-preview-header,.uos-opening-preview .uos-preview-footer{padding:10px 12px;gap:8px}.uos-opening-preview .uos-preview-footer button{flex:1}.uos-opening-preview .uos-preview-pager{flex-basis:100%;text-align:center;margin:0}.uos-opening-preview button{min-height:44px;padding:8px}.uos-opening-preview .uos-preview-title{font-size:21px}}
`;

// Read-only navigation. Opening selection stays with the caller's existing transaction.
export function createOpeningPreview({doc,getItems,getPalette,onChoose,host=doc.defaultView}){
  const moduleHelp=createModuleHelp({doc});
  let disposed=false,active=null;
  const preferences=createReadingPreferences(host);
  const style=doc.createElement('style');style.dataset.uosPreviewStyle='';style.textContent=CSS+defaultCoverStyles('.uos-opening-preview');(doc.head||doc.documentElement).append(style);
  const el=(tag,cls='',text)=>{const node=doc.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=String(text);return node};
  function close(){
    moduleHelp.close();
    const current=active;if(!current)return;active=null;
    current.dialog.removeEventListener('keydown',current.onKey);
    if(current.dialog.open)current.dialog.close();current.dialog.remove();
    try{if(current.trigger?.isConnected)current.trigger.focus()}catch{}
  }
  function open(id,trigger,scopeItems){
    if(disposed)return false;
    const items=(scopeItems||getItems()).slice(),start=items.findIndex(item=>item.id===id);if(start<0)return false;
    close();
    const dialog=el('dialog','uos-opening-preview');dialog.setAttribute('aria-label','完整开场预览');dialog.setAttribute('aria-modal','true');
    const palette=getPalette(),computed=palette.ownerDocument.defaultView.getComputedStyle(palette);dialog.dataset.theme=palette.dataset.theme||'archive';
    for(const key of ['--bg','--surface','--text','--muted','--accent','--line'])dialog.style.setProperty(key,computed.getPropertyValue(key)||computed.getPropertyValue('--panel'));
    const window=el('div','uos-preview-window'),header=el('div','uos-preview-header'),heading=el('span','','完整开场预览'),exit=el('button','','关闭预览');exit.type='button';exit.onclick=close;header.append(heading,exit);const helpButton=moduleHelp.attach(header,'preview',{before:exit});
    const reading=el('details','uos-preview-reading'),readingSummary=el('summary','','阅读设置'),controls=el('div','uos-preview-reading-controls');reading.append(readingSummary,controls);header.append(reading);
    const font=el('select','uos-preview-font-size'),spacing=el('select','uos-preview-line-spacing'),focus=el('button','uos-preview-focus','专注正文');focus.type='button';
    for(const [select,title,options] of [[font,'正文字号',READING_FONT_SIZES],[spacing,'正文行距',READING_LINE_SPACING]]){
      const label=el('label');label.append(el('span','',title),select);select.setAttribute('aria-label',title);
      for(const [id,name] of options){const option=el('option','',name);option.value=id;select.append(option)}controls.append(label);
    }controls.append(focus);
    const content=el('div','uos-preview-content'),footer=el('div','uos-preview-footer'),pager=el('p','uos-preview-pager'),previous=el('button','','上一条'),next=el('button','','下一条'),choose=el('button','uos-preview-select','选择此开场');
    for(const button of [previous,next,choose])button.type='button';pager.setAttribute('role','status');footer.append(pager,previous,next,choose);window.append(header,content,footer);dialog.append(window);
    let index=start,prefs=preferences.read(),extras=[],diagnosticsSummary=null;
    function applyReading(next=prefs){
      prefs=next;font.value=prefs.fontSize;spacing.value=prefs.lineSpacing;focus.setAttribute('aria-pressed',String(prefs.focusBody));
      dialog.style.setProperty('--uos-reading-font-size',READING_FONT_SIZES.find(([id])=>id===prefs.fontSize)[2]+'px');
      dialog.style.setProperty('--uos-reading-line-height',String(READING_LINE_SPACING.find(([id])=>id===prefs.lineSpacing)[2]));
      for(const node of extras)node.hidden=prefs.focusBody;
    }
    function changeReading(patch){if(disposed||active?.dialog!==dialog)return;applyReading(preferences.set(patch))}
    font.onchange=()=>changeReading({fontSize:font.value});spacing.onchange=()=>changeReading({lineSpacing:spacing.value});focus.onclick=()=>changeReading({focusBody:!prefs.focusBody});
    function render(){
      const item=items[index];content.replaceChildren();extras=[];diagnosticsSummary=null;
      const cover=el('div','uos-preview-cover');cover.setAttribute('aria-hidden','true');applyOpeningCover(cover,item,item.body,item.coverIndex??item.id,host);content.append(cover);
      const label=el('p','uos-preview-label',`开场 ${item.number} ${item.label?'· '+item.label:''}`);content.append(el('h2','uos-preview-title',item.title),label);extras.push(cover,label);
      if(item.description){const description=el('p','uos-preview-description',item.description);content.append(description);extras.push(description)}
      const metadata=openingMetadata(item);if(metadata.group||metadata.tags.length){const taxonomy=el('div','uos-preview-taxonomy');if(metadata.group)taxonomy.append(el('span','',`分组 · ${metadata.group}`));for(const tag of metadata.tags)taxonomy.append(el('span','',tag));content.append(taxonomy);extras.push(taxonomy)}
      if(item.names?.length){const cast=el('div','uos-preview-cast');cast.append(el('b','uos-preview-cast-label','全部人物'));for(const name of item.names)cast.append(el('span','',name));content.append(cast);extras.push(cast)}
      content.append(el('pre','uos-preview-body',item.body));
      if(item.titleSource||item.suggestions?.length){const info=el('details','uos-preview-diagnostics');diagnosticsSummary=el('summary','','识别信息');info.append(diagnosticsSummary);if(item.titleSource)info.append(el('p','',`标题：${item.titleSource}`));if(item.suggestions?.length)info.append(el('p','',`待确认人物：${item.suggestions.join('、')}`));content.append(info);extras.push(info)}
      applyReading();
      pager.textContent=`${index+1} / ${items.length}`;previous.disabled=index===0;next.disabled=index===items.length-1;choose.disabled=Boolean(item.isCurrent);choose.textContent=item.isCurrent?'当前开场':'选择此开场';content.scrollTop=0;
    }
    previous.onclick=()=>{if(index>0){index--;render()}};next.onclick=()=>{if(index<items.length-1){index++;render()}};
    choose.onclick=()=>{if(disposed||active?.dialog!==dialog||choose.disabled)return;const item=items[index];close();void onChoose(item)};
    const onKey=event=>{
      if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return}
      if(event.key==='Tab'){
        const buttons=[helpButton,exit,readingSummary,...(reading.open?[font,spacing,focus]:[]),...(diagnosticsSummary&&!prefs.focusBody?[diagnosticsSummary]:[]),previous,next,choose].filter(button=>!button.disabled),first=buttons[0],last=buttons.at(-1);
        // Keep native disclosure controls in normal tab order; wrap at the window edges.
        if(event.shiftKey&&doc.activeElement===first){event.preventDefault();last.focus()}
        else if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first.focus()}
      }
    };
    active={dialog,trigger,onKey};dialog.addEventListener('keydown',onKey);dialog.addEventListener('cancel',event=>{event.preventDefault();close()});dialog.addEventListener('close',()=>{if(active?.dialog===dialog)close()});dialog.addEventListener('click',event=>{if(event.target===dialog)close()});
    doc.body.append(dialog);render();
    try{dialog.showModal()}catch{dialog.setAttribute('open','');dialog.setAttribute('role','dialog')}
    exit.focus();return true;
  }
  return {open,close,dispose(){if(disposed)return;disposed=true;moduleHelp.dispose();close();style.remove()}};
}
