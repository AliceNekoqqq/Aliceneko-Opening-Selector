// Layout only: fields and persistence remain owned by the player's settings code.
export function createPlayerSettingsLayout(el) {
  const settings=el('section','uos-user-settings');
  settings.hidden=true;settings.id='uos-player-settings';settings.setAttribute('aria-label','开场设置');
  const button=el('button','uos-user-settings-button','设置');button.type='button';
  button.setAttribute('aria-controls',settings.id);button.setAttribute('aria-expanded','false');
  button.onclick=()=>{settings.hidden=!settings.hidden;button.setAttribute('aria-expanded',String(!settings.hidden))};
  let stopToggles=()=>{},closed=false;
  function assemble({exclusion,people,edits,labels,updates,floatingStyle}) {
    if(closed)return;
    stopToggles();
    const sheets=[exclusion,people,edits,labels,updates];
    const listeners=sheets.map(sheet=>{
      const onToggle=()=>{if(sheet.open)for(const other of sheets)if(other!==sheet)other.open=false};
      sheet.addEventListener('toggle',onToggle);return ()=>sheet.removeEventListener('toggle',onToggle);
    });
    stopToggles=()=>{listeners.forEach(stop=>stop())};
    const intro=el('p','uos-user-settings-intro','按需要展开一项。修改后使用该项的保存按钮。');
    const common=el('section','uos-user-settings-group');common.append(el('h3','','开场显示'),edits,labels);
    const appearance=el('section','uos-user-settings-group');appearance.append(el('h3','','界面外观'),floatingStyle);
    const advanced=el('section','uos-user-settings-group');advanced.append(el('h3','','识别规则'),exclusion,people);
    const system=el('section','uos-user-settings-group');system.append(el('h3','','插件'),updates);
    settings.replaceChildren(intro,common,appearance,advanced,system);
  }
  return {settings,button,assemble,close(){if(closed)return;closed=true;stopToggles();button.onclick=null}};
}
