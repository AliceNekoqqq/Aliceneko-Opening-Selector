import {MODULE_HELP} from './module-help-content.js';
const CSS=`dialog.uos-module-help{box-sizing:border-box;width:min(640px,calc(100vw - 24px));max-height:calc(100dvh - 24px);padding:0;border:1px solid var(--line,#64748b);border-radius:14px;background:var(--bg,#17252d);color:var(--text,#f4ecda);font:14px/1.7 system-ui,sans-serif;overflow:auto;overscroll-behavior:contain;word-break:normal;overflow-wrap:anywhere}dialog.uos-module-help::backdrop{background:#0008}.uos-module-help *{box-sizing:border-box}.uos-module-help .uos-module-help-head{position:sticky;top:0;z-index:1;display:flex;align-items:center;gap:12px;padding:12px 18px;background:var(--bg,#17252d);border-bottom:1px solid var(--line,#64748b)}.uos-module-help h2{margin:0!important;font:650 18px/1.5 system-ui,sans-serif!important;min-width:0;flex:1}.uos-module-help .uos-module-help-close{flex:none;min-height:44px;padding:8px 12px!important;border:1px solid var(--line,#64748b)!important;border-radius:8px!important;background:var(--panel,#23333b)!important;color:inherit!important;font:inherit!important;cursor:pointer}.uos-module-help .uos-module-help-body{padding:0 18px 18px}.uos-module-help p{margin:12px 0;color:var(--muted,#b7c3cc)}.uos-module-help details{margin:10px 0;border:1px solid var(--line,#64748b);border-radius:10px;padding:0 12px}.uos-module-help summary{min-height:44px;cursor:pointer;padding:10px 0;font-weight:650;color:var(--text,#f4ecda)}.uos-module-help ol{padding-left:24px;margin:6px 0 14px}.uos-module-help li{margin:7px 0}.uos-module-help dl{margin:4px 0 14px}.uos-module-help .uos-module-help-row{display:grid;grid-template-columns:minmax(100px,145px) minmax(0,1fr);gap:12px;padding:10px 0;border-top:1px solid var(--line,#64748b)}.uos-module-help dt{font-weight:650;color:var(--accent,#c99d67)}.uos-module-help dd{margin:0;color:var(--text,#f4ecda)}.uos-module-help :focus-visible{outline:2px solid var(--accent,#c99d67);outline-offset:2px}@media(max-width:480px){.uos-module-help .uos-module-help-head{padding:10px 12px}.uos-module-help .uos-module-help-body{padding:0 12px 12px}.uos-module-help .uos-module-help-row{grid-template-columns:1fr;gap:3px}}`;
/* Read-only help; it never calls settings, save or generation services. */
export function createModuleHelp({doc,getDialogDocument}={}){
  let active=null,disposed=false;
  function close(){
    const current=active;if(!current)return;active=null;for(const observer of current.observers)observer.disconnect();current.dialog.remove();
    try{if(current.trigger?.isConnected!==false)current.trigger?.focus()}catch{}
  }
  function open(topic,trigger){
    const guide=MODULE_HELP[topic],source=trigger?.ownerDocument||doc,owner=getDialogDocument?.(source,trigger)||source;if(disposed||!guide||!owner||trigger?.isConnected===false)return false;close();
    const el=(tag,text='',className='')=>{const node=owner.createElement(tag);node.textContent=text;node.className=className;return node};
    const dialog=el('dialog','','uos-module-help');dialog.dataset.moduleHelp=topic;dialog.setAttribute('aria-label',guide.title+' · 功能说明');
    const style=el('style',CSS);dialog.append(style);
    try{const computed=source.defaultView?.getComputedStyle(trigger);for(const variable of ['--bg','--panel','--surface','--text','--muted','--line','--accent'])dialog.style.setProperty(variable,computed?.getPropertyValue(variable)||'')}catch{}
    const head=el('header','','uos-module-help-head'),title=el('h2',guide.title+' · 功能说明'),exit=el('button','关闭说明','uos-module-help-close');exit.type='button';exit.onclick=close;head.append(title,exit);dialog.append(head);
    const body=el('div','','uos-module-help-body');body.append(el('p',guide.purpose));dialog.append(body);
    const section=(label,expanded=false)=>{const details=el('details'),summary=el('summary',label);details.open=expanded;details.append(summary);body.append(details);return details};
    const quick=section('快速上手',true),steps=el('ol');for(const step of guide.steps)steps.append(el('li',step));quick.append(steps);
    const controls=section('选项与按钮');
    for(const [label,rows] of [['选项说明',guide.options],['按钮说明',guide.buttons]]){
      controls.append(el('h3',label));const mapping=el('dl');
      for(const [name,description] of rows){const row=el('div','','uos-module-help-row');row.append(el('dt',name),el('dd',description));mapping.append(row)}controls.append(mapping);
    }
    const notes=section('保存与常见误解');for(const note of guide.notes)notes.append(el('p',note));
    const session={dialog,trigger,observers:[]};active=session;
    const dismiss=()=>{if(active===session)close()};dialog.addEventListener('close',dismiss);dialog.addEventListener('cancel',event=>{event.preventDefault();event.stopPropagation?.();dismiss()});dialog.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();event.stopPropagation?.();dismiss()}});dialog.addEventListener('click',event=>{if(event.target===dialog)dismiss()});
    (owner.body||owner.documentElement).append(dialog);try{dialog.showModal()}catch{dismiss();return false}
    // When portaled out of an iframe, watch both documents for removal.
    for(const observed of new Set([source,owner])){
      const Observer=observed?.defaultView?.MutationObserver;if(!Observer||!trigger)continue;
      const observer=new Observer(()=>{if(trigger.isConnected===false||source.defaultView?.frameElement?.isConnected===false)dismiss()});
      session.observers.push(observer);observer.observe(observed.documentElement||observed.body,{childList:true,subtree:true});
    }
    exit.focus();return true;
  }
  function attach(container,topic,{before}={}){
    if(disposed||!container||!MODULE_HELP[topic])return null;
    const existing=container.querySelector?.(`[data-module-help-topic="${topic}"]`);if(existing)return existing;
    const owner=container.ownerDocument||doc;if(!owner)return null;
    const button=owner.createElement('button');button.type='button';button.dataset.moduleHelpTopic=topic;button.setAttribute('aria-label',MODULE_HELP[topic].title+'功能说明');button.setAttribute('aria-haspopup','dialog');button.title='功能说明';
    button.style.cssText='display:inline-flex!important;align-items:center!important;justify-content:center!important;flex:0 0 44px!important;width:44px!important;height:44px!important;min-height:44px!important;margin:0 0 0 auto!important;padding:0!important;border:0!important;border-radius:50%!important;background:transparent!important;color:var(--accent,currentColor)!important;box-shadow:none!important;cursor:pointer!important;vertical-align:middle';
    // Keep the native summary marker and text wrapping while reserving the right edge.
    if(/^(H[1-6]|SUMMARY)$/i.test(container.tagName||container.tag||'')){
      for(const [name,value] of [['position','relative'],['padding-right','52px'],['min-height','44px']])container.style.setProperty(name,value);
      button.style.cssText+=';position:absolute!important;right:0!important;top:50%!important;transform:translateY(-50%)!important';
    }
    const marker=owner.createElement('span');marker.textContent='?';marker.setAttribute('aria-hidden','true');marker.style.cssText='display:flex;align-items:center;justify-content:center;width:25px;height:25px;border:1px solid currentColor;border-radius:50%;font:650 16px/1 system-ui,sans-serif';button.append(marker);
    button.onclick=event=>{event?.preventDefault?.();event?.stopPropagation?.();return open(topic,button)};
    if(before?.before)before.before(button);else container.append(button);return button;
  }
  function heading(container,topic,label){
    const owner=container.ownerDocument||doc;if(!owner)return null;
    const row=owner.createElement('div');row.style.cssText='display:flex;align-items:center;gap:8px;min-width:0';row.dataset.moduleHelpHeading=topic;
    const title=owner.createElement('h3');title.textContent=label||MODULE_HELP[topic]?.title;title.style.cssText='margin:0;flex:1;min-width:0;font-size:16px';row.append(title);attach(row,topic);
    if(container.prepend)container.prepend(row);else container.append(row);return row;
  }
  return {attach,heading,open,close,dispose(){disposed=true;close()}};
}
