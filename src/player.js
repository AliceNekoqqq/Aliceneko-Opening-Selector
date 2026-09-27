/* Optional global Tavern Helper script for ordinary multi-greeting cards. */
const KEY='universal_opening_selector';
const THEMES=[['archive','旧档案'],['neon','霓虹夜'],['paper','纸与墨'],['noir','黑白电影'],['meadow','林间信']];
const CSS=`
.uos-user-trigger{display:block;width:max-content;max-width:calc(100% - 24px);margin:10px 12px;padding:8px 13px;border:1px solid #b99669;border-radius:999px;background:#17242d;color:#f3e9d7;font:13px/1.4 system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 14px #0004}
.uos-user-trigger[data-floating=true]{position:fixed;z-index:2147483645;margin:0;touch-action:none}
.uos-user-trigger:focus-visible,.uos-user-panel button:focus-visible{outline:2px solid #efc58b;outline-offset:2px}
dialog.uos-user-overlay{position:fixed;inset:0;z-index:2147483646;box-sizing:border-box;width:min(620px,calc(100vw - 28px));max-width:calc(100vw - 28px);max-height:calc(100dvh - 28px);margin:auto;padding:0;border:0;border-radius:18px;background:transparent;color:inherit;overflow:hidden;box-shadow:0 20px 60px #0008}
dialog.uos-user-overlay::backdrop{background:#08141b55}
.uos-user-panel{--bg:#111a21;--surface:#202d35;--text:#f1e7d4;--muted:#bbb7aa;--accent:#deb47c;--line:#b9966970;box-sizing:border-box;display:flex;flex-direction:column;width:100%;max-height:min(74dvh,690px);overflow:hidden;padding:18px;border:1px solid var(--accent);border-radius:18px;background:radial-gradient(circle at 100% 0%,var(--accent) 0,transparent 1px),var(--bg);color:var(--text);font:14px/1.5 system-ui,"Noto Sans SC",sans-serif}
.uos-user-panel[data-theme=neon]{--bg:#080e22;--surface:#171c38;--text:#f5f1ff;--muted:#b8b2d1;--accent:#fa74bf;--line:#9d7de399}
.uos-user-panel[data-theme=paper]{--bg:#f4eee2;--surface:#fffaf0;--text:#362d29;--muted:#675950;--accent:#a64d3c;--line:#a77e6b8c}
.uos-user-panel[data-theme=noir]{--bg:#121314;--surface:#27292b;--text:#f2f1ec;--muted:#babbb9;--accent:#e4e1d5;--line:#a3a3a36b}
.uos-user-panel[data-theme=meadow]{--bg:#122a24;--surface:#254037;--text:#f3f4e1;--muted:#c2d1bf;--accent:#d2e5a0;--line:#afc28980}
.uos-user-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.uos-user-head h2{margin:0;color:var(--text);font:600 22px/1.3 Georgia,"Noto Serif SC",serif}.uos-user-head p{margin:4px 0 0;color:var(--muted);font-size:12px}
.uos-user-panel button,.uos-user-panel select{font:inherit}.uos-user-close,.uos-user-select{border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--text);padding:8px 12px;cursor:pointer}.uos-user-tools{display:flex;align-items:center;gap:8px;margin-bottom:12px;color:var(--muted);font-size:12px}.uos-user-tools select{min-width:0;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--text)}
.uos-user-list{display:grid;gap:12px;min-height:0;overflow:auto;overscroll-behavior:contain;padding:2px 3px 12px}.uos-user-card{padding:14px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}.uos-user-card[data-current=true]{border-color:var(--accent);box-shadow:inset 3px 0 var(--accent)}.uos-user-card h3{margin:0 0 6px;color:var(--text);font:600 17px/1.4 Georgia,"Noto Serif SC",serif}.uos-user-card p{margin:0 0 9px;color:var(--muted);font-size:12px}.uos-user-card details{margin-bottom:10px}.uos-user-card summary{color:var(--accent);cursor:pointer}.uos-user-card pre{max-height:180px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;margin:9px 0 0;padding:10px;border:1px solid var(--line);border-radius:7px;color:var(--text);font-size:12px;line-height:1.6;font-family:inherit}.uos-user-select{background:var(--accent);color:var(--bg);font-weight:700}.uos-user-select:disabled{opacity:.65;cursor:default}.uos-user-status{min-height:18px;margin:8px 0 0;color:var(--accent);font-size:12px}
@media(max-width:600px){.uos-user-panel{max-height:72dvh;padding:15px}.uos-user-head h2{font-size:20px}}
`;

function clean(text){return String(text||'').replace(/<[^>]*>/g,' ').replace(/\{\{[^}]*\}\}/g,' ').replace(/[#*_`>\[\]()]/g,' ').replace(/\s+/g,' ').trim()}
function narrativeStart(body){
  let text=String(body||'').replace(/\r\n?/g,'\n').trim();
  const narrativeTag=/^(?:正文|content)$/i;
  for(let i=0;i<12 && text;i++){
    const before=text;
    text=text.replace(/^<!--[\s\S]*?-->\s*/,'').replace(/^(?:```|~~~)[^\n]*\n[\s\S]*?\n(?:```|~~~)\s*/,'').trimStart();
    const pair=text.match(/^<([^\s<>/]+)(?:\s[^<>]*)?>\s*([\s\S]*?)\s*<\/\1>\s*/i);
    if(pair){text=(narrativeTag.test(pair[1])?pair[2]:'')+text.slice(pair[0].length);text=text.trimStart()}
    else text=text.replace(/^<[^<>\n]{1,120}\/?>\s*/,'').trimStart();
    if(text===before)break;
  }
  return clean(text);
}
function greetingTitle(body,index){
  const content=narrativeStart(body),sentence=content.match(/^.{1,64}?[。！？!?]/)?.[0];
  return sentence||(`${content.slice(0,56)}${content.length>56?'…':''}`)||`开场 ${index+1}`;
}

export function readPlayerState(context,helper){
  const c=context?.characters?.[context.characterId];
  if(!c || (context.groupId!=null && context.groupId!==-1) || context.characterId==null)return null;
  const data=c.data||c,first=String(data.first_mes??c.first_mes??'');
  const alternates=data.alternate_greetings??c.alternate_greetings;
  if(!first || first.includes('<UniversalOpeningSelector/>') || !Array.isArray(alternates) || !alternates.length)return null;
  if(typeof helper?.getChatMessages!=='function' || typeof helper?.setChatMessages!=='function')return null;
  let message,last;
  try{message=helper.getChatMessages(0,{include_swipes:true})?.[0];last=helper.getLastMessageId?.()}catch{return null}
  if(last!=null && Number(last)>0)return null;
  if(message?.role!=='assistant' || !Array.isArray(message.swipes) || !message.swipes.length)return null;
  const all=[first,...alternates],count=Math.min(all.length,message.swipes.length);
  if(count<2)return null;
  const metadata=data.extensions?.[KEY]?.entries||[];
  return {characterId:context.characterId,avatar:c.avatar||data.name||'',swipeId:Number(message.swipe_id)||0,entries:all.slice(0,count).map((body,i)=>({index:i,body,title:metadata[i]?.title||greetingTitle(body,i),description:metadata[i]?.description||'',label:metadata[i]?.label||`OPENING ${String(i+1).padStart(2,'0')}`}))};
}

export function mountPlayerSelector(startDocument=document,helperApi){
  let doc=startDocument,win=doc.defaultView;
  try{for(let i=0;i<8 && win?.parent && win.parent!==win;i++){void win.parent.document;win=win.parent;doc=win.document}}catch{}
  if(doc.__uosPlayer?.version==='0.1.0-beta.24')return doc.__uosPlayer;
  doc.__uosPlayer?.close?.();
  const host=doc.defaultView||globalThis;
  const helper=helperApi||host.TavernHelper||host;
  const style=doc.createElement('style');style.dataset.uosUserStyle='';style.textContent=CSS;(doc.head||doc.documentElement).append(style);
  let trigger=null,overlay=null,updating=false,suppressClickUntil=0;
  const positionKey='uos_player_button_position';
  function clampButton(left,top){
    if(!trigger)return;
    const width=trigger.offsetWidth,height=trigger.offsetHeight;
    const x=Math.max(8,Math.min(left,host.innerWidth-width-8));
    const y=Math.max(8,Math.min(top,host.innerHeight-height-8));
    trigger.style.left=`${x}px`;trigger.style.top=`${y}px`;
  }
  function applySavedPosition(){
    try{const saved=JSON.parse(host.localStorage.getItem(positionKey));
      if(!Number.isFinite(saved?.x)||!Number.isFinite(saved?.y))return;
      trigger.dataset.floating='true';clampButton(saved.x*host.innerWidth,saved.y*host.innerHeight);
    }catch{}
  }
  function enableDrag(button){
    let gesture=null,frame=0;
    const render=()=>{frame=0;if(!gesture?.moved)return;
      const x=Math.max(8,Math.min(gesture.left+gesture.dx,host.innerWidth-gesture.width-8));
      const y=Math.max(8,Math.min(gesture.top+gesture.dy,host.innerHeight-gesture.height-8));
      gesture.x=x;gesture.y=y;button.style.transform=`translate3d(${x-gesture.left}px,${y-gesture.top}px,0)`;
    };
    button.onpointerdown=e=>{if(e.button!==0 && e.pointerType==='mouse')return;
      const rect=button.getBoundingClientRect();gesture={id:e.pointerId,startX:e.clientX,startY:e.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height,dx:0,dy:0,moved:false};
      button.setPointerCapture?.(e.pointerId);
    };
    button.onpointermove=e=>{if(!gesture||e.pointerId!==gesture.id)return;
      const dx=e.clientX-gesture.startX,dy=e.clientY-gesture.startY;
      if(!gesture.moved && Math.hypot(dx,dy)<8)return;
      if(!gesture.moved){gesture.moved=true;button.dataset.floating='true';button.style.left=`${gesture.left}px`;button.style.top=`${gesture.top}px`;button.style.willChange='transform'}
      gesture.dx=dx;gesture.dy=dy;if(!frame)frame=host.requestAnimationFrame(render);
      e.preventDefault();
    };
    const finish=e=>{if(!gesture||e.pointerId!==gesture.id)return;
      if(gesture.moved){suppressClickUntil=Date.now()+500;if(frame)host.cancelAnimationFrame(frame);frame=0;
        if(e.type==='pointerup'){gesture.dx=e.clientX-gesture.startX;gesture.dy=e.clientY-gesture.startY}render();
        button.style.transform='';button.style.willChange='';button.style.left=`${gesture.x}px`;button.style.top=`${gesture.y}px`;
        try{host.localStorage.setItem(positionKey,JSON.stringify({x:gesture.x/host.innerWidth,y:gesture.y/host.innerHeight}))}catch{}
      }
      gesture=null;
    };
    button.onpointerup=finish;button.onpointercancel=finish;
  }
  const el=(tag,className,text)=>{const node=doc.createElement(tag);node.className=className;if(text!=null)node.textContent=String(text);return node};
  const state=()=>readPlayerState(host.SillyTavern?.getContext?.(),helper);
  const removeTrigger=()=>{trigger?.remove();trigger=null};
  function scan(){
    if(updating)return;updating=true;
    try{
      const snapshot=state(),first=doc.querySelector('#chat .mes[mesid="0"],#chat .mes[data-mesid="0"]');
      if(!snapshot||!first){removeTrigger();closePanel();return}
      if(!trigger){trigger=el('button','uos-user-trigger');trigger.type='button';trigger.style.touchAction='none';
        trigger.onclick=()=>{if(Date.now()>=suppressClickUntil)openPanel()};enableDrag(trigger);
      }
      const label=`◈ 预览开场 · ${snapshot.swipeId+1}/${snapshot.entries.length}`;
      if(trigger.textContent!==label)trigger.textContent=label;
      if(trigger.nextElementSibling!==first || trigger.parentNode!==first.parentNode){first.before(trigger);applySavedPosition()}
    }finally{updating=false}
  }
  function closePanel(){const active=overlay;overlay=null;if(active?.open)active.close();active?.remove()}
  function openPanel(){
    const snapshot=state();if(!snapshot)return;
    closePanel();overlay=el('dialog','uos-user-overlay');
    const panel=el('section','uos-user-panel');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','预览和选择开场');
    let theme='archive';try{theme=host.localStorage.getItem('uos_player_theme')||theme}catch{}
    panel.dataset.theme=THEMES.some(x=>x[0]===theme)?theme:'archive';
    const head=el('div','uos-user-head'),heading=el('div');heading.append(el('h2','','选择故事的起点'),el('p','',`已读取 ${snapshot.entries.length} 条开场，选择后切换首条消息。`));
    const close=el('button','uos-user-close','关闭');close.type='button';close.onclick=closePanel;head.append(heading,close);
    const tools=el('div','uos-user-tools');tools.append(el('span','','主题'));
    const select=el('select','');select.setAttribute('aria-label','选择主题');for(const [id,name] of THEMES){const option=el('option','',name);option.value=id;select.append(option)}select.value=panel.dataset.theme;select.onchange=()=>{panel.dataset.theme=select.value;try{host.localStorage.setItem('uos_player_theme',select.value)}catch{}};tools.append(select);
    const list=el('div','uos-user-list'),status=el('p','uos-user-status');status.setAttribute('role','status');
    for(const entry of snapshot.entries){
      const card=el('article','uos-user-card');card.dataset.current=String(entry.index===snapshot.swipeId);
      card.append(el('h3','',entry.title),el('p','',entry.label+(entry.description?' · '+entry.description:'')));
      const details=el('details','');details.append(el('summary','','查看完整开场'),el('pre','',entry.body));card.append(details);
      const choose=el('button','uos-user-select',entry.index===snapshot.swipeId?'当前开场':`进入开场 ${entry.index+1}`);choose.type='button';choose.disabled=entry.index===snapshot.swipeId;
      choose.onclick=async()=>{
        const current=state();
        if(!current||current.characterId!==snapshot.characterId||current.avatar!==snapshot.avatar||entry.index>=current.entries.length){status.textContent='角色或聊天已变化，请重新打开选择器。';return}
        choose.disabled=true;status.textContent='正在切换开场…';
        try{await helper.setChatMessages([{message_id:0,swipe_id:entry.index}],{refresh:'all'});
          const after=state();if(after?.swipeId!==entry.index)throw Error('消息页未切换');closePanel();scan();
        }catch(error){status.textContent=`切换失败：${error?.message||error}`;choose.disabled=false}
      };
      card.append(choose);list.append(card);
    }
    panel.append(head,tools,list,status);overlay.append(panel);(doc.body||doc.documentElement).append(overlay);
    const active=overlay;
    try{active.showModal()}catch(error){closePanel();console.warn('[Aliceneko Opening Selector] 弹窗无法打开',error);return}
    active.onclick=e=>{if(e.target===active)closePanel()};active.onclose=()=>{active.remove();if(overlay===active)overlay=null};close.focus();
  }
  const observer=new host.MutationObserver(scan);
  if(doc.body)observer.observe(doc.body,{childList:true,subtree:true});
  const onResize=()=>{if(trigger?.dataset.floating==='true')clampButton(parseFloat(trigger.style.left)||8,parseFloat(trigger.style.top)||8)};
  host.addEventListener('resize',onResize);
  const timer=host.setInterval(scan,1500);scan();
  const api={version:'0.1.0-beta.24',scan,close:()=>{observer.disconnect();host.removeEventListener('resize',onResize);host.clearInterval(timer);closePanel();removeTrigger();style.remove();delete doc.__uosPlayer}};
  doc.__uosPlayer=api;return api;
}
