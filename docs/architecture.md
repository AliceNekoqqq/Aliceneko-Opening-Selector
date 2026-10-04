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
| src/media-files.js | 媒体文件读取、歌词文本读取与封面转换；不持有草稿 |
| src/media-player.js | 音频播放、进度、歌词显示及停止／事件清理 |
| src/settings-fields.js | 通用输入字段、上传任务计数与草稿有效性保护 |
| src/music-settings.js | 音乐设置界面与草稿预览；不负责保存角色卡 |
| src/worldbook-preset-editor.js | 作者预设编辑会话、条目筛选与开场分配；通过接口参与保存 |
| src/player-draft-guard.js | 玩家未保存确认、保存决策、重复提示保护与提示取消 |
| src/player-panel-session.js | 单个玩家弹窗的显示、关闭保护、资源归属与一次性清理 |
| src/player-settings-layout.js | 玩家设置分组、入口显隐与折叠联动；不处理保存 |
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

## 设置与媒体边界

selector.js 继续持有唯一配置、设置草稿和保存事务，字段工厂只通过 getDraft 与 onPendingChange 接口查询身份、报告上传任务。文件读取与后续异步处理都结束后才解除保存保护；草稿放弃／替换或作者界面卸载后，旧任务不再回写或更新提示。
media-player.js 只负责播放器 DOM 与音频事件，music-settings.js 只编辑传入草稿并请求预览。放弃设置仍恢复已保存音乐；移除整个作者界面时通过 __uosDispose 停止音频、解绑播放事件并关闭上传会话和背景控制器。
封面转换保持原有尺寸、格式与 GIF 规则；selector.js 兼容重导出 optimizeCoverData。设置与角色卡扩展字段格式未变。

世界书编辑器独立持有选中 ID、预设编辑副本、新建／脏状态、读取结果；通过 getDraft 使用主界面唯一草稿，提供 render／refresh／hasUnsaved／commitPending／reset／close 接口。预设按钮和「保存并关闭」使用同一提交校验。编辑预设只改变草稿，切换开场时应用世界书仍由 worldbook-presets.js 的事务负责。过期读取和延迟删除不能写入已替换的会话。
玩家未保存流程由 player-draft-guard.js 管理，通过回调读取差异、请求确认、保存到本机／角色卡或恢复输入；不持有第二份设置数据。关闭保护与开场切换、更新前检查复用同一个 confirm。面板结束会取消提示、解绑按键；旧确认结果不能关闭新面板。

玩家主界面只持有当前 panelSession，每个会话独立持有自己的 dialog、背景控制器、更新控件、设置布局和草稿保护。关闭／原生 close／打开失败都走同一清理路径，先取消提示、解绑监听，再移除 dialog；旧 close 事件和旧切换完成回调只结束所属会话。更新前检查复用草稿保护，不立即移除窗口。
player-settings-layout.js 接收已有设置节点，维持「开场显示／识别规则／插件」分组和单项展开行为；字段、数据与保存回调仍由玩家业务代码管理。重新组装和关闭均移除旧折叠监听。

## 验证与下一步

Node 回归、入口隔离、实际 ESM 导出、标准构建版本注入、模板安全 JSON 和媒体保留、资源哈希与预加载在途复用通过。
当前正式产物专用测试在 preview 条件下仅提示，不计作新正式验收。浏览器、真实 CDN 与普通／Tauri 酒馆仍待验收。
架构整理阶段已结束。候选 v1.0.15-beta.1 进入独立测试通道供酒馆验收，正式通道不推进。云浏览器没有连接到真实酒馆，且访问工作区本地验收地址返回 ERR_BLOCKED_BY_CLIENT；浏览器和真实酒馆验收均不能标记为通过。
媒体模块与音乐设置已拆分，并通过播放／跳转／相同音源、卸载停止、上传期间保护、失效草稿及音乐清除定向测试。作者世界书编辑器与玩家未保存确认已独立，新增八项回归覆盖预设新建／复制／重命名／分配、搜索修改、撤销／删除、过期读取、继续编辑／保存失败、重复提示和焦点／取消清理。玩家设置布局和主弹窗会话也已独立，新增七项定向测试覆盖分组／显隐／折叠、关闭保护、原生关闭、旧事件隔离、强制取消、打开失败及更新前检查。下一步在测试通道完成真实酒馆验收；不机械按行数拆分，也不新增第二套主题或保存状态。
