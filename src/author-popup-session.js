// Owns host listeners and the close lifecycle. The author coordinator owns
// settings drafts, rendering, and restoring the sheet to its original page.
export function createAuthorPopupSession({frame,sheet,isActive,canClose=()=>true,hasUnsaved,prompt,save,cancelPrompt,onCleanup,onError}){
  const frameDoc=frame.contentDocument,viewport=frame.ownerDocument.defaultView;
  const drag=sheet.querySelector('.uos-sheet-head');
  let origin=null,cleaned=false,closing=false;
  const position=(left,top)=>{
    frame.style.setProperty('left',`${Math.max(0,Math.min(viewport.innerWidth-frame.offsetWidth,left))}px`,'important');
    frame.style.setProperty('top',`${Math.max(0,Math.min(viewport.innerHeight-frame.offsetHeight,top))}px`,'important');
  };
  const move=event=>{
    if(origin)position(origin.left+event.screenX-origin.x,origin.top+event.screenY-origin.y);
  };
  const stop=()=>{
    const pointer=origin?.pointer;origin=null;
    for(const [type,handler] of [['pointermove',move],['pointerup',stop],['pointercancel',stop],['lostpointercapture',stop]]){
      drag?.removeEventListener(type,handler);
    }
    try{if(pointer!=null&&drag?.hasPointerCapture?.(pointer))drag.releasePointerCapture(pointer)}catch{}
  };
  const start=event=>{
    if(cleaned||event.target.closest('button,input,textarea,select,a'))return;
    origin={x:event.screenX,y:event.screenY,left:frame.offsetLeft,top:frame.offsetTop,pointer:event.pointerId};
    try{drag.setPointerCapture(event.pointerId)}catch{origin=null;return}
    for(const [type,handler] of [['pointermove',move],['pointerup',stop],['pointercancel',stop],['lostpointercapture',stop]]){
      drag.addEventListener(type,handler);
    }
    event.preventDefault();
  };
  const resize=()=>position(frame.offsetLeft,frame.offsetTop);
  const cleanup=discarded=>{
    if(cleaned)return;cleaned=true;
    observer?.disconnect();cancelPrompt();stop();
    drag?.removeEventListener('pointerdown',start);
    viewport.removeEventListener('resize',resize);frameDoc.removeEventListener('keydown',keydown);
    onCleanup(discarded);
  };
  const complete=async()=>{
    if(closing||cleaned||!isActive()||!canClose())return false;
    closing=true;
    try{
      if(hasUnsaved()){
        const choice=await prompt();
        if(cleaned||!isActive()||choice==='stay')return false;
        if(choice==='save'){
          if(!await save()||cleaned||!isActive())return false;
          cleanup(false);return true;
        }
        cleanup(true);return true;
      }
      cleanup(false);return true;
    }catch(error){if(!cleaned)onError(error);return false}
    finally{closing=false}
  };
  const keydown=event=>{
    if(event.key==='Escape'&&!frameDoc.querySelector('[data-uos-unsaved-prompt]')
      &&!frameDoc.querySelector('[data-uos-preset-delete]')){
      event.preventDefault();void complete();
    }
  };
  const Observer=viewport.MutationObserver;
  const observer=Observer?new Observer(()=>{if(!frame.isConnected)cleanup(true)}):null;
  drag?.addEventListener('pointerdown',start);
  viewport.addEventListener('resize',resize);frameDoc.addEventListener('keydown',keydown);
  observer?.observe(frame.ownerDocument.body||frame.ownerDocument.documentElement,{childList:true,subtree:true});
  return {frame,sheet,complete,dispose:()=>cleanup(true)};
}
