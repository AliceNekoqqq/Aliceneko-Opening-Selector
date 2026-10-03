import {RUNTIME_VERSION} from './version.js';
import {createThemeBackgroundService} from './theme-backgrounds.js';
import {mountPlayerSelector} from './player.js';
import {mountAuthorSelector} from './author.js';

export const OPENING_SELECTOR_VERSION=RUNTIME_VERSION;
export function mountUniversalSelector(startDocument=document,helperApi=null){
  const doc=startDocument?.nodeType===9?startDocument:document;
  const helper=helperApi||globalThis.TavernHelper||(typeof globalThis.getChatMessages==='function'?globalThis:null);
  doc.__uosBackgroundAssets?.close();
  const backgroundService=createThemeBackgroundService(doc.defaultView||globalThis);
  doc.__uosBackgroundAssets=backgroundService;
  // Start all sixteen images now, without making the interface wait for them.
  void backgroundService.preload();
  const onPageHide=()=>{
    backgroundService.close();globalThis.removeEventListener?.('pagehide',onPageHide);
    if(doc.__uosBackgroundAssets===backgroundService)delete doc.__uosBackgroundAssets;
  };
  backgroundService.onClose=()=>globalThis.removeEventListener?.('pagehide',onPageHide);
  globalThis.addEventListener?.('pagehide',onPageHide);
  mountPlayerSelector(doc,helper,{backgroundService});
  mountAuthorSelector(doc,helper,{showSetupHints:true,backgroundService});
  return {player:doc.__uosPlayer,author:doc.__uosAuthor};
}

