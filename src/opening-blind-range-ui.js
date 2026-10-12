import {createModuleHelp} from './module-help.js';
import {keyedDrawItems,drawPoolName,DRAW_POOL_LIMIT} from './opening-blind-range.js';

export const DRAW_RANGE_CSS=`
.uos-blind-range-body{padding:18px 20px;display:grid;gap:12px}
.uos-blind-range-body p{margin:0;color:var(--muted);font-size:12px}
.uos-blind-range-tools{display:flex;flex-wrap:wrap;gap:8px}
.uos-blind-range-body select,.uos-blind-range-body input:is([type=search],[type=text]){appearance:none!important;box-sizing:border-box;width:100%;min-width:0;min-height:44px;margin:0!important;padding:10px 12px!important;border:1px solid var(--line)!important;border-radius:10px!important;background:var(--surface)!important;color:var(--text)!important;font:14px/1.5 system-ui,sans-serif!important}
.uos-blind-range-section{min-width:0;margin:0;padding:14px;border:1px solid var(--line);border-radius:12px;display:grid;gap:10px}
.uos-blind-range-section legend{padding:0 6px;font:700 13px/1.5 system-ui,sans-serif;color:var(--accent)}
.uos-blind-range-field{min-width:0;display:grid;gap:5px;font:600 12px/1.5 system-ui,sans-serif;color:var(--muted)}
.uos-blind-range-experience,.uos-blind-range-pool-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.uos-blind-range-pool-actions button{width:100%!important;padding:9px 8px!important;white-space:normal!important;overflow-wrap:anywhere}
.uos-blind-range-message{min-height:19px;color:var(--accent)!important}
.uos-blind-range-body :is(select,input):focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.uos-blind-range-list{max-height:42dvh;overflow:auto;display:grid;gap:7px;padding:2px}
.uos-blind-range-row{display:flex;align-items:center;gap:11px;min-height:52px;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);cursor:pointer}
.uos-blind-range-row:has(input:checked){border-color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--surface))}
.uos-blind-range-row input[type=checkbox]{appearance:auto!important;flex:none;width:20px!important;height:20px!important;margin:0!important;accent-color:var(--accent);cursor:pointer}
.uos-blind-range-row span{min-width:0;overflow-wrap:anywhere;font-size:13px}.uos-blind-range-row input:disabled+span{color:var(--muted)}
.uos-blind-box .uos-blind-range-save{width:100%!important;position:sticky;bottom:0;z-index:1;box-shadow:0 -8px 18px var(--bg)!important}.uos-blind-range-count{color:var(--accent)!important}
@media(max-width:380px){.uos-blind-range-body{padding:14px}.uos-blind-range-section{padding:10px}}
`;

export function createDrawRangePanel({doc,el,store,getAllItems,getFilteredItems,getPalette,isActive,onApply,onUnavailable}){
  const moduleHelp=createModuleHelp({doc});
  let disposed=false,active=null;
  function close(){moduleHelp.close();const current=active;if(!current)return;active=null;current.dialog.removeEventListener('keydown',current.onKey);if(current.dialog.open)current.dialog.close();current.dialog.remove();try{if(current.trigger?.isConnected)current.trigger.focus()}catch{}}
  function open(trigger){
    if(disposed||!isActive())return false;close();
    const items=keyedDrawItems(getAllItems()).map(item=>({...item})),prefs=store.read();
    const eligible=items.filter(item=>item.body&&!item.isCurrent),filteredIds=new Set(getFilteredItems().map(item=>item.id));
    let keys=new Set(prefs.mode==='manual'||prefs.keys.length?prefs.keys:eligible.map(item=>item.drawKey)),pools=prefs.pools.map(pool=>({...pool,keys:pool.keys.slice()})),editingId=prefs.activePoolId;
    const dialog=el('dialog','uos-blind-box uos-blind-range');dialog.setAttribute('aria-label','抽取范围');dialog.setAttribute('aria-modal','true');
    const palette=getPalette(),computed=palette.ownerDocument.defaultView.getComputedStyle(palette);dialog.dataset.theme=palette.dataset.theme||'archive';
    for(const key of ['--bg','--surface','--text','--muted','--accent','--line'])dialog.style.setProperty(key,computed.getPropertyValue(key)||computed.getPropertyValue('--panel'));
    const header=el('div','uos-blind-header'),heading=el('h2','uos-blind-heading','卡池与抽卡设置'),exit=el('button','','关闭设置');exit.type='button';header.append(heading,exit);const helpButton=moduleHelp.attach(header,'drawSettings',{before:exit});
    const body=el('div','uos-blind-range-body'),mode=el('select','uos-blind-range-mode'),search=el('input','uos-blind-range-search');
    const section=title=>{const node=el('fieldset','uos-blind-range-section');node.append(el('legend','',title));return node};
    const field=(text,control)=>{const label=el('label','uos-blind-range-field');label.append(el('span','',text),control);control.setAttribute('aria-label',text);return label};
    const experience=section('抽卡体验'),experienceFields=el('div','uos-blind-range-experience'),hand=el('select','uos-blind-hand-size'),show=el('select','uos-blind-show-setting');
    for(const [value,label] of [[3,'三张卡'],[5,'五张卡']]){const option=el('option','',label);option.value=String(value);hand.append(option)}hand.value=String(prefs.handSize);
    for(const [value,label] of [['theme','主题专属演出'],['simple','简洁卡牌']]){const option=el('option','',label);option.value=value;show.append(option)}show.value=prefs.performances?'theme':'simple';
    experienceFields.append(field('每轮摆出',hand),field('演出效果',show));experience.append(experienceFields,el('p','','每轮只选一张。候选不足时按实际数量摆出；手机五张卡分两排。'));
    const poolSection=section('命名卡池'),poolSelect=el('select','uos-blind-pool-select'),name=el('input','uos-blind-pool-name'),poolActions=el('div','uos-blind-range-pool-actions');
    name.type='text';name.maxLength=40;name.placeholder='例如：主线、番外、今晚想看';name.value=pools.find(pool=>pool.id===editingId)?.name||'';
    const addPool=el('button','','保存为新卡池'),updatePool=el('button','','更新卡池内容'),renamePool=el('button','','重命名'),deletePool=el('button','','删除卡池');
    for(const button of [addPool,updatePool,renamePool,deletePool])button.type='button';poolActions.append(addPool,updatePool,renamePool,deletePool);
    const message=el('p','uos-blind-range-message','卡池保存在本机；关闭设置会放弃本次修改。');message.setAttribute('role','status');
    poolSection.append(field('切换卡池',poolSelect),field('卡池名称',name),poolActions,message);
    const rangeSection=section('抽取范围');
    mode.setAttribute('aria-label','抽取范围模式');for(const [value,label] of [['filtered','沿用首页当前筛选'],['manual','只抽手动勾选的开场']]){const option=el('option','',label);option.value=value;mode.append(option)}mode.value=prefs.mode;
    search.type='search';search.placeholder='搜索标题、人物、分组或编号';search.setAttribute('aria-label','搜索抽取范围');
    const tools=el('div','uos-blind-range-tools'),all=el('button','','全部勾选'),none=el('button','','全部清空'),filtered=el('button','','仅选当前筛选');
    for(const button of [all,none,filtered])button.type='button';tools.append(all,none,filtered);
    const count=el('p','uos-blind-range-count'),list=el('div','uos-blind-range-list'),hint=el('p','','点选开场会切换到手动范围，独立于首页筛选；只保存在本机。当前开场与空正文不参与抽取。');count.setAttribute('role','status');
    const save=el('button','uos-blind-enter uos-blind-range-save','应用抽卡设置');save.type='button';rangeSection.append(mode,hint,search,tools,count,list);body.append(experience,poolSection,rangeSection,save);dialog.append(header,body);
    let checkboxes=[],renderVersion=0;const session={dialog,trigger,onKey:null};
    function valid(){if(disposed||active!==session)return false;if(!isActive()){close();onUnavailable();return false}return true}
    function updateCount(){const n=mode.value==='manual'?eligible.filter(item=>keys.has(item.drawKey)).length:eligible.filter(item=>filteredIds.has(item.id)).length;count.textContent=`${mode.value==='manual'?'手动范围':'当前筛选'} · ${n} 个可抽取开场${n?'':' · 请勾选开场或调整筛选'}`}
    function renderPools(){
      poolSelect.replaceChildren();const option=el('option','','未使用命名卡池');option.value='';poolSelect.append(option);
      for(const pool of pools){const members=new Set(pool.keys),n=eligible.filter(item=>members.has(item.drawKey)).length,option=el('option','',`${pool.name} · ${n} 条`);option.value=pool.id;poolSelect.append(option)}
      poolSelect.value=editingId||'';for(const button of [updatePool,renamePool,deletePool])button.disabled=!editingId;addPool.disabled=pools.length>=DRAW_POOL_LIMIT;
    }
    function currentKeys(){return mode.value==='manual'?[...keys]:eligible.filter(item=>filteredIds.has(item.id)).map(item=>item.drawKey)}
    function validName(exceptId){const value=drawPoolName(name.value);if(!value){message.textContent='请先填写卡池名称。';name.focus();return null}if(pools.some(pool=>pool.id!==exceptId&&pool.name===value)){message.textContent='已有同名卡池，请改名或选择它并更新内容。';return null}return value}
    function poolMessage(text){message.textContent=text+'；点击底部「应用抽卡设置」生效。'}
    poolSelect.onchange=()=>{if(!valid())return;editingId=poolSelect.value||null;const pool=pools.find(pool=>pool.id===editingId);if(pool){keys=new Set(pool.keys);mode.value='manual';name.value=pool.name}else name.value='';renderPools();render()};
    addPool.onclick=()=>{if(!valid()||addPool.disabled)return;const value=validName();if(!value)return;let serial=1;while(pools.some(pool=>pool.id===`pool-${serial}`))serial++;editingId=`pool-${serial}`;keys=new Set(currentKeys());mode.value='manual';pools.push({id:editingId,name:value,keys:[...keys]});name.value=value;renderPools();render();poolMessage('新卡池已暂存')};
    updatePool.onclick=()=>{if(!valid()||updatePool.disabled)return;const pool=pools.find(pool=>pool.id===editingId);if(!pool)return;keys=new Set(currentKeys());mode.value='manual';pool.keys=[...keys];renderPools();render();poolMessage('卡池内容已暂存')};
    renamePool.onclick=()=>{if(!valid()||renamePool.disabled)return;const value=validName(editingId),pool=pools.find(pool=>pool.id===editingId);if(!value||!pool)return;pool.name=value;name.value=value;renderPools();poolMessage('新名称已暂存')};
    deletePool.onclick=()=>{if(!valid()||deletePool.disabled)return;pools=pools.filter(pool=>pool.id!==editingId);editingId=null;name.value='';renderPools();poolMessage('删除已暂存，当前勾选范围保留')};
    function render(){
      const version=++renderVersion;list.replaceChildren();checkboxes=[];const query=String(search.value||'').trim().toLocaleLowerCase();
      for(const item of items){const text=`${String(item.number??item.id+1).padStart(2,'0')} · ${item.title||'未命名开场'}${item.group?' · '+item.group:''}`;
        if(query&&!`${text} ${(item.names||[]).join(' ')}`.toLocaleLowerCase().includes(query))continue;
        const row=el('label','uos-blind-range-row'),checkbox=el('input');checkbox.type='checkbox';checkbox.checked=keys.has(item.drawKey);checkbox.disabled=!item.body||Boolean(item.isCurrent);checkbox.setAttribute('aria-label',text);
        row.append(checkbox,el('span','',text+(item.isCurrent?'（当前开场）':!item.body?'（正文为空）':'')));
        checkbox.onchange=()=>{if(!valid()||version!==renderVersion||checkbox.disabled)return;mode.value='manual';if(checkbox.checked)keys.add(item.drawKey);else keys.delete(item.drawKey);updateCount()};checkboxes.push(checkbox);list.append(row);
      }
      if(!checkboxes.length)list.append(el('p','','没有匹配的开场。'));updateCount();
    }
    mode.onchange=()=>{if(valid())updateCount()};search.oninput=()=>{if(valid())render()};
    function select(next){if(!valid())return;mode.value='manual';keys=new Set(next);render()}
    all.onclick=()=>select(eligible.map(item=>item.drawKey));none.onclick=()=>select([]);filtered.onclick=()=>select(eligible.filter(item=>filteredIds.has(item.id)).map(item=>item.drawKey));
    exit.onclick=()=>{if(active===session)close()};save.onclick=()=>{if(!valid())return;const result=store.set({...store.read(),mode:mode.value,keys:[...keys],handSize:hand.value,performances:show.value==='theme',pools,activePoolId:editingId});close();onApply(result)};
    session.onKey=event=>{if(active!==session)return;if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return}if(event.key==='Tab'){const controls=[helpButton,exit,hand,show,poolSelect,name,addPool,updatePool,renamePool,deletePool,mode,search,all,none,filtered,...checkboxes,save].filter(node=>!node.disabled),first=controls[0],last=controls.at(-1);if(event.shiftKey&&doc.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first.focus()}}};
    active=session;dialog.addEventListener('keydown',session.onKey);dialog.addEventListener('cancel',event=>{event.preventDefault();if(active===session)close()});dialog.addEventListener('close',()=>{if(active===session)close()});renderPools();render();doc.body.append(dialog);try{dialog.showModal()}catch{dialog.setAttribute('open','');dialog.setAttribute('role','dialog')}exit.focus();return true;
  }
  return {open,close,dispose(){if(disposed)return;disposed=true;moduleHelp.dispose();close()}};
}
