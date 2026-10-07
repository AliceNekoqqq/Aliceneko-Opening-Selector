import {normalizeBrandVisibility} from './brand-visibility.js';

const STORAGE_PREFIX='uos_player_brand_visibility_v1_';

export function createPlayerBrandVisibilityPreference(host,avatar,defaults={}){
  const fallback=normalizeBrandVisibility(defaults),key=STORAGE_PREFIX+String(avatar||'current');
  let value={...fallback};
  try{
    const saved=JSON.parse(host?.localStorage?.getItem(key)||'null');
    if(saved&&typeof saved==='object'&&!Array.isArray(saved))value=normalizeBrandVisibility({...fallback,...saved});
  }catch{}
  return {
    get(){return {...value}},
    set(next){
      value=normalizeBrandVisibility(next);
      try{host.localStorage.setItem(key,JSON.stringify(value));return {value:{...value},saved:true}}
      catch{return {value:{...value},saved:false}}
    },
  };
}
