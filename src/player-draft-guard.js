// Prompt and decision flow are independent of storage and opening selection.
export function unsavedPlayerGroups(baseline,current) {
  if(!baseline||!current)return [];
  return Object.keys(current).filter(key=>JSON.stringify(baseline[key])!==JSON.stringify(current[key]));
}

export function createPlayerDraftGuard({getGroups,prompt,restore,saveCard,saveLocal,status,
  isActive=()=>true,AbortControllerClass=globalThis.AbortController}) {
  let prompting=false,closed=false;
  const controller=new AbortControllerClass();
  const current=()=>!closed&&isActive();
  async function confirm() {
    if(prompting||!current())return false;
    const groups=getGroups();if(!groups.length)return true;
    prompting=true;
    try {
      const canSaveToCard=groups.some(group=>['exclusion','people','edits'].includes(group));
      const choice=await prompt(groups,canSaveToCard,controller.signal);
      if(!current()||choice==='stay')return false;
      if(choice==='discard'){restore();return true}
      const saved=choice==='card'?await saveCard(groups):choice==='local'?await saveLocal(groups):false;
      return current()&&!!saved;
    } catch(error) {
      if(current())status(`未保存内容处理失败：${error?.message||error}`);
    } finally {prompting=false}
    return false;
  }
  return {confirm,close(){if(closed)return;closed=true;controller.abort()}};
}

export function showPlayerUnsavedPrompt(doc,dialog,panel,groups,canSaveToCard,{signal}={}){
  return new Promise(resolve=>{
    if(signal?.aborted){resolve('stay');return}
    const previous=doc.activeElement,overlay=doc.createElement('div');overlay.dataset.uosPlayerUnsaved='';overlay.setAttribute('role','presentation');
    overlay.style.cssText='position:absolute;inset:0;z-index:100;display:grid;place-items:center;padding:16px;background:#000a;color:var(--text)';
    const computed=doc.defaultView.getComputedStyle(panel);for(const key of ['--bg','--surface','--text','--muted','--accent','--line'])overlay.style.setProperty(key,computed.getPropertyValue(key));
    const card=doc.createElement('section');card.setAttribute('role','alertdialog');card.setAttribute('aria-modal','true');card.setAttribute('aria-labelledby','uos-player-unsaved-title');card.style.cssText='width:min(440px,100%);padding:18px;border:1px solid var(--accent);border-radius:14px;background:var(--bg);color:var(--text);box-shadow:0 18px 54px #000b';
    const title=doc.createElement('h2');title.id='uos-player-unsaved-title';title.textContent='有未保存的改动';title.style.cssText='margin:0 0 8px;font-size:18px';
    const names={exclusion:'排除字段',people:'人物规则',edits:'开场修正',labels:'开场标签'};
    const message=doc.createElement('p');message.textContent='未保存：'+groups.map(group=>names[group]||group).join('、');message.style.cssText='margin:0 0 16px;color:var(--muted);font-size:13px;line-height:1.5';
    const actions=doc.createElement('div');actions.style.cssText='display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px';
    let settled=false;const buttons=[];
    const finish=value=>{if(settled)return;settled=true;doc.removeEventListener('keydown',onKeyDown,true);signal?.removeEventListener('abort',onAbort);overlay.remove();try{previous?.focus?.()}catch{}resolve(value)};
    const addButton=(label,value,primary=false)=>{const button=doc.createElement('button');button.type='button';button.textContent=label;button.style.cssText=`min-height:40px;padding:8px 11px;border:1px solid var(--line);border-radius:9px;background:${primary?'var(--accent)':'var(--surface)'};color:${primary?'var(--bg)':'var(--text)'};font:600 12px/1.35 system-ui,sans-serif;cursor:pointer`;button.onclick=()=>finish(value);buttons.push(button);actions.append(button);return button};
    addButton('保存到本机并关闭','local',true);
    if(canSaveToCard)addButton('保存到角色卡并关闭','card');
    addButton('放弃更改并关闭','discard');const stay=addButton('继续编辑','stay');
    const onKeyDown=event=>{if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();finish('stay');return}if(event.key==='Tab'){const index=buttons.indexOf(doc.activeElement);if(event.shiftKey&&index<=0){event.preventDefault();buttons.at(-1).focus()}else if(!event.shiftKey&&index===buttons.length-1){event.preventDefault();buttons[0].focus()}}};
    const onAbort=()=>finish('stay');signal?.addEventListener('abort',onAbort,{once:true});
    overlay.addEventListener('pointerdown',event=>{if(event.target===overlay)finish('stay')});card.append(title,message,actions);overlay.append(card);dialog.append(overlay);doc.addEventListener('keydown',onKeyDown,true);stay.focus();
  });
}

