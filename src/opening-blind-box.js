import {createModuleHelp} from './module-help.js';
import {blindBoxPool,drawOpeningHand} from './opening-blind-draw.js';
import {BLIND_BOX_DIALOG_CSS} from './opening-blind-box-styles.js';
import {defaultCoverStyles} from './default-covers.js';
import {applyOpeningCover} from './opening-presentation.js';
import {createBlindBoxArt} from './blind-box-art.js';
import {themeDraw} from './themes.js';
import {createOpeningDrawRange,drawRangePool,drawRangeLabel} from './opening-blind-range.js';
import {createDrawRangePanel,DRAW_RANGE_CSS} from './opening-blind-range-ui.js';
import {createBlindPerformance,BLIND_PERFORMANCE_CSS} from './opening-blind-performance.js';

export function openingBlindBoxButton(el,onOpen,theme='archive'){
  const button=el('button','uos-blind-trigger');button.type='button';button.setAttribute('aria-label','命运盲盒');
  const art=el('span','uos-blind-trigger-art'),symbol=el('span','uos-blind-trigger-symbol','✦');art.setAttribute('aria-hidden','true');
  art.append(symbol);
  const copy=el('span','uos-blind-trigger-copy');copy.append(el('strong','uos-blind-trigger-title','命运盲盒'),el('small','uos-blind-trigger-hint','让命运，为你挑一个故事'));
  const action=el('span','uos-blind-trigger-action'),count=el('span','uos-blind-trigger-count','开始抽取'),arrow=el('span','uos-blind-trigger-arrow','↗');arrow.setAttribute('aria-hidden','true');action.append(count,arrow);
  // Warm the card texture alongside the entrance, before the animation is opened.
  button.append(art,copy,action);button.__uosBlindCount=count;
  button.__uosBlindTheme={el,art,title:copy.children[0],hint:copy.children[1]};setBlindBoxTheme(button,theme);
  if(onOpen)button.onclick=()=>onOpen(button);else button.disabled=true;
  return button;
}
export function setBlindBoxTheme(button,theme){
  const state=button.__uosBlindTheme;if(!state||state.theme===theme)return;state.theme=theme;
  const draw=themeDraw(theme);state.title.textContent=draw.title;state.hint.textContent=draw.hint;button.setAttribute('aria-label',`${draw.title}（命运盲盒）`);
  state.art.replaceChildren();const symbol=state.el('span','uos-blind-trigger-symbol','✦');state.art.dataset.artReady='false';state.art.append(symbol);
  for(let i=-1;i<=1;i++){const image=createBlindBoxArt(state.el,'card-back',theme);image.style.setProperty('--fan',i);state.art.append(image)}
}
export function openingBlindRangeButton(el,onOpen){const button=el('button','uos-blind-range-trigger','⚙ 卡池与抽卡设置');button.type='button';button.setAttribute('aria-label','设置抽取范围');if(onOpen)button.onclick=()=>onOpen(button);else button.disabled=true;return button}
export function updateBlindBoxButton(button,items,{readonly=false,theme,manual=false}={}){
  if(theme)setBlindBoxTheme(button,theme);
  const count=blindBoxPool(items).length;button.__uosBlindCount.textContent=count?`${count} 个开场`:'暂无候选';button.disabled=readonly||count===0;
  button.setAttribute('title',count?`从${manual?'手动勾选范围':'当前筛选结果'}的 ${count} 个开场中随机抽取，确认进入后才切换`:'没有可抽取的新开场，可点击「抽取范围」重新勾选');button.dataset.scope=manual?'manual':'filtered';
}

export function createOpeningBlindBox({doc,host=doc.defaultView,getItems,getAllItems=getItems,getPalette,avatar,isActive=()=>true,onPreview,onChoose,onRangeChange=()=>{},onUnavailable=()=>{},onError=()=>{},random=Math.random}){
  const moduleHelp=createModuleHelp({doc});
  let disposed=false,active=null,lastId=null,choosing=false;
  const store=createOpeningDrawRange(host,avatar),clock=host||globalThis,style=doc.createElement('style');style.dataset.uosBlindStyle='';style.textContent=BLIND_BOX_DIALOG_CSS+BLIND_PERFORMANCE_CSS+DRAW_RANGE_CSS+defaultCoverStyles('.uos-blind-box');(doc.head||doc.documentElement).append(style);
  const el=(tag,cls='',text)=>{const node=doc.createElement(tag);if(cls)node.className=cls;if(text!=null)node.textContent=String(text);return node};
  const rangePanel=createDrawRangePanel({doc,el,store,getAllItems,getFilteredItems:getItems,getPalette,isActive,onUnavailable,onApply:result=>onRangeChange(result)});
  const poolItems=()=>drawRangePool(getAllItems(),getItems(),store.read());
  function close(){
    moduleHelp.close();
    rangePanel.close();
    const current=active;if(!current)return;active=null;
    for(const timer of current.timers)clock.clearTimeout(timer);current.timers.clear();
    current.dialog.removeEventListener('keydown',current.onKey);
    if(current.dialog.open)current.dialog.close();current.dialog.remove();
    try{if(current.trigger?.isConnected)current.trigger.focus()}catch{}
  }
  function open(trigger){
    if(disposed||choosing||!isActive())return false;
    const prefs=store.read(),pool=drawRangePool(getAllItems(),getItems(),prefs).map(item=>({...item}));if(!pool.length)return false;rangePanel.close();close();
    const dialog=el('dialog','uos-blind-box');dialog.setAttribute('aria-label','命运盲盒');dialog.setAttribute('aria-modal','true');
    const palette=getPalette(),computed=palette.ownerDocument.defaultView.getComputedStyle(palette);dialog.dataset.theme=palette.dataset.theme||'archive';
    const draw=themeDraw(dialog.dataset.theme);dialog.setAttribute('aria-label',`${draw.title}（命运盲盒）`);
    for(const key of ['--bg','--surface','--text','--muted','--accent','--line'])dialog.style.setProperty(key,computed.getPropertyValue(key)||computed.getPropertyValue('--panel'));
    const header=el('div','uos-blind-header'),heading=el('div'),exit=el('button','','关闭盲盒');exit.type='button';exit.onclick=()=>{if(active?.dialog===dialog)close()};
    heading.append(el('p','uos-blind-kicker','随机故事 · 命运盲盒'),el('h2','uos-blind-heading',draw.title));header.append(heading,exit);const helpButton=moduleHelp.attach(header,'blind',{before:exit});
    const stage=el('div','uos-blind-stage'),deck=el('div','uos-blind-deck'),result=el('div','uos-blind-result');dialog.dataset.show=prefs.performances&&!reducedMotion()?'on':'off';
    stage.append(createBlindPerformance(el,dialog.dataset.theme,dialog.dataset.show==='on'),deck);
    const status=el('p','uos-blind-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    const footer=el('div','uos-blind-footer'),scope=el('p','uos-blind-scope',`${drawRangeLabel(prefs)} · ${pool.length} 个候选开场${pool.length>1?' · 重抽不连续重复':''}`),actions=el('div','uos-blind-actions');
    const reroll=el('button','','再抽一次'),preview=el('button','','预览正文'),choose=el('button','uos-blind-enter','进入此开场');for(const button of [reroll,preview,choose])button.type='button';actions.append(reroll,preview,choose);footer.append(scope,actions);dialog.append(header,stage,result,status,footer);
    const session={dialog,trigger,timers:new Set(),onKey:null};let selected=null,busy=false,round=0,cards=[];
    function valid(){if(disposed||active!==session)return false;if(!isActive()){close();onUnavailable();return false}return true}
    function later(fn,delay){const token=round,timer=clock.setTimeout(()=>{session.timers.delete(timer);if(valid()&&token===round)fn()},delay);session.timers.add(timer)}
    function reducedMotion(){try{return Boolean(clock.matchMedia?.('(prefers-reduced-motion: reduce)').matches)}catch{return false}}
    function reveal(item){
      selected=item;lastId=item.id;busy=false;result.replaceChildren();
      result.append(el('h3','uos-blind-title',item.title),el('p','uos-blind-number',`开场 ${String(item.number??item.id+1).padStart(2,'0')}${item.label?' · '+item.label:''}`),el('p','uos-blind-description',item.description||'这段故事，等待你亲自揭晓。'));
      result.hidden=false;dialog.dataset.phase='revealed';status.textContent='命运已揭晓，故事由你决定。';reroll.disabled=pool.length<2;preview.disabled=false;choose.disabled=false;
      if(doc.activeElement===reroll||doc.activeElement===dialog||cards.includes(doc.activeElement))preview.focus();
    }
    function pick(card,item,token){
      if(!valid()||token!==round||dialog.dataset.phase!=='ready'||card.disabled)return;
      busy=true;dialog.dataset.phase='flipping';deck.setAttribute('aria-hidden','true');cards.forEach(node=>node.disabled=true);reroll.disabled=true;status.textContent='你选中的卡，正在揭晓…';
      card.dataset.picked='true';card.setAttribute('aria-pressed','true');
      const face=card.children[0].children[1],cover=el('div','uos-blind-cover');applyOpeningCover(cover,item,item.body,item.coverIndex??item.id,host);
      face.append(cover,el('span','uos-blind-face-title',item.title));
      const flip=()=>card.dataset.opened='true';
      if(reducedMotion()){flip();reveal(item);return}
      later(flip,260);later(()=>reveal(item),1180);
    }
    function roll(){
      if(!valid()||busy)return;round++;const token=round;busy=true;selected=null;result.hidden=true;result.replaceChildren();deck.replaceChildren();deck.setAttribute('aria-hidden','true');dialog.dataset.phase='shuffle';reroll.disabled=preview.disabled=choose.disabled=true;
      const hand=drawOpeningHand(pool,lastId,random,prefs.handSize);deck.dataset.count=String(hand.length);
      cards=hand.map((item,i)=>{
        const card=el('button','uos-blind-card'),turn=el('span','uos-blind-turn'),back=el('span','uos-blind-back'),face=el('span','uos-blind-face');
        card.type='button';card.disabled=true;card.style.setProperty('--card',i-(hand.length-1)/2);card.style.setProperty('--shuffle-side',i%2?1:-1);card.style.setProperty('--shuffle-delay',`${i*35}ms`);card.setAttribute('aria-label',`抽取第 ${i+1} 张卡`);card.setAttribute('aria-pressed','false');
        const firstRow=Math.ceil(hand.length/2),row=i<firstRow?0:1;card.style.setProperty('--mobile-card',row===0?i-(firstRow-1)/2:i-firstRow-(hand.length-firstRow-1)/2);card.style.setProperty('--mobile-row',row===0?'-60px':'60px');
        turn.setAttribute('aria-hidden','true');back.append(createBlindBoxArt(el,'card-back',dialog.dataset.theme),el('span','uos-blind-symbol','✦'));turn.append(back,face);card.append(turn);card.onclick=()=>pick(card,item,token);deck.append(card);return card;
      });
      status.textContent=`正在洗 ${hand.length} 张卡，请稍候…`;
      const ready=()=>{busy=false;dialog.dataset.phase='ready';deck.setAttribute('aria-hidden','false');cards.forEach(card=>card.disabled=false);reroll.disabled=pool.length<2;status.textContent=hand.length===1?'只有一张候选卡，点击翻开。':`选择一张卡，翻开你的故事。${hand.length<prefs.handSize&&lastId!==null?' 上次结果已避开。':''}`;if(doc.activeElement===reroll)cards[0].focus()};
      if(reducedMotion()){ready();return}later(ready,hand.length===1?500:hand.length>3?1900:1800);
    }
    reroll.onclick=()=>{if(!reroll.disabled)roll()};
    preview.onclick=()=>{if(!valid()||busy||!selected||preview.disabled)return;const item=selected;close();onPreview(item,trigger,pool)};
    choose.onclick=()=>{if(!valid()||busy||!selected||choose.disabled)return;const item=selected;choosing=true;close();try{Promise.resolve(onChoose(item)).catch(error=>{if(!disposed&&isActive())onError(error)}).finally(()=>{choosing=false})}catch(error){choosing=false;if(!disposed&&isActive())onError(error)}};
    session.onKey=event=>{
      if(disposed||active!==session)return;
      if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close();return}
      if(event.key==='Tab'){const controls=[helpButton,exit,...cards,reroll,preview,choose].filter(button=>!button.disabled),first=controls[0],last=controls.at(-1);
        if(event.shiftKey&&doc.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&doc.activeElement===last){event.preventDefault();first.focus()}}
    };
    active=session;dialog.addEventListener('keydown',session.onKey);dialog.addEventListener('cancel',event=>{event.preventDefault();if(active===session)close()});dialog.addEventListener('close',()=>{if(active===session)close()});dialog.addEventListener('click',event=>{if(active===session&&event.target===dialog)close()});
    doc.body.append(dialog);try{dialog.showModal()}catch{dialog.setAttribute('open','');dialog.setAttribute('role','dialog')}exit.focus();roll();return true;
  }
  return {open,close,poolItems,rangeMode:()=>store.read().mode,rangeSummary(){const prefs=store.read();return `⚙ 卡池与抽卡 · ${drawRangeLabel(prefs)} · ${prefs.handSize===5?'五张':'三张'}`},openRange(trigger){if(disposed||choosing||!isActive())return false;close();return rangePanel.open(trigger)},dispose(){if(disposed)return;disposed=true;moduleHelp.dispose();close();rangePanel.dispose();style.remove()}};
}
