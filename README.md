# GARY / Engineering Beyond

Gary-KU 的个人网站。原创航天视觉、Canvas 轨道球体、项目分类、滚动动画与响应式布局。内容仅引用公开仓库，不包含私人仓库资料。

## 本地预览

在本目录运行 `npx --yes http-server dist -p 4173`，访问 http://localhost:4173 。

## 内容维护

- `dist/index.html`：页面文案与结构
- `dist/style.css`：视觉与布局
- `dist/app.js`：项目列表、筛选与 Canvas 动画

无需构建。线上使用 `gh-pages` 分支托管。在本目录修改后，提交并推送 main，再运行 `git subtree push --prefix dist origin gh-pages` 发布更新。网站地址：https://gary-ku.github.io/ 。

本地附带 `.github/workflows/pages.yml` 作为可选 Actions 配置，未上传到仓库（当前授权不包含 workflow 权限）。启用它前需要授权工作流写入，并将 Pages 来源改为 GitHub Actions。

Google Fonts 是可选在线字体依赖，无法访问时使用系统字体。插画与轨道视觉均由本站代码绘制。

## VectorDrive 展示与声音

首页只展示简要项目卡片，点击 VectorDrive 后进入 `/vectordrive/` 独立工程详情页。`dist/vectordrive/index.html` 展示实际装配照片、PCB、上位机及短脉冲测试曲线，素材保存在 `dist/assets/vectordrive/`；详情样式与交互分别位于 `detail.css`、`detail.js`。测试范围与限制随指标一同展示。旧 `/#vectordrive` 链接定位首页项目卡片。

声音控件与 `dist/sound.css`、`dist/sound.js` 仅在工程详情页加载，首页不显示或加载声音功能。音乐使用《Young, Wild & Free (feat. Bruno Mars)》的 Spotify 官方嵌入播放器，并提供官方 MV 链接，不下载或托管歌曲音频。默认不加载播放器，点击歌曲名后才加载；实际播放及预览范围由 Spotify 的账户、地区和浏览器规则决定。音乐与浏览器项目旁白互斥，关闭或离开页面时停止。旁白使用设备可用的中文语音。
