<script setup lang="ts">
import { CheckBadgeIcon } from '@heroicons/vue/24/outline'
import { VueAwesomePaginate } from 'vue-awesome-paginate'
import type { User } from './UserCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

interface Props {
  users: User[]
  loading?: boolean
  currentPage: number
  totalPages: number
  totalUsers: number
  itemsPerPage: number
}

interface Emits {
  (e: 'view', userId: string | number): void
  (e: 'edit', userId: string | number): void
  (e: 'suspend', userId: string | number): void
  (e: 'page-change', page: number): void
  (e: 'items-per-page-change', value: number): void
  (e: 'select', userId: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  totalUsers: 0,
  itemsPerPage: 20
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
    <div v-if="!loading && users.length > 0 && totalUsers > itemsPerPage" class="pagination">
      <div class="pagination-info">
        <span>
          Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }}
          to {{ Math.min(currentPage * itemsPerPage, totalUsers) }}
          of {{ totalUsers }} results
        </span>
      </div>
      <vue-awesome-paginate
        :total-items="totalUsers"
        :items-per-page="itemsPerPage"
        :max-pages-shown="5"
        :model-value="currentPage"
        @update:model-value="emit('page-change', $event)"
      />
      <div class="pagination-actions">
        <select
          :value="itemsPerPage"
          @change="emit('items-per-page-change', Number(($event.target as HTMLSelectElement).value))"
          class="items-per-page"
        >
          <option :value="10">10 per page</option>
          <option :value="20">20 per page</option>
          <option :value="50">50 per page</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid rgb(226 232 240 / 1);
  gap: 1rem;
  flex-wrap: wrap;
}

:global(.dark) .pagination {
  border-color: rgb(51 65 85 / 1);
}

.pagination-info {
  font-size: 0.875rem;
  color: rgb(100 116 139 / 1);
  flex-shrink: 0;
}

:global(.dark) .pagination-info {
  color: rgb(148 163 184 / 1);
}

.pagination-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.items-per-page {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgb(226 232 240 / 1);
  background: rgb(248 250 252 / 1);
  color: rgb(15 23 42 / 1);
  font-size: 0.875rem;
  cursor: pointer;
}

:global(.dark) .items-per-page {
  border-color: rgb(51 65 85 / 1);
  background: rgb(15 23 42 / 1);
  color: rgb(248 250 252 / 1);
}

.items-per-page:focus {
  outline: none;
  border-color: rgb(59 130 246 / 1);
}

.pagination :deep(.pagination-container) {
  display: flex;
  column-gap: 0.5rem;
  align-items: center;
}

.pagination :deep(.paginate-buttons) {
  height: 36px;
  min-width: 36px;
  padding: 0 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: rgb(248 250 252 / 1);
  border: 1px solid rgb(226 232 240 / 1);
  color: rgb(15 23 42 / 1);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

:global(.dark) .pagination :deep(.paginate-buttons) {
  background-color: rgb(15 23 42 / 1);
  border-color: rgb(51 65 85 / 1);
  color: rgb(248 250 252 / 1);
}

.pagination :deep(.paginate-buttons:hover) {
  background-color: rgb(241 245 249 / 1);
  border-color: rgb(59 130 246 / 1);
}

:global(.dark) .pagination :deep(.paginate-buttons:hover) {
  background-color: rgb(30 41 59 / 1);
}

.pagination :deep(.active-page) {
  background-color: rgb(59 130 246 / 1) !important;
  border-color: rgb(59 130 246 / 1) !important;
  color: white !important;
}

.pagination :deep(.back-button),
.pagination :deep(.next-button) {
  background-color: rgb(248 250 252 / 1);
  border: 1px solid rgb(226 232 240 / 1);
  color: rgb(15 23 42 / 1);
  font-weight: 600;
  min-width: 80px;
}

:global(.dark) .pagination :deep(.back-button),
:global(.dark) .pagination :deep(.next-button) {
  background-color: rgb(15 23 42 / 1);
  border-color: rgb(51 65 85 / 1);
  color: rgb(248 250 252 / 1);
}

.pagination :deep(.back-button:hover),
.pagination :deep(.next-button:hover) {
  background-color: rgb(241 245 249 / 1);
  border-color: rgb(59 130 246 / 1);
}

:global(.dark) .pagination :deep(.back-button:hover),
:global(.dark) .pagination :deep(.next-button:hover) {
  background-color: rgb(30 41 59 / 1);
}

.pagination :deep(.back-button[disabled]),
.pagination :deep(.next-button[disabled]) {
  opacity: 0.4;
  cursor: not-allowed;
  background-color: rgb(241 245 249 / 1);
}

:global(.dark) .pagination :deep(.back-button[disabled]),
:global(.dark) .pagination :deep(.next-button[disabled]) {
  background-color: rgb(30 41 59 / 1);
}

.pagination :deep(.back-button[disabled]:hover),
.pagination :deep(.next-button[disabled]:hover) {
  background-color: rgb(241 245 249 / 1);
  border-color: rgb(226 232 240 / 1);
}

:global(.dark) .pagination :deep(.back-button[disabled]:hover),
:global(.dark) .pagination :deep(.next-button[disabled]:hover) {
  background-color: rgb(30 41 59 / 1);
  border-color: rgb(51 65 85 / 1);
}

.pagination :deep(.break-view) {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgb(100 116 139 / 1);
  font-size: 0.875rem;
  padding: 0 0.25rem;
}

:global(.dark) .pagination :deep(.break-view) {
  color: rgb(148 163 184 / 1);
}

@media (max-width: 768px) {
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }

  .pagination-info {
    order: 3;
    width: 100%;
    text-align: center;
  }

  .pagination :deep(.pagination-container) {
    order: 1;
    flex-wrap: wrap;
    justify-content: center;
  }

  .pagination-actions {
    order: 2;
    width: 100%;
    justify-content: center;
  }

  .items-per-page {
    width: 100%;
  }
}
</style>
