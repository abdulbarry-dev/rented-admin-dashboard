<template>
  <div>
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Verification Queue</h1>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">Review and process pending ID verification submissions</p>
      </div>
      <div class="flex items-center gap-3">
        <BaseButton variant="secondary" @click="refreshQueue" :icon="ArrowPathIcon">
          <span :class="{ 'animate-spin': isLoading }">Refresh</span>
        </BaseButton>
        <BaseButton variant="primary" @click="$router.push('/verification/bulk')" :icon="QueueListIcon">
          Bulk Actions
        </BaseButton>
      </div>
    </div>

    <!-- Queue Statistics -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <StatCard
        label="Total Pending"
        :value="stats.totalPending"
        :icon="ClockIcon"
        variant="primary"
      />
      <StatCard
        label="High Priority"
        :value="stats.highPriority"
        :icon="ExclamationTriangleIcon"
        variant="danger"
      />
      <StatCard
        label="Avg Wait Time"
        :value="`${stats.avgWaitTime}h`"
        :icon="CheckCircleIcon"
        variant="success"
      />
    </div>

    <!-- Filters & Search -->
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700">
      <div class="flex flex-col lg:flex-row gap-4">
        <!-- Search -->
        <div class="relative flex-1">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, or submission ID..."
            class="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            @input="debouncedSearch"
          />
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-3">
          <select v-model="filters.riskLevel" @change="applyFilters" class="pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer">
            <option value="">All Risk Levels</option>
            <option value="low">Low (0-30)</option>
            <option value="medium">Medium (31-60)</option>
            <option value="high">High (61-100)</option>
          </select>

          <select v-model="filters.priority" @change="applyFilters" class="pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer">
            <option value="">All Priorities</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          <select v-model="sortBy" @change="applyFilters" class="pl-4 pr-10 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest_risk">Highest Risk</option>
            <option value="priority">Priority First</option>
            <option value="longest_wait">Longest Wait</option>
          </select>

          <BaseButton variant="ghost" @click="clearFilters" :icon="XMarkIcon" size="sm">
            Clear
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Bulk Selection Toolbar -->
    <Transition
      enter-active-class="transition-all duration-200"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div v-if="selectedIds.length > 0" class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            :checked="selectedIds.length === submissions.length"
            @change="toggleSelectAll"
            class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
          />
          <span class="font-medium text-gray-900 dark:text-white">{{ selectedIds.length }} selected</span>
        </div>
        <div class="flex items-center gap-2">
          <BaseButton variant="secondary" size="sm" @click="bulkAssign" :icon="UserGroupIcon">
            Assign
          </BaseButton>
          <BaseButton variant="secondary" size="sm" @click="bulkFlag" :icon="FlagIcon">
            Flag
          </BaseButton>
          <BaseButton variant="danger" size="sm" @click="clearSelection" :icon="XMarkIcon">
            Clear
          </BaseButton>
        </div>
      </div>
    </Transition>

    <!-- Submissions Table -->
    <div class="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16">
        <div class="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-400">Loading verifications...</p>
      </div>

      <div v-else-if="submissions.length === 0" class="flex flex-col items-center justify-center py-16">
        <DocumentMagnifyingGlassIcon class="w-16 h-16 text-gray-400 mb-4" />
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">No verifications found</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">There are no pending verifications matching your criteria.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th class="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  :checked="selectedIds.length === submissions.length && submissions.length > 0"
                  @change="toggleSelectAll"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                />
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">User</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Submission Info</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Document</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Risk</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Wait Time</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="submission in submissions"
              :key="submission.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              :class="{ 'bg-blue-50 dark:bg-blue-900/10': selectedIds.includes(submission.id) }"
            >
              <td class="px-6 py-4">
                <input
                  type="checkbox"
                  :checked="selectedIds.includes(submission.id)"
                  @change="toggleSelection(submission.id)"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
                />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <img v-if="submission.userPhoto" :src="submission.userPhoto" :alt="submission.userName" class="w-10 h-10 rounded-full" />
                  <AvatarFallback v-else :full-name="submission.userName" size="md" />
                  <div>
                    <div class="font-medium text-gray-900 dark:text-white">{{ submission.userName }}</div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ submission.userEmail }}</div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-gray-900 dark:text-white font-mono">ID: {{ submission.id }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ formatDate(submission.submittedAt) }}</div>
                <BaseBadge v-if="submission.priority === 'urgent'" variant="danger" size="sm" class="mt-1">URGENT</BaseBadge>
                <BaseBadge v-else-if="submission.priority === 'high'" variant="warning" size="sm" class="mt-1">HIGH</BaseBadge>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm text-gray-900 dark:text-white">{{ formatDocumentType(submission.documentType) }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      :class="getRiskBarClass(submission.riskScore)"
                      :style="{ width: submission.riskScore + '%' }"
                      class="h-full rounded-full transition-all"
                    ></div>
                  </div>
                  <span class="text-sm font-medium" :class="getRiskTextClass(submission.riskScore)">{{ submission.riskScore }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="text-sm font-medium"
                  :class="submission.waitTimeHours > 48 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'"
                >
                  {{ submission.waitTimeHours }}h
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="viewDetails(submission.id)"
                    title="View Details"
                    class="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <EyeIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="quickApprove(submission)"
                    title="Quick Approve"
                    class="p-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                  >
                    <CheckIcon class="w-4 h-4" />
                  </button>
                  <button
                    @click="quickReject(submission)"
                    title="Quick Reject"
                    class="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 flex justify-center">
      <vue-awesome-paginate
        :total-items="submissions.length"
        :items-per-page="20"
        :max-pages-shown="5"
        v-model="currentPage"
        :on-click="onChangePage"
        :show-ending-buttons="true"
        :show-breakpoint-buttons="false"
      />
    </div>

    <!-- Quick Approve Modal -->
    <BaseModal v-model:show="showApproveModal" title="Confirm Approval" size="md">
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300">
          Are you sure you want to approve the verification for <strong class="text-gray-900 dark:text-white">{{ selectedSubmission?.userName }}</strong>?
        </p>
        <p class="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
          ⚠️ This action cannot be undone.
        </p>
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="showApproveModal = false">Cancel</BaseButton>
        <BaseButton variant="success" @click="confirmApprove">Approve</BaseButton>
      </template>
    </BaseModal>

    <!-- Quick Reject Modal -->
    <BaseModal v-model:show="showRejectModal" title="Reject Verification" size="md">
      <div class="space-y-4">
        <p class="text-gray-700 dark:text-gray-300 mb-4">
          Reject verification for <strong class="text-gray-900 dark:text-white">{{ selectedSubmission?.userName }}</strong>
        </p>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Rejection Reason</label>
          <select
            v-model="rejectionReason"
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a reason...</option>
            <option value="expired">Document expired</option>
            <option value="unclear">Document unclear/unreadable</option>
            <option value="photo_mismatch">Photo doesn't match</option>
            <option value="tampered">Document appears tampered</option>
            <option value="incomplete">Incomplete information</option>
            <option value="wrong_type">Wrong document type</option>
            <option value="suspected_fraud">Suspected fraud</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Additional Details (Optional)</label>
          <textarea
            v-model="rejectionDetails"
            placeholder="Provide more context..."
            rows="3"
            class="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          ></textarea>
        </div>
      </div>
      <template #footer>
        <BaseButton variant="secondary" @click="showRejectModal = false">Cancel</BaseButton>
        <BaseButton variant="danger" :disabled="!rejectionReason" @click="confirmReject">Reject</BaseButton>
      </template>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { VueAwesomePaginate } from 'vue-awesome-paginate'
import {
  ArrowPathIcon,
  QueueListIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  UserGroupIcon,
  FlagIcon,
  DocumentMagnifyingGlassIcon,
  EyeIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

// Components
import StatCard from '@/components/verification/StatCard.vue'
import BaseButton from '@/components/verification/BaseButton.vue'
import BaseModal from '@/components/verification/BaseModal.vue'
import BaseBadge from '@/components/verification/BaseBadge.vue'
import AvatarFallback from '@/components/verification/AvatarFallback.vue'

const router = useRouter()

interface Submission {
  id: string
  userId: string
  userName: string
  userEmail: string
  userPhoto: string | null
  submittedAt: string
  documentType: string
  riskScore: number
  priority: 'normal' | 'high' | 'urgent'
  waitTimeHours: number
  status: string
}

// State
const isLoading = ref(false)
const allSubmissions = ref<Submission[]>([])
const submissions = ref<Submission[]>([])
const selectedIds = ref<string[]>([])
let searchDebounceTimer: number | undefined
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const selectedSubmission = ref<Submission | null>(null)
const rejectionReason = ref('')
const rejectionDetails = ref('')

const filters = ref({
  riskLevel: '',
  priority: ''
})

const sortBy = ref('newest')

const stats = ref({
  totalPending: 0,
  highPriority: 0,
  avgWaitTime: 0
})

// Methods
const refreshQueue = async () => {
  isLoading.value = true
  try {
    await fetchSubmissions()
  } finally {
    isLoading.value = false
  }
}

const fetchSubmissions = async () => {
  // Mock data - in production, this would be an API call
  const mockData = [
    {
      id: 'VER-2024-001',
      userId: 'USR-001',
      userName: 'Sarah Johnson',
      userEmail: 'sarah.j@example.com',
      userPhoto: null,
      submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
      documentType: 'National ID',
      riskScore: 15,
      priority: 'normal' as const,
      waitTimeHours: 2,
      status: 'pending'
    },
    {
      id: 'VER-2024-002',
      userId: 'USR-002',
      userName: 'Michael Chen',
      userEmail: 'michael.chen@example.com',
      userPhoto: null,
      submittedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
      documentType: 'National ID',
      riskScore: 72,
      priority: 'urgent' as const,
      waitTimeHours: 24,
      status: 'pending'
    },
    {
      id: 'VER-2024-003',
      userId: 'USR-003',
      userName: 'Emily Rodriguez',
      userEmail: 'emily.r@example.com',
      userPhoto: null,
      submittedAt: new Date(Date.now() - 6 * 3600000).toISOString(),
      documentType: 'National ID',
      riskScore: 45,
      priority: 'high' as const,
      waitTimeHours: 6,
      status: 'pending'
    },
    {
      id: 'VER-2024-004',
      userId: 'USR-004',
      userName: 'David Kim',
      userEmail: 'david.kim@example.com',
      userPhoto: null,
      submittedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
      documentType: 'National ID',
      riskScore: 28,
      priority: 'normal' as const,
      waitTimeHours: 72,
      status: 'pending'
    },
    {
      id: 'VER-2024-005',
      userId: 'USR-005',
      userName: 'Jessica Martinez',
      userEmail: 'jessica.m@example.com',
      userPhoto: null,
      submittedAt: new Date(Date.now() - 12 * 3600000).toISOString(),
      documentType: 'National ID',
      riskScore: 55,
      priority: 'high' as const,
      waitTimeHours: 12,
      status: 'pending'
    },
    {
      id: 'VER-2024-006',
      userId: 'USR-006',
      userName: 'Robert Taylor',
      userEmail: 'robert.t@example.com',
      userPhoto: null,
      submittedAt: new Date(Date.now() - 48 * 3600000).toISOString(),
      documentType: 'National ID',
      riskScore: 22,
      priority: 'normal' as const,
      waitTimeHours: 48,
      status: 'pending'
    }
  ]

  allSubmissions.value = mockData

  stats.value = {
    totalPending: mockData.length,
    highPriority: mockData.filter(s => s.priority === 'high' || s.priority === 'urgent').length,
    avgWaitTime: Math.round(mockData.reduce((sum, s) => sum + s.waitTimeHours, 0) / mockData.length)
  }

  applyFilters()
}

const applyFilters = () => {
  let filtered = [...allSubmissions.value]

  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(sub =>
      sub.userName.toLowerCase().includes(query) ||
      sub.userEmail.toLowerCase().includes(query) ||
      sub.id.toLowerCase().includes(query)
    )
  }

  // Apply risk level filter
  if (filters.value.riskLevel) {
    filtered = filtered.filter(sub => {
      const score = sub.riskScore
      switch (filters.value.riskLevel) {
        case 'low':
          return score >= 0 && score <= 30
        case 'medium':
          return score > 30 && score <= 60
        case 'high':
          return score > 60 && score <= 100
        default:
          return true
      }
    })
  }

  // Apply priority filter
  if (filters.value.priority) {
    filtered = filtered.filter(sub => sub.priority === filters.value.priority)
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      break
    case 'oldest':
      filtered.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime())
      break
    case 'highest_risk':
      filtered.sort((a, b) => b.riskScore - a.riskScore)
      break
    case 'priority':
      const priorityOrder = { urgent: 3, high: 2, normal: 1 }
      filtered.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])
      break
    case 'longest_wait':
      filtered.sort((a, b) => b.waitTimeHours - a.waitTimeHours)
      break
  }

  submissions.value = filtered
  totalPages.value = Math.ceil(filtered.length / 20)
}

const clearFilters = () => {
  filters.value = {
    riskLevel: '',
    priority: ''
  }
  sortBy.value = 'newest'
  searchQuery.value = ''
  applyFilters()
}

const debouncedSearch = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
  }
  searchDebounceTimer = window.setTimeout(() => {
    applyFilters()
  }, 300)
}

const toggleSelectAll = () => {
  if (selectedIds.value.length === submissions.value.length) {
    selectedIds.value = []
  } else {
    selectedIds.value = submissions.value.map(s => s.id)
  }
}

const toggleSelection = (id: string) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

const clearSelection = () => {
  selectedIds.value = []
}

const bulkAssign = () => {
  console.log('Bulk assign:', selectedIds.value)
}

const bulkFlag = () => {
  console.log('Bulk flag:', selectedIds.value)
}

const viewDetails = (id: string) => {
  const submission = allSubmissions.value.find(s => s.id === id)
  router.push({
    name: 'verification-detail',
    params: { id },
    state: { verification: submission }
  })
}

const quickApprove = (submission: Submission) => {
  selectedSubmission.value = submission
  showApproveModal.value = true
}

const quickReject = (submission: Submission) => {
  selectedSubmission.value = submission
  showRejectModal.value = true
}

const confirmApprove = () => {
  console.log('Approving:', selectedSubmission.value?.id)
  showApproveModal.value = false
  selectedSubmission.value = null
}

const confirmReject = () => {
  console.log('Rejecting:', selectedSubmission.value?.id, rejectionReason.value, rejectionDetails.value)
  showRejectModal.value = false
  selectedSubmission.value = null
  rejectionReason.value = ''
  rejectionDetails.value = ''
}

const onChangePage = (page: number) => {
  currentPage.value = page
  console.log('Page changed:', page)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDocumentType = (type: string) => {
  return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const getRiskBarClass = (score: number) => {
  if (score < 30) return 'bg-green-500'
  if (score < 60) return 'bg-amber-500'
  return 'bg-red-500'
}

const getRiskTextClass = (score: number) => {
  if (score < 30) return 'text-green-600 dark:text-green-400'
  if (score < 60) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

onMounted(() => {
  fetchSubmissions()
})
</script>

<style scoped>
/* Custom select dropdown styling with theme-aware chevron */
select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.25em 1.25em;
}

:global(.dark) select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
}
</style>
