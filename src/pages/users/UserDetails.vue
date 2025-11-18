<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  CheckBadgeIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import UserActivityChart from '@/components/users/UserActivityChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'

const route = useRoute()
const router = useRouter()
const activeTab = ref<'overview' | 'activity' | 'transactions' | 'notes'>('overview')
const loading = ref(false)

// Mock user data
const user = ref({
  id: route.params.id,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatar: '',
  role: 'customer' as const,
  status: 'active' as const,
  verified: true,
  location: 'New York, USA',
  joinDate: '2024-01-15',
  lastActive: '2024-11-14',
  bio: 'Tech enthusiast and marketplace power user. Loves finding unique items and supporting local vendors.',
  stats: {
    totalSpent: 4250,
    totalPurchases: 28,
    activeListings: 0,
    totalSales: 0,
    rating: 4.8,
    reviewsCount: 15
  }
})

// Activity chart data
const activityData = computed(() => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Activity Score',
      data: [45, 52, 61, 58, 67, 72],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}))

// Transaction categories
const transactionCategories = computed(() => ({
  labels: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books'],
  datasets: [
    {
      label: 'Spending',
      data: [1250, 850, 720, 890, 540],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ]
    }
  ]
}))

// Transaction types pie chart
const transactionTypes = computed(() => ({
  labels: ['Purchases', 'Refunds', 'Credits'],
  data: [28, 2, 3],
  colors: ['#3b82f6', '#ef4444', '#10b981']
}))

// Recent transactions
const recentTransactions = ref([
  {
    id: 'TRX-001',
    item: 'Wireless Headphones',
    amount: 89.99,
    date: '2024-11-12',
    status: 'completed'
  },
  {
    id: 'TRX-002',
    item: 'Running Shoes',
    amount: 124.50,
    date: '2024-11-08',
    status: 'completed'
  },
  {
    id: 'TRX-003',
    item: 'Coffee Maker',
    amount: 65.00,
    date: '2024-11-05',
    status: 'refunded'
  },
  {
    id: 'TRX-004',
    item: 'Book Set',
    amount: 45.99,
    date: '2024-11-01',
    status: 'completed'
  }
])

const userInitials = computed(() => {
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const goBack = () => {
  router.push('/users')
}

const handleSuspend = () => {
  console.log('Suspend user')
  // Implementation
}

const handleVerify = () => {
  console.log('Verify user')
  // Implementation
}

const handleViewTransactions = () => {
  router.push(`/users/${user.value.id}/transactions`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Back Button -->
    <button
      @click="goBack"
      class="mb-6 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
    >
      <ArrowLeftIcon class="w-5 h-5" />
      <span>Back to Users</span>
    </button>

    <!-- User Header -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
      <div class="flex flex-col md:flex-row gap-6">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <div
            v-if="user.avatar"
            class="w-24 h-24 rounded-full overflow-hidden"
          >
            <img :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
          </div>
          <div
            v-else
            class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-2xl"
          >
            {{ userInitials }}
          </div>
        </div>

        <!-- User Info -->
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-4 mb-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-2">
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">
                  {{ user.name }}
                </h1>
                <CheckBadgeIcon
                  v-if="user.verified"
                  class="w-6 h-6 text-blue-600 dark:text-blue-400"
                />
              </div>
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300': user.role === 'super_admin',
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300': user.role === 'vendor',
                    'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300': user.role === 'customer'
                  }"
                >
                  {{ user.role }}
                </span>
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300': user.status === 'active',
                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300': user.status === 'suspended'
                  }"
                >
                  {{ user.status }}
                </span>
              </div>
              <p class="text-slate-600 dark:text-slate-400 mb-4">
                {{ user.bio }}
              </p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <EnvelopeIcon class="w-4 h-4" />
                  <span>{{ user.email }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <PhoneIcon class="w-4 h-4" />
                  <span>{{ user.phone }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <MapPinIcon class="w-4 h-4" />
                  <span>{{ user.location }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <CalendarIcon class="w-4 h-4" />
                  <span>Joined {{ user.joinDate }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-3">
            <button
              v-if="!user.verified"
              @click="handleVerify"
              class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <ShieldCheckIcon class="w-5 h-5" />
              <span>Verify</span>
            </button>
            <button
              v-if="user.status === 'active'"
              @click="handleSuspend"
              class="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <XCircleIcon class="w-5 h-5" />
              <span>Suspend</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <BanknotesIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">${{ user.stats.totalSpent.toLocaleString() }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400">Total Spent</div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 flex items-center justify-center">
            <ShoppingBagIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ user.stats.totalPurchases }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400">Purchases</div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <ShoppingBagIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ user.stats.activeListings }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400">Active Listings</div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 flex items-center justify-center">
            <BanknotesIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ user.stats.totalSales }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400">Total Sales</div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 flex items-center justify-center">
            <CheckBadgeIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ user.stats.rating }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400">Rating</div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 flex items-center justify-center">
            <ClockIcon class="w-5 h-5" />
          </div>
        </div>
        <div class="text-2xl font-bold text-slate-900 dark:text-white">{{ user.stats.reviewsCount }}</div>
        <div class="text-sm text-slate-600 dark:text-slate-400">Reviews</div>
      </div>
    </div>

    <!-- Tabs -->
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
            @click="activeTab = 'activity'"
            class="px-4 py-4 text-sm font-medium transition-colors duration-200 border-b-2"
            :class="{
              'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400': activeTab === 'activity',
              'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white': activeTab !== 'activity'
            }"
          >
            Activity
          </button>
          <button
            @click="activeTab = 'transactions'"
            class="px-4 py-4 text-sm font-medium transition-colors duration-200 border-b-2"
            :class="{
              'border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-400': activeTab === 'transactions',
              'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white': activeTab !== 'transactions'
            }"
          >
            Transactions
          </button>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Spending by Category -->
            <div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Spending by Category
              </h3>
              <BarChart
                :labels="transactionCategories.labels"
                :datasets="transactionCategories.datasets"
                :height="250"
              />
            </div>

            <!-- Transaction Types -->
            <div>
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                Transaction Types
              </h3>
              <DoughnutChart
                :labels="transactionTypes.labels"
                :data="transactionTypes.data"
                :colors="transactionTypes.colors"
                :height="250"
                cutout="60%"
              />
            </div>
          </div>
        </div>

        <!-- Activity Tab -->
        <div v-if="activeTab === 'activity'">
          <UserActivityChart
            title="User Activity Score"
            subtitle="Activity engagement over time"
            :labels="activityData.labels"
            :datasets="activityData.datasets"
            :height="300"
          />
        </div>

        <!-- Transactions Tab -->
        <div v-if="activeTab === 'transactions'" class="space-y-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
              Recent Transactions
            </h3>
            <button
              @click="handleViewTransactions"
              class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              View All →
            </button>
          </div>

          <div class="space-y-3">
            <div
              v-for="transaction in recentTransactions"
              :key="transaction.id"
              class="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg"
            >
              <div>
                <div class="font-medium text-slate-900 dark:text-white">
                  {{ transaction.item }}
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400">
                  {{ transaction.id }} • {{ transaction.date }}
                </div>
              </div>
              <div class="text-right">
                <div class="font-semibold text-slate-900 dark:text-white">
                  ${{ transaction.amount }}
                </div>
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300': transaction.status === 'completed',
                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300': transaction.status === 'refunded'
                  }"
                >
                  {{ transaction.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
