# PROJECT_STATE.md

## 项目与发行阶段
红豆粉开场白选择器，正式版 v1.0.9；`develop` 为测试版 v1.0.9-beta.5。玩家和作者使用同一份自动更新脚本：普通多开场卡显示玩家预览，主开场以 `<UniversalOpeningSelector/>` 开头时显示作者选择页。正式 Loader 自 v1.0.8 起读取 `main/scripts/runtime-ref.txt`，按 SHA 导入正式运行模块；v1.0.9 指针目标为 `10d7e873234e225ec760152f2d95e5f265d61dae`。测试指针 `scripts/runtime-ref-preview.txt` 指向已发布的 beta.5 运行模块提交 `29279ed07f51ba49017730bcbc55690a27f367e3`。

## 核心文件
- `src/player.js`：玩家模式、标题与人物解析、搜索和本机设置。
- `src/worldbook-people.js`：只读绑定世界书读取器、结构化人物词表提取、别名冲突标记、名单渲染和缓存。
- `src/author.js`：作者标记识别、选择页挂载与生命周期。
- `src/selector.js` / `src/selector.css`：选择页、九套主题、媒体和作者设置。
- `src/author-template.js`：构建生成的作者页面模板，包含主题图像资源。
- `assets/theme-background-*.webp`：九套 1300×1050、质量 92 的主题背景图；由 `pack.mjs` 内嵌到运行模块，不进入角色卡数据。
- `scripts/build-author-script.mjs`：`--stable` 仅允许在 `main` 构建正式版；`--preview` 仅允许在 `develop` 构建 v1.0.9-beta.5。
- `scripts/runtime-ref.txt` / `scripts/runtime-ref-preview.txt`：正式与测试通道各自的运行模块指针。
- `remote.js`：构建生成的自包含模块。
- `dist/红豆粉开场白选择器_通用脚本_v1.0.9.json`：正式玩家／作者通用导入脚本。
- `dist/红豆粉开场白选择器_测试版脚本_v1.0.9-beta.5.json`：测试导入脚本，独立 ID、默认关闭且不随角色卡导出。

## 当前功能与产品规则
- 玩家和作者均可预览完整正文、搜索开场并按登场人物筛选。
- 作者可编辑标题、简介、人物、标签、排除字段、主题、封面、音乐与歌词；作者数据保存到 `data.extensions.universal_opening_selector`。
- 测试版人物识别先从角色绑定主／附加世界书建立名单，再用名单和手动词表匹配整个开场原文，包括所有标签、属性、注释及代码块；不要求特定后续动作词。英文按单词边界匹配，长姓名优先占用命中范围，防止王明月同时匹配王明。作者／玩家“人物识别规则”列出名单、别名、条目来源和冲突别名。`personAliases` 可随卡导出或仅存本机；旧 `excludedPersonTags` 不再使用且保存规则时清除，标题排除字段仍独立生效。人工修正优先于自动结果。
- 世界书仅读取 `getCharWorldbookNames('current')` 返回的主／附加绑定书，不额外读取卡内 `character_book.entries`、全局或聊天世界书；禁用条目仍跳过。从 Markdown／YAML／JSON／XML 姓名、人物速览表格／列表／标题及有依据的人物条目提取姓名；裸标题需人物信息或速览等佐证。人物速览表格按姓名列读取；单人物条目的姓名型关键词和明确别名字段作为别名，通用称谓与明显场景词过滤。重复别名不自动归属，手动规则可指定。名单提取与开场匹配分开；有世界书名单流程时不猜测名单外姓名（角色卡名与人工词表仍可补充）。不会改世界书，不调用 AI，读取失败不回退到未绑定书；支持缓存、刷新、异步切卡隔离。仍不能区分现场出场与仅被提及。
- 作者需自行将主开场改为 `<UniversalOpeningSelector/>`，并将原主开场移动到备用开场第一条。插件不自动迁移开场、不注入 Regex、不改写正文。
- 九套主题背景铺在界面顶部并向主题底色渐隐。为解决背景发灰，通用不透明度提高到 68%，霓虹／林间／绯色为 56%，纸与墨为 92%，末日警报为 60%；渐隐从背景高度 44% 开始。主题和设置均为可拖动浮窗。
- 正式 Loader 仅接受三段数字版本，不加载 beta 模块；测试 Loader 只读 `develop/scripts/runtime-ref-preview.txt`。正式指针在正式运行模块发布后最后更新。

## 验证与限制
测试版在 `develop` 上运行 `node scripts/build-author-script.mjs --preview`，以及 `node test/author.test.mjs`、`node test/player.test.mjs`、`node test/worldbook.test.mjs`、`node test/pack.test.mjs`、`node test/observer.test.mjs` 和 `node test/loader.test.mjs`。正式版发布前需完整回归和酒馆环境验收。当前环境缺少 Playwright Chromium，尚未完成实际酒馆操作与移动端回归。

## 最近重要修改
2026-10-01：`develop` 推进到 v1.0.9-beta.5，收紧世界书读取范围与标题依据，增加完整人物名单／别名／来源展示，改为名单优先全文匹配，处理别名冲突、英文边界和长短姓名重叠；正式版 v1.0.9 与 `main/scripts/runtime-ref.txt` 保持原样。六项自动回归通过；Playwright 因缺少 Chromium 未执行界面验收。

## 下一步
在酒馆和手机端验收 beta.5，重点使用实际角色世界书检查名单提取、关键词别名、人物速览格式、全文匹配、名单展示及重新读取。特别检查关键词含普通词造成的误命中；当前为本地规则解析，没有语义模型，特殊命名／非结构化 prose 仍可能漏读。检查切卡异步结果隔离、保存及导出。确认后才考虑正式发布，`main` 与正式指针始终是唯一稳定通道。
