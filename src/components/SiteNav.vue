<script setup lang="ts">
/**
 * 站点导航栏
 * 自动从 manifest 生成顶部导航，支持嵌套层级
 */
const route = useRoute()
const { navItems, loaded, siteTree } = useSiteTree()

// 当前路径高亮
function isActive(path: string): boolean {
  if (path === '/')
    return route.path === '/'
  return route.path.startsWith(path)
}

// 获取子节点用于下拉菜单
function getChildren(path: string) {
  if (!siteTree.value || path === '/')
    return []
  const node = siteTree.value.children.find(c => c.path === path)
  return node?.children || []
}

// 下拉菜单状态
const openDropdown = ref<string | null>(null)

function toggleDropdown(path: string) {
  openDropdown.value = openDropdown.value === path ? null : path
}

function closeDropdowns() {
  openDropdown.value = null
}

// 移动端菜单
const mobileMenuOpen = ref(false)
</script>

<template>
  <nav v-if="loaded" class="sticky top-0 z-50 border-b bg-white/90 backdrop-blur dark:border-gray-700 dark:bg-gray-900/90">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
      <!-- Logo / 站点名称 -->
      <RouterLink
        to="/"
        class="text-lg font-bold text-gray-800 dark:text-gray-100"
        @click="closeDropdowns"
      >
        {{ siteTree?.title || '网站' }}
      </RouterLink>

      <!-- 桌面端导航 -->
      <div class="hidden items-center gap-1 md:flex">
        <template v-for="item in navItems" :key="item.path">
          <div class="relative">
            <RouterLink
              :to="item.path"
              class="rounded-md px-3 py-2 text-sm transition"
              :class="isActive(item.path)
                ? 'bg-teal-50 text-teal-700 dark:bg-teal-900 dark:text-teal-200'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'"
              @mouseenter="getChildren(item.path).length ? toggleDropdown(item.path) : null"
              @click="closeDropdowns"
            >
              {{ item.title }}
            </RouterLink>

            <!-- 下拉菜单 -->
            <div
              v-if="getChildren(item.path).length && openDropdown === item.path"
              class="absolute left-0 top-full mt-1 min-w-40 rounded-md bg-white py-1 shadow-lg dark:bg-gray-800"
              @mouseleave="closeDropdowns"
            >
              <RouterLink
                v-for="child in getChildren(item.path)"
                :key="child.path"
                :to="child.path"
                class="block px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                @click="closeDropdowns"
              >
                {{ child.title }}
              </RouterLink>
            </div>
          </div>
        </template>
      </div>

      <!-- 移动端菜单按钮 -->
      <button
        class="md:hidden"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <div v-if="!mobileMenuOpen" class="i-carbon-menu text-xl" />
        <div v-else class="i-carbon-close text-xl" />
      </button>
    </div>

    <!-- 移动端菜单 -->
    <div v-if="mobileMenuOpen" class="border-t px-4 pb-4 md:hidden dark:border-gray-700">
      <template v-for="item in navItems" :key="item.path">
        <RouterLink
          :to="item.path"
          class="block border-b px-2 py-3 text-gray-700 dark:border-gray-700 dark:text-gray-300"
          :class="isActive(item.path) ? 'text-teal-700 dark:text-teal-300' : ''"
          @click="mobileMenuOpen = false"
        >
          {{ item.title }}
        </RouterLink>
        <template v-if="getChildren(item.path).length">
          <RouterLink
            v-for="child in getChildren(item.path)"
            :key="child.path"
            :to="child.path"
            class="block py-2 pl-6 text-sm text-gray-500 dark:text-gray-400"
            @click="mobileMenuOpen = false"
          >
            {{ child.title }}
          </RouterLink>
        </template>
      </template>
    </div>
  </nav>
</template>
