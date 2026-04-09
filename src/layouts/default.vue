<template>
  <div class="min-h-screen flex flex-col">
    <SiteNav />
    <main class="flex-1">
      <RouterView />
    </main>
    <footer class="border-t bg-gray-50 py-6 text-center text-sm text-gray-400 dark:border-gray-700 dark:bg-gray-900">
      <p>&copy; {{ new Date().getFullYear() }} 模板网站 · 修改 public/site/ 下的文件即可更新内容</p>
    </footer>
  </div>
</template>
