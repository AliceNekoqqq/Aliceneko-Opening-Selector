// All theme artwork already exists at this published immutable commit.
export const THEME_ASSET_REF='444518cc8d97befd6016e7b948066ef23fd4e560';
export const SCHOOL_THEME_ASSET_REF='b11e5addc6e1e60dae710ed4d83cb4c8565b77ea';
export const DEFAULT_COVER_ASSET_REF='9f2160b3d289e27390d73b5cea8450cf821b61d1';
export const BLIND_BOX_ASSET_REF='f2af3337a5a02827ce1634f1551ed93b8ef8bde9';
import {THEME_IDS} from './themes.js';
export const BLIND_BOX_THEME_ASSET_REF='8e9d83f98e004db4bcb524046d1760ba11b8bc4b';
export function themeAssetRef(path){
  if(/^assets\/(?:theme-(?:background|icon|ornament)-school|default-covers\/school-[1-5]|blind-box\/card-backs\/school)\.webp$/.test(path))return SCHOOL_THEME_ASSET_REF;
  if(path.startsWith('assets/default-covers/'))return DEFAULT_COVER_ASSET_REF;
  if(path.startsWith('assets/blind-box/card-backs/'))return BLIND_BOX_THEME_ASSET_REF;
  return THEME_ASSET_REF;
}
export function blindBoxAssetCandidates(kind,theme){
  if(!['entrance','card-back'].includes(kind))throw Error('Invalid blind-box artwork');
  if(kind==='card-back'&&theme){
    const id=THEME_IDS.includes(theme)?theme:'archive',path=`assets/blind-box/card-backs/${id}.webp`;
    return themeAssetCandidates(path);
  }
  const resource=`AliceNekoqqq/Aliceneko-Opening-Selector@${BLIND_BOX_ASSET_REF}/assets/blind-box/${kind}.webp`;
  return [`https://cdn.jsdelivr.net/gh/${resource}`,`https://testingcf.jsdelivr.net/gh/${resource}`,
    `https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/${BLIND_BOX_ASSET_REF}/assets/blind-box/${kind}.webp`];
}
export function themeAssetCandidates(path){
  if(!/^assets\/[a-z0-9/-]+\.webp$/.test(path))throw Error('Invalid theme asset path');
  const ref=themeAssetRef(path),resource=`AliceNekoqqq/Aliceneko-Opening-Selector@${ref}/${path}`;
  return [`https://cdn.jsdelivr.net/gh/${resource}`,`https://testingcf.jsdelivr.net/gh/${resource}`,
    `https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/${ref}/${path}`];
}
