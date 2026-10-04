# PROJECT_STATE.md

## 项目与阶段
红豆粉开场白选择器，玩家／作者使用同一份通用脚本。正式版 v1.0.15；main 提交 444518cc8d97befd6016e7b948066ef23fd4e560，正式运行指针 70831876953c1a04891ae76ad14d818c9f398c55。
当前测试候选 v1.0.15-beta.2。用户要求的主要架构整理已完成，候选进入独立测试通道供酒馆验收；正式通道保持 v1.0.15。新的测试周期必须基于最新正式源码，从 -beta.1 开始。

## 已完成架构重构
- 共用标题／正文／人物解析独立为 src/greeting-analysis.js，作者与玩家界面不互相导入。
- 主题元数据统一为 src/themes.js；图片地址通过 asset-source.js／theme-art.js 显式提供，不抓取页面 CSS。
- 旧 pack.mjs、index.js 及专用测试已移除。角色卡只在酒馆中制作与导出；维护者构建不生成角色卡。
- 构建使用 package-lock 锁定 esbuild，从 src/main.js 解析真实模块依赖。旧源码切片、import/export 正则移除和手工版本替换已删除。src/version.js 为唯一运行版本来源。
- src/author-template.js 是可维护模板源码；generated/author-css.js 不跟踪，由构建／npm test 生成。
- 十六张背景在脚本启动时同时预加载，作者与玩家共享服务、缓存和在途 Promise。每源 5 秒超时，备用源顺序 jsDelivr → testingcf → raw；失败保留主题底色，关闭脚本取消在途请求。
- 背景、图标、页眉角饰和设置插画使用已发布固定资源 SHA 444518cc8d97befd6016e7b948066ef23fd4e560，均通过本地 blob 校验。默认封面固定资源版本保持原值。
- 移除开场卡片装饰角标与专属 CSS，保留序号及页眉装饰。
- dist 只保留当前正式 JSON 和当前测试候选；四份兼容性测试必需旧入口移至 test/fixtures，其余旧产物留在 Git 历史。

- 媒体播放／文件处理拆至 media-player.js／media-files.js；音乐设置拆至 music-settings.js，通用字段与上传任务管理拆至 settings-fields.js。selector.js 保持唯一草稿和保存事务，异步封面／歌词处理均检查草稿有效性。
- 作者界面以 __uosDispose 统一停止音频、解绑播放事件、关闭上传会话与背景控制器。放弃设置仍恢复已保存音乐；配置数据格式未变。

- 作者世界书编辑会话拆至 worldbook-preset-editor.js；选中预设／编辑副本／脏状态由模块维护，主界面通过 hasUnsaved／commitPending／reset 参与保存和放弃，不再直接改这组状态。预设按钮和保存并关闭共用校验。
- 玩家未保存确认与关闭保护拆至 player-draft-guard.js；关闭、选择开场、更新前检查复用同一 confirm。卸载取消提示并移除按键监听，旧确认结果不能关闭新面板。unsavedPlayerGroups 仍从 player.js 兼容重导出。

- 玩家设置分组与显隐独立为 player-settings-layout.js。主弹窗独立为 player-panel-session.js，每个窗口管理自己的背景、更新控件、布局和草稿保护；关闭与打开失败共用一次性清理，旧 close／切换完成回调不清理新窗口资源。player.js 只保留当前 panelSession 引用，更新前检查通过其接口执行。

## 关键入口
src/main.js 是远程运行入口。scripts/build-author-script.mjs 负责通道验证与构建；bootstrap-stable.js／bootstrap-preview.js 负责远程更新确认。
scripts/runtime-ref.txt／runtime-ref-preview.txt 是可变运行指针；bootstrap-ref.txt／bootstrap-ref-preview.txt 是固定初始锚点，不能随发布推进。
remote.js 是自包含构建产物，不手改或全文输出。源码职责与依赖边界见 docs/architecture.md；人物规则详见 docs/person-matching-audit.md。

## 当前功能与不可回归规则
- 普通多开场卡显示玩家预览；作者自行将主开场改为 <UniversalOpeningSelector/>，原主开场移动至备用第一条。插件不搬移原文、不注入 Regex。
- 保留完整正文预览、标题／人物／正文搜索、人物筛选和手工修正。作者标题、导语、开场信息、媒体与世界书预设保存在 data.extensions.universal_opening_selector。
- 十六主题、80 张默认封面已完成，不重复生图。默认封面随机分配可重复、搜索与筛选稳定、自定义优先。用户媒体保存行为不变。
- 关闭与切换前处理草稿，允许保存、放弃或继续编辑。世界书预设集中管理，再按开场分配；无预设不改书。只修改角色绑定书，按 UID 预检与失败回滚。
- 人物名单只读取角色绑定主／附加世界书。明确姓名／人物名单可建立身份；单独标题、属性、代词和触发关键词不能确认身份。普通关键词仅作待确认信息，不直接当别名。
- 名单匹配整个原文，包括标签、属性、注释及代码块。世界书不是白名单；空名单或读取失败不能抹掉正文中的明确人物。长姓名优先占范围，冲突别名不自动分配，英文按单词边界。
- 不读取全局、聊天或卡内嵌入世界书；分类评级 NPC／NSFW／SFW／R18 不成为姓名。章节、表格和对象语境不能越界。同人多条资料不能造冲突，复合姓名不能截词。
- 卡名仅为弱线索。人工词表与修正优先，旧 entries.names 不擅自清除。人物字段留空恢复自动；输入“无”隐藏人物。不承诺区分实际出场和仅被提及。
- 本地 JSON 保持纯远程入口、脚本身份与导出设置。普通更新不要求重新导入；确需迁移先取得明确授权。
- 更新入口在设置；自动检查开关按通道独立，手动入口始终可用。先显示目标版本与逐版说明，再确认加载；取消同候选不重复弹窗，版本号旁仅小星标。
- 每个发布候选必须有匹配 CHANGELOG。正式／测试通道隔离，固定锚点不推进。源码成功发布后才可推进对应运行指针。

## 验证与限制
npm run build:preview 与 npm test 已通过，remote.js 语法与实际 ESM 导出验证通过。新增七项玩家弹窗回归覆盖设置布局／显隐／折叠、关闭保护／原生关闭、旧事件隔离、强制取消、打开失败和更新前检查。新增八项设置会话回归覆盖预设编辑／分配／搜索／撤销／延迟删除、过期读取、玩家保存决策／失败／重复提示以及焦点／取消清理。新增五项媒体回归通过：播放与跳转、相同音源不重启、卸载停止与事件清理、上传任务／失效草稿保护、音乐设置及延迟歌词处理。测试覆盖媒体与模板种子保留、预加载全部背景、在途复用、备用源、超时、关闭取消、版本注入及现有业务。
current-stable-loader 在 preview 条件下仅提示，不能计为当前正式产物验收。浏览器与真实普通 SillyTavern／TauriTavern 的保存、导出再导入、触摸和 CDN 可用性仍待验收。
运行模块从初始约 2.22 MB 降至约 0.30 MB；这是文件体积变化，未实测 GitHub 发布耗时。预加载不阻塞界面，网络未完成或失败仍可能短暂显示底色。

## beta.2 新功能与边界
- 新增 gallery／catalog／dossier 版式；classic 保留旧卡排列。作者保存 layout 到原扩展字段；普通玩家按 avatar 保存本机版式偏好，优先于卡内默认值。版式切换不改变原文、索引或世界书。
- 每条开场新增 coverSlot（0 自动，1～5 固定）与 coverFocus（x／y 0～100，默认居中）。自定义 image 优先；选择默认图或重新随机会清空当前自定义图。固定编号切主题使用对应编号的素材，不复制图片到卡内。
- opening-presentation.js 共用版式／封面规范与渲染；opening-layout-styles.js 共用作者／玩家布局样式，构建纳入作者 CSS；cover-settings.js 只编辑传入草稿，沿用 selector 保存、放弃与关闭保护。
- 38 项 Node 回归通过，preview 构建、remote.js 语法、差异空白检查通过。新增三项回归验证旧配置回退、固定封面／自定义优先与草稿隔离。新增 opening-presentation.ui.test.mjs 覆盖保存／放弃、筛选、完整预览及 320／768 宽度的作者／玩家版式，但 Chromium 下载 ZIP 不完整，未执行，不声称视觉或实机通过。

## 下一步
- beta.2 源码已发布 develop，运行提交 8602792c190d7a29598c0f3c8fc3c5d652780b2c；测试运行指针指向此提交，正式通道与固定启动锚点不变。用户已有测试入口无需重新导入。
- 在真实酒馆检查三种版式、封面选择与焦点、保存／放弃和手机显示。完成这一步后再考虑完整预览升级，不自动开展后续大功能。
- beta.1 架构源码运行提交为 6767aa42419eb7f5366ca378e728b4388d901136；不要重复上传旧产物。云浏览器没有连接真实酒馆，历史本地验收地址 ERR_BLOCKED_BY_CLIENT；本轮 Chromium 下载失败，验收限制仍保留。
