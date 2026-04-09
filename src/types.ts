import type { App } from 'vue'
import type { Router } from 'vue-router'

export interface AppContext {
  app: App
  router: Router
}

export type UserModule = (ctx: AppContext) => void

export interface SiteNode {
  title: string
  template: string
  path: string
  contentPath: string
  children: SiteNode[]
}
