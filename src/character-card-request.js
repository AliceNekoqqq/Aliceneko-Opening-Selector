// Bound both the request and JSON body read. Aborting client waiting cannot
// undo a server write, so callers must preserve drafts and report uncertainty.
export async function requestCharacterCard(host,url,options,{readJson=false,timeoutMs=60000}={}){
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
