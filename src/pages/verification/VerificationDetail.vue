<template>
  <div class="verification-detail">
    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading verification details...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <ExclamationTriangleIcon class="error-icon" />
      <h3>Verification Not Found</h3>
      <p>{{ error }}</p>
      <button class="btn primary" @click="$router.push('/verification/queue')">
        Back to Queue
      </button>
    </div>

    <!-- Main Content -->
    <template v-else-if="verification">
      <div class="detail-header">
        <div class="header-left">
          <button class="back-btn" @click="$router.back()">
            <ArrowLeftIcon class="icon" />
            Back to Queue
          </button>
          <div v-if="verification.status !== 'pending'" class="status-badge" :class="verification.status">
            <CheckCircleIcon v-if="verification.status === 'approved'" class="icon" />
            <XCircleIcon v-else-if="verification.status === 'rejected'" class="icon" />
            <ClockIcon v-else class="icon" />
            {{ verification.status }}
          </div>
        </div>

        <!-- Only show action buttons for pending verifications -->
        <div v-if="verification.status === 'pending'" class="header-actions">
          <button class="action-btn danger" @click="showRejectModal = true">
            <XMarkIcon class="icon" />
            Reject
          </button>
          <button class="action-btn success" @click="showApproveModal = true">
            <CheckIcon class="icon" />
            Approve
          </button>
        </div>

        <!-- Show verification info for approved/rejected verifications -->
        <div v-else-if="verification.status === 'approved' || verification.status === 'rejected'" class="verification-info">
          <div class="info-row">
            <span class="info-label">Verified by:</span>
            <span class="info-value">{{ verification.verifiedBy || 'N/A' }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Date:</span>
            <span class="info-value">{{ verification.verifiedAt ? formatDateTime(verification.verifiedAt) : 'N/A' }}</span>
          </div>
          <div v-if="verification.status === 'rejected' && verification.rejectionReason" class="info-row">
            <span class="info-label">Reason:</span>
            <span class="info-value">{{ verification.rejectionReason }}</span>
          </div>
        </div>
      </div>

      <div class="detail-grid">
        <!-- User Info Panel -->
        <div class="info-panel">
          <h3 class="panel-title">User Information</h3>
          <div class="user-profile">
            <div v-if="verification.user.photo" class="profile-photo">
              <img :src="verification.user.photo" alt="User" />
            </div>
            <div v-else class="profile-photo avatar-fallback">
              <span>{{ getInitials(verification.user.name) }}</span>
            </div>
            <div class="profile-info">
              <h4>{{ verification.user.name }}</h4>
              <p>{{ verification.user.email }}</p>
              <p>{{ verification.user.phone }}</p>
            </div>
          </div>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Submitted</span>
              <span class="info-value">{{ formatDateTime(verification.submittedAt) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Account Created</span>
              <span class="info-value">{{ formatDate(verification.user.registrationDate) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Country</span>
              <span class="info-value">{{ verification.user.country }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Previous Attempts</span>
              <span class="info-value">{{ verification.previousAttempts.length }}</span>
            </div>
          </div>
        </div>

        <!-- Document Viewer -->
        <div class="document-viewer">
          <h3 class="panel-title">National ID Document</h3>
          <div class="viewer-controls">
            <button @click="zoomIn" class="control-btn" title="Zoom In">
              <MagnifyingGlassPlusIcon class="icon" />
            </button>
            <button @click="zoomOut" class="control-btn" title="Zoom Out">
              <MagnifyingGlassMinusIcon class="icon" />
            </button>
            <button @click="rotateDocument" class="control-btn" title="Rotate">
              <ArrowPathIcon class="icon" />
            </button>
            <button @click="resetView" class="control-btn" title="Reset View">
              <ArrowsPointingOutIcon class="icon" />
            </button>
          </div>

          <div v-if="verification.documents && verification.documents.length > 0" class="documents-grid">
            <div v-for="(doc, index) in verification.documents" :key="index" class="document-item">
              <div class="document-container">
                <img
                  :src="doc.url"
                  :alt="`${doc.type} - ${doc.side}`"
                  class="document-image"
                  :style="{ transform: `scale(${zoom}) rotate(${rotation}deg)` }"
                />
              </div>
              <span class="document-label">{{ doc.type }} - {{ doc.side }}</span>
            </div>
          </div>
          <div v-else class="empty-documents">
            <DocumentTextIcon class="empty-icon" />
            <p>No documents uploaded</p>
          </div>
        </div>

        <!-- Verification Checklist -->
        <div class="checklist-panel">
          <h3 class="panel-title">Verification Checklist</h3>
          <div class="checklist">
            <div v-for="(item, key) in verification.checklistItems" :key="key" class="checklist-item">
              <input
                type="checkbox"
                :checked="item"
                :id="key"
                :disabled="verification.status !== 'pending'"
                @change="updateChecklistItem(key, $event)"
              />
              <label :for="key">{{ formatChecklistLabel(key) }}</label>
            </div>
          </div>
        </div>

        <!-- AI Fraud Detection -->
        <div class="fraud-panel">
          <h3 class="panel-title">AI Fraud Detection</h3>
          <div class="risk-score-display">
            <div class="risk-circle" :class="getRiskClass(verification.riskScore)">
              {{ verification.riskScore }}
            </div>
            <span>Risk Score</span>
          </div>
          <div v-if="verification.fraudIndicators && verification.fraudIndicators.length > 0" class="fraud-indicators">
            <div v-for="(indicator, index) in verification.fraudIndicators" :key="index" class="fraud-indicator">
              <ExclamationTriangleIcon class="indicator-icon" :class="indicator.severity" />
              <div>
                <div class="indicator-type">{{ indicator.type }}</div>
                <div class="indicator-desc">{{ indicator.description }}</div>
              </div>
            </div>
          </div>
          <div v-else class="no-indicators">
            <CheckCircleIcon class="success-icon" />
            <p>No fraud indicators detected</p>
          </div>
        </div>
      </div>

      <!-- Previous Attempts (if any) -->
      <div v-if="verification.previousAttempts && verification.previousAttempts.length > 0" class="previous-attempts">
        <h3 class="panel-title">Previous Verification Attempts</h3>
        <div class="attempts-list">
          <div v-for="(attempt, index) in verification.previousAttempts" :key="index" class="attempt-item">
            <div class="attempt-date">{{ formatDateTime(attempt.date) }}</div>
            <div class="attempt-status" :class="attempt.status">{{ attempt.status }}</div>
            <div v-if="attempt.reason" class="attempt-reason">{{ attempt.reason }}</div>
          </div>
        </div>
      </div>

      <!-- Approve Modal -->
      <teleport to="body">
        <div v-if="showApproveModal" class="modal-overlay" @click="showApproveModal = false">
          <div class="modal-content" @click.stop>
            <div class="modal-header">
              <h3>Approve Verification</h3>
              <button class="modal-close" @click="showApproveModal = false">
                <XMarkIcon class="icon" />
              </button>
            </div>
            <div class="modal-body">
              <p>Are you sure you want to approve verification for <strong>{{ verification.user.name }}</strong>?</p>
              <p class="warning-text">This action cannot be undone.</p>
            </div>
            <div class="modal-footer">
              <button class="btn secondary" @click="showApproveModal = false">Cancel</button>
              <button class="btn success" @click="approve" :disabled="isProcessing">
                {{ isProcessing ? 'Processing...' : 'Approve' }}
              </button>
            </div>
          </div>
        </div>
      </teleport>

      <!-- Reject Modal -->
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
              <p>Reject verification for <strong>{{ verification.user.name }}</strong></p>
              <label class="form-label">Rejection Reason *</label>
              <select v-model="rejectionReason" class="form-select">
                <option value="">Select a reason...</option>
                <option value="Document Expired">Document Expired</option>
                <option value="Document Unclear/Blurry">Document Unclear/Blurry</option>
                <option value="Photo Mismatch">Photo Mismatch</option>
                <option value="Document Tampered">Document Tampered</option>
                <option value="Suspected Fraud">Suspected Fraud</option>
                <option value="Incomplete Information">Incomplete Information</option>
                <option value="Other">Other</option>
              </select>
              <label class="form-label">Additional Details</label>
              <textarea v-model="rejectionDetails" class="form-textarea" rows="3" placeholder="Provide additional context for the rejection..."></textarea>
            </div>
            <div class="modal-footer">
              <button class="btn secondary" @click="showRejectModal = false">Cancel</button>
              <button class="btn danger" :disabled="!rejectionReason || isProcessing" @click="reject">
                {{ isProcessing ? 'Processing...' : 'Reject' }}
              </button>
            </div>
          </div>
        </div>
      </teleport>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  XMarkIcon,
  CheckIcon,
  MagnifyingGlassPlusIcon,
  MagnifyingGlassMinusIcon,
  ArrowPathIcon,
  ArrowsPointingOutIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

// State
const isLoading = ref(true)
const isProcessing = ref(false)
const error = ref('')
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const rejectionReason = ref('')
const rejectionDetails = ref('')
const zoom = ref(1)
const rotation = ref(0)

interface FraudIndicator {
  type: string
  description: string
  severity: 'low' | 'medium' | 'high'
}

interface Document {
  type: string
  side: string
  url: string
}

interface PreviousAttempt {
  date: string
  status: string
  reason?: string
}

interface Verification {
  id: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  verifiedBy?: string
  verifiedAt?: string
  rejectionReason?: string
  rejectionDetails?: string
  user: {
    name: string
    email: string
    phone: string
    photo: string | null
    registrationDate: string
    country: string
  }
  documents: Document[]
  riskScore: number
  fraudIndicators: FraudIndicator[]
  checklistItems: Record<string, boolean>
  previousAttempts: PreviousAttempt[]
}

const verification = ref<Verification | null>(null)

// Helper Functions
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatDateTime = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatChecklistLabel = (key: string) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
}

const getRiskClass = (score: number) => {
  if (score <= 30) return 'low'
  if (score <= 60) return 'medium'
  return 'high'
}

// Document Viewer Controls
const zoomIn = () => {
  zoom.value = Math.min(zoom.value + 0.2, 3)
}

const zoomOut = () => {
  zoom.value = Math.max(zoom.value - 0.2, 0.5)
}

const rotateDocument = () => {
  rotation.value = (rotation.value + 90) % 360
}

const resetView = () => {
  zoom.value = 1
  rotation.value = 0
}

const updateChecklistItem = (key: string, event: Event) => {
  if (verification.value && verification.value.status === 'pending') {
    const target = event.target as HTMLInputElement
    verification.value.checklistItems[key] = target.checked
  }
}

// Actions
const approve = async () => {
  if (!verification.value) return

  isProcessing.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('Approving verification:', verification.value.id)

    // Update local state
    verification.value.status = 'approved'
    verification.value.verifiedBy = 'Current Admin'
    verification.value.verifiedAt = new Date().toISOString()

    showApproveModal.value = false

    // Show success message (you can use a toast notification here)
    setTimeout(() => {
      router.push('/verification/queue')
    }, 1500)
  } catch (err) {
    console.error('Error approving verification:', err)
    error.value = 'Failed to approve verification. Please try again.'
  } finally {
    isProcessing.value = false
  }
}

const reject = async () => {
  if (!verification.value || !rejectionReason.value) return

  isProcessing.value = true
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('Rejecting verification:', verification.value.id, rejectionReason.value, rejectionDetails.value)

    // Update local state
    verification.value.status = 'rejected'
    verification.value.verifiedBy = 'Current Admin'
    verification.value.verifiedAt = new Date().toISOString()
    verification.value.rejectionReason = rejectionReason.value
    verification.value.rejectionDetails = rejectionDetails.value

    showRejectModal.value = false

    // Show success message
    setTimeout(() => {
      router.push('/verification/queue')
    }, 1500)
  } catch (err) {
    console.error('Error rejecting verification:', err)
    error.value = 'Failed to reject verification. Please try again.'
  } finally {
    isProcessing.value = false
  }
}

// Fetch verification data
const fetchVerificationData = async () => {
  const verificationId = route.params.id as string

  if (!verificationId) {
    error.value = 'Invalid verification ID'
    isLoading.value = false
    return
  }

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))

    // Try to get verification from router state first
    const stateVerification = window.history.state.verification

    if (stateVerification) {
      // Map the submission data from queue to verification detail format
      verification.value = {
        id: stateVerification.id,
        status: stateVerification.status || 'pending',
        submittedAt: stateVerification.submittedAt,
        verifiedBy: stateVerification.verifiedBy || undefined,
        verifiedAt: stateVerification.verifiedAt || undefined,
        rejectionReason: stateVerification.rejectionReason || undefined,
        rejectionDetails: stateVerification.rejectionDetails || undefined,
        user: {
          name: stateVerification.userName,
          email: stateVerification.userEmail,
          phone: `+1 ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 900 + 100)} ${Math.floor(Math.random() * 9000 + 1000)}`,
          photo: stateVerification.userPhoto,
          registrationDate: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 3600000).toISOString().split('T')[0] || '',
          country: 'United States'
        },
        documents: [
          {
            type: stateVerification.documentType || 'National ID',
            side: 'Front',
            url: 'https://via.placeholder.com/600x400/3b82f6/ffffff?text=National+ID+Front'
          },
          {
            type: stateVerification.documentType || 'National ID',
            side: 'Back',
            url: 'https://via.placeholder.com/600x400/6366f1/ffffff?text=National+ID+Back'
          }
        ],
        riskScore: stateVerification.riskScore || 25,
        fraudIndicators: stateVerification.riskScore > 60 ? [
          {
            type: 'High Risk Score',
            description: 'Document verification flagged as high risk',
            severity: 'high' as const
          }
        ] : [],
        checklistItems: {
          nameMatch: true,
          photoMatch: true,
          notExpired: true,
          authentic: stateVerification.riskScore < 60,
          readable: true
        },
        previousAttempts: []
      }
    } else {
      // Fallback to mock data if no state is available
      const statusMap: Record<string, 'pending' | 'approved' | 'rejected'> = {
        'VER-2024-001': 'pending',
        'VER-2024-002': 'pending',
        'VER-2024-003': 'approved',
        'VER-2024-004': 'rejected',
        'FA001': 'pending',
        'FA002': 'pending'
      }

      const status = statusMap[verificationId] || 'pending'
      const userName = `User ${verificationId.slice(-3)}`

      verification.value = {
        id: verificationId,
        status: status,
        submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        verifiedBy: status !== 'pending' ? 'Admin Smith' : undefined,
        verifiedAt: status !== 'pending' ? new Date(Date.now() - 3600000).toISOString() : undefined,
        rejectionReason: status === 'rejected' ? 'Document Unclear/Blurry' : undefined,
        rejectionDetails: status === 'rejected' ? 'The photo quality is too low to verify the information.' : undefined,
        user: {
          name: userName,
          email: `${userName.toLowerCase().replace(' ', '.')}@example.com`,
          phone: '+1 234 567 8900',
          photo: null,
          registrationDate: '2024-01-15',
          country: 'United States'
        },
        documents: [
          {
            type: 'National ID',
            side: 'Front',
            url: 'https://via.placeholder.com/600x400/3b82f6/ffffff?text=National+ID+Front'
          },
          {
            type: 'National ID',
            side: 'Back',
            url: 'https://via.placeholder.com/600x400/6366f1/ffffff?text=National+ID+Back'
          }
        ],
        riskScore: 25,
        fraudIndicators: [],
        checklistItems: {
          nameMatch: true,
          photoMatch: true,
          notExpired: true,
          authentic: true,
          readable: true
        },
        previousAttempts: []
      }
    }
  } catch (err) {
    console.error('Error fetching verification:', err)
    error.value = 'Failed to load verification details. Please try again.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchVerificationData()
})
</script>

<style scoped>
.verification-detail {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Loading & Error States */
.loading-state,
.error-state {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 4rem 2rem;
  text-align: center;
  border: 1px solid var(--border-color);
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

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p,
.error-state p {
  color: var(--text-secondary);
  margin: 0;
}

.error-icon {
  width: 64px;
  height: 64px;
  color: #ef4444;
  margin: 0 auto 1rem;
}

.error-state h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

/* Header */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}

.back-btn .icon {
  width: 16px;
  height: 16px;
}

.back-btn:hover {
  background: var(--bg-color);
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge .icon {
  width: 18px;
  height: 18px;
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
  border: none;
  color: white;
  transition: all 0.2s ease;
}

.action-btn .icon {
  width: 18px;
  height: 18px;
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

.verification-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: var(--radius-md);
}

.info-row {
  display: flex;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.info-label {
  color: var(--text-secondary);
  font-weight: 500;
}

.info-value {
  color: var(--text-primary);
  font-weight: 600;
}

/* Grid Layout */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
}

.info-panel,
.document-viewer,
.checklist-panel,
.fraud-panel,
.previous-attempts {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.panel-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1.25rem 0;
}

/* User Profile */
.user-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.profile-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.profile-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-fallback {
  background: linear-gradient(135deg, var(--primary-color), #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-fallback span {
  color: white;
  font-size: 1.75rem;
  font-weight: 600;
}

.profile-info h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.profile-info p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0.25rem 0;
}

.info-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Document Viewer */
.viewer-controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.control-btn {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-btn .icon {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
}

.control-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
}

.control-btn:hover .icon {
  color: var(--primary-color);
}

.documents-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

.document-item {
  position: relative;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
  overflow: hidden;
}

.document-container {
  overflow: hidden;
  background: #f8f9fa;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.document-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
  max-width: 100%;
}

.document-label {
  display: block;
  background: var(--card-bg);
  color: var(--text-primary);
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
  border-top: 1px solid var(--border-color);
}

.empty-documents {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.empty-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-documents p {
  margin: 0;
}

/* Checklist */
.checklist {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.checklist-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.checklist-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.checklist-item input[type="checkbox"]:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.checklist-item label {
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
}

/* Fraud Detection */
.risk-score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.risk-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.risk-circle.low {
  background: #22c55e;
}

.risk-circle.medium {
  background: #f59e0b;
}

.risk-circle.high {
  background: #ef4444;
}

.fraud-indicators {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.fraud-indicator {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.indicator-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.indicator-icon.high {
  color: #ef4444;
}

.indicator-icon.medium {
  color: #f59e0b;
}

.indicator-icon.low {
  color: #3b82f6;
}

.indicator-type {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.indicator-desc {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.no-indicators {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  color: var(--text-secondary);
  text-align: center;
}

.success-icon {
  width: 48px;
  height: 48px;
  color: #22c55e;
}

.no-indicators p {
  margin: 0;
  font-size: 0.875rem;
}

/* Previous Attempts */
.previous-attempts {
  grid-column: 1 / -1;
}

.attempts-list {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}

.attempt-item {
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.attempt-date {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.attempt-status {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
}

.attempt-status.approved {
  color: #22c55e;
}

.attempt-status.rejected {
  color: #ef4444;
}

.attempt-reason {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin-top: 0.5rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
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
  transition: all 0.2s ease;
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

.warning-text {
  font-size: 0.875rem;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  padding: 0.75rem;
  border-radius: var(--radius-md);
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: var(--text-primary);
  font-size: 0.875rem;
}

.form-select,
.form-textarea {
  width: 100%;
  padding: 0.625rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-color);
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
  min-height: 80px;
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
  transition: all 0.2s ease;
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

.btn.secondary:hover {
  background: var(--bg-color);
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
  transform: none;
}

/* Responsive */
@media (max-width: 1024px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .detail-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-left {
    width: 100%;
    flex-wrap: wrap;
  }

  .header-actions {
    width: 100%;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .verification-info {
    width: 100%;
  }

  .documents-grid {
    grid-template-columns: 1fr;
  }

  .attempts-list {
    grid-template-columns: 1fr;
  }
}
</style>
