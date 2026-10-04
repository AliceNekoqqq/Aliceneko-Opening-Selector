import {openingFavoriteButton} from './opening-favorites-ui.js';
import {applyOpeningCover} from './opening-presentation.js';
import {openingTagChips} from './opening-category-ui.js';
import {decorateOpeningPreviewButton} from './opening-action-styles.js';

// Presentation only: both the saved author page and draft page use this markup.
export function createAuthorOpeningCard({el,entry,index,body,host,onChoose,onPreview,favoriteButton}){
  const names=Array.isArray(entry.names)?entry.names:String(entry.names||'').split(/[、，,\/]/).map(name=>name.trim()).filter(Boolean);
  const shell=el('article','uos-card-shell'),card=el('button','uos-card');card.type='button';card.setAttribute('aria-label',`选择 ${entry.title}`);
  const cover=el('div','uos-cover'),art=el('span','uos-theme-art');art.setAttribute('aria-hidden','true');cover.append(art);
  applyOpeningCover(cover,entry,body||entry.title,index,host,{shade:true});cover.append(el('span','uos-number',String(index+1).padStart(2,'0')));
  const content=el('div','uos-card-body');if(entry.label)content.append(el('span','uos-label',entry.label));content.append(el('strong','',entry.title));
  if(entry.description)content.append(el('div','uos-description',entry.description));
  const chips=openingTagChips(el,entry.tags);if(chips)content.append(chips);
  if(names.length){const cast=el('p','uos-card-names');cast.append(el('span','uos-cast-label','人物'));for(const name of names.slice(0,3))cast.append(el('span','uos-name-chip',name));if(names.length>3)cast.append(el('span','uos-name-chip',`+${names.length-3}`));content.append(cast)}
  card.append(cover,content);if(onChoose)card.addEventListener('click',()=>onChoose(index+1));else card.disabled=true;shell.append(card);
  if(body){
    const details=el('div','uos-card-details uos-card-actions'),button=el('button','uos-card-preview-button');button.type='button';decorateOpeningPreviewButton(button,el);
    if(onPreview)button.onclick=()=>onPreview(index+1,button);else button.disabled=true;details.append(button,favoriteButton||openingFavoriteButton(el,{key:entry.favoriteKey,title:entry.title,selected:entry.favorite}));shell.append(details);
  }
  return shell;
}
