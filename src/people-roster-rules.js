/* Pure roster policy: shared by analysis and presentation, without storage/UI. */
const name=value=>String(value??'').normalize('NFKC').replace(/[\u200b-\u200d\ufeff]/g,'').trim().slice(0,60);
export function rosterNames(value){return [...new Set((Array.isArray(value)?value.join('、'):String(value||'')).split(/[、,，;；\n/]/u).map(name).filter(Boolean))].slice(0,500)}
export function normalizePeopleRoster(value){
  const added=rosterNames(value?.added),excluded=rosterNames(value?.excluded).filter(item=>!added.includes(item));
  const managed=value?.managed===true;
  return {managed,confirmed:managed?rosterNames([...(Array.isArray(value?.confirmed)?value.confirmed:[]),...added]).filter(item=>!excluded.includes(item)):[],excluded,added};
}
export function rosterExcludesName(value,roster){return !!roster?.excluded?.includes(name(value))}
export function rosterAllowsName(value,roster){const canonical=name(value);return !rosterExcludesName(canonical,roster)&&(!roster?.managed||roster.confirmed.includes(canonical))}
export function filterRosterNames(values,roster){return rosterNames(values).filter(value=>rosterAllowsName(value,roster))}
export function applyPeopleRoster(people,value){
  const roster=normalizePeopleRoster(value),all=new Map(people.map(person=>[name(person.name),person]));
  for(const candidate of [...roster.confirmed,...roster.added])if(!all.has(candidate))all.set(candidate,{name:candidate,aliases:[],sources:['用户确认名单'],trusted:true});
  return [...all.values()].filter(person=>rosterAllowsName(person.name,roster)).map(person=>roster.managed?{...person,trusted:true}:person);
}
