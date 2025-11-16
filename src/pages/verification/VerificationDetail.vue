<template>
  <div class="verification-detail">
    <div class="detail-header">
      <button class="back-btn" @click="$router.back()">
        <ArrowLeftIcon class="icon" />
        Back to Queue
      </button>
      <div class="header-actions">
        <button class="action-btn danger" @click="showRejectModal = true">
          <XMarkIcon class="icon" />
          Reject
        </button>
        <button class="action-btn success" @click="showApproveModal = true">
          <CheckIcon class="icon" />
          Approve
        </button>
      </div>
    </div>

    <div class="detail-grid">
      <!-- User Info Panel -->
      <div class="info-panel">
        <h3 class="panel-title">User Information</h3>
        <div class="user-profile">
          <img :src="verification.user.photo || '/default-avatar.png'" alt="User" class="profile-photo" />
          <div class="profile-info">
            <h4>{{ verification.user.name }}</h4>
            <p>{{ verification.user.email }}</p>
            <p>{{ verification.user.phone }}</p>
          </div>
        </div>
        <div class="info-grid">
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
        <h3 class="panel-title">Documents</h3>
        <div class="viewer-controls">
          <button @click="zoomIn" class="control-btn"><MagnifyingGlassPlusIcon class="icon" /></button>
          <button @click="zoomOut" class="control-btn"><MagnifyingGlassMinusIcon class="icon" /></button>
          <button @click="rotateDocument" class="control-btn"><ArrowPathIcon class="icon" /></button>
        </div>
        <div class="documents-grid">
          <div v-for="(doc, index) in verification.documents" :key="index" class="document-item">
            <img
              :src="doc.frontUrl"
              alt="Document"
              class="document-image"
              :style="{ transform: `scale(${zoom}) rotate(${rotation}deg)` }"
            />
            <span class="document-label">{{ doc.type }} - Front</span>
          </div>
        </div>
      </div>

      <!-- Verification Checklist -->
      <div class="checklist-panel">
        <h3 class="panel-title">Verification Checklist</h3>
        <div class="checklist">
          <div v-for="(item, key) in verification.checklistItems" :key="key" class="checklist-item">
            <input type="checkbox" :checked="item" :id="key" />
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
        <div v-if="verification.fraudIndicators.length > 0" class="fraud-indicators">
          <div v-for="(indicator, index) in verification.fraudIndicators" :key="index" class="fraud-indicator">
            <ExclamationTriangleIcon class="indicator-icon" :class="indicator.severity" />
            <div>
              <div class="indicator-type">{{ indicator.type }}</div>
              <div class="indicator-desc">{{ indicator.description }}</div>
            </div>
          </div>
        </div>
        <p v-else class="no-indicators">No fraud indicators detected</p>
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
            <p>Approve verification for <strong>{{ verification.user.name }}</strong>?</p>
          </div>
          <div class="modal-footer">
            <button class="btn secondary" @click="showApproveModal = false">Cancel</button>
            <button class="btn success" @click="approve">Approve</button>
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
            <label class="form-label">Rejection Reason</label>
            <select v-model="rejectionReason" class="form-select">
              <option value="">Select a reason...</option>
              <option value="expired">Document expired</option>
              <option value="unclear">Document unclear</option>
              <option value="photo_mismatch">Photo mismatch</option>
              <option value="tampered">Document tampered</option>
              <option value="suspected_fraud">Suspected fraud</option>
            </select>
            <label class="form-label">Details</label>
            <textarea v-model="rejectionDetails" class="form-textarea" rows="3"></textarea>
          </div>
          <div class="modal-footer">
            <button class="btn secondary" @click="showRejectModal = false">Cancel</button>
            <button class="btn danger" :disabled="!rejectionReason" @click="reject">Reject</button>
          </div>
        </div>
      </div>
    </teleport>
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
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()

const showApproveModal = ref(false)
const showRejectModal = ref(false)
const rejectionReason = ref('')
const rejectionDetails = ref('')
const zoom = ref(1)
const rotation = ref(0)

const verification = ref({
  id: route.params.id,
  user: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    photo: null,
    registrationDate: '2024-01-15',
    country: 'United States'
  },
  documents: [
    { type: 'Passport', frontUrl: 'https://via.placeholder.com/400x250', backUrl: '', selfieUrl: '' }
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
})

const formatDate = (date: string) => new Date(date).toLocaleDateString()
const formatChecklistLabel = (key: string) => key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())
const getRiskClass = (score: number) => score <= 30 ? 'low' : score <= 60 ? 'medium' : 'high'

const zoomIn = () => { zoom.value = Math.min(zoom.value + 0.2, 3) }
const zoomOut = () => { zoom.value = Math.max(zoom.value - 0.2, 0.5) }
const rotateDocument = () => { rotation.value = (rotation.value + 90) % 360 }

const approve = () => {
  console.log('Approving verification:', verification.value.id)
  showApproveModal.value = false
  router.push('/verification/queue')
}

const reject = () => {
  console.log('Rejecting:', rejectionReason.value, rejectionDetails.value)
  showRejectModal.value = false
  router.push('/verification/queue')
}

onMounted(() => {
  console.log('Loading verification:', route.params.id)
})
</script>

<style scoped>
.verification-detail {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
}

.back-btn .icon {
  width: 16px;
  height: 16px;
}

.back-btn:hover {
  background: var(--bg-color);
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
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
}

.info-panel, .document-viewer, .checklist-panel, .fraud-panel {
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
  object-fit: cover;
  background: var(--bg-secondary);
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

.info-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

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
}

.control-btn .icon {
  width: 18px;
  height: 18px;
  color: var(--text-secondary);
}

.control-btn:hover {
  background: var(--bg-secondary);
}

.documents-grid {
  display: grid;
  gap: 1rem;
}

.document-item {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  background: var(--bg-secondary);
}

.document-image {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.document-label {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem;
  font-size: 0.875rem;
  text-align: center;
}

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
}

.checklist-item label {
  font-size: 0.875rem;
  color: var(--text-primary);
  cursor: pointer;
}

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

.risk-circle.low { background: #22c55e; }
.risk-circle.medium { background: #f59e0b; }
.risk-circle.high { background: #ef4444; }

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
}

.indicator-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.indicator-icon.high { color: #ef4444; }
.indicator-icon.medium { color: #f59e0b; }
.indicator-icon.low { color: #3b82f6; }

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
  text-align: center;
  color: var(--text-secondary);
  padding: 2rem;
  font-size: 0.875rem;
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

.btn:hover {
  opacity: 0.9;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

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

  .header-actions {
    width: 100%;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>
