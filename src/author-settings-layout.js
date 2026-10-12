// Keep every editor mounted so changing views never clears pending fields.
export function createSettingsViews({el,fields,views,initial}){
  const nav=el('nav','uos-settings-views');nav.setAttribute('aria-label','开场白设置分区');const buttons=new Map();
  function select(id){for(const view of views){const active=view.id===id;for(const node of view.nodes)node.hidden=!active;buttons.get(view.id).setAttribute('aria-pressed',String(active))}}
  for(const view of views){const button=el('button','uos-icon',view.label);button.type='button';button.onclick=()=>select(view.id);buttons.set(view.id,button);nav.append(button)}
  fields.prepend(nav);select(initial||views[0].id);return {select};
}
export function createOpeningPicker({el,container,rows,getEntries}){
  const tools=el('div','uos-opening-picker'),field=el('label'),caption=el('span','','正在编辑'),select=el('select'),previous=el('button','uos-icon','←'),next=el('button','uos-icon','→');
  select.setAttribute('aria-label','选择要编辑的开场');previous.type=next.type='button';previous.setAttribute('aria-label','编辑上一条开场');next.setAttribute('aria-label','编辑下一条开场');field.append(caption,select);tools.append(field,previous,next);
  let current=0;const options=rows.map((_,i)=>{const option=el('option');option.value=String(i);select.append(option);return option});
  function refresh(){const entries=getEntries();options.forEach((option,i)=>option.textContent=`${String(i+1).padStart(2,'0')} · ${entries[i]?.title||'未命名开场'}`);select.value=String(current);previous.disabled=current===0;next.disabled=current===rows.length-1;rows.forEach((row,i)=>{row.hidden=i!==current;row.open=i===current})}
  select.onchange=()=>{current=Number(select.value);refresh()};previous.onclick=()=>{if(current>0){current--;refresh()}};next.onclick=()=>{if(current<rows.length-1){current++;refresh()}};
  if(rows.length)container.prepend(tools);else container.append(el('p','uos-help','还没有备用开场，可返回首页生成第一条，或在酒馆角色编辑器中添加。'));
  refresh();return {refresh};
}
