<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  FunnelIcon
} from '@heroicons/vue/24/outline'
import ItemStatsCard from '@/components/items/ItemStatsCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

interface Report {
  id: number
  itemId: number
  itemTitle: string
  itemImage?: string
  reportType: string
  priority: 'high' | 'medium' | 'low'
  reason: string
  reportedBy: string
  reportDate: string
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed'
}

const router = useRouter()
const loading = ref(false)
const selectedFilter = ref('all')
const selectedPriority = ref('all')

// Mock reports data
const reports = ref<Report[]>([
  {
    id: 1,
    itemId: 3,
    itemTitle: 'Designer Leather Jacket',
    itemImage: undefined,
    reportType: 'Prohibited Item',
    priority: 'high',
    reason: 'Suspected counterfeit designer item',
    reportedBy: 'John Doe',
    reportDate: '2024-11-20',
    status: 'pending'
  },
  {
    id: 2,
    itemId: 2,
    itemTitle: 'Modern Office Chair',
    reportType: 'Misleading Description',
    priority: 'medium',
    reason: 'Item condition significantly worse than advertised',
    reportedBy: 'Jane Smith',
    reportDate: '2024-11-19',
    status: 'investigating'
  },
  {
    id: 3,
    itemId: 1,
    itemTitle: 'Premium Wireless Headphones',
    reportType: 'Suspicious Activity',
    priority: 'high',
    reason: 'Item matches police report for stolen goods',
    reportedBy: 'Security Team',
    reportDate: '2024-11-19',
    status: 'pending'
  },
  {
    id: 4,
    itemId: 9,
    itemTitle: 'Electric Guitar with Amp',
    reportType: 'Policy Violation',
    priority: 'high',
    reason: 'Photos contain inappropriate content',
    reportedBy: 'Multiple Users',
    reportDate: '2024-11-18',
    status: 'investigating'
  },
  {
    id: 5,
    itemId: 12,
    itemTitle: 'Kids Toy Collection',
    reportType: 'Price Gouging',
    priority: 'low',
    reason: 'Item priced significantly above market value',
    reportedBy: 'Anonymous',
    reportDate: '2024-11-18',
    status: 'dismissed'
  },
  {
    id: 6,
    itemId: 7,
    itemTitle: 'Camping Tent - 4 Person',
    reportType: 'Spam',
    priority: 'low',
    reason: 'Same item listed multiple times',
    reportedBy: 'Community Moderator',
    reportDate: '2024-11-17',
    status: 'resolved'
  }
])

const filteredReports = computed(() => {
  let filtered = reports.value

  if (selectedFilter.value !== 'all') {
    filtered = filtered.filter(r => r.status === selectedFilter.value)
  }

  if (selectedPriority.value !== 'all') {
    filtered = filtered.filter(r => r.priority === selectedPriority.value)
  }

  return filtered
})

const stats = computed(() => ({
  pending: reports.value.filter(r => r.status === 'pending').length,
  investigating: reports.value.filter(r => r.status === 'investigating').length,
  resolved: reports.value.filter(r => r.status === 'resolved').length,
  highPriority: reports.value.filter(r => r.priority === 'high' && r.status !== 'resolved' && r.status !== 'dismissed').length
}))

// Removed unused getPriorityColor function

// Removed unused getStatusColor function

const handleViewItem = (itemId: number) => {
  router.push(`/items/${itemId}`)
}

const handleInvestigate = (reportId: number) => {
  const report = reports.value.find(r => r.id === reportId)
  if (report) {
    report.status = 'investigating'
  }
}

const handleResolve = (reportId: number) => {
  const report = reports.value.find(r => r.id === reportId)
  if (report) {
    report.status = 'resolved'
  }
}

const handleDismiss = (reportId: number) => {
  const report = reports.value.find(r => r.id === reportId)
  if (report) {
    report.status = 'dismissed'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
        Reported Items
      </h1>
      <p class="text-slate-600 dark:text-slate-400">
        Review and moderate user-reported content
      </p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <ItemStatsCard
        label="Pending Review"
        :value="stats.pending.toString()"
        :icon="ExclamationTriangleIcon"
        color="yellow"
      />
      <ItemStatsCard
        label="Investigating"
        :value="stats.investigating.toString()"
        :icon="EyeIcon"
        color="blue"
      />
      <ItemStatsCard
        label="Resolved"
        :value="stats.resolved.toString()"
        :icon="CheckCircleIcon"
        color="green"
      />
      <ItemStatsCard
        label="High Priority"
        :value="stats.highPriority.toString()"
        :icon="ExclamationTriangleIcon"
        color="red"
      />
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mb-6">
      <div class="flex items-center gap-2 mb-4">
        <FunnelIcon class="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <h3 class="font-semibold text-slate-900 dark:text-white">Filters</h3>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Status
          </label>
          <select
            v-model="selectedFilter"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Reports</option>
            <option value="pending">Pending</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
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
      </div>
    </div>

    <!-- Loading State -->
    <SkeletonLoader v-if="loading" variant="list" :count="6" />

    <!-- Reports List -->
    <div v-else-if="filteredReports.length > 0" class="space-y-4">
      <div
        v-for="report in filteredReports"
        :key="report.id"
        class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- Report Info -->
          <div class="flex-1">
            <div class="flex items-start gap-4 mb-3">
              <!-- Item Image Placeholder -->
              <div class="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-lg flex-shrink-0"></div>

              <div class="flex-1">
                <div class="flex items-start gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                    {{ report.itemTitle }}
                  </h3>
                  <BaseBadge
                    :variant="report.priority === 'high' ? 'danger' : report.priority === 'medium' ? 'warning' : 'info'"
                    size="sm"
                  >
                    {{ report.priority.toUpperCase() }}
                  </BaseBadge>
                  <BaseBadge
                    :variant="report.status === 'pending' ? 'warning' : report.status === 'investigating' ? 'info' : report.status === 'resolved' ? 'success' : 'default'"
                    size="sm"
                  >
                    {{ report.status.charAt(0).toUpperCase() + report.status.slice(1) }}
                  </BaseBadge>
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                  <p><strong>Type:</strong> {{ report.reportType }}</p>
                  <p><strong>Reason:</strong> {{ report.reason }}</p>
                  <p><strong>Reported by:</strong> {{ report.reportedBy }} on {{ report.reportDate }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2">
            <BaseButton variant="primary" size="sm" @click="handleViewItem(report.itemId)">
              <EyeIcon class="w-4 h-4" />
              View Item
            </BaseButton>
            <BaseButton
              v-if="report.status === 'pending'"
              variant="warning"
              size="sm"
              @click="handleInvestigate(report.id)"
            >
              Investigate
            </BaseButton>
            <BaseButton
              v-if="report.status !== 'resolved'"
              variant="success"
              size="sm"
              @click="handleResolve(report.id)"
            >
              <CheckCircleIcon class="w-4 h-4" />
              Resolve
            </BaseButton>
            <BaseButton
              v-if="report.status !== 'dismissed'"
              variant="secondary"
              size="sm"
              @click="handleDismiss(report.id)"
            >
              <XCircleIcon class="w-4 h-4" />
              Dismiss
            </BaseButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      :icon="CheckCircleIcon"
      title="No reports found"
      description="All reported items have been reviewed."
    />
  </div>
</template>
