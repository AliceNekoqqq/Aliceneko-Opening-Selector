// Visible controls belong inside the dialog/author frame (above the modal top layer).
export function bindUpdateControl(button,hostDocument){
  const doc=button.ownerDocument,host=hostDocument.defaultView;
  const label=doc.createElement('span'),dot=doc.createElement('span');
  label.textContent='检查更新';dot.setAttribute('aria-hidden','true');
  dot.style.cssText='width:8px;height:8px;margin-left:6px;border-radius:50%;background:#ff4545;box-shadow:0 0 4px #ff454580;';
  button.setAttribute('data-uos-update-control','');button.type='button';button.style.whiteSpace='nowrap';button.append(label,dot);
  function sync(){
    const api=hostDocument.__uosUpdater;
    const pending=api?.hasUpdate??!!hostDocument.querySelector('button[aria-label="检查更新，有新版本"]:not([data-uos-update-control])');
    const busy=!!api?.busy;
    dot.hidden=!pending;dot.style.display=pending?'inline-block':'none';
    const text=busy?'检查中…':'检查更新';if(label.textContent!==text)label.textContent=text;
    button.disabled=busy;button.setAttribute('aria-label',pending?'检查更新，有新版本':'检查更新');
  }
  button.onclick=async()=>{
    const api=hostDocument.__uosUpdater;
    if(!api?.check){host.alert?.('当前启动脚本不支持检查更新，请替换为最新测试版导入脚本。');return}
    await api.check(true);sync();
  };
  sync();const timer=host.setInterval(()=>{if(button.isConnected===false)stop();else sync()},1000);
  function stop(){host.clearInterval(timer);doc.defaultView?.removeEventListener?.('pagehide',stop)}
  doc.defaultView?.addEventListener?.('pagehide',stop,{once:true});
  return stop;
}
