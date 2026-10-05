// src/version.js
var RUNTIME_VERSION = true ? "1.0.16-beta.4" : "development";

// src/themes.js
var THEMES = Object.freeze([["archive", "旧档案"], ["neon", "霓虹夜"], ["paper", "纸与墨"], ["noir", "黑白电影"], ["meadow", "林间信"], ["ancient", "锦书古风"], ["starmap", "星海航图"], ["rose", "绯色契约"], ["wasteland", "末日警报"], ["deepsea", "深海回响"], ["amber", "琥珀沙海"], ["theatre", "月光剧场"], ["lasttrain", "末班列车"], ["aurora", "极光灯塔"], ["glasshouse", "琉璃花房"], ["japan", "月下神社"], ["school", "放学以后"]].map((theme) => Object.freeze(theme)));
var THEME_IDS = Object.freeze(THEMES.map(([id]) => id));
var THEME_CAPTIONS = Object.freeze({ archive: "ARCHIVE Nº 01 · 故事档案", neon: "AFTER DARK · 霓虹叙事", paper: "THE FIRST PAGE · 纸上初章", noir: "FRAME 001 · 光影序幕", meadow: "LETTERS FROM THE WOODS · 林间来信", ancient: "BROCADE LETTER · 锦书古风", starmap: "CELESTIAL ATLAS · 星海航图", rose: "VELVET VOW · 绯色契约", wasteland: "INCIDENT 001 · 末日警报", deepsea: "DEEP SEA ECHO · 深海回响", amber: "AMBER MIRAGE · 琥珀沙海", theatre: "MOONLIT THEATRE · 月光剧场", lasttrain: "LAST TRAIN HOME · 末班列车", aurora: "LIGHTHOUSE UNDER AURORA · 极光灯塔", glasshouse: "GLASSHOUSE IN BLOOM · 琉璃花房", japan: "MOONLIT SHRINE · 月下神社", school: "AFTER SCHOOL · 放学以后" });
var THEME_DRAWS = Object.freeze({
  archive: ["未封档案", "打开一份未知的故事档案", "封缄开启"],
  neon: ["霓虹解码", "解码一段未知的夜间信号", "信号解码"],
  paper: ["翻页奇遇", "翻开一页尚未读过的故事", "纸页流转"],
  noir: ["随机放映", "让下一帧，揭晓你的故事", "胶片放映"],
  meadow: ["林间来信", "拆开一封来自林间的信", "叶影寄信"],
  ancient: ["锦书抽签", "抽一纸锦书，赴一场相逢", "锦卷舒展"],
  starmap: ["星轨占卜", "让星轨，指引故事的方向", "星图连线"],
  rose: ["绯色邀约", "赴一场尚未揭晓的邀约", "花瓣赴约"],
  wasteland: ["未知坐标", "接收一处未知的生存坐标", "坐标扫描"],
  deepsea: ["潮汐寻声", "听见一段来自深海的回响", "潮汐上涌"],
  amber: ["沙海寻迹", "追随风沙，发现新的故事", "流沙寻迹"],
  theatre: ["今夜开幕", "揭开帷幕，故事即将上演", "月下启幕"],
  lasttrain: ["随机月台", "下一站，会遇见谁", "车窗掠光"],
  aurora: ["灯塔寻光", "循着微光，寻找故事入口", "极光引航"],
  glasshouse: ["花语来笺", "抽一笺花语，赴一场奇遇", "琉璃绽放"],
  japan: ["月下御签", "抽一支御签，听月下缘起", "御签祈愿"],
  school: ["放课后奇遇", "放学后的下一站，会遇见谁", "风起放课后"]
});
function themeDraw(theme) {
  const [title, hint, scene] = THEME_DRAWS[theme] || THEME_DRAWS.archive;
  return { title, hint, scene };
}

// src/asset-source.js
var THEME_ASSET_REF = "444518cc8d97befd6016e7b948066ef23fd4e560";
var SCHOOL_THEME_ASSET_REF = "b11e5addc6e1e60dae710ed4d83cb4c8565b77ea";
var BRAND_ASSET_REF = "64c34a71954308f54f0b648c721dc77f679c6e66";
var DEFAULT_COVER_ASSET_REF = "9f2160b3d289e27390d73b5cea8450cf821b61d1";
var BLIND_BOX_ASSET_REF = "f2af3337a5a02827ce1634f1551ed93b8ef8bde9";
var BLIND_BOX_THEME_ASSET_REF = "8e9d83f98e004db4bcb524046d1760ba11b8bc4b";
function themeAssetRef(path) {
  if (/^assets\/brand\/(?:mascot|welcome|search|theme-mascots)\.webp$/.test(path)) return BRAND_ASSET_REF;
  if (/^assets\/(?:theme-(?:background|icon|ornament)-school|default-covers\/school-[1-5]|blind-box\/card-backs\/school)\.webp$/.test(path)) return SCHOOL_THEME_ASSET_REF;
  if (path.startsWith("assets/default-covers/")) return DEFAULT_COVER_ASSET_REF;
  if (path.startsWith("assets/blind-box/card-backs/")) return BLIND_BOX_THEME_ASSET_REF;
  return THEME_ASSET_REF;
}
function blindBoxAssetCandidates(kind, theme) {
  if (!["entrance", "card-back"].includes(kind)) throw Error("Invalid blind-box artwork");
  if (kind === "card-back" && theme) {
    const id = THEME_IDS.includes(theme) ? theme : "archive", path = `assets/blind-box/card-backs/${id}.webp`;
    return themeAssetCandidates(path);
  }
  const resource = `AliceNekoqqq/Aliceneko-Opening-Selector@${BLIND_BOX_ASSET_REF}/assets/blind-box/${kind}.webp`;
  return [
    `https://cdn.jsdelivr.net/gh/${resource}`,
    `https://testingcf.jsdelivr.net/gh/${resource}`,
    `https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/${BLIND_BOX_ASSET_REF}/assets/blind-box/${kind}.webp`
  ];
}
function themeAssetCandidates(path) {
  if (!/^assets\/[a-z0-9/-]+\.webp$/.test(path)) throw Error("Invalid theme asset path");
  const ref = themeAssetRef(path), resource = `AliceNekoqqq/Aliceneko-Opening-Selector@${ref}/${path}`;
  return [
    `https://cdn.jsdelivr.net/gh/${resource}`,
    `https://testingcf.jsdelivr.net/gh/${resource}`,
    `https://raw.githubusercontent.com/AliceNekoqqq/Aliceneko-Opening-Selector/${ref}/${path}`
  ];
}

// src/theme-backgrounds.js
function themeBackgroundCandidates(theme) {
  return THEME_IDS.includes(theme) ? themeAssetCandidates(`assets/theme-background-${theme}.webp`) : [];
}
var THEME_BACKGROUND_IMAGES = Object.freeze(Object.fromEntries(THEME_IDS.map((id) => [id, themeBackgroundCandidates(id)[0]])));
function createThemeBackgroundService(view, { timeoutMs = 5e3 } = {}) {
  const loaded = /* @__PURE__ */ new Map(), pending = /* @__PURE__ */ new Map();
  let closed = false;
  function probe(url, job) {
    return new Promise((resolve) => {
      let image, timer, settled = false;
      const finish = (ok) => {
        if (settled) return;
        settled = true;
        view.clearTimeout(timer);
        if (image) {
          image.onload = null;
          image.onerror = null;
          if (!ok) try {
            image.src = "";
          } catch {
          }
        }
        job.cancel = null;
        resolve(ok);
      };
      job.cancel = () => finish(false);
      try {
        image = new view.Image();
        image.onload = () => finish(true);
        image.onerror = () => finish(false);
        timer = view.setTimeout(() => finish(false), timeoutMs);
        image.src = url;
      } catch {
        finish(false);
      }
    });
  }
  const api = {
    cached: (theme) => loaded.get(theme),
    load(theme) {
      if (closed) return Promise.resolve(null);
      if (loaded.has(theme)) return Promise.resolve(loaded.get(theme));
      if (pending.has(theme)) return pending.get(theme).task;
      const candidates = themeBackgroundCandidates(theme);
      if (typeof view?.Image !== "function") return Promise.resolve(candidates[0] || null);
      const job = { aborted: false, cancel: null, task: null };
      job.task = (async () => {
        for (const url of candidates) {
          const ok = await probe(url, job);
          if (closed || job.aborted) return null;
          if (ok) {
            loaded.set(theme, url);
            return url;
          }
        }
        return null;
      })().finally(() => {
        if (pending.get(theme) === job) pending.delete(theme);
      });
      pending.set(theme, job);
      return job.task;
    },
    preload() {
      return Promise.allSettled(THEME_IDS.map((theme) => api.load(theme)));
    },
    cancel(theme) {
      const job = pending.get(theme);
      if (job) {
        job.aborted = true;
        job.cancel?.();
      }
    },
    close() {
      if (closed) return;
      closed = true;
      for (const theme of pending.keys()) api.cancel(theme);
      api.onClose?.();
    }
  };
  return api;
}
function createThemeBackgroundController(element, property, view, { timeoutMs = 5e3, service = null } = {}) {
  const ownsService = !service;
  service || (service = createThemeBackgroundService(view, { timeoutMs }));
  let sequence = 0, closed = false, previousTheme = null;
  const write = (url) => element.style.setProperty(property, url ? `url("${url}")` : "none");
  return {
    async setTheme(theme) {
      if (closed) return null;
      const request = ++sequence;
      if (ownsService && previousTheme !== theme) service.cancel(previousTheme);
      previousTheme = theme;
      write(service.cached(theme) || themeBackgroundCandidates(theme)[0]);
      const url = await service.load(theme);
      if (closed || request !== sequence) return null;
      write(url);
      return url;
    },
    close() {
      closed = true;
      ++sequence;
      if (ownsService) service.close();
    }
  };
}

// src/opening-blind-draw.js
function blindBoxPool(items) {
  const seen = /* @__PURE__ */ new Set();
  return items.filter((item) => {
    if (!item || !Number.isInteger(item.id) || !item.body || item.isCurrent || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
function drawOpeningHand(pool, lastId, random = Math.random, count = 3) {
  const candidates = (pool.length > 1 ? pool.filter((item) => item.id !== lastId) : pool).slice(), hand = [];
  const limit = Number(count) === 5 ? 5 : 3;
  while (candidates.length && hand.length < limit) {
    const value = random(), unit = Number.isFinite(value) ? Math.max(0, Math.min(1 - Number.EPSILON, value)) : 0;
    hand.push(candidates.splice(Math.floor(unit * candidates.length), 1)[0]);
  }
  return hand;
}

// src/opening-blind-box-styles.js
var BLIND_BOX_CONTROL_CSS = `
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
:is(.uos,.uos-user-panel) .uos-blind-range-trigger{appearance:none!important;min-height:44px;display:block;flex:none;max-width:100%;overflow-wrap:anywhere;white-space:normal;text-align:left;margin:0 0 0 auto!important;padding:7px 12px!important;border:1px solid var(--line)!important;border-radius:9px!important;background:var(--surface)!important;color:var(--muted)!important;font:600 12px/1.5 system-ui,sans-serif!important;cursor:pointer}:is(.uos,.uos-user-panel) .uos-blind-range-trigger:focus-visible{outline:2px solid var(--accent)!important;outline-offset:2px}
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
var BLIND_BOX_DIALOG_CSS = `
.uos-blind-box{--bg:#19131e;--surface:#2c2231;--text:#f1e7ee;--muted:#baa8b6;--accent:#d8b782;--line:#6c5264;color-scheme:dark;box-sizing:border-box;width:min(540px,calc(100vw - 24px));max-width:calc(100vw - 24px);max-height:90dvh;padding:0!important;margin:auto;border:1px solid var(--line)!important;border-radius:22px!important;background:var(--bg)!important;color:var(--text)!important;box-shadow:0 28px 100px #0008;overflow:auto;font:14px/1.6 system-ui,sans-serif}
.uos-blind-box::backdrop{background:#090711bd;backdrop-filter:blur(8px)}
.uos-blind-box:is([data-theme=paper],[data-theme=school]){color-scheme:light}
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
.uos-blind-deck{position:relative;width:100%;height:280px;z-index:1;--card-width:27%}
.uos-blind-deck:is([data-count="4"],[data-count="5"]){--card-width:16%}
.uos-blind-box .uos-blind-card{position:absolute;left:50%;top:50%;width:var(--card-width)!important;max-width:144px!important;aspect-ratio:3/4;min-height:0!important;padding:0!important;border:0!important;border-radius:12px!important;background:transparent!important;box-shadow:none!important;opacity:1!important;transform:translate(calc(-50% + var(--spread,var(--card)) * 112%),calc(-50% + var(--row,0px))) rotate(calc(var(--card) * 5deg));transition:transform .45s cubic-bezier(.2,.8,.2,1),width .45s,opacity .4s,filter .4s;perspective:1000px;touch-action:manipulation}
.uos-blind-box[data-phase=ready] .uos-blind-card:hover{transform:translate(calc(-50% + var(--spread,var(--card)) * 112%),calc(-50% + var(--row,0px) - 10px)) rotate(calc(var(--card) * 5deg))}
.uos-blind-box .uos-blind-card[data-picked=true]{z-index:3;width:34%!important;max-width:160px!important;transform:translate(-50%,-50%) scale(1.35)}
.uos-blind-box:is([data-phase=flipping],[data-phase=revealed]) .uos-blind-card:not([data-picked=true]){opacity:.12!important;filter:blur(2px);transform:translate(calc(-50% + var(--spread,var(--card)) * 125%),calc(-50% + var(--row,0px) + 16px)) scale(.85)}
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
.uos-blind-box[data-phase=shuffle] .uos-blind-deck[data-count="1"] .uos-blind-card{animation-duration:450ms}
.uos-blind-box[data-phase=revealed] .uos-blind-result{animation:uos-blind-reveal 700ms cubic-bezier(.16,1,.3,1) both}
@keyframes uos-blind-shuffle{0%{transform:translate(calc(-50% + var(--card) * 13%),-50%) rotate(calc(var(--card) * 8deg))}22%{transform:translate(calc(-50% + var(--shuffle-side) * 116%),calc(-50% - 12px)) rotateY(calc(var(--shuffle-side) * 24deg)) rotate(calc(var(--shuffle-side) * 15deg))}48%{transform:translate(calc(-50% - var(--shuffle-side) * 100%),calc(-50% - 16px)) rotateY(calc(var(--shuffle-side) * -22deg)) rotate(calc(var(--shuffle-side) * -15deg))}72%{transform:translate(calc(-50% + var(--card) * 14%),-50%) rotate(calc(var(--card) * 7deg))}100%{transform:translate(calc(-50% + var(--spread,var(--card)) * 112%),calc(-50% + var(--row,0px))) rotate(calc(var(--card) * 5deg))}}
@keyframes uos-blind-reveal{from{opacity:0;transform:perspective(1000px) rotateY(-75deg) scale(.83)}to{opacity:1;transform:perspective(1000px) rotateY(0) scale(1)}}
@media(max-width:480px){.uos-blind-header{padding:14px}.uos-blind-stage{min-height:250px;padding:10px 14px}.uos-blind-deck{height:230px}.uos-blind-result{padding:0 14px 16px}.uos-blind-footer{padding:14px}.uos-blind-title{font-size:21px!important}.uos-blind-actions{grid-template-columns:1fr 1fr}.uos-blind-actions .uos-blind-enter{grid-column:1/-1}}
@media(max-width:480px){.uos-blind-deck:is([data-count="4"],[data-count="5"]){height:320px;--card-width:27%}.uos-blind-deck:is([data-count="4"],[data-count="5"]) .uos-blind-card{--spread:var(--mobile-card);--row:var(--mobile-row)}}
@media(prefers-reduced-motion:reduce){.uos-blind-box *{animation:none!important;transition:none!important}}
`;

// src/default-covers.js
var temporaryCoverSeed;
function defaultCoverSlot(identity, index, host) {
  let seed;
  try {
    const storage = host?.localStorage;
    seed = storage?.getItem("uos_default_cover_seed_v1");
    if (!seed) {
      seed = storage ? String(Math.random()) : temporaryCoverSeed || (temporaryCoverSeed = String(Math.random()));
      storage?.setItem("uos_default_cover_seed_v1", seed);
    }
  } catch {
    seed = temporaryCoverSeed || (temporaryCoverSeed = seed || String(Math.random()));
  }
  seed || (seed = temporaryCoverSeed || (temporaryCoverSeed = String(Math.random())));
  let hash = 2166136261;
  for (const character of `${seed}|${identity}|${index}`) hash = Math.imul(hash ^ character.charCodeAt(0), 16777619);
  return (hash >>> 0) % 5 + 1;
}
function defaultCoverStyles(selector) {
  return THEME_IDS.map((theme) => `${selector}[data-theme="${theme}"]{${Array.from({ length: 5 }, (_, i) => `--uos-default-cover-${i + 1}:url("${themeAssetCandidates(`assets/default-covers/${theme}-${i + 1}.webp`)[0]}")`).join(";")}}`).join("\n");
}

// src/opening-presentation.js
var OPENING_LAYOUTS = [["classic", "原有卡片"], ["gallery", "画廊"], ["catalog", "故事目录"], ["dossier", "档案"]];
function openingLayout(value) {
  return OPENING_LAYOUTS.some(([id]) => id === value) ? value : "classic";
}
function coverPresentation(entry = {}) {
  entry = entry && typeof entry === "object" ? entry : {};
  const point = (value) => typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 50;
  return {
    coverSlot: Number.isInteger(entry.coverSlot) && entry.coverSlot >= 1 && entry.coverSlot <= 5 ? entry.coverSlot : 0,
    coverFocus: { x: point(entry.coverFocus?.x), y: point(entry.coverFocus?.y) }
  };
}
function applyOpeningCover(cover, entry, identity, index, host, { shade = false } = {}) {
  const { coverSlot, coverFocus } = coverPresentation(entry);
  const custom = /^(data:image\/(?:png|jpeg|webp|gif);base64,|https?:\/\/)/i.test(entry?.image || "");
  const image = custom ? `url("${entry.image.replace(/["\\\r\n]/g, "")}")` : `var(--uos-default-cover-${coverSlot || defaultCoverSlot(identity, index, host)})`;
  cover.classList.add("has-image");
  cover.style.backgroundImage = (shade ? "linear-gradient(0deg,#0005,transparent)," : "") + image;
  cover.style.backgroundPosition = `${coverFocus.x}% ${coverFocus.y}%`;
}

// src/blind-box-art.js
function createBlindBoxArt(el, kind, theme) {
  const image = el("img", "uos-blind-art"), sources = blindBoxAssetCandidates(kind, theme);
  let source = 0;
  image.alt = "";
  image.draggable = false;
  image.decoding = "async";
  image.loading = "eager";
  image.setAttribute("aria-hidden", "true");
  image.onload = () => {
    if (image.isConnected === false) return;
    image.dataset.ready = "true";
    if (image.parentElement) image.parentElement.dataset.artReady = "true";
  };
  image.onerror = () => {
    if (image.isConnected === false) return;
    if (++source < sources.length) image.src = sources[source];
    else {
      image.dataset.failed = "true";
      image.onload = image.onerror = null;
    }
  };
  image.src = sources[0];
  return image;
}

// src/opening-favorites.js
function openingFavoriteKeys(bodies) {
  const occurrences = /* @__PURE__ */ new Map();
  return bodies.map((value) => {
    const body = String(value || "");
    if (!body) return null;
    let a = 2166136261, b = 2654435769;
    for (let i = 0; i < body.length; i++) {
      const code = body.charCodeAt(i);
      a = Math.imul(a ^ code, 16777619);
      b = Math.imul(b ^ code, 2246822507);
    }
    const base = (a >>> 0).toString(16).padStart(8, "0") + (b >>> 0).toString(16).padStart(8, "0") + ":" + body.length;
    const occurrence = occurrences.get(base) || 0;
    occurrences.set(base, occurrence + 1);
    return base + ":" + occurrence;
  });
}
var validKey = (key) => typeof key === "string" && /^[0-9a-f]{16}:\d{1,10}:\d{1,10}$/.test(key);
function createOpeningFavorites(host, avatar) {
  const storageKey = avatar ? "uos_favorites_v1_" + encodeURIComponent(String(avatar)) : null;
  let memory = /* @__PURE__ */ new Set(), lastBodies = [], lastKeys = [];
  const pending = /* @__PURE__ */ new Map();
  function snapshot() {
    try {
      const raw = storageKey && host?.localStorage?.getItem(storageKey);
      if (raw != null) {
        const value = JSON.parse(raw);
        memory = new Set(value?.version === 1 && Array.isArray(value.keys) ? value.keys.filter(validKey).slice(0, 5e3) : []);
      }
    } catch {
    }
    for (const [key, selected] of pending) {
      if (selected) memory.add(key);
      else memory.delete(key);
    }
    return new Set(memory);
  }
  return {
    keys(bodies) {
      if (bodies.length !== lastBodies.length || bodies.some((body, i) => body !== lastBodies[i])) {
        lastBodies = bodies.slice();
        lastKeys = openingFavoriteKeys(bodies);
      }
      return lastKeys.slice();
    },
    snapshot,
    toggle(key) {
      if (!validKey(key)) return { selected: false, persisted: false };
      const next = snapshot(), selected = !next.has(key);
      if (selected) next.add(key);
      else next.delete(key);
      memory = next;
      let persisted = false;
      try {
        if (storageKey && host?.localStorage) {
          host.localStorage.setItem(storageKey, JSON.stringify({ version: 1, keys: [...next] }));
          persisted = true;
          pending.clear();
        }
      } catch {
      }
      if (!persisted) pending.set(key, selected);
      return { selected, persisted };
    }
  };
}

// src/opening-blind-range.js
var validKey2 = (key) => typeof key === "string" && /^[0-9a-f]{16}:\d{1,10}:\d{1,10}$/.test(key);
var cleanKeys = (value) => Array.isArray(value) ? [...new Set(value.filter(validKey2))].slice(0, 5e3) : [];
var DRAW_POOL_LIMIT = 30;
var drawPoolName = (value) => typeof value === "string" ? value.trim().slice(0, 40) : "";
function drawRangeLabel(prefs) {
  return prefs.mode === "manual" ? prefs.pools?.find((pool) => pool.id === prefs.activePoolId)?.name || "手动范围" : "当前筛选";
}
function normalizeDrawRange(value) {
  const pools = [], seen = /* @__PURE__ */ new Set();
  for (const pool of Array.isArray(value?.pools) ? value.pools : []) {
    if (typeof pool?.id !== "string" || !/^[a-zA-Z0-9_-]{1,80}$/.test(pool.id) || seen.has(pool.id) || !drawPoolName(pool.name)) continue;
    pools.push({ id: pool.id, name: drawPoolName(pool.name), keys: cleanKeys(pool.keys) });
    seen.add(pool.id);
    if (pools.length === DRAW_POOL_LIMIT) break;
  }
  const keys = cleanKeys(value?.keys), mode = value?.mode === "manual" ? "manual" : "filtered", selected = pools.find((pool) => pool.id === value?.activePoolId);
  const keySet = new Set(keys), matches = selected && selected.keys.length === keys.length && selected.keys.every((key) => keySet.has(key));
  return { mode, keys, handSize: Number(value?.handSize) === 5 ? 5 : 3, performances: value?.performances !== false, pools, activePoolId: mode === "manual" && matches ? selected.id : null };
}
function keyedDrawItems(items) {
  const keys = openingFavoriteKeys(items.map((item) => item.body));
  return items.map((item, i) => ({ ...item, drawKey: keys[i] }));
}
function drawRangePool(all, filtered, prefs) {
  if (prefs.mode !== "manual") return blindBoxPool(filtered);
  const selected = new Set(prefs.keys);
  return blindBoxPool(keyedDrawItems(all).filter((item) => selected.has(item.drawKey)));
}
function createOpeningDrawRange(host, avatar) {
  const key = avatar ? "uos_draw_range_v1_" + encodeURIComponent(avatar) : null;
  let memory = normalizeDrawRange(), temporary = false;
  return {
    read() {
      if (!temporary) try {
        const raw = key && host?.localStorage?.getItem(key);
        if (raw != null) {
          const value = JSON.parse(raw);
          memory = normalizeDrawRange(value?.version === 1 ? value : null);
        }
      } catch {
      }
      return normalizeDrawRange(memory);
    },
    set(value) {
      memory = normalizeDrawRange(value);
      let persisted = false;
      try {
        if (key && host?.localStorage) {
          host.localStorage.setItem(key, JSON.stringify({ version: 1, ...memory }));
          persisted = true;
        }
      } catch {
      }
      temporary = !persisted;
      return { persisted, prefs: this.read() };
    }
  };
}

// src/opening-blind-range-ui.js
var DRAW_RANGE_CSS = `
.uos-blind-range-body{padding:18px 20px;display:grid;gap:12px}
.uos-blind-range-body p{margin:0;color:var(--muted);font-size:12px}
.uos-blind-range-tools{display:flex;flex-wrap:wrap;gap:8px}
.uos-blind-range-body select,.uos-blind-range-body input:is([type=search],[type=text]){appearance:none!important;box-sizing:border-box;width:100%;min-width:0;min-height:44px;margin:0!important;padding:10px 12px!important;border:1px solid var(--line)!important;border-radius:10px!important;background:var(--surface)!important;color:var(--text)!important;font:14px/1.5 system-ui,sans-serif!important}
.uos-blind-range-section{min-width:0;margin:0;padding:14px;border:1px solid var(--line);border-radius:12px;display:grid;gap:10px}
.uos-blind-range-section legend{padding:0 6px;font:700 13px/1.5 system-ui,sans-serif;color:var(--accent)}
.uos-blind-range-field{min-width:0;display:grid;gap:5px;font:600 12px/1.5 system-ui,sans-serif;color:var(--muted)}
.uos-blind-range-experience,.uos-blind-range-pool-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.uos-blind-range-pool-actions button{width:100%!important;padding:9px 8px!important;white-space:normal!important;overflow-wrap:anywhere}
.uos-blind-range-message{min-height:19px;color:var(--accent)!important}
.uos-blind-range-body :is(select,input):focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.uos-blind-range-list{max-height:42dvh;overflow:auto;display:grid;gap:7px;padding:2px}
.uos-blind-range-row{display:flex;align-items:center;gap:11px;min-height:52px;padding:9px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);cursor:pointer}
.uos-blind-range-row:has(input:checked){border-color:var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--surface))}
.uos-blind-range-row input[type=checkbox]{appearance:auto!important;flex:none;width:20px!important;height:20px!important;margin:0!important;accent-color:var(--accent);cursor:pointer}
.uos-blind-range-row span{min-width:0;overflow-wrap:anywhere;font-size:13px}.uos-blind-range-row input:disabled+span{color:var(--muted)}
.uos-blind-box .uos-blind-range-save{width:100%!important;position:sticky;bottom:0;z-index:1;box-shadow:0 -8px 18px var(--bg)!important}.uos-blind-range-count{color:var(--accent)!important}
@media(max-width:380px){.uos-blind-range-body{padding:14px}.uos-blind-range-section{padding:10px}}
`;
function createDrawRangePanel({ doc, el, store, getAllItems, getFilteredItems, getPalette, isActive, onApply, onUnavailable }) {
  let disposed = false, active = null;
  function close() {
    const current = active;
    if (!current) return;
    active = null;
    current.dialog.removeEventListener("keydown", current.onKey);
    if (current.dialog.open) current.dialog.close();
    current.dialog.remove();
    try {
      if (current.trigger?.isConnected) current.trigger.focus();
    } catch {
    }
  }
  function open(trigger) {
    if (disposed || !isActive()) return false;
    close();
    const items = keyedDrawItems(getAllItems()).map((item) => ({ ...item })), prefs = store.read();
    const eligible = items.filter((item) => item.body && !item.isCurrent), filteredIds = new Set(getFilteredItems().map((item) => item.id));
    let keys = new Set(prefs.mode === "manual" || prefs.keys.length ? prefs.keys : eligible.map((item) => item.drawKey)), pools = prefs.pools.map((pool) => ({ ...pool, keys: pool.keys.slice() })), editingId = prefs.activePoolId;
    const dialog = el("dialog", "uos-blind-box uos-blind-range");
    dialog.setAttribute("aria-label", "抽取范围");
    dialog.setAttribute("aria-modal", "true");
    const palette = getPalette(), computed = palette.ownerDocument.defaultView.getComputedStyle(palette);
    dialog.dataset.theme = palette.dataset.theme || "archive";
    for (const key of ["--bg", "--surface", "--text", "--muted", "--accent", "--line"]) dialog.style.setProperty(key, computed.getPropertyValue(key) || computed.getPropertyValue("--panel"));
    const header = el("div", "uos-blind-header"), heading = el("h2", "uos-blind-heading", "卡池与抽卡设置"), exit = el("button", "", "关闭设置");
    exit.type = "button";
    header.append(heading, exit);
    const body = el("div", "uos-blind-range-body"), mode = el("select", "uos-blind-range-mode"), search = el("input", "uos-blind-range-search");
    const section = (title) => {
      const node = el("fieldset", "uos-blind-range-section");
      node.append(el("legend", "", title));
      return node;
    };
    const field = (text, control) => {
      const label = el("label", "uos-blind-range-field");
      label.append(el("span", "", text), control);
      control.setAttribute("aria-label", text);
      return label;
    };
    const experience = section("抽卡体验"), experienceFields = el("div", "uos-blind-range-experience"), hand = el("select", "uos-blind-hand-size"), show = el("select", "uos-blind-show-setting");
    for (const [value, label] of [[3, "三张卡"], [5, "五张卡"]]) {
      const option = el("option", "", label);
      option.value = String(value);
      hand.append(option);
    }
    hand.value = String(prefs.handSize);
    for (const [value, label] of [["theme", "主题专属演出"], ["simple", "简洁卡牌"]]) {
      const option = el("option", "", label);
      option.value = value;
      show.append(option);
    }
    show.value = prefs.performances ? "theme" : "simple";
    experienceFields.append(field("每轮摆出", hand), field("演出效果", show));
    experience.append(experienceFields, el("p", "", "每轮只选一张。候选不足时按实际数量摆出；手机五张卡分两排。"));
    const poolSection = section("命名卡池"), poolSelect = el("select", "uos-blind-pool-select"), name = el("input", "uos-blind-pool-name"), poolActions = el("div", "uos-blind-range-pool-actions");
    name.type = "text";
    name.maxLength = 40;
    name.placeholder = "例如：主线、番外、今晚想看";
    name.value = pools.find((pool) => pool.id === editingId)?.name || "";
    const addPool = el("button", "", "保存为新卡池"), updatePool = el("button", "", "更新卡池内容"), renamePool = el("button", "", "重命名"), deletePool = el("button", "", "删除卡池");
    for (const button of [addPool, updatePool, renamePool, deletePool]) button.type = "button";
    poolActions.append(addPool, updatePool, renamePool, deletePool);
    const message = el("p", "uos-blind-range-message", "卡池保存在本机；关闭设置会放弃本次修改。");
    message.setAttribute("role", "status");
    poolSection.append(field("切换卡池", poolSelect), field("卡池名称", name), poolActions, message);
    const rangeSection = section("抽取范围");
    mode.setAttribute("aria-label", "抽取范围模式");
    for (const [value, label] of [["filtered", "沿用首页当前筛选"], ["manual", "只抽手动勾选的开场"]]) {
      const option = el("option", "", label);
      option.value = value;
      mode.append(option);
    }
    mode.value = prefs.mode;
    search.type = "search";
    search.placeholder = "搜索标题、人物、分组或编号";
    search.setAttribute("aria-label", "搜索抽取范围");
    const tools = el("div", "uos-blind-range-tools"), all = el("button", "", "全部勾选"), none = el("button", "", "全部清空"), filtered = el("button", "", "仅选当前筛选");
    for (const button of [all, none, filtered]) button.type = "button";
    tools.append(all, none, filtered);
    const count = el("p", "uos-blind-range-count"), list = el("div", "uos-blind-range-list"), hint = el("p", "", "点选开场会切换到手动范围，独立于首页筛选；只保存在本机。当前开场与空正文不参与抽取。");
    count.setAttribute("role", "status");
    const save = el("button", "uos-blind-enter uos-blind-range-save", "应用抽卡设置");
    save.type = "button";
    rangeSection.append(mode, hint, search, tools, count, list);
    body.append(experience, poolSection, rangeSection, save);
    dialog.append(header, body);
    let checkboxes = [], renderVersion = 0;
    const session = { dialog, trigger, onKey: null };
    function valid() {
      if (disposed || active !== session) return false;
      if (!isActive()) {
        close();
        onUnavailable();
        return false;
      }
      return true;
    }
    function updateCount() {
      const n = mode.value === "manual" ? eligible.filter((item) => keys.has(item.drawKey)).length : eligible.filter((item) => filteredIds.has(item.id)).length;
      count.textContent = `${mode.value === "manual" ? "手动范围" : "当前筛选"} · ${n} 个可抽取开场${n ? "" : " · 请勾选开场或调整筛选"}`;
    }
    function renderPools() {
      poolSelect.replaceChildren();
      const option = el("option", "", "未使用命名卡池");
      option.value = "";
      poolSelect.append(option);
      for (const pool of pools) {
        const members = new Set(pool.keys), n = eligible.filter((item) => members.has(item.drawKey)).length, option2 = el("option", "", `${pool.name} · ${n} 条`);
        option2.value = pool.id;
        poolSelect.append(option2);
      }
      poolSelect.value = editingId || "";
      for (const button of [updatePool, renamePool, deletePool]) button.disabled = !editingId;
      addPool.disabled = pools.length >= DRAW_POOL_LIMIT;
    }
    function currentKeys() {
      return mode.value === "manual" ? [...keys] : eligible.filter((item) => filteredIds.has(item.id)).map((item) => item.drawKey);
    }
    function validName(exceptId) {
      const value = drawPoolName(name.value);
      if (!value) {
        message.textContent = "请先填写卡池名称。";
        name.focus();
        return null;
      }
      if (pools.some((pool) => pool.id !== exceptId && pool.name === value)) {
        message.textContent = "已有同名卡池，请改名或选择它并更新内容。";
        return null;
      }
      return value;
    }
    function poolMessage(text) {
      message.textContent = text + "；点击底部「应用抽卡设置」生效。";
    }
    poolSelect.onchange = () => {
      if (!valid()) return;
      editingId = poolSelect.value || null;
      const pool = pools.find((pool2) => pool2.id === editingId);
      if (pool) {
        keys = new Set(pool.keys);
        mode.value = "manual";
        name.value = pool.name;
      } else name.value = "";
      renderPools();
      render();
    };
    addPool.onclick = () => {
      if (!valid() || addPool.disabled) return;
      const value = validName();
      if (!value) return;
      let serial = 1;
      while (pools.some((pool) => pool.id === `pool-${serial}`)) serial++;
      editingId = `pool-${serial}`;
      keys = new Set(currentKeys());
      mode.value = "manual";
      pools.push({ id: editingId, name: value, keys: [...keys] });
      name.value = value;
      renderPools();
      render();
      poolMessage("新卡池已暂存");
    };
    updatePool.onclick = () => {
      if (!valid() || updatePool.disabled) return;
      const pool = pools.find((pool2) => pool2.id === editingId);
      if (!pool) return;
      keys = new Set(currentKeys());
      mode.value = "manual";
      pool.keys = [...keys];
      renderPools();
      render();
      poolMessage("卡池内容已暂存");
    };
    renamePool.onclick = () => {
      if (!valid() || renamePool.disabled) return;
      const value = validName(editingId), pool = pools.find((pool2) => pool2.id === editingId);
      if (!value || !pool) return;
      pool.name = value;
      name.value = value;
      renderPools();
      poolMessage("新名称已暂存");
    };
    deletePool.onclick = () => {
      if (!valid() || deletePool.disabled) return;
      pools = pools.filter((pool) => pool.id !== editingId);
      editingId = null;
      name.value = "";
      renderPools();
      poolMessage("删除已暂存，当前勾选范围保留");
    };
    function render() {
      const version = ++renderVersion;
      list.replaceChildren();
      checkboxes = [];
      const query = String(search.value || "").trim().toLocaleLowerCase();
      for (const item of items) {
        const text = `${String(item.number ?? item.id + 1).padStart(2, "0")} · ${item.title || "未命名开场"}${item.group ? " · " + item.group : ""}`;
        if (query && !`${text} ${(item.names || []).join(" ")}`.toLocaleLowerCase().includes(query)) continue;
        const row = el("label", "uos-blind-range-row"), checkbox = el("input");
        checkbox.type = "checkbox";
        checkbox.checked = keys.has(item.drawKey);
        checkbox.disabled = !item.body || Boolean(item.isCurrent);
        checkbox.setAttribute("aria-label", text);
        row.append(checkbox, el("span", "", text + (item.isCurrent ? "（当前开场）" : !item.body ? "（正文为空）" : "")));
        checkbox.onchange = () => {
          if (!valid() || version !== renderVersion || checkbox.disabled) return;
          mode.value = "manual";
          if (checkbox.checked) keys.add(item.drawKey);
          else keys.delete(item.drawKey);
          updateCount();
        };
        checkboxes.push(checkbox);
        list.append(row);
      }
      if (!checkboxes.length) list.append(el("p", "", "没有匹配的开场。"));
      updateCount();
    }
    mode.onchange = () => {
      if (valid()) updateCount();
    };
    search.oninput = () => {
      if (valid()) render();
    };
    function select(next) {
      if (!valid()) return;
      mode.value = "manual";
      keys = new Set(next);
      render();
    }
    all.onclick = () => select(eligible.map((item) => item.drawKey));
    none.onclick = () => select([]);
    filtered.onclick = () => select(eligible.filter((item) => filteredIds.has(item.id)).map((item) => item.drawKey));
    exit.onclick = () => {
      if (active === session) close();
    };
    save.onclick = () => {
      if (!valid()) return;
      const result = store.set({ mode: mode.value, keys: [...keys], handSize: hand.value, performances: show.value === "theme", pools, activePoolId: editingId });
      close();
      onApply(result);
    };
    session.onKey = (event) => {
      if (active !== session) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
        return;
      }
      if (event.key === "Tab") {
        const controls = [exit, hand, show, poolSelect, name, addPool, updatePool, renamePool, deletePool, mode, search, all, none, filtered, ...checkboxes, save].filter((node) => !node.disabled), first = controls[0], last = controls.at(-1);
        if (event.shiftKey && doc.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && doc.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    active = session;
    dialog.addEventListener("keydown", session.onKey);
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      if (active === session) close();
    });
    dialog.addEventListener("close", () => {
      if (active === session) close();
    });
    renderPools();
    render();
    doc.body.append(dialog);
    try {
      dialog.showModal();
    } catch {
      dialog.setAttribute("open", "");
      dialog.setAttribute("role", "dialog");
    }
    exit.focus();
    return true;
  }
  return { open, close, dispose() {
    if (disposed) return;
    disposed = true;
    close();
  } };
}

// src/opening-blind-performance.js
function createBlindPerformance(el, theme, enabled) {
  const id = THEME_IDS.includes(theme) ? theme : "archive", scene = el("div", "uos-blind-performance");
  scene.dataset.theme = id;
  scene.hidden = !enabled;
  scene.setAttribute("aria-hidden", "true");
  for (let i = 0; i < 8; i++) {
    const piece = el("span", "uos-blind-performance-piece");
    piece.style.setProperty("--piece", i);
    scene.append(piece);
  }
  scene.append(el("span", "uos-blind-performance-caption", themeDraw(id).scene));
  return scene;
}
var BLIND_PERFORMANCE_CSS = `
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

// src/opening-blind-box.js
function openingBlindBoxButton(el, onOpen, theme = "archive") {
  const button = el("button", "uos-blind-trigger");
  button.type = "button";
  button.setAttribute("aria-label", "命运盲盒");
  const art = el("span", "uos-blind-trigger-art"), symbol = el("span", "uos-blind-trigger-symbol", "✦");
  art.setAttribute("aria-hidden", "true");
  art.append(symbol);
  const copy = el("span", "uos-blind-trigger-copy");
  copy.append(el("strong", "uos-blind-trigger-title", "命运盲盒"), el("small", "uos-blind-trigger-hint", "让命运，为你挑一个故事"));
  const action = el("span", "uos-blind-trigger-action"), count = el("span", "uos-blind-trigger-count", "开始抽取"), arrow = el("span", "uos-blind-trigger-arrow", "↗");
  arrow.setAttribute("aria-hidden", "true");
  action.append(count, arrow);
  button.append(art, copy, action);
  button.__uosBlindCount = count;
  button.__uosBlindTheme = { el, art, title: copy.children[0], hint: copy.children[1] };
  setBlindBoxTheme(button, theme);
  if (onOpen) button.onclick = () => onOpen(button);
  else button.disabled = true;
  return button;
}
function setBlindBoxTheme(button, theme) {
  const state = button.__uosBlindTheme;
  if (!state || state.theme === theme) return;
  state.theme = theme;
  const draw = themeDraw(theme);
  state.title.textContent = draw.title;
  state.hint.textContent = draw.hint;
  button.setAttribute("aria-label", `${draw.title}（命运盲盒）`);
  state.art.replaceChildren();
  const symbol = state.el("span", "uos-blind-trigger-symbol", "✦");
  state.art.dataset.artReady = "false";
  state.art.append(symbol);
  for (let i = -1; i <= 1; i++) {
    const image = createBlindBoxArt(state.el, "card-back", theme);
    image.style.setProperty("--fan", i);
    state.art.append(image);
  }
}
function openingBlindRangeButton(el, onOpen) {
  const button = el("button", "uos-blind-range-trigger", "⚙ 卡池与抽卡设置");
  button.type = "button";
  button.setAttribute("aria-label", "设置抽取范围");
  if (onOpen) button.onclick = () => onOpen(button);
  else button.disabled = true;
  return button;
}
function updateBlindBoxButton(button, items, { readonly = false, theme, manual = false } = {}) {
  if (theme) setBlindBoxTheme(button, theme);
  const count = blindBoxPool(items).length;
  button.__uosBlindCount.textContent = count ? `${count} 个开场` : "暂无候选";
  button.disabled = readonly || count === 0;
  button.setAttribute("title", count ? `从${manual ? "手动勾选范围" : "当前筛选结果"}的 ${count} 个开场中随机抽取，确认进入后才切换` : "没有可抽取的新开场，可点击「抽取范围」重新勾选");
  button.dataset.scope = manual ? "manual" : "filtered";
}
function createOpeningBlindBox({ doc, host = doc.defaultView, getItems, getAllItems = getItems, getPalette, avatar, isActive = () => true, onPreview, onChoose, onRangeChange = () => {
}, onUnavailable = () => {
}, onError = () => {
}, random = Math.random }) {
  let disposed = false, active = null, lastId = null, choosing = false;
  const store = createOpeningDrawRange(host, avatar), clock = host || globalThis, style = doc.createElement("style");
  style.dataset.uosBlindStyle = "";
  style.textContent = BLIND_BOX_DIALOG_CSS + BLIND_PERFORMANCE_CSS + DRAW_RANGE_CSS + defaultCoverStyles(".uos-blind-box");
  (doc.head || doc.documentElement).append(style);
  const el = (tag, cls = "", text) => {
    const node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = String(text);
    return node;
  };
  const rangePanel = createDrawRangePanel({ doc, el, store, getAllItems, getFilteredItems: getItems, getPalette, isActive, onUnavailable, onApply: (result) => onRangeChange(result) });
  const poolItems = () => drawRangePool(getAllItems(), getItems(), store.read());
  function close() {
    rangePanel.close();
    const current = active;
    if (!current) return;
    active = null;
    for (const timer of current.timers) clock.clearTimeout(timer);
    current.timers.clear();
    current.dialog.removeEventListener("keydown", current.onKey);
    if (current.dialog.open) current.dialog.close();
    current.dialog.remove();
    try {
      if (current.trigger?.isConnected) current.trigger.focus();
    } catch {
    }
  }
  function open(trigger) {
    if (disposed || choosing || !isActive()) return false;
    const prefs = store.read(), pool = drawRangePool(getAllItems(), getItems(), prefs).map((item) => ({ ...item }));
    if (!pool.length) return false;
    rangePanel.close();
    close();
    const dialog = el("dialog", "uos-blind-box");
    dialog.setAttribute("aria-label", "命运盲盒");
    dialog.setAttribute("aria-modal", "true");
    const palette = getPalette(), computed = palette.ownerDocument.defaultView.getComputedStyle(palette);
    dialog.dataset.theme = palette.dataset.theme || "archive";
    const draw = themeDraw(dialog.dataset.theme);
    dialog.setAttribute("aria-label", `${draw.title}（命运盲盒）`);
    for (const key of ["--bg", "--surface", "--text", "--muted", "--accent", "--line"]) dialog.style.setProperty(key, computed.getPropertyValue(key) || computed.getPropertyValue("--panel"));
    const header = el("div", "uos-blind-header"), heading = el("div"), exit = el("button", "", "关闭盲盒");
    exit.type = "button";
    exit.onclick = () => {
      if (active?.dialog === dialog) close();
    };
    heading.append(el("p", "uos-blind-kicker", "随机故事 · 命运盲盒"), el("h2", "uos-blind-heading", draw.title));
    header.append(heading, exit);
    const stage = el("div", "uos-blind-stage"), deck = el("div", "uos-blind-deck"), result = el("div", "uos-blind-result");
    dialog.dataset.show = prefs.performances && !reducedMotion() ? "on" : "off";
    stage.append(createBlindPerformance(el, dialog.dataset.theme, dialog.dataset.show === "on"), deck);
    const status = el("p", "uos-blind-status");
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    const footer = el("div", "uos-blind-footer"), scope = el("p", "uos-blind-scope", `${drawRangeLabel(prefs)} · ${pool.length} 个候选开场${pool.length > 1 ? " · 重抽不连续重复" : ""}`), actions = el("div", "uos-blind-actions");
    const reroll = el("button", "", "再抽一次"), preview = el("button", "", "预览正文"), choose = el("button", "uos-blind-enter", "进入此开场");
    for (const button of [reroll, preview, choose]) button.type = "button";
    actions.append(reroll, preview, choose);
    footer.append(scope, actions);
    dialog.append(header, stage, result, status, footer);
    const session = { dialog, trigger, timers: /* @__PURE__ */ new Set(), onKey: null };
    let selected = null, busy = false, round = 0, cards = [];
    function valid() {
      if (disposed || active !== session) return false;
      if (!isActive()) {
        close();
        onUnavailable();
        return false;
      }
      return true;
    }
    function later(fn, delay) {
      const token = round, timer = clock.setTimeout(() => {
        session.timers.delete(timer);
        if (valid() && token === round) fn();
      }, delay);
      session.timers.add(timer);
    }
    function reducedMotion() {
      try {
        return Boolean(clock.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
      } catch {
        return false;
      }
    }
    function reveal(item) {
      selected = item;
      lastId = item.id;
      busy = false;
      result.replaceChildren();
      result.append(el("h3", "uos-blind-title", item.title), el("p", "uos-blind-number", `开场 ${String(item.number ?? item.id + 1).padStart(2, "0")}${item.label ? " · " + item.label : ""}`), el("p", "uos-blind-description", item.description || "这段故事，等待你亲自揭晓。"));
      result.hidden = false;
      dialog.dataset.phase = "revealed";
      status.textContent = "命运已揭晓，故事由你决定。";
      reroll.disabled = pool.length < 2;
      preview.disabled = false;
      choose.disabled = false;
      if (doc.activeElement === reroll || doc.activeElement === dialog || cards.includes(doc.activeElement)) preview.focus();
    }
    function pick(card, item, token) {
      if (!valid() || token !== round || dialog.dataset.phase !== "ready" || card.disabled) return;
      busy = true;
      dialog.dataset.phase = "flipping";
      deck.setAttribute("aria-hidden", "true");
      cards.forEach((node) => node.disabled = true);
      reroll.disabled = true;
      status.textContent = "你选中的卡，正在揭晓…";
      card.dataset.picked = "true";
      card.setAttribute("aria-pressed", "true");
      const face = card.children[0].children[1], cover = el("div", "uos-blind-cover");
      applyOpeningCover(cover, item, item.body, item.coverIndex ?? item.id, host);
      face.append(cover, el("span", "uos-blind-face-title", item.title));
      const flip = () => card.dataset.opened = "true";
      if (reducedMotion()) {
        flip();
        reveal(item);
        return;
      }
      later(flip, 260);
      later(() => reveal(item), 1180);
    }
    function roll() {
      if (!valid() || busy) return;
      round++;
      const token = round;
      busy = true;
      selected = null;
      result.hidden = true;
      result.replaceChildren();
      deck.replaceChildren();
      deck.setAttribute("aria-hidden", "true");
      dialog.dataset.phase = "shuffle";
      reroll.disabled = preview.disabled = choose.disabled = true;
      const hand = drawOpeningHand(pool, lastId, random, prefs.handSize);
      deck.dataset.count = String(hand.length);
      cards = hand.map((item, i) => {
        const card = el("button", "uos-blind-card"), turn = el("span", "uos-blind-turn"), back = el("span", "uos-blind-back"), face = el("span", "uos-blind-face");
        card.type = "button";
        card.disabled = true;
        card.style.setProperty("--card", i - (hand.length - 1) / 2);
        card.style.setProperty("--shuffle-side", i % 2 ? 1 : -1);
        card.style.setProperty("--shuffle-delay", `${i * 35}ms`);
        card.setAttribute("aria-label", `抽取第 ${i + 1} 张卡`);
        card.setAttribute("aria-pressed", "false");
        const firstRow = Math.ceil(hand.length / 2), row = i < firstRow ? 0 : 1;
        card.style.setProperty("--mobile-card", row === 0 ? i - (firstRow - 1) / 2 : i - firstRow - (hand.length - firstRow - 1) / 2);
        card.style.setProperty("--mobile-row", row === 0 ? "-60px" : "60px");
        turn.setAttribute("aria-hidden", "true");
        back.append(createBlindBoxArt(el, "card-back", dialog.dataset.theme), el("span", "uos-blind-symbol", "✦"));
        turn.append(back, face);
        card.append(turn);
        card.onclick = () => pick(card, item, token);
        deck.append(card);
        return card;
      });
      status.textContent = `正在洗 ${hand.length} 张卡，请稍候…`;
      const ready = () => {
        busy = false;
        dialog.dataset.phase = "ready";
        deck.setAttribute("aria-hidden", "false");
        cards.forEach((card) => card.disabled = false);
        reroll.disabled = pool.length < 2;
        status.textContent = hand.length === 1 ? "只有一张候选卡，点击翻开。" : `选择一张卡，翻开你的故事。${hand.length < prefs.handSize && lastId !== null ? " 上次结果已避开。" : ""}`;
        if (doc.activeElement === reroll) cards[0].focus();
      };
      if (reducedMotion()) {
        ready();
        return;
      }
      later(ready, hand.length === 1 ? 500 : hand.length > 3 ? 1900 : 1800);
    }
    reroll.onclick = () => {
      if (!reroll.disabled) roll();
    };
    preview.onclick = () => {
      if (!valid() || busy || !selected || preview.disabled) return;
      const item = selected;
      close();
      onPreview(item, trigger, pool);
    };
    choose.onclick = () => {
      if (!valid() || busy || !selected || choose.disabled) return;
      const item = selected;
      choosing = true;
      close();
      try {
        Promise.resolve(onChoose(item)).catch((error) => {
          if (!disposed && isActive()) onError(error);
        }).finally(() => {
          choosing = false;
        });
      } catch (error) {
        choosing = false;
        if (!disposed && isActive()) onError(error);
      }
    };
    session.onKey = (event) => {
      if (disposed || active !== session) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
        return;
      }
      if (event.key === "Tab") {
        const controls = [exit, ...cards, reroll, preview, choose].filter((button) => !button.disabled), first = controls[0], last = controls.at(-1);
        if (event.shiftKey && doc.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && doc.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    active = session;
    dialog.addEventListener("keydown", session.onKey);
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      if (active === session) close();
    });
    dialog.addEventListener("close", () => {
      if (active === session) close();
    });
    dialog.addEventListener("click", (event) => {
      if (active === session && event.target === dialog) close();
    });
    doc.body.append(dialog);
    try {
      dialog.showModal();
    } catch {
      dialog.setAttribute("open", "");
      dialog.setAttribute("role", "dialog");
    }
    exit.focus();
    roll();
    return true;
  }
  return { open, close, poolItems, rangeMode: () => store.read().mode, rangeSummary() {
    const prefs = store.read();
    return `⚙ 卡池与抽卡 · ${drawRangeLabel(prefs)} · ${prefs.handSize === 5 ? "五张" : "三张"}`;
  }, openRange(trigger) {
    if (disposed || choosing || !isActive()) return false;
    close();
    return rangePanel.open(trigger);
  }, dispose() {
    if (disposed) return;
    disposed = true;
    close();
    rangePanel.dispose();
    style.remove();
  } };
}

// src/opening-favorites-ui.js
function openingFavoriteButton(el, { key, title, selected = false, onToggle }) {
  const button = el("button", "uos-opening-favorite"), icon = el("span", "", selected ? "★" : "☆");
  button.type = "button";
  icon.setAttribute("aria-hidden", "true");
  button.append(icon);
  const label = (selected ? "取消收藏：" : "收藏：") + title;
  button.setAttribute("aria-label", label);
  button.setAttribute("title", label);
  button.setAttribute("aria-pressed", String(selected));
  button.dataset.favoriteKey = key || "";
  if (onToggle) button.onclick = onToggle;
  else button.disabled = true;
  return button;
}
function openingFavoritesFilter(el, count, onToggle) {
  const button = el("button", "uos-favorites-filter", `☆ 只看收藏 · ${count}`);
  button.type = "button";
  button.setAttribute("aria-label", "只看收藏");
  button.setAttribute("aria-pressed", "false");
  if (onToggle) button.onclick = onToggle;
  else button.disabled = true;
  return button;
}
function createOpeningFavoritesUI({ el, store, onChange, onUnavailable = () => {
}, isActive = () => true }) {
  let onlyFavorites = false, disposed = false, keys = /* @__PURE__ */ new Set();
  const buttons = /* @__PURE__ */ new Map();
  const active = () => !disposed && isActive();
  const element = openingFavoritesFilter(el, 0, () => {
    if (!active() || element.isConnected === false) return;
    onlyFavorites = !onlyFavorites;
    onChange();
  });
  return {
    element,
    onlyFavorites: () => onlyFavorites,
    update(rows) {
      const identities = store.keys(rows.map((row) => row.body)), saved = store.snapshot();
      keys = new Set(identities.filter(Boolean));
      buttons.clear();
      const result = rows.map((row, i) => ({ ...row, favoriteKey: identities[i], favorite: saved.has(identities[i]) }));
      element.textContent = `${onlyFavorites ? "★" : "☆"} 只看收藏 · ${result.filter((row) => row.favorite).length}`;
      element.setAttribute("aria-pressed", String(onlyFavorites));
      return result;
    },
    button(row) {
      let button;
      button = openingFavoriteButton(el, { key: row.favoriteKey, title: row.title, selected: row.favorite, onToggle: () => {
        if (!active() || button.isConnected === false || !keys.has(row.favoriteKey)) return;
        const result = store.toggle(row.favoriteKey);
        if (!result.persisted) onUnavailable();
        onChange();
        const target = buttons.get(row.favoriteKey) || element;
        try {
          if (target.isConnected !== false) target.focus();
        } catch {
        }
      } });
      button.disabled = !row.favoriteKey;
      buttons.set(row.favoriteKey, button);
      return button;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      buttons.clear();
      keys.clear();
      element.remove();
    }
  };
}

// src/opening-favorites-styles.js
var OPENING_FAVORITES_CSS = `
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

// src/player-panel-session.js
function createPlayerPanelSession(dialog, { onDispose = () => {
}, onError = () => {
} } = {}) {
  let disposed = false, guard = null;
  const cleanups = [];
  function own(cleanup) {
    if (typeof cleanup !== "function") return;
    if (disposed) cleanup();
    else cleanups.push(cleanup);
  }
  function close() {
    if (disposed) return;
    disposed = true;
    dialog.removeEventListener("cancel", onCancel);
    dialog.removeEventListener("click", onClick);
    dialog.removeEventListener("close", onClose);
    for (const cleanup of cleanups.splice(0).reverse()) {
      try {
        cleanup();
      } catch (error) {
        onError(error);
      }
    }
    guard = null;
    try {
      if (dialog.open) dialog.close();
    } finally {
      dialog.remove();
      onDispose(api);
    }
  }
  async function prepareForUpdate() {
    if (disposed) return true;
    return guard ? guard.confirm() : true;
  }
  async function requestClose() {
    if (disposed) return true;
    if (!await prepareForUpdate()) return false;
    if (!disposed) close();
    return true;
  }
  const onCancel = (event) => {
    event.preventDefault();
    void requestClose();
  };
  const onClick = (event) => {
    if (event.target === dialog) void requestClose();
  };
  const onClose = () => close();
  dialog.addEventListener("cancel", onCancel);
  dialog.addEventListener("click", onClick);
  dialog.addEventListener("close", onClose);
  const api = {
    dialog,
    own,
    close,
    requestClose,
    prepareForUpdate,
    get disposed() {
      return disposed;
    },
    setGuard(value) {
      if (guard) throw Error("弹窗已绑定草稿保护");
      guard = value;
      own(() => value.close());
    },
    show(focusTarget) {
      if (disposed) return false;
      try {
        dialog.showModal();
        focusTarget?.focus();
        return true;
      } catch (error) {
        close();
        throw error;
      }
    }
  };
  return api;
}

// src/player-button-drag.js
function createPlayerButtonDrag(button, { positionKey = "uos_player_button_position" } = {}) {
  const doc = button.ownerDocument, host = doc.defaultView;
  let gesture = null, frame = 0, disposed = false, ignoreClick = false;
  function bounds() {
    const view = host.visualViewport;
    return { left: view?.offsetLeft || 0, top: view?.offsetTop || 0, width: view?.width || host.innerWidth, height: view?.height || host.innerHeight };
  }
  function place(left, top) {
    const view = bounds(), rect = button.getBoundingClientRect();
    const x = Math.max(view.left + 8, Math.min(left, view.left + view.width - rect.width - 8));
    const y = Math.max(view.top + 8, Math.min(top, view.top + view.height - rect.height - 8));
    button.style.left = `${x}px`;
    button.style.top = `${y}px`;
  }
  function float() {
    button.dataset.floating = "true";
    if (button.parentNode !== doc.body) doc.body.append(button);
  }
  function save() {
    try {
      host.localStorage.setItem(positionKey, JSON.stringify({ x: parseFloat(button.style.left) / host.innerWidth, y: parseFloat(button.style.top) / host.innerHeight }));
    } catch {
    }
  }
  function render() {
    frame = 0;
    if (!disposed && gesture?.moved) place(gesture.left + gesture.dx, gesture.top + gesture.dy);
  }
  function release(id) {
    try {
      if (button.hasPointerCapture?.(id)) button.releasePointerCapture(id);
    } catch {
    }
  }
  function finish(event) {
    if (!gesture || event.pointerId !== gesture.id) return;
    if (frame) host.cancelAnimationFrame(frame);
    frame = 0;
    if (gesture.moved) {
      if (event.type === "pointerup") {
        gesture.dx = event.clientX - gesture.startX;
        gesture.dy = event.clientY - gesture.startY;
      }
      render();
      save();
      ignoreClick = true;
    }
    const id = gesture.id;
    gesture = null;
    release(id);
  }
  function down(event) {
    if (disposed || gesture || event.isPrimary === false || event.button != null && event.button !== 0) return;
    ignoreClick = false;
    const rect = button.getBoundingClientRect();
    gesture = { id: event.pointerId, startX: event.clientX, startY: event.clientY, left: rect.left, top: rect.top, dx: 0, dy: 0, moved: false };
  }
  function move(event) {
    if (disposed || !gesture || event.pointerId !== gesture.id) return;
    const dx = event.clientX - gesture.startX, dy = event.clientY - gesture.startY;
    if (!gesture.moved && Math.hypot(dx, dy) < 8) return;
    if (!gesture.moved) {
      gesture.moved = true;
      float();
      place(gesture.left, gesture.top);
      try {
        button.setPointerCapture?.(event.pointerId);
      } catch {
      }
    }
    gesture.dx = dx;
    gesture.dy = dy;
    if (!frame) frame = host.requestAnimationFrame(render);
    event.preventDefault();
  }
  function lost(event) {
    if (!button.hasPointerCapture?.(event.pointerId)) finish(event);
  }
  function clamp() {
    if (disposed || button.dataset.floating !== "true") return;
    if (gesture) finish({ pointerId: gesture.id, type: "resize" });
    place(parseFloat(button.style.left) || 8, parseFloat(button.style.top) || 8);
  }
  const listeners = [[button, "pointerdown", down], [doc, "pointermove", move], [doc, "pointerup", finish], [doc, "pointercancel", finish], [button, "lostpointercapture", lost], [host, "resize", clamp]];
  if (host.visualViewport) listeners.push([host.visualViewport, "resize", clamp], [host.visualViewport, "scroll", clamp]);
  for (const [target, type, fn] of listeners) target.addEventListener(type, fn, { capture: true, passive: false });
  return {
    restore() {
      if (disposed) return;
      try {
        const saved = JSON.parse(host.localStorage.getItem(positionKey));
        if (!Number.isFinite(saved?.x) || !Number.isFinite(saved?.y)) return;
        float();
        place(saved.x * host.innerWidth, saved.y * host.innerHeight);
      } catch {
      }
    },
    suppressClick(event) {
      if (!ignoreClick || event.detail === 0) return false;
      ignoreClick = false;
      event.preventDefault();
      event.stopPropagation();
      return true;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      if (frame) host.cancelAnimationFrame(frame);
      frame = 0;
      const id = gesture?.id;
      gesture = null;
      if (id != null) release(id);
      for (const [target, type, fn] of listeners) target.removeEventListener(type, fn, true);
    }
  };
}

// src/theme-art.js
var artUrl = (path) => themeAssetCandidates(`assets/${path}.webp`)[0];
var THEME_ART = Object.freeze({
  mascot: artUrl("brand/theme-mascots"),
  welcome: artUrl("brand/welcome"),
  search: artUrl("brand/search"),
  themeMascots: artUrl("brand/theme-mascots"),
  icons: artUrl("theme-icons"),
  schoolIcon: artUrl("theme-icon-school"),
  schoolOrnament: artUrl("theme-ornament-school"),
  ornaments: artUrl("theme-ornaments"),
  openings: artUrl("tab-openings"),
  worldbooks: artUrl("tab-worldbooks"),
  bgm: artUrl("tab-bgm"),
  diagnostics: artUrl("tab-diagnostics"),
  updates: artUrl("tab-updates")
});

// src/brand-mark.js
var MASCOT_COLUMNS = 4;
var MASCOT_ROWS = 5;
var THEME_MASCOT_POSITIONS = Object.freeze(Object.fromEntries(THEME_IDS.map((id, index) => [
  id,
  `${index % MASCOT_COLUMNS / (MASCOT_COLUMNS - 1) * 100}% ${Math.floor(index / MASCOT_COLUMNS) / (MASCOT_ROWS - 1) * 100}%`
])));
var themeRules = THEMES.map(([id]) => `.uos[data-theme="${id}"] .uos-brand-avatar,.uos-user-panel[data-theme="${id}"] .uos-brand-avatar,.uos-user-trigger[data-theme="${id}"] .uos-brand-avatar{--uos-mascot-position:${THEME_MASCOT_POSITIONS[id]}}`).join("\n");
var BRAND_CSS = `
.uos-brand{display:flex;align-items:center;gap:12px;max-width:100%;margin:0 0 16px;box-sizing:border-box;pointer-events:none}
.uos-masthead .uos-brand{padding-right:64px}
.uos-brand-avatar{display:block;flex:none;width:76px;height:70px;filter:drop-shadow(0 2px 3px #0002);background-color:transparent;background-image:var(--uos-theme-mascot-image,url("${THEME_ART.themeMascots}"));background-size:${MASCOT_COLUMNS * 100}% ${MASCOT_ROWS * 100}%;background-position:var(--uos-mascot-position,0% 0%);background-repeat:no-repeat}
.uos-brand-copy{display:grid;gap:4px;min-width:0;color:var(--text);font-family:system-ui,"Noto Sans SC",sans-serif}
.uos-brand-copy strong{font-size:15px;font-weight:700;line-height:1.4;letter-spacing:.09em;overflow-wrap:anywhere}
.uos-brand-copy small{color:var(--muted);font-size:11px;line-height:1.5;letter-spacing:.08em}
.uos-user-panel .uos-brand{margin-bottom:12px}
.uos-user-panel .uos-brand-avatar{width:64px;height:59px}
.uos-user-head>div:first-child{min-width:0;flex:1}
.uos-mascot-note{display:flex;align-items:center;gap:14px;padding:14px 16px;margin:0 0 16px;border:1px solid var(--line);border-radius:14px;background:var(--panel,var(--surface));color:var(--muted);font:13px/1.7 system-ui,"Noto Sans SC",sans-serif;box-sizing:border-box;min-width:0}
.uos-mascot-note img{display:block;width:94px;height:86px;object-fit:contain;flex:none}
.uos-mascot-note span{min-width:0;overflow-wrap:anywhere}
.uos-brand img[hidden],.uos-mascot-note img[hidden]{display:none}
.uos .uos-search-empty.uos-mascot-note::before{display:none}
.uos .uos-search-empty:not(.uos-mascot-note)::before{background-image:url("${THEME_ART.search}");background-size:contain;background-position:center;background-repeat:no-repeat}
.uos-search-empty.uos-mascot-note,.uos-user-empty.uos-mascot-note{grid-column:1/-1;margin:10px 0;min-height:112px}
@media(max-width:600px){.uos-mascot-note{padding:12px;gap:10px;font-size:12px}.uos-mascot-note img{width:76px;height:70px}}
@media(max-width:600px){.uos-brand{gap:10px;margin-bottom:12px}.uos-brand-avatar,.uos-user-panel .uos-brand-avatar{width:58px;height:53px}.uos-brand-copy strong{font-size:13px;letter-spacing:.04em}.uos-brand-copy small{font-size:10px;letter-spacing:.04em}}
${themeRules}
img[data-uos-mascot-loader]{display:none!important}
`;
function brandMarkMarkup() {
  return `<div class="uos-brand"><span class="uos-brand-avatar" data-uos-theme-mascot role="img" aria-label="主题看板娘 Logo"></span><div class="uos-brand-copy"><strong>红豆粉开场白选择器</strong><small>ALICENEKO · OPENING SELECTOR</small></div></div>`;
}
function bindMascotImage(image, kind = "mascot") {
  if (!image) return () => {
  };
  if (!["mascot", "welcome", "search"].includes(kind)) kind = "mascot";
  const sources = themeAssetCandidates(`assets/brand/${kind}.webp`);
  let index = 0, disposed = false;
  const fail = () => {
    if (disposed || image.isConnected === false) return;
    if (++index < sources.length) image.src = sources[index];
    else {
      image.hidden = true;
      image.onload = image.onerror = null;
    }
  };
  image.onload = () => {
    if (!disposed && image.isConnected !== false) image.hidden = false;
  };
  image.onerror = fail;
  if (image.complete && image.naturalWidth === 0) fail();
  return () => {
    disposed = true;
    image.onload = image.onerror = null;
  };
}
function bindBrandImages(root) {
  if (!root?.querySelectorAll) return () => {
  };
  const doc = root.ownerDocument, urls = themeAssetCandidates("assets/brand/theme-mascots.webp");
  let index = 0, disposed = false;
  const loader = doc?.createElement?.("img");
  if (!loader) return () => {
  };
  loader.dataset.uosMascotLoader = "";
  loader.alt = "";
  loader.hidden = true;
  root.append(loader);
  const stop = () => {
    if (disposed) return;
    disposed = true;
    loader.onload = loader.onerror = null;
    loader.remove();
    root.style?.removeProperty?.("--uos-theme-mascot-image");
  };
  loader.onload = () => {
    if (!disposed && root.isConnected !== false) root.style?.setProperty?.("--uos-theme-mascot-image", `url("${urls[index]}")`);
  };
  loader.onerror = () => {
    if (disposed || root.isConnected === false) return;
    if (++index < urls.length) loader.src = urls[index];
  };
  loader.src = urls[index];
  return stop;
}
function mascotNoteMarkup(kind, text) {
  return `<div class="uos-mascot-note"><img data-uos-mascot data-mascot-kind="${kind}" src="${THEME_ART[kind]}" width="320" height="292" alt="" aria-hidden="true" draggable="false" decoding="async"><span>${text}</span></div>`;
}
function createMascotNote(el, kind, text, cls = "") {
  const element = el("div", `uos-mascot-note ${cls}`), image = el("img");
  image.alt = "";
  image.draggable = false;
  image.decoding = "async";
  image.width = 320;
  image.height = 292;
  image.setAttribute("aria-hidden", "true");
  image.src = THEME_ART[kind];
  element.append(image, el("span", "", text));
  return { element, dispose: bindMascotImage(image, kind) };
}
function createBrandMark(el) {
  const element = el("div", "uos-brand"), image = el("span", "uos-brand-avatar"), copy = el("div", "uos-brand-copy");
  image.setAttribute("role", "img");
  image.setAttribute("aria-label", "主题看板娘 Logo");
  image.dataset.uosThemeMascot = "";
  copy.append(el("strong", "", "红豆粉开场白选择器"), el("small", "", "ALICENEKO · OPENING SELECTOR"));
  element.append(image, copy);
  return { element };
}

// src/player-settings-layout.js
function createPlayerSettingsLayout(el) {
  const settings = el("section", "uos-user-settings");
  settings.hidden = true;
  settings.id = "uos-player-settings";
  settings.setAttribute("aria-label", "开场设置");
  const button = el("button", "uos-user-settings-button", "设置");
  button.type = "button";
  button.setAttribute("aria-controls", settings.id);
  button.setAttribute("aria-expanded", "false");
  button.onclick = () => {
    settings.hidden = !settings.hidden;
    button.setAttribute("aria-expanded", String(!settings.hidden));
  };
  let stopToggles = () => {
  }, closed = false;
  function assemble({ exclusion, people, edits, labels, updates, floatingStyle }) {
    if (closed) return;
    stopToggles();
    const sheets = [exclusion, people, edits, labels, updates];
    const listeners = sheets.map((sheet) => {
      const onToggle = () => {
        if (sheet.open) {
          for (const other of sheets) if (other !== sheet) other.open = false;
        }
      };
      sheet.addEventListener("toggle", onToggle);
      return () => sheet.removeEventListener("toggle", onToggle);
    });
    stopToggles = () => {
      listeners.forEach((stop) => stop());
    };
    const intro = el("p", "uos-user-settings-intro", "按需要展开一项。修改后使用该项的保存按钮。");
    const common = el("section", "uos-user-settings-group");
    common.append(el("h3", "", "开场显示"), edits, labels);
    const appearance = el("section", "uos-user-settings-group");
    appearance.append(el("h3", "", "界面外观"), floatingStyle);
    const advanced = el("section", "uos-user-settings-group");
    advanced.append(el("h3", "", "识别规则"), exclusion, people);
    const system = el("section", "uos-user-settings-group");
    system.append(el("h3", "", "插件"), updates);
    settings.replaceChildren(intro, common, appearance, advanced, system);
  }
  return { settings, button, assemble, close() {
    if (closed) return;
    closed = true;
    stopToggles();
    button.onclick = null;
  } };
}

// src/player-trigger-style.js
var STORAGE_KEY = "uos_player_floating_style_v1";
var normalize = (value) => value === "simple" ? "simple" : "mascot";
function createPlayerTriggerStylePreference(host) {
  let value = "mascot";
  try {
    value = normalize(host?.localStorage?.getItem(STORAGE_KEY));
  } catch {
  }
  return {
    get() {
      return value;
    },
    set(next) {
      value = normalize(next);
      try {
        host?.localStorage?.setItem(STORAGE_KEY, value);
        return { value, saved: true };
      } catch {
        return { value, saved: false };
      }
    }
  };
}

// src/player-draft-guard.js
function unsavedPlayerGroups(baseline, current) {
  if (!baseline || !current) return [];
  return Object.keys(current).filter((key) => JSON.stringify(baseline[key]) !== JSON.stringify(current[key]));
}
function createPlayerDraftGuard({
  getGroups,
  prompt,
  restore,
  saveCard,
  saveLocal,
  status,
  isActive = () => true,
  AbortControllerClass = globalThis.AbortController
}) {
  let prompting = false, closed = false;
  const controller = new AbortControllerClass();
  const current = () => !closed && isActive();
  async function confirm() {
    if (prompting || !current()) return false;
    const groups = getGroups();
    if (!groups.length) return true;
    prompting = true;
    try {
      const canSaveToCard = groups.some((group) => ["exclusion", "people", "edits"].includes(group));
      const choice = await prompt(groups, canSaveToCard, controller.signal);
      if (!current() || choice === "stay") return false;
      if (choice === "discard") {
        restore();
        return true;
      }
      const saved = choice === "card" ? await saveCard(groups) : choice === "local" ? await saveLocal(groups) : false;
      return current() && !!saved;
    } catch (error) {
      if (current()) status(`未保存内容处理失败：${error?.message || error}`);
    } finally {
      prompting = false;
    }
    return false;
  }
  return { confirm, close() {
    if (closed) return;
    closed = true;
    controller.abort();
  } };
}
function showPlayerUnsavedPrompt(doc, dialog, panel, groups, canSaveToCard, { signal } = {}) {
  return new Promise((resolve) => {
    if (signal?.aborted) {
      resolve("stay");
      return;
    }
    const previous = doc.activeElement, overlay = doc.createElement("div");
    overlay.dataset.uosPlayerUnsaved = "";
    overlay.setAttribute("role", "presentation");
    overlay.style.cssText = "position:absolute;inset:0;z-index:100;display:grid;place-items:center;padding:16px;background:#000a;color:var(--text)";
    const computed = doc.defaultView.getComputedStyle(panel);
    for (const key of ["--bg", "--surface", "--text", "--muted", "--accent", "--line"]) overlay.style.setProperty(key, computed.getPropertyValue(key));
    const card = doc.createElement("section");
    card.setAttribute("role", "alertdialog");
    card.setAttribute("aria-modal", "true");
    card.setAttribute("aria-labelledby", "uos-player-unsaved-title");
    card.style.cssText = "width:min(440px,100%);padding:18px;border:1px solid var(--accent);border-radius:14px;background:var(--bg);color:var(--text);box-shadow:0 18px 54px #000b";
    const title = doc.createElement("h2");
    title.id = "uos-player-unsaved-title";
    title.textContent = "有未保存的改动";
    title.style.cssText = "margin:0 0 8px;font-size:18px";
    const names = { exclusion: "排除字段", people: "人物规则", edits: "开场修正", labels: "开场标签" };
    const message = doc.createElement("p");
    message.textContent = "未保存：" + groups.map((group) => names[group] || group).join("、");
    message.style.cssText = "margin:0 0 16px;color:var(--muted);font-size:13px;line-height:1.5";
    const actions = doc.createElement("div");
    actions.style.cssText = "display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px";
    let settled = false;
    const buttons = [];
    const finish = (value) => {
      if (settled) return;
      settled = true;
      doc.removeEventListener("keydown", onKeyDown, true);
      signal?.removeEventListener("abort", onAbort);
      overlay.remove();
      try {
        previous?.focus?.();
      } catch {
      }
      resolve(value);
    };
    const addButton = (label, value, primary = false) => {
      const button = doc.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.style.cssText = `min-height:40px;padding:8px 11px;border:1px solid var(--line);border-radius:9px;background:${primary ? "var(--accent)" : "var(--surface)"};color:${primary ? "var(--bg)" : "var(--text)"};font:600 12px/1.35 system-ui,sans-serif;cursor:pointer`;
      button.onclick = () => finish(value);
      buttons.push(button);
      actions.append(button);
      return button;
    };
    addButton("保存到本机并关闭", "local", true);
    if (canSaveToCard) addButton("保存到角色卡并关闭", "card");
    addButton("放弃更改并关闭", "discard");
    const stay = addButton("继续编辑", "stay");
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        finish("stay");
        return;
      }
      if (event.key === "Tab") {
        const index = buttons.indexOf(doc.activeElement);
        if (event.shiftKey && index <= 0) {
          event.preventDefault();
          buttons.at(-1).focus();
        } else if (!event.shiftKey && index === buttons.length - 1) {
          event.preventDefault();
          buttons[0].focus();
        }
      }
    };
    const onAbort = () => finish("stay");
    signal?.addEventListener("abort", onAbort, { once: true });
    overlay.addEventListener("pointerdown", (event) => {
      if (event.target === overlay) finish("stay");
    });
    card.append(title, message, actions);
    overlay.append(card);
    dialog.append(overlay);
    doc.addEventListener("keydown", onKeyDown, true);
    stay.focus();
  });
}

// src/worldbook-people.js
var WB_STRUCTURAL = /时间|地点|场景|世界观|设定|规则|系统|状态|预警|剧情|大纲|地图|机制|速览|一览|列表|名单|目录|人物关系|角色关系|档案|说明|简介|年龄|性别|职业|姓名|登场人物|在场角色|^(?:人物|角色|名称|序号|编号|身份|别名|称呼|name|character|id|content|description|location|scene|status|gender|age|(?:基本|基础|详细)?(?:信息|资料|属性|介绍|概况))$/i;
var WB_GENERIC = /^(?:哥哥|姐姐|妹妹|弟弟|父亲|母亲|老师|同学|玩家|用户|主角|配角|男主|女主|少年|少女|男人|女人|未知|不详|走廊|教室|城市|战斗|魔法|火焰|故事|开场|剧情|无|none|null)$/iu;
var WB_PROSE = /^(?:他是|她是|这是|那是|在此|每个|该人物|该角色)|负责|喜欢|拥有|来自|担任|居住|^(?:he|she|they|this|that|it|you|we)\s+(?:is|are|was|were|has|have|will|can|likes|lives)\b/iu;
var WB_PLACE = /(?:市|镇|区|街|学院|大学|医院|学校|公寓|研究所|车站|商店|便利店|安全屋|防空洞|祠堂|集团|协会)$/u;
var WB_OVERVIEW = /(?:人物|角色|NPC)[\s·・:：_-]*(?:速览|一览|概览|概况|名单|列表|总览|总表|图鉴|汇总)|登场人物|登场角色|主要人物|主要角色|人物关系一览|character\s*(?:list|overview)|\bcast\b|^(?:人物介绍|角色介绍|人物简介|角色简介)$/i;
var WB_CAST_HEADER = new RegExp(`^(?:${WB_OVERVIEW.source})$`, "i");
function wbIsOverview(value) {
  return WB_CAST_HEADER.test(normalizePersonText(value).trim());
}
var WB_PERSON_MARKER = /(?:人物|角色|人设|NPC|档案|profile|character)/i;
var WB_TITLE_TAG = /^(?:NSFW|SFW|R[- ]?18G?|18\+|成人向?|全年龄|限制级|色情|人物|角色|NPC|人设|人物档案|角色档案|人物资料|角色资料|人物设定|角色设定|基础设定|基础信息|详细信息|人物介绍|角色介绍|人物简介|角色简介|档案|profile|character|主要|次要|重要|主角|配角|男主|女主|基础|核心|背景|关系|设定|\d+)$/iu;
function wbTitleTag(value, learned = /* @__PURE__ */ new Set()) {
  const parts = String(value).trim().split(/[·・:：|｜/_]+/u);
  return learned.has(String(value).trim()) || parts.every((part) => WB_TITLE_TAG.test(part.trim()) || learned.has(part.trim()));
}
var WB_NAME_FIELD = "(?:姓名|全名|本名|真名|角色名|人物名|人物姓名|角色姓名|角色名称|人物名称|人名|名字|name|full[_ ]?name)";
function normalizePersonText(value) {
  return String(value ?? "").normalize("NFKC").replace(/[\u200b-\u200d\ufeff]/g, "");
}
function isPersonName(value) {
  const name = normalizePersonText(value).trim();
  if (/^[\p{Script=Han}·・\s]+$/u.test(name) && name.replace(/[·・\s]/g, "").length > 12) return false;
  return !WB_STRUCTURAL.test(name) && !wbTitleTag(name) && /^(?=.*[\p{L}])[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Latin}\p{N}][\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Latin}\p{N}\s.'’·・\-]{0,39}$/u.test(name);
}
function isAutomaticPersonName(value) {
  const name = normalizePersonText(value).trim();
  return isPersonName(name) && !WB_GENERIC.test(name) && !/^(?:user|assistant|system|char|bot|you|me)$/iu.test(name) && !/(?:\p{Script=Han}的(?:\p{Script=Han}|$)|['’]s\s+\p{L}|\s+(?:of|the)\s+)/iu.test(name);
}
function wbName(value) {
  return normalizePersonText(value).replace(/\*\*|`/g, "").trim().replace(/^[#\s]+/, "").replace(/^(?:[-*•➤]\s*|\d+[.、)]\s*|\d+\s+(?=\p{L})|\d+(?=\p{Script=Han})|[①-⑳]\s*)/u, "").replace(/[（(].*$/, "").replace(/^["'“「『【\[]+|["'”」』】\]。]+$/g, "").trim();
}
function wbNames(value) {
  return String(value ?? "").split(/[、，,\/;；]+/).map(wbName).filter((name) => isAutomaticPersonName(name) && !WB_GENERIC.test(name) && !WB_PLACE.test(name) && !WB_PROSE.test(name));
}
function wbTitle(value, learned = /* @__PURE__ */ new Set()) {
  let title = normalizePersonText(value).replace(/[【\[]([^】\]]*)[】\]]/g, (_, inside) => wbTitleTag(inside, learned) ? "" : `【${inside}】`).replace(/^(?:[\p{Extended_Pictographic}\uFE0F\s]+|\d+[.、)]\s*)/u, "").replace(/^(?:人物档案|角色档案|人物设定|角色设定|人物介绍|角色介绍|人物简介|角色简介|角色资料|人物资料|人物|角色|人设|NPC\b|character\b|profile\b)\s*[·・:：\-—_|｜/]*\s*/i, "").replace(/\s*[-—_|｜:]\s*(?:人物|角色|NPC|档案|设定|基础信息|详细信息|profile).*$/i, "").replace(/(?:人物介绍|角色介绍|人物设定|角色设定|人物档案|角色档案|角色资料|人物资料|人设)$/i, "").trim();
  for (let i = 0; i < 12; i++) {
    const before = title;
    title = title.replace(/^(?:R[- ]?18G?|18\+)\s*[·・:：|｜/_—-]+\s*/iu, "").replace(/\s*[·・:：|｜/_—-]+\s*(?:R[- ]?18G?|18\+)$/iu, "");
    const first = title.match(/^([^·・:：|｜/_—-]+)[·・:：|｜/_—-]+\s*(.*)$/u);
    if (first && wbTitleTag(first[1], learned)) title = first[2].trim();
    const last = title.match(/^(.*?)[·・:：|｜/_—-]+\s*([^·・:：|｜/_—-]+)$/u);
    if (last && wbTitleTag(last[2], learned)) title = last[1].trim();
    if (title === before) break;
  }
  title = title.replace(/^(.+?)[【\[][^】\]]*[】\]]\s*$/u, (_, head) => head.includes("【") ? _ : head);
  return wbName(title);
}
function wbTitleKeyword(title, keys) {
  const text = normalizePersonText(title), matches = keys.flatMap((name) => {
    const start = text.indexOf(name);
    if (start < 0) return [];
    const end = start + name.length;
    if (/[\p{L}\p{N}]/u.test(text[start - 1] || "") || /[\p{L}\p{N}]/u.test(text[end] || "")) return [];
    return [name];
  });
  return [...new Set(matches)];
}
function wbFieldNames(value) {
  const head = String(value).split(/\s+(?:性别|年龄|身份|职业|别名|昵称|gender|age)\s*[:=]|[|｜]/iu)[0];
  return wbNames(head);
}
function enclosingJsonObject(text, index) {
  const stack = [];
  let quote = "", escaped = false;
  for (let i = 0; i < index; i++) {
    const char = text[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (stack.length && (char === '"' || char === "'")) {
      quote = char;
      continue;
    }
    if (char === "{") stack.push(i);
    else if (char === "}") stack.pop();
  }
  const start = stack.at(-1);
  if (start == null) return null;
  let depth = 0;
  quote = "";
  escaped = false;
  for (let i = start; i < text.length; i++) {
    const char = text[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      continue;
    }
    if (char === "{") depth++;
    else if (char === "}" && !--depth) {
      try {
        return { value: JSON.parse(text.slice(start, i + 1)), depth: stack.length, key: text.slice(0, start).match(/["']([\w]+)["']\s*:\s*(?:\[\s*)?$/)?.[1] || "" };
      } catch {
        return null;
      }
    }
  }
  return null;
}
function identityScope(text, index, title = "") {
  const before = text.slice(0, index), object = enclosingJsonObject(text, index);
  const personHint = /(?:^|[\n{,|])\s*["']?(?:性别|外貌|性格|gender)["']?\s*[:=]|(?:^|[·:：|/\[【\s])(?:人物|角色|NPC|character|profile)(?:档案|资料|设定|简介|介绍|\b|[·:：|/\]】\s])/iu;
  if (object) {
    const type = String(object.value.type || object.value["类型"] || object.value["类别"] || "").toLowerCase();
    if (/^(?:weapon|item|object|equipment|location|place|organization|faction|scene|物品|武器|装备|道具|地点|组织|势力)$/.test(type) || /^(?:item|weapon|inventory|equipment|location|organization|faction|items|weapons|locations|organizations)$/.test(object.key)) return { person: false, blocked: true };
    const human = ["性别", "外貌", "性格", "gender"].some((key) => Object.hasOwn(object.value, key));
    object.person = human || /^(?:person|character|npc|人物|角色)$/.test(type) || /^(?:person|character|npc)$/.test(object.key);
  }
  const stack = [];
  for (const match of before.matchAll(/<\s*(\/?)\s*([\w\p{Script=Han}-]+)[^<>]*>/gu)) {
    const tag = match[2].toLowerCase();
    if (match[1]) {
      const i = stack.lastIndexOf(tag);
      if (i >= 0) stack.splice(i);
    } else if (!/\/\s*>$/.test(match[0])) stack.push(tag);
  }
  if (stack.some((tag) => /^(?:example|sample|template|instructions|示例|样例|模板)$/.test(tag))) return { person: false, blocked: true };
  let xmlPerson = false;
  for (const tag of [...stack].reverse()) {
    if (/^(?:example|sample|template|instructions|示例|样例|模板)$/.test(tag)) return { person: false, blocked: true };
    if (/^(?:item|weapon|object|equipment|location|organization|faction|物品|武器|装备|道具|地点|组织|势力)$/.test(tag)) return { person: false, blocked: true };
    if (/^(?:person|character|npc|人物|角色|人物档案|角色档案)$/.test(tag)) {
      xmlPerson = true;
      break;
    }
  }
  const heading = [...before.matchAll(/^\s*#{1,6}\s+(.+)$/gmu)].at(-1)?.[1] || "";
  if (/^(?:示例|样例|模板|填表示例|字段示例)(?:[：:\s]|$)/u.test(heading)) return { person: false, blocked: true };
  if (/^(?:物品|武器|装备|道具|地点|组织|势力)(?:档案|资料|设定|图鉴|列表|名单|介绍|名称|[：:\s]|$)/u.test(heading)) return { person: false, blocked: true };
  if (object?.person || xmlPerson) return { person: true, blocked: false };
  if (object && object.depth > 1) return { person: false, blocked: false };
  const nonTitle = /^(?:物品|武器|装备|道具|地点|组织|势力)(?:档案|资料|设定|图鉴|列表|名单|介绍|名称|[：:\s]|$)/u.test(title);
  const blank = before.lastIndexOf("\n\n"), paragraphStart = blank < 0 ? 0 : blank + 2, paragraphEnd = text.indexOf("\n\n", index);
  const paragraph = text.slice(paragraphStart, paragraphEnd < 0 ? text.length : paragraphEnd);
  const explicitNon = /(?:^|\n)\s*(?:物品名称|武器名称|装备名称|势力名称|组织名称|场所类型)\s*[:：]/u.test(paragraph);
  if (nonTitle || explicitNon && !personHint.test(title)) return { person: false, blocked: true };
  return { person: personHint.test(title) || personHint.test(heading) || personHint.test(object ? JSON.stringify(Object.fromEntries(Object.entries(object.value).filter(([, value]) => value == null || typeof value !== "object"))) : paragraph), blocked: false };
}
function allowsPersonEvidence(text, index) {
  return !identityScope(normalizePersonText(text), index).blocked;
}
function extractPersonIdentities(value, { title = "", descriptions = true } = {}) {
  const text = normalizePersonText(value).replace(/\*\*|`/g, ""), identities = [];
  const emit = (raw, field, index, kind, explicit = false) => {
    const scope = identityScope(text, index, title);
    if (scope.blocked) return;
    const trusted = explicit || scope.person;
    for (const name of wbFieldNames(raw)) identities.push({ name, trusted, kind: trusted ? kind : "通用名称字段，待确认", index });
  };
  const fields = new RegExp(`(?:^|[\\n{,，|>])\\s*(?:[-*#]\\s*)*["']?(${WB_NAME_FIELD})["']?\\s*[:：=]\\s*["']?([^\\n<>。；;"'}|]{1,160})`, "gimu");
  for (const match of text.matchAll(fields)) emit(match[2], match[1], match.index + match[0].indexOf(match[1]), "姓名字段", !/^(?:name|名字)$/iu.test(match[1]));
  const tags = new RegExp(`<(${WB_NAME_FIELD.slice(3, -1)})(?:\\s[^<>]*)?>\\s*([^<>]{1,100})\\s*<\\/\\1>`, "giu");
  for (const match of text.matchAll(tags)) emit(match[2], match[1], match.index, "姓名标签", !/^(?:name|名字)$/iu.test(match[1]));
  for (const match of text.matchAll(/<(?:人物|角色|person|character|npc)(?=\s|>)[^<>]*?\s(?:name|姓名|名字)=["']([^"'<>]{1,100})["'][^<>]*>/giu)) emit(match[1], "姓名", match.index, "人物属性", true);
  for (const match of text.matchAll(/^\s*\|\s*([^|\n]+)\|\s*([^|\n]+)\|/gmu)) if (new RegExp(`^${WB_NAME_FIELD}$`, "iu").test(match[1].trim())) emit(match[2], match[1].trim(), match.index, "姓名表格", !/^(?:name|名字)$/iu.test(match[1].trim()));
  if (descriptions) for (const match of text.matchAll(/(?:姓名(?:是|为)|全名(?:是|为)|本名(?:是|为)|(?:(?:他|她|此人|该角色|该人物)(?:的?名字)?|人物|角色)(?:名叫|叫做))\s*([^，,。.!！?？；;\n<>]{1,80})(?=[，,。.!！?？；;\n<>]|$)/gu)) emit(match[1], "姓名", match.index, "姓名描述", true);
  return identities.sort((a, b) => a.index - b.index);
}
function wbBookEvidence(records, found, diagnostics) {
  const groups = /* @__PURE__ */ new Map();
  for (const record of records) {
    if (!groups.has(record.bookSource)) groups.set(record.bookSource, { records: [], tags: /* @__PURE__ */ new Set(), strong: /* @__PURE__ */ new Set() });
    const group = groups.get(record.bookSource);
    group.records.push(record);
    for (const name of record.accepted) if (found.get(name)?.trusted) group.strong.add(name);
  }
  for (const group of groups.values()) {
    const patterns = /* @__PURE__ */ new Map();
    for (const record of group.records) {
      if (record.overview || record.nonPerson) continue;
      const title = normalizePersonText(record.title);
      const anchors = wbTitleKeyword(title, [...group.strong]);
      if (anchors.length !== 1) continue;
      const anchor = anchors[0], start = title.indexOf(anchor), end = start + anchor.length;
      for (const match of title.matchAll(/[^·・:：|｜/_—\-【】\[\]]+/gu)) {
        const token = match[0].trim();
        if (!token || group.strong.has(token) || match.index < end && match.index + match[0].length > start) continue;
        const side = match.index < start ? "before" : "after", key = `${side}:${token}`;
        if (!patterns.has(key)) patterns.set(key, { token, names: /* @__PURE__ */ new Set() });
        patterns.get(key).names.add(anchor);
      }
    }
    for (const pattern of patterns.values()) if (pattern.names.size >= 3) group.tags.add(pattern.token);
    const inferred = [...group.tags].filter((token) => !wbTitleTag(token));
    if (inferred.length) diagnostics.push({ book: group.records[0].book, title: "整书标题模式", reason: `不同人物条目共享的标题分类：${inferred.join("、")}（至少 3 个独立姓名佐证，仅在本书生效）` });
    for (const record of group.records) record.bookEvidence = group;
  }
}
function extractWorldbookPeople(books, { diagnostics = [] } = {}) {
  const found = /* @__PURE__ */ new Map(), records = [];
  const add = (name, record, kind, trusted = true) => {
    name = wbName(name);
    if (!isAutomaticPersonName(name) || WB_GENERIC.test(name) || WB_PLACE.test(name) || WB_PROSE.test(name)) return;
    if (found.size >= 1e3 && !found.has(name)) {
      record.limit = true;
      return;
    }
    const person = found.get(name) || { name, aliases: [], candidateAliases: [], sources: [], trusted: false };
    person.trusted || (person.trusted = trusted);
    const source = `${record.book} · ${record.title || "未命名条目"}（${kind}）`;
    if (!person.sources.includes(source)) person.sources.push(source);
    found.set(name, person);
    record.accepted.add(name);
  };
  for (const book of books || []) for (const entry of (Array.isArray(book.entries) ? book.entries : []).slice(0, 3e3)) {
    const title = String(entry.name || entry.comment || "").slice(0, 240), content = String(entry.content || "").slice(0, 1e5);
    const record = { book: book.name, bookSource: book, title, content, names: /* @__PURE__ */ new Set(), accepted: /* @__PURE__ */ new Set(), titleName: "", keys: [] };
    if (entry.enabled === false || entry.disable === true) {
      diagnostics.push({ book: book.name, title, reason: "条目已停用，未参与识别" });
      continue;
    }
    records.push(record);
    const rawKeys = entry.strategy?.keys ?? entry.keys ?? entry.key ?? [];
    record.keys = (Array.isArray(rawKeys) ? rawKeys : []).filter((key) => typeof key === "string").flatMap(wbNames);
    const labeled = normalizePersonText(content).replace(/\*\*|`/g, "");
    record.identities = extractPersonIdentities(content, { title });
    for (const identity of record.identities) {
      if (identity.trusted) record.names.add(identity.name);
      add(identity.name, record, identity.kind, identity.trusted);
    }
    record.titleName = wbTitle(title);
    if (WB_OVERVIEW.test(record.titleName) || !isPersonName(record.titleName) || WB_GENERIC.test(record.titleName) || WB_PLACE.test(record.titleName)) record.titleName = "";
    let overview = wbIsOverview(title), sectionLevel = 0, tableNameColumn = -1, tableAliasColumn = -1;
    const overviewSource = labeled.replace(/<(example|sample|template|instructions|item|weapon|location|organization|示例|样例|模板|物品|武器|地点|组织)(?:\s[^<>]*)?>[\s\S]*?<\/\1>/giu, (block) => block.replace(/[^\n]/g, " "));
    const overviewText = overviewSource.replace(/<br\s*\/?\s*>/gi, "\n").replace(/<\/?(?:p|div|li|ul|ol|h[1-6])(?:\s[^<>]*)?>/gi, "\n").replace(/<[^<>]+>/g, "");
    const overviewNames = (value) => {
      const raw = String(value).trim();
      const head = raw.split(/[:|｜—]|\s+-\s+|\t/u)[0];
      const separated = head.match(/^([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}·・]{1,16})\s+(.+)$/u);
      if (separated && (separated[2].length >= 4 || /(?:男|女|学生|同学|医生|护士|旅人|身份|^[(])/.test(separated[2]))) return wbNames(separated[1]);
      return wbNames(head);
    };
    for (const line of overviewText.split(/\r?\n/)) {
      const heading = line.match(/^\s*(#{1,6})\s*(.+)$/);
      if (heading) {
        if (wbIsOverview(heading[2])) {
          overview = true;
          sectionLevel = heading[1].length;
          tableNameColumn = -1;
          tableAliasColumn = -1;
          continue;
        }
        const head = wbTitle(heading[2]);
        if (overview && (WB_STRUCTURAL.test(head) || WB_PLACE.test(head) || !sectionLevel || heading[1].length <= sectionLevel)) {
          overview = false;
          continue;
        }
      }
      if (/^\s*(?:地点|地理|剧情|物品|物资|天气|规则|系统|势力|世界观)\s*[:：]/u.test(line)) {
        overview = false;
        continue;
      }
      if (/^\s*(?:人物速览|角色速览|人物名单|角色名单|登场人物|登场角色|主要人物|主要角色)\s*[:：]/u.test(line) && !heading) {
        overview = true;
        for (const name of wbNames(line.split(":").slice(1).join(":"))) add(name, record, "人物速览");
        continue;
      }
      if (!overview) continue;
      if (line.includes("|")) {
        const cells = line.trim().replace(/^\||\|$/g, "").split("|").map((x) => x.trim());
        const nameColumn = cells.findIndex((x) => new RegExp(`^(?:${WB_NAME_FIELD}|人物|角色)$`, "iu").test(wbName(x)));
        if (nameColumn >= 0) {
          tableNameColumn = nameColumn;
          tableAliasColumn = cells.findIndex((x) => /^(?:别名|昵称|称呼|英文名|外文名|alias(?:es)?)$/i.test(x));
          continue;
        }
        if (cells.every((x) => /^[-:\s]*$/.test(x))) continue;
        if (cells.some((x) => /^(?:地点|状态|物品|物资|天气|装备)$/.test(x))) {
          tableNameColumn = -1;
          tableAliasColumn = -1;
          continue;
        }
        if (tableNameColumn < 0) continue;
        const cell = cells[tableNameColumn];
        for (const name of overviewNames(cell)) {
          add(name, record, "人物速览");
          const person = found.get(name);
          if (person && tableAliasColumn >= 0) person.aliases.push(...wbNames(cells[tableAliasColumn]).filter((x) => x !== name));
        }
        continue;
      }
      const row = line.trim().replace(/^(?:#{1,6}\s*|[-*•➤]\s*|\d+[.、)]\s*|[①-⑳]\s*)/u, "");
      if (!row || /^[^\p{L}\p{N}]*$/u.test(row)) continue;
      if (!/^\s*(?:#|[-*•➤]|\d+[.、)]|[①-⑳])/.test(line) && !/[：:|｜—、，,]/.test(row) && row.length > 40) continue;
      const explicitRow = /^\s*(?:[-*•➤]|\d+[.、)]|\d+\s*(?=\p{L})|[①-⑳])/u.test(line);
      for (const name of overviewNames(row)) add(name, record, explicitRow ? "人物速览名单" : "速览标题／文字，待确认", explicitRow);
    }
    const personFields = /(?:性别|年龄|外貌|性格|gender|age)["']?\s*[:=]/iu.test(labeled);
    const personTitle = WB_PERSON_MARKER.test(title) && !WB_OVERVIEW.test(title) && !/(?:关系|规则|名单|设定集)/u.test(title);
    const nonPerson = /(?:地点|地理位置|场所类型|势力名称|物品名称)\s*:/u.test(labeled);
    const firstField = labeled.search(/(?:姓名|名字|["']name["'])/iu);
    record.nonPerson = (nonPerson || identityScope(labeled, firstField < 0 ? Math.min(1, labeled.length) : firstField, title).blocked) && !record.names.size;
    Object.assign(record, { personFields, personTitle, humanDescription: /(?:(?<!其)他|她|性格|外貌|出身|身高|穿着|生于|出生|\bhe\b|\bshe\b)/iu.test(labeled), overview: wbIsOverview(title) });
  }
  wbBookEvidence(records, found, diagnostics);
  for (const record of records) {
    const { personFields, personTitle, nonPerson } = record, tags = record.bookEvidence.tags;
    record.keys = record.keys.filter((key) => !tags.has(key));
    record.titleName = wbTitle(record.title, tags);
    record.titlePhrase = isPersonName(record.titleName) && !isAutomaticPersonName(record.titleName);
    if (!isAutomaticPersonName(record.titleName) || WB_OVERVIEW.test(record.titleName) || WB_GENERIC.test(record.titleName) || WB_PLACE.test(record.titleName)) record.titleName = "";
    if (!record.names.size && !record.overview && (personTitle || personFields || record.keys.length)) {
      const inTitle = wbTitleKeyword(record.title, record.keys);
      if (inTitle.length > 1 && !record.keys.includes(record.titleName)) {
        record.titleName = "";
        record.ambiguousTitle = true;
      } else if (inTitle.length === 1 && !record.titleName) record.titleName = inTitle[0];
      else if (!record.titleName && !inTitle.length && (personTitle || personFields) && record.keys.length) {
        record.keywordCandidates = true;
      }
    }
    if (record.titleName && !nonPerson && (record.names.has(record.titleName) || found.get(record.titleName)?.trusted)) {
      if (!record.names.size || record.names.has(record.titleName)) {
        record.names.add(record.titleName);
        add(record.titleName, record, "已确认姓名对应标题");
      }
    }
  }
  for (const record of records) if (record.keywordCandidates && !record.nonPerson) {
    diagnostics.push({ book: record.book, title: record.title, reason: `仅有触发关键词，不能确定人物身份或别名归属：${record.keys.join("、")}` });
  }
  for (const record of records) {
    if (!record.names.size && found.has(record.titleName) && found.get(record.titleName).trusted) {
      record.names.add(record.titleName);
      add(record.titleName, record, "速览对应条目");
    }
    if (record.names.size === 1) {
      const person = found.get([...record.names][0]);
      if (!person) continue;
      const compactName = person.name.replace(/\s+/g, "");
      if (compactName !== person.name && /^[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}·・]+$/u.test(compactName)) person.aliases.push(compactName);
      const explicitAliases = [];
      const aliasText = normalizePersonText(record.content).replace(/\*\*|`/g, "");
      for (const match of aliasText.matchAll(/(?:^|[\n,{|])\s*[-*]?\s*["']?(?:别名|昵称|称呼|小名|曾用名|英文名|外文名|alias(?:es)?)["']?\s*[:=]\s*([^\n<>。}|]{1,100})/gimu)) {
        const index = match.index + match[0].search(/别名|昵称|称呼|小名|曾用名|英文名|外文名|alias/i);
        const nearest = record.identities.filter((identity) => identity.index < index).at(-1);
        if (identityScope(aliasText, index, record.title).blocked || nearest && nearest.name !== person.name) continue;
        explicitAliases.push(...wbNames(match[1]));
      }
      for (const alias of record.keys) if (alias !== person.name && !explicitAliases.includes(alias) && !person.aliases.includes(alias)) person.candidateAliases.push(alias);
      for (const alias of explicitAliases) if (alias !== person.name && !person.aliases.includes(alias)) person.aliases.push(alias);
    }
  }
  for (const record of records) {
    if (!record.accepted.size && !record.nonPerson && !/(?:物品|装备|武器|技能|组织|势力)/u.test(record.title) && record.titleName && !WB_STRUCTURAL.test(record.titleName) && !WB_PROSE.test(record.titleName)) add(record.titleName, record, "仅标题，待确认", false);
    if (!record.accepted.size) diagnostics.push({ book: record.book, title: record.title, reason: record.limit ? "人物词表已达到 1000 人上限" : record.ambiguousTitle ? "标题含多个姓名关键词，无法确定单一人物；可补充姓名字段" : record.titlePhrase ? "标题为所属短语，不作为人物姓名" : "未找到有效姓名、人物速览或可用人名标题" });
  }
  for (const person of found.values()) person.aliases = person.aliases.filter((alias) => isAutomaticPersonName(alias) && !(found.get(alias)?.trusted && alias !== person.name));
  for (const person of found.values()) person.candidateAliases = [...new Set(person.candidateAliases)].filter((alias) => isAutomaticPersonName(alias) && !person.aliases.includes(alias) && !found.get(alias)?.trusted);
  const owners = /* @__PURE__ */ new Map();
  for (const person of found.values()) for (const alias of [person.name, ...person.aliases]) {
    if (!owners.has(alias)) owners.set(alias, /* @__PURE__ */ new Set());
    owners.get(alias).add(person.name);
  }
  for (const person of found.values()) {
    person.aliases = [...new Set(person.aliases)];
    person.ambiguousAliases = person.aliases.filter((alias) => owners.get(alias).size > 1);
  }
  const ordered = new Set(records.flatMap((record) => [...record.accepted]));
  return [...ordered].map((name) => found.get(name));
}
function renderWorldbookPeopleList(doc, list, people, diagnostics = []) {
  list.className = "uos-worldbook-people";
  list.replaceChildren();
  if (!people.length) {
    const empty = doc.createElement("p");
    empty.textContent = "未提取到人物名单，可查看未采纳原因或在下方填写姓名与别名。";
    list.append(empty);
  }
  for (const person of people) {
    const row = doc.createElement("li"), name = doc.createElement("strong");
    name.textContent = `${person.name}${person.trusted === false ? "（待确认）" : ""}`;
    row.append(name);
    const aliases = doc.createElement("p");
    aliases.textContent = `别名：${person.aliases?.join("、") || "无"}${person.ambiguousAliases?.length ? `；冲突别名不自动匹配：${person.ambiguousAliases.join("、")}` : ""}`;
    const source = doc.createElement("p");
    source.textContent = `来源：${person.sources?.join("；") || "人物名单"}`;
    row.append(aliases, source);
    list.append(row);
    if (person.candidateAliases?.length) {
      const candidates = doc.createElement("p");
      candidates.textContent = `待确认关键词（未用于匹配）：${person.candidateAliases.join("、")}；可在人物与别名中确认。`;
      row.append(candidates);
    }
  }
  if (diagnostics.length) {
    const row = doc.createElement("li"), details = doc.createElement("details"), summary = doc.createElement("summary");
    summary.textContent = `读取诊断与未采纳原因（${diagnostics.length} 条）`;
    details.append(summary);
    for (const item of diagnostics.slice(0, 80)) {
      const text = doc.createElement("p");
      text.textContent = `${item.book} · ${item.title || "未命名条目"}：${item.reason}`;
      details.append(text);
    }
    if (diagnostics.length > 80) {
      const note = doc.createElement("p");
      note.textContent = "仅展示前 80 条未采纳条目。";
      details.append(note);
    }
    row.append(details);
    list.append(row);
  }
}
function formatWorldbookPeopleStatus(result) {
  const { people = [], books = [], boundBooks = books, entryCount = 0, warnings = [] } = result;
  const trusted = people.filter((person) => person.trusted !== false).length;
  const source = boundBooks.length ? `角色绑定世界书：${boundBooks.join("、")}（已读取 ${books.length}/${boundBooks.length} 本，${entryCount} 条）` : warnings.length ? "角色世界书读取不可用" : "当前角色未绑定世界书";
  return `${source}；提取人物：${trusted} 人${people.length > trusted ? `，待确认 ${people.length - trusted} 人` : ""}${warnings.length ? `；${warnings.join("；")}` : ""}。${trusted ? "按名单匹配全文，明确姓名标注可补充名单外人物。" : "继续识别正文中的明确姓名与人物名单；未知台词署名仅列为待确认。"}`;
}
function createWorldbookPeopleReader(helper) {
  const cache = /* @__PURE__ */ new Map();
  return async function read(card, { refresh = false } = {}) {
    const data = card?.data || card || {}, provided = typeof helper === "function" ? helper() : helper;
    const sources = (Array.isArray(provided) ? provided : [provided]).filter(Boolean);
    const find = (method) => {
      const owner = sources.find((source) => typeof source[method] === "function");
      return owner ? owner[method].bind(owner) : null;
    };
    const getNames = find("getCharWorldbookNames"), getOldNames = find("getCharLorebooks"), getPrimary = find("getCurrentCharPrimaryLorebook");
    let bindings = [], warnings = [], bindingRead = false;
    const calls = [getNames && (() => getNames("current")), getOldNames && (() => getOldNames({ name: "current", type: "all" })), getPrimary && (async () => ({ primary: await getPrimary(), additional: [] }))].filter(Boolean);
    for (const getBindings of calls) try {
      const names = await getBindings();
      if (!names || typeof names !== "object" || !("primary" in names || "additional" in names)) throw Error("返回格式异常");
      bindings = [...new Set([names.primary, ...Array.isArray(names.additional) ? names.additional : []].filter((x) => typeof x === "string" && x))];
      bindingRead = true;
      break;
    } catch {
    }
    if (!bindingRead) {
      const primary = data.extensions?.world ?? card?.extensions?.world;
      if (typeof primary === "string" && primary.trim()) {
        bindings = [primary];
        warnings.push("绑定接口不可用，按角色卡保存的主世界书绑定读取");
      } else warnings.push(calls.length ? "无法读取角色绑定的世界书" : "当前酒馆助手未提供角色世界书接口");
    }
    const getBook = find("getWorldbook"), getOldBook = find("getLorebookEntries");
    const key = JSON.stringify([card?.avatar || data.name || "", bindings, Boolean(getBook), Boolean(getOldBook)]);
    if (!refresh && cache.has(key)) return cache.get(key);
    const pending = (async () => {
      const books = [];
      if (bindings.length && !getBook && !getOldBook) warnings.push("当前酒馆助手未提供世界书读取接口");
      else for (const name of bindings) {
        let loaded = false, errorMessage = "";
        for (const fetchBook of [getBook, getOldBook].filter(Boolean)) try {
          const entries = await fetchBook(name);
          if (!Array.isArray(entries)) throw Error("返回格式异常");
          books.push({ name, entries });
          loaded = true;
          break;
        } catch (error) {
          errorMessage = String(error?.message || error).slice(0, 160);
        }
        if (!loaded) warnings.push(`世界书“${name}”读取失败${errorMessage ? `：${errorMessage}` : ""}`);
      }
      const diagnostics = [], people = extractWorldbookPeople(books, { diagnostics });
      return { people, diagnostics, books: books.map((book) => book.name), boundBooks: bindings, entryCount: books.reduce((count, book) => count + book.entries.length, 0), warnings };
    })();
    if (cache.size >= 8 && !cache.has(key)) cache.delete(cache.keys().next().value);
    cache.set(key, pending);
    const result = await pending;
    if (result.warnings.length && cache.get(key) === pending) cache.delete(key);
    return result;
  };
}

// src/greeting-analysis.js
function clean(text) {
  return String(text || "").replace(/<[^>]*>/g, " ").replace(/\{\{[^}]*\}\}/g, " ").replace(/[#*_`>\[\]()]/g, " ").replace(/\s+/g, " ").trim();
}
function excludedTags(value) {
  return [...new Set(String(value || "").split(/[，,、\s]+/).map((x) => x.trim().replace(/^<\/?|\/>?$/g, "")).filter((x) => /^[\w\p{Script=Han}-]{1,40}$/u.test(x)))].slice(0, 40);
}
function stripExcluded(text, tags) {
  for (const tag of tags) {
    const safe = tag.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    text = text.replace(new RegExp(`<${safe}(?:\\s[^<>]*)?>[\\s\\S]*?<\\/${safe}\\s*>`, "gi"), " ").replace(new RegExp(`<${safe}(?:\\s[^<>]*)?\\/?>`, "gi"), " ");
  }
  return text;
}
function narrativeStart(body, excluded = []) {
  let text = stripExcluded(String(body || ""), excluded).replace(/\r\n?/g, "\n").trim();
  const narrativeTag = /^(?:正文|content)$/i;
  for (let i = 0; i < 12 && text; i++) {
    const before = text;
    text = text.replace(/^<!--[\s\S]*?-->\s*/, "").replace(/^(?:```|~~~)[^\n]*\n[\s\S]*?\n(?:```|~~~)\s*/, "").trimStart();
    const pair = text.match(/^<([^\s<>/]+)(?:\s[^<>]*)?>\s*([\s\S]*?)\s*<\/\1>\s*/i);
    if (pair) {
      text = (narrativeTag.test(pair[1]) ? pair[2] : "") + text.slice(pair[0].length);
      text = text.trimStart();
    } else text = text.replace(/^<[^<>\n]{1,120}\/?>\s*/, "").trimStart();
    if (text === before) break;
  }
  return clean(text);
}
function greetingTitle(body, index, excluded = []) {
  const content = narrativeStart(body, excluded), sentence = content.match(/^.{1,64}?[。！？!?]/)?.[0];
  return sentence || `${content.slice(0, 56)}${content.length > 56 ? "…" : ""}` || `开场 ${index + 1}`;
}
var NON_PERSON_TAGS = /^(?:正文|content|scene|sceneinfo|status|state|thinking|think|时间|地点|日期|天气|状态|旁白|系统|说明|剧情|备注|年龄|性别|身份|关系|职业|外貌|角色|人物|姓名|名字|角色档案|人物档案|设定|世界观|标题|简介|开场|玩家|用户)$/i;
var NON_PERSON_LABELS = /^(?:时间|地点|日期|天气|姓名|名字|人物姓名|角色名|角色姓名|登场人物|在场角色|人物|角色|正文|内容|旁白|系统|状态|说明|剧情|备注|年龄|性别|身份|关系|身高|职业|性格|外貌|你|我|她|他|玩家|用户|场景类型)$/;
var COMMON_SURNAMES = "赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊甄曲封芮储靳邴松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶黎薄印宿白怀蒲台从鄂索咸籍赖卓蔺屠蒙池乔阴胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍却璩桑桂濮牛寿通边扈燕冀浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧殳沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查后荆红游竺权逯盖益桓公";
var PERSON_WORD = { test: isPersonName };
function personAliases(value) {
  const result = /* @__PURE__ */ new Map(), owners = /* @__PURE__ */ new Map(), canonicalNames = /* @__PURE__ */ new Set();
  for (const line of normalizePersonText(value).slice(0, 1500).split(/[;；\n]+/).slice(0, 40)) {
    const [canonical, ...rest] = line.split(/[=＝]/), name = canonical?.trim();
    if (!PERSON_WORD.test(name)) continue;
    canonicalNames.add(name);
    for (const alias of [name, ...rest.join("=").split(/[，,、/]+/).map((x) => x.trim())]) if (PERSON_WORD.test(alias)) {
      if (!owners.has(alias)) owners.set(alias, /* @__PURE__ */ new Set());
      owners.get(alias).add(name);
    }
  }
  for (const [alias, names] of owners) if (names.size === 1) result.set(alias, [...names][0]);
  for (const name of canonicalNames) result.set(name, name);
  result.conflicts = [...owners].filter(([alias, names]) => names.size > 1 && !canonicalNames.has(alias)).map(([alias]) => alias);
  return result;
}
function detectGreetingPeople(body, { knownNames = [], characterName = "", aliases = "", worldbookPeople = null } = {}) {
  const text = normalizePersonText(body);
  knownNames = knownNames.map(normalizePersonText);
  characterName = normalizePersonText(characterName).trim();
  const manual = personAliases(aliases);
  const userNames = /* @__PURE__ */ new Set([...knownNames, ...manual.values()]);
  const names = [], evidence = {}, suggestions = [];
  const dictionary = /* @__PURE__ */ new Map(), worldbookByName = /* @__PURE__ */ new Map(), owners = /* @__PURE__ */ new Map();
  for (const person of worldbookPeople || []) {
    if (!isAutomaticPersonName(person?.name)) continue;
    worldbookByName.set(person.name, person);
    for (const alias of [person.name, ...person.aliases || []]) if (isAutomaticPersonName(alias)) {
      if (!owners.has(alias)) owners.set(alias, /* @__PURE__ */ new Set());
      owners.get(alias).add(person.name);
    }
  }
  for (const [alias, people] of owners) if (people.size === 1) dictionary.set(alias, [...people][0]);
  for (const person of worldbookByName.values()) dictionary.set(person.name, person.name);
  for (const name of knownNames) if (PERSON_WORD.test(name)) dictionary.set(name, name);
  for (const [alias, name] of manual) dictionary.set(alias, name);
  for (const alias of manual.conflicts) if (!userNames.has(alias) && dictionary.get(alias) !== alias) dictionary.delete(alias);
  const weakCharacterName = isAutomaticPersonName(characterName) && !manual.conflicts.includes(characterName) && !dictionary.has(characterName) ? characterName : "";
  if (weakCharacterName) dictionary.set(weakCharacterName, weakCharacterName);
  const add = (name, source) => {
    if ((owners.get(name)?.size > 1 || manual.conflicts.includes(name)) && !dictionary.has(name)) return;
    const canonical = dictionary.get(name) || name;
    if (!PERSON_WORD.test(canonical) || NON_PERSON_LABELS.test(canonical) || !userNames.has(canonical) && !isAutomaticPersonName(canonical)) return;
    const confirmed = userNames.has(canonical) || worldbookByName.has(canonical) && worldbookByName.get(canonical).trusted !== false || names.includes(canonical);
    if (source !== "明确标注" && !confirmed) {
      if (!suggestions.includes(canonical)) suggestions.push(canonical);
      return;
    }
    if (!names.includes(canonical)) names.push(canonical);
    if (!evidence[canonical] || source === "明确标注") evidence[canonical] = source;
  };
  for (const identity of extractPersonIdentities(text, { descriptions: false })) {
    if (identity.trusted) add(identity.name, "明确标注");
    else if (!suggestions.includes(identity.name)) suggestions.push(identity.name);
  }
  for (const match of text.matchAll(/(?:^|[\n>])\s*(?:登场人物|在场角色)[：:]\s*([^\n<>。；;]{1,160})/gmu)) {
    if (!allowsPersonEvidence(text, match.index + match[0].search(/登场人物|在场角色/u))) continue;
    for (const name of match[1].split(/[、，,\/]+/).map((x) => x.trim())) if (isAutomaticPersonName(name)) add(name, "明确标注");
  }
  const lines = text.replace(/<\/?[^<>]*>/g, (tag) => " ".repeat(tag.length)).split("\n"), lineOffsets = [];
  let offset = 0;
  for (const line of lines) {
    lineOffsets.push(offset);
    offset += line.length + 1;
  }
  for (let i = 0; i < lines.length; i++) {
    if (!/^(?:(?:在场|出场|登场|主要|当前)?(?:角色|人物|人员|名单)|(?:角色|人物|人员)(?:名单|列表))[：:]\s*$/.test(lines[i].trim())) continue;
    if (!allowsPersonEvidence(text, lineOffsets[i] + lines[i].search(/\S/))) continue;
    for (let j = i + 1; j < Math.min(i + 15, lines.length); j++) {
      const item = lines[j].trim().match(/^(?:[-*•·]|\d+[.、])\s*([\p{Script=Han}]{2,12})(.*)$/u);
      if (!item) break;
      if (!allowsPersonEvidence(text, lineOffsets[j] + lines[j].search(/\S/))) continue;
      const head = item[1], tail = item[2];
      if (/的/u.test(head) || tail && !/^[\s:：|（(、，,]/u.test(tail)) continue;
      const costume = head.match(/^(.{2,4})(?:制服|校服|便服|常服|泳装)$/u);
      const name = costume?.[1] || head;
      if (isAutomaticPersonName(name)) {
        if (dictionary.has(name) || costume || [...name].length <= 4) add(name, "明确标注");
        else if (!suggestions.includes(name)) suggestions.push(name);
      }
    }
  }
  for (const match of text.matchAll(/<([\p{Script=Han}]{2,4})>\s*([^<>]{1,300})\s*<\/\1>/gmu)) {
    if (!NON_PERSON_TAGS.test(match[1]) && (dictionary.has(match[1]) || COMMON_SURNAMES.includes(match[1][0]) && /[：“”「」]/u.test(match[2])) && /[。！？!?：“”「」]/u.test(match[2])) add(match[1], "人物标签");
  }
  for (const match of text.matchAll(/<([\p{Script=Han}]{2,4})>\s*(?=[：:“「])/gmu)) {
    if (!NON_PERSON_TAGS.test(match[1]) && (dictionary.has(match[1]) || COMMON_SURNAMES.includes(match[1][0]))) add(match[1], "人物标签");
  }
  const story = text.replace(/<\/?[^<>]*>/g, "\n");
  for (const match of story.matchAll(/(?:^|\n)\s*(?:【|\[)?([^\n：:<>【】\[\]]{2,40})(?:】|\])?\s*[：:]\s*(?=[^\n]{1,80})/gmu)) {
    if (isPersonName(match[1].trim()) && !NON_PERSON_LABELS.test(match[1].trim())) add(match[1].trim(), "台词署名");
  }
  const occupied = [];
  const blockedAliases = /* @__PURE__ */ new Set([...manual.conflicts, ...[...owners].filter(([alias, names2]) => names2.size > 1 && !dictionary.has(alias)).map(([alias]) => alias)]);
  for (const alias of new Set([...dictionary.keys(), ...blockedAliases].sort((a, b) => b.length - a.length))) {
    const canonical = dictionary.get(alias);
    const safe = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const boundary = [...alias].length === 1 ? "[\\p{L}\\p{N}_]" : /[\p{Script=Latin}\p{N}]/u.test(alias) ? "[\\p{Script=Latin}\\p{N}_]" : null;
    const prefix = boundary ? `(?<!${boundary})` : "", suffix = boundary ? `(?!${boundary})` : "";
    for (const match of text.matchAll(new RegExp(`${prefix}${safe}${suffix}`, "gu"))) {
      const start = match.index, end = start + match[0].length;
      if (occupied.some(([a, b]) => start < b && end > a)) continue;
      occupied.push([start, end]);
      if (blockedAliases.has(alias) && !dictionary.has(alias)) continue;
      add(alias, worldbookByName.has(canonical) ? "世界书匹配" : "正文提及");
    }
  }
  for (const match of story.matchAll(/(?:^|[。！？!?\n])\s*([\p{Script=Han}]{2,4})(?=走|说|问|答|望|看|笑|喊|推|抱|站|坐|跑|听|握|抬|转|递)/gmu)) {
    const name = match[1];
    if (isAutomaticPersonName(name) && COMMON_SURNAMES.includes(name[0]) && !NON_PERSON_LABELS.test(name) && !names.includes(name) && !suggestions.includes(name)) suggestions.push(name);
  }
  return { names, evidence, suggestions: suggestions.filter((name) => !names.includes(name)).slice(0, 3) };
}
function detectGreetingCollection(bodies, options = {}) {
  const first = bodies.map((body) => detectGreetingPeople(body, options));
  const known = [.../* @__PURE__ */ new Set([...options.knownNames || [], ...first.flatMap((result) => result.names.filter((name) => result.evidence[name] === "明确标注"))])];
  return bodies.map((body) => detectGreetingPeople(body, { ...options, knownNames: known }));
}
function isLegacyGeneratedEntry(body, entry, index) {
  if (!entry || typeof entry !== "object") return false;
  const plain = clean(body), title = plain.slice(0, 20) || `开场 ${index + 1}`;
  return entry.title === title && (entry.description || "") === plain.slice(20, 88);
}

// src/opening-layout-styles.js
var OPENING_LAYOUT_CSS = `
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

// src/opening-categories.js
function openingMetadata(entry) {
  const group = typeof entry?.group === "string" ? entry.group.trim().slice(0, 60) : "";
  const input = Array.isArray(entry?.tags) ? entry.tags : typeof entry?.tags === "string" ? entry.tags.split(/[,，、\n]/) : [];
  const tags = [...new Set(input.filter((value) => typeof value === "string").map((value) => value.trim().slice(0, 30)).filter(Boolean))].slice(0, 12);
  return { group, tags };
}
function openingFacets(rows) {
  return { groups: [...new Set(rows.map((row) => row.group || ""))], tags: [...new Set(rows.flatMap((row) => row.tags || []))] };
}
function matchesOpening(row, { query = "", person = "", group = null, tag = "" } = {}) {
  if (person && !row.names?.includes(person)) return false;
  if (group !== null && (row.group || "") !== group) return false;
  if (tag && !row.tags?.includes(tag)) return false;
  const term = query.trim().toLocaleLowerCase();
  return !term || [row.title, row.description, row.label, row.body, row.group, ...row.names || [], ...row.tags || []].some((value) => String(value || "").toLocaleLowerCase().includes(term));
}
function partitionOpenings(rows, groupOrder = []) {
  if (!rows.some((row) => row.group)) return [{ group: null, rows }];
  const groups = /* @__PURE__ */ new Map();
  for (const row of rows) {
    const group = row.group || "";
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(row);
  }
  const result = [...groups].map(([group, entries]) => ({ group, rows: entries }));
  if (groupOrder.length) {
    const position = (group) => {
      const index = groupOrder.indexOf(group);
      return index < 0 ? groupOrder.length : index;
    };
    result.sort((a, b) => position(a.group) - position(b.group));
  }
  return result;
}

// src/reading-preferences.js
var READING_STORAGE_KEY = "uos_reading_preferences_v1";
var READING_FONT_SIZES = [["small", "小 · 14px", 14], ["standard", "标准 · 16px", 16], ["large", "大 · 18px", 18]];
var READING_LINE_SPACING = [["standard", "标准", 1.7], ["relaxed", "宽松", 2]];
function readingPreferences(input) {
  const value = input && typeof input === "object" ? input : {};
  return {
    fontSize: READING_FONT_SIZES.some(([id]) => id === value.fontSize) ? value.fontSize : "standard",
    lineSpacing: READING_LINE_SPACING.some(([id]) => id === value.lineSpacing) ? value.lineSpacing : "standard",
    focusBody: value.focusBody === true
  };
}
function createReadingPreferences(host) {
  let current = readingPreferences();
  return {
    read() {
      try {
        const raw = host?.localStorage?.getItem(READING_STORAGE_KEY);
        if (raw != null) current = readingPreferences(JSON.parse(raw));
      } catch {
      }
      return { ...current };
    },
    set(patch) {
      current = readingPreferences({ ...this.read(), ...patch });
      try {
        host?.localStorage?.setItem(READING_STORAGE_KEY, JSON.stringify(current));
      } catch {
      }
      return { ...current };
    }
  };
}

// src/opening-preview.js
var CSS = `
dialog.uos-opening-preview{position:fixed;inset:0;width:min(760px,calc(100vw - 24px));max-width:calc(100vw - 24px);height:min(850px,calc(100vh - 24px));height:min(850px,calc(100dvh - 24px));max-height:calc(100vh - 24px);max-height:calc(100dvh - 24px);margin:auto;padding:0;border:1px solid var(--line);border-radius:16px;background:var(--bg);color:var(--text);box-shadow:0 22px 70px #0007;font:14px/1.7 system-ui,sans-serif;z-index:2147483646;overflow:hidden;color-scheme:dark}
dialog.uos-opening-preview:is([data-theme=paper],[data-theme=school]){color-scheme:light}
.uos-opening-preview::backdrop{background:#0009}
.uos-opening-preview,.uos-opening-preview *{box-sizing:border-box}
.uos-opening-preview [hidden]{display:none!important}
.uos-opening-preview .uos-preview-window{display:flex;flex-direction:column;height:100%;min-height:0}
.uos-opening-preview .uos-preview-header,.uos-opening-preview .uos-preview-footer{display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:12px 18px;background:var(--surface);flex:none}
.uos-opening-preview .uos-preview-header{justify-content:space-between;border-bottom:1px solid var(--line)}
.uos-opening-preview .uos-preview-footer{border-top:1px solid var(--line)}
.uos-opening-preview .uos-preview-pager{margin:0 auto 0 0;color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.uos-opening-preview button{appearance:none!important;min-height:44px;padding:8px 13px!important;border:1px solid var(--line)!important;border-radius:8px!important;background:var(--surface)!important;color:var(--text)!important;font:inherit!important;cursor:pointer;box-shadow:none!important}
.uos-opening-preview button:disabled{opacity:.45;cursor:default}
.uos-opening-preview :is(button,select,summary):focus-visible{outline:2px solid var(--accent)!important;outline-offset:2px}
.uos-opening-preview .uos-preview-select{background:var(--accent)!important;color:var(--bg)!important;font-weight:600!important}
.uos-opening-preview .uos-preview-reading{flex-basis:100%;min-width:0;color:var(--muted);font-size:12px}
.uos-opening-preview .uos-preview-reading>summary{min-height:32px;padding:5px 0;color:var(--accent);cursor:pointer}
.uos-opening-preview .uos-preview-reading-controls{display:grid;grid-template-columns:repeat(2,minmax(0,1fr)) auto;align-items:end;gap:10px;padding:6px 0}
.uos-opening-preview .uos-preview-reading-controls label{display:grid;gap:4px;min-width:0;margin:0!important;padding:0!important}
.uos-opening-preview .uos-preview-reading-controls :is(select,.uos-preview-focus){height:44px!important;min-height:44px!important;max-height:44px!important;box-sizing:border-box!important;margin:0!important;font:14px/1.5 system-ui,sans-serif!important;align-self:end}
.uos-opening-preview .uos-preview-reading-controls select{min-width:0;width:100%;padding:8px 10px!important;border:1px solid var(--line)!important;border-radius:8px!important;background:var(--surface)!important;color:var(--text)!important;color-scheme:inherit}
.uos-opening-preview .uos-preview-focus{display:flex;align-items:center;justify-content:center;white-space:nowrap}
@media(max-width:480px){.uos-opening-preview .uos-preview-reading-controls{grid-template-columns:repeat(2,minmax(0,1fr))}.uos-opening-preview .uos-preview-focus{grid-column:1/-1;width:100%}}
.uos-opening-preview .uos-preview-focus[aria-pressed=true]{border-color:var(--accent)!important;background:var(--bg)!important;color:var(--accent)!important;box-shadow:inset 0 0 0 1px var(--accent)!important}
.uos-opening-preview .uos-preview-content{overflow:auto;min-height:0;flex:1;overscroll-behavior:contain;padding:18px;scrollbar-width:thin}
.uos-opening-preview .uos-preview-cover{width:100%;height:clamp(130px,27vw,300px);background-size:cover;background-position:center;background-color:var(--surface);border-radius:10px;margin:0 0 18px}
.uos-opening-preview .uos-preview-title{margin:0;color:var(--text);font:600 24px/1.5 Georgia,"Noto Serif SC",serif;overflow-wrap:anywhere}
.uos-opening-preview .uos-preview-label{margin:6px 0 12px;color:var(--accent);font-size:12px;overflow-wrap:anywhere}
.uos-opening-preview .uos-preview-description{white-space:pre-wrap;overflow-wrap:anywhere;margin:12px 0;color:var(--muted)}
.uos-opening-preview .uos-preview-cast{display:flex;flex-wrap:wrap;gap:7px;align-items:center;margin:16px 0}
.uos-opening-preview .uos-preview-cast span{padding:3px 9px;border:1px solid var(--line);border-radius:6px;font-size:12px;color:var(--text);overflow-wrap:anywhere;max-width:100%}
.uos-opening-preview .uos-preview-cast-label{color:var(--muted);font-size:12px}
.uos-opening-preview .uos-preview-taxonomy{display:flex;flex-wrap:wrap;gap:7px;margin:12px 0;color:var(--muted);font-size:12px;overflow-wrap:anywhere}
.uos-opening-preview .uos-preview-taxonomy span{padding:3px 8px;border:1px solid var(--line);border-radius:5px;max-width:100%}
.uos-opening-preview .uos-preview-body{white-space:pre-wrap;overflow-wrap:anywhere;margin:18px 0 0;padding:18px 0;border-top:1px solid var(--line);color:var(--text);font:inherit;font-size:var(--uos-reading-font-size,16px);line-height:var(--uos-reading-line-height,1.7);word-break:normal}
.uos-opening-preview .uos-preview-diagnostics{margin:12px 0;color:var(--muted);font-size:12px}
.uos-opening-preview .uos-preview-diagnostics summary{cursor:pointer;color:var(--accent)}
.uos-opening-preview .uos-preview-diagnostics p{overflow-wrap:anywhere;margin:8px 0}
@media(max-width:480px){dialog.uos-opening-preview{width:calc(100vw - 16px);height:calc(100vh - 16px);height:calc(100dvh - 16px);max-height:calc(100vh - 16px);max-height:calc(100dvh - 16px);border-radius:12px}.uos-opening-preview .uos-preview-content{padding:14px}.uos-opening-preview .uos-preview-header,.uos-opening-preview .uos-preview-footer{padding:10px 12px;gap:8px}.uos-opening-preview .uos-preview-footer button{flex:1}.uos-opening-preview .uos-preview-pager{flex-basis:100%;text-align:center;margin:0}.uos-opening-preview button{min-height:44px;padding:8px}.uos-opening-preview .uos-preview-title{font-size:21px}}
`;
function createOpeningPreview({ doc, getItems, getPalette, onChoose, host = doc.defaultView }) {
  let disposed = false, active = null;
  const preferences = createReadingPreferences(host);
  const style = doc.createElement("style");
  style.dataset.uosPreviewStyle = "";
  style.textContent = CSS + defaultCoverStyles(".uos-opening-preview");
  (doc.head || doc.documentElement).append(style);
  const el = (tag, cls = "", text) => {
    const node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = String(text);
    return node;
  };
  function close() {
    const current = active;
    if (!current) return;
    active = null;
    current.dialog.removeEventListener("keydown", current.onKey);
    if (current.dialog.open) current.dialog.close();
    current.dialog.remove();
    try {
      if (current.trigger?.isConnected) current.trigger.focus();
    } catch {
    }
  }
  function open(id, trigger, scopeItems) {
    if (disposed) return false;
    const items = (scopeItems || getItems()).slice(), start = items.findIndex((item) => item.id === id);
    if (start < 0) return false;
    close();
    const dialog = el("dialog", "uos-opening-preview");
    dialog.setAttribute("aria-label", "完整开场预览");
    dialog.setAttribute("aria-modal", "true");
    const palette = getPalette(), computed = palette.ownerDocument.defaultView.getComputedStyle(palette);
    dialog.dataset.theme = palette.dataset.theme || "archive";
    for (const key of ["--bg", "--surface", "--text", "--muted", "--accent", "--line"]) dialog.style.setProperty(key, computed.getPropertyValue(key) || computed.getPropertyValue("--panel"));
    const window2 = el("div", "uos-preview-window"), header = el("div", "uos-preview-header"), heading = el("span", "", "完整开场预览"), exit = el("button", "", "关闭预览");
    exit.type = "button";
    exit.onclick = close;
    header.append(heading, exit);
    const reading = el("details", "uos-preview-reading"), readingSummary = el("summary", "", "阅读设置"), controls = el("div", "uos-preview-reading-controls");
    reading.append(readingSummary, controls);
    header.append(reading);
    const font = el("select", "uos-preview-font-size"), spacing = el("select", "uos-preview-line-spacing"), focus = el("button", "uos-preview-focus", "专注正文");
    focus.type = "button";
    for (const [select, title, options] of [[font, "正文字号", READING_FONT_SIZES], [spacing, "正文行距", READING_LINE_SPACING]]) {
      const label = el("label");
      label.append(el("span", "", title), select);
      select.setAttribute("aria-label", title);
      for (const [id2, name] of options) {
        const option = el("option", "", name);
        option.value = id2;
        select.append(option);
      }
      controls.append(label);
    }
    controls.append(focus);
    const content = el("div", "uos-preview-content"), footer = el("div", "uos-preview-footer"), pager = el("p", "uos-preview-pager"), previous = el("button", "", "上一条"), next = el("button", "", "下一条"), choose = el("button", "uos-preview-select", "选择此开场");
    for (const button of [previous, next, choose]) button.type = "button";
    pager.setAttribute("role", "status");
    footer.append(pager, previous, next, choose);
    window2.append(header, content, footer);
    dialog.append(window2);
    let index = start, prefs = preferences.read(), extras = [], diagnosticsSummary = null;
    function applyReading(next2 = prefs) {
      prefs = next2;
      font.value = prefs.fontSize;
      spacing.value = prefs.lineSpacing;
      focus.setAttribute("aria-pressed", String(prefs.focusBody));
      dialog.style.setProperty("--uos-reading-font-size", READING_FONT_SIZES.find(([id2]) => id2 === prefs.fontSize)[2] + "px");
      dialog.style.setProperty("--uos-reading-line-height", String(READING_LINE_SPACING.find(([id2]) => id2 === prefs.lineSpacing)[2]));
      for (const node of extras) node.hidden = prefs.focusBody;
    }
    function changeReading(patch) {
      if (disposed || active?.dialog !== dialog) return;
      applyReading(preferences.set(patch));
    }
    font.onchange = () => changeReading({ fontSize: font.value });
    spacing.onchange = () => changeReading({ lineSpacing: spacing.value });
    focus.onclick = () => changeReading({ focusBody: !prefs.focusBody });
    function render() {
      const item = items[index];
      content.replaceChildren();
      extras = [];
      diagnosticsSummary = null;
      const cover = el("div", "uos-preview-cover");
      cover.setAttribute("aria-hidden", "true");
      applyOpeningCover(cover, item, item.body, item.coverIndex ?? item.id, host);
      content.append(cover);
      const label = el("p", "uos-preview-label", `开场 ${item.number} ${item.label ? "· " + item.label : ""}`);
      content.append(el("h2", "uos-preview-title", item.title), label);
      extras.push(cover, label);
      if (item.description) {
        const description = el("p", "uos-preview-description", item.description);
        content.append(description);
        extras.push(description);
      }
      const metadata = openingMetadata(item);
      if (metadata.group || metadata.tags.length) {
        const taxonomy = el("div", "uos-preview-taxonomy");
        if (metadata.group) taxonomy.append(el("span", "", `分组 · ${metadata.group}`));
        for (const tag of metadata.tags) taxonomy.append(el("span", "", tag));
        content.append(taxonomy);
        extras.push(taxonomy);
      }
      if (item.names?.length) {
        const cast = el("div", "uos-preview-cast");
        cast.append(el("b", "uos-preview-cast-label", "全部人物"));
        for (const name of item.names) cast.append(el("span", "", name));
        content.append(cast);
        extras.push(cast);
      }
      content.append(el("pre", "uos-preview-body", item.body));
      if (item.titleSource || item.suggestions?.length) {
        const info = el("details", "uos-preview-diagnostics");
        diagnosticsSummary = el("summary", "", "识别信息");
        info.append(diagnosticsSummary);
        if (item.titleSource) info.append(el("p", "", `标题：${item.titleSource}`));
        if (item.suggestions?.length) info.append(el("p", "", `待确认人物：${item.suggestions.join("、")}`));
        content.append(info);
        extras.push(info);
      }
      applyReading();
      pager.textContent = `${index + 1} / ${items.length}`;
      previous.disabled = index === 0;
      next.disabled = index === items.length - 1;
      choose.disabled = Boolean(item.isCurrent);
      choose.textContent = item.isCurrent ? "当前开场" : "选择此开场";
      content.scrollTop = 0;
    }
    previous.onclick = () => {
      if (index > 0) {
        index--;
        render();
      }
    };
    next.onclick = () => {
      if (index < items.length - 1) {
        index++;
        render();
      }
    };
    choose.onclick = () => {
      if (disposed || active?.dialog !== dialog || choose.disabled) return;
      const item = items[index];
      close();
      void onChoose(item);
    };
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close();
        return;
      }
      if (event.key === "Tab") {
        const buttons = [exit, readingSummary, ...reading.open ? [font, spacing, focus] : [], ...diagnosticsSummary && !prefs.focusBody ? [diagnosticsSummary] : [], previous, next, choose].filter((button) => !button.disabled), first = buttons[0], last = buttons.at(-1);
        if (event.shiftKey && doc.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && doc.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    active = { dialog, trigger, onKey };
    dialog.addEventListener("keydown", onKey);
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      close();
    });
    dialog.addEventListener("close", () => {
      if (active?.dialog === dialog) close();
    });
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) close();
    });
    doc.body.append(dialog);
    render();
    try {
      dialog.showModal();
    } catch {
      dialog.setAttribute("open", "");
      dialog.setAttribute("role", "dialog");
    }
    exit.focus();
    return true;
  }
  return { open, close, dispose() {
    if (disposed) return;
    disposed = true;
    close();
    style.remove();
  } };
}

// src/opening-category-ui.js
function createOpeningCategoryFilters({ el, onChange }) {
  const element = el("div", "uos-opening-filters"), groupLabel = el("label", "uos-opening-filter"), tagLabel = el("label", "uos-opening-filter"), group = el("select"), tag = el("select");
  group.setAttribute("aria-label", "按分组筛选");
  tag.setAttribute("aria-label", "按标签筛选");
  groupLabel.append(el("span", "", "分组"), group);
  tagLabel.append(el("span", "", "标签"), tag);
  element.append(groupLabel, tagLabel);
  group.onchange = tag.onchange = onChange;
  function options(select, values, all, format) {
    const selected = select.value;
    select.replaceChildren();
    for (const [value, label] of [["", all], ...values.map(format)]) {
      const option = el("option", "", label);
      option.value = value;
      select.append(option);
    }
    select.value = [...select.children].some((option) => option.value === selected) ? selected : "";
  }
  return {
    element,
    update(rows) {
      const facets = openingFacets(rows), hasGroups = facets.groups.some(Boolean), hasTags = facets.tags.length > 0;
      options(group, hasGroups ? facets.groups : [], "全部分组", (value) => ["g:" + value, value || "未分组"]);
      options(tag, facets.tags, "全部标签", (value) => [value, value]);
      groupLabel.hidden = !hasGroups;
      tagLabel.hidden = !hasTags;
      element.hidden = !hasGroups && !hasTags;
    },
    values() {
      return { group: group.value?.startsWith("g:") ? group.value.slice(2) : null, tag: tag.value || "" };
    }
  };
}
function createOpeningGroupRenderer({ el, gridClass }) {
  const collapsed = /* @__PURE__ */ new Map();
  return { render(rows, container, appendCard, allRows = rows) {
    const groups = partitionOpenings(rows, openingFacets(allRows).groups);
    container.dataset.grouped = String(groups.some((group) => group.group !== null));
    for (const { group, rows: entries } of groups) {
      if (group === null) {
        entries.forEach((row) => appendCard(row, container));
        continue;
      }
      const section = el("details", "uos-opening-group"), summary = el("summary"), grid = el("div", gridClass + " uos-group-grid");
      section.open = !collapsed.get(group);
      summary.append(el("span", "uos-opening-group-title", group || "未分组"), el("span", "uos-opening-group-count", `${entries.length} 个开场`));
      section.append(summary, grid);
      container.append(section);
      summary.addEventListener("click", () => {
        if (section.isConnected !== false) collapsed.set(group, section.open);
      });
      section.addEventListener("toggle", () => {
        if (section.isConnected !== false) collapsed.set(group, !section.open);
      });
      entries.forEach((row) => appendCard(row, grid));
    }
  } };
}
function openingTagChips(el, tags) {
  if (!tags?.length) return null;
  const row = el("div", "uos-opening-tags");
  for (const tag of tags.slice(0, 3)) row.append(el("span", "", tag));
  if (tags.length > 3) row.append(el("span", "", `+${tags.length - 3}`));
  return row;
}

// src/opening-category-styles.js
var OPENING_CATEGORY_CSS = `
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

// src/opening-action-styles.js
var OPENING_ACTION_CSS = `
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
function decorateOpeningPreviewButton(button, el) {
  const icon = el("span", "uos-reading-icon"), arrow = el("span", "uos-reading-arrow", "→");
  icon.setAttribute("aria-hidden", "true");
  arrow.setAttribute("aria-hidden", "true");
  button.replaceChildren(icon, el("span", "uos-reading-label", "预览完整正文"), arrow);
}

// src/update-control.js
function bindUpdateControl(button, hostDocument, { versionElements = [], autoCheckInput = null, autoCheckHint = null } = {}) {
  const doc = button.ownerDocument, host = hostDocument.defaultView || hostDocument;
  const label = doc.createElement("span");
  label.textContent = "检查更新";
  button.textContent = "";
  button.setAttribute("data-uos-update-control", "");
  button.type = "button";
  button.style.whiteSpace = "nowrap";
  button.append(label);
  const result = doc.createElement("p");
  result.setAttribute("data-uos-update-result", "");
  result.setAttribute("role", "status");
  result.setAttribute("aria-live", "polite");
  result.style.cssText = "margin:12px 0 0;padding:10px 12px;border:1px solid var(--accent,#817489);border-radius:9px;background:var(--bg,transparent);color:var(--text,inherit);font:inherit;line-height:1.6;white-space:pre-wrap;overflow-wrap:anywhere";
  button.after(result);
  const stars = versionElements.map((version) => {
    let star = version.querySelector?.("[data-uos-update-star]");
    if (!star) {
      star = doc.createElement("sup");
      star.className = "uos-update-star";
      star.dataset.uosUpdateStar = "";
      star.textContent = "✦";
      star.setAttribute("aria-hidden", "true");
      star.title = "有新版本，可在设置中查看更新说明";
      version.append(star);
    }
    return star;
  });
  function sync() {
    const api = hostDocument.__uosUpdater, pending = !!api?.hasUpdate, busy = !!api?.busy;
    stars.forEach((star) => {
      star.hidden = !pending;
    });
    if (autoCheckInput) autoCheckInput.checked = api?.autoCheckEnabled !== false;
    result.textContent = api?.statusMessage || "";
    result.hidden = !result.textContent;
    if (autoCheckHint) autoCheckHint.textContent = api?.autoCheckEnabled === false ? "启动时不自动检查；仍可手动检查更新。" : "启动时检查新版本；也可以随时手动检查。";
    label.textContent = busy ? "检查中…" : "检查更新";
    button.disabled = busy;
    button.setAttribute("aria-label", busy ? "正在检查更新" : pending ? "查看新版更新说明" : "检查更新");
    button.title = busy ? "正在检查更新" : pending ? "有新版本，点击查看更新说明" : "检查当前通道是否有新版本";
  }
  if (autoCheckInput) autoCheckInput.onchange = () => {
    const saved = hostDocument.__uosUpdater?.setAutoCheckEnabled?.(autoCheckInput.checked);
    sync();
    if (autoCheckHint) autoCheckHint.textContent = saved === false ? "设置未能保存在本机，请检查浏览器存储权限。" : autoCheckInput.checked ? "启动时检查新版本；也可以随时手动检查。" : "启动时不自动检查；仍可手动检查更新。";
  };
  button.onclick = async () => {
    const api = hostDocument.__uosUpdater;
    if (!api?.check) {
      if (autoCheckHint) autoCheckHint.textContent = "当前启动脚本不支持检查更新，请替换为最新导入脚本。";
      return;
    }
    for (const selector of [hostDocument.__uosPlayer, hostDocument.__uosAuthor]) if (await selector?.prepareForUpdate?.() === false) return;
    const checking = api.check(true);
    sync();
    await checking;
    sync();
  };
  sync();
  const timer = host.setInterval(() => {
    if (button.isConnected === false) stop();
    else sync();
  }, 1e3);
  function stop() {
    host.clearInterval(timer);
    doc.defaultView?.removeEventListener?.("pagehide", stop);
  }
  doc.defaultView?.addEventListener?.("pagehide", stop, { once: true });
  return stop;
}

// src/worldbook-presets.js
var uidKey = (value) => value == null || String(value) === "" ? null : String(value);
function normalizeEntry(entry) {
  const uid = uidKey(entry?.uid ?? entry?.id);
  if (uid == null || typeof entry?.enabled !== "boolean") return null;
  return {
    uid: entry.uid ?? entry.id,
    name: String(entry.name || entry.comment || `条目 ${uid}`).slice(0, 160),
    enabled: entry.enabled
  };
}
function withEnabledState(entry, enabled) {
  if (Object.prototype.hasOwnProperty.call(entry, "enabled") || !Object.prototype.hasOwnProperty.call(entry, "disable")) {
    return { ...entry, enabled, ...Object.prototype.hasOwnProperty.call(entry, "disable") ? { disable: !enabled } : {} };
  }
  return { ...entry, disable: !enabled };
}
function normalizeWorldbookPreset(input) {
  if (!input || typeof input !== "object" || !Array.isArray(input.books)) return null;
  const books = [];
  const seenBooks = /* @__PURE__ */ new Set();
  for (const book of input.books.slice(0, 128)) {
    const name = typeof book?.name === "string" ? book.name.trim().slice(0, 300) : "";
    if (!name || seenBooks.has(name) || !Array.isArray(book.entries)) continue;
    seenBooks.add(name);
    const seenUids = /* @__PURE__ */ new Set();
    const entries = [];
    for (const raw of book.entries.slice(0, 1e4)) {
      const entry = normalizeEntry(raw);
      const key = entry && uidKey(entry.uid);
      if (!entry || seenUids.has(key)) continue;
      seenUids.add(key);
      entries.push(entry);
    }
    if (entries.length) books.push({ name, entries });
  }
  return books.length ? { version: 1, books } : null;
}
function uniqueValue(base, used, separator) {
  let value = base;
  let index = 2;
  while (used.has(value)) value = base + separator + index++;
  used.add(value);
  return value;
}
function normalizeWorldbookPresetLibrary(input) {
  const presets = [];
  const ids = /* @__PURE__ */ new Set();
  const names = /* @__PURE__ */ new Set();
  for (const [index, raw] of (Array.isArray(input) ? input.slice(0, 500) : []).entries()) {
    const snapshot = normalizeWorldbookPreset(raw);
    if (!snapshot) continue;
    const idBase = typeof raw?.id === "string" ? raw.id.trim().slice(0, 120) : "";
    const id = uniqueValue(idBase || "worldbook-" + (index + 1), ids, "-");
    const nameBase = String(raw?.name || "世界书预设 " + (index + 1)).trim().slice(0, 120) || "世界书预设 " + (index + 1);
    const name = uniqueValue(nameBase, names, " ");
    presets.push({ id, name, ...snapshot });
  }
  return presets;
}
function migrateWorldbookPresetAssignments(rawEntries, rawPresets) {
  const presets = normalizeWorldbookPresetLibrary(rawPresets);
  const ids = new Set(presets.map((preset) => preset.id));
  const names = new Set(presets.map((preset) => preset.name));
  const entries = (Array.isArray(rawEntries) ? rawEntries : []).map((raw, index) => {
    const source = raw && typeof raw === "object" ? raw : {};
    const entry = { ...source };
    delete entry.worldbookPreset;
    const assigned = typeof source.worldbookPresetId === "string" ? source.worldbookPresetId.trim() : "";
    if (assigned && ids.has(assigned)) {
      entry.worldbookPresetId = assigned;
      return entry;
    }
    delete entry.worldbookPresetId;
    const snapshot = normalizeWorldbookPreset(source.worldbookPreset);
    if (!snapshot || presets.length >= 500) return entry;
    const id = uniqueValue("legacy-opening-" + (index + 1), ids, "-");
    const title = String(source.title || "开场 " + (index + 1)).trim().slice(0, 80);
    const name = uniqueValue("开场 " + (index + 1) + " · " + title, names, " ");
    presets.push({ id, name, ...snapshot });
    entry.worldbookPresetId = id;
    return entry;
  });
  return { entries, presets };
}
function captureWorldbookPreset(books) {
  const snapshot = normalizeWorldbookPreset({
    version: 1,
    books: (Array.isArray(books) ? books : []).map((book) => ({
      name: book.name,
      entries: (Array.isArray(book.entries) ? book.entries : []).map((entry) => ({
        uid: entry.uid ?? entry.id,
        name: entry.name || entry.comment || "",
        enabled: entry.enabled !== false && entry.disable !== true
      }))
    }))
  });
  if (!snapshot) throw Error("没有可记录开关状态的角色世界书条目");
  return snapshot;
}
function createWorldbookPresetManager(getSources, getCard) {
  function sources() {
    const value = typeof getSources === "function" ? getSources() : getSources;
    return (Array.isArray(value) ? value : [value]).filter(Boolean);
  }
  function find(method) {
    const owner = sources().find((source) => typeof source?.[method] === "function");
    return owner ? owner[method].bind(owner) : null;
  }
  async function readBindings() {
    const calls = [
      find("getCharWorldbookNames") && (() => find("getCharWorldbookNames")("current")),
      find("getCharLorebooks") && (() => find("getCharLorebooks")({ name: "current", type: "all" })),
      find("getCurrentCharPrimaryLorebook") && (async () => ({ primary: await find("getCurrentCharPrimaryLorebook")(), additional: [] }))
    ].filter(Boolean);
    for (const get of calls) {
      try {
        const result = await get();
        if (!result || typeof result !== "object" || !("primary" in result || "additional" in result)) continue;
        return [...new Set([result.primary, ...Array.isArray(result.additional) ? result.additional : []].filter((name) => typeof name === "string" && name.trim()).map((name) => name.trim()))];
      } catch {
      }
    }
    const card = getCard?.(), data = card?.data || card || {};
    const primary = data.extensions?.world ?? card?.extensions?.world;
    if (typeof primary === "string" && primary.trim()) return [primary.trim()];
    throw Error(calls.length ? "无法读取当前角色绑定的世界书" : "酒馆助手未提供角色世界书绑定接口");
  }
  async function read() {
    const bindings = await readBindings();
    const getWorldbook = find("getWorldbook");
    const getLorebookEntries = find("getLorebookEntries");
    const books = [], warnings = [];
    if (bindings.length && !getWorldbook && !getLorebookEntries) {
      throw Error("酒馆助手未提供世界书条目读取接口");
    }
    for (const name of bindings) {
      let loaded = false, error = "";
      for (const get of [getWorldbook, getLorebookEntries].filter(Boolean)) {
        try {
          const entries = await get(name);
          if (!Array.isArray(entries)) throw Error("返回格式异常");
          books.push({ name, entries });
          loaded = true;
          break;
        } catch (cause) {
          error = String(cause?.message || cause).slice(0, 140);
        }
      }
      if (!loaded) warnings.push(`“${name}”读取失败${error ? `：${error}` : ""}`);
    }
    if (bindings.length && !books.length) throw Error(`角色绑定的世界书无法读取${warnings.length ? `：${warnings.join("；")}` : ""}`);
    return { books, bindings, warnings, entryCount: books.reduce((sum, book) => sum + book.entries.length, 0) };
  }
  function updateMethod(assertCurrent = () => {
  }) {
    const updateWith = find("updateWorldbookWith");
    if (updateWith) return async (name, states, sourceEntries) => {
      assertCurrent();
      await updateWith(name, (entries) => {
        assertCurrent();
        const found = /* @__PURE__ */ new Set();
        const updated = entries.map((entry) => {
          const key = uidKey(entry.uid ?? entry.id);
          if (!states.has(key)) return entry;
          found.add(key);
          return withEnabledState(entry, states.get(key));
        });
        if ([...states.keys()].some((key) => !found.has(key))) throw Error(`世界书“${name}”的条目已变化`);
        return updated;
      }, { render: "immediate" });
    };
    const replaceWorldbook = find("replaceWorldbook");
    if (replaceWorldbook) return async (name, states, sourceEntries) => {
      const found = /* @__PURE__ */ new Set();
      const updated = sourceEntries.map((entry) => {
        const key = uidKey(entry.uid ?? entry.id);
        if (!states.has(key)) return entry;
        found.add(key);
        return withEnabledState(entry, states.get(key));
      });
      if ([...states.keys()].some((key) => !found.has(key))) throw Error(`世界书“${name}”的条目已变化`);
      assertCurrent();
      await replaceWorldbook(name, updated, { render: "immediate" });
    };
    const setEntries = find("setLorebookEntries");
    if (setEntries) return async (name, states, sourceEntries) => {
      const byUid = new Map(sourceEntries.map((entry) => [uidKey(entry.uid ?? entry.id), entry]));
      const updates = [...states].map(([uid, enabled]) => {
        const current = byUid.get(uid);
        if (!current) throw Error(`世界书“${name}”的条目已变化`);
        return Object.prototype.hasOwnProperty.call(current, "disable") ? { uid: current.uid ?? current.id, disable: !enabled, ...Object.prototype.hasOwnProperty.call(current, "enabled") ? { enabled } : {} } : { uid: current.uid ?? current.id, enabled };
      });
      assertCurrent();
      await setEntries(name, updates);
    };
    const replaceLorebookEntries = find("replaceLorebookEntries");
    if (replaceLorebookEntries) return async (name, states, sourceEntries) => {
      const found = /* @__PURE__ */ new Set();
      const updated = sourceEntries.map((entry) => {
        const key = uidKey(entry.uid ?? entry.id);
        if (!states.has(key)) return entry;
        found.add(key);
        return withEnabledState(entry, states.get(key));
      });
      if ([...states.keys()].some((key) => !found.has(key))) throw Error(`世界书“${name}”的条目已变化`);
      assertCurrent();
      await replaceLorebookEntries(name, updated, { render: "immediate" });
    };
    return null;
  }
  async function apply(rawPreset) {
    const preset = normalizeWorldbookPreset(rawPreset);
    if (!preset) throw Error("这个开场还没有有效的世界书预设");
    const originalCard = getCard?.(), identity = originalCard?.avatar || originalCard;
    const assertCurrent = () => {
      const card = getCard?.();
      if ((card?.avatar || card) !== identity) throw Error("当前角色已切换，已停止应用世界书预设");
    };
    const current = await read();
    assertCurrent();
    if (current.warnings.length) throw Error(`角色绑定的世界书未能全部读取，已停止切换：${current.warnings.join("；")}`);
    const byName = new Map(current.books.map((book) => [book.name, book]));
    const plans = preset.books.map((saved) => {
      const book = byName.get(saved.name);
      if (!book) throw Error(`世界书“${saved.name}”当前未绑定或无法读取，请在作者设置中重新记录此开场的预设`);
      const currentByUid = /* @__PURE__ */ new Map();
      for (const entry of book.entries) {
        const key = uidKey(entry.uid ?? entry.id);
        if (key == null) continue;
        if (currentByUid.has(key)) throw Error(`世界书“${saved.name}”存在重复条目编号，已停止切换以避免误改`);
        currentByUid.set(key, entry);
      }
      const desired = new Map(saved.entries.map((entry) => [uidKey(entry.uid), entry.enabled]));
      const before = /* @__PURE__ */ new Map();
      for (const [uid] of desired) {
        const found = currentByUid.get(uid);
        if (!found) throw Error(`世界书“${saved.name}”中的条目已删除或编号变化，请重新记录此开场的预设`);
        before.set(uid, found.enabled !== false && found.disable !== true);
      }
      return { name: saved.name, entries: book.entries, desired, before };
    });
    const configuredBooks = new Set(preset.books.map((book) => book.name));
    const unconfiguredBindings = current.bindings.filter((name) => !configuredBooks.has(name));
    if (unconfiguredBindings.length) throw Error(`角色新增了尚未记录到此开场的绑定世界书：${unconfiguredBindings.join("、")}；请重新记录预设`);
    const write = updateMethod(assertCurrent), restore = updateMethod();
    if (!write) throw Error("当前酒馆助手没有可用的世界书条目写入接口");
    const changed = plans.filter((plan) => [...plan.desired].some(([uid, enabled]) => plan.before.get(uid) !== enabled));
    const attempted = [];
    try {
      for (const plan of changed) {
        attempted.push(plan);
        await write(plan.name, plan.desired, plan.entries);
        assertCurrent();
      }
    } catch (cause) {
      const rollbackErrors = [];
      for (const plan of attempted.reverse()) {
        try {
          await restore(plan.name, plan.before, plan.entries);
        } catch (error) {
          rollbackErrors.push(`${plan.name}：${String(error?.message || error)}`);
        }
      }
      const detail = rollbackErrors.length ? `；自动恢复也失败（${rollbackErrors.join("；")}）` : "；已恢复切换前状态";
      throw Error(`切换世界书失败：${String(cause?.message || cause)}${detail}`);
    }
    let rolledBack = false;
    return {
      changedBooks: changed.length,
      changedEntries: changed.reduce((sum, plan) => sum + [...plan.desired].filter(([uid, enabled]) => plan.before.get(uid) !== enabled).length, 0),
      rollback: async () => {
        if (rolledBack) return;
        const errors = [];
        for (const plan of [...changed].reverse()) {
          try {
            await restore(plan.name, plan.before, plan.entries);
          } catch (error) {
            errors.push(`${plan.name}：${String(error?.message || error)}`);
          }
        }
        rolledBack = true;
        if (errors.length) throw Error(errors.join("；"));
      }
    };
  }
  return { read, apply };
}

// src/player.js
var KEY = "universal_opening_selector";
var WATERMARK = "唯一来源Discord:♡Aliceneko♡/红豆粉丨本插件完全免费";
var VERSION = RUNTIME_VERSION;
var THEME_ORNAMENT_SPRITE = THEME_ART.ornaments;
var THEME_ICON_SPRITE = THEME_ART.icons;
var CSS2 = `
.uos-user-trigger{display:flex;align-items:center;gap:8px;width:156px;max-width:calc(100% - 24px);min-height:54px;box-sizing:border-box;margin:10px 12px;padding:5px 9px 5px 5px;border:1px solid #b99669;border-radius:13px;background:#17242d;color:#f3e9d7;font:13px/1.3 system-ui,sans-serif;text-align:left;cursor:pointer;box-shadow:0 4px 14px #0004;overflow:hidden}
.uos-user-trigger .uos-brand-avatar{width:42px;height:42px;border-radius:9px;background-color:#ffffff12;flex:none}
.uos-user-trigger-copy{display:grid;gap:2px;flex:1;min-width:0}
.uos-user-trigger-title{font-size:12px;font-weight:700;line-height:1.35;white-space:nowrap}
.uos-user-trigger-count{font-size:10px;line-height:1.3;letter-spacing:.08em;opacity:.76;font-variant-numeric:tabular-nums;white-space:nowrap}
.uos-user-trigger-arrow{flex:none;font-size:18px;line-height:1;opacity:.68}
.uos-user-trigger[data-style=simple]{width:max-content;min-height:38px;gap:7px;padding:7px 13px;border-radius:999px}
.uos-user-trigger[data-style=simple] .uos-brand-avatar,.uos-user-trigger[data-style=simple] .uos-user-trigger-arrow{display:none}
.uos-user-trigger[data-style=simple] .uos-user-trigger-copy{display:flex;align-items:center;gap:7px;flex:0 1 auto}
.uos-user-trigger[data-style=simple] .uos-user-trigger-title{font-size:12px}
.uos-user-trigger[data-style=simple] .uos-user-trigger-count{font-size:11px;letter-spacing:0}
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
.uos-user-header-ornament{width:28px;height:28px;flex:none}

.uos-user-card{box-shadow:inset 0 1px 0 #ffffff0d,0 9px 22px #0002}
@media(max-width:500px){.uos-user-header-ornament{width:24px;height:24px}}
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
.uos-user-floating-style{display:grid;grid-template-columns:minmax(86px,auto) minmax(0,1fr);align-items:center;gap:8px 12px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--bg)}.uos-user-floating-style-title{color:var(--text);font-size:13px;font-weight:600}.uos-user-floating-style select{width:100%;max-width:200px;min-height:38px;padding:6px 9px;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--text);font:inherit}.uos-user-floating-style small{grid-column:1/-1;color:var(--muted);font-size:11px;line-height:1.6}
.uos-user-settings{margin:0 0 16px;padding:12px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}
.uos-user-results{margin:0 0 12px;color:var(--muted);font-size:12px}
.uos-user-panel .uos-user-description{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.7;padding-right:0}
.uos-user-panel .uos-user-card h3{padding-right:0}
.uos-user-card .uos-user-names{margin:10px 0;font-size:12px}



`;
async function switchOpeningWithPreset(preset, presetManager, changeOpening) {
  let transaction = null;
  try {
    if (preset) transaction = await presetManager.apply(preset);
    await changeOpening();
    return true;
  } catch (error) {
    let rollbackMessage = "";
    if (transaction) try {
      await transaction.rollback();
    } catch (rollbackError) {
      rollbackMessage = `；世界书状态恢复失败：${rollbackError?.message || rollbackError}`;
    }
    throw Error(`${error?.message || error}${rollbackMessage}`);
  }
}
function labelKey(snapshot) {
  const identity = `${snapshot.avatar}\0${snapshot.entries.map((entry) => entry.body).join("\0")}`;
  let hash = 2166136261;
  for (let i = 0; i < identity.length; i++) hash = Math.imul(hash ^ identity.charCodeAt(i), 16777619);
  return `uos_player_labels_${(hash >>> 0).toString(16)}`;
}
function parseNames(value) {
  return [...new Set(String(value || "").split(/[,，、/\n]+/).map((x) => x.trim()).filter(Boolean))].slice(0, 8);
}
function resolveDisplayEntry(entry, author = {}, local = {}, excluded = []) {
  const title = typeof local.title === "string" && local.title.trim() ? local.title.trim() : typeof author.title === "string" && author.title.trim() ? author.title.trim() : greetingTitle(entry.body, entry.index, excluded);
  const nameValue = typeof local.names === "string" ? local.names : typeof author.names === "string" ? author.names : null;
  const names = nameValue === null ? entry.names : parseNames(nameValue);
  const detectedSources = [...new Set(names.map((name) => entry.nameEvidence?.[name]).filter(Boolean))];
  return { title, names, titleSource: local.title?.trim() ? "玩家填写" : author.title?.trim() ? "作者填写" : "自动提取", namesSource: nameValue === null ? names.length ? `自动提取：${detectedSources.join("、") || "文本线索"}` : "未识别" : typeof local.names === "string" ? "玩家填写" : "作者填写" };
}
function readPlayerState(context, helper) {
  const c = context?.characters?.[context.characterId];
  if (!c || context.groupId != null && context.groupId !== -1 || context.characterId == null) return null;
  const data = c.data || c, first = String(data.first_mes ?? c.first_mes ?? "");
  const alternates = data.alternate_greetings ?? c.alternate_greetings;
  if (!first || first.trimStart().startsWith("<UniversalOpeningSelector/>") || !Array.isArray(alternates) || !alternates.length) return null;
  if (typeof helper?.getChatMessages !== "function" || typeof helper?.setChatMessages !== "function") return null;
  let message, last;
  try {
    message = helper.getChatMessages(0, { include_swipes: true })?.[0];
    last = helper.getLastMessageId?.();
  } catch {
    return null;
  }
  if (last != null && Number(last) > 0) return null;
  if (message?.role !== "assistant" || !Array.isArray(message.swipes) || !message.swipes.length) return null;
  const all = [first, ...alternates], count = Math.min(all.length, message.swipes.length);
  if (count < 2) return null;
  const settings = data.extensions?.[KEY] || {};
  const metadata = settings.entries || [], excluded = excludedTags(settings.excludedTags);
  const bodies = all.slice(0, count);
  const people = detectGreetingCollection(bodies, { characterName: data.name || c.name, knownNames: metadata.flatMap((entry) => typeof entry?.names === "string" ? parseNames(entry.names) : []), aliases: settings.personAliases || "" });
  return { characterId: context.characterId, avatar: c.avatar || data.name || "", swipeId: Number(message.swipe_id) || 0, entries: bodies.map((body, i) => ({ index: i, body, title: !isLegacyGeneratedEntry(body, metadata[i], i) && metadata[i]?.title || greetingTitle(body, i, excluded), description: isLegacyGeneratedEntry(body, metadata[i], i) ? "" : metadata[i]?.description || "", names: people[i].names, nameEvidence: people[i].evidence, nameSuggestions: people[i].suggestions, label: metadata[i]?.label || `OPENING ${String(i + 1).padStart(2, "0")}` })) };
}
function mountPlayerSelector(startDocument = document, helperApi, { backgroundService = null } = {}) {
  let doc = startDocument, win = doc.defaultView;
  try {
    for (let i = 0; i < 8 && win?.parent && win.parent !== win; i++) {
      void win.parent.document;
      win = win.parent;
      doc = win.document;
    }
  } catch {
  }
  doc.__uosPlayer?.close?.();
  const host = doc.defaultView || globalThis;
  const triggerStylePreference = createPlayerTriggerStylePreference(host);
  const helper = helperApi || host.TavernHelper || host;
  const readWorldbookPeople = createWorldbookPeopleReader(() => [helperApi, startDocument?.defaultView?.TavernHelper, startDocument?.defaultView, host.TavernHelper, host]);
  const worldbookPresetManager = createWorldbookPresetManager(() => [helperApi, startDocument?.defaultView?.TavernHelper, startDocument?.defaultView, host.TavernHelper, host], () => {
    const context = host.SillyTavern?.getContext?.();
    return context?.characters?.[context.characterId];
  });
  const style = doc.createElement("style");
  style.dataset.uosUserStyle = "";
  style.textContent = CSS2 + BRAND_CSS + defaultCoverStyles(".uos-user-panel") + OPENING_LAYOUT_CSS + OPENING_CATEGORY_CSS + OPENING_ACTION_CSS + OPENING_FAVORITES_CSS + BLIND_BOX_CONTROL_CSS + "\n.uos-user-default-cover{height:120px;margin:0 0 12px;border-radius:10px;background-position:center;background-size:cover;background-color:var(--surface)}.uos-user-panel[data-theme] .uos-user-card::before{position:absolute;float:none;top:22px;left:22px;margin:0;z-index:2;padding:2px 7px;border-radius:5px;background:#111a20b3;color:#fff;opacity:1}";
  (doc.head || doc.documentElement).append(style);
  let trigger = null, triggerDrag = null, stopTriggerBrand = () => {
  }, triggerCount = null, panelSession = null, updating = false;
  const el = (tag, className, text) => {
    const node = doc.createElement(tag);
    node.className = className;
    if (text != null) node.textContent = String(text);
    return node;
  };
  const state = () => readPlayerState(host.SillyTavern?.getContext?.(), helper);
  const removeTrigger = () => {
    triggerDrag?.dispose();
    triggerDrag = null;
    stopTriggerBrand();
    stopTriggerBrand = () => {
    };
    trigger?.remove();
    trigger = null;
    triggerCount = null;
  };
  function scan() {
    if (updating) return;
    updating = true;
    try {
      const snapshot = state(), first = doc.querySelector('#chat .mes[mesid="0"],#chat .mes[data-mesid="0"]');
      if (!snapshot || !first) {
        removeTrigger();
        closePanel();
        return;
      }
      if (!trigger) {
        trigger = el("button", "uos-user-trigger");
        trigger.type = "button";
        trigger.style.touchAction = "none";
        const avatar = el("span", "uos-brand-avatar");
        avatar.setAttribute("aria-hidden", "true");
        const copy = el("span", "uos-user-trigger-copy");
        copy.append(el("span", "uos-user-trigger-title", "预览开场"), triggerCount = el("span", "uos-user-trigger-count"));
        const arrow = el("span", "uos-user-trigger-arrow", "›");
        arrow.setAttribute("aria-hidden", "true");
        trigger.append(avatar, copy, arrow);
        stopTriggerBrand = bindBrandImages(trigger);
        triggerDrag = createPlayerButtonDrag(trigger);
        trigger.onclick = (event) => {
          if (!triggerDrag?.suppressClick(event)) openPanel();
        };
      }
      trigger.dataset.style = triggerStylePreference.get();
      try {
        trigger.dataset.theme = host.localStorage.getItem("uos_player_theme") || "archive";
      } catch {
      }
      const position = `${snapshot.swipeId + 1} / ${snapshot.entries.length}`;
      if (triggerCount && triggerCount.textContent !== position) triggerCount.textContent = position;
      trigger.setAttribute("aria-label", `预览开场，第 ${snapshot.swipeId + 1} 个，共 ${snapshot.entries.length} 个`);
      if (trigger.dataset.floating !== "true" && (trigger.nextElementSibling !== first || trigger.parentNode !== first.parentNode)) {
        first.before(trigger);
        triggerDrag.restore();
      }
    } finally {
      updating = false;
    }
  }
  function closePanel(force = false) {
    if (force) panelSession?.close();
    else void panelSession?.requestClose();
  }
  function openPanel() {
    const snapshot = state();
    if (!snapshot) return;
    const storageKey = labelKey(snapshot);
    let customLabels = {};
    try {
      const saved = JSON.parse(host.localStorage.getItem(storageKey));
      if (saved && typeof saved === "object" && !Array.isArray(saved)) customLabels = saved;
    } catch {
    }
    closePanel(true);
    const overlay = el("dialog", "uos-user-overlay");
    const session = createPlayerPanelSession(overlay, {
      onDispose: (closed) => {
        if (panelSession === closed) panelSession = null;
      },
      onError: (error) => console.warn("[Aliceneko Opening Selector] 弹窗清理失败", error)
    });
    panelSession = session;
    const panel = el("section", "uos-user-panel");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-modal", "true");
    panel.setAttribute("aria-label", "预览和选择开场");
    let theme = "archive";
    try {
      theme = host.localStorage.getItem("uos_player_theme") || theme;
    } catch {
    }
    panel.dataset.theme = THEMES.some((x) => x[0] === theme) ? theme : "archive";
    const background = el("div", "uos-user-background");
    background.setAttribute("aria-hidden", "true");
    panel.style.setProperty("--uos-user-background", THEME_BACKGROUND_IMAGES[panel.dataset.theme] ? `url("${THEME_BACKGROUND_IMAGES[panel.dataset.theme]}")` : "none");
    panel.append(background);
    const backgroundControl = createThemeBackgroundController(panel, "--uos-user-background", doc.defaultView, { service: backgroundService });
    void backgroundControl.setTheme(panel.dataset.theme);
    session.own(() => backgroundControl.close());
    const brand = createBrandMark(el);
    panel.append(brand.element);
    const head = el("div", "uos-user-head"), heading = el("div"), kicker = el("span", "uos-user-kicker", THEME_CAPTIONS[panel.dataset.theme]);
    const headerArt = el("span", "uos-user-header-ornament");
    headerArt.setAttribute("aria-hidden", "true");
    kicker.append(headerArt);
    heading.append(kicker, el("h2", "", "选择故事的起点"), el("p", "", `共 ${snapshot.entries.length} 个开场 · 预览后选择进入`));
    const close = el("button", "uos-user-close", "关闭");
    close.type = "button";
    close.onclick = () => {
      void session.requestClose();
    };
    const versionBadge = el("small", "uos-user-version-badge", `v${VERSION}`);
    head.append(heading, versionBadge, close);
    const tools = el("div", "uos-user-tools");
    const select = el("select", "");
    select.setAttribute("aria-label", "选择主题");
    for (const [id, name] of THEMES) {
      const option = el("option", "", name);
      option.value = id;
      select.append(option);
    }
    select.value = panel.dataset.theme;
    select.onchange = () => {
      panel.dataset.theme = select.value;
      setBlindBoxTheme(blindTrigger, select.value);
      void backgroundControl?.setTheme(select.value);
      kicker.textContent = THEME_CAPTIONS[select.value];
      kicker.append(headerArt);
      if (trigger) trigger.dataset.theme = select.value;
      try {
        host.localStorage.setItem("uos_player_theme", select.value);
      } catch {
      }
    };
    const themeControl = el("label", "uos-user-theme-control");
    themeControl.append(el("span", "uos-user-theme-label", "主题"), select);
    tools.append(themeControl);
    const list = el("div", "uos-user-list"), status = el("p", "uos-user-status");
    const settingsLayout = createPlayerSettingsLayout(el);
    const { settings, button: settingsButton } = settingsLayout;
    tools.append(settingsButton);
    session.own(() => settingsLayout.close());
    const floatingStyle = el("label", "uos-user-floating-style");
    const floatingStyleSelect = el("select");
    floatingStyleSelect.setAttribute("aria-label", "悬浮窗样式");
    for (const [value, label] of [["simple", "简洁版"], ["mascot", "看板娘版"]]) {
      const option = el("option", "", label);
      option.value = value;
      floatingStyleSelect.append(option);
    }
    floatingStyleSelect.value = triggerStylePreference.get();
    const floatingStyleHint = el("small", "", "简洁版显示标题和编号；看板娘版会随主题更换造型。");
    floatingStyle.append(el("span", "uos-user-floating-style-title", "悬浮窗样式"), floatingStyleSelect, floatingStyleHint);
    floatingStyleSelect.onchange = () => {
      const result = triggerStylePreference.set(floatingStyleSelect.value);
      if (trigger) trigger.dataset.style = result.value;
      floatingStyleHint.textContent = result.saved ? "简洁版显示标题和编号；看板娘版会随主题更换造型。" : "浏览器未能保存偏好，本次运行仍会立即切换。";
    };
    const character = host.SillyTavern?.getContext?.()?.characters?.[snapshot.characterId];
    const authorConfig = (character?.data || character)?.extensions?.[KEY] || {};
    const layoutKey = `uos_player_layout_${snapshot.avatar}`;
    let layout = authorConfig.layout;
    try {
      layout = host.localStorage.getItem(layoutKey) || layout;
    } catch {
    }
    panel.dataset.layout = openingLayout(layout);
    const layoutSelect = el("select");
    layoutSelect.setAttribute("aria-label", "选择版式");
    for (const [id, name] of OPENING_LAYOUTS) {
      const option = el("option", "", name);
      option.value = id;
      layoutSelect.append(option);
    }
    layoutSelect.value = panel.dataset.layout;
    layoutSelect.onchange = () => {
      panel.dataset.layout = openingLayout(layoutSelect.value);
      try {
        host.localStorage.setItem(layoutKey, panel.dataset.layout);
      } catch {
      }
    };
    const layoutControl = el("label", "uos-user-theme-control");
    layoutControl.append(el("span", "uos-user-theme-label", "版式"), layoutSelect);
    tools.insertBefore(layoutControl, settingsButton);
    const authorEntries = Array.isArray(authorConfig.entries) ? authorConfig.entries.map((entry, i) => isLegacyGeneratedEntry(snapshot.entries[i]?.body, entry, i) ? { ...entry, title: "", description: "" } : entry) : [];
    let previewItems = [], allDrawItems = [];
    const openingPreview = createOpeningPreview({ doc, host, getItems: () => previewItems, getPalette: () => panel, onChoose: (item) => chooseOpening(item) });
    session.own(() => openingPreview.dispose());
    const blindBox = createOpeningBlindBox({
      doc,
      host,
      getItems: () => previewItems,
      getAllItems: () => allDrawItems,
      avatar: snapshot.avatar,
      getPalette: () => panel,
      onRangeChange: (result) => {
        renderCards();
        if (!result.persisted) status.textContent = "浏览器未能保存，抽卡设置暂时只在当前窗口有效。";
      },
      isActive: () => {
        const current = state();
        return !session.disposed && panelSession === session && current?.avatar === snapshot.avatar && current?.characterId === snapshot.characterId;
      },
      onPreview: (item, trigger2, pool) => {
        if (!openingPreview.open(item.id, trigger2, pool)) status.textContent = "筛选结果已变化，请重新抽取。";
      },
      onChoose: (item) => chooseOpening(item),
      onUnavailable: () => {
        status.textContent = "角色或聊天已变化，请重新打开选择器。";
      },
      onError: (error) => {
        status.textContent = `进入开场失败：${error?.message || error}`;
      }
    });
    session.own(() => blindBox.dispose());
    const blindTrigger = openingBlindBoxButton(el, (button) => blindBox.open(button), panel.dataset.theme);
    const blindRangeTrigger = openingBlindRangeButton(el, (button) => blindBox.openRange(button));
    const authorExcluded = excludedTags(authorConfig.excludedTags);
    const editKey = labelKey(snapshot).replace("_labels_", "_edits_");
    let localEdits = {};
    try {
      const saved = JSON.parse(host.localStorage.getItem(editKey));
      if (saved && typeof saved === "object" && !Array.isArray(saved)) localEdits = saved;
    } catch {
    }
    const exclusionKey = `uos_player_excluded_${snapshot.avatar}`;
    let localExcluded = [];
    try {
      localExcluded = excludedTags(host.localStorage.getItem(exclusionKey));
    } catch {
    }
    let playerBaseline = null, markPlayerSaved = () => {
    }, persistPlayerGroup = () => false;
    const exclusion = el("details", "uos-user-label-settings");
    exclusion.append(el("summary", "", "排除标题中的 <字段>"));
    const hint = el("p", "", "填写标签名，用逗号隔开，例如：状态, 时间, 角色档案。只影响标题提取，不影响人物识别和完整原文。");
    exclusion.append(hint);
    if (authorExcluded.length) exclusion.append(el("p", "", `作者预设：${authorExcluded.join("、")}`));
    const exclusionInput = el("input");
    exclusionInput.type = "text";
    exclusionInput.value = localExcluded.join(", ");
    exclusionInput.placeholder = "例如：状态, 时间";
    exclusionInput.setAttribute("aria-label", "要排除的尖括号字段");
    exclusion.append(exclusionInput);
    const saveExclusion = el("button", "", "保存排除字段");
    saveExclusion.type = "button";
    saveExclusion.onclick = () => persistPlayerGroup("exclusion");
    exclusion.append(saveExclusion);
    const saveAuthor = el("button", "", "保存到角色卡（作者）");
    saveAuthor.type = "button";
    saveAuthor.onclick = async () => {
      const context = host.SillyTavern?.getContext?.(), card = context?.characters?.[snapshot.characterId];
      if (!card?.avatar || typeof context?.getRequestHeaders !== "function" || typeof context?.writeExtensionField !== "function") {
        status.textContent = "当前环境无法写入角色卡。";
        return;
      }
      saveAuthor.disabled = true;
      try {
        const data = card.data || card, original = data.extensions?.[KEY] || {};
        const next = { ...original, excludedTags: excludedTags(exclusionInput.value).join(",") };
        const response = await host.fetch("/api/characters/merge-attributes", { method: "POST", headers: context.getRequestHeaders(), body: JSON.stringify({ avatar: card.avatar, data: { extensions: { [KEY]: next } } }) });
        if (!response.ok) throw Error(`HTTP ${response.status}`);
        await context.writeExtensionField(snapshot.characterId, KEY, next);
        authorExcluded.splice(0, authorExcluded.length, ...excludedTags(next.excludedTags));
        markPlayerSaved("exclusion");
        renderCards();
        status.textContent = "已写入角色卡，请从酒馆重新导出后分享。";
      } catch (error) {
        status.textContent = `保存到角色卡失败：${error?.message || error}`;
      } finally {
        saveAuthor.disabled = false;
      }
    };
    exclusion.append(saveAuthor);
    status.setAttribute("role", "status");
    const personKey = `uos_player_person_rules_${snapshot.avatar}`;
    let localPersonRules = {};
    try {
      const saved = JSON.parse(host.localStorage.getItem(personKey));
      if (saved && typeof saved === "object" && !Array.isArray(saved)) localPersonRules = saved;
    } catch {
    }
    const personSettings = el("details", "uos-user-label-settings");
    personSettings.append(el("summary", "", "人物识别规则"));
    let worldbookPeople = [];
    const worldbookList = el("ul");
    const worldbookStatus = el("p", "", "正在读取角色世界书人物名单…"), reloadWorldbook = el("button", "", "重新读取世界书");
    reloadWorldbook.type = "button";
    personSettings.append(worldbookStatus, worldbookList, reloadWorldbook);
    personSettings.append(el("p", "", "每行填写一人及其别名，例如：沈挽昼=挽昼,小沈。仅读取角色绑定的世界书；明确姓名参与全文匹配（包含所有标签），普通触发关键词需手动确认，缺少明确姓名证据的标题、台词署名和人物标签先列为候选。"));
    const aliasLabel = el("label");
    aliasLabel.append(el("span", "", "人物与别名"));
    const conflictNote = el("p");
    personSettings.append(conflictNote);
    const aliasInput = el("textarea");
    aliasInput.maxLength = 1500;
    aliasInput.value = localPersonRules.personAliases ?? authorConfig.personAliases ?? "";
    aliasInput.placeholder = "沈挽昼=挽昼,小沈";
    aliasLabel.append(aliasInput);
    personSettings.append(aliasLabel);
    if (authorConfig.personAliases) personSettings.append(el("p", "", `作者预设：${authorConfig.personAliases}`));
    function updatePeople() {
      const conflicts = personAliases([authorConfig.personAliases, localPersonRules.personAliases].filter(Boolean).join(";")).conflicts;
      conflictNote.textContent = conflicts.length ? `重复别名未参与匹配：${conflicts.join("、")}。请只保留一个归属。` : "";
      const known = [...authorEntries.flatMap((entry) => typeof entry?.names === "string" ? parseNames(entry.names) : []), ...Object.values(localEdits).flatMap((entry) => typeof entry?.names === "string" ? parseNames(entry.names) : [])];
      const detected = detectGreetingCollection(snapshot.entries.map((entry) => entry.body), { characterName: character?.data?.name || character?.name, knownNames: known, aliases: [authorConfig.personAliases, localPersonRules.personAliases].filter(Boolean).join(";"), worldbookPeople });
      snapshot.entries.forEach((entry, i) => {
        entry.names = detected[i].names;
        entry.nameEvidence = detected[i].evidence;
        entry.nameSuggestions = detected[i].suggestions;
      });
      for (const { entry, namesInput, candidates } of editFields) {
        namesInput.placeholder = entry.names.join("、") || "未识别，可填写姓名";
        candidates.replaceChildren();
        if (entry.nameSuggestions.length) {
          candidates.append(el("span", "", "待确认："));
          for (const name of entry.nameSuggestions) {
            const button = el("button", "", name);
            button.type = "button";
            button.onclick = () => {
              namesInput.value = [.../* @__PURE__ */ new Set([...parseNames(namesInput.value), name])].join("、");
              status.textContent = "已填入候选人物，请保存修正。";
            };
            candidates.append(button);
          }
        }
      }
    }
    const saveLocalPeople = el("button", "", "仅保存到本机");
    saveLocalPeople.type = "button";
    saveLocalPeople.onclick = () => persistPlayerGroup("people");
    personSettings.append(saveLocalPeople);
    const saveCardPeople = el("button", "", "保存到角色卡（作者）");
    saveCardPeople.type = "button";
    saveCardPeople.onclick = async () => {
      const context = host.SillyTavern?.getContext?.(), card = context?.characters?.[snapshot.characterId];
      if (!card?.avatar || typeof context?.getRequestHeaders !== "function" || typeof context?.writeExtensionField !== "function") {
        status.textContent = "当前环境无法写入角色卡。";
        return;
      }
      saveCardPeople.disabled = true;
      try {
        const original = (card.data || card).extensions?.[KEY] || {};
        const next = { ...original, personAliases: aliasInput.value.slice(0, 1500) };
        delete next.excludedPersonTags;
        const response = await host.fetch("/api/characters/merge-attributes", { method: "POST", headers: context.getRequestHeaders(), body: JSON.stringify({ avatar: card.avatar, data: { extensions: { [KEY]: next } } }) });
        if (!response.ok) throw Error(`HTTP ${response.status}`);
        await context.writeExtensionField(snapshot.characterId, KEY, next);
        authorConfig.personAliases = next.personAliases;
        localPersonRules = {};
        try {
          host.localStorage.removeItem(personKey);
        } catch {
        }
        markPlayerSaved("people");
        updatePeople();
        renderCards();
        status.textContent = "人物识别规则已写入角色卡；重新导出后即可分享。";
      } catch (error) {
        status.textContent = `保存到角色卡失败：${error?.message || error}`;
      } finally {
        saveCardPeople.disabled = false;
      }
    };
    personSettings.append(saveCardPeople);
    const edits = el("details", "uos-user-label-settings");
    edits.append(el("summary", "", "修正标题和登场人物"));
    const editFields = [];
    for (const entry of snapshot.entries) {
      const box = el("div", "");
      box.append(el("strong", "", `开场 ${entry.index + 1}`));
      const effective = resolveDisplayEntry(entry, authorEntries[entry.index], localEdits[entry.index], [...authorExcluded, ...localExcluded]);
      const titleInput = el("input");
      titleInput.type = "text";
      titleInput.maxLength = 100;
      titleInput.value = localEdits[entry.index]?.title ?? authorEntries[entry.index]?.title ?? "";
      titleInput.placeholder = effective.title;
      const namesInput = el("input");
      namesInput.type = "text";
      namesInput.maxLength = 200;
      const savedNames = localEdits[entry.index]?.names ?? authorEntries[entry.index]?.names;
      namesInput.value = savedNames === "" ? "无" : savedNames ?? "";
      namesInput.placeholder = entry.names.join("、") || "未识别，可填写姓名";
      const titleField = el("label");
      titleField.append(el("span", "", "标题（留空使用自动提取）"), titleInput);
      const namesField = el("label");
      namesField.append(el("span", "", "人物（逗号分隔；输入“无”可隐藏误判）"), namesInput);
      const candidates = el("div", "uos-user-candidates");
      box.append(titleField, namesField, candidates);
      edits.append(box);
      editFields.push({ entry, titleInput, namesInput, candidates });
    }
    const collectEdits = () => Object.fromEntries(editFields.map(({ entry, titleInput, namesInput }) => {
      const names = namesInput.value.trim();
      return [entry.index, { title: titleInput.value.trim().slice(0, 100), ...names ? { names: names === "无" ? "" : names.slice(0, 200) } : {} }];
    }));
    const saveEdits = el("button", "", "仅保存到本机");
    saveEdits.type = "button";
    saveEdits.onclick = () => persistPlayerGroup("edits");
    edits.append(saveEdits);
    const saveCardEdits = el("button", "", "保存到角色卡（作者）");
    saveCardEdits.type = "button";
    saveCardEdits.onclick = async () => {
      const context = host.SillyTavern?.getContext?.(), card = context?.characters?.[snapshot.characterId];
      if (!card?.avatar || typeof context?.getRequestHeaders !== "function" || typeof context?.writeExtensionField !== "function") {
        status.textContent = "当前环境无法写入角色卡。";
        return;
      }
      saveCardEdits.disabled = true;
      try {
        const original = (card.data || card).extensions?.[KEY] || {}, values = collectEdits();
        const next = { ...original, entries: snapshot.entries.map((entry, i) => {
          const saved = { ...original.entries?.[i] };
          if (values[i].title) saved.title = values[i].title;
          else delete saved.title;
          if (Object.hasOwn(values[i], "names")) saved.names = values[i].names;
          else delete saved.names;
          return saved;
        }) };
        const response = await host.fetch("/api/characters/merge-attributes", { method: "POST", headers: context.getRequestHeaders(), body: JSON.stringify({ avatar: card.avatar, data: { extensions: { [KEY]: next } } }) });
        if (!response.ok) throw Error(`HTTP ${response.status}`);
        await context.writeExtensionField(snapshot.characterId, KEY, next);
        authorEntries.splice(0, authorEntries.length, ...next.entries);
        localEdits = {};
        try {
          host.localStorage.removeItem(editKey);
        } catch {
        }
        markPlayerSaved("edits");
        updatePeople();
        renderCards();
        status.textContent = "修正已写入角色卡；重新导出后即可分享。";
      } catch (error) {
        status.textContent = `保存到角色卡失败：${error?.message || error}`;
      } finally {
        saveCardEdits.disabled = false;
      }
    };
    edits.append(saveCardEdits);
    const labelSettings = el("details", "uos-user-label-settings");
    labelSettings.append(el("summary", "", "自定义开场标签（仅保存在本机）"));
    const labelInputs = [], labelTexts = [];
    for (const entry of snapshot.entries) {
      const field = el("label");
      field.append(el("span", "", `第 ${entry.index + 1} 条开场`));
      const input = el("input");
      input.type = "text";
      input.maxLength = 60;
      input.value = typeof customLabels[entry.index] === "string" ? customLabels[entry.index] : entry.label;
      input.setAttribute("aria-label", `第 ${entry.index + 1} 条开场标签`);
      field.append(input);
      labelInputs.push(input);
      labelSettings.append(field);
    }
    const saveLabels = el("button", "", "保存标签");
    saveLabels.type = "button";
    saveLabels.onclick = () => persistPlayerGroup("labels");
    labelSettings.append(saveLabels);
    const updateSettings = el("details", "uos-user-label-settings uos-user-update-settings");
    updateSettings.append(el("summary", "", "版本与更新"));
    const updateVersion = el("p", "uos-user-status", `当前版本 v${VERSION}`);
    const autoCheckRow = el("label", "uos-user-update-auto"), autoCheckInput = el("input");
    autoCheckInput.type = "checkbox";
    autoCheckRow.append(autoCheckInput, el("span", "", "启动时自动检查更新"));
    const updateHint = el("p", "uos-user-status", "启动时检查新版本；也可以随时手动检查。");
    const updateButton = el("button", "uos-user-update", "检查更新");
    updateButton.type = "button";
    updateSettings.append(updateVersion, autoCheckRow, updateHint, updateButton);
    const readPlayerDraft = () => ({ exclusion: exclusionInput.value, people: aliasInput.value, edits: editFields.map(({ titleInput, namesInput }) => [titleInput.value, namesInput.value]), labels: labelInputs.map((input) => input.value) });
    playerBaseline = readPlayerDraft();
    markPlayerSaved = (group) => {
      if (playerBaseline) playerBaseline[group] = readPlayerDraft()[group];
    };
    persistPlayerGroup = (group) => {
      try {
        if (group === "exclusion") {
          const next = excludedTags(exclusionInput.value);
          host.localStorage.setItem(exclusionKey, next.join(","));
          localExcluded = next;
          renderCards();
          status.textContent = "排除字段已保存在本机。";
        } else if (group === "people") {
          const next = { personAliases: aliasInput.value.slice(0, 1500) };
          host.localStorage.setItem(personKey, JSON.stringify(next));
          localPersonRules = next;
          updatePeople();
          renderCards();
          status.textContent = "人物识别规则已保存在本机。";
        } else if (group === "edits") {
          const next = collectEdits();
          host.localStorage.setItem(editKey, JSON.stringify(next));
          localEdits = next;
          updatePeople();
          renderCards();
          status.textContent = "修正已保存在本机。";
        } else if (group === "labels") {
          const next = {};
          for (const entry of snapshot.entries) {
            const value = labelInputs[entry.index].value.trim().slice(0, 60);
            if (value && value !== entry.label) next[entry.index] = value;
          }
          if (Object.keys(next).length) host.localStorage.setItem(storageKey, JSON.stringify(next));
          else host.localStorage.removeItem(storageKey);
          customLabels = next;
          renderCards();
          status.textContent = "标签已保存在本机。";
        } else return false;
        markPlayerSaved(group);
        return true;
      } catch (error) {
        status.textContent = `本机保存失败：${error?.message || error}`;
        return false;
      }
    };
    const saveLocalDraft = (groups) => {
      for (const group of groups) if (!persistPlayerGroup(group)) return false;
      return true;
    };
    const saveCardDraft = async (groups) => {
      const cardGroups = groups.filter((group) => ["exclusion", "people", "edits"].includes(group));
      if (cardGroups.length) {
        const context = host.SillyTavern?.getContext?.(), card = context?.characters?.[snapshot.characterId];
        if (!card?.avatar || card.avatar !== snapshot.avatar || typeof context?.getRequestHeaders !== "function" || typeof context?.writeExtensionField !== "function") {
          status.textContent = "当前环境无法写入角色卡。";
          return false;
        }
        try {
          const original = (card.data || card).extensions?.[KEY] || {}, next = { ...original };
          if (cardGroups.includes("exclusion")) next.excludedTags = excludedTags(exclusionInput.value).join(",");
          if (cardGroups.includes("people")) {
            next.personAliases = aliasInput.value.slice(0, 1500);
            delete next.excludedPersonTags;
          }
          if (cardGroups.includes("edits")) {
            const values = collectEdits();
            next.entries = snapshot.entries.map((entry, i) => {
              const saved = { ...original.entries?.[i] || {} };
              if (values[i].title) saved.title = values[i].title;
              else delete saved.title;
              if (Object.hasOwn(values[i], "names")) saved.names = values[i].names;
              else delete saved.names;
              return saved;
            });
          }
          const response = await host.fetch("/api/characters/merge-attributes", { method: "POST", headers: context.getRequestHeaders(), body: JSON.stringify({ avatar: card.avatar, data: { extensions: { [KEY]: next } } }) });
          if (!response.ok) throw Error(`HTTP ${response.status}`);
          await context.writeExtensionField(snapshot.characterId, KEY, next);
          if (cardGroups.includes("exclusion")) {
            authorExcluded.splice(0, authorExcluded.length, ...excludedTags(next.excludedTags));
            authorConfig.excludedTags = next.excludedTags;
            markPlayerSaved("exclusion");
          }
          if (cardGroups.includes("people")) {
            authorConfig.personAliases = next.personAliases;
            localPersonRules = {};
            try {
              host.localStorage.removeItem(personKey);
            } catch {
            }
            markPlayerSaved("people");
          }
          if (cardGroups.includes("edits")) {
            authorEntries.splice(0, authorEntries.length, ...next.entries);
            localEdits = {};
            try {
              host.localStorage.removeItem(editKey);
            } catch {
            }
            markPlayerSaved("edits");
          }
          updatePeople();
          renderCards();
          status.textContent = "已写入角色卡，请从酒馆重新导出后分享。";
        } catch (error) {
          status.textContent = `保存到角色卡失败：${error?.message || error}`;
          return false;
        }
      }
      if (groups.includes("labels") && !persistPlayerGroup("labels")) return false;
      return true;
    };
    const search = el("div", "uos-user-search"), query = el("input"), person = el("select");
    query.type = "search";
    query.placeholder = "搜索标题、人物或开场正文";
    query.setAttribute("aria-label", "搜索开场");
    person.setAttribute("aria-label", "按人物筛选");
    search.append(query, person);
    const results = el("p", "uos-user-results");
    results.setAttribute("role", "status");
    const categories = createOpeningCategoryFilters({ el, onChange: () => renderCards() });
    search.append(categories.element);
    const favoritesStore = createOpeningFavorites(host, snapshot.avatar);
    const favoriteUI = createOpeningFavoritesUI({
      el,
      store: favoritesStore,
      onChange: () => renderCards(),
      isActive: () => {
        const current = state();
        return !session.disposed && panelSession === session && current?.avatar === snapshot.avatar && current?.characterId === snapshot.characterId;
      },
      onUnavailable: () => {
        status.textContent = "浏览器未能保存，收藏暂时只在当前窗口有效。";
      }
    });
    search.append(favoriteUI.element, blindTrigger, blindRangeTrigger);
    session.own(() => favoriteUI.dispose());
    const openingGroups = createOpeningGroupRenderer({ el, gridClass: "uos-user-list" });
    query.oninput = () => renderCards();
    person.onchange = () => renderCards();
    async function chooseOpening(entry, button) {
      const index = entry.index ?? entry.id, choose = button || { disabled: false };
      let current = state();
      if (!current || current.characterId !== snapshot.characterId || current.avatar !== snapshot.avatar || index >= current.entries.length) {
        status.textContent = "角色或聊天已变化，请重新打开选择器。";
        return;
      }
      choose.disabled = true;
      if (!await confirmPlayerChanges() || session.disposed) {
        choose.disabled = false;
        return;
      }
      current = state();
      if (!current || current.characterId !== snapshot.characterId || current.avatar !== snapshot.avatar || index >= current.entries.length) {
        status.textContent = "角色或聊天已变化，请重新打开选择器。";
        choose.disabled = false;
        return;
      }
      status.textContent = "正在切换开场…";
      try {
        const presetId = authorEntries[index]?.worldbookPresetId;
        const preset = Array.isArray(authorConfig.worldbookPresets) ? authorConfig.worldbookPresets.find((value) => value.id === presetId) : null;
        if (preset) status.textContent = "正在应用此开场的世界书条目预设…";
        await switchOpeningWithPreset(preset, worldbookPresetManager, async () => {
          const current2 = state();
          if (session.disposed || !current2 || current2.characterId !== snapshot.characterId || current2.avatar !== snapshot.avatar) throw Error("角色或聊天已变化，请重新打开选择器");
          await helper.setChatMessages([{ message_id: 0, swipe_id: index }], { refresh: "all" });
          const after = state();
          if (after?.swipeId !== index) throw Error("消息页未切换");
        });
        session.close();
        scan();
      } catch (error) {
        status.textContent = `切换失败：${error?.message || error}`;
        choose.disabled = false;
      }
    }
    function renderCards() {
      list.replaceChildren();
      previewItems = [];
      const resolved = snapshot.entries.map((entry) => resolveDisplayEntry(entry, authorEntries[entry.index], localEdits[entry.index], [...authorExcluded, ...localExcluded]));
      const selected = person.value;
      person.replaceChildren();
      const any = el("option", "", "全部人物");
      any.value = "";
      person.append(any);
      for (const name of new Set(resolved.flatMap((x) => x.names))) {
        const option = el("option", "", name);
        option.value = name;
        person.append(option);
      }
      person.value = selected;
      const rows = favoriteUI.update(snapshot.entries.map((entry) => ({ ...entry, ...resolved[entry.index], ...openingMetadata(authorEntries[entry.index]), label: typeof customLabels[entry.index] === "string" && customLabels[entry.index] ? customLabels[entry.index] : entry.label })));
      categories.update(rows);
      allDrawItems = rows.map((entry) => ({ ...authorEntries[entry.index], ...openingMetadata(entry), id: entry.index, index: entry.index, number: entry.index + 1, coverIndex: entry.index, title: entry.title, description: entry.description, label: entry.label, names: entry.names, body: entry.body, titleSource: entry.titleSource, suggestions: entry.nameSuggestions, isCurrent: entry.index === snapshot.swipeId }));
      const categoryValues = categories.values(), filtered = rows.filter((row) => (!favoriteUI.onlyFavorites() || row.favorite) && matchesOpening(row, { query: query.value, person: person.value, ...categoryValues })), visible = filtered.length;
      openingGroups.render(filtered, list, (entry, target) => {
        const display = entry;
        const card = el("article", "uos-user-card");
        card.dataset.current = String(entry.index === snapshot.swipeId);
        card.dataset.number = String(entry.index + 1).padStart(2, "0");
        const illustration = el("div", "uos-user-default-cover");
        illustration.setAttribute("aria-hidden", "true");
        applyOpeningCover(illustration, authorEntries[entry.index], entry.body, entry.index, host);
        card.append(illustration);
        const cardBody = el("div", "uos-user-card-body");
        card.append(cardBody);
        const labelText = el("p", "uos-user-description", typeof customLabels[entry.index] === "string" && customLabels[entry.index] ? customLabels[entry.index] : entry.label);
        if (entry.description) labelText.append(doc.createTextNode(` · ${entry.description}`));
        labelTexts[entry.index] = labelText;
        cardBody.append(el("h3", "", display.title));
        if (labelText.textContent) cardBody.append(labelText);
        const tagChips = openingTagChips(el, entry.tags);
        if (tagChips) cardBody.append(tagChips);
        if (display.names.length) {
          const cast = el("p", "uos-user-names");
          cast.append(el("span", "uos-cast-label", "人物"));
          for (const name of display.names.slice(0, 3)) cast.append(el("span", "uos-name-chip", name));
          if (display.names.length > 3) cast.append(el("span", "uos-name-chip", `+${display.names.length - 3}`));
          cardBody.append(cast);
        }
        previewItems.push({ ...authorEntries[entry.index], ...openingMetadata(entry), id: entry.index, number: entry.index + 1, coverIndex: entry.index, title: display.title, description: entry.description, label: entry.label, names: display.names, body: entry.body, titleSource: display.titleSource, suggestions: entry.nameSuggestions, isCurrent: entry.index === snapshot.swipeId });
        const previewButton = el("button", "uos-user-preview-button", "预览完整正文");
        previewButton.type = "button";
        decorateOpeningPreviewButton(previewButton, el);
        previewButton.onclick = () => openingPreview.open(entry.index, previewButton);
        const cardActions = el("div", "uos-card-actions uos-user-card-actions");
        cardActions.append(previewButton, favoriteUI.button(entry));
        card.append(cardActions);
        const choose = el("button", "uos-user-select", entry.index === snapshot.swipeId ? "当前开场" : `进入开场 ${entry.index + 1}`);
        choose.type = "button";
        choose.disabled = entry.index === snapshot.swipeId;
        choose.onclick = () => chooseOpening(entry, choose);
        card.append(choose);
        target.append(card);
      }, rows);
      updateBlindBoxButton(blindTrigger, blindBox.poolItems(), { theme: panel.dataset.theme, manual: blindBox.rangeMode() === "manual" });
      blindRangeTrigger.textContent = blindBox.rangeSummary();
      results.textContent = favoriteUI.onlyFavorites() || query.value.trim() || person.value || categoryValues.group !== null || categoryValues.tag ? `找到 ${visible} / ${snapshot.entries.length} 个开场` : `${snapshot.entries.length} 个开场`;
      if (!visible) list.append(createMascotNote(el, "search", favoriteUI.onlyFavorites() ? "没有匹配的收藏开场；关闭「只看收藏」，点击卡片旁的 ☆ 添加收藏。" : "没有匹配的开场，请调整关键词或筛选条件。", "uos-user-empty").element);
    }
    updatePeople();
    renderCards();
    const mark = el("p", "uos-user-watermark", WATERMARK), footerVersion = el("span", "uos-user-version", `v${VERSION}`);
    mark.append(footerVersion);
    const stopUpdateControl = bindUpdateControl(updateButton, doc, { versionElements: [versionBadge, footerVersion], autoCheckInput, autoCheckHint: updateHint });
    session.own(stopUpdateControl);
    settingsLayout.assemble({ exclusion, people: personSettings, edits, labels: labelSettings, updates: updateSettings, floatingStyle });
    const welcome = createMascotNote(el, "welcome", "按需要展开一项设置，修改后使用该项的保存按钮。");
    settings.querySelector(".uos-user-settings-intro").replaceWith(welcome.element);
    session.own(welcome.dispose);
    panel.append(head, tools, settings, search, results, list, status, mark);
    overlay.append(panel);
    (doc.body || doc.documentElement).append(overlay);
    const stopBrandImages = bindBrandImages(panel);
    session.own(stopBrandImages);
    const active = overlay;
    const restorePlayerDraft = () => {
      if (!playerBaseline) return;
      exclusionInput.value = playerBaseline.exclusion;
      aliasInput.value = playerBaseline.people;
      editFields.forEach(({ titleInput, namesInput }, i) => {
        titleInput.value = playerBaseline.edits[i]?.[0] || "";
        namesInput.value = playerBaseline.edits[i]?.[1] || "";
      });
      labelInputs.forEach((input, i) => {
        input.value = playerBaseline.labels[i] ?? "";
      });
      updatePeople();
      renderCards();
    };
    const playerDraftGuard = createPlayerDraftGuard({
      getGroups: () => unsavedPlayerGroups(playerBaseline, readPlayerDraft()),
      prompt: (groups, canSave, signal) => showPlayerUnsavedPrompt(doc, active, panel, groups, canSave, { signal }),
      restore: restorePlayerDraft,
      saveCard: saveCardDraft,
      saveLocal: saveLocalDraft,
      isActive: () => panelSession === session && !session.disposed,
      status: (message) => {
        status.textContent = message;
      }
    });
    session.setGuard(playerDraftGuard);
    const confirmPlayerChanges = () => session.prepareForUpdate();
    async function refreshWorldbook(refresh = false) {
      reloadWorldbook.disabled = true;
      worldbookStatus.textContent = "正在读取角色世界书人物名单…";
      try {
        const result = await readWorldbookPeople(character, { refresh });
        const current = host.SillyTavern?.getContext?.();
        if (panelSession !== session || session.disposed || current?.characterId !== snapshot.characterId || current?.characters?.[current.characterId]?.avatar !== character?.avatar) return;
        worldbookPeople = result.people;
        renderWorldbookPeopleList(doc, worldbookList, worldbookPeople, result.diagnostics);
        worldbookStatus.textContent = formatWorldbookPeopleStatus(result);
        updatePeople();
        renderCards();
      } catch {
        if (panelSession === session && !session.disposed) worldbookStatus.textContent = "世界书读取失败，继续识别正文中的明确姓名；可重新读取。";
      } finally {
        reloadWorldbook.disabled = false;
      }
    }
    reloadWorldbook.onclick = () => refreshWorldbook(true);
    void refreshWorldbook();
    try {
      session.show(close);
    } catch (error) {
      console.warn("[Aliceneko Opening Selector] 弹窗无法打开", error);
    }
  }
  const observer = new host.MutationObserver(scan);
  if (doc.body) observer.observe(doc.body, { childList: true, subtree: true });
  const timer = host.setInterval(scan, 1500);
  scan();
  const runnerWindow = startDocument.defaultView;
  const onPageHide = () => {
    if (doc.__uosPlayer === api) api.close();
  };
  const api = { version: VERSION, scan, prepareForUpdate: async () => panelSession ? panelSession.prepareForUpdate() : true, close: () => {
    observer.disconnect();
    host.clearInterval(timer);
    runnerWindow?.removeEventListener?.("pagehide", onPageHide);
    closePanel(true);
    removeTrigger();
    style.remove();
    if (doc.__uosPlayer === api) delete doc.__uosPlayer;
  } };
  doc.__uosPlayer = api;
  if (runnerWindow !== host) runnerWindow?.addEventListener?.("pagehide", onPageHide, { once: true });
  return api;
}

// src/worldbook-preset-editor.js
function createWorldbookPresetEditor({
  doc,
  el,
  query: $,
  getDraft,
  entries,
  manager,
  character,
  isConnected,
  status,
  confirmPresetDelete
}) {
  let worldbookPresetData = { books: [], bindings: [], warnings: [] };
  let worldbookPresetMessage = "正在读取绑定世界书…", closed = false, readRequest = 0;
  const selection = { id: "", edit: null, dirty: false, isNew: false };
  function reset() {
    selection.id = "";
    selection.edit = null;
    selection.dirty = false;
    selection.isNew = false;
  }
  async function refresh() {
    const identity = character()?.avatar, request = ++readRequest;
    const current = () => !closed && request === readRequest && isConnected() && character()?.avatar === identity;
    try {
      const result = await manager.read();
      if (!current()) return;
      worldbookPresetData = result;
      worldbookPresetMessage = `已读取 ${result.books.length} 本、${result.entryCount} 条。${result.warnings.length ? `读取失败：${result.warnings.join("；")}` : ""}`;
    } catch (error) {
      if (!current()) return;
      worldbookPresetData = { books: [], bindings: [], warnings: [] };
      worldbookPresetMessage = String(error?.message || error);
    }
    const note = $("[data-worldbook-presets-status]");
    if (note) note.textContent = worldbookPresetMessage;
    render();
  }
  function commitPending({ fromForm = false } = {}) {
    const draft = getDraft();
    if (closed || !draft) return false;
    if (!selection.dirty) return true;
    const selected = selection.edit, name = String(selected?.name || "").trim().slice(0, 120);
    if (!selected || !name) {
      status(fromForm ? "请填写预设名称。" : "请先填写预设名称。");
      return false;
    }
    if (worldbookPresetNameTaken(name, selected.id)) {
      status(fromForm ? "已有同名预设，请换一个名称。" : "已有同名预设，请换一个名称后再保存。");
      return false;
    }
    const saved = { ...JSON.parse(JSON.stringify(selected)), name };
    if (selection.isNew) draft.worldbookPresets.push(saved);
    else {
      const index = draft.worldbookPresets.findIndex((preset) => preset.id === selected.id);
      if (index < 0) {
        status("找不到原预设，请刷新后重试。");
        return false;
      }
      draft.worldbookPresets[index] = saved;
    }
    selection.edit = JSON.parse(JSON.stringify(saved));
    selection.dirty = false;
    selection.isNew = false;
    render();
    return true;
  }
  function worldbookPresetState(preset, book, item) {
    const uid = item.uid ?? item.id;
    const saved = preset?.books?.find((value) => value.name === book.name)?.entries?.find((value) => String(value.uid) === String(uid));
    return saved ? saved.enabled : item.enabled !== false && item.disable !== true;
  }
  function setPresetEntry(preset, book, item, enabled) {
    const uid = item.uid ?? item.id;
    if (uid == null || String(uid) === "") throw Error("该条目没有唯一 UID，无法安全记录");
    let savedBook = preset.books.find((value) => value.name === book.name);
    if (!savedBook) {
      savedBook = { name: book.name, entries: [] };
      preset.books.push(savedBook);
    }
    const saved = savedBook.entries.find((value) => String(value.uid) === String(uid));
    if (saved) saved.enabled = enabled;
    else savedBook.entries.push({ uid, name: String(item.name || item.comment || "条目 " + uid).slice(0, 160), enabled });
  }
  function worldbookItemSearchText(item) {
    const keys = Array.isArray(item.keys) ? item.keys : Array.isArray(item.strategy?.keys) ? item.strategy.keys : [];
    return [item.name, item.comment, ...keys].map((value) => String(value || "")).join(" ").toLocaleLowerCase();
  }
  function makeWorldbookPresetId() {
    const draft = getDraft();
    const random = doc.defaultView?.crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
    const base = "worldbook-" + Date.now().toString(36) + "-" + String(random).replace(/[^a-zA-Z0-9-]/g, "");
    let id = base, index = 2;
    while (draft.worldbookPresets.some((preset) => preset.id === id)) id = base + "-" + index++;
    return id;
  }
  function worldbookPresetNameTaken(name, exceptId = "") {
    const draft = getDraft();
    const normalized = String(name || "").trim().toLocaleLowerCase();
    return draft.worldbookPresets.some((preset) => preset.id !== exceptId && preset.name.toLocaleLowerCase() === normalized);
  }
  function nextWorldbookPresetName(base) {
    const baseName = String(base || "世界书预设").trim().slice(0, 120) || "世界书预设";
    let name = baseName, index = 2;
    while (worldbookPresetNameTaken(name)) {
      const suffix = " " + index++;
      name = baseName.slice(0, 120 - suffix.length) + suffix;
    }
    return name;
  }
  function renderWorldbookPresetRows(list, preset, query, onChange = () => {
  }) {
    list.replaceChildren();
    let matches = 0, remaining = 400, limited = false;
    if (!preset) {
      list.append(el("p", "uos-help", "先新建预设。"));
      return 0;
    }
    for (const book of worldbookPresetData.books) {
      const items = book.entries.filter((item) => !query || worldbookItemSearchText(item).includes(query));
      if (!items.length) continue;
      matches += items.length;
      const shown = items.slice(0, Math.min(200, remaining));
      remaining -= shown.length;
      if (shown.length < items.length) limited = true;
      const group = el("details", "uos-worldbook-group");
      group.open = Boolean(query) || !query && worldbookPresetData.books.length === 1;
      const summary = el("summary", "", book.name + " · " + items.filter((item) => worldbookPresetState(preset, book, item)).length + "/" + items.length + " 条启用");
      group.append(summary);
      const rows = el("div", "uos-worldbook-entry-list");
      const renderEntries = () => {
        rows.replaceChildren();
        if (!group.open) return;
        for (const item of shown) {
          const uid = item.uid ?? item.id, key = uid == null ? "" : String(uid), label = el("label", "uos-worldbook-entry-toggle"), input = el("input");
          input.type = "checkbox";
          input.checked = worldbookPresetState(preset, book, item);
          input.disabled = !key || worldbookPresetData.warnings.length > 0;
          input.onchange = () => {
            try {
              setPresetEntry(preset, book, item, input.checked);
              summary.textContent = book.name + " · " + items.filter((value) => worldbookPresetState(preset, book, value)).length + "/" + items.length + " 条启用";
              onChange();
              status("预设有未保存修改；保存预设后再保存角色卡。");
            } catch (error) {
              input.checked = worldbookPresetState(preset, book, item);
              status("无法记录此条目：" + (error.message || error));
            }
          };
          label.append(input, el("span", "uos-worldbook-entry-name", String(item.name || item.comment || "未命名条目 " + (key || "（无 UID）"))));
          const keys = Array.isArray(item.keys) ? item.keys : Array.isArray(item.strategy?.keys) ? item.strategy.keys : [];
          if (keys.length) label.append(el("small", "uos-worldbook-entry-keys", "关键词：" + keys.map((value) => String(value)).slice(0, 5).join("、") + (keys.length > 5 ? "…" : "")));
          if (!key) label.append(el("small", "uos-worldbook-entry-keys", "缺少 UID，无法切换"));
          rows.append(label);
        }
      };
      group.addEventListener("toggle", renderEntries);
      group.append(rows);
      renderEntries();
      list.append(group);
    }
    if (!matches) list.append(el("p", "uos-help", query ? "没有匹配条目。" : "没有可编辑条目。"));
    if (limited) list.append(el("p", "uos-help", "结果过多，请缩小搜索范围。"));
    return matches;
  }
  function render() {
    const draft = getDraft(), panel = $("[data-worldbook-presets]");
    if (closed || !panel || !draft) return;
    panel.replaceChildren();
    const statusLine = el("p", "uos-help", worldbookPresetMessage);
    statusLine.dataset.worldbookPresetsStatus = "";
    panel.append(statusLine);
    const refresh2 = el("button", "uos-icon", "刷新");
    refresh2.type = "button";
    refresh2.onclick = async () => {
      refresh2.disabled = true;
      await refresh2();
      refresh2.disabled = false;
    };
    panel.append(refresh2);
    panel.append(el("p", "uos-help", "修改后点「保存预设」，最后点页面底部「保存到角色卡」。"));
    if (worldbookPresetData.warnings.length) panel.append(el("p", "uos-help", "有世界书未能读取，暂不能新建或编辑预设。"));
    const presets = draft.worldbookPresets || [];
    if (selection.isNew) {
      if (!selection.edit || selection.edit.id !== selection.id) {
        selection.edit = null;
        selection.isNew = false;
        selection.dirty = false;
      }
    }
    if (!selection.isNew) {
      if (!presets.some((preset) => preset.id === selection.id)) selection.id = presets[0]?.id || "";
      const saved = presets.find((preset) => preset.id === selection.id) || null;
      if (!saved) {
        selection.edit = null;
        selection.dirty = false;
      } else if (!selection.edit || selection.edit.id !== saved.id) selection.edit = JSON.parse(JSON.stringify(saved));
    }
    const active = () => selection.edit;
    const updateDirty = () => {
      if (selection.isNew) {
        selection.dirty = true;
        return;
      }
      const saved = presets.find((preset) => preset.id === selection.id);
      selection.dirty = !saved || JSON.stringify(saved) !== JSON.stringify(selection.edit);
    };
    panel.append(el("h3", "uos-worldbook-section-title", "世界书预设"));
    const createRow = el("div", "uos-worldbook-actions");
    const newName = el("input", "uos-worldbook-name");
    newName.type = "text";
    newName.maxLength = 120;
    newName.placeholder = "新预设名称（可留空）";
    const create = el("button", "uos-icon", "新建预设");
    create.type = "button";
    create.disabled = worldbookPresetData.warnings.length > 0 || selection.dirty;
    create.onclick = () => {
      try {
        const snapshot = captureWorldbookPreset(worldbookPresetData.books), name = nextWorldbookPresetName(newName.value.trim() || "世界书预设 " + (presets.length + 1));
        selection.edit = { id: makeWorldbookPresetId(), name, ...snapshot };
        selection.id = selection.edit.id;
        selection.dirty = true;
        selection.isNew = true;
        render();
        status("新预设草稿已创建；保存后才能分配给开场。");
      } catch (error) {
        status(error.message || String(error));
      }
    };
    createRow.append(newName, create);
    panel.append(createRow);
    const selectRow = el("div", "uos-worldbook-actions");
    const select = el("select", "uos-worldbook-select"), empty = doc.createElement("option");
    empty.value = "";
    empty.textContent = presets.length ? "选择预设" : "暂无预设";
    select.append(empty);
    for (const preset of presets) {
      const option = doc.createElement("option");
      option.value = preset.id;
      option.textContent = preset.name;
      select.append(option);
    }
    select.value = selection.isNew ? "" : selection.id;
    select.disabled = selection.dirty;
    select.setAttribute("aria-label", "选择世界书预设");
    select.onchange = () => {
      if (selection.dirty) {
        select.value = selection.isNew ? "" : selection.id;
        status("请先保存或撤销当前预设修改。");
        return;
      }
      selection.id = select.value;
      const saved = presets.find((preset) => preset.id === selection.id);
      selection.edit = saved ? JSON.parse(JSON.stringify(saved)) : null;
      selection.dirty = false;
      selection.isNew = false;
      render();
    };
    selectRow.append(select);
    panel.append(selectRow);
    const selected = active();
    if (selected) {
      const nameRow = el("div", "uos-worldbook-actions"), nameInput = el("input", "uos-worldbook-name");
      nameInput.type = "text";
      nameInput.maxLength = 120;
      nameInput.value = selected.name;
      nameInput.setAttribute("aria-label", "预设名称");
      const savePreset = el("button", "uos-icon", selection.isNew ? "保存新预设" : "保存预设");
      savePreset.type = "button";
      savePreset.disabled = !selection.dirty;
      const undo = el("button", "uos-icon", selection.isNew ? "取消新建" : "撤销修改");
      undo.type = "button";
      undo.disabled = !selection.dirty;
      const duplicate = el("button", "uos-icon", "复制为新预设");
      duplicate.type = "button";
      duplicate.disabled = selection.dirty || selection.isNew;
      const syncPresetControls = () => {
        updateDirty();
        savePreset.disabled = !selection.dirty;
        undo.disabled = !selection.dirty;
        duplicate.disabled = selection.dirty || selection.isNew;
        if (remove) remove.disabled = selection.dirty;
        select.disabled = selection.dirty;
        create.disabled = worldbookPresetData.warnings.length > 0 || selection.dirty;
      };
      const remove = selection.isNew ? null : el("button", "uos-icon", "删除预设");
      if (remove) {
        remove.type = "button";
        remove.disabled = selection.dirty;
        remove.onclick = async () => {
          if (!await confirmPresetDelete(selected.name) || closed || getDraft() !== draft) return;
          draft.worldbookPresets = draft.worldbookPresets.filter((preset) => preset.id !== selected.id);
          draft.entries.forEach((entry) => {
            if (entry.worldbookPresetId === selected.id) delete entry.worldbookPresetId;
          });
          selection.id = draft.worldbookPresets[0]?.id || "";
          selection.edit = null;
          selection.dirty = false;
          render();
          status("预设已删除；点击底部「保存到角色卡」写入角色卡。");
        };
      }
      const capture = el("button", "uos-icon", "复制当前世界书开关");
      capture.type = "button";
      capture.disabled = worldbookPresetData.warnings.length > 0;
      capture.title = "把酒馆当前的世界书条目开关复制到此预设，不会立即切换条目。";
      capture.onclick = () => {
        try {
          const snapshot = captureWorldbookPreset(worldbookPresetData.books);
          selected.books = snapshot.books;
          updateDirty();
          render();
          status("当前世界书开关已复制到预设草稿；点「保存预设」确认。");
        } catch (error) {
          status(error.message || String(error));
        }
      };
      nameInput.oninput = () => {
        selected.name = nameInput.value;
        syncPresetControls();
        status(selection.dirty ? "预设有未保存修改。" : "预设修改已撤销。");
      };
      savePreset.onclick = () => {
        selected.name = nameInput.value;
        if (!commitPending({ fromForm: true })) {
          nameInput.focus();
          return;
        }
        status("预设已保存；再点页面底部「保存到角色卡」写入角色卡。");
      };
      undo.onclick = () => {
        if (selection.isNew) {
          selection.id = presets[0]?.id || "";
          selection.edit = presets[0] ? JSON.parse(JSON.stringify(presets[0])) : null;
          selection.isNew = false;
          selection.dirty = false;
        } else {
          const saved = presets.find((preset) => preset.id === selected.id);
          selection.edit = saved ? JSON.parse(JSON.stringify(saved)) : null;
          selection.dirty = false;
        }
        render();
        status("预设修改已撤销。");
      };
      duplicate.onclick = () => {
        const copy = JSON.parse(JSON.stringify(selected));
        copy.id = makeWorldbookPresetId();
        copy.name = nextWorldbookPresetName(selected.name + " 副本");
        selection.id = copy.id;
        selection.edit = copy;
        selection.dirty = true;
        selection.isNew = true;
        render();
        status("已复制为新预设草稿；点「保存新预设」确认。");
      };
      nameRow.append(nameInput, savePreset, undo, duplicate);
      if (remove) nameRow.append(remove);
      nameRow.append(capture);
      panel.append(nameRow);
      const search = el("input", "uos-worldbook-search");
      search.type = "search";
      search.placeholder = "搜索条目名称、注释或关键词";
      search.setAttribute("aria-label", "搜索预设条目");
      panel.append(search);
      const bulk = el("div", "uos-worldbook-actions"), enable = el("button", "uos-icon", "在预设中启用搜索结果"), disable = el("button", "uos-icon", "在预设中停用搜索结果");
      enable.type = disable.type = "button";
      enable.disabled = disable.disabled = worldbookPresetData.warnings.length > 0;
      bulk.append(enable, disable);
      panel.append(bulk);
      const rows = el("div", "uos-worldbook-presets-list");
      panel.append(rows);
      const renderRows = () => renderWorldbookPresetRows(rows, selected, search.value.trim().toLocaleLowerCase(), syncPresetControls);
      search.oninput = renderRows;
      renderRows();
      const bulkChange = (enabled) => {
        try {
          const query = search.value.trim().toLocaleLowerCase();
          let changed = 0;
          for (const book of worldbookPresetData.books) for (const item of book.entries) {
            if ((item.uid ?? item.id) != null && (!query || worldbookItemSearchText(item).includes(query))) {
              setPresetEntry(selected, book, item, enabled);
              changed++;
            }
          }
          syncPresetControls();
          renderRows();
          status("已修改 " + changed + " 条预设开关；点「保存预设」确认。");
        } catch (error) {
          status(error.message || String(error));
        }
      };
      enable.onclick = () => bulkChange(true);
      disable.onclick = () => bulkChange(false);
    } else {
      panel.append(el("p", "uos-help", worldbookPresetData.books.length ? "先新建一个预设。" : "未读取到绑定世界书条目。"));
    }
    panel.append(el("h3", "uos-worldbook-section-title", "开场分配"));
    const assignments = el("div", "uos-worldbook-assignment-list"), openings = entries();
    openings.forEach((entry, index) => {
      var _a;
      (_a = draft.entries)[index] || (_a[index] = { ...entry });
      entry = draft.entries[index];
      const row = el("label", "uos-worldbook-assignment"), label = el("span", "uos-worldbook-assignment-name", index + 1 + " · " + entry.title);
      const choice = el("select", "uos-worldbook-select");
      choice.setAttribute("aria-label", entry.title + " 世界书预设");
      const none = doc.createElement("option");
      none.value = "";
      none.textContent = "不切换";
      choice.append(none);
      for (const preset of presets) {
        const option = doc.createElement("option");
        option.value = preset.id;
        option.textContent = preset.name;
        choice.append(option);
      }
      choice.value = entry.worldbookPresetId || "";
      choice.onchange = () => {
        if (choice.value) entry.worldbookPresetId = choice.value;
        else delete entry.worldbookPresetId;
        status("分配已修改，保存到角色卡后生效。");
      };
      row.append(label, choice);
      assignments.append(row);
    });
    if (!openings.length) assignments.append(el("p", "uos-help", "没有可分配的开场。"));
    panel.append(assignments);
  }
  return {
    render,
    refresh,
    commitPending,
    reset,
    hasUnsaved: () => selection.dirty,
    close() {
      closed = true;
      readRequest++;
      reset();
    }
  };
}

// src/media-files.js
function readMediaFile(file, view = globalThis) {
  return new Promise((resolve, reject) => {
    const reader = new view.FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
async function readLyrics(file) {
  return (await file.text()).slice(0, 3e5);
}
async function optimizeCoverData(source, file, doc = document) {
  if (file?.type === "image/gif" || !/^data:image\/(?:png|jpeg|webp);base64,/i.test(source)) return source;
  try {
    const ImageClass = doc.defaultView?.Image || Image;
    const image = new ImageClass();
    await new Promise((resolve, reject) => {
      image.onload = resolve;
      image.onerror = reject;
      image.src = source;
    });
    const width = image.naturalWidth || image.width, height = image.naturalHeight || image.height;
    if (!width || !height) return source;
    const scale = Math.min(1, 960 / Math.max(width, height));
    const canvas = doc.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) return source;
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const optimized = canvas.toDataURL("image/webp", 0.82);
    return optimized.startsWith("data:image/webp;base64,") && optimized.length < source.length ? optimized : source;
  } catch {
    return source;
  }
}

// src/media-player.js
function formatTime(seconds) {
  const value = Math.max(0, Math.floor(Number(seconds) || 0));
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}
function lyricRows(source) {
  const rows = [];
  for (const line of String(source || "").split(/\r?\n/)) {
    const match = /\[(\d{1,2}):(\d{2})(?:\.(\d{1,3}))?\](.*)/.exec(line);
    if (match) rows.push({ time: +match[1] * 60 + +match[2] + +("0." + (match[3] || "0")), text: match[4].trim() });
  }
  return rows.sort((a, b) => a.time - b.time);
}
function createMediaPlayer(root, { status = () => {
} } = {}) {
  const query = (selector) => root.querySelector(selector);
  const player = query("[data-player]"), audio = player.querySelector("audio");
  const play = query("[data-play]"), seek = query("[data-seek]"), clock = query("[data-clock]");
  const title = query("[data-music-title]"), lyrics = query("[data-lyrics]");
  const skips = Array.from(player.querySelectorAll("[data-skip]"));
  let lastRow = null, closed = false;
  function update() {
    if (closed) return;
    const duration = Number.isFinite(audio.duration) ? audio.duration : 0;
    seek.value = String(duration ? Math.round(audio.currentTime / duration * 1e3) : 0);
    clock.textContent = `${formatTime(audio.currentTime)} / ${formatTime(duration)}`;
    play.textContent = audio.paused ? "▶" : "Ⅱ";
    const rows = Array.from(lyrics.querySelectorAll("[data-time]"));
    let active = -1;
    rows.forEach((row, index) => {
      if (+row.dataset.time <= audio.currentTime + 0.08) active = index;
      row.classList.toggle("is-active", index === active);
    });
    if (active >= 0 && rows[active] !== lastRow) {
      const row = rows[active];
      lyrics.scrollTo({ top: row.offsetTop - lyrics.offsetTop - (lyrics.clientHeight - row.clientHeight) / 2, behavior: "smooth" });
      lastRow = row;
    }
  }
  function render(music) {
    if (closed) return;
    player.hidden = !music.enabled;
    const source = music.enabled ? music.audio : "";
    if (audio.getAttribute("src") !== source) {
      audio.pause();
      if (source) audio.src = source;
      else audio.removeAttribute("src");
      audio.load();
    }
    play.disabled = !source;
    title.textContent = music.title || "开场音乐";
    lyrics.replaceChildren();
    const rows = lyricRows(music.lyrics);
    if (rows.length) for (const row of rows) {
      const button = root.ownerDocument.createElement("button");
      button.className = "uos-lyric-row";
      button.textContent = row.text;
      button.type = "button";
      button.dataset.time = String(row.time);
      button.onclick = () => {
        audio.currentTime = row.time;
      };
      lyrics.append(button);
    }
    else lyrics.textContent = music.lyrics?.trim() || "♫";
    update();
  }
  play.onclick = () => {
    if (audio.paused) audio.play().catch(() => {
      if (!closed) status("无法播放该音乐文件");
    });
    else audio.pause();
  };
  skips.forEach((button) => button.onclick = () => {
    audio.currentTime = Math.max(0, Math.min(audio.duration || Infinity, audio.currentTime + Number(button.dataset.skip)));
    update();
  });
  seek.oninput = (event) => {
    if (Number.isFinite(audio.duration)) audio.currentTime = audio.duration * Number(event.target.value) / 1e3;
  };
  audio.ontimeupdate = update;
  audio.onloadedmetadata = update;
  audio.onplay = update;
  audio.onpause = update;
  function close() {
    if (closed) return;
    closed = true;
    play.onclick = null;
    seek.oninput = null;
    skips.forEach((button) => {
      button.onclick = null;
    });
    audio.ontimeupdate = null;
    audio.onloadedmetadata = null;
    audio.onplay = null;
    audio.onpause = null;
    for (const row of lyrics.querySelectorAll("[data-time]")) row.onclick = null;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
    lastRow = null;
  }
  return { render, close };
}

// src/settings-fields.js
function createSettingsFields({ el, view = globalThis, getDraft, status, onPendingChange = () => {
} }) {
  let pending = 0, closed = false;
  const current = (target) => !closed && (!target || target === getDraft());
  function field(label, value, change, multiline = false) {
    const wrap = el("label", "uos-field"), input = el(multiline ? "textarea" : "input");
    wrap.append(el("span", "", label));
    input.value = value || "";
    input.addEventListener("input", () => change(input.value));
    wrap.append(input);
    return wrap;
  }
  function toggleField(label, value, change) {
    const wrap = el("label", "uos-toggle"), input = el("input");
    input.type = "checkbox";
    input.checked = Boolean(value);
    input.onchange = () => change(input.checked);
    wrap.append(input, el("span", "", label));
    return wrap;
  }
  function fileField(label, accept, max, onload) {
    const target = getDraft(), wrap = el("label", "uos-field"), input = el("input");
    wrap.append(el("span", "", label));
    input.type = "file";
    input.accept = accept;
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file || !current(target)) return;
      if (file.size > max) {
        status(`${label}超过 ${Math.round(max / 1048576)} MB 限制`);
        input.value = "";
        return;
      }
      onPendingChange(++pending);
      try {
        const result = await readMediaFile(file, view);
        if (!current(target)) return;
        const message = await onload(result, file, target);
        if (current(target)) status(message || `${label}已载入，点击保存后随角色卡导出。`);
      } catch (error) {
        if (current(target)) status(`文件读取失败：${error.message}`);
      } finally {
        pending = Math.max(0, pending - 1);
        onPendingChange(pending);
      }
    };
    wrap.append(input);
    return wrap;
  }
  return { field, toggleField, fileField, isCurrent: current, close() {
    closed = true;
  } };
}

// src/music-settings.js
function renderMusicSettings({ root, settings, isCurrent, fields, renderMusic }) {
  const doc = root.ownerDocument;
  const el = (tag, cls, text) => {
    const node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  };
  const { field, toggleField, fileField } = fields;
  const music = root.querySelector("[data-bgm-fields]"), empty = root.querySelector("[data-bgm-empty]");
  music.replaceChildren();
  if (empty) empty.hidden = Boolean(settings.music.audio);
  const loaded = el("p", "uos-help");
  loaded.dataset.bgmLoaded = "";
  loaded.textContent = settings.music.audio ? "已载入音乐" + (settings.music.lyrics ? "及歌词" : "") + "。保存后随卡导出。" : "尚未上传音乐";
  music.append(
    toggleField("启用 BGM 播放器", settings.music.enabled, (value) => {
      settings.music.enabled = value;
      renderMusic(settings.music);
      loaded.textContent = value ? "BGM 已启用，保存后生效。" : "BGM 已关闭，播放器已隐藏；保存后生效。";
    }),
    field("曲名", settings.music.title, (value) => {
      settings.music.title = value;
    }),
    fileField("上传音乐（8 MB 内）", "audio/mpeg,audio/mp4,audio/ogg,audio/wav", 8 * 1048576, (value, _file, target) => {
      target.music.audio = value;
      if (empty) empty.hidden = true;
      renderMusic(target.music);
      loaded.textContent = target.music.enabled ? "音乐已载入，可在选择页预览；点击保存写入角色卡。" : "音乐已载入。勾选启用 BGM 后显示播放器，点击保存写入角色卡。";
    }),
    fileField("上传歌词（LRC 或 TXT）", ".lrc,.txt,text/plain", 3e5, async (_data, file, target) => {
      const lyrics = await readLyrics(file);
      if (!isCurrent(target)) return;
      target.music.lyrics = lyrics;
      renderMusic(target.music);
      loaded.textContent = "歌词已载入；点击保存写入角色卡。";
    }),
    loaded
  );
  const clear = el("button", "uos-icon", "移除音乐");
  clear.type = "button";
  clear.onclick = () => {
    settings.music = { enabled: false, title: "", audio: "", lyrics: "" };
    if (empty) empty.hidden = false;
    renderMusic(settings.music);
    loaded.textContent = "音乐已移除，点击保存生效";
  };
  music.append(clear, el("p", "uos-help", "请仅上传你有权分享的歌曲及歌词。下载与非商用不自动授予再分发许可。"));
}

// src/author-opening-card.js
function createAuthorOpeningCard({ el, entry, index, body, host, onChoose, onPreview, favoriteButton }) {
  const names = Array.isArray(entry.names) ? entry.names : String(entry.names || "").split(/[、，,\/]/).map((name) => name.trim()).filter(Boolean);
  const shell = el("article", "uos-card-shell"), card = el("button", "uos-card");
  card.type = "button";
  card.setAttribute("aria-label", `选择 ${entry.title}`);
  const cover = el("div", "uos-cover"), art = el("span", "uos-theme-art");
  art.setAttribute("aria-hidden", "true");
  cover.append(art);
  applyOpeningCover(cover, entry, body || entry.title, index, host, { shade: true });
  cover.append(el("span", "uos-number", String(index + 1).padStart(2, "0")));
  const content = el("div", "uos-card-body");
  if (entry.label) content.append(el("span", "uos-label", entry.label));
  content.append(el("strong", "", entry.title));
  if (entry.description) content.append(el("div", "uos-description", entry.description));
  const chips = openingTagChips(el, entry.tags);
  if (chips) content.append(chips);
  if (names.length) {
    const cast = el("p", "uos-card-names");
    cast.append(el("span", "uos-cast-label", "人物"));
    for (const name of names.slice(0, 3)) cast.append(el("span", "uos-name-chip", name));
    if (names.length > 3) cast.append(el("span", "uos-name-chip", `+${names.length - 3}`));
    content.append(cast);
  }
  card.append(cover, content);
  if (onChoose) card.addEventListener("click", () => onChoose(index + 1));
  else card.disabled = true;
  shell.append(card);
  if (body) {
    const details = el("div", "uos-card-details uos-card-actions"), button = el("button", "uos-card-preview-button");
    button.type = "button";
    decorateOpeningPreviewButton(button, el);
    if (onPreview) button.onclick = () => onPreview(index + 1, button);
    else button.disabled = true;
    details.append(button, favoriteButton || openingFavoriteButton(el, { key: entry.favoriteKey, title: entry.title, selected: entry.favorite }));
    shell.append(details);
  }
  return shell;
}

// generated/author-css.js
var AUTHOR_CSS = `:root{color-scheme:dark;font-family:system-ui,"Noto Sans SC",sans-serif}*{box-sizing:border-box}body{margin:0;background:transparent;color:var(--text)}button,input,textarea{font:inherit}button{cursor:pointer}.uos{--bg:#101820;--panel:#1a2630;--text:#f5eee2;--muted:#aeb6b7;--accent:#cf9b66;--line:#a7805d88;--art:#324653;background:radial-gradient(circle at 80% -10%,var(--art),transparent 55%),var(--bg);min-height:420px;padding:clamp(18px,4vw,40px);border:1px solid var(--line);border-radius:18px;box-shadow:0 20px 50px #0007;position:relative;overflow:hidden}.uos[data-theme=archive]{--bg:#111a20;--panel:#1b2930;--text:#f4ecda;--muted:#b8b4a8;--accent:#c99d67;--line:#a5794e88;--art:#485043}.uos[data-theme=neon]{--bg:#090b1e;--panel:#17132e;--text:#f5eaff;--muted:#beb3d7;--accent:#f572c0;--line:#af71ed99;--art:#39265c}.uos[data-theme=paper]{--bg:#efe7d8;--panel:#fffaf0;--text:#362e2b;--muted:#685d55;--accent:#a75345;--line:#b8947baa;--art:#d7b7a1;color-scheme:light}.uos[data-theme=noir]{--bg:#111113;--panel:#222326;--text:#f4f3f0;--muted:#b3b5b8;--accent:#d9dfdf;--line:#81858c99;--art:#42484f}.uos[data-theme=meadow]{--bg:#132821;--panel:#213b2d;--text:#f1f5dc;--muted:#c2cdb5;--accent:#c8df88;--line:#98b06b99;--art:#456846}.uos:before{content:"";position:absolute;inset:0;pointer-events:none;opacity:.12;background:repeating-linear-gradient(0deg,transparent 0 3px,#fff 4px);mix-blend-mode:soft-light}.uos>*{position:relative}.uos-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.uos-kicker{font-size:11px;letter-spacing:.26em;color:var(--accent);font-weight:800}.uos-actions{display:flex;gap:8px;flex-shrink:0}.uos-icon{border:1px solid var(--line);background:var(--panel);color:var(--text);border-radius:10px;padding:9px 12px;min-height:38px;white-space:nowrap;font-size:12px}.uos-icon:hover,.uos-card:hover{border-color:var(--accent);transform:translateY(-2px)}h1{font-size:clamp(26px,5vw,46px);line-height:1.2;margin:30px 0 10px;letter-spacing:.035em}.uos-intro{max-width:720px;color:var(--muted);line-height:1.7;margin:0 0 28px}.uos-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,230px),1fr));gap:16px}.uos-card{border:1px solid var(--line);padding:0;background:var(--panel);color:var(--text);border-radius:14px;text-align:left;overflow:hidden;transition:transform .2s,border-color .2s;min-width:0}.uos-cover{height:150px;display:flex;align-items:flex-end;padding:16px;background:linear-gradient(125deg,var(--art),var(--panel));position:relative;overflow:hidden}.uos-cover.has-image{background-position:center;background-size:cover}.uos-cover.has-image:after{content:"";position:absolute;inset:30% 0 0;background:linear-gradient(transparent,#0008)}.uos-number{font-family:Georgia,serif;font-size:68px;line-height:.9;font-weight:700;opacity:.5;color:var(--accent);position:relative;z-index:1}.uos-card-body{padding:16px}.uos-label{font-size:11px;letter-spacing:.14em;color:var(--accent);font-weight:800}.uos-card strong{display:block;font-size:18px;margin:8px 0;line-height:1.35}.uos-description{color:var(--muted);font-size:13px;line-height:1.6;min-height:40px}.uos-footer{margin-top:22px;color:var(--muted);font-size:12px;line-height:1.6}.uos-player{display:flex;gap:12px;align-items:center;margin:0 0 22px;padding:12px;border:1px solid var(--line);background:var(--panel);border-radius:12px}.uos-player button{background:var(--accent);border:0;border-radius:8px;padding:7px 12px;color:var(--bg)}.uos-player-meta{min-width:0;flex:1}.uos-lyric{color:var(--muted);font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.uos-dialog{position:fixed;inset:0;z-index:50;display:grid;place-items:center;background:#000a;padding:12px}.uos-dialog[hidden]{display:none}.uos-sheet{width:min(740px,100%);max-height:95vh;overflow:auto;background:var(--bg);color:var(--text);border:1px solid var(--accent);border-radius:16px;padding:20px;box-shadow:0 20px 60px #0009}.uos-sheet-head{display:flex;justify-content:space-between;align-items:center;gap:10px}.uos-sheet h2{margin:0 0 10px}.uos-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px}.uos-field{display:grid;gap:6px;margin:10px 0;font-size:13px}.uos-field input,.uos-field textarea{width:100%;border:1px solid var(--line);border-radius:7px;padding:9px;background:var(--panel);color:var(--text)}.uos-field textarea{min-height:60px;resize:vertical}.uos-entry{border-top:1px solid var(--line);padding:10px 0}.uos-help{color:var(--muted);font-size:12px;line-height:1.6}.uos-save{border:0;border-radius:8px;padding:10px 16px;background:var(--accent);color:var(--bg);font-weight:700}.uos-status{min-height:20px;color:var(--accent);font-size:12px}.uos-theme-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:8px}.uos-theme-choice{border:1px solid var(--line);border-radius:9px;padding:12px 4px;background:var(--panel);color:var(--text)}.uos-theme-choice[aria-pressed=true]{outline:2px solid var(--accent)}@media(max-width:600px){.uos-theme-grid{grid-template-columns:repeat(3,1fr)}.uos{padding:18px}.uos-cover{height:130px}}@media(prefers-reduced-motion:reduce){.uos-card{transition:none}.uos-icon:hover,.uos-card:hover{transform:none}}
:where([hidden]){display:none!important}

/* A fixed viewport inside the settings pane previews real responsive breakpoints. */
.uos-page-preview{min-width:0;margin:18px 0;padding:12px;border:1px solid var(--accent);border-radius:12px;background:var(--panel)}
.uos-page-preview>summary{display:grid;grid-template-columns:38px minmax(0,1fr) auto;align-items:center;gap:12px;min-height:64px;padding:6px 2px;color:var(--accent);cursor:pointer;list-style:none}
.uos-page-preview>summary::-webkit-details-marker{display:none}
.uos-page-preview>summary:focus-visible{outline:2px solid var(--accent);outline-offset:4px;border-radius:6px}
.uos-page-preview-icon{display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--line);border-radius:10px;background:var(--bg);font-size:22px}
.uos-page-preview-copy{display:grid;gap:5px;min-width:0}
.uos-page-preview-copy strong{font-size:16px;font-weight:750;line-height:1.5;overflow-wrap:anywhere}
.uos-page-preview-copy small{color:var(--muted);font-size:12px;line-height:1.6;overflow-wrap:anywhere}
.uos-page-preview-action{padding:6px 10px;border:1px solid var(--accent);border-radius:8px;background:var(--accent);color:var(--bg);font-size:12px;font-weight:650;white-space:nowrap}
@media(max-width:480px){.uos-page-preview>summary{grid-template-columns:minmax(0,1fr) auto;gap:8px}.uos-page-preview-icon{display:none}.uos-page-preview-action{padding:6px 8px}}
.uos-page-preview-tools{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
.uos-page-preview-tools button{min-height:44px}
.uos-page-preview-tools button[aria-pressed=true]{border-color:var(--accent);color:var(--accent);box-shadow:inset 0 0 0 1px var(--accent)}
.uos-page-preview-stage{position:relative;width:100%;height:420px;overflow:hidden;border:1px solid var(--line);border-radius:9px;background:var(--bg)}
.uos-page-preview-frame{display:block;width:390px;max-width:none;height:420px;margin:0;padding:0;border:0;background:transparent;transform-origin:top left}

/* Soundtrack panel follows the five selector themes. */
.uos-player[hidden],.uos-dialog[hidden],[data-tab-panel][hidden]{display:none!important}
.uos-player{position:relative;display:block;margin:0 0 24px;padding:17px 19px 15px;border:1px solid var(--line);border-radius:16px;background:linear-gradient(115deg,var(--panel),var(--bg) 60%,var(--art));box-shadow:inset 0 1px 0 #ffffff1a,0 16px 34px #0005;overflow:hidden}
.uos-player::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--accent)}
.uos-player-head{display:flex;align-items:center;gap:14px;margin-bottom:12px}
.uos-player-record{display:grid;place-items:center;flex:none;width:46px;height:46px;border:1px solid var(--accent);border-radius:50%;background:repeating-radial-gradient(circle,var(--bg) 0 2px,var(--art) 3px 4px);box-shadow:0 3px 12px #0009}
.uos-player-record::after{content:"";width:11px;height:11px;border-radius:50%;background:var(--accent);border:2px solid var(--bg)}
.uos-player-meta{min-width:0;flex:1}.uos-player-kicker{display:block;margin-bottom:3px;color:var(--accent);font-size:10px;letter-spacing:.2em}.uos-player-meta strong{display:block;font-size:clamp(17px,2.8vw,22px);color:var(--text)}
.uos-player-controls{display:flex;align-items:center;gap:8px}.uos-player-controls button{flex:none;width:32px;height:32px;padding:0;border:1px solid var(--line);border-radius:50%;background:var(--panel);color:var(--text);font-size:16px}.uos-player-controls [data-play]{width:40px;height:40px;background:var(--accent);border-color:var(--accent);color:var(--bg)}
.uos-player-track{display:flex;align-items:center;gap:12px}.uos-player-track input{flex:1;min-width:0;accent-color:var(--accent)}.uos-player-track span{color:var(--muted);font-size:11px;font-variant-numeric:tabular-nums;white-space:nowrap}
.uos-lyrics{height:138px;margin-top:14px;padding:28px 8px;border-top:1px solid var(--line);overflow-y:auto;scrollbar-width:thin;text-align:center;color:var(--muted);font-size:13px;line-height:1.5;mask-image:linear-gradient(transparent,#000 22%,#000 80%,transparent)}
.uos-player .uos-lyric-row{display:block;width:100%;min-height:0;margin:0 auto 11px;padding:4px 8px;text-align:center;border:0;border-radius:0;background:transparent;box-shadow:none;color:var(--muted);font:13px/1.45 "Noto Serif SC","Songti SC",serif;transition:color .2s,transform .2s}.uos-player .uos-lyric-row:hover,.uos-player .uos-lyric-row:focus-visible{color:var(--text);outline:0;background:transparent;transform:none}.uos-player .uos-lyric-row.is-active{color:var(--accent);font-weight:700;transform:scale(1.03);text-shadow:0 0 22px currentColor;background:transparent}
.uos-player audio{display:none}
.uos-tabs{display:flex;gap:8px;margin:14px 0 18px;padding:4px;border:1px solid var(--line);border-radius:12px;background:var(--panel)}.uos-tabs button{flex:1;padding:9px 12px;border:0;border-radius:9px;background:transparent;color:var(--muted)}.uos-tabs button[aria-selected=true]{background:var(--accent);color:var(--bg);font-weight:700}
.uos-sheet{max-height:min(88dvh,820px)}
@media(max-width:600px){.uos-player{padding:14px}.uos-player-head{gap:9px}.uos-player-record{width:36px;height:36px}.uos-player-controls{gap:4px}.uos-player-controls button{width:28px;height:28px}.uos-player-controls [data-play]{width:36px;height:36px}.uos-player-track{gap:7px}}
.uos-toggle{display:flex;align-items:center;gap:10px;margin:10px 0 16px;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel);color:var(--text);font-weight:700}.uos-toggle input{width:18px;height:18px;accent-color:var(--accent)}.uos-player-controls [data-play]:disabled{opacity:.5;cursor:not-allowed}
:host{font-family:system-ui,"Noto Sans SC",sans-serif}.uos-dialog{position:fixed;inset:0;box-sizing:border-box;z-index:1;pointer-events:auto;overflow:hidden}.uos-sheet{box-sizing:border-box;min-height:0;max-height:calc(100dvh - 24px);max-width:100%;overscroll-behavior:contain}.uos-dialog button,.uos-dialog input,.uos-dialog textarea{font:inherit}

.uos-top-status{min-height:0;margin:10px 0 0}.uos-top-status:empty{display:none}
.uos-cover-preview{height:88px;margin:10px 0;border:1px solid var(--line);border-radius:10px}.uos-cover-preview .uos-number{font-size:45px}
.uos-source{margin:10px 0;color:var(--muted);font-size:12px}.uos-source summary{cursor:pointer;color:var(--accent);padding:8px 0}.uos-source pre{white-space:pre-wrap;overflow-wrap:anywhere;max-height:180px;overflow:auto;margin:0;padding:10px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--text);font-size:12px;line-height:1.6;font-family:inherit}
.uos-card-preview{max-width:300px;margin:8px 0 14px;pointer-events:none}.uos-card-preview .uos-cover{height:96px}.uos-card-preview .uos-number{font-size:48px}.uos-card-preview .uos-card-body{padding:12px}.uos-entry>.uos-icon{margin:0 8px 8px 0;white-space:normal;text-align:left}
.uos-theme-choice{display:grid;gap:8px;text-align:center}.uos-theme-swatch{--sw-bg:#111a20;--sw-art:#485043;--sw-accent:#c99d67;display:grid;align-content:center;gap:5px;height:72px;padding:8px;border:1px solid var(--sw-accent);border-radius:7px;background:linear-gradient(135deg,var(--sw-art),var(--sw-bg));color:var(--sw-accent);text-align:left}.uos-theme-swatch[data-theme=neon]{--sw-bg:#090b1e;--sw-art:#39265c;--sw-accent:#f572c0}.uos-theme-swatch[data-theme=paper]{--sw-bg:#fffaf0;--sw-art:#d7b7a1;--sw-accent:#a75345}.uos-theme-swatch[data-theme=noir]{--sw-bg:#111113;--sw-art:#42484f;--sw-accent:#d9dfdf}.uos-theme-swatch[data-theme=meadow]{--sw-bg:#132821;--sw-art:#456846;--sw-accent:#c8df88}.uos-theme-swatch-cover{font:bold 27px Georgia,serif;line-height:1}.uos-theme-swatch-lines{font-size:8px;letter-spacing:.08em;white-space:nowrap;overflow:hidden}
.uos-diagnostic-row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);font-size:12px}.uos-diagnostic-row span{color:var(--muted)}.uos-diagnostic-row strong{text-align:right;overflow-wrap:anywhere}

/* Six visual identities share the same layout and controls. */
.uos{--display:Georgia,"Noto Serif SC","Songti SC",serif;--cover:linear-gradient(135deg,var(--art),var(--panel));--surface:var(--panel);font-family:system-ui,"Noto Sans SC",sans-serif;isolation:isolate}
.uos h1{font-family:var(--display);font-weight:600;letter-spacing:.065em;color:var(--text)!important}
.uos .uos-card{background:var(--surface);box-shadow:0 12px 30px #0002}
.uos .uos-cover:not(.has-image){background:var(--cover)}
.uos .uos-card strong{font-family:var(--display);font-size:20px;font-weight:600}
.uos .uos-kicker{display:inline-flex;align-items:center;gap:12px;line-height:1.5}
.uos .uos-kicker:before{content:"";width:22px;height:1px;background:currentColor}
.uos .uos-number{font-weight:400;font-variant-numeric:lining-nums}
.uos .uos-icon,.uos .uos-card,.uos .uos-player{transition:border-color .2s,box-shadow .2s,transform .2s}
.uos .uos-icon:focus-visible,.uos .uos-card:focus-visible,.uos-theme-choice:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.uos[data-theme=archive]{--bg:#111a21;--panel:#202d35;--surface:#1a272e;--text:#f1e7d4;--muted:#bbb7aa;--accent:#deb47c;--line:#b9966959;--art:#334b50;--cover:radial-gradient(circle at 78% 20%,#a6895850,transparent 48%),repeating-linear-gradient(0deg,transparent 0 25px,#ffffff0b 26px 27px),linear-gradient(145deg,#31454a,#17232b 72%);background:radial-gradient(circle at 84% 4%,#86704b3b,transparent 42%),linear-gradient(140deg,#192832,#101a21 72%)}
.uos[data-theme=archive] .uos-card{border-radius:4px 18px 4px 18px;border-color:#bb9d6f69}.uos[data-theme=archive] .uos-card-body{border-top:1px solid #deb47c55}.uos[data-theme=archive] .uos-number{font-style:italic}.uos[data-theme=archive] .uos-kicker{font-family:Georgia,serif}
.uos[data-theme=neon]{--bg:#080e22;--panel:#171c38;--surface:#111c32;--text:#f5f1ff;--muted:#b8b2d1;--accent:#fa74bf;--line:#9d7de37a;--art:#2e356b;--cover:radial-gradient(circle at 75% 12%,#ae74fa77,transparent 33%),linear-gradient(135deg,#392657,#11142c 75%);background:radial-gradient(circle at 94% 6%,#e34fba4d,transparent 35%),radial-gradient(circle at 4% 70%,#9a56d440,transparent 42%),#080e22}
.uos[data-theme=neon] .uos-card{border-color:#ad86df9c;box-shadow:0 14px 40px #060c26,0 0 16px #8e5ccb32}.uos[data-theme=neon] .uos-cover{border-bottom:2px solid #f572c0b0}.uos[data-theme=neon] .uos-number{text-shadow:0 0 22px #f572c088}.uos[data-theme=neon] .uos-kicker{color:#d7a7ff}.uos[data-theme=neon] .uos-icon:hover{box-shadow:0 0 16px #fa74bf66}
.uos[data-theme=paper]{--bg:#f4eee2;--panel:#fffaf0;--surface:#fffaf0;--text:#362d29;--muted:#675950;--accent:#a64d3c;--line:#a77e6b8c;--art:#e0c2ab;--cover:radial-gradient(circle at 80% 28%,#fffaf0,transparent 45%),linear-gradient(135deg,#d5b29d,#eee0cc 80%);background:repeating-linear-gradient(0deg,transparent 0 27px,#92796913 28px 29px),radial-gradient(circle at 90% 0%,#d7a38277,transparent 42%),#f4eee2;color-scheme:light}
.uos[data-theme=paper]:before{opacity:.15;background:repeating-linear-gradient(90deg,#9a785016 0 1px,transparent 1px 5px);mix-blend-mode:multiply}.uos[data-theme=paper] .uos-card{border-radius:3px 18px 3px 18px;box-shadow:5px 7px 0 #997d6033}.uos[data-theme=paper] .uos-number{color:#a64d3c;opacity:.62}.uos[data-theme=paper] .uos-kicker{letter-spacing:.18em}.uos[data-theme=paper] .uos-icon{background:#fffaf0}
.uos[data-theme=noir]{--bg:#121314;--panel:#27292b;--surface:#1d1f20;--text:#f2f1ec;--muted:#babbb9;--accent:#e4e1d5;--line:#a3a3a36b;--art:#545759;--cover:linear-gradient(90deg,#0c0d0e 0 8px,transparent 8px calc(100% - 8px),#0c0d0e calc(100% - 8px)),repeating-linear-gradient(0deg,#353738 0 24px,#525455 24px 26px);background:radial-gradient(circle at 65% 8%,#77777735,transparent 40%),#121314}
.uos[data-theme=noir]:before{opacity:.12;background-image:repeating-linear-gradient(90deg,#fff 0 1px,transparent 1px 4px)}.uos[data-theme=noir] .uos-card,.uos[data-theme=noir] .uos-icon{border-radius:2px}.uos[data-theme=noir] .uos-cover{filter:grayscale(1)}.uos[data-theme=noir] .uos-kicker{letter-spacing:.31em}.uos[data-theme=noir] .uos-card-body{border-top:2px solid #eee9}
.uos[data-theme=meadow]{--bg:#122a24;--panel:#254037;--surface:#203a30;--text:#f3f4e1;--muted:#c2d1bf;--accent:#d2e5a0;--line:#afc28970;--art:#587760;--cover:radial-gradient(ellipse at 75% 25%,#d2e5a050,transparent 36%),linear-gradient(150deg,#688775,#294f43 65%,#1b392f);background:radial-gradient(ellipse at 92% 0%,#9ec49b4d,transparent 45%),linear-gradient(160deg,#1f4338,#122a24 70%)}
.uos[data-theme=meadow]:before{opacity:.12;background:repeating-radial-gradient(ellipse at 85% 10%,transparent 0 19px,#d2e5a0 20px 21px,transparent 22px 48px)}.uos[data-theme=meadow] .uos-card{border-radius:22px 6px 22px 6px}.uos[data-theme=meadow] .uos-cover{border-bottom:1px solid #d2e5a083}.uos[data-theme=meadow] .uos-number{font-style:italic}.uos[data-theme=meadow] h1{font-weight:500}
.uos-theme-swatch[data-theme=archive]{--sw-bg:#111a21;--sw-art:#334b50;--sw-accent:#deb47c}.uos-theme-swatch[data-theme=neon]{--sw-bg:#080e22;--sw-art:#392657;--sw-accent:#fa74bf}.uos-theme-swatch[data-theme=paper]{--sw-bg:#f4eee2;--sw-art:#d5b29d;--sw-accent:#a64d3c}.uos-theme-swatch[data-theme=noir]{--sw-bg:#121314;--sw-art:#525455;--sw-accent:#e4e1d5}.uos-theme-swatch[data-theme=meadow]{--sw-bg:#122a24;--sw-art:#688775;--sw-accent:#d2e5a0}.uos-theme-swatch[data-theme=ancient]{--sw-bg:#201a20;--sw-art:#684d51;--sw-accent:#dbb77c}
.uos[data-theme=ancient]{--bg:#201a20;--panel:#302329;--surface:#38292d;--text:#f5ead5;--muted:#d4c1ae;--accent:#dbb77c;--line:#b98d6c99;--art:#684d51;--display:"Noto Serif SC","Songti SC",serif;--cover:radial-gradient(circle at 75% 32%,#d9ae7e55,transparent 34%),repeating-linear-gradient(135deg,transparent 0 15px,#e9c59316 16px 17px),linear-gradient(125deg,#6b4247,#241e28 75%);background:radial-gradient(circle at 100% 0%,#a56b5940,transparent 45%),linear-gradient(145deg,#2a2025,#19171d 78%)}
.uos[data-theme=ancient]:before{opacity:.17;background:repeating-linear-gradient(90deg,transparent 0 23px,#d6ac711f 24px 25px)}.uos[data-theme=ancient] .uos-card{border-radius:3px;border:1px solid #ba8d6c;outline:1px solid #b98d6c70;outline-offset:-6px;box-shadow:0 12px 32px #100d14aa}.uos[data-theme=ancient] .uos-cover:not(.has-image):after{content:"卷·故事";position:absolute;right:13px;bottom:13px;writing-mode:horizontal-tb;white-space:nowrap;letter-spacing:.12em;color:#f5e2baaa;font-size:11px;line-height:1;padding:5px 8px;border:1px solid #ba8d6c77;background:#241e28a8;border-radius:2px}.uos[data-theme=ancient] .uos-card-body{border-top:2px solid #ba8d6c77}.uos[data-theme=ancient] .uos-number{font-style:italic;text-shadow:0 2px 12px #1a0c13}.uos[data-theme=ancient] .uos-kicker{letter-spacing:.36em}
@media(max-width:600px){.uos{border-radius:0!important;box-shadow:none!important}.uos h1{font-size:clamp(27px,8vw,38px)}.uos .uos-card{box-shadow:none}.uos-theme-swatch{height:64px}}
.uos-watermark{margin:18px 0 0;padding-top:10px;border-top:1px solid var(--line);color:var(--muted);font-size:10px;line-height:1.5;letter-spacing:.04em;text-align:center}

/* Compact summaries keep long or numerous greetings readable. */
.uos-grid{grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr));align-items:start}
.uos-card-shell{min-width:0;border:1px solid var(--line);border-radius:14px;background:var(--surface);overflow:hidden}
.uos-card-shell .uos-card{display:block;width:100%;height:100%;border:0;border-radius:0;box-shadow:none;text-align:left}
.uos-card-shell .uos-cover{height:112px}
.uos-card-shell .uos-card-body{min-height:148px}
.uos-card-shell .uos-card strong{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere}
.uos-card-shell .uos-description{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:anywhere;min-height:0}
.uos-card-names{color:var(--accent);font-size:12px;line-height:1.5;margin:12px 0 0;overflow-wrap:anywhere}
.uos-card-details{padding:0 14px 14px;color:var(--text);font-size:12px}


.uos-watermark{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;overflow-wrap:anywhere}
.uos-version{margin-left:auto;color:var(--accent);font:10px/1.5 Georgia,serif;white-space:nowrap}
@media(max-width:600px){.uos-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.uos-card-shell .uos-cover{height:82px;padding:9px}.uos-card-shell .uos-number{font-size:48px}.uos-card-shell .uos-card-body{min-height:158px;padding:10px}.uos-card-shell .uos-card strong{font-size:15px}.uos-card-shell .uos-description{font-size:11px}.uos-card-details{padding:0 9px 9px}}
@media(max-width:390px){.uos-grid{grid-template-columns:1fr}.uos-card-shell .uos-card-body{min-height:0}}

.uos-version-badge{display:block;margin-top:3px;color:var(--muted);font:10px/1.3 Georgia,serif;letter-spacing:.04em}.uos-update-star{margin-left:2px;color:var(--accent);font:700 8px/1 system-ui,sans-serif;vertical-align:super}.uos-update-section{margin:12px 0;padding:12px;border:1px solid var(--line);border-radius:10px;background:var(--panel)}.uos-update-section .uos-toggle{max-width:420px}

/* New author themes: orbital chart, candlelit romance, emergency dispatch. */
.uos-theme-swatch[data-theme=starmap]{--sw-bg:#0b1930;--sw-art:#23476c;--sw-accent:#9fdbea}
.uos[data-theme=starmap]{--bg:#09182c;--panel:#132b42;--surface:#10253b;--text:#e5f5f9;--muted:#abc6d2;--accent:#9bdbe9;--line:#64a9c276;--art:#265779;--cover:radial-gradient(circle at 73% 35%,transparent 0 34px,#8bd3df66 35px 36px,transparent 37px),radial-gradient(circle at 73% 35%,transparent 0 66px,#8bd3df33 67px 68px,transparent 69px),radial-gradient(circle at 73% 35%,#fff 0 2px,transparent 3px),linear-gradient(135deg,#1e4766,#0b2038);background:radial-gradient(circle at 80% 10%,#377c9970,transparent 36%),repeating-linear-gradient(90deg,transparent 0 38px,#93dce90d 39px 40px),#09182c}
.uos[data-theme=starmap] .uos-card{border-radius:18px 4px 18px 4px;border-color:#78bed19c}.uos[data-theme=starmap] .uos-number{font:300 55px/1 system-ui,sans-serif;letter-spacing:-.12em}.uos[data-theme=starmap] .uos-cover{border-bottom:1px solid #a1e7ef88}.uos[data-theme=starmap] .uos-kicker{letter-spacing:.3em}
.uos-theme-swatch[data-theme=rose]{--sw-bg:#38242e;--sw-art:#9d6978;--sw-accent:#f5cfbd}
.uos[data-theme=rose]{--bg:#31232d;--panel:#49323e;--surface:#503743;--text:#fff0e7;--muted:#e4c9ca;--accent:#f2c5b5;--line:#dea5ac88;--art:#a86781;--display:"Noto Serif SC",Georgia,serif;--cover:radial-gradient(ellipse at 75% 25%,#ffe4d691,transparent 28%),radial-gradient(ellipse at 35% 85%,#d16f8d66,transparent 40%),linear-gradient(125deg,#9c586c,#382733 75%);background:radial-gradient(circle at 95% 0%,#db849362,transparent 40%),linear-gradient(150deg,#513442,#281f2a)}
.uos[data-theme=rose] .uos-card{border-radius:24px 24px 6px 6px;border-color:#e9b7ae88}.uos[data-theme=rose] .uos-number{font-style:italic;color:#ffe0d0}.uos[data-theme=rose] .uos-cover:not(.has-image):after{content:"✦";position:absolute;right:17px;top:11px;color:#ffe5daaa;font-size:28px}.uos[data-theme=rose] .uos-kicker{font-family:Georgia,serif;letter-spacing:.18em}
.uos-theme-swatch[data-theme=wasteland]{--sw-bg:#202426;--sw-art:#735343;--sw-accent:#f4ae75}
.uos[data-theme=wasteland]{--bg:#1c2225;--panel:#2b3132;--surface:#292c2d;--text:#f5ece2;--muted:#c9bcb2;--accent:#f3a969;--line:#c9805488;--art:#745343;--display:system-ui,"Noto Sans SC",sans-serif;--cover:repeating-linear-gradient(135deg,#f3a96928 0 7px,transparent 8px 18px),linear-gradient(145deg,#78513e,#252a2b 70%);background:radial-gradient(circle at 95% 0%,#a75b3c55,transparent 36%),repeating-linear-gradient(0deg,transparent 0 31px,#f3a9690a 32px 33px),#1c2225}
.uos[data-theme=wasteland] .uos-card{border-radius:3px;border-left:4px solid var(--accent);box-shadow:5px 6px 0 #0b111490}.uos[data-theme=wasteland] .uos-number{font:800 57px/1 system-ui,sans-serif}.uos[data-theme=wasteland] .uos-kicker{text-transform:uppercase;letter-spacing:.22em}.uos[data-theme=wasteland] .uos-cover{border-bottom:2px solid #f3a96999}
.uos-search{display:flex;gap:10px;flex-wrap:wrap;margin:0 0 18px}.uos-search input,.uos-search select{min-width:0;flex:1 1 180px;padding:9px 12px;border:1px solid var(--line);border-radius:8px;background:var(--panel);color:var(--text)}.uos-search-empty{grid-column:1/-1;color:var(--muted);padding:16px;border:1px dashed var(--line);border-radius:8px}

/* The author page uses the active theme as a frame around the whole story index. */
.uos{
  border:2px solid var(--accent);
  padding:clamp(25px,4vw,44px);
  box-shadow:0 20px 50px #0006,inset 0 0 0 5px #ffffff08;
}
.uos::after{
  content:"";
  position:absolute;
  inset:9px;
  z-index:0;
  pointer-events:none;
  border:1px solid var(--line);
  border-radius:10px;
  opacity:.75;
  background:
    linear-gradient(var(--accent),var(--accent)) left top/28px 2px no-repeat,
    linear-gradient(var(--accent),var(--accent)) left top/2px 28px no-repeat,
    linear-gradient(var(--accent),var(--accent)) right top/28px 2px no-repeat,
    linear-gradient(var(--accent),var(--accent)) right top/2px 28px no-repeat,
    linear-gradient(var(--accent),var(--accent)) left bottom/28px 2px no-repeat,
    linear-gradient(var(--accent),var(--accent)) left bottom/2px 28px no-repeat,
    linear-gradient(var(--accent),var(--accent)) right bottom/28px 2px no-repeat,
    linear-gradient(var(--accent),var(--accent)) right bottom/2px 28px no-repeat;
}
.uos> :not(.uos-dialog){z-index:1}
.uos-top{flex-wrap:wrap;padding-bottom:17px;margin-bottom:24px;border-bottom:1px solid var(--line)}
.uos-actions{margin-left:auto}
.uos h1{margin:0 0 13px;max-width:24ch;line-height:1.18;text-wrap:balance}
.uos-intro{margin-bottom:26px;padding-left:14px;border-left:2px solid var(--accent);line-height:1.8}
.uos-search{gap:12px;margin-bottom:24px;padding:11px;border:1px solid var(--line);border-radius:12px;background:var(--surface)}
.uos-search input,.uos-search select{min-height:42px}
.uos-search input:focus-visible,.uos-search select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.uos-card-shell{box-shadow:0 12px 26px #0002;transition:transform .2s,border-color .2s,box-shadow .2s}
.uos-card-shell:hover,.uos-card-shell:focus-within{transform:translateY(-2px);border-color:var(--accent);box-shadow:0 18px 32px #0004}
.uos-card-shell .uos-card:hover{transform:none}
.uos-footer{padding-top:18px;border-top:1px solid var(--line)}
.uos[data-theme=neon]{box-shadow:0 20px 50px #0007,0 0 26px #c277ed35,inset 0 0 0 5px #f572c008}
.uos[data-theme=paper]{box-shadow:0 15px 35px #60423029,inset 0 0 0 5px #a64d3c08}
.uos[data-theme=noir]::after{border-style:double;border-width:3px;opacity:.58}
.uos[data-theme=ancient]::after{border-radius:2px;opacity:.85}
.uos[data-theme=wasteland]::after{border-radius:2px}
@media(max-width:600px){
  .uos{padding:23px 18px 25px;border-radius:0!important;box-shadow:none!important}
  .uos::after{inset:6px;border-radius:0;opacity:.55;background-size:18px 2px,2px 18px,18px 2px,2px 18px,18px 2px,2px 18px,18px 2px,2px 18px}
  .uos-top{gap:10px;margin-bottom:20px;padding-bottom:13px}
  .uos-kicker{font-size:10px;letter-spacing:.16em}
  .uos-intro{margin-bottom:18px}
  .uos-search{padding:8px;margin-bottom:18px}
  .uos-card-shell{box-shadow:none}
}
@media(prefers-reduced-motion:reduce){.uos-card-shell{transition:none}.uos-card-shell:hover{transform:none}}

/* Theme illustrations: one transparent 5×4 sprite, shared by the masthead,
   story covers, theme swatches and the empty-search state. */
.uos-theme-art,.uos-theme-swatch-art,.uos-kicker::after,.uos-search-empty::before{
  background-image:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-icons.webp");
  background-size:500% 400%;background-repeat:no-repeat;
}
.uos{
  --uos-empty-opening-art:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/tab-openings.webp");
  --uos-diagnostics-art:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/tab-diagnostics.webp");
  --uos-theme-bg-archive:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-archive.webp");
  --uos-theme-bg-neon:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-neon.webp");
  --uos-theme-bg-paper:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-paper.webp");
  --uos-theme-bg-noir:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-noir.webp");
  --uos-theme-bg-meadow:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-meadow.webp");
  --uos-theme-bg-ancient:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-ancient.webp");
  --uos-theme-bg-starmap:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-starmap.webp");
  --uos-theme-bg-rose:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-rose.webp");
  --uos-theme-bg-wasteland:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-wasteland.webp");
}
.uos[data-theme=archive]{--uos-theme-bg-active:var(--uos-theme-bg-archive)}
.uos[data-theme=neon]{--uos-theme-bg-active:var(--uos-theme-bg-neon)}
.uos[data-theme=paper]{--uos-theme-bg-active:var(--uos-theme-bg-paper)}
.uos[data-theme=noir]{--uos-theme-bg-active:var(--uos-theme-bg-noir)}
.uos[data-theme=meadow]{--uos-theme-bg-active:var(--uos-theme-bg-meadow)}
.uos[data-theme=ancient]{--uos-theme-bg-active:var(--uos-theme-bg-ancient)}
.uos[data-theme=starmap]{--uos-theme-bg-active:var(--uos-theme-bg-starmap)}
.uos[data-theme=rose]{--uos-theme-bg-active:var(--uos-theme-bg-rose)}
.uos[data-theme=wasteland]{--uos-theme-bg-active:var(--uos-theme-bg-wasteland)}
.uos-background-art{
  position:absolute!important;z-index:0!important;top:0;left:0;right:0;height:clamp(300px,54vw,540px);
  pointer-events:none;background-image:var(--uos-theme-bg-active);background-repeat:no-repeat;background-position:center top;background-size:cover;
  opacity:.68;-webkit-mask-image:linear-gradient(to bottom,#000 0%,#000 44%,transparent 100%);mask-image:linear-gradient(to bottom,#000 0%,#000 44%,transparent 100%);
}
.uos[data-theme=paper] .uos-background-art{opacity:.92;mix-blend-mode:multiply}
.uos[data-theme=neon] .uos-background-art{opacity:.56}
.uos[data-theme=meadow] .uos-background-art{opacity:.56}
.uos[data-theme=rose] .uos-background-art{opacity:.56}
.uos[data-theme=wasteland] .uos-background-art{opacity:.60}
.uos-theme-art{position:absolute;z-index:2;top:7px;right:9px;width:50px;aspect-ratio:1;pointer-events:none;opacity:.95;filter:drop-shadow(0 2px 5px #0008);background-position:var(--theme-icon-position,0% 0%)}
.uos-kicker::after{content:"";display:inline-block;flex:none;width:25px;height:25px;margin-left:2px;vertical-align:middle;filter:drop-shadow(0 1px 4px #0005);background-position:var(--theme-icon-position,0% 0%)}
.uos-theme-swatch{position:relative;overflow:hidden}
.uos-theme-swatch-art{position:absolute;right:3px;top:3px;width:40px;height:40px;opacity:.9;filter:drop-shadow(0 1px 3px #0009);background-position:var(--theme-icon-position,0% 0%)}
.uos-search-empty{grid-column:1/-1;display:flex;align-items:center;gap:16px;min-height:98px;padding:16px 20px;border:1px dashed var(--line);border-radius:15px;background:linear-gradient(115deg,var(--panel),var(--bg) 88%);color:var(--muted)}
.uos-search-empty::before{content:"";display:block;flex:none;width:64px;height:64px;border:1px solid var(--line);border-radius:50%;background-color:var(--surface);filter:drop-shadow(0 3px 6px #0005);background-position:var(--theme-icon-position,0% 0%)}
.uos-tabs button{display:flex;align-items:center;justify-content:center;gap:7px;min-width:0;white-space:nowrap}
.uos-tab-art{display:block;flex:none;width:34px;height:34px;background-position:center;background-size:contain;background-repeat:no-repeat;filter:drop-shadow(0 2px 4px #0005)}
.uos-tab-art[data-tab-art=openings]{background-image:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/tab-openings.webp")}
.uos-tab-art[data-tab-art=worldbooks]{background-image:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/tab-worldbooks.webp")}
.uos-tab-art[data-tab-art=bgm]{background-image:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/tab-bgm.webp")}
.uos-tab-art[data-tab-art=diagnostics]{background-image:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/tab-diagnostics.webp")}
.uos-tab-art[data-tab-art=updates]{background-image:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/tab-updates.webp")}
.uos-empty-music{width:min(100%,180px);height:126px;margin:18px auto 10px;background:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/tab-bgm.webp") center/contain no-repeat;opacity:.92;filter:drop-shadow(0 8px 14px #0006)}
.uos[data-theme=archive],.uos-theme-swatch[data-theme=archive]{--theme-icon-position:0% 0%}
.uos[data-theme=neon],.uos-theme-swatch[data-theme=neon]{--theme-icon-position:25% 0%}
.uos[data-theme=paper],.uos-theme-swatch[data-theme=paper]{--theme-icon-position:50% 0%}
.uos[data-theme=noir],.uos-theme-swatch[data-theme=noir]{--theme-icon-position:0% 33.333%}
.uos[data-theme=meadow],.uos-theme-swatch[data-theme=meadow]{--theme-icon-position:25% 33.333%}
.uos[data-theme=ancient],.uos-theme-swatch[data-theme=ancient]{--theme-icon-position:50% 33.333%}
.uos[data-theme=starmap],.uos-theme-swatch[data-theme=starmap]{--theme-icon-position:0% 66.667%}
.uos[data-theme=rose],.uos-theme-swatch[data-theme=rose]{--theme-icon-position:25% 66.667%}
.uos[data-theme=wasteland],.uos-theme-swatch[data-theme=wasteland]{--theme-icon-position:50% 66.667%}
@media(max-width:600px){.uos-theme-art{top:4px;right:4px;width:34px}.uos-kicker::after{width:21px;height:21px}.uos-theme-swatch-art{width:32px;height:32px}.uos-search-empty{gap:10px;min-height:82px;padding:12px}.uos-search-empty::before{width:52px;height:52px}.uos-tab-art{width:29px;height:29px}.uos-tabs button{gap:5px;padding:8px 5px;font-size:12px}.uos-empty-music{height:104px}}

.uos-person-rules{grid-column:1/-1}.uos-person-rules summary{cursor:pointer;color:var(--accent)}.uos-worldbook-people{max-height:240px;overflow:auto;padding-left:22px;overflow-wrap:anywhere;font-size:13px}.uos-worldbook-people li{margin:10px 0}.uos-worldbook-people p{margin:4px 0;color:var(--muted);font-size:12px;line-height:1.5}
.uos-worldbook-opening{margin:12px 0;padding:12px;border:1px solid var(--line);border-radius:13px;background:color-mix(in srgb,var(--panel) 86%,transparent)}
.uos-worldbook-opening>summary,.uos-worldbook-group>summary{cursor:pointer;color:var(--text);font-weight:700;overflow-wrap:anywhere}
.uos-worldbook-opening>summary{display:flex;align-items:center;justify-content:space-between;gap:10px}
.uos-worldbook-opening-state{flex:none;color:var(--accent);font-size:11px;font-weight:600}
.uos-worldbook-actions{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0}
.uos-worldbook-actions>.uos-icon{max-width:100%;white-space:normal;line-height:1.35;overflow-wrap:anywhere}
.uos-worldbook-search{display:block;width:100%;margin:12px 0;padding:10px;border:1px solid var(--line);border-radius:9px;background:var(--bg);color:var(--text)}
.uos-worldbook-group{margin:8px 0;padding:10px;border:1px solid var(--line);border-radius:10px;background:var(--bg)}
.uos-worldbook-entry-list{max-height:300px;overflow:auto;margin-top:8px}
.uos-worldbook-entry-toggle{display:grid;grid-template-columns:20px minmax(0,1fr);gap:5px 9px;align-items:start;margin:5px 0;padding:9px;border:1px solid color-mix(in srgb,var(--line) 65%,transparent);border-radius:8px;background:var(--panel);cursor:pointer}
.uos-worldbook-entry-toggle input{width:17px;height:17px;margin:1px 0 0;accent-color:var(--accent)}
.uos-worldbook-entry-name{overflow-wrap:anywhere;font-size:13px;line-height:1.45}
.uos-worldbook-entry-keys{grid-column:2;color:var(--muted);font-size:11px;line-height:1.4;overflow-wrap:anywhere}
.uos-worldbook-presets-list{margin-top:8px}
.uos-worldbook-section-title{margin:20px 0 8px;padding-top:14px;border-top:1px solid var(--line);color:var(--accent);font-size:15px}
.uos-worldbook-actions>.uos-worldbook-name,.uos-worldbook-actions>.uos-worldbook-select{flex:1;min-width:120px;padding:9px 10px;border:1px solid var(--line);border-radius:9px;background:var(--bg);color:var(--text)}
.uos-worldbook-assignment-list{display:grid;gap:8px;margin-top:8px}
.uos-worldbook-assignment{display:grid;grid-template-columns:minmax(0,1fr) minmax(140px,.8fr);gap:10px;align-items:center;padding:10px;border:1px solid var(--line);border-radius:9px;background:var(--panel);font-size:13px}
.uos-worldbook-assignment-name{overflow-wrap:anywhere}
.uos-worldbook-assignment>.uos-worldbook-select{min-width:0;width:100%;padding:9px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--text)}
@media(max-width:600px){.uos-tabs{gap:3px}.uos-tabs button{padding:7px 3px;font-size:11px}.uos-worldbook-opening{padding:9px}.uos-worldbook-actions{gap:5px}.uos-worldbook-actions .uos-icon{padding:7px;font-size:12px}.uos-worldbook-assignment{grid-template-columns:1fr;gap:6px}}

/* Five illustrated settings tabs need a readable label row on narrow screens. */
@media(max-width:600px){.uos-tabs button{flex-direction:column;gap:3px}}

/* Story cards: consistent hierarchy with theme-specific palette and silhouette. */
.uos .uos-card-shell{background:linear-gradient(145deg,color-mix(in srgb,var(--accent) 6%,var(--surface)),var(--surface) 65%);box-shadow:inset 0 1px color-mix(in srgb,var(--text) 12%,transparent),0 8px 22px #0002}
.uos-card-shell .uos-card{background:transparent}
.uos-card-shell .uos-cover{height:104px;border-bottom:1px solid color-mix(in srgb,var(--accent) 25%,var(--line))}
.uos-card-shell .uos-number{font-size:46px;letter-spacing:-.04em;opacity:.6}
.uos-card-shell .uos-card-body{padding:18px;min-height:176px}
.uos-card-shell .uos-card strong{font-size:20px;line-height:1.5;margin:9px 0 12px;-webkit-line-clamp:2;text-wrap:pretty}
.uos-card-shell .uos-description{line-height:1.75;min-height:46px}
.uos-card-names{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:16px 0 0}
.uos-cast-label{width:100%;font-size:10px;letter-spacing:.12em;color:var(--muted);margin-bottom:2px}
.uos-name-chip{display:inline-block;max-width:100%;overflow-wrap:anywhere;padding:4px 9px;border:1px solid color-mix(in srgb,var(--accent) 28%,var(--line));border-radius:6px;background:color-mix(in srgb,var(--accent) 8%,var(--surface));color:var(--accent);font-size:12px;line-height:1.5}
.uos-card-details{padding:0 18px 12px}
.uos .uos-card-shell:active{transform:translateY(0);box-shadow:inset 0 1px color-mix(in srgb,var(--text) 12%,transparent)}
@media(hover:none){.uos .uos-card-shell:hover{transform:none}}
@media(max-width:600px){.uos-card-shell .uos-cover{height:82px}.uos-card-shell .uos-number{font-size:36px}.uos-card-shell .uos-card-body{padding:13px;min-height:168px}.uos-card-shell .uos-card strong{font-size:17px}.uos-card-shell .uos-description{font-size:12px}.uos-card-details{padding:0 13px 10px}.uos-name-chip{font-size:11px;padding:3px 7px}}
@media(prefers-reduced-motion:reduce){.uos .uos-card-shell:active{transform:none}}

/* Three additional themes complete the same background, palette and icon system. */
.uos{--uos-theme-bg-deepsea:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-deepsea.webp");--uos-theme-bg-amber:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-amber.webp");--uos-theme-bg-theatre:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-theatre.webp")}
.uos[data-theme=deepsea]{--bg:#071a24;--panel:#10303d;--surface:#0d2835;--text:#e8f7f5;--muted:#a9c8cc;--accent:#84dadd;--line:#72b8c57a;--art:#18566a;--cover:radial-gradient(circle at 73% 25%,#72dce566,transparent 34%),linear-gradient(145deg,#15536a,#0a2635 75%);background:radial-gradient(ellipse at 85% 0%,#21728a55,transparent 44%),linear-gradient(160deg,#0b2a39,#071a24 75%)}
.uos[data-theme=deepsea] .uos-card{border-radius:16px 5px 16px 5px;border-color:#72b8c599;box-shadow:0 12px 34px #020e17aa,0 0 15px #45bac022}
.uos[data-theme=deepsea] .uos-kicker{color:#9ce6df}.uos[data-theme=deepsea] .uos-number{text-shadow:0 0 20px #51c6dd66}
.uos[data-theme=amber]{--bg:#24170f;--panel:#3a281b;--surface:#302116;--text:#fbebcf;--muted:#d2bc98;--accent:#e9bd75;--line:#d3a46677;--art:#966038;--cover:radial-gradient(circle at 74% 25%,#f2c46f88,transparent 34%),linear-gradient(145deg,#a36031,#382116 75%);background:radial-gradient(ellipse at 55% 0%,#9b572d44,transparent 48%),linear-gradient(160deg,#362114,#21150f 78%)}
.uos[data-theme=amber] .uos-card{border-radius:20px 7px 20px 7px;border-color:#d9ae708c;box-shadow:0 12px 28px #130b07aa}.uos[data-theme=amber] .uos-kicker{color:#f0c982}.uos[data-theme=amber] .uos-number{color:#f0c982}
.uos[data-theme=theatre]{--bg:#1b111e;--panel:#332438;--surface:#281b2e;--text:#f8edf1;--muted:#cab4c5;--accent:#e1b783;--line:#c18ba577;--art:#77405b;--cover:radial-gradient(circle at 74% 23%,#d9a76766,transparent 34%),linear-gradient(145deg,#714154,#2a1b31 76%);--display:"Noto Serif SC","Songti SC",serif;background:radial-gradient(ellipse at 83% 0%,#77405b55,transparent 45%),linear-gradient(155deg,#2c1b31,#190f1b 76%)}
.uos[data-theme=theatre] .uos-card{border-radius:4px 14px;border-color:#d2a47891;box-shadow:0 12px 32px #09070baa}.uos[data-theme=theatre] .uos-card-body{border-top:1px solid #e1b78366}.uos[data-theme=theatre] .uos-kicker{letter-spacing:.18em}
.uos-theme-swatch[data-theme=deepsea]{--sw-bg:#071a24;--sw-art:#18566a;--sw-accent:#84dadd}.uos-theme-swatch[data-theme=amber]{--sw-bg:#24170f;--sw-art:#966038;--sw-accent:#e9bd75}.uos-theme-swatch[data-theme=theatre]{--sw-bg:#1b111e;--sw-art:#77405b;--sw-accent:#e1b783}
.uos[data-theme=deepsea],.uos-theme-swatch[data-theme=deepsea]{--theme-icon-position:75% 0%}.uos[data-theme=amber],.uos-theme-swatch[data-theme=amber]{--theme-icon-position:75% 33.333%}.uos[data-theme=theatre],.uos-theme-swatch[data-theme=theatre]{--theme-icon-position:75% 66.667%}
.uos[data-theme=deepsea]{--uos-theme-bg-active:var(--uos-theme-bg-deepsea)}.uos[data-theme=amber]{--uos-theme-bg-active:var(--uos-theme-bg-amber)}.uos[data-theme=theatre]{--uos-theme-bg-active:var(--uos-theme-bg-theatre)}
.uos[data-theme=deepsea] .uos-background-art{opacity:.54}.uos[data-theme=amber] .uos-background-art{opacity:.58}.uos[data-theme=theatre] .uos-background-art{opacity:.52}

/* Three new themes: rainy last train, an aurora lighthouse and a glasshouse at dawn. */
.uos{--uos-theme-bg-lasttrain:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-lasttrain.webp");--uos-theme-bg-aurora:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-aurora.webp");--uos-theme-bg-glasshouse:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-glasshouse.webp")}
.uos[data-theme=lasttrain]{--bg:#101922;--panel:#1b2934;--surface:#17232e;--text:#eef1ef;--muted:#b6c0c5;--accent:#d9a86e;--line:#b38b616e;--art:#3e4e5c;--cover:radial-gradient(circle at 72% 24%,#d9a86e88,transparent 32%),linear-gradient(145deg,#475c6b,#17232e 76%);background:radial-gradient(ellipse at 18% 0%,#b7793d38,transparent 43%),linear-gradient(160deg,#1b2a36,#101922 78%)}
.uos[data-theme=lasttrain] .uos-card{border-radius:5px 5px 16px 5px;border-color:#d5ae7b88;box-shadow:0 12px 30px #050c13aa}.uos[data-theme=lasttrain] .uos-number{color:#e4b77e}.uos[data-theme=lasttrain] .uos-kicker{color:#e4c18e}
.uos[data-theme=aurora]{--bg:#081827;--panel:#102c42;--surface:#0d2437;--text:#e9f7ff;--muted:#afccdc;--accent:#90e5d7;--line:#77bfc58a;--art:#1d5d6a;--cover:radial-gradient(circle at 72% 22%,#55d7bd88,transparent 32%),linear-gradient(145deg,#1e6470,#102a40 76%);background:radial-gradient(ellipse at 72% 0%,#2ec9b755,transparent 44%),linear-gradient(160deg,#102b45,#081827 78%)}
.uos[data-theme=aurora] .uos-card{border-radius:18px 5px 18px 5px;border-color:#81ded377;box-shadow:0 12px 34px #020f19aa,0 0 17px #53cec51f}.uos[data-theme=aurora] .uos-kicker{color:#a5f0df}.uos[data-theme=aurora] .uos-number{text-shadow:0 0 21px #53d9d266}
.uos[data-theme=glasshouse]{--bg:#15251e;--panel:#293a30;--surface:#1e3027;--text:#f1f4e9;--muted:#bdcbbd;--accent:#dab487;--line:#9db79d87;--art:#4f6c57;--cover:radial-gradient(circle at 72% 22%,#dab48788,transparent 33%),linear-gradient(145deg,#688266,#293a30 76%);background:radial-gradient(ellipse at 78% 0%,#92ad6b44,transparent 48%),linear-gradient(160deg,#26392e,#15251e 78%)}
.uos[data-theme=glasshouse] .uos-card{border-radius:18px 6px 18px 6px;border-color:#c1cfa388;box-shadow:0 12px 28px #0c1510aa}.uos[data-theme=glasshouse] .uos-card-body{border-top:1px solid #dab48750}.uos[data-theme=glasshouse] .uos-kicker{letter-spacing:.16em}
.uos-theme-swatch[data-theme=lasttrain]{--sw-bg:#101922;--sw-art:#3e4e5c;--sw-accent:#d9a86e}.uos-theme-swatch[data-theme=aurora]{--sw-bg:#081827;--sw-art:#1d5d6a;--sw-accent:#90e5d7}.uos-theme-swatch[data-theme=glasshouse]{--sw-bg:#15251e;--sw-art:#4f6c57;--sw-accent:#dab487}
.uos[data-theme=lasttrain],.uos-theme-swatch[data-theme=lasttrain]{--theme-icon-position:100% 0%}.uos[data-theme=aurora],.uos-theme-swatch[data-theme=aurora]{--theme-icon-position:100% 33.333%}.uos[data-theme=glasshouse],.uos-theme-swatch[data-theme=glasshouse]{--theme-icon-position:100% 66.667%}
.uos[data-theme=lasttrain]{--uos-theme-bg-active:var(--uos-theme-bg-lasttrain)}.uos[data-theme=aurora]{--uos-theme-bg-active:var(--uos-theme-bg-aurora)}.uos[data-theme=glasshouse]{--uos-theme-bg-active:var(--uos-theme-bg-glasshouse)}
.uos[data-theme=lasttrain] .uos-background-art{opacity:.57}.uos[data-theme=aurora] .uos-background-art{opacity:.57}.uos[data-theme=glasshouse] .uos-background-art{opacity:.62}

/* Moonlit shrine: indigo, quiet sakura and restrained shrine-gold. */
.uos{--uos-theme-bg-japan:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-background-japan.webp")}
.uos[data-theme=japan]{--bg:#151827;--panel:#242437;--surface:#1b1d2e;--text:#f4edf0;--muted:#c8b8c1;--accent:#dfbd9a;--line:#c889a66b;--art:#64354d;--cover:radial-gradient(circle at 73% 23%,#e8b9c988,transparent 33%),linear-gradient(145deg,#673349,#262238 76%);--display:"Noto Serif SC","Songti SC",serif;background:radial-gradient(ellipse at 74% 0%,#a9507250,transparent 46%),linear-gradient(155deg,#292139,#151827 78%)}
.uos[data-theme=japan] .uos-card{border-radius:12px 12px 18px 18px;border-color:#d8b78388;background:repeating-linear-gradient(90deg,transparent 0 20px,#d6b57b09 21px 22px),linear-gradient(135deg,#30253a,#1b1d2e 78%);box-shadow:0 12px 30px #080a16aa}
.uos[data-theme=japan] .uos-kicker,.uos[data-theme=japan] .uos-number{color:#e4c08e}.uos[data-theme=japan] .uos-card-body{border-top:1px solid #e2bdd04d}
.uos-theme-swatch[data-theme=japan]{--sw-bg:#151827;--sw-art:#64354d;--sw-accent:#dfbd9a}
.uos[data-theme=japan],.uos-theme-swatch[data-theme=japan]{--theme-icon-position:0% 100%}
.uos[data-theme=japan]{--uos-theme-bg-active:var(--uos-theme-bg-japan)}
.uos[data-theme=japan] .uos-background-art{opacity:.62}

/* Airy Japanese urban school-life theme; its two standalone assets keep old atlases unchanged. */
.uos{--uos-theme-bg-school:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@b11e5addc6e1e60dae710ed4d83cb4c8565b77ea/assets/theme-background-school.webp")}
.uos[data-theme=school]{--bg:#eef4fb;--panel:#ffffff;--surface:#f7faff;--text:#263b57;--muted:#536982;--accent:#32659b;--line:#b8cbdf;--art:#b9d9ee;--cover:radial-gradient(circle at 75% 22%,#f3bdd180,transparent 35%),linear-gradient(135deg,#c1dff3,#f8e5ed);--display:system-ui,"Noto Sans SC",sans-serif;--uos-theme-bg-active:var(--uos-theme-bg-school);background:radial-gradient(ellipse at 80% 0%,#e7c4d744,transparent 50%),var(--bg);color-scheme:light}
.uos[data-theme=school] .uos-card{border-radius:15px;border-color:#b8cbdf;background:linear-gradient(145deg,#fff,#f5f8fe);box-shadow:0 10px 28px #5881a81a}
.uos[data-theme=school] .uos-card-body{border-top:1px solid #d5deee}.uos[data-theme=school] .uos-background-art{opacity:.85}
.uos[data-theme=school] :is(input,select,textarea){color-scheme:light}
.uos-theme-swatch[data-theme=school]{--sw-bg:#eef4fb;--sw-art:#c5dfef;--sw-accent:#32659b}
.uos[data-theme=school] .uos-theme-art,.uos[data-theme=school] .uos-search-empty::before,.uos-theme-swatch[data-theme=school] .uos-theme-swatch-art{background-image:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@b11e5addc6e1e60dae710ed4d83cb4c8565b77ea/assets/theme-icon-school.webp");background-size:contain;background-position:center;background-repeat:no-repeat;filter:drop-shadow(0 2px 4px #5881a833)}
.uos[data-theme=school] .uos-header-ornament{background-image:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@b11e5addc6e1e60dae710ed4d83cb4c8565b77ea/assets/theme-ornament-school.webp");background-size:contain;background-position:center}

/* Generated transparent material ornaments: 4 x 4 atlas, decorative only. */
.uos{--uos-ornament-sprite:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@444518cc8d97befd6016e7b948066ef23fd4e560/assets/theme-ornaments.webp");--ornament-position:0% 0%}
.uos-header-ornament{display:block;pointer-events:none;background-image:var(--uos-ornament-sprite);background-size:400% 400%;background-position:var(--ornament-position);background-repeat:no-repeat;filter:drop-shadow(0 2px 3px #0003)}
.uos .uos-kicker{display:flex;align-items:center;gap:10px}.uos .uos-kicker::after{display:none}.uos-header-ornament{width:76px;height:76px;flex:none}
.uos-card-shell{position:relative;isolation:isolate}
.uos-cover:not(.has-image){background-image:radial-gradient(ellipse at 70% 0%,color-mix(in srgb,var(--accent) 14%,transparent),transparent 70%),var(--cover,linear-gradient(125deg,var(--art),var(--panel)))}
.uos-card-shell .uos-card-body{background-image:linear-gradient(125deg,#ffffff05,transparent 45%);box-shadow:inset 0 1px 0 #ffffff0d}
@media(max-width:600px){.uos-header-ornament{width:56px;height:56px}}
.uos[data-theme=archive]{--ornament-position:0.00000% 0.00000%}
.uos[data-theme=neon]{--ornament-position:33.33333% 0.00000%}
.uos[data-theme=paper]{--ornament-position:66.66667% 0.00000%}
.uos[data-theme=noir]{--ornament-position:100.00000% 0.00000%}
.uos[data-theme=meadow]{--ornament-position:0.00000% 33.33333%}
.uos[data-theme=ancient]{--ornament-position:33.33333% 33.33333%}
.uos[data-theme=starmap]{--ornament-position:66.66667% 33.33333%}
.uos[data-theme=rose]{--ornament-position:100.00000% 33.33333%}
.uos[data-theme=wasteland]{--ornament-position:0.00000% 66.66667%}
.uos[data-theme=deepsea]{--ornament-position:33.33333% 66.66667%}
.uos[data-theme=amber]{--ornament-position:66.66667% 66.66667%}
.uos[data-theme=theatre]{--ornament-position:100.00000% 66.66667%}
.uos[data-theme=lasttrain]{--ornament-position:0.00000% 100.00000%}
.uos[data-theme=aurora]{--ornament-position:33.33333% 100.00000%}
.uos[data-theme=glasshouse]{--ornament-position:66.66667% 100.00000%}
.uos[data-theme=japan]{--ornament-position:100.00000% 100.00000%}

/* Keep opening numbers readable on narrow covers. */


.uos-card-shell .uos-number{flex:none;white-space:nowrap;max-width:100%}
@media(max-width:600px){.uos[data-theme] .uos-card-shell .uos-number{font-size:28px;letter-spacing:-.04em}}
.uos[data-theme] .uos-card-shell .uos-cover.has-image .uos-number{opacity:1;color:#fff;background:#111a20b3;border-radius:6px;padding:5px 9px;font-size:clamp(24px,4vw,32px);line-height:1}

/* Clear hierarchy with full information available in the preview. */
.uos-results{margin:0 0 14px;color:var(--muted);font-size:12px}
.uos-card .uos-description{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;line-height:1.7}
.uos-card .uos-card-names{margin:10px 0;font-size:12px}

.uos-card-body>strong{line-height:1.5;overflow-wrap:anywhere}

/* Settings hierarchy: category navigation, grouped fields and persistent save. */
[data-settings-dialog] .uos-tabs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:5px}
[data-settings-dialog] .uos-tabs button{white-space:normal;line-height:1.4;padding:10px 6px}
.uos-settings-group{padding:16px;margin:14px 0;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
.uos-settings-group h3,.uos-settings-entries h3{font-size:16px;margin:0 0 8px;color:var(--text)}
.uos-settings-group>summary,.uos-settings-entry>summary{cursor:pointer;color:var(--accent);font-weight:650;line-height:1.6;overflow-wrap:anywhere}
.uos-settings-group .uos-field{margin:14px 0}.uos-settings-group .uos-help{margin:8px 0}
.uos-settings-entry{margin:12px 0;padding:14px;border:1px solid var(--line);border-radius:12px;background:var(--panel)}
.uos-settings-entry[open]>summary{padding-bottom:12px;border-bottom:1px solid var(--line);margin-bottom:14px}
.uos-settings-entry .uos-card-preview{max-width:100%;width:300px}
.uos-settings-savebar{position:sticky;bottom:-20px;z-index:5;background:var(--bg);padding:12px 0 8px;border-top:1px solid var(--line);margin-top:18px}
.uos-settings-savebar .uos-save{margin:0;width:100%}.uos-settings-savebar [data-save-state]:empty{display:none}
@media(max-width:600px){[data-settings-dialog] .uos-tabs{grid-template-columns:repeat(3,minmax(0,1fr))}.uos-settings-group,.uos-settings-entry{padding:12px}.uos-settings-entry .uos-fields{grid-template-columns:1fr}}

/* Author story entrance: title first, one compact tool row. */
.uos-masthead{position:relative;padding:6px 0 22px;margin-bottom:22px;border-bottom:1px solid var(--line)}
.uos .uos-masthead .uos-kicker{display:block;font-size:10px;letter-spacing:.18em;line-height:1.5;padding-right:64px;opacity:.85}
.uos .uos-masthead .uos-kicker:before{display:none}
.uos .uos-masthead h1{font-size:clamp(25px,4.5vw,40px);line-height:1.35;margin:12px 0 10px;padding-right:64px;overflow-wrap:anywhere}
.uos .uos-masthead .uos-intro{font-size:14px;line-height:1.75;margin:0 0 18px;max-width:680px;overflow-wrap:anywhere}
.uos .uos-masthead .uos-intro:empty{display:none}
.uos-masthead .uos-header-ornament{position:absolute;right:0;top:0;width:54px;height:54px;pointer-events:none}
.uos .uos-masthead .uos-top{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin:0;padding:0;border:0}
.uos-opening-count{margin:0;color:var(--muted);font-size:12px;line-height:1.6}
.uos .uos-masthead .uos-actions{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-left:auto;max-width:100%}
.uos-masthead .uos-icon{padding:8px 12px;font-size:12px;min-height:36px}
.uos-masthead .uos-version-badge{font:10px/1.4 system-ui,sans-serif;letter-spacing:0;margin:0;white-space:nowrap;opacity:.75}
@media(max-width:600px){.uos-masthead{padding-top:0;margin-bottom:16px;padding-bottom:16px}.uos .uos-masthead h1{font-size:26px;margin-top:9px}.uos .uos-masthead .uos-intro{font-size:13px;margin-bottom:14px}.uos .uos-masthead .uos-actions{margin-left:0;width:100%}.uos-masthead .uos-version-badge{margin-left:auto}.uos-masthead .uos-header-ornament{width:48px;height:48px}}


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
:is(.uos,.uos-user-panel) .uos-blind-range-trigger{appearance:none!important;min-height:44px;display:block;flex:none;max-width:100%;overflow-wrap:anywhere;white-space:normal;text-align:left;margin:0 0 0 auto!important;padding:7px 12px!important;border:1px solid var(--line)!important;border-radius:9px!important;background:var(--surface)!important;color:var(--muted)!important;font:600 12px/1.5 system-ui,sans-serif!important;cursor:pointer}:is(.uos,.uos-user-panel) .uos-blind-range-trigger:focus-visible{outline:2px solid var(--accent)!important;outline-offset:2px}
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


.uos-brand{display:flex;align-items:center;gap:12px;max-width:100%;margin:0 0 16px;box-sizing:border-box;pointer-events:none}
.uos-masthead .uos-brand{padding-right:64px}
.uos-brand-avatar{display:block;flex:none;width:76px;height:70px;filter:drop-shadow(0 2px 3px #0002);background-color:transparent;background-image:var(--uos-theme-mascot-image,url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@64c34a71954308f54f0b648c721dc77f679c6e66/assets/brand/theme-mascots.webp"));background-size:400% 500%;background-position:var(--uos-mascot-position,0% 0%);background-repeat:no-repeat}
.uos-brand-copy{display:grid;gap:4px;min-width:0;color:var(--text);font-family:system-ui,"Noto Sans SC",sans-serif}
.uos-brand-copy strong{font-size:15px;font-weight:700;line-height:1.4;letter-spacing:.09em;overflow-wrap:anywhere}
.uos-brand-copy small{color:var(--muted);font-size:11px;line-height:1.5;letter-spacing:.08em}
.uos-user-panel .uos-brand{margin-bottom:12px}
.uos-user-panel .uos-brand-avatar{width:64px;height:59px}
.uos-user-head>div:first-child{min-width:0;flex:1}
.uos-mascot-note{display:flex;align-items:center;gap:14px;padding:14px 16px;margin:0 0 16px;border:1px solid var(--line);border-radius:14px;background:var(--panel,var(--surface));color:var(--muted);font:13px/1.7 system-ui,"Noto Sans SC",sans-serif;box-sizing:border-box;min-width:0}
.uos-mascot-note img{display:block;width:94px;height:86px;object-fit:contain;flex:none}
.uos-mascot-note span{min-width:0;overflow-wrap:anywhere}
.uos-brand img[hidden],.uos-mascot-note img[hidden]{display:none}
.uos .uos-search-empty.uos-mascot-note::before{display:none}
.uos .uos-search-empty:not(.uos-mascot-note)::before{background-image:url("https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@64c34a71954308f54f0b648c721dc77f679c6e66/assets/brand/search.webp");background-size:contain;background-position:center;background-repeat:no-repeat}
.uos-search-empty.uos-mascot-note,.uos-user-empty.uos-mascot-note{grid-column:1/-1;margin:10px 0;min-height:112px}
@media(max-width:600px){.uos-mascot-note{padding:12px;gap:10px;font-size:12px}.uos-mascot-note img{width:76px;height:70px}}
@media(max-width:600px){.uos-brand{gap:10px;margin-bottom:12px}.uos-brand-avatar,.uos-user-panel .uos-brand-avatar{width:58px;height:53px}.uos-brand-copy strong{font-size:13px;letter-spacing:.04em}.uos-brand-copy small{font-size:10px;letter-spacing:.04em}}
.uos[data-theme="archive"] .uos-brand-avatar,.uos-user-panel[data-theme="archive"] .uos-brand-avatar,.uos-user-trigger[data-theme="archive"] .uos-brand-avatar{--uos-mascot-position:0% 0%}
.uos[data-theme="neon"] .uos-brand-avatar,.uos-user-panel[data-theme="neon"] .uos-brand-avatar,.uos-user-trigger[data-theme="neon"] .uos-brand-avatar{--uos-mascot-position:33.33333333333333% 0%}
.uos[data-theme="paper"] .uos-brand-avatar,.uos-user-panel[data-theme="paper"] .uos-brand-avatar,.uos-user-trigger[data-theme="paper"] .uos-brand-avatar{--uos-mascot-position:66.66666666666666% 0%}
.uos[data-theme="noir"] .uos-brand-avatar,.uos-user-panel[data-theme="noir"] .uos-brand-avatar,.uos-user-trigger[data-theme="noir"] .uos-brand-avatar{--uos-mascot-position:100% 0%}
.uos[data-theme="meadow"] .uos-brand-avatar,.uos-user-panel[data-theme="meadow"] .uos-brand-avatar,.uos-user-trigger[data-theme="meadow"] .uos-brand-avatar{--uos-mascot-position:0% 25%}
.uos[data-theme="ancient"] .uos-brand-avatar,.uos-user-panel[data-theme="ancient"] .uos-brand-avatar,.uos-user-trigger[data-theme="ancient"] .uos-brand-avatar{--uos-mascot-position:33.33333333333333% 25%}
.uos[data-theme="starmap"] .uos-brand-avatar,.uos-user-panel[data-theme="starmap"] .uos-brand-avatar,.uos-user-trigger[data-theme="starmap"] .uos-brand-avatar{--uos-mascot-position:66.66666666666666% 25%}
.uos[data-theme="rose"] .uos-brand-avatar,.uos-user-panel[data-theme="rose"] .uos-brand-avatar,.uos-user-trigger[data-theme="rose"] .uos-brand-avatar{--uos-mascot-position:100% 25%}
.uos[data-theme="wasteland"] .uos-brand-avatar,.uos-user-panel[data-theme="wasteland"] .uos-brand-avatar,.uos-user-trigger[data-theme="wasteland"] .uos-brand-avatar{--uos-mascot-position:0% 50%}
.uos[data-theme="deepsea"] .uos-brand-avatar,.uos-user-panel[data-theme="deepsea"] .uos-brand-avatar,.uos-user-trigger[data-theme="deepsea"] .uos-brand-avatar{--uos-mascot-position:33.33333333333333% 50%}
.uos[data-theme="amber"] .uos-brand-avatar,.uos-user-panel[data-theme="amber"] .uos-brand-avatar,.uos-user-trigger[data-theme="amber"] .uos-brand-avatar{--uos-mascot-position:66.66666666666666% 50%}
.uos[data-theme="theatre"] .uos-brand-avatar,.uos-user-panel[data-theme="theatre"] .uos-brand-avatar,.uos-user-trigger[data-theme="theatre"] .uos-brand-avatar{--uos-mascot-position:100% 50%}
.uos[data-theme="lasttrain"] .uos-brand-avatar,.uos-user-panel[data-theme="lasttrain"] .uos-brand-avatar,.uos-user-trigger[data-theme="lasttrain"] .uos-brand-avatar{--uos-mascot-position:0% 75%}
.uos[data-theme="aurora"] .uos-brand-avatar,.uos-user-panel[data-theme="aurora"] .uos-brand-avatar,.uos-user-trigger[data-theme="aurora"] .uos-brand-avatar{--uos-mascot-position:33.33333333333333% 75%}
.uos[data-theme="glasshouse"] .uos-brand-avatar,.uos-user-panel[data-theme="glasshouse"] .uos-brand-avatar,.uos-user-trigger[data-theme="glasshouse"] .uos-brand-avatar{--uos-mascot-position:66.66666666666666% 75%}
.uos[data-theme="japan"] .uos-brand-avatar,.uos-user-panel[data-theme="japan"] .uos-brand-avatar,.uos-user-trigger[data-theme="japan"] .uos-brand-avatar{--uos-mascot-position:100% 75%}
.uos[data-theme="school"] .uos-brand-avatar,.uos-user-panel[data-theme="school"] .uos-brand-avatar,.uos-user-trigger[data-theme="school"] .uos-brand-avatar{--uos-mascot-position:0% 100%}
img[data-uos-mascot-loader]{display:none!important}
`;

// src/author-template.js
function buildAuthorHtml(config, greetingCount) {
  const css = AUTHOR_CSS;
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style id="uos-css">${css}</style></head><body>
<main class="uos" data-uos data-background-mode="remote" data-theme="archive"><div class="uos-background-art" aria-hidden="true"></div><header class="uos-masthead">${brandMarkMarkup()}<span class="uos-header-ornament" aria-hidden="true"></span><span class="uos-kicker">STORY INDEX</span><h1 data-title></h1><p class="uos-intro" data-subtitle></p><div class="uos-top"><p class="uos-opening-count" data-opening-count></p><div class="uos-actions"><button type="button" class="uos-icon" data-theme-button aria-label="切换主题">◈ 主题</button><button type="button" class="uos-icon" data-settings-button aria-label="作者设置">⚙ 设置</button></div></div><p class="uos-status uos-top-status" data-top-status role="status"></p></header><section class="uos-player" data-player hidden aria-label="开场音乐播放器"><div class="uos-player-head"><span class="uos-player-record" aria-hidden="true"></span><div class="uos-player-meta"><span class="uos-player-kicker">SOUNDTRACK · 开场音乐</span><strong data-music-title></strong></div><div class="uos-player-controls"><button type="button" data-skip="-10" aria-label="快退10秒">↶</button><button type="button" data-play aria-label="播放">▶</button><button type="button" data-skip="10" aria-label="快进10秒">↷</button></div></div><div class="uos-player-track"><input type="range" data-seek min="0" max="1000" value="0" aria-label="音乐播放进度"><span data-clock>0:00 / 0:00</span></div><div class="uos-lyrics" data-lyrics>♫</div><audio preload="metadata"></audio></section><div class="uos-grid" data-grid></div>
<p class="uos-footer">选择后进入对应的正式开场。也可使用酒馆首条消息的翻页箭头。当前聊天开始后不能重新选择。</p><div class="uos-status" data-status role="status"></div>
<div class="uos-dialog" data-theme-dialog hidden><div class="uos-sheet"><div class="uos-sheet-head"><h2>切换主题</h2><button type="button" class="uos-icon" data-close="[data-theme-dialog]">关闭</button></div><div class="uos-theme-grid" data-theme-grid></div></div></div>
<div class="uos-dialog" data-settings-dialog hidden><div class="uos-sheet"><div class="uos-sheet-head"><h2>作者设置</h2><button type="button" class="uos-icon" data-close="[data-settings-dialog]">关闭</button></div>${mascotNoteMarkup("welcome", "从下面选择一项设置，修改完成后保存到角色卡。")}<nav class="uos-tabs" aria-label="设置分类"><button type="button" data-tab="openings" aria-selected="true"><span class="uos-tab-art" data-tab-art="openings" aria-hidden="true"></span>开场白</button><button type="button" data-tab="worldbooks" aria-selected="false"><span class="uos-tab-art" data-tab-art="worldbooks" aria-hidden="true"></span>世界书</button><button type="button" data-tab="bgm" aria-selected="false"><span class="uos-tab-art" data-tab-art="bgm" aria-hidden="true"></span>BGM</button><button type="button" data-tab="diagnostics" aria-selected="false"><span class="uos-tab-art" data-tab-art="diagnostics" aria-hidden="true"></span>制卡检查</button></nav><section data-tab-panel="openings"><p class="uos-help">已读取 ${greetingCount} 条正式开场。修改后点击下方保存，并从酒馆导出更新的角色卡。</p><div data-settings-fields></div></section><section data-tab-panel="worldbooks" hidden><p class="uos-help">为每个开场预设角色世界书的条目开关。预设保存在角色卡配置中；未配置的开场不会改动世界书。</p><div data-worldbook-presets></div></section><section data-tab-panel="bgm" hidden><p class="uos-help">上传音乐和 LRC/TXT 歌词。文件会在选择页预览，保存后随角色卡导出。</p><div data-bgm-fields></div><div class="uos-empty-music" data-bgm-empty aria-hidden="true" hidden></div><p class="uos-help">音频内嵌会增加角色卡体积。请确认分享权利；可在 https://www.gequhai.com/ 查找曲目。</p></section><section data-tab-panel="diagnostics" hidden><p class="uos-help">根据当前酒馆中的角色数据检查。修改设置后请先保存，再从酒馆导出角色卡；玩家仍需安装并启用酒馆助手。</p><div data-diagnostics></div></section><div class="uos-settings-savebar"><button type="button" class="uos-save" data-save>保存到角色卡</button><p class="uos-help" data-save-state role="status"></p></div></div></div>
</main><script type="application/json" id="uos-seed">${JSON.stringify(config).replace(/</g, "\\u003c")}<\/script></body></html>`;
}

// src/author-page-preview.js
function renderAuthorPagePreview({ doc, model, host, groups }) {
  const el = (tag, cls = "", text) => {
    const node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = String(text);
    return node;
  };
  const root = doc.querySelector("[data-uos]");
  root.dataset.theme = model.theme;
  root.dataset.layout = model.layout;
  root.inert = true;
  root.querySelector("[data-title]").textContent = model.title;
  root.querySelector("[data-subtitle]").textContent = model.subtitle === "选择一个开场，故事将从那里继续。" ? "" : model.subtitle;
  root.querySelector("[data-opening-count]").textContent = `共 ${model.items.length} 个开场`;
  let filters = root.querySelector(".uos-search");
  if (!filters) {
    filters = el("div", "uos-search");
    root.querySelector("[data-grid]").before(filters);
  }
  filters.replaceChildren();
  const search = el("input"), people = el("select");
  search.type = "search";
  search.placeholder = "搜索标题、人物或正文";
  search.disabled = true;
  const all = el("option", "", "全部人物");
  all.value = "";
  people.append(all);
  for (const name of new Set(model.items.flatMap((item) => item.names))) {
    const option = el("option", "", name);
    option.value = name;
    people.append(option);
  }
  people.disabled = true;
  filters.append(search, people, openingFavoritesFilter(el, model.items.filter((item) => item.favorite).length));
  const categories = createOpeningCategoryFilters({ el, onChange: () => {
  } });
  categories.update(model.items);
  filters.append(categories.element);
  const blindTrigger = openingBlindBoxButton(el, null, model.theme);
  updateBlindBoxButton(blindTrigger, model.items, { readonly: true, theme: model.theme });
  filters.append(blindTrigger, openingBlindRangeButton(el));
  for (const select of categories.element.querySelectorAll("select")) select.disabled = true;
  let result = root.querySelector(".uos-results");
  if (!result) {
    result = el("p", "uos-results");
    filters.after(result);
  }
  result.textContent = `${model.items.length} 个开场 · 点击卡片进入`;
  const grid = root.querySelector("[data-grid]");
  grid.replaceChildren();
  groups.render(model.items, grid, (entry, target) => target.append(createAuthorOpeningCard({ el, entry, index: entry.id, body: entry.body, host })));
  if (!model.items.length) grid.append(el("p", "uos-search-empty", "暂无开场，请先在角色卡中添加备用开场。"));
  const music = model.music || {};
  root.querySelector("[data-player]").hidden = !music.enabled;
  root.querySelector("[data-music-title]").textContent = music.title || "开场音乐";
  const lyrics = root.querySelector("[data-lyrics]"), rows = lyricRows(music.lyrics);
  lyrics.replaceChildren();
  if (rows.length) for (const row of rows) {
    const line = el("button", "uos-lyric-row", row.text);
    line.type = "button";
    line.disabled = true;
    line.dataset.time = String(row.time);
    lyrics.append(line);
  }
  else lyrics.textContent = music.lyrics?.trim() || "♫";
  for (const control of root.querySelectorAll("button,input,select")) control.disabled = true;
  let watermark = root.querySelector("[data-uos-watermark]");
  if (!watermark) {
    watermark = el("p", "uos-watermark", "唯一来源Discord:♡Aliceneko♡/红豆粉丨本插件完全免费");
    watermark.dataset.uosWatermark = "";
    watermark.append(el("span", "uos-version", `v${RUNTIME_VERSION}`));
    root.append(watermark);
  }
  return root;
}
function createAuthorPagePreview({ doc, readModel, host, backgroundService, watch }) {
  const view = doc.defaultView, el = (tag, cls = "", text) => {
    const node = doc.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = String(text);
    return node;
  };
  const element = el("details", "uos-page-preview"), summary = el("summary"), tools = el("div", "uos-page-preview-tools"), phone = el("button", "uos-icon", "手机 · 390px"), desktop = el("button", "uos-icon", "桌面 · 900px");
  const icon = el("span", "uos-page-preview-icon", "▣"), copy = el("span", "uos-page-preview-copy"), action = el("span", "uos-page-preview-action", "展开预览");
  icon.setAttribute("aria-hidden", "true");
  copy.append(el("strong", "", "点击预览整个选择页"), el("small", "", "查看手机／电脑效果，修改后实时更新"));
  summary.append(icon, copy, action);
  phone.type = desktop.type = "button";
  tools.setAttribute("role", "group");
  tools.setAttribute("aria-label", "整页预览宽度");
  tools.append(phone, desktop);
  const stage = el("div", "uos-page-preview-stage");
  element.append(summary, el("p", "uos-help", "编辑时自动同步；预览只用于查看，点击保存后写入角色卡。"), tools, stage);
  let width = 390, frame = null, background = null, groups = null, timer = null, observer = null, disposed = false, stopMascot = () => {
  };
  const controls = () => {
    phone.setAttribute("aria-pressed", String(width === 390));
    desktop.setAttribute("aria-pressed", String(width === 900));
  };
  controls();
  function fit() {
    if (!frame || disposed) return;
    if (stage.clientWidth <= 0) return;
    const scale = Math.min(1, stage.clientWidth / width);
    frame.style.width = `${width}px`;
    frame.style.height = `${Math.ceil(420 / scale)}px`;
    frame.style.transform = `scale(${scale})`;
  }
  function initialize() {
    if (frame) return;
    frame = el("iframe", "uos-page-preview-frame");
    frame.style.width = `${width}px`;
    frame.setAttribute("title", "整页实时预览");
    frame.setAttribute("sandbox", "allow-same-origin");
    stage.append(frame);
    const previewDoc = frame.contentDocument;
    previewDoc.open();
    previewDoc.write(buildAuthorHtml({}, 0));
    previewDoc.close();
    for (const node of previewDoc.querySelectorAll(".uos-dialog,#uos-seed,audio")) node.remove();
    const style = previewDoc.createElement("style");
    style.textContent = defaultCoverStyles(".uos") + "\nhtml{height:auto}body{margin:0;background:transparent}.uos{border-radius:0;box-shadow:none}.uos button:disabled{cursor:default}.uos-top-status,.uos-status[data-status]{display:none}";
    previewDoc.head.append(style);
    const root = previewDoc.querySelector("[data-uos]");
    root.inert = true;
    stopMascot = bindBrandImages(root);
    groups = createOpeningGroupRenderer({ el: (tag, cls = "", text) => {
      const node = previewDoc.createElement(tag);
      if (cls) node.className = cls;
      if (text != null) node.textContent = String(text);
      return node;
    }, gridClass: "uos-grid" });
    background = createThemeBackgroundController(root, "--uos-theme-bg-active", previewDoc.defaultView, { service: backgroundService });
    if (view.ResizeObserver) {
      observer = new view.ResizeObserver(fit);
      observer.observe(stage);
    }
    view.addEventListener("resize", fit);
    fit();
  }
  function update() {
    timer = null;
    if (disposed || !element.open || element.isConnected === false) return;
    initialize();
    const model = readModel();
    if (!model) return;
    renderAuthorPagePreview({ doc: frame.contentDocument, model, host, groups });
    void background.setTheme(model.theme);
    fit();
  }
  function refresh() {
    if (disposed || !element.open || timer !== null) return;
    timer = view.setTimeout(update, 80);
  }
  const onToggle = () => {
    if (disposed) return;
    action.textContent = element.open ? "收起预览" : "展开预览";
    if (element.open) refresh();
  };
  element.addEventListener("toggle", onToggle);
  watch?.addEventListener("input", refresh);
  watch?.addEventListener("change", refresh);
  phone.onclick = () => {
    if (disposed) return;
    width = 390;
    controls();
    fit();
  };
  desktop.onclick = () => {
    if (disposed) return;
    width = 900;
    controls();
    fit();
  };
  return { element, refresh, dispose() {
    if (disposed) return;
    disposed = true;
    if (timer !== null) view.clearTimeout(timer);
    element.removeEventListener("toggle", onToggle);
    watch?.removeEventListener("input", refresh);
    watch?.removeEventListener("change", refresh);
    view.removeEventListener("resize", fit);
    observer?.disconnect();
    stopMascot();
    background?.close();
    frame?.remove();
    element.remove();
  } };
}

// src/cover-settings.js
function createCoverSettings({ el, entry, onChange }) {
  const panel = el("details", "uos-cover-settings");
  panel.append(el("summary", "", "封面选择与显示位置"));
  const choices = el("div", "uos-cover-choices"), note = el("p", "uos-help"), buttons = [];
  function refresh() {
    const state = coverPresentation(entry);
    buttons.forEach((button, i) => button.setAttribute("aria-pressed", String(!entry.image && state.coverSlot === i)));
    note.textContent = entry.image ? "正在使用自定义封面；选择默认图会替换它。" : state.coverSlot ? `已固定默认封面 ${state.coverSlot}；切换主题使用对应编号。` : "默认封面自动分配，同一开场在本机保持稳定。";
  }
  for (let slot = 0; slot <= 5; slot++) {
    const button = el("button", "uos-cover-choice");
    button.type = "button";
    button.setAttribute("aria-label", slot ? `使用默认封面 ${slot}` : "自动分配默认封面");
    if (slot) {
      const thumb = el("span", "uos-cover-thumb");
      thumb.style.backgroundImage = `var(--uos-default-cover-${slot})`;
      thumb.setAttribute("aria-hidden", "true");
      button.append(thumb);
    }
    button.append(el("span", "", slot ? `封面 ${slot}` : "自动分配"));
    button.onclick = () => {
      entry.image = "";
      entry.coverSlot = slot;
      refresh();
      onChange();
    };
    buttons.push(button);
    choices.append(button);
  }
  const random = el("button", "uos-icon", "重新随机");
  random.type = "button";
  random.onclick = () => {
    const current = coverPresentation(entry).coverSlot;
    const candidates = [1, 2, 3, 4, 5].filter((slot) => slot !== current);
    entry.image = "";
    entry.coverSlot = candidates[Math.floor(Math.random() * candidates.length)];
    refresh();
    onChange();
  };
  const controls = el("div", "uos-cover-focus"), inputs = [];
  for (const [axis, label] of [["x", "横向焦点"], ["y", "纵向焦点"]]) {
    const field = el("label"), caption = el("span"), input = el("input");
    input.type = "range";
    input.min = "0";
    input.max = "100";
    input.step = "1";
    input.value = String(coverPresentation(entry).coverFocus[axis]);
    input.setAttribute("aria-label", label);
    const updateCaption = () => caption.textContent = `${label} · ${input.value}%`;
    input.oninput = () => {
      entry.coverFocus = { ...coverPresentation(entry).coverFocus, [axis]: Number(input.value) };
      updateCaption();
      onChange();
    };
    updateCaption();
    field.append(caption, input);
    controls.append(field);
    inputs.push({ axis, input, updateCaption });
  }
  const reset = el("button", "uos-icon", "居中显示");
  reset.type = "button";
  reset.onclick = () => {
    entry.coverFocus = { x: 50, y: 50 };
    for (const { input, updateCaption } of inputs) {
      input.value = "50";
      updateCaption();
    }
    onChange();
  };
  panel.append(choices, note, random, el("p", "uos-help", "调整取景位置，卡片预览同步显示。"), controls, reset);
  refresh();
  return { element: panel, refresh };
}

// src/selector.js
function mountInDocument(doc = document, helperApi = null, { backgroundService = null } = {}) {
  const KEY2 = "universal_opening_selector";
  const VERSION2 = RUNTIME_VERSION;
  const WATERMARK2 = "唯一来源Discord:♡Aliceneko♡/红豆粉丨本插件完全免费";
  const root = doc.querySelector("[data-uos]");
  if (!root || root.dataset.uosVersion === VERSION2) return false;
  if (root.dataset.uosMounted === "1") {
    let top = doc.defaultView;
    try {
      while (top.parent !== top) {
        void top.parent.document;
        top = top.parent;
      }
    } catch {
    }
    for (const wrap of top.document.querySelectorAll("[data-uos-portal]")) {
      const dialogs = wrap.shadowRoot?.querySelectorAll("[data-theme-dialog],[data-settings-dialog]");
      if (dialogs?.length === 2) {
        for (const dialog of dialogs) {
          dialog.hidden = true;
          root.append(dialog);
        }
        wrap.remove();
      }
    }
    delete root.dataset.uosMounted;
  }
  root.__uosDispose?.();
  const stopMascot = bindBrandImages(root);
  const backgroundControl = createThemeBackgroundController(root, "--uos-theme-bg-active", doc.defaultView, { service: backgroundService });
  let mediaPlayer, settingsFields, worldbookEditor, openingPreview, pagePreview, favoriteUI, blindBox;
  let previewItems = [], allDrawItems = [];
  root.__uosDispose = () => {
    stopMascot();
    blindBox?.dispose();
    favoriteUI?.dispose();
    pagePreview?.dispose();
    openingPreview?.dispose();
    backgroundControl?.close();
    mediaPlayer?.close();
    settingsFields?.close();
    worldbookEditor?.close();
  };
  const seed = JSON.parse(doc.getElementById("uos-seed").textContent);
  let host = doc.defaultView || window;
  for (let i = 0; i < 8; i++) {
    try {
      if (host.SillyTavern?.getContext) break;
      if (host.parent === host) break;
      void host.parent.document;
      host = host.parent;
    } catch {
      break;
    }
  }
  const context = () => host.SillyTavern?.getContext?.();
  const helper = () => {
    if (typeof helperApi?.setChatMessages === "function") return helperApi;
    let w = doc.defaultView;
    for (let i = 0; w && i < 8; i++) {
      try {
        if (typeof w.TavernHelper?.setChatMessages === "function") return w.TavernHelper;
        if (typeof w.setChatMessages === "function") return w;
        if (w.parent === w) break;
        void w.parent.document;
        w = w.parent;
      } catch {
        break;
      }
    }
    return null;
  };
  const character = () => {
    const c = context();
    return c?.characters?.[c.characterId];
  };
  const readWorldbookPeople = createWorldbookPeopleReader(() => [helperApi, doc.defaultView?.TavernHelper, doc.defaultView, host.TavernHelper, host]);
  const worldbookPresetManager = createWorldbookPresetManager(() => [helperApi, doc.defaultView?.TavernHelper, doc.defaultView, host.TavernHelper, host], character);
  let worldbookPeople = [], worldbookDiagnostics = [], worldbookMessage = "正在读取角色世界书人物名单…";
  let settingsDraftBaseline = null, pendingSettingsTasks = 0, saveSettingsToCard = async () => false;
  async function refreshWorldbookPeople(refresh = false) {
    const card = character(), identity = card?.avatar;
    try {
      const result = await readWorldbookPeople(card, { refresh });
      if (root.isConnected === false || character()?.avatar !== identity) return;
      worldbookPeople = result.people;
      worldbookDiagnostics = result.diagnostics || [];
      worldbookMessage = formatWorldbookPeopleStatus(result);
      render();
    } catch {
      worldbookMessage = "世界书读取失败，继续识别正文中的明确姓名；可重新读取。";
    }
    pagePreview?.refresh();
    const note = $("[data-worldbook-status]");
    if (note) note.textContent = worldbookMessage;
    const list = $("[data-worldbook-list]");
    if (list) renderWorldbookPeopleList(doc, list, worldbookPeople, worldbookDiagnostics);
  }
  const stored = character()?.data?.extensions?.[KEY2] ?? character()?.extensions?.[KEY2];
  let config = normalize2(stored || seed);
  let draft = null;
  let displayTheme = localTheme() || config.theme;
  let portaled = [];
  let activePopup = null;
  const $ = (s, base = root) => base.querySelector(s) || (base === root ? portaled.find((x) => x.matches(s)) || portaled.map((x) => x.querySelector(s)).find(Boolean) : null);
  const el = (tag, cls, content) => {
    const n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (content != null) n.textContent = String(content);
    return n;
  };
  mediaPlayer = createMediaPlayer(root, { status });
  const renderMusic = (music) => {
    mediaPlayer.render(music);
    pagePreview?.refresh();
  };
  settingsFields = createSettingsFields({
    el,
    view: doc.defaultView || globalThis,
    getDraft: () => draft,
    status,
    onPendingChange: (count) => {
      pendingSettingsTasks = count;
    }
  });
  const { field, fileField } = settingsFields;
  const openingGroups = createOpeningGroupRenderer({ el, gridClass: "uos-grid" });
  const previewAvatar = character()?.avatar, previewCharacterId = context()?.characterId;
  const favoritesStore = createOpeningFavorites(host, previewAvatar);
  favoriteUI = createOpeningFavoritesUI({
    el,
    store: favoritesStore,
    onChange: () => render(),
    isActive: () => root.isConnected !== false && character()?.avatar === previewAvatar && context()?.characterId === previewCharacterId,
    onUnavailable: () => status("浏览器未能保存，收藏暂时只在当前窗口有效。")
  });
  openingPreview = createOpeningPreview({
    doc: host.document,
    host,
    getItems: () => previewItems,
    getPalette: () => root,
    onChoose: async (item) => {
      if (context()?.characterId !== previewCharacterId || character()?.avatar !== previewAvatar || root.isConnected === false) {
        status("角色或聊天已变化，请重新打开选择器。");
        return;
      }
      await choose(item.id);
    }
  });
  blindBox = createOpeningBlindBox({
    doc: host.document,
    host,
    getItems: () => previewItems,
    getAllItems: () => allDrawItems,
    avatar: previewAvatar,
    getPalette: () => root,
    onRangeChange: (result) => {
      render();
      if (!result.persisted) status("浏览器未能保存，抽卡设置暂时只在当前页面有效。");
    },
    isActive: () => root.isConnected !== false && character()?.avatar === previewAvatar && context()?.characterId === previewCharacterId,
    onPreview: (item, trigger, pool) => {
      if (!openingPreview.open(item.id, trigger, pool)) status("筛选结果已变化，请重新抽取。");
    },
    onChoose: (item) => choose(item.id),
    onUnavailable: () => status("角色或聊天已变化，请重新打开选择器。"),
    onError: (error) => status(`进入开场失败：${error?.message || error}`)
  });
  const blindTrigger = openingBlindBoxButton(el, (button) => {
    if (activePopup) {
      status("请先关闭当前主题或设置窗口。");
      return;
    }
    blindBox.open(button);
  }, displayTheme);
  const blindRangeTrigger = openingBlindRangeButton(el, (button) => {
    if (activePopup) {
      status("请先关闭当前主题或设置窗口。");
      return;
    }
    blindBox.openRange(button);
  });
  worldbookEditor = createWorldbookPresetEditor({
    doc,
    el,
    query: $,
    getDraft: () => draft,
    entries,
    manager: worldbookPresetManager,
    character,
    isConnected: () => root.isConnected !== false,
    status,
    confirmPresetDelete
  });
  function normalize2(input) {
    const x = input && typeof input === "object" ? input : {};
    const worldbookConfig = migrateWorldbookPresetAssignments(x.entries, x.worldbookPresets);
    return {
      version: 1,
      title: String(x.title || "选择故事的起点").slice(0, 100),
      subtitle: String(x.subtitle || "选择一个开场，故事将从那里继续。").slice(0, 400),
      theme: THEMES.some((t) => t[0] === x.theme) ? x.theme : "archive",
      layout: openingLayout(x.layout),
      excludedTags: String(x.excludedTags || "").slice(0, 500),
      personAliases: String(x.personAliases || "").slice(0, 1500),
      entries: worldbookConfig.entries.map((e, i) => ({
        title: String(e?.title || "开场 " + (i + 1)).slice(0, 100),
        description: String(e?.description || "").slice(0, 300),
        label: String(e?.label || "").slice(0, 60),
        ...openingMetadata(e),
        ...typeof e?.names === "string" ? { names: e.names.slice(0, 200) } : {},
        ...typeof e?.worldbookPresetId === "string" && worldbookConfig.presets.some((preset) => preset.id === e.worldbookPresetId) ? { worldbookPresetId: e.worldbookPresetId } : {},
        image: String(e?.image || ""),
        ...coverPresentation(e)
      })),
      worldbookPresets: worldbookConfig.presets,
      music: { enabled: x.music?.enabled == null ? Boolean(x.music?.audio) : Boolean(x.music.enabled), title: String(x.music?.title || ""), audio: String(x.music?.audio || ""), lyrics: String(x.music?.lyrics || "") }
    };
  }
  function greetingList() {
    const c = character();
    const first = c?.data?.first_mes ?? c?.first_mes ?? "";
    const alts = c?.data?.alternate_greetings ?? c?.alternate_greetings ?? [];
    return String(first).includes("<UniversalOpeningSelector/>") ? alts : [];
  }
  function infer(text, i, people, settings = config) {
    const source = String(text || ""), excluded = excludedTags(settings.excludedTags);
    const title = greetingTitle(source, i, excluded), body = narrativeStart(source, excluded);
    const detected = people || detectGreetingCollection([source], { aliases: settings.personAliases, worldbookPeople })[0];
    return { title, description: body.slice(title.length).trim().slice(0, 140), names: detected.names.join("、"), nameSuggestions: detected.suggestions };
  }
  function suggest(text, i) {
    return infer(text, i);
  }
  function entries(settings = config) {
    const greetings = greetingList();
    const count = greetings.length || settings.entries.length;
    const people = detectGreetingCollection(greetings, { characterName: character()?.data?.name || character()?.name, knownNames: settings.entries.flatMap((entry) => typeof entry.names === "string" ? entry.names.split(/[、，,\/]/).map((x) => x.trim()) : []), aliases: settings.personAliases, worldbookPeople });
    return Array.from({ length: count }, (_, i) => {
      const generated = infer(greetings[i], i, people[i], settings), saved = settings.entries[i] || {};
      return isLegacyGeneratedEntry(greetings[i], saved, i) ? { ...generated, ...saved, title: generated.title, description: generated.description } : { ...generated, ...saved };
    });
  }
  function localTheme() {
    try {
      return host.localStorage.getItem("uos_theme_" + (character()?.avatar || character()?.name || "current"));
    } catch {
      return null;
    }
  }
  const defaultCoverStyle = doc.createElement("style");
  defaultCoverStyle.textContent = defaultCoverStyles(".uos");
  root.append(defaultCoverStyle);
  function setTheme(value, remember = true) {
    displayTheme = value;
    root.dataset.theme = value;
    setBlindBoxTheme(blindTrigger, value);
    void backgroundControl?.setTheme(value);
    syncDialogTheme();
    pagePreview?.refresh();
    if (remember) try {
      host.localStorage.setItem("uos_theme_" + (character()?.avatar || character()?.name || "current"), value);
    } catch {
    }
  }
  function syncDialogTheme() {
    const style = doc.defaultView.getComputedStyle(root);
    for (const dlg of portaled) {
      dlg.style.setProperty("color-scheme", style.colorScheme);
      for (const key of ["--bg", "--panel", "--text", "--muted", "--accent", "--line", "--art", ...Array.from({ length: 5 }, (_, i) => `--uos-default-cover-${i + 1}`)]) dlg.style.setProperty(key, style.getPropertyValue(key));
    }
  }
  function hasUnsavedSettings() {
    if (!draft) return false;
    if (worldbookEditor.hasUnsaved() || pendingSettingsTasks > 0) return true;
    try {
      return settingsDraftBaseline !== null && JSON.stringify(normalize2({ ...draft, theme: displayTheme })) !== settingsDraftBaseline;
    } catch {
      return true;
    }
  }
  function showUnsavedSettingsPrompt(frameDoc, sheet) {
    return new Promise((resolve) => {
      const previous = frameDoc.activeElement, overlay = frameDoc.createElement("div");
      overlay.dataset.uosUnsavedPrompt = "";
      overlay.setAttribute("role", "presentation");
      overlay.style.cssText = "position:fixed;inset:0;z-index:2147483647;display:grid;place-items:center;padding:16px;background:#0009;color:var(--text)";
      for (const key of ["--bg", "--panel", "--text", "--muted", "--accent", "--line"]) overlay.style.setProperty(key, sheet.style.getPropertyValue(key));
      const panel = frameDoc.createElement("section");
      panel.setAttribute("role", "alertdialog");
      panel.setAttribute("aria-modal", "true");
      panel.setAttribute("aria-labelledby", "uos-unsaved-title");
      panel.setAttribute("aria-describedby", "uos-unsaved-description");
      panel.style.cssText = "width:min(420px,100%);padding:20px;border:1px solid var(--accent);border-radius:14px;background:var(--bg);color:var(--text);box-shadow:0 18px 54px #000b";
      const title = frameDoc.createElement("h2");
      title.id = "uos-unsaved-title";
      title.textContent = "有未保存的改动";
      title.style.cssText = "margin:0 0 8px;font-size:18px";
      const description = frameDoc.createElement("p");
      description.id = "uos-unsaved-description";
      description.textContent = "这些设置还没有写入角色卡。";
      description.style.cssText = "margin:0 0 18px;color:var(--muted);font-size:13px;line-height:1.5";
      const actions = frameDoc.createElement("div");
      actions.style.cssText = "display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px";
      let settled = false;
      const buttons = [];
      const finish = (value) => {
        if (settled) return;
        settled = true;
        frameDoc.removeEventListener("keydown", onKeyDown, true);
        overlay.remove();
        try {
          previous?.focus?.();
        } catch {
        }
        resolve(value);
      };
      const makeButton = (label, className, value) => {
        const button = frameDoc.createElement("button");
        button.type = "button";
        button.className = className;
        button.textContent = label;
        button.onclick = () => finish(value);
        buttons.push(button);
        actions.append(button);
        return button;
      };
      const save = makeButton("保存并关闭", "uos-save", "save");
      makeButton("放弃更改", "uos-icon", "discard");
      makeButton("继续编辑", "uos-icon", "stay");
      const onKeyDown = (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopImmediatePropagation();
          finish("stay");
          return;
        }
        if (event.key === "Tab") {
          const index = buttons.indexOf(frameDoc.activeElement);
          if (event.shiftKey && index <= 0) {
            event.preventDefault();
            buttons.at(-1).focus();
          } else if (!event.shiftKey && index === buttons.length - 1) {
            event.preventDefault();
            buttons[0].focus();
          }
        }
      };
      overlay.addEventListener("pointerdown", (event) => {
        if (event.target === overlay) finish("stay");
      });
      panel.append(title, description, actions);
      overlay.append(panel);
      frameDoc.body.append(overlay);
      frameDoc.addEventListener("keydown", onKeyDown, true);
      save.focus();
    });
  }
  function confirmPresetDelete(name) {
    const frameDoc = activePopup?.frame?.contentDocument;
    if (!frameDoc) return Promise.resolve(false);
    return new Promise((resolve) => {
      const dialog = frameDoc.createElement("dialog");
      dialog.dataset.uosPresetDelete = "";
      dialog.style.cssText = "width:min(420px,calc(100% - 32px));padding:20px;border:1px solid var(--accent);border-radius:14px;background:var(--bg);color:var(--text)";
      for (const key of ["--bg", "--panel", "--text", "--accent"]) dialog.style.setProperty(key, activePopup.sheet.style.getPropertyValue(key));
      const text = frameDoc.createElement("p");
      text.textContent = "删除预设“" + name + "”？已分配的开场也会清空。";
      const actions = frameDoc.createElement("div");
      actions.style.cssText = "display:flex;justify-content:flex-end;gap:8px";
      const cancel = frameDoc.createElement("button"), remove = frameDoc.createElement("button");
      cancel.type = remove.type = "button";
      cancel.className = "uos-icon";
      remove.className = "uos-save";
      cancel.textContent = "取消";
      remove.textContent = "删除预设";
      let settled = false;
      const finish = (value) => {
        if (settled) return;
        settled = true;
        dialog.remove();
        resolve(value);
      };
      cancel.onclick = () => finish(false);
      remove.onclick = () => finish(true);
      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        finish(false);
      });
      dialog.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          event.stopPropagation();
          finish(false);
        }
      });
      actions.append(cancel, remove);
      dialog.append(text, actions);
      frameDoc.body.append(dialog);
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute("open", "");
        dialog.style.cssText += ";position:fixed;inset:0;margin:auto;height:fit-content;z-index:2147483647";
        dialog.setAttribute("role", "alertdialog");
        dialog.setAttribute("aria-modal", "true");
      }
      cancel.focus();
    });
  }
  function showSheet(selector) {
    if (activePopup && !activePopup.frame?.isConnected) {
      pagePreview?.dispose();
      pagePreview = null;
      activePopup.original.append(activePopup.sheet);
      activePopup = null;
      portaled = [];
    }
    if (activePopup) {
      status("弹窗已打开，请先关闭当前窗口。");
      return null;
    }
    const original = $(selector), sheet = original?.querySelector(".uos-sheet");
    if (!sheet) {
      status("设置界面尚未就绪，请刷新页面重试。");
      return null;
    }
    let hostDoc = root.__uosHostDocument;
    if (!hostDoc) {
      let w = doc.defaultView;
      try {
        while (w.parent !== w) {
          void w.parent.document;
          w = w.parent;
        }
      } catch {
      }
      hostDoc = w.document;
    }
    if (hostDoc === doc) {
      status("无法在酒馆页面打开弹窗：请确认角色卡内的作者脚本已启用。");
      return null;
    }
    const frame = hostDoc.createElement("iframe");
    frame.setAttribute("title", selector.includes("theme") ? "切换主题" : "作者设置");
    frame.setAttribute("data-uos-frame", "");
    const kind = selector.includes("theme") ? "theme" : "settings";
    const viewport = hostDoc.defaultView;
    const width = Math.min(kind === "theme" ? 460 : 780, Math.max(260, viewport.innerWidth - 24));
    const height = Math.min(kind === "theme" ? 520 : 740, Math.max(260, viewport.innerHeight - 24));
    frame.style.cssText = `position:fixed!important;left:${Math.max(12, (viewport.innerWidth - width) / 2)}px!important;top:${Math.max(12, (viewport.innerHeight - height) / 2)}px!important;width:${width}px!important;height:${height}px!important;border:0!important;margin:0!important;padding:0!important;z-index:99990!important;background:transparent!important;border-radius:16px!important;clip-path:inset(0 round 16px)!important;color-scheme:normal!important;display:block!important;pointer-events:auto!important`;
    try {
      (hostDoc.body || hostDoc.documentElement).append(frame);
      const frameDoc = frame.contentDocument;
      if (!frameDoc) throw Error("设置 iframe 无法访问");
      const css = doc.getElementById("uos-css")?.textContent || "";
      frameDoc.open();
      frameDoc.write(`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:transparent}</style><style>${css}</style><style>html,body{background:transparent!important;color-scheme:normal!important}.uos-dialog{display:block!important;position:static!important;width:100%!important;height:100%!important;padding:0!important;overflow:hidden!important;background:transparent!important}.uos-sheet{width:100%!important;height:100%!important;max-height:100%!important;max-width:100%!important;overflow:auto!important;box-shadow:none!important}.uos-sheet-head{position:sticky;top:-20px;z-index:2;background:var(--bg);padding:8px 0;cursor:grab;touch-action:none;user-select:none}.uos-sheet-head:active{cursor:grabbing}.uos-sheet-head button{cursor:pointer;touch-action:auto}.uos-save{position:sticky;bottom:0;z-index:2;box-shadow:0 0 0 8px var(--bg)}body[data-kind="theme"] .uos-theme-grid{grid-template-columns:repeat(2,minmax(0,1fr))}@media(max-width:600px){.uos-sheet{border-radius:16px!important;padding:16px!important}.uos-sheet-head{top:-16px}}</style></head><body data-kind="${kind}"><div class="uos-dialog" data-uos-overlay></div></body></html>`);
      frameDoc.close();
      const overlay = frameDoc.querySelector("[data-uos-overlay]");
      overlay.append(sheet);
      portaled = [sheet];
      syncDialogTheme();
      const drag = sheet.querySelector(".uos-sheet-head");
      let origin = null;
      const move = (e) => {
        if (!origin) return;
        const left = Math.max(0, Math.min(viewport.innerWidth - frame.offsetWidth, origin.left + e.screenX - origin.x));
        const top = Math.max(0, Math.min(viewport.innerHeight - frame.offsetHeight, origin.top + e.screenY - origin.y));
        frame.style.setProperty("left", `${left}px`, "important");
        frame.style.setProperty("top", `${top}px`, "important");
      };
      const stop = () => {
        origin = null;
        drag?.removeEventListener("pointermove", move);
        drag?.removeEventListener("pointerup", stop);
      };
      drag?.addEventListener("pointerdown", (e) => {
        if (e.target.closest("button,input,textarea,select,a")) return;
        origin = { x: e.screenX, y: e.screenY, left: frame.offsetLeft, top: frame.offsetTop };
        drag.setPointerCapture(e.pointerId);
        drag.addEventListener("pointermove", move);
        drag.addEventListener("pointerup", stop);
        e.preventDefault();
      });
      const clampWindow = () => {
        frame.style.setProperty("left", `${Math.max(0, Math.min(viewport.innerWidth - frame.offsetWidth, frame.offsetLeft))}px`, "important");
        frame.style.setProperty("top", `${Math.max(0, Math.min(viewport.innerHeight - frame.offsetHeight, frame.offsetTop))}px`, "important");
      };
      viewport.addEventListener("resize", clampWindow);
      let closeInProgress = false;
      const cleanup = (discarded) => {
        stop();
        viewport.removeEventListener("resize", clampWindow);
        original.append(sheet);
        portaled = [];
        frame.remove();
        activePopup = null;
        if (selector.includes("settings")) {
          pagePreview?.dispose();
          pagePreview = null;
          const hadDraft = Boolean(draft);
          draft = null;
          settingsDraftBaseline = null;
          worldbookEditor.reset();
          renderMusic(config.music);
          if (discarded && hadDraft) status("未保存的设置已放弃。");
        }
      };
      const close = async () => {
        if (closeInProgress) return;
        closeInProgress = true;
        if (selector.includes("settings") && hasUnsavedSettings()) {
          const choice = await showUnsavedSettingsPrompt(frameDoc, sheet);
          if (choice === "stay") {
            closeInProgress = false;
            return;
          }
          if (choice === "save") {
            const saved = await saveSettingsToCard({ closeOnSuccess: false, commitPresetDraft: true });
            if (!saved) {
              closeInProgress = false;
              return;
            }
            cleanup(false);
            return;
          }
          cleanup(true);
          return;
        }
        cleanup(false);
      };
      activePopup = { complete: close, frame, original, sheet };
      frameDoc.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !frameDoc.querySelector("[data-uos-unsaved-prompt]")) {
          e.preventDefault();
          void close();
        }
      });
    } catch (e) {
      original.append(sheet);
      portaled = [];
      frame.remove();
      activePopup = null;
      status(`弹窗打开失败：${e.message || e}`);
      return null;
    }
    return sheet;
  }
  function status(message) {
    $("[data-status]").textContent = message;
    const top = $("[data-top-status]");
    if (top) top.textContent = message;
    const inDialog = $("[data-save-state]");
    if (inDialog) inDialog.textContent = message;
  }
  function render() {
    setTheme(displayTheme, false);
    root.dataset.layout = config.layout;
    $("[data-title]").textContent = config.title;
    $("[data-subtitle]").textContent = config.subtitle === "选择一个开场，故事将从那里继续。" ? "" : config.subtitle;
    const grid = $("[data-grid]");
    grid.replaceChildren();
    previewItems = [];
    let filters = root.querySelector(".uos-search");
    if (!filters) {
      filters = el("div", "uos-search");
      const input = el("input"), person2 = el("select");
      input.type = "search";
      input.placeholder = "搜索标题、人物或正文";
      input.setAttribute("aria-label", "搜索作者开场");
      person2.setAttribute("aria-label", "按人物筛选作者开场");
      input.oninput = () => render();
      person2.onchange = () => render();
      filters.append(input, person2);
      grid.before(filters);
    }
    const query = filters.querySelector("input").value.trim().toLocaleLowerCase(), person = filters.querySelector("select"), selected = person.value;
    const items = entries(), greetings = greetingList(), people = /* @__PURE__ */ new Set();
    const rows = favoriteUI.update(items.map((entry, i) => ({ ...entry, ...openingMetadata(entry), id: i, body: greetings[i] || "", names: String(entry.names || "").split(/[、，,\/]/).map((name) => name.trim()).filter(Boolean) })));
    if (!filters.contains(favoriteUI.element)) filters.append(favoriteUI.element);
    if (!filters.__uosCategories) {
      filters.__uosCategories = createOpeningCategoryFilters({ el, onChange: () => render() });
      filters.append(filters.__uosCategories.element);
    }
    filters.__uosCategories.update(rows);
    if (!filters.contains(blindTrigger)) filters.append(blindTrigger, blindRangeTrigger);
    allDrawItems = rows.filter((entry) => entry.body).map((entry) => ({ ...entry, id: entry.id + 1, number: entry.id + 1, coverIndex: entry.id }));
    const openingCount = $("[data-opening-count]");
    if (openingCount) openingCount.textContent = `共 ${items.length} 个开场`;
    for (const entry of items) for (const name of String(entry.names || "").split(/[、，,\/]/).map((x) => x.trim()).filter(Boolean)) people.add(name);
    person.replaceChildren();
    const all = el("option", "", "全部人物");
    all.value = "";
    person.append(all);
    for (const name of people) {
      const option = el("option", "", name);
      option.value = name;
      person.append(option);
    }
    person.value = selected;
    const categoryValues = filters.__uosCategories.values(), filtered = rows.filter((row) => (!favoriteUI.onlyFavorites() || row.favorite) && matchesOpening(row, { query, person: person.value, ...categoryValues })), visible = filtered.length;
    openingGroups.render(filtered, grid, (entry, target) => {
      const i = entry.id, source = greetings[i];
      if (source) previewItems.push({ ...entry, id: i + 1, number: i + 1, coverIndex: i, body: source, names: entry.names, suggestions: entry.nameSuggestions });
      target.append(createAuthorOpeningCard({
        el,
        entry,
        index: i,
        body: source,
        host,
        onChoose: choose,
        favoriteButton: favoriteUI.button(entry),
        onPreview: (id, button) => {
          if (activePopup) {
            status("请先关闭当前主题或设置窗口。");
            return;
          }
          openingPreview.open(id, button);
        }
      }));
    }, rows);
    updateBlindBoxButton(blindTrigger, blindBox.poolItems(), { theme: displayTheme, manual: blindBox.rangeMode() === "manual" });
    blindRangeTrigger.textContent = blindBox.rangeSummary();
    let result = root.querySelector(".uos-results");
    if (!result) {
      result = el("p", "uos-results");
      result.setAttribute("role", "status");
      grid.before(result);
    }
    result.textContent = favoriteUI.onlyFavorites() || query || person.value || categoryValues.group !== null || categoryValues.tag ? `找到 ${visible} / ${items.length} 个开场` : `${items.length} 个开场 · 点击卡片进入`;
    if (!visible) grid.append(createMascotNote(el, "search", favoriteUI.onlyFavorites() ? "没有匹配的收藏开场；关闭「只看收藏」，点击卡片旁的 ☆ 添加收藏。" : "没有匹配的开场，请调整关键词或筛选条件。", "uos-search-empty").element);
    renderMusic(config.music);
    const actions = root.querySelector(".uos-actions");
    if (actions && !actions.querySelector(".uos-version-badge")) actions.append(el("small", "uos-version-badge", `v${VERSION2}`));
    let watermark = root.querySelector("[data-uos-watermark]");
    if (!watermark) {
      watermark = el("p", "uos-watermark", WATERMARK2);
      watermark.dataset.uosWatermark = "";
      watermark.append(el("span", "uos-version", `v${VERSION2}`));
      root.append(watermark);
    }
  }
  async function choose(target) {
    const h = helper();
    if (!h) {
      status("酒馆助手尚未就绪，请稍后重试或用首条消息翻页箭头。");
      return;
    }
    let first;
    try {
      first = h.getChatMessages(0, { include_swipes: true })?.[0];
    } catch (e) {
      status(`读取开场失败：${e?.message || e}`);
      return;
    }
    if (!first || first.role !== "assistant" || !Array.isArray(first.swipes) || target >= first.swipes.length) {
      status("开场尚未载入，请刷新后新建聊天。");
      return;
    }
    if (Number(h.getLastMessageId?.() ?? 0) > 0) {
      status("聊天已经开始，请新建聊天后选择开场。");
      return;
    }
    if (first.swipe_id !== 0 || !String(first.swipes[0] || "").includes("<UniversalOpeningSelector/>")) {
      status("当前已离开选择页，请新建聊天后重试。");
      return;
    }
    status(`正在进入第 ${target} 条开场…`);
    root.querySelectorAll(".uos-card").forEach((b) => b.disabled = true);
    const openingCharacterId = context()?.characterId, openingAvatar = character()?.avatar;
    let worldbookChange = null;
    try {
      const presetId = entries()[target - 1]?.worldbookPresetId;
      const preset = config.worldbookPresets.find((value) => value.id === presetId);
      if (preset) {
        status("正在应用此开场的世界书条目预设…");
        worldbookChange = await worldbookPresetManager.apply(preset);
      }
      if (context()?.characterId !== openingCharacterId || character()?.avatar !== openingAvatar || Number(h.getLastMessageId?.() ?? 0) > 0) throw Error("角色或聊天已变化，请重新打开选择器");
      await h.setChatMessages([{ message_id: 0, swipe_id: target }], { refresh: "all" });
      const current = h.getChatMessages(0, { include_swipes: true })?.[0];
      if (current?.swipe_id !== target) throw new Error("消息页未切换");
    } catch (e) {
      let rollbackMessage = "";
      if (worldbookChange) try {
        await worldbookChange.rollback();
      } catch (rollbackError) {
        rollbackMessage = `；世界书状态恢复失败：${rollbackError?.message || rollbackError}`;
      }
      status(`切换失败：${e?.message || e}${rollbackMessage}。可使用首条消息翻页箭头。`);
      root.querySelectorAll(".uos-card").forEach((b) => b.disabled = false);
    }
  }
  function openThemes() {
    const dlg = showSheet("[data-theme-dialog]");
    if (!dlg) return;
    const grid = $("[data-theme-grid]");
    grid.replaceChildren();
    THEMES.forEach(([id, name]) => {
      const b = el("button", "uos-theme-choice");
      b.type = "button";
      b.setAttribute("aria-label", `切换到${name}`);
      b.setAttribute("aria-pressed", String(id === displayTheme));
      const swatch = el("span", "uos-theme-swatch");
      swatch.dataset.theme = id;
      swatch.append(el("span", "uos-theme-swatch-cover", "01"), el("span", "uos-theme-swatch-lines", "Aa · 故事开场"));
      const icon = el("span", "uos-theme-swatch-art");
      icon.dataset.theme = id;
      icon.setAttribute("aria-hidden", "true");
      swatch.append(icon);
      b.append(swatch, el("span", "", name));
      b.onclick = () => {
        setTheme(id);
        activePopup?.complete(null);
      };
      grid.append(b);
    });
  }
  function diagnostics() {
    const card = character(), data = card?.data || card || {}, ext = data.extensions || {}, greetings = greetingList();
    const roleScript = Array.isArray(ext.tavern_helper?.scripts) && ext.tavern_helper.scripts.some((x) => /红豆粉开场白选择器 · (?:通用脚本|作者角色脚本)/.test(x.name || "") && x.enabled && x.export_with?.data);
    const legacy = Array.isArray(ext.regex_scripts) && ext.regex_scripts.some((x) => x.findRegex === "<UniversalOpeningSelector/>" && !x.disabled);
    const saved = Boolean(ext[KEY2]);
    let size = 0;
    try {
      size = new Blob([JSON.stringify(card || {})]).size;
    } catch {
    }
    const media = entries().reduce((n, e) => n + (e.image?.length || 0), 0) + (config.music.audio?.length || 0);
    return [["正式开场", `${greetings.length} 条`], ["选择页运行方式", roleScript ? "作者角色脚本随卡导出" : legacy ? "旧版打包卡" : "未检测到可导出的作者脚本"], ["作者配置", saved ? "已载入角色卡扩展字段" : "当前使用默认配置"], ["当前角色数据大小", size ? `${(size / 1048576).toFixed(2)} MB` : "无法估算"], ["其中封面与音频数据", `${(media / 1048576).toFixed(2)} MB`]];
  }
  function ensureUpdateSettings(dlg) {
    if (dlg.querySelector('[data-tab="updates"]')) return;
    const tabs = dlg.querySelector(".uos-tabs");
    if (!tabs) return;
    const tab = el("button", "");
    tab.type = "button";
    tab.dataset.tab = "updates";
    tab.setAttribute("aria-selected", "false");
    const art = el("span", "uos-tab-art");
    art.dataset.tabArt = "updates";
    art.setAttribute("aria-hidden", "true");
    tab.append(art, el("span", "", "更新"));
    const panel = el("section", "uos-update-section");
    panel.dataset.tabPanel = "updates";
    panel.hidden = true;
    const version = el("p", "uos-help", `当前运行版本：v${VERSION2}`);
    const auto = el("label", "uos-toggle"), autoCheck = el("input");
    autoCheck.type = "checkbox";
    auto.append(autoCheck, el("span", "", "启动时自动检查更新"));
    const hint = el("p", "uos-help", "关闭后下次启动不自动检查；仍可手动检查更新。");
    const check = el("button", "uos-icon", "检查更新");
    check.type = "button";
    panel.append(version, auto, hint, check);
    tabs.after(panel);
    tabs.append(tab);
    bindUpdateControl(check, host.document, { versionElements: [...root.querySelectorAll(".uos-version-badge,.uos-version")], autoCheckInput: autoCheck, autoCheckHint: hint });
  }
  function openSettings() {
    const dlg = showSheet("[data-settings-dialog]");
    if (!dlg) return;
    ensureUpdateSettings(dlg);
    draft || (draft = normalize2(config));
    pagePreview?.dispose();
    const manuallyEditedNames = /* @__PURE__ */ new Set(), fields = $("[data-settings-fields]");
    fields.replaceChildren();
    const pageFields = el("section", "uos-settings-group");
    pageFields.append(el("h3", "", "页面信息"), el("p", "uos-help", "先设置选择页的标题与导语，再编辑每条开场。"), field("页面标题", draft.title, (v) => draft.title = v), field("页面导语", draft.subtitle, (v) => draft.subtitle = v, true));
    fields.append(pageFields);
    const layoutField = el("label", "uos-layout-field"), layoutSelect = el("select");
    layoutField.append(el("span", "", "页面版式"), layoutSelect);
    layoutSelect.setAttribute("aria-label", "页面版式");
    for (const [id, name] of OPENING_LAYOUTS) {
      const option = el("option", "", name);
      option.value = id;
      layoutSelect.append(option);
    }
    layoutSelect.value = draft.layout;
    layoutSelect.onchange = () => {
      draft.layout = openingLayout(layoutSelect.value);
      for (const preview of fields.querySelectorAll(".uos-layout-preview")) preview.dataset.layout = draft.layout;
    };
    pageFields.append(layoutField, el("p", "uos-help", "版式与主题可以自由搭配；原有卡片保留当前排列。"));
    const previewDraft = draft;
    pagePreview = createAuthorPagePreview({
      doc: activePopup.frame.contentDocument,
      watch: dlg,
      host,
      backgroundService,
      readModel: () => {
        if (draft !== previewDraft || root.isConnected === false || character()?.avatar !== previewAvatar || context()?.characterId !== previewCharacterId) return null;
        const settings = normalize2({ ...draft, theme: displayTheme, entries: draft.entries.map((entry, i) => {
          if (manuallyEditedNames.has(i) || typeof config.entries[i]?.names === "string") return entry;
          const { names, ...automatic } = entry;
          return automatic;
        }) }), greetings2 = greetingList();
        const favoriteKeys = favoritesStore.keys(greetings2), savedFavorites = favoritesStore.snapshot();
        return { ...settings, items: entries(settings).map((entry, i) => ({ ...entry, ...openingMetadata(entry), id: i, body: greetings2[i] || "", favoriteKey: favoriteKeys[i], favorite: savedFavorites.has(favoriteKeys[i]), names: String(entry.names || "").split(/[、，,\/]/).map((name) => name.trim()).filter(Boolean) })) };
      }
    });
    fields.append(pagePreview.element);
    const recognition = el("details", "uos-settings-group");
    recognition.append(el("summary", "", "高级 · 标题与人物识别"), field("标题中排除的 <字段>（逗号分隔）", draft.excludedTags, (v) => draft.excludedTags = v));
    fields.append(recognition);
    const personRules = el("details", "uos-person-rules");
    personRules.append(el("summary", "", "人物识别规则"));
    recognition.append(personRules);
    const worldbookList = el("ul");
    worldbookList.dataset.worldbookList = "";
    renderWorldbookPeopleList(doc, worldbookList, worldbookPeople, worldbookDiagnostics);
    const aliasWarning = el("p", "uos-help");
    aliasWarning.textContent = personAliases(draft.personAliases).conflicts.length ? `重复别名未参与匹配：${personAliases(draft.personAliases).conflicts.join("、")}。请只保留一个归属。` : "";
    personRules.append(aliasWarning);
    const worldbookNote = el("p", "uos-help", worldbookMessage);
    worldbookNote.dataset.worldbookStatus = "";
    const reloadWorldbook = el("button", "uos-icon", "重新读取世界书");
    reloadWorldbook.type = "button";
    reloadWorldbook.onclick = async () => {
      reloadWorldbook.disabled = true;
      await refreshWorldbookPeople(true);
      reloadWorldbook.disabled = false;
    };
    personRules.append(worldbookNote, worldbookList, reloadWorldbook, el("p", "uos-help", "仅读取角色绑定的世界书，明确姓名参与全文匹配，包含所有标签。普通触发关键词需手动确认；缺少明确姓名证据的标题、台词署名和人物标签先列为候选。"), field("人物与别名（每行一人：沈挽昼=挽昼,小沈）", draft.personAliases, (v) => {
      draft.personAliases = v;
      aliasWarning.textContent = personAliases(v).conflicts.length ? `重复别名未参与匹配：${personAliases(v).conflicts.join("、")}。请只保留一个归属。` : "";
    }, true));
    const list = el("div", "uos-settings-entries");
    list.append(el("h3", "", "开场卡片"), el("p", "uos-help", "展开要修改的开场。收起只隐藏编辑项，不会清除修改。"));
    fields.append(list);
    const greetings = greetingList();
    const items = entries();
    items.forEach((entry, i) => {
      draft.entries[i] = { ...entry, ...draft.entries[i] };
      entry = draft.entries[i];
      const box = el("details", "uos-entry uos-settings-entry");
      box.open = i === 0;
      const entryHeading = el("summary", "", `第 ${i + 1} 条 · ${entry.title || "未命名开场"}`);
      box.append(entryHeading);
      box.addEventListener("toggle", () => {
        if (box.open) {
          for (const other of list.querySelectorAll(".uos-settings-entry")) if (other !== box) other.open = false;
        }
      });
      if (greetings[i]) {
        const source = el("details", "uos-source");
        source.append(el("summary", "", "查看原开场正文"), el("pre", "", greetings[i]));
        box.append(source);
      }
      box.append(el("p", "uos-help", "卡片实时预览 · 保存后才会写入角色卡"));
      const previewWrap = el("div", "uos-layout-preview");
      previewWrap.dataset.layout = draft.layout;
      const preview = el("div", "uos-card uos-card-preview"), cover = el("div", "uos-cover"), body = el("div", "uos-card-body");
      cover.append(el("span", "uos-number", String(i + 1).padStart(2, "0")));
      const label = el("span", "uos-label"), title = el("strong"), description = el("div", "uos-description"), namesPreview = el("p", "uos-card-names"), categoryPreview = el("div", "uos-opening-tags");
      body.append(label, title, description, namesPreview, categoryPreview);
      preview.append(cover, body);
      previewWrap.append(preview);
      box.append(previewWrap);
      let coverSettings;
      const updatePreview = () => {
        entryHeading.textContent = `第 ${i + 1} 条 · ${entry.title || "未命名开场"}`;
        label.textContent = entry.label || `OPENING ${String(i + 1).padStart(2, "0")}`;
        title.textContent = entry.title;
        description.textContent = entry.description;
        namesPreview.textContent = `登场人物 · ${typeof entry.names === "string" ? entry.names || "未识别" : "保存后重新自动识别"}`;
        applyOpeningCover(cover, entry, greetings[i] || entry.title, i, host, { shade: true });
        const metadata = openingMetadata(entry);
        categoryPreview.replaceChildren();
        for (const text of [metadata.group ? `分组 · ${metadata.group}` : "", ...metadata.tags].filter(Boolean)) categoryPreview.append(el("span", "", text));
        coverSettings?.refresh();
        pagePreview?.refresh();
      };
      updatePreview();
      const group = el("div", "uos-fields");
      group.append(
        field("标题", entry.title, (v) => {
          entry.title = v;
          updatePreview();
        }),
        field("卡片标注", entry.label, (v) => {
          entry.label = v;
          updatePreview();
        }),
        field("登场人物（逗号分隔；留空恢复自动，输入“无”隐藏）", entry.names === "" ? "无" : entry.names || "", (v) => {
          if (v.trim() === "") delete entry.names;
          else entry.names = v.trim() === "无" ? "" : v;
          manuallyEditedNames.add(i);
          updatePreview();
        }),
        field("简介", entry.description, (v) => {
          entry.description = v;
          updatePreview();
        }, true),
        fileField("上传封面（原图 8 MB 内）", "image/png,image/jpeg,image/webp,image/gif", 8 * 1048576, async (v, file, settings) => {
          const next = await optimizeCoverData(v, file, doc);
          if (!settingsFields.isCurrent(settings)) return;
          if (next.length > 14e5) throw Error("压缩后仍超过约 1 MB，请换更小的图片；GIF 动图不会压缩");
          entry.image = next;
          updatePreview();
          return next.length < v.length ? `封面已压缩：${Math.round(v.length / 1024)} KB → ${Math.round(next.length / 1024)} KB，保存后随卡导出。` : "封面已载入；原图更小或不支持压缩，保存后随卡导出。";
        })
      );
      box.append(group);
      const categories = el("div", "uos-fields");
      categories.append(field("分组（留空表示未分组）", entry.group, (v) => {
        entry.group = openingMetadata({ group: v }).group;
        updatePreview();
      }), field("筛选标签（逗号分隔）", openingMetadata(entry).tags.join("、"), (v) => {
        entry.tags = openingMetadata({ tags: v }).tags;
        updatePreview();
      }));
      box.append(categories, el("p", "uos-help", "同名分组会自动合并。筛选标签最多 12 个，每个最多 30 字，例如：雨夜、重逢。"));
      coverSettings = createCoverSettings({ el, entry, onChange: updatePreview });
      box.append(coverSettings.element);
      if (entry.nameSuggestions?.length) {
        const accept = el("button", "uos-icon", `采纳候选：${entry.nameSuggestions.join("、")}`);
        accept.type = "button";
        accept.onclick = () => {
          entry.names = [.../* @__PURE__ */ new Set([...(entry.names || "").split(/[、，,\/]/).filter(Boolean), ...entry.nameSuggestions])].join("、");
          manuallyEditedNames.add(i);
          group.querySelectorAll("input,textarea")[2].value = entry.names;
          updatePreview();
          status("候选已填入人物字段，请检查后保存。");
        };
        box.append(accept);
      }
      if (greetings[i]) {
        const propose = el("button", "uos-icon", "从原文生成文案建议");
        propose.type = "button";
        propose.onclick = () => {
          const next = suggest(greetings[i], i);
          entry.title = next.title;
          entry.description = next.description;
          const inputs = group.querySelectorAll("input,textarea");
          inputs[0].value = entry.title;
          inputs[3].value = entry.description;
          updatePreview();
          status(`第 ${i + 1} 条建议已填入，检查后再保存。`);
        };
        box.append(propose);
      }
      const clear = el("button", "uos-icon", "移除封面");
      clear.type = "button";
      clear.onclick = () => {
        entry.image = "";
        updatePreview();
        status(`第 ${i + 1} 条已改用主题排版封面`);
      };
      box.append(clear);
      list.append(box);
    });
    renderMusicSettings({
      root: dlg,
      settings: draft,
      isCurrent: settingsFields.isCurrent,
      fields: settingsFields,
      renderMusic
    });
    const diag = $("[data-diagnostics]");
    diag.replaceChildren();
    for (const [key, value] of diagnostics()) {
      const row = el("div", "uos-diagnostic-row");
      row.append(el("span", "", key), el("strong", "", value));
      diag.append(row);
    }
    worldbookEditor.render();
    void worldbookEditor.refresh();
    dlg.querySelectorAll("[data-tab]").forEach((button) => button.onclick = () => {
      dlg.querySelectorAll("[data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b === button)));
      dlg.querySelectorAll("[data-tab-panel]").forEach((panel) => panel.hidden = panel.dataset.tabPanel !== button.dataset.tab);
    });
    settingsDraftBaseline = JSON.stringify(normalize2({ ...draft, theme: displayTheme }));
    saveSettingsToCard = async ({ closeOnSuccess = true, commitPresetDraft = false } = {}) => {
      if (pendingSettingsTasks > 0) {
        status("文件仍在处理，请稍候后再保存。");
        return false;
      }
      if (worldbookEditor.hasUnsaved()) {
        if (!commitPresetDraft) {
          status("当前预设尚未保存；请先点「保存预设」或「撤销修改」。");
          return false;
        }
        if (!worldbookEditor.commitPending()) return false;
      }
      const c = context();
      if (!c || c.characterId == null || !c.writeExtensionField) {
        status("无法写入角色卡：请在支持角色卡扩展字段的酒馆中编辑。");
        return false;
      }
      const button = $("[data-save]"), controls = [...dlg.querySelectorAll("input,textarea,select,button")], disabled = controls.map((control) => control.disabled);
      controls.forEach((control) => control.disabled = true);
      button.textContent = "正在保存…";
      try {
        const saveData = { ...draft, theme: displayTheme, entries: draft.entries.slice(0, greetingList().length).map((entry, i) => {
          const { nameSuggestions, ...saved2 } = entry;
          if (manuallyEditedNames.has(i) || typeof config.entries[i]?.names === "string") return saved2;
          const { names, ...rest } = saved2;
          return rest;
        }) };
        if (typeof c.getRequestHeaders !== "function") throw Error("当前酒馆未提供保存请求接口");
        const card = character(), saveCharacterId = c.characterId;
        if (!card?.avatar) throw Error("无法确认当前角色卡的文件名");
        const response = await host.fetch("/api/characters/merge-attributes", { method: "POST", headers: c.getRequestHeaders(), body: JSON.stringify({ avatar: card.avatar, data: { extensions: { [KEY2]: saveData } } }) });
        if (!response.ok) throw Error(`角色卡写入失败（HTTP ${response.status}），请检查卡片大小或酒馆日志`);
        const verified = await host.fetch("/api/characters/get", { method: "POST", headers: c.getRequestHeaders(), body: JSON.stringify({ avatar_url: card.avatar }) });
        if (!verified.ok) throw Error(`角色卡复核失败（HTTP ${verified.status}），请重新打开角色卡检查保存结果`);
        const persisted = await verified.json();
        const saved = persisted?.data?.extensions?.[KEY2] ?? persisted?.extensions?.[KEY2];
        const same = (actual, expected) => {
          if (expected && typeof expected === "object") {
            if (!actual || typeof actual !== "object") return false;
            return Object.keys(expected).every((key) => same(actual[key], expected[key]));
          }
          return actual === expected;
        };
        if (!same(saved, saveData)) throw Error("角色卡复核未找到刚保存的设置，请重新打开角色卡检查");
        if (context()?.characterId !== saveCharacterId || character()?.avatar !== card.avatar) throw Error("原角色卡已保存，但当前角色已切换，请重新打开设置");
        await c.writeExtensionField(saveCharacterId, KEY2, saveData);
        config = normalize2(saveData);
        draft = null;
        settingsDraftBaseline = null;
        worldbookEditor.reset();
        render();
        status("已保存并复核角色卡。导出角色卡时会带上配置和素材。");
        if (closeOnSuccess) void activePopup?.complete(null);
        return true;
      } catch (e) {
        status(`保存失败：${e.message || e}`);
        return false;
      } finally {
        controls.forEach((control, index) => {
          if (control.isConnected) control.disabled = disabled[index];
        });
        button.textContent = "保存到角色卡";
      }
    };
    $("[data-save]").onclick = () => {
      void saveSettingsToCard();
    };
  }
  $("[data-theme-button]").onclick = openThemes;
  $("[data-settings-button]").onclick = openSettings;
  root.querySelectorAll("[data-close]").forEach((b) => b.onclick = () => activePopup?.complete(null));
  render();
  ensureUpdateSettings($("[data-settings-dialog]"));
  void refreshWorldbookPeople();
  void worldbookEditor.refresh();
  root.dataset.uosMounted = "1";
  root.__uosPrepareForUpdate = async () => {
    if (!hasUnsavedSettings()) return true;
    await activePopup?.complete();
    return !hasUnsavedSettings();
  };
  root.dataset.uosVersion = VERSION2;
  return true;
}

// src/author.js
var AUTHOR_VERSION = RUNTIME_VERSION;
var AUTHOR_MARKER = "<UniversalOpeningSelector/>";
var EMPTY_OPENING_ART = THEME_ART.openings;
var DIAGNOSTICS_ART = THEME_ART.diagnostics;
function inspectAuthorState(context, helper) {
  const card = context?.characters?.[context.characterId];
  if (!card || context.groupId != null && context.groupId !== -1) return { state: null, reason: null };
  try {
    if (Number(helper?.getLastMessageId?.() ?? 0) > 0) return { state: null, reason: null };
  } catch {
  }
  const data = card.data || card, first = String(data.first_mes ?? card.first_mes ?? "");
  const greetings = data.alternate_greetings ?? card.alternate_greetings;
  if (!first.trimStart().startsWith(AUTHOR_MARKER)) return { state: null, reason: "已加载作者脚本。请把主开场第一行改为 <UniversalOpeningSelector/>，把原主开场移到备用开场第一条，保存角色卡后新建聊天。" };
  if (!Array.isArray(greetings) || !greetings.length) return { state: null, reason: "已识别选择器标记，但备用开场为空。请至少填写一条正式开场，保存角色卡后新建聊天。" };
  if (typeof helper?.getChatMessages !== "function") return { state: null, reason: "已识别角色卡设置，但酒馆助手消息接口尚未就绪。请检查酒馆助手是否启用。" };
  let message, last;
  try {
    message = helper.getChatMessages(0, { include_swipes: true })?.[0];
    last = helper.getLastMessageId?.();
  } catch {
    return { state: null, reason: "读取首条消息失败。请保存角色卡并新建聊天。" };
  }
  if (Number(last ?? 0) > 0 || Number(message?.swipe_id) !== 0) return { state: null, reason: null };
  if (message?.role !== "assistant" || !String(message.swipes?.[0] || "").includes(AUTHOR_MARKER))
    return { state: null, reason: "角色卡标记已准备好，但当前首条消息不是选择页。请保存角色卡并新建聊天。" };
  return { state: { characterId: context.characterId, avatar: card.avatar, entries: greetings }, reason: null };
}
function authorHtml(count) {
  const seed = { version: 1, title: "选择故事的起点", subtitle: "选择一个开场，故事将从那里继续。", theme: "archive", entries: [], music: { enabled: false, title: "", audio: "", lyrics: "" } };
  return buildAuthorHtml(seed, count);
}
function mountAuthorSelector(startDocument = document, helperApi, { showSetupHints = false, backgroundService = null } = {}) {
  let doc = startDocument, win = doc.defaultView;
  try {
    for (let i = 0; i < 8 && win?.parent && win.parent !== win; i++) {
      void win.parent.document;
      win = win.parent;
      doc = win.document;
    }
  } catch {
  }
  doc.__uosAuthor?.close?.();
  for (const stale of doc.querySelectorAll("iframe[data-uos-author-frame]")) {
    const container = stale.parentElement, contents = stale.previousElementSibling;
    if (container && contents?.matches("div[hidden]")) {
      while (contents.firstChild) container.insertBefore(contents.firstChild, contents);
      contents.remove();
    }
    stale.remove();
  }
  const host = doc.defaultView || globalThis, helper = helperApi || host.TavernHelper || host;
  let active = null, notice = null, updating = false;
  function hasAuthorMarker() {
    try {
      const context = host.SillyTavern?.getContext?.();
      const c = context?.characters?.[context?.characterId];
      const d = c?.data || c;
      return String(d?.first_mes ?? c?.first_mes ?? "").trimStart().startsWith(AUTHOR_MARKER);
    } catch {
      return false;
    }
  }
  function closeNotice() {
    notice?.remove();
    notice = null;
  }
  function showNotice(container, message) {
    if (notice?.parentElement === container && notice.dataset.message === message) return;
    closeNotice();
    notice = doc.createElement("div");
    notice.dataset.uosAuthorHint = "";
    notice.setAttribute("role", "status");
    notice.dataset.message = message;
    notice.style.cssText = "display:flex;align-items:center;gap:12px;position:relative!important;z-index:10!important;pointer-events:auto!important;margin:12px 0;padding:10px 14px;border:1px solid #c99d67;border-radius:10px;background:#17252d;color:#f4ecda;font:13px/1.6 system-ui,sans-serif;white-space:pre-wrap";
    const art = doc.createElement("span");
    art.setAttribute("aria-hidden", "true");
    art.style.cssText = `display:block;flex:none;width:52px;height:52px;background:url("${message.includes("备用开场为空") ? EMPTY_OPENING_ART : DIAGNOSTICS_ART}") center/contain no-repeat;filter:drop-shadow(0 2px 5px #0007)`;
    const copy = doc.createElement("span");
    copy.textContent = message;
    notice.append(art, copy);
    container.prepend(notice);
  }
  function closeFrame() {
    active?.frame.contentDocument?.querySelector("[data-uos]")?.__uosDispose?.();
    if (!active) return;
    const { frame, container, contents, resize } = active;
    active = null;
    resize?.disconnect();
    for (const popup of doc.querySelectorAll("iframe[data-uos-frame]")) popup.remove();
    frame.remove();
    if (container.isConnected) {
      while (contents.firstChild) container.insertBefore(contents.firstChild, contents);
      contents.remove();
    }
  }
  function scan() {
    if (updating) return;
    updating = true;
    try {
      const { state, reason } = inspectAuthorState(host.SillyTavern?.getContext?.(), helper);
      const first = doc.querySelector('#chat .mes[mesid="0"],#chat .mes[data-mesid="0"]');
      const container = first?.querySelector(".mes_text,.mes_text_container") || first;
      if (!state || !container) {
        closeFrame();
        if (showSetupHints && reason && container && hasAuthorMarker()) showNotice(container, reason);
        else closeNotice();
        return;
      }
      closeNotice();
      const key = `${state.avatar}\0${state.entries.length}\0${api.version}`;
      if (active?.container === container && active.key === key && active.frame.isConnected) return;
      closeFrame();
      const contents = doc.createElement("div");
      contents.hidden = true;
      contents.dataset.uosOriginal = "";
      while (container.firstChild) contents.append(container.firstChild);
      container.append(contents);
      const frame = doc.createElement("iframe");
      frame.title = "红豆粉开场白选择器";
      frame.dataset.uosAuthorFrame = "";
      frame.style.cssText = "display:block!important;position:relative!important;z-index:10!important;pointer-events:auto!important;width:100%;height:460px;border:0;background:transparent;overflow:hidden";
      container.append(frame);
      active = { frame, container, contents, key };
      const frameDoc = frame.contentDocument;
      if (!frameDoc) throw Error("选择页 iframe 无法访问");
      frameDoc.open();
      frameDoc.write(authorHtml(state.entries.length));
      frameDoc.close();
      const root = frameDoc.querySelector("[data-uos]");
      root.__uosHostDocument = doc;
      if (!mountInDocument(frameDoc, helper, { backgroundService })) throw Error("选择页未挂载");
      const fitFrame = () => {
        if (!frame.isConnected) return;
        const height = Math.ceil(root.getBoundingClientRect().height + 4);
        frame.style.height = `${Math.max(420, height)}px`;
      };
      fitFrame();
      if (host.ResizeObserver) {
        const resize = new host.ResizeObserver(fitFrame);
        resize.observe(root);
        active.resize = resize;
      }
    } catch (error) {
      closeFrame();
      console.warn("[Aliceneko Opening Selector] 作者选择页加载失败", error);
    } finally {
      updating = false;
    }
  }
  const observer = new host.MutationObserver(scan);
  if (doc.body) observer.observe(doc.body, { childList: true, subtree: true });
  const timer = host.setInterval(scan, 1300), runnerWindow = startDocument.defaultView;
  const api = { version: AUTHOR_VERSION, scan, prepareForUpdate: async () => active?.frame.contentDocument?.querySelector("[data-uos]")?.__uosPrepareForUpdate?.() ?? true, close: () => {
    observer.disconnect();
    host.clearInterval(timer);
    runnerWindow?.removeEventListener?.("pagehide", onPageHide);
    active?.resize?.disconnect();
    closeFrame();
    closeNotice();
    if (doc.__uosAuthor === api) delete doc.__uosAuthor;
  } };
  const onPageHide = () => {
    if (doc.__uosAuthor === api) api.close();
  };
  doc.__uosAuthor = api;
  if (runnerWindow !== host) runnerWindow?.addEventListener?.("pagehide", onPageHide, { once: true });
  scan();
  return api;
}

// src/main.js
var OPENING_SELECTOR_VERSION = RUNTIME_VERSION;
function mountUniversalSelector(startDocument = document, helperApi = null) {
  const doc = startDocument?.nodeType === 9 ? startDocument : document;
  const helper = helperApi || globalThis.TavernHelper || (typeof globalThis.getChatMessages === "function" ? globalThis : null);
  doc.__uosBackgroundAssets?.close();
  const backgroundService = createThemeBackgroundService(doc.defaultView || globalThis);
  doc.__uosBackgroundAssets = backgroundService;
  void backgroundService.preload();
  const onPageHide = () => {
    backgroundService.close();
    globalThis.removeEventListener?.("pagehide", onPageHide);
    if (doc.__uosBackgroundAssets === backgroundService) delete doc.__uosBackgroundAssets;
  };
  backgroundService.onClose = () => globalThis.removeEventListener?.("pagehide", onPageHide);
  globalThis.addEventListener?.("pagehide", onPageHide);
  mountPlayerSelector(doc, helper, { backgroundService });
  mountAuthorSelector(doc, helper, { showSetupHints: true, backgroundService });
  return { player: doc.__uosPlayer, author: doc.__uosAuthor };
}
export {
  OPENING_SELECTOR_VERSION,
  mountUniversalSelector
};
