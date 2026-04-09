<script setup lang="ts">
/**
 * 首页 Hero 模板
 *
 * 预期资源文件（放在对应页面的 public/ 下）：
 * - 图片1.svg（或 .jpg/.png）→ Banner 主图
 * - 图片2.svg（或 .jpg/.png）→ 特色图片（可选）
 * - 图片3.svg（或 .jpg/.png）→ 特色图片（可选）
 */
import type { SiteNode } from '~/types'

const props = defineProps<{
  page: SiteNode
  asset: (filename: string) => string
}>()

const subPages = computed(() => props.page.children || [])
</script>

<template>
  <div class="home-hero">
    <!-- Banner 区域 -->
    <section class="relative w-full overflow-hidden bg-gray-100 dark:bg-gray-800" style="min-height: 400px;">
      <img
        :src="asset('图片1.svg')"
        :alt="page.title"
        class="h-full w-full object-cover"
        style="min-height: 400px; max-height: 60vh;"
      >
      <div class="absolute inset-0 flex items-center justify-center bg-black/30">
        <h1 class="text-4xl font-bold text-white md:text-6xl">
          {{ page.title }}
        </h1>
      </div>
    </section>

    <!-- 子页面导航卡片 -->
    <section v-if="subPages.length" class="mx-auto max-w-6xl px-4 py-12">
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="child in subPages"
          :key="child.path"
          :to="child.path"
          class="group block overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg dark:bg-gray-700"
        >
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-800 group-hover:text-teal-600 dark:text-gray-200">
              {{ child.title }}
            </h3>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
              点击查看详情 →
            </p>
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- 特色图片展示 -->
    <section class="mx-auto max-w-6xl px-4 py-8">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <img
          :src="asset('图片2.svg')"
          alt="特色图片"
          class="w-full rounded-lg object-cover"
          style="max-height: 300px;"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        >
        <img
          :src="asset('图片3.svg')"
          alt="特色图片"
          class="w-full rounded-lg object-cover"
          style="max-height: 300px;"
          @error="($event.target as HTMLImageElement).style.display = 'none'"
        >
      </div>
    </section>
  </div>
</template>
