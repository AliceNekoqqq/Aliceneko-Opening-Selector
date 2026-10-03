import {themeAssetCandidates} from './asset-source.js';

const artUrl=path=>themeAssetCandidates(`assets/${path}.webp`)[0];
// Shared explicit image interfaces, independent of author markup or CSS parsing.
export const THEME_ART=Object.freeze({
  icons:artUrl('theme-icons'),
  ornaments:artUrl('theme-ornaments'),
  openings:artUrl('tab-openings'),
  worldbooks:artUrl('tab-worldbooks'),
  bgm:artUrl('tab-bgm'),
  diagnostics:artUrl('tab-diagnostics'),
  updates:artUrl('tab-updates'),
});

