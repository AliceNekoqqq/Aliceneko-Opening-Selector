import {rosterNames,readPeopleRoster,writePeopleRoster} from './opening-people.js';
const CSS=`.uos-people-editor{box-sizing:border-box;width:min(660px,calc(100vw - 24px));max-height:calc(100dvh - 24px);overflow:auto;padding:18px;border:1px solid var(--line,#64748b);border-radius:14px;background:var(--bg,#17252d);color:var(--text,#f4ecda);font:14px/1.6 system-ui,sans-serif}.uos-people-editor::backdrop{background:#0009}.uos-people-editor h2{margin:0 0 8px}.uos-people-editor p{color:var(--muted,#b7c3cc)}.uos-people-editor-actions,.uos-people-editor-list{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.uos-people-editor-list{max-height:40dvh;overflow:auto}.uos-people-editor-list label{padding:6px 10px;border:1px solid var(--line,#64748b);border-radius:8px;overflow-wrap:anywhere}.uos-people-editor [hidden]{display:none!important}.uos-people-editor input[type=search]{box-sizing:border-box;width:100%;padding:8px;background:var(--panel,#23333b);color:inherit;border:1px solid var(--line,#64748b);border-radius:8px;font:inherit}.uos-people-editor small{color:var(--muted,#b7c3cc);overflow-wrap:anywhere}.uos-people-editor textarea{box-sizing:border-box;width:100%;min-height:90px;padding:8px;background:var(--panel,#23333b);color:inherit;border:1px solid var(--line,#64748b);border-radius:8px;font:inherit}.uos-people-editor button{padding:8px 12px;border:1px solid var(--line,#64748b);border-radius:8px;background:var(--panel,#23333b);color:inherit;cursor:pointer;font:inherit}.uos-people-editor button:disabled{opacity:.5;cursor:default}.uos-people-editor :focus-visible{outline:2px solid var(--accent,#c99d67);outline-offset:2px}`;
export function createOpeningPeopleEditor({doc,host,getContext,readWorldbook,getKnownNames=()=>[],getSuggestedNames=()=>[],getPalette,beforeOpen=async()=>true,onSaved=()=>{}}){
  let session=null,disposed=false;
  async function open(){
    if(disposed)return false;if(session){session.dialog.focus();return true}
    if(!await beforeOpen()||disposed)return false;if(session){session.dialog.focus();return true}
    const context=getContext(),id=context?.characterId,card=context?.characters?.[id];if(!card?.avatar)return false;
    const avatar=card.avatar,roster=readPeopleRoster(host,avatar);let closed=false,loading=false,automaticDraft=false,available=new Map();
    const active=()=>{const current=getContext();return !closed&&current?.characterId===id&&current?.characters?.[id]?.avatar===avatar};
    const el=(tag,text='')=>{const node=doc.createElement(tag);node.textContent=text;return node};
    const dialog=el('dialog');dialog.className='uos-people-editor';dialog.dataset.peopleEditor='';dialog.setAttribute('aria-label','人物列表');
    const style=el('style',CSS);dialog.append(style);
    const palette=getPalette?.();if(palette){const computed=host.getComputedStyle(palette);for(const name of ['--bg','--panel','--text','--muted','--accent','--line'])dialog.style.setProperty(name,computed.getPropertyValue(name))}
    const previousFocus=doc.activeElement;
    const close=()=>{if(closed)return;closed=true;dialog.remove();if(session?.dialog===dialog)session=null;try{previousFocus?.focus()}catch{}};
    const button=(text,fn)=>{const node=el('button',text);node.type='button';node.onclick=fn;return node};
    dialog.append(el('h2','人物列表'),el('p','勾选要保留的名字，取消勾选可移除误识别项。勾选并保存即确认身份；此后只按保留的人物及有效别名识别，名单外人物只列为待确认。作者版、玩家版与生成器共用。'),el('p','按角色保存在本机；不会修改世界书或角色卡。关闭或取消会放弃本次编辑。'));
    const status=el('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');dialog.append(status);
    const search=el('input');search.type='search';search.placeholder='搜索人物或来源';search.setAttribute('aria-label','搜索人物列表');search.dataset.peopleSearch='';dialog.append(search);
    const pendingLabel=el('label'),pendingOnly=el('input');pendingOnly.type='checkbox';pendingOnly.checked=false;pendingOnly.dataset.peoplePendingOnly='';pendingOnly.setAttribute('aria-label','只看待确认');pendingLabel.append(pendingOnly,el('span','只看待确认'));dialog.append(pendingLabel);
    const summary=el('p');summary.dataset.peopleSummary='';dialog.append(summary);
    function updateSummary(){
      const query=search.value.trim().toLocaleLowerCase();let kept=0,visible=0;
      for(const input of list.querySelectorAll('input')){
        const row=input.parentNode||input.parent;if(input.checked)kept++;
        row.hidden=!!(query&&!`${input.value} ${input.dataset.peopleSource||''}`.toLocaleLowerCase().includes(query))||pendingOnly.checked&&input.dataset.peoplePending!=='true';if(!row.hidden)visible++;
      }
      summary.textContent=automaticDraft?'保存后恢复自动识别，清除本机名单限制。':`已保留 ${kept} / ${available.size} 位 · 当前显示 ${visible} 位 · 补充 ${rosterNames(added.value).length} 位`;
    }
    search.oninput=updateSummary;pendingOnly.onchange=updateSummary;
    const list=el('div');list.className='uos-people-editor-list';dialog.append(list);
    const actions=el('div');actions.className='uos-people-editor-actions';dialog.append(actions);
    const setChecks=checked=>{automaticDraft=false;for(const input of list.querySelectorAll('input'))input.checked=checked;updateSummary()};
    const confirmPending=button('确认全部待确认',()=>{automaticDraft=false;for(const input of list.querySelectorAll('input'))input.confirmPerson?.();updateSummary()});
    const all=button('全部保留',()=>setChecks(true)),none=button('全部移除',()=>setChecks(false)),reset=button('恢复读取名单',()=>{setChecks(true);added.value='';updateSummary()}),removePending=button('移除待确认',()=>{automaticDraft=false;for(const input of list.querySelectorAll('input'))if(input.dataset.peoplePending==='true')input.checked=false;updateSummary()}),reload=button('重新读取人物',()=>{void load(true)});actions.append(all,none,confirmPending,removePending,reset,reload);
    const label=el('label','补充人物（可修改或删除）'),added=el('textarea');added.dataset.peopleAdded='';added.setAttribute('aria-label','补充人物');added.placeholder='用顿号、逗号或换行分隔';added.maxLength=30000;added.value=roster.added.join('、');added.oninput=()=>{automaticDraft=false;updateSummary()};label.append(added);dialog.append(label);
    const footer=el('div');footer.className='uos-people-editor-actions';dialog.append(footer);
    const save=button('保存并重新识别',()=>{
      if(loading||closed)return;if(!active()){status.textContent='角色已切换，请回到原角色再保存。';return}
      const excluded=roster.excluded.filter(name=>!available.has(name));for(const input of list.querySelectorAll('input'))if(!input.checked)excluded.push(input.value);
      const confirmed=[...roster.confirmed.filter(name=>!available.has(name)&&!roster.added.includes(name)),...[...list.querySelectorAll('input')].filter(input=>input.checked).map(input=>input.value)];
      try{writePeopleRoster(host,avatar,automaticDraft?{managed:false,excluded:[],added:[]}:{managed:true,confirmed,excluded,added:rosterNames(added.value)})}catch{status.textContent='本机保存失败，编辑仍保留，请稍后重试。';return}
      close();onSaved();
    });footer.append(save,button('恢复自动识别',()=>{automaticDraft=true;updateSummary()}),button('取消',close));
    async function load(refresh=false){
      if(loading||closed)return;
      const draft=new Map([...list.querySelectorAll('input')].map(input=>[input.value,{checked:input.checked,pending:input.dataset.peoplePending}]));
      loading=true;for(const node of [save,reload,all,none,reset,removePending,confirmPending])node.disabled=true;status.textContent='正在读取人物名单…';
      try{
        const result=await readWorldbook(card,{refresh});if(!active()){if(!closed)status.textContent='角色已切换，请回到原角色后重新读取。';return}
        available=new Map(result.people.map(person=>[person.name,person]));
        for(const name of rosterNames([card.data?.name||card.name,...getKnownNames(),...roster.confirmed.filter(name=>!roster.added.includes(name)),...roster.excluded]))if(!available.has(name))available.set(name,{name,sources:['角色卡'],trusted:true});
        for(const name of rosterNames(getSuggestedNames()))if(!available.has(name))available.set(name,{name,sources:['正文候选'],trusted:false});
        list.replaceChildren();for(const person of available.values()){
          const row=el('label'),input=el('input');input.type='checkbox';input.value=person.name;input.dataset.peopleKeep=person.name;input.checked=draft.has(person.name)?draft.get(person.name).checked:!roster.excluded.includes(person.name)&&(!roster.managed||roster.confirmed.includes(person.name));input.dataset.peoplePending=draft.get(person.name)?.pending??String(person.trusted===false&&!roster.confirmed.includes(person.name));input.dataset.peopleSource=person.sources?.join('；')||'';input.onchange=()=>{automaticDraft=false;updateSummary()};
          input.setAttribute('aria-label',`保留人物 ${person.name}`);row.title=person.sources?.join('；')||'';
          const nameLabel=el('span',person.name+(input.dataset.peoplePending==='true'?'（待确认）':''));row.append(input,nameLabel,el('small',' · '+(person.sources?.join('；')||'来源未标注')));
          if(input.dataset.peoplePending==='true'){
            const confirm=button('确认',()=>{input.confirmPerson();updateSummary()});confirm.setAttribute('aria-label',`确认人物 ${person.name}`);
            input.confirmPerson=()=>{automaticDraft=false;input.checked=true;input.dataset.peoplePending='false';nameLabel.textContent=person.name;confirm.hidden=true};row.append(confirm);
          }
          list.append(row);
        }
        updateSummary();status.textContent=`读取 ${result.people.length} 位世界书人物，共 ${available.size} 位候选。${result.warnings?.length?result.warnings.join('；'):''}`;
      }catch{if(!closed)status.textContent='世界书读取失败，可重新读取；仍可保存手动补充的人物。'}finally{loading=false;for(const node of [save,reload,all,none,reset,removePending,confirmPending])node.disabled=false}
    }
    dialog.addEventListener('cancel',event=>{event.preventDefault();close()});
    session={dialog,close};(doc.body||doc.documentElement).append(dialog);try{dialog.showModal();reload.focus()}catch{close();return false}void load();return true;
  }
  return {open,dispose(){disposed=true;session?.close()},close:()=>session?.close()};
}
