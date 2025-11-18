<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  CubeIcon,
  CheckCircleIcon,
  ClockIcon,
  ShoppingBagIcon,
  StarIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
import ItemStatsCard from '@/components/items/ItemStatsCard.vue'
import ItemFilters, { type ItemFilters as Filters } from '@/components/items/ItemFilters.vue'
import type { Item } from '@/components/items/ItemCard.vue'
import ItemActivityChart from '@/components/items/ItemActivityChart.vue'
import ItemTable from '@/components/items/ItemTable.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 12

// Filters
const filters = ref<Filters>({
  search: '',
  category: '',
  status: '',
  listingType: '',
  priceMin: '',
  priceMax: '',
  dateFrom: '',
  dateTo: '',
  featured: ''
})

// Mock item data
const allItems = ref<Item[]>([
  {
    id: 1,
    title: 'Premium Wireless Headphones',
    description: 'High-quality noise-canceling headphones with 30-hour battery life',
    price: 299,
    category: 'Electronics',
    status: 'active',
    listingType: 'sale',
    seller: {
      name: 'Tech Store',
      verified: true
    },
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
    seller: {
      name: 'Office Furniture Co',
      verified: true
    },
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
    seller: {
      name: 'Fashion Boutique',
      verified: false
    },
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
    seller: {
      name: 'Bike Rental Pro',
      verified: true
    },
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
    seller: {
      name: 'Antique Dealer',
      verified: true
    },
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
    seller: {
      name: 'Game Zone',
      verified: true
    },
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
    seller: {
      name: 'Outdoor Gear',
      verified: true
    },
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
    seller: {
      name: 'Woodcraft Studio',
      verified: false
    },
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
    seller: {
      name: 'Music Store',
      verified: true
    },
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
    seller: {
      name: 'Home Security',
      verified: false
    },
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
    seller: {
      name: 'Photo Rentals',
      verified: true
    },
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
    seller: {
      name: 'Family Store',
      verified: true
    },
    location: 'Phoenix, AZ',
    views: 512,
    saves: 43,
    createdAt: '2024-11-06',
    featured: false
  }
])

// Filtered items
const filteredItems = computed(() => {
  let result = [...allItems.value]

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(
      item =>
        item.title.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.seller.name.toLowerCase().includes(search) ||
        item.id.toString().includes(search) ||
        item.category.toLowerCase().includes(search)
    )
  }

  // Category filter
  if (filters.value.category) {
    result = result.filter(item =>
      item.category.toLowerCase() === filters.value.category.toLowerCase()
    )
  }

  // Status filter
  if (filters.value.status) {
    result = result.filter(item => item.status === filters.value.status)
  }

  // Listing type filter
  if (filters.value.listingType) {
    result = result.filter(item => item.listingType === filters.value.listingType)
  }

  // Featured filter
  if (filters.value.featured) {
    const isFeatured = filters.value.featured === 'true'
    result = result.filter(item => item.featured === isFeatured)
  }

  // Price range filter
  if (filters.value.priceMin) {
    result = result.filter(item => item.price >= Number(filters.value.priceMin))
  }
  if (filters.value.priceMax) {
    result = result.filter(item => item.price <= Number(filters.value.priceMax))
  }

  return result
})

// Paginated items
const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredItems.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredItems.value.length / itemsPerPage))

// Stats
const stats = computed(() => ({
  total: allItems.value.length,
  active: allItems.value.filter(i => i.status === 'active').length,
  pending: allItems.value.filter(i => i.status === 'pending').length,
  sold: allItems.value.filter(i => i.status === 'sold').length,
  featured: allItems.value.filter(i => i.featured).length
}))

// Activity chart data
const activityChartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'New Listings',
      data: [24, 18, 32, 28, 35, 42, 38],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Item Views',
      data: [1245, 1567, 1892, 1734, 2103, 2456, 2234],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}))

// Reset page when filters change
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

// Actions
const clearFilters = () => {
  filters.value = {
    search: '',
    category: '',
    status: '',
    listingType: '',
    priceMin: '',
    priceMax: '',
    dateFrom: '',
    dateTo: '',
    featured: ''
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleViewItem = (itemId: string | number) => {
  const item = allItems.value.find(i => i.id === itemId)
  if (!item) {
    console.error('Item not found:', itemId)
    return
  }
  console.log('Navigating to item:', item)

  // Store in sessionStorage as fallback
  sessionStorage.setItem(`item_${itemId}`, JSON.stringify(item))

  router.push({
    name: 'item-detail',
    params: { id: String(itemId) },
    state: { item }
  })
}

const exportItems = () => {
  console.log('Exporting items...')
  // Implementation for export
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Items Management
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Manage marketplace listings, approvals, and featured items
          </p>
        </div>
        <BaseButton variant="ghost" @click="exportItems">
          <ArrowDownTrayIcon class="w-5 h-5" />
          Export
        </BaseButton>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <ItemStatsCard
        label="Total Items"
        :value="stats.total.toLocaleString()"
        :icon="CubeIcon"
        color="blue"
        :trend="8.5"
      />
      <ItemStatsCard
        label="Active Listings"
        :value="stats.active.toLocaleString()"
        :icon="CheckCircleIcon"
        color="green"
        :trend="12.3"
      />
      <ItemStatsCard
        label="Pending Approval"
        :value="stats.pending.toLocaleString()"
        :icon="ClockIcon"
        color="orange"
        :trend="-5.2"
      />
      <ItemStatsCard
        label="Sold Items"
        :value="stats.sold.toLocaleString()"
        :icon="ShoppingBagIcon"
        color="purple"
        :trend="18.7"
      />
      <ItemStatsCard
        label="Featured Items"
        :value="stats.featured.toLocaleString()"
        :icon="StarIcon"
        color="indigo"
        :trend="3.4"
      />
    </div>

    <!-- Activity Chart -->
    <div class="mb-8">
      <ItemActivityChart
        title="Items Activity Overview"
        subtitle="New listings and item views this week"
        :labels="activityChartData.labels"
        :datasets="activityChartData.datasets"
        :height="300"
      />
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <ItemFilters
        v-model="filters"
        :total-results="filteredItems.length"
        @clear="clearFilters"
      />
    </div>

    <!-- Items Table -->
    <ItemTable
      :items="paginatedItems"
      :loading="loading"
      :current-page="currentPage"
      :total-pages="totalPages"
      @view="handleViewItem"
      @page-change="handlePageChange"
    />
  </div>
</template>
