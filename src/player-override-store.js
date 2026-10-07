// A verified card save takes precedence over stale local overrides. If storage
// cannot clear them, remember that decision for this runtime and retry on read.
export function createPlayerOverrideStore(host){
  const pendingClear=new Set();
  function clear(key){
    try{
      host.localStorage.removeItem(key);pendingClear.delete(key);return true;
    }catch{
      try{
        host.localStorage.setItem(key,'');pendingClear.delete(key);return true;
      }catch{pendingClear.add(key);return false}
    }
  }
  return {
    read(key){
      if(pendingClear.has(key)&&!clear(key))return null;
      try{return host.localStorage.getItem(key)}catch{return null}
    },
    write(key,value){
      host.localStorage.setItem(key,value);pendingClear.delete(key);
    },
    clear,hasPending:key=>pendingClear.has(key),
  };
}
