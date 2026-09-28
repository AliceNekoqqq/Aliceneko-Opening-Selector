/* Optional global Tavern Helper script for ordinary multi-greeting cards. */
const KEY='universal_opening_selector';
const WATERMARK='唯一来源Discord:♡Aliceneko♡/红豆粉丨本插件完全免费';
const VERSION='1.0.1';
const THEMES=[['archive','旧档案'],['neon','霓虹夜'],['paper','纸与墨'],['noir','黑白电影'],['meadow','林间信'],['ancient','锦书古风'],['starmap','星海航图'],['rose','绯色契约'],['wasteland','末日警报']];
const THEME_CAPTIONS={archive:'ARCHIVE Nº 01 · 故事档案',neon:'AFTER DARK · 霓虹叙事',paper:'THE FIRST PAGE · 纸上初章',noir:'FRAME 001 · 光影序幕',meadow:'LETTERS FROM THE WOODS · 林间来信',ancient:'BROCADE LETTER · 锦书古风',starmap:'CELESTIAL ATLAS · 星海航图',rose:'VELVET VOW · 绯色契约',wasteland:'INCIDENT 001 · 末日警报'};
const CSS=`
.uos-user-trigger{display:block;width:max-content;max-width:calc(100% - 24px);margin:10px 12px;padding:8px 13px;border:1px solid #b99669;border-radius:999px;background:#17242d;color:#f3e9d7;font:13px/1.4 system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 14px #0004}
.uos-user-trigger[data-floating=true]{position:fixed;z-index:2147483645;margin:0;touch-action:none}
.uos-user-trigger[data-theme=neon]{background:#211839;border-color:#d279ef;color:#fff0fa;box-shadow:0 0 18px #b044c288}.uos-user-trigger[data-theme=paper]{background:#f8eedb;border-color:#a3493b;color:#522d28}.uos-user-trigger[data-theme=noir]{background:#1b1c1e;border-color:#e1dfda;color:#f7f5ef}.uos-user-trigger[data-theme=meadow]{background:#1d392f;border-color:#bec889;color:#f3f1d9}
.uos-user-trigger:focus-visible,.uos-user-panel button:focus-visible{outline:2px solid #efc58b;outline-offset:2px}
dialog.uos-user-overlay{position:fixed;inset:0;z-index:2147483646;box-sizing:border-box;width:min(620px,calc(100vw - 28px));max-width:calc(100vw - 28px);max-height:calc(100dvh - 28px);margin:auto;padding:0;border:0;border-radius:18px;background:transparent;color:inherit;overflow:hidden;box-shadow:0 20px 60px #0008}
dialog.uos-user-overlay::backdrop{background:transparent}
.uos-user-panel{--bg:#111a21;--surface:#202d35;--text:#f1e7d4;--muted:#bbb7aa;--accent:#deb47c;--line:#b9966970;box-sizing:border-box;display:flex;flex-direction:column;width:100%;max-height:min(74dvh,690px);overflow:hidden;padding:18px;border:1px solid var(--accent);border-radius:18px;background:radial-gradient(circle at 100% 0%,var(--accent) 0,transparent 1px),var(--bg);color:var(--text);font:14px/1.5 system-ui,"Noto Sans SC",sans-serif}
.uos-user-panel[data-theme=neon]{--bg:#080e22;--surface:#171c38;--text:#f5f1ff;--muted:#b8b2d1;--accent:#fa74bf;--line:#9d7de399}
.uos-user-panel[data-theme=ancient]{--bg:#201a20;--surface:#38292d;--text:#f5ead5;--muted:#d4c1ae;--accent:#dbb77c;--line:#b98d6c99;--glow:#a56b5940;--wash:#79545144;--frame:#b98d6c;border-radius:4px;background:radial-gradient(circle at 100% 0%,#a56b5940,transparent 45%),#201a20}.uos-user-panel[data-theme=ancient]::before{border-radius:1px}.uos-user-panel[data-theme=ancient] .uos-user-card{border-radius:3px;border-left:3px solid var(--accent);background:repeating-linear-gradient(135deg,transparent 0 22px,#dbb77c14 23px 24px),var(--surface)}.uos-user-panel[data-theme=ancient] .uos-user-head h2{font-family:"Noto Serif SC","Songti SC",serif}.uos-user-trigger[data-theme=ancient]{background:#302329;border-color:#dbb77c;color:#f5ead5}
.uos-user-panel[data-theme=paper]{--bg:#f4eee2;--surface:#fffaf0;--text:#362d29;--muted:#675950;--accent:#a64d3c;--line:#a77e6b8c}
.uos-user-panel[data-theme=noir]{--bg:#121314;--surface:#27292b;--text:#f2f1ec;--muted:#babbb9;--accent:#e4e1d5;--line:#a3a3a36b}
.uos-user-panel[data-theme=meadow]{--bg:#122a24;--surface:#254037;--text:#f3f4e1;--muted:#c2d1bf;--accent:#d2e5a0;--line:#afc28980}
.uos-user-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.uos-user-head h2{margin:0;color:var(--text);font:600 22px/1.3 Georgia,"Noto Serif SC",serif}.uos-user-head p{margin:4px 0 0;color:var(--muted);font-size:12px}
.uos-user-panel button,.uos-user-panel select{font:inherit}.uos-user-close,.uos-user-select{border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--text);padding:8px 12px;cursor:pointer}.uos-user-tools{display:flex;align-items:center;gap:8px;margin-bottom:12px;color:var(--muted);font-size:12px}.uos-user-tools select{min-width:0;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--text)}
.uos-user-label-settings{flex:none;min-height:48px;max-height:min(35dvh,240px);overflow:auto;margin-bottom:12px;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface)}.uos-user-label-settings summary{color:var(--accent);cursor:pointer}.uos-user-label-settings label{display:grid;gap:5px;margin:10px 0;color:var(--muted);font-size:12px}.uos-user-label-settings input{box-sizing:border-box;width:100%;padding:8px 10px;border:1px solid var(--line);border-radius:7px;background:var(--bg);color:var(--text);font:14px/1.4 system-ui,sans-serif}.uos-user-label-settings button{padding:7px 12px;border:1px solid var(--line);border-radius:8px;background:var(--accent);color:var(--bg);font-weight:700}
.uos-user-list{display:grid;gap:12px;min-height:0;overflow:auto;overscroll-behavior:contain;padding:2px 3px 12px}.uos-user-card{padding:14px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}.uos-user-card[data-current=true]{border-color:var(--accent);box-shadow:inset 3px 0 var(--accent)}.uos-user-card h3{margin:0 0 6px;color:var(--text);font:600 17px/1.4 Georgia,"Noto Serif SC",serif}.uos-user-card p{margin:0 0 9px;color:var(--muted);font-size:12px}.uos-user-card details{margin-bottom:10px}.uos-user-card summary{color:var(--accent);cursor:pointer}.uos-user-card pre{max-height:180px;overflow:auto;white-space:pre-wrap;overflow-wrap:anywhere;margin:9px 0 0;padding:10px;border:1px solid var(--line);border-radius:7px;color:var(--text);font-size:12px;line-height:1.6;font-family:inherit}.uos-user-select{background:var(--accent);color:var(--bg);font-weight:700}.uos-user-select:disabled{opacity:.65;cursor:default}.uos-user-status{min-height:18px;margin:8px 0 0;color:var(--accent);font-size:12px}
.uos-user-card .uos-user-names{color:var(--accent);font-size:13px}
.uos-user-search{display:flex;gap:8px;flex:none;margin:0 0 10px}.uos-user-search input,.uos-user-search select{min-width:0;flex:1;padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--text)}.uos-user-source{opacity:.75;font-size:11px}.uos-user-empty{padding:16px;color:var(--muted)}

/* Six authored visual systems. All decoration stays behind text and controls. */
.uos-user-panel{--glow:transparent;--wash:transparent;--ornament:"✦";--frame:var(--line);position:relative;isolation:isolate;max-height:min(84dvh,780px);padding:22px 24px 18px;border:1px solid var(--frame);border-radius:20px;background:radial-gradient(ellipse at 82% -20%,var(--glow),transparent 57%),linear-gradient(145deg,var(--wash),transparent 44%),var(--bg);box-shadow:inset 0 0 0 5px color-mix(in srgb,var(--bg) 85%,var(--accent)),0 28px 80px #0009}
.uos-user-panel::before{content:"";position:absolute;z-index:-1;inset:8px;border:1px solid var(--line);border-radius:14px;pointer-events:none;opacity:.75}
.uos-user-head{flex:none;margin:1px 0 17px;padding:0 0 16px;border-bottom:1px solid var(--line)}
.uos-user-head h2{font-size:clamp(23px,4vw,30px);letter-spacing:.055em;font-weight:650}
.uos-user-kicker{display:block;margin:0 0 5px;color:var(--accent);font:600 10px/1.5 Georgia,serif;letter-spacing:.24em;text-transform:uppercase}
.uos-user-head p{letter-spacing:.025em}
.uos-user-tools{flex:none;justify-content:space-between;margin-bottom:14px;text-transform:uppercase;letter-spacing:.15em}
.uos-user-tools select{flex:0 1 150px;text-transform:none;letter-spacing:0}
.uos-user-panel button,.uos-user-panel select,.uos-user-search input,.uos-user-label-settings input{transition:border-color .2s,background .2s,box-shadow .2s,transform .2s}
.uos-user-panel button:hover:not(:disabled){transform:translateY(-1px);border-color:var(--accent)}
.uos-user-search{margin-bottom:13px}.uos-user-search input,.uos-user-search select{padding:10px 12px;border-radius:8px}
.uos-user-label-settings{min-height:46px;max-height:min(27dvh,220px);margin-bottom:8px;border-radius:8px;background:color-mix(in srgb,var(--surface) 80%,var(--bg));scrollbar-width:thin}
.uos-user-label-settings summary{padding:3px 0;letter-spacing:.035em;font-weight:600}
.uos-user-label-settings[open]{box-shadow:inset 3px 0 0 var(--accent)}
.uos-user-list{gap:15px;padding:5px 5px 16px 2px;scrollbar-width:thin}
.uos-user-card{position:relative;isolation:isolate;overflow:hidden;min-height:168px;padding:21px 22px 19px 25px;border:1px solid var(--line);border-radius:11px;background:linear-gradient(135deg,color-mix(in srgb,var(--surface) 93%,var(--accent)),var(--surface));box-shadow:0 9px 22px #0002}
.uos-user-card::before{content:attr(data-number);position:absolute;z-index:-1;right:17px;top:1px;color:var(--accent);font:italic 83px/1 Georgia,serif;opacity:.09;pointer-events:none}
.uos-user-card::after{content:"";position:absolute;inset:9px;border:1px solid var(--line);border-radius:6px;opacity:.45;pointer-events:none}
.uos-user-card[data-current=true]{border-color:var(--accent);box-shadow:inset 4px 0 0 var(--accent),0 12px 28px #0004}
.uos-user-card h3{position:relative;margin:2px 0 7px;font-size:19px;line-height:1.5;letter-spacing:.025em}
.uos-user-card .uos-user-source{display:inline-block;margin-bottom:8px;color:var(--muted);font-size:10px;letter-spacing:.1em}
.uos-user-card p{position:relative;line-height:1.6}.uos-user-card .uos-user-names{font-weight:650;letter-spacing:.025em}
.uos-user-card details{position:relative;padding-top:7px;border-top:1px solid var(--line)}
.uos-user-card pre{max-height:205px;background:color-mix(in srgb,var(--bg) 68%,var(--surface));scrollbar-width:thin}
.uos-user-select{min-height:39px;padding:9px 16px;border-radius:7px;letter-spacing:.08em}
.uos-user-status{flex:none;margin:9px 0 0}
/* Archive: ink blue, brass rules, an old catalog card. */
.uos-user-panel[data-theme=archive]{--bg:#111d25;--surface:#1b2b34;--text:#f3ead9;--muted:#b9b7ac;--accent:#e0b875;--line:#b695645e;--glow:#956e3d45;--wash:#37505b3d;--frame:#a6885c}
.uos-user-panel[data-theme=archive] .uos-user-card{border-left:5px double var(--accent);background:repeating-linear-gradient(0deg,transparent 0 33px,#cfb18410 34px 35px),linear-gradient(120deg,#24363d,#192830)}
.uos-user-panel[data-theme=archive] .uos-user-head h2{font-family:Georgia,"Noto Serif SC",serif}
.uos-user-panel[data-theme=archive] .uos-user-card::after{border-style:dashed}
/* Neon: violet and rose light on dark glass. */
.uos-user-panel[data-theme=neon]{--bg:#0b0c24;--surface:#17183a;--text:#f6f2ff;--muted:#c4bddd;--accent:#ff80cf;--line:#9d72df88;--glow:#8b39e066;--wash:#5d246655;--frame:#b267ee}
.uos-user-panel[data-theme=neon]::before{border-image:linear-gradient(135deg,#ff82d9,#b784fa,#a881ed) 1}
.uos-user-panel[data-theme=neon] .uos-user-head h2{text-shadow:0 0 18px #e556bd88}
.uos-user-panel[data-theme=neon] .uos-user-card{border-radius:3px 13px 3px 13px;background:linear-gradient(135deg,#2a1b50,#101d3a 70%);box-shadow:inset 0 1px #cdaaff55,0 12px 28px #09052588}
.uos-user-panel[data-theme=neon] .uos-user-card::after{border-color:#b784fa77;border-radius:1px 9px 1px 9px}
.uos-user-panel[data-theme=neon] .uos-user-names,.uos-user-panel[data-theme=neon] .uos-user-card summary{color:#dcb5ff}
.uos-user-panel[data-theme=neon] .uos-user-select{box-shadow:0 0 18px #ed5dc166}
/* Paper: ivory stock, vermilion editorial marks and generous type. */
.uos-user-panel[data-theme=paper]{--bg:#e9dfcb;--surface:#f9f2e4;--text:#292926;--muted:#665e53;--accent:#a43c30;--line:#9a745e80;--glow:#d9ae7a55;--wash:#fff8e2aa;--frame:#906d52;color-scheme:light}
.uos-user-panel[data-theme=paper]{border-radius:4px;box-shadow:inset 0 0 0 6px #f3ebda,0 23px 55px #2b201c66}
.uos-user-panel[data-theme=paper]::before{border-radius:1px}
.uos-user-panel[data-theme=paper] .uos-user-head h2,.uos-user-panel[data-theme=paper] .uos-user-card h3{font-family:Georgia,"Noto Serif SC",serif}
.uos-user-panel[data-theme=paper] .uos-user-card{border-radius:2px;border-left:4px solid var(--accent);background:linear-gradient(90deg,#d2bdaa48 0 1px,transparent 1px),linear-gradient(#fffaf0,#f7efdf);box-shadow:2px 5px 0 #aa8d7040}
.uos-user-panel[data-theme=paper] .uos-user-card::after{border-radius:0}
.uos-user-panel[data-theme=paper] .uos-user-select{color:#fff8ec}
/* Noir: framed monochrome film stills with restrained silver light. */
.uos-user-panel[data-theme=noir]{--bg:#111214;--surface:#202124;--text:#f2f0e9;--muted:#bbbcb8;--accent:#e8e3d7;--line:#92959088;--glow:#c1c4c229;--wash:#373a3d33;--frame:#9ea19e;filter:grayscale(1)}
.uos-user-panel[data-theme=noir]{border-radius:3px;background:repeating-linear-gradient(90deg,transparent 0 4px,#ffffff05 5px 6px),radial-gradient(circle at 78% -20%,var(--glow),transparent 55%),var(--bg)}
.uos-user-panel[data-theme=noir] .uos-user-head h2{font-family:Georgia,"Noto Serif SC",serif;text-transform:uppercase;letter-spacing:.14em}
.uos-user-panel[data-theme=noir] .uos-user-card{border-radius:1px;border-width:2px;background:linear-gradient(125deg,#313236,#191a1d 65%);box-shadow:0 0 0 4px #0b0c0e,0 0 0 5px #74777b88}
.uos-user-panel[data-theme=noir] .uos-user-card::after{border-style:double;border-width:3px;border-radius:0}
.uos-user-panel[data-theme=noir] .uos-user-card::before{font-style:normal;opacity:.12}
/* Meadow: deep jade, translucent leaves and aged gold. */
.uos-user-panel[data-theme=meadow]{--bg:#112720;--surface:#1e3a30;--text:#f3f0dd;--muted:#c6d1bd;--accent:#d9d495;--line:#9bb28276;--glow:#a2b46444;--wash:#345c4655;--frame:#a4b284}
.uos-user-panel[data-theme=meadow]{border-radius:26px 8px 26px 8px;background:radial-gradient(ellipse at 94% 4%,#8fa76b55,transparent 37%),radial-gradient(ellipse at -12% 94%,#306b5555,transparent 45%),var(--bg)}
.uos-user-panel[data-theme=meadow]::before{border-radius:19px 3px 19px 3px}
.uos-user-panel[data-theme=meadow] .uos-user-card{border-radius:18px 4px 18px 4px;background:radial-gradient(ellipse at 100% 0%,#869e6644,transparent 52%),linear-gradient(130deg,#2a493a,#18332a)}
.uos-user-panel[data-theme=meadow] .uos-user-card::after{border-radius:12px 2px 12px 2px}
.uos-user-panel[data-theme=meadow] .uos-user-card::before{content:"❧";font-size:106px;right:13px;top:0;opacity:.16}
@media(max-width:600px){dialog.uos-user-overlay{width:calc(100vw - 16px);max-width:calc(100vw - 16px)}.uos-user-panel{max-height:86dvh;padding:16px 15px 13px}.uos-user-head{margin-bottom:11px;padding-bottom:10px}.uos-user-head h2{font-size:22px}.uos-user-card{padding:18px 16px 15px 20px;min-height:145px}.uos-user-card h3{font-size:17px}.uos-user-search{flex-wrap:wrap}.uos-user-search input{flex-basis:55%}.uos-user-search select{flex-basis:32%}.uos-user-list{gap:13px}}
.uos-user-panel{overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;min-height:0}
.uos-user-panel .uos-user-list{flex:none;min-height:0;overflow:visible;overscroll-behavior:auto}
.uos-user-panel .uos-user-card pre{max-height:none;overflow:visible}
.uos-user-watermark{position:relative;flex:none;margin-top:16px;padding:12px 60px 0 0;border-top:1px solid var(--line);color:var(--muted);font-size:10px;line-height:1.5;overflow-wrap:anywhere}
.uos-user-version-badge{align-self:start;margin:auto 0 0;color:var(--accent);font:10px/1.3 Georgia,serif;white-space:nowrap}
.uos-user-version{position:absolute;right:0;bottom:0;color:var(--accent);font:10px/1.5 Georgia,serif;white-space:nowrap}
@media(prefers-reduced-motion:reduce){.uos-user-panel button,.uos-user-panel select,.uos-user-search input{transition:none}}

.uos-user-panel[data-theme=starmap]{--bg:#09182c;--surface:#102b43;--text:#e5f5f9;--muted:#abc6d2;--accent:#9bdbe9;--line:#64a9c286;--glow:#286d9270;--wash:#27527648;--frame:#78bed1}.uos-user-panel[data-theme=starmap] .uos-user-card{border-radius:18px 4px 18px 4px;background:radial-gradient(circle at 86% 24%,transparent 0 35px,#9bdbe935 36px 37px,transparent 38px),linear-gradient(135deg,#173b59,#0d2036)}.uos-user-panel[data-theme=starmap] .uos-user-card::before{font-family:system-ui,sans-serif;font-weight:300;letter-spacing:-.12em}.uos-user-trigger[data-theme=starmap]{background:#123048;border-color:#9bdbe9;color:#e5f5f9}
.uos-user-panel[data-theme=rose]{--bg:#31232d;--surface:#503743;--text:#fff0e7;--muted:#e4c9ca;--accent:#f2c5b5;--line:#dea5ac88;--glow:#d3829665;--wash:#965c6b55;--frame:#e1a6ad}.uos-user-panel[data-theme=rose] .uos-user-card{border-radius:24px 24px 6px 6px;background:radial-gradient(circle at 85% 18%,#eaa6a353,transparent 38%),linear-gradient(135deg,#694658,#3b2935)}.uos-user-panel[data-theme=rose] .uos-user-card::before{font-style:italic;opacity:.2}.uos-user-panel[data-theme=rose] .uos-user-head h2{font-family:Georgia,"Noto Serif SC",serif}.uos-user-trigger[data-theme=rose]{background:#503743;border-color:#f2c5b5;color:#fff0e7}
.uos-user-panel[data-theme=wasteland]{--bg:#1c2225;--surface:#292c2d;--text:#f5ece2;--muted:#c9bcb2;--accent:#f3a969;--line:#c9805488;--glow:#a75b3c65;--wash:#78524044;--frame:#d18a5e;border-radius:5px}.uos-user-panel[data-theme=wasteland] .uos-user-card{border-radius:3px;border-left:5px solid var(--accent);background:repeating-linear-gradient(135deg,#f3a96916 0 5px,transparent 6px 19px),#292c2d}.uos-user-panel[data-theme=wasteland] .uos-user-card::before{font-family:system-ui,sans-serif;font-weight:800}.uos-user-trigger[data-theme=wasteland]{background:#292c2d;border-color:#f3a969;color:#f5ece2}

`;

function clean(text){return String(text||'').replace(/<[^>]*>/g,' ').replace(/\{\{[^}]*\}\}/g,' ').replace(/[#*_`>\[\]()]/g,' ').replace(/\s+/g,' ').trim()}
export function excludedTags(value){return [...new Set(String(value||'').split(/[，,、\s]+/).map(x=>x.trim().replace(/^<\/?|\/>?$/g,'')).filter(x=>/^[\w\p{Script=Han}-]{1,40}$/u.test(x)))].slice(0,40)}
function stripExcluded(text,tags){for(const tag of tags){const safe=tag.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');text=text.replace(new RegExp(`<${safe}(?:\\s[^<>]*)?>[\\s\\S]*?<\\/${safe}\\s*>`,'gi'),' ').replace(new RegExp(`<${safe}(?:\\s[^<>]*)?\\/?>`,'gi'),' ')}return text}
export function narrativeStart(body,excluded=[]){
  let text=stripExcluded(String(body||''),excluded).replace(/\r\n?/g,'\n').trim();
  const narrativeTag=/^(?:正文|content)$/i;
  for(let i=0;i<12 && text;i++){
    const before=text;
    text=text.replace(/^<!--[\s\S]*?-->\s*/,'').replace(/^(?:```|~~~)[^\n]*\n[\s\S]*?\n(?:```|~~~)\s*/,'').trimStart();
    const pair=text.match(/^<([^\s<>/]+)(?:\s[^<>]*)?>\s*([\s\S]*?)\s*<\/\1>\s*/i);
    if(pair){text=(narrativeTag.test(pair[1])?pair[2]:'')+text.slice(pair[0].length);text=text.trimStart()}
    else text=text.replace(/^<[^<>\n]{1,120}\/?>\s*/,'').trimStart();
    if(text===before)break;
  }
  return clean(text);
}
export function greetingTitle(body,index,excluded=[]){
  const content=narrativeStart(body,excluded),sentence=content.match(/^.{1,64}?[。！？!?]/)?.[0];
  return sentence||(`${content.slice(0,56)}${content.length>56?'…':''}`)||`开场 ${index+1}`;
}
export function greetingNames(body){
  const text=String(body||'').replace(/<!--[^]*?-->/g,'').replace(/```[^]*?```/g,'');
  const found=[];
  const add=name=>{const value=name?.trim();if(value && !found.includes(value) && found.length<3)found.push(value)};
  // Explicit names are valid anywhere, including inside metadata tags.
  for(const match of text.matchAll(/(?:姓名|人物姓名|角色名|角色姓名|登场人物|名字)[：:]\s*([\p{Script=Han}]{2,4})(?=$|[\s，,。；;|<])/gmu))add(match[1]);
  for(const match of text.matchAll(/<(姓名|角色名|人物姓名|角色姓名|名字)>\s*([\p{Script=Han}]{2,4})\s*<\/\1>/gmu))add(match[2]);
  for(const match of text.matchAll(/<(?:人物|角色|姓名)[^<>]*?(?:name|姓名|名字)=["']?([\p{Script=Han}]{2,4})["']?[^<>]*>/gmu))add(match[1]);
  // A list field explicitly denotes people regardless of its enclosing tag name.
  const lines=text.replace(/<\/?[^<>]*>/g,'\n').split(/\r?\n/);
  for(let i=0;i<lines.length;i++){
    if(!/^(?:(?:在场|出场|登场|主要|当前)?(?:角色|人物|人员|名单)|(?:角色|人物|人员)(?:名单|列表))[：:]\s*$/.test(lines[i].trim()))continue;
    for(let j=i+1;j<Math.min(i+15,lines.length);j++){
      const item=lines[j].trim().match(/^(?:[-*•·]|\d+[.、])\s*([\p{Script=Han}]{2,12})(.*)$/u);
      if(!item)break;
      const head=item[1];
      if(head.length<=4){add(head);continue}
      const words=[...new Intl.Segmenter('zh',{granularity:'word'}).segment(head)];
      const boundary=words.find(x=>x.index>=2&&x.index<=4&&x.segment.length>=2)?.index;
      if(boundary)add(head.slice(0,boundary));
    }
  }
  // Dialogue belongs to narrative sections or untagged text. Metadata labels
  // such as “场景类型” never become people merely because they precede a colon.
  const narrative=[...text.matchAll(/<(正文|content)(?:\s[^<>]*)?>([^]*?)<\/\1>/gi)].map(x=>x[2]);
  const outside=text.replace(/<([\w\p{Script=Han}-]+)(?:\s[^<>]*)?>[\s\S]*?<\/\1>/giu,' ');
  const story=[outside,...narrative].join('\n').replace(/<\/?[^<>]*>/g,'\n');
  for(const match of story.matchAll(/(?:^|\n)\s*(?:【|\[)?([\p{Script=Han}]{2,4})(?:】|\])?\s*[：:]\s*(?=[^\n]{1,80})/gmu)){
    if(/^(?:时间|地点|日期|天气|姓名|人物|角色|正文|内容|旁白|系统|状态|说明|剧情|备注|年龄|性别|身份|关系|身高|职业|性格|外貌|你|我|她|他|玩家|用户)$/.test(match[1]))continue;
    add(match[1]);
  }
  return found;
}
export function isLegacyGeneratedEntry(body,entry,index){
  if(!entry||typeof entry!=='object')return false;
  const plain=clean(body),title=plain.slice(0,20)||`开场 ${index+1}`;
  return entry.title===title && (entry.description||'')===plain.slice(20,88);
}
function labelKey(snapshot){
  const identity=`${snapshot.avatar}\u0000${snapshot.entries.map(entry=>entry.body).join('\u0000')}`;
  let hash=2166136261;for(let i=0;i<identity.length;i++)hash=Math.imul(hash^identity.charCodeAt(i),16777619);
  return `uos_player_labels_${(hash>>>0).toString(16)}`;
}
function parseNames(value){return [...new Set(String(value||'').split(/[,，、/\n]+/).map(x=>x.trim()).filter(Boolean))].slice(0,8)}
export function resolveDisplayEntry(entry,author={},local={},excluded=[]){
  const title=typeof local.title==='string'&&local.title.trim()?local.title.trim():typeof author.title==='string'&&author.title.trim()?author.title.trim():greetingTitle(entry.body,entry.index,excluded);
  const nameValue=typeof local.names==='string'?local.names:typeof author.names==='string'?author.names:null;
  const names=nameValue===null?entry.names:parseNames(nameValue);
  return {title,names,titleSource:local.title?.trim()?'玩家填写':author.title?.trim()?'作者填写':'自动提取',namesSource:nameValue===null?(names.length?'自动提取':'未识别'):typeof local.names==='string'?'玩家填写':'作者填写'};
}

export function readPlayerState(context,helper){
  const c=context?.characters?.[context.characterId];
  if(!c || (context.groupId!=null && context.groupId!==-1) || context.characterId==null)return null;
  const data=c.data||c,first=String(data.first_mes??c.first_mes??'');
  const alternates=data.alternate_greetings??c.alternate_greetings;
  if(!first || first.trimStart().startsWith('<UniversalOpeningSelector/>') || !Array.isArray(alternates) || !alternates.length)return null;
  if(typeof helper?.getChatMessages!=='function' || typeof helper?.setChatMessages!=='function')return null;
  let message,last;
  try{message=helper.getChatMessages(0,{include_swipes:true})?.[0];last=helper.getLastMessageId?.()}catch{return null}
  if(last!=null && Number(last)>0)return null;
  if(message?.role!=='assistant' || !Array.isArray(message.swipes) || !message.swipes.length)return null;
  const all=[first,...alternates],count=Math.min(all.length,message.swipes.length);
  if(count<2)return null;
  const settings=data.extensions?.[KEY]||{};
  const metadata=settings.entries||[],excluded=excludedTags(settings.excludedTags);
  return {characterId:context.characterId,avatar:c.avatar||data.name||'',swipeId:Number(message.swipe_id)||0,entries:all.slice(0,count).map((body,i)=>({index:i,body,title:!isLegacyGeneratedEntry(body,metadata[i],i)&&metadata[i]?.title||greetingTitle(body,i,excluded),description:isLegacyGeneratedEntry(body,metadata[i],i)?'':metadata[i]?.description||'',names:greetingNames(body),label:metadata[i]?.label||`OPENING ${String(i+1).padStart(2,'0')}`}))};
}

export function mountPlayerSelector(startDocument=document,helperApi){
  let doc=startDocument,win=doc.defaultView;
  try{for(let i=0;i<8 && win?.parent && win.parent!==win;i++){void win.parent.document;win=win.parent;doc=win.document}}catch{}
  // Script replacement rebinds the helper API even if the same version runs again.
  doc.__uosPlayer?.close?.();
  const host=doc.defaultView||globalThis;
  const helper=helperApi||host.TavernHelper||host;
  const style=doc.createElement('style');style.dataset.uosUserStyle='';style.textContent=CSS;(doc.head||doc.documentElement).append(style);
  let trigger=null,overlay=null,updating=false,suppressClickUntil=0;
  const positionKey='uos_player_button_position';
  function clampButton(left,top){
    if(!trigger)return;
    const width=trigger.offsetWidth,height=trigger.offsetHeight;
    const x=Math.max(8,Math.min(left,host.innerWidth-width-8));
    const y=Math.max(8,Math.min(top,host.innerHeight-height-8));
    trigger.style.left=`${x}px`;trigger.style.top=`${y}px`;
  }
  function applySavedPosition(){
    try{const saved=JSON.parse(host.localStorage.getItem(positionKey));
      if(!Number.isFinite(saved?.x)||!Number.isFinite(saved?.y))return;
      trigger.dataset.floating='true';clampButton(saved.x*host.innerWidth,saved.y*host.innerHeight);
    }catch{}
  }
  function enableDrag(button){
    let gesture=null,frame=0;
    const render=()=>{frame=0;if(!gesture?.moved)return;
      const x=Math.max(8,Math.min(gesture.left+gesture.dx,host.innerWidth-gesture.width-8));
      const y=Math.max(8,Math.min(gesture.top+gesture.dy,host.innerHeight-gesture.height-8));
      gesture.x=x;gesture.y=y;button.style.transform=`translate3d(${x-gesture.left}px,${y-gesture.top}px,0)`;
    };
    button.onpointerdown=e=>{if(e.button!==0 && e.pointerType==='mouse')return;
      const rect=button.getBoundingClientRect();gesture={id:e.pointerId,startX:e.clientX,startY:e.clientY,left:rect.left,top:rect.top,width:rect.width,height:rect.height,dx:0,dy:0,moved:false};
      button.setPointerCapture?.(e.pointerId);
    };
    button.onpointermove=e=>{if(!gesture||e.pointerId!==gesture.id)return;
      const dx=e.clientX-gesture.startX,dy=e.clientY-gesture.startY;
      if(!gesture.moved && Math.hypot(dx,dy)<8)return;
      if(!gesture.moved){gesture.moved=true;button.dataset.floating='true';button.style.left=`${gesture.left}px`;button.style.top=`${gesture.top}px`;button.style.willChange='transform'}
      gesture.dx=dx;gesture.dy=dy;if(!frame)frame=host.requestAnimationFrame(render);
      e.preventDefault();
    };
    const finish=e=>{if(!gesture||e.pointerId!==gesture.id)return;
      if(gesture.moved){suppressClickUntil=Date.now()+500;if(frame)host.cancelAnimationFrame(frame);frame=0;
        if(e.type==='pointerup'){gesture.dx=e.clientX-gesture.startX;gesture.dy=e.clientY-gesture.startY}render();
        button.style.transform='';button.style.willChange='';button.style.left=`${gesture.x}px`;button.style.top=`${gesture.y}px`;
        try{host.localStorage.setItem(positionKey,JSON.stringify({x:gesture.x/host.innerWidth,y:gesture.y/host.innerHeight}))}catch{}
      }
      gesture=null;
    };
    button.onpointerup=finish;button.onpointercancel=finish;
  }
  const el=(tag,className,text)=>{const node=doc.createElement(tag);node.className=className;if(text!=null)node.textContent=String(text);return node};
  const state=()=>readPlayerState(host.SillyTavern?.getContext?.(),helper);
  const removeTrigger=()=>{trigger?.remove();trigger=null};
  function scan(){
    if(updating)return;updating=true;
    try{
      const snapshot=state(),first=doc.querySelector('#chat .mes[mesid="0"],#chat .mes[data-mesid="0"]');
      if(!snapshot||!first){removeTrigger();closePanel();return}
      if(!trigger){trigger=el('button','uos-user-trigger');trigger.type='button';trigger.style.touchAction='none';
        trigger.onclick=()=>{if(Date.now()>=suppressClickUntil)openPanel()};enableDrag(trigger);
      }
      try{trigger.dataset.theme=host.localStorage.getItem('uos_player_theme')||'archive'}catch{}
      const label=`◈ 预览开场 · ${snapshot.swipeId+1}/${snapshot.entries.length}`;
      if(trigger.textContent!==label)trigger.textContent=label;
      if(trigger.nextElementSibling!==first || trigger.parentNode!==first.parentNode){first.before(trigger);applySavedPosition()}
    }finally{updating=false}
  }
  function closePanel(){const active=overlay;overlay=null;if(active?.open)active.close();active?.remove()}
  function openPanel(){
    const snapshot=state();if(!snapshot)return;
    const storageKey=labelKey(snapshot);let customLabels={};
    try{const saved=JSON.parse(host.localStorage.getItem(storageKey));if(saved && typeof saved==='object' && !Array.isArray(saved))customLabels=saved}catch{}
    closePanel();overlay=el('dialog','uos-user-overlay');
    const panel=el('section','uos-user-panel');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','预览和选择开场');
    let theme='archive';try{theme=host.localStorage.getItem('uos_player_theme')||theme}catch{}
    panel.dataset.theme=THEMES.some(x=>x[0]===theme)?theme:'archive';
    const head=el('div','uos-user-head'),heading=el('div'),kicker=el('span','uos-user-kicker',THEME_CAPTIONS[panel.dataset.theme]);heading.append(kicker,el('h2','','选择故事的起点'),el('p','',`已读取 ${snapshot.entries.length} 条开场，选择后切换首条消息。`));
    const close=el('button','uos-user-close','关闭');close.type='button';close.onclick=closePanel;head.append(heading,el('small','uos-user-version-badge',`v${VERSION}`),close);
    const tools=el('div','uos-user-tools');tools.append(el('span','','主题'));
    const select=el('select','');select.setAttribute('aria-label','选择主题');for(const [id,name] of THEMES){const option=el('option','',name);option.value=id;select.append(option)}select.value=panel.dataset.theme;select.onchange=()=>{panel.dataset.theme=select.value;kicker.textContent=THEME_CAPTIONS[select.value];if(trigger)trigger.dataset.theme=select.value;try{host.localStorage.setItem('uos_player_theme',select.value)}catch{}};tools.append(select);
    const list=el('div','uos-user-list'),status=el('p','uos-user-status');
    const character=host.SillyTavern?.getContext?.()?.characters?.[snapshot.characterId];
    const authorConfig=(character?.data||character)?.extensions?.[KEY]||{};
    const authorEntries=Array.isArray(authorConfig.entries)?authorConfig.entries.map((entry,i)=>isLegacyGeneratedEntry(snapshot.entries[i]?.body,entry,i)?{...entry,title:'',description:''}:entry):[];
    const authorExcluded=excludedTags(authorConfig.excludedTags);
    const editKey=labelKey(snapshot).replace('_labels_','_edits_');
    let localEdits={};try{const saved=JSON.parse(host.localStorage.getItem(editKey));if(saved&&typeof saved==='object'&&!Array.isArray(saved))localEdits=saved}catch{}
    const exclusionKey=`uos_player_excluded_${snapshot.avatar}`;
    let localExcluded=[];try{localExcluded=excludedTags(host.localStorage.getItem(exclusionKey))}catch{}
    const exclusion=el('details','uos-user-label-settings');exclusion.append(el('summary','','排除标题中的 <字段>'));
    const hint=el('p','','填写标签名，用逗号隔开，例如：状态, 时间, 角色档案。只影响标题提取，不影响人物识别和完整原文。');exclusion.append(hint);
    if(authorExcluded.length)exclusion.append(el('p','',`作者预设：${authorExcluded.join('、')}`));
    const exclusionInput=el('input');exclusionInput.type='text';exclusionInput.value=localExcluded.join(', ');exclusionInput.placeholder='例如：状态, 时间';exclusionInput.setAttribute('aria-label','要排除的尖括号字段');exclusion.append(exclusionInput);
    const saveExclusion=el('button','','保存排除字段');saveExclusion.type='button';saveExclusion.onclick=()=>{localExcluded=excludedTags(exclusionInput.value);try{host.localStorage.setItem(exclusionKey,localExcluded.join(','))}catch{};renderCards();status.textContent='排除字段已应用于标题。'};exclusion.append(saveExclusion);
    const saveAuthor=el('button','','保存到角色卡（作者）');saveAuthor.type='button';saveAuthor.onclick=async()=>{
      const context=host.SillyTavern?.getContext?.(),card=context?.characters?.[snapshot.characterId];
      if(!card?.avatar||typeof context?.getRequestHeaders!=='function'||typeof context?.writeExtensionField!=='function'){status.textContent='当前环境无法写入角色卡。';return}
      saveAuthor.disabled=true;try{
        const data=card.data||card,original=data.extensions?.[KEY]||{};
        const next={...original,excludedTags:excludedTags(exclusionInput.value).join(',')};
        const response=await host.fetch('/api/characters/merge-attributes',{method:'POST',headers:context.getRequestHeaders(),body:JSON.stringify({avatar:card.avatar,data:{extensions:{[KEY]:next}}})});
        if(!response.ok)throw Error(`HTTP ${response.status}`);
        await context.writeExtensionField(snapshot.characterId,KEY,next);
        authorExcluded.splice(0,authorExcluded.length,...excludedTags(next.excludedTags));renderCards();status.textContent='已写入角色卡，请从酒馆重新导出后分享。';
      }catch(error){status.textContent=`保存到角色卡失败：${error?.message||error}`}finally{saveAuthor.disabled=false}
    };exclusion.append(saveAuthor);status.setAttribute('role','status');
    const edits=el('details','uos-user-label-settings');edits.append(el('summary','','修正标题和登场人物'));
    const editFields=[];
    for(const entry of snapshot.entries){
      const box=el('div','');box.append(el('strong','',`开场 ${entry.index+1}`));
      const effective=resolveDisplayEntry(entry,authorEntries[entry.index],localEdits[entry.index],[...authorExcluded,...localExcluded]);
      const titleInput=el('input');titleInput.type='text';titleInput.maxLength=100;titleInput.value=localEdits[entry.index]?.title??authorEntries[entry.index]?.title??'';titleInput.placeholder=effective.title;
      const namesInput=el('input');namesInput.type='text';namesInput.maxLength=200;const savedNames=localEdits[entry.index]?.names??authorEntries[entry.index]?.names;namesInput.value=savedNames===''?'无':savedNames??'';namesInput.placeholder=entry.names.join('、')||'未识别，可填写姓名';
      const titleField=el('label');titleField.append(el('span','','标题（留空使用自动提取）'),titleInput);
      const namesField=el('label');namesField.append(el('span','','人物（逗号分隔；输入“无”可隐藏误判）'),namesInput);
      box.append(titleField,namesField);edits.append(box);editFields.push({entry,titleInput,namesInput});
    }
    const collectEdits=()=>Object.fromEntries(editFields.map(({entry,titleInput,namesInput})=>{
      const names=namesInput.value.trim();return [entry.index,{title:titleInput.value.trim().slice(0,100),...(names?{names:names==='无'?'':names.slice(0,200)}:{})}];
    }));
    const saveEdits=el('button','','仅保存到本机');saveEdits.type='button';saveEdits.onclick=()=>{localEdits=collectEdits();try{host.localStorage.setItem(editKey,JSON.stringify(localEdits));status.textContent='修正已保存在本机。'}catch{status.textContent='本机存储不可用，修正仅在本次预览中有效。'}renderCards()};edits.append(saveEdits);
    const saveCardEdits=el('button','','保存到角色卡（作者）');saveCardEdits.type='button';saveCardEdits.onclick=async()=>{
      const context=host.SillyTavern?.getContext?.(),card=context?.characters?.[snapshot.characterId];
      if(!card?.avatar||typeof context?.getRequestHeaders!=='function'||typeof context?.writeExtensionField!=='function'){status.textContent='当前环境无法写入角色卡。';return}
      saveCardEdits.disabled=true;try{
        const original=(card.data||card).extensions?.[KEY]||{},values=collectEdits();
        const next={...original,entries:snapshot.entries.map((entry,i)=>{
          const saved={...original.entries?.[i]};if(values[i].title)saved.title=values[i].title;else delete saved.title;
          if(Object.hasOwn(values[i],'names'))saved.names=values[i].names;else delete saved.names;
          return saved;
        })};
        const response=await host.fetch('/api/characters/merge-attributes',{method:'POST',headers:context.getRequestHeaders(),body:JSON.stringify({avatar:card.avatar,data:{extensions:{[KEY]:next}}})});
        if(!response.ok)throw Error(`HTTP ${response.status}`);
        await context.writeExtensionField(snapshot.characterId,KEY,next);
        authorEntries.splice(0,authorEntries.length,...next.entries);localEdits={};host.localStorage.removeItem(editKey);renderCards();status.textContent='修正已写入角色卡；重新导出后即可分享。';
      }catch(error){status.textContent=`保存到角色卡失败：${error?.message||error}`}finally{saveCardEdits.disabled=false}
    };edits.append(saveCardEdits);
    const labelSettings=el('details','uos-user-label-settings');labelSettings.append(el('summary','','自定义开场标签（仅保存在本机）'));
    const labelInputs=[],labelTexts=[];
    for(const entry of snapshot.entries){const field=el('label');field.append(el('span','',`第 ${entry.index+1} 条开场`));
      const input=el('input');input.type='text';input.maxLength=60;input.value=typeof customLabels[entry.index]==='string'?customLabels[entry.index]:entry.label;
      input.setAttribute('aria-label',`第 ${entry.index+1} 条开场标签`);field.append(input);labelInputs.push(input);labelSettings.append(field)}
    const saveLabels=el('button','','保存标签');saveLabels.type='button';saveLabels.onclick=()=>{
      const next={};for(const entry of snapshot.entries){const value=labelInputs[entry.index].value.trim().slice(0,60);
        if(value && value!==entry.label)next[entry.index]=value;
        if(labelTexts[entry.index])labelTexts[entry.index].textContent=(value||entry.label)+(entry.description?` · ${entry.description}`:'');
      }
      try{if(Object.keys(next).length)host.localStorage.setItem(storageKey,JSON.stringify(next));else host.localStorage.removeItem(storageKey);
        status.textContent='标签已保存在本机。';customLabels=next
      }catch{status.textContent='本机存储不可用，标签仅在本次预览中有效。'}
    };labelSettings.append(saveLabels);
    const search=el('div','uos-user-search'),query=el('input'),person=el('select');query.type='search';query.placeholder='搜索标题、人物或开场正文';query.setAttribute('aria-label','搜索开场');person.setAttribute('aria-label','按人物筛选');search.append(query,person);
    query.oninput=()=>renderCards();person.onchange=()=>renderCards();
    function renderCards(){list.replaceChildren();const resolved=snapshot.entries.map(entry=>resolveDisplayEntry(entry,authorEntries[entry.index],localEdits[entry.index],[...authorExcluded,...localExcluded]));
      const selected=person.value;person.replaceChildren();const any=el('option','','全部人物');any.value='';person.append(any);
      for(const name of new Set(resolved.flatMap(x=>x.names))){const option=el('option','',name);option.value=name;person.append(option)}person.value=selected;
      let visible=0;for(const entry of snapshot.entries){const display=resolved[entry.index],term=query.value.trim().toLocaleLowerCase();
      if((person.value&&!display.names.includes(person.value))||(term&&![display.title,...display.names,entry.body].some(x=>x.toLocaleLowerCase().includes(term))))continue;visible++;
      const card=el('article','uos-user-card');card.dataset.current=String(entry.index===snapshot.swipeId);card.dataset.number=String(entry.index+1).padStart(2,'0');
      const labelText=el('p','',typeof customLabels[entry.index]==='string'&&customLabels[entry.index]?customLabels[entry.index]:entry.label);
      if(entry.description)labelText.append(doc.createTextNode(` · ${entry.description}`));
      labelTexts[entry.index]=labelText;card.append(el('h3','',display.title),el('small','uos-user-source',`标题：${display.titleSource}`),labelText);
      card.append(el('p','uos-user-names',display.names.length?`登场人物 · ${display.names.join(' / ')}（${display.namesSource}）`:`登场人物 · 未识别`));
      const details=el('details','');details.append(el('summary','','预览完整正文'),el('pre','',entry.body));card.append(details);
      const choose=el('button','uos-user-select',entry.index===snapshot.swipeId?'当前开场':`进入开场 ${entry.index+1}`);choose.type='button';choose.disabled=entry.index===snapshot.swipeId;
      choose.onclick=async()=>{
        const current=state();
        if(!current||current.characterId!==snapshot.characterId||current.avatar!==snapshot.avatar||entry.index>=current.entries.length){status.textContent='角色或聊天已变化，请重新打开选择器。';return}
        choose.disabled=true;status.textContent='正在切换开场…';
        try{await helper.setChatMessages([{message_id:0,swipe_id:entry.index}],{refresh:'all'});
          const after=state();if(after?.swipeId!==entry.index)throw Error('消息页未切换');closePanel();scan();
        }catch(error){status.textContent=`切换失败：${error?.message||error}`;choose.disabled=false}
      };
      card.append(choose);list.append(card);
    }if(!visible)list.append(el('p','uos-user-empty','没有匹配的开场，请换个关键词。'))}
    for(const sheet of [exclusion,edits,labelSettings])sheet.addEventListener('toggle',()=>{if(sheet.open)for(const other of [exclusion,edits,labelSettings])if(other!==sheet)other.open=false});
    renderCards();
    const mark=el('p','uos-user-watermark',WATERMARK);mark.append(el('span','uos-user-version',`v${VERSION}`));
    panel.append(head,tools,search,exclusion,edits,labelSettings,list,status,mark);overlay.append(panel);(doc.body||doc.documentElement).append(overlay);
    const active=overlay;
    try{active.showModal()}catch(error){closePanel();console.warn('[Aliceneko Opening Selector] 弹窗无法打开',error);return}
    active.onclick=e=>{if(e.target===active)closePanel()};active.onclose=()=>{active.remove();if(overlay===active)overlay=null};close.focus();
  }
  const observer=new host.MutationObserver(scan);
  if(doc.body)observer.observe(doc.body,{childList:true,subtree:true});
  const onResize=()=>{if(trigger?.dataset.floating==='true')clampButton(parseFloat(trigger.style.left)||8,parseFloat(trigger.style.top)||8)};
  host.addEventListener('resize',onResize);
  const timer=host.setInterval(scan,1500);scan();
  const runnerWindow=startDocument.defaultView;
  const onPageHide=()=>{if(doc.__uosPlayer===api)api.close()};
  const api={version:'1.0.1',scan,close:()=>{observer.disconnect();host.removeEventListener('resize',onResize);host.clearInterval(timer);runnerWindow?.removeEventListener?.('pagehide',onPageHide);closePanel();removeTrigger();style.remove();if(doc.__uosPlayer===api)delete doc.__uosPlayer}};
  doc.__uosPlayer=api;
  // Tavern Helper runs this script in its own iframe; saving/replacing it closes that frame.
  if(runnerWindow!==host)runnerWindow?.addEventListener?.('pagehide',onPageHide,{once:true});
  return api;
}
