/* Local candidate vocabulary shared by author, player and generation. */
export function rosterNames(value){return [...new Set((Array.isArray(value)?value.join('、'):String(value||'')).split(/[、,，;；\n]/u).map(name=>name.trim().slice(0,60)).filter(Boolean))].slice(0,500)}
export function readPeopleRoster(host,avatar){
  let value;try{value=JSON.parse(host.localStorage.getItem(`uos_opening_cast_v1_${avatar}`))}catch{}
  return {excluded:rosterNames(value?.excluded),added:rosterNames(value?.added)};
}
export function writePeopleRoster(host,avatar,value){
  const added=rosterNames(value.added),excluded=rosterNames(value.excluded).filter(name=>!added.includes(name));
  host.localStorage.setItem(`uos_opening_cast_v1_${avatar}`,JSON.stringify({excluded,added}));return {excluded,added};
}
export function applyPeopleRoster(people,roster){
  const all=new Map(people.map(person=>[person.name,person]));
  for(const name of roster.added)if(!all.has(name))all.set(name,{name,aliases:[],sources:['手动补充'],trusted:true});
  return [...all.values()].filter(person=>!roster.excluded.includes(person.name));
}
