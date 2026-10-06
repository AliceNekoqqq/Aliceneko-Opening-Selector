import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bindBrandImages,brandMarkMarkup,mascotNoteMarkup} from '../src/brand-mark.js';
import {themeAssetCandidates,BRAND_ASSET_REF} from '../src/asset-source.js';
import {THEME_IDS} from '../src/themes.js';
import {THEME_MASCOT_POSITIONS,BRAND_CSS} from '../src/brand-mark.js';

test('the masthead and scene notes share the theme-aware mascot sprite',()=>{
  const urls=themeAssetCandidates('assets/brand/theme-mascots.webp');
  assert.equal(urls.length,3);assert.ok(urls.every(url=>url.includes(BRAND_ASSET_REF)));
  assert.match(brandMarkMarkup(),/uos-brand-avatar/);
  for(const kind of ['welcome','search']){
    const markup=mascotNoteMarkup(kind,'scene copy');
    assert.match(markup,/uos-mascot-note-avatar/);assert.match(markup,/scene copy/);
    assert.doesNotMatch(markup,/assets\/brand\/(?:welcome|search)\.webp/);
  }
  assert.match(BRAND_CSS,/\.uos-mascot-note-avatar\{[^}]*background-image:var\(--uos-theme-mascot-image/);
  assert.match(BRAND_CSS,/\.uos-search-empty\.uos-mascot-note::before\{display:none\}/);
});

test('every theme maps to its ordered sprite cell and shared branding CSS',()=>{
  assert.equal(Object.keys(THEME_MASCOT_POSITIONS).length,THEME_IDS.length);
  THEME_IDS.forEach((id,index)=>{
    assert.equal(THEME_MASCOT_POSITIONS[id],`${index%4/3*100}% ${Math.floor(index/4)/4*100}%`);
    assert.ok(BRAND_CSS.includes(`data-theme="${id}"`),id);
    assert.ok(BRAND_CSS.includes(`.uos-user-trigger[data-theme="${id}"] .uos-brand-avatar,.uos[data-theme="${id}"] .uos-mascot-note-avatar`),id);
    assert.ok(BRAND_CSS.includes(`.uos[data-theme="${id}"] .uos-mascot-note-avatar`),id);
  });
  assert.equal(themeAssetCandidates('assets/brand/theme-mascots.webp')[0].includes(BRAND_ASSET_REF),true);
});

test('theme sprite loader retries sources and removes its late callbacks',()=>{
  const urls=themeAssetCandidates('assets/brand/theme-mascots.webp');let appended,removed=false,cssImage='';
  const loader={dataset:{},remove(){removed=true}};
  Object.defineProperty(loader,'src',{get(){return this._src},set(value){this._src=value}});
  const root={isConnected:true,querySelectorAll(){return []},append(node){appended=node},ownerDocument:{createElement(){return loader}},style:{setProperty(_key,value){cssImage=value},removeProperty(){cssImage=''}}};
  const stop=bindBrandImages(root);assert.equal(appended,loader);assert.equal(loader.src,urls[0]);
  loader.onerror();assert.equal(loader.src,urls[1]);loader.onerror();assert.equal(loader.src,urls[2]);
  loader.onload();assert.ok(cssImage.includes(urls[2]));
  const late=loader.onload;stop();assert.equal(removed,true);assert.equal(loader.onload,null);late();assert.equal(cssImage,'');
});
