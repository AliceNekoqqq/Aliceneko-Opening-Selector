// Bound both the request and JSON body read. Aborting client waiting cannot
// undo a server write, so callers must preserve drafts and report uncertainty.
export function characterAttributeUpdate(changes){
  // /merge-attributes merges a whole card, not its V2 data object. Keep
  // compatibility fields and canonical data in sync; arrays are replaced.
  if(!changes||typeof changes!=='object'||Array.isArray(changes)||Object.hasOwn(changes,'data'))return changes;
  const canonical={};for(const key of ['first_mes','alternate_greetings','extensions'])if(Object.hasOwn(changes,key))canonical[key]=changes[key];
  return Object.keys(canonical).length?{...changes,data:canonical}:changes;
}
export async function requestCharacterCard(host,url,options,{readJson=false,timeoutMs=60000}={}){
  if(url.endsWith('/merge-attributes')&&typeof options.body==='string'){
    const payload=JSON.parse(options.body);options={...options,body:JSON.stringify({...payload,data:characterAttributeUpdate(payload.data)})};
  }
  const controller=new AbortController();
  const schedule=host.setTimeout?.bind(host)||globalThis.setTimeout;
  const cancel=host.clearTimeout?.bind(host)||globalThis.clearTimeout;
  let timer;
  const deadline=new Promise((_,reject)=>{
    timer=schedule(()=>{
      const writing=url.endsWith('/merge-attributes');
      const error=new Error(writing
        ?'角色卡写入等待超时；请求可能已提交，请检查角色卡，当前编辑仍保留。'
        :'角色卡读取等待超时，当前编辑仍保留；请稍后重试。');
      error.code='CHARACTER_REQUEST_TIMEOUT';reject(error);controller.abort();
    },timeoutMs);
  });
  const request=async()=>{
    const response=await host.fetch(url,{...options,signal:controller.signal});
    if(!readJson)return response;
    return {ok:response.ok,status:response.status,data:response.ok?await response.json():undefined};
  };
  try{return await Promise.race([request(),deadline])}
  finally{cancel(timer)}
}
