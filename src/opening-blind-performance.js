import {THEME_IDS,themeDraw} from './themes.js';

// Decorative scenes share the draw's existing phases, never timers or transactions.
export function createBlindPerformance(el,theme,enabled){
  const id=THEME_IDS.includes(theme)?theme:'archive',scene=el('div','uos-blind-performance');
  scene.dataset.theme=id;scene.hidden=!enabled;scene.setAttribute('aria-hidden','true');
  for(let i=0;i<8;i++){const piece=el('span','uos-blind-performance-piece');piece.style.setProperty('--piece',i);scene.append(piece)}
  scene.append(el('span','uos-blind-performance-caption',themeDraw(id).scene));return scene;
}

export const BLIND_PERFORMANCE_CSS=`
.uos-blind-performance{position:absolute;inset:0;pointer-events:none;overflow:hidden;color:var(--accent);z-index:0;opacity:.65;transition:opacity .8s}
.uos-blind-performance::before,.uos-blind-performance::after{content:"";position:absolute;pointer-events:none;transition:transform 1s,opacity 1s}
.uos-blind-performance-piece{position:absolute;display:block;transition:transform 1.1s,opacity 1.1s;opacity:.4}
.uos-blind-performance-caption{position:absolute;bottom:7px;left:0;width:100%;text-align:center;letter-spacing:.3em;font:500 10px/1.5 system-ui,sans-serif;opacity:.65}
.uos-blind-box:is([data-phase=flipping],[data-phase=revealed]) .uos-blind-performance{opacity:1}
/* Archive: stacked file sheets and an opening seal. */
.uos-blind-performance[data-theme=archive] .uos-blind-performance-piece{left:calc(18% + var(--piece) * 7%);top:20%;width:27%;height:61%;border:1px solid currentColor;border-radius:3px;background:linear-gradient(135deg,var(--surface),transparent);transform:rotate(calc(var(--piece) * 2deg - 8deg))}
.uos-blind-performance[data-theme=archive]::after{width:70px;height:70px;border:3px double currentColor;border-radius:50%;left:calc(50% - 35px);top:calc(50% - 35px)}
.uos-blind-box[data-phase=flipping] .uos-blind-performance[data-theme=archive]::after{transform:scale(2.7) rotate(-35deg);opacity:0}
.uos-blind-box[data-phase=revealed] .uos-blind-performance[data-theme=archive] .uos-blind-performance-piece{transform:translateX(calc((var(--piece) - 3.5) * 24px)) rotate(calc(var(--piece) * 6deg - 20deg));opacity:.15}
/* Neon: a traveling scan and staggered signal bars. */
.uos-blind-performance[data-theme=neon]::before{inset:8%;border:1px solid currentColor;clip-path:polygon(0 0,20% 0,20% 1%,1% 1%,1% 20%,0 20%,0 0,100% 0,100% 100%,80% 100%,80% 99%,99% 99%,99% 80%,100% 80%,100% 0);opacity:.5}
.uos-blind-performance[data-theme=neon]::after{left:0;right:0;height:2px;top:0;background:currentColor;box-shadow:0 0 22px currentColor;animation:uos-show-scan 3s ease-in-out infinite}
.uos-blind-performance[data-theme=neon] .uos-blind-performance-piece{left:calc(10% + var(--piece) * 11%);bottom:20%;width:4%;height:calc(15% + var(--piece) * 3%);border-top:2px solid currentColor;background:linear-gradient(0deg,transparent,currentColor);animation:uos-show-signal 2s ease-in-out infinite;animation-delay:calc(var(--piece) * -170ms)}
/* Paper: pages sweep outward, leaving faint ink rules. */
.uos-blind-performance[data-theme=paper]::before{inset:14%;background:repeating-linear-gradient(0deg,transparent 0 24px,currentColor 25px 26px);opacity:.14}
.uos-blind-performance[data-theme=paper] .uos-blind-performance-piece{left:calc(12% + var(--piece) * 9%);top:16%;width:24%;height:66%;border:1px solid currentColor;transform:rotate(-9deg);background:linear-gradient(100deg,transparent,var(--surface));transform-origin:left center}
.uos-blind-box[data-phase=revealed] .uos-blind-performance[data-theme=paper] .uos-blind-performance-piece{transform:translateX(calc(var(--piece) * 18px - 65px)) rotateY(-65deg);opacity:.18}
/* Noir: perforated film edges and a softly moving projector shutter. */
.uos-blind-performance[data-theme=noir]::before,.uos-blind-performance[data-theme=noir]::after{top:0;bottom:0;width:20px;border-inline:1px solid currentColor;background:repeating-linear-gradient(0deg,transparent 0 14px,currentColor 15px 23px,transparent 24px 36px);opacity:.3;animation:uos-show-film 4s linear infinite}
.uos-blind-performance[data-theme=noir]::before{left:7%}.uos-blind-performance[data-theme=noir]::after{right:7%}
.uos-blind-performance[data-theme=noir] .uos-blind-performance-piece{left:0;right:0;top:calc(var(--piece) * 12.5%);height:12.5%;background:var(--surface);opacity:.18;transform:scaleY(.1)}
.uos-blind-box[data-phase=flipping] .uos-blind-performance[data-theme=noir] .uos-blind-performance-piece{animation:uos-show-shutter .9s ease-out both;animation-delay:calc(var(--piece) * 25ms)}
/* Meadow: leaves drift across the letter. */
.uos-blind-performance[data-theme=meadow] .uos-blind-performance-piece{left:calc(5% + var(--piece) * 13%);top:12%;width:18px;height:32px;border:1px solid currentColor;border-radius:0 85% 0 85%;animation:uos-show-leaf 5s ease-in-out infinite;animation-delay:calc(var(--piece) * -600ms)}
.uos-blind-performance[data-theme=meadow]::before{inset:25% 18%;border:1px solid currentColor;transform:rotate(-6deg);opacity:.3}
/* Ancient: horizontal rollers reveal a ruled silk scroll. */
.uos-blind-performance[data-theme=ancient]::before{inset:24% 12%;border-block:4px double currentColor;background:repeating-linear-gradient(90deg,transparent 0 26px,color-mix(in srgb,currentColor 15%,transparent) 27px 28px);transform:scaleY(.2)}
.uos-blind-performance[data-theme=ancient]::after{width:34px;height:34px;border:2px solid currentColor;right:15%;bottom:24%;transform:rotate(6deg);opacity:.25}
.uos-blind-box:is([data-phase=flipping],[data-phase=revealed]) .uos-blind-performance[data-theme=ancient]::before{transform:scaleY(1.5)}
.uos-blind-performance[data-theme=ancient] .uos-blind-performance-piece{width:2px;height:36%;left:calc(17% + var(--piece) * 9%);top:32%;background:currentColor;opacity:.12}
/* Starmap: orbiting stars join a constellation. */
.uos-blind-performance[data-theme=starmap]::before{inset:11% 18%;border:1px dashed currentColor;border-radius:50%;animation:uos-show-orbit 24s linear infinite}
.uos-blind-performance[data-theme=starmap]::after{inset:22% 25%;border:1px solid currentColor;clip-path:polygon(0 0,100% 20%,70% 100%,0 0);transform:scale(.65);opacity:.2}
.uos-blind-performance[data-theme=starmap] .uos-blind-performance-piece{left:50%;top:50%;width:4px;height:4px;border-radius:50%;background:currentColor;box-shadow:0 0 10px currentColor;transform:rotate(calc(var(--piece) * 45deg)) translateX(115px);animation:uos-show-star 3s ease-in-out infinite;animation-delay:calc(var(--piece) * -350ms)}
.uos-blind-box[data-phase=revealed] .uos-blind-performance[data-theme=starmap]::after{transform:scale(1.5);opacity:.7}
/* Rose: a ring of petals opens around the contract. */
.uos-blind-performance[data-theme=rose] .uos-blind-performance-piece{left:50%;top:50%;width:31px;height:48px;border-radius:70% 15% 70% 15%;border:1px solid currentColor;background:color-mix(in srgb,currentColor 12%,transparent);transform:rotate(calc(var(--piece) * 45deg)) translateY(-85px)}
.uos-blind-box:is([data-phase=flipping],[data-phase=revealed]) .uos-blind-performance[data-theme=rose] .uos-blind-performance-piece{transform:rotate(calc(var(--piece) * 45deg + 25deg)) translateY(-160px);opacity:.3}
/* Wasteland: a quiet radar locks a coordinate, without flashing alarms. */
.uos-blind-performance[data-theme=wasteland]::before{inset:12% 20%;border:1px solid currentColor;border-radius:50%;background:linear-gradient(90deg,transparent 49.6%,currentColor 50%,transparent 50.4%),linear-gradient(0deg,transparent 49.6%,currentColor 50%,transparent 50.4%);opacity:.35}
.uos-blind-performance[data-theme=wasteland]::after{left:50%;top:50%;width:38%;height:2px;transform-origin:left center;background:linear-gradient(90deg,currentColor,transparent);animation:uos-show-orbit 4s linear infinite}
.uos-blind-performance[data-theme=wasteland] .uos-blind-performance-piece{left:calc(8% + var(--piece) * 12%);bottom:16%;width:12px;height:5px;background:currentColor;transform:skew(-25deg)}
/* Deep sea: layered waves rise as bubbles pass. */
.uos-blind-performance[data-theme=deepsea]::before,.uos-blind-performance[data-theme=deepsea]::after{left:-15%;width:130%;height:70%;top:65%;border:1px solid currentColor;border-radius:45% 50% 0 0;background:linear-gradient(0deg,transparent,color-mix(in srgb,currentColor 12%,transparent));transition:top 1.3s,transform 1.3s}
.uos-blind-performance[data-theme=deepsea]::after{transform:rotate(-8deg);top:73%}
.uos-blind-box[data-phase=revealed] .uos-blind-performance[data-theme=deepsea]::before{top:40%;transform:rotate(8deg)}
.uos-blind-box[data-phase=revealed] .uos-blind-performance[data-theme=deepsea]::after{top:48%}
.uos-blind-performance[data-theme=deepsea] .uos-blind-performance-piece{left:calc(10% + var(--piece) * 11%);bottom:0;width:calc(5px + var(--piece) * 2px);aspect-ratio:1;border:1px solid currentColor;border-radius:50%;animation:uos-show-bubble 5s ease-out infinite;animation-delay:calc(var(--piece) * -550ms)}
/* Amber: drifting sand over two dunes. */
.uos-blind-performance[data-theme=amber]::before,.uos-blind-performance[data-theme=amber]::after{left:-10%;width:120%;height:50%;bottom:-10%;border-top:1px solid currentColor;border-radius:50% 80% 0 0;transform:rotate(-12deg);background:linear-gradient(180deg,color-mix(in srgb,currentColor 12%,transparent),transparent)}
.uos-blind-performance[data-theme=amber]::after{bottom:-20%;transform:rotate(16deg)}
.uos-blind-performance[data-theme=amber] .uos-blind-performance-piece{left:-5%;top:calc(20% + var(--piece) * 7%);width:24%;height:1px;background:linear-gradient(90deg,transparent,currentColor,transparent);animation:uos-show-sand 4s ease-in-out infinite;animation-delay:calc(var(--piece) * -440ms)}
/* Theatre: fabric curtains part and a spotlight widens. */
.uos-blind-performance[data-theme=theatre]::before,.uos-blind-performance[data-theme=theatre]::after{top:0;bottom:0;width:36%;border:1px solid color-mix(in srgb,currentColor 35%,transparent);background:repeating-linear-gradient(90deg,var(--surface) 0 10px,color-mix(in srgb,var(--surface) 80%,currentColor) 18px,var(--surface) 28px);border-radius:0 0 45% 0}
.uos-blind-performance[data-theme=theatre]::before{left:-8%}.uos-blind-performance[data-theme=theatre]::after{right:-8%;border-radius:0 0 0 45%}
.uos-blind-box:is([data-phase=flipping],[data-phase=revealed]) .uos-blind-performance[data-theme=theatre]::before{transform:translateX(-65%)}
.uos-blind-box:is([data-phase=flipping],[data-phase=revealed]) .uos-blind-performance[data-theme=theatre]::after{transform:translateX(65%)}
.uos-blind-performance[data-theme=theatre] .uos-blind-performance-piece{left:50%;top:-8%;width:2px;height:110%;background:linear-gradient(currentColor,transparent);transform-origin:top;transform:rotate(calc(var(--piece) * 7deg - 25deg));opacity:.1}
/* Last train: window dividers and station lights pass horizontally. */
.uos-blind-performance[data-theme=lasttrain]::before{inset:17% 8%;border:1px solid currentColor;border-radius:18px;background:linear-gradient(90deg,transparent 32%,currentColor 32.3%,transparent 32.6%,transparent 66%,currentColor 66.3%,transparent 66.6%);opacity:.25}
.uos-blind-performance[data-theme=lasttrain] .uos-blind-performance-piece{left:-20%;top:calc(22% + var(--piece) * 7%);height:3px;width:22%;border-radius:50%;background:linear-gradient(90deg,transparent,currentColor,transparent);animation:uos-show-train 2.5s linear infinite;animation-delay:calc(var(--piece) * -320ms)}
/* Aurora: colored ribbons drift behind a sweeping lighthouse beam. */
.uos-blind-performance[data-theme=aurora]::before{inset:-20% 0 10%;background:linear-gradient(110deg,transparent 25%,color-mix(in srgb,currentColor 22%,transparent) 40%,transparent 50%,color-mix(in srgb,var(--text) 14%,transparent) 65%,transparent 76%);filter:blur(12px);animation:uos-show-aurora 7s ease-in-out infinite}
.uos-blind-performance[data-theme=aurora]::after{left:50%;bottom:0;width:100%;height:160%;background:linear-gradient(90deg,transparent,color-mix(in srgb,currentColor 13%,transparent),transparent);clip-path:polygon(0 100%,5% 0,45% 0);transform-origin:bottom left;animation:uos-show-beam 8s ease-in-out infinite}
/* Glasshouse: transparent facets unfold like petals. */
.uos-blind-performance[data-theme=glasshouse] .uos-blind-performance-piece{left:50%;top:50%;width:75px;height:105px;border:1px solid currentColor;background:linear-gradient(130deg,color-mix(in srgb,var(--text) 9%,transparent),transparent);clip-path:polygon(50% 0,100% 40%,70% 100%,30% 100%,0 40%);transform-origin:bottom center;transform:translate(-50%,-100%) rotate(calc(var(--piece) * 45deg)) scale(.85)}
.uos-blind-box[data-phase=revealed] .uos-blind-performance[data-theme=glasshouse] .uos-blind-performance-piece{transform:translate(-50%,-100%) rotate(calc(var(--piece) * 45deg + 15deg)) scale(1.45);opacity:.25}
/* Japan: prayer slips sway beneath a moon and rise with the chosen fortune. */
.uos-blind-performance[data-theme=japan]::before{left:calc(50% - 45px);top:5%;width:90px;height:90px;border-radius:50%;border:1px solid currentColor;box-shadow:inset -18px 0 0 color-mix(in srgb,currentColor 15%,transparent)}
.uos-blind-performance[data-theme=japan] .uos-blind-performance-piece{left:calc(6% + var(--piece) * 12%);top:15%;width:14px;height:58px;border:1px solid currentColor;background:repeating-linear-gradient(0deg,transparent 0 12px,color-mix(in srgb,currentColor 20%,transparent) 13px 14px);transform-origin:top center;animation:uos-show-fortune 4s ease-in-out infinite;animation-delay:calc(var(--piece) * -430ms)}
.uos-blind-box[data-phase=revealed] .uos-blind-performance[data-theme=japan]::before{transform:scale(1.3) translateY(-12px)}
/* After school: classroom window light, a paper plane and drifting sakura petals. */
.uos-blind-performance[data-theme=school]::before{inset:12% 13% 16%;border:2px solid currentColor;border-radius:9px;background:linear-gradient(90deg,transparent 49.5%,currentColor 50%,transparent 50.5%),linear-gradient(0deg,transparent 49.5%,currentColor 50%,transparent 50.5%),linear-gradient(135deg,#fff9 15%,transparent 55%);opacity:.2;transform:skewY(-4deg)}
.uos-blind-performance[data-theme=school]::after{left:7%;top:26%;width:44px;height:32px;background:currentColor;clip-path:polygon(0 38%,100% 0,35% 100%,31% 62%,0 38%,100% 0,31% 62%,39% 54%);animation:uos-show-school-plane 6s ease-in-out infinite;opacity:.4}
.uos-blind-performance[data-theme=school] .uos-blind-performance-piece{left:calc(7% + var(--piece) * 12%);top:-8%;width:12px;height:17px;border-radius:80% 10% 80% 20%;background:#ca7694;animation:uos-show-school-petal 5s ease-in-out infinite;animation-delay:calc(var(--piece) * -620ms)}
.uos-blind-box[data-phase=revealed] .uos-blind-performance[data-theme=school]::before{transform:skewY(0) scale(1.06);opacity:.12}
.uos-blind-box[data-phase=revealed] .uos-blind-performance[data-theme=school]::after{animation:uos-show-school-depart 1.3s ease-out both}
@keyframes uos-show-school-plane{0%,100%{transform:translate(0,50px) rotate(8deg)}50%{transform:translate(240px,-25px) rotate(-8deg)}}
@keyframes uos-show-school-petal{0%{transform:translate(0,0) rotate(0);opacity:0}20%,70%{opacity:.45}100%{transform:translate(38px,340px) rotate(160deg);opacity:0}}
@keyframes uos-show-school-depart{from{transform:translate(80px,20px) rotate(-12deg);opacity:.5}to{transform:translate(420px,-110px) rotate(-25deg);opacity:0}}
@keyframes uos-show-scan{0%,100%{transform:translateY(0);opacity:0}25%,75%{opacity:.45}50%{transform:translateY(280px)}}
@keyframes uos-show-signal{0%,100%{transform:scaleY(.65);opacity:.2}50%{transform:scaleY(1.15);opacity:.45}}
@keyframes uos-show-film{to{background-position:0 36px}}
@keyframes uos-show-shutter{0%,100%{transform:scaleY(.1);opacity:.1}40%{transform:scaleY(1);opacity:.35}}
@keyframes uos-show-leaf{0%,100%{transform:translate(0,0) rotate(-20deg);opacity:.2}50%{transform:translate(18px,140px) rotate(40deg);opacity:.5}}
@keyframes uos-show-orbit{to{transform:rotate(360deg)}}
@keyframes uos-show-star{0%,100%{opacity:.2}50%{opacity:.9}}
@keyframes uos-show-bubble{from{transform:translateY(0);opacity:0}25%{opacity:.5}to{transform:translateY(-260px);opacity:0}}
@keyframes uos-show-sand{0%{transform:translateX(0);opacity:0}40%{opacity:.4}100%{transform:translateX(500px) translateY(-30px);opacity:0}}
@keyframes uos-show-train{0%{transform:translateX(0);opacity:0}20%,75%{opacity:.4}100%{transform:translateX(650px);opacity:0}}
@keyframes uos-show-aurora{0%,100%{transform:translateX(-7%) skew(-9deg)}50%{transform:translateX(7%) skew(9deg)}}
@keyframes uos-show-beam{0%,100%{transform:rotate(-25deg)}50%{transform:rotate(45deg)}}
@keyframes uos-show-fortune{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(9deg)}}
@media(prefers-reduced-motion:reduce){.uos-blind-performance{display:none!important}}
`;
