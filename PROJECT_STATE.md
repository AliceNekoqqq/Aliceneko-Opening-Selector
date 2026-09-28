# PROJECT_STATE.md

## 项目与发行阶段
红豆粉开场白选择器，正式版 v1.0.9；`develop` 保留测试版 v1.0.9-beta.2。玩家和作者使用同一份自动更新脚本：普通多开场卡显示玩家预览，主开场以 `<UniversalOpeningSelector/>` 开头时显示作者选择页。正式 Loader 自 v1.0.8 起读取 `main/scripts/runtime-ref.txt`，按 SHA 导入正式运行模块；v1.0.9 指针目标为 `10d7e873234e225ec760152f2d95e5f265d61dae`。

## 核心文件
- `src/player.js`：玩家模式、标题与人物解析、搜索和本机设置。
- `src/author.js`：作者标记识别、选择页挂载与生命周期。
- `src/selector.js` / `src/selector.css`：选择页、九套主题、媒体和作者设置。
- `src/author-template.js`：构建生成的作者页面模板，包含主题图像资源。
- `assets/theme-background-*.webp`：九套 1300×1050、质量 92 的主题背景图；由 `pack.mjs` 内嵌到运行模块，不进入角色卡数据。
- `scripts/build-author-script.mjs`：`--stable` 仅允许在 `main` 构建 v1.0.9；`--preview` 仅允许在 `develop` 构建 v1.0.9-beta.2。
- `scripts/runtime-ref.txt` / `scripts/runtime-ref-preview.txt`：正式与测试通道各自的运行模块指针。
- `remote.js`：构建生成的自包含模块。
- `dist/红豆粉开场白选择器_通用脚本_v1.0.9.json`：正式玩家／作者通用导入脚本。
- `dist/红豆粉开场白选择器_测试版脚本_v1.0.9-beta.2.json`：测试导入脚本，独立 ID、默认关闭且不随角色卡导出。

## 当前功能与产品规则
- 玩家和作者均可预览完整正文、搜索开场并按登场人物筛选。
- 作者可编辑标题、简介、人物、标签、排除字段、主题、封面、音乐与歌词；作者数据保存到 `data.extensions.universal_opening_selector`。
- 作者需自行将主开场改为 `<UniversalOpeningSelector/>`，并将原主开场移动到备用开场第一条。插件不自动迁移开场、不注入 Regex、不改写正文。
- 九套主题背景铺在界面顶部并向主题底色渐隐。为解决背景发灰，通用不透明度提高到 68%，霓虹／林间／绯色为 56%，纸与墨为 92%，末日警报为 60%；渐隐从背景高度 44% 开始。主题和设置均为可拖动浮窗。
- 正式 Loader 仅接受三段数字版本，不加载 beta 模块；测试 Loader 只读 `develop/scripts/runtime-ref-preview.txt`。正式指针在正式运行模块发布后最后更新。

## 验证与限制
发布前运行 `node scripts/build-author-script.mjs --stable`，以及 `node test/author.test.mjs`、`node test/player.test.mjs`、`node test/pack.test.mjs`、`node test/observer.test.mjs` 和 `node test/loader.test.mjs`。v1.0.9 的五项 Node 测试与九张背景资源内嵌检查通过。Playwright Chromium 不可用，因此作者界面截图测试未能执行；仍可在酒馆中补充实际显示与移动端回归。

## 最近重要修改
2026-09-29：正式版 v1.0.9 发布主题背景清晰度调整。素材本身保持 1300×1050 WebP 质量 92；将 CSS 不透明度提高、延后渐隐，避免图片因低透明度而显得发虚。正式 Loader 继续读取 `main/scripts/runtime-ref.txt`，现有 v1.0.8 安装无需重新导入。测试版 v1.0.9-beta.2 保留在 `develop`。

## 下一步
收集酒馆和手机端的实际显示反馈；正式 `main` 和 `scripts/runtime-ref.txt` 是唯一面向用户的稳定通道。
