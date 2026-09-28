const AUTHOR_HTML="\u003c!doctype html>\u003chtml lang=\"zh-CN\">\u003chead>\u003cmeta charset=\"utf-8\">\u003cmeta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\u003cstyle id=\"uos-css\">:root{color-scheme:dark;font-family:system-ui,\"Noto Sans SC\",sans-serif}*{box-sizing:border-box}body{margin:0;background:transparent;color:var(--text)}button,input,textarea{font:inherit}button{cursor:pointer}.uos{--bg:#101820;--panel:#1a2630;--text:#f5eee2;--muted:#aeb6b7;--accent:#cf9b66;--line:#a7805d88;--art:#324653;background:radial-gradient(circle at 80% -10%,var(--art),transparent 55%),var(--bg);min-height:420px;padding:clamp(18px,4vw,40px);border:1px solid var(--line);border-radius:18px;box-shadow:0 20px 50px #0007;position:relative;overflow:hidden}.uos[data-theme=archive]{--bg:#111a20;--panel:#1b2930;--text:#f4ecda;--muted:#b8b4a8;--accent:#c99d67;--line:#a5794e88;--art:#485043}.uos[data-theme=neon]{--bg:#090b1e;--panel:#17132e;--text:#f5eaff;--muted:#beb3d7;--accent:#f572c0;--line:#af71ed99;--art:#39265c}.uos[data-theme=paper]{--bg:#efe7d8;--panel:#fffaf0;--text:#362e2b;--muted:#685d55;--accent:#a75345;--line:#b8947baa;--art:#d7b7a1;color-scheme:light}.uos[data-theme=noir]{--bg:#111113;--panel:#222326;--text:#f4f3f0;--muted:#b3b5b8;--accent:#d9dfdf;--line:#81858c99;--art:#42484f}.uos[data-theme=meadow]{--bg:#132821;--panel:#213b2d;--text:#f1f5dc;--muted:#c2cdb5;--accent:#c8df88;--line:#98b06b99;--art:#456846}.uos:before{content:\"\";position:absolute;inset:0;pointer-events:none;opacity:.12;background:repeating-linear-gradient(0deg,transparent 0 3px,#fff 4px);mix-blend-mode:soft-light}.uos>*{position:relative}.uos-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.uos-kicker{font-size:11px;letter-spacing:.26em;color:var(--accent);font-weight:800}.uos-actions{display:flex;gap:8px;flex-shrink:0}.uos-icon{border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:10px;padding:9px 12px;min-height:38px;white-space:nowrap;font-size:12px}.uos-icon:hover,.uos-card:hover{border-color:var(--accent);transform:translateY(-2px)}h1{font-size:clamp(26px,5vw,46px);line-height:1.2;margin:30px 0 10px;letter-spacing:.035em}.uos-intro{max-width:720px;color:var(--muted);line-height:1.7;margin:0 0 28px}.uos-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:16px}.uos-card{border:1px solid var(--line);padding:0;background:var(--panel);color:var(--text);border-radius:14px;text-align:left;overflow:hidden;transition:transform .2s,border-color .2s;min-width:0}.uos-cover{height:150px;display:flex;align-items:flex-end;padding:16px;background:linear-gradient(125deg,var(--art),var(--panel));position:relative;overflow:hidden}.uos-cover.has-image{background-position:center;background-size:cover}.uos-cover.has-image:after{content:\"\";position:absolute;inset:30% 0 0;background:linear-gradient(transparent,#0008)}.uos-number{font-family:Georgia,serif;font-size:68px;line-height:.9;font-weight:700;opacity:.5;color:var(--accent);position:relative;z-index:1}.uos-card-body{padding:16px}.uos-label{font-size:11px;letter-spacing:.14em;color:var(--accent);font-weight:800}.uos-card strong{display:block;font-size:18px;margin:8px 0;line-height:1.35}.uos-description{color:var(--muted);font-size:13px;line-height:1.6;min-height:40px}.uos-footer{margin-top:22px;color:var(--muted);font-size:12px;line-height:1.6}.uos-player{display:flex;gap:12px;align-items:center;margin:0 0 22px;padding:12px;border:1px solid var(--line);background:var(--panel);border-radius:12px}.uos-player button{background:var(--accent);border:0;border-radius:8px;padding:7px 12px;color:var(--bg)}.uos-player-meta{min-width:0;flex:1}.uos-lyric{color:var(--muted);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.uos-dialog{position:fixed;inset:0;z-index:50;display:grid;place-items:center;background:#000a;padding:12px}.uos-dialog[hidden]{display:none}.uos-sheet{width:min(740px,100%);max-height:95vh;overflow:auto;background:var(--bg);color:var(--text);border:1px solid var(--accent);border-radius:16px;padding:20px;box-shadow:0 20px 60px #0009}.uos-sheet-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.uos-sheet h2{margin:0 0 10px}.uos-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.uos-field{display:grid;gap:6px;margin:10px 0;font-size:13px}.uos-field input,.uos-field textarea{width:100%;border:1px solid var(--line);border-radius:7px;padding:9px;background:var(--panel);color:var(--text)}.uos-field textarea{min-height:60px;resize:vertical}.uos-entry{border-top:1px solid var(--line);padding:10px 0}.uos-help{color:var(--muted);font-size:12px;line-height:1.6}.uos-save{border:0;border-radius:8px;padding:10px 16px;background:var(--accent);color:var(--bg);font-weight:700}.uos-status{min-height:20px;color:var(--accent);font-size:12px}.uos-theme-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.uos-theme-choice{border:1px solid var(--line);border-radius:9px;padding:12px 4px;background:var(--panel);color:var(--text)}.uos-theme-choice[aria-pressed=true]{outline:2px solid var(--accent)}@media(max-width:600px){.uos-theme-grid{grid-template-columns:repeat(3,1fr)}.uos{padding:18px}.uos-cover{height:130px}}@media(prefers-reduced-motion:reduce){.uos-card{transition:none}.uos-icon:hover,.uos-card:hover{transform:none}}\n:where([hidden]){display:none!important}\n\n/* Soundtrack panel follows the five selector themes. */\n.uos-player[hidden],.uos-dialog[hidden],[data-tab-panel][hidden]{display:none!important}\n.uos-player{position:relative;display:block;margin:0 0 24px;padding:17px 19px 15px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(115deg,var(--panel),var(--bg) 60%,var(--art));box-shadow:inset 0 1px 0 #ffffff1a,0 16px 34px #0005;overflow:hidden}\n.uos-player::before{content:\"\";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent)}\n.uos-player-head{display:flex;align-items:center;gap:14px;margin-bottom:12px}\n.uos-player-record{display:grid;place-items:center;flex:none;width:46px;height:46px;border:1px solid var(--accent);border-radius:50%;background:repeating-radial-gradient(circle,var(--bg) 0 2px,var(--art) 3px 4px);box-shadow:0 3px 12px #0009}\n.uos-player-record::after{content:\"\";width:11px;height:11px;border-radius:50%;background:var(--accent);border:2px solid var(--bg)}\n.uos-player-meta{min-width:0;flex:1}.uos-player-kicker{display:block;margin-bottom:3px;color:var(--accent);font-size:10px;letter-spacing:.2em}.uos-player-meta strong{display:block;font-size:clamp(17px,2.8vw,22px);color:var(--text)}\n.uos-player-controls{display:flex;align-items:center;gap:8px}.uos-player-controls button{flex:none;width:32px;height:32px;padding:0;border:1px solid var(--line);border-radius:50%;background:var(--panel);color:var(--text);font-size:16px}.uos-player-controls [data-play]{width:40px;height:40px;background:var(--accent);border-color:var(--accent);color:var(--bg)}\n.uos-player-track{display:flex;align-items:center;gap:12px}.uos-player-track input{flex:1;min-width:0;accent-color:var(--accent)}.uos-player-track span{color:var(--muted);font-size:11px;font-variant-numeric:tabular-nums;white-space:nowrap}\n.uos-lyrics{height:138px;margin-top:14px;padding:28px 8px;border-top:1px solid var(--line);overflow-y:auto;scrollbar-width:thin;text-align:center;color:var(--muted);font-size:13px;line-height:1.5;mask-image:linear-gradient(transparent,#000 22%,#000 80%,transparent)}\n.uos-player .uos-lyric-row{display:block;width:100%;min-height:0;margin:0 auto 11px;padding:4px 8px;text-align:center;border:0;border-radius:0;background:transparent;box-shadow:none;color:var(--muted);font:13px/1.45 \"Noto Serif SC\",\"Songti SC\",serif;transition:color .2s,transform .2s}.uos-player .uos-lyric-row:hover,.uos-player .uos-lyric-row:focus-visible{color:var(--text);outline:0;background:transparent;transform:none}.uos-player .uos-lyric-row.is-active{color:var(--accent);font-weight:700;transform:scale(1.03);text-shadow:0 0 22px currentColor;background:transparent}\n.uos-player audio{display:none}\n.uos-tabs{display:flex;gap:8px;margin:14px 0 18px;padding:4px;border:1px solid var(--line);border-radius:12px;background:var(--panel)}.uos-tabs button{flex:1;padding:9px 12px;border:0;border-radius:9px;background:transparent;color:var(--muted)}.uos-tabs button[aria-selected=true]{background:var(--accent);color:var(--bg);font-weight:700}\n.uos-sheet{max-height:min(88dvh,820px)}\n@media(max-width:600px){.uos-player{padding:14px}.uos-player-head{gap:9px}.uos-player-record{width:36px;height:36px}.uos-player-controls{gap:4px}.uos-player-controls button{width:28px;height:28px}.uos-player-controls [data-play]{width:36px;height:36px}.uos-player-track{gap:7px}}\n.uos-toggle{display:flex;align-items:center;gap:10px;margin:10px 0 16px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--text);font-weight:700}.uos-toggle input{width:18px;height:18px;accent-color:var(--accent)}.uos-player-controls [data-play]:disabled{opacity:.5;cursor:not-allowed}\n:host{font-family:system-ui,\"Noto Sans SC\",sans-serif}.uos-dialog{position:fixed;inset:0;box-sizing:border-box;z-index:1;pointer-events:auto;overflow:hidden}.uos-sheet{box-sizing:border-box;min-height:0;max-height:calc(100dvh - 24px);max-width:100%;overscroll-behavior:contain}.uos-dialog button,.uos-dialog input,.uos-dialog textarea{font:inherit}\n\n.uos-top-status{min-height:0;margin:10px 0 0}.uos-top-status:empty{display:none}\n.uos-cover-preview{height:88px;margin:10px 0;border:1px solid var(--line);border-radius:10px}.uos-cover-preview .uos-number{font-size:45px}\n.uos-source{margin:10px 0;color:var(--muted);font-size:12px}.uos-source summary{cursor:pointer;color:var(--accent);padding:8px 0}.uos-source pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:180px;overflow:auto;margin:0;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--text);font-size:12px;line-height:1.6;font-family:inherit}\n.uos-card-preview{max-width:300px;margin:8px 0 14px;pointer-events:none}.uos-card-preview .uos-cover{height:96px}.uos-card-preview .uos-number{font-size:48px}.uos-card-preview .uos-card-body{padding:12px}.uos-entry>.uos-icon{margin:0 8px 8px 0;white-space:normal;text-align:left}\n.uos-theme-choice{display:grid;gap:8px;text-align:center}.uos-theme-swatch{--sw-bg:#111a20;--sw-art:#485043;--sw-accent:#c99d67;display:grid;align-content:center;gap:5px;height:72px;padding:8px;border:1px solid var(--sw-accent);border-radius:7px;background:linear-gradient(135deg,var(--sw-art),var(--sw-bg));color:var(--sw-accent);text-align:left}.uos-theme-swatch[data-theme=neon]{--sw-bg:#090b1e;--sw-art:#39265c;--sw-accent:#f572c0}.uos-theme-swatch[data-theme=paper]{--sw-bg:#fffaf0;--sw-art:#d7b7a1;--sw-accent:#a75345}.uos-theme-swatch[data-theme=noir]{--sw-bg:#111113;--sw-art:#42484f;--sw-accent:#d9dfdf}.uos-theme-swatch[data-theme=meadow]{--sw-bg:#132821;--sw-art:#456846;--sw-accent:#c8df88}.uos-theme-swatch-cover{font:bold 27px Georgia,serif;line-height:1}.uos-theme-swatch-lines{font-size:8px;letter-spacing:.08em;white-space:nowrap;overflow:hidden}\n.uos-diagnostic-row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);font-size:12px}.uos-diagnostic-row span{color:var(--muted)}.uos-diagnostic-row strong{text-align:right;overflow-wrap:anywhere}\n\n/* Six visual identities share the same layout and controls. */\n.uos{--display:Georgia,\"Noto Serif SC\",\"Songti SC\",serif;--cover:linear-gradient(135deg,var(--art),var(--panel));--surface:var(--panel);font-family:system-ui,\"Noto Sans SC\",sans-serif;isolation:isolate}\n.uos h1{font-family:var(--display);font-weight:600;letter-spacing:.065em;color:var(--text)!important}\n.uos .uos-card{background:var(--surface);box-shadow:0 12px 30px #0002}\n.uos .uos-cover:not(.has-image){background:var(--cover)}\n.uos .uos-card strong{font-family:var(--display);font-size:20px;font-weight:600}\n.uos .uos-kicker{display:inline-flex;align-items:center;gap:12px;line-height:1.5}\n.uos .uos-kicker:before{content:\"\";width:22px;height:1px;background:currentColor}\n.uos .uos-number{font-weight:400;font-variant-numeric:lining-nums}\n.uos .uos-icon,.uos .uos-card,.uos .uos-player{transition:border-color .2s,box-shadow .2s,transform .2s}\n.uos .uos-icon:focus-visible,.uos .uos-card:focus-visible,.uos-theme-choice:focus-visible{outline:2px solid var(--accent);outline-offset:3px}\n.uos[data-theme=archive]{--bg:#111a21;--panel:#202d35;--surface:#1a272e;--text:#f1e7d4;--muted:#bbb7aa;--accent:#deb47c;--line:#b9966959;--art:#334b50;--cover:radial-gradient(circle at 78% 20%,#a6895850,transparent 48%),repeating-linear-gradient(0deg,transparent 0 25px,#ffffff0b 26px 27px),linear-gradient(145deg,#31454a,#17232b 72%);background:radial-gradient(circle at 84% 4%,#86704b3b,transparent 42%),linear-gradient(140deg,#192832,#101a21 72%)}\n.uos[data-theme=archive] .uos-card{border-radius:4px 18px 4px 18px;border-color:#bb9d6f69}.uos[data-theme=archive] .uos-card-body{border-top:1px solid #deb47c55}.uos[data-theme=archive] .uos-number{font-style:italic}.uos[data-theme=archive] .uos-kicker{font-family:Georgia,serif}\n.uos[data-theme=neon]{--bg:#080e22;--panel:#171c38;--surface:#111c32;--text:#f5f1ff;--muted:#b8b2d1;--accent:#fa74bf;--line:#9d7de37a;--art:#2e356b;--cover:radial-gradient(circle at 75% 12%,#ae74fa77,transparent 33%),linear-gradient(135deg,#392657,#11142c 75%);background:radial-gradient(circle at 94% 6%,#e34fba4d,transparent 35%),radial-gradient(circle at 4% 70%,#9a56d440,transparent 42%),#080e22}\n.uos[data-theme=neon] .uos-card{border-color:#ad86df9c;box-shadow:0 14px 40px #060c26,0 0 16px #8e5ccb32}.uos[data-theme=neon] .uos-cover{border-bottom:2px solid #f572c0b0}.uos[data-theme=neon] .uos-number{text-shadow:0 0 22px #f572c088}.uos[data-theme=neon] .uos-kicker{color:#d7a7ff}.uos[data-theme=neon] .uos-icon:hover{box-shadow:0 0 16px #fa74bf66}\n.uos[data-theme=paper]{--bg:#f4eee2;--panel:#fffaf0;--surface:#fffaf0;--text:#362d29;--muted:#675950;--accent:#a64d3c;--line:#a77e6b8c;--art:#e0c2ab;--cover:radial-gradient(circle at 80% 28%,#fffaf0,transparent 45%),linear-gradient(135deg,#d5b29d,#eee0cc 80%);background:repeating-linear-gradient(0deg,transparent 0 27px,#92796913 28px 29px),radial-gradient(circle at 90% 0%,#d7a38277,transparent 42%),#f4eee2;color-scheme:light}\n.uos[data-theme=paper]:before{opacity:.15;background:repeating-linear-gradient(90deg,#9a785016 0 1px,transparent 1px 5px);mix-blend-mode:multiply}.uos[data-theme=paper] .uos-card{border-radius:3px 18px 3px 18px;box-shadow:5px 7px 0 #997d6033}.uos[data-theme=paper] .uos-number{color:#a64d3c;opacity:.62}.uos[data-theme=paper] .uos-kicker{letter-spacing:.18em}.uos[data-theme=paper] .uos-icon{background:#fffaf0}\n.uos[data-theme=noir]{--bg:#121314;--panel:#27292b;--surface:#1d1f20;--text:#f2f1ec;--muted:#babbb9;--accent:#e4e1d5;--line:#a3a3a36b;--art:#545759;--cover:linear-gradient(90deg,#0c0d0e 0 8px,transparent 8px calc(100% - 8px),#0c0d0e calc(100% - 8px)),repeating-linear-gradient(0deg,#353738 0 24px,#525455 24px 26px);background:radial-gradient(circle at 65% 8%,#77777735,transparent 40%),#121314}\n.uos[data-theme=noir]:before{opacity:.12;background-image:repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 4px)}.uos[data-theme=noir] .uos-card,.uos[data-theme=noir] .uos-icon{border-radius:2px}.uos[data-theme=noir] .uos-cover{filter:grayscale(1)}.uos[data-theme=noir] .uos-kicker{letter-spacing:.31em}.uos[data-theme=noir] .uos-card-body{border-top:2px solid #eee9}\n.uos[data-theme=meadow]{--bg:#122a24;--panel:#254037;--surface:#203a30;--text:#f3f4e1;--muted:#c2d1bf;--accent:#d2e5a0;--line:#afc28970;--art:#587760;--cover:radial-gradient(ellipse at 75% 25%,#d2e5a050,transparent 36%),linear-gradient(150deg,#688775,#294f43 65%,#1b392f);background:radial-gradient(ellipse at 92% 0%,#9ec49b4d,transparent 45%),linear-gradient(160deg,#1f4338,#122a24 70%)}\n.uos[data-theme=meadow]:before{opacity:.12;background:repeating-radial-gradient(ellipse at 85% 10%,transparent 0 19px,#d2e5a0 20px 21px,transparent 22px 48px)}.uos[data-theme=meadow] .uos-card{border-radius:22px 6px 22px 6px}.uos[data-theme=meadow] .uos-cover{border-bottom:1px solid #d2e5a083}.uos[data-theme=meadow] .uos-number{font-style:italic}.uos[data-theme=meadow] h1{font-weight:500}\n.uos-theme-swatch[data-theme=archive]{--sw-bg:#111a21;--sw-art:#334b50;--sw-accent:#deb47c}.uos-theme-swatch[data-theme=neon]{--sw-bg:#080e22;--sw-art:#392657;--sw-accent:#fa74bf}.uos-theme-swatch[data-theme=paper]{--sw-bg:#f4eee2;--sw-art:#d5b29d;--sw-accent:#a64d3c}.uos-theme-swatch[data-theme=noir]{--sw-bg:#121314;--sw-art:#525455;--sw-accent:#e4e1d5}.uos-theme-swatch[data-theme=meadow]{--sw-bg:#122a24;--sw-art:#688775;--sw-accent:#d2e5a0}.uos-theme-swatch[data-theme=ancient]{--sw-bg:#201a20;--sw-art:#684d51;--sw-accent:#dbb77c}\n.uos[data-theme=ancient]{--bg:#201a20;--panel:#302329;--surface:#38292d;--text:#f5ead5;--muted:#d4c1ae;--accent:#dbb77c;--line:#b98d6c99;--art:#684d51;--display:\"Noto Serif SC\",\"Songti SC\",serif;--cover:radial-gradient(circle at 75% 32%,#d9ae7e55,transparent 34%),repeating-linear-gradient(135deg,transparent 0 15px,#e9c59316 16px 17px),linear-gradient(125deg,#6b4247,#241e28 75%);background:radial-gradient(circle at 100% 0%,#a56b5940,transparent 45%),linear-gradient(145deg,#2a2025,#19171d 78%)}\n.uos[data-theme=ancient]:before{opacity:.17;background:repeating-linear-gradient(90deg,transparent 0 23px,#d6ac711f 24px 25px)}.uos[data-theme=ancient] .uos-card{border-radius:3px;border:1px solid #ba8d6c;outline:1px solid #b98d6c70;outline-offset:-6px;box-shadow:0 12px 32px #100d14aa}.uos[data-theme=ancient] .uos-cover:not(.has-image):after{content:\"卷 · 故事\";position:absolute;right:14px;bottom:14px;writing-mode:vertical-rl;letter-spacing:.32em;color:#f5e2baaa;font-size:12px}.uos[data-theme=ancient] .uos-card-body{border-top:2px solid #ba8d6c77}.uos[data-theme=ancient] .uos-number{font-style:italic;text-shadow:0 2px 12px #1a0c13}.uos[data-theme=ancient] .uos-kicker{letter-spacing:.36em}\n@media(max-width:600px){.uos{border-radius:0!important;box-shadow:none!important}.uos h1{font-size:clamp(27px,8vw,38px)}.uos .uos-card{box-shadow:none}.uos-theme-swatch{height:64px}}\n.uos-watermark{margin:18px 0 0;padding-top:10px;border-top:1px solid var(--line);color:var(--muted);font-size:10px;line-height:1.5;letter-spacing:.04em;text-align:center}\n\n/* Compact summaries keep long or numerous greetings readable. */\n.uos-grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr));align-items:start}\n.uos-card-shell{min-width:0;border:1px solid var(--line);border-radius:14px;background:var(--surface);overflow:hidden}\n.uos-card-shell .uos-card{display:block;width:100%;height:100%;border:0;border-radius:0;box-shadow:none;text-align:left}\n.uos-card-shell .uos-cover{height:112px}\n.uos-card-shell .uos-card-body{min-height:148px}\n.uos-card-shell .uos-card strong{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}\n.uos-card-shell .uos-description{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere;min-height:0}\n.uos-card-names{color:var(--accent);font-size:12px;line-height:1.5;margin:12px 0 0;overflow-wrap:anywhere}\n.uos-card-details{padding:0 14px 14px;color:var(--text);font-size:12px}\n.uos-card-details summary{cursor:pointer;color:var(--accent);padding:10px 2px;border-top:1px solid var(--line)}\n.uos-card-details pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:55vh;overflow:auto;margin:5px 0 0;padding:12px;background:var(--panel);border:1px solid var(--line);border-radius:7px;font:12px/1.65 system-ui,sans-serif}\n.uos-watermark{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;overflow-wrap:anywhere}\n.uos-version{margin-left:auto;color:var(--accent);font:10px/1.5 Georgia,serif;white-space:nowrap}\n@media(max-width:600px){.uos-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.uos-card-shell .uos-cover{height:82px;padding:9px}.uos-card-shell .uos-number{font-size:48px}.uos-card-shell .uos-card-body{min-height:158px;padding:10px}.uos-card-shell .uos-card strong{font-size:15px}.uos-card-shell .uos-description{font-size:11px}.uos-card-details{padding:0 9px 9px}}\n@media(max-width:390px){.uos-grid{grid-template-columns:1fr}.uos-card-shell .uos-card-body{min-height:0}}\n\n.uos-version-badge{display:block;margin-top:3px;color:var(--muted);font:10px/1.3 Georgia,serif;letter-spacing:.04em}\n\n/* New author themes: orbital chart, candlelit romance, emergency dispatch. */\n.uos-theme-swatch[data-theme=starmap]{--sw-bg:#0b1930;--sw-art:#23476c;--sw-accent:#9fdbea}\n.uos[data-theme=starmap]{--bg:#09182c;--panel:#132b42;--surface:#10253b;--text:#e5f5f9;--muted:#abc6d2;--accent:#9bdbe9;--line:#64a9c276;--art:#265779;--cover:radial-gradient(circle at 73% 35%,transparent 0 34px,#8bd3df66 35px 36px,transparent 37px),radial-gradient(circle at 73% 35%,transparent 0 66px,#8bd3df33 67px 68px,transparent 69px),radial-gradient(circle at 73% 35%,#fff 0 2px,transparent 3px),linear-gradient(135deg,#1e4766,#0b2038);background:radial-gradient(circle at 80% 10%,#377c9970,transparent 36%),repeating-linear-gradient(90deg,transparent 0 38px,#93dce90d 39px 40px),#09182c}\n.uos[data-theme=starmap] .uos-card{border-radius:18px 4px 18px 4px;border-color:#78bed19c}.uos[data-theme=starmap] .uos-number{font:300 55px/1 system-ui,sans-serif;letter-spacing:-.12em}.uos[data-theme=starmap] .uos-cover{border-bottom:1px solid #a1e7ef88}.uos[data-theme=starmap] .uos-kicker{letter-spacing:.3em}\n.uos-theme-swatch[data-theme=rose]{--sw-bg:#38242e;--sw-art:#9d6978;--sw-accent:#f5cfbd}\n.uos[data-theme=rose]{--bg:#31232d;--panel:#49323e;--surface:#503743;--text:#fff0e7;--muted:#e4c9ca;--accent:#f2c5b5;--line:#dea5ac88;--art:#a86781;--display:\"Noto Serif SC\",Georgia,serif;--cover:radial-gradient(ellipse at 75% 25%,#ffe4d691,transparent 28%),radial-gradient(ellipse at 35% 85%,#d16f8d66,transparent 40%),linear-gradient(125deg,#9c586c,#382733 75%);background:radial-gradient(circle at 95% 0%,#db849362,transparent 40%),linear-gradient(150deg,#513442,#281f2a)}\n.uos[data-theme=rose] .uos-card{border-radius:24px 24px 6px 6px;border-color:#e9b7ae88}.uos[data-theme=rose] .uos-number{font-style:italic;color:#ffe0d0}.uos[data-theme=rose] .uos-cover:not(.has-image):after{content:\"✦\";position:absolute;right:17px;top:11px;color:#ffe5daaa;font-size:28px}.uos[data-theme=rose] .uos-kicker{font-family:Georgia,serif;letter-spacing:.18em}\n.uos-theme-swatch[data-theme=wasteland]{--sw-bg:#202426;--sw-art:#735343;--sw-accent:#f4ae75}\n.uos[data-theme=wasteland]{--bg:#1c2225;--panel:#2b3132;--surface:#292c2d;--text:#f5ece2;--muted:#c9bcb2;--accent:#f3a969;--line:#c9805488;--art:#745343;--display:system-ui,\"Noto Sans SC\",sans-serif;--cover:repeating-linear-gradient(135deg,#f3a96928 0 7px,transparent 8px 18px),linear-gradient(145deg,#78513e,#252a2b 70%);background:radial-gradient(circle at 95% 0%,#a75b3c55,transparent 36%),repeating-linear-gradient(0deg,transparent 0 31px,#f3a9690a 32px 33px),#1c2225}\n.uos[data-theme=wasteland] .uos-card{border-radius:3px;border-left:4px solid var(--accent);box-shadow:5px 6px 0 #0b111490}.uos[data-theme=wasteland] .uos-number{font:800 57px/1 system-ui,sans-serif}.uos[data-theme=wasteland] .uos-kicker{text-transform:uppercase;letter-spacing:.22em}.uos[data-theme=wasteland] .uos-cover{border-bottom:2px solid #f3a96999}\n.uos-search{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 18px}.uos-search input,.uos-search select{min-width:0;flex:1 1 180px;padding:9px 12px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--text)}.uos-search-empty{grid-column:1/-1;color:var(--muted);padding:16px;border:1px dashed var(--line);border-radius:8px}\n\n/* The author page uses the active theme as a frame around the whole story index. */\n.uos{\n  border:2px solid var(--accent);\n  padding:clamp(25px,4vw,44px);\n  box-shadow:0 20px 50px #0006,inset 0 0 0 5px #ffffff08;\n}\n.uos::after{\n  content:\"\";\n  position:absolute;\n  inset:9px;\n  z-index:0;\n  pointer-events:none;\n  border:1px solid var(--line);\n  border-radius:10px;\n  opacity:.75;\n  background:\n    linear-gradient(var(--accent),var(--accent)) left top/28px 2px no-repeat,\n    linear-gradient(var(--accent),var(--accent)) left top/2px 28px no-repeat,\n    linear-gradient(var(--accent),var(--accent)) right top/28px 2px no-repeat,\n    linear-gradient(var(--accent),var(--accent)) right top/2px 28px no-repeat,\n    linear-gradient(var(--accent),var(--accent)) left bottom/28px 2px no-repeat,\n    linear-gradient(var(--accent),var(--accent)) left bottom/2px 28px no-repeat,\n    linear-gradient(var(--accent),var(--accent)) right bottom/28px 2px no-repeat,\n    linear-gradient(var(--accent),var(--accent)) right bottom/2px 28px no-repeat;\n}\n.uos> :not(.uos-dialog){z-index:1}\n.uos-top{flex-wrap:wrap;padding-bottom:17px;margin-bottom:24px;border-bottom:1px solid var(--line)}\n.uos-actions{margin-left:auto}\n.uos h1{margin:0 0 13px;max-width:24ch;line-height:1.18;text-wrap:balance}\n.uos-intro{margin-bottom:26px;padding-left:14px;border-left:2px solid var(--accent);line-height:1.8}\n.uos-search{gap:12px;margin-bottom:24px;padding:11px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}\n.uos-search input,.uos-search select{min-height:42px}\n.uos-search input:focus-visible,.uos-search select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}\n.uos-card-shell{box-shadow:0 12px 26px #0002;transition:transform .2s,border-color .2s,box-shadow .2s}\n.uos-card-shell:hover,.uos-card-shell:focus-within{transform:translateY(-2px);border-color:var(--accent);box-shadow:0 18px 32px #0004}\n.uos-card-shell .uos-card:hover{transform:none}\n.uos-footer{padding-top:18px;border-top:1px solid var(--line)}\n.uos[data-theme=neon]{box-shadow:0 20px 50px #0007,0 0 26px #c277ed35,inset 0 0 0 5px #f572c008}\n.uos[data-theme=paper]{box-shadow:0 15px 35px #60423029,inset 0 0 0 5px #a64d3c08}\n.uos[data-theme=noir]::after{border-style:double;border-width:3px;opacity:.58}\n.uos[data-theme=ancient]::after{border-radius:2px;opacity:.85}\n.uos[data-theme=wasteland]::after{border-radius:2px}\n@media(max-width:600px){\n  .uos{padding:23px 18px 25px;border-radius:0!important;box-shadow:none!important}\n  .uos::after{inset:6px;border-radius:0;opacity:.55;background-size:18px 2px,2px 18px,18px 2px,2px 18px,18px 2px,2px 18px,18px 2px,2px 18px}\n  .uos-top{gap:10px;margin-bottom:20px;padding-bottom:13px}\n  .uos-kicker{font-size:10px;letter-spacing:.16em}\n  .uos-intro{margin-bottom:18px}\n  .uos-search{padding:8px;margin-bottom:18px}\n  .uos-card-shell{box-shadow:none}\n}\n@media(prefers-reduced-motion:reduce){.uos-card-shell{transition:none}.uos-card-shell:hover{transform:none}}\n\u003c/style>\u003c/head>\u003cbody>\n\u003cmain class=\"uos\" data-uos data-theme=\"archive\">\u003cdiv class=\"uos-top\">\u003cspan class=\"uos-kicker\">CHOOSE YOUR BEGINNING\u003c/span>\u003cdiv class=\"uos-actions\">\u003cbutton type=\"button\" class=\"uos-icon\" data-theme-button aria-label=\"切换主题\">◈ 主题\u003c/button>\u003cbutton type=\"button\" class=\"uos-icon\" data-settings-button aria-label=\"作者设置\">⚙ 设置\u003c/button>\u003c/div>\u003c/div>\u003cp class=\"uos-status uos-top-status\" data-top-status role=\"status\">\u003c/p>\n\u003ch1 data-title>\u003c/h1>\u003cp class=\"uos-intro\" data-subtitle>\u003c/p>\u003csection class=\"uos-player\" data-player hidden aria-label=\"开场音乐播放器\">\u003cdiv class=\"uos-player-head\">\u003cspan class=\"uos-player-record\" aria-hidden=\"true\">\u003c/span>\u003cdiv class=\"uos-player-meta\">\u003cspan class=\"uos-player-kicker\">SOUNDTRACK · 开场音乐\u003c/span>\u003cstrong data-music-title>\u003c/strong>\u003c/div>\u003cdiv class=\"uos-player-controls\">\u003cbutton type=\"button\" data-skip=\"-10\" aria-label=\"快退10秒\">↶\u003c/button>\u003cbutton type=\"button\" data-play aria-label=\"播放\">▶\u003c/button>\u003cbutton type=\"button\" data-skip=\"10\" aria-label=\"快进10秒\">↷\u003c/button>\u003c/div>\u003c/div>\u003cdiv class=\"uos-player-track\">\u003cinput type=\"range\" data-seek min=\"0\" max=\"1000\" value=\"0\" aria-label=\"音乐播放进度\">\u003cspan data-clock>0:00 / 0:00\u003c/span>\u003c/div>\u003cdiv class=\"uos-lyrics\" data-lyrics>♫\u003c/div>\u003caudio preload=\"metadata\">\u003c/audio>\u003c/section>\u003cdiv class=\"uos-grid\" data-grid>\u003c/div>\n\u003cp class=\"uos-footer\">选择后进入对应的正式开场。也可使用酒馆首条消息的翻页箭头。当前聊天开始后不能重新选择。\u003c/p>\u003cdiv class=\"uos-status\" data-status role=\"status\">\u003c/div>\n\u003cdiv class=\"uos-dialog\" data-theme-dialog hidden>\u003cdiv class=\"uos-sheet\">\u003cdiv class=\"uos-sheet-head\">\u003ch2>切换主题\u003c/h2>\u003cbutton type=\"button\" class=\"uos-icon\" data-close=\"[data-theme-dialog]\">关闭\u003c/button>\u003c/div>\u003cdiv class=\"uos-theme-grid\" data-theme-grid>\u003c/div>\u003c/div>\u003c/div>\n\u003cdiv class=\"uos-dialog\" data-settings-dialog hidden>\u003cdiv class=\"uos-sheet\">\u003cdiv class=\"uos-sheet-head\">\u003ch2>作者设置\u003c/h2>\u003cbutton type=\"button\" class=\"uos-icon\" data-close=\"[data-settings-dialog]\">关闭\u003c/button>\u003c/div>\u003cnav class=\"uos-tabs\" aria-label=\"设置分类\">\u003cbutton type=\"button\" data-tab=\"openings\" aria-selected=\"true\">开场白\u003c/button>\u003cbutton type=\"button\" data-tab=\"bgm\" aria-selected=\"false\">BGM\u003c/button>\u003cbutton type=\"button\" data-tab=\"diagnostics\" aria-selected=\"false\">制卡检查\u003c/button>\u003c/nav>\u003csection data-tab-panel=\"openings\">\u003cp class=\"uos-help\">已读取 1 条正式开场。修改后点击下方保存，并从酒馆导出更新的角色卡。\u003c/p>\u003cdiv data-settings-fields>\u003c/div>\u003c/section>\u003csection data-tab-panel=\"bgm\" hidden>\u003cp class=\"uos-help\">上传音乐和 LRC/TXT 歌词。文件会在选择页预览，保存后随角色卡导出。\u003c/p>\u003cdiv data-bgm-fields>\u003c/div>\u003cp class=\"uos-help\">音频内嵌会增加角色卡体积。请确认分享权利；可在 https://www.gequhai.com/ 查找曲目。\u003c/p>\u003c/section>\u003csection data-tab-panel=\"diagnostics\" hidden>\u003cp class=\"uos-help\">根据当前酒馆中的角色数据检查。修改设置后请先保存，再从酒馆导出角色卡；玩家仍需安装并启用酒馆助手。\u003c/p>\u003cdiv data-diagnostics>\u003c/div>\u003c/section>\u003cbutton type=\"button\" class=\"uos-save\" data-save>保存到角色卡\u003c/button>\u003cp class=\"uos-help\" data-save-state role=\"status\">\u003c/p>\u003c/div>\u003c/div>\n\u003c/main>\u003cscript type=\"application/json\" id=\"uos-seed\">{\"version\":1,\"title\":\"选择故事的起点\",\"subtitle\":\"选择一个开场，故事将从那里继续。\",\"theme\":\"archive\",\"entries\":[{\"title\":\"示例开场。\",\"description\":\"\",\"label\":\"OPENING 01\",\"image\":\"\"}],\"music\":{\"enabled\":false,\"title\":\"\",\"audio\":\"\",\"lyrics\":\"\"}}\u003c/script>\u003c/body>\u003c/html>";
/* 红豆粉开场白选择器 / Aliceneko Opening Selector — embedded card runtime. */
async function optimizeCoverData(source,file,doc=document){
  if(file?.type==='image/gif'||!/^data:image\/(?:png|jpeg|webp);base64,/i.test(source))return source;
  try{
    const ImageClass=doc.defaultView?.Image||Image;
    const image=new ImageClass();
    await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=source});
    const width=image.naturalWidth||image.width,height=image.naturalHeight||image.height;
    if(!width||!height)return source;
    const scale=Math.min(1,960/Math.max(width,height));
    const canvas=doc.createElement('canvas');canvas.width=Math.max(1,Math.round(width*scale));canvas.height=Math.max(1,Math.round(height*scale));
    const context=canvas.getContext('2d');if(!context)return source;
    context.drawImage(image,0,0,canvas.width,canvas.height);
    const optimized=canvas.toDataURL('image/webp',.82);
    return optimized.startsWith('data:image/webp;base64,')&&optimized.length<source.length?optimized:source;
  }catch{return source}
}
function mountInDocument(doc = document, helperApi = null) {
  const KEY = 'universal_opening_selector';
  const VERSION = '1.0.1';
  const WATERMARK = '唯一来源Discord:♡Aliceneko♡/红豆粉丨本插件完全免费';
  const THEMES = [['archive','旧档案'],['neon','霓虹夜'],['paper','纸与墨'],['noir','黑白电影'],['meadow','林间信'],['ancient','锦书古风'],['starmap','星海航图'],['rose','绯色契约'],['wasteland','末日警报']];
  const root = doc.querySelector('[data-uos]');
  if (!root || root.dataset.uosVersion === VERSION) return false;
  if (root.dataset.uosMounted === '1') {
    let top=doc.defaultView;
    try { while(top.parent!==top){void top.parent.document;top=top.parent} } catch {}
    for(const wrap of top.document.querySelectorAll('[data-uos-portal]')) {
      const dialogs=wrap.shadowRoot?.querySelectorAll('[data-theme-dialog],[data-settings-dialog]');
      if(dialogs?.length===2){for(const dialog of dialogs){dialog.hidden=true;root.append(dialog)}wrap.remove()}
    }
    delete root.dataset.uosMounted;
  }
  const seed = JSON.parse(doc.getElementById('uos-seed').textContent);
  let host = doc.defaultView || window;
  for (let i=0;i<8;i++) {
    try { if (host.SillyTavern?.getContext) break; if (host.parent===host) break; void host.parent.document; host=host.parent; }
    catch { break; }
  }
  const context = () => host.SillyTavern?.getContext?.();
  const helper = () => {
    if (typeof helperApi?.setChatMessages === 'function') return helperApi;
    let w = doc.defaultView;
    for (let i=0;w && i<8;i++) {
      try { if (typeof w.TavernHelper?.setChatMessages === 'function') return w.TavernHelper;
        if (typeof w.setChatMessages === 'function') return w;
        if (w.parent === w) break; void w.parent.document; w=w.parent;
      } catch { break; }
    }
    return null;
  };
  const character = () => { const c=context(); return c?.characters?.[c.characterId]; };
  const stored = character()?.data?.extensions?.[KEY] ?? character()?.extensions?.[KEY];
  let config = normalize(stored || seed);
  let draft = null;
  let displayTheme = localTheme() || config.theme;
  let portaled = [];
  let activePopup = null;
  const $ = (s, base=root) => base.querySelector(s) || (base === root ? portaled.find(x=>x.matches(s)) || portaled.map(x=>x.querySelector(s)).find(Boolean) : null);
  const el = (tag, cls, content) => { const n=doc.createElement(tag); if(cls)n.className=cls; if(content!=null)n.textContent=String(content); return n; };
  function normalize(input) {
    const x=input && typeof input==='object' ? input : {};
    return {
      version:1, title:String(x.title||'选择故事的起点').slice(0,100),
      subtitle:String(x.subtitle||'选择一个开场，故事将从那里继续。').slice(0,400),
      theme:THEMES.some(t=>t[0]===x.theme)?x.theme:'archive',
      excludedTags:String(x.excludedTags||'').slice(0,500),
      entries:Array.isArray(x.entries)?x.entries.map((e,i)=>({
        title:String(e?.title||`开场 ${i+1}`).slice(0,100),
        description:String(e?.description||'').slice(0,300),
        label:String(e?.label||'').slice(0,60),
        ...(typeof e?.names==='string'?{names:e.names.slice(0,200)}:{}),
        image:String(e?.image||''),
      })):[],
      music:{enabled:x.music?.enabled == null ? Boolean(x.music?.audio) : Boolean(x.music.enabled),title:String(x.music?.title||''),audio:String(x.music?.audio||''),lyrics:String(x.music?.lyrics||'')},
    };
  }
  function greetingList(){
    const c=character();
    const first=c?.data?.first_mes ?? c?.first_mes ?? '';
    const alts=c?.data?.alternate_greetings ?? c?.alternate_greetings ?? [];
    // This packaged card reserves the main greeting (swipe 0) for the selector.
    return String(first).includes('<UniversalOpeningSelector/>') ? alts : [];
  }
  function infer(text,i){
    const source=String(text||''),excluded=excludedTags(config.excludedTags);
    const title=greetingTitle(source,i,excluded),body=narrativeStart(source,excluded);
    return {title,description:body.slice(title.length).trim().slice(0,140),names:greetingNames(source).join('、')};
  }
  function suggest(text,i){return infer(text,i)}
  function entries(){
    const greetings=greetingList();
    const count=greetings.length || config.entries.length;
    return Array.from({length:count},(_,i)=>{const generated=infer(greetings[i],i),saved=config.entries[i]||{};return isLegacyGeneratedEntry(greetings[i],saved,i)?{...generated,...saved,title:generated.title,description:generated.description}:{...generated,...saved}});
  }
  function localTheme(){try{return host.localStorage.getItem('uos_theme_'+(character()?.avatar||character()?.name||'current'))}catch{return null}}
  function setTheme(value,remember=true){displayTheme=value;root.dataset.theme=value;syncDialogTheme();if(remember)try{host.localStorage.setItem('uos_theme_'+(character()?.avatar||character()?.name||'current'),value)}catch{}}
  function syncDialogTheme(){const style=doc.defaultView.getComputedStyle(root);for(const dlg of portaled)for(const key of ['--bg','--panel','--text','--muted','--accent','--line','--art'])dlg.style.setProperty(key,style.getPropertyValue(key));}
  function showSheet(selector){
    if(activePopup && !activePopup.frame?.isConnected){activePopup.original.append(activePopup.sheet);activePopup=null;portaled=[]}
    if(activePopup){status('弹窗已打开，请先关闭当前窗口。');return null}
    const original=$(selector),sheet=original?.querySelector('.uos-sheet');
    if(!sheet){status('设置界面尚未就绪，请刷新页面重试。');return null}
    let hostDoc=root.__uosHostDocument;
    if(!hostDoc){let w=doc.defaultView;try{while(w.parent!==w){void w.parent.document;w=w.parent}}catch{}hostDoc=w.document}
    if(hostDoc===doc){status('无法在酒馆页面打开弹窗：请确认角色卡内的作者脚本已启用。');return null}
    const frame=hostDoc.createElement('iframe');
    frame.setAttribute('title',selector.includes('theme')?'切换主题':'作者设置');
    frame.setAttribute('data-uos-frame','');
    const kind=selector.includes('theme')?'theme':'settings';
    const viewport=hostDoc.defaultView;
    const width=Math.min(kind==='theme'?460:780,Math.max(260,viewport.innerWidth-24));
    const height=Math.min(kind==='theme'?520:740,Math.max(260,viewport.innerHeight-24));
    frame.style.cssText=`position:fixed!important;left:${Math.max(12,(viewport.innerWidth-width)/2)}px!important;top:${Math.max(12,(viewport.innerHeight-height)/2)}px!important;width:${width}px!important;height:${height}px!important;border:0!important;margin:0!important;padding:0!important;z-index:2147483647!important;background:transparent!important;display:block!important;pointer-events:auto!important`;
    try{
      (hostDoc.body||hostDoc.documentElement).append(frame);
      const frameDoc=frame.contentDocument;
      if(!frameDoc)throw Error('设置 iframe 无法访问');
      const css=doc.getElementById('uos-css')?.textContent||'';
      frameDoc.open();frameDoc.write(`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}</style><style>${css}</style><style>.uos-dialog{display:block!important;position:static!important;width:100%!important;height:100%!important;padding:0!important;overflow:hidden!important;background:transparent!important}.uos-sheet{width:100%!important;height:100%!important;max-height:100%!important;max-width:100%!important;overflow:auto!important;box-shadow:none!important}.uos-sheet-head{position:sticky;top:-20px;z-index:2;background:var(--bg);padding:8px 0;cursor:grab;touch-action:none;user-select:none}.uos-sheet-head:active{cursor:grabbing}.uos-sheet-head button{cursor:pointer;touch-action:auto}.uos-save{position:sticky;bottom:0;z-index:2;box-shadow:0 0 0 8px var(--bg)}body[data-kind="theme"] .uos-theme-grid{grid-template-columns:repeat(2,minmax(0,1fr))}@media(max-width:600px){.uos-sheet{border-radius:16px!important;padding:16px!important}.uos-sheet-head{top:-16px}}</style></head><body data-kind="${kind}"><div class="uos-dialog" data-uos-overlay></div></body></html>`);frameDoc.close();
      const overlay=frameDoc.querySelector('[data-uos-overlay]');overlay.append(sheet);
      portaled=[sheet];syncDialogTheme();
      const drag=sheet.querySelector('.uos-sheet-head');
      let origin=null;
      const move=e=>{if(!origin)return;const left=Math.max(0,Math.min(viewport.innerWidth-frame.offsetWidth,origin.left+e.screenX-origin.x));const top=Math.max(0,Math.min(viewport.innerHeight-frame.offsetHeight,origin.top+e.screenY-origin.y));frame.style.setProperty('left',`${left}px`,'important');frame.style.setProperty('top',`${top}px`,'important')};
      const stop=()=>{origin=null;drag?.removeEventListener('pointermove',move);drag?.removeEventListener('pointerup',stop)};
      drag?.addEventListener('pointerdown',e=>{if(e.target.closest('button,input,textarea,select,a'))return;origin={x:e.screenX,y:e.screenY,left:frame.offsetLeft,top:frame.offsetTop};drag.setPointerCapture(e.pointerId);drag.addEventListener('pointermove',move);drag.addEventListener('pointerup',stop);e.preventDefault()});
      const clampWindow=()=>{frame.style.setProperty('left',`${Math.max(0,Math.min(viewport.innerWidth-frame.offsetWidth,frame.offsetLeft))}px`,'important');frame.style.setProperty('top',`${Math.max(0,Math.min(viewport.innerHeight-frame.offsetHeight,frame.offsetTop))}px`,'important')};
      viewport.addEventListener('resize',clampWindow);
      const close=()=>{stop();viewport.removeEventListener('resize',clampWindow);original.append(sheet);portaled=[];frame.remove();activePopup=null;if(selector.includes('settings') && draft){draft=null;renderMusic(config.music);status('未保存的设置已撤销。')}};
      activePopup={complete:close,frame,original,sheet};
      frameDoc.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
    }catch(e){original.append(sheet);portaled=[];frame.remove();activePopup=null;status(`弹窗打开失败：${e.message||e}`);return null}
    return sheet;
  }
  function status(message){$('[data-status]').textContent=message;const top=$('[data-top-status]');if(top)top.textContent=message;const inDialog=$('[data-save-state]');if(inDialog)inDialog.textContent=message}
  function render(){
    setTheme(displayTheme,false);
    $('[data-title]').textContent=config.title;
    $('[data-subtitle]').textContent=config.subtitle;
    const grid=$('[data-grid]');grid.replaceChildren();
    let filters=root.querySelector('.uos-search');
    if(!filters){filters=el('div','uos-search');const input=el('input'),person=el('select');input.type='search';input.placeholder='搜索标题、人物或正文';input.setAttribute('aria-label','搜索作者开场');person.setAttribute('aria-label','按人物筛选作者开场');input.oninput=()=>render();person.onchange=()=>render();filters.append(input,person);grid.before(filters)}
    const query=filters.querySelector('input').value.trim().toLocaleLowerCase(),person=filters.querySelector('select'),selected=person.value;
    const items=entries(),greetings=greetingList(),people=new Set();
    for(const entry of items)for(const name of String(entry.names||'').split(/[、，,\/]/).map(x=>x.trim()).filter(Boolean))people.add(name);
    person.replaceChildren();const all=el('option','','全部人物');all.value='';person.append(all);for(const name of people){const option=el('option','',name);option.value=name;person.append(option)}person.value=selected;
    let visible=0;
    items.forEach((entry,i)=>{
      const names=typeof entry.names==='string'?entry.names.trim():'';
      if(person.value&&!names.split(/[、，,\/]/).map(x=>x.trim()).includes(person.value))return;
      if(query&&![entry.title,entry.description,entry.label,names,greetings[i]].some(x=>String(x||'').toLocaleLowerCase().includes(query)))return;
      visible++;
      const shell=el('article','uos-card-shell');
      const card=el('button','uos-card');card.type='button';card.setAttribute('aria-label',`选择 ${entry.title}`);
      const cover=el('div','uos-cover');
      if (/^(data:image\/(?:png|jpeg|webp|gif);base64,|https?:\/\/)/i.test(entry.image)) {
        cover.classList.add('has-image');cover.style.backgroundImage=`linear-gradient(0deg,#0005,transparent),url("${entry.image.replace(/["\\]/g,'')}")`;
      }
      cover.append(el('span','uos-number',String(i+1).padStart(2,'0')));
      const body=el('div','uos-card-body');body.append(el('span','uos-label',entry.label||`OPENING ${String(i+1).padStart(2,'0')}`),el('strong','',entry.title));
      if(entry.description)body.append(el('div','uos-description',entry.description));
      body.append(el('p','uos-card-names',`登场人物 · ${names?names.replace(/[,，]/g,' / '):'未识别'}`));
      card.append(cover,body);card.addEventListener('click',()=>choose(i+1));shell.append(card);
      const source=greetings[i];
      if(source){const details=el('details','uos-card-details');details.append(el('summary','','预览完整正文'),el('pre','',source));shell.append(details)}
      grid.append(shell);
    });
    if(!visible)grid.append(el('p','uos-search-empty','没有匹配的开场，请换个关键词或人物。'));
    renderMusic(config.music);
    const kicker=root.querySelector('.uos-kicker');if(kicker&&!kicker.querySelector('.uos-version-badge'))kicker.append(el('small','uos-version-badge',`v${VERSION}`));
    let watermark=root.querySelector('[data-uos-watermark]');
    if(!watermark){watermark=el('p','uos-watermark',WATERMARK);watermark.dataset.uosWatermark='';watermark.append(el('span','uos-version',`v${VERSION}`));root.append(watermark)}
  }
  function formatTime(s){const n=Math.max(0,Math.floor(Number(s)||0));return `${Math.floor(n/60)}:${String(n%60).padStart(2,'0')}`}
  function lyricRows(source){
    const rows=[];
    for(const line of String(source||'').split(/\r?\n/)){
      const m=/\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)/.exec(line);
      if(m)rows.push({time:+m[1]*60+(+m[2])+(+('0.'+(m[3]||'0'))),text:m[4].trim()});
    }
    return rows.sort((a,b)=>a.time-b.time);
  }
  function renderMusic(music){
    const player=$('[data-player]'),audio=$('audio',player),box=$('[data-lyrics]');
    player.hidden=!music.enabled;
    const source=music.enabled?music.audio:'';
    if(audio.getAttribute('src')!==source){audio.pause();if(source)audio.src=source;else audio.removeAttribute('src');audio.load()}
    $('[data-play]').disabled=!source;
    $('[data-music-title]').textContent=music.title||'开场音乐';
    box.replaceChildren();
    const rows=lyricRows(music.lyrics);
    if(rows.length){for(const row of rows){const b=el('button','uos-lyric-row',row.text);b.type='button';b.dataset.time=String(row.time);b.onclick=()=>{audio.currentTime=row.time};box.append(b)}}
    else box.textContent=music.lyrics?.trim()||'♫';
    updatePlayer();
  }
  function updatePlayer(){
    const audio=$('[data-player] audio'),duration=Number.isFinite(audio.duration)?audio.duration:0;
    $('[data-seek]').value=String(duration?Math.round(audio.currentTime/duration*1000):0);
    $('[data-clock]').textContent=`${formatTime(audio.currentTime)} / ${formatTime(duration)}`;
    $('[data-play]').textContent=audio.paused?'▶':'Ⅱ';
    const rows=Array.from($('[data-lyrics]').querySelectorAll('[data-time]'));
    let active=-1;rows.forEach((row,i)=>{if(+row.dataset.time<=audio.currentTime+.08)active=i;row.classList.toggle('is-active',i===active)});
    if(active>=0 && rows[active]!==updatePlayer.lastRow){const box=$('[data-lyrics]'),row=rows[active];box.scrollTo({top:row.offsetTop-box.offsetTop-(box.clientHeight-row.clientHeight)/2,behavior:'smooth'});updatePlayer.lastRow=row}
  }
  async function choose(target){
    const h=helper();if(!h){status('酒馆助手尚未就绪，请稍后重试或用首条消息翻页箭头。');return}
    let first;try{first=h.getChatMessages(0,{include_swipes:true})?.[0]}catch(e){status(`读取开场失败：${e?.message||e}`);return}
    if(!first || first.role!=='assistant' || !Array.isArray(first.swipes) || target>=first.swipes.length){status('开场尚未载入，请刷新后新建聊天。');return}
    if(Number(h.getLastMessageId?.()??0)>0){status('聊天已经开始，请新建聊天后选择开场。');return}
    if(first.swipe_id!==0 || !String(first.swipes[0]||'').includes('<UniversalOpeningSelector/>')){status('当前已离开选择页，请新建聊天后重试。');return}
    status(`正在进入第 ${target} 条开场…`);
    root.querySelectorAll('.uos-card').forEach(b=>b.disabled=true);
    try{
      await h.setChatMessages([{message_id:0,swipe_id:target}],{refresh:'all'});
      const current=h.getChatMessages(0,{include_swipes:true})?.[0];
      if(current?.swipe_id!==target)throw new Error('消息页未切换');
    }catch(e){status(`切换失败：${e?.message||e}。可使用首条消息翻页箭头。`);root.querySelectorAll('.uos-card').forEach(b=>b.disabled=false)}
  }
  function openThemes(){const dlg=showSheet('[data-theme-dialog]');if(!dlg)return;const grid=$('[data-theme-grid]');grid.replaceChildren();THEMES.forEach(([id,name])=>{const b=el('button','uos-theme-choice');b.type='button';b.setAttribute('aria-label',`切换到${name}`);b.setAttribute('aria-pressed',String(id===displayTheme));const swatch=el('span','uos-theme-swatch');swatch.dataset.theme=id;swatch.append(el('span','uos-theme-swatch-cover','01'),el('span','uos-theme-swatch-lines','Aa · 故事开场'));b.append(swatch,el('span','',name));b.onclick=()=>{setTheme(id);activePopup?.complete(null)};grid.append(b)});}
  function diagnostics(){
    const card=character(),data=card?.data||card||{},ext=data.extensions||{},greetings=greetingList();
    const roleScript=Array.isArray(ext.tavern_helper?.scripts)&&ext.tavern_helper.scripts.some(x=>/红豆粉开场白选择器 · (?:通用脚本|作者角色脚本)/.test(x.name||'')&&x.enabled&&x.export_with?.data);
    const legacy=Array.isArray(ext.regex_scripts)&&ext.regex_scripts.some(x=>x.findRegex==='<UniversalOpeningSelector/>'&&!x.disabled);
    const saved=Boolean(ext[KEY]);let size=0;try{size=new Blob([JSON.stringify(card||{})]).size}catch{}
    const media=entries().reduce((n,e)=>n+(e.image?.length||0),0)+(config.music.audio?.length||0);
    return [['正式开场',`${greetings.length} 条`],['选择页运行方式',roleScript?'作者角色脚本随卡导出':legacy?'旧版打包卡':'未检测到可导出的作者脚本'],['作者配置',saved?'已载入角色卡扩展字段':'当前使用默认配置'],['当前角色数据大小',size?`${(size/1048576).toFixed(2)} MB`:'无法估算'],['其中封面与音频数据',`${(media/1048576).toFixed(2)} MB`]];
  }
  function field(label,value,change,multiline=false){const wrap=el('label','uos-field');wrap.append(el('span','',label));const input=el(multiline?'textarea':'input');input.value=value||'';input.addEventListener('input',()=>change(input.value));wrap.append(input);return wrap}
  function toggleField(label,value,change){const wrap=el('label','uos-toggle');const input=el('input');input.type='checkbox';input.checked=Boolean(value);input.onchange=()=>change(input.checked);wrap.append(input,el('span','',label));return wrap}
  function fileField(label,accept,max,onload){const wrap=el('label','uos-field');wrap.append(el('span','',label));const input=el('input');input.type='file';input.accept=accept;input.onchange=async()=>{const file=input.files?.[0];if(!file)return;if(file.size>max){status(`${label}超过 ${Math.round(max/1048576)} MB 限制`);input.value='';return}try{const result=await readFile(file);const message=await onload(result,file);status(message||`${label}已载入，点击保存后随角色卡导出。`)}catch(e){status(`文件读取失败：${e.message}`)}};wrap.append(input);return wrap}
  const readFile=file=>new Promise((ok,fail)=>{const reader=new FileReader();reader.onload=()=>ok(String(reader.result));reader.onerror=()=>fail(reader.error);reader.readAsDataURL(file)});
  async function lyricsText(file){const text=await file.text();return text.slice(0,300000)}
  function openSettings(){
    const dlg=showSheet('[data-settings-dialog]');if(!dlg)return;
    draft ||= normalize(config);const fields=$('[data-settings-fields]');fields.replaceChildren();
    fields.append(field('页面标题',draft.title,v=>draft.title=v),field('页面导语',draft.subtitle,v=>draft.subtitle=v,true),field('标题中排除的 <字段>（逗号分隔）',draft.excludedTags,v=>draft.excludedTags=v));
    const list=el('div');fields.append(list);
    const greetings=greetingList();const items=entries();items.forEach((entry,i)=>{
      draft.entries[i] ||= {...entry};entry=draft.entries[i];const box=el('section','uos-entry');box.append(el('strong','',`第 ${i+1} 条开场`));
      if(greetings[i]){const source=el('details','uos-source');source.append(el('summary','','查看原开场正文'),el('pre','',greetings[i]));box.append(source)}
      box.append(el('p','uos-help','卡片实时预览 · 保存后才会写入角色卡'));
      const preview=el('div','uos-card uos-card-preview'),cover=el('div','uos-cover'),body=el('div','uos-card-body');
      cover.append(el('span','uos-number',String(i+1).padStart(2,'0')));
      const label=el('span','uos-label'),title=el('strong'),description=el('div','uos-description'),namesPreview=el('p','uos-card-names');body.append(label,title,description,namesPreview);preview.append(cover,body);box.append(preview);
      const updatePreview=()=>{label.textContent=entry.label||`OPENING ${String(i+1).padStart(2,'0')}`;title.textContent=entry.title;description.textContent=entry.description;namesPreview.textContent=`登场人物 · ${entry.names||'未识别'}`;const image=/^(data:image\/(?:png|jpeg|webp|gif);base64,|https?:\/\/)/i.test(entry.image);cover.classList.toggle('has-image',image);cover.style.backgroundImage=image?`linear-gradient(0deg,#0005,transparent),url("${entry.image.replace(/["\\]/g,'')}")`:''};updatePreview();
      const group=el('div','uos-fields');group.append(
        field('标题',entry.title,v=>{entry.title=v;updatePreview()}),
        field('标签',entry.label,v=>{entry.label=v;updatePreview()}),
        field('登场人物（逗号分隔，输入“无”可隐藏误判）',entry.names===''?'无':entry.names||'',v=>{entry.names=v.trim()==='无'?'':v;updatePreview()}),
        field('简介',entry.description,v=>{entry.description=v;updatePreview()},true),
        fileField('上传封面（原图 8 MB 内）','image/png,image/jpeg,image/webp,image/gif',8*1048576,async(v,file)=>{const next=await optimizeCoverData(v,file,doc);if(next.length>1400000)throw Error('压缩后仍超过约 1 MB，请换更小的图片；GIF 动图不会压缩');entry.image=next;updatePreview();return next.length<v.length?`封面已压缩：${Math.round(v.length/1024)} KB → ${Math.round(next.length/1024)} KB，保存后随卡导出。`:'封面已载入；原图更小或不支持压缩，保存后随卡导出。'}));
      box.append(group);
      if(greetings[i]){const propose=el('button','uos-icon','从原文生成文案建议');propose.type='button';propose.onclick=()=>{const next=suggest(greetings[i],i);entry.title=next.title;entry.description=next.description;const inputs=group.querySelectorAll('input,textarea');inputs[0].value=entry.title;inputs[3].value=entry.description;updatePreview();status(`第 ${i+1} 条建议已填入，检查后再保存。`)};box.append(propose)}
      const clear=el('button','uos-icon','移除封面');clear.type='button';clear.onclick=()=>{entry.image='';updatePreview();status(`第 ${i+1} 条已改用主题排版封面`)};box.append(clear);list.append(box);
    });
    const music=$('[data-bgm-fields]');music.replaceChildren();
    music.append(toggleField('启用 BGM 播放器',draft.music.enabled,v=>{draft.music.enabled=v;renderMusic(draft.music);loaded.textContent=v?'BGM 已启用，保存后生效。':'BGM 已关闭，播放器已隐藏；保存后生效。'}),field('曲名',draft.music.title,v=>draft.music.title=v),
      fileField('上传音乐（8 MB 内）','audio/mpeg,audio/mp4,audio/ogg,audio/wav',8*1048576,v=>{draft.music.audio=v;renderMusic(draft.music);$('[data-bgm-loaded]').textContent=draft.music.enabled?'音乐已载入，可在选择页预览；点击保存写入角色卡。':'音乐已载入。勾选启用 BGM 后显示播放器，点击保存写入角色卡。'}),
      fileField('上传歌词（LRC 或 TXT）','.lrc,.txt,text/plain',300000,async(_data,file)=>{draft.music.lyrics=await lyricsText(file);renderMusic(draft.music);$('[data-bgm-loaded]').textContent='歌词已载入；点击保存写入角色卡。'}));
    const loaded=el('p','uos-help');loaded.dataset.bgmLoaded='';loaded.textContent=draft.music.audio?'已载入音乐'+(draft.music.lyrics?'及歌词':'')+'。保存后随卡导出。':'尚未上传音乐';music.append(loaded);
    const clearMusic=el('button','uos-icon','移除音乐');clearMusic.type='button';clearMusic.onclick=()=>{draft.music={enabled:false,title:'',audio:'',lyrics:''};renderMusic(draft.music);loaded.textContent='音乐已移除，点击保存生效'};music.append(clearMusic);
    music.append(el('p','uos-help','请仅上传你有权分享的歌曲及歌词。下载与非商用不自动授予再分发许可。'));
    const diag=$('[data-diagnostics]');diag.replaceChildren();for(const [key,value] of diagnostics()){const row=el('div','uos-diagnostic-row');row.append(el('span','',key),el('strong','',value));diag.append(row)}
    dlg.querySelectorAll('[data-tab]').forEach(button=>button.onclick=()=>{
      dlg.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',String(b===button)));
      dlg.querySelectorAll('[data-tab-panel]').forEach(panel=>panel.hidden=panel.dataset.tabPanel!==button.dataset.tab);
    });
    $('[data-save]').onclick=async()=>{
      const c=context();if(!c || c.characterId==null || !c.writeExtensionField){status('无法写入角色卡：请在支持角色卡扩展字段的酒馆中编辑。');return}
      const button=$('[data-save]');button.disabled=true;button.textContent='正在保存…';
      try{
        draft.theme=displayTheme;
        draft.entries=draft.entries.slice(0,greetingList().length);
        // ST may update the in-memory character while a failed server merge is
        // only logged. Verify persistence before reporting export readiness.
        if(typeof c.getRequestHeaders!=='function')throw Error('当前酒馆未提供保存请求接口');
        const card=character();if(!card?.avatar)throw Error('无法确认当前角色卡的文件名');
        const response=await host.fetch('/api/characters/merge-attributes',{method:'POST',headers:c.getRequestHeaders(),body:JSON.stringify({avatar:card.avatar,data:{extensions:{[KEY]:draft}}})});
        if(!response.ok)throw Error(`角色卡写入失败（HTTP ${response.status}），请检查卡片大小或酒馆日志`);
        const verified=await host.fetch('/api/characters/get',{method:'POST',headers:c.getRequestHeaders(),body:JSON.stringify({avatar_url:card.avatar})});
        if(!verified.ok)throw Error(`角色卡复核失败（HTTP ${verified.status}），请重新打开角色卡检查保存结果`);
        const persisted=await verified.json();
        const saved=persisted?.data?.extensions?.[KEY]??persisted?.extensions?.[KEY];
        const same=(actual,expected)=>{if(expected&&typeof expected==='object'){if(!actual||typeof actual!=='object')return false;return Object.keys(expected).every(key=>same(actual[key],expected[key]))}return actual===expected};
        if(!same(saved,draft))throw Error('角色卡复核未找到刚保存的设置，请重新打开角色卡检查');
        await c.writeExtensionField(c.characterId,KEY,draft);
        config=normalize(draft);draft=null;render();activePopup?.complete(null);status('已保存并复核角色卡。导出角色卡时会带上配置和素材。');
      }catch(e){status(`保存失败：${e.message||e}`)}
      finally{button.disabled=false;button.textContent='保存到角色卡'}
    };
  }
  $('[data-theme-button]').onclick=openThemes;
  $('[data-settings-button]').onclick=openSettings;
  root.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>activePopup?.complete(null));
  const audio=$('[data-player] audio');
  $('[data-play]').onclick=()=>{if(audio.paused)audio.play().catch(()=>status('无法播放该音乐文件'));else audio.pause()};
  $('[data-player]').querySelectorAll('[data-skip]').forEach(b=>b.onclick=()=>{audio.currentTime=Math.max(0,Math.min(audio.duration||Infinity,audio.currentTime+Number(b.dataset.skip)));updatePlayer()});
  $('[data-seek]').oninput=e=>{if(Number.isFinite(audio.duration))audio.currentTime=audio.duration*Number(e.target.value)/1000};
  audio.ontimeupdate=updatePlayer;audio.onloadedmetadata=updatePlayer;audio.onplay=updatePlayer;audio.onpause=updatePlayer;
  render();
  root.dataset.uosMounted = '1';
  root.dataset.uosVersion = VERSION;
  return true;
}


const AUTHOR_MARKER='<UniversalOpeningSelector/>';

function inspectAuthorState(context,helper){
  const card=context?.characters?.[context.characterId];
  if(!card || (context.groupId!=null && context.groupId!==-1))return {state:null,reason:null};
  try{if(Number(helper?.getLastMessageId?.()??0)>0)return {state:null,reason:null}}catch{}
  const data=card.data||card,first=String(data.first_mes??card.first_mes??'');
  const greetings=data.alternate_greetings??card.alternate_greetings;
  if(!first.trimStart().startsWith(AUTHOR_MARKER))return {state:null,reason:'已加载作者脚本。请把主开场第一行改为 <UniversalOpeningSelector/>，把原主开场移到备用开场第一条，保存角色卡后新建聊天。'};
  if(!Array.isArray(greetings)||!greetings.length)return {state:null,reason:'已识别选择器标记，但备用开场为空。请至少填写一条正式开场，保存角色卡后新建聊天。'};
  if(typeof helper?.getChatMessages!=='function')return {state:null,reason:'已识别角色卡设置，但酒馆助手消息接口尚未就绪。请检查酒馆助手是否启用。'};
  let message,last;
  try{message=helper.getChatMessages(0,{include_swipes:true})?.[0];last=helper.getLastMessageId?.()}catch{return {state:null,reason:'读取首条消息失败。请保存角色卡并新建聊天。'}}
  if(Number(last??0)>0||Number(message?.swipe_id)!==0)return {state:null,reason:null};
  if(message?.role!=='assistant'||!String(message.swipes?.[0]||'').includes(AUTHOR_MARKER))
    return {state:null,reason:'角色卡标记已准备好，但当前首条消息不是选择页。请保存角色卡并新建聊天。'};
  return {state:{characterId:context.characterId,avatar:card.avatar,entries:greetings},reason:null};
}

function readAuthorState(context,helper){return inspectAuthorState(context,helper).state}

function authorHtml(count){
  // Existing saved card settings take precedence over this initial seed.
  const seed={version:1,title:'选择故事的起点',subtitle:'选择一个开场，故事将从那里继续。',theme:'archive',entries:[],music:{enabled:false,title:'',audio:'',lyrics:''}};
  return AUTHOR_HTML.replace(/(<script type="application\/json" id="uos-seed">)[\s\S]*?(<\/script>)/,(_,start,end)=>start+JSON.stringify(seed)+end)
    .replace('已读取 1 条正式开场',`已读取 ${count} 条正式开场`);
}

function mountAuthorSelector(startDocument=document,helperApi,{showSetupHints=false}={}){
  let doc=startDocument,win=doc.defaultView;
  try{for(let i=0;i<8&&win?.parent&&win.parent!==win;i++){void win.parent.document;win=win.parent;doc=win.document}}catch{}
  doc.__uosAuthor?.close?.();
  // Replacing a script must recover the original message from any older frame.
  for(const stale of doc.querySelectorAll('iframe[data-uos-author-frame]')){
    const container=stale.parentElement,contents=stale.previousElementSibling;
    if(container&&contents?.matches('div[hidden]')){
      while(contents.firstChild)container.insertBefore(contents.firstChild,contents);
      contents.remove();
    }
    stale.remove();
  }
  const host=doc.defaultView||globalThis,helper=helperApi||host.TavernHelper||host;
  let active=null,notice=null,updating=false;
  function closeNotice(){notice?.remove();notice=null}
  function showNotice(container,message){
    if(notice?.parentElement===container&&notice.textContent===message)return;
    closeNotice();
    notice=doc.createElement('div');notice.dataset.uosAuthorHint='';notice.setAttribute('role','status');
    notice.style.cssText='position:relative!important;z-index:10!important;pointer-events:auto!important;margin:12px 0;padding:12px 14px;border:1px solid #c99d67;border-radius:10px;background:#17252d;color:#f4ecda;font:13px/1.6 system-ui,sans-serif;white-space:pre-wrap';
    notice.textContent=message;container.prepend(notice);
  }
  function closeFrame(){
    if(!active)return;
    const {frame,container,contents,resize}=active;active=null;resize?.disconnect();
    for(const popup of doc.querySelectorAll('iframe[data-uos-frame]'))popup.remove();frame.remove();
    if(container.isConnected){while(contents.firstChild)container.insertBefore(contents.firstChild,contents);contents.remove()}
  }
  function scan(){
    if(updating)return;updating=true;
    try{
      const {state,reason}=inspectAuthorState(host.SillyTavern?.getContext?.(),helper);
      const first=doc.querySelector('#chat .mes[mesid="0"],#chat .mes[data-mesid="0"]');
      const container=first?.querySelector('.mes_text,.mes_text_container')||first;
      if(!state||!container){closeFrame();if(showSetupHints&&reason&&container)showNotice(container,reason);else closeNotice();return}
      closeNotice();
      const key=`${state.avatar}\u0000${state.entries.length}\u0000${api.version}`;
      if(active?.container===container&&active.key===key&&active.frame.isConnected)return;
      closeFrame();
      const contents=doc.createElement('div');contents.hidden=true;contents.dataset.uosOriginal='';while(container.firstChild)contents.append(container.firstChild);container.append(contents);
      const frame=doc.createElement('iframe');frame.title='红豆粉开场白选择器';frame.dataset.uosAuthorFrame='';
      // Some chat themes disable pointer events on message iframes. Without
      // an explicit override the UI remains visible, but every button is inert.
      frame.style.cssText='display:block!important;position:relative!important;z-index:10!important;pointer-events:auto!important;width:100%;height:460px;border:0;background:transparent;overflow:hidden';
      container.append(frame);active={frame,container,contents,key};
      const frameDoc=frame.contentDocument;
      if(!frameDoc)throw Error('选择页 iframe 无法访问');
      frameDoc.open();frameDoc.write(authorHtml(state.entries.length));frameDoc.close();
      const root=frameDoc.querySelector('[data-uos]');root.__uosHostDocument=doc;
      if(!mountInDocument(frameDoc,helper))throw Error('选择页未挂载');
      if(host.ResizeObserver){const resize=new host.ResizeObserver(()=>{if(frame.isConnected)frame.style.height=`${Math.max(420,frameDoc.documentElement.scrollHeight+4)}px`});resize.observe(frameDoc.body);active.resize=resize;}else frame.style.height=`${Math.max(460,frameDoc.documentElement.scrollHeight+4)}px`;
    }catch(error){closeFrame();console.warn('[Aliceneko Opening Selector] 作者选择页加载失败',error)}
    finally{updating=false}
  }
  const observer=new host.MutationObserver(scan);if(doc.body)observer.observe(doc.body,{childList:true,subtree:true});
  const timer=host.setInterval(scan,1300),runnerWindow=startDocument.defaultView;
  const api={version:'1.0.1',scan,close:()=>{observer.disconnect();host.clearInterval(timer);runnerWindow?.removeEventListener?.('pagehide',onPageHide);active?.resize?.disconnect();closeFrame();closeNotice();if(doc.__uosAuthor===api)delete doc.__uosAuthor}};
  const onPageHide=()=>{if(doc.__uosAuthor===api)api.close()};doc.__uosAuthor=api;
  if(runnerWindow!==host)runnerWindow?.addEventListener?.('pagehide',onPageHide,{once:true});
  scan();return api;
}

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
function excludedTags(value){return [...new Set(String(value||'').split(/[，,、\s]+/).map(x=>x.trim().replace(/^<\/?|\/>?$/g,'')).filter(x=>/^[\w\p{Script=Han}-]{1,40}$/u.test(x)))].slice(0,40)}
function stripExcluded(text,tags){for(const tag of tags){const safe=tag.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');text=text.replace(new RegExp(`<${safe}(?:\\s[^<>]*)?>[\\s\\S]*?<\\/${safe}\\s*>`,'gi'),' ').replace(new RegExp(`<${safe}(?:\\s[^<>]*)?\\/?>`,'gi'),' ')}return text}
function narrativeStart(body,excluded=[]){
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
function greetingTitle(body,index,excluded=[]){
  const content=narrativeStart(body,excluded),sentence=content.match(/^.{1,64}?[。！？!?]/)?.[0];
  return sentence||(`${content.slice(0,56)}${content.length>56?'…':''}`)||`开场 ${index+1}`;
}
function greetingNames(body){
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
function isLegacyGeneratedEntry(body,entry,index){
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
function resolveDisplayEntry(entry,author={},local={},excluded=[]){
  const title=typeof local.title==='string'&&local.title.trim()?local.title.trim():typeof author.title==='string'&&author.title.trim()?author.title.trim():greetingTitle(entry.body,entry.index,excluded);
  const nameValue=typeof local.names==='string'?local.names:typeof author.names==='string'?author.names:null;
  const names=nameValue===null?entry.names:parseNames(nameValue);
  return {title,names,titleSource:local.title?.trim()?'玩家填写':author.title?.trim()?'作者填写':'自动提取',namesSource:nameValue===null?(names.length?'自动提取':'未识别'):typeof local.names==='string'?'玩家填写':'作者填写'};
}

function readPlayerState(context,helper){
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

function mountPlayerSelector(startDocument=document,helperApi){
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

export const OPENING_SELECTOR_VERSION='1.0.1';
export function mountUniversalSelector(startDocument=document,helperApi=null){const doc=startDocument?.nodeType===9?startDocument:document;const helper=helperApi||globalThis.TavernHelper||(typeof globalThis.getChatMessages==='function'?globalThis:null);mountPlayerSelector(doc,helper);mountAuthorSelector(doc,helper);return {player:doc.__uosPlayer,author:doc.__uosAuthor}};
