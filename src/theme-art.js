import {themeAssetCandidates} from './asset-source.js';

const artUrl=path=>themeAssetCandidates(`assets/${path}.webp`)[0];
// Shared explicit image interfaces, independent of author markup or CSS parsing.
export const THEME_ART=Object.freeze({
  mascot:artUrl('brand/mascot'),
  welcome:artUrl('brand/welcome'),
  search:artUrl('brand/search'),
  icons:artUrl('theme-icons'),
  schoolIcon:artUrl('theme-icon-school'),
  schoolOrnament:artUrl('theme-ornament-school'),
  ornaments:artUrl('theme-ornaments'),
  openings:artUrl('tab-openings'),
  worldbooks:artUrl('tab-worldbooks'),
  bgm:artUrl('tab-bgm'),
  diagnostics:artUrl('tab-diagnostics'),
  updates:artUrl('tab-updates'),
});
