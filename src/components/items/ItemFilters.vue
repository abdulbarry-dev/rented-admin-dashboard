<script setup lang="ts">
import { ref } from 'vue'
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/vue/24/outline'

export interface ItemFilters {
  search: string
  category: string
  status: string
  listingType: string
  priceMin: string
  priceMax: string
  dateFrom: string
  dateTo: string
  featured: string
}

interface Props {
  modelValue: ItemFilters
  totalResults?: number
}

interface Emits {
  (e: 'update:modelValue', value: ItemFilters): void
  (e: 'clear'): void
}

const props = withDefaults(defineProps<Props>(), {
  totalResults: 0
})

const emit = defineEmits<Emits>()

const showAdvanced = ref(false)

const updateFilter = (key: keyof ItemFilters, value: string) => {
  emit('update:modelValue', { ...props.modelValue, [key]: value })
}

const clearFilters = () => {
  emit('clear')
  showAdvanced.value = false
}

const hasActiveFilters = () => {
  const { search, category, status, listingType, priceMin, priceMax, dateFrom, dateTo, featured } = props.modelValue
  return search || category || status || listingType || priceMin || priceMax || dateFrom || dateTo || featured
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
    <!-- Search Bar -->
    <div class="flex flex-col sm:flex-row gap-4 mb-4">
      <div class="flex-1 relative">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
        <input
          type="text"
          :value="modelValue.search"
          @input="updateFilter('search', ($event.target as HTMLInputElement).value)"
          placeholder="Search items by title, description, seller, or ID..."
          class="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-transparent"
        />
      </div>
      <button
        @click="showAdvanced = !showAdvanced"
        class="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors duration-200 flex items-center gap-2"
      >
        <FunnelIcon class="w-5 h-5" />
        <span class="hidden sm:inline">Filters</span>
        <span v-if="hasActiveFilters()" class="ml-1 px-2 py-0.5 bg-blue-600 dark:bg-blue-500 text-white text-xs rounded-full">
          Active
        </span>
      </button>
    </div>

    <!-- Advanced Filters -->
    <transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="showAdvanced" class="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <!-- First Row: Dropdowns -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Category -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Category
            </label>
            <select
              :value="modelValue.category"
              @change="updateFilter('category', ($event.target as HTMLSelectElement).value)"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="furniture">Furniture</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="sports & outdoors">Sports & Outdoors</option>
              <option value="home">Home & Garden</option>
              <option value="toys & games">Toys & Games</option>
              <option value="automotive">Automotive</option>
              <option value="music">Music</option>
            </select>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Status
            </label>
            <select
              :value="modelValue.status"
              @change="updateFilter('status', ($event.target as HTMLSelectElement).value)"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="sold">Sold</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <!-- Listing Type -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Listing Type
            </label>
            <select
              :value="modelValue.listingType"
              @change="updateFilter('listingType', ($event.target as HTMLSelectElement).value)"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            >
              <option value="">All Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
              <option value="both">Both</option>
            </select>
          </div>

          <!-- Featured -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Featured
            </label>
            <select
              :value="modelValue.featured"
              @change="updateFilter('featured', ($event.target as HTMLSelectElement).value)"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            >
              <option value="">All Items</option>
              <option value="true">Featured Only</option>
              <option value="false">Non-Featured</option>
            </select>
          </div>
        </div>

        <!-- Second Row: Price Range and Dates -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Min Price -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Min Price
            </label>
            <input
              :value="modelValue.priceMin"
              @input="updateFilter('priceMin', ($event.target as HTMLInputElement).value)"
              type="number"
              placeholder="$0"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>

          <!-- Max Price -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Max Price
            </label>
            <input
              :value="modelValue.priceMax"
              @input="updateFilter('priceMax', ($event.target as HTMLInputElement).value)"
              type="number"
              placeholder="$10,000"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>

          <!-- Date From -->
          <div>
            <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Date From
            </label>
            <input
              :value="modelValue.dateFrom"
              @input="updateFilter('dateFrom', ($event.target as HTMLInputElement).value)"
              type="date"
              class="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
            />
          </div>

          <!-- Clear Button -->
          <div class="flex items-end">
            <button
              v-if="hasActiveFilters()"
              @click="clearFilters"
              class="w-full px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <XMarkIcon class="w-5 h-5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Results Count -->
    <div v-if="totalResults > 0" class="mt-4 text-sm text-slate-600 dark:text-slate-400">
      Found {{ totalResults.toLocaleString() }} {{ totalResults === 1 ? 'item' : 'items' }}
    </div>
  </div>
</template>
