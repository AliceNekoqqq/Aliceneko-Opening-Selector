/* Read-only vocabulary from the current character's bound worldbooks. */
const WB_STRUCTURAL=/时间|地点|场景|世界观|设定|规则|系统|状态|预警|剧情|大纲|地图|机制|速览|一览|列表|名单|目录|人物关系|角色关系|档案|说明|简介|年龄|性别|职业|姓名|登场人物|在场角色|^(?:人物|角色|名称|序号|编号|身份|别名|称呼|name|character|id|content|description|location|scene|status|gender|age|(?:基本|基础|详细)?(?:信息|资料|属性|介绍|概况))$/i;
const WB_GENERIC=/^(?:哥哥|姐姐|妹妹|弟弟|父亲|母亲|老师|同学|玩家|用户|主角|配角|男主|女主|少年|少女|男人|女人|未知|不详|走廊|教室|城市|战斗|魔法|火焰|故事|开场|剧情|无|none|null)$/iu;
const WB_PROSE=/^(?:他是|她是|这是|那是|在此|每个|该人物|该角色)|负责|喜欢|拥有|来自|担任|居住|^(?:he|she|they|this|that|it|you|we)\s+(?:is|are|was|were|has|have|will|can|likes|lives)\b/iu;
const WB_PLACE=/(?:市|镇|区|街|学院|大学|医院|学校|公寓|研究所|车站|商店|便利店|安全屋|防空洞|祠堂|集团|协会)$/u;
const WB_OVERVIEW=/(?:人物|角色|NPC)[\s·・:：_-]*(?:速览|一览|概览|概况|名单|列表|总览|总表|图鉴|汇总)|登场人物|登场角色|主要人物|主要角色|人物关系一览|character\s*(?:list|overview)|\bcast\b|^(?:人物介绍|角色介绍|人物简介|角色简介)$/i;
const WB_CAST_HEADER=new RegExp(`^(?:${WB_OVERVIEW.source})$`,'i');
function wbIsOverview(value){return WB_CAST_HEADER.test(normalizePersonText(value).trim())}
const WB_PERSON_MARKER=/(?:人物|角色|人设|NPC|档案|profile|character)/i;
// Entry categories/ratings are metadata, even when they are also activation keys.
const WB_TITLE_TAG=/^(?:NSFW|SFW|R[- ]?18G?|18\+|成人向?|全年龄|限制级|色情|人物|角色|NPC|人设|人物档案|角色档案|人物资料|角色资料|人物设定|角色设定|基础设定|基础信息|详细信息|人物介绍|角色介绍|人物简介|角色简介|档案|profile|character|主要|次要|重要|主角|配角|男主|女主|基础|核心|背景|关系|设定|\d+)$/iu;
function wbTitleTag(value,learned=new Set()){const parts=String(value).trim().split(/[·・:：|｜/_]+/u);return learned.has(String(value).trim())||parts.every(part=>WB_TITLE_TAG.test(part.trim())||learned.has(part.trim()))}
const WB_NAME_FIELD='(?:姓名|全名|本名|真名|角色名|人物名|人物姓名|角色姓名|角色名称|人物名称|人名|名字|name|full[_ ]?name)';
export function normalizePersonText(value){return String(value??'').normalize('NFKC').replace(/[\u200b-\u200d\ufeff]/g,'')}
export function isPersonName(value){
  const name=normalizePersonText(value).trim();
  if(/^[\p{Script=Han}·・\s]+$/u.test(name)&&name.replace(/[·・\s]/g,'').length>12)return false;
  return !WB_STRUCTURAL.test(name)&&!wbTitleTag(name)&&/^(?=.*[\p{L}])[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Latin}\p{N}][\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Latin}\p{N}\s.'’·・\-]{0,39}$/u.test(name);
}
export function isAutomaticPersonName(value){
  const name=normalizePersonText(value).trim();
  // Possessive phrases describe something owned by a person, rather than that person's name.
  // Explicit user rules still use isPersonName and can confirm an unusual fictional name.
  return isPersonName(name)&&!WB_GENERIC.test(name)&&!/^(?:user|assistant|system|char|bot|you|me)$/iu.test(name)&&!/(?:\p{Script=Han}的(?:\p{Script=Han}|$)|['’]s\s+\p{L}|\s+(?:of|the)\s+)/iu.test(name);
}
function wbName(value){
  return normalizePersonText(value).replace(/\*\*|`/g,'').trim().replace(/^[#\s]+/,'')
    .replace(/^(?:[-*•➤]\s*|\d+[.、)]\s*|\d+\s+(?=\p{L})|\d+(?=\p{Script=Han})|[①-⑳]\s*)/u,'')
    .replace(/[（(].*$/,'').replace(/^["'“「『【\[]+|["'”」』】\]。]+$/g,'').trim();
}
function wbNames(value){return String(value??'').split(/[、，,\/;；]+/).map(wbName).filter(name=>isAutomaticPersonName(name)&&!WB_GENERIC.test(name)&&!WB_PLACE.test(name)&&!WB_PROSE.test(name))}
function wbTitle(value,learned=new Set()){
  let title=normalizePersonText(value)
    .replace(/[【\[]([^】\]]*)[】\]]/g,(_,inside)=>wbTitleTag(inside,learned)?'':`【${inside}】`)
    .replace(/^(?:[\p{Extended_Pictographic}\uFE0F\s]+|\d+[.、)]\s*)/u,'')
    .replace(/^(?:人物档案|角色档案|人物设定|角色设定|人物介绍|角色介绍|人物简介|角色简介|角色资料|人物资料|人物|角色|人设|NPC\b|character\b|profile\b)\s*[·・:：\-—_|｜/]*\s*/i,'')
    .replace(/\s*[-—_|｜:]\s*(?:人物|角色|NPC|档案|设定|基础信息|详细信息|profile).*$/i,'')
    .replace(/(?:人物介绍|角色介绍|人物设定|角色设定|人物档案|角色档案|角色资料|人物资料|人设)$/i,'').trim();
  // Strip only recognized edge categories; keep genuine middle-dot/hyphen names intact.
  for(let i=0;i<12;i++){
    const before=title;
    title=title.replace(/^(?:R[- ]?18G?|18\+)\s*[·・:：|｜/_—-]+\s*/iu,'')
      .replace(/\s*[·・:：|｜/_—-]+\s*(?:R[- ]?18G?|18\+)$/iu,'');
    const first=title.match(/^([^·・:：|｜/_—-]+)[·・:：|｜/_—-]+\s*(.*)$/u);
    if(first&&wbTitleTag(first[1],learned))title=first[2].trim();
    const last=title.match(/^(.*?)[·・:：|｜/_—-]+\s*([^·・:：|｜/_—-]+)$/u);
    if(last&&wbTitleTag(last[2],learned))title=last[1].trim();
    if(title===before)break;
  }
  // A trailing bracket after a name is a qualifier; a fully bracketed name stays intact.
  title=title.replace(/^(.+?)[【\[][^】\]]*[】\]]\s*$/u,(_,head)=>head.includes('【')?_:head);
  return wbName(title);
}
function wbTitleKeyword(title,keys){
  const text=normalizePersonText(title),matches=keys.flatMap(name=>{
    const start=text.indexOf(name);if(start<0)return [];
    const end=start+name.length;
    // A substring such as “安安” inside “林安安” is not a separate title person.
    if(/[\p{L}\p{N}]/u.test(text[start-1]||'')||/[\p{L}\p{N}]/u.test(text[end]||''))return [];
    return [name];
  });
  return [...new Set(matches)];
}
function wbFieldNames(value){
  const head=String(value).split(/\s+(?:性别|年龄|身份|职业|别名|昵称|gender|age)\s*[:=]|[|｜]/iu)[0];
  return wbNames(head);
}
function enclosingJsonObject(text,index){
  const stack=[];let quote='',escaped=false;
  for(let i=0;i<index;i++){
    const char=text[i];
    if(quote){if(escaped)escaped=false;else if(char==='\\')escaped=true;else if(char===quote)quote='';continue}
    if(stack.length&&(char==='"'||char==="'")){quote=char;continue}
    if(char==='{')stack.push(i);else if(char==='}')stack.pop();
  }
  const start=stack.at(-1);if(start==null)return null;
  let depth=0;quote='';escaped=false;
  for(let i=start;i<text.length;i++){
    const char=text[i];
    if(quote){if(escaped)escaped=false;else if(char==='\\')escaped=true;else if(char===quote)quote='';continue}
    if(char==='"'||char==="'"){quote=char;continue}
    if(char==='{')depth++;else if(char==='}'&&!--depth){
      try{return {value:JSON.parse(text.slice(start,i+1)),depth:stack.length,key:text.slice(0,start).match(/["']([\w]+)["']\s*:\s*(?:\[\s*)?$/)?.[1]||''}}catch{return null}
    }
  }
  return null;
}
// Person fields need a person scope; item/organization names and quoted examples are not identities.
function identityScope(text,index,title=''){
  const before=text.slice(0,index),object=enclosingJsonObject(text,index);
  const personHint=/(?:^|[\n{,|])\s*["']?(?:性别|外貌|性格|gender)["']?\s*[:=]|(?:^|[·:：|/\[【\s])(?:人物|角色|NPC|character|profile)(?:档案|资料|设定|简介|介绍|\b|[·:：|/\]】\s])/iu;
  if(object){
    const type=String(object.value.type||object.value['类型']||object.value['类别']||'').toLowerCase();
    if(/^(?:weapon|item|object|equipment|location|place|organization|faction|scene|物品|武器|装备|道具|地点|组织|势力)$/.test(type)||/^(?:item|weapon|inventory|equipment|location|organization|faction|items|weapons|locations|organizations)$/.test(object.key))return {person:false,blocked:true};
    const human=['性别','外貌','性格','gender'].some(key=>Object.hasOwn(object.value,key));
    object.person=human||/^(?:person|character|npc|人物|角色)$/.test(type)||/^(?:person|character|npc)$/.test(object.key);
  }
  // Use the nearest XML entity container, not a name nested inside an inventory item.
  const stack=[];
  for(const match of before.matchAll(/<\s*(\/?)\s*([\w\p{Script=Han}-]+)[^<>]*>/gu)){
    const tag=match[2].toLowerCase();
    if(match[1]){const i=stack.lastIndexOf(tag);if(i>=0)stack.splice(i)}else if(!/\/\s*>$/.test(match[0]))stack.push(tag);
  }
  if(stack.some(tag=>/^(?:example|sample|template|instructions|示例|样例|模板)$/.test(tag)))return {person:false,blocked:true};
  let xmlPerson=false;
  for(const tag of [...stack].reverse()){
    if(/^(?:example|sample|template|instructions|示例|样例|模板)$/.test(tag))return {person:false,blocked:true};
    if(/^(?:item|weapon|object|equipment|location|organization|faction|物品|武器|装备|道具|地点|组织|势力)$/.test(tag))return {person:false,blocked:true};
    if(/^(?:person|character|npc|人物|角色|人物档案|角色档案)$/.test(tag)){xmlPerson=true;break}
  }
  const heading=[...before.matchAll(/^\s*#{1,6}\s+(.+)$/gmu)].at(-1)?.[1]||'';
  if(/^(?:示例|样例|模板|填表示例|字段示例)(?:[：:\s]|$)/u.test(heading))return {person:false,blocked:true};
  if(/^(?:物品|武器|装备|道具|地点|组织|势力)(?:档案|资料|设定|图鉴|列表|名单|介绍|名称|[：:\s]|$)/u.test(heading))return {person:false,blocked:true};
  if(object?.person||xmlPerson)return {person:true,blocked:false};
  if(object&&object.depth>1)return {person:false,blocked:false};
  const nonTitle=/^(?:物品|武器|装备|道具|地点|组织|势力)(?:档案|资料|设定|图鉴|列表|名单|介绍|名称|[：:\s]|$)/u.test(title);
  const blank=before.lastIndexOf('\n\n'),paragraphStart=blank<0?0:blank+2,paragraphEnd=text.indexOf('\n\n',index);
  const paragraph=text.slice(paragraphStart,paragraphEnd<0?text.length:paragraphEnd);
  const explicitNon=/(?:^|\n)\s*(?:物品名称|武器名称|装备名称|势力名称|组织名称|场所类型)\s*[:：]/u.test(paragraph);
  if(nonTitle||explicitNon&&!personHint.test(title))return {person:false,blocked:true};
  return {person:personHint.test(title)||personHint.test(heading)||personHint.test(object?JSON.stringify(Object.fromEntries(Object.entries(object.value).filter(([,value])=>value==null||typeof value!=='object'))):paragraph),blocked:false};
}
export function allowsPersonEvidence(text,index){return !identityScope(normalizePersonText(text),index).blocked}
export function extractPersonIdentities(value,{title='',descriptions=true}={}){
  const text=normalizePersonText(value).replace(/\*\*|`/g,''),identities=[];
  const emit=(raw,field,index,kind,explicit=false)=>{
    const scope=identityScope(text,index,title);if(scope.blocked)return;
    const trusted=explicit||scope.person;
    for(const name of wbFieldNames(raw))identities.push({name,trusted,kind:trusted?kind:'通用名称字段，待确认',index});
  };
  const fields=new RegExp(`(?:^|[\\n{,，|>])\\s*(?:[-*#]\\s*)*["']?(${WB_NAME_FIELD})["']?\\s*[:：=]\\s*["']?([^\\n<>。；;"'}|]{1,160})`,'gimu');
  for(const match of text.matchAll(fields))emit(match[2],match[1],match.index+match[0].indexOf(match[1]),'姓名字段',!/^(?:name|名字)$/iu.test(match[1]));
  const tags=new RegExp(`<(${WB_NAME_FIELD.slice(3,-1)})(?:\\s[^<>]*)?>\\s*([^<>]{1,100})\\s*<\\/\\1>`,'giu');
  for(const match of text.matchAll(tags))emit(match[2],match[1],match.index,'姓名标签',!/^(?:name|名字)$/iu.test(match[1]));
  for(const match of text.matchAll(/<(?:人物|角色|person|character|npc)(?=\s|>)[^<>]*?\s(?:name|姓名|名字)=["']([^"'<>]{1,100})["'][^<>]*>/giu))emit(match[1],'姓名',match.index,'人物属性',true);
  for(const match of text.matchAll(/^\s*\|\s*([^|\n]+)\|\s*([^|\n]+)\|/gmu))if(new RegExp(`^${WB_NAME_FIELD}$`,'iu').test(match[1].trim()))emit(match[2],match[1].trim(),match.index,'姓名表格',!/^(?:name|名字)$/iu.test(match[1].trim()));
  if(descriptions)for(const match of text.matchAll(/(?:姓名(?:是|为)|全名(?:是|为)|本名(?:是|为)|(?:(?:他|她|此人|该角色|该人物)(?:的?名字)?|人物|角色)(?:名叫|叫做))\s*([^，,。.!！?？；;\n<>]{1,80})(?=[，,。.!！?？；;\n<>]|$)/gu))emit(match[1],'姓名',match.index,'姓名描述',true);
  return identities.sort((a,b)=>a.index-b.index);
}
function wbBookEvidence(records,found,diagnostics){
  const groups=new Map();
  for(const record of records){
    if(!groups.has(record.bookSource))groups.set(record.bookSource,{records:[],tags:new Set(),strong:new Set()});
    const group=groups.get(record.bookSource);group.records.push(record);
    for(const name of record.accepted)if(found.get(name)?.trusted)group.strong.add(name);
  }
  for(const group of groups.values()){
    const patterns=new Map();
    for(const record of group.records){
      if(record.overview||record.nonPerson)continue;
      const title=normalizePersonText(record.title);
      // Formatting patterns may use only already confirmed identities as anchors.
      const anchors=wbTitleKeyword(title,[...group.strong]);
      if(anchors.length!==1)continue;
      const anchor=anchors[0],start=title.indexOf(anchor),end=start+anchor.length;
      for(const match of title.matchAll(/[^·・:：|｜/_—\-【】\[\]]+/gu)){
        const token=match[0].trim();
        if(!token||group.strong.has(token)||match.index<end&&match.index+match[0].length>start)continue;
        const side=match.index<start?'before':'after',key=`${side}:${token}`;
        if(!patterns.has(key))patterns.set(key,{token,names:new Set()});patterns.get(key).names.add(anchor);
      }
    }
    // Repetition alone is insufficient: require three independently anchored identities.
    for(const pattern of patterns.values())if(pattern.names.size>=3)group.tags.add(pattern.token);
    const inferred=[...group.tags].filter(token=>!wbTitleTag(token));
    if(inferred.length)diagnostics.push({book:group.records[0].book,title:'整书标题模式',reason:`不同人物条目共享的标题分类：${inferred.join('、')}（至少 3 个独立姓名佐证，仅在本书生效）`});
    for(const record of group.records)record.bookEvidence=group;
  }
}
export function extractWorldbookPeople(books,{diagnostics=[]}={}){
  const found=new Map(),records=[];
  const add=(name,record,kind,trusted=true)=>{
    name=wbName(name);if(!isAutomaticPersonName(name)||WB_GENERIC.test(name)||WB_PLACE.test(name)||WB_PROSE.test(name))return;
    if(found.size>=1000&&!found.has(name)){record.limit=true;return}
    const person=found.get(name)||{name,aliases:[],candidateAliases:[],sources:[],trusted:false};person.trusted ||= trusted;
    const source=`${record.book} · ${record.title||'未命名条目'}（${kind}）`;
    if(!person.sources.includes(source))person.sources.push(source);found.set(name,person);record.accepted.add(name);
  };
  for(const book of books||[])for(const entry of (Array.isArray(book.entries)?book.entries:[]).slice(0,3000)){
    const title=String(entry.name||entry.comment||'').slice(0,240),content=String(entry.content||'').slice(0,100000);
    const record={book:book.name,bookSource:book,title,content,names:new Set(),accepted:new Set(),titleName:'',keys:[]};
    if(entry.enabled===false||entry.disable===true){diagnostics.push({book:book.name,title,reason:'条目已停用，未参与识别'});continue}
    records.push(record);
    const rawKeys=entry.strategy?.keys??entry.keys??entry.key??[];
    record.keys=(Array.isArray(rawKeys)?rawKeys:[]).filter(key=>typeof key==='string').flatMap(wbNames);
    const labeled=normalizePersonText(content).replace(/\*\*|`/g,'');
    record.identities=extractPersonIdentities(content,{title});
    for(const identity of record.identities){
      if(identity.trusted)record.names.add(identity.name);
      add(identity.name,record,identity.kind,identity.trusted);
    }
    record.titleName=wbTitle(title);
    if(WB_OVERVIEW.test(record.titleName)||!isPersonName(record.titleName)||WB_GENERIC.test(record.titleName)||WB_PLACE.test(record.titleName))record.titleName='';
    let overview=wbIsOverview(title),sectionLevel=0,tableNameColumn=-1,tableAliasColumn=-1;
    const overviewSource=labeled.replace(/<(example|sample|template|instructions|item|weapon|location|organization|示例|样例|模板|物品|武器|地点|组织)(?:\s[^<>]*)?>[\s\S]*?<\/\1>/giu,block=>block.replace(/[^\n]/g,' '));
    const overviewText=overviewSource.replace(/<br\s*\/?\s*>/gi,'\n').replace(/<\/?(?:p|div|li|ul|ol|h[1-6])(?:\s[^<>]*)?>/gi,'\n').replace(/<[^<>]+>/g,'');
    const overviewNames=value=>{
      const raw=String(value).trim();
      // A caption after an actual delimiter/space belongs to the description, not to the name.
      const head=raw.split(/[:|｜—]|\s+-\s+|\t/u)[0];
      const separated=head.match(/^([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}·・]{1,16})\s+(.+)$/u);
      if(separated&&(separated[2].length>=4||/(?:男|女|学生|同学|医生|护士|旅人|身份|^[(])/.test(separated[2])))return wbNames(separated[1]);
      return wbNames(head);
    };
    for(const line of overviewText.split(/\r?\n/)){
      const heading=line.match(/^\s*(#{1,6})\s*(.+)$/);
      if(heading){
        if(wbIsOverview(heading[2])){overview=true;sectionLevel=heading[1].length;tableNameColumn=-1;tableAliasColumn=-1;continue}
        const head=wbTitle(heading[2]);
        if(overview&&(WB_STRUCTURAL.test(head)||WB_PLACE.test(head)||!sectionLevel||heading[1].length<=sectionLevel)){overview=false;continue}
      }
      if(/^\s*(?:地点|地理|剧情|物品|物资|天气|规则|系统|势力|世界观)\s*[:：]/u.test(line)){overview=false;continue}
      if(/^\s*(?:人物速览|角色速览|人物名单|角色名单|登场人物|登场角色|主要人物|主要角色)\s*[:：]/u.test(line)&&!heading){overview=true;for(const name of wbNames(line.split(':').slice(1).join(':')))add(name,record,'人物速览');continue}
      if(!overview)continue;
      if(line.includes('|')){
        const cells=line.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim());
        const nameColumn=cells.findIndex(x=>new RegExp(`^(?:${WB_NAME_FIELD}|人物|角色)$`,'iu').test(wbName(x)));
        if(nameColumn>=0){tableNameColumn=nameColumn;tableAliasColumn=cells.findIndex(x=>/^(?:别名|昵称|称呼|英文名|外文名|alias(?:es)?)$/i.test(x));continue}
        if(cells.every(x=>/^[-:\s]*$/.test(x)))continue;
        if(cells.some(x=>/^(?:地点|状态|物品|物资|天气|装备)$/.test(x))){tableNameColumn=-1;tableAliasColumn=-1;continue}
        if(tableNameColumn<0)continue;
        const cell=cells[tableNameColumn];
        for(const name of overviewNames(cell)){add(name,record,'人物速览');const person=found.get(name);if(person&&tableAliasColumn>=0)person.aliases.push(...wbNames(cells[tableAliasColumn]).filter(x=>x!==name))}
        continue;
      }
      const row=line.trim().replace(/^(?:#{1,6}\s*|[-*•➤]\s*|\d+[.、)]\s*|[①-⑳]\s*)/u,'');
      if(!row||/^[^\p{L}\p{N}]*$/u.test(row))continue;
      if(!/^\s*(?:#|[-*•➤]|\d+[.、)]|[①-⑳])/.test(line)&&!/[：:|｜—、，,]/.test(row)&&row.length>40)continue;
      const explicitRow=/^\s*(?:[-*•➤]|\d+[.、)]|\d+\s*(?=\p{L})|[①-⑳])/u.test(line);
      for(const name of overviewNames(row))add(name,record,explicitRow?'人物速览名单':'速览标题／文字，待确认',explicitRow);
    }
    const personFields=/(?:性别|年龄|外貌|性格|gender|age)["']?\s*[:=]/iu.test(labeled);
    const personTitle=WB_PERSON_MARKER.test(title)&&!WB_OVERVIEW.test(title)&&!/(?:关系|规则|名单|设定集)/u.test(title);
    const nonPerson=/(?:地点|地理位置|场所类型|势力名称|物品名称)\s*:/u.test(labeled);const firstField=labeled.search(/(?:姓名|名字|["']name["'])/iu);
    record.nonPerson=(nonPerson||identityScope(labeled,firstField<0?Math.min(1,labeled.length):firstField,title).blocked)&&!record.names.size;
    Object.assign(record,{personFields,personTitle,humanDescription:/(?:(?<!其)他|她|性格|外貌|出身|身高|穿着|生于|出生|\bhe\b|\bshe\b)/iu.test(labeled),overview:wbIsOverview(title)});
  }
  // Resolve identities only after all structured names and book-wide patterns are available.
  wbBookEvidence(records,found,diagnostics);
  for(const record of records){
    const {personFields,personTitle,nonPerson}=record,tags=record.bookEvidence.tags;
    record.keys=record.keys.filter(key=>!tags.has(key));
    record.titleName=wbTitle(record.title,tags);
    record.titlePhrase=isPersonName(record.titleName)&&!isAutomaticPersonName(record.titleName);
    if(!isAutomaticPersonName(record.titleName)||WB_OVERVIEW.test(record.titleName)||WB_GENERIC.test(record.titleName)||WB_PLACE.test(record.titleName))record.titleName='';
    if(!record.names.size&&!record.overview&&(personTitle||personFields||record.keys.length)){
      const inTitle=wbTitleKeyword(record.title,record.keys);
      if(inTitle.length>1&&!record.keys.includes(record.titleName)){record.titleName='';record.ambiguousTitle=true}
      else if(inTitle.length===1&&!record.titleName)record.titleName=inTitle[0];
      else if(!record.titleName&&!inTitle.length&&(personTitle||personFields)&&record.keys.length){
        record.keywordCandidates=true;
      }
    }
    if(record.titleName&&!nonPerson&&(record.names.has(record.titleName)||found.get(record.titleName)?.trusted)){
      if(!record.names.size||record.names.has(record.titleName)){record.names.add(record.titleName);add(record.titleName,record,'已确认姓名对应标题')}
    }
  }
  // Keyword-only entries are evaluated against the completed identity set, not entry order.
  for(const record of records)if(record.keywordCandidates&&!record.nonPerson){
    // A trigger mentioning a known person cannot establish ownership of this entry's aliases.
    diagnostics.push({book:record.book,title:record.title,reason:`仅有触发关键词，不能确定人物身份或别名归属：${record.keys.join('、')}`});
  }
  // Confirm undecorated titles with the cast overview before evaluating weaker title-only candidates.
  for(const record of records){
    if(!record.names.size&&found.has(record.titleName)&&found.get(record.titleName).trusted){record.names.add(record.titleName);add(record.titleName,record,'速览对应条目')}
    if(record.names.size===1){
      const person=found.get([...record.names][0]);if(!person)continue;
      const compactName=person.name.replace(/\s+/g,'');if(compactName!==person.name&&/^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}·・]+$/u.test(compactName))person.aliases.push(compactName);
      const explicitAliases=[];
      const aliasText=normalizePersonText(record.content).replace(/\*\*|`/g,'');
      for(const match of aliasText.matchAll(/(?:^|[\n,{|])\s*[-*]?\s*["']?(?:别名|昵称|称呼|小名|曾用名|英文名|外文名|alias(?:es)?)["']?\s*[:=]\s*([^\n<>。}|]{1,100})/gimu)){
        const index=match.index+match[0].search(/别名|昵称|称呼|小名|曾用名|英文名|外文名|alias/i);
        const nearest=record.identities.filter(identity=>identity.index<index).at(-1);
        if(identityScope(aliasText,index,record.title).blocked||nearest&&nearest.name!==person.name)continue;
        explicitAliases.push(...wbNames(match[1]));
      }
      for(const alias of record.keys)if(alias!==person.name&&!explicitAliases.includes(alias)&&!person.aliases.includes(alias))person.candidateAliases.push(alias);
      for(const alias of explicitAliases)if(alias!==person.name&&!person.aliases.includes(alias))person.aliases.push(alias);
    }
  }
  for(const record of records){
    if(!record.accepted.size&&!record.nonPerson&&!/(?:物品|装备|武器|技能|组织|势力)/u.test(record.title)&&record.titleName&&!WB_STRUCTURAL.test(record.titleName)&&!WB_PROSE.test(record.titleName))add(record.titleName,record,'仅标题，待确认',false);
    if(!record.accepted.size)diagnostics.push({book:record.book,title:record.title,reason:record.limit?'人物词表已达到 1000 人上限':record.ambiguousTitle?'标题含多个姓名关键词，无法确定单一人物；可补充姓名字段':record.titlePhrase?'标题为所属短语，不作为人物姓名':'未找到有效姓名、人物速览或可用人名标题'});
  }
  // Relationship activation keys can be another person's real name, not an alias.
  for(const person of found.values())person.aliases=person.aliases.filter(alias=>isAutomaticPersonName(alias)&&!(found.get(alias)?.trusted&&alias!==person.name));
  for(const person of found.values())person.candidateAliases=[...new Set(person.candidateAliases)].filter(alias=>isAutomaticPersonName(alias)&&!person.aliases.includes(alias)&&!found.get(alias)?.trusted);
  const owners=new Map();for(const person of found.values())for(const alias of [person.name,...person.aliases]){if(!owners.has(alias))owners.set(alias,new Set());owners.get(alias).add(person.name)}
  for(const person of found.values()){person.aliases=[...new Set(person.aliases)];person.ambiguousAliases=person.aliases.filter(alias=>owners.get(alias).size>1)}
  const ordered=new Set(records.flatMap(record=>[...record.accepted]));
  return [...ordered].map(name=>found.get(name));
}
export function renderWorldbookPeopleList(doc,list,people,diagnostics=[]){
  list.className='uos-worldbook-people';list.replaceChildren();
  if(!people.length){const empty=doc.createElement('p');empty.textContent='未提取到人物名单，可查看未采纳原因或在下方填写姓名与别名。';list.append(empty)}
  for(const person of people){
    const row=doc.createElement('li'),name=doc.createElement('strong');name.textContent=`${person.name}${person.trusted===false?'（待确认）':''}`;row.append(name);
    const aliases=doc.createElement('p');aliases.textContent=`别名：${person.aliases?.join('、')||'无'}${person.ambiguousAliases?.length?`；冲突别名不自动匹配：${person.ambiguousAliases.join('、')}`:''}`;
    const source=doc.createElement('p');source.textContent=`来源：${person.sources?.join('；')||'人物名单'}`;row.append(aliases,source);list.append(row);
    if(person.candidateAliases?.length){const candidates=doc.createElement('p');candidates.textContent=`待确认关键词（未用于匹配）：${person.candidateAliases.join('、')}；可在人物与别名中确认。`;row.append(candidates)}
  }
  if(diagnostics.length){
    const row=doc.createElement('li'),details=doc.createElement('details'),summary=doc.createElement('summary');summary.textContent=`读取诊断与未采纳原因（${diagnostics.length} 条）`;details.append(summary);
    for(const item of diagnostics.slice(0,80)){const text=doc.createElement('p');text.textContent=`${item.book} · ${item.title||'未命名条目'}：${item.reason}`;details.append(text)}
    if(diagnostics.length>80){const note=doc.createElement('p');note.textContent='仅展示前 80 条未采纳条目。';details.append(note)}row.append(details);list.append(row);
  }
}
export function formatWorldbookPeopleStatus(result){
  const {people=[],books=[],boundBooks=books,entryCount=0,warnings=[]}=result;
  const trusted=people.filter(person=>person.trusted!==false).length;
  const source=boundBooks.length?`角色绑定世界书：${boundBooks.join('、')}（已读取 ${books.length}/${boundBooks.length} 本，${entryCount} 条）`:(warnings.length?'角色世界书读取不可用':'当前角色未绑定世界书');
  return `${source}；提取人物：${trusted} 人${people.length>trusted?`，待确认 ${people.length-trusted} 人`:''}${warnings.length?`；${warnings.join('；')}`:''}。${trusted?'按名单匹配全文，明确姓名标注可补充名单外人物。':'继续识别正文中的明确姓名与人物名单；未知台词署名仅列为待确认。'}`;
}
export function createWorldbookPeopleReader(helper){
  const cache=new Map();
  return async function read(card,{refresh=false}={}){
    const data=card?.data||card||{},provided=typeof helper==='function'?helper():helper;
    const sources=(Array.isArray(provided)?provided:[provided]).filter(Boolean);
    const find=method=>{const owner=sources.find(source=>typeof source[method]==='function');return owner?owner[method].bind(owner):null};
    const getNames=find('getCharWorldbookNames'),getOldNames=find('getCharLorebooks'),getPrimary=find('getCurrentCharPrimaryLorebook');
    let bindings=[],warnings=[],bindingRead=false;
    const calls=[getNames&&(()=>getNames('current')),getOldNames&&(()=>getOldNames({name:'current',type:'all'})),getPrimary&&(async()=>({primary:await getPrimary(),additional:[]}))].filter(Boolean);
    for(const getBindings of calls)try{
      const names=await getBindings();
      if(!names||typeof names!=='object'||!('primary' in names||'additional' in names))throw Error('返回格式异常');
      bindings=[...new Set([names.primary,...(Array.isArray(names.additional)?names.additional:[])].filter(x=>typeof x==='string'&&x))];bindingRead=true;break;
    }catch{}
    if(!bindingRead){
      // This is the saved binding, not the card's embedded character_book contents.
      const primary=data.extensions?.world??card?.extensions?.world;
      if(typeof primary==='string'&&primary.trim()){bindings=[primary];warnings.push('绑定接口不可用，按角色卡保存的主世界书绑定读取')}
      else warnings.push(calls.length?'无法读取角色绑定的世界书':'当前酒馆助手未提供角色世界书接口');
    }
    const getBook=find('getWorldbook'),getOldBook=find('getLorebookEntries');
    const key=JSON.stringify([card?.avatar||data.name||'',bindings,Boolean(getBook),Boolean(getOldBook)]);
    if(!refresh&&cache.has(key))return cache.get(key);
    const pending=(async()=>{
      const books=[];
      if(bindings.length&&!getBook&&!getOldBook)warnings.push('当前酒馆助手未提供世界书读取接口');
      else for(const name of bindings){
        let loaded=false,errorMessage='';
        for(const fetchBook of [getBook,getOldBook].filter(Boolean))try{
          const entries=await fetchBook(name);if(!Array.isArray(entries))throw Error('返回格式异常');
          books.push({name,entries});loaded=true;break;
        }catch(error){errorMessage=String(error?.message||error).slice(0,160)}
        if(!loaded)warnings.push(`世界书“${name}”读取失败${errorMessage?`：${errorMessage}`:''}`);
      }
      const diagnostics=[],people=extractWorldbookPeople(books,{diagnostics});
      return {people,diagnostics,worldbooks:books,books:books.map(book=>book.name),boundBooks:bindings,entryCount:books.reduce((count,book)=>count+book.entries.length,0),warnings};
    })();
    if(cache.size>=8&&!cache.has(key))cache.delete(cache.keys().next().value);
    cache.set(key,pending);const result=await pending;if(result.warnings.length&&cache.get(key)===pending)cache.delete(key);return result;
  };
}
