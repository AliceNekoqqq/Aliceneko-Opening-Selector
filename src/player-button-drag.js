// The player entry floats in the host document, outside the scrolling chat.
export function createPlayerButtonDrag(button,{positionKey='uos_player_button_position'}={}) {
  const doc=button.ownerDocument,host=doc.defaultView;
  let gesture=null,frame=0,disposed=false,ignoreClick=false;
  function bounds() {
    const view=host.visualViewport;
    return {left:view?.offsetLeft||0,top:view?.offsetTop||0,width:view?.width||host.innerWidth,height:view?.height||host.innerHeight};
  }
  function place(left,top) {
    const view=bounds(),rect=button.getBoundingClientRect();
    const x=Math.max(view.left+8,Math.min(left,view.left+view.width-rect.width-8));
    const y=Math.max(view.top+8,Math.min(top,view.top+view.height-rect.height-8));
    button.style.left=`${x}px`;button.style.top=`${y}px`;
  }
  function float() {
    button.dataset.floating='true';
    if(button.parentNode!==doc.body)doc.body.append(button);
  }
  function save() {
    try{host.localStorage.setItem(positionKey,JSON.stringify({x:parseFloat(button.style.left)/host.innerWidth,y:parseFloat(button.style.top)/host.innerHeight}))}catch{}
  }
  function render() {
    frame=0;
    if(!disposed&&gesture?.moved)place(gesture.left+gesture.dx,gesture.top+gesture.dy);
  }
  function release(id) {try{if(button.hasPointerCapture?.(id))button.releasePointerCapture(id)}catch{}}
  function finish(event) {
    if(!gesture||event.pointerId!==gesture.id)return;
    if(frame)host.cancelAnimationFrame(frame);frame=0;
    if(gesture.moved) {
      if(event.type==='pointerup'){gesture.dx=event.clientX-gesture.startX;gesture.dy=event.clientY-gesture.startY}
      render();save();ignoreClick=true;
    }
    const id=gesture.id;gesture=null;release(id);
  }
  function down(event) {
    if(disposed||gesture||event.isPrimary===false||(event.button!=null&&event.button!==0))return;
    ignoreClick=false;
    const rect=button.getBoundingClientRect();
    gesture={id:event.pointerId,startX:event.clientX,startY:event.clientY,left:rect.left,top:rect.top,dx:0,dy:0,moved:false};
  }
  function move(event) {
    if(disposed||!gesture||event.pointerId!==gesture.id)return;
    const dx=event.clientX-gesture.startX,dy=event.clientY-gesture.startY;
    if(!gesture.moved&&Math.hypot(dx,dy)<8)return;
    if(!gesture.moved) {
      gesture.moved=true;float();place(gesture.left,gesture.top);
      // DOM moves can release capture; capture only after moving to the body.
      try{button.setPointerCapture?.(event.pointerId)}catch{}
    }
    gesture.dx=dx;gesture.dy=dy;
    if(!frame)frame=host.requestAnimationFrame(render);
    event.preventDefault();
  }
  function lost(event) {if(!button.hasPointerCapture?.(event.pointerId))finish(event)}
  function clamp() {
    if(disposed||button.dataset.floating!=='true')return;
    if(gesture)finish({pointerId:gesture.id,type:'resize'});
    place(parseFloat(button.style.left)||8,parseFloat(button.style.top)||8);
  }
  const listeners=[[button,'pointerdown',down],[doc,'pointermove',move],[doc,'pointerup',finish],[doc,'pointercancel',finish],[button,'lostpointercapture',lost],[host,'resize',clamp]];
  if(host.visualViewport)listeners.push([host.visualViewport,'resize',clamp],[host.visualViewport,'scroll',clamp]);
  for(const [target,type,fn] of listeners)target.addEventListener(type,fn,{capture:true,passive:false});
  return {
    restore(){
      if(disposed)return;
      try{const saved=JSON.parse(host.localStorage.getItem(positionKey));
        if(!Number.isFinite(saved?.x)||!Number.isFinite(saved?.y))return;
        float();place(saved.x*host.innerWidth,saved.y*host.innerHeight);
      }catch{}
    },
    suppressClick(event){
      if(!ignoreClick||event.detail===0)return false;
      ignoreClick=false;event.preventDefault();event.stopPropagation();return true;
    },
    dispose(){
      if(disposed)return;disposed=true;
      if(frame)host.cancelAnimationFrame(frame);frame=0;
      const id=gesture?.id;gesture=null;if(id!=null)release(id);
      for(const [target,type,fn] of listeners)target.removeEventListener(type,fn,true);
    },
  };
}
