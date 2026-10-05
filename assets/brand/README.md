# OC 看板娘

四张独立透明 WebP；场景差分三张约 90 KiB，主题精灵图约 500 KiB。图片不写入角色卡或运行模块。

- mascot.webp：页眉品牌 Logo，眨眼、比耶、三张故事卡。384×351。
- welcome.webp：设置欢迎，双眼睁开、招手、蝴蝶笔记本。320×292。
- search.webp：搜索无结果，放大镜、思考表情、小问号。320×292。
- theme-mascots.webp：4×5 网格中的 17 套主题 Logo，主题顺序与 `src/themes.js` 一致；最后一行仅左侧一格。1120×1400。

使用内置 image_gen 生成。以用户最终三视图为身份参考，以确认的眨眼款统一差分画风；粉色双侧绑发、角色左侧蝴蝶夹、莓紫瞳、莓红水手领与奶油开衫保持。表情与姿势独立设计，半身、透明底、无白色描边。界面用图经过等比缩小与 WebP 编码，保留 alpha。

提示词规格：logo-brand / identity-preserve；clean anime chibi linework and soft cel shading；compact chest-up silhouette；grouped hair locks；true transparent background；no sticker border, ribbon frame, scenery or lettering。表情差分分别指定 playful wink + V sign + three story cards、welcoming smile + wave + notebook、curious pondering face + magnifying glass + question mark。主题精灵图用 4×5 顺序网格呈现全主题服装 Logo，并按主题各自指定上身廓形、领口、袖型、纹样与胸针。
