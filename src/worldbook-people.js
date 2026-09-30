/* Read-only character worldbook vocabulary. Names are candidates until found in a greeting. */
const WB_STRUCTURAL=/时间|地点|场景|世界观|设定|规则|系统|状态|预警|剧情|大纲|地图|机制|速览|一览|列表|名单|目录|人物关系|角色关系|档案|说明|简介|年龄|性别|职业|姓名|登场人物|在场角色|^(?:人物|角色|名称|序号|编号|身份|别名|称呼|name|character|id)$/i;
export function isPersonName(value){
  const name=String(value||'').trim();
  return !WB_STRUCTURAL.test(name)&&/^(?:[\p{Script=Han}]{2,12}(?:[·・][\p{Script=Han}]{1,12})*|[\p{Script=Latin}][\p{Script=Latin}\s.'’\-]{1,39})$/u.test(name);
}
function wbName(value){return String(value||'').replace(/\*\*|`/g,'').trim().replace(/^[#\s]+/,'').replace(/[（(].*$/,'').trim()}
function wbNames(value){return String(value||'').split(/[、，,\/;；]+/).map(wbName).filter(isPersonName)}
export function extractWorldbookPeople(books){
  const found=new Map();
  const add=(name,book,entry,kind,aliases=[])=>{
    name=wbName(name);if(!isPersonName(name))return;
    if(found.size>=200&&!found.has(name)){
      const weak=[...found].find(([,person])=>!person.trusted);
      if(kind==='条目标题'||!weak)return;found.delete(weak[0]);
    }
    const person=found.get(name)||{name,aliases:[],sources:[],trusted:false};
    if(kind!=='条目标题')person.trusted=true;
    for(const alias of aliases.map(wbName))if(isPersonName(alias)&&alias!==name&&!/^(?:哥哥|姐姐|妹妹|弟弟|父亲|母亲|老师|同学|玩家|用户)$/u.test(alias)&&!person.aliases.includes(alias))person.aliases.push(alias);
    const source=`${book} · ${entry}（${kind}）`;if(!person.sources.includes(source))person.sources.push(source);
    found.set(name,person);
  };
  for(const book of books||[])for(const entry of (Array.isArray(book.entries)?book.entries:[]).slice(0,3000)){
    if(entry.enabled===false||entry.disable===true)continue;
    const title=String(entry.name??entry.comment??'').slice(0,160),content=String(entry.content||'').slice(0,20000);
    const keys=entry.strategy?.keys??entry.key??[],entryNames=new Set();
    for(const match of content.matchAll(/(?:^|[\n{,，])\s*["']?(?:姓名|角色名|人物姓名|角色姓名|名字|name)["']?\s*[：:]\s*["']?([^\n<>。；;"'}]{1,100})/gimu)){
      const name=wbNames(match[1])[0];if(name){entryNames.add(name);add(name,book.name,title||'未命名条目','姓名字段')}
    }
    const personTitle=/(?:人物|角色|NPC|档案)/i.test(title)||/(?:姓名|性别|年龄|角色名)[：:]/u.test(content);
    const titleName=wbName(title.replace(/[【\[]([^】\]]*)[】\]]/g,(_,inside)=>/^(?:人物|角色|NPC|人物档案|角色档案)$/i.test(inside)?'':inside).replace(/^(?:人物档案|角色档案|人物设定|角色设定|人物|角色|NPC)\s*[：:\-—|｜]?\s*/i,'').replace(/\s*[|｜\-—：:]\s*(?:人物|角色|NPC|档案|设定).*$/i,''));
    if(isPersonName(titleName)&&!/(?:市|镇|区|街|学院|大学|医院|学校|公寓|研究所|车站|商店|便利店|安全屋|防空洞)$/u.test(titleName)&&!( !personTitle&&/(?:地点|地理位置|场所类型)[：:]/u.test(content))){
      add(titleName,book.name,title,personTitle?'人物条目标题':'条目标题');if(personTitle)entryNames.add(titleName);
    }
    // A dedicated cast overview may use bullets, headings or a Markdown table.
    let overview=/(?:人物|角色|NPC)(?:速览|一览|概览|名单|列表|总览)|登场人物/i.test(title);
    for(const line of content.split(/\r?\n/)){
      if(/^\s*#{1,6}\s*(?:地点|地理|剧情|物品|规则|系统|势力|世界观)/u.test(line)){overview=false;continue}
      if(/(?:人物|角色|NPC)(?:速览|一览|概览|名单|列表|总览)|登场人物/.test(line)){
        overview=true;const inline=line.split(/[：:]/).slice(1).join(':');for(const name of wbNames(inline))add(name,book.name,title,'人物速览');continue;
      }
      if(!overview)continue;
      const row=line.trim().replace(/^(?:#{1,6}\s*|[-*•·]\s*|\d+[.、]\s*)/,'');
      const cell=row.startsWith('|')?row.split('|').slice(1).find(x=>x.trim()&&!/^\d+$/.test(x.trim())):row.split(/[：:|｜—]/)[0];
      const name=wbName(cell);if(isPersonName(name))add(name,book.name,title,'人物速览');
    }
    // Trigger words become aliases only for an identified person entry, never for generic entries.
    if(entryNames.size===1){const name=[...entryNames][0];add(name,book.name,title,'人物条目',Array.isArray(keys)?keys.filter(x=>typeof x==='string'):[])}
  }
  return [...found.values()];
}
export function createWorldbookPeopleReader(helper){
  const cache=new Map();
  return async function read(card,{refresh=false}={}){
    const data=card?.data||card||{},embedded=data.character_book?.entries||card?.character_book?.entries;
    let bindings=[],warnings=[];
    if(typeof helper?.getCharWorldbookNames==='function')try{const names=await helper.getCharWorldbookNames('current');bindings=[...new Set([names?.primary,...(names?.additional||[])].filter(x=>typeof x==='string'&&x))].slice(0,12)}catch{warnings.push('无法读取角色绑定的世界书')}
    else warnings.push('当前酒馆助手未提供角色世界书接口');
    const key=JSON.stringify([card?.avatar||data.name||'',bindings,embedded]);
    if(!refresh&&cache.has(key))return cache.get(key);
    const pending=(async()=>{
      const books=[];
      if(Array.isArray(embedded))books.push({name:data.character_book?.name||'卡内世界书',entries:embedded});
      if(bindings.length&&typeof helper?.getWorldbook!=='function')warnings.push('当前酒馆助手未提供世界书读取接口');
      else for(const name of bindings)try{const entries=await helper.getWorldbook(name);if(Array.isArray(entries))books.push({name,entries});else warnings.push(`世界书“${name}”返回格式异常`)}catch{warnings.push(`世界书“${name}”读取失败`)}
      const people=extractWorldbookPeople(books);
      return {people,books:books.map(book=>book.name),warnings};
    })();
    if(cache.size>=8&&!cache.has(key))cache.delete(cache.keys().next().value);
    cache.set(key,pending);const result=await pending;if(result.warnings.length)cache.delete(key);return result;
  };
}
