export const OPENING_FAVORITES_CSS=`
:is(.uos,.uos-user-panel) .uos-favorites-filter{appearance:none!important;flex:none;min-height:44px;margin:0!important;padding:8px 12px!important;border:1px solid var(--line)!important;border-radius:9px!important;background:var(--bg)!important;color:var(--accent)!important;font:600 12px/1.5 system-ui,sans-serif!important;cursor:pointer;white-space:nowrap;box-shadow:none!important}
:is(.uos,.uos-user-panel) .uos-favorites-filter[aria-pressed=true]{border-color:var(--accent)!important;box-shadow:inset 0 0 0 1px var(--accent)!important}
:is(.uos,.uos-user-panel) .uos-card-actions{display:flex;align-items:stretch;gap:8px;min-width:0}
.uos-user-panel .uos-user-card-actions{margin:10px 0}
:is(.uos,.uos-user-panel) .uos-card-actions :is(.uos-card-preview-button,.uos-user-preview-button){flex:1 1 0;min-width:0;margin:0!important}
:is(.uos,.uos-user-panel) .uos-opening-favorite{appearance:none!important;display:grid;place-items:center;flex:none;width:44px!important;min-height:44px!important;box-sizing:border-box!important;margin:0!important;padding:6px!important;border:1px solid var(--line)!important;border-radius:12px!important;background:var(--bg)!important;color:var(--accent)!important;font:22px/1 system-ui,sans-serif!important;cursor:pointer;box-shadow:none!important}
:is(.uos,.uos-user-panel) .uos-opening-favorite[aria-pressed=true]{border-color:var(--accent)!important;background:color-mix(in srgb,var(--accent) 12%,var(--bg))!important}
:is(.uos,.uos-user-panel) :is(.uos-opening-favorite,.uos-favorites-filter):focus-visible{outline:2px solid var(--accent)!important;outline-offset:3px}
.uos-user-panel[data-layout=catalog] .uos-user-card>.uos-user-card-actions{grid-column:1/-1}
.uos-user-panel .uos-user-search{flex-wrap:wrap}
@media(max-width:600px){.uos:not([data-layout=catalog]) .uos-card-actions .uos-card-preview-button{gap:0;padding:8px!important;font-size:12px!important}.uos:not([data-layout=catalog]) .uos-card-actions :is(.uos-reading-icon,.uos-reading-arrow){display:none}}
`;
