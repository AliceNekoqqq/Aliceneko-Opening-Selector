/* Pure roster policy: shared by analysis and presentation, without storage/UI. */
const name=value=>String(value??'').normalize('NFKC').replace(/[\u200b-\u200d\ufeff]/g,'').trim().slice(0,60);
export const PEOPLE_ROSTER_LIMIT=500;
export function rosterNames(value,limit=PEOPLE_ROSTER_LIMIT){
  return [...new Set((Array.isArray(value)?value.join('、'):String(value||''))
    .split(/[、,，;；\n/]/u).map(name).filter(Boolean))].slice(0,limit);
}
export function normalizePeopleRoster(value,limit=PEOPLE_ROSTER_LIMIT){
  const added=rosterNames(value?.added,limit);
  const deleted=rosterNames(value?.deleted,limit).filter(item=>!added.includes(item));
  const excluded=rosterNames([...(Array.isArray(value?.excluded)?value.excluded:[]),...deleted],limit)
    .filter(item=>!added.includes(item));
  const managed=value?.managed===true;
  return {managed,confirmed:managed?rosterNames([...(Array.isArray(value?.confirmed)?value.confirmed:[]),...added],limit)
    .filter(item=>!excluded.includes(item)):[],excluded,added,deleted};
}
export function validatePeopleRoster(value){
  // Validate the effective unions before applying the defensive read limit.
  const roster=normalizePeopleRoster(value,Infinity);
  const labels={confirmed:'保留人物',excluded:'排除人物（含删除）',added:'补充人物',deleted:'删除人物'};
  for(const [key,label] of Object.entries(labels)){
    if(roster[key].length>PEOPLE_ROSTER_LIMIT){
      const error=new RangeError(`${label}有 ${roster[key].length} 位，最多 ${PEOPLE_ROSTER_LIMIT} 位；请调整后再保存，当前编辑仍保留。`);
      error.code='PEOPLE_ROSTER_LIMIT';throw error;
    }
  }
  return roster;
}
export function rosterExcludesName(value,roster){return !!roster?.excluded?.includes(name(value))}
export function rosterAllowsName(value,roster){const canonical=name(value);return !rosterExcludesName(canonical,roster)&&(!roster?.managed||roster.confirmed.includes(canonical))}
export function filterRosterNames(values,roster){return rosterNames(values).filter(value=>rosterAllowsName(value,roster))}
export function applyPeopleRoster(people,value){
  const roster=normalizePeopleRoster(value),all=new Map(people.map(person=>[name(person.name),person]));
  for(const candidate of [...roster.confirmed,...roster.added])if(!all.has(candidate))all.set(candidate,{name:candidate,aliases:[],sources:['用户确认名单'],trusted:true});
  return [...all.values()].filter(person=>rosterAllowsName(person.name,roster)).map(person=>roster.managed?{...person,trusted:true}:person);
}
