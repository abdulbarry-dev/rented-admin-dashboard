<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppNavigation from '@/components/AppNavigation.vue'

const route = useRoute()
const showNavigation = computed(() => {
  const authRoutes = ['/login', '/register', '/forget-password', '/reset-password', '/confirm-account', '/upload-id']
  return !authRoutes.includes(route.path)
})
</script>

<template>
  <div class="h-screen overflow-hidden">
    <AppNavigation v-if="showNavigation">
      <RouterView />
    </AppNavigation>
    <RouterView v-else />
  </div>
</template>
