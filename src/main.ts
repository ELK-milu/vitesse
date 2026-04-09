import type { UserModule } from './types'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import App from './App.vue'

import '@unocss/reset/tailwind.css'
import './styles/main.css'
import 'uno.css'

const app = createApp(App)

// 路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts([...routes]),
})
app.use(router)

// Pinia
app.use(createPinia())

// 自动加载 modules/ 下的插件
Object.values(
  import.meta.glob<{ install: UserModule }>('./modules/*.ts', { eager: true }),
).forEach(mod => mod.install?.({ app, router }))

app.mount('#app')
