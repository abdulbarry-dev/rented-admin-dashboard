<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowsRightLeftIcon,
  CheckCircleIcon,
  ClockIcon,
  BanknotesIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import ItemStatsCard from '@/components/items/ItemStatsCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

interface Transaction {
  id: number
  transactionId: string
  type: 'purchase' | 'rental'
  itemTitle: string
  buyer: {
    id: number
    name: string
    email: string
  }
  seller: {
    id: number
    name: string
    email: string
  }
  amount: number
  fee: number
  total: number
  status: 'completed' | 'pending' | 'cancelled' | 'refunded' | 'disputed'
  date: string
  paymentMethod: string
}

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 15

// Filters
const searchQuery = ref('')
const selectedType = ref<'all' | 'purchase' | 'rental'>('all')
const selectedStatus = ref<'all' | 'completed' | 'pending' | 'cancelled' | 'refunded' | 'disputed'>('all')
const sortBy = ref<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest')

// Mock transaction data
const transactions = ref<Transaction[]>([
  {
    id: 1,
    transactionId: 'TXN-2024-001234',
    type: 'purchase',
    itemTitle: 'Premium Wireless Headphones',
    buyer: { id: 1, name: 'John Doe', email: 'john@example.com' },
    seller: { id: 2, name: 'Tech Store', email: 'tech@example.com' },
    amount: 299.00,
    fee: 29.90,
    total: 328.90,
    status: 'completed',
    date: '2024-11-20',
    paymentMethod: 'Credit Card'
  },
  {
    id: 2,
    transactionId: 'TXN-2024-001235',
    type: 'rental',
    itemTitle: 'Modern Office Chair',
    buyer: { id: 3, name: 'Jane Smith', email: 'jane@example.com' },
    seller: { id: 4, name: 'Office Furniture Co', email: 'office@example.com' },
    amount: 450.00,
    fee: 45.00,
    total: 495.00,
    status: 'pending',
    date: '2024-11-21',
    paymentMethod: 'PayPal'
  },
  {
    id: 3,
    transactionId: 'TXN-2024-001236',
    type: 'purchase',
    itemTitle: 'Designer Leather Jacket',
    buyer: { id: 5, name: 'Robert Johnson', email: 'robert@example.com' },
    seller: { id: 6, name: 'Fashion Boutique', email: 'fashion@example.com' },
    amount: 180.00,
    fee: 18.00,
    total: 198.00,
    status: 'disputed',
    date: '2024-11-19',
    paymentMethod: 'Credit Card'
  },
  {
    id: 4,
    transactionId: 'TXN-2024-001237',
    type: 'rental',
    itemTitle: 'Mountain Bike - Trail Edition',
    buyer: { id: 7, name: 'Emily Davis', email: 'emily@example.com' },
    seller: { id: 8, name: 'Bike Rental Pro', email: 'bike@example.com' },
    amount: 650.00,
    fee: 65.00,
    total: 715.00,
    status: 'completed',
    date: '2024-11-18',
    paymentMethod: 'Credit Card'
  },
  {
    id: 5,
    transactionId: 'TXN-2024-001238',
    type: 'purchase',
    itemTitle: 'Vintage Camera Collection',
    buyer: { id: 9, name: 'Michael Brown', email: 'michael@example.com' },
    seller: { id: 10, name: 'Antique Dealer', email: 'antique@example.com' },
    amount: 1200.00,
    fee: 120.00,
    total: 1320.00,
    status: 'cancelled',
    date: '2024-11-17',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 6,
    transactionId: 'TXN-2024-001239',
    type: 'purchase',
    itemTitle: 'Gaming Console Bundle',
    buyer: { id: 11, name: 'Sarah Wilson', email: 'sarah@example.com' },
    seller: { id: 12, name: 'Game Zone', email: 'game@example.com' },
    amount: 550.00,
    fee: 55.00,
    total: 605.00,
    status: 'refunded',
    date: '2024-11-16',
    paymentMethod: 'Credit Card'
  },
  {
    id: 7,
    transactionId: 'TXN-2024-001240',
    type: 'rental',
    itemTitle: 'Camping Tent - 4 Person',
    buyer: { id: 13, name: 'David Martinez', email: 'david@example.com' },
    seller: { id: 14, name: 'Outdoor Gear', email: 'outdoor@example.com' },
    amount: 120.00,
    fee: 12.00,
    total: 132.00,
    status: 'pending',
    date: '2024-11-21',
    paymentMethod: 'PayPal'
  },
  {
    id: 8,
    transactionId: 'TXN-2024-001241',
    type: 'purchase',
    itemTitle: 'Electric Guitar with Amp',
    buyer: { id: 15, name: 'Lisa Anderson', email: 'lisa@example.com' },
    seller: { id: 16, name: 'Music Store', email: 'music@example.com' },
    amount: 750.00,
    fee: 75.00,
    total: 825.00,
    status: 'completed',
    date: '2024-11-15',
    paymentMethod: 'Credit Card'
  }
])

// Filtered transactions
const filteredTransactions = computed(() => {
  let result = [...transactions.value]

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(
      t =>
        t.transactionId.toLowerCase().includes(search) ||
        t.itemTitle.toLowerCase().includes(search) ||
        t.buyer.name.toLowerCase().includes(search) ||
        t.seller.name.toLowerCase().includes(search)
    )
  }

  // Type filter
  if (selectedType.value !== 'all') {
    result = result.filter(t => t.type === selectedType.value)
  }

  // Status filter
  if (selectedStatus.value !== 'all') {
    result = result.filter(t => t.status === selectedStatus.value)
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'amount-high':
        return b.total - a.total
      case 'amount-low':
        return a.total - b.total
      default:
        return 0
    }
  })

  return result
})

// Paginated transactions
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransactions.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredTransactions.value.length / itemsPerPage))

// Stats
const stats = computed(() => ({
  total: transactions.value.length,
  completed: transactions.value.filter(t => t.status === 'completed').length,
  pending: transactions.value.filter(t => t.status === 'pending').length,
  disputed: transactions.value.filter(t => t.status === 'disputed').length,
  totalRevenue: transactions.value
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.total, 0)
}))

// Status variant
const getStatusVariant = (status: string) => {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    completed: 'success',
    pending: 'warning',
    cancelled: 'default',
    refunded: 'info',
    disputed: 'danger'
  }
  return statusMap[status] || 'default'
}

// Reset page when filters change
watch([searchQuery, selectedType, selectedStatus, sortBy], () => {
  currentPage.value = 1
})

// Actions
const handleViewDetail = (transactionId: number) => {
  router.push(`/transactions/${transactionId}`)
}

const handleExport = () => {
  console.log('Exporting transactions...')
  // Implementation for export
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedType.value = 'all'
  selectedStatus.value = 'all'
  sortBy.value = 'newest'
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Transactions
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Manage and monitor all platform transactions
          </p>
        </div>
        <BaseButton variant="ghost" @click="handleExport">
          <ArrowDownTrayIcon class="w-5 h-5" />
          Export
        </BaseButton>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <ItemStatsCard
        label="Total Transactions"
        :value="stats.total.toLocaleString()"
        :icon="ArrowsRightLeftIcon"
        color="blue"
      />
      <ItemStatsCard
        label="Completed"
        :value="stats.completed.toLocaleString()"
        :icon="CheckCircleIcon"
        color="green"
      />
      <ItemStatsCard
        label="Pending"
        :value="stats.pending.toLocaleString()"
        :icon="ClockIcon"
        color="orange"
      />
      <ItemStatsCard
        label="Total Revenue"
        :value="`$${stats.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`"
        :icon="BanknotesIcon"
        color="purple"
      />
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-6 mb-6">
      <div class="flex items-center gap-2 mb-4">
        <FunnelIcon class="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <h3 class="font-semibold text-slate-900 dark:text-white">Filters</h3>
      </div>

      <!-- Search Bar -->
      <div class="mb-4">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by transaction ID, item, buyer, or seller..."
            class="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Type Filter -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Transaction Type
          </label>
          <select
            v-model="selectedType"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="purchase">Purchase</option>
            <option value="rental">Rental</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Status
          </label>
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>

        <!-- Sort -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Sort By
          </label>
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="amount-high">Amount: High to Low</option>
            <option value="amount-low">Amount: Low to High</option>
          </select>
        </div>
      </div>

      <!-- Clear Filters -->
      <div class="mt-4 flex justify-end">
        <BaseButton variant="ghost" size="sm" @click="clearFilters">
          Clear Filters
        </BaseButton>
      </div>

      <!-- Results Count -->
      <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
        Showing {{ filteredTransactions.length }} of {{ transactions.length }} transactions
      </div>
    </div>

    <!-- Loading State -->
    <SkeletonLoader v-if="loading" variant="list" :count="6" />

    <!-- Transactions Table -->
    <div v-else-if="paginatedTransactions.length > 0" class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Transaction ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Date
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Type
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Item
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Buyer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Seller
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
              class="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ transaction.transactionId }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                {{ transaction.date }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <BaseBadge :variant="transaction.type === 'purchase' ? 'primary' : 'info'" size="sm">
                  {{ transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) }}
                </BaseBadge>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ transaction.itemTitle }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-900 dark:text-white">{{ transaction.buyer.name }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ transaction.buyer.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-900 dark:text-white">{{ transaction.seller.name }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ transaction.seller.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-slate-900 dark:text-white">
                  ${{ transaction.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </div>
                <div class="text-xs text-slate-500 dark:text-slate-400">
                  Fee: ${{ transaction.fee.toFixed(2) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <BaseBadge :variant="getStatusVariant(transaction.status)" size="sm">
                  {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
                </BaseBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <BaseButton variant="primary" size="xs" @click="handleViewDetail(transaction.id)">
                  View
                </BaseButton>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile/Tablet Card View -->
      <div class="lg:hidden divide-y divide-slate-200 dark:divide-slate-700">
        <div
          v-for="transaction in paginatedTransactions"
          :key="transaction.id"
          class="p-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
        >
          <div class="flex items-start justify-between mb-3">
            <div>
              <div class="text-sm font-medium text-slate-900 dark:text-white mb-1">
                {{ transaction.transactionId }}
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400">
                {{ transaction.date }}
              </div>
            </div>
            <BaseBadge :variant="getStatusVariant(transaction.status)" size="sm">
              {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
            </BaseBadge>
          </div>

          <div class="mb-3">
            <div class="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              {{ transaction.itemTitle }}
            </div>
            <BaseBadge :variant="transaction.type === 'purchase' ? 'primary' : 'info'" size="sm">
              {{ transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) }}
            </BaseBadge>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-3 text-sm">
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">Buyer</div>
              <div class="text-slate-900 dark:text-white">{{ transaction.buyer.name }}</div>
            </div>
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">Seller</div>
              <div class="text-slate-900 dark:text-white">{{ transaction.seller.name }}</div>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-semibold text-slate-900 dark:text-white">
                ${{ transaction.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400">
                Fee: ${{ transaction.fee.toFixed(2) }}
              </div>
            </div>
            <BaseButton variant="primary" size="sm" @click="handleViewDetail(transaction.id)">
              View
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
        <div class="text-sm text-slate-600 dark:text-slate-400">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="flex gap-2">
          <BaseButton
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
          >
            Previous
          </BaseButton>
          <BaseButton
            variant="outline"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="handlePageChange(currentPage + 1)"
          >
            Next
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      :icon="ArrowsRightLeftIcon"
      title="No transactions found"
      description="No transactions match your current filters. Try adjusting your search criteria."
    />
  </div>
</template>
