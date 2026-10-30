# GARY / Engineering Beyond

Gary-KU 的个人网站。原创航天视觉、Canvas 轨道球体、项目分类、滚动动画与响应式布局。内容仅引用公开仓库，不包含私人仓库资料。

## 本地预览

在本目录运行 `npx --yes http-server dist -p 4173`，访问 http://localhost:4173 。

## 内容维护

- `dist/index.html`：页面文案与结构
- `dist/style.css`：视觉与布局
- `dist/app.js`：项目列表、筛选与 Canvas 动画

无需构建。推送 main 后 GitHub Actions 自动发布 `dist` 到 GitHub Pages。仓库 Pages 来源应设置为 GitHub Actions。

Google Fonts 是可选在线字体依赖，无法访问时使用系统字体。插画与轨道视觉均由本站代码绘制。
