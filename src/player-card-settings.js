import {openingStamp} from './opening-generation.js';
import {requestCharacterCard} from './character-card-request.js';

const KEY='universal_opening_selector';
const dataOf=card=>card?.data||card||{};
function equal(actual,expected){
  if(actual===expected)return true;
  if(!actual||!expected||typeof actual!=='object'||typeof expected!=='object')return false;
  if(Array.isArray(actual)!==Array.isArray(expected))return false;
  const keys=Object.keys(expected);
  return Object.keys(actual).length===keys.length&&keys.every(key=>Object.hasOwn(actual,key)&&equal(actual[key],expected[key]));
}

// UI owns drafts and the busy state. This transaction owns server read/write,
// conflict checks and verification, and never reports an unverified save.
export async function savePlayerCardSettings({host,getContext,identity,expectedStamp,isActive,changes}){
  const context=getContext(),card=context?.characters?.[identity.characterId];
  const currentCard=()=>{
    const current=getContext();
    return isActive()&&current?.characterId===identity.characterId
      &&current?.characters?.[identity.characterId]===card&&card?.avatar===identity.avatar;
  };
  if(!currentCard())throw Error('角色或窗口已变化，请重新打开设置；编辑仍保留。');
  if(typeof host.fetch!=='function'||typeof context.getRequestHeaders!=='function'||typeof context.writeExtensionField!=='function'){
    throw Error('当前酒馆未提供角色卡保存接口。');
  }
  const checkOpenings=target=>{
    if(openingStamp(target)!==expectedStamp)throw Error('开场列表已变化，未覆盖；请重新打开设置后再编辑。');
  };
  checkOpenings(card);
  const headers=context.getRequestHeaders();
  const read=async()=>{
    const response=await requestCharacterCard(host,'/api/characters/get',{method:'POST',headers,body:JSON.stringify({avatar_url:identity.avatar})},{readJson:true});
    if(!response.ok)throw Error(`角色卡读取失败（HTTP ${response.status}）`);
    return response.data;
  };
  const latest=await read();checkOpenings(latest);
  const original=dataOf(latest).extensions?.[KEY]||{},next={...original};
  if(Object.hasOwn(changes,'excludedTags'))next.excludedTags=changes.excludedTags;
  if(Object.hasOwn(changes,'personAliases')){
    next.personAliases=changes.personAliases;
    // Explicitly clear the legacy field: merge APIs need not delete omitted keys.
    next.excludedPersonTags='';
  }
  if(changes.edits){
    const entries=Array.isArray(original.entries)?original.entries:[];
    next.entries=entries.slice();
    for(const [index,values] of Object.entries(changes.edits)){
      const saved={...(entries[index]||{})};
      if(values.title)saved.title=values.title;else delete saved.title;
      if(Object.hasOwn(values,'names'))saved.names=values.names;else delete saved.names;
      next.entries[index]=saved;
    }
  }
  if(!currentCard())throw Error('角色或窗口已变化，未写入；编辑仍保留。');
  checkOpenings(card);
  const response=await requestCharacterCard(host,'/api/characters/merge-attributes',{
    method:'POST',headers,body:JSON.stringify({avatar:identity.avatar,data:{extensions:{[KEY]:next}}}),
  });
  if(!response.ok)throw Error(`角色卡写入失败（HTTP ${response.status}）`);
  let verified;
  try{verified=await read()}catch{
    throw Error('写入请求已提交，但服务器复核失败；请检查角色卡，当前编辑仍保留。');
  }
  if(!equal(dataOf(verified).extensions?.[KEY],next)||openingStamp(verified)!==expectedStamp){
    throw Error('写入请求已提交，但服务器复核不一致；请检查角色卡，当前编辑仍保留。');
  }
  if(!currentCard())throw Error('原角色卡已保存，但当前角色或窗口已变化，请重新打开设置。');
  checkOpenings(card);
  try{await context.writeExtensionField(identity.characterId,KEY,next)}catch{
    throw Error('服务器已保存并复核，但本机同步失败；请重新打开角色卡检查，当前编辑仍保留。');
  }
  if(!currentCard())throw Error('原角色卡已保存，但当前角色或窗口已变化，请重新打开设置。');
  return next;
}
