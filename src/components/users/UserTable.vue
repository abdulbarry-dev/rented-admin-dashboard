<script setup lang="ts">
import { CheckBadgeIcon } from '@heroicons/vue/24/outline'
import type { User } from './UserCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

interface Props {
  users: User[]
  loading?: boolean
  currentPage: number
  totalPages: number
}

interface Emits {
  (e: 'view', userId: string | number): void
  (e: 'edit', userId: string | number): void
  (e: 'suspend', userId: string | number): void
  (e: 'page-change', page: number): void
  (e: 'select', userId: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const getRoleVariant = (role: string): 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'default' => {
  const roleMap: Record<string, 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'default'> = {
    super_admin: 'danger',
    admin: 'info',
    vendor: 'primary',
    customer: 'default',
    support_agent: 'success'
  }
  return roleMap[role] || 'default'
}

const getStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' => {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    active: 'success',
    inactive: 'default',
    suspended: 'danger',
    pending: 'warning'
  }
  return statusMap[status] || 'default'
}

const getPageNumbers = () => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  const end = Math.min(props.totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
    <!-- Loading State -->
    <div v-if="loading" class="p-12">
      <SkeletonLoader variant="table" :count="12" />
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <input type="checkbox" class="rounded border-slate-300 dark:border-slate-600" />
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              User
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Role
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Status
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Join Date
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <tr
            v-for="user in users"
            :key="user.id"
            class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
          >
            <!-- Checkbox -->
            <td class="px-6 py-4 whitespace-nowrap">
              <input
                type="checkbox"
                @change="emit('select', user.id)"
                class="rounded border-slate-300 dark:border-slate-600"
              />
            </td>

            <!-- User Info -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center gap-3">
                <div
                  v-if="user.avatar"
                  class="w-10 h-10 rounded-full overflow-hidden"
                >
                  <img :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
                </div>
                <div
                  v-else
                  class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm"
                >
                  {{ user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) }}
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <div class="font-medium text-slate-900 dark:text-white truncate">
                      {{ user.name }}
                    </div>
                    <CheckBadgeIcon
                      v-if="user.verified"
                      class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0"
                    />
                  </div>
                  <div class="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {{ user.email }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Role -->
            <td class="px-6 py-4 whitespace-nowrap">
              <BaseBadge :variant="getRoleVariant(user.role)" size="sm">
                {{ user.role.replace('_', ' ') }}
              </BaseBadge>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
              <BaseBadge :variant="getStatusVariant(user.status)" size="sm">
                {{ user.status }}
              </BaseBadge>
            </td>

            <!-- Join Date -->
            <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
              {{ user.joinDate }}
            </td>

            <!-- Actions -->
            <td class="px-6 py-4 whitespace-nowrap text-sm">
              <div class="flex items-center gap-2">
                <BaseButton
                  variant="primary"
                  size="xs"
                  @click="emit('view', user.id)"
                >
                  View
                </BaseButton>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && users.length === 0" class="p-12 text-center">
      <div class="text-slate-400 dark:text-slate-500 mb-2">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-1">No users found</h3>
      <p class="text-slate-600 dark:text-slate-400">Try adjusting your search or filters</p>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && users.length > 0" class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
      <div class="text-sm text-slate-600 dark:text-slate-400">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <div class="flex items-center gap-2">
        <BaseButton
          variant="outline"
          size="sm"
          @click="emit('page-change', currentPage - 1)"
          :disabled="currentPage === 1"
        >
          Previous
        </BaseButton>
        <button
          v-for="page in getPageNumbers()"
          :key="page"
          @click="emit('page-change', page)"
          class="px-3 py-1 rounded-lg text-sm font-medium transition-colors duration-200"
          :class="{
            'bg-blue-600 dark:bg-blue-500 text-white': page === currentPage,
            'border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700': page !== currentPage
          }"
        >
          {{ page }}
        </button>
        <BaseButton
          variant="outline"
          size="sm"
          @click="emit('page-change', currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          Next
        </BaseButton>
      </div>
    </div>
  </div>
</template>
