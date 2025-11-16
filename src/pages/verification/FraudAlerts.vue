<template>
  <div class="fraud-alerts">
    <div class="page-header">
      <div>
        <h1>Fraud Alerts</h1>
        <p class="subtitle">AI-powered fraud detection and monitoring</p>
      </div>
      <button class="btn primary" @click="refreshAlerts">
        <ArrowPathIcon class="icon" />
        Refresh
      </button>
    </div>

    <!-- Alert Stats -->
    <div class="stats-grid">
      <div class="stat-card critical">
        <div class="stat-icon-wrapper">
          <ExclamationTriangleIcon class="stat-icon" />
        </div>
        <div class="stat-content">
          <span class="stat-label">Critical Alerts</span>
          <span class="stat-value">{{ stats.critical }}</span>
        </div>
      </div>
      <div class="stat-card high">
        <div class="stat-icon-wrapper">
          <ShieldExclamationIcon class="stat-icon" />
        </div>
        <div class="stat-content">
          <span class="stat-label">High Priority</span>
          <span class="stat-value">{{ stats.high }}</span>
        </div>
      </div>
      <div class="stat-card medium">
        <div class="stat-icon-wrapper">
          <FlagIcon class="stat-icon" />
        </div>
        <div class="stat-content">
          <span class="stat-label">Medium Priority</span>
          <span class="stat-value">{{ stats.medium }}</span>
        </div>
      </div>
      <div class="stat-card resolved">
        <div class="stat-icon-wrapper">
          <CheckCircleIcon class="stat-icon" />
        </div>
        <div class="stat-content">
          <span class="stat-label">Resolved Today</span>
          <span class="stat-value">{{ stats.resolved }}</span>
        </div>
      </div>
    </div>

    <!-- Severity Tabs -->
    <div class="tabs-section">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          class="tab"
          :class="{ active: activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
          <span v-if="tab.count > 0" class="tab-badge">{{ tab.count }}</span>
        </button>
      </div>
    </div>

    <!-- Alerts List -->
    <div class="alerts-section">
      <div v-if="filteredAlerts.length === 0" class="empty-state">
        <CheckCircleIcon class="empty-icon" />
        <h3>No {{ activeTab }} alerts</h3>
        <p>All {{ activeTab }} severity alerts have been resolved</p>
      </div>

      <div v-else class="alerts-list">
        <div v-for="alert in filteredAlerts" :key="alert.id" class="alert-card" :class="alert.severity">
          <div class="alert-header">
            <div class="alert-severity">
              <ExclamationTriangleIcon v-if="alert.severity === 'critical'" class="severity-icon" />
              <ShieldExclamationIcon v-else-if="alert.severity === 'high'" class="severity-icon" />
              <FlagIcon v-else class="severity-icon" />
              <span class="severity-label">{{ alert.severity }}</span>
            </div>
            <span class="alert-time">{{ formatTimeAgo(alert.detectedAt) }}</span>
          </div>

          <div class="alert-body">
            <h3 class="alert-title">{{ alert.type }}</h3>
            <p class="alert-description">{{ alert.description }}</p>

            <div class="alert-details">
              <div class="detail-item">
                <UserIcon class="detail-icon" />
                <div>
                  <span class="detail-label">User</span>
                  <span class="detail-value">{{ alert.user.name }}</span>
                </div>
              </div>
              <div class="detail-item">
                <DocumentTextIcon class="detail-icon" />
                <div>
                  <span class="detail-label">Document</span>
                  <span class="detail-value">{{ alert.documentType }}</span>
                </div>
              </div>
              <div class="detail-item">
                <ChartBarIcon class="detail-icon" />
                <div>
                  <span class="detail-label">Risk Score</span>
                  <span class="detail-value risk-score" :class="getRiskClass(alert.riskScore)">
                    {{ alert.riskScore }}/100
                  </span>
                </div>
              </div>
            </div>

            <div v-if="alert.indicators && alert.indicators.length > 0" class="indicators">
              <h4 class="indicators-title">Detected Patterns:</h4>
              <ul class="indicators-list">
                <li v-for="(indicator, idx) in alert.indicators" :key="idx">
                  {{ indicator }}
                </li>
              </ul>
            </div>
          </div>

          <div class="alert-actions">
            <button class="action-btn secondary" @click="viewDetails(alert.id)">
              <EyeIcon class="icon" />
              View Details
            </button>
            <button class="action-btn danger" @click="investigateAlert(alert.id)">
              <MagnifyingGlassIcon class="icon" />
              Investigate
            </button>
            <button class="action-btn success" @click="resolveAlert(alert.id)">
              <CheckIcon class="icon" />
              Resolve
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ExclamationTriangleIcon,
  ShieldExclamationIcon,
  FlagIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  UserIcon,
  DocumentTextIcon,
  ChartBarIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

interface Alert {
  id: string
  severity: 'critical' | 'high' | 'medium'
  type: string
  description: string
  user: {
    name: string
    email: string
  }
  documentType: string
  riskScore: number
  detectedAt: string
  indicators?: string[]
}

const router = useRouter()

const stats = ref({
  critical: 8,
  high: 23,
  medium: 47,
  resolved: 156
})

const activeTab = ref<'all' | 'critical' | 'high' | 'medium'>('all')

const tabs = computed(() => [
  { label: 'All Alerts', value: 'all' as const, count: stats.value.critical + stats.value.high + stats.value.medium },
  { label: 'Critical', value: 'critical' as const, count: stats.value.critical },
  { label: 'High', value: 'high' as const, count: stats.value.high },
  { label: 'Medium', value: 'medium' as const, count: stats.value.medium }
])

const alerts = ref<Alert[]>([
  {
    id: 'FA001',
    severity: 'critical',
    type: 'Document Tampering Detected',
    description: 'Multiple alterations detected in passport document with AI confidence score of 98%',
    user: { name: 'John Suspicious', email: 'john.sus@example.com' },
    documentType: 'Passport',
    riskScore: 95,
    detectedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    indicators: [
      'Digital signature mismatch',
      'Inconsistent font rendering',
      'Background pattern irregularities',
      'Photo metadata manipulation'
    ]
  },
  {
    id: 'FA002',
    severity: 'critical',
    type: 'Identity Theft Suspected',
    description: 'Face match confidence below threshold, possible stolen identity',
    user: { name: 'Jane Doe', email: 'jane@example.com' },
    documentType: 'Driver License',
    riskScore: 92,
    detectedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    indicators: [
      'Biometric mismatch (12% confidence)',
      'Document previously flagged',
      'Multiple failed verification attempts'
    ]
  },
  {
    id: 'FA003',
    severity: 'high',
    type: 'Suspicious Pattern Detected',
    description: 'User behavior matches known fraud patterns from IP location',
    user: { name: 'Bob Smith', email: 'bob@example.com' },
    documentType: 'National ID',
    riskScore: 78,
    detectedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    indicators: [
      'VPN/Proxy usage detected',
      'Rapid account creation',
      'Document from high-risk country'
    ]
  },
  {
    id: 'FA004',
    severity: 'high',
    type: 'Duplicate Document Submission',
    description: 'Same document submitted by multiple user accounts',
    user: { name: 'Alice Wonder', email: 'alice@example.com' },
    documentType: 'Passport',
    riskScore: 85,
    detectedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    indicators: [
      'Document hash matches 3 other accounts',
      'Created within 24 hours of each other',
      'Similar registration patterns'
    ]
  },
  {
    id: 'FA005',
    severity: 'medium',
    type: 'Quality Issues Detected',
    description: 'Document quality below acceptable threshold, possible intentional obfuscation',
    user: { name: 'Charlie Brown', email: 'charlie@example.com' },
    documentType: 'Driver License',
    riskScore: 65,
    detectedAt: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    indicators: [
      'Blurred critical information',
      'Low resolution upload',
      'Reflections obscuring data'
    ]
  }
])

const filteredAlerts = computed(() => {
  if (activeTab.value === 'all') {
    return alerts.value
  }
  return alerts.value.filter(alert => alert.severity === activeTab.value)
})

const formatTimeAgo = (date: string) => {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

const getRiskClass = (score: number) => {
  if (score >= 80) return 'critical'
  if (score >= 60) return 'high'
  return 'medium'
}

const refreshAlerts = () => {
  console.log('Refreshing fraud alerts...')
}

const viewDetails = (id: string) => {
  router.push(`/verification/detail/${id}`)
}

const investigateAlert = (id: string) => {
  console.log('Investigating alert:', id)
}

const resolveAlert = (id: string) => {
  const index = alerts.value.findIndex(a => a.id === id)
  if (index !== -1) {
    alerts.value.splice(index, 1)
    stats.value.resolved++
    const severity = alerts.value[index]?.severity
    if (severity && severity in stats.value) {
      stats.value[severity as keyof typeof stats.value]--
    }
  }
}
</script>

<style scoped>
.fraud-alerts {
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

.btn .icon {
  width: 18px;
  height: 18px;
}

.btn:hover {
  opacity: 0.9;
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

.stat-card.critical { border-left: 4px solid #dc2626; }
.stat-card.high { border-left: 4px solid #f59e0b; }
.stat-card.medium { border-left: 4px solid #3b82f6; }
.stat-card.resolved { border-left: 4px solid #22c55e; }

.stat-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.critical .stat-icon-wrapper { background: rgba(220, 38, 38, 0.1); }
.stat-card.high .stat-icon-wrapper { background: rgba(245, 158, 11, 0.1); }
.stat-card.medium .stat-icon-wrapper { background: rgba(59, 130, 246, 0.1); }
.stat-card.resolved .stat-icon-wrapper { background: rgba(34, 197, 94, 0.1); }

.stat-icon {
  width: 24px;
  height: 24px;
}

.stat-card.critical .stat-icon { color: #dc2626; }
.stat-card.high .stat-icon { color: #f59e0b; }
.stat-card.medium .stat-icon { color: #3b82f6; }
.stat-card.resolved .stat-icon { color: #22c55e; }

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

.tabs-section {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 0.5rem;
  border: 1px solid var(--border-color);
}

.tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.tab.active {
  background: var(--primary-color);
  color: white;
}

.tab-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.2);
  font-size: 0.75rem;
  font-weight: 600;
}

.tab.active .tab-badge {
  background: rgba(255, 255, 255, 0.25);
}

.alerts-section {
  min-height: 400px;
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
  color: #22c55e;
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

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.alert-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.alert-card.critical { border-left: 4px solid #dc2626; }
.alert-card.high { border-left: 4px solid #f59e0b; }
.alert-card.medium { border-left: 4px solid #3b82f6; }

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.alert-severity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.severity-icon {
  width: 24px;
  height: 24px;
}

.alert-card.critical .severity-icon { color: #dc2626; }
.alert-card.high .severity-icon { color: #f59e0b; }
.alert-card.medium .severity-icon { color: #3b82f6; }

.severity-label {
  padding: 0.375rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.alert-card.critical .severity-label {
  background: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.alert-card.high .severity-label {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.alert-card.medium .severity-label {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.alert-time {
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.alert-body {
  margin-bottom: 1.5rem;
}

.alert-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.alert-description {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0 0 1.25rem 0;
  line-height: 1.6;
}

.alert-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.detail-icon {
  width: 20px;
  height: 20px;
  color: var(--text-secondary);
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.detail-item > div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
}

.risk-score.critical { color: #dc2626; }
.risk-score.high { color: #f59e0b; }
.risk-score.medium { color: #3b82f6; }

.indicators {
  margin-top: 1rem;
}

.indicators-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.75rem 0;
}

.indicators-list {
  margin: 0;
  padding-left: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.indicators-list li {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.alert-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn .icon {
  width: 16px;
  height: 16px;
}

.action-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-secondary);
}

.action-btn.danger {
  background: #dc2626;
  color: white;
  border-color: #dc2626;
}

.action-btn.success {
  background: #22c55e;
  color: white;
  border-color: #22c55e;
}

.action-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .alert-details {
    grid-template-columns: 1fr;
  }

  .alert-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
