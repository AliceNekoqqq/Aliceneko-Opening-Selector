export const BLIND_BOX_CONTROL_CSS=`
:is(.uos,.uos-user-panel) .uos-blind-trigger{appearance:none!important;position:relative;isolation:isolate;overflow:hidden;box-sizing:border-box;flex:1 0 100%;width:100%!important;min-width:0!important;display:flex!important;align-items:center;justify-content:flex-start;gap:12px;min-height:94px;margin:2px 0 0!important;padding:10px 18px 10px 8px!important;border:1px solid color-mix(in srgb,var(--accent) 60%,var(--line))!important;border-radius:17px!important;background:radial-gradient(ellipse at 6% 60%,color-mix(in srgb,var(--accent) 18%,transparent),transparent 60%),linear-gradient(115deg,var(--surface),var(--bg))!important;color:var(--text)!important;font:500 13px/1.5 system-ui,sans-serif!important;text-align:left!important;cursor:pointer;box-shadow:inset 0 1px 0 color-mix(in srgb,var(--accent) 22%,transparent),0 5px 18px color-mix(in srgb,var(--accent) 7%,transparent)!important;white-space:normal!important;transition:border-color .25s,box-shadow .25s,transform .25s!important}
:is(.uos,.uos-user-panel) .uos-blind-trigger::before{content:"";position:absolute;inset:7px;border:1px solid color-mix(in srgb,var(--accent) 14%,transparent);border-radius:11px;pointer-events:none;z-index:-1}
:is(.uos,.uos-user-panel) .uos-blind-trigger::after{content:"";position:absolute;inset:-60% -20%;background:linear-gradient(110deg,transparent 42%,color-mix(in srgb,var(--accent) 13%,transparent) 49%,transparent 56%);transform:translateX(-85%);animation:uos-blind-entrance-sheen 8s ease-in-out infinite;pointer-events:none;z-index:-1}
:is(.uos,.uos-user-panel) .uos-blind-trigger-art{position:relative;flex:none;width:88px;height:74px;display:grid;place-items:center;animation:uos-blind-entrance-float 5s ease-in-out infinite;filter:drop-shadow(0 3px 9px color-mix(in srgb,var(--accent) 20%,transparent));pointer-events:none}
:is(.uos,.uos-user-panel) .uos-blind-trigger .uos-blind-art{position:absolute;width:43px;height:62px;display:block!important;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;border:0!important;box-shadow:0 3px 7px #0004!important;background:transparent!important;object-fit:cover;border-radius:5px;transform:translateX(calc(var(--fan) * var(--uos-fan-step,19px))) rotate(calc(var(--fan) * 17deg));opacity:0;transition:opacity .3s}
:is(.uos,.uos-user-panel) .uos-blind-trigger .uos-blind-art[data-ready=true]{opacity:1}
:is(.uos,.uos-user-panel) .uos-blind-trigger-symbol{font-size:34px;line-height:1;color:var(--accent)}
:is(.uos,.uos-user-panel) .uos-blind-trigger-art[data-art-ready=true] .uos-blind-trigger-symbol{opacity:0}
:is(.uos,.uos-user-panel) .uos-blind-trigger-copy{min-width:0;flex:1;display:flex;flex-direction:column;gap:5px;position:relative}
:is(.uos,.uos-user-panel) .uos-blind-trigger-title{font:750 18px/1.35 system-ui,sans-serif!important;color:var(--accent)!important;letter-spacing:.12em!important}
:is(.uos,.uos-user-panel) .uos-blind-trigger-hint{font:400 12px/1.5 system-ui,sans-serif!important;color:var(--muted)!important;white-space:normal}
:is(.uos,.uos-user-panel) .uos-blind-trigger-action{display:flex;align-items:center;gap:8px;flex:none;padding:8px 11px;border:1px solid color-mix(in srgb,var(--accent) 30%,transparent);border-radius:24px;background:color-mix(in srgb,var(--accent) 8%,transparent);color:var(--accent);font:600 12px/1.4 system-ui,sans-serif;white-space:nowrap}
:is(.uos,.uos-user-panel) .uos-blind-trigger-arrow{font-size:19px;transition:transform .25s}
:is(.uos,.uos-user-panel) .uos-blind-range-trigger{appearance:none!important;min-height:44px;display:block;flex:none;margin:0 0 0 auto!important;padding:7px 12px!important;border:1px solid var(--line)!important;border-radius:9px!important;background:var(--surface)!important;color:var(--muted)!important;font:600 12px/1.5 system-ui,sans-serif!important;cursor:pointer}:is(.uos,.uos-user-panel) .uos-blind-range-trigger:focus-visible{outline:2px solid var(--accent)!important;outline-offset:2px}
@media(hover:hover){:is(.uos,.uos-user-panel) .uos-blind-trigger:not(:disabled):hover{transform:translateY(-2px)!important;border-color:var(--accent)!important;box-shadow:inset 0 0 24px color-mix(in srgb,var(--accent) 9%,transparent),0 7px 22px color-mix(in srgb,var(--accent) 12%,transparent)!important}:is(.uos,.uos-user-panel) .uos-blind-trigger:not(:disabled):hover .uos-blind-trigger-arrow{transform:translate(2px,-2px)}}
:is(.uos,.uos-user-panel) .uos-blind-trigger:not(:disabled):active{transform:scale(.99)!important}
:is(.uos,.uos-user-panel) .uos-blind-trigger:disabled{opacity:.5;cursor:default}
:is(.uos,.uos-user-panel) .uos-blind-trigger:disabled::after,:is(.uos,.uos-user-panel) .uos-blind-trigger:disabled .uos-blind-trigger-art{animation:none}
:is(.uos,.uos-user-panel) .uos-blind-trigger:focus-visible{outline:2px solid var(--accent)!important;outline-offset:3px}
@keyframes uos-blind-entrance-float{0%,100%{transform:translateY(2px) rotate(-3deg)}50%{transform:translateY(-3px) rotate(1deg)}}
@keyframes uos-blind-entrance-sheen{0%,62%{transform:translateX(-85%)}90%,100%{transform:translateX(85%)}}
@media(max-width:480px){:is(.uos,.uos-user-panel) .uos-blind-trigger{min-height:84px;gap:7px;padding:8px 10px 8px 4px!important;border-radius:14px!important}:is(.uos,.uos-user-panel) .uos-blind-trigger-art{width:60px;height:64px;--uos-fan-step:9px}:is(.uos,.uos-user-panel) .uos-blind-trigger .uos-blind-art{width:35px;height:52px}:is(.uos,.uos-user-panel) .uos-blind-trigger-title{font-size:16px!important;letter-spacing:.05em!important}:is(.uos,.uos-user-panel) .uos-blind-trigger-hint{font-size:11px!important}:is(.uos,.uos-user-panel) .uos-blind-trigger-action{padding:6px 7px;gap:3px;font-size:10px}:is(.uos,.uos-user-panel) .uos-blind-trigger-arrow{font-size:16px}}
@media(max-width:360px){:is(.uos,.uos-user-panel) .uos-blind-trigger{gap:5px;padding-right:8px!important}:is(.uos,.uos-user-panel) .uos-blind-trigger-art{width:48px;height:60px;--uos-fan-step:5px}:is(.uos,.uos-user-panel) .uos-blind-trigger .uos-blind-art{width:30px;height:46px}:is(.uos,.uos-user-panel) .uos-blind-trigger-action{padding:6px 5px;gap:2px;font-size:9px}:is(.uos,.uos-user-panel) .uos-blind-trigger-arrow{font-size:14px}}
@media(prefers-reduced-motion:reduce){:is(.uos,.uos-user-panel) .uos-blind-trigger,:is(.uos,.uos-user-panel) .uos-blind-trigger *,:is(.uos,.uos-user-panel) .uos-blind-trigger::after{animation:none!important;transition:none!important}}
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
.uos-blind-stage{position:relative;display:grid;place-items:center;min-height:320px;padding:16px 20px;isolation:isolate;overflow:hidden;perspective:1000px;background:radial-gradient(ellipse at center,color-mix(in srgb,var(--accent) 16%,transparent),transparent 68%)}
.uos-blind-aura{position:absolute;inset:22px 15%;border:1px solid color-mix(in srgb,var(--accent) 35%,transparent);border-radius:50%;transform:rotate(-24deg);pointer-events:none}
.uos-blind-aura::before,.uos-blind-aura::after{content:"";position:absolute;inset:17px -26px;border:1px dashed color-mix(in srgb,var(--accent) 25%,transparent);border-radius:50%;transform:rotate(60deg)}
.uos-blind-aura::after{inset:46px -46px;transform:rotate(-60deg)}
.uos-blind-sparks{position:absolute;inset:0;pointer-events:none}
.uos-blind-spark{position:absolute;left:50%;top:50%;width:3px;height:3px;border-radius:50%;background:var(--accent);opacity:0;box-shadow:0 0 9px var(--accent)}
.uos-blind-spark:nth-child(3n){width:5px;height:5px}
.uos-blind-deck{position:relative;width:100%;height:280px;z-index:1}
.uos-blind-box .uos-blind-card{position:absolute;left:50%;top:50%;width:27%!important;max-width:144px!important;aspect-ratio:3/4;min-height:0!important;padding:0!important;border:0!important;border-radius:12px!important;background:transparent!important;box-shadow:none!important;opacity:1!important;transform:translate(calc(-50% + var(--card) * 112%),-50%) rotate(calc(var(--card) * 5deg));transition:transform .45s cubic-bezier(.2,.8,.2,1),opacity .4s,filter .4s;perspective:1000px;touch-action:manipulation}
.uos-blind-box[data-phase=ready] .uos-blind-card:hover{transform:translate(calc(-50% + var(--card) * 112%),calc(-50% - 10px)) rotate(calc(var(--card) * 5deg))}
.uos-blind-box .uos-blind-card[data-picked=true]{z-index:3;transform:translate(-50%,-50%) scale(1.35)}
.uos-blind-box:is([data-phase=flipping],[data-phase=revealed]) .uos-blind-card:not([data-picked=true]){opacity:.12!important;filter:blur(2px);transform:translate(calc(-50% + var(--card) * 125%),calc(-50% + 16px)) scale(.85)}
.uos-blind-turn{position:absolute;inset:0;display:block;transform-style:preserve-3d;transition:transform .7s cubic-bezier(.25,.8,.25,1)}
.uos-blind-card[data-opened=true] .uos-blind-turn{transform:rotateY(180deg)}
.uos-blind-back,.uos-blind-face{position:absolute;inset:0;display:grid;place-items:center;border:1px solid var(--accent);border-radius:12px;background:linear-gradient(145deg,var(--surface),var(--bg));box-shadow:0 8px 25px #0004;backface-visibility:hidden;-webkit-backface-visibility:hidden;overflow:hidden;color:var(--accent);font-size:36px}
.uos-blind-face{transform:rotateY(180deg);display:flex;flex-direction:column;justify-content:flex-start}
.uos-blind-card .uos-blind-art{position:absolute;inset:0;width:100%;height:100%;display:block!important;max-width:none!important;max-height:none!important;margin:0!important;padding:0!important;border:0!important;box-shadow:none!important;background:transparent!important;border-radius:inherit;object-fit:cover;opacity:0;transition:opacity .2s}
.uos-blind-card .uos-blind-art[data-ready=true]{opacity:1}
.uos-blind-back[data-art-ready=true]::before,.uos-blind-back[data-art-ready=true]::after,.uos-blind-back[data-art-ready=true] .uos-blind-symbol{opacity:0}
.uos-blind-back::before{content:"";position:absolute;inset:8px;border:1px solid var(--line);border-radius:8px}
.uos-blind-back::after{content:"";position:absolute;width:46%;aspect-ratio:1;border:1px solid var(--accent);border-radius:50%;box-shadow:0 0 0 10px color-mix(in srgb,var(--accent) 6%,transparent)}
.uos-blind-symbol{z-index:1;text-shadow:0 0 18px color-mix(in srgb,var(--accent) 40%,transparent)}
.uos-blind-result{position:relative;width:100%;z-index:2;text-align:center;padding:0 20px 20px}
.uos-blind-cover{height:78%;width:100%;flex:none;background-size:cover;background-position:center}
.uos-blind-face-title{display:flex;align-items:center;justify-content:center;flex:1;min-height:0;width:100%;padding:5px 6px;color:var(--text);font:650 11px/1.4 system-ui,sans-serif;overflow:hidden;overflow-wrap:anywhere;text-align:center}
.uos-blind-title{margin:0!important;color:var(--text)!important;font-size:24px!important;line-height:1.4!important;overflow-wrap:anywhere}
.uos-blind-number{margin:7px 0 0;color:var(--accent);font-size:12px}
.uos-blind-description{margin:12px auto 0;max-width:390px;color:var(--muted);white-space:pre-wrap;overflow-wrap:anywhere}
.uos-blind-status{margin:0!important;padding:0 20px 14px;text-align:center;min-height:40px;color:var(--accent)}
.uos-blind-footer{padding:16px 20px 20px;border-top:1px solid var(--line)}
.uos-blind-scope{margin:0 0 12px;color:var(--muted);font-size:12px;text-align:center}
.uos-blind-actions{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px}
.uos-blind-box[data-phase=shuffle] .uos-blind-card{animation:uos-blind-shuffle 1700ms cubic-bezier(.35,0,.2,1) both;animation-delay:var(--shuffle-delay)}
.uos-blind-box[data-phase=shuffle] .uos-blind-aura{animation:uos-blind-ring 3s linear infinite}
.uos-blind-box[data-phase=shuffle] .uos-blind-spark{animation:uos-blind-spark 1.2s ease-out infinite;animation-delay:calc(var(--spark) * -100ms)}
.uos-blind-box[data-phase=revealed] .uos-blind-spark{animation:uos-blind-burst 900ms ease-out both;animation-delay:calc(var(--spark) * 18ms)}
.uos-blind-box[data-phase=revealed] .uos-blind-result{animation:uos-blind-reveal 700ms cubic-bezier(.16,1,.3,1) both}
.uos-blind-box[data-phase=revealed] .uos-blind-aura{opacity:.4;transform:scale(1.4) rotate(-24deg);transition:transform 700ms,opacity 700ms}
@keyframes uos-blind-shuffle{0%{transform:translate(calc(-50% + var(--card) * 13%),-50%) rotate(calc(var(--card) * 8deg))}22%{transform:translate(calc(-50% + var(--shuffle-side) * 116%),calc(-50% - 12px)) rotateY(calc(var(--shuffle-side) * 24deg)) rotate(calc(var(--shuffle-side) * 15deg))}48%{transform:translate(calc(-50% - var(--shuffle-side) * 100%),calc(-50% - 16px)) rotateY(calc(var(--shuffle-side) * -22deg)) rotate(calc(var(--shuffle-side) * -15deg))}72%{transform:translate(calc(-50% + var(--card) * 14%),-50%) rotate(calc(var(--card) * 7deg))}100%{transform:translate(calc(-50% + var(--card) * 112%),-50%) rotate(calc(var(--card) * 5deg))}}
@keyframes uos-blind-reveal{from{opacity:0;transform:perspective(1000px) rotateY(-75deg) scale(.83)}to{opacity:1;transform:perspective(1000px) rotateY(0) scale(1)}}
@keyframes uos-blind-burst{0%{opacity:0;transform:rotate(calc(var(--spark) * 30deg)) translateX(45px) scale(.5)}20%{opacity:.8}100%{opacity:0;transform:rotate(calc(var(--spark) * 30deg)) translateX(230px) scale(1.3)}}
@keyframes uos-blind-ring{to{transform:rotate(336deg)}}
@keyframes uos-blind-spark{from{opacity:.8;transform:rotate(calc(var(--spark) * 30deg)) translateX(55px) scale(.5)}to{opacity:0;transform:rotate(calc(var(--spark) * 30deg)) translateX(210px) scale(1)}}
@media(max-width:480px){.uos-blind-header{padding:14px}.uos-blind-stage{min-height:250px;padding:10px 14px}.uos-blind-deck{height:230px}.uos-blind-result{padding:0 14px 16px}.uos-blind-footer{padding:14px}.uos-blind-title{font-size:21px!important}.uos-blind-actions{grid-template-columns:1fr 1fr}.uos-blind-actions .uos-blind-enter{grid-column:1/-1}}
@media(prefers-reduced-motion:reduce){.uos-blind-box *{animation:none!important;transition:none!important}}
`;
