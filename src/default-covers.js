import {THEME_IDS} from './themes.js';
import {themeAssetCandidates} from './asset-source.js';
/* Default illustrations stay outside character data and the bundled runtime. */
let temporaryCoverSeed;
export function defaultCoverSlot(identity, index, host) {
  let seed;
  try {
    const storage = host?.localStorage;
    seed = storage?.getItem('uos_default_cover_seed_v1');
    if (!seed) {
      seed = storage ? String(Math.random()) : (temporaryCoverSeed ||= String(Math.random()));
      storage?.setItem('uos_default_cover_seed_v1', seed);
    }
  } catch { seed = temporaryCoverSeed ||= seed || String(Math.random()); }
  seed ||= temporaryCoverSeed ||= String(Math.random());
  let hash = 2166136261;
  for (const character of `${seed}|${identity}|${index}`) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return (hash >>> 0) % 5 + 1;
}
export function defaultCoverStyles(selector) {
  return THEME_IDS.map(theme => `${selector}[data-theme="${theme}"]{${Array.from({length:5},(_,i)=>`--uos-default-cover-${i+1}:url("${themeAssetCandidates(`assets/default-covers/${theme}-${i+1}.webp`)[0]}")`).join(';')}}`).join('\n');
}
