import {defaultCoverSlot} from './default-covers.js';

export const OPENING_LAYOUTS = [['classic','原有卡片'],['gallery','画廊'],['catalog','故事目录'],['dossier','档案']];
export function openingLayout(value) {
  return OPENING_LAYOUTS.some(([id])=>id===value) ? value : 'classic';
}
export function coverPresentation(entry={}) {
  entry=entry&&typeof entry==='object'?entry:{};
  const point=value=>typeof value==='number'&&Number.isFinite(value)?Math.max(0,Math.min(100,value)):50;
  return {
    coverSlot:Number.isInteger(entry.coverSlot)&&entry.coverSlot>=1&&entry.coverSlot<=5?entry.coverSlot:0,
    coverFocus:{x:point(entry.coverFocus?.x),y:point(entry.coverFocus?.y)},
  };
}
export function applyOpeningCover(cover,entry,identity,index,host,{shade=false}={}) {
  const {coverSlot,coverFocus}=coverPresentation(entry);
  const custom=/^(data:image\/(?:png|jpeg|webp|gif);base64,|https?:\/\/)/i.test(entry?.image||'');
  const image=custom?`url("${entry.image.replace(/["\\\r\n]/g,'')}")`:`var(--uos-default-cover-${coverSlot||defaultCoverSlot(identity,index,host)})`;
  cover.classList.add('has-image');
  cover.style.backgroundImage=(shade?'linear-gradient(0deg,#0005,transparent),':'')+image;
  cover.style.backgroundPosition=`${coverFocus.x}% ${coverFocus.y}%`;
}
