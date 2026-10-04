import {blindBoxPool,drawOpening} from './opening-blind-draw.js';
import {BLIND_BOX_DIALOG_CSS} from './opening-blind-box-styles.js';
import {defaultCoverStyles} from './default-covers.js';
import {applyOpeningCover} from './opening-presentation.js';
import {createBlindBoxArt} from './blind-box-art.js';

export function openingBlindBoxButton(el,onOpen){
  const button=el('button','uos-blind-trigger');button.type='button';button.setAttribute('aria-label','命运盲盒');
  const art=el('span','uos-blind-trigger-art'),symbol=el('span','uos-blind-trigger-symbol','✦');art.setAttribute('aria-hidden','true');
  art.append(symbol,createBlindBoxArt(el,'entrance'));
  const copy=el('span','uos-blind-trigger-copy');copy.append(el('strong','uos-blind-trigger-title','命运盲盒'),el('small','uos-blind-trigger-hint','让命运，为你挑一个故事'));
  const action=el('span','uos-blind-trigger-action'),count=el('span','uos-blind-trigger-count','开始抽取'),arrow=el('span','uos-blind-trigger-arrow','↗');arrow.setAttribute('aria-hidden','true');action.append(count,arrow);
  // Warm the card texture alongside the entrance, before the animation is opened.
  const warm=el('span','uos-blind-art-warm');warm.setAttribute('aria-hidden','true');warm.append(createBlindBoxArt(el,'card-back'));
  button.append(art,copy,action,warm);button.__uosBlindCount=count;
  if(onOpen)button.onclick=()=>onOpen(button);else button.disabled=true;
  return button;
}
export function updateBlindBoxButton(button,items,{readonly=false}={}){
  const count=blindBoxPool(items).length;button.__uosBlindCount.textContent=count?`${count} 个开场`:'暂无候选';button.disabled=readonly||count===0;
  button.setAttribute('title',count?`从当前筛选结果的 ${count} 个开场中随机抽取，确认进入后才切换`:'当前筛选下没有可抽取的新开场');
}

export function createOpeningBlindBox({doc,host=doc.defaultView,getItems,getPalette,isActive=()=>true,onPreview,onChoose,onUnavailable=()=>{},onError=()=>{},random=Math.random}){
  let disposed=false,active=null,lastId=null,choosing=false;
  const clock=host||globalThis,style=doc.createElement('style');style.dataset.uosBlindStyle='';style.textContent=BLIND_BOX_DIALOG_CSS+defaultCoverStyles('.uos-blind-box');(doc.head||doc.documentElement).append(style);
  const el=(tag,cls='',text)=>{const node=doc.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=String(text);return node};
  function close(){
    const current=active;if(!current)return;active=null;
    for(const timer of current.timers)clock.clearTimeout(timer);current.timers.clear();
    current.dialog.removeEventListener('keydown',current.onKey);
    if(current.dialog.open)current.dialog.close();current.dialog.remove();
    try{if(current.trigger?.isConnected)current.trigger.focus()}catch{}
  }
  function open(trigger){
    if(disposed||choosing||!isActive())return false;
    const pool=blindBoxPool(getItems()).map(item=>({...item}));if(!pool.length)return false;close();
    const dialog=el('dialog','uos-blind-box');dialog.setAttribute('aria-label','命运盲盒');dialog.setAttribute('aria-modal','true');
    const palette=getPalette(),computed=palette.ownerDocument.defaultView.getComputedStyle(palette);dialog.dataset.theme=palette.dataset.theme||'archive';
    for(const key of ['--bg','--surface','--text','--muted','--accent','--line'])dialog.style.setProperty(key,computed.getPropertyValue(key)||computed.getPropertyValue('--panel'));
    const header=el('div','uos-blind-header'),heading=el('div'),exit=el('button','','关闭盲盒');exit.type='button';exit.onclick=()=>{if(active?.dialog===dialog)close()};
    heading.append(el('p','uos-blind-kicker','LET FATE CHOOSE'),el('h2','uos-blind-heading','命运盲盒'));header.append(heading,exit);
    const stage=el('div','uos-blind-stage'),aura=el('div','uos-blind-aura'),sparks=el('div','uos-blind-sparks'),deck=el('div','uos-blind-deck'),result=el('div','uos-blind-result');
    for(const node of [aura,sparks,deck])node.setAttribute('aria-hidden','true');
    for(let i=0;i<12;i++){const spark=el('span','uos-blind-spark');spark.style.setProperty('--spark',i);sparks.append(spark)}
    for(let i=-2;i<=2;i++){const card=el('div','uos-blind-card');card.style.setProperty('--card',i);card.append(createBlindBoxArt(el,'card-back'),el('span','uos-blind-symbol','✦'));deck.append(card)}
    stage.append(aura,sparks,deck,result);
    const status=el('p','uos-blind-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    const footer=el('div','uos-blind-footer'),scope=el('p','uos-blind-scope',`当前筛选 · ${pool.length} 个候选开场${pool.length>1?' · 重抽不连续重复':''}`),actions=el('div','uos-blind-actions');
    const reroll=el('button','','再抽一次'),preview=el('button','','预览正文'),choose=el('button','uos-blind-enter','进入此开场');for(const button of [reroll,preview,choose])button.type='button';actions.append(reroll,preview,choose);footer.append(scope,actions);dialog.append(header,stage,status,footer);
    const session={dialog,trigger,timers:new Set(),onKey:null};let selected=null,busy=false;
    function valid(){if(disposed||active!==session)return false;if(!isActive()){close();onUnavailable();return false}return true}
    function later(fn,delay){const timer=clock.setTimeout(()=>{session.timers.delete(timer);if(valid())fn()},delay);session.timers.add(timer)}
    function reveal(item){
      selected=item;lastId=item.id;busy=false;deck.hidden=true;result.replaceChildren();
      const cover=el('div','uos-blind-cover');cover.setAttribute('aria-hidden','true');applyOpeningCover(cover,item,item.body,item.coverIndex??item.id,host);
      result.append(cover,el('h3','uos-blind-title',item.title),el('p','uos-blind-number',`开场 ${String(item.number??item.id+1).padStart(2,'0')}${item.label?' · '+item.label:''}`),el('p','uos-blind-description',item.description||'这段故事，等待你亲自揭晓。'));
      result.hidden=false;dialog.dataset.phase='revealed';status.textContent='命运已揭晓，故事由你决定。';reroll.disabled=pool.length<2;preview.disabled=false;choose.disabled=false;
      if(doc.activeElement===reroll||doc.activeElement===dialog)preview.focus();
    }
    function roll(){
      if(!valid()||busy)return;busy=true;selected=null;result.hidden=true;result.replaceChildren();deck.hidden=false;dialog.dataset.phase='shuffle';status.textContent=pool.length===1?'只有一个候选，即将揭晓…':'正在洗牌，寻找你的故事…';reroll.disabled=preview.disabled=choose.disabled=true;
      const item=drawOpening(pool,lastId,random);let reduced=false;try{reduced=Boolean(clock.matchMedia?.('(prefers-reduced-motion: reduce)').matches)}catch{}
      if(reduced){reveal(item);return}
      later(()=>{for(const card of deck.children)card.style.setProperty('--lock-from',doc.defaultView.getComputedStyle(card).transform||'translate3d(0,0,0)');dialog.dataset.phase='locking';status.textContent='命运正在落定…'},pool.length===1?100:1500);
      later(()=>reveal(item),pool.length===1?750:2200);
    }
    reroll.onclick=()=>{if(!reroll.disabled)roll()};
    preview.onclick=()=>{if(!valid()||busy||!selected||preview.disabled)return;const item=selected;close();onPreview(item,trigger)};
    choose.onclick=()=>{if(!valid()||busy||!selected||choose.disabled)return;const item=selected;choosing=true;close();try{Promise.resolve(onChoose(item)).catch(error=>{if(!disposed&&isActive())onError(error)}).finally(()=>{choosing=false})}catch(error){choosing=false;if(!disposed&&isActive())onError(error)}};
    session.onKey=event=>{
      if(disposed||active!==session)return;
      if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return}
      if(event.key==='Tab'){const controls=[exit,reroll,preview,choose].filter(button=>!button.disabled),first=controls[0],last=controls.at(-1);
        if(event.shiftKey&&doc.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first.focus()}}
    };
    active=session;dialog.addEventListener('keydown',session.onKey);dialog.addEventListener('cancel',event=>{event.preventDefault();if(active===session)close()});dialog.addEventListener('close',()=>{if(active===session)close()});dialog.addEventListener('click',event=>{if(active===session&&event.target===dialog)close()});
    doc.body.append(dialog);try{dialog.showModal()}catch{dialog.setAttribute('open','');dialog.setAttribute('role','dialog')}exit.focus();roll();return true;
  }
  return {open,close,dispose(){if(disposed)return;disposed=true;close();style.remove()}};
}
