import {BLIND_BOX_CONTROL_CSS} from '../../src/opening-blind-box-styles.js';
import {OPENING_FAVORITES_CSS} from '../../src/opening-favorites-styles.js';
import {THEME_BACKGROUND_IMAGES} from '../../src/theme-backgrounds.js';
import fs from 'node:fs';
import {THEME_ART} from '../../src/theme-art.js';
import {OPENING_LAYOUT_CSS} from '../../src/opening-layout-styles.js';
import {OPENING_CATEGORY_CSS} from '../../src/opening-category-styles.js';
import {OPENING_ACTION_CSS} from '../../src/opening-action-styles.js';
import {BRAND_CSS} from '../../src/brand-mark.js';
export function buildAuthorCss(){
const themeBackgrounds=THEME_BACKGROUND_IMAGES;
const tabArt=Object.fromEntries(['openings','worldbooks','bgm','diagnostics','updates'].map(id=>[id,THEME_ART[id]]));
const replacements={__THEME_ORNAMENT_SPRITE__:THEME_ART.ornaments,__THEME_ICON_SPRITE__:THEME_ART.icons,__THEME_ICON_SCHOOL__:THEME_ART.schoolIcon,__THEME_ORNAMENT_SCHOOL__:THEME_ART.schoolOrnament};
for(const [id,url] of Object.entries(themeBackgrounds))replacements[`__THEME_BG_${id.toUpperCase()}__`]=url;
for(const [id,url] of Object.entries(tabArt))replacements[`__TAB_${id.toUpperCase()}__`]=url;
const css=fs.readFileSync(new URL('../../src/selector.css',import.meta.url),'utf8')
  .replace(/__(?:THEME_[A-Z_]+|TAB_[A-Z_]+)__/g,token=>{
    if(!(token in replacements))throw Error(`Missing author CSS asset: ${token}`);
    return replacements[token];
  })
  .replace(/<\/style/gi,'<\\/style');
return css+'\n'+OPENING_LAYOUT_CSS+'\n'+OPENING_CATEGORY_CSS+'\n'+OPENING_ACTION_CSS+'\n'+OPENING_FAVORITES_CSS+'\n'+BLIND_BOX_CONTROL_CSS+'\n'+BRAND_CSS;
}
