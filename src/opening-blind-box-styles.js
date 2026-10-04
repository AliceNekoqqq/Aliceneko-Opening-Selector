export const BLIND_BOX_CONTROL_CSS=`
:is(.uos,.uos-user-panel) .uos-blind-trigger{appearance:none!important;flex:none;display:flex!important;align-items:center;justify-content:center;gap:8px;min-height:44px;margin:0!important;padding:8px 14px!important;border:1px solid var(--accent)!important;border-radius:9px!important;background:linear-gradient(125deg,var(--surface),var(--bg))!important;color:var(--accent)!important;font:700 12px/1.5 system-ui,sans-serif!important;cursor:pointer;box-shadow:inset 0 0 16px color-mix(in srgb,var(--accent) 8%,transparent)!important;white-space:nowrap}
:is(.uos,.uos-user-panel) .uos-blind-trigger:disabled{opacity:.5;cursor:default}
:is(.uos,.uos-user-panel) .uos-blind-trigger:focus-visible{outline:2px solid var(--accent)!important;outline-offset:3px}
`;

export const BLIND_BOX_DIALOG_CSS=`
.uos-blind-box{--bg:#19131e;--surface:#2c2231;--text:#f1e7ee;--muted:#baa8b6;--accent:#d8b782;--line:#6c5264;color-scheme:dark;box-sizing:border-box;width:min(540px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:90dvh;padding:0!important;margin:auto;border:1px solid var(--line)!important;border-radius:22px!important;background:var(--bg)!important;color:var(--text)!important;box-shadow:0 28px 100px #0008;overflow:auto;font:14px/1.6 system-ui,sans-serif}
.uos-blind-box::backdrop{background:#090711bd;backdrop-filter:blur(8px)}
.uos-blind-box *{box-sizing:border-box}
.uos-blind-box [hidden]{display:none!important}
.uos-blind-box button{appearance:none!important;margin:0!important;width:auto!important;min-width:0!important;min-height:44px!important;padding:10px 14px!important;border:1px solid var(--line)!important;border-radius:10px!important;background:var(--surface)!important;color:var(--text)!important;font:600 13px/1.5 system-ui,sans-serif!important;box-shadow:none!important;cursor:pointer}
.uos-blind-box button:disabled{opacity:.45;cursor:default}
.uos-blind-box button:focus-visible{outline:2px solid var(--accent)!important;outline-offset:3px}
.uos-blind-box .uos-blind-enter{background:var(--accent)!important;border-color:var(--accent)!important;color:var(--bg)!important}
.uos-blind-header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:18px 20px;border-bottom:1px solid var(--line)}
.uos-blind-heading{margin:0;font-size:19px!important;letter-spacing:.12em;color:var(--accent)!important}
.uos-blind-kicker{margin:0;color:var(--muted);font-size:11px;letter-spacing:.16em}
.uos-blind-stage{position:relative;display:grid;place-items:center;min-height:405px;padding:26px 20px;isolation:isolate;overflow:hidden;perspective:1000px;background:radial-gradient(ellipse at center,color-mix(in srgb,var(--accent) 16%,transparent),transparent 68%)}
.uos-blind-aura{position:absolute;inset:22px 15%;border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);border-radius:50%;transform:rotate(-24deg);pointer-events:none}
.uos-blind-aura::before,.uos-blind-aura::after{content:"";position:absolute;inset:17px -26px;border:1px dashed color-mix(in srgb,var(--accent) 25%,transparent);border-radius:50%;transform:rotate(60deg)}
.uos-blind-aura::after{inset:46px -46px;transform:rotate(-60deg)}
.uos-blind-sparks{position:absolute;inset:0;pointer-events:none}
.uos-blind-spark{position:absolute;left:50%;top:50%;width:3px;height:3px;border-radius:50%;background:var(--accent);opacity:0;box-shadow:0 0 9px var(--accent)}
.uos-blind-spark:nth-child(3n){width:5px;height:5px}
.uos-blind-deck{position:relative;width:190px;height:250px;transform-style:preserve-3d;z-index:1}
.uos-blind-card{position:absolute;inset:0;display:grid;place-items:center;border:1px solid var(--accent);border-radius:15px;background:linear-gradient(145deg,var(--surface),var(--bg));box-shadow:0 8px 25px #0004,inset 0 0 35px color-mix(in srgb,var(--accent) 9%,transparent);backface-visibility:hidden;transform:translateX(calc(var(--card) * 16px)) rotate(calc(var(--card) * 8deg));color:var(--accent);font-size:48px}
.uos-blind-card::before{content:"";position:absolute;inset:10px;border:1px solid var(--line);border-radius:10px}
.uos-blind-card::after{content:"";position:absolute;width:85px;height:85px;border:1px solid var(--accent);border-radius:50%;box-shadow:0 0 0 12px color-mix(in srgb,var(--accent) 6%,transparent),0 0 0 28px color-mix(in srgb,var(--accent) 4%,transparent)}
.uos-blind-symbol{z-index:1;text-shadow:0 0 18px color-mix(in srgb,var(--accent) 40%,transparent)}
.uos-blind-result{position:relative;width:100%;z-index:2;text-align:center}
.uos-blind-cover{height:220px;width:min(100%,380px);margin:0 auto 16px;border:1px solid var(--accent);border-radius:14px;background-size:cover;background-position:center;box-shadow:0 16px 42px #0004}
.uos-blind-title{margin:0!important;color:var(--text)!important;font-size:24px!important;line-height:1.4!important;overflow-wrap:anywhere}
.uos-blind-number{margin:7px 0 0;color:var(--accent);font-size:12px}
.uos-blind-description{margin:12px auto 0;max-width:390px;color:var(--muted);white-space:pre-wrap;overflow-wrap:anywhere}
.uos-blind-status{margin:0!important;padding:0 20px 14px;text-align:center;min-height:40px;color:var(--accent)}
.uos-blind-footer{padding:16px 20px 20px;border-top:1px solid var(--line)}
.uos-blind-scope{margin:0 0 12px;color:var(--muted);font-size:12px;text-align:center}
.uos-blind-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.uos-blind-box[data-phase=shuffle] .uos-blind-card{animation:uos-blind-orbit 650ms cubic-bezier(.45,0,.55,1) infinite;animation-delay:calc(var(--card) * -130ms)}
.uos-blind-box[data-phase=shuffle] .uos-blind-aura{animation:uos-blind-ring 3s linear infinite}
.uos-blind-box[data-phase=shuffle] .uos-blind-spark{animation:uos-blind-spark 1.2s ease-out infinite;animation-delay:calc(var(--spark) * -100ms)}
.uos-blind-box[data-phase=locking] .uos-blind-card{animation:uos-blind-lock 650ms cubic-bezier(.15,.8,.2,1) both}
.uos-blind-box[data-phase=revealed] .uos-blind-spark{animation:uos-blind-burst 900ms ease-out both;animation-delay:calc(var(--spark) * 18ms)}
.uos-blind-box[data-phase=revealed] .uos-blind-result{animation:uos-blind-reveal 700ms cubic-bezier(.16,1,.3,1) both}
.uos-blind-box[data-phase=revealed] .uos-blind-aura{opacity:.4;transform:scale(1.4) rotate(-24deg);transition:transform 700ms,opacity 700ms}
@keyframes uos-blind-orbit{0%,100%{transform:translate3d(calc(var(--card) * 30px),0,calc(var(--card) * -12px)) rotateY(-25deg) rotate(calc(var(--card) * 7deg))}50%{transform:translate3d(calc(var(--card) * -32px),-16px,90px) rotateY(30deg) rotate(calc(var(--card) * -9deg))}}
@keyframes uos-blind-lock{from{transform:var(--lock-from,translate3d(0,0,0))}to{transform:translate3d(0,0,50px) rotateY(0) rotate(0)}}
@keyframes uos-blind-reveal{from{opacity:0;transform:perspective(1000px) rotateY(-75deg) scale(.83)}to{opacity:1;transform:perspective(1000px) rotateY(0) scale(1)}}
@keyframes uos-blind-burst{0%{opacity:0;transform:rotate(calc(var(--spark) * 30deg)) translateX(45px) scale(.5)}20%{opacity:.8}100%{opacity:0;transform:rotate(calc(var(--spark) * 30deg)) translateX(230px) scale(1.3)}}
@keyframes uos-blind-ring{to{transform:rotate(336deg)}}
@keyframes uos-blind-spark{from{opacity:.8;transform:rotate(calc(var(--spark) * 30deg)) translateX(55px) scale(.5)}to{opacity:0;transform:rotate(calc(var(--spark) * 30deg)) translateX(210px) scale(1)}}
@media(max-width:480px){.uos-blind-header{padding:14px}.uos-blind-stage{min-height:350px;padding:22px 14px}.uos-blind-cover{height:180px}.uos-blind-footer{padding:14px}.uos-blind-title{font-size:21px!important}.uos-blind-actions{grid-template-columns:1fr 1fr}.uos-blind-actions .uos-blind-enter{grid-column:1/-1}}
@media(prefers-reduced-motion:reduce){.uos-blind-box *{animation:none!important;transition:none!important}}
`;
