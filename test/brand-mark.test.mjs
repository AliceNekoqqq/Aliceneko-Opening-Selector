import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bindMascotImage} from '../src/brand-mark.js';
import {themeAssetCandidates,BRAND_ASSET_REF} from '../src/asset-source.js';
import {THEME_IDS} from '../src/themes.js';
import {THEME_MASCOT_POSITIONS,BRAND_CSS} from '../src/brand-mark.js';

test('mascot variants use three immutable sources and release stale image callbacks',()=>{
  for(const kind of ['mascot','welcome','search']){
    const urls=themeAssetCandidates(`assets/brand/${kind}.webp`);
    assert.equal(urls.length,3);assert.ok(urls.every(url=>url.includes(BRAND_ASSET_REF)));
    const image={src:urls[0],isConnected:true};const stop=bindMascotImage(image,kind);
    image.onerror();assert.equal(image.src,urls[1]);image.onerror();assert.equal(image.src,urls[2]);
    const late=image.onerror;stop();assert.equal(image.onerror,null);late();assert.equal(image.src,urls[2]);
    const missing={isConnected:true};bindMascotImage(missing,kind);missing.onerror();missing.onerror();missing.onerror();assert.equal(missing.hidden,true);
  }
});

test('every theme maps to its ordered sprite cell and shared branding CSS',()=>{
  assert.equal(Object.keys(THEME_MASCOT_POSITIONS).length,THEME_IDS.length);
  THEME_IDS.forEach((id,index)=>{
    assert.equal(THEME_MASCOT_POSITIONS[id],`${index%4/3*100}% ${Math.floor(index/4)/4*100}%`);
    assert.ok(BRAND_CSS.includes(`data-theme="${id}"`),id);
    assert.ok(BRAND_CSS.includes(`.uos-user-trigger[data-theme="${id}"] .uos-brand-avatar{--uos-mascot-position:${THEME_MASCOT_POSITIONS[id]}}`),id);
  });
  assert.equal(themeAssetCandidates('assets/brand/theme-mascots.webp')[0].includes(BRAND_ASSET_REF),true);
});
