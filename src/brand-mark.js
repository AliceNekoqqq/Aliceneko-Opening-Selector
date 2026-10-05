import {THEME_ART} from './theme-art.js';
import {themeAssetCandidates} from './asset-source.js';
import {THEMES,THEME_IDS} from './themes.js';

const MASCOT_COLUMNS=4,MASCOT_ROWS=5;
export const THEME_MASCOT_POSITIONS=Object.freeze(Object.fromEntries(THEME_IDS.map((id,index)=>[
  id,`${(index%MASCOT_COLUMNS)/(MASCOT_COLUMNS-1)*100}% ${(Math.floor(index/MASCOT_COLUMNS))/(MASCOT_ROWS-1)*100}%`,
])));
const themeRules=THEMES.map(([id])=>`.uos[data-theme="${id}"] .uos-brand-avatar,.uos-user-panel[data-theme="${id}"] .uos-brand-avatar,.uos-user-trigger[data-theme="${id}"] .uos-brand-avatar,.uos[data-theme="${id}"] .uos-mascot-note-avatar,.uos-user-panel[data-theme="${id}"] .uos-mascot-note-avatar{--uos-mascot-position:${THEME_MASCOT_POSITIONS[id]}}`).join('\n');

// Brand identity is shared by author, player and the read-only page preview.
export const BRAND_CSS=`
.uos-brand{display:flex;align-items:center;gap:12px;max-width:100%;margin:0 0 16px;box-sizing:border-box;pointer-events:none}
.uos-masthead .uos-brand{padding-right:64px}
.uos-brand-avatar{display:block;flex:none;width:76px;height:70px;filter:drop-shadow(0 2px 3px #0002);background-color:transparent;background-image:var(--uos-theme-mascot-image,url("${THEME_ART.themeMascots}"));background-size:${MASCOT_COLUMNS*100}% ${MASCOT_ROWS*100}%;background-position:var(--uos-mascot-position,0% 0%);background-repeat:no-repeat}
.uos-brand-copy{display:grid;gap:4px;min-width:0;color:var(--text);font-family:system-ui,"Noto Sans SC",sans-serif}
.uos-brand-copy strong{font-size:15px;font-weight:700;line-height:1.4;letter-spacing:.09em;overflow-wrap:anywhere}
.uos-brand-copy small{color:var(--muted);font-size:11px;line-height:1.5;letter-spacing:.08em}
.uos-user-panel .uos-brand{margin-bottom:12px}
.uos-user-panel .uos-brand-avatar{width:64px;height:59px}
.uos-user-head>div:first-child{min-width:0;flex:1}
.uos-mascot-note{display:flex;align-items:center;gap:14px;padding:14px 16px;margin:0 0 16px;border:1px solid var(--line);border-radius:14px;background:var(--panel,var(--surface));color:var(--muted);font:13px/1.7 system-ui,"Noto Sans SC",sans-serif;box-sizing:border-box;min-width:0}
.uos-mascot-note-avatar{display:block;flex:none;width:94px;height:86px;background-color:transparent;background-image:var(--uos-theme-mascot-image,url("${THEME_ART.themeMascots}"));background-size:${MASCOT_COLUMNS*100}% ${MASCOT_ROWS*100}%;background-position:var(--uos-mascot-position,0% 0%);background-repeat:no-repeat;filter:drop-shadow(0 2px 3px #0002)}
.uos-mascot-note-copy{min-width:0;overflow-wrap:anywhere}
.uos .uos-search-empty.uos-mascot-note::before{display:none}
.uos-search-empty.uos-mascot-note,.uos-user-empty.uos-mascot-note{grid-column:1/-1;margin:10px 0;min-height:112px}
@media(max-width:600px){.uos-mascot-note{padding:12px;gap:10px;font-size:12px}.uos-mascot-note-avatar{width:76px;height:70px}}
@media(max-width:600px){.uos-brand{gap:10px;margin-bottom:12px}.uos-brand-avatar,.uos-user-panel .uos-brand-avatar{width:58px;height:53px}.uos-brand-copy strong{font-size:13px;letter-spacing:.04em}.uos-brand-copy small{font-size:10px;letter-spacing:.04em}}
${themeRules}
img[data-uos-mascot-loader]{display:none!important}
`;
export function brandMarkMarkup(){
  return `<div class="uos-brand"><span class="uos-brand-avatar" data-uos-theme-mascot role="img" aria-label="主题看板娘 Logo"></span><div class="uos-brand-copy"><strong>红豆粉开场白选择器</strong><small>ALICENEKO · OPENING SELECTOR</small></div></div>`;
}
export function bindBrandImages(root){
  if(!root?.querySelectorAll)return ()=>{};
  const doc=root.ownerDocument,urls=themeAssetCandidates('assets/brand/theme-mascots.webp');let index=0,disposed=false;
  const loader=doc?.createElement?.('img');
  if(!loader)return ()=>{};
  loader.dataset.uosMascotLoader='';loader.alt='';loader.hidden=true;root.append(loader);
  const stop=()=>{if(disposed)return;disposed=true;loader.onload=loader.onerror=null;loader.remove();root.style?.removeProperty?.('--uos-theme-mascot-image')};
  loader.onload=()=>{if(!disposed&&root.isConnected!==false)root.style?.setProperty?.('--uos-theme-mascot-image',`url("${urls[index]}")`)};
  loader.onerror=()=>{if(disposed||root.isConnected===false)return;if(++index<urls.length)loader.src=urls[index]};
  loader.src=urls[index];
  return stop;
}
export function mascotNoteMarkup(kind,text){
  return `<div class="uos-mascot-note"><span class="uos-mascot-note-avatar" data-mascot-kind="${kind}" aria-hidden="true"></span><span class="uos-mascot-note-copy">${text}</span></div>`;
}
export function createMascotNote(el,kind,text,cls=''){
  const element=el('div',`uos-mascot-note ${cls}`),avatar=el('span','uos-mascot-note-avatar'),copy=el('span','uos-mascot-note-copy','');
  avatar.dataset.mascotKind=kind;avatar.setAttribute('aria-hidden','true');copy.textContent=String(text??'');element.append(avatar,copy);
  return {element,dispose:()=>{}};
}
export function createBrandMark(el){
  const element=el('div','uos-brand'),image=el('span','uos-brand-avatar'),copy=el('div','uos-brand-copy');
  image.setAttribute('role','img');image.setAttribute('aria-label','主题看板娘 Logo');image.dataset.uosThemeMascot='';
  copy.append(el('strong','','红豆粉开场白选择器'),el('small','','ALICENEKO · OPENING SELECTOR'));element.append(image,copy);
  return {element};
}
