import {authorSetupPlan,initializeAuthorCard} from './author-setup.js';
import {openingStamp} from './opening-generation.js';

export function createAuthorMenu({doc,host,helper,getContext,authorHtml,mount,backgroundService,getExistingRoot=()=>null}){
  let item=null,workshop=null,prompt=null,closed=false,busy=false;
  const el=(tag,text)=>{const node=doc.createElement(tag);if(text!=null)node.textContent=text;return node};
  const notify=text=>host.toastr?.info?.(text);
  function selected(){const c=getContext();return c?.characterId!=null&&(c.groupId==null||c.groupId===-1)?c.characters?.[c.characterId]:null}
  function current(identity){const c=getContext();return !closed&&c?.characterId===identity.characterId&&selected()?.avatar===identity.avatar}
  function removeWorkshop(){const active=workshop;if(!active)return;workshop=null;active.root?.__uosDispose?.();active.overlay.remove()}
  async function closeWorkshop(){if(!workshop)return true;if(!await workshop.root.__uosPrepareForUpdate?.())return false;removeWorkshop();return true}
  function showWorkshop(identity){
    if(!current(identity))return;
    const existing=getExistingRoot();if(existing){existing.querySelector('[data-settings-button]')?.click();return}
    const overlay=el('section');overlay.dataset.uosWorkshop='';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','开场白选择器入口');
    overlay.style.cssText='position:fixed;inset:12px;z-index:99980;display:flex;flex-direction:column;background:var(--SmartThemeBlurTintColor,#17252d);border:1px solid var(--SmartThemeBorderColor,#65747d);border-radius:14px;overflow:hidden;box-shadow:0 16px 70px #0008';
    const head=el('div'),title=el('strong','开场白选择器入口'),close=el('button','关闭');close.type='button';head.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;color:var(--SmartThemeBodyColor,#eee)';close.className='menu_button';close.onclick=()=>{void closeWorkshop()};head.append(title,close);
    const frame=el('iframe');frame.title='开场白选择器作者界面';frame.style.cssText='flex:1;min-height:0;width:100%;border:0;background:transparent;pointer-events:auto!important';overlay.append(head,frame);doc.body.append(overlay);
    const frameDoc=frame.contentDocument;workshop={overlay,frame,root:null,identity};
    try{
      frameDoc.open();frameDoc.write(authorHtml(authorSetupPlan(selected()).alternates.length));frameDoc.close();
      const root=frameDoc.querySelector('[data-uos]');root.__uosHostDocument=doc;workshop.root=root;
      if(!mount(frameDoc,helper,{backgroundService}))throw Error('作者界面未能加载');
      root.querySelector('[data-settings-button]')?.click();
    }catch(error){removeWorkshop();notify(`打开失败：${error.message}`)}
  }
  function showSetup(identity,card){
    const plan=authorSetupPlan(card),stamp=openingStamp(card),dialog=el('dialog');dialog.dataset.uosSetup='';
    dialog.style.cssText='max-width:460px;width:calc(100% - 40px);padding:22px;border:1px solid var(--SmartThemeBorderColor,#65747d);border-radius:14px;background:var(--SmartThemeBlurTintColor,#17252d);color:var(--SmartThemeBodyColor,#eee);font:14px/1.7 system-ui';
    dialog.setAttribute('aria-labelledby','uos-setup-title');const title=el('h2','为这张卡启用选择器？');title.id='uos-setup-title';title.style.cssText='font-size:19px;margin:0 0 12px';
    const copy=el('p',plan.first.trim()?'将自动添加选择页标记，把当前主开场完整移到第一条备用开场，其余备用开场依次顺延。':'将自动添加选择页标记。当前主开场为空，不增加空白备用条目。');
    const details=el('p',`角色：${card.data?.name||card.name||'当前角色'} · 迁移后 ${plan.nextAlternates.length} 条备用开场。原文和已有配置保留，已开始的聊天不会被改写。`),status=el('p'),actions=el('div'),cancel=el('button','取消'),confirm=el('button','自动添加并迁移');
    actions.style.cssText='display:flex;gap:10px;justify-content:flex-end;flex-wrap:wrap';status.setAttribute('role','status');cancel.type=confirm.type='button';cancel.className=confirm.className='menu_button';
    const cleanup=()=>{if(prompt?.dialog!==dialog)return;dialog.remove();prompt=null;try{item?.focus()}catch{}};
    cancel.onclick=cleanup;dialog.addEventListener('cancel',event=>{event.preventDefault();if(!busy)cleanup()});
    confirm.onclick=async()=>{
      if(busy||!current(identity))return;busy=true;cancel.disabled=confirm.disabled=true;status.textContent='正在迁移并保存…';
      try{await initializeAuthorCard({host,getContext,helper,identity,expectedStamp:stamp,isActive:()=>!closed&&prompt?.dialog===dialog});if(!current(identity))return;cleanup();showWorkshop(identity)}catch(error){if(prompt?.dialog===dialog)status.textContent=error.message||String(error)}finally{busy=false;cancel.disabled=confirm.disabled=false}
    };
    actions.append(cancel,confirm);dialog.append(title,copy,details,status,actions);doc.body.append(dialog);prompt={dialog,identity};dialog.showModal();confirm.focus();
  }
  function open(){
    if(closed||busy)return;
    const card=selected();if(!card?.avatar){notify('请先打开一张单人角色卡，再使用开场白选择器入口。');return}
    if(workshop){workshop.frame.focus();return}if(prompt){prompt.dialog.focus();return}
    const c=getContext(),identity={characterId:c.characterId,avatar:card.avatar,chatId:c.chatId};
    try{if(authorSetupPlan(card).ready)showWorkshop(identity);else showSetup(identity,card)}catch(error){notify(error.message||String(error))}
  }
  function scan(){
    if(closed)return;
    const target=doc.querySelector('#extensionsMenu');
    if(target&&item?.parentElement!==target){item?.remove();item=el('div');item.className='list-group-item flex-container flexGap5 interactable';item.dataset.uosAuthorMenu='';item.setAttribute('role','button');item.tabIndex=0;item.style.cursor='pointer';const icon=el('i');icon.className='fa-lg fa-solid fa-book-open';item.append(icon,el('span','开场白选择器入口'));item.onclick=open;item.onkeydown=event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();item.click()}};target.append(item)}
    if(workshop&&!current(workshop.identity))removeWorkshop();if(prompt&&!current(prompt.identity)){prompt.dialog.remove();prompt=null}
  }
  return {scan,open,prepareForUpdate:async()=>!busy&&await closeWorkshop(),close(){closed=true;item?.remove();prompt?.dialog.remove();prompt=null;removeWorkshop()}};
}
