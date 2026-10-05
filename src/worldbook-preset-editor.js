import {captureWorldbookPreset} from './worldbook-presets.js';

// Owns preset selection and its edit copy; the selector owns the character draft.
export function createWorldbookPresetEditor({doc,el,query:$,getDraft,entries,
  manager,character,isConnected,status,confirmPresetDelete}) {
  let worldbookPresetData={books:[],bindings:[],warnings:[]};
  let worldbookPresetMessage='正在读取绑定世界书…',closed=false,readRequest=0;
  const selection={id:'',edit:null,dirty:false,isNew:false};
  function reset() {
    selection.id='';selection.edit=null;selection.dirty=false;selection.isNew=false;
  }
  async function refresh() {
    const identity=character()?.avatar,request=++readRequest;
    const current=()=>!closed&&request===readRequest&&isConnected()&&character()?.avatar===identity;
    try {
      const result=await manager.read();if(!current())return;
      worldbookPresetData=result;
      worldbookPresetMessage=`已读取 ${result.books.length} 本、${result.entryCount} 条。${result.warnings.length?`读取失败：${result.warnings.join('；')}`:''}`;
    } catch(error) {
      if(!current())return;
      worldbookPresetData={books:[],bindings:[],warnings:[]};worldbookPresetMessage=String(error?.message||error);
    }
    const note=$('[data-worldbook-presets-status]');if(note)note.textContent=worldbookPresetMessage;
    render();
  }
  function commitPending({fromForm=false}={}) {
    const draft=getDraft();if(closed||!draft)return false;
    if(!selection.dirty)return true;
    const selected=selection.edit,name=String(selected?.name||'').trim().slice(0,120);
    if(!selected||!name){status(fromForm?'请填写预设名称。':'请先填写预设名称。');return false}
    if(worldbookPresetNameTaken(name,selected.id)){
      status(fromForm?'已有同名预设，请换一个名称。':'已有同名预设，请换一个名称后再保存。');return false;
    }
    const saved={...JSON.parse(JSON.stringify(selected)),name};
    if(selection.isNew)draft.worldbookPresets.push(saved);
    else {
      const index=draft.worldbookPresets.findIndex(preset=>preset.id===selected.id);
      if(index<0){status('找不到原预设，请刷新后重试。');return false}
      draft.worldbookPresets[index]=saved;
    }
    selection.edit=JSON.parse(JSON.stringify(saved));selection.dirty=false;selection.isNew=false;
    render();return true;
  }
  function worldbookPresetState(preset,book,item){
    const uid=item.uid??item.id;
    const saved=preset?.books?.find(value=>value.name===book.name)?.entries?.find(value=>String(value.uid)===String(uid));
    return saved?saved.enabled:item.enabled!==false&&item.disable!==true;
  }
  function setPresetEntry(preset,book,item,enabled){
    const uid=item.uid??item.id;if(uid==null||String(uid)==='')throw Error('该条目没有唯一 UID，无法安全记录');
    let savedBook=preset.books.find(value=>value.name===book.name);
    if(!savedBook){savedBook={name:book.name,entries:[]};preset.books.push(savedBook)}
    const saved=savedBook.entries.find(value=>String(value.uid)===String(uid));
    if(saved)saved.enabled=enabled;else savedBook.entries.push({uid,name:String(item.name||item.comment||'条目 '+uid).slice(0,160),enabled});
  }
  function worldbookItemSearchText(item){
    const keys=Array.isArray(item.keys)?item.keys:Array.isArray(item.strategy?.keys)?item.strategy.keys:[];
    return [item.name,item.comment,...keys].map(value=>String(value||'')).join(' ').toLocaleLowerCase();
  }
  function makeWorldbookPresetId(){
    const draft=getDraft();
    const random=doc.defaultView?.crypto?.randomUUID?.()||Math.random().toString(36).slice(2);
    const base='worldbook-'+Date.now().toString(36)+'-'+String(random).replace(/[^a-zA-Z0-9-]/g,'');
    let id=base,index=2;while(draft.worldbookPresets.some(preset=>preset.id===id))id=base+'-'+index++;
    return id;
  }
  function worldbookPresetNameTaken(name,exceptId=''){
    const draft=getDraft();
    const normalized=String(name||'').trim().toLocaleLowerCase();
    return draft.worldbookPresets.some(preset=>preset.id!==exceptId&&preset.name.toLocaleLowerCase()===normalized);
  }
  function nextWorldbookPresetName(base){
    const baseName=String(base||'世界书预设').trim().slice(0,120)||'世界书预设';
    let name=baseName,index=2;
    while(worldbookPresetNameTaken(name)){const suffix=' '+index++;name=baseName.slice(0,120-suffix.length)+suffix}
    return name;
  }
  function renderWorldbookPresetRows(list,preset,query,onChange=()=>{}){
    list.replaceChildren();let matches=0,remaining=400,limited=false;
    if(!preset){list.append(el('p','uos-help','先新建预设。'));return 0}
    for(const book of worldbookPresetData.books){
      const items=book.entries.filter(item=>!query||worldbookItemSearchText(item).includes(query));if(!items.length)continue;matches+=items.length;
      const shown=items.slice(0,Math.min(200,remaining));remaining-=shown.length;if(shown.length<items.length)limited=true;
      const group=el('details','uos-worldbook-group');group.open=Boolean(query)||(!query&&worldbookPresetData.books.length===1);
      const summary=el('summary','',book.name+' · '+items.filter(item=>worldbookPresetState(preset,book,item)).length+'/'+items.length+' 条启用');group.append(summary);
      const rows=el('div','uos-worldbook-entry-list');
      const renderEntries=()=>{
        rows.replaceChildren();if(!group.open)return;
        for(const item of shown){
          const uid=item.uid??item.id,key=uid==null?'':String(uid),label=el('label','uos-worldbook-entry-toggle'),input=el('input');
          input.type='checkbox';input.checked=worldbookPresetState(preset,book,item);input.disabled=!key||worldbookPresetData.warnings.length>0;
          input.onchange=()=>{try{setPresetEntry(preset,book,item,input.checked);summary.textContent=book.name+' · '+items.filter(value=>worldbookPresetState(preset,book,value)).length+'/'+items.length+' 条启用';onChange();status('预设有未保存修改；保存预设后再保存角色卡。')}catch(error){input.checked=worldbookPresetState(preset,book,item);status('无法记录此条目：'+(error.message||error))}};
          label.append(input,el('span','uos-worldbook-entry-name',String(item.name||item.comment||'未命名条目 '+(key||'（无 UID）'))));
          const keys=Array.isArray(item.keys)?item.keys:Array.isArray(item.strategy?.keys)?item.strategy.keys:[];
          if(keys.length)label.append(el('small','uos-worldbook-entry-keys','关键词：'+keys.map(value=>String(value)).slice(0,5).join('、')+(keys.length>5?'…':'')));
          if(!key)label.append(el('small','uos-worldbook-entry-keys','缺少 UID，无法切换'));
          rows.append(label);
        }
      };
      group.addEventListener('toggle',renderEntries);group.append(rows);renderEntries();list.append(group);
    }
    if(!matches)list.append(el('p','uos-help',query?'没有匹配条目。':'没有可编辑条目。'));
    if(limited)list.append(el('p','uos-help','结果过多，请缩小搜索范围。'));
    return matches;
  }
  function render(){
    const draft=getDraft(),panel=$('[data-worldbook-presets]');if(closed||!panel||!draft)return;panel.replaceChildren();
    const statusLine=el('p','uos-help',worldbookPresetMessage);statusLine.dataset.worldbookPresetsStatus='';panel.append(statusLine);
    const refresh=el('button','uos-icon','刷新');refresh.type='button';refresh.onclick=async()=>{refresh.disabled=true;await refresh();refresh.disabled=false};panel.append(refresh);
    panel.append(el('p','uos-help','修改后点「保存预设」，最后点页面底部「保存到角色卡」。'));
    if(worldbookPresetData.warnings.length)panel.append(el('p','uos-help','有世界书未能读取，暂不能新建或编辑预设。'));
    const presets=draft.worldbookPresets||[];
    if(selection.isNew){
      if(!selection.edit||selection.edit.id!==selection.id){selection.edit=null;selection.isNew=false;selection.dirty=false}
    }
    if(!selection.isNew){
      if(!presets.some(preset=>preset.id===selection.id))selection.id=presets[0]?.id||'';
      const saved=presets.find(preset=>preset.id===selection.id)||null;
      if(!saved){selection.edit=null;selection.dirty=false}
      else if(!selection.edit||selection.edit.id!==saved.id)selection.edit=JSON.parse(JSON.stringify(saved));
    }
    const active=()=>selection.edit;
    const updateDirty=()=>{
      if(selection.isNew){selection.dirty=true;return}
      const saved=presets.find(preset=>preset.id===selection.id);
      selection.dirty=!saved||JSON.stringify(saved)!==JSON.stringify(selection.edit);
    };

    panel.append(el('h3','uos-worldbook-section-title','世界书预设'));
    const createRow=el('div','uos-worldbook-actions');
    const newName=el('input','uos-worldbook-name');newName.type='text';newName.maxLength=120;newName.placeholder='新预设名称（可留空）';
    const create=el('button','uos-icon','新建预设');create.type='button';create.disabled=worldbookPresetData.warnings.length>0||selection.dirty;
    create.onclick=()=>{try{
      const snapshot=captureWorldbookPreset(worldbookPresetData.books),name=nextWorldbookPresetName(newName.value.trim()||'世界书预设 '+(presets.length+1));
      selection.edit={id:makeWorldbookPresetId(),name,...snapshot};selection.id=selection.edit.id;selection.dirty=true;selection.isNew=true;render();status('新预设草稿已创建；保存后才能分配给开场。');
    }catch(error){status(error.message||String(error))}};
    createRow.append(newName,create);panel.append(createRow);

    const selectRow=el('div','uos-worldbook-actions');
    const select=el('select','uos-worldbook-select'),empty=doc.createElement('option');empty.value='';empty.textContent=presets.length?'选择预设':'暂无预设';select.append(empty);
    for(const preset of presets){const option=doc.createElement('option');option.value=preset.id;option.textContent=preset.name;select.append(option)}
    select.value=selection.isNew?'':selection.id;select.disabled=selection.dirty;select.setAttribute('aria-label','选择世界书预设');select.onchange=()=>{if(selection.dirty){select.value=selection.isNew?'':selection.id;status('请先保存或撤销当前预设修改。');return}selection.id=select.value;const saved=presets.find(preset=>preset.id===selection.id);selection.edit=saved?JSON.parse(JSON.stringify(saved)):null;selection.dirty=false;selection.isNew=false;render()};selectRow.append(select);panel.append(selectRow);

    const selected=active();
    if(selected){
      const nameRow=el('div','uos-worldbook-actions'),nameInput=el('input','uos-worldbook-name');nameInput.type='text';nameInput.maxLength=120;nameInput.value=selected.name;nameInput.setAttribute('aria-label','预设名称');
      const savePreset=el('button','uos-icon',selection.isNew?'保存新预设':'保存预设');savePreset.type='button';savePreset.disabled=!selection.dirty;
      const undo=el('button','uos-icon',selection.isNew?'取消新建':'撤销修改');undo.type='button';undo.disabled=!selection.dirty;
      const duplicate=el('button','uos-icon','复制为新预设');duplicate.type='button';duplicate.disabled=selection.dirty||selection.isNew;
      const syncPresetControls=()=>{updateDirty();savePreset.disabled=!selection.dirty;undo.disabled=!selection.dirty;duplicate.disabled=selection.dirty||selection.isNew;if(remove)remove.disabled=selection.dirty;select.disabled=selection.dirty;create.disabled=worldbookPresetData.warnings.length>0||selection.dirty};
      const remove=selection.isNew?null:el('button','uos-icon','删除预设');if(remove){remove.type='button';remove.disabled=selection.dirty;remove.onclick=async()=>{if(!await confirmPresetDelete(selected.name)||closed||getDraft()!==draft)return;draft.worldbookPresets=draft.worldbookPresets.filter(preset=>preset.id!==selected.id);draft.entries.forEach(entry=>{if(entry.worldbookPresetId===selected.id)delete entry.worldbookPresetId});selection.id=draft.worldbookPresets[0]?.id||'';selection.edit=null;selection.dirty=false;render();status('预设已删除；点击底部「保存到角色卡」写入角色卡。')}}
      const capture=el('button','uos-icon','复制当前世界书开关');capture.type='button';capture.disabled=worldbookPresetData.warnings.length>0;capture.title='把酒馆当前的世界书条目开关复制到此预设，不会立即切换条目。';capture.onclick=()=>{try{const snapshot=captureWorldbookPreset(worldbookPresetData.books);selected.books=snapshot.books;updateDirty();render();status('当前世界书开关已复制到预设草稿；点「保存预设」确认。')}catch(error){status(error.message||String(error))}};
      nameInput.oninput=()=>{selected.name=nameInput.value;syncPresetControls();status(selection.dirty?'预设有未保存修改。':'预设修改已撤销。')};
      savePreset.onclick=()=>{selected.name=nameInput.value;if(!commitPending({fromForm:true})){nameInput.focus();return}status('预设已保存；再点页面底部「保存到角色卡」写入角色卡。')};
      undo.onclick=()=>{if(selection.isNew){selection.id=presets[0]?.id||'';selection.edit=presets[0]?JSON.parse(JSON.stringify(presets[0])):null;selection.isNew=false;selection.dirty=false}else{const saved=presets.find(preset=>preset.id===selected.id);selection.edit=saved?JSON.parse(JSON.stringify(saved)):null;selection.dirty=false}render();status('预设修改已撤销。')};
      duplicate.onclick=()=>{const copy=JSON.parse(JSON.stringify(selected));copy.id=makeWorldbookPresetId();copy.name=nextWorldbookPresetName(selected.name+' 副本');selection.id=copy.id;selection.edit=copy;selection.dirty=true;selection.isNew=true;render();status('已复制为新预设草稿；点「保存新预设」确认。')};
      nameRow.append(nameInput,savePreset,undo,duplicate);if(remove)nameRow.append(remove);nameRow.append(capture);panel.append(nameRow);

      const search=el('input','uos-worldbook-search');search.type='search';search.placeholder='搜索条目名称、注释或关键词';search.setAttribute('aria-label','搜索预设条目');panel.append(search);
      const bulk=el('div','uos-worldbook-actions'),enable=el('button','uos-icon','在预设中启用搜索结果'),disable=el('button','uos-icon','在预设中停用搜索结果');enable.type=disable.type='button';enable.disabled=disable.disabled=worldbookPresetData.warnings.length>0;bulk.append(enable,disable);panel.append(bulk);
      const rows=el('div','uos-worldbook-presets-list');panel.append(rows);
      const renderRows=()=>renderWorldbookPresetRows(rows,selected,search.value.trim().toLocaleLowerCase(),syncPresetControls);search.oninput=renderRows;renderRows();
      const bulkChange=enabled=>{try{const query=search.value.trim().toLocaleLowerCase();let changed=0;for(const book of worldbookPresetData.books)for(const item of book.entries){if((item.uid??item.id)!=null&&(!query||worldbookItemSearchText(item).includes(query))){setPresetEntry(selected,book,item,enabled);changed++}}syncPresetControls();renderRows();status('已修改 '+changed+' 条预设开关；点「保存预设」确认。')}catch(error){status(error.message||String(error))}};
      enable.onclick=()=>bulkChange(true);disable.onclick=()=>bulkChange(false);
    }else{
      panel.append(el('p','uos-help',worldbookPresetData.books.length?'先新建一个预设。':'未读取到绑定世界书条目。'));
    }

    panel.append(el('h3','uos-worldbook-section-title','开场分配'));
    const assignments=el('div','uos-worldbook-assignment-list'),openings=entries();
    openings.forEach((entry,index)=>{
      draft.entries[index]||={...entry};entry=draft.entries[index];
      const row=el('label','uos-worldbook-assignment'),label=el('span','uos-worldbook-assignment-name',(index+1)+' · '+entry.title);
      const choice=el('select','uos-worldbook-select');choice.setAttribute('aria-label',entry.title+' 世界书预设');
      const none=doc.createElement('option');none.value='';none.textContent='不切换';choice.append(none);
      for(const preset of presets){const option=doc.createElement('option');option.value=preset.id;option.textContent=preset.name;choice.append(option)}
      choice.value=entry.worldbookPresetId||'';
      choice.onchange=()=>{if(choice.value)entry.worldbookPresetId=choice.value;else delete entry.worldbookPresetId;status('分配已修改，保存到角色卡后生效。')};
      row.append(label,choice);assignments.append(row);
    });
    if(!openings.length)assignments.append(el('p','uos-help','没有可分配的开场。'));
    panel.append(assignments);
  }
  return {render,refresh,commitPending,reset,hasUnsaved:()=>selection.dirty,
    close(){closed=true;readRequest++;reset()}};
}
