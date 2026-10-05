const STORAGE_KEY='uos_player_floating_style_v1';
const normalize=value=>value==='simple'?'simple':'mascot';

export function createPlayerTriggerStylePreference(host) {
  let value='mascot';
  try{value=normalize(host?.localStorage?.getItem(STORAGE_KEY))}catch{}
  return {
    get(){return value},
    set(next){
      value=normalize(next);
      try{host?.localStorage?.setItem(STORAGE_KEY,value);return {value,saved:true}}
      catch{return {value,saved:false}}
    },
  };
}
