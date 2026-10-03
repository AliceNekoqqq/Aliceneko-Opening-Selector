// Serialized into the import script; all dependencies are passed as config.
export async function confirmedLoader({fallbackRef,pointerUrls,versionPattern,channel}){
  let doc=globalThis.$?.('body')?.[0]?.ownerDocument||document;
  let win=doc.defaultView;
  // Tavern scripts run inside a hidden iframe; use the visible host document.
  try{for(let i=0;i<8&&win?.parent&&win.parent!==win;i++){void win.parent.document;win=win.parent;doc=win.document}}catch{}
  const host=doc.defaultView||globalThis;
  const key='uos-approved-runtime-'+channel;
  const autoCheckKey='uos-auto-check-'+channel;
  const dismissedKey='uos-dismissed-update-'+channel;
  const valid=ref=>/^[a-f0-9]{40}$/.test(ref);
  let statusMessage='',cancelPrompt=null;
  const notify=(message,error=false)=>{statusMessage=message;const toast=globalThis.toastr||host.toastr;if(toast?.[error?'error':'info'])toast[error?'error':'info'](message);else console[error?'warn':'info']('[红豆粉开场白选择器] '+message)};
  async function fetchText(url){
    const Controller=globalThis.AbortController||host.AbortController,controller=Controller?new Controller():null;
    let timer;
    try{return await Promise.race([
      (async()=>{const response=await fetch(url,{cache:'no-store',credentials:'omit',...(controller?{signal:controller.signal}:{})});if(!response.ok)throw Error('HTTP '+response.status);return response.text()})(),
      new Promise((_,reject)=>{timer=host.setTimeout(()=>{reject(Error('请求超时'));controller?.abort()},12000)})
    ])}finally{host.clearTimeout(timer)}
  }
  function confirmUpdate(notes){
    return new Promise(resolve=>{
      const previous=doc.activeElement,dialog=doc.createElement('dialog'),style=doc.createElement('style');
      dialog.setAttribute('data-uos-update-dialog','');dialog.setAttribute('aria-labelledby','uos-update-title');
      dialog.style.cssText='box-sizing:border-box;width:min(560px,calc(100vw - 24px));max-height:calc(100vh - 32px);padding:24px;border:1px solid #71667d;border-radius:18px;background:#201e27;color:#f3eef7;font:14px/1.6 system-ui,sans-serif;box-shadow:0 18px 60px #0008;overflow:auto;z-index:2147483647';
      style.textContent='[data-uos-update-dialog]::backdrop{background:#0006}[data-uos-update-dialog] button{font:inherit;cursor:pointer;min-height:40px;padding:8px 16px;border:1px solid #817489;border-radius:10px;background:#37303f;color:#fff}[data-uos-update-dialog] button:last-child{background:#655277}';
      const title=doc.createElement('h2');title.id='uos-update-title';title.textContent='发现新版本';title.style.cssText='margin:0 0 8px;font-size:20px;color:inherit';
      const versions=doc.createElement('p');versions.textContent=`${channel==='preview'?'测试':'正式'}通道 · v${currentVersion} → v${notes.version}`;
      const content=doc.createElement('div');content.setAttribute('data-uos-update-notes','');content.textContent=notes.content;content.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;max-height:50vh;overflow:auto;padding:14px;border-radius:10px;background:#ffffff08';
      const hint=doc.createElement('p');hint.textContent='确认后下载并切换新版；取消则保留当前版本。';
      const actions=doc.createElement('div');actions.style.cssText='display:flex;justify-content:flex-end;gap:10px';
      const cancel=doc.createElement('button'),accept=doc.createElement('button');cancel.type=accept.type='button';cancel.textContent='暂不更新';accept.textContent='更新到 v'+notes.version;
      let settled=false;
      const finish=value=>{if(settled)return;settled=true;cancelPrompt=null;dialog.remove();style.remove();try{previous?.focus?.()}catch{}resolve(value)};
      cancelPrompt=()=>finish(null);cancel.onclick=()=>finish(false);accept.onclick=()=>finish(true);
      dialog.addEventListener('cancel',event=>{event.preventDefault();finish(false)});
      dialog.addEventListener('keydown',event=>{
        if(event.key==='Escape'){event.preventDefault();event.stopPropagation();finish(false)}
        else if(event.key==='Tab'){event.preventDefault();(doc.activeElement===cancel?accept:cancel).focus()}
      });
      actions.append(cancel,accept);dialog.append(title,versions,content,hint,actions);(doc.head||doc.body).append(style);doc.body.append(dialog);
      try{dialog.showModal()}catch{
        // Older WebViews may lack showModal. Stay inside an existing modal's top layer.
        const parent=doc.querySelector('dialog[open]:not([data-uos-update-dialog])')||doc.body;parent.append(dialog);dialog.setAttribute('open','');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
        dialog.style.cssText+=';display:block;position:fixed;inset:0;margin:auto;height:fit-content';
      }
      cancel.focus();
    });
  }
  let ref=fallbackRef;
  try{const saved=JSON.parse(host.localStorage.getItem(key));if(saved?.bootstrap===fallbackRef&&valid(saved.ref))ref=saved.ref}catch{}
  let autoCheckEnabled=true,dismissedRef='';
  try{autoCheckEnabled=host.localStorage.getItem(autoCheckKey)!=='false'}catch{}
  try{dismissedRef=host.localStorage.getItem(dismissedKey)||''}catch{}
  let currentVersion='',busy=false,closed=false,hasUpdate=false;
  async function load(target){
    const urls=[`https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${target}/remote.js`,`https://testingcf.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${target}/remote.js`,`https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/${target}/remote.js`];
    const errors=[];
    for(const url of urls){try{const module=await import(url);if(!new RegExp('^'+versionPattern+'$').test(module.OPENING_SELECTOR_VERSION)||typeof module.mountUniversalSelector!=='function')throw Error('运行模块格式不兼容');return module}catch(error){errors.push(String(error?.message||error))}}
    throw Error(errors.join(' | '));
  }
  function mount(module){module.mountUniversalSelector(doc,globalThis.TavernHelper||(typeof globalThis.getChatMessages==='function'?globalThis:null));currentVersion=module.OPENING_SELECTOR_VERSION}
  function compareVersion(a,b){
    const parse=value=>{const m=/^(\d+)\.(\d+)\.(\d+)(?:-beta\.(\d+))?$/.exec(String(value||''));return m?{core:m.slice(1,4).map(Number),beta:m[4]==null?null:Number(m[4])}:null};
    const left=parse(a),right=parse(b);if(!left||!right)return NaN;
    for(let i=0;i<3;i++)if(left.core[i]!==right.core[i])return left.core[i]-right.core[i];
    if(left.beta===right.beta)return 0;if(left.beta===null)return 1;if(right.beta===null)return -1;return left.beta-right.beta;
  }
  function parseReleaseNotes(source){
    const sections=[];let section=null;
    for(const line of String(source||'').split(/\r?\n/)){
      const header=/^##\s+v?(\d+\.\d+\.\d+(?:-beta\.\d+)?)\s*$/.exec(line.trim());
      if(header){section={version:header[1],items:[]};sections.push(section);continue}
      if(!section)continue;
      const item=/^\s*[-*]\s+(.+?)\s*$/.exec(line);if(item)section.items.push(item[1]);
    }
    return sections.filter(entry=>channel==='preview'?entry.version.includes('-beta.'):!entry.version.includes('-beta.'));
  }
  async function fetchReleaseNotes(candidate){
    const urls=[`https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${candidate}/CHANGELOG.md`,`https://testingcf.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@${candidate}/CHANGELOG.md`,`https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/${candidate}/CHANGELOG.md`];
    const errors=[];
    for(const url of urls){try{
      const sections=parseReleaseNotes(await fetchText(url)).filter(entry=>compareVersion(entry.version,currentVersion)>0).sort((a,b)=>compareVersion(a.version,b.version));
      if(!sections.length)throw Error('没有找到高于当前版本的更新说明');
      const releaseVersion=sections.at(-1).version;
      const content=sections.map(entry=>`【v${entry.version}】\n${entry.items.length?entry.items.map(item=>'• '+item).join('\n'):'本版本没有单独列出的更新内容。'}`).join('\n\n');
      return {version:releaseVersion,content};
    }catch(error){errors.push(String(error?.message||error))}}
    throw Error('无法读取更新说明：'+errors.join(' | '));
  }
  try{mount(await load(ref))}catch(error){notify('红豆粉开场白选择器加载失败：'+error.message,true);return}
  doc.__uosUpdater?.close?.();
  const api={
    check,
    get hasUpdate(){return hasUpdate},
    get busy(){return busy},
    get currentVersion(){return currentVersion},
    get autoCheckEnabled(){return autoCheckEnabled},
    get statusMessage(){return statusMessage},
    setAutoCheckEnabled(value){
      autoCheckEnabled=Boolean(value);
      try{host.localStorage.setItem(autoCheckKey,String(autoCheckEnabled));return true}catch{return false}
    },
    close(){closed=true;cancelPrompt?.();globalThis.removeEventListener?.('pagehide',api.close);if(doc.__uosUpdater===api)delete doc.__uosUpdater}
  };
  doc.__uosUpdater=api;
  globalThis.addEventListener?.('pagehide',api.close,{once:true});
  async function check(manual=false){
    if(busy||closed)return;busy=true;statusMessage='正在检查新版本…';
    try{
      let candidate;const errors=[];
      for(const url of pointerUrls){try{candidate=(await fetchText(url)).trim();if(!valid(candidate))throw Error('提交 SHA 格式错误');break}catch(error){candidate=null;errors.push(String(error?.message||error))}}
      if(closed)return;
      if(!candidate)throw Error(errors.join(' | '));
      hasUpdate=candidate!==ref;
      if(!hasUpdate){dismissedRef='';try{host.localStorage.removeItem(dismissedKey)}catch{}statusMessage='当前已是最新版本：v'+currentVersion;if(manual)notify(statusMessage);return}
      if(!manual&&dismissedRef===candidate){statusMessage='有新版本，可手动查看更新说明。';return}
      statusMessage='正在读取更新说明…';
      const notes=await fetchReleaseNotes(candidate);if(closed)return;
      statusMessage='请在更新窗口查看说明并选择是否更新。';
      const accepted=await confirmUpdate(notes);if(closed||accepted===null)return;
      if(!accepted){
        dismissedRef=candidate;try{host.localStorage.setItem(dismissedKey,candidate)}catch{}
        statusMessage='已取消更新，继续使用 v'+currentVersion+'。';
        return;
      }
      statusMessage='正在下载并加载新版…';
      const module=await load(candidate);if(closed)return;
      if(module.OPENING_SELECTOR_VERSION!==notes.version)throw Error(`更新说明版本 v${notes.version} 与运行模块 v${module.OPENING_SELECTOR_VERSION} 不一致`);
      mount(module);ref=candidate;hasUpdate=false;dismissedRef='';
      try{host.localStorage.setItem(key,JSON.stringify({bootstrap:fallbackRef,ref}));host.localStorage.removeItem(dismissedKey)}catch{notify('本次已更新，但无法保存版本选择；下次打开将使用导入脚本中的版本。',true);return}
      notify('已更新至 v'+currentVersion);
    }catch(error){if(!closed)notify('检查或更新失败，继续使用当前版本：'+error.message,true)}
    finally{busy=false}
  }
  if(autoCheckEnabled)await check(false);
}
