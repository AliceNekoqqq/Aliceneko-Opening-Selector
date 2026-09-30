# PROJECT_STATE.md

## 项目与发行阶段
红豆粉开场白选择器，正式版 v1.0.9；`develop` 为测试版 v1.0.9-beta.4。玩家和作者使用同一份自动更新脚本：普通多开场卡显示玩家预览，主开场以 `<UniversalOpeningSelector/>` 开头时显示作者选择页。正式 Loader 自 v1.0.8 起读取 `main/scripts/runtime-ref.txt`，按 SHA 导入正式运行模块；v1.0.9 指针目标为 `10d7e873234e225ec760152f2d95e5f265d61dae`。测试指针 `scripts/runtime-ref-preview.txt` 指向已发布的 beta.4 运行模块提交 `d04b2af167b94aa267f0835724eda78824ee21a2`。

## 核心文件
- `src/player.js`：玩家模式、标题与人物解析、搜索和本机设置。
- `src/worldbook-people.js`：只读世界书读取器、人物速览／姓名／条目标题提取和候选词表缓存。
- `src/author.js`：作者标记识别、选择页挂载与生命周期。
- `src/selector.js` / `src/selector.css`：选择页、九套主题、媒体和作者设置。
- `src/author-template.js`：构建生成的作者页面模板，包含主题图像资源。
- `assets/theme-background-*.webp`：九套 1300×1050、质量 92 的主题背景图；由 `pack.mjs` 内嵌到运行模块，不进入角色卡数据。
- `scripts/build-author-script.mjs`：`--stable` 仅允许在 `main` 构建正式版；`--preview` 仅允许在 `develop` 构建 v1.0.9-beta.4。
- `scripts/runtime-ref.txt` / `scripts/runtime-ref-preview.txt`：正式与测试通道各自的运行模块指针。
- `remote.js`：构建生成的自包含模块。
- `dist/红豆粉开场白选择器_通用脚本_v1.0.9.json`：正式玩家／作者通用导入脚本。
- `dist/红豆粉开场白选择器_测试版脚本_v1.0.9-beta.4.json`：测试导入脚本，独立 ID、默认关闭且不随角色卡导出。

## 当前功能与产品规则
- 玩家和作者均可预览完整正文、搜索开场并按登场人物筛选。
- 作者可编辑标题、简介、人物、标签、排除字段、主题、封面、音乐与歌词；作者数据保存到 `data.extensions.universal_opening_selector`。
- 测试版的人物识别先读取明确姓名、名单、人物标签和台词署名，再把已确认的人名与作者／玩家别名用于其他开场的正文提及。低把握度的动作句人物显示为待确认候选，可在玩家修正面板采纳；人物识别来源会展示在卡片上。`personAliases` 和 `excludedPersonTags` 是新配置字段，作者可随卡导出，玩家可仅存本机；标题排除字段仍独立。人工修正优先于自动结果。
- beta.4 自动读取角色绑定的主／附加世界书，并读取卡内 `character_book.entries` 作为补充或兼容回退。只提取姓名、人物速览与人物条目，跳过禁用条目；裸标题仅作待确认候选。人物条目的姓名型触发词可作为别名。候选词表匹配开场后才显示姓名，作者和玩家可重新读取及采纳候选；不会更改世界书，也不调用 AI。支持英文名、间隔号与一行多人名单，过滤已确认的结构标签误判。仍不能可靠区分现场出场与仅被提及。
- 作者需自行将主开场改为 `<UniversalOpeningSelector/>`，并将原主开场移动到备用开场第一条。插件不自动迁移开场、不注入 Regex、不改写正文。
- 九套主题背景铺在界面顶部并向主题底色渐隐。为解决背景发灰，通用不透明度提高到 68%，霓虹／林间／绯色为 56%，纸与墨为 92%，末日警报为 60%；渐隐从背景高度 44% 开始。主题和设置均为可拖动浮窗。
- 正式 Loader 仅接受三段数字版本，不加载 beta 模块；测试 Loader 只读 `develop/scripts/runtime-ref-preview.txt`。正式指针在正式运行模块发布后最后更新。

## 验证与限制
测试版在 `develop` 上运行 `node scripts/build-author-script.mjs --preview`，以及 `node test/author.test.mjs`、`node test/player.test.mjs`、`node test/worldbook.test.mjs`、`node test/pack.test.mjs`、`node test/observer.test.mjs` 和 `node test/loader.test.mjs`。正式版发布前需完整回归和酒馆环境验收。当前环境缺少 Playwright Chromium，尚未完成实际酒馆操作与移动端回归。

## 最近重要修改
2026-09-30：`develop` 推进到 v1.0.9-beta.4，新增角色世界书候选词表、异步读取与缓存、作者和玩家重新读取及候选采纳，并修复英文／间隔号姓名、一行人物名单及结构标签误判；正式版 v1.0.9 和 `main/scripts/runtime-ref.txt` 保持原样。

## 下一步
在酒馆和手机端验收 beta.4：检查主／附加世界书与人物速览读取、卡内回退、重新读取、切换角色期间的异步结果隔离、跨开场人名、别名、候选采纳与保存导出。确认后才考虑正式发布；`main` 与正式指针始终是唯一稳定通道。
