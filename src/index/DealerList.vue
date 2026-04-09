<script setup lang="ts">
/**
 * 经销商/列表展示模板
 *
 * 预期资源文件（放在对应页面的 public/ 下）：
 * - 图片1.svg（或 .jpg/.png）→ 页面顶部图
 * - 图片2.svg ~ 图片N.svg  → 列表项图片（可选）
 */
import type { SiteNode } from '~/types'

const props = defineProps<{
  page: SiteNode
  asset: (filename: string) => string
}>()

const subPages = computed(() => props.page.children || [])
</script>

<template>
  <div class="dealer-list">
    <!-- 顶部 -->
    <section class="w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
      <img
        :src="asset('图片1.svg')"
        :alt="page.title"
        class="h-48 w-full object-cover md:h-64"
      >
    </section>

    <!-- 内容区 -->
    <section class="mx-auto max-w-5xl px-4 py-12">
      <h1 class="mb-8 text-center text-3xl font-bold text-gray-800 dark:text-gray-100">
        {{ page.title }}
      </h1>

      <p class="mb-8 text-center text-gray-500 dark:text-gray-400">
        请替换 public 文件夹中的图片来更新展示内容。
      </p>

      <!-- 图片网格展示 -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="i in 6"
          :key="i"
          class="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-700"
        >
          <img
            :src="asset(`图片${i + 1}.svg`)"
            :alt="`展示图片 ${i}`"
            class="h-48 w-full object-cover"
            @error="($event.target as HTMLImageElement).parentElement!.style.display = 'none'"
          >
          <div class="p-4">
            <h3 class="font-medium text-gray-800 dark:text-gray-200">
              项目 {{ i }}
            </h3>
          </div>
        </div>
      </div>
    </section>

    <!-- 子页面 -->
    <section v-if="subPages.length" class="mx-auto max-w-5xl border-t px-4 py-8 dark:border-gray-700">
      <div class="flex flex-wrap gap-3">
        <RouterLink
          v-for="child in subPages"
          :key="child.path"
          :to="child.path"
          class="rounded bg-gray-100 px-4 py-2 text-gray-700 transition hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
        >
          {{ child.title }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>
