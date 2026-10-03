import {isPersonName,isAutomaticPersonName,normalizePersonText,allowsPersonEvidence,extractPersonIdentities} from './worldbook-people.js';
// Shared greeting analysis. No UI, storage or Tavern mutation dependencies.
export function clean(text){return String(text||'').replace(/<[^>]*>/g,' ').replace(/\{\{[^}]*\}\}/g,' ').replace(/[#*_`>\[\]()]/g,' ').replace(/\s+/g,' ').trim()}
export function excludedTags(value){return [...new Set(String(value||'').split(/[，,、\s]+/).map(x=>x.trim().replace(/^<\/?|\/>?$/g,'')).filter(x=>/^[\w\p{Script=Han}-]{1,40}$/u.test(x)))].slice(0,40)}
function stripExcluded(text,tags){for(const tag of tags){const safe=tag.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');text=text.replace(new RegExp(`<${safe}(?:\\s[^<>]*)?>[\\s\\S]*?<\\/${safe}\\s*>`,'gi'),' ').replace(new RegExp(`<${safe}(?:\\s[^<>]*)?\\/?>`,'gi'),' ')}return text}
export function narrativeStart(body,excluded=[]){
  let text=stripExcluded(String(body||''),excluded).replace(/\r\n?/g,'\n').trim();
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
export function greetingTitle(body,index,excluded=[]){
  const content=narrativeStart(body,excluded),sentence=content.match(/^.{1,64}?[。！？!?]/)?.[0];
  return sentence||(`${content.slice(0,56)}${content.length>56?'…':''}`)||`开场 ${index+1}`;
}
const NON_PERSON_TAGS=/^(?:正文|content|scene|sceneinfo|status|state|thinking|think|时间|地点|日期|天气|状态|旁白|系统|说明|剧情|备注|年龄|性别|身份|关系|职业|外貌|角色|人物|姓名|名字|角色档案|人物档案|设定|世界观|标题|简介|开场|玩家|用户)$/i;
const NON_PERSON_LABELS=/^(?:时间|地点|日期|天气|姓名|名字|人物姓名|角色名|角色姓名|登场人物|在场角色|人物|角色|正文|内容|旁白|系统|状态|说明|剧情|备注|年龄|性别|身份|关系|身高|职业|性格|外貌|你|我|她|他|玩家|用户|场景类型)$/;
const COMMON_SURNAMES='赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊甄曲封芮储靳邴松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶黎薄印宿白怀蒲台从鄂索咸籍赖卓蔺屠蒙池乔阴胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍却璩桑桂濮牛寿通边扈燕冀浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧殳沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查后荆红游竺权逯盖益桓公';
const PERSON_WORD={test:isPersonName};
export function personAliases(value){
  const result=new Map(),owners=new Map(),canonicalNames=new Set();
  for(const line of normalizePersonText(value).slice(0,1500).split(/[;；\n]+/).slice(0,40)){
    const [canonical,...rest]=line.split(/[=＝]/),name=canonical?.trim();
    if(!PERSON_WORD.test(name))continue;canonicalNames.add(name);
    for(const alias of [name,...rest.join('=').split(/[，,、/]+/).map(x=>x.trim())])if(PERSON_WORD.test(alias)){
      if(!owners.has(alias))owners.set(alias,new Set());owners.get(alias).add(name);
    }
  }
  for(const [alias,names] of owners)if(names.size===1)result.set(alias,[...names][0]);
  for(const name of canonicalNames)result.set(name,name);
  result.conflicts=[...owners].filter(([alias,names])=>names.size>1&&!canonicalNames.has(alias)).map(([alias])=>alias);
  return result;
}
export function detectGreetingPeople(body,{knownNames=[],characterName='',aliases='',worldbookPeople=null}={}){
  const text=normalizePersonText(body);
  knownNames=knownNames.map(normalizePersonText);
  characterName=normalizePersonText(characterName).trim();
  const manual=personAliases(aliases);
  const userNames=new Set([...knownNames,...manual.values()]);
  const names=[],evidence={},suggestions=[];
  const dictionary=new Map(),worldbookByName=new Map(),owners=new Map();
  for(const person of worldbookPeople||[]){
    if(!isAutomaticPersonName(person?.name))continue;worldbookByName.set(person.name,person);
    for(const alias of [person.name,...(person.aliases||[])])if(isAutomaticPersonName(alias)){
      if(!owners.has(alias))owners.set(alias,new Set());owners.get(alias).add(person.name);
    }
  }
  for(const [alias,people] of owners)if(people.size===1)dictionary.set(alias,[...people][0]);
  // Canonical names and explicit user rules take precedence over keyword aliases.
  for(const person of worldbookByName.values())dictionary.set(person.name,person.name);
  for(const name of knownNames)if(PERSON_WORD.test(name))dictionary.set(name,name);
  for(const [alias,name] of manual)dictionary.set(alias,name);
  for(const alias of manual.conflicts)if(!userNames.has(alias)&&dictionary.get(alias)!==alias)dictionary.delete(alias);
  const weakCharacterName=isAutomaticPersonName(characterName)&&!manual.conflicts.includes(characterName)&&!dictionary.has(characterName)?characterName:'';
  if(weakCharacterName)dictionary.set(weakCharacterName,weakCharacterName);
  const add=(name,source)=>{
    if((owners.get(name)?.size>1||manual.conflicts.includes(name))&&!dictionary.has(name))return;
    const canonical=dictionary.get(name)||name;
    if(!PERSON_WORD.test(canonical)||NON_PERSON_LABELS.test(canonical)||!userNames.has(canonical)&&!isAutomaticPersonName(canonical))return;
    const confirmed=userNames.has(canonical)||worldbookByName.has(canonical)&&worldbookByName.get(canonical).trusted!==false||names.includes(canonical);
    if(source!=='明确标注'&&!confirmed){
      if(!suggestions.includes(canonical))suggestions.push(canonical);return;
    }
    if(!names.includes(canonical))names.push(canonical);
    if(!evidence[canonical]||source==='明确标注')evidence[canonical]=source;
  };
  // The same scoped identity evidence is used by the worldbook reader and the opening parser.
  for(const identity of extractPersonIdentities(text,{descriptions:false})){
    if(identity.trusted)add(identity.name,'明确标注');
    else if(!suggestions.includes(identity.name))suggestions.push(identity.name);
  }
  for(const match of text.matchAll(/(?:^|[\n>])\s*(?:登场人物|在场角色)[：:]\s*([^\n<>。；;]{1,160})/gmu)){
    if(!allowsPersonEvidence(text,match.index+match[0].search(/登场人物|在场角色/u)))continue;
    for(const name of match[1].split(/[、，,\/]+/).map(x=>x.trim()))if(isAutomaticPersonName(name))add(name,'明确标注');
  }
  const lines=text.replace(/<\/?[^<>]*>/g,tag=>' '.repeat(tag.length)).split('\n'),lineOffsets=[];
  let offset=0;for(const line of lines){lineOffsets.push(offset);offset+=line.length+1}
  for(let i=0;i<lines.length;i++){
    if(!/^(?:(?:在场|出场|登场|主要|当前)?(?:角色|人物|人员|名单)|(?:角色|人物|人员)(?:名单|列表))[：:]\s*$/.test(lines[i].trim()))continue;
    if(!allowsPersonEvidence(text,lineOffsets[i]+lines[i].search(/\S/)))continue;
    for(let j=i+1;j<Math.min(i+15,lines.length);j++){
      const item=lines[j].trim().match(/^(?:[-*•·]|\d+[.、])\s*([\p{Script=Han}]{2,12})(.*)$/u);
      if(!item)break;
      if(!allowsPersonEvidence(text,lineOffsets[j]+lines[j].search(/\S/)))continue;
      const head=item[1],tail=item[2];
      // Never split a sentence into a guessed identity, or promote a name inside an owned object.
      if(/的/u.test(head)||tail&&!/^[\s:：|（(、，,]/u.test(tail))continue;
      const costume=head.match(/^(.{2,4})(?:制服|校服|便服|常服|泳装)$/u);
      const name=costume?.[1]||head;
      if(isAutomaticPersonName(name)){
        if(dictionary.has(name)||costume||[...name].length<=4)add(name,'明确标注');
        else if(!suggestions.includes(name))suggestions.push(name);
      }
    }
  }
  // An actual person's name may be used as a paired dialogue tag, e.g. <沈挽昼>别开门。</沈挽昼>.
  for(const match of text.matchAll(/<([\p{Script=Han}]{2,4})>\s*([^<>]{1,300})\s*<\/\1>/gmu)){
    if(!NON_PERSON_TAGS.test(match[1])&&(dictionary.has(match[1])||COMMON_SURNAMES.includes(match[1][0])&&/[：“”「」]/u.test(match[2]))&&/[。！？!?：“”「」]/u.test(match[2]))add(match[1],'人物标签');
  }
  for(const match of text.matchAll(/<([\p{Script=Han}]{2,4})>\s*(?=[：:“「])/gmu)){
    if(!NON_PERSON_TAGS.test(match[1])&&(dictionary.has(match[1])||COMMON_SURNAMES.includes(match[1][0])))add(match[1],'人物标签');
  }
  const story=text.replace(/<\/?[^<>]*>/g,'\n');
  for(const match of story.matchAll(/(?:^|\n)\s*(?:【|\[)?([^\n：:<>【】\[\]]{2,40})(?:】|\])?\s*[：:]\s*(?=[^\n]{1,80})/gmu)){
    if(isPersonName(match[1].trim())&&!NON_PERSON_LABELS.test(match[1].trim()))add(match[1].trim(),'台词署名');
  }
  // Scan the entire original body, including tag names, metadata, comments and code.
  // Longer names reserve their spans, preventing 王明 inside 王明月 from matching twice.
  const occupied=[];
  const blockedAliases=new Set([...manual.conflicts,...[...owners].filter(([alias,names])=>names.size>1&&!dictionary.has(alias)).map(([alias])=>alias)]);
  for(const alias of new Set([...dictionary.keys(),...blockedAliases].sort((a,b)=>b.length-a.length))){
    const canonical=dictionary.get(alias);
    const safe=alias.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    const boundary=[...alias].length===1?'[\\p{L}\\p{N}_]':/[\p{Script=Latin}\p{N}]/u.test(alias)?'[\\p{Script=Latin}\\p{N}_]':null;
    const prefix=boundary?`(?<!${boundary})`:'',suffix=boundary?`(?!${boundary})`:'';
    for(const match of text.matchAll(new RegExp(`${prefix}${safe}${suffix}`,'gu'))){
      const start=match.index,end=start+match[0].length;
      if(occupied.some(([a,b])=>start<b&&end>a))continue;
      occupied.push([start,end]);if(blockedAliases.has(alias)&&!dictionary.has(alias))continue;
      add(alias,worldbookByName.has(canonical)?'世界书匹配':'正文提及');
    }
  }
  // A name seen only before a narrative action is offered for review, not silently added to filters.
  for(const match of story.matchAll(/(?:^|[。！？!?\n])\s*([\p{Script=Han}]{2,4})(?=走|说|问|答|望|看|笑|喊|推|抱|站|坐|跑|听|握|抬|转|递)/gmu)){
    const name=match[1];if(isAutomaticPersonName(name)&&COMMON_SURNAMES.includes(name[0])&&!NON_PERSON_LABELS.test(name)&&!names.includes(name)&&!suggestions.includes(name))suggestions.push(name);
  }
  return {names,evidence,suggestions:suggestions.filter(name=>!names.includes(name)).slice(0,3)};
}
export function greetingNames(body,options){return detectGreetingPeople(body,options).names}
export function detectGreetingCollection(bodies,options={}){
  const first=bodies.map(body=>detectGreetingPeople(body,options));
  const known=[...new Set([...(options.knownNames||[]),...first.flatMap(result=>result.names.filter(name=>result.evidence[name]==='明确标注'))])];
  return bodies.map(body=>detectGreetingPeople(body,{...options,knownNames:known}));
}
export function isLegacyGeneratedEntry(body,entry,index){
  if(!entry||typeof entry!=='object')return false;
  const plain=clean(body),title=plain.slice(0,20)||`开场 ${index+1}`;
  return entry.title===title && (entry.description||'')===plain.slice(20,88);
}
