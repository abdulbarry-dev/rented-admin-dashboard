<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  ArrowDownTrayIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'
import ItemStatsCard from '@/components/items/ItemStatsCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

interface RentalTransaction {
  id: number
  transactionId: string
  itemTitle: string
  renter: {
    id: number
    name: string
    email: string
  }
  owner: {
    id: number
    name: string
    email: string
  }
  amount: number
  fee: number
  total: number
  securityDeposit: number
  status: 'active' | 'completed' | 'cancelled' | 'disputed'
  rentalPeriod: {
    startDate: string
    endDate: string
    returnDate?: string
    returnStatus: 'pending' | 'returned' | 'overdue' | 'extended'
  }
  date: string
  paymentMethod: string
}

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 15

// Filters
const searchQuery = ref('')
const selectedStatus = ref<'all' | 'active' | 'completed' | 'cancelled' | 'disputed'>('all')
const selectedReturnStatus = ref<'all' | 'pending' | 'returned' | 'overdue' | 'extended'>('all')
const sortBy = ref<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest')

// Mock rental transaction data
const transactions = ref<RentalTransaction[]>([
  {
    id: 2,
    transactionId: 'TXN-2024-001235',
    itemTitle: 'Modern Office Chair',
    renter: { id: 3, name: 'Jane Smith', email: 'jane@example.com' },
    owner: { id: 4, name: 'Office Furniture Co', email: 'office@example.com' },
    amount: 450.00,
    fee: 45.00,
    total: 495.00,
    securityDeposit: 150.00,
    status: 'active',
    rentalPeriod: {
      startDate: '2024-11-21',
      endDate: '2024-12-05',
      returnStatus: 'pending'
    },
    date: '2024-11-21',
    paymentMethod: 'PayPal'
  },
  {
    id: 4,
    transactionId: 'TXN-2024-001237',
    itemTitle: 'Mountain Bike - Trail Edition',
    renter: { id: 7, name: 'Emily Davis', email: 'emily@example.com' },
    owner: { id: 8, name: 'Bike Rental Pro', email: 'bike@example.com' },
    amount: 650.00,
    fee: 65.00,
    total: 715.00,
    securityDeposit: 200.00,
    status: 'completed',
    rentalPeriod: {
      startDate: '2024-11-01',
      endDate: '2024-11-15',
      returnDate: '2024-11-15',
      returnStatus: 'returned'
    },
    date: '2024-11-01',
    paymentMethod: 'Credit Card'
  },
  {
    id: 7,
    transactionId: 'TXN-2024-001240',
    itemTitle: 'Camping Tent - 4 Person',
    renter: { id: 13, name: 'David Martinez', email: 'david@example.com' },
    owner: { id: 14, name: 'Outdoor Gear', email: 'outdoor@example.com' },
    amount: 120.00,
    fee: 12.00,
    total: 132.00,
    securityDeposit: 50.00,
    status: 'active',
    rentalPeriod: {
      startDate: '2024-11-20',
      endDate: '2024-11-27',
      returnStatus: 'overdue'
    },
    date: '2024-11-20',
    paymentMethod: 'PayPal'
  },
  {
    id: 11,
    transactionId: 'TXN-2024-001244',
    itemTitle: 'Professional Camera Lens',
    renter: { id: 21, name: 'Sam Wilson', email: 'sam@example.com' },
    owner: { id: 20, name: 'Photo Rentals', email: 'photo@example.com' },
    amount: 420.00,
    fee: 42.00,
    total: 462.00,
    securityDeposit: 300.00,
    status: 'active',
    rentalPeriod: {
      startDate: '2024-11-18',
      endDate: '2024-11-25',
      returnStatus: 'extended'
    },
    date: '2024-11-18',
    paymentMethod: 'Credit Card'
  },
  {
    id: 12,
    transactionId: 'TXN-2024-001245',
    itemTitle: 'Electric Guitar with Amp',
    renter: { id: 22, name: 'Mike Johnson', email: 'mike@example.com' },
    owner: { id: 16, name: 'Music Store', email: 'music@example.com' },
    amount: 750.00,
    fee: 75.00,
    total: 825.00,
    securityDeposit: 250.00,
    status: 'completed',
    rentalPeriod: {
      startDate: '2024-10-15',
      endDate: '2024-10-30',
      returnDate: '2024-10-30',
      returnStatus: 'returned'
    },
    date: '2024-10-15',
    paymentMethod: 'Credit Card'
  },
  {
    id: 13,
    transactionId: 'TXN-2024-001246',
    itemTitle: 'Gaming Console Bundle',
    renter: { id: 23, name: 'Chris Brown', email: 'chris@example.com' },
    owner: { id: 12, name: 'Game Zone', email: 'game@example.com' },
    amount: 550.00,
    fee: 55.00,
    total: 605.00,
    securityDeposit: 150.00,
    status: 'cancelled',
    rentalPeriod: {
      startDate: '2024-11-10',
      endDate: '2024-11-25',
      returnStatus: 'pending'
    },
    date: '2024-11-10',
    paymentMethod: 'PayPal'
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
        t.renter.name.toLowerCase().includes(search) ||
        t.owner.name.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (selectedStatus.value !== 'all') {
    result = result.filter(t => t.status === selectedStatus.value)
  }

  // Return status filter
  if (selectedReturnStatus.value !== 'all') {
    result = result.filter(t => t.rentalPeriod.returnStatus === selectedReturnStatus.value)
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
  active: transactions.value.filter(t => t.status === 'active').length,
  completed: transactions.value.filter(t => t.status === 'completed').length,
  overdue: transactions.value.filter(t => t.rentalPeriod.returnStatus === 'overdue').length,
  totalRevenue: transactions.value
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + t.total, 0),
  totalDeposits: transactions.value
    .filter(t => t.status === 'active')
    .reduce((sum, t) => sum + t.securityDeposit, 0)
}))

// Status variant
const getStatusVariant = (status: string) => {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    active: 'info',
    completed: 'success',
    cancelled: 'default',
    disputed: 'danger'
  }
  return statusMap[status] || 'default'
}

const getReturnStatusVariant = (status: string) => {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    returned: 'success',
    pending: 'warning',
    overdue: 'danger',
    extended: 'info'
  }
  return statusMap[status] || 'warning'
}

// Reset page when filters change
watch([searchQuery, selectedStatus, selectedReturnStatus, sortBy], () => {
  currentPage.value = 1
})

// Actions
const handleViewDetail = (transactionId: number) => {
  router.push(`/transactions/${transactionId}`)
}

const handleProcessReturn = (transactionId: number) => {
  router.push(`/transactions/refunds?transaction=${transactionId}&type=return`)
}

const handleExport = () => {
  console.log('Exporting rental transactions...')
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedReturnStatus.value = 'all'
  sortBy.value = 'newest'
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const isOverdue = (endDate: string) => {
  return new Date(endDate) < new Date() && !transactions.value.find(t => t.rentalPeriod.endDate === endDate)?.rentalPeriod.returnDate
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Rental Transactions
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Manage rental transactions, periods, and security deposits
          </p>
        </div>
        <BaseButton variant="ghost" @click="handleExport">
          <ArrowDownTrayIcon class="w-5 h-5" />
          Export
        </BaseButton>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      <ItemStatsCard
        label="Total Rentals"
        :value="stats.total.toLocaleString()"
        :icon="CalendarDaysIcon"
        color="blue"
      />
      <ItemStatsCard
        label="Active Rentals"
        :value="stats.active.toLocaleString()"
        :icon="ClockIcon"
        color="orange"
      />
      <ItemStatsCard
        label="Completed"
        :value="stats.completed.toLocaleString()"
        :icon="CheckCircleIcon"
        color="green"
      />
      <ItemStatsCard
        label="Overdue Returns"
        :value="stats.overdue.toLocaleString()"
        :icon="ExclamationTriangleIcon"
        color="red"
      />
      <ItemStatsCard
        label="Active Deposits"
        :value="`$${stats.totalDeposits.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`"
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
            placeholder="Search by transaction ID, item, renter, or owner..."
            class="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Rental Status
          </label>
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="disputed">Disputed</option>
          </select>
        </div>

        <!-- Return Status Filter -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Return Status
          </label>
          <select
            v-model="selectedReturnStatus"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Returns</option>
            <option value="pending">Pending</option>
            <option value="returned">Returned</option>
            <option value="overdue">Overdue</option>
            <option value="extended">Extended</option>
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
        Showing {{ filteredTransactions.length }} of {{ transactions.length }} rental transactions
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
                Item
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Renter
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Rental Period
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Amount
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Deposit
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Return Status
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
              <td class="px-6 py-4">
                <span class="text-sm font-medium text-slate-900 dark:text-white">
                  {{ transaction.itemTitle }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-900 dark:text-white">{{ transaction.renter.name }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ transaction.renter.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-900 dark:text-white">
                  {{ formatDate(transaction.rentalPeriod.startDate) }} - {{ formatDate(transaction.rentalPeriod.endDate) }}
                </div>
                <div v-if="transaction.rentalPeriod.returnDate" class="text-xs text-slate-500 dark:text-slate-400">
                  Returned: {{ formatDate(transaction.rentalPeriod.returnDate) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-slate-900 dark:text-white">
                  ${{ transaction.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-slate-900 dark:text-white">
                  ${{ transaction.securityDeposit.toFixed(2) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <BaseBadge :variant="getStatusVariant(transaction.status)" size="sm">
                  {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
                </BaseBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <BaseBadge :variant="getReturnStatusVariant(transaction.rentalPeriod.returnStatus)" size="sm">
                  {{ transaction.rentalPeriod.returnStatus.charAt(0).toUpperCase() + transaction.rentalPeriod.returnStatus.slice(1) }}
                </BaseBadge>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex gap-2">
                  <BaseButton variant="primary" size="xs" @click="handleViewDetail(transaction.id)">
                    View
                  </BaseButton>
                  <BaseButton
                    v-if="transaction.status === 'active' && transaction.rentalPeriod.returnStatus !== 'returned'"
                    variant="outline"
                    size="xs"
                    @click="handleProcessReturn(transaction.id)"
                  >
                    Process Return
                  </BaseButton>
                </div>
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
            <div class="flex flex-col gap-1 items-end">
              <BaseBadge :variant="getStatusVariant(transaction.status)" size="sm">
                {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
              </BaseBadge>
              <BaseBadge :variant="getReturnStatusVariant(transaction.rentalPeriod.returnStatus)" size="sm">
                {{ transaction.rentalPeriod.returnStatus.charAt(0).toUpperCase() + transaction.rentalPeriod.returnStatus.slice(1) }}
              </BaseBadge>
            </div>
          </div>

          <div class="mb-3">
            <div class="text-sm font-semibold text-slate-900 dark:text-white mb-1">
              {{ transaction.itemTitle }}
            </div>
            <div class="text-sm text-slate-600 dark:text-slate-400">
              Renter: {{ transaction.renter.name }}
            </div>
          </div>

          <div class="mb-3 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
            <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">Rental Period</div>
            <div class="text-sm text-slate-900 dark:text-white">
              {{ formatDate(transaction.rentalPeriod.startDate) }} - {{ formatDate(transaction.rentalPeriod.endDate) }}
            </div>
            <div v-if="transaction.rentalPeriod.returnDate" class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Returned: {{ formatDate(transaction.rentalPeriod.returnDate) }}
            </div>
          </div>

          <div class="flex items-center justify-between mb-3">
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400">Rental Amount</div>
              <div class="text-sm font-semibold text-slate-900 dark:text-white">
                ${{ transaction.total.toFixed(2) }}
              </div>
            </div>
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400">Security Deposit</div>
              <div class="text-sm font-semibold text-slate-900 dark:text-white">
                ${{ transaction.securityDeposit.toFixed(2) }}
              </div>
            </div>
          </div>

          <div class="flex gap-2">
            <BaseButton variant="primary" size="sm" @click="handleViewDetail(transaction.id)">
              View
            </BaseButton>
            <BaseButton
              v-if="transaction.status === 'active' && transaction.rentalPeriod.returnStatus !== 'returned'"
              variant="outline"
              size="sm"
              @click="handleProcessReturn(transaction.id)"
            >
              Process Return
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
      :icon="CalendarDaysIcon"
      title="No rental transactions found"
      description="No rental transactions match your current filters. Try adjusting your search criteria."
    />
  </div>
</template>