import {openingFacets,partitionOpenings} from './opening-categories.js';

export function createOpeningCategoryFilters({el,onChange}){
  const element=el('div','uos-opening-filters'),groupLabel=el('label','uos-opening-filter'),tagLabel=el('label','uos-opening-filter'),group=el('select'),tag=el('select');
  group.setAttribute('aria-label','按分组筛选');tag.setAttribute('aria-label','按标签筛选');groupLabel.append(el('span','','分组'),group);tagLabel.append(el('span','','标签'),tag);element.append(groupLabel,tagLabel);group.onchange=tag.onchange=onChange;
  function options(select,values,all,format){const selected=select.value;select.replaceChildren();for(const [value,label] of [['',all],...values.map(format)]){const option=el('option','',label);option.value=value;select.append(option)}select.value=[...select.children].some(option=>option.value===selected)?selected:''}
  return {element,
    update(rows){const facets=openingFacets(rows),hasGroups=facets.groups.some(Boolean),hasTags=facets.tags.length>0;
      options(group,hasGroups?facets.groups:[],'全部分组',value=>['g:'+value,value||'未分组']);options(tag,facets.tags,'全部标签',value=>[value,value]);groupLabel.hidden=!hasGroups;tagLabel.hidden=!hasTags;element.hidden=!hasGroups&&!hasTags;
    },
    values(){return {group:group.value?.startsWith('g:')?group.value.slice(2):null,tag:tag.value||''}},
  };
}

// Collapse is a local presentation preference and does not affect card metadata.
export function createOpeningGroupRenderer({el,gridClass}){
  const collapsed=new Map();
  return {render(rows,container,appendCard,allRows=rows){
    const groups=partitionOpenings(rows,openingFacets(allRows).groups);container.dataset.grouped=String(groups.some(group=>group.group!==null));
    for(const {group,rows:entries} of groups){
      if(group===null){entries.forEach(row=>appendCard(row,container));continue}
      const section=el('details','uos-opening-group'),summary=el('summary'),grid=el('div',gridClass+' uos-group-grid');section.open=!collapsed.get(group);
      summary.append(el('span','uos-opening-group-title',group||'未分组'),el('span','uos-opening-group-count',`${entries.length} 个开场`));section.append(summary,grid);container.append(section);
      // Native toggle is queued. Remember a summary click before a fast filter rerender.
      summary.addEventListener('click',()=>{if(section.isConnected!==false)collapsed.set(group,section.open)});
      section.addEventListener('toggle',()=>{if(section.isConnected!==false)collapsed.set(group,!section.open)});
      entries.forEach(row=>appendCard(row,grid));
    }
  }};
}

export function openingTagChips(el,tags){
  if(!tags?.length)return null;
  const row=el('div','uos-opening-tags');for(const tag of tags.slice(0,3))row.append(el('span','',tag));if(tags.length>3)row.append(el('span','',`+${tags.length-3}`));return row;
}
