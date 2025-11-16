<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AuthLayout from '@/layouts/AuthLayout.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

const route = useRoute()
const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

const layoutComponent = computed(() => {
  const layout = route.meta.layout || 'default'
  switch (layout) {
    case 'auth':
      return AuthLayout
    case 'blank':
      return BlankLayout
    default:
      return DefaultLayout
  }
})

</script>

<template>
  <div :class="{ dark: isDark }" class="app-root">
    <component :is="layoutComponent" />
  </div>
</template>

<style>
.app-root {
  min-height: 100vh;
  transition: background-color 0.3s ease, color 0.3s ease;
}
</style>
