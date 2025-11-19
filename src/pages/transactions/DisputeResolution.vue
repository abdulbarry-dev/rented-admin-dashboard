<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
import ItemStatsCard from '@/components/items/ItemStatsCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

interface Dispute {
  id: number
  disputeId: string
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
  disputeType: 'item_not_as_described' | 'item_not_received' | 'damage' | 'refund_not_received' | 'other'
  reason: string
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
  priority: 'high' | 'medium' | 'low'
  filedBy: 'buyer' | 'seller'
  filedDate: string
  amount: number
  evidence: Array<{
    id: number
    type: 'image' | 'document' | 'message'
    url: string
    uploadedBy: string
    uploadedAt: string
  }>
  messages: Array<{
    id: number
    sender: string
    message: string
    timestamp: string
  }>
}

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 15

// Filters
const searchQuery = ref('')
const selectedStatus = ref<'all' | 'pending' | 'investigating' | 'resolved' | 'dismissed'>('all')
const selectedPriority = ref<'all' | 'high' | 'medium' | 'low'>('all')
const selectedType = ref<'all' | 'item_not_as_described' | 'item_not_received' | 'damage' | 'refund_not_received' | 'other'>('all')
const sortBy = ref<'newest' | 'oldest' | 'priority'>('newest')

// Mock dispute data
const disputes = ref<Dispute[]>([
  {
    id: 1,
    disputeId: 'DSP-2024-0001',
    transactionId: 'TXN-2024-001236',
    transactionType: 'purchase',
    itemTitle: 'Designer Leather Jacket',
    buyer: { id: 5, name: 'Robert Johnson', email: 'robert@example.com' },
    seller: { id: 6, name: 'Fashion Boutique', email: 'fashion@example.com' },
    disputeType: 'item_not_as_described',
    reason: 'Item received is significantly different from the description and photos. Condition is poor.',
    status: 'pending',
    priority: 'high',
    filedBy: 'buyer',
    filedDate: '2024-11-19',
    amount: 180.00,
    evidence: [
      { id: 1, type: 'image', url: '#', uploadedBy: 'Robert Johnson', uploadedAt: '2024-11-19 10:00 AM' },
      { id: 2, type: 'document', url: '#', uploadedBy: 'Robert Johnson', uploadedAt: '2024-11-19 10:15 AM' }
    ],
    messages: [
      { id: 1, sender: 'Robert Johnson', message: 'The item I received does not match the description at all.', timestamp: '2024-11-19 10:00 AM' },
      { id: 2, sender: 'Fashion Boutique', message: 'We stand by our product description. The item is authentic.', timestamp: '2024-11-19 2:30 PM' }
    ]
  },
  {
    id: 2,
    disputeId: 'DSP-2024-0002',
    transactionId: 'TXN-2024-001240',
    transactionType: 'rental',
    itemTitle: 'Camping Tent - 4 Person',
    buyer: { id: 13, name: 'David Martinez', email: 'david@example.com' },
    seller: { id: 14, name: 'Outdoor Gear', email: 'outdoor@example.com' },
    disputeType: 'damage',
    reason: 'Tent was returned with damage that was not present when rented. Seeking compensation for repair costs.',
    status: 'investigating',
    priority: 'medium',
    filedBy: 'seller',
    filedDate: '2024-11-20',
    amount: 120.00,
    evidence: [
      { id: 3, type: 'image', url: '#', uploadedBy: 'Outdoor Gear', uploadedAt: '2024-11-20 9:00 AM' }
    ],
    messages: [
      { id: 3, sender: 'Outdoor Gear', message: 'The tent was returned with significant damage to the zipper and a tear in the fabric.', timestamp: '2024-11-20 9:00 AM' },
      { id: 4, sender: 'David Martinez', message: 'The tent was already damaged when I received it. I did not cause any additional damage.', timestamp: '2024-11-20 3:15 PM' }
    ]
  },
  {
    id: 3,
    disputeId: 'DSP-2024-0003',
    transactionId: 'TXN-2024-001242',
    transactionType: 'purchase',
    itemTitle: 'Smart Home Security System',
    buyer: { id: 17, name: 'Tom Wilson', email: 'tom@example.com' },
    seller: { id: 18, name: 'Home Security Co', email: 'security@example.com' },
    disputeType: 'item_not_received',
    reason: 'Item was marked as delivered but I never received it. Tracking shows delivered to wrong address.',
    status: 'investigating',
    priority: 'high',
    filedBy: 'buyer',
    filedDate: '2024-11-21',
    amount: 899.00,
    evidence: [
      { id: 4, type: 'document', url: '#', uploadedBy: 'Tom Wilson', uploadedAt: '2024-11-21 11:00 AM' }
    ],
    messages: [
      { id: 5, sender: 'Tom Wilson', message: 'The tracking shows it was delivered but I never received the package.', timestamp: '2024-11-21 11:00 AM' }
    ]
  },
  {
    id: 4,
    disputeId: 'DSP-2024-0004',
    transactionId: 'TXN-2024-001244',
    transactionType: 'rental',
    itemTitle: 'Professional Camera Lens',
    buyer: { id: 21, name: 'Sam Wilson', email: 'sam@example.com' },
    seller: { id: 20, name: 'Photo Rentals', email: 'photo@example.com' },
    disputeType: 'other',
    reason: 'Rental period was extended but I was charged additional fees without notification.',
    status: 'pending',
    priority: 'low',
    filedBy: 'buyer',
    filedDate: '2024-11-21',
    amount: 420.00,
    evidence: [],
    messages: [
      { id: 6, sender: 'Sam Wilson', message: 'I extended the rental but was charged unexpected fees.', timestamp: '2024-11-21 2:00 PM' }
    ]
  },
  {
    id: 5,
    disputeId: 'DSP-2024-0005',
    transactionId: 'TXN-2024-001239',
    transactionType: 'purchase',
    itemTitle: 'Gaming Console Bundle',
    buyer: { id: 11, name: 'Sarah Wilson', email: 'sarah@example.com' },
    seller: { id: 12, name: 'Game Zone', email: 'game@example.com' },
    disputeType: 'refund_not_received',
    reason: 'Refund was approved but I have not received the money back to my account after 7 business days.',
    status: 'resolved',
    priority: 'medium',
    filedBy: 'buyer',
    filedDate: '2024-11-16',
    amount: 550.00,
    evidence: [],
    messages: [
      { id: 7, sender: 'Sarah Wilson', message: 'I requested a refund and it was approved but I have not received it.', timestamp: '2024-11-16 10:00 AM' },
      { id: 8, sender: 'Admin', message: 'Refund has been processed and should appear in your account within 2-3 business days.', timestamp: '2024-11-18 3:00 PM' }
    ]
  }
])

// Filtered disputes
const filteredDisputes = computed(() => {
  let result = [...disputes.value]

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(
      d =>
        d.disputeId.toLowerCase().includes(search) ||
        d.transactionId.toLowerCase().includes(search) ||
        d.itemTitle.toLowerCase().includes(search) ||
        d.buyer.name.toLowerCase().includes(search) ||
        d.seller.name.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (selectedStatus.value !== 'all') {
    result = result.filter(d => d.status === selectedStatus.value)
  }

  // Priority filter
  if (selectedPriority.value !== 'all') {
    result = result.filter(d => d.priority === selectedPriority.value)
  }

  // Type filter
  if (selectedType.value !== 'all') {
    result = result.filter(d => d.disputeType === selectedType.value)
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.filedDate).getTime() - new Date(a.filedDate).getTime()
      case 'oldest':
        return new Date(a.filedDate).getTime() - new Date(b.filedDate).getTime()
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      default:
        return 0
    }
  })

  return result
})

// Paginated disputes
const paginatedDisputes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredDisputes.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredDisputes.value.length / itemsPerPage))

// Stats
const stats = computed(() => ({
  total: disputes.value.length,
  pending: disputes.value.filter(d => d.status === 'pending').length,
  investigating: disputes.value.filter(d => d.status === 'investigating').length,
  resolved: disputes.value.filter(d => d.status === 'resolved').length,
  highPriority: disputes.value.filter(d => d.priority === 'high' && (d.status === 'pending' || d.status === 'investigating')).length
}))

// Status variant
const getStatusVariant = (status: string) => {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    pending: 'warning',
    investigating: 'info',
    resolved: 'success',
    dismissed: 'default'
  }
  return statusMap[status] || 'default'
}

const getPriorityVariant = (priority: string) => {
  const priorityMap: Record<string, 'danger' | 'warning' | 'info'> = {
    high: 'danger',
    medium: 'warning',
    low: 'info'
  }
  return priorityMap[priority] || 'info'
}

const getDisputeTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    item_not_as_described: 'Item Not as Described',
    item_not_received: 'Item Not Received',
    damage: 'Damage',
    refund_not_received: 'Refund Not Received',
    other: 'Other'
  }
  return typeMap[type] || type
}

// Reset page when filters change
watch([searchQuery, selectedStatus, selectedPriority, selectedType, sortBy], () => {
  currentPage.value = 1
})

// Actions
const handleViewDetail = (disputeId: number) => {
  router.push(`/transactions/disputes/${disputeId}`)
}

const handleInvestigate = (disputeId: number) => {
  const dispute = disputes.value.find(d => d.id === disputeId)
  if (dispute) {
    dispute.status = 'investigating'
  }
}

const handleResolve = (disputeId: number) => {
  router.push(`/transactions/disputes/${disputeId}?action=resolve`)
}

const handleDismiss = (disputeId: number) => {
  const dispute = disputes.value.find(d => d.id === disputeId)
  if (dispute) {
    dispute.status = 'dismissed'
  }
}

const handleExport = () => {
  console.log('Exporting disputes...')
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedPriority.value = 'all'
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
            Dispute Resolution
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Review and resolve transaction disputes between buyers and sellers
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
        label="Total Disputes"
        :value="stats.total.toLocaleString()"
        :icon="ExclamationCircleIcon"
        color="blue"
      />
      <ItemStatsCard
        label="Pending Review"
        :value="stats.pending.toLocaleString()"
        :icon="ClockIcon"
        color="orange"
      />
      <ItemStatsCard
        label="Under Investigation"
        :value="stats.investigating.toLocaleString()"
        :icon="EyeIcon"
        color="purple"
      />
      <ItemStatsCard
        label="High Priority"
        :value="stats.highPriority.toLocaleString()"
        :icon="ExclamationTriangleIcon"
        color="red"
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
            placeholder="Search by dispute ID, transaction ID, item, buyer, or seller..."
            class="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Priority
          </label>
          <select
            v-model="selectedPriority"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <!-- Type Filter -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Dispute Type
          </label>
          <select
            v-model="selectedType"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="item_not_as_described">Item Not as Described</option>
            <option value="item_not_received">Item Not Received</option>
            <option value="damage">Damage</option>
            <option value="refund_not_received">Refund Not Received</option>
            <option value="other">Other</option>
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
            <option value="priority">Priority (High to Low)</option>
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
        Showing {{ filteredDisputes.length }} of {{ disputes.length }} disputes
      </div>
    </div>

    <!-- Loading State -->
    <SkeletonLoader v-if="loading" variant="list" :count="6" />

    <!-- Disputes List -->
    <div v-else-if="paginatedDisputes.length > 0" class="space-y-4">
      <div
        v-for="dispute in paginatedDisputes"
        :key="dispute.id"
        class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <!-- Dispute Info -->
          <div class="flex-1">
            <div class="flex items-start gap-3 mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                    {{ dispute.disputeId }}
                  </h3>
                  <BaseBadge :variant="getPriorityVariant(dispute.priority)" size="sm">
                    {{ dispute.priority.toUpperCase() }}
                  </BaseBadge>
                  <BaseBadge :variant="getStatusVariant(dispute.status)" size="sm">
                    {{ dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1) }}
                  </BaseBadge>
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Transaction: <span class="font-medium">{{ dispute.transactionId }}</span> • {{ dispute.transactionType.charAt(0).toUpperCase() + dispute.transactionType.slice(1) }}
                </div>
                <div class="text-base font-medium text-slate-900 dark:text-white mb-2">
                  {{ dispute.itemTitle }}
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  <span class="font-medium">Filed by:</span> {{ dispute.filedBy === 'buyer' ? dispute.buyer.name : dispute.seller.name }} on {{ dispute.filedDate }}
                </div>
                <div class="mb-3">
                  <BaseBadge variant="default" size="sm">
                    {{ getDisputeTypeLabel(dispute.disputeType) }}
                  </BaseBadge>
                </div>
                <div class="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 mb-3">
                  <span class="font-medium">Reason:</span> {{ dispute.reason }}
                </div>
                <div class="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                  <div class="flex items-center gap-1">
                    <DocumentTextIcon class="w-4 h-4" />
                    <span>{{ dispute.evidence.length }} evidence</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <ChatBubbleLeftRightIcon class="w-4 h-4" />
                    <span>{{ dispute.messages.length }} messages</span>
                  </div>
                  <div class="font-semibold text-slate-900 dark:text-white">
                    Amount: ${{ dispute.amount.toFixed(2) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 lg:flex-col">
            <BaseButton variant="primary" size="sm" @click="handleViewDetail(dispute.id)">
              <EyeIcon class="w-4 h-4" />
              View Details
            </BaseButton>
            <BaseButton
              v-if="dispute.status === 'pending'"
              variant="warning"
              size="sm"
              @click="handleInvestigate(dispute.id)"
            >
              Start Investigation
            </BaseButton>
            <BaseButton
              v-if="dispute.status !== 'resolved' && dispute.status !== 'dismissed'"
              variant="success"
              size="sm"
              @click="handleResolve(dispute.id)"
            >
              <CheckCircleIcon class="w-4 h-4" />
              Resolve
            </BaseButton>
            <BaseButton
              v-if="dispute.status !== 'dismissed'"
              variant="secondary"
              size="sm"
              @click="handleDismiss(dispute.id)"
            >
              <XCircleIcon class="w-4 h-4" />
              Dismiss
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
      :icon="ExclamationCircleIcon"
      title="No disputes found"
      description="No disputes match your current filters. Try adjusting your search criteria."
    />
  </div>
</template>