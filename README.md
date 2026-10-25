# osphey.github.io

韩昊辰 Osphey 的静态个人作品集。使用原生 HTML、CSS 和 JavaScript，无需安装依赖或构建，可直接部署到 GitHub Pages。

## 文件结构

```text
index.html              关于：照片、个人介绍与方向选择
games.html              游戏作品
projects.html           项目与 AI 实验
resume.html             简历，内容暂留空
assets/site.css         布局、深浅色主题和手机适配
assets/site.js          方向、语言、主题和跨页链接状态
assets/portrait.jpg     个人照片
assets/games/           游戏封面
THIRD_PARTY_NOTICES.md  图标来源与许可
```

## 本地预览

直接用浏览器打开 `index.html` 即可浏览，也可以使用任意静态 HTTP 服务器预览。

## 页面行为

- 顶部统一使用「关于 / 游戏 / 项目 / 简历」四个独立页面；当前页面通过下划线和 `aria-current="page"` 标识。导航使用原生 HTML 链接，不依赖前端路由。
- 关于页只展示照片与个人介绍。姓名下方可选择「游戏开发 / AI 探索」，URL 中的 `?view=ai` 表示 AI 方向；站内导航会保留这一选择，浏览器前进、后退也能同步状态。
- 游戏页以固定卡片网格展示 5 款作品，点击封面或标题打开 itch.io。项目页按所选方向展示原有项目或 AI 实验、笔记；简历页只保留公共导航和页脚，正文留空。
- 排版参考 [FAN HAO](https://www.fanhao.work/)：宽内容区、简洁文字导航、左右分栏的照片与介绍、双列大图作品。手机端使用单列，所有介绍始终可见。
- 中英文和深浅色偏好分别保存在 `osphey-language`、`osphey-theme` 中。首次访问默认英文、浅色；浏览器禁用存储时仍可切换。
- 脚本在页头读取主题和方向，DOM 就绪后启用切换按钮。关闭 JavaScript 时仍可浏览默认英文内容、个人照片，并通过顶部链接访问全部页面。
- 页面没有轮播、3D 画廊、入场动画或滚轮拦截。

## 内容维护

- 修改内容：编辑对应 HTML 文件。元素正文为英文，`data-zh` 为对应中文；可访问标签使用 `data-zh-label`，图片替代文字使用 `data-zh-alt`，提示文字使用 `data-zh-title`。
- 添加游戏：在 `games.html` 的 `.game-list` 中复制一项 `.game`，更新图片、标题、介绍、类型和 itch.io 链接，并把封面放入 `assets/games/`。
- 填写简历：在 `resume.html` 的 `<main>` 中添加内容。
- 四个页面共用样式与脚本。调整公共导航或页脚时，同步修改四个 HTML；新增站内导航链接时添加 `data-site-link`，以便保留方向选择。
- 修改布局或配色：编辑 `assets/site.css`。
- 修改切换行为：编辑 `assets/site.js`。
- 更新图标时保留 `THIRD_PARTY_NOTICES.md` 中的来源和许可。
