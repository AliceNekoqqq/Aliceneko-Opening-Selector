// Serialized into the import script; all dependencies are passed as config.
export async function confirmedLoader({fallbackRef,pointerUrls,versionPattern,channel}){
  const doc=globalThis.$?.('body')?.[0]?.ownerDocument||document;
  const host=doc.defaultView||globalThis;
  const key='uos-approved-runtime-'+channel;
  const valid=ref=>/^[a-f0-9]{40}$/.test(ref);
  const notify=(message,error=false)=>{const toast=globalThis.toastr||host.toastr;if(toast?.[error?'error':'info'])toast[error?'error':'info'](message);else host.alert?.(message)};
  let ref=fallbackRef;
  try{const saved=JSON.parse(host.localStorage.getItem(key));if(saved?.bootstrap===fallbackRef&&valid(saved.ref))ref=saved.ref}catch{}
  let currentVersion='',busy=false,closed=false;
  async function load(target){
    const urls=[`https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${target}/remote.js`,`https://testingcf.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${target}/remote.js`,`https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/${target}/remote.js`];
    const errors=[];
    for(const url of urls){try{const module=await import(url);if(!new RegExp('^'+versionPattern+'$').test(module.OPENING_SELECTOR_VERSION)||typeof module.mountUniversalSelector!=='function')throw Error('运行模块格式不兼容');return module}catch(error){errors.push(String(error?.message||error))}}
    throw Error(errors.join(' | '));
  }
  function mount(module){module.mountUniversalSelector(doc,globalThis.TavernHelper||(typeof globalThis.getChatMessages==='function'?globalThis:null));currentVersion=module.OPENING_SELECTOR_VERSION}
  try{mount(await load(ref))}catch(error){notify('红豆粉开场白选择器加载失败：'+error.message,true);return}
  doc.__uosUpdater?.close?.();
  const button=doc.createElement('button');button.type='button';button.textContent='检查更新';button.title='红豆粉开场白选择器 · '+currentVersion;
  button.style.cssText='position:fixed;right:12px;bottom:12px;z-index:2147483646;padding:6px 10px;border:1px solid #8d7b68;border-radius:6px;background:#25212b;color:#fff;font-size:12px;cursor:pointer;';
  doc.body.append(button);
  async function check(manual=false){
    if(busy||closed)return;busy=true;button.disabled=true;button.textContent='检查中…';
    try{
      let candidate;const errors=[];
      for(const url of pointerUrls){try{const response=await fetch(url,{cache:'no-store',credentials:'omit'});if(!response.ok)throw Error('HTTP '+response.status);candidate=(await response.text()).trim();if(!valid(candidate))throw Error('提交 SHA 格式错误');break}catch(error){candidate=null;errors.push(String(error?.message||error))}}
      if(closed)return;
      if(!candidate)throw Error(errors.join(' | '));
      if(candidate===ref){if(manual)notify('当前已是最新版本：v'+currentVersion);return}
      // Checking reads only the pointer. No new module is imported before consent.
      if(!host.confirm('红豆粉开场白选择器发现新版本（'+(channel==='preview'?'测试':'正式')+'通道）。\n当前版本：v'+currentVersion+'\n点击确定更新；取消将继续使用当前版本。'))return;
      const module=await load(candidate);if(closed)return;
      mount(module);ref=candidate;button.title='红豆粉开场白选择器 · '+currentVersion;
      try{host.localStorage.setItem(key,JSON.stringify({bootstrap:fallbackRef,ref}))}catch{notify('本次已更新，但无法保存版本选择；下次打开将使用导入脚本中的版本。',true);return}
      notify('已更新至 v'+currentVersion);
    }catch(error){if(!closed)notify('检查或更新失败，继续使用当前版本：'+error.message,true)}
    finally{busy=false;if(!closed){button.disabled=false;button.textContent='检查更新'}}
  }
  button.onclick=()=>check(true);
  const api={check,close(){closed=true;button.remove();globalThis.removeEventListener?.('pagehide',api.close);if(doc.__uosUpdater===api)delete doc.__uosUpdater}};
  doc.__uosUpdater=api;globalThis.addEventListener?.('pagehide',api.close);
  await check(false);
}
