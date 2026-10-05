// The same layout vocabulary applies to author pages and ordinary-card panels.
export const OPENING_LAYOUT_CSS = `
.uos[data-layout=gallery] .uos-grid,.uos-user-panel[data-layout=gallery] .uos-user-list{grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr));align-items:start}
.uos[data-layout=gallery] .uos-card-shell .uos-cover{height:auto;aspect-ratio:16/9}
.uos-user-panel[data-layout=gallery] .uos-user-default-cover{height:auto;aspect-ratio:16/9}
.uos[data-layout=gallery] .uos-card-body,.uos-user-panel[data-layout=gallery] .uos-user-card-body{min-width:0}
.uos[data-layout=catalog] .uos-grid,.uos-user-panel[data-layout=catalog] .uos-user-list{grid-template-columns:minmax(0,1fr)}
.uos[data-layout=catalog] .uos-card-shell .uos-card{display:grid;grid-template-columns:minmax(120px,26%) minmax(0,1fr);align-items:stretch}
.uos[data-layout=catalog] .uos-card-shell .uos-cover{height:auto;min-height:160px;border-bottom:0}
.uos[data-layout=catalog] .uos-card-shell .uos-card-body{min-height:0;padding:18px 22px}
.uos-user-panel[data-layout=catalog] .uos-user-card{display:grid;grid-template-columns:minmax(110px,24%) minmax(0,1fr);gap:18px}
.uos-user-panel[data-layout=catalog] .uos-user-default-cover{height:auto;min-height:145px;margin:0}
.uos-user-panel[data-layout=catalog] .uos-user-card>.uos-user-select{grid-column:1/-1}
.uos[data-layout=dossier] .uos-grid,.uos-user-panel[data-layout=dossier] .uos-user-list{grid-template-columns:repeat(auto-fill,minmax(min(100%,280px),1fr));align-items:start}
.uos[data-layout=dossier] .uos-card-shell{border-radius:4px;border-top:3px solid var(--accent)}
.uos[data-layout=dossier] .uos-card-shell .uos-cover{height:72px;border-bottom:1px dashed var(--line)}
.uos[data-layout=dossier] .uos-card-shell .uos-number{font:600 27px/1.2 ui-monospace,monospace;letter-spacing:.08em}
.uos[data-layout=dossier] .uos-card-shell .uos-card-body{min-height:0}
.uos[data-layout=dossier] .uos-card strong,.uos-user-panel[data-layout=dossier] .uos-user-card h3{font-family:system-ui,sans-serif;font-size:18px}
.uos[data-layout=dossier] .uos-card-names,.uos-user-panel[data-layout=dossier] .uos-user-names{padding-top:12px;border-top:1px dashed var(--line)}
.uos-user-panel[data-layout=dossier] .uos-user-card{border-radius:4px;border-top:3px solid var(--accent)}
.uos-user-panel[data-layout=dossier] .uos-user-default-cover{height:72px;border-radius:2px}
.uos-user-panel[data-layout] .uos-user-card-body{min-width:0;overflow-wrap:anywhere}
.uos-user-panel[data-layout] .uos-user-card h3{padding-right:0}
.uos-layout-field{display:grid;gap:8px;color:var(--muted);font-size:12px}
.uos-layout-field select{width:100%;min-height:42px;padding:9px 12px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--text);font:inherit}
.uos-cover-settings{margin:12px 0;padding:12px;border:1px solid var(--line);border-radius:10px;color:var(--text)}
.uos-cover-settings summary{color:var(--accent);cursor:pointer;padding:4px 0}
.uos-cover-choices{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px}
.uos-cover-choice{display:grid;gap:6px;align-content:center;min-height:44px;padding:7px;border:1px solid var(--line);border-radius:7px;background:var(--panel);color:var(--text);font-size:12px}
.uos-cover-choice[aria-pressed=true]{outline:2px solid var(--accent);outline-offset:1px}
.uos-cover-thumb{display:block;aspect-ratio:16/9;background-size:cover;background-position:center;border-radius:4px;background-color:var(--bg)}
.uos-cover-focus{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin:14px 0}
.uos-cover-focus label{display:grid;gap:8px;color:var(--muted);font-size:12px}
.uos-cover-focus input{width:100%;min-width:0;min-height:30px;accent-color:var(--accent)}
.uos-layout-preview .uos-card-preview{max-width:none}
.uos-layout-preview[data-layout=gallery] .uos-cover{height:auto;aspect-ratio:16/9}
.uos-layout-preview[data-layout=catalog] .uos-card-preview{display:grid;grid-template-columns:30% minmax(0,1fr)}
.uos-layout-preview[data-layout=catalog] .uos-cover{height:auto;min-height:130px}
.uos-layout-preview[data-layout=dossier] .uos-card-preview{border-radius:4px;border-top:3px solid var(--accent)}
.uos-layout-preview[data-layout=dossier] .uos-cover{height:72px}
@media(max-width:480px){
 .uos[data-layout=gallery] .uos-grid,.uos[data-layout=dossier] .uos-grid,.uos-user-panel[data-layout=gallery] .uos-user-list,.uos-user-panel[data-layout=dossier] .uos-user-list{grid-template-columns:minmax(0,1fr)}
 .uos[data-layout=catalog] .uos-card-shell .uos-card{grid-template-columns:90px minmax(0,1fr)}
 .uos[data-layout=catalog] .uos-card-shell .uos-card-body{padding:12px}
 .uos[data-layout=catalog] .uos-card-shell .uos-cover{min-height:120px;padding:8px}
 .uos[data-layout=catalog] .uos-card-shell .uos-number{font-size:28px}
 .uos-user-panel[data-layout=catalog] .uos-user-card{grid-template-columns:80px minmax(0,1fr);gap:12px;padding:16px}
 .uos-user-panel[data-layout=catalog] .uos-user-default-cover{min-height:120px}
 .uos-cover-focus{grid-template-columns:minmax(0,1fr)}
}
`;
