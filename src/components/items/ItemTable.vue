<script setup lang="ts">
import { CheckBadgeIcon } from '@heroicons/vue/24/outline'
import { VueAwesomePaginate } from 'vue-awesome-paginate'
import type { Item } from './ItemCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

interface Props {
  items: Item[]
  loading?: boolean
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

interface Emits {
  (e: 'view', itemId: string | number): void
  (e: 'edit', itemId: string | number): void
  (e: 'approve', itemId: string | number): void
  (e: 'reject', itemId: string | number): void
  (e: 'page-change', page: number): void
  (e: 'items-per-page-change', value: number): void
  (e: 'select', itemId: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  totalItems: 0,
  itemsPerPage: 12
})

const emit = defineEmits<Emits>()

const getStatusVariant = (status: string): 'success' | 'warning' | 'info' | 'danger' | 'default' => {
  const statusMap: Record<string, 'success' | 'warning' | 'info' | 'danger' | 'default'> = {
    active: 'success',
    pending: 'warning',
    sold: 'info',
    rejected: 'danger'
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

    <!-- Desktop Table -->
    <div v-if="!loading" class="hidden lg:block overflow-x-auto">
      <table class="w-full">
        <thead class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
          <tr>
            <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider w-12">
              <input type="checkbox" class="rounded border-slate-300 dark:border-slate-600" />
            </th>
            <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Item
            </th>
            <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Seller
            </th>
            <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Price
            </th>
            <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Category
            </th>
            <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Status
            </th>
            <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider hidden xl:table-cell">
              Views
            </th>
            <th class="px-3 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
          <tr
            v-for="item in items"
            :key="item.id"
            class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
          >
            <!-- Checkbox -->
            <td class="px-3 py-3 whitespace-nowrap w-12">
              <input
                type="checkbox"
                @change="emit('select', item.id)"
                class="rounded border-slate-300 dark:border-slate-600"
              />
            </td>

            <!-- Item Info -->
            <td class="px-3 py-3">
              <div class="flex items-center gap-2">
                <div class="min-w-0 max-w-[200px]">
                  <div class="font-medium text-sm text-slate-900 dark:text-white truncate">
                    {{ item.title }}
                  </div>
                  <div class="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {{ item.location }}
                  </div>
                </div>
              </div>
            </td>

            <!-- Seller -->
            <td class="px-3 py-3">
              <div class="flex items-center gap-1 max-w-[150px]">
                <span class="text-sm text-slate-700 dark:text-slate-300 truncate">
                  {{ item.seller.name }}
                </span>
                <CheckBadgeIcon
                  v-if="item.seller.verified"
                  class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                />
              </div>
            </td>

            <!-- Price -->
            <td class="px-3 py-3 whitespace-nowrap text-sm font-semibold text-slate-900 dark:text-white">
              ${{ item.price.toLocaleString() }}
            </td>

            <!-- Category -->
            <td class="px-3 py-3 whitespace-nowrap">
              <BaseBadge variant="default" size="sm">
                {{ item.category }}
              </BaseBadge>
            </td>

            <!-- Status -->
            <td class="px-3 py-3 whitespace-nowrap">
              <BaseBadge :variant="getStatusVariant(item.status)" size="sm">
                {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
              </BaseBadge>
            </td>

            <!-- Views -->
            <td class="px-3 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400 hidden xl:table-cell">
              {{ item.views?.toLocaleString() || 0 }}
            </td>

            <!-- Actions -->
            <td class="px-3 py-3 whitespace-nowrap">
              <BaseButton
                variant="primary"
                size="xs"
                @click="emit('view', item.id)"
              >
                View
              </BaseButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Tablet Card View -->
    <div v-if="!loading" class="hidden md:block lg:hidden divide-y divide-slate-200 dark:divide-slate-700">
      <div
        v-for="item in items"
        :key="item.id"
        class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
      >
        <div class="flex items-start gap-3 mb-3">
          <input
            type="checkbox"
            @change="emit('select', item.id)"
            class="mt-1 rounded border-slate-300 dark:border-slate-600"
          />
          <div class="w-14 h-14 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg flex-shrink-0"></div>
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-slate-900 dark:text-white mb-1">
              {{ item.title }}
            </h3>
            <div class="flex items-center gap-1.5 mb-1">
              <span class="text-sm text-slate-600 dark:text-slate-400">
                {{ item.seller.name }}
              </span>
              <CheckBadgeIcon
                v-if="item.seller.verified"
                class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0"
              />
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ item.location }}
            </p>
          </div>
          <div class="text-right">
            <div class="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              ${{ item.price.toLocaleString() }}
            </div>
            <BaseButton
              variant="primary"
              size="xs"
              @click="emit('view', item.id)"
            >
              View
            </BaseButton>
          </div>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <BaseBadge variant="default" size="sm">
            {{ item.category }}
          </BaseBadge>
          <BaseBadge :variant="getStatusVariant(item.status)" size="sm">
            {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
          </BaseBadge>
          <span class="text-xs text-slate-500 dark:text-slate-400 ml-auto">
            {{ item.views?.toLocaleString() || 0 }} views
          </span>
        </div>
      </div>
    </div>

    <!-- Mobile Card View -->
    <div v-if="!loading" class="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
      <div
        v-for="item in items"
        :key="item.id"
        class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
      >
        <div class="flex items-start gap-3 mb-3">
          <input
            type="checkbox"
            @change="emit('select', item.id)"
            class="mt-1 rounded border-slate-300 dark:border-slate-600"
          />
          <div class="flex-1 min-w-0">
            <h3 class="font-medium text-slate-900 dark:text-white mb-1">
              {{ item.title }}
            </h3>
            <div class="flex items-center gap-1.5 mb-1">
              <span class="text-sm text-slate-600 dark:text-slate-400">
                {{ item.seller.name }}
              </span>
              <CheckBadgeIcon
                v-if="item.seller.verified"
                class="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0"
              />
            </div>
            <p class="text-sm text-slate-500 dark:text-slate-400">
              {{ item.location }}
            </p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <span class="text-xs text-slate-500 dark:text-slate-400 block mb-1">Price</span>
            <span class="text-sm font-semibold text-slate-900 dark:text-white">
              ${{ item.price.toLocaleString() }}
            </span>
          </div>
          <div>
            <span class="text-xs text-slate-500 dark:text-slate-400 block mb-1">Views</span>
            <span class="text-sm text-slate-700 dark:text-slate-300">
              {{ item.views?.toLocaleString() || 0 }}
            </span>
          </div>
          <div>
            <span class="text-xs text-slate-500 dark:text-slate-400 block mb-1">Category</span>
            <BaseBadge variant="default" size="sm">
              {{ item.category }}
            </BaseBadge>
          </div>
          <div>
            <span class="text-xs text-slate-500 dark:text-slate-400 block mb-1">Status</span>
            <BaseBadge :variant="getStatusVariant(item.status)" size="sm">
              {{ item.status.charAt(0).toUpperCase() + item.status.slice(1) }}
            </BaseBadge>
          </div>
        </div>

        <div class="flex gap-2">
          <BaseButton
            variant="primary"
            size="sm"
            full-width
            @click="emit('view', item.id)"
          >
            View Details
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && items.length === 0" class="p-12 text-center">
      <div class="text-slate-400 dark:text-slate-500 mb-2">
        <svg class="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-slate-900 dark:text-white mb-1">No items found</h3>
      <p class="text-slate-600 dark:text-slate-400">Try adjusting your search or filters</p>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && items.length > 0 && totalItems > itemsPerPage" class="pagination">
      <div class="pagination-info">
        <span>
          Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }}
          to {{ Math.min(currentPage * itemsPerPage, totalItems) }}
          of {{ totalItems }} results
        </span>
      </div>
      <vue-awesome-paginate
        :total-items="totalItems"
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
          <option :value="12">12 per page</option>
          <option :value="24">24 per page</option>
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
