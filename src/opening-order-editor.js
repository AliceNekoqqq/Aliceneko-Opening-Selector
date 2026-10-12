import {moveOpening} from './opening-order.js';

// Pointer events support mouse and touch; only the handle prevents scrolling.
export function createOpeningOrderEditor({el,doc,getOrder,getItems,onChange,isDisabled=()=>false}){
  const section=el('section','uos-settings-group uos-order'),heading=el('h3','','开场顺序');
  section.append(heading,el('p','uos-help','拖动左侧手柄调整顺序，也可用上下箭头微调。保存到角色卡后生效，封面和世界书预设一起移动。'));
  const list=el('div','uos-order-list'),note=el('p','uos-help'),reset=el('button','uos-icon','恢复原顺序');
  list.setAttribute('role','list');note.setAttribute('role','status');reset.type='button';section.append(list,note,reset);
  let drag=null,animation=null,closed=false;const rows=new Map(),view=doc.defaultView;
  function apply(order){onChange(order);refresh()}
  function finish(cancel=false){
    const active=drag;if(!active)return;drag=null;
    view.cancelAnimationFrame?.(animation);animation=null;active.row.classList.remove('is-dragging');
    try{active.handle.releasePointerCapture(active.id)}catch{}
    if(cancel&&!closed)apply(active.before);else refresh();
  }
  function position(y){
    if(!drag||isDisabled())return;
    const order=getOrder(),from=order.indexOf(drag.index);let to=from;
    for(let i=0;i<order.length;i++){
      if(i===from)continue;
      const rect=rows.get(order[i]).row.getBoundingClientRect(),middle=(rect.top+rect.bottom)/2;
      if(i<from&&y<middle){to=i;break}if(i>from&&y>middle)to=i;
    }
    if(to!==from)apply(moveOpening(order,from,to));
  }
  function tick(){
    if(!drag||closed)return;
    if(drag.moved&&!isDisabled()){
      const sheet=section.closest('.uos-sheet'),rect=sheet?.getBoundingClientRect();
      if(rect){const speed=drag.y<rect.top+65?-12:drag.y>rect.bottom-75?12:0;if(speed){sheet.scrollTop+=speed;position(drag.y)}}
    }
    animation=view.requestAnimationFrame(tick);
  }
  function refresh(){
    if(closed)return;
    const order=getOrder(),items=getItems();
    if(!rows.size)items.forEach((entry,index)=>{
      const row=el('div','uos-order-row'),handle=el('button','uos-order-handle','⠿'),number=el('span','uos-order-number'),title=el('span','uos-order-title'),actions=el('div','uos-order-actions');
      row.setAttribute('role','listitem');handle.type='button';handle.setAttribute('aria-label',`拖动开场 ${index+1} 调整顺序`);
      const up=el('button','uos-icon','↑'),down=el('button','uos-icon','↓');up.type=down.type='button';
      up.setAttribute('aria-label',`上移开场 ${index+1}`);down.setAttribute('aria-label',`下移开场 ${index+1}`);
      const move=direction=>{if(drag||isDisabled())return;const order=getOrder(),from=order.indexOf(index);apply(moveOpening(order,from,from+direction));handle.focus()};
      up.onclick=()=>move(-1);down.onclick=()=>move(1);
      handle.onkeydown=event=>{if(event.key==='ArrowUp'||event.key==='ArrowDown'){event.preventDefault();move(event.key==='ArrowUp'?-1:1)}};
      handle.onpointerdown=event=>{
        if(closed||isDisabled()||drag||getOrder().length<2||event.button!==0||event.isPrimary===false)return;
        event.preventDefault();event.stopPropagation();handle.focus();
        drag={index,id:event.pointerId,y:event.clientY,start:event.clientY,before:getOrder().slice(),handle,row,moved:false};
        try{handle.setPointerCapture(event.pointerId)}catch{finish(true);return}row.classList.add('is-dragging');tick();
      };
      handle.onpointermove=event=>{if(!drag||drag.id!==event.pointerId)return;event.preventDefault();drag.y=event.clientY;if(Math.abs(drag.y-drag.start)>5)drag.moved=true;if(drag.moved)position(drag.y)};
      handle.onpointerup=event=>{if(drag?.id===event.pointerId)finish()};
      handle.onpointercancel=event=>{if(drag?.id===event.pointerId)finish(true)};
      handle.onlostpointercapture=()=>{if(drag?.handle===handle)finish(true)};
      actions.append(up,down);row.append(handle,number,title,actions);rows.set(index,{row,handle,number,title,up,down});
    });
    for(const [position,index] of order.entries()){
      const item=rows.get(index);item.number.textContent=String(position+1).padStart(2,'0');item.title.textContent=items[index]?.title||`原开场 ${index+1}`;
      item.up.disabled=isDisabled()||position===0;item.down.disabled=isDisabled()||position===order.length-1;item.handle.disabled=isDisabled()||order.length<2;
      // Moving a captured handle can lose capture in some browsers. Keep the
      // dragged row attached and move its neighbours around it instead.
      const desired=list.children[position];if(desired!==item.row){if(drag?.row===item.row){while(list.children[position]!==item.row)list.append(list.children[position])}else list.insertBefore(item.row,desired||null)}
    }
    const changed=order.some((value,i)=>value!==i);reset.disabled=isDisabled()||!changed;
    note.textContent=order.length<2?'至少两条备用开场时可以调整顺序。':changed?'顺序已调整，尚未保存。':'拖动手柄排序；也支持键盘上下方向键。';
  }
  reset.onclick=()=>{if(isDisabled())return;finish(true);apply(getOrder().map((_,i)=>i))};
  refresh();return {element:section,heading,refresh,finishDrag:()=>finish(),dispose(){if(closed)return;closed=true;finish();rows.clear();section.remove()}};
}
