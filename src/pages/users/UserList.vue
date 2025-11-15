<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'vendor' | 'customer'
  status: 'active' | 'inactive'
  joinDate: string
}

const users = ref<User[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', joinDate: '2024-10-15' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'vendor', status: 'active', joinDate: '2024-09-20' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active', joinDate: '2024-01-01' },
])
</script>

<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Users</h1>
        <p class="mt-1" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Manage marketplace users</p>
      </div>
    </div>

    <!-- Users Table -->
    <div class="rounded-lg shadow overflow-hidden" :class="themeStore.isDark ? 'bg-slate-800' : 'bg-white'">
      <table class="min-w-full divide-y" :class="themeStore.isDark ? 'divide-slate-700' : 'divide-slate-200'">
        <thead :class="themeStore.isDark ? 'bg-slate-900' : 'bg-slate-50'">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-500'">Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-500'">Email</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-500'">Role</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-500'">Status</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-500'">Join Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-500'">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y" :class="[themeStore.isDark ? 'bg-slate-800 divide-slate-700' : 'bg-white divide-slate-200']">
          <tr v-for="user in users" :key="user.id">
            <td class="px-6 py-4 text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">{{ user.name }}</td>
            <td class="px-6 py-4 text-sm" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-600'">{{ user.email }}</td>
            <td class="px-6 py-4 text-sm">
              <span :class="{
                'bg-purple-100 text-purple-800': user.role === 'admin',
                'bg-blue-100 text-blue-800': user.role === 'vendor',
                'bg-slate-100 text-slate-800': user.role === 'customer'
              }" class="px-2 py-1 rounded-full text-xs font-semibold">
                {{ user.role }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm">
              <span :class="{
                'bg-green-100 text-green-800': user.status === 'active',
                'bg-red-100 text-red-800': user.status === 'inactive'
              }" class="px-2 py-1 rounded-full text-xs font-semibold">
                {{ user.status }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-600'">{{ user.joinDate }}</td>
            <td class="px-6 py-4 text-sm">
              <button :class="themeStore.isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'" class="mr-3">Edit</button>
              <button :class="themeStore.isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
