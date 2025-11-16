<template>
  <div class="verification-queue">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Verification Queue</h1>
        <p class="page-subtitle">Review and process pending ID verification submissions</p>
      </div>
      <div class="header-actions">
        <button class="action-btn secondary" @click="refreshQueue">
          <ArrowPathIcon class="icon" :class="{ 'spin': isLoading }" />
          <span>Refresh</span>
        </button>
        <button class="action-btn primary" @click="$router.push('/verification/bulk')">
          <QueueListIcon class="icon" />
          <span>Bulk Actions</span>
        </button>
      </div>
    </div>

    <!-- Queue Statistics -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon blue">
          <ClockIcon class="icon" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalPending }}</div>
          <div class="stat-label">Total Pending</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon red">
          <ExclamationTriangleIcon class="icon" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.highPriority }}</div>
          <div class="stat-label">High Priority</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <CheckCircleIcon class="icon" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.avgWaitTime }}h</div>
          <div class="stat-label">Avg Wait Time</div>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="filter-section">
      <div class="search-box">
        <MagnifyingGlassIcon class="search-icon" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, email, or submission ID..."
          class="search-input"
          @input="debouncedSearch"
        />
      </div>

      <div class="filter-controls">
        <select v-model="filters.documentType" class="filter-select" @change="applyFilters">
          <option value="">All Document Types</option>
          <option value="passport">Passport</option>
          <option value="drivers_license">Driver's License</option>
          <option value="national_id">National ID</option>
          <option value="residence_permit">Residence Permit</option>
        </select>

        <select v-model="filters.riskLevel" class="filter-select" @change="applyFilters">
          <option value="">All Risk Levels</option>
          <option value="low">Low (0-30)</option>
          <option value="medium">Medium (31-60)</option>
          <option value="high">High (61-100)</option>
        </select>

        <select v-model="filters.priority" class="filter-select" @change="applyFilters">
          <option value="">All Priorities</option>
          <option value="normal">Normal</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <select v-model="sortBy" class="filter-select" @change="applyFilters">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest_risk">Highest Risk</option>
          <option value="priority">Priority First</option>
          <option value="longest_wait">Longest Wait</option>
        </select>

        <button class="filter-btn" @click="clearFilters">
          <XMarkIcon class="icon" />
          Clear Filters
        </button>
      </div>
    </div>

    <!-- Bulk Selection Toolbar -->
    <transition name="slide-down">
      <div v-if="selectedIds.length > 0" class="bulk-toolbar">
        <div class="bulk-info">
          <input
            type="checkbox"
            :checked="selectedIds.length === submissions.length"
            @change="toggleSelectAll"
            class="checkbox"
          />
          <span class="bulk-count">{{ selectedIds.length }} selected</span>
        </div>
        <div class="bulk-actions">
          <button class="bulk-btn" @click="bulkAssign">
            <UserGroupIcon class="icon" />
            Assign
          </button>
          <button class="bulk-btn" @click="bulkFlag">
            <FlagIcon class="icon" />
            Flag
          </button>
          <button class="bulk-btn danger" @click="clearSelection">
            <XMarkIcon class="icon" />
            Clear
          </button>
        </div>
      </div>
    </transition>

    <!-- Submissions Table -->
    <div class="submissions-container">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading verifications...</p>
      </div>

      <div v-else-if="submissions.length === 0" class="empty-state">
        <DocumentMagnifyingGlassIcon class="empty-icon" />
        <h3>No verifications found</h3>
        <p>There are no pending verifications matching your criteria.</p>
      </div>

      <div v-else class="submissions-table">
        <div class="table-header">
          <div class="header-cell checkbox-cell">
            <input
              type="checkbox"
              :checked="selectedIds.length === submissions.length && submissions.length > 0"
              @change="toggleSelectAll"
              class="checkbox"
            />
          </div>
          <div class="header-cell">User</div>
          <div class="header-cell">Submission Info</div>
          <div class="header-cell">Document</div>
          <div class="header-cell">Risk</div>
          <div class="header-cell">Wait Time</div>
          <div class="header-cell">Actions</div>
        </div>

        <div
          v-for="submission in submissions"
          :key="submission.id"
          class="table-row"
          :class="{ selected: selectedIds.includes(submission.id) }"
        >
          <div class="table-cell checkbox-cell">
            <input
              type="checkbox"
              :checked="selectedIds.includes(submission.id)"
              @change="toggleSelection(submission.id)"
              class="checkbox"
            />
          </div>

          <div class="table-cell user-cell">
            <div v-if="submission.userPhoto" class="user-avatar">
              <img :src="submission.userPhoto" :alt="submission.userName" />
            </div>
            <div v-else class="user-avatar avatar-fallback">
              <span>{{ getInitials(submission.userName) }}</span>
            </div>
            <div class="user-info">
              <div class="user-name">{{ submission.userName }}</div>
              <div class="user-email">{{ submission.userEmail }}</div>
            </div>
          </div>

          <div class="table-cell">
            <div class="submission-id">ID: {{ submission.id }}</div>
            <div class="submission-date">{{ formatDate(submission.submittedAt) }}</div>
            <span v-if="submission.priority !== 'normal'" class="priority-badge" :class="submission.priority">
              {{ submission.priority.toUpperCase() }}
            </span>
          </div>

          <div class="table-cell">
            <div class="document-type">{{ formatDocumentType(submission.documentType) }}</div>
          </div>

          <div class="table-cell">
            <div class="risk-indicator" :class="getRiskClass(submission.riskScore)">
              <div class="risk-bar">
                <div class="risk-fill" :style="{ width: submission.riskScore + '%' }"></div>
              </div>
              <span class="risk-score">{{ submission.riskScore }}</span>
            </div>
          </div>

          <div class="table-cell">
            <div class="wait-time" :class="{ urgent: submission.waitTimeHours > 48 }">
              {{ submission.waitTimeHours }}h
            </div>
          </div>

          <div class="table-cell actions-cell">
            <button class="action-icon-btn" @click="viewDetails(submission.id)" title="View Details">
              <EyeIcon class="icon" />
            </button>
            <button class="action-icon-btn success" @click="quickApprove(submission)" title="Quick Approve">
              <CheckIcon class="icon" />
            </button>
            <button class="action-icon-btn danger" @click="quickReject(submission)" title="Quick Reject">
              <XMarkIcon class="icon" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        class="page-btn"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        <ChevronLeftIcon class="icon" />
        Previous
      </button>

      <div class="page-numbers">
        <button
          v-for="page in displayedPages"
          :key="page"
          class="page-number"
          :class="{ active: page === currentPage }"
          @click="changePage(page)"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="page-btn"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next
        <ChevronRightIcon class="icon" />
      </button>
    </div>

    <!-- Quick Approve Modal -->
    <teleport to="body">
      <div v-if="showApproveModal" class="modal-overlay" @click="showApproveModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Confirm Approval</h3>
            <button class="modal-close" @click="showApproveModal = false">
              <XMarkIcon class="icon" />
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to approve the verification for <strong>{{ selectedSubmission?.userName }}</strong>?</p>
            <p class="modal-warning">This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
            <button class="btn secondary" @click="showApproveModal = false">Cancel</button>
            <button class="btn success" @click="confirmApprove">Approve</button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Quick Reject Modal -->
    <teleport to="body">
      <div v-if="showRejectModal" class="modal-overlay" @click="showRejectModal = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Reject Verification</h3>
            <button class="modal-close" @click="showRejectModal = false">
              <XMarkIcon class="icon" />
            </button>
          </div>
          <div class="modal-body">
            <p>Reject verification for <strong>{{ selectedSubmission?.userName }}</strong></p>
            <label class="form-label">Rejection Reason</label>
            <select v-model="rejectionReason" class="form-select">
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
            <label class="form-label">Additional Details (Optional)</label>
            <textarea
              v-model="rejectionDetails"
              class="form-textarea"
              placeholder="Provide more context..."
              rows="3"
            ></textarea>
          </div>
          <div class="modal-footer">
            <button class="btn secondary" @click="showRejectModal = false">Cancel</button>
            <button class="btn danger" :disabled="!rejectionReason" @click="confirmReject">
              Reject
            </button>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
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
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

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
const submissions = ref<Submission[]>([])
const selectedIds = ref<string[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const selectedSubmission = ref<Submission | null>(null)
const rejectionReason = ref('')
const rejectionDetails = ref('')

const filters = ref({
  documentType: '',
  riskLevel: '',
  priority: ''
})

const sortBy = ref('newest')

const stats = ref({
  totalPending: 0,
  highPriority: 0,
  avgWaitTime: 0
})

// Computed
const displayedPages = computed(() => {
  const pages = []
  const maxPages = 5
  let start = Math.max(1, currentPage.value - 2)
  let end = Math.min(totalPages.value, start + maxPages - 1)

  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const loadQueue = async () => {
  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))

    submissions.value = generateMockSubmissions(20)
    stats.value = {
      totalPending: 245,
      highPriority: 12,
      avgWaitTime: 6.5
    }
    totalPages.value = 5
  } catch (error) {
    console.error('Failed to load queue:', error)
  } finally {
    isLoading.value = false
  }
}

const generateMockSubmissions = (count: number): Submission[] => {
  const types = ['passport', 'drivers_license', 'national_id', 'residence_permit']
  const priorities = ['normal', 'normal', 'normal', 'high', 'urgent']
  const names = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Wilson', 'Charlie Brown']

  return Array.from({ length: count }, (_, i) => ({
    id: `VER-${1000 + i}`,
    userId: `user-${i}`,
    userName: names[i % names.length],
    userEmail: `user${i}@example.com`,
    userPhoto: null,
    submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    documentType: types[Math.floor(Math.random() * types.length)],
    riskScore: Math.floor(Math.random() * 100),
    priority: priorities[Math.floor(Math.random() * priorities.length)] as 'normal' | 'high' | 'urgent',
    waitTimeHours: Math.floor(Math.random() * 72),
    status: 'pending'
  }))
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))

  if (diffHours < 1) return 'Just now'
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`

  return date.toLocaleDateString()
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatDocumentType = (type: string) => {
  return type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
}

const getRiskClass = (score: number) => {
  if (score <= 30) return 'low'
  if (score <= 60) return 'medium'
  return 'high'
}

const toggleSelection = (id: string) => {
  const index = selectedIds.value.indexOf(id)
  if (index > -1) {
    selectedIds.value.splice(index, 1)
  } else {
    selectedIds.value.push(id)
  }
}

const toggleSelectAll = () => {
  if (selectedIds.value.length === submissions.value.length) {
    selectedIds.value = []
  } else {
    selectedIds.value = submissions.value.map(s => s.id)
  }
}

const clearSelection = () => {
  selectedIds.value = []
}

const viewDetails = (id: string) => {
  router.push(`/verification/detail/${id}`)
}

const quickApprove = (submission: Submission) => {
  selectedSubmission.value = submission
  showApproveModal.value = true
}

const confirmApprove = async () => {
  try {
    console.log('Approving:', selectedSubmission.value?.id)
    showApproveModal.value = false
    await loadQueue()
  } catch (error) {
    console.error('Approval failed:', error)
  }
}

const quickReject = (submission: Submission) => {
  selectedSubmission.value = submission
  rejectionReason.value = ''
  rejectionDetails.value = ''
  showRejectModal.value = true
}

const confirmReject = async () => {
  try {
    console.log('Rejecting:', selectedSubmission.value?.id, rejectionReason.value)
    showRejectModal.value = false
    await loadQueue()
  } catch (error) {
    console.error('Rejection failed:', error)
  }
}

const bulkAssign = () => {
  console.log('Bulk assign:', selectedIds.value)
}

const bulkFlag = () => {
  console.log('Bulk flag:', selectedIds.value)
}

const applyFilters = () => {
  currentPage.value = 1
  loadQueue()
}

const clearFilters = () => {
  filters.value = {
    documentType: '',
    riskLevel: '',
    priority: ''
  }
  sortBy.value = 'newest'
  searchQuery.value = ''
  applyFilters()
}

const debouncedSearch = (() => {
  let timeout: NodeJS.Timeout
  return () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      applyFilters()
    }, 300)
  }
})()

const refreshQueue = () => {
  loadQueue()
}

const changePage = (page: number) => {
  currentPage.value = page
  loadQueue()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  loadQueue()
})
</script>

<style scoped>
.verification-queue {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.375rem 0;
}

.page-subtitle {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.action-btn .icon {
  width: 18px;
  height: 18px;
}

.action-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.action-btn.secondary:hover {
  background: var(--bg-color);
  color: var(--text-primary);
}

.action-btn.primary {
  background: var(--primary-color);
  color: white;
}

.action-btn.primary:hover {
  opacity: 0.9;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon .icon {
  width: 24px;
  height: 24px;
  color: white;
}

.stat-icon.blue { background: #3b82f6; }
.stat-icon.red { background: #ef4444; }
.stat-icon.green { background: #22c55e; }

.stat-content { flex: 1; }
.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.filter-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  padding: 0.625rem 1rem 0.625rem 2.75rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-primary);
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.filter-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-select {
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-primary);
  font-size: 0.875rem;
  cursor: pointer;
}

.filter-btn {
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-btn .icon {
  width: 16px;
  height: 16px;
}

.filter-btn:hover {
  background: var(--bg-color);
}

.bulk-toolbar {
  background: var(--primary-color);
  color: white;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bulk-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.bulk-count {
  font-weight: 600;
}

.bulk-actions {
  display: flex;
  gap: 0.75rem;
}

.bulk-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.bulk-btn .icon {
  width: 16px;
  height: 16px;
}

.bulk-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.bulk-btn.danger {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.5);
}

.submissions-container {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.loading-state, .empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-secondary);
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: var(--text-muted);
  margin: 0 auto 1rem;
}

.empty-state h3 {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.submissions-table {
  display: flex;
  flex-direction: column;
}

.table-header, .table-row {
  display: grid;
  grid-template-columns: 40px 2fr 1.5fr 1fr 1fr 1fr 120px;
  align-items: center;
  padding: 1rem 1.25rem;
  gap: 1rem;
}

.table-header {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  font-weight: 600;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.table-row {
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s;
}

.table-row:hover {
  background: var(--bg-secondary);
}

.table-row.selected {
  background: rgba(59, 130, 246, 0.05);
}

.checkbox-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-cell .avatar-fallback {
  background: linear-gradient(135deg, var(--primary-color), #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-cell .avatar-fallback span {
  color: white;
  font-size: 0.875rem;
  font-weight: 600;
}

.user-info {
  flex: 1;
  min-width: 0;
}

.user-name {
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-email {
  font-size: 0.875rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.submission-id {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.submission-date {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.priority-badge {
  display: inline-block;
  margin-top: 0.25rem;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  font-size: 0.6875rem;
  font-weight: 600;
}

.priority-badge.high {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.priority-badge.urgent {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.document-type {
  font-size: 0.875rem;
  color: var(--text-primary);
}

.risk-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.risk-bar {
  flex: 1;
  height: 6px;
  background: var(--bg-secondary);
  border-radius: 3px;
  overflow: hidden;
}

.risk-fill {
  height: 100%;
  transition: width 0.3s;
}

.risk-indicator.low .risk-fill { background: #22c55e; }
.risk-indicator.medium .risk-fill { background: #f59e0b; }
.risk-indicator.high .risk-fill { background: #ef4444; }

.risk-score {
  font-size: 0.875rem;
  font-weight: 600;
}

.risk-indicator.low .risk-score { color: #22c55e; }
.risk-indicator.medium .risk-score { color: #f59e0b; }
.risk-indicator.high .risk-score { color: #ef4444; }

.wait-time {
  font-weight: 600;
  color: var(--text-primary);
}

.wait-time.urgent {
  color: #ef4444;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-icon-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.action-icon-btn .icon {
  width: 16px;
  height: 16px;
}

.action-icon-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.action-icon-btn.success {
  color: #22c55e;
  border-color: rgba(34, 197, 94, 0.3);
}

.action-icon-btn.success:hover {
  background: rgba(34, 197, 94, 0.1);
}

.action-icon-btn.danger {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.3);
}

.action-icon-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0;
}

.page-btn {
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.page-btn .icon {
  width: 16px;
  height: 16px;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:not(:disabled):hover {
  background: var(--bg-secondary);
}

.page-numbers {
  display: flex;
  gap: 0.5rem;
}

.page-number {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--card-bg);
  color: var(--text-primary);
  cursor: pointer;
  font-size: 0.875rem;
}

.page-number.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.page-number:not(.active):hover {
  background: var(--bg-secondary);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  max-width: 500px;
  width: 100%;
  box-shadow: var(--shadow-lg);
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-close .icon {
  width: 20px;
  height: 20px;
}

.modal-close:hover {
  background: var(--bg-secondary);
}

.modal-body {
  padding: 1.5rem;
}

.modal-body p {
  margin: 0 0 1rem 0;
  color: var(--text-primary);
}

.modal-warning {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.form-select, .form-textarea {
  width: 100%;
  padding: 0.625rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn.secondary:hover {
  background: var(--bg-color);
}

.btn.success {
  background: #22c55e;
  color: white;
}

.btn.success:hover {
  opacity: 0.9;
}

.btn.danger {
  background: #ef4444;
  color: white;
}

.btn.danger:hover {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.slide-down-enter-active, .slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from, .slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 1024px) {
  .table-header, .table-row {
    grid-template-columns: 40px 1fr 1fr 80px 100px;
  }

  .table-cell:nth-child(4), .table-cell:nth-child(6) {
    display: none;
  }

  .header-cell:nth-child(4), .header-cell:nth-child(6) {
    display: none;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filter-controls {
    flex-direction: column;
  }

  .filter-select, .filter-btn {
    width: 100%;
  }

  .table-header {
    display: none;
  }

  .table-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem;
    position: relative;
  }

  .checkbox-cell {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .table-cell {
    display: block;
  }

  .actions-cell {
    justify-content: flex-start;
  }

  .bulk-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .bulk-actions {
    width: 100%;
    flex-direction: column;
  }

  .bulk-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
