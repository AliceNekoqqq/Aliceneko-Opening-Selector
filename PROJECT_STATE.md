# PROJECT_STATE.md

## 项目与发行阶段
红豆粉开场白选择器，当前正式版 v1.0.3。玩家和作者使用同一份纯 import 脚本。普通多开场卡显示玩家预览；主开场以 `<UniversalOpeningSelector/>` 开头的角色卡显示作者选择页。

## 核心文件
- `src/player.js`：普通玩家模式、标题/人物解析、搜索和本机设置。
- `src/author.js`：识别作者标记、读取备用开场、挂载作者选择页和管理生命周期。
- `src/selector.js` / `src/selector.css`：作者预设、九套主题、媒体、选择、保存和封面压缩。
- `src/author-template.js`：生成的作者页面模板。
- `scripts/build-author-script.mjs`：生成远程运行模块及轻量 import JSON；版本号和 `scripts/runtime-ref.txt` 决定发行信息。
- `remote.js`：固定 SHA 发布的自包含运行模块，由 Loader 导入并挂载。
- `dist/红豆粉开场白选择器_通用脚本_v1.0.3.json`：正式版玩家/作者通用导入文件。
- `pack.mjs`：仅作为维护者开发、测试及旧卡回归工具。

## 使用规则
作者自行把主开场改成 `<UniversalOpeningSelector/>`，把原主开场移至备用开场第一条，保持其他开场原顺序；在酒馆助手角色脚本中导入通用脚本并启用随卡导出。作者设置写入 `data.extensions.universal_opening_selector`。上传的封面、BGM 与歌词以内嵌数据保存在角色卡。普通用户将同一脚本导入全局脚本库；不带标记的普通多开场卡进入玩家模式。酒馆助手和可访问 GitHub 发布源是运行前提。

不得自动迁移开场、自动初始化作者卡、注入 Regex 或修改开场正文。群聊和已开始的聊天不显示选择入口。玩家个人主题/标签/修正仅保存在本机。

## 当前功能
- 玩家与作者均可预览完整正文、识别和筛选人物、搜索开场。
- 作者可编辑标题、简介、人物、标签、排除字段、主题、封面、音乐和歌词；保存时检查酒馆服务端写入并重新读取复核。
- 上传封面尝试最长边 960 px WebP 压缩；只在生成结果更小时使用；GIF 保留，压缩后限制约 1 MB。
- 九套主题：旧档案、霓虹夜、纸与墨、黑白电影、林间信、锦书古风、星海航图、绯色契约、末日警报。主题和设置为可拖动窗口，无全屏遮罩。
- 作者选择页使用主题强调色双层边框和角部线条；页眉、搜索区、卡片间距经过整理，窄屏仍采用直角外框。九套主题各有透明底主题徽记，装饰页眉、开场卡、主题预览和无结果状态；精灵表以约 72 KB WebP 由 pack 构建阶段嵌入运行模块，不进入角色卡数据。古风卡片“卷·故事”横排显示。设置页三类标签各有透明插画；缺少正式开场、无搜索结果和未上传 BGM 状态均显示对应插画。插画总量约 85 KB，由 pack 构建时内嵌到远程模块，不进入卡片扩展数据。
- Loader 仅含 import 逻辑，固定至已验证的 GitHub 提交 SHA。媒体配置和模块缓存相互独立。

## 验证与限制
构建后运行 `node test/author.test.mjs`、`node test/player.test.mjs`、`node test/pack.test.mjs`、`node test/observer.test.mjs`。浏览器 UI 测试 `node test/author.ui.test.mjs` 需要 Playwright Chromium。酒馆主题、角色脚本导入/导出及手机实际交互仍须现场验收。

修改源码后先执行 `node scripts/build-author-script.mjs`。正式发布时先发布 `remote.js` 并验证 CDN 返回与 SHA，再把提交 SHA 写入 `scripts/runtime-ref.txt`，构建最终轻量 JSON，最后更新 `main` 和版本分支。分支名不用于 CDN；Loader 必须固定提交 SHA 和校验模块版本。
