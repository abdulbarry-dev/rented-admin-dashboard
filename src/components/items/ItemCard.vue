<script setup lang="ts">
import {
  CheckBadgeIcon,
  EyeIcon,
  HeartIcon,
  MapPinIcon
} from '@heroicons/vue/24/outline'

export interface Item {
  id: number | string
  title: string
  description?: string
  price: number
  category: string
  status: 'active' | 'pending' | 'sold' | 'rented' | 'rejected'
  listingType: 'sale' | 'rent' | 'both'
  seller: {
    name: string
    verified?: boolean
  }
  location?: string
  image?: string
  views?: number
  saves?: number
  createdAt: string
  featured?: boolean
}

interface Props {
  item: Item
  compact?: boolean
}

interface Emits {
  (e: 'view', itemId: string | number): void
  (e: 'edit', itemId: string | number): void
  (e: 'approve', itemId: string | number): void
  (e: 'reject', itemId: string | number): void
  (e: 'delete', itemId: string | number): void
  (e: 'select', itemId: string | number): void
}

withDefaults(defineProps<Props>(), {
  compact: false
})

const emit = defineEmits<Emits>()

const getStatusColor = (status: string) => {
  const colors = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    sold: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    rented: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    rejected: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
  }
  return colors[status as keyof typeof colors] || colors.pending
}

const getListingTypeColor = (type: string) => {
  const colors = {
    sale: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
    rent: 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300',
    both: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300'
  }
  return colors[type as keyof typeof colors] || colors.sale
}

const itemInitials = (title: string) => {
  return title
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600">
    <!-- Item Image -->
    <div class="relative aspect-video bg-slate-100 dark:bg-slate-700 overflow-hidden group">
      <div
        v-if="item.image"
        class="w-full h-full"
      >
        <img :src="item.image" :alt="item.title" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
      </div>
      <div
        v-else
        class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-4xl"
      >
        {{ itemInitials(item.title) }}
      </div>

      <!-- Featured Badge -->
      <div
        v-if="item.featured"
        class="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"
      >
        <CheckBadgeIcon class="w-3 h-3" />
        Featured
      </div>

      <!-- Status Badge -->
      <div class="absolute top-2 right-2">
        <span
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
          :class="getStatusColor(item.status)"
        >
          {{ item.status }}
        </span>
      </div>

      <!-- Listing Type Badge -->
      <div class="absolute bottom-2 left-2">
        <span
          class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm"
          :class="getListingTypeColor(item.listingType)"
        >
          {{ item.listingType }}
        </span>
      </div>
    </div>

    <!-- Item Info -->
    <div class="p-4">
      <!-- Title and Price -->
      <div class="mb-3">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-1 line-clamp-1">
          {{ item.title }}
        </h3>
        <div class="flex items-center justify-between">
          <span class="text-xl font-bold text-blue-600 dark:text-blue-400">
            ${{ item.price.toLocaleString() }}
          </span>
          <span class="text-sm text-slate-500 dark:text-slate-400">
            {{ item.category }}
          </span>
        </div>
      </div>

      <!-- Description -->
      <p v-if="item.description" class="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
        {{ item.description }}
      </p>

      <!-- Seller and Location -->
      <div class="flex items-center justify-between mb-3 pb-3 border-b border-slate-200 dark:border-slate-700">
        <div class="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
          <span>{{ item.seller.name }}</span>
          <CheckBadgeIcon
            v-if="item.seller.verified"
            class="w-4 h-4 text-blue-600 dark:text-blue-400"
          />
        </div>
        <div v-if="item.location" class="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
          <MapPinIcon class="w-3 h-3" />
          <span>{{ item.location }}</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="flex items-center gap-4 mb-3 text-xs text-slate-500 dark:text-slate-500">
        <div class="flex items-center gap-1">
          <EyeIcon class="w-4 h-4" />
          <span>{{ item.views || 0 }}</span>
        </div>
        <div class="flex items-center gap-1">
          <HeartIcon class="w-4 h-4" />
          <span>{{ item.saves || 0 }}</span>
        </div>
        <span class="ml-auto">{{ item.createdAt }}</span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2">
        <button
          @click="emit('view', item.id)"
          class="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          View
        </button>
        <button
          v-if="item.status === 'pending'"
          @click="emit('approve', item.id)"
          class="px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          Approve
        </button>
        <button
          @click="emit('edit', item.id)"
          class="px-3 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition-colors duration-200 text-sm font-medium"
        >
          Edit
        </button>
      </div>
    </div>
  </div>
</template>
