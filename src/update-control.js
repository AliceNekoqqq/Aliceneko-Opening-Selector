// Update controls are shown inside settings; a small star marks available updates.
export function bindUpdateControl(button,hostDocument,{versionElements=[],autoCheckInput=null,autoCheckHint=null}={}){
  const doc=button.ownerDocument,host=hostDocument.defaultView||hostDocument;
  const label=doc.createElement('span');label.textContent='检查更新';
  button.setAttribute('data-uos-update-control','');button.type='button';button.style.whiteSpace='nowrap';button.append(label);
  const stars=versionElements.map(version=>{
    let star=version.querySelector?.('[data-uos-update-star]');
    if(!star){star=doc.createElement('sup');star.className='uos-update-star';star.dataset.uosUpdateStar='';star.textContent='✦';star.setAttribute('aria-hidden','true');star.title='有新版本，可在设置中查看更新说明';version.append(star)}
    return star;
  });
  function sync(){
    const api=hostDocument.__uosUpdater,pending=!!api?.hasUpdate,busy=!!api?.busy;
    stars.forEach(star=>{star.hidden=!pending});
    if(autoCheckInput)autoCheckInput.checked=api?.autoCheckEnabled!==false;
    if(autoCheckHint&&api?.autoCheckEnabled===false)autoCheckHint.textContent='启动时不自动检查；仍可手动检查更新。';
    else if(autoCheckHint)autoCheckHint.textContent='启动时检查新版本；也可以随时手动检查。';
    label.textContent=busy?'检查中…':'检查更新';
    button.disabled=busy;
    button.setAttribute('aria-label',busy?'正在检查更新':pending?'查看新版更新说明':'检查更新');
    button.title=busy?'正在检查更新':pending?'有新版本，点击查看更新说明':'检查当前通道是否有新版本';
  }
  if(autoCheckInput)autoCheckInput.onchange=()=>{
    const saved=hostDocument.__uosUpdater?.setAutoCheckEnabled?.(autoCheckInput.checked);
    if(autoCheckHint&&saved===false)autoCheckHint.textContent='设置未能保存在本机，请检查浏览器存储权限。';
    sync();
  };
  button.onclick=async()=>{
    const api=hostDocument.__uosUpdater;
    if(!api?.check){host.alert?.('当前启动脚本不支持检查更新，请替换为最新导入脚本。');return}
    await api.check(true);sync();
  };
  sync();const timer=host.setInterval(()=>{if(button.isConnected===false)stop();else sync()},1000);
  function stop(){host.clearInterval(timer);doc.defaultView?.removeEventListener?.('pagehide',stop)}
  doc.defaultView?.addEventListener?.('pagehide',stop,{once:true});
  return stop;
}
