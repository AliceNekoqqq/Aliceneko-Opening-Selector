import {blindBoxAssetCandidates} from './asset-source.js';

// Decorative images never gate the draw; CSS keeps the star visible while loading.
export function createBlindBoxArt(el,kind,theme){
  const image=el('img','uos-blind-art'),sources=blindBoxAssetCandidates(kind,theme);let source=0;
  image.alt='';image.draggable=false;image.decoding='async';image.loading='eager';
  image.setAttribute('aria-hidden','true');
  image.onload=()=>{if(image.isConnected===false)return;image.dataset.ready='true';if(image.parentElement)image.parentElement.dataset.artReady='true'};
  image.onerror=()=>{
    if(image.isConnected===false)return;
    if(++source<sources.length)image.src=sources[source];
    else{image.dataset.failed='true';image.onload=image.onerror=null}
  };
  image.src=sources[0];return image;
}
