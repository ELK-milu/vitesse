import type { Component } from 'vue'

/**
 * 模板注册表
 *
 * 自动扫描 src/index/ 下所有 .vue 文件并注册为模板。
 * 注册名称规则：
 *   - 文件名原样注册（如 "HomeHero"）
 *   - 同时注册 kebab-case 版本（如 "home-hero"）
 *
 * 在 public/site/xxx/index.json 中通过 "template" 字段引用：
 *   { "template": "home-hero", "title": "首页" }
 */
const templates: Record<string, Component> = {}

// 自动扫描注册 src/index/ 下的所有 .vue 文件
const modules = import.meta.glob<{ default: Component }>('./*.vue', { eager: true })
for (const [filePath, module] of Object.entries(modules)) {
  const name = filePath.replace('./', '').replace('.vue', '')
  // kebab-case 版本
  const kebabName = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
  templates[name] = module.default
  templates[kebabName] = module.default
}

/**
 * 根据模板名称解析对应的 Vue 组件
 */
export function resolveTemplate(name: string): Component | null {
  return templates[name] || null
}

/**
 * 获取所有已注册的模板名称
 */
export function getTemplateNames(): string[] {
  // 只返回 kebab-case 的名称，避免重复
  return [...new Set(Object.keys(templates).filter(k => k.includes('-') || !Object.keys(templates).includes(k.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase())))]
}
