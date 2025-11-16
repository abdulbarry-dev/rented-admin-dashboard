<template>
  <div class="verification-history">
    <div class="page-header">
      <div>
        <h1>Verification History</h1>
        <p class="subtitle">Complete audit trail of all verifications</p>
      </div>
      <button class="btn primary" @click="exportHistory">
        <ArrowDownTrayIcon class="icon" />
        Export
      </button>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon-wrapper success">
          <CheckCircleIcon class="stat-icon" />
        </div>
        <div class="stat-content">
          <span class="stat-label">Total Approved</span>
          <span class="stat-value">{{ stats.totalApproved.toLocaleString() }}</span>
          <span class="stat-change positive">+12% this month</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper danger">
          <XCircleIcon class="stat-icon" />
        </div>
        <div class="stat-content">
          <span class="stat-label">Total Rejected</span>
          <span class="stat-value">{{ stats.totalRejected.toLocaleString() }}</span>
          <span class="stat-change negative">-5% this month</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper primary">
          <ClockIcon class="stat-icon" />
        </div>
        <div class="stat-content">
          <span class="stat-label">Avg Processing Time</span>
          <span class="stat-value">{{ stats.avgProcessingTime }}</span>
          <span class="stat-change positive">-15 min this month</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon-wrapper warning">
          <ShieldExclamationIcon class="stat-icon" />
        </div>
        <div class="stat-content">
          <span class="stat-label">Fraud Detected</span>
          <span class="stat-value">{{ stats.fraudDetected }}</span>
          <span class="stat-change negative">+3 this month</span>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filter-group">
        <MagnifyingGlassIcon class="search-icon" />
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search by name, email, or ID..."
          class="search-input"
        />
      </div>
      <div class="filter-row">
        <select v-model="filters.status" class="filter-select">
          <option value="">All Statuses</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="flagged">Flagged</option>
        </select>
        <select v-model="filters.verifier" class="filter-select">
          <option value="">All Verifiers</option>
          <option value="admin1">Admin 1</option>
          <option value="admin2">Admin 2</option>
        </select>
        <select v-model="filters.dateRange" class="filter-select">
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
        <button v-if="hasActiveFilters" @click="clearFilters" class="btn secondary">
          Clear Filters
        </button>
      </div>
    </div>

    <!-- History Table -->
    <div class="table-section">
      <div class="table-container">
        <table class="history-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Document Type</th>
              <th>Submitted</th>
              <th>Processed</th>
              <th>Verifier</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in paginatedHistory" :key="record.id">
              <td>
                <div class="user-cell">
                  <div v-if="record.user.photo" class="user-photo">
                    <img :src="record.user.photo" alt="User" />
                  </div>
                  <div v-else class="user-photo avatar-fallback">
                    <span>{{ getInitials(record.user.name) }}</span>
                  </div>
                  <div>
                    <div class="user-name">{{ record.user.name }}</div>
                    <div class="user-email">{{ record.user.email }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="document-type">{{ record.documentType }}</span>
              </td>
              <td>
                <div class="date-cell">
                  <div>{{ formatDate(record.submittedAt) }}</div>
                  <div class="time-text">{{ formatTime(record.submittedAt) }}</div>
                </div>
              </td>
              <td>
                <div class="date-cell">
                  <div>{{ formatDate(record.processedAt) }}</div>
                  <div class="time-text">{{ formatTime(record.processedAt) }}</div>
                </div>
              </td>
              <td>
                <span class="verifier">{{ record.verifier }}</span>
              </td>
              <td>
                <span class="status-badge" :class="record.status">
                  {{ record.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-icon" @click="viewDetails(record.id)" title="View Details">
                    <EyeIcon class="icon" />
                  </button>
                  <button class="action-icon" @click="downloadRecord(record.id)" title="Download">
                    <ArrowDownTrayIcon class="icon" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <vue-awesome-paginate
          :total-items="filteredHistory.length"
          :items-per-page="pagination.itemsPerPage"
          :max-pages-shown="5"
          v-model="pagination.currentPage"
          :on-click="onPageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { VueAwesomePaginate } from 'vue-awesome-paginate'
import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ShieldExclamationIcon,
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  EyeIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const stats = ref({
  totalApproved: 45892,
  totalRejected: 3421,
  avgProcessingTime: '2h 15m',
  fraudDetected: 127
})

const filters = ref({
  search: '',
  status: '',
  verifier: '',
  dateRange: 'all'
})

const pagination = ref({
  currentPage: 1,
  itemsPerPage: 10
})

const historyRecords = ref(
  Array.from({ length: 50 }, (_, i) => ({
    id: `VH${10000 + i}`,
    user: {
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      photo: null
    },
    documentType: 'National ID',
    submittedAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
    processedAt: new Date(Date.now() - Math.random() * 86400000 * 25).toISOString(),
    verifier: `Admin ${(i % 5) + 1}`,
    status: ['approved', 'rejected', 'flagged'][i % 3] as 'approved' | 'rejected' | 'flagged'
  }))
)

const hasActiveFilters = computed(() => {
  return filters.value.search || filters.value.status || filters.value.verifier || filters.value.dateRange !== 'all'
})

const filteredHistory = computed(() => {
  return historyRecords.value.filter(record => {
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      if (
        !record.user.name.toLowerCase().includes(search) &&
        !record.user.email.toLowerCase().includes(search) &&
        !record.id.toLowerCase().includes(search)
      ) {
        return false
      }
    }
    if (filters.value.status && record.status !== filters.value.status) return false
    if (filters.value.verifier && record.verifier !== filters.value.verifier) return false
    return true
  })
})

const paginatedHistory = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.itemsPerPage
  const end = start + pagination.value.itemsPerPage
  return filteredHistory.value.slice(start, end)
})

const onPageChange = (page: number) => {
  pagination.value.currentPage = page
}

const clearFilters = () => {
  filters.value = {
    search: '',
    status: '',
    verifier: '',
    dateRange: 'all'
  }
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()
const formatTime = (date: string) => new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

const viewDetails = (id: string) => {
  router.push(`/verification/${id}`)
}

const downloadRecord = (id: string) => {
  console.log('Downloading record:', id)
}

const exportHistory = () => {
  console.log('Exporting history')
}
</script>

<style scoped>
.verification-history {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.subtitle {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  margin: 0;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn.primary {
  background: var(--primary-color);
  color: white;
}

.btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn .icon {
  width: 18px;
  height: 18px;
}

.btn:hover {
  opacity: 0.9;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
}

.stat-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon-wrapper.success { background: rgba(34, 197, 94, 0.1); }
.stat-icon-wrapper.danger { background: rgba(239, 68, 68, 0.1); }
.stat-icon-wrapper.primary { background: rgba(59, 130, 246, 0.1); }
.stat-icon-wrapper.warning { background: rgba(245, 158, 11, 0.1); }

.stat-icon {
  width: 24px;
  height: 24px;
}

.stat-icon-wrapper.success .stat-icon { color: #22c55e; }
.stat-icon-wrapper.danger .stat-icon { color: #ef4444; }
.stat-icon-wrapper.primary .stat-icon { color: #3b82f6; }
.stat-icon-wrapper.warning .stat-icon { color: #f59e0b; }

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-change.positive { color: #22c55e; }
.stat-change.negative { color: #ef4444; }

.filters-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.filter-group {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 3rem;
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

.filter-row {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
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

.filter-select:focus {
  outline: none;
  border-color: var(--primary-color);
}

.table-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.history-table {
  width: 100%;
  border-collapse: collapse;
}

.history-table thead {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
}

.history-table th {
  padding: 1rem 1.25rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.history-table tbody tr {
  border-bottom: 1px solid var(--border-color);
  transition: background 0.2s ease;
}

.history-table tbody tr:hover {
  background: var(--bg-secondary);
}

.history-table td {
  padding: 1rem 1.25rem;
  font-size: 0.875rem;
  color: var(--text-primary);
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.user-photo {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.user-photo img {
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

.user-name {
  font-weight: 600;
  color: var(--text-primary);
}

.user-email {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.document-type {
  font-weight: 500;
}

.date-cell .time-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.verifier {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.status-badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.approved {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-badge.rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.status-badge.flagged {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.action-icon {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-color);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon .icon {
  width: 16px;
  height: 16px;
  color: var(--text-secondary);
}

.action-icon:hover {
  background: var(--bg-secondary);
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  border-top: 1px solid var(--border-color);
}

.pagination :deep(.pagination-container) {
  column-gap: 0.5rem;
}

.pagination :deep(.paginate-buttons) {
  height: 38px;
  width: 38px;
  border-radius: var(--radius-md);
  cursor: pointer;
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-size: 0.875rem;
  font-weight: 500;
}

.pagination :deep(.paginate-buttons:hover) {
  background-color: var(--bg-secondary);
}

.pagination :deep(.active-page) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: white !important;
}

.pagination :deep(.back-button),
.pagination :deep(.next-button) {
  background-color: var(--bg-color);
  border: 1px solid var(--border-color);
  color: var(--text-primary);
  font-weight: 500;
}

.pagination :deep(.back-button:hover),
.pagination :deep(.next-button:hover) {
  background-color: var(--bg-secondary);
}

.pagination :deep(.back-button[disabled]),
.pagination :deep(.next-button[disabled]) {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filter-row {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .history-table {
    font-size: 0.8125rem;
  }

  .history-table th,
  .history-table td {
    padding: 0.75rem;
  }
}
</style>
