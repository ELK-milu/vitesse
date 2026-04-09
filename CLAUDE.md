# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

基于 Vue 3 + Vite 的**模板化热更新网站框架**。核心设计：开发人员只在 `src/index/` 写页面模板，非 IT 人员只改 `public/site/` 下的 JSON 和图片即可更新网站内容，无需重新构建。

## 常用命令

```bash
pnpm dev          # 启动开发服务器 http://localhost:3333
pnpm build        # 生产构建到 dist/
pnpm preview      # 预览构建产物
pnpm lint         # ESLint 检查
pnpm typecheck    # TypeScript 类型检查
```

## 核心架构

### 内容驱动路由

网站路由和导航由 `public/site/` 的目录结构自动生成，不是传统的文件系统路由：

```
public/site/                     → URL: /
├── index.json                   → {"template":"home-hero","title":"首页"}
├── public/                      → 当前页面的静态资源（图片1.svg, 图片2.svg...）
└── dictionary/                  → 子页面
    └── 公司介绍/                → URL: /公司介绍
        ├── index.json
        ├── public/
        └── dictionary/
            └── 经销商/          → URL: /公司介绍/经销商
```

**标准页面文件夹**包含三部分：`index.json`（选模板+标题）、`public/`（资源文件）、`dictionary/`（子页面）。

### 请求处理流程

1. 所有 URL 被 `src/pages/[...path].vue`（catch-all 路由）捕获
2. `useSiteTree()` 从 `/site/manifest.json` 加载站点树，通过 `findPage(urlPath)` 查找匹配节点
3. `resolveTemplate(node.template)` 从 `src/index/registry.ts` 动态解析 Vue 组件
4. `useContent(contentPath)` 提供 `asset(filename)` 函数构建资源 URL
5. 模板组件接收 `page`（SiteNode）和 `asset`（函数）两个 props 进行渲染

### manifest.json 自动生成

`vite.config.ts` 中的 `SiteManifestPlugin` 自定义插件：
- **开发模式**：拦截 `/site/manifest.json` 请求，实时扫描目录生成
- **构建模式**：`buildStart` 钩子写入 `public/site/manifest.json`

### 模板系统（src/index/）

`registry.ts` 使用 `import.meta.glob('./*.vue', { eager: true })` 自动扫描注册。放入 `src/index/` 的 `.vue` 文件自动可用，注册名为 kebab-case（如 `HomeHero.vue` → `home-hero`）。

模板组件的 props 契约：
```typescript
defineProps<{
  page: SiteNode                          // 页面节点（title, path, children 等）
  asset: (filename: string) => string     // 资源 URL 构建函数
}>()
```

资源通过统一命名访问：`asset('图片1.svg')` → `/site/dictionary/xxx/public/图片1.svg`

### 关键 composables

- **useSiteTree()**：全局单例，管理站点树。`loadTree()` 加载 manifest，`findPage()` 递归搜索，`navItems` 计算一级导航
- **useContent(contentPath)**：返回 `asset(filename)` 函数，基于页面的 `contentPath` 拼接资源路径

### 自动导入

通过 unplugin 生态实现零 import 开发：
- Vue API（ref, computed, onMounted 等）、VueUse、Vue Router 自动导入
- `src/composables/` 和 `src/stores/` 下的导出自动导入
- `src/components/` 下的组件自动注册

### 模块自动加载

`src/modules/*.ts` 导出 `install(ctx: AppContext)` 的文件在 `main.ts` 中自动加载。当前模块：nprogress（路由加载条）、pinia（状态管理）。

## 添加新模板

在 `src/index/` 下创建 `.vue` 文件，接收 `page` 和 `asset` props 即可，无需手动注册。

## 添加新页面

在 `public/site/` 任意层级的 `dictionary/` 下创建标准页面文件夹（含 `index.json`、`public/`、`dictionary/`），开发模式自动生效，构建模式自动写入 manifest。

## 技术栈版本

Vue 3.5、Vue Router 5、Vite 7.3、Pinia 3、UnoCSS 66、TypeScript 5.8。依赖版本通过 `pnpm-workspace.yaml` 的 catalog 机制集中管理。
