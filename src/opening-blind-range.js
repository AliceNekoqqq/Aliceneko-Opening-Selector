import {openingFavoriteKeys} from './opening-favorites.js';
import {blindBoxPool} from './opening-blind-draw.js';

const validKey=key=>typeof key==='string'&&/^[0-9a-f]{16}:\d{1,10}:\d{1,10}$/.test(key);
const cleanKeys=value=>Array.isArray(value)?[...new Set(value.filter(validKey))].slice(0,5000):[];
export const DRAW_POOL_LIMIT=30;
export const drawPoolName=value=>typeof value==='string'?value.trim().slice(0,40):'';
export function drawRangeLabel(prefs){return prefs.mode==='manual'?(prefs.pools?.find(pool=>pool.id===prefs.activePoolId)?.name||'手动范围'):'当前筛选'}
export function normalizeDrawRange(value){
  const pools=[],seen=new Set();
  for(const pool of Array.isArray(value?.pools)?value.pools:[]){
    if(typeof pool?.id!=='string'||!/^[a-zA-Z0-9_-]{1,80}$/.test(pool.id)||seen.has(pool.id)||!drawPoolName(pool.name))continue;
    pools.push({id:pool.id,name:drawPoolName(pool.name),keys:cleanKeys(pool.keys)});seen.add(pool.id);if(pools.length===DRAW_POOL_LIMIT)break;
  }
  const keys=cleanKeys(value?.keys),mode=value?.mode==='manual'?'manual':'filtered',selected=pools.find(pool=>pool.id===value?.activePoolId);
  const keySet=new Set(keys),matches=selected&&selected.keys.length===keys.length&&selected.keys.every(key=>keySet.has(key));
  return {enabled:value?.enabled!==false,mode,keys,handSize:Number(value?.handSize)===5?5:3,performances:value?.performances!==false,pools,activePoolId:mode==='manual'&&matches?selected.id:null};
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
    read(){if(!temporary)try{const raw=key&&host?.localStorage?.getItem(key);if(raw!=null){const value=JSON.parse(raw);memory=normalizeDrawRange(value?.version===1?value:null)}}catch{}return normalizeDrawRange(memory)},
    set(value){memory=normalizeDrawRange(value);let persisted=false;try{if(key&&host?.localStorage){host.localStorage.setItem(key,JSON.stringify({version:1,...memory}));persisted=true}}catch{}temporary=!persisted;return {persisted,prefs:this.read()}},
  };
}
