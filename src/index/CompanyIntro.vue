<script setup lang="ts">
/**
 * 公司介绍模板
 *
 * 预期资源文件（放在对应页面的 public/ 下）：
 * - 图片1.svg（或 .jpg/.png）→ 公司主图 / Banner
 * - 图片2.svg（或 .jpg/.png）→ 补充图片（可选）
 */
import type { SiteNode } from '~/types'

const props = defineProps<{
  page: SiteNode
  asset: (filename: string) => string
}>()

const subPages = computed(() => props.page.children || [])
</script>

<template>
  <div class="company-intro">
    <!-- 顶部图片 -->
    <section class="w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
      <img
        :src="asset('图片1.svg')"
        :alt="page.title"
        class="h-64 w-full object-cover md:h-80"
      >
    </section>

    <!-- 内容区 -->
    <section class="mx-auto max-w-4xl px-4 py-12">
      <h1 class="mb-8 text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
        {{ page.title }}
      </h1>

      <div class="flex flex-col items-start gap-8 md:flex-row">
        <div class="flex-1">
          <p class="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            欢迎了解我们。请替换此处内容和 public 文件夹中的图片来展示您的公司信息。
          </p>
        </div>
        <div class="w-full md:w-80">
          <img
            :src="asset('图片2.svg')"
            alt="公司图片"
            class="w-full rounded-lg"
            @error="($event.target as HTMLImageElement).style.display = 'none'"
          >
        </div>
      </div>
    </section>

    <!-- 子页面链接 -->
    <section v-if="subPages.length" class="mx-auto max-w-4xl border-t px-4 py-8 dark:border-gray-700">
      <h2 class="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
        了解更多
      </h2>
      <div class="flex flex-wrap gap-3">
        <RouterLink
          v-for="child in subPages"
          :key="child.path"
          :to="child.path"
          class="rounded-full bg-teal-50 px-4 py-2 text-teal-700 transition hover:bg-teal-100 dark:bg-teal-900 dark:text-teal-200"
        >
          {{ child.title }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>
