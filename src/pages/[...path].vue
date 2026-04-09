<script setup lang="ts">
/**
 * 动态页面路由 - 捕获所有路径
 *
 * 根据 URL 路径从 manifest 中查找对应页面节点，
 * 然后动态渲染 index.json 指定的模板组件。
 */
import { resolveTemplate } from '~/index/registry'

const route = useRoute()
const { loadTree, findPage, loaded } = useSiteTree()

// 确保站点树已加载
onMounted(loadTree)

// 当前页面节点
const page = computed(() => {
  if (!loaded.value)
    return null
  // route.params.path 可能是 string[] 或 string
  const pathParam = route.params.path
  let urlPath = '/'
  if (pathParam) {
    if (Array.isArray(pathParam))
      urlPath = `/${pathParam.join('/')}`
    else
      urlPath = `/${pathParam}`
  }
  return findPage(urlPath)
})

// 内容资源路径
const contentPath = computed(() => page.value?.contentPath)
const { asset } = useContent(contentPath)

// 动态解析模板组件
const templateComponent = computed(() => {
  if (!page.value)
    return null
  return resolveTemplate(page.value.template)
})

// 页面标题
watchEffect(() => {
  if (page.value) {
    useHead({
      title: `${page.value.title} - 模板网站`,
    })
  }
})
</script>

<template>
  <div v-if="!loaded" class="flex items-center justify-center py-20">
    <div class="text-gray-400">
      加载中...
    </div>
  </div>

  <div v-else-if="templateComponent && page">
    <component :is="templateComponent" :page="page" :asset="asset" />
  </div>

  <div v-else class="flex flex-col items-center justify-center py-20">
    <h1 class="text-6xl font-bold text-gray-300">
      404
    </h1>
    <p class="mt-4 text-gray-500">
      页面不存在
    </p>
    <RouterLink to="/" class="btn mt-6">
      返回首页
    </RouterLink>
  </div>
</template>
