import {openingFavoriteKeys} from './opening-favorites.js';
import {blindBoxPool} from './opening-blind-draw.js';

const validKey=key=>typeof key==='string'&&/^[0-9a-f]{16}:\d{1,10}:\d{1,10}$/.test(key);
export function normalizeDrawRange(value){
  return {mode:value?.mode==='manual'?'manual':'filtered',keys:Array.isArray(value?.keys)?[...new Set(value.keys.filter(validKey))].slice(0,5000):[]};
}
export function keyedDrawItems(items){
  const keys=openingFavoriteKeys(items.map(item=>item.body));return items.map((item,i)=>({...item,drawKey:keys[i]}));
}
export function drawRangePool(all,filtered,prefs){
  if(prefs.mode!=='manual')return blindBoxPool(filtered);
  const selected=new Set(prefs.keys);return blindBoxPool(keyedDrawItems(all).filter(item=>selected.has(item.drawKey)));
}
export function createOpeningDrawRange(host,avatar){
  const key=avatar?'uos_draw_range_v1_'+encodeURIComponent(avatar):null;let memory=normalizeDrawRange(),temporary=false;
  return {
    read(){if(!temporary)try{const raw=key&&host?.localStorage?.getItem(key);if(raw!=null){const value=JSON.parse(raw);memory=normalizeDrawRange(value?.version===1?value:null)}}catch{}return {mode:memory.mode,keys:memory.keys.slice()}},
    set(value){memory=normalizeDrawRange(value);let persisted=false;try{if(key&&host?.localStorage){host.localStorage.setItem(key,JSON.stringify({version:1,...memory}));persisted=true}}catch{}temporary=!persisted;return {persisted,prefs:this.read()}},
  };
}
