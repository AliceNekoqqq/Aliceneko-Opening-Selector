// All theme artwork already exists at this published immutable commit.
export const THEME_ASSET_REF='444518cc8d97befd6016e7b948066ef23fd4e560';
export const BLIND_BOX_ASSET_REF='f2af3337a5a02827ce1634f1551ed93b8ef8bde9';
export function blindBoxAssetCandidates(kind){
  if(!['entrance','card-back'].includes(kind))throw Error('Invalid blind-box artwork');
  const resource=`AliceNekoqqq/Aliceneko-Opening-Selector@${BLIND_BOX_ASSET_REF}/assets/blind-box/${kind}.webp`;
  return [`https://cdn.jsdelivr.net/gh/${resource}`,`https://testingcf.jsdelivr.net/gh/${resource}`,
    `https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/${BLIND_BOX_ASSET_REF}/assets/blind-box/${kind}.webp`];
}
export function themeAssetCandidates(path){
  if(!/^assets\/[a-z0-9/-]+\.webp$/.test(path))throw Error('Invalid theme asset path');
  const resource=`AliceNekoqqq/Aliceneko-Opening-Selector@${THEME_ASSET_REF}/${path}`;
  return [`https://cdn.jsdelivr.net/gh/${resource}`,`https://testingcf.jsdelivr.net/gh/${resource}`,
    `https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/${THEME_ASSET_REF}/${path}`];
}
