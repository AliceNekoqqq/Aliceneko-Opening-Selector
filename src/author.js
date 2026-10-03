import {mountInDocument} from './selector.js';
import {AUTHOR_HTML} from './author-template.js';

const AUTHOR_VERSION='1.0.12';
export const AUTHOR_MARKER='<UniversalOpeningSelector/>';
const EMPTY_OPENING_ART=AUTHOR_HTML.match(/--uos-empty-opening-art:url\("([^"]+)"\)/)?.[1]||'';
const DIAGNOSTICS_ART=AUTHOR_HTML.match(/--uos-diagnostics-art:url\("([^"]+)"\)/)?.[1]||EMPTY_OPENING_ART;

export function inspectAuthorState(context,helper){
  const card=context?.characters?.[context.characterId];
  if(!card || (context.groupId!=null && context.groupId!==-1))return {state:null,reason:null};
  try{if(Number(helper?.getLastMessageId?.()??0)>0)return {state:null,reason:null}}catch{}
  const data=card.data||card,first=String(data.first_mes??card.first_mes??'');
  const greetings=data.alternate_greetings??card.alternate_greetings;
  if(!first.trimStart().startsWith(AUTHOR_MARKER))return {state:null,reason:'已加载作者脚本。请把主开场第一行改为 <UniversalOpeningSelector/>，把原主开场移到备用开场第一条，保存角色卡后新建聊天。'};
  if(!Array.isArray(greetings)||!greetings.length)return {state:null,reason:'已识别选择器标记，但备用开场为空。请至少填写一条正式开场，保存角色卡后新建聊天。'};
  if(typeof helper?.getChatMessages!=='function')return {state:null,reason:'已识别角色卡设置，但酒馆助手消息接口尚未就绪。请检查酒馆助手是否启用。'};
  let message,last;
  try{message=helper.getChatMessages(0,{include_swipes:true})?.[0];last=helper.getLastMessageId?.()}catch{return {state:null,reason:'读取首条消息失败。请保存角色卡并新建聊天。'}}
  if(Number(last??0)>0||Number(message?.swipe_id)!==0)return {state:null,reason:null};
  if(message?.role!=='assistant'||!String(message.swipes?.[0]||'').includes(AUTHOR_MARKER))
    return {state:null,reason:'角色卡标记已准备好，但当前首条消息不是选择页。请保存角色卡并新建聊天。'};
  return {state:{characterId:context.characterId,avatar:card.avatar,entries:greetings},reason:null};
}

export function readAuthorState(context,helper){return inspectAuthorState(context,helper).state}

export function authorHtml(count){
  // Existing saved card settings take precedence over this initial seed.
  const seed={version:1,title:'选择故事的起点',subtitle:'选择一个开场，故事将从那里继续。',theme:'archive',entries:[],music:{enabled:false,title:'',audio:'',lyrics:''}};
  return AUTHOR_HTML.replace(/(<script type="application\/json" id="uos-seed">)[\s\S]*?(<\/script>)/,(_,start,end)=>start+JSON.stringify(seed)+end)
    .replace('已读取 1 条正式开场',`已读取 ${count} 条正式开场`);
}

export function mountAuthorSelector(startDocument=document,helperApi,{showSetupHints=false}={}){
  let doc=startDocument,win=doc.defaultView;
  try{for(let i=0;i<8&&win?.parent&&win.parent!==win;i++){void win.parent.document;win=win.parent;doc=win.document}}catch{}
  doc.__uosAuthor?.close?.();
  // Replacing a script must recover the original message from any older frame.
  for(const stale of doc.querySelectorAll('iframe[data-uos-author-frame]')){
    const container=stale.parentElement,contents=stale.previousElementSibling;
    if(container&&contents?.matches('div[hidden]')){
      while(contents.firstChild)container.insertBefore(contents.firstChild,contents);
      contents.remove();
    }
    stale.remove();
  }
  const host=doc.defaultView||globalThis,helper=helperApi||host.TavernHelper||host;
  let active=null,notice=null,updating=false;
  function hasAuthorMarker(){
    try{const context=host.SillyTavern?.getContext?.();const c=context?.characters?.[context?.characterId];const d=c?.data||c;return String(d?.first_mes??c?.first_mes??'').trimStart().startsWith(AUTHOR_MARKER)}catch{return false}
  }
  function closeNotice(){notice?.remove();notice=null}
  function showNotice(container,message){
    if(notice?.parentElement===container&&notice.dataset.message===message)return;
    closeNotice();
    notice=doc.createElement('div');notice.dataset.uosAuthorHint='';notice.setAttribute('role','status');
    notice.dataset.message=message;
    notice.style.cssText='display:flex;align-items:center;gap:12px;position:relative!important;z-index:10!important;pointer-events:auto!important;margin:12px 0;padding:10px 14px;border:1px solid #c99d67;border-radius:10px;background:#17252d;color:#f4ecda;font:13px/1.6 system-ui,sans-serif;white-space:pre-wrap';
    const art=doc.createElement('span');art.setAttribute('aria-hidden','true');art.style.cssText=`display:block;flex:none;width:52px;height:52px;background:url("${message.includes('备用开场为空')?EMPTY_OPENING_ART:DIAGNOSTICS_ART}") center/contain no-repeat;filter:drop-shadow(0 2px 5px #0007)`;
    const copy=doc.createElement('span');copy.textContent=message;notice.append(art,copy);container.prepend(notice);
  }
  function closeFrame(){
    if(!active)return;
    const {frame,container,contents,resize}=active;active=null;resize?.disconnect();
    for(const popup of doc.querySelectorAll('iframe[data-uos-frame]'))popup.remove();frame.remove();
    if(container.isConnected){while(contents.firstChild)container.insertBefore(contents.firstChild,contents);contents.remove()}
  }
  function scan(){
    if(updating)return;updating=true;
    try{
      const {state,reason}=inspectAuthorState(host.SillyTavern?.getContext?.(),helper);
      const first=doc.querySelector('#chat .mes[mesid="0"],#chat .mes[data-mesid="0"]');
      const container=first?.querySelector('.mes_text,.mes_text_container')||first;
      if(!state||!container){closeFrame();if(showSetupHints&&reason&&container&&hasAuthorMarker())showNotice(container,reason);else closeNotice();return}
      closeNotice();
      const key=`${state.avatar}\u0000${state.entries.length}\u0000${api.version}`;
      if(active?.container===container&&active.key===key&&active.frame.isConnected)return;
      closeFrame();
      const contents=doc.createElement('div');contents.hidden=true;contents.dataset.uosOriginal='';while(container.firstChild)contents.append(container.firstChild);container.append(contents);
      const frame=doc.createElement('iframe');frame.title='红豆粉开场白选择器';frame.dataset.uosAuthorFrame='';
      // Some chat themes disable pointer events on message iframes. Without
      // an explicit override the UI remains visible, but every button is inert.
      frame.style.cssText='display:block!important;position:relative!important;z-index:10!important;pointer-events:auto!important;width:100%;height:460px;border:0;background:transparent;overflow:hidden';
      container.append(frame);active={frame,container,contents,key};
      const frameDoc=frame.contentDocument;
      if(!frameDoc)throw Error('选择页 iframe 无法访问');
      frameDoc.open();frameDoc.write(authorHtml(state.entries.length));frameDoc.close();
      const root=frameDoc.querySelector('[data-uos]');root.__uosHostDocument=doc;
      if(!mountInDocument(frameDoc,helper))throw Error('选择页未挂载');
      if(host.ResizeObserver){const resize=new host.ResizeObserver(()=>{if(frame.isConnected)frame.style.height=`${Math.max(420,frameDoc.documentElement.scrollHeight+4)}px`});resize.observe(frameDoc.body);active.resize=resize;}else frame.style.height=`${Math.max(460,frameDoc.documentElement.scrollHeight+4)}px`;
    }catch(error){closeFrame();console.warn('[Aliceneko Opening Selector] 作者选择页加载失败',error)}
    finally{updating=false}
  }
  const observer=new host.MutationObserver(scan);if(doc.body)observer.observe(doc.body,{childList:true,subtree:true});
  const timer=host.setInterval(scan,1300),runnerWindow=startDocument.defaultView;
  const api={version:AUTHOR_VERSION,scan,prepareForUpdate:async()=>active?.frame.contentDocument?.querySelector('[data-uos]')?.__uosPrepareForUpdate?.()??true,close:()=>{observer.disconnect();host.clearInterval(timer);runnerWindow?.removeEventListener?.('pagehide',onPageHide);active?.resize?.disconnect();closeFrame();closeNotice();if(doc.__uosAuthor===api)delete doc.__uosAuthor}};
  const onPageHide=()=>{if(doc.__uosAuthor===api)api.close()};doc.__uosAuthor=api;
  if(runnerWindow!==host)runnerWindow?.addEventListener?.('pagehide',onPageHide,{once:true});
  scan();return api;
}
