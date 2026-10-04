// Shared ordered theme catalog. Theme IDs are persisted in character cards.
export const THEMES=Object.freeze([['archive','旧档案'],['neon','霓虹夜'],['paper','纸与墨'],['noir','黑白电影'],['meadow','林间信'],['ancient','锦书古风'],['starmap','星海航图'],['rose','绯色契约'],['wasteland','末日警报'],['deepsea','深海回响'],['amber','琥珀沙海'],['theatre','月光剧场'],['lasttrain','末班列车'],['aurora','极光灯塔'],['glasshouse','琉璃花房'],['japan','月下神社']].map(theme=>Object.freeze(theme)));
export const THEME_IDS=Object.freeze(THEMES.map(([id])=>id));
export const THEME_CAPTIONS=Object.freeze({archive:'ARCHIVE Nº 01 · 故事档案',neon:'AFTER DARK · 霓虹叙事',paper:'THE FIRST PAGE · 纸上初章',noir:'FRAME 001 · 光影序幕',meadow:'LETTERS FROM THE WOODS · 林间来信',ancient:'BROCADE LETTER · 锦书古风',starmap:'CELESTIAL ATLAS · 星海航图',rose:'VELVET VOW · 绯色契约',wasteland:'INCIDENT 001 · 末日警报',deepsea:'DEEP SEA ECHO · 深海回响',amber:'AMBER MIRAGE · 琥珀沙海',theatre:'MOONLIT THEATRE · 月光剧场',lasttrain:'LAST TRAIN HOME · 末班列车',aurora:'LIGHTHOUSE UNDER AURORA · 极光灯塔',glasshouse:'GLASSHOUSE IN BLOOM · 琉璃花房',japan:'MOONLIT SHRINE · 月下神社'});
export const THEME_DRAWS=Object.freeze({
  archive:['未封档案','打开一份未知的故事档案'],neon:['霓虹解码','解码一段未知的夜间信号'],
  paper:['翻页奇遇','翻开一页尚未读过的故事'],noir:['随机放映','让下一帧，揭晓你的故事'],
  meadow:['林间来信','拆开一封来自林间的信'],ancient:['锦书抽签','抽一纸锦书，赴一场相逢'],
  starmap:['星轨占卜','让星轨，指引故事的方向'],rose:['绯色邀约','赴一场尚未揭晓的邀约'],
  wasteland:['未知坐标','接收一处未知的生存坐标'],deepsea:['潮汐寻声','听见一段来自深海的回响'],
  amber:['沙海寻迹','追随风沙，发现新的故事'],theatre:['今夜开幕','揭开帷幕，故事即将上演'],
  lasttrain:['随机月台','下一站，会遇见谁'],aurora:['灯塔寻光','循着微光，寻找故事入口'],
  glasshouse:['花语来笺','抽一笺花语，赴一场奇遇'],japan:['月下御签','抽一支御签，听月下缘起'],
});
export function themeDraw(theme){const [title,hint]=THEME_DRAWS[theme]||THEME_DRAWS.archive;return {title,hint}}
