# PROJECT_STATE.md

## 项目与发行阶段
红豆粉开场白选择器，当前正式版 v1.0.8；`develop` 已发布测试版 v1.0.9-beta.2，待酒馆环境验收。玩家和作者使用同一份纯 import 脚本。普通多开场卡显示玩家预览；主开场以 `<UniversalOpeningSelector/>` 开头的角色卡显示作者选择页。v1.0.8 的正式导入脚本只读取 `main` 的正式指针。当前远端 `origin/main` 为 `b798f52`；本轮正在构建 `v1.0.9-beta.2`，旧版正式 `main` 指针保持不动。

## 核心文件
- `src/player.js`：普通玩家模式、标题/人物解析、搜索和本机设置。
- `src/author.js`：识别作者标记、读取备用开场、挂载作者选择页和管理生命周期。
- `src/selector.js` / `src/selector.css`：作者预设、九套主题、媒体、选择、保存和封面压缩。
- `src/author-template.js`：生成的作者页面模板。
- `scripts/build-author-script.mjs`：显式 `--preview` / `--stable` 构建，分别仅允许在 `develop` / `main` 执行；生成运行模块及对应轻量 import JSON。
- `scripts/runtime-ref.txt` / `scripts/runtime-ref-preview.txt`：正式与测试各自的运行模块 SHA 指针；前者只在正式发布最后一步更新。
- `remote.js`：按 SHA 发布的自包含运行模块，由稳定 Loader 读取版本指针后导入并挂载。
- `dist/红豆粉开场白选择器_通用脚本_v1.0.8.json`：正式版玩家/作者通用导入文件。
- `dist/红豆粉开场白选择器_测试版脚本_v1.0.9-beta.2.json`：测试版导入文件，独立 ID、默认关闭且不随卡导出；用于当前测试版现场验收。
- `test/loader.test.mjs`：执行两种 JSON 中的 Loader（将动态 import 替换为测试加载器），覆盖两通道隔离、指针读取、回退 SHA、发布源重试、挂载与错误提示。
- `pack.mjs`：仅作为维护者开发、测试及旧卡回归工具。

## 使用规则
作者自行把主开场改成 `<UniversalOpeningSelector/>`，把原主开场移至备用开场第一条，保持其他开场原顺序；在酒馆助手角色脚本中导入通用脚本并启用随卡导出。作者设置写入 `data.extensions.universal_opening_selector`。上传的封面、BGM 与歌词以内嵌数据保存在角色卡。普通用户将同一脚本导入全局脚本库；不带标记的普通多开场卡进入玩家模式。酒馆助手和可访问 GitHub 发布源是运行前提。

不得自动迁移开场、自动初始化作者卡、注入 Regex 或修改开场正文。群聊和已开始的聊天不显示选择入口。玩家个人主题/标签/修正仅保存在本机。

## 当前功能
- 玩家与作者均可预览完整正文、识别和筛选人物、搜索开场。
- 作者可编辑标题、简介、人物、标签、排除字段、主题、封面、音乐和歌词；保存时检查酒馆服务端写入并重新读取复核。
- 上传封面尝试最长边 960 px WebP 压缩；只在生成结果更小时使用；GIF 保留，压缩后限制约 1 MB。
- 九套主题：旧档案、霓虹夜、纸与墨、黑白电影、林间信、锦书古风、星海航图、绯色契约、末日警报。主题和设置为可拖动窗口，无全屏遮罩。
- 作者选择页使用主题强调色双层边框和角部线条；页眉、搜索区、卡片间距经过整理，窄屏仍采用直角外框。九套主题各有专属背景图，分别体现档案书库、霓虹城、纸本水墨、黑白雨夜、林间晨雾、古典园林、星海、绯色花影和末日废城；背景图已改为 1300×1050 竖向比例（相较上一版横向收窄、纵向增高），`cover` 铺满作者与玩家顶部背景区域，背景不透明度提高到 0.56–0.92，并在上半区保持清晰后渐隐融入主题底色，作者页和玩家预览均跟随主题。每套主题另有透明底小徽记，装饰页眉、开场卡、主题预览和无结果状态；徽记约 72 KB。古风卡片“卷·故事”横排显示。设置页三类标签各有透明插画；缺少正式开场、无搜索结果和未上传 BGM 状态均显示对应插画。小插画约 13 KB，九张主题背景约 312 KB，总计约 397 KB；由 pack 构建时内嵌到远程模块，不进入卡片扩展数据。
- Loader 仅含版本指针读取与 import 逻辑；启动时以 `cache: no-store` 从 GitHub Raw 的 main 分支读取 `scripts/runtime-ref.txt`，运行模块仍按 SHA 固定加载。启动器从 v1.0.8 起稳定，后续发布无需玩家重新导入；指针请求失败时退回已知 SHA。媒体配置与模块代码缓存相互独立。
- 测试 Loader 只读取 `develop/scripts/runtime-ref-preview.txt`，其运行模块和界面标为 `v1.0.9-beta.2`。正式 Loader 只接受三段数字的正式版本，拒绝 beta 模块；两个 JSON 使用不同脚本 ID。测试脚本默认关闭，`export_with.data=false`，不能随作者卡导出。

## 验证与限制
构建后运行 `node test/author.test.mjs`、`node test/player.test.mjs`、`node test/pack.test.mjs`、`node test/observer.test.mjs`、`node test/loader.test.mjs`。浏览器 UI 测试 `node test/author.ui.test.mjs` 需要 Playwright Chromium。酒馆主题、角色脚本导入/导出及手机实际交互仍须现场验收。

在 `develop` 修改源码后执行 `node scripts/build-author-script.mjs --preview`，提交并发布含 `remote.js` 的测试源码，再将该提交 SHA 写入测试指针并重新构建测试 JSON。正式发布需先把验收通过的源码提交到 `main`，运行 `--stable` 构建并发布含 `remote.js` 的提交，最后才将 SHA 写入 `scripts/runtime-ref.txt` 并同步正式 JSON。正式指针不得用于测试候选版本。

## 最近一次重要修改
- 2026-09-28：v1.0.8 稳定 Loader 已发布。Loader 使用 `cache: no-store` 从 GitHub Raw 的 `main/scripts/runtime-ref.txt` 读取运行模块 SHA，再按不可变 SHA 导入；指针读取失败时使用内置回退 SHA。最新已记录运行模块指针为 `08b69a8b4bf5607dafbf4b32f63790d8b9b4e474`，仓库当前发行提交为 `b798f52`。刷新导入脚本不会覆盖角色卡中的作者预设、封面、音乐或歌词。
- 同一阶段完成 v1.0.7 九主题背景调整：九张背景为 1300×1050，纵向增高、横向收窄，作者与玩家界面继续使用 `cover` 铺设并以底部渐隐融入主题底色。图片分别位于 `assets/theme-background-*.webp`，由构建过程并入远程模块。
- 自动更新阶段形成可复核节点：README 已同步首次替换、后续自动更新、指针回退和所有发布源不可用时的提示行为；新增 `test/loader.test.mjs`，模拟有效／无效指针、SHA 回退、CDN 顺序重试、模块挂载及最终失败提示。五项 Node 测试均通过。
- 2026-09-28：按用户要求建立正式与测试通道，发布规则已写入 `AGENTS.md`，使用方法已写入 README。`develop` 的 beta 运行模块树与本地 `7ef2105` 相同，远端 GitHub 提交为 `c324c96739645d1074d810f75ac8d3422424933f`；测试指针和测试导入 JSON 已固定到该远端 SHA。正式 `main`、`scripts/runtime-ref.txt` 和 v1.0.8 导入 JSON 未改变。五项 Node 测试通过，`--stable` 构建在 `develop` 上按预期拒绝执行。

## 当前已知问题与下一步
- 背景发灰主要来自 CSS 的低透明度和过早渐隐；素材原图为 1300×1050 WebP、质量 92。本轮提高主题背景不透明度并把渐隐起点从高度 18% 延后至 44%，不改变原始素材和卡片媒体。
- Playwright Chromium 当前不可用时，无法自动跑作者界面截图测试。Node 模拟覆盖 Loader 分支，但酒馆中的远程加载、主题渲染、角色脚本随卡导出和手机实际交互仍须现场验收。
- 本轮已取得用户明确授权；本地 Git 命令行无 GitHub 凭据，改用已连接的 GitHub 仓库接口发布 `develop`。远端 beta 运行模块已发布，测试指针及导入文件发布后仍需核查。
- 下一步在酒馆助手中验收两通道及旧版正式启动器的真实加载行为，记录酒馆版本及结果；验收前不得更新 `main` 正式指针。
