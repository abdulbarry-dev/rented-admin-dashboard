<script setup lang="ts">
import { useRouter } from 'vue-router'
import { UserCircleIcon, ShieldCheckIcon, BellIcon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '@/stores/theme'

const router = useRouter()
const themeStore = useThemeStore()

const settingsCategories = [
  {
    title: 'Profile & Account',
    description: 'Manage your personal information, password, and account preferences',
    icon: UserCircleIcon,
    path: '/settings/profile',
    color: 'blue'
  },
  {
    title: 'Roles & Permissions',
    description: 'Configure user roles, permissions, and access control settings',
    icon: ShieldCheckIcon,
    path: '/settings/roles',
    color: 'purple'
  },
  {
    title: 'Notification Settings',
    description: 'Customize your notification preferences for email, push, and in-app alerts',
    icon: BellIcon,
    path: '/settings/notifications',
    color: 'green'
  }
]

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Settings</h1>
      <p class="mt-2" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">
        Manage your account settings and preferences
      </p>
    </div>

    <!-- Settings Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <button
        v-for="category in settingsCategories"
        :key="category.path"
        @click="navigateTo(category.path)"
        class="rounded-lg shadow-sm border p-6 text-left transition-all duration-200 hover:shadow-md group"
        :class="themeStore.isDark
          ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
          : 'bg-white border-slate-200 hover:border-slate-300'"
      >
        <div class="flex items-start gap-4">
          <div
            class="p-3 rounded-lg flex-shrink-0"
            :class="[
              category.color === 'blue'
                ? themeStore.isDark ? 'bg-blue-600/20' : 'bg-blue-50'
                : category.color === 'purple'
                ? themeStore.isDark ? 'bg-purple-600/20' : 'bg-purple-50'
                : themeStore.isDark ? 'bg-green-600/20' : 'bg-green-50'
            ]"
          >
            <component
              :is="category.icon"
              class="w-6 h-6"
              :class="[
                category.color === 'blue'
                  ? 'text-blue-600'
                  : category.color === 'purple'
                  ? 'text-purple-600'
                  : 'text-green-600'
              ]"
            />
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">
              {{ category.title }}
            </h3>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">
              {{ category.description }}
            </p>
          </div>

          <!-- Arrow Icon -->
          <svg
            class="w-5 h-5 flex-shrink-0 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
            :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-500'"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </div>
      </button>
    </div>

  </div>
</template>
