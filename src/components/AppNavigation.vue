<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  HomeIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  UsersIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/vue/24/outline'
import Notifications from './Notifications.vue'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const route = useRoute()
const themeStore = useThemeStore()
const sidebarOpen = ref(false)
const mobileMenuOpen = ref(false)

const menuItems = [
  { name: 'Dashboard', path: '/', icon: HomeIcon },
  { name: 'Products', path: '/products', icon: ShoppingBagIcon },
  { name: 'Orders', path: '/orders', icon: ShoppingCartIcon },
  { name: 'Users', path: '/users', icon: UsersIcon },
  { name: 'Settings', path: '/settings', icon: Cog6ToothIcon },
]

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleLogout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userRole')
  localStorage.removeItem('idVerified')
  router.push('/login')
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
}
</script>

<template>
  <div class="flex h-screen" :class="themeStore.isDark ? 'bg-slate-900' : 'bg-slate-50'">
    <!-- Mobile Overlay -->
    <transition name="fade">
      <div
        v-if="mobileMenuOpen"
        @click="closeMobileMenu"
        class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      ></div>
    </transition>

    <!-- Sidebar -->
    <aside
      :class="[
        sidebarOpen ? 'w-64' : 'w-20',
        themeStore.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      class="border-r transition-all duration-300 ease-in-out flex flex-col fixed lg:static inset-y-0 left-0 z-50 will-change-transform"
    >
      <!-- Logo & Toggle -->
      <div class="h-16 flex items-center justify-between px-6 border-b transition-all duration-300" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-200'">
        <transition name="fade-slide" mode="out-in">
          <h1 v-if="sidebarOpen" key="logo-text" class="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Marketplace
          </h1>
          <div v-else key="logo-icon" class="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg"></div>
        </transition>
        <div class="flex items-center gap-2">
          <!-- Close button for mobile -->
          <button
            @click="closeMobileMenu"
            :class="themeStore.isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'"
            class="p-2 rounded-lg transition-colors lg:hidden"
          >
            <XMarkIcon class="w-5 h-5" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'" />
          </button>
          <!-- Desktop toggle -->
          <button
            @click="toggleSidebar"
            :class="themeStore.isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'"
            class="p-2 rounded-lg transition-colors hidden lg:block"
          >
            <Bars3Icon v-if="!sidebarOpen" class="w-5 h-5" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'" />
            <XMarkIcon v-else class="w-5 h-5" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'" />
          </button>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <RouterLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          @click="closeMobileMenu"
          :class="[
            isActive(item.path)
              ? themeStore.isDark
                ? 'bg-blue-600/20 text-blue-400 border-l-4 border-blue-500'
                : 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 border-l-4 border-blue-600'
              : themeStore.isDark
                ? 'text-slate-300 hover:bg-slate-700 border-l-4 border-transparent'
                : 'text-slate-600 hover:bg-slate-50 border-l-4 border-transparent',
            sidebarOpen ? 'px-4' : 'px-3 justify-center'
          ]"
          class="flex items-center gap-3 py-3 rounded-lg transition-all duration-200 group"
        >
          <component
            :is="item.icon"
            :class="isActive(item.path)
              ? themeStore.isDark ? 'text-blue-400' : 'text-blue-600'
              : themeStore.isDark ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-600 group-hover:text-slate-900'"
            class="w-6 h-6 flex-shrink-0 transition-colors"
          />
          <transition name="fade-slide" mode="out-in">
            <span v-if="sidebarOpen" class="font-medium text-sm whitespace-nowrap">{{ item.name }}</span>
          </transition>
        </RouterLink>
      </nav>

      <!-- User Profile & Logout -->
      <div class="border-t p-4" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-200'">
        <div v-if="sidebarOpen" class="mb-3 px-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold truncate" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Admin User</p>
              <p class="text-xs truncate" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-500'">admin@example.com</p>
            </div>
          </div>
        </div>
        <button
          @click="handleLogout"
          :class="[
            sidebarOpen ? 'px-4 justify-start' : 'px-3 justify-center',
            themeStore.isDark ? 'hover:bg-red-900/30' : 'hover:bg-red-50'
          ]"
          class="w-full flex items-center gap-3 py-3 text-red-600 rounded-lg transition-colors group"
        >
          <ArrowLeftOnRectangleIcon class="w-6 h-6 flex-shrink-0" />
          <transition name="fade-slide" mode="out-in">
            <span v-if="sidebarOpen" class="font-medium text-sm whitespace-nowrap">Logout</span>
          </transition>
        </button>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Header -->
      <header class="h-16 border-b flex items-center justify-between px-4 sm:px-6" :class="themeStore.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
        <div class="flex items-center gap-3">
          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            :class="themeStore.isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'"
            class="p-2 rounded-lg transition-colors lg:hidden"
          >
            <Bars3Icon class="w-6 h-6" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'" />
          </button>

          <h2 class="text-lg sm:text-xl font-semibold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">
            {{ menuItems.find((item) => isActive(item.path))?.name || 'Dashboard' }}
          </h2>
        </div>
        <div class="flex items-center gap-2 sm:gap-4">
          <!-- Dark Mode Toggle -->
          <button
            @click="() => themeStore.toggleTheme()"
            :class="themeStore.isDark ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'"
            class="p-2 rounded-lg transition-colors"
            title="Toggle dark mode"
          >
            <SunIcon v-if="themeStore.isDark" class="w-5 h-5" />
            <MoonIcon v-else class="w-5 h-5" />
          </button>

          <!-- Notifications -->
          <Notifications />
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-4 sm:p-6" :class="themeStore.isDark ? 'bg-slate-900' : 'bg-slate-50'">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Overlay fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Fade-slide animation for text */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.2s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

/* Hardware acceleration for smooth animations */
aside {
  backface-visibility: hidden;
  transform: translateZ(0);
  -webkit-font-smoothing: antialiased;
}
</style>
