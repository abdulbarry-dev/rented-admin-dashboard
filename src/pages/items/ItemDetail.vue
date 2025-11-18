<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { Item } from '@/components/items/ItemCard.vue'
import {
  ArrowLeftIcon,
  CheckBadgeIcon,
  MapPinIcon,
  EyeIcon,
  HeartIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import LineChart from '@/components/charts/LineChart.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'

const router = useRouter()
const route = useRoute()
const activeTab = ref<'overview' | 'performance' | 'timeline'>('overview')

// Mock items data (in production, this would be fetched from API)
const mockItems: Item[] = [
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    description: 'High-quality noise-canceling headphones with 30-hour battery life',
    price: 299,
    category: 'Electronics',
    status: 'active',
    listingType: 'sale',
    seller: { name: 'Tech Store', verified: true },
    location: 'New York, NY',
    image: '',
    views: 1245,
    saves: 89,
    createdAt: '2024-11-10',
    featured: true
  },
  {
    id: 2,
    title: 'Modern Office Chair',
    description: 'Ergonomic design with lumbar support and adjustable height',
    price: 450,
    category: 'Furniture',
    status: 'active',
    listingType: 'both',
    seller: { name: 'Office Furniture Co', verified: true },
    location: 'Los Angeles, CA',
    views: 876,
    saves: 54,
    createdAt: '2024-11-12',
    featured: false
  },
  {
    id: 3,
    title: 'Designer Leather Jacket',
    description: 'Genuine leather jacket in excellent condition, size M',
    price: 180,
    category: 'Clothing',
    status: 'pending',
    listingType: 'sale',
    seller: { name: 'Fashion Boutique', verified: false },
    location: 'Chicago, IL',
    views: 543,
    saves: 32,
    createdAt: '2024-11-14',
    featured: false
  },
  {
    id: 4,
    title: 'Mountain Bike - Trail Edition',
    description: 'Professional mountain bike with 21-speed gearing system',
    price: 650,
    category: 'Sports & Outdoors',
    status: 'active',
    listingType: 'rent',
    seller: { name: 'Bike Rental Pro', verified: true },
    location: 'Denver, CO',
    views: 2103,
    saves: 156,
    createdAt: '2024-11-08',
    featured: true
  },
  {
    id: 5,
    title: 'Vintage Camera Collection',
    description: 'Rare collection of vintage cameras from the 1960s-1980s',
    price: 1200,
    category: 'Electronics',
    status: 'active',
    listingType: 'sale',
    seller: { name: 'Antique Dealer', verified: true },
    location: 'Seattle, WA',
    views: 698,
    saves: 78,
    createdAt: '2024-11-11',
    featured: false
  },
  {
    id: 6,
    title: 'Gaming Console Bundle',
    description: 'Latest gen console with 5 popular games and 2 controllers',
    price: 550,
    category: 'Electronics',
    status: 'sold',
    listingType: 'sale',
    seller: { name: 'Game Zone', verified: true },
    location: 'Austin, TX',
    views: 3421,
    saves: 234,
    createdAt: '2024-11-05',
    featured: false
  },
  {
    id: 7,
    title: 'Camping Tent - 4 Person',
    description: 'Waterproof tent perfect for family camping trips',
    price: 120,
    category: 'Sports & Outdoors',
    status: 'active',
    listingType: 'both',
    seller: { name: 'Outdoor Gear', verified: true },
    location: 'Portland, OR',
    views: 1567,
    saves: 112,
    createdAt: '2024-11-13',
    featured: true
  },
  {
    id: 8,
    title: 'Vintage Wooden Bookshelf',
    description: 'Handcrafted bookshelf with 5 shelves, solid oak wood',
    price: 380,
    category: 'Furniture',
    status: 'pending',
    listingType: 'sale',
    seller: { name: 'Woodcraft Studio', verified: false },
    location: 'Boston, MA',
    views: 421,
    saves: 34,
    createdAt: '2024-11-15',
    featured: false
  },
  {
    id: 9,
    title: 'Electric Guitar with Amp',
    description: 'Fender Stratocaster with 20W amplifier and accessories',
    price: 750,
    category: 'Music',
    status: 'active',
    listingType: 'both',
    seller: { name: 'Music Store', verified: true },
    location: 'Nashville, TN',
    views: 982,
    saves: 89,
    createdAt: '2024-11-09',
    featured: false
  },
  {
    id: 10,
    title: 'Smart Home Security System',
    description: 'Complete security system with cameras, sensors, and hub',
    price: 899,
    category: 'Electronics',
    status: 'rejected',
    listingType: 'sale',
    seller: { name: 'Home Security', verified: false },
    location: 'Miami, FL',
    views: 156,
    saves: 12,
    createdAt: '2024-11-16',
    featured: false
  },
  {
    id: 11,
    title: 'Professional Camera Lens',
    description: '50mm f/1.8 lens compatible with Canon EOS cameras',
    price: 420,
    category: 'Electronics',
    status: 'active',
    listingType: 'rent',
    seller: { name: 'Photo Rentals', verified: true },
    location: 'San Francisco, CA',
    views: 734,
    saves: 67,
    createdAt: '2024-11-07',
    featured: true
  },
  {
    id: 12,
    title: 'Kids Toy Collection',
    description: 'Bundle of educational toys for ages 3-8, barely used',
    price: 85,
    category: 'Toys & Games',
    status: 'active',
    listingType: 'sale',
    seller: { name: 'Family Store', verified: true },
    location: 'Phoenix, AZ',
    views: 512,
    saves: 43,
    createdAt: '2024-11-06',
    featured: false
  }
]

// Get item from router state or sessionStorage or fallback to mock data
const item = computed(() => {
  // Try multiple sources
  let itemData: Item | undefined

  // 1. Try window.history.state
  if (window.history.state && window.history.state.item) {
    console.log('✓ Item found in window.history.state')
    itemData = window.history.state.item
  }
  // 2. Try sessionStorage as fallback
  else if (route.params.id) {
    const stored = sessionStorage.getItem(`item_${route.params.id}`)
    if (stored) {
      console.log('✓ Item found in sessionStorage')
      itemData = JSON.parse(stored)
      // Clean up after retrieval
      sessionStorage.removeItem(`item_${route.params.id}`)
    }
    // 3. Fallback to mock data (in production, fetch from API)
    else {
      console.log('⚠ Fetching from mock data (would be API in production)')
      const id = Number(route.params.id)
      itemData = mockItems.find(item => item.id === id)
    }
  }

  if (!itemData) {
    console.warn('✗ No item data found')
  }

  return itemData
})

// Performance data - would be fetched from API based on item ID
const viewsChartData = computed(() => {
  if (!item.value) return { labels: [], datasets: [] }

  // Mock data - in production, this would be fetched from API
  return {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Views',
        data: [145, 178, 234, 198, 267, 189, 234],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// Timeline events - would be fetched from API based on item ID
const timeline = ref([
  {
    event: 'Item Listed',
    date: '2024-11-10 10:30 AM',
    admin: 'System',
    details: 'Item submitted by seller'
  },
  {
    event: 'Approved',
    date: '2024-11-10 11:15 AM',
    admin: 'Admin User',
    details: 'Item approved for public listing'
  },
  {
    event: 'Featured',
    date: '2024-11-10 14:00 PM',
    admin: 'Admin User',
    details: 'Promoted to featured section'
  }
])



const itemInitials = computed(() => {
  if (!item.value?.title) return 'IT'
  return item.value.title
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const sellerInitials = computed(() => {
  if (!item.value?.seller?.name) return 'SE'
  return item.value.seller.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const goBack = () => {
  router.push('/items')
}

const handleApprove = () => {
  console.log('Approve item')
}

const handleReject = () => {
  console.log('Reject item')
}

const handleFeature = () => {
  console.log('Feature item')
}

const handleDelete = () => {
  console.log('Delete item')
}

const viewSeller = () => {
  if (!item.value) return
  // In production, you would have a seller ID or username to navigate to
  console.log('View seller:', item.value.seller.name)
  // router.push(`/users/${sellerId}`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Back Button -->
    <BaseButton variant="ghost" size="sm" @click="goBack" class="mb-6">
      <ArrowLeftIcon class="w-5 h-5" />
      Back to Items
    </BaseButton>

    <!-- Error State -->
    <EmptyState
      v-if="!item"
      :icon="ExclamationTriangleIcon"
      title="Item not found"
      description="The item you're looking for could not be loaded."
      action-text="Back to Items"
      @action="goBack"
    />

    <!-- Item Header -->
    <div v-if="item" class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
      <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div class="flex-1">
          <div class="flex items-start gap-3 mb-4">
            <h1 class="text-3xl font-bold text-slate-900 dark:text-white flex-1">
              {{ item.title }}
            </h1>
            <BaseBadge
              :variant="item.status === 'active' ? 'success' : item.status === 'pending' ? 'warning' : item.status === 'sold' ? 'info' : 'danger'"
              size="md"
            >
              {{ item.status }}
            </BaseBadge>
          </div>

          <div class="flex flex-wrap items-center gap-4 mb-4 text-sm text-slate-600 dark:text-slate-400">
            <div class="flex items-center gap-2">
              <MapPinIcon class="w-4 h-4" />
              <span>{{ item.location }}</span>
            </div>
            <span class="text-slate-400 dark:text-slate-600">•</span>
            <span>{{ item.category }}</span>
            <template v-if="item.featured">
              <span class="text-slate-400 dark:text-slate-600">•</span>
              <div class="flex items-center gap-1 text-yellow-600 dark:text-yellow-400">
                <StarIcon class="w-4 h-4 fill-current" />
                <span class="font-medium">Featured</span>
              </div>
            </template>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
              ${{ item.price?.toLocaleString() }}
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-3">
          <BaseButton
            v-if="item.status === 'pending'"
            variant="success"
            @click="handleApprove"
          >
            <CheckCircleIcon class="w-5 h-5" />
            Approve
          </BaseButton>
          <BaseButton
            v-if="item.status === 'pending'"
            variant="danger"
            @click="handleReject"
          >
            <XCircleIcon class="w-5 h-5" />
            Reject
          </BaseButton>
          <BaseButton variant="warning" @click="handleFeature">
            <StarIcon class="w-5 h-5" />
            Feature
          </BaseButton>
          <BaseButton variant="outline" @click="handleDelete">
            <TrashIcon class="w-5 h-5" />
            Delete
          </BaseButton>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Left Column - Photos and Description -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Item Image -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <!-- Main Image -->
          <div class="relative aspect-video bg-slate-100 dark:bg-slate-700">
            <div
              v-if="item?.image"
              class="w-full h-full"
            >
              <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
            </div>
            <div
              v-else
              class="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-6xl"
            >
              {{ itemInitials }}
            </div>
          </div>
        </div>

        <!-- Description and Details -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 class="text-xl font-semibold text-slate-900 dark:text-white mb-4">
            Description
          </h2>
          <p class="text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ item?.description || 'No description provided' }}
          </p>
        </div>

        <!-- Tabs Content -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <!-- Tab Headers -->
          <div class="border-b border-slate-200 dark:border-slate-700">
            <div class="flex gap-4 px-6">
              <button
                @click="activeTab = 'overview'"
                class="px-4 py-4 text-sm font-medium transition-colors duration-200 border-b-2"
                :class="{
                  'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400': activeTab === 'overview',
                  'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white': activeTab !== 'overview'
                }"
              >
                Overview
              </button>
              <button
                @click="activeTab = 'performance'"
                class="px-4 py-4 text-sm font-medium transition-colors duration-200 border-b-2"
                :class="{
                  'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400': activeTab === 'performance',
                  'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white': activeTab !== 'performance'
                }"
              >
                Performance
              </button>
              <button
                @click="activeTab = 'timeline'"
                class="px-4 py-4 text-sm font-medium transition-colors duration-200 border-b-2"
                :class="{
                  'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400': activeTab === 'timeline',
                  'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white': activeTab !== 'timeline'
                }"
              >
                Timeline
              </button>
            </div>
          </div>

          <!-- Tab Content -->
          <div class="p-6">
            <!-- Overview Tab -->
            <div v-if="activeTab === 'overview'">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ item?.listingType || 'N/A' }}</div>
                  <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Listing Type</div>
                </div>
                <div class="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ item?.createdAt || 'N/A' }}</div>
                  <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Listed Date</div>
                </div>
                <div class="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ item?.category || 'N/A' }}</div>
                  <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Category</div>
                </div>
              </div>
            </div>

            <!-- Performance Tab -->
            <div v-if="activeTab === 'performance'" class="space-y-6">
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <EyeIcon class="w-6 h-6 mx-auto text-blue-600 dark:text-blue-400 mb-2" />
                  <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ item?.views?.toLocaleString() || 0 }}</div>
                  <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Total Views</div>
                </div>
                <div class="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <HeartIcon class="w-6 h-6 mx-auto text-red-600 dark:text-red-400 mb-2" />
                  <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ item?.saves || 0 }}</div>
                  <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Saves</div>
                </div>
                <div class="text-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <CalendarIcon class="w-6 h-6 mx-auto text-purple-600 dark:text-purple-400 mb-2" />
                  <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ item?.createdAt || 'N/A' }}</div>
                  <div class="text-sm text-slate-600 dark:text-slate-400 mt-1">Listed Date</div>
                </div>
              </div>

              <div>
                <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                  Views Over Time
                </h3>
                <LineChart
                  :labels="viewsChartData.labels"
                  :datasets="viewsChartData.datasets"
                  :height="250"
                />
              </div>
            </div>

            <!-- Timeline Tab -->
            <div v-if="activeTab === 'timeline'">
              <div class="space-y-4">
                <div
                  v-for="(event, index) in timeline"
                  :key="index"
                  class="flex gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
                >
                  <div class="flex-shrink-0">
                    <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <ClockIcon class="w-5 h-5" />
                    </div>
                  </div>
                  <div class="flex-1">
                    <div class="flex items-start justify-between mb-2">
                      <h4 class="font-semibold text-slate-900 dark:text-white">{{ event.event }}</h4>
                      <span class="text-sm text-slate-500 dark:text-slate-500">{{ event.date }}</span>
                    </div>
                    <p class="text-sm text-slate-600 dark:text-slate-400">{{ event.details }}</p>
                    <p class="text-xs text-slate-500 dark:text-slate-500 mt-1">by {{ event.admin }}</p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>

      <!-- Right Column - Seller Info -->
      <div class="space-y-6">
        <!-- Seller Card -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Seller Information
          </h2>

          <div class="flex items-center gap-3 mb-4">
            <div
              class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-xl"
            >
              {{ sellerInitials }}
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="font-semibold text-slate-900 dark:text-white">{{ item?.seller?.name || 'Unknown Seller' }}</h3>
                <CheckBadgeIcon
                  v-if="item?.seller?.verified"
                  class="w-5 h-5 text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>
          </div>

          <div class="mb-4">
            <p class="text-sm text-slate-600 dark:text-slate-400">
              Contact seller for more details about this listing.
            </p>
          </div>

          <BaseButton variant="primary" :full-width="true" @click="viewSeller">
            View Seller Profile
          </BaseButton>
        </div>

        <!-- Performance Summary -->
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Quick Stats
          </h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-400">Total Views</span>
              <span class="font-semibold text-slate-900 dark:text-white">{{ item?.views?.toLocaleString() || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-400">Saves</span>
              <span class="font-semibold text-slate-900 dark:text-white">{{ item?.saves || 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-400">Status</span>
              <span class="font-semibold text-slate-900 dark:text-white capitalize">{{ item?.status || 'N/A' }}</span>
            </div>
            <div class="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-700">
              <span class="text-sm text-slate-600 dark:text-slate-400">Featured</span>
              <span class="font-semibold text-slate-900 dark:text-white">{{ item?.featured ? 'Yes' : 'No' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
