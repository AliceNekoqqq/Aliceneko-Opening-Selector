import {readPeopleRoster,applyPeopleRoster} from './opening-people.js';
import {OPENING_SEEDS,openingNames,openingStamp,normalizeGenerationOptions,selectedWorldbookContext,buildOpeningPrompt} from './opening-generation.js';
import {createOpeningGenerationService,appendGeneratedOpening} from './opening-generation-service.js';

const CSS=`
.uos-generator{box-sizing:border-box;width:min(760px,calc(100vw - 24px));max-height:calc(100dvh - 24px);padding:0;border:1px solid var(--line,#64748b);border-radius:16px;background:var(--bg,#17252d);color:var(--text,#f4ecda);font:14px/1.6 system-ui,sans-serif;overflow:auto;overscroll-behavior:contain}.uos-generator::backdrop{background:#0009}.uos-generator *{box-sizing:border-box}.uos-generator [hidden]{display:none!important}.uos-generator-head{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 20px;border-bottom:1px solid var(--line,#64748b);background:var(--bg,#17252d)}.uos-generator h2{font-size:19px;margin:0}.uos-generator h3{font-size:16px;margin:18px 0 8px}.uos-generator-main{padding:0 20px 20px}.uos-generator p{margin:8px 0;color:var(--muted,#b7c3cc)}.uos-generator-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.uos-generator-field{display:flex;flex-direction:column;gap:5px;min-width:0;margin:10px 0}.uos-generator-field>span{font-size:13px;color:var(--muted,#b7c3cc)}.uos-generator :is(input:not([type=checkbox]),textarea,select){display:block;width:100%;min-width:0;padding:9px 10px;border:1px solid var(--line,#64748b);border-radius:8px;background:var(--panel,#23333b);color:var(--text,#f4ecda);font:inherit}.uos-generator textarea{resize:vertical;min-height:80px}.uos-generator .uos-generator-body{min-height:280px;white-space:pre-wrap}.uos-generator button{padding:8px 13px;border:1px solid var(--line,#64748b);border-radius:8px;background:var(--panel,#23333b);color:var(--text,#f4ecda);font:inherit;cursor:pointer}.uos-generator button:disabled{opacity:.5;cursor:default}.uos-generator :is(button,input,textarea,select):focus-visible{outline:2px solid var(--accent,#c99d67);outline-offset:2px}.uos-generator .uos-generator-primary{border-color:var(--accent,#c99d67);font-weight:650}.uos-generator-actions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}.uos-generator-cast{display:flex;flex-wrap:wrap;gap:6px;max-height:180px;overflow:auto}.uos-generator-person{display:flex;align-items:center;gap:5px;padding:5px 8px;border:1px solid var(--line,#64748b);border-radius:8px;overflow-wrap:anywhere}.uos-generator-person input{width:16px;height:16px;accent-color:var(--accent,#c99d67)}.uos-generator details{margin:14px 0;padding:10px 12px;border:1px solid var(--line,#64748b);border-radius:10px}.uos-generator summary{cursor:pointer}.uos-generator-status{white-space:pre-wrap;overflow-wrap:anywhere;min-height:24px}.uos-generator-review{border-top:1px solid var(--line,#64748b);margin-top:18px;padding-top:4px}.uos-generator-check{display:flex;align-items:center;gap:8px;margin:12px 0}.uos-generator small{color:var(--muted,#b7c3cc)}@media(max-width:520px){.uos-generator-grid{grid-template-columns:1fr;gap:0}.uos-generator-head{padding:12px}.uos-generator-main{padding:0 12px 12px}.uos-generator h2{font-size:17px}.uos-generator-head button{flex:none}}
`;

/* Shared author/player workshop, always hosted in the Tavern document. */
export function createOpeningGenerator({doc,host,sources,getContext,helper,readWorldbook,getPalette,getKnownNames=()=>[],onSaved=()=>{},beforeOpen=async()=>true,mode='player'}){
  let session=null,disposed=false;
  async function open(){
    if(disposed)return false;
    if(session){session.dialog.focus();return true}
    if(!await beforeOpen()||disposed)return false;
    if(session){session.dialog.focus();return true}
    const context=getContext(),card=context?.characters?.[context.characterId];
    if(!card?.avatar||context.groupId!=null&&context.groupId!==-1)return false;
    const identity={avatar:card.avatar,characterId:context.characterId,chatId:context.chatId},stamp=openingStamp(card);
    const key=`uos_opening_generator_v1_${mode}_${card.avatar}`;
    let restored={};try{restored=JSON.parse(host.localStorage.getItem(key))||{}}catch{}
    if(!restored||typeof restored!=='object')restored={};
    let options=normalizeGenerationOptions(restored.options),versions=(Array.isArray(restored.versions)?restored.versions:[]).filter(item=>typeof item?.body==='string').slice(-5).map(item=>({body:item.body.slice(0,50000),title:String(item.title||'').slice(0,100),names:openingNames(item.names)}));
    let selected=Math.max(0,Math.min(versions.length-1,Math.trunc(Number(restored.selected))||0)),worldbookResult=null,worldbookTask=null,loadingWorldbook=false,cancelBeforeRequest=false,pending=false,saving=false,closed=false,storageSaved=true;
    const service=createOpeningGenerationService(sources),dialog=doc.createElement('dialog');dialog.className='uos-generator';dialog.dataset.openingGenerator=mode;dialog.setAttribute('aria-labelledby','uos-generator-title');
    const style=doc.createElement('style');style.textContent=CSS;dialog.append(style);
    const palette=getPalette?.();if(palette){const computed=host.getComputedStyle(palette);for(const name of ['--bg','--panel','--text','--muted','--accent','--line'])dialog.style.setProperty(name,computed.getPropertyValue(name))}
    const el=(tag,text='',className='')=>{const node=doc.createElement(tag);node.className=className;node.textContent=text;return node};
    const button=(text,fn,className='')=>{const node=el('button',text,className);node.type='button';node.onclick=fn;return node};
    const heading=el('h2',mode==='author'?'辅助创作开场白':'创建新开场白');heading.id='uos-generator-title';
    const close=button('关闭',()=>requestClose()),head=el('header','','uos-generator-head');head.append(heading,close);dialog.append(head);
    const main=el('div','','uos-generator-main');dialog.append(main);
    const status=el('p','','uos-generator-status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
    const setStatus=text=>{status.textContent=text+(!storageSaved?'\n本机草稿保存不可用，请复制正文留存。':'')};
    main.append(el('p','使用当前主 API。先生成、再编辑确认，最后追加到角色卡的备用开场；不会自动进入故事。'),el('small','选项与最近 5 份草稿按角色保存在本机，不随卡分享。'));
    const controls={};
    function field(parent,name,label,{choices=null,multiline=false,placeholder='',value=options[name]}={}){
      const row=el('label','','uos-generator-field'),caption=el('span',label),input=el(choices?'select':multiline?'textarea':'input');
      if(choices)for(const [id,text] of choices){const option=el('option',text);option.value=id;input.append(option)}
      else if(!multiline)input.type='text';
      input.value=Array.isArray(value)?value.join('、'):value??'';input.placeholder=placeholder;input.setAttribute('aria-label',label);input.dataset.generationField=name;
      input.oninput=()=>{capture();persist();if(name==='names')syncCast()};row.append(caption,input);parent.append(row);controls[name]=input;return input;
    }
    main.append(el('h3','1 · 选择登场人物'));
    const cast=el('div','','uos-generator-cast'),castHint=el('p','正在读取世界书人物名单…');main.append(cast,castHint);
    field(main,'names','登场人物（可直接修改或增补）',{placeholder:'用顿号或逗号分隔；留空以当前角色为主'});
    const reload=button('重新读取人物',()=>{worldbookTask=loadWorldbook(true)});main.append(reload);
    main.append(el('h3','2 · 给故事一个起点'));
    const grid=el('div','','uos-generator-grid');main.append(grid);
    field(grid,'seed','故事种子',{choices:OPENING_SEEDS.map(([id,name])=>[id,name])});
    field(grid,'mood','氛围／文风',{placeholder:'例如：克制、轻松、悬疑、慢热'});
    field(main,'scene','时间、地点与场景',{placeholder:'可留空，让模型结合角色卡构思'});
    field(main,'relationship','人物关系／玩家身份',{placeholder:'例如：初次见面；玩家是刚到任的调查员'});
    field(main,'idea','核心事件或你想看到的画面',{multiline:true,placeholder:'例如：她拿着一封不属于自己的信，在关门前叫住了你。'});
    const advanced=el('details'),summary=el('summary','更多创作选项 · 视角、篇幅、格式与限制');advanced.append(summary);main.append(advanced);
    const more=el('div','','uos-generator-grid');advanced.append(more);
    field(more,'perspective','叙事视角',{choices:[['沿用原开场','沿用原开场'],['第三人称，称玩家为 {{user}}','第三人称 · {{user}}'],['第二人称，称玩家为“你”','第二人称 · 你'],['当前角色第一人称','角色第一人称']]});
    field(more,'length','目标篇幅',{choices:[['short','短 · 200–400 字'],['medium','中 · 500–800 字'],['long','长 · 900–1400 字']]});
    field(more,'language','输出语言',{placeholder:'支持自定义语言'});
    field(more,'preset','生成方式',{choices:[['current','沿用当前预设'],['raw','独立创作提示']]});
    advanced.append(el('small','独立创作提示保留角色、玩家与世界书资料，适合当前预设对输出格式限制较多的情况。两种方式均不读取聊天历史。'));
    const data=card.data||card,first=String(data.first_mes??card.first_mes??''),alternates=data.alternate_greetings??card.alternate_greetings??[];
    const references=mode==='author'?alternates:[first,...alternates];
    const referenceSelect=field(advanced,'referenceChoice','选择一条结构参考',{choices:[['','不使用参考'],...references.map((_,i)=>[String(i),`已有开场 ${i+1}`])],value:''});
    referenceSelect.onchange=()=>{controls.reference.value=referenceSelect.value===''?'':String(references[Number(referenceSelect.value)]||'').slice(0,6000);capture();persist()};
    field(advanced,'reference','参考原文（可编辑，最多使用前 6000 字）',{multiline:true});
    field(advanced,'format','正文格式',{choices:[['reference','沿用参考结构'],['plain','纯叙事正文'],['custom','自定义格式']]});
    field(advanced,'formatRules','自定义格式要求',{multiline:true,placeholder:'例如：<content>正文</content>，后接包含日期和地点的状态栏'});
    field(advanced,'constraints','必须遵守／避免的内容',{multiline:true,placeholder:'例如：保持某个秘密未揭晓；不要替玩家行动；避免突然改变人物关系'});
    const use=el('label','','uos-generator-check'),worldbook=el('input');worldbook.type='checkbox';worldbook.checked=options.useWorldbook;worldbook.setAttribute('aria-label','补充所选人物的世界书资料');use.append(worldbook,el('span','补充所选人物的世界书资料'));advanced.append(use);worldbook.onchange=()=>{capture();persist()};
    advanced.append(el('small','此选项控制额外补充的人物条目；主 API 仍按酒馆规则读取有效世界书。停用条目不会被额外补充。'));
    const contextPreview=el('details'),contextTitle=el('summary','查看将提交的创作要求'),promptView=el('textarea');promptView.readOnly=true;promptView.setAttribute('aria-label','将提交的创作要求');contextPreview.append(contextTitle,promptView);advanced.append(contextPreview);
    contextPreview.addEventListener('toggle',()=>{if(contextPreview.open)promptView.value=prompt()});
    const actions=el('div','','uos-generator-actions'),generate=button('生成开场白',()=>run(false),'uos-generator-primary'),stop=button('取消生成',()=>{cancelBeforeRequest=true;service.cancel();setStatus('已请求取消；正在等待主 API 结束。草稿仍保留。')});stop.hidden=true;actions.append(generate,stop);main.append(actions,status);
    const review=el('section','','uos-generator-review');main.append(review);review.append(el('h3','3 · 编辑确认后加入备用开场'));
    const versionsSelect=field(review,'versionChoice','草稿版本（保留最近 5 份）',{choices:[],value:''});
    versionsSelect.onchange=()=>{saveCandidate();selected=Number(versionsSelect.value)||0;renderCandidate();persist()};
    const title=field(review,'candidateTitle','新开场标题',{value:'',placeholder:'仅用于选择器展示'});title.maxLength=100;
    const names=field(review,'candidateNames','这份草稿的登场人物',{value:''});
    const body=field(review,'candidateBody','开场正文（保存前可自由编辑）',{multiline:true,value:''});body.classList.add('uos-generator-body');body.maxLength=50000;
    for(const input of [title,names,body])input.oninput=()=>{saveCandidate();persist();updateButtons()};
    field(review,'refinement','修改方向',{multiline:true,placeholder:'例如：保留场景，减少旁白，让两人的冲突更含蓄。'});
    const revise=button('按修改方向生成新版本',()=>run(true)),save=button('加入新建备用开场白',()=>saveOpening(),'uos-generator-primary');
    const reviewActions=el('div','','uos-generator-actions');reviewActions.append(revise,save);review.append(reviewActions,el('small','请检查人物设定、正文格式和状态栏。生成正文以文本编辑，不在此执行其中的 HTML 或脚本。'));
    function capture(){const next={...options,useWorldbook:worldbook.checked};for(const name of Object.keys(options))if(controls[name])next[name]=controls[name].value;options=normalizeGenerationOptions(next);return options}
    function saveCandidate(){if(versions[selected])versions[selected]={body:body.value,title:title.value,names:openingNames(names.value)}}
    function persist(){
      try{host.localStorage.setItem(key,JSON.stringify({options,versions,selected}));storageSaved=true}catch{storageSaved=false;setStatus('本机草稿保存不可用。请复制正文留存后再关闭。')}
    }
    function prompt(){capture();return buildOpeningPrompt(options,{worldbookContext:selectedWorldbookContext(worldbookResult,options.names),previous:body.value})}
    function syncCast(){const picked=openingNames(controls.names.value);for(const input of cast.querySelectorAll('input'))input.checked=picked.includes(input.value)}
    async function loadWorldbook(refresh=false){
      loadingWorldbook=true;reload.disabled=true;
      try{
        const result=await readWorldbook(card,{refresh});if(closed)return;if(!stillCurrent()){castHint.textContent='角色已切换，请回到原角色后重新读取人物。';return}worldbookResult=result;cast.replaceChildren();
        const saved=(data.extensions?.universal_opening_selector??card.extensions?.universal_opening_selector)||{};
        const known=openingNames([data.name||card.name,...(saved.entries||[]).map(entry=>entry.names||''),...getKnownNames()]);
        const rawPeople=new Map(result.people.map(person=>[person.name,person]));for(const name of known)if(!rawPeople.has(name))rawPeople.set(name,{name,sources:['角色卡'],trusted:true});
        const roster=readPeopleRoster(host,card.avatar),people=applyPeopleRoster([...rawPeople.values()],roster);
        controls.names.value=openingNames(controls.names.value).filter(name=>!roster.excluded.includes(name)).join('、');capture();persist();
        for(const person of people){
          const label=el('label','','uos-generator-person'),input=el('input');input.type='checkbox';input.value=person.name;input.setAttribute('aria-label',`选择人物 ${person.name}`);label.title=person.sources?.join('；')||'';
          label.append(input,el('span',person.name+(person.trusted===false?'（待确认）':'')));cast.append(label);
          input.onchange=()=>{const picked=openingNames(controls.names.value);controls.names.value=(input.checked?[...picked,person.name]:picked.filter(name=>name!==person.name)).join('、');capture();persist();syncCast()};
        }
        syncCast();castHint.textContent=`读取 ${result.people.length} 位世界书人物，候选列表保留 ${people.length} 位。可在选择器主界面的「人物列表」整理名单。${result.warnings?.length?result.warnings.join('；'):''}`;
      }catch{if(!closed)castHint.textContent='世界书读取失败，仍可手动填写人物；生成会保留角色卡背景。'}finally{loadingWorldbook=false;reload.disabled=saving}
    }
    function updateButtons(){generate.disabled=pending||saving;stop.hidden=!pending;revise.disabled=pending||saving||!body.value.trim();save.disabled=pending||saving||!body.value.trim();close.disabled=saving;for(const control of dialog.querySelectorAll('input,textarea,select'))control.disabled=saving;versionsSelect.disabled=saving||!versions.length;reload.disabled=saving||loadingWorldbook}
    function renderCandidate(){
      versionsSelect.replaceChildren();versions.forEach((_,i)=>{const option=el('option',`草稿 ${i+1}`);option.value=String(i);versionsSelect.append(option)});versionsSelect.value=String(selected);versionsSelect.disabled=!versions.length;
      const candidate=versions[selected];title.value=candidate?.title||'';names.value=candidate?.names?.join('、')||'';body.value=candidate?.body||'';review.hidden=!candidate;updateButtons();
    }
    function stillCurrent(){const current=getContext();return current?.characterId===identity.characterId&&current?.characters?.[identity.characterId]?.avatar===identity.avatar}
    async function run(refine){
      if(pending||saving)return;if(!stillCurrent()){setStatus('角色已切换，草稿仍保留；请回到原角色。');return}
      capture();saveCandidate();
      if(refine&&!options.refinement){setStatus('请先填写修改方向。');controls.refinement.focus();return}
      const requestOptions=normalizeGenerationOptions(options),previous=refine?body.value:'';
      pending=true;cancelBeforeRequest=false;updateButtons();persist();setStatus('正在使用主 API 创作开场，请稍候…');
      try{
        await worldbookTask;if(closed)return;if(cancelBeforeRequest)throw Error('已取消本次生成。');if(!stillCurrent())throw Error('角色已切换，未向主 API 提交；草稿仍保留。');
        const generated=await service.generate(requestOptions,{worldbookContext:selectedWorldbookContext(worldbookResult,requestOptions.names),previous});
        if(closed)return;
        versions.push({body:generated,title:`新开场 ${references.length+1}`,names:requestOptions.names.slice()});versions=versions.slice(-5);selected=versions.length-1;renderCandidate();persist();
        setStatus(stillCurrent()?'生成完成。请检查并编辑正文，再加入备用开场。':'生成完成，草稿已保留；角色已切换，请回到原角色再保存。');body.focus();
      }catch(error){if(!closed)setStatus(`生成未完成：${error?.message||error}`)}finally{pending=false;if(!closed)updateButtons()}
    }
    async function saveOpening(){
      if(pending||saving||!body.value.trim())return;saveCandidate();capture();persist();saving=true;updateButtons();setStatus('正在追加并复核角色卡…');
      try{
        const result=await appendGeneratedOpening({host,getContext,helper,identity,mode,expectedStamp:stamp,body:body.value,title:title.value,names:names.value});
        versions=[];selected=0;persist();finish();onSaved(result);
      }catch(error){setStatus(`保存未完成：${error?.message||error}`)}finally{saving=false;if(!closed)updateButtons()}
    }
    const previousFocus=doc.activeElement;
    function finish(){if(closed)return;closed=true;service.close();dialog.remove();if(session?.dialog===dialog)session=null;try{previousFocus?.focus()}catch{}}
    function requestClose(){
      if(saving)return false;capture();saveCandidate();persist();
      if(!storageSaved&&versions.some(item=>item.body.trim())){setStatus('草稿未能保存在本机，请先复制正文。复制后可使用下方「仍然关闭」。');if(!main.querySelector('[data-force-close]')){const force=button('仍然关闭',finish);force.dataset.forceClose='';main.append(force)}return false}
      finish();return true;
    }
    dialog.addEventListener('cancel',event=>{event.preventDefault();requestClose()});dialog.addEventListener('click',event=>{if(event.target===dialog)requestClose()});
    session={dialog,close:requestClose,dispose:()=>{capture();saveCandidate();persist();finish()},prepareForUpdate:async()=>!saving&&requestClose()};
    (doc.body||doc.documentElement).append(dialog);renderCandidate();
    try{dialog.showModal();controls.names.focus()}catch{finish();return false}
    if(versions.length)setStatus('已恢复本机草稿，可继续编辑或重新生成。');worldbookTask=loadWorldbook();return true;
  }
  return {open,dispose(){disposed=true;session?.dispose()},prepareForUpdate:async()=>session?session.prepareForUpdate():true};
}
