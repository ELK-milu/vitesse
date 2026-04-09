import type { Ref } from 'vue'

/**
 * 页面内容/资源 composable
 * - asset(filename): 返回当前页面 public/ 目录下的资源完整路径
 * - assetsBase: 当前页面的资源基础路径
 *
 * 使用方式：
 *   const { asset } = useContent(contentPath)
 *   <img :src="asset('图片1.jpg')" />
 */
export function useContent(contentPath: Ref<string | undefined>) {
  const assetsBase = computed(() => {
    if (!contentPath.value)
      return ''
    return `${contentPath.value}/public`
  })

  /**
   * 获取当前页面 public/ 下某个资源的完整 URL
   * @param filename 文件名，如 "图片1.jpg"
   */
  function asset(filename: string): string {
    return `${assetsBase.value}/${filename}`
  }

  return { assetsBase, asset }
}
