<script setup lang="ts">
useHead({
  title: '模板网站',
  meta: [
    { name: 'description', content: '基于 Vue 3 的模板化热更新网站' },
  ],
})
</script>

<template>
  <RouterView />
</template>
