import fs from 'node:fs'
import path from 'node:path'
import { unheadVueComposablesImports } from '@unhead/vue'
import Vue from '@vitejs/plugin-vue'
import Unocss from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueMacros from 'unplugin-vue-macros/vite'
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import Layouts from 'vite-plugin-vue-layouts'
import { VueRouterAutoImports } from 'vue-router/unplugin'
import VueRouter from 'vue-router/vite'

// ========================================
// Vite 插件：自动扫描 public/site/ 生成 manifest.json
// ========================================
interface SiteNode {
  title: string
  template: string
  path: string
  contentPath: string
  children: SiteNode[]
}

function SiteManifestPlugin(): Plugin {
  const publicDir = path.resolve(__dirname, 'public')

  function scanSiteTree(dir: string, urlPath: string = '/'): SiteNode {
    const indexJsonPath = path.join(dir, 'index.json')
    const dirName = path.basename(dir)
    let config = { template: 'default', title: dirName === 'site' ? '首页' : dirName }

    if (fs.existsSync(indexJsonPath)) {
      try {
        const raw = fs.readFileSync(indexJsonPath, 'utf-8')
        config = { ...config, ...JSON.parse(raw) }
      }
      catch {}
    }

    const contentPath = `/${path.relative(publicDir, dir).replace(/\\/g, '/')}`
    const dictDir = path.join(dir, 'dictionary')
    const children: SiteNode[] = []

    if (fs.existsSync(dictDir) && fs.statSync(dictDir).isDirectory()) {
      const entries = fs.readdirSync(dictDir, { withFileTypes: true })
      for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.')) {
          const childUrlPath = urlPath === '/'
            ? `/${entry.name}`
            : `${urlPath}/${entry.name}`
          children.push(scanSiteTree(path.join(dictDir, entry.name), childUrlPath))
        }
      }
    }

    return {
      title: config.title,
      template: config.template,
      path: urlPath,
      contentPath,
      children,
    }
  }

  return {
    name: 'site-manifest',

    // 开发模式：拦截请求，动态生成 manifest
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/site/manifest.json') {
          const siteDir = path.join(publicDir, 'site')
          if (fs.existsSync(siteDir)) {
            const tree = scanSiteTree(siteDir)
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify(tree, null, 2))
            return
          }
        }
        next()
      })
    },

    // 构建模式：写入 manifest.json 到 public/site/
    buildStart() {
      const siteDir = path.join(publicDir, 'site')
      if (fs.existsSync(siteDir)) {
        const tree = scanSiteTree(siteDir)
        fs.writeFileSync(
          path.join(siteDir, 'manifest.json'),
          JSON.stringify(tree, null, 2),
        )
      }
    },
  }
}

// ========================================
// Vite 主配置
// ========================================
export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(__dirname, 'src')}/`,
    },
  },

  plugins: [
    // 站点内容树 manifest 自动生成
    SiteManifestPlugin(),

    // 文件系统路由
    VueRouter({
      extensions: ['.vue'],
      dts: 'src/route-map.d.ts',
    }),

    VueMacros({
      plugins: {
        vue: Vue(),
      },
    }),

    // 布局系统
    Layouts(),

    // API 自动导入
    AutoImport({
      include: [/\.[jt]sx?$/, /\.vue$/, /\.vue\?vue/],
      imports: [
        'vue',
        '@vueuse/core',
        unheadVueComposablesImports,
        VueRouterAutoImports,
        {
          'vue-router/auto': ['useLink'],
        },
      ],
      dts: 'src/auto-imports.d.ts',
      dirs: [
        'src/composables',
        'src/stores',
      ],
      vueTemplate: true,
    }),

    // 组件自动导入
    Components({
      extensions: ['vue'],
      include: [/\.vue$/, /\.vue\?vue/],
      dts: 'src/components.d.ts',
    }),

    // UnoCSS
    Unocss(),

    // Vue DevTools
    VueDevTools(),
  ],
})
