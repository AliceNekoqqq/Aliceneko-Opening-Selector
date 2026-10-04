import {readMediaFile} from './media-files.js';

// The caller owns the draft and save transaction; fields report pending uploads.
export function createSettingsFields({el,view=globalThis,getDraft,status,onPendingChange=()=>{}}) {
  let pending=0,closed=false;
  const current=target=>!closed&&(!target||target===getDraft());
  function field(label,value,change,multiline=false) {
    const wrap=el('label','uos-field'),input=el(multiline?'textarea':'input');
    wrap.append(el('span','',label));input.value=value||'';
    input.addEventListener('input',()=>change(input.value));wrap.append(input);return wrap;
  }
  function toggleField(label,value,change) {
    const wrap=el('label','uos-toggle'),input=el('input');
    input.type='checkbox';input.checked=Boolean(value);input.onchange=()=>change(input.checked);
    wrap.append(input,el('span','',label));return wrap;
  }
  function fileField(label,accept,max,onload) {
    const target=getDraft(),wrap=el('label','uos-field'),input=el('input');
    wrap.append(el('span','',label));input.type='file';input.accept=accept;
    input.onchange=async()=>{
      const file=input.files?.[0];if(!file||!current(target))return;
      if(file.size>max){status(`${label}超过 ${Math.round(max/1048576)} MB 限制`);input.value='';return}
      onPendingChange(++pending);
      try {
        const result=await readMediaFile(file,view);
        if(!current(target))return;
        const message=await onload(result,file,target);
        if(current(target))status(message||`${label}已载入，点击保存后随角色卡导出。`);
      } catch(error) {
        if(current(target))status(`文件读取失败：${error.message}`);
      } finally {
        pending=Math.max(0,pending-1);onPendingChange(pending);
      }
    };
    wrap.append(input);return wrap;
  }
  return {field,toggleField,fileField,isCurrent:current,close(){closed=true}};
}
