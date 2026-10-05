export const OPENING_CATEGORY_CSS=`
.uos-user-panel .uos-user-search,.uos .uos-search{flex-wrap:wrap}
.uos-opening-filters{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;flex:1 1 100%;width:100%;min-width:0}
.uos-opening-filters[hidden],.uos-opening-filter[hidden]{display:none!important}
.uos-opening-filter{display:flex;align-items:center;gap:8px;min-width:0;color:var(--muted);font-size:12px}
.uos-opening-filter>span{flex:none}
.uos-opening-filter select{flex:1;min-width:0;width:100%}
.uos .uos-grid[data-grouped=true],.uos-user-panel .uos-user-list[data-grouped=true]{display:block}
.uos-opening-group{min-width:0;margin:0 0 18px;border-top:1px solid var(--line)}
.uos-opening-group>summary{display:flex;align-items:center;gap:10px;padding:13px 2px;color:var(--text);font:600 15px/1.5 system-ui,sans-serif;cursor:pointer;overflow-wrap:anywhere;min-height:44px}
.uos-opening-group>summary::before{content:'▸';flex:none;color:var(--accent)}
.uos-opening-group[open]>summary::before{content:'▾'}
.uos-opening-group-title{min-width:0;flex:1}
.uos-opening-group-count{flex:none;font-size:12px;font-weight:400;color:var(--muted)}
.uos-opening-group .uos-group-grid{padding-top:2px}
.uos-opening-tags{display:flex;flex-wrap:wrap;gap:6px;margin:10px 0;color:var(--muted);font-size:11px}
.uos-opening-tags>span{padding:2px 7px;border:1px solid var(--line);border-radius:5px;max-width:100%;overflow-wrap:anywhere}
@media(max-width:480px){.uos-opening-filters{grid-template-columns:minmax(0,1fr)}.uos-opening-group>summary{font-size:14px}.uos-opening-tags{font-size:12px}}
`;
