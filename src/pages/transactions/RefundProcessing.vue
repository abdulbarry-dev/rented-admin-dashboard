<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowPathIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  BanknotesIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CalculatorIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import ItemStatsCard from '@/components/items/ItemStatsCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

interface RefundRequest {
  id: number
  refundId: string
  transactionId: string
  transactionType: 'purchase' | 'rental'
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
  originalAmount: number
  requestedAmount: number
  approvedAmount?: number
  fee: number
  refundType: 'full' | 'partial' | 'deposit'
  reason: string
  reasonCode: 'item_not_received' | 'item_not_as_described' | 'damaged' | 'wrong_item' | 'buyer_request' | 'other'
  status: 'pending' | 'approved' | 'processing' | 'completed' | 'rejected'
  requestDate: string
  processedDate?: string
}

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 15

// Filters
const searchQuery = ref('')
const selectedStatus = ref<'all' | 'pending' | 'approved' | 'processing' | 'completed' | 'rejected'>('all')
const selectedType = ref<'all' | 'full' | 'partial' | 'deposit'>('all')
const sortBy = ref<'newest' | 'oldest' | 'amount-high' | 'amount-low'>('newest')

// Mock refund request data
const refunds = ref<RefundRequest[]>([
  {
    id: 1,
    refundId: 'REF-2024-0001',
    transactionId: 'TXN-2024-001236',
    transactionType: 'purchase',
    itemTitle: 'Designer Leather Jacket',
    buyer: { id: 5, name: 'Robert Johnson', email: 'robert@example.com' },
    seller: { id: 6, name: 'Fashion Boutique', email: 'fashion@example.com' },
    originalAmount: 180.00,
    requestedAmount: 180.00,
    fee: 18.00,
    refundType: 'full',
    reason: 'Item received does not match the description. Poor condition and different material.',
    reasonCode: 'item_not_as_described',
    status: 'pending',
    requestDate: '2024-11-19'
  },
  {
    id: 2,
    refundId: 'REF-2024-0002',
    transactionId: 'TXN-2024-001239',
    transactionType: 'purchase',
    itemTitle: 'Gaming Console Bundle',
    buyer: { id: 11, name: 'Sarah Wilson', email: 'sarah@example.com' },
    seller: { id: 12, name: 'Game Zone', email: 'game@example.com' },
    originalAmount: 550.00,
    requestedAmount: 550.00,
    approvedAmount: 550.00,
    fee: 55.00,
    refundType: 'full',
    reason: 'Item was damaged during shipping and arrived non-functional.',
    reasonCode: 'damaged',
    status: 'completed',
    requestDate: '2024-11-16',
    processedDate: '2024-11-18'
  },
  {
    id: 3,
    refundId: 'REF-2024-0003',
    transactionId: 'TXN-2024-001240',
    transactionType: 'rental',
    itemTitle: 'Camping Tent - 4 Person',
    buyer: { id: 13, name: 'David Martinez', email: 'david@example.com' },
    seller: { id: 14, name: 'Outdoor Gear', email: 'outdoor@example.com' },
    originalAmount: 120.00,
    requestedAmount: 50.00,
    approvedAmount: 50.00,
    fee: 12.00,
    refundType: 'partial',
    reason: 'Partial refund for late delivery. Rental period was shortened.',
    reasonCode: 'other',
    status: 'processing',
    requestDate: '2024-11-20'
  },
  {
    id: 4,
    refundId: 'REF-2024-0004',
    transactionId: 'TXN-2024-001244',
    transactionType: 'rental',
    itemTitle: 'Professional Camera Lens',
    buyer: { id: 21, name: 'Sam Wilson', email: 'sam@example.com' },
    seller: { id: 20, name: 'Photo Rentals', email: 'photo@example.com' },
    originalAmount: 420.00,
    requestedAmount: 300.00,
    fee: 42.00,
    refundType: 'deposit',
    reason: 'Security deposit refund requested after returning item in good condition.',
    reasonCode: 'buyer_request',
    status: 'pending',
    requestDate: '2024-11-21'
  },
  {
    id: 5,
    refundId: 'REF-2024-0005',
    transactionId: 'TXN-2024-001242',
    transactionType: 'purchase',
    itemTitle: 'Smart Home Security System',
    buyer: { id: 17, name: 'Tom Wilson', email: 'tom@example.com' },
    seller: { id: 18, name: 'Home Security Co', email: 'security@example.com' },
    originalAmount: 899.00,
    requestedAmount: 899.00,
    fee: 89.90,
    refundType: 'full',
    reason: 'Item was never received. Tracking shows delivered to wrong address.',
    reasonCode: 'item_not_received',
    status: 'approved',
    requestDate: '2024-11-21'
  },
  {
    id: 6,
    refundId: 'REF-2024-0006',
    transactionId: 'TXN-2024-001238',
    transactionType: 'purchase',
    itemTitle: 'Vintage Camera Collection',
    buyer: { id: 9, name: 'Michael Brown', email: 'michael@example.com' },
    seller: { id: 10, name: 'Antique Dealer', email: 'antique@example.com' },
    originalAmount: 1200.00,
    requestedAmount: 1200.00,
    fee: 120.00,
    refundType: 'full',
    reason: 'Wrong item was shipped. Received different camera model.',
    reasonCode: 'wrong_item',
    status: 'rejected',
    requestDate: '2024-11-17'
  }
])

// Filtered refunds
const filteredRefunds = computed(() => {
  let result = [...refunds.value]

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(
      r =>
        r.refundId.toLowerCase().includes(search) ||
        r.transactionId.toLowerCase().includes(search) ||
        r.itemTitle.toLowerCase().includes(search) ||
        r.buyer.name.toLowerCase().includes(search) ||
        r.seller.name.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (selectedStatus.value !== 'all') {
    result = result.filter(r => r.status === selectedStatus.value)
  }

  // Type filter
  if (selectedType.value !== 'all') {
    result = result.filter(r => r.refundType === selectedType.value)
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
      case 'oldest':
        return new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()
      case 'amount-high':
        return b.requestedAmount - a.requestedAmount
      case 'amount-low':
        return a.requestedAmount - b.requestedAmount
      default:
        return 0
    }
  })

  return result
})

// Paginated refunds
const paginatedRefunds = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredRefunds.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredRefunds.value.length / itemsPerPage))

// Stats
const stats = computed(() => ({
  total: refunds.value.length,
  pending: refunds.value.filter(r => r.status === 'pending').length,
  processing: refunds.value.filter(r => r.status === 'processing').length,
  completed: refunds.value.filter(r => r.status === 'completed').length,
  totalAmount: refunds.value
    .filter(r => r.status === 'completed' || r.status === 'approved' || r.status === 'processing')
    .reduce((sum, r) => sum + (r.approvedAmount || r.requestedAmount), 0)
}))

// Status variant
const getStatusVariant = (status: string) => {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    pending: 'warning',
    approved: 'info',
    processing: 'info',
    completed: 'success',
    rejected: 'danger'
  }
  return statusMap[status] || 'default'
}

const getRefundTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    full: 'Full Refund',
    partial: 'Partial Refund',
    deposit: 'Deposit Refund'
  }
  return typeMap[type] || type
}

const getReasonCodeLabel = (code: string) => {
  const codeMap: Record<string, string> = {
    item_not_received: 'Item Not Received',
    item_not_as_described: 'Item Not as Described',
    damaged: 'Damaged',
    wrong_item: 'Wrong Item',
    buyer_request: 'Buyer Request',
    other: 'Other'
  }
  return codeMap[code] || code
}

// Reset page when filters change
watch([searchQuery, selectedStatus, selectedType, sortBy], () => {
  currentPage.value = 1
})

// Actions
const handleViewDetail = (refundId: number) => {
  router.push(`/transactions/refunds/${refundId}`)
}

const handleProcessRefund = (refundId: number) => {
  router.push(`/transactions/refunds/${refundId}?action=process`)
}

const handleApprove = (refundId: number) => {
  const refund = refunds.value.find(r => r.id === refundId)
  if (refund) {
    refund.status = 'approved'
    refund.approvedAmount = refund.requestedAmount
  }
}

const handleReject = (refundId: number) => {
  const refund = refunds.value.find(r => r.id === refundId)
  if (refund) {
    refund.status = 'rejected'
  }
}

const handleExport = () => {
  console.log('Exporting refunds...')
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedType.value = 'all'
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
            Refund Processing
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Review and process refund requests from buyers and sellers
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
        label="Total Refunds"
        :value="stats.total.toLocaleString()"
        :icon="ArrowPathIcon"
        color="blue"
      />
      <ItemStatsCard
        label="Pending Review"
        :value="stats.pending.toLocaleString()"
        :icon="ClockIcon"
        color="orange"
      />
      <ItemStatsCard
        label="Processing"
        :value="stats.processing.toLocaleString()"
        :icon="CalculatorIcon"
        color="purple"
      />
      <ItemStatsCard
        label="Total Processed"
        :value="`$${stats.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`"
        :icon="BanknotesIcon"
        color="green"
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
            placeholder="Search by refund ID, transaction ID, item, buyer, or seller..."
            class="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <!-- Type Filter -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Refund Type
          </label>
          <select
            v-model="selectedType"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="full">Full Refund</option>
            <option value="partial">Partial Refund</option>
            <option value="deposit">Deposit Refund</option>
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
        Showing {{ filteredRefunds.length }} of {{ refunds.length }} refund requests
      </div>
    </div>

    <!-- Loading State -->
    <SkeletonLoader v-if="loading" variant="list" :count="6" />

    <!-- Refunds List -->
    <div v-else-if="paginatedRefunds.length > 0" class="space-y-4">
      <div
        v-for="refund in paginatedRefunds"
        :key="refund.id"
        class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <!-- Refund Info -->
          <div class="flex-1">
            <div class="flex items-start gap-3 mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                    {{ refund.refundId }}
                  </h3>
                  <BaseBadge :variant="getStatusVariant(refund.status)" size="sm">
                    {{ refund.status.charAt(0).toUpperCase() + refund.status.slice(1) }}
                  </BaseBadge>
                  <BaseBadge variant="default" size="sm">
                    {{ getRefundTypeLabel(refund.refundType) }}
                  </BaseBadge>
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Transaction: <span class="font-medium">{{ refund.transactionId }}</span> • {{ refund.transactionType.charAt(0).toUpperCase() + refund.transactionType.slice(1) }}
                </div>
                <div class="text-base font-medium text-slate-900 dark:text-white mb-2">
                  {{ refund.itemTitle }}
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  Buyer: {{ refund.buyer.name }} • Seller: {{ refund.seller.name }} • Requested: {{ refund.requestDate }}
                </div>
                <div class="mb-3">
                  <BaseBadge variant="info" size="sm">
                    {{ getReasonCodeLabel(refund.reasonCode) }}
                  </BaseBadge>
                </div>
                <div class="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mb-3">
                  <span class="font-medium">Reason:</span> {{ refund.reason }}
                </div>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">Original Amount</div>
                    <div class="text-sm font-semibold text-slate-900 dark:text-white">
                      ${{ refund.originalAmount.toFixed(2) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">Requested Amount</div>
                    <div class="text-sm font-semibold text-slate-900 dark:text-white">
                      ${{ refund.requestedAmount.toFixed(2) }}
                    </div>
                  </div>
                  <div v-if="refund.approvedAmount">
                    <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">Approved Amount</div>
                    <div class="text-sm font-semibold text-green-600 dark:text-green-400">
                      ${{ refund.approvedAmount.toFixed(2) }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">Platform Fee</div>
                    <div class="text-sm font-semibold text-slate-900 dark:text-white">
                      ${{ refund.fee.toFixed(2) }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 lg:flex-col">
            <BaseButton variant="primary" size="sm" @click="handleViewDetail(refund.id)">
              <DocumentTextIcon class="w-4 h-4" />
              View Details
            </BaseButton>
            <BaseButton
              v-if="refund.status === 'pending'"
              variant="success"
              size="sm"
              @click="handleApprove(refund.id)"
            >
              <CheckCircleIcon class="w-4 h-4" />
              Approve
            </BaseButton>
            <BaseButton
              v-if="refund.status === 'approved' || refund.status === 'pending'"
              variant="warning"
              size="sm"
              @click="handleProcessRefund(refund.id)"
            >
              <CalculatorIcon class="w-4 h-4" />
              Process Refund
            </BaseButton>
            <BaseButton
              v-if="refund.status === 'pending'"
              variant="danger"
              size="sm"
              @click="handleReject(refund.id)"
            >
              <XCircleIcon class="w-4 h-4" />
              Reject
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
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
      :icon="ArrowPathIcon"
      title="No refund requests found"
      description="No refund requests match your current filters. Try adjusting your search criteria."
    />
  </div>
</template>
