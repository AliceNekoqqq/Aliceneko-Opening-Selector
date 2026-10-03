/* Default illustrations stay outside character data and the bundled runtime. */
const DEFAULT_COVER_REF = '9f2160b3d289e27390d73b5cea8450cf821b61d1';
const DEFAULT_COVER_THEMES = ['archive','neon','paper','noir','meadow','ancient','starmap','rose','wasteland','deepsea','amber','theatre','lasttrain','aurora','glasshouse','japan'];
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
  const base = `https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${DEFAULT_COVER_REF}/assets/default-covers`;
  return DEFAULT_COVER_THEMES.map(theme => `${selector}[data-theme="${theme}"]{${Array.from({length:5},(_,i)=>`--uos-default-cover-${i+1}:url("${base}/${theme}-${i+1}.webp")`).join(';')}}`).join('\n');
}
