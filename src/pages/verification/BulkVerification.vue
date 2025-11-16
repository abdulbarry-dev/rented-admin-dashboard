<template>
  <div class="bulk-verification">
    <div class="page-header">
      <h1>Bulk Verification</h1>
      <p class="subtitle">Process multiple verifications efficiently</p>
    </div>

    <!-- Upload Section -->
    <div class="upload-section">
      <div class="upload-area" @dragover.prevent @drop="handleDrop">
        <ArrowUpTrayIcon class="upload-icon" />
        <h3>Upload Verification Batch</h3>
        <p>Drag and drop CSV file or click to browse</p>
        <input type="file" accept=".csv,.xlsx" @change="handleFileUpload" hidden ref="fileInput" />
        <button class="btn primary" @click="$refs.fileInput.click()">Select File</button>
      </div>
    </div>

    <!-- Batch Stats -->
    <div v-if="batchItems.length > 0" class="stats-grid">
      <div class="stat-card">
        <ClipboardDocumentListIcon class="stat-icon" />
        <div class="stat-content">
          <span class="stat-label">Total Items</span>
          <span class="stat-value">{{ batchItems.length }}</span>
        </div>
      </div>
      <div class="stat-card">
        <CheckCircleIcon class="stat-icon success" />
        <div class="stat-content">
          <span class="stat-label">Approved</span>
          <span class="stat-value">{{ approved }}</span>
        </div>
      </div>
      <div class="stat-card">
        <XCircleIcon class="stat-icon danger" />
        <div class="stat-content">
          <span class="stat-label">Rejected</span>
          <span class="stat-value">{{ rejected }}</span>
        </div>
      </div>
      <div class="stat-card">
        <ClockIcon class="stat-icon pending" />
        <div class="stat-content">
          <span class="stat-label">Pending</span>
          <span class="stat-value">{{ pending }}</span>
        </div>
      </div>
    </div>

    <!-- Batch Items Grid -->
    <div v-if="batchItems.length > 0" class="batch-section">
      <div class="section-header">
        <h2>Batch Items</h2>
        <div class="bulk-actions">
          <button class="btn success" @click="approveAll" :disabled="pending === 0">
            Approve All Pending
          </button>
          <button class="btn danger" @click="rejectAll" :disabled="pending === 0">
            Reject All Pending
          </button>
        </div>
      </div>

      <div class="items-grid">
        <div v-for="item in batchItems" :key="item.id" class="batch-item" :class="item.status">
          <div class="item-header">
            <img :src="item.photo || '/default-avatar.png'" alt="User" class="item-photo" />
            <div class="item-info">
              <h4>{{ item.name }}</h4>
              <p>{{ item.email }}</p>
            </div>
            <div class="status-badge" :class="item.status">
              {{ item.status }}
            </div>
          </div>

          <div class="item-details">
            <div class="detail-row">
              <span class="detail-label">Document Type</span>
              <span class="detail-value">{{ item.documentType }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Risk Score</span>
              <span class="detail-value" :class="getRiskClass(item.riskScore)">{{ item.riskScore }}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Submitted</span>
              <span class="detail-value">{{ formatDate(item.submittedAt) }}</span>
            </div>
          </div>

          <div v-if="item.status === 'pending'" class="item-actions">
            <button class="action-btn success" @click="approveItem(item.id)">
              <CheckIcon class="icon" />
              Approve
            </button>
            <button class="action-btn danger" @click="rejectItem(item.id)">
              <XMarkIcon class="icon" />
              Reject
            </button>
          </div>

          <div v-else-if="item.status === 'rejected'" class="rejection-info">
            <ExclamationTriangleIcon class="icon" />
            <span>{{ item.rejectionReason }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <DocumentTextIcon class="empty-icon" />
      <h3>No batch loaded</h3>
      <p>Upload a CSV file to start bulk verification processing</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ArrowUpTrayIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

interface BatchItem {
  id: string
  name: string
  email: string
  photo: string | null
  documentType: string
  riskScore: number
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  rejectionReason?: string
}

const fileInput = ref<HTMLInputElement | null>(null)
const batchItems = ref<BatchItem[]>([])

const approved = computed(() => batchItems.value.filter(i => i.status === 'approved').length)
const rejected = computed(() => batchItems.value.filter(i => i.status === 'rejected').length)
const pending = computed(() => batchItems.value.filter(i => i.status === 'pending').length)

const handleFileUpload = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files && files.length > 0) {
    loadMockData()
  }
}

const handleDrop = (e: DragEvent) => {
  e.preventDefault()
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    loadMockData()
  }
}

const loadMockData = () => {
  batchItems.value = Array.from({ length: 12 }, (_, i) => ({
    id: `BV${1000 + i}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    photo: null,
    documentType: ['Passport', 'Driver License', 'National ID'][i % 3],
    riskScore: Math.floor(Math.random() * 100),
    submittedAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    status: 'pending'
  }))
}

const approveItem = (id: string) => {
  const item = batchItems.value.find(i => i.id === id)
  if (item) item.status = 'approved'
}

const rejectItem = (id: string) => {
  const item = batchItems.value.find(i => i.id === id)
  if (item) {
    item.status = 'rejected'
    item.rejectionReason = 'Document quality issues'
  }
}

const approveAll = () => {
  batchItems.value.forEach(item => {
    if (item.status === 'pending') item.status = 'approved'
  })
}

const rejectAll = () => {
  batchItems.value.forEach(item => {
    if (item.status === 'pending') {
      item.status = 'rejected'
      item.rejectionReason = 'Bulk rejection'
    }
  })
}

const formatDate = (date: string) => new Date(date).toLocaleDateString()
const getRiskClass = (score: number) => score <= 30 ? 'low' : score <= 60 ? 'medium' : 'high'
</script>

<style scoped>
.bulk-verification {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.upload-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.upload-area {
  border: 2px dashed var(--border-color);
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.upload-area:hover {
  border-color: var(--primary-color);
  background: var(--bg-secondary);
}

.upload-icon {
  width: 48px;
  height: 48px;
  color: var(--text-secondary);
  margin: 0 auto 1rem;
}

.upload-area h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.upload-area p {
  color: var(--text-secondary);
  margin: 0 0 1.5rem 0;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: var(--radius-md);
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn.primary {
  background: var(--primary-color);
  color: white;
}

.btn.success {
  background: #22c55e;
  color: white;
}

.btn.danger {
  background: #ef4444;
  color: white;
}

.btn:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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

.stat-icon {
  width: 40px;
  height: 40px;
  color: var(--primary-color);
  flex-shrink: 0;
}

.stat-icon.success { color: #22c55e; }
.stat-icon.danger { color: #ef4444; }
.stat-icon.pending { color: #f59e0b; }

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
}

.batch-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
}

.bulk-actions {
  display: flex;
  gap: 0.75rem;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.25rem;
}

.batch-item {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 1.25rem;
  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
}

.batch-item:hover {
  box-shadow: var(--shadow-md);
}

.batch-item.approved {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.05);
}

.batch-item.rejected {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.05);
}

.item-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.item-photo {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  background: var(--bg-color);
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-info h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-info p {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.pending {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-badge.approved {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-badge.rejected {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.detail-value {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
}

.detail-value.low { color: #22c55e; }
.detail-value.medium { color: #f59e0b; }
.detail-value.high { color: #ef4444; }

.item-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  color: white;
  transition: all 0.2s ease;
}

.action-btn .icon {
  width: 16px;
  height: 16px;
}

.action-btn.success {
  background: #22c55e;
}

.action-btn.danger {
  background: #ef4444;
}

.action-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.rejection-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  color: #ef4444;
}

.rejection-info .icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.empty-state {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 4rem 2rem;
  text-align: center;
  border: 1px solid var(--border-color);
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: var(--text-secondary);
  margin: 0 auto 1.5rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0;
}

@media (max-width: 768px) {
  .items-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .bulk-actions {
    width: 100%;
    flex-direction: column;
  }

  .bulk-actions .btn {
    width: 100%;
  }
}
</style>
