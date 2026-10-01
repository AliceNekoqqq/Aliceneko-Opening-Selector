/* Read-only vocabulary from the current character's bound worldbooks. */
const WB_STRUCTURAL=/时间|地点|场景|世界观|设定|规则|系统|状态|预警|剧情|大纲|地图|机制|速览|一览|列表|名单|目录|人物关系|角色关系|档案|说明|简介|年龄|性别|职业|姓名|登场人物|在场角色|^(?:人物|角色|名称|序号|编号|身份|别名|称呼|name|character|id)$/i;
const WB_GENERIC=/^(?:哥哥|姐姐|妹妹|弟弟|父亲|母亲|老师|同学|玩家|用户|主角|配角|男主|女主|少年|少女|男人|女人|未知|不详|走廊|教室|城市|战斗|魔法|火焰|故事|开场|剧情|无|none|null)$/iu;
const WB_PROSE=/^(?:他是|她是|这是|那是|在此|每个|该人物|该角色)|负责|喜欢|拥有|来自|担任|居住/u;
const WB_PLACE=/(?:市|镇|区|街|学院|大学|医院|学校|公寓|研究所|车站|商店|便利店|安全屋|防空洞)$/u;
const WB_OVERVIEW=/(?:人物|角色|NPC)(?:速览|一览|概览|名单|列表|总览)|登场人物|主要人物|character\s*(?:list|overview)|cast/i;
export function isPersonName(value){
  const name=String(value||'').trim();
  return !WB_STRUCTURAL.test(name)&&/^(?:[\p{Script=Han}]{2,12}(?:[·・][\p{Script=Han}]{1,12})*|[\p{Script=Latin}][\p{Script=Latin}\s.'’\-]{1,39})$/u.test(name);
}
function wbName(value){return String(value||'').replace(/\*\*|`/g,'').trim().replace(/^[#\s]+/,'').replace(/[（(].*$/,'').replace(/^["'“]|["'”]$/g,'').trim()}
function wbNames(value){return String(value||'').split(/[、，,\/;；]+/).map(wbName).filter(name=>isPersonName(name)&&!WB_GENERIC.test(name)&&!WB_PLACE.test(name)&&!WB_PROSE.test(name))}
export function extractWorldbookPeople(books){
  const found=new Map(),records=[];
  const add=(name,record,kind)=>{
    name=wbName(name);if(!isPersonName(name)||WB_GENERIC.test(name)||WB_PLACE.test(name)||WB_PROSE.test(name)||found.size>=200&&!found.has(name))return;
    const person=found.get(name)||{name,aliases:[],sources:[],trusted:true};
    const source=`${record.book} · ${record.title||'未命名条目'}（${kind}）`;
    if(!person.sources.includes(source))person.sources.push(source);found.set(name,person);
  };
  for(const book of books||[])for(const entry of (Array.isArray(book.entries)?book.entries:[]).slice(0,3000)){
    if(entry.enabled===false||entry.disable===true)continue;
    const title=String(entry.name||entry.comment||'').slice(0,160),content=String(entry.content||'').slice(0,100000);
    const rawKeys=entry.strategy?.keys??entry.key??[],keys=(Array.isArray(rawKeys)?rawKeys:[]).filter(key=>typeof key==='string').flatMap(wbNames);
    const record={book:book.name,title,content,keys,names:new Set(),titleName:''};records.push(record);
    // YAML, JSON, Markdown labels and XML name fields; do not treat arbitrary prose as a name.
    const labeled=content.replace(/\*\*|`/g,'');
    for(const match of labeled.matchAll(/(?:^|[\n{,，|])\s*[-*]?\s*["']?(?:姓名|角色名|人物姓名|角色姓名|名字|name)["']?\s*[：:]\s*["']?([^\n<>。；;"'}|]{1,100})/gimu)){
      for(const name of wbNames(match[1])){record.names.add(name);add(name,record,'姓名字段')}
    }
    for(const match of labeled.matchAll(/<(姓名|角色名|人物姓名|角色姓名|名字|name)>\s*([^<>]{1,100})\s*<\/\1>/giu))for(const name of wbNames(match[2])){record.names.add(name);add(name,record,'姓名字段')}
    const titleName=wbName(title.replace(/[【\[]([^】\]]*)[】\]]/g,(_,inside)=>/^(?:人物|角色|NPC|人物档案|角色档案)$/i.test(inside)?'':inside).replace(/^(?:人物档案|角色档案|人物设定|角色设定|人物|角色|NPC)\s*[：:\-—|｜]?\s*/i,'').replace(/\s*[|｜\-—：:]\s*(?:人物|角色|NPC|档案|设定).*$/i,''));
    if(wbNames(titleName).length===1)record.titleName=titleName;
    // Explicit cast sections: table column names take priority over column position.
    let overview=WB_OVERVIEW.test(title),sectionLevel=0,tableNameColumn=-1,tableAliasColumn=-1;
    for(const line of labeled.split(/\r?\n/)){
      const heading=line.match(/^\s*(#{1,6})\s+(.+)$/);
      if(heading){if(WB_OVERVIEW.test(heading[2])){overview=true;sectionLevel=heading[1].length;tableNameColumn=-1;tableAliasColumn=-1;continue}if(overview&&(WB_STRUCTURAL.test(heading[2])||WB_PLACE.test(wbName(heading[2]))||sectionLevel&&heading[1].length<=sectionLevel)){overview=false;continue}}
      if(/^\s*(?:地点|地理|剧情|物品|规则|系统|势力|世界观)\s*[：:]/u.test(line)){overview=false;continue}
      if(WB_OVERVIEW.test(line)&&!heading){overview=true;const inline=line.split(/[：:]/).slice(1).join(':');for(const name of wbNames(inline))add(name,record,'人物速览');continue}
      if(!overview)continue;
      if(/^\s*\|/.test(line)){
        const cells=line.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim());
        const nameColumn=cells.findIndex(x=>/^(?:姓名|名字|人物|角色|角色名|人物姓名|name)$/i.test(x));
        if(nameColumn>=0){tableNameColumn=nameColumn;tableAliasColumn=cells.findIndex(x=>/^(?:别名|昵称|称呼|alias(?:es)?)$/i.test(x));continue}
        if(cells.every(x=>/^[-:\s]*$/.test(x)))continue;
        const cell=tableNameColumn>=0?cells[tableNameColumn]:cells.find(x=>x&&!/^\d+$/.test(x));
        for(const name of wbNames(cell)){add(name,record,'人物速览');if(tableAliasColumn>=0){const person=found.get(name);if(person)person.aliases.push(...wbNames(cells[tableAliasColumn]).filter(x=>x!==name))}}
        continue;
      }
      const row=line.trim().replace(/^(?:#{1,6}\s*|[-*•·]\s*|\d+[.、)]\s*)/,'');
      if(!/^(?:\s*#{1,6}\s+|\s*[-*•·]\s+|\s*\d+[.、)]\s*)/.test(line)&&!/[：:|｜—、，,]/.test(row)&&!/^(?:[\p{Script=Han}]{2,4}|[\p{Script=Latin}][\p{Script=Latin} .’'\-]{1,39})$/u.test(row))continue;
      for(const name of wbNames(row.split(/[：:|｜—]/)[0]))add(name,record,'人物速览');
    }
    const personFields=/(?:性别|年龄|外貌|性格|gender|age)\s*[：:]/iu.test(labeled);
    const personTitle=/(?:人物|角色|NPC|档案)/i.test(title)&&!WB_OVERVIEW.test(title)&&!/(?:关系|规则|名单|设定集)/u.test(title);
    const nonPerson=/(?:地点|地理位置|场所类型|势力名称|物品名称)\s*[：:]/u.test(labeled);
    // A bare title requires corroboration, not just a plausible Chinese word.
    if(record.titleName&&!nonPerson&&(personTitle||personFields||record.names.has(record.titleName)||keys.includes(record.titleName)&&/(?:他|她|性格|外貌|出身|人物|角色|\bhe\b|\bshe\b)/iu.test(labeled))){
      if(!record.names.size||record.names.has(record.titleName)){record.names.add(record.titleName);add(record.titleName,record,'人物条目标题')}
    }
  }
  // An overview confirms otherwise undecorated person titles, including their keyword aliases.
  for(const record of records){
    if(!record.names.size&&found.has(record.titleName)){record.names.add(record.titleName);add(record.titleName,record,'速览对应条目')}
    if(record.names.size!==1)continue;
    const person=found.get([...record.names][0]);if(!person)continue;
    if(record.titleName&&record.titleName!==person.name&&!person.aliases.includes(record.titleName))person.aliases.push(record.titleName);
    for(const alias of record.keys)if(alias!==person.name&&!person.aliases.includes(alias))person.aliases.push(alias);
    for(const match of record.content.replace(/\*\*|`/g,'').matchAll(/(?:^|\n)\s*(?:别名|昵称|称呼|aliases?)\s*[：:]\s*([^\n<>。]{1,100})/gimu))for(const alias of wbNames(match[1]))if(alias!==person.name&&!person.aliases.includes(alias))person.aliases.push(alias);
  }
  const owners=new Map();for(const person of found.values())for(const alias of [person.name,...person.aliases]){if(!owners.has(alias))owners.set(alias,new Set());owners.get(alias).add(person.name)}
  for(const person of found.values()){person.aliases=[...new Set(person.aliases)];person.ambiguousAliases=person.aliases.filter(alias=>owners.get(alias).size>1)}
  return [...found.values()];
}
export function renderWorldbookPeopleList(doc,list,people){
  list.className='uos-worldbook-people';list.replaceChildren();
  if(!people.length){const empty=doc.createElement('p');empty.textContent='未提取到人物名单，可在下方填写姓名与别名。';list.append(empty);return}
  for(const person of people){
    const row=doc.createElement('li'),name=doc.createElement('strong');name.textContent=person.name;row.append(name);
    const aliases=doc.createElement('p');aliases.textContent=`别名：${person.aliases?.join('、')||'无'}${person.ambiguousAliases?.length?`；冲突别名不自动匹配：${person.ambiguousAliases.join('、')}`:''}`;
    const source=doc.createElement('p');source.textContent=`来源：${person.sources?.join('；')||'人物名单'}`;row.append(aliases,source);list.append(row);
  }
}
export function createWorldbookPeopleReader(helper){
  const cache=new Map();
  return async function read(card,{refresh=false}={}){
    const data=card?.data||card||{};let bindings=[],warnings=[];
    if(typeof helper?.getCharWorldbookNames==='function')try{const names=await helper.getCharWorldbookNames('current');bindings=[...new Set([names?.primary,...(Array.isArray(names?.additional)?names.additional:[])].filter(x=>typeof x==='string'&&x))]}catch{warnings.push('无法读取角色绑定的世界书')}
    else warnings.push('当前酒馆助手未提供角色世界书接口');
    const key=JSON.stringify([card?.avatar||data.name||'',bindings]);
    if(!refresh&&cache.has(key))return cache.get(key);
    const pending=(async()=>{
      const books=[];
      if(bindings.length&&typeof helper?.getWorldbook!=='function')warnings.push('当前酒馆助手未提供世界书读取接口');
      else for(const name of bindings)try{const entries=await helper.getWorldbook(name);if(Array.isArray(entries))books.push({name,entries});else warnings.push(`世界书“${name}”返回格式异常`)}catch{warnings.push(`世界书“${name}”读取失败`)}
      return {people:extractWorldbookPeople(books),books:books.map(book=>book.name),warnings};
    })();
    if(cache.size>=8&&!cache.has(key))cache.delete(cache.keys().next().value);
    cache.set(key,pending);const result=await pending;if(result.warnings.length)if(cache.get(key)===pending)cache.delete(key);return result;
  };
}
