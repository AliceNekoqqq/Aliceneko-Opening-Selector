import {keyedDrawItems} from './opening-blind-range.js';

export const DRAW_RANGE_CSS=`
.uos-blind-range-body{padding:18px 20px;display:grid;gap:12px}
.uos-blind-range-body p{margin:0;color:var(--muted);font-size:12px}
.uos-blind-range-tools{display:flex;flex-wrap:wrap;gap:8px}
.uos-blind-range-body select,.uos-blind-range-body input[type=search]{appearance:none!important;box-sizing:border-box;width:100%;min-height:44px;margin:0!important;padding:10px 12px!important;border:1px solid var(--line)!important;border-radius:10px!important;background:var(--surface)!important;color:var(--text)!important;font:14px/1.5 system-ui,sans-serif!important}
.uos-blind-range-body :is(select,input):focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.uos-blind-range-list{max-height:42dvh;overflow:auto;display:grid;gap:7px;padding:2px}
.uos-blind-range-row{display:flex;align-items:center;gap:11px;min-height:52px;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);cursor:pointer}
.uos-blind-range-row:has(input:checked){border-color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--surface))}
.uos-blind-range-row input[type=checkbox]{appearance:auto!important;flex:none;width:20px!important;height:20px!important;margin:0!important;accent-color:var(--accent);cursor:pointer}
.uos-blind-range-row span{min-width:0;overflow-wrap:anywhere;font-size:13px}.uos-blind-range-row input:disabled+span{color:var(--muted)}
.uos-blind-range-save{width:100%!important}.uos-blind-range-count{color:var(--accent)!important}
`;

export function createDrawRangePanel({doc,el,store,getAllItems,getFilteredItems,getPalette,isActive,onApply,onUnavailable}){
  let disposed=false,active=null;
  function close(){const current=active;if(!current)return;active=null;current.dialog.removeEventListener('keydown',current.onKey);if(current.dialog.open)current.dialog.close();current.dialog.remove();try{if(current.trigger?.isConnected)current.trigger.focus()}catch{}}
  function open(trigger){
    if(disposed||!isActive())return false;close();
    const items=keyedDrawItems(getAllItems()).map(item=>({...item})),prefs=store.read();
    const eligible=items.filter(item=>item.body&&!item.isCurrent),filteredIds=new Set(getFilteredItems().map(item=>item.id));
    let keys=new Set(prefs.mode==='manual'||prefs.keys.length?prefs.keys:eligible.map(item=>item.drawKey));
    const dialog=el('dialog','uos-blind-box uos-blind-range');dialog.setAttribute('aria-label','抽取范围');dialog.setAttribute('aria-modal','true');
    const palette=getPalette(),computed=palette.ownerDocument.defaultView.getComputedStyle(palette);dialog.dataset.theme=palette.dataset.theme||'archive';
    for(const key of ['--bg','--surface','--text','--muted','--accent','--line'])dialog.style.setProperty(key,computed.getPropertyValue(key)||computed.getPropertyValue('--panel'));
    const header=el('div','uos-blind-header'),heading=el('h2','uos-blind-heading','抽取范围'),exit=el('button','','关闭设置');exit.type='button';header.append(heading,exit);
    const body=el('div','uos-blind-range-body'),mode=el('select','uos-blind-range-mode'),search=el('input','uos-blind-range-search');
    mode.setAttribute('aria-label','抽取范围模式');for(const [value,label] of [['filtered','沿用首页当前筛选'],['manual','只抽手动勾选的开场']]){const option=el('option','',label);option.value=value;mode.append(option)}mode.value=prefs.mode;
    search.type='search';search.placeholder='搜索标题、人物、分组或编号';search.setAttribute('aria-label','搜索抽取范围');
    const tools=el('div','uos-blind-range-tools'),all=el('button','','全部勾选'),none=el('button','','全部清空'),filtered=el('button','','仅选当前筛选');
    for(const button of [all,none,filtered])button.type='button';tools.append(all,none,filtered);
    const count=el('p','uos-blind-range-count'),list=el('div','uos-blind-range-list'),hint=el('p','','点选开场会切换到手动范围，独立于首页筛选；只保存在本机。当前开场与空正文不参与抽取。');count.setAttribute('role','status');
    const save=el('button','uos-blind-enter uos-blind-range-save','应用抽取范围');save.type='button';body.append(mode,hint,search,tools,count,list,save);dialog.append(header,body);
    let checkboxes=[];const session={dialog,trigger,onKey:null};
    function valid(){if(disposed||active!==session)return false;if(!isActive()){close();onUnavailable();return false}return true}
    function updateCount(){const n=mode.value==='manual'?eligible.filter(item=>keys.has(item.drawKey)).length:eligible.filter(item=>filteredIds.has(item.id)).length;count.textContent=`${mode.value==='manual'?'手动范围':'当前筛选'} · ${n} 个可抽取开场${n?'':' · 请勾选开场或调整筛选'}`}
    function render(){
      list.replaceChildren();checkboxes=[];const query=String(search.value||'').trim().toLocaleLowerCase();
      for(const item of items){const text=`${String(item.number??item.id+1).padStart(2,'0')} · ${item.title||'未命名开场'}${item.group?' · '+item.group:''}`;
        if(query&&!`${text} ${(item.names||[]).join(' ')}`.toLocaleLowerCase().includes(query))continue;
        const row=el('label','uos-blind-range-row'),checkbox=el('input');checkbox.type='checkbox';checkbox.checked=keys.has(item.drawKey);checkbox.disabled=!item.body||Boolean(item.isCurrent);checkbox.setAttribute('aria-label',text);
        row.append(checkbox,el('span','',text+(item.isCurrent?'（当前开场）':!item.body?'（正文为空）':'')));
        checkbox.onchange=()=>{if(!valid()||checkbox.disabled)return;mode.value='manual';if(checkbox.checked)keys.add(item.drawKey);else keys.delete(item.drawKey);updateCount()};checkboxes.push(checkbox);list.append(row);
      }
      if(!checkboxes.length)list.append(el('p','','没有匹配的开场。'));updateCount();
    }
    mode.onchange=()=>{if(valid())updateCount()};search.oninput=()=>{if(valid())render()};
    function select(next){if(!valid())return;mode.value='manual';keys=new Set(next);render()}
    all.onclick=()=>select(eligible.map(item=>item.drawKey));none.onclick=()=>select([]);filtered.onclick=()=>select(eligible.filter(item=>filteredIds.has(item.id)).map(item=>item.drawKey));
    exit.onclick=()=>{if(active===session)close()};save.onclick=()=>{if(!valid())return;const result=store.set({mode:mode.value,keys:[...keys]});close();onApply(result)};
    session.onKey=event=>{if(active!==session)return;if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return}if(event.key==='Tab'){const controls=[exit,mode,search,all,none,filtered,...checkboxes,save].filter(node=>!node.disabled),first=controls[0],last=controls.at(-1);if(event.shiftKey&&doc.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first.focus()}}};
    active=session;dialog.addEventListener('keydown',session.onKey);dialog.addEventListener('cancel',event=>{event.preventDefault();if(active===session)close()});dialog.addEventListener('close',()=>{if(active===session)close()});render();doc.body.append(dialog);try{dialog.showModal()}catch{dialog.setAttribute('open','');dialog.setAttribute('role','dialog')}exit.focus();return true;
  }
  return {open,close,dispose(){if(disposed)return;disposed=true;close()}};
}
