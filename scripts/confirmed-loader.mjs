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
  const notify=(message,error=false)=>{const toast=globalThis.toastr||host.toastr;if(toast?.[error?'error':'info'])toast[error?'error':'info'](message);else host.alert?.(message)};
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
      const response=await fetch(url,{cache:'no-store',credentials:'omit'});if(!response.ok)throw Error('HTTP '+response.status);
      const sections=parseReleaseNotes(await response.text()).filter(entry=>compareVersion(entry.version,currentVersion)>0).sort((a,b)=>compareVersion(a.version,b.version));
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
    setAutoCheckEnabled(value){
      autoCheckEnabled=Boolean(value);
      try{host.localStorage.setItem(autoCheckKey,String(autoCheckEnabled));return true}catch{return false}
    },
    close(){closed=true;globalThis.removeEventListener?.('pagehide',api.close);if(doc.__uosUpdater===api)delete doc.__uosUpdater}
  };
  doc.__uosUpdater=api;
  globalThis.addEventListener?.('pagehide',api.close,{once:true});
  async function check(manual=false){
    if(busy||closed)return;busy=true;
    try{
      let candidate;const errors=[];
      for(const url of pointerUrls){try{const response=await fetch(url,{cache:'no-store',credentials:'omit'});if(!response.ok)throw Error('HTTP '+response.status);candidate=(await response.text()).trim();if(!valid(candidate))throw Error('提交 SHA 格式错误');break}catch(error){candidate=null;errors.push(String(error?.message||error))}}
      if(closed)return;
      if(!candidate)throw Error(errors.join(' | '));
      hasUpdate=candidate!==ref;
      if(!hasUpdate){dismissedRef='';try{host.localStorage.removeItem(dismissedKey)}catch{}if(manual)notify('当前已是最新版本：v'+currentVersion);return}
      if(!manual&&dismissedRef===candidate)return;
      const notes=await fetchReleaseNotes(candidate);if(closed)return;
      const prompt=`红豆粉开场白选择器发现新版本（${channel==='preview'?'测试':'正式'}通道）。\n当前版本：v${currentVersion}\n可更新版本：v${notes.version}\n\n更新内容：\n${notes.content}\n\n选择“确定”立即更新；选择“取消”保留当前版本。`;
      if(!host.confirm(prompt)){
        dismissedRef=candidate;try{host.localStorage.setItem(dismissedKey,candidate)}catch{}
        return;
      }
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
