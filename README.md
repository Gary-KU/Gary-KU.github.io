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
