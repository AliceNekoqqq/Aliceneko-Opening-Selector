import {THEME_IDS} from './themes.js';

import {THEME_ASSET_REF,themeAssetCandidates} from './asset-source.js';
export const THEME_BACKGROUND_REF=THEME_ASSET_REF;
export const REMASTERED_BACKGROUND_IDS=THEME_IDS;
export function themeBackgroundCandidates(theme){
  return THEME_IDS.includes(theme)?themeAssetCandidates(`assets/theme-background-${theme}.webp`):[];
}
export const THEME_BACKGROUND_IMAGES=Object.freeze(Object.fromEntries(THEME_IDS.map(id=>[id,themeBackgroundCandidates(id)[0]])));
// Shared by preload and both UI modes. One request per theme per running script.
export function createThemeBackgroundService(view,{timeoutMs=5000}={}){
  const loaded=new Map(),pending=new Map();let closed=false;
  function probe(url,job){
    return new Promise(resolve=>{
      let image,timer,settled=false;
      const finish=ok=>{
        if(settled)return;settled=true;
        view.clearTimeout(timer);if(image){image.onload=null;image.onerror=null;if(!ok)try{image.src=''}catch{}}
        job.cancel=null;resolve(ok);
      };
      job.cancel=()=>finish(false);
      try{
        image=new view.Image();image.onload=()=>finish(true);image.onerror=()=>finish(false);
        timer=view.setTimeout(()=>finish(false),timeoutMs);image.src=url;
      }catch{finish(false)}
    });
  }
  const api={
    cached:theme=>loaded.get(theme),
    load(theme){
      if(closed)return Promise.resolve(null);
      if(loaded.has(theme))return Promise.resolve(loaded.get(theme));
      if(pending.has(theme))return pending.get(theme).task;
      const candidates=themeBackgroundCandidates(theme);
      if(typeof view?.Image!=='function')return Promise.resolve(candidates[0]||null);
      const job={aborted:false,cancel:null,task:null};
      job.task=(async()=>{
        for(const url of candidates){
          const ok=await probe(url,job);
          if(closed||job.aborted)return null;
          if(ok){loaded.set(theme,url);return url;}
        }
        return null;
      })().finally(()=>{if(pending.get(theme)===job)pending.delete(theme)});
      pending.set(theme,job);return job.task;
    },
    preload(){return Promise.allSettled(THEME_IDS.map(theme=>api.load(theme)));},
    cancel(theme){const job=pending.get(theme);if(job){job.aborted=true;job.cancel?.();}},
    close(){if(closed)return;closed=true;for(const theme of pending.keys())api.cancel(theme);api.onClose?.();},
  };
  return api;
}

export function createThemeBackgroundController(element,property,view,{timeoutMs=5000,service=null}={}){
  const ownsService=!service;service ||= createThemeBackgroundService(view,{timeoutMs});
  let sequence=0,closed=false,previousTheme=null;
  const write=url=>element.style.setProperty(property,url?`url("${url}")`:'none');
  const usesLayout=property==='--uos-theme-bg-active'||property==='--uos-user-background';
  let observer=null;const observedHeaders=new Set();
  function fitScene(){
    if(closed||!usesLayout||!REMASTERED_BACKGROUND_IDS.includes(previousTheme))return;
    const header=element.querySelector?.('.uos-masthead'),tools=element.querySelector?.('.uos-user-tools');
    const endpoint=header||tools||element.querySelector?.('.uos-user-head');
    if(!endpoint||!element.getBoundingClientRect)return;
    if(observer&&!observedHeaders.has(endpoint)){observedHeaders.add(endpoint);observer.observe(endpoint);}
    const extent=endpoint.getBoundingClientRect().bottom-element.getBoundingClientRect().top+(element.scrollTop||0);
    element.style.setProperty('--uos-scene-height',`${Math.ceil(Math.max(420,extent+150))}px`);
  }
  if(usesLayout&&typeof view?.ResizeObserver==='function'){
    observer=new view.ResizeObserver(fitScene);observer.observe(element);
    // Author headers already exist; player headers are appended after controller creation.
    const header=element.querySelector?.('.uos-masthead');if(header)observer.observe(header);
  }
  if(usesLayout)view?.addEventListener?.('resize',fitScene);

  return {
    async setTheme(theme){
      if(closed)return null;
      const request=++sequence;
      if(ownsService&&previousTheme!==theme)service.cancel(previousTheme);
      previousTheme=theme;
      if(usesLayout)element.setAttribute?.('data-background-generation',REMASTERED_BACKGROUND_IDS.includes(theme)?'2':'1');
      fitScene();
      write(service.cached(theme)||themeBackgroundCandidates(theme)[0]);
      const url=await service.load(theme);
      if(closed||request!==sequence)return null;
      write(url);fitScene();return url;
    },
    close(){closed=true;++sequence;observer?.disconnect();if(usesLayout)view?.removeEventListener?.('resize',fitScene);if(ownsService)service.close();},
  };
}
