// Identities follow original text, not display titles or filtered positions.
export function openingFavoriteKeys(bodies){
  const occurrences=new Map();
  return bodies.map(value=>{
    const body=String(value||'');if(!body)return null;
    let a=2166136261,b=0x9e3779b9;
    for(let i=0;i<body.length;i++){const code=body.charCodeAt(i);a=Math.imul(a^code,16777619);b=Math.imul(b^code,0x85ebca6b)}
    const base=(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0')+':'+body.length;
    const occurrence=occurrences.get(base)||0;occurrences.set(base,occurrence+1);return base+':'+occurrence;
  });
}
const validKey=key=>typeof key==='string'&&/^[0-9a-f]{16}:\d{1,10}:\d{1,10}$/.test(key);

export function createOpeningFavorites(host,avatar){
  const storageKey=avatar?'uos_favorites_v1_'+encodeURIComponent(String(avatar)):null;
  let memory=new Set(),lastBodies=[],lastKeys=[];const pending=new Map();
  function snapshot(){
    try{
      const raw=storageKey&&host?.localStorage?.getItem(storageKey);
      if(raw!=null){const value=JSON.parse(raw);memory=new Set(value?.version===1&&Array.isArray(value.keys)?value.keys.filter(validKey).slice(0,5000):[])}
    }catch{}
    for(const [key,selected] of pending){if(selected)memory.add(key);else memory.delete(key)}
    return new Set(memory);
  }
  return {
    keys(bodies){
      if(bodies.length!==lastBodies.length||bodies.some((body,i)=>body!==lastBodies[i])){lastBodies=bodies.slice();lastKeys=openingFavoriteKeys(bodies)}
      return lastKeys.slice();
    },
    snapshot,
    toggle(key){
      if(!validKey(key))return {selected:false,persisted:false};
      const next=snapshot(),selected=!next.has(key);if(selected)next.add(key);else next.delete(key);memory=next;
      let persisted=false;
      try{if(storageKey&&host?.localStorage){host.localStorage.setItem(storageKey,JSON.stringify({version:1,keys:[...next]}));persisted=true;pending.clear()}}catch{}
      if(!persisted)pending.set(key,selected);
      return {selected,persisted};
    },
  };
}
