# 架构与维护边界

## 当前结构

| 模块 | 职责 |
| --- | --- |
| src/main.js | 唯一运行入口；启动背景预加载，再挂载玩家与作者模式 |
| src/version.js | 构建注入的唯一运行版本；源码测试使用 development |
| src/themes.js | 有序主题 ID、名称和页眉文案 |
| src/asset-source.js | 已发布的固定资源 SHA 与 CDN／备用地址 |
| src/theme-art.js | 图标、页眉角饰、设置插画的显式资源接口 |
| src/theme-backgrounds.js | 共享背景预加载、在途去重、缓存、备用源与取消 |
| src/greeting-analysis.js | 标题、正文、人物与别名分析；不依赖 UI 或存储 |
| src/worldbook-people.js / src/worldbook-presets.js | 绑定世界书身份词表与预设事务 |
| src/selector.js / src/player.js / src/author.js | 作者界面、玩家界面、作者标记与生命周期 |
| src/author-template.js / src/selector.css | 可阅读的页面模板与作者样式源码 |
| scripts/build-author-script.mjs | 通道验证、esbuild 模块构建与轻量入口生成 |
| scripts/build/author-css.mjs / write-author-css.mjs | 样式资源替换和生成样式写入 |

作者和玩家完全在酒馆内制作、配置、保存和导出角色卡。仓库的 Node 构建是维护者生成远程模块的步骤，不生成角色卡。
旧 pack.mjs、index.js、按函数名切片的解析提取、手工删除 import/export 的构建器均已移除。不要恢复兼容旧打包器的旁路。

## 依赖与产物

构建使用 package-lock.json 锁定的 esbuild，从 src/main.js 解析真实导入图，输出一个自包含 ESM remote.js。
本地 JSON 仍只导入远程 bootstrap，remote.js 的版本导出和 mountUniversalSelector 接口保持兼容。固定锚点、更新确认和草稿保护不迁移。
页面模板是普通可维护源码，样式生成至忽略跟踪的 generated/author-css.js；构建和 npm test 都按需生成。不要提交 node_modules 或 generated。
新维护环境运行 npm ci，再运行 npm run build:preview、npm test；正式构建仅 main 可执行。

## 资源加载

所有主题图片使用已发布提交 444518cc8d97befd6016e7b948066ef23fd4e560 的固定地址，当前文件与该提交 blob 均已核对。
图标与插画不再内嵌 Base64，也不从页面 CSS 抓取地址；作者和玩家使用同一资源接口。
脚本启动立即并行预加载十六张背景，界面不等待完成。切主题复用已加载地址或同一个在途 Promise；预加载未完成时仍可能短暂显示主题底色，不承诺任何网络条件下零等待。
背景依次尝试 jsDelivr、testingcf、raw，每个源最多 5 秒。全部失败显示主题底色。关闭单个面板只解除该面板更新，不中断共享预加载；更新／脚本卸载取消资源服务并清理定时器和事件。
默认封面仍用独立既有固定资源版本。用户自定义封面、BGM 和歌词仍保存在角色卡扩展字段，本轮不修改数据语义。

## 清理范围

当前 dist 只保留 v1.0.15 正式入口与 v1.0.15-beta.1 测试候选。四份兼容性测试必需的历史入口移至 test/fixtures，其余旧 JSON 不在当前目录中分发。旧版本仍保留于 Git 历史及其固定提交。
旧 pack 专用测试与旧 index observer 专用测试已移除；当前 author/player 生命周期、人物匹配、世界书事务与入口兼容测试保留。

## 验证与下一步

Node 回归、入口隔离、实际 ESM 导出、标准构建版本注入、模板安全 JSON 和媒体保留、资源哈希与预加载在途复用通过。
当前正式产物专用测试在 preview 条件下仅提示，不计作新正式验收。浏览器、真实 CDN 与普通／Tauri 酒馆仍待验收。
源码整理可同步 develop，但本阶段不推进运行指针，避免未完成视觉验收的重构进入用户更新通道。
后续按职责拆分作者设置、玩家弹窗和媒体模块；不机械按行数拆分，也不新增第二套主题或保存状态。
