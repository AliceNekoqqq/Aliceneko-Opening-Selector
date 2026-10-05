import {THEME_ART} from './theme-art.js';
import {themeAssetCandidates} from './asset-source.js';

// Brand identity is shared by author, player and the read-only page preview.
export const BRAND_CSS=`
.uos-brand{display:flex;align-items:center;gap:12px;max-width:100%;margin:0 0 16px;box-sizing:border-box;pointer-events:none}
.uos-masthead .uos-brand{padding-right:64px}
.uos-brand-avatar{display:block;flex:none;width:76px;height:70px;object-fit:contain;object-position:center;filter:drop-shadow(0 3px 5px #0002);background:radial-gradient(ellipse,#d9759a20,transparent 72%)}
.uos-brand-copy{display:grid;gap:4px;min-width:0;color:var(--text);font-family:system-ui,"Noto Sans SC",sans-serif}
.uos-brand-copy strong{font-size:15px;font-weight:700;line-height:1.4;letter-spacing:.09em;overflow-wrap:anywhere}
.uos-brand-copy small{color:var(--muted);font-size:11px;line-height:1.5;letter-spacing:.08em}
.uos-user-panel .uos-brand{margin-bottom:12px}
.uos-user-panel .uos-brand-avatar{width:64px;height:59px}
.uos-user-head>div:first-child{min-width:0;flex:1}
.uos-mascot-note{display:flex;align-items:center;gap:14px;padding:14px 16px;margin:0 0 16px;border:1px solid var(--line);border-radius:14px;background:var(--panel,var(--surface));color:var(--muted);font:13px/1.7 system-ui,"Noto Sans SC",sans-serif;box-sizing:border-box;min-width:0}
.uos-mascot-note img{display:block;width:94px;height:86px;object-fit:contain;flex:none}
.uos-mascot-note span{min-width:0;overflow-wrap:anywhere}
.uos-brand img[hidden],.uos-mascot-note img[hidden]{display:none}
.uos .uos-search-empty.uos-mascot-note::before{display:none}
.uos .uos-search-empty:not(.uos-mascot-note)::before{background-image:url("${THEME_ART.search}");background-size:contain;background-position:center;background-repeat:no-repeat}
.uos-search-empty.uos-mascot-note,.uos-user-empty.uos-mascot-note{grid-column:1/-1;margin:10px 0;min-height:112px}
@media(max-width:600px){.uos-mascot-note{padding:12px;gap:10px;font-size:12px}.uos-mascot-note img{width:76px;height:70px}}
@media(max-width:600px){.uos-brand{gap:10px;margin-bottom:12px}.uos-brand-avatar,.uos-user-panel .uos-brand-avatar{width:58px;height:53px}.uos-brand-copy strong{font-size:13px;letter-spacing:.04em}.uos-brand-copy small{font-size:10px;letter-spacing:.04em}}
`;
export function brandMarkMarkup(){
  return `<div class="uos-brand"><img class="uos-brand-avatar" data-uos-mascot src="${THEME_ART.mascot}" width="384" height="351" alt="" aria-hidden="true" draggable="false" decoding="async"><div class="uos-brand-copy"><strong>红豆粉开场白选择器</strong><small>ALICENEKO · OPENING SELECTOR</small></div></div>`;
}
export function bindMascotImage(image,kind='mascot'){
  if(!image)return ()=>{};
  if(!['mascot','welcome','search'].includes(kind))kind='mascot';
  const sources=themeAssetCandidates(`assets/brand/${kind}.webp`);let index=0,disposed=false;
  const fail=()=>{
    if(disposed||image.isConnected===false)return;
    if(++index<sources.length)image.src=sources[index];
    else{image.hidden=true;image.onload=image.onerror=null}
  };
  image.onload=()=>{if(!disposed&&image.isConnected!==false)image.hidden=false};
  image.onerror=fail;
  if(image.complete&&image.naturalWidth===0)fail();
  return ()=>{disposed=true;image.onload=image.onerror=null};
}
export function bindBrandImages(root){
  const stops=[...(root.querySelectorAll?.('[data-uos-mascot]')||[])].map(image=>bindMascotImage(image,image.getAttribute('data-mascot-kind')||'mascot'));
  return ()=>stops.forEach(stop=>stop());
}
export function mascotNoteMarkup(kind,text){
  return `<div class="uos-mascot-note"><img data-uos-mascot data-mascot-kind="${kind}" src="${THEME_ART[kind]}" width="320" height="292" alt="" aria-hidden="true" draggable="false" decoding="async"><span>${text}</span></div>`;
}
export function createMascotNote(el,kind,text,cls=''){
  const element=el('div',`uos-mascot-note ${cls}`),image=el('img');image.alt='';image.draggable=false;image.decoding='async';image.width=320;image.height=292;image.setAttribute('aria-hidden','true');image.src=THEME_ART[kind];
  element.append(image,el('span','',text));
  return {element,dispose:bindMascotImage(image,kind)};
}
export function createBrandMark(el){
  const element=el('div','uos-brand'),image=el('img','uos-brand-avatar'),copy=el('div','uos-brand-copy');
  image.alt='';image.draggable=false;image.decoding='async';image.width=384;image.height=351;image.setAttribute('aria-hidden','true');
  image.src=THEME_ART.mascot;
  copy.append(el('strong','','红豆粉开场白选择器'),el('small','','ALICENEKO · OPENING SELECTOR'));element.append(image,copy);
  return {element,dispose:bindMascotImage(image)};
}
