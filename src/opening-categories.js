// Author-assigned metadata only; no inference from greetings or worldbooks.
export function openingMetadata(entry){
  const group=typeof entry?.group==='string'?entry.group.trim().slice(0,60):'';
  const input=Array.isArray(entry?.tags)?entry.tags:typeof entry?.tags==='string'?entry.tags.split(/[,，、\n]/):[];
  const tags=[...new Set(input.filter(value=>typeof value==='string').map(value=>value.trim().slice(0,30)).filter(Boolean))].slice(0,12);
  return {group,tags};
}
export function openingFacets(rows){
  return {groups:[...new Set(rows.map(row=>row.group||''))],tags:[...new Set(rows.flatMap(row=>row.tags||[]))]};
}
export function matchesOpening(row,{query='',person='',group=null,tag=''}={}){
  if(person&&!row.names?.includes(person))return false;
  if(group!==null&&(row.group||'')!==group)return false;
  if(tag&&!row.tags?.includes(tag))return false;
  const term=query.trim().toLocaleLowerCase();
  return !term||[row.title,row.description,row.label,row.body,row.group,...(row.names||[]),...(row.tags||[])].some(value=>String(value||'').toLocaleLowerCase().includes(term));
}
export function partitionOpenings(rows,groupOrder=[]){
  if(!rows.some(row=>row.group))return [{group:null,rows}];
  const groups=new Map();
  for(const row of rows){const group=row.group||'';if(!groups.has(group))groups.set(group,[]);groups.get(group).push(row)}
  const result=[...groups].map(([group,entries])=>({group,rows:entries}));
  if(groupOrder.length){const position=group=>{const index=groupOrder.indexOf(group);return index<0?groupOrder.length:index};result.sort((a,b)=>position(a.group)-position(b.group))}
  return result;
}
