<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

const route = useRoute()
const router = useRouter()

const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedType = ref('all')
const currentPage = ref(1)
const itemsPerPage = 10

// Mock transactions
const transactions = ref([
  {
    id: 'TRX-2024-001',
    date: '2024-11-14',
    type: 'purchase',
    item: 'Wireless Headphones',
    category: 'Electronics',
    amount: 89.99,
    status: 'completed',
    paymentMethod: 'Credit Card',
    seller: 'TechStore Inc.'
  },
  {
    id: 'TRX-2024-002',
    date: '2024-11-12',
    type: 'purchase',
    item: 'Running Shoes',
    category: 'Fashion',
    amount: 124.50,
    status: 'completed',
    paymentMethod: 'PayPal',
    seller: 'SportsGear Co.'
  },
  {
    id: 'TRX-2024-003',
    date: '2024-11-10',
    type: 'refund',
    item: 'Coffee Maker',
    category: 'Home & Garden',
    amount: -65.00,
    status: 'refunded',
    paymentMethod: 'Credit Card',
    seller: 'HomeGoods Ltd.'
  },
  {
    id: 'TRX-2024-004',
    date: '2024-11-08',
    type: 'purchase',
    item: 'Book Set',
    category: 'Books',
    amount: 45.99,
    status: 'completed',
    paymentMethod: 'Debit Card',
    seller: 'BookWorld'
  },
  {
    id: 'TRX-2024-005',
    date: '2024-11-05',
    type: 'purchase',
    item: 'Gaming Mouse',
    category: 'Electronics',
    amount: 79.99,
    status: 'completed',
    paymentMethod: 'Credit Card',
    seller: 'TechStore Inc.'
  },
  {
    id: 'TRX-2024-006',
    date: '2024-11-03',
    type: 'purchase',
    item: 'Yoga Mat',
    category: 'Sports',
    amount: 34.99,
    status: 'pending',
    paymentMethod: 'PayPal',
    seller: 'FitLife'
  },
  {
    id: 'TRX-2024-007',
    date: '2024-11-01',
    type: 'purchase',
    item: 'Desk Lamp',
    category: 'Home & Garden',
    amount: 42.50,
    status: 'completed',
    paymentMethod: 'Credit Card',
    seller: 'HomeGoods Ltd.'
  },
  {
    id: 'TRX-2024-008',
    date: '2024-10-28',
    type: 'purchase',
    item: 'Phone Case',
    category: 'Electronics',
    amount: 19.99,
    status: 'completed',
    paymentMethod: 'Debit Card',
    seller: 'AccessoriesHub'
  }
])

// Financial metrics
const metrics = computed(() => {
  const completed = transactions.value.filter(t => t.status === 'completed')
  const totalSpent = completed.reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0)
  const totalRefunded = transactions.value
    .filter(t => t.status === 'refunded')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)

  return {
    totalTransactions: transactions.value.length,
    totalSpent,
    totalRefunded,
    averageTransaction: completed.length > 0 ? totalSpent / completed.length : 0,
    pendingCount: transactions.value.filter(t => t.status === 'pending').length,
    completedCount: completed.length
  }
})

// Spending trend chart
const spendingTrend = computed(() => ({
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Spending',
      data: [245, 380, 290, 450],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}))

// Category spending chart
const categorySpending = computed(() => ({
  labels: ['Electronics', 'Fashion', 'Home & Garden', 'Books', 'Sports'],
  datasets: [
    {
      label: 'Amount Spent',
      data: [189.97, 124.50, 42.50, 45.99, 34.99],
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

const filteredTransactions = computed(() => {
  return transactions.value.filter(transaction => {
    const matchesSearch = transaction.item.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = selectedStatus.value === 'all' || transaction.status === selectedStatus.value
    const matchesType = selectedType.value === 'all' || transaction.type === selectedType.value

    return matchesSearch && matchesStatus && matchesType
  })
})

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransactions.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage))

const goBack = () => {
  router.push(`/users/${route.params.id}`)
}

const exportTransactions = () => {
  console.log('Export transactions')
}

const viewTransactionDetails = (transactionId: string) => {
  console.log('View transaction:', transactionId)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-6">
      <button
        @click="goBack"
        class="mb-4 flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
      >
        <ArrowLeftIcon class="w-5 h-5" />
        <span>Back to User Profile</span>
      </button>

      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Transaction History
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Complete transaction history and financial overview
          </p>
        </div>
        <button
          @click="exportTransactions"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 flex items-center gap-2"
        >
          <ArrowDownTrayIcon class="w-5 h-5" />
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- Metrics Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Spent</div>
        <div class="text-3xl font-bold text-slate-900 dark:text-white">
          ${{ metrics.totalSpent.toFixed(2) }}
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Avg Transaction</div>
        <div class="text-3xl font-bold text-slate-900 dark:text-white">
          ${{ metrics.averageTransaction.toFixed(2) }}
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Refunded</div>
        <div class="text-3xl font-bold text-red-600 dark:text-red-400">
          ${{ metrics.totalRefunded.toFixed(2) }}
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Total Transactions</div>
        <div class="text-3xl font-bold text-slate-900 dark:text-white">
          {{ metrics.totalTransactions }}
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Completed</div>
        <div class="text-3xl font-bold text-green-600 dark:text-green-400">
          {{ metrics.completedCount }}
        </div>
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <div class="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Pending</div>
        <div class="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
          {{ metrics.pendingCount }}
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Spending Trend
        </h3>
        <LineChart
          :labels="spendingTrend.labels"
          :datasets="spendingTrend.datasets"
          :height="250"
        />
      </div>

      <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
          Spending by Category
        </h3>
        <BarChart
          :labels="categorySpending.labels"
          :datasets="categorySpending.datasets"
          :height="250"
        />
      </div>
    </div>

    <!-- Filters & Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <!-- Filters -->
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by item or transaction ID..."
              class="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-white"
            />
          </div>

          <select
            v-model="selectedStatus"
            class="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="refunded">Refunded</option>
          </select>

          <select
            v-model="selectedType"
            class="px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-slate-900 dark:text-white"
          >
            <option value="all">All Types</option>
            <option value="purchase">Purchase</option>
            <option value="refund">Refund</option>
          </select>
        </div>
      </div>

      <!-- Transaction Table -->
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Transaction ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Item
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr
              v-for="transaction in paginatedTransactions"
              :key="transaction.id"
              class="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ transaction.id }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-600 dark:text-slate-400">
                  {{ transaction.date }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ transaction.item }}
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400">
                  {{ transaction.seller }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-600 dark:text-slate-400">
                  {{ transaction.category }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  class="text-sm font-semibold"
                  :class="{
                    'text-green-600 dark:text-green-400': transaction.amount > 0,
                    'text-red-600 dark:text-red-400': transaction.amount < 0
                  }"
                >
                  {{ transaction.amount > 0 ? '+' : '' }}${{ Math.abs(transaction.amount).toFixed(2) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300': transaction.status === 'completed',
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300': transaction.status === 'pending',
                    'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300': transaction.status === 'refunded'
                  }"
                >
                  <CheckCircleIcon v-if="transaction.status === 'completed'" class="w-3 h-3" />
                  <ClockIcon v-if="transaction.status === 'pending'" class="w-3 h-3" />
                  <XCircleIcon v-if="transaction.status === 'refunded'" class="w-3 h-3" />
                  {{ transaction.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="viewTransactionDetails(transaction.id)"
                  class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div
          v-if="paginatedTransactions.length === 0"
          class="text-center py-12"
        >
          <p class="text-slate-600 dark:text-slate-400">No transactions found</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-600 dark:text-slate-400">
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredTransactions.length) }} of
            {{ filteredTransactions.length }} transactions
          </div>
          <div class="flex items-center gap-2">
            <button
              :disabled="currentPage === 1"
              @click="currentPage--"
              class="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Previous
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              class="px-3 py-1 rounded-lg border"
              :class="{
                'bg-blue-600 text-white border-blue-600': currentPage === page,
                'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800': currentPage !== page
              }"
            >
              {{ page }}
            </button>
            <button
              :disabled="currentPage === totalPages"
              @click="currentPage++"
              class="px-3 py-1 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
