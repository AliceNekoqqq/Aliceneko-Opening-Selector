# 红豆粉开场白选择器 · Aliceneko Opening Selector

红豆粉（Aliceneko）制作的独立源码项目。为 SillyTavern 角色卡添加带五套主题的开场选择页，配置与上传素材写入角色卡本身。运行脚本和样式从本仓库固定版本加载；玩家只需导入导出的角色卡，不需要另行导入配置包，但首次打开需要能访问 jsDelivr。与《丧尸少年》专用选择器无关。

## 制作角色卡

1. 在角色卡中写好主开场和备用开场，导出为 JSON。
2. 执行 `node pack.mjs 原卡.json 配置好入口的卡.json`。
3. 导入输出卡，新建聊天。在选择页右上角点 **设置**，修改标题、简介、封面和音乐；点 **保存到角色卡**。
4. **从酒馆重新导出这张角色卡**，再分发给玩家。玩家导入最终卡即可使用。仓库仅保留源码、测试和说明；示例角色卡作为独立下载文件提供。

打包器把原主开场移至第一条备用开场，首条消息改为选择页。每张卡只运行一次；再次运行可更新内嵌脚本并保留已经保存在扩展字段的配置。不要对含有其他开场选择器的卡直接运行，先备份原卡。

## 数据与媒体

- 作者设置保存在 `data.extensions.universal_opening_selector`。SillyTavern 的 `writeExtensionField` 将修改写回角色卡，正常导出后随卡分享。
- 封面、音频用 Data URL 内嵌在卡内；歌词存为文本。这样不会引用作者本机文件。每张封面限 1 MB，音频限 8 MB；角色卡体积会显著增加。
- 无封面时显示当前主题的编号、渐变与排版，不依赖默认图片。
- BGM 设置在独立标签页，启用开关控制播放器显示与播放，上传后可预览，点击保存写回角色卡；播放器参考《丧尸少年》的唱片、进度条和歌词布局，并跟随主题变色。音乐需手动播放；支持 LRC 时间标签及 TXT（TXT 显示全文，不逐行同步）。作者应确认分享媒体的权利。
- 作者默认主题随卡保存；玩家临时切换的主题单独存于本机。

## 实现与限制

打包后的 JSON 在 `data.extensions.regex_scripts` 中包含开场选择页正则，在 `data.extensions.tavern_helper.scripts` 中包含启用的仓库加载脚本。玩家的 SillyTavern 环境仍需安装并启用支持角色卡脚本的酒馆助手扩展；导入角色卡不会自动安装扩展。选择页以 `import()` 从仓库固定版本读取 `index.js`，依次尝试三个 jsDelivr 入口；样式由同一版本读取。点击开场调用酒馆助手的 `setChatMessages` 切到对应首条消息页。保存需要 `SillyTavern.getContext().writeExtensionField`。不同酒馆版本、HTML iframe 策略或第三方渲染方式须现场验收。即使页面未渲染，首条消息仍提示玩家使用原生翻页。

第一版从现有开场确定数量，用正文前段生成待编辑的标题和简介，不调用模型；原生开场正文保持原样。新聊天才能选择，避免改写已经开始的剧情。

## 主题

旧档案、霓虹夜、纸与墨、黑白电影、林间信。主题按钮在设置按钮左侧；弹窗优先挂载到酒馆顶层页面，在手机屏幕中央显示；切换开场再返回选择页时会重新挂载。

## 开发

`index.js` 是公开入口，`src/selector.css`、`src/selector.js` 是源码；`pack.mjs` 把轻量选择页和固定版本加载地址写入角色卡。`node test/pack.test.mjs` 检查打包及二次打包不重复增加开场。

已内置选择页的角色卡会自动加载。若在 Tavern Helper 宿主脚本中手动加载，可用：

```js
const { mountOpeningSelector } = await import('https://cdn.jsdelivr.net/gh/AliceNekoqqq/Aliceneko-Opening-Selector@v0.1.0-beta.7/index.js');
mountOpeningSelector();
```

该宿主加载方式仍需角色卡有 `<UniversalOpeningSelector/>` 入口及对应正则页面；单独粘贴上述两行不会修改角色卡的开场结构。它会扫描当前文档及同源 iframe，发现页面后挂载。
