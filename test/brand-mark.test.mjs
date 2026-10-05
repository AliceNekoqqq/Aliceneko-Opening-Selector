import {test} from 'node:test';
import assert from 'node:assert/strict';
import {bindMascotImage} from '../src/brand-mark.js';
import {themeAssetCandidates,BRAND_ASSET_REF} from '../src/asset-source.js';

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
