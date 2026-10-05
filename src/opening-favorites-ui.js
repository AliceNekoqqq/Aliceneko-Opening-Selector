export function openingFavoriteButton(el,{key,title,selected=false,onToggle}){
  const button=el('button','uos-opening-favorite'),icon=el('span','',selected?'★':'☆');button.type='button';icon.setAttribute('aria-hidden','true');button.append(icon);
  const label=(selected?'取消收藏：':'收藏：')+title;button.setAttribute('aria-label',label);button.setAttribute('title',label);button.setAttribute('aria-pressed',String(selected));button.dataset.favoriteKey=key||'';
  if(onToggle)button.onclick=onToggle;else button.disabled=true;return button;
}

export function openingFavoritesFilter(el,count,onToggle){
  const button=el('button','uos-favorites-filter',`☆ 只看收藏 · ${count}`);button.type='button';button.setAttribute('aria-label','只看收藏');button.setAttribute('aria-pressed','false');
  if(onToggle)button.onclick=onToggle;else button.disabled=true;return button;
}

// Only local favorites and window filters are owned here. Selection remains with callers.
export function createOpeningFavoritesUI({el,store,onChange,onUnavailable=()=>{},isActive=()=>true}){
  let onlyFavorites=false,disposed=false,keys=new Set();const buttons=new Map();
  const active=()=>!disposed&&isActive();
  const element=openingFavoritesFilter(el,0,()=>{if(!active()||element.isConnected===false)return;onlyFavorites=!onlyFavorites;onChange()});
  return {
    element,
    onlyFavorites:()=>onlyFavorites,
    update(rows){
      const identities=store.keys(rows.map(row=>row.body)),saved=store.snapshot();keys=new Set(identities.filter(Boolean));buttons.clear();
      const result=rows.map((row,i)=>({...row,favoriteKey:identities[i],favorite:saved.has(identities[i])}));
      element.textContent=`${onlyFavorites?'★':'☆'} 只看收藏 · ${result.filter(row=>row.favorite).length}`;element.setAttribute('aria-pressed',String(onlyFavorites));return result;
    },
    button(row){
      let button;button=openingFavoriteButton(el,{key:row.favoriteKey,title:row.title,selected:row.favorite,onToggle:()=>{
        if(!active()||button.isConnected===false||!keys.has(row.favoriteKey))return;
        const result=store.toggle(row.favoriteKey);if(!result.persisted)onUnavailable();onChange();
        const target=buttons.get(row.favoriteKey)||element;try{if(target.isConnected!==false)target.focus()}catch{}
      }});button.disabled=!row.favoriteKey;buttons.set(row.favoriteKey,button);return button;
    },
    dispose(){if(disposed)return;disposed=true;buttons.clear();keys.clear();element.remove()},
  };
}
