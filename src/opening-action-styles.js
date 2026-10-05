// Scoped action appearance is shared by the author iframe and the player host page.
// Host themes sometimes give every button an !important native-looking background.
export const OPENING_ACTION_CSS = `
:is(.uos-card-details .uos-card-preview-button,.uos-user-panel .uos-user-card .uos-user-preview-button){
 appearance:none!important;display:flex!important;align-items:center;gap:10px;width:100%!important;min-width:0;min-height:44px!important;box-sizing:border-box;
 margin:10px 0!important;padding:11px 14px!important;border:1px solid var(--line)!important;border-radius:12px!important;
 background:var(--bg)!important;background:color-mix(in srgb,var(--accent) 9%,var(--bg))!important;color:var(--accent)!important;
 box-shadow:inset 0 1px 0 #ffffff0a!important;font:600 13px/1.5 system-ui,"Noto Sans SC",sans-serif!important;letter-spacing:.035em;text-align:left;white-space:normal;cursor:pointer;
 transition:background .18s,border-color .18s,box-shadow .18s;
}
.uos-reading-icon{position:relative;flex:none;width:18px;height:16px;border:1.5px solid currentColor;border-radius:3px 3px 5px 5px;opacity:.85}
.uos-reading-icon::before{content:"";position:absolute;left:50%;top:-1px;bottom:-1px;border-left:1px solid currentColor}
.uos-reading-icon::after{content:"";position:absolute;left:3px;right:3px;top:4px;height:4px;border-top:1px solid currentColor;border-bottom:1px solid currentColor;opacity:.5}
.uos-reading-label{flex:1;min-width:0;overflow-wrap:anywhere}
.uos-reading-arrow{flex:none;font-size:18px;font-weight:400;line-height:1;opacity:.75}
:is(.uos-card-details .uos-card-preview-button,.uos-user-panel .uos-user-card .uos-user-preview-button):focus-visible{outline:2px solid var(--accent)!important;outline-offset:3px}
@media(hover:hover){:is(.uos-card-details .uos-card-preview-button,.uos-user-panel .uos-user-card .uos-user-preview-button):hover{border-color:var(--accent)!important;background:color-mix(in srgb,var(--accent) 16%,var(--bg))!important;box-shadow:0 3px 12px #0002!important;transform:none}}
:is(.uos-card-details .uos-card-preview-button,.uos-user-panel .uos-user-card .uos-user-preview-button):active{background:color-mix(in srgb,var(--accent) 22%,var(--bg))!important;transform:none}
.uos-user-panel .uos-user-card .uos-user-select{appearance:none!important;min-height:44px!important;padding:10px 16px!important;border:1px solid var(--accent)!important;border-radius:10px!important;background:var(--accent)!important;color:var(--bg)!important;font:700 13px/1.5 system-ui,"Noto Sans SC",sans-serif!important;box-shadow:none!important;cursor:pointer}
.uos-user-panel[data-theme=paper] .uos-user-card .uos-user-select{color:#fff8ec!important}
.uos-user-panel .uos-user-card .uos-user-select:disabled{background:var(--bg)!important;border-color:var(--line)!important;color:var(--muted)!important;opacity:1;cursor:default}
@media(prefers-reduced-motion:reduce){:is(.uos-card-details .uos-card-preview-button,.uos-user-panel .uos-user-card .uos-user-preview-button){transition:none}}
`;

export function decorateOpeningPreviewButton(button, el) {
  const icon=el('span','uos-reading-icon'),arrow=el('span','uos-reading-arrow','→');
  icon.setAttribute('aria-hidden','true');arrow.setAttribute('aria-hidden','true');
  button.replaceChildren(icon,el('span','uos-reading-label','预览完整正文'),arrow);
}
