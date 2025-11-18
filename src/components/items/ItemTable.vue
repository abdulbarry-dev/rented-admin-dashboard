<script setup lang="ts">
import { CheckBadgeIcon } from '@heroicons/vue/24/outline'
import type { Item } from './ItemCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

interface Props {
  items: Item[]
  loading?: boolean
  currentPage: number
  totalPages: number
}

interface Emits {
  (e: 'view', itemId: string | number): void
  (e: 'edit', itemId: string | number): void
  (e: 'approve', itemId: string | number): void
  (e: 'reject', itemId: string | number): void
  (e: 'page-change', page: number): void
  (e: 'select', itemId: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
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
    <div v-if="!loading && items.length > 0" class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
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
