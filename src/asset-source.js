// All theme artwork already exists at this published immutable commit.
export const THEME_ASSET_REF='444518cc8d97befd6016e7b948066ef23fd4e560';
export function themeAssetCandidates(path){
  if(!/^assets\/[a-z0-9/-]+\.webp$/.test(path))throw Error('Invalid theme asset path');
  const resource=`AliceNekoqqq/Aliceneko-Opening-Selector@${THEME_ASSET_REF}/${path}`;
  return [`https://cdn.jsdelivr.net/gh/${resource}`,`https://testingcf.jsdelivr.net/gh/${resource}`,
    `https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/${THEME_ASSET_REF}/${path}`];
}
