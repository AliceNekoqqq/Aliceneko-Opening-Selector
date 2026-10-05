import {createOpeningBlindBox,openingBlindBoxButton,updateBlindBoxButton,openingBlindRangeButton,setBlindBoxTheme} from './opening-blind-box.js';
import {BLIND_BOX_CONTROL_CSS} from './opening-blind-box-styles.js';
import {createOpeningFavorites} from './opening-favorites.js';
import {createOpeningFavoritesUI} from './opening-favorites-ui.js';
import {OPENING_FAVORITES_CSS} from './opening-favorites-styles.js';
import {createPlayerPanelSession} from './player-panel-session.js';
import {createPlayerButtonDrag} from './player-button-drag.js';
import {createPlayerSettingsLayout} from './player-settings-layout.js';
import {unsavedPlayerGroups,createPlayerDraftGuard,showPlayerUnsavedPrompt} from './player-draft-guard.js';
export {unsavedPlayerGroups} from './player-draft-guard.js';
import {THEME_ART} from './theme-art.js';
import {RUNTIME_VERSION} from './version.js';
import {THEME_BACKGROUND_IMAGES,createThemeBackgroundController} from './theme-backgrounds.js';
import {THEMES,THEME_CAPTIONS} from './themes.js';
import {clean,excludedTags,narrativeStart,greetingTitle,personAliases,detectGreetingPeople,greetingNames,detectGreetingCollection,isLegacyGeneratedEntry} from './greeting-analysis.js';
export {clean,excludedTags,narrativeStart,greetingTitle,personAliases,detectGreetingPeople,greetingNames,detectGreetingCollection,isLegacyGeneratedEntry} from './greeting-analysis.js';
import {defaultCoverStyles} from './default-covers.js';
import {OPENING_LAYOUTS,openingLayout,applyOpeningCover} from './opening-presentation.js';
import {OPENING_LAYOUT_CSS} from './opening-layout-styles.js';
import {createOpeningPreview} from './opening-preview.js';
import {openingMetadata,matchesOpening} from './opening-categories.js';
import {createOpeningCategoryFilters,createOpeningGroupRenderer,openingTagChips} from './opening-category-ui.js';
import {OPENING_CATEGORY_CSS} from './opening-category-styles.js';
import {OPENING_ACTION_CSS,decorateOpeningPreviewButton} from './opening-action-styles.js';
import {bindUpdateControl} from './update-control.js';
import {createWorldbookPeopleReader,renderWorldbookPeopleList,formatWorldbookPeopleStatus} from './worldbook-people.js';
import {createWorldbookPresetManager} from './worldbook-presets.js';
/* Optional global Tavern Helper script for ordinary multi-greeting cards. */
const KEY='universal_opening_selector';
const WATERMARK='唯一来源Discord:♡Aliceneko♡/红豆粉丨本插件完全免费';
const VERSION=RUNTIME_VERSION;
const THEME_ORNAMENT_SPRITE=THEME_ART.ornaments;
const THEME_ICON_SPRITE=THEME_ART.icons;
const CSS=`
.uos-user-trigger{display:block;width:max-content;max-width:calc(100% - 24px);margin:10px 12px;padding:8px 13px;border:1px solid #b99669;border-radius:999px;background:#17242d;color:#f3e9d7;font:13px/1.4 system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 14px #0004}
.uos-user-trigger[data-floating=true]{position:fixed!important;z-index:2147483645;right:auto!important;bottom:auto!important;margin:0!important;transform:none!important;transition:none!important;touch-action:none;user-select:none}
.uos-user-trigger[data-theme=neon]{background:#211839;border-color:#d279ef;color:#fff0fa;box-shadow:0 0 18px #b044c288}.uos-user-trigger[data-theme=paper]{background:#f8eedb;border-color:#a3493b;color:#522d28}.uos-user-trigger[data-theme=noir]{background:#1b1c1e;border-color:#e1dfda;color:#f7f5ef}.uos-user-trigger[data-theme=meadow]{background:#1d392f;border-color:#bec889;color:#f3f1d9}
.uos-user-trigger:focus-visible,.uos-user-panel button:focus-visible{outline:2px solid #efc58b;outline-offset:2px}
dialog.uos-user-overlay{position:fixed;inset:0;z-index:2147483646;box-sizing:border-box;width:min(620px,calc(100vw - 28px));max-width:calc(100vw - 28px);max-height:calc(100dvh - 28px);margin:auto;padding:0;border:0;border-radius:18px;background:transparent;color:inherit;overflow:hidden;box-shadow:0 20px 60px #0008}
dialog.uos-user-overlay::backdrop{background:transparent}
.uos-user-panel{--bg:#111a21;--surface:#202d35;--text:#f1e7d4;--muted:#bbb7aa;--accent:#deb47c;--line:#b9966970;box-sizing:border-box;display:flex;flex-direction:column;width:100%;max-height:min(74dvh,690px);overflow:hidden;padding:18px;border:1px solid var(--accent);border-radius:18px;background:radial-gradient(circle at 100% 0%,var(--accent) 0,transparent 1px),var(--bg);color:var(--text);font:14px/1.5 system-ui,"Noto Sans SC",sans-serif}
.uos-user-panel[data-theme=neon]{--bg:#080e22;--surface:#171c38;--text:#f5f1ff;--muted:#b8b2d1;--accent:#fa74bf;--line:#9d7de399}
.uos-user-panel[data-theme=ancient]{--bg:#201a20;--surface:#38292d;--text:#f5ead5;--muted:#d4c1ae;--accent:#dbb77c;--line:#b98d6c99;--glow:#a56b5940;--wash:#79545144;--frame:#b98d6c;border-radius:4px;background:radial-gradient(circle at 100% 0%,#a56b5940,transparent 45%),#201a20}.uos-user-panel[data-theme=ancient]::before{border-radius:1px}.uos-user-panel[data-theme=ancient] .uos-user-card{border-radius:3px;border-left:3px solid var(--accent);background:repeating-linear-gradient(135deg,transparent 0 22px,#dbb77c14 23px 24px),var(--surface)}.uos-user-panel[data-theme=ancient] .uos-user-head h2{font-family:"Noto Serif SC","Songti SC",serif}.uos-user-trigger[data-theme=deepsea]{background:#0d3444;border-color:#81d5d7;color:#e5ffff}.uos-user-trigger[data-theme=amber]{background:#362218;border-color:#e7b870;color:#fff0d1}.uos-user-trigger[data-theme=theatre]{background:#302034;border-color:#dfb47e;color:#fff0e7}.uos-user-trigger[data-theme=lasttrain]{background:#202a33;border-color:#d9a86e;color:#f6e9d6}.uos-user-trigger[data-theme=aurora]{background:#10283a;border-color:#8fe0d3;color:#e9f8ff}.uos-user-trigger[data-theme=glasshouse]{background:#203429;border-color:#d6b88a;color:#f1f4e9}
.uos-user-trigger[data-theme=ancient]{background:#302329;border-color:#dbb77c;color:#f5ead5}
.uos-user-trigger[data-theme=japan]{background:#272139;border-color:#d8b783;color:#f4edf0;box-shadow:0 4px 14px #100d1c88}
.uos-user-panel[data-theme=paper]{--bg:#f4eee2;--surface:#fffaf0;--text:#362d29;--muted:#675950;--accent:#a64d3c;--line:#a77e6b8c}
.uos-user-panel[data-theme=noir]{--bg:#121314;--surface:#27292b;--text:#f2f1ec;--muted:#babbb9;--accent:#e4e1d5;--line:#a3a3a36b}
.uos-user-panel[data-theme=meadow]{--bg:#122a24;--surface:#254037;--text:#f3f4e1;--muted:#c2d1bf;--accent:#d2e5a0;--line:#afc28980}
.uos-user-update{border:1px solid var(--line);border-radius:8px;padding:8px 12px;background:var(--surface);color:var(--accent);font:inherit;white-space:nowrap;cursor:pointer}.uos-user-close{white-space:nowrap;flex-shrink:0}.uos-user-theme-control{display:flex;align-items:center;gap:10px;min-width:0}.uos-user-theme-label{color:var(--accent);font:600 12px/1.5 system-ui,sans-serif;letter-spacing:.12em;white-space:nowrap;padding:3px 0;border-bottom:1px solid var(--line)}.uos-user-theme-control select{min-width:0;min-height:38px;max-width:150px}.uos-user-tools{flex-wrap:wrap;gap:10px}
.uos-user-update-settings .uos-user-update-auto{display:flex;grid-template-columns:none;align-items:center;gap:9px;margin:10px 0;color:var(--text);font-size:12px}.uos-user-update-settings .uos-user-update-auto input{flex:none;width:17px;height:17px;margin:0;padding:0;accent-color:var(--accent)}.uos-user-update-settings .uos-user-status{margin:4px 0 10px}.uos-update-star{margin-left:2px;color:var(--accent);font:700 8px/1 system-ui,sans-serif;vertical-align:super}
.uos-user-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}.uos-user-head h2{margin:0;color:var(--text);font:600 22px/1.3 Georgia,"Noto Serif SC",serif}.uos-user-head p{margin:4px 0 0;color:var(--muted);font-size:12px}
.uos-user-panel button,.uos-user-panel select{font:inherit}.uos-user-close{border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--text);padding:8px 12px;cursor:pointer}.uos-user-tools{display:flex;align-items:center;gap:8px;margin-bottom:12px;color:var(--muted);font-size:12px}.uos-user-tools select{min-width:0;padding:6px 8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--text)}
.uos-user-label-settings{flex:none;min-height:48px;max-height:min(35dvh,240px);overflow:auto;margin-bottom:12px;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface)}.uos-user-label-settings summary{color:var(--accent);cursor:pointer}.uos-user-label-settings label{display:grid;gap:5px;margin:10px 0;color:var(--muted);font-size:12px}.uos-user-label-settings input{box-sizing:border-box;width:100%;padding:8px 10px;border:1px solid var(--line);border-radius:7px;background:var(--bg);color:var(--text);font:14px/1.4 system-ui,sans-serif}.uos-user-label-settings button{padding:7px 12px;border:1px solid var(--line);border-radius:8px;background:var(--accent);color:var(--bg);font-weight:700}
.uos-user-label-settings textarea{box-sizing:border-box;width:100%;min-height:70px;padding:8px 10px;border:1px solid var(--line);border-radius:7px;background:var(--bg);color:var(--text);font:14px/1.4 system-ui,sans-serif;resize:vertical}.uos-worldbook-people{max-height:240px;overflow:auto;padding-left:22px;overflow-wrap:anywhere;font-size:13px}.uos-worldbook-people li{margin:10px 0}.uos-worldbook-people p{margin:4px 0;color:var(--muted);font-size:12px;line-height:1.5}.uos-user-candidates{font-size:12px;color:var(--muted)}
.uos-user-list{display:grid;gap:12px;min-height:0;overflow:auto;overscroll-behavior:contain;padding:2px 3px 12px}.uos-user-card{padding:14px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}.uos-user-card[data-current=true]{border-color:var(--accent);box-shadow:inset 3px 0 var(--accent)}.uos-user-card h3{margin:0 0 6px;color:var(--text);font:600 17px/1.4 Georgia,"Noto Serif SC",serif}.uos-user-card p{margin:0 0 9px;color:var(--muted);font-size:12px}.uos-user-status{min-height:18px;margin:8px 0 0;color:var(--accent);font-size:12px}
.uos-user-card .uos-user-names{color:var(--accent);font-size:13px}
.uos-user-search{display:flex;gap:8px;flex:none;margin:0 0 10px}.uos-user-search input,.uos-user-search select{min-width:0;flex:1;padding:8px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--text)}.uos-user-empty{padding:16px;color:var(--muted)}
/* These selects live in the Tavern document and must override host control themes. */
.uos-user-panel select,.uos-user-panel select option{background:var(--surface)!important;color:var(--text)!important;color-scheme:dark!important}
.uos-user-panel:is([data-theme=paper],[data-theme=school]) select,.uos-user-panel:is([data-theme=paper],[data-theme=school]) select option{color-scheme:light!important}

/* Six authored visual systems. All decoration stays behind text and controls. */
.uos-user-panel{--glow:transparent;--wash:transparent;--ornament:"✦";--frame:var(--line);position:relative;isolation:isolate;max-height:min(84dvh,780px);padding:22px 24px 18px;border:1px solid var(--frame);border-radius:20px;background:radial-gradient(ellipse at 82% -20%,var(--glow),transparent 57%),linear-gradient(145deg,var(--wash),transparent 44%),var(--bg);box-shadow:inset 0 0 0 5px color-mix(in srgb,var(--bg) 85%,var(--accent)),0 28px 80px #0009}
.uos-user-panel::before{display:none}
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

.uos-user-card p{position:relative;line-height:1.6}.uos-user-card .uos-user-names{font-weight:650;letter-spacing:.025em}



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
.uos-user-panel[data-theme=neon] .uos-user-names{color:#dcb5ff}

/* Paper: ivory stock, vermilion editorial marks and generous type. */
.uos-user-panel[data-theme=paper]{--bg:#e9dfcb;--surface:#f9f2e4;--text:#292926;--muted:#665e53;--accent:#a43c30;--line:#9a745e80;--glow:#d9ae7a55;--wash:#fff8e2aa;--frame:#906d52;color-scheme:light}
.uos-user-panel[data-theme=paper]{border-radius:4px;box-shadow:inset 0 0 0 6px #f3ebda,0 23px 55px #2b201c66}
.uos-user-panel[data-theme=paper]::before{border-radius:1px}
.uos-user-panel[data-theme=paper] .uos-user-head h2,.uos-user-panel[data-theme=paper] .uos-user-card h3{font-family:Georgia,"Noto Serif SC",serif}
.uos-user-panel[data-theme=paper] .uos-user-card{border-radius:2px;border-left:4px solid var(--accent);background:linear-gradient(90deg,#d2bdaa48 0 1px,transparent 1px),linear-gradient(#fffaf0,#f7efdf);box-shadow:2px 5px 0 #aa8d7040}
.uos-user-panel[data-theme=paper] .uos-user-card::after{border-radius:0}

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

.uos-user-watermark{position:relative;flex:none;margin-top:16px;padding:12px 60px 0 0;border-top:1px solid var(--line);color:var(--muted);font-size:10px;line-height:1.5;overflow-wrap:anywhere}
.uos-user-version-badge{align-self:start;margin:auto 0 0;color:var(--accent);font:10px/1.3 Georgia,serif;white-space:nowrap}
.uos-user-version{position:absolute;right:0;bottom:0;color:var(--accent);font:10px/1.5 Georgia,serif;white-space:nowrap}
@media(prefers-reduced-motion:reduce){.uos-user-panel button,.uos-user-panel select,.uos-user-search input{transition:none}}

.uos-user-panel[data-theme=starmap]{--bg:#09182c;--surface:#102b43;--text:#e5f5f9;--muted:#abc6d2;--accent:#9bdbe9;--line:#64a9c286;--glow:#286d9270;--wash:#27527648;--frame:#78bed1}.uos-user-panel[data-theme=starmap] .uos-user-card{border-radius:18px 4px 18px 4px;background:radial-gradient(circle at 86% 24%,transparent 0 35px,#9bdbe935 36px 37px,transparent 38px),linear-gradient(135deg,#173b59,#0d2036)}.uos-user-panel[data-theme=starmap] .uos-user-card::before{font-family:system-ui,sans-serif;font-weight:300;letter-spacing:-.12em}.uos-user-trigger[data-theme=starmap]{background:#123048;border-color:#9bdbe9;color:#e5f5f9}
.uos-user-panel[data-theme=rose]{--bg:#31232d;--surface:#503743;--text:#fff0e7;--muted:#e4c9ca;--accent:#f2c5b5;--line:#dea5ac88;--glow:#d3829665;--wash:#965c6b55;--frame:#e1a6ad}.uos-user-panel[data-theme=rose] .uos-user-card{border-radius:24px 24px 6px 6px;background:radial-gradient(circle at 85% 18%,#eaa6a353,transparent 38%),linear-gradient(135deg,#694658,#3b2935)}.uos-user-panel[data-theme=rose] .uos-user-card::before{font-style:italic;opacity:.2}.uos-user-panel[data-theme=rose] .uos-user-head h2{font-family:Georgia,"Noto Serif SC",serif}.uos-user-trigger[data-theme=rose]{background:#503743;border-color:#f2c5b5;color:#fff0e7}
.uos-user-panel[data-theme=wasteland]{--bg:#1c2225;--surface:#292c2d;--text:#f5ece2;--muted:#c9bcb2;--accent:#f3a969;--line:#c9805488;--glow:#a75b3c65;--wash:#78524044;--frame:#d18a5e;border-radius:5px}.uos-user-panel[data-theme=wasteland] .uos-user-card{border-radius:3px;border-left:5px solid var(--accent);background:repeating-linear-gradient(135deg,#f3a96916 0 5px,transparent 6px 19px),#292c2d}.uos-user-panel[data-theme=wasteland] .uos-user-card::before{font-family:system-ui,sans-serif;font-weight:800}.uos-user-trigger[data-theme=wasteland]{background:#292c2d;border-color:#f3a969;color:#f5ece2}

.uos-user-background{position:absolute;z-index:0;top:0;left:0;right:0;height:min(420px,62dvh);pointer-events:none;background-image:var(--uos-user-background,none);background-repeat:no-repeat;background-position:center top;background-size:cover;opacity:.42;-webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 17%,transparent 100%);mask-image:linear-gradient(to bottom,#000 0%,#000 17%,transparent 100%)}
.uos-user-panel>:not(.uos-user-background){position:relative;z-index:1}
.uos-user-panel::before{z-index:2}
.uos-user-panel[data-theme=paper] .uos-user-background{opacity:.82;mix-blend-mode:multiply}
.uos-user-panel[data-theme=neon] .uos-user-background,.uos-user-panel[data-theme=meadow] .uos-user-background,.uos-user-panel[data-theme=rose] .uos-user-background{opacity:.34}


/* Shared story-card finish, inherited from all nine theme palettes. */
.uos-user-panel .uos-user-card{background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 6%,var(--surface)),var(--surface) 65%);box-shadow:inset 0 1px color-mix(in srgb,var(--text) 12%,transparent),0 8px 20px #0002;transition:border-color .18s,box-shadow .18s,transform .18s}
.uos-user-card h3{font-size:19px;line-height:1.5;padding-right:28px;overflow-wrap:anywhere;text-wrap:pretty}
.uos-user-panel .uos-user-card[data-current=true]{border-color:var(--accent);box-shadow:inset 3px 0 var(--accent),inset 0 1px color-mix(in srgb,var(--text) 15%,transparent),0 8px 20px #0002}
.uos-user-card .uos-user-names{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:14px 0;font-weight:500}
.uos-cast-label{width:100%;font-size:10px;letter-spacing:.12em;color:var(--muted);margin-bottom:2px}
.uos-name-chip{display:inline-block;max-width:100%;overflow-wrap:anywhere;padding:4px 9px;border:1px solid color-mix(in srgb,var(--accent) 28%,var(--line));border-radius:6px;background:color-mix(in srgb,var(--accent) 8%,var(--surface));color:var(--accent);font-family:inherit;font-weight:500;font-size:12px;line-height:1.5}


@media(hover:hover){.uos-user-card:hover{transform:translateY(-2px);border-color:var(--accent)}}
.uos-user-card:focus-within{border-color:var(--accent)}
@media(prefers-reduced-motion:reduce){.uos-user-panel .uos-user-card{transition:none}.uos-user-card:hover{transform:none}}


.uos-user-panel[data-theme=deepsea]{--bg:#071a24;--surface:#10303d;--text:#e8f7f5;--muted:#a9c8cc;--accent:#84dadd;--line:#72b8c57a;--glow:#3eb5c344;--wash:#17576a44;--frame:#72c5ce;color-scheme:dark}
.uos-user-panel[data-theme=deepsea]{background:radial-gradient(ellipse at 75% 0%,#21728a55,transparent 45%),linear-gradient(160deg,#0b2a39,#071a24 75%)}
.uos-user-panel[data-theme=deepsea] .uos-user-card{background:linear-gradient(145deg,#164154,#0c2735 72%);border-radius:16px 5px 16px 5px}
.uos-user-panel[data-theme=deepsea] .uos-user-card::after{border-radius:11px 3px 11px 3px;border-color:#83d9d677}
.uos-user-panel[data-theme=amber]{--bg:#24170f;--surface:#3a281b;--text:#fbebcf;--muted:#d2bc98;--accent:#e9bd75;--line:#d3a46677;--glow:#f0ae4c40;--wash:#8d512944;--frame:#d9ae70;color-scheme:dark}
.uos-user-panel[data-theme=amber]{background:radial-gradient(ellipse at 55% 0%,#9b572d44,transparent 50%),linear-gradient(160deg,#362114,#21150f 78%)}
.uos-user-panel[data-theme=amber] .uos-user-card{background:linear-gradient(145deg,#50351f,#302116 75%);border-radius:20px 7px 20px 7px}
.uos-user-panel[data-theme=amber] .uos-user-card::after{border-radius:14px 4px 14px 4px;border-color:#eac48166}
.uos-user-panel[data-theme=theatre]{--bg:#1b111e;--surface:#332438;--text:#f8edf1;--muted:#cab4c5;--accent:#e1b783;--line:#c18ba577;--glow:#a4517940;--wash:#5c315455;--frame:#d1a478;color-scheme:dark}
.uos-user-panel[data-theme=theatre]{background:radial-gradient(ellipse at 83% 0%,#77405b55,transparent 46%),linear-gradient(155deg,#2c1b31,#190f1b 76%);border-radius:16px 4px}
.uos-user-panel[data-theme=theatre] .uos-user-card{background:linear-gradient(145deg,#432c45,#281b2e 72%);border-radius:4px 14px}
.uos-user-panel[data-theme=theatre] .uos-user-card::after{border-radius:2px 10px;border-color:#e0bb8770}
.uos-user-panel[data-theme=lasttrain]{--bg:#101922;--surface:#1b2934;--text:#eef1ef;--muted:#b6c0c5;--accent:#d9a86e;--line:#b38b616e;--glow:#dfa85d30;--wash:#49627638;--frame:#b38b61;color-scheme:dark}
.uos-user-panel[data-theme=lasttrain]{background:radial-gradient(ellipse at 18% 0%,#b7793d38,transparent 43%),linear-gradient(160deg,#1b2a36,#101922 78%)}
.uos-user-panel[data-theme=lasttrain] .uos-user-card{background:linear-gradient(145deg,#253440,#18232d 74%);border-radius:5px 5px 16px 5px}
.uos-user-panel[data-theme=lasttrain] .uos-user-card::after{border-radius:3px 3px 12px 3px;border-color:#d5ae7b66}
.uos-user-panel[data-theme=aurora]{--bg:#081827;--surface:#102c42;--text:#e9f7ff;--muted:#afccdc;--accent:#90e5d7;--line:#77bfc58a;--glow:#48c9cf36;--wash:#1e667544;--frame:#79c9d0;color-scheme:dark}
.uos-user-panel[data-theme=aurora]{background:radial-gradient(ellipse at 72% 0%,#2ec9b755,transparent 44%),linear-gradient(160deg,#102b45,#081827 78%)}
.uos-user-panel[data-theme=aurora] .uos-user-card{background:linear-gradient(145deg,#16374d,#0d2337 74%);border-radius:16px 5px}
.uos-user-panel[data-theme=aurora] .uos-user-card::after{border-radius:12px 3px;border-color:#81ded377}
.uos-user-panel[data-theme=glasshouse]{--bg:#15251e;--surface:#293a30;--text:#f1f4e9;--muted:#bdcbbd;--accent:#dab487;--line:#9db79d87;--glow:#dcb48632;--wash:#52715244;--frame:#cba57b;color-scheme:dark}
.uos-user-panel[data-theme=glasshouse]{background:radial-gradient(ellipse at 78% 0%,#92ad6b44,transparent 48%),linear-gradient(160deg,#26392e,#15251e 78%)}
.uos-user-panel[data-theme=glasshouse] .uos-user-card{background:linear-gradient(145deg,#344739,#203329 74%);border-radius:18px 5px 18px 5px}
.uos-user-panel[data-theme=glasshouse] .uos-user-card::after{border-radius:13px 3px 13px 3px;border-color:#dab48777}


.uos-user-panel[data-theme=japan]{--bg:#151827;--surface:#242437;--text:#f4edf0;--muted:#c8b8c1;--accent:#dfbd9a;--line:#c889a66b;--glow:#a9507250;--wash:#64354d55;--frame:#d8b783;border-radius:16px;background:radial-gradient(ellipse at 74% 0%,#a9507250,transparent 46%),linear-gradient(155deg,#292139,#151827 78%)}
.uos-user-panel[data-theme=japan]::before{border-radius:12px}
.uos-user-panel[data-theme=japan] .uos-user-head h2{font-family:"Noto Serif SC","Songti SC",serif}
.uos-user-panel[data-theme=japan] .uos-user-card{border-radius:12px 12px 18px 18px;border-color:#d8b78388;background:repeating-linear-gradient(90deg,transparent 0 20px,#d6b57b09 21px 22px),linear-gradient(135deg,#30253a,#1b1d2e 78%);box-shadow:0 12px 30px #080a16aa}
.uos-user-panel[data-theme=japan] .uos-user-card::after{border-radius:8px 8px 13px 13px;border-color:#d8b78370}
.uos-user-panel[data-theme=japan] .uos-user-card::before{content:"⛩";font-style:normal;font-size:70px;opacity:.12}
.uos-user-panel[data-theme=japan] .uos-user-background{opacity:.62}
.uos-user-panel[data-theme=japan] .uos-user-kicker::after{content:"";display:inline-block;width:23px;height:23px;margin-left:8px;vertical-align:middle;background-image:url("${THEME_ICON_SPRITE}");background-size:500% 400%;background-position:0% 100%;background-repeat:no-repeat;filter:drop-shadow(0 2px 5px #0008)}

.uos-user-trigger[data-theme=school]{background:#eef4fb;border-color:#86afd0;color:#32659b;box-shadow:0 4px 14px #5881a822}
.uos-user-panel[data-theme=school]{--bg:#eef4fb;--surface:#fff;--text:#263b57;--muted:#536982;--accent:#32659b;--line:#b8cbdf;--glow:#f3bdd133;--wash:#c1dff333;--frame:#afc8df;background:radial-gradient(ellipse at 80% 0%,#e7c4d744,transparent 50%),var(--bg);color-scheme:light}
.uos-user-panel[data-theme=school] .uos-user-head h2,.uos-user-panel[data-theme=school] .uos-user-card h3{font-family:system-ui,"Noto Sans SC",sans-serif}
.uos-user-panel[data-theme=school] .uos-user-card{border-radius:15px;border-color:#b8cbdf;background:linear-gradient(145deg,#fff,#f5f8fe);box-shadow:0 8px 22px #5881a81a}
.uos-user-panel[data-theme=school] .uos-user-card::after{border-radius:11px;border-color:#d5deee}.uos-user-panel[data-theme=school] .uos-user-background{opacity:.85}
.uos-user-panel[data-theme=school] .uos-user-header-ornament{background-image:url("${THEME_ART.schoolOrnament}");background-size:contain;background-position:center}

/* Same generated ornament atlas as the author page; pointer events stay disabled. */
.uos-user-panel{--ornament-position:0% 0%}
.uos-user-header-ornament{display:block;pointer-events:none;background-image:url("${THEME_ORNAMENT_SPRITE}");background-size:400% 400%;background-position:var(--ornament-position);background-repeat:no-repeat;filter:drop-shadow(0 2px 3px #0003)}
.uos-user-kicker{display:flex;align-items:center;gap:10px}.uos-user-panel[data-theme=japan] .uos-user-kicker::after{display:none}
.uos-user-header-ornament{width:72px;height:72px;flex:none}

.uos-user-card{box-shadow:inset 0 1px 0 #ffffff0d,0 9px 22px #0002}
@media(max-width:500px){.uos-user-header-ornament{width:54px;height:54px}}
/* Opening number lives beside the title, away from the right-hand ornament. */
.uos-user-panel[data-theme] .uos-user-card::before{content:attr(data-number);position:relative;float:left;inset:auto;z-index:auto;font:600 22px/1.5 Georgia,serif;letter-spacing:0;opacity:.8;margin:2px 10px 0 0;pointer-events:none}

.uos-user-panel[data-theme=archive]{--ornament-position:0.00000% 0.00000%}
.uos-user-panel[data-theme=neon]{--ornament-position:33.33333% 0.00000%}
.uos-user-panel[data-theme=paper]{--ornament-position:66.66667% 0.00000%}
.uos-user-panel[data-theme=noir]{--ornament-position:100.00000% 0.00000%}
.uos-user-panel[data-theme=meadow]{--ornament-position:0.00000% 33.33333%}
.uos-user-panel[data-theme=ancient]{--ornament-position:33.33333% 33.33333%}
.uos-user-panel[data-theme=starmap]{--ornament-position:66.66667% 33.33333%}
.uos-user-panel[data-theme=rose]{--ornament-position:100.00000% 33.33333%}
.uos-user-panel[data-theme=wasteland]{--ornament-position:0.00000% 66.66667%}
.uos-user-panel[data-theme=deepsea]{--ornament-position:33.33333% 66.66667%}
.uos-user-panel[data-theme=amber]{--ornament-position:66.66667% 66.66667%}
.uos-user-panel[data-theme=theatre]{--ornament-position:100.00000% 66.66667%}
.uos-user-panel[data-theme=lasttrain]{--ornament-position:0.00000% 100.00000%}
.uos-user-panel[data-theme=aurora]{--ornament-position:33.33333% 100.00000%}
.uos-user-panel[data-theme=glasshouse]{--ornament-position:66.66667% 100.00000%}
.uos-user-panel[data-theme=japan]{--ornament-position:100.00000% 100.00000%}
/* Browse first; edit and inspect details on demand. */
.uos-user-panel .uos-user-settings[hidden]{display:none}
.uos-user-settings-intro{margin:0 0 14px;color:var(--muted);font-size:12px;line-height:1.7}.uos-user-settings-group{margin:16px 0}.uos-user-settings-group>h3{font-size:13px;margin:0 0 8px;color:var(--accent)}.uos-user-settings .uos-user-label-settings{max-height:none;overflow:visible;min-height:0;padding:12px;margin:8px 0}.uos-user-settings .uos-user-label-settings summary{line-height:1.6}.uos-user-settings .uos-user-label-settings>p{font-size:12px;line-height:1.7}.uos-user-settings .uos-user-label-settings>button{margin:10px 6px 0 0}.uos-user-settings-button{border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--text);padding:8px 12px;cursor:pointer;min-height:38px}
.uos-user-settings{margin:0 0 16px;padding:12px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}
.uos-user-results{margin:0 0 12px;color:var(--muted);font-size:12px}
.uos-user-panel .uos-user-description{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.7;padding-right:0}
.uos-user-panel .uos-user-card h3{padding-right:0}
.uos-user-card .uos-user-names{margin:10px 0;font-size:12px}



`;

export async function switchOpeningWithPreset(preset,presetManager,changeOpening){
  let transaction=null;
  try{
    if(preset)transaction=await presetManager.apply(preset);
    await changeOpening();
    return true;
  }catch(error){
    let rollbackMessage='';
    if(transaction)try{await transaction.rollback()}catch(rollbackError){rollbackMessage=`；世界书状态恢复失败：${rollbackError?.message||rollbackError}`}
    throw Error(`${error?.message||error}${rollbackMessage}`);
  }
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
  const detectedSources=[...new Set(names.map(name=>entry.nameEvidence?.[name]).filter(Boolean))];
  return {title,names,titleSource:local.title?.trim()?'玩家填写':author.title?.trim()?'作者填写':'自动提取',namesSource:nameValue===null?(names.length?`自动提取：${detectedSources.join('、')||'文本线索'}`:'未识别'):typeof local.names==='string'?'玩家填写':'作者填写'};
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
  const bodies=all.slice(0,count);
  const people=detectGreetingCollection(bodies,{characterName:data.name||c.name,knownNames:metadata.flatMap(entry=>typeof entry?.names==='string'?parseNames(entry.names):[]),aliases:settings.personAliases||''});
  return {characterId:context.characterId,avatar:c.avatar||data.name||'',swipeId:Number(message.swipe_id)||0,entries:bodies.map((body,i)=>({index:i,body,title:!isLegacyGeneratedEntry(body,metadata[i],i)&&metadata[i]?.title||greetingTitle(body,i,excluded),description:isLegacyGeneratedEntry(body,metadata[i],i)?'':metadata[i]?.description||'',names:people[i].names,nameEvidence:people[i].evidence,nameSuggestions:people[i].suggestions,label:metadata[i]?.label||`OPENING ${String(i+1).padStart(2,'0')}`}))};
}

export function mountPlayerSelector(startDocument=document,helperApi,{backgroundService=null}={}){
  let doc=startDocument,win=doc.defaultView;
  try{for(let i=0;i<8 && win?.parent && win.parent!==win;i++){void win.parent.document;win=win.parent;doc=win.document}}catch{}
  // Script replacement rebinds the helper API even if the same version runs again.
  doc.__uosPlayer?.close?.();
  const host=doc.defaultView||globalThis;
  const helper=helperApi||host.TavernHelper||host;
  const readWorldbookPeople=createWorldbookPeopleReader(()=>[helperApi,startDocument?.defaultView?.TavernHelper,startDocument?.defaultView,host.TavernHelper,host]);
  const worldbookPresetManager=createWorldbookPresetManager(()=>[helperApi,startDocument?.defaultView?.TavernHelper,startDocument?.defaultView,host.TavernHelper,host],()=>{const context=host.SillyTavern?.getContext?.();return context?.characters?.[context.characterId]});
  const style=doc.createElement('style');style.dataset.uosUserStyle='';style.textContent=CSS+defaultCoverStyles('.uos-user-panel')+OPENING_LAYOUT_CSS+OPENING_CATEGORY_CSS+OPENING_ACTION_CSS+OPENING_FAVORITES_CSS+BLIND_BOX_CONTROL_CSS+'\n.uos-user-default-cover{height:120px;margin:0 0 12px;border-radius:10px;background-position:center;background-size:cover;background-color:var(--surface)}.uos-user-panel[data-theme] .uos-user-card::before{position:absolute;float:none;top:22px;left:22px;margin:0;z-index:2;padding:2px 7px;border-radius:5px;background:#111a20b3;color:#fff;opacity:1}';(doc.head||doc.documentElement).append(style);
  let trigger=null,triggerDrag=null,panelSession=null,updating=false;
  const el=(tag,className,text)=>{const node=doc.createElement(tag);node.className=className;if(text!=null)node.textContent=String(text);return node};
  const state=()=>readPlayerState(host.SillyTavern?.getContext?.(),helper);
  const removeTrigger=()=>{triggerDrag?.dispose();triggerDrag=null;trigger?.remove();trigger=null};
  function scan(){
    if(updating)return;updating=true;
    try{
      const snapshot=state(),first=doc.querySelector('#chat .mes[mesid="0"],#chat .mes[data-mesid="0"]');
      if(!snapshot||!first){removeTrigger();closePanel();return}
      if(!trigger){trigger=el('button','uos-user-trigger');trigger.type='button';trigger.style.touchAction='none';
        triggerDrag=createPlayerButtonDrag(trigger);trigger.onclick=event=>{if(!triggerDrag?.suppressClick(event))openPanel()};
      }
      try{trigger.dataset.theme=host.localStorage.getItem('uos_player_theme')||'archive'}catch{}
      const label=`◈ 预览开场 · ${snapshot.swipeId+1}/${snapshot.entries.length}`;
      if(trigger.textContent!==label)trigger.textContent=label;
      if(trigger.dataset.floating!=='true'&&(trigger.nextElementSibling!==first||trigger.parentNode!==first.parentNode)){first.before(trigger);triggerDrag.restore()}
    }finally{updating=false}
  }
  function closePanel(force=false){
    if(force)panelSession?.close();else void panelSession?.requestClose();
  }
  function openPanel(){
    const snapshot=state();if(!snapshot)return;
    const storageKey=labelKey(snapshot);let customLabels={};
    try{const saved=JSON.parse(host.localStorage.getItem(storageKey));if(saved && typeof saved==='object' && !Array.isArray(saved))customLabels=saved}catch{}
    closePanel(true);
    const overlay=el('dialog','uos-user-overlay');
    const session=createPlayerPanelSession(overlay,{
      onDispose:closed=>{if(panelSession===closed)panelSession=null},
      onError:error=>console.warn('[Aliceneko Opening Selector] 弹窗清理失败',error),
    });
    panelSession=session;
    const panel=el('section','uos-user-panel');panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label','预览和选择开场');
    let theme='archive';try{theme=host.localStorage.getItem('uos_player_theme')||theme}catch{}
    panel.dataset.theme=THEMES.some(x=>x[0]===theme)?theme:'archive';
    const background=el('div','uos-user-background');background.setAttribute('aria-hidden','true');panel.style.setProperty('--uos-user-background',THEME_BACKGROUND_IMAGES[panel.dataset.theme]?`url("${THEME_BACKGROUND_IMAGES[panel.dataset.theme]}")`:'none');panel.append(background);const backgroundControl=createThemeBackgroundController(panel,'--uos-user-background',doc.defaultView,{service:backgroundService});void backgroundControl.setTheme(panel.dataset.theme);session.own(()=>backgroundControl.close());
    const head=el('div','uos-user-head'),heading=el('div'),kicker=el('span','uos-user-kicker',THEME_CAPTIONS[panel.dataset.theme]);const headerArt=el('span','uos-user-header-ornament');headerArt.setAttribute('aria-hidden','true');kicker.append(headerArt);heading.append(kicker,el('h2','','选择故事的起点'),el('p','',`共 ${snapshot.entries.length} 个开场 · 预览后选择进入`));
    const close=el('button','uos-user-close','关闭');close.type='button';close.onclick=()=>{void session.requestClose()};const versionBadge=el('small','uos-user-version-badge',`v${VERSION}`);head.append(heading,versionBadge,close);
    const tools=el('div','uos-user-tools');
    const select=el('select','');select.setAttribute('aria-label','选择主题');for(const [id,name] of THEMES){const option=el('option','',name);option.value=id;select.append(option)}select.value=panel.dataset.theme;select.onchange=()=>{panel.dataset.theme=select.value;setBlindBoxTheme(blindTrigger,select.value);void backgroundControl?.setTheme(select.value);kicker.textContent=THEME_CAPTIONS[select.value];kicker.append(headerArt);if(trigger)trigger.dataset.theme=select.value;try{host.localStorage.setItem('uos_player_theme',select.value)}catch{}};const themeControl=el('label','uos-user-theme-control');themeControl.append(el('span','uos-user-theme-label','主题'),select);tools.append(themeControl);
    const list=el('div','uos-user-list'),status=el('p','uos-user-status');
    const settingsLayout=createPlayerSettingsLayout(el);
    const {settings,button:settingsButton}=settingsLayout;
    tools.append(settingsButton);session.own(()=>settingsLayout.close());
    const character=host.SillyTavern?.getContext?.()?.characters?.[snapshot.characterId];
    const authorConfig=(character?.data||character)?.extensions?.[KEY]||{};
    const layoutKey=`uos_player_layout_${snapshot.avatar}`;let layout=authorConfig.layout;
    try{layout=host.localStorage.getItem(layoutKey)||layout}catch{}
    panel.dataset.layout=openingLayout(layout);
    const layoutSelect=el('select');layoutSelect.setAttribute('aria-label','选择版式');
    for(const [id,name] of OPENING_LAYOUTS){const option=el('option','',name);option.value=id;layoutSelect.append(option)}layoutSelect.value=panel.dataset.layout;
    layoutSelect.onchange=()=>{panel.dataset.layout=openingLayout(layoutSelect.value);try{host.localStorage.setItem(layoutKey,panel.dataset.layout)}catch{}};
    const layoutControl=el('label','uos-user-theme-control');layoutControl.append(el('span','uos-user-theme-label','版式'),layoutSelect);tools.insertBefore(layoutControl,settingsButton);
    const authorEntries=Array.isArray(authorConfig.entries)?authorConfig.entries.map((entry,i)=>isLegacyGeneratedEntry(snapshot.entries[i]?.body,entry,i)?{...entry,title:'',description:''}:entry):[];
    let previewItems=[],allDrawItems=[];
    const openingPreview=createOpeningPreview({doc,host,getItems:()=>previewItems,getPalette:()=>panel,onChoose:item=>chooseOpening(item)});session.own(()=>openingPreview.dispose());
    const blindBox=createOpeningBlindBox({doc,host,getItems:()=>previewItems,getAllItems:()=>allDrawItems,avatar:snapshot.avatar,getPalette:()=>panel,
      onRangeChange:result=>{renderCards();if(!result.persisted)status.textContent='浏览器未能保存，抽卡设置暂时只在当前窗口有效。'},
      isActive:()=>{const current=state();return !session.disposed&&panelSession===session&&current?.avatar===snapshot.avatar&&current?.characterId===snapshot.characterId},
      onPreview:(item,trigger,pool)=>{if(!openingPreview.open(item.id,trigger,pool))status.textContent='筛选结果已变化，请重新抽取。'},
      onChoose:item=>chooseOpening(item),
      onUnavailable:()=>{status.textContent='角色或聊天已变化，请重新打开选择器。'},onError:error=>{status.textContent=`进入开场失败：${error?.message||error}`}});
    session.own(()=>blindBox.dispose());
    const blindTrigger=openingBlindBoxButton(el,button=>blindBox.open(button),panel.dataset.theme);
    const blindRangeTrigger=openingBlindRangeButton(el,button=>blindBox.openRange(button));
    const authorExcluded=excludedTags(authorConfig.excludedTags);
    const editKey=labelKey(snapshot).replace('_labels_','_edits_');
    let localEdits={};try{const saved=JSON.parse(host.localStorage.getItem(editKey));if(saved&&typeof saved==='object'&&!Array.isArray(saved))localEdits=saved}catch{}
    const exclusionKey=`uos_player_excluded_${snapshot.avatar}`;
    let localExcluded=[];try{localExcluded=excludedTags(host.localStorage.getItem(exclusionKey))}catch{}
    let playerBaseline=null,markPlayerSaved=()=>{},persistPlayerGroup=()=>false;
    const exclusion=el('details','uos-user-label-settings');exclusion.append(el('summary','','排除标题中的 <字段>'));
    const hint=el('p','','填写标签名，用逗号隔开，例如：状态, 时间, 角色档案。只影响标题提取，不影响人物识别和完整原文。');exclusion.append(hint);
    if(authorExcluded.length)exclusion.append(el('p','',`作者预设：${authorExcluded.join('、')}`));
    const exclusionInput=el('input');exclusionInput.type='text';exclusionInput.value=localExcluded.join(', ');exclusionInput.placeholder='例如：状态, 时间';exclusionInput.setAttribute('aria-label','要排除的尖括号字段');exclusion.append(exclusionInput);
    const saveExclusion=el('button','','保存排除字段');saveExclusion.type='button';saveExclusion.onclick=()=>persistPlayerGroup('exclusion');exclusion.append(saveExclusion);
    const saveAuthor=el('button','','保存到角色卡（作者）');saveAuthor.type='button';saveAuthor.onclick=async()=>{
      const context=host.SillyTavern?.getContext?.(),card=context?.characters?.[snapshot.characterId];
      if(!card?.avatar||typeof context?.getRequestHeaders!=='function'||typeof context?.writeExtensionField!=='function'){status.textContent='当前环境无法写入角色卡。';return}
      saveAuthor.disabled=true;try{
        const data=card.data||card,original=data.extensions?.[KEY]||{};
        const next={...original,excludedTags:excludedTags(exclusionInput.value).join(',')};
        const response=await host.fetch('/api/characters/merge-attributes',{method:'POST',headers:context.getRequestHeaders(),body:JSON.stringify({avatar:card.avatar,data:{extensions:{[KEY]:next}}})});
        if(!response.ok)throw Error(`HTTP ${response.status}`);
        await context.writeExtensionField(snapshot.characterId,KEY,next);
        authorExcluded.splice(0,authorExcluded.length,...excludedTags(next.excludedTags));markPlayerSaved('exclusion');renderCards();status.textContent='已写入角色卡，请从酒馆重新导出后分享。';
      }catch(error){status.textContent=`保存到角色卡失败：${error?.message||error}`}finally{saveAuthor.disabled=false}
    };exclusion.append(saveAuthor);status.setAttribute('role','status');
    const personKey=`uos_player_person_rules_${snapshot.avatar}`;
    let localPersonRules={};try{const saved=JSON.parse(host.localStorage.getItem(personKey));if(saved&&typeof saved==='object'&&!Array.isArray(saved))localPersonRules=saved}catch{}
    const personSettings=el('details','uos-user-label-settings');personSettings.append(el('summary','','人物识别规则'));
    let worldbookPeople=[];
    const worldbookList=el('ul');
    const worldbookStatus=el('p','','正在读取角色世界书人物名单…'),reloadWorldbook=el('button','','重新读取世界书');reloadWorldbook.type='button';personSettings.append(worldbookStatus,worldbookList,reloadWorldbook);
    personSettings.append(el('p','','每行填写一人及其别名，例如：沈挽昼=挽昼,小沈。仅读取角色绑定的世界书；明确姓名参与全文匹配（包含所有标签），普通触发关键词需手动确认，缺少明确姓名证据的标题、台词署名和人物标签先列为候选。'));
    const aliasLabel=el('label');aliasLabel.append(el('span','','人物与别名'));
    const conflictNote=el('p');personSettings.append(conflictNote);
    const aliasInput=el('textarea');aliasInput.maxLength=1500;aliasInput.value=localPersonRules.personAliases??authorConfig.personAliases??'';aliasInput.placeholder='沈挽昼=挽昼,小沈';aliasLabel.append(aliasInput);personSettings.append(aliasLabel);
    if(authorConfig.personAliases)personSettings.append(el('p','',`作者预设：${authorConfig.personAliases}`));
    function updatePeople(){
      const conflicts=personAliases([authorConfig.personAliases,localPersonRules.personAliases].filter(Boolean).join(';')).conflicts;conflictNote.textContent=conflicts.length?`重复别名未参与匹配：${conflicts.join('、')}。请只保留一个归属。`:'';
      const known=[...authorEntries.flatMap(entry=>typeof entry?.names==='string'?parseNames(entry.names):[]),...Object.values(localEdits).flatMap(entry=>typeof entry?.names==='string'?parseNames(entry.names):[])];
      const detected=detectGreetingCollection(snapshot.entries.map(entry=>entry.body),{characterName:character?.data?.name||character?.name,knownNames:known,aliases:[authorConfig.personAliases,localPersonRules.personAliases].filter(Boolean).join(';'),worldbookPeople});
      snapshot.entries.forEach((entry,i)=>{entry.names=detected[i].names;entry.nameEvidence=detected[i].evidence;entry.nameSuggestions=detected[i].suggestions});
      for(const {entry,namesInput,candidates} of editFields){namesInput.placeholder=entry.names.join('、')||'未识别，可填写姓名';candidates.replaceChildren();if(entry.nameSuggestions.length){candidates.append(el('span','','待确认：'));for(const name of entry.nameSuggestions){const button=el('button','',name);button.type='button';button.onclick=()=>{namesInput.value=[...new Set([...parseNames(namesInput.value),name])].join('、');status.textContent='已填入候选人物，请保存修正。'};candidates.append(button)}}}
    }
    const saveLocalPeople=el('button','','仅保存到本机');saveLocalPeople.type='button';saveLocalPeople.onclick=()=>persistPlayerGroup('people');personSettings.append(saveLocalPeople);
    const saveCardPeople=el('button','','保存到角色卡（作者）');saveCardPeople.type='button';saveCardPeople.onclick=async()=>{
      const context=host.SillyTavern?.getContext?.(),card=context?.characters?.[snapshot.characterId];
      if(!card?.avatar||typeof context?.getRequestHeaders!=='function'||typeof context?.writeExtensionField!=='function'){status.textContent='当前环境无法写入角色卡。';return}
      saveCardPeople.disabled=true;try{
        const original=(card.data||card).extensions?.[KEY]||{};
        const next={...original,personAliases:aliasInput.value.slice(0,1500)};delete next.excludedPersonTags;
        const response=await host.fetch('/api/characters/merge-attributes',{method:'POST',headers:context.getRequestHeaders(),body:JSON.stringify({avatar:card.avatar,data:{extensions:{[KEY]:next}}})});
        if(!response.ok)throw Error(`HTTP ${response.status}`);
        await context.writeExtensionField(snapshot.characterId,KEY,next);
        authorConfig.personAliases=next.personAliases;localPersonRules={};try{host.localStorage.removeItem(personKey)}catch{}markPlayerSaved('people');updatePeople();renderCards();status.textContent='人物识别规则已写入角色卡；重新导出后即可分享。';
      }catch(error){status.textContent=`保存到角色卡失败：${error?.message||error}`}finally{saveCardPeople.disabled=false}
    };personSettings.append(saveCardPeople);
    const edits=el('details','uos-user-label-settings');edits.append(el('summary','','修正标题和登场人物'));
    const editFields=[];
    for(const entry of snapshot.entries){
      const box=el('div','');box.append(el('strong','',`开场 ${entry.index+1}`));
      const effective=resolveDisplayEntry(entry,authorEntries[entry.index],localEdits[entry.index],[...authorExcluded,...localExcluded]);
      const titleInput=el('input');titleInput.type='text';titleInput.maxLength=100;titleInput.value=localEdits[entry.index]?.title??authorEntries[entry.index]?.title??'';titleInput.placeholder=effective.title;
      const namesInput=el('input');namesInput.type='text';namesInput.maxLength=200;const savedNames=localEdits[entry.index]?.names??authorEntries[entry.index]?.names;namesInput.value=savedNames===''?'无':savedNames??'';namesInput.placeholder=entry.names.join('、')||'未识别，可填写姓名';
      const titleField=el('label');titleField.append(el('span','','标题（留空使用自动提取）'),titleInput);
      const namesField=el('label');namesField.append(el('span','','人物（逗号分隔；输入“无”可隐藏误判）'),namesInput);
      const candidates=el('div','uos-user-candidates');box.append(titleField,namesField,candidates);edits.append(box);editFields.push({entry,titleInput,namesInput,candidates});
    }
    const collectEdits=()=>Object.fromEntries(editFields.map(({entry,titleInput,namesInput})=>{
      const names=namesInput.value.trim();return [entry.index,{title:titleInput.value.trim().slice(0,100),...(names?{names:names==='无'?'':names.slice(0,200)}:{})}];
    }));
    const saveEdits=el('button','','仅保存到本机');saveEdits.type='button';saveEdits.onclick=()=>persistPlayerGroup('edits');edits.append(saveEdits);
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
        authorEntries.splice(0,authorEntries.length,...next.entries);localEdits={};try{host.localStorage.removeItem(editKey)}catch{}markPlayerSaved('edits');updatePeople();renderCards();status.textContent='修正已写入角色卡；重新导出后即可分享。';
      }catch(error){status.textContent=`保存到角色卡失败：${error?.message||error}`}finally{saveCardEdits.disabled=false}
    };edits.append(saveCardEdits);
    const labelSettings=el('details','uos-user-label-settings');labelSettings.append(el('summary','','自定义开场标签（仅保存在本机）'));
    const labelInputs=[],labelTexts=[];
    for(const entry of snapshot.entries){const field=el('label');field.append(el('span','',`第 ${entry.index+1} 条开场`));
      const input=el('input');input.type='text';input.maxLength=60;input.value=typeof customLabels[entry.index]==='string'?customLabels[entry.index]:entry.label;
      input.setAttribute('aria-label',`第 ${entry.index+1} 条开场标签`);field.append(input);labelInputs.push(input);labelSettings.append(field)}
    const saveLabels=el('button','','保存标签');saveLabels.type='button';saveLabels.onclick=()=>persistPlayerGroup('labels');labelSettings.append(saveLabels);
    const updateSettings=el('details','uos-user-label-settings uos-user-update-settings');updateSettings.append(el('summary','','版本与更新'));
    const updateVersion=el('p','uos-user-status',`当前版本 v${VERSION}`);
    const autoCheckRow=el('label','uos-user-update-auto'),autoCheckInput=el('input');autoCheckInput.type='checkbox';autoCheckRow.append(autoCheckInput,el('span','','启动时自动检查更新'));
    const updateHint=el('p','uos-user-status','启动时检查新版本；也可以随时手动检查。');
    const updateButton=el('button','uos-user-update','检查更新');updateButton.type='button';updateSettings.append(updateVersion,autoCheckRow,updateHint,updateButton);
    const readPlayerDraft=()=>({exclusion:exclusionInput.value,people:aliasInput.value,edits:editFields.map(({titleInput,namesInput})=>[titleInput.value,namesInput.value]),labels:labelInputs.map(input=>input.value)});
    playerBaseline=readPlayerDraft();
    markPlayerSaved=group=>{if(playerBaseline)playerBaseline[group]=readPlayerDraft()[group]};
    persistPlayerGroup=group=>{
      try{
        if(group==='exclusion'){const next=excludedTags(exclusionInput.value);host.localStorage.setItem(exclusionKey,next.join(','));localExcluded=next;renderCards();status.textContent='排除字段已保存在本机。'}
        else if(group==='people'){const next={personAliases:aliasInput.value.slice(0,1500)};host.localStorage.setItem(personKey,JSON.stringify(next));localPersonRules=next;updatePeople();renderCards();status.textContent='人物识别规则已保存在本机。'}
        else if(group==='edits'){const next=collectEdits();host.localStorage.setItem(editKey,JSON.stringify(next));localEdits=next;updatePeople();renderCards();status.textContent='修正已保存在本机。'}
        else if(group==='labels'){const next={};for(const entry of snapshot.entries){const value=labelInputs[entry.index].value.trim().slice(0,60);if(value&&value!==entry.label)next[entry.index]=value}if(Object.keys(next).length)host.localStorage.setItem(storageKey,JSON.stringify(next));else host.localStorage.removeItem(storageKey);customLabels=next;renderCards();status.textContent='标签已保存在本机。'}
        else return false;
        markPlayerSaved(group);return true;
      }catch(error){status.textContent=`本机保存失败：${error?.message||error}`;return false}
    };
    const saveLocalDraft=groups=>{for(const group of groups)if(!persistPlayerGroup(group))return false;return true};
    const saveCardDraft=async groups=>{
      const cardGroups=groups.filter(group=>['exclusion','people','edits'].includes(group));
      if(cardGroups.length){
        const context=host.SillyTavern?.getContext?.(),card=context?.characters?.[snapshot.characterId];
        if(!card?.avatar||card.avatar!==snapshot.avatar||typeof context?.getRequestHeaders!=='function'||typeof context?.writeExtensionField!=='function'){status.textContent='当前环境无法写入角色卡。';return false}
        try{
          const original=(card.data||card).extensions?.[KEY]||{},next={...original};
          if(cardGroups.includes('exclusion'))next.excludedTags=excludedTags(exclusionInput.value).join(',');
          if(cardGroups.includes('people')){next.personAliases=aliasInput.value.slice(0,1500);delete next.excludedPersonTags}
          if(cardGroups.includes('edits')){const values=collectEdits();next.entries=snapshot.entries.map((entry,i)=>{const saved={...(original.entries?.[i]||{})};if(values[i].title)saved.title=values[i].title;else delete saved.title;if(Object.hasOwn(values[i],'names'))saved.names=values[i].names;else delete saved.names;return saved})}
          const response=await host.fetch('/api/characters/merge-attributes',{method:'POST',headers:context.getRequestHeaders(),body:JSON.stringify({avatar:card.avatar,data:{extensions:{[KEY]:next}}})});
          if(!response.ok)throw Error(`HTTP ${response.status}`);
          await context.writeExtensionField(snapshot.characterId,KEY,next);
          if(cardGroups.includes('exclusion')){authorExcluded.splice(0,authorExcluded.length,...excludedTags(next.excludedTags));authorConfig.excludedTags=next.excludedTags;markPlayerSaved('exclusion')}
          if(cardGroups.includes('people')){authorConfig.personAliases=next.personAliases;localPersonRules={};try{host.localStorage.removeItem(personKey)}catch{}markPlayerSaved('people')}
          if(cardGroups.includes('edits')){authorEntries.splice(0,authorEntries.length,...next.entries);localEdits={};try{host.localStorage.removeItem(editKey)}catch{}markPlayerSaved('edits')}
          updatePeople();renderCards();status.textContent='已写入角色卡，请从酒馆重新导出后分享。';
        }catch(error){status.textContent=`保存到角色卡失败：${error?.message||error}`;return false}
      }
      if(groups.includes('labels')&&!persistPlayerGroup('labels'))return false;
      return true;
    };
    const search=el('div','uos-user-search'),query=el('input'),person=el('select');query.type='search';query.placeholder='搜索标题、人物或开场正文';query.setAttribute('aria-label','搜索开场');person.setAttribute('aria-label','按人物筛选');search.append(query,person);
    const results=el('p','uos-user-results');results.setAttribute('role','status');
    const categories=createOpeningCategoryFilters({el,onChange:()=>renderCards()});search.append(categories.element);
    const favoritesStore=createOpeningFavorites(host,snapshot.avatar);
    const favoriteUI=createOpeningFavoritesUI({el,store:favoritesStore,onChange:()=>renderCards(),
      isActive:()=>{const current=state();return !session.disposed&&panelSession===session&&current?.avatar===snapshot.avatar&&current?.characterId===snapshot.characterId},
      onUnavailable:()=>{status.textContent='浏览器未能保存，收藏暂时只在当前窗口有效。'}});
    search.append(favoriteUI.element,blindTrigger,blindRangeTrigger);session.own(()=>favoriteUI.dispose());
    const openingGroups=createOpeningGroupRenderer({el,gridClass:'uos-user-list'});
    query.oninput=()=>renderCards();person.onchange=()=>renderCards();
    async function chooseOpening(entry,button){
      const index=entry.index??entry.id,choose=button||{disabled:false};
        let current=state();
        if(!current||current.characterId!==snapshot.characterId||current.avatar!==snapshot.avatar||index>=current.entries.length){status.textContent='角色或聊天已变化，请重新打开选择器。';return}
        choose.disabled=true;
        if(!await confirmPlayerChanges()||session.disposed){choose.disabled=false;return}
        current=state();
        if(!current||current.characterId!==snapshot.characterId||current.avatar!==snapshot.avatar||index>=current.entries.length){status.textContent='角色或聊天已变化，请重新打开选择器。';choose.disabled=false;return}
        status.textContent='正在切换开场…';
        try{
          const presetId=authorEntries[index]?.worldbookPresetId;
          const preset=Array.isArray(authorConfig.worldbookPresets)?authorConfig.worldbookPresets.find(value=>value.id===presetId):null;
          if(preset)status.textContent='正在应用此开场的世界书条目预设…';
          await switchOpeningWithPreset(preset,worldbookPresetManager,async()=>{
            const current=state();if(session.disposed||!current||current.characterId!==snapshot.characterId||current.avatar!==snapshot.avatar)throw Error('角色或聊天已变化，请重新打开选择器');
            await helper.setChatMessages([{message_id:0,swipe_id:index}],{refresh:'all'});
            const after=state();if(after?.swipeId!==index)throw Error('消息页未切换');
          });
          session.close();scan();
        }catch(error){status.textContent=`切换失败：${error?.message||error}`;choose.disabled=false}
    }
    function renderCards(){list.replaceChildren();previewItems=[];const resolved=snapshot.entries.map(entry=>resolveDisplayEntry(entry,authorEntries[entry.index],localEdits[entry.index],[...authorExcluded,...localExcluded]));
      const selected=person.value;person.replaceChildren();const any=el('option','','全部人物');any.value='';person.append(any);
      for(const name of new Set(resolved.flatMap(x=>x.names))){const option=el('option','',name);option.value=name;person.append(option)}person.value=selected;
      const rows=favoriteUI.update(snapshot.entries.map(entry=>({...entry,...resolved[entry.index],...openingMetadata(authorEntries[entry.index]),label:typeof customLabels[entry.index]==='string'&&customLabels[entry.index]?customLabels[entry.index]:entry.label})));categories.update(rows);
      allDrawItems=rows.map(entry=>({...authorEntries[entry.index],...openingMetadata(entry),id:entry.index,index:entry.index,number:entry.index+1,coverIndex:entry.index,title:entry.title,description:entry.description,label:entry.label,names:entry.names,body:entry.body,titleSource:entry.titleSource,suggestions:entry.nameSuggestions,isCurrent:entry.index===snapshot.swipeId}));
      const categoryValues=categories.values(),filtered=rows.filter(row=>(!favoriteUI.onlyFavorites()||row.favorite)&&matchesOpening(row,{query:query.value,person:person.value,...categoryValues})),visible=filtered.length;
      openingGroups.render(filtered,list,(entry,target)=>{const display=entry;
      const card=el('article','uos-user-card');card.dataset.current=String(entry.index===snapshot.swipeId);card.dataset.number=String(entry.index+1).padStart(2,'0');
      const illustration=el('div','uos-user-default-cover');illustration.setAttribute('aria-hidden','true');applyOpeningCover(illustration,authorEntries[entry.index],entry.body,entry.index,host);card.append(illustration);
      const cardBody=el('div','uos-user-card-body');card.append(cardBody);
      const labelText=el('p','uos-user-description',typeof customLabels[entry.index]==='string'&&customLabels[entry.index]?customLabels[entry.index]:entry.label);
      if(entry.description)labelText.append(doc.createTextNode(` · ${entry.description}`));
      labelTexts[entry.index]=labelText;cardBody.append(el('h3','',display.title));if(labelText.textContent)cardBody.append(labelText);
      const tagChips=openingTagChips(el,entry.tags);if(tagChips)cardBody.append(tagChips);
      if(display.names.length){const cast=el('p','uos-user-names');cast.append(el('span','uos-cast-label','人物'));for(const name of display.names.slice(0,3))cast.append(el('span','uos-name-chip',name));if(display.names.length>3)cast.append(el('span','uos-name-chip',`+${display.names.length-3}`));cardBody.append(cast)}
      previewItems.push({...authorEntries[entry.index],...openingMetadata(entry),id:entry.index,number:entry.index+1,coverIndex:entry.index,title:display.title,description:entry.description,label:entry.label,names:display.names,body:entry.body,titleSource:display.titleSource,suggestions:entry.nameSuggestions,isCurrent:entry.index===snapshot.swipeId});
      const previewButton=el('button','uos-user-preview-button','预览完整正文');previewButton.type='button';decorateOpeningPreviewButton(previewButton,el);previewButton.onclick=()=>openingPreview.open(entry.index,previewButton);const cardActions=el('div','uos-card-actions uos-user-card-actions');cardActions.append(previewButton,favoriteUI.button(entry));card.append(cardActions);
      const choose=el('button','uos-user-select',entry.index===snapshot.swipeId?'当前开场':`进入开场 ${entry.index+1}`);choose.type='button';choose.disabled=entry.index===snapshot.swipeId;
      choose.onclick=()=>chooseOpening(entry,choose);
      card.append(choose);target.append(card);
    },rows);updateBlindBoxButton(blindTrigger,blindBox.poolItems(),{theme:panel.dataset.theme,manual:blindBox.rangeMode()==='manual'});blindRangeTrigger.textContent=blindBox.rangeSummary();results.textContent=favoriteUI.onlyFavorites()||query.value.trim()||person.value||categoryValues.group!==null||categoryValues.tag?`找到 ${visible} / ${snapshot.entries.length} 个开场`:`${snapshot.entries.length} 个开场`;if(!visible)list.append(el('p','uos-user-empty',favoriteUI.onlyFavorites()?'没有匹配的收藏开场；关闭「只看收藏」，点击卡片旁的 ☆ 添加收藏。':'没有匹配的开场，请调整关键词或筛选条件。'))}
    updatePeople();
    renderCards();
    const mark=el('p','uos-user-watermark',WATERMARK),footerVersion=el('span','uos-user-version',`v${VERSION}`);mark.append(footerVersion);
    const stopUpdateControl=bindUpdateControl(updateButton,doc,{versionElements:[versionBadge,footerVersion],autoCheckInput,autoCheckHint:updateHint});session.own(stopUpdateControl);
    settingsLayout.assemble({exclusion,people:personSettings,edits,labels:labelSettings,updates:updateSettings});
    panel.append(head,tools,settings,search,results,list,status,mark);
    overlay.append(panel);(doc.body||doc.documentElement).append(overlay);
    const active=overlay;
    const restorePlayerDraft=()=>{
      if(!playerBaseline)return;
      exclusionInput.value=playerBaseline.exclusion;aliasInput.value=playerBaseline.people;
      editFields.forEach(({titleInput,namesInput},i)=>{titleInput.value=playerBaseline.edits[i]?.[0]||'';namesInput.value=playerBaseline.edits[i]?.[1]||''});
      labelInputs.forEach((input,i)=>{input.value=playerBaseline.labels[i]??''});
      updatePeople();renderCards();
    };
    const playerDraftGuard=createPlayerDraftGuard({
      getGroups:()=>unsavedPlayerGroups(playerBaseline,readPlayerDraft()),
      prompt:(groups,canSave,signal)=>showPlayerUnsavedPrompt(doc,active,panel,groups,canSave,{signal}),
      restore:restorePlayerDraft,saveCard:saveCardDraft,saveLocal:saveLocalDraft,
      isActive:()=>panelSession===session&&!session.disposed,status:message=>{status.textContent=message},
    });
    session.setGuard(playerDraftGuard);
    const confirmPlayerChanges=()=>session.prepareForUpdate();
    async function refreshWorldbook(refresh=false){
      reloadWorldbook.disabled=true;worldbookStatus.textContent='正在读取角色世界书人物名单…';
      try{const result=await readWorldbookPeople(character,{refresh});const current=host.SillyTavern?.getContext?.();
        if(panelSession!==session||session.disposed||current?.characterId!==snapshot.characterId||current?.characters?.[current.characterId]?.avatar!==character?.avatar)return;
        worldbookPeople=result.people;renderWorldbookPeopleList(doc,worldbookList,worldbookPeople,result.diagnostics);worldbookStatus.textContent=formatWorldbookPeopleStatus(result);updatePeople();renderCards();
      }catch{if(panelSession===session&&!session.disposed)worldbookStatus.textContent='世界书读取失败，继续识别正文中的明确姓名；可重新读取。'}finally{reloadWorldbook.disabled=false}
    }
    reloadWorldbook.onclick=()=>refreshWorldbook(true);void refreshWorldbook();
    try{session.show(close)}catch(error){console.warn('[Aliceneko Opening Selector] 弹窗无法打开',error)}
  }
  const observer=new host.MutationObserver(scan);
  if(doc.body)observer.observe(doc.body,{childList:true,subtree:true});
  const timer=host.setInterval(scan,1500);scan();
  const runnerWindow=startDocument.defaultView;
  const onPageHide=()=>{if(doc.__uosPlayer===api)api.close()};
  const api={version:VERSION,scan,prepareForUpdate:async()=>panelSession?panelSession.prepareForUpdate():true,close:()=>{observer.disconnect();host.clearInterval(timer);runnerWindow?.removeEventListener?.('pagehide',onPageHide);closePanel(true);removeTrigger();style.remove();if(doc.__uosPlayer===api)delete doc.__uosPlayer}};
  doc.__uosPlayer=api;
  // Tavern Helper runs this script in its own iframe; saving/replacing it closes that frame.
  if(runnerWindow!==host)runnerWindow?.addEventListener?.('pagehide',onPageHide,{once:true});
  return api;
}
