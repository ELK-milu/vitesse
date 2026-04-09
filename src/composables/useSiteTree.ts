import type { SiteNode } from '~/types'

// 全局单例：站点树数据
const siteTree = ref<SiteNode | null>(null)
const loading = ref(false)
const loaded = ref(false)

/**
 * 站点导航树 composable
 * - loadTree(): 从 /site/manifest.json 加载站点树（仅加载一次）
 * - findPage(urlPath): 根据 URL 路径查找对应的页面节点
 * - flatNavItems: 扁平化的一级导航列表
 */
export function useSiteTree() {
  async function loadTree() {
    if (loaded.value || loading.value)
      return
    loading.value = true
    try {
      const res = await fetch('/site/manifest.json')
      siteTree.value = await res.json()
      loaded.value = true
    }
    catch (err) {
      console.error('Failed to load site manifest:', err)
    }
    finally {
      loading.value = false
    }
  }

  /**
   * 根据 URL 路径找到对应的站点节点
   * "/" → 根节点
   * "/公司介绍" → 根节点 children 中 path 匹配的子节点
   * "/公司介绍/经销商" → 递归向下查找
   */
  function findPage(urlPath: string): SiteNode | null {
    if (!siteTree.value)
      return null

    const normalizedPath = urlPath === '' ? '/' : urlPath
    if (normalizedPath === '/')
      return siteTree.value

    // 递归搜索
    function search(node: SiteNode): SiteNode | null {
      if (node.path === normalizedPath)
        return node
      for (const child of node.children) {
        const found = search(child)
        if (found)
          return found
      }
      return null
    }

    return search(siteTree.value)
  }

  /**
   * 查找当前页面的面包屑路径
   */
  function findBreadcrumb(urlPath: string): SiteNode[] {
    if (!siteTree.value)
      return []

    const normalizedPath = urlPath === '' ? '/' : urlPath
    if (normalizedPath === '/')
      return [siteTree.value]

    const breadcrumb: SiteNode[] = [siteTree.value]
    const segments = normalizedPath.split('/').filter(Boolean)

    let currentChildren = siteTree.value.children
    let currentPath = ''

    for (const seg of segments) {
      currentPath += `/${seg}`
      const found = currentChildren.find(c => c.path === currentPath)
      if (!found)
        break
      breadcrumb.push(found)
      currentChildren = found.children
    }

    return breadcrumb
  }

  // 一级导航列表
  const navItems = computed(() => {
    if (!siteTree.value)
      return []
    return [
      { title: siteTree.value.title, path: siteTree.value.path },
      ...siteTree.value.children.map(c => ({ title: c.title, path: c.path })),
    ]
  })

  return {
    siteTree: readonly(siteTree),
    loading: readonly(loading),
    loaded: readonly(loaded),
    loadTree,
    findPage,
    findBreadcrumb,
    navItems,
  }
}
