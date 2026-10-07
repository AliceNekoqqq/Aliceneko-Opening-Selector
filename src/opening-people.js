import {normalizePeopleRoster} from './people-roster-rules.js';
export {rosterNames,applyPeopleRoster,filterRosterNames,rosterExcludesName} from './people-roster-rules.js';
export function readPeopleRoster(host,avatar){
  let value;try{value=JSON.parse(host.localStorage.getItem(`uos_opening_cast_v1_${avatar}`))}catch{}
  return normalizePeopleRoster(value);
}
export function writePeopleRoster(host,avatar,value){
  const roster=normalizePeopleRoster(value);
  host.localStorage.setItem(`uos_opening_cast_v1_${avatar}`,JSON.stringify(roster));return roster;
}
