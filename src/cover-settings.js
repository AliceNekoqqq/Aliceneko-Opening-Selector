import {coverPresentation} from './opening-presentation.js';

// Edits only the supplied author draft. The owner retains save / discard control.
export function createCoverSettings({el,entry,onChange}) {
  const panel=el('details','uos-cover-settings');panel.append(el('summary','','封面选择与显示位置'));
  const choices=el('div','uos-cover-choices'),note=el('p','uos-help'),buttons=[];
  function refresh(){
    const state=coverPresentation(entry);
    buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(!entry.image&&state.coverSlot===i)));
    note.textContent=entry.image?'正在使用自定义封面；选择默认图会替换它。':state.coverSlot?`已固定默认封面 ${state.coverSlot}；切换主题使用对应编号。`:'默认封面自动分配，同一开场在本机保持稳定。';
  }
  for(let slot=0;slot<=5;slot++){
    const button=el('button','uos-cover-choice');button.type='button';button.setAttribute('aria-label',slot?`使用默认封面 ${slot}`:'自动分配默认封面');
    if(slot){const thumb=el('span','uos-cover-thumb');thumb.style.backgroundImage=`var(--uos-default-cover-${slot})`;thumb.setAttribute('aria-hidden','true');button.append(thumb)}
    button.append(el('span','',slot?`封面 ${slot}`:'自动分配'));
    button.onclick=()=>{entry.image='';entry.coverSlot=slot;refresh();onChange()};buttons.push(button);choices.append(button);
  }
  const random=el('button','uos-icon','重新随机');random.type='button';
  random.onclick=()=>{const current=coverPresentation(entry).coverSlot;const candidates=[1,2,3,4,5].filter(slot=>slot!==current);entry.image='';entry.coverSlot=candidates[Math.floor(Math.random()*candidates.length)];refresh();onChange()};
  const controls=el('div','uos-cover-focus'),inputs=[];
  for(const [axis,label] of [['x','横向焦点'],['y','纵向焦点']]){
    const field=el('label'),caption=el('span'),input=el('input');input.type='range';input.min='0';input.max='100';input.step='1';input.value=String(coverPresentation(entry).coverFocus[axis]);input.setAttribute('aria-label',label);
    const updateCaption=()=>caption.textContent=`${label} · ${input.value}%`;
    input.oninput=()=>{entry.coverFocus={...coverPresentation(entry).coverFocus,[axis]:Number(input.value)};updateCaption();onChange()};updateCaption();field.append(caption,input);controls.append(field);inputs.push({axis,input,updateCaption});
  }
  const reset=el('button','uos-icon','居中显示');reset.type='button';reset.onclick=()=>{entry.coverFocus={x:50,y:50};for(const {input,updateCaption} of inputs){input.value='50';updateCaption()}onChange()};
  panel.append(choices,note,random,el('p','uos-help','调整取景位置，卡片预览同步显示。'),controls,reset);refresh();
  return {element:panel,refresh};
}
