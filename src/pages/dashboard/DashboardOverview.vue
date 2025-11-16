<template>
  <div class="dashboard-overview">
    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard Overview</h1>
        <p class="page-subtitle">Welcome back! Here's what's happening today.</p>
      </div>
      <div class="header-actions">
        <button class="action-btn secondary">
          <ArrowPathIcon class="icon" />
          <span>Refresh</span>
        </button>
        <button class="action-btn primary">
          <ArrowDownTrayIcon class="icon" />
          <span>Export</span>
        </button>
      </div>
    </div>

    <!-- KPI Cards Grid -->
    <section class="kpi-section">
      <div
        v-for="(kpi, index) in kpiMetrics"
        :key="kpi.title"
        class="kpi-card"
        :style="{ animationDelay: `${index * 0.1}s` }"
      >
        <div class="kpi-header">
          <div class="kpi-icon" :class="`icon-${kpi.color}`">
            <component :is="kpi.icon" class="icon" />
          </div>
          <div class="kpi-trend" :class="{ positive: kpi.growth > 0, negative: kpi.growth < 0, neutral: kpi.growth === 0 }">
            <ArrowUpIcon v-if="kpi.growth > 0" class="trend-icon" />
            <ArrowDownIcon v-else-if="kpi.growth < 0" class="trend-icon" />
            <MinusIcon v-else class="trend-icon" />
            <span>{{ Math.abs(kpi.growth) }}%</span>
          </div>
        </div>
        <div class="kpi-body">
          <div class="kpi-value">{{ kpi.value }}</div>
          <div class="kpi-title">{{ kpi.title }}</div>
          <div class="kpi-subtitle">{{ kpi.subtitle }}</div>
        </div>
      </div>
    </section>

    <!-- Charts Section -->
    <div class="charts-grid">
      <!-- Revenue Chart -->
      <section class="chart-card">
        <div class="card-header">
          <div>
            <h2 class="card-title">Revenue Overview</h2>
            <p class="card-subtitle">Monthly revenue trends</p>
          </div>
          <div class="chart-tabs">
            <button
              v-for="period in ['7D', '30D', '90D', '1Y']"
              :key="period"
              class="tab-btn"
              :class="{ active: selectedPeriod === period }"
              @click="selectedPeriod = period"
            >
              {{ period }}
            </button>
          </div>
        </div>
        <div class="chart-container">
          <line-chart
            :labels="revenueData.labels"
            :datasets="revenueData.datasets"
            :height="280"
          />
        </div>
      </section>

      <!-- Statistics Card -->
      <section class="stats-card">
        <div class="card-header">
          <h2 class="card-title">Quick Stats</h2>
        </div>
        <div class="stats-list">
          <div v-for="stat in quickStats" :key="stat.label" class="stat-item">
            <div class="stat-icon" :class="`bg-${stat.color}`">
              <component :is="stat.icon" class="icon" />
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
            <div class="stat-change" :class="stat.changeType">
              {{ stat.change }}
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Activity & Alerts Grid -->
    <div class="activity-grid">
      <!-- Recent Activity -->
      <section class="activity-card">
        <div class="card-header">
          <h2 class="card-title">Recent Activity</h2>
          <button class="view-all-btn">View All</button>
        </div>
        <div class="activity-list">
          <div v-for="activity in recentActivity" :key="activity.id" class="activity-item">
            <div class="activity-icon" :class="`bg-${activity.color}`">
              <component :is="activity.icon" class="icon" />
            </div>
            <div class="activity-content">
              <div class="activity-text">
                <span class="activity-action">{{ activity.action }}</span>
                <span class="activity-admin">by {{ activity.admin }}</span>
              </div>
              <div class="activity-time">{{ activity.timestamp }}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Alerts & Notifications -->
      <section class="alerts-card">
        <div class="card-header">
          <h2 class="card-title">Alerts</h2>
          <span class="alert-count">{{ alerts.length }}</span>
        </div>
        <div class="alerts-list">
          <div v-for="alert in alerts" :key="alert.id" class="alert-item" :class="alert.severity">
            <div class="alert-icon">
              <ExclamationTriangleIcon v-if="alert.severity === 'warning'" class="icon" />
              <ExclamationCircleIcon v-else-if="alert.severity === 'critical'" class="icon" />
              <InformationCircleIcon v-else class="icon" />
            </div>
            <div class="alert-content">
              <p class="alert-message">{{ alert.message }}</p>
              <span class="alert-time">{{ alert.timestamp }}</span>
            </div>
            <button class="alert-dismiss">
              <XMarkIcon class="icon" />
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon
} from '@heroicons/vue/24/solid'
import {
  UsersIcon,
  ShieldCheckIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
  ServerIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon,
  UserPlusIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'
import LineChart from '@/components/charts/LineChart.vue'
import type { Component } from 'vue'

interface KPI {
  title: string
  value: string | number
  growth: number
  subtitle: string
  icon: Component
  color: string
}

interface QuickStat {
  label: string
  value: string | number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: Component
  color: string
}

interface Activity {
  id: number
  action: string
  admin: string
  timestamp: string
  icon: Component
  color: string
}

interface Alert {
  id: number
  message: string
  severity: 'critical' | 'warning' | 'info'
  timestamp: string
}

const selectedPeriod = ref('30D')

const kpiMetrics = ref<KPI[]>([
  {
    title: 'Total Users',
    value: '1,234',
    growth: 12.5,
    subtitle: '+48 this week',
    icon: UsersIcon,
    color: 'blue'
  },
  {
    title: 'Pending Verifications',
    value: 45,
    growth: -8.2,
    subtitle: '12 high priority',
    icon: ShieldCheckIcon,
    color: 'purple'
  },
  {
    title: 'Active Listings',
    value: 320,
    growth: 5.7,
    subtitle: '28 new today',
    icon: CubeIcon,
    color: 'green'
  },
  {
    title: 'Transactions',
    value: 89,
    growth: 15.3,
    subtitle: '$12.4k total',
    icon: ArrowsRightLeftIcon,
    color: 'orange'
  },
  {
    title: 'Revenue',
    value: '$24.5k',
    growth: 22.8,
    subtitle: 'This month',
    icon: CurrencyDollarIcon,
    color: 'teal'
  },
  {
    title: 'System Status',
    value: '99.8%',
    growth: 0,
    subtitle: 'Uptime',
    icon: ServerIcon,
    color: 'indigo'
  }
])

const quickStats = ref<QuickStat[]>([
  {
    label: 'New Signups',
    value: 127,
    change: '+18%',
    changeType: 'positive',
    icon: UserPlusIcon,
    color: 'blue'
  },
  {
    label: 'Completed Verifications',
    value: 64,
    change: '+12%',
    changeType: 'positive',
    icon: CheckCircleIcon,
    color: 'green'
  },
  {
    label: 'Active Sessions',
    value: 342,
    change: '-5%',
    changeType: 'negative',
    icon: UsersIcon,
    color: 'purple'
  },
  {
    label: 'Pending Reports',
    value: 8,
    change: '+2',
    changeType: 'neutral',
    icon: DocumentTextIcon,
    color: 'orange'
  }
])

const revenueData = ref({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Revenue',
      data: [12000, 19000, 15000, 21000, 18000, 24000, 22000, 28000, 25000, 30000, 27000, 32000],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }
  ]
})

const recentActivity = ref<Activity[]>([
  {
    id: 1,
    action: 'New user registered',
    admin: 'System',
    timestamp: '2 mins ago',
    icon: UserPlusIcon,
    color: 'blue'
  },
  {
    id: 2,
    action: 'Verification approved',
    admin: 'Admin Sarah',
    timestamp: '15 mins ago',
    icon: CheckCircleIcon,
    color: 'green'
  },
  {
    id: 3,
    action: 'Item listing created',
    admin: 'John Doe',
    timestamp: '32 mins ago',
    icon: CubeIcon,
    color: 'purple'
  },
  {
    id: 4,
    action: 'Transaction completed',
    admin: 'System',
    timestamp: '1 hour ago',
    icon: ArrowsRightLeftIcon,
    color: 'teal'
  },
  {
    id: 5,
    action: 'Security scan completed',
    admin: 'Auto Security',
    timestamp: '2 hours ago',
    icon: ShieldCheckIcon,
    color: 'indigo'
  }
])

const alerts = ref<Alert[]>([
  {
    id: 1,
    message: 'Server maintenance scheduled for tonight at 2:00 AM',
    severity: 'warning',
    timestamp: '30 mins ago'
  },
  {
    id: 2,
    message: '5 high-priority verifications require immediate attention',
    severity: 'critical',
    timestamp: '1 hour ago'
  },
  {
    id: 3,
    message: 'System backup completed successfully',
    severity: 'info',
    timestamp: '3 hours ago'
  }
])
</script>

<style scoped>
/* Dashboard Container */
.dashboard-overview {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.375rem 0;
  transition: color 0.3s ease;
}

.page-subtitle {
  font-size: 0.9375rem;
  color: var(--text-secondary);
  margin: 0;
  transition: color 0.3s ease;
}

.header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
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
  stroke-width: 2;
}

.action-btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.action-btn.secondary:hover {
  background: var(--bg-color);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.action-btn.primary {
  background: var(--primary-color);
  color: white;
  border: 1px solid var(--primary-color);
}

.action-btn.primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* KPI Cards Section */
.kpi-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.25rem;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.kpi-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.5s ease-out backwards;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.kpi-icon .icon {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

.kpi-icon.icon-blue {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.kpi-icon.icon-purple {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.kpi-icon.icon-green {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.kpi-icon.icon-orange {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.kpi-icon.icon-teal {
  background: rgba(20, 184, 166, 0.1);
  color: #14b8a6;
}

.kpi-icon.icon-indigo {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.kpi-trend .trend-icon {
  width: 12px;
  height: 12px;
}

.kpi-trend.positive {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.kpi-trend.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.kpi-trend.neutral {
  background: var(--bg-color);
  color: var(--text-muted);
}

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  transition: color 0.3s ease;
}

.kpi-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.kpi-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.25rem;
}

/* Card Styles */
.chart-card,
.stats-card,
.activity-card,
.alerts-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card-header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.card-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  transition: color 0.3s ease;
}

.card-subtitle {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0.25rem 0 0 0;
  transition: color 0.3s ease;
}

.chart-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-btn {
  padding: 0.375rem 0.875rem;
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid var(--border-color);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: var(--bg-color);
  color: var(--text-primary);
}

.tab-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.chart-container {
  padding: 1.5rem;
}

/* Quick Stats */
.stats-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--bg-color);
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.stat-item:hover {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  transform: translateX(4px);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon .icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  color: white;
}

.stat-icon.bg-blue { background: #3b82f6; }
.stat-icon.bg-green { background: #22c55e; }
.stat-icon.bg-purple { background: #8b5cf6; }
.stat-icon.bg-orange { background: #f59e0b; }

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.stat-change {
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
}

.stat-change.positive {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.stat-change.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.stat-change.neutral {
  background: var(--bg-secondary);
  color: var(--text-muted);
}

/* Activity Grid */
.activity-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

/* Activity List */
.view-all-btn {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--primary-color);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.activity-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--bg-color);
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.activity-item:hover {
  background: var(--bg-secondary);
  border-color: var(--border-color);
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon .icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  color: white;
}

.activity-icon.bg-blue { background: #3b82f6; }
.activity-icon.bg-green { background: #22c55e; }
.activity-icon.bg-purple { background: #8b5cf6; }
.activity-icon.bg-teal { background: #14b8a6; }
.activity-icon.bg-indigo { background: #6366f1; }

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.25rem;
}

.activity-action {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.activity-admin {
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

/* Alerts */
.alert-count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  padding: 0 0.5rem;
  border-radius: 12px;
  background: var(--error-color);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
}

.alerts-list {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid;
  transition: all 0.2s ease;
}

.alert-item.critical {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.2);
}

.alert-item.warning {
  background: rgba(245, 158, 11, 0.05);
  border-color: rgba(245, 158, 11, 0.2);
}

.alert-item.info {
  background: rgba(59, 130, 246, 0.05);
  border-color: rgba(59, 130, 246, 0.2);
}

.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon .icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.alert-item.critical .alert-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.alert-item.warning .alert-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.alert-item.info .alert-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-message {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 0.375rem 0;
  line-height: 1.5;
  transition: color 0.3s ease;
}

.alert-time {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.alert-dismiss {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.alert-dismiss:hover {
  background: var(--bg-color);
  color: var(--text-primary);
}

.alert-dismiss .icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

/* Tablet Responsive */
@media (max-width: 1024px) {
  .kpi-section {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .kpi-card {
    padding: 1.25rem;
  }

  .kpi-icon {
    width: 40px;
    height: 40px;
  }

  .kpi-icon .icon {
    width: 20px;
    height: 20px;
  }

  .kpi-value {
    font-size: 1.5rem;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .activity-grid {
    grid-template-columns: 1fr;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .dashboard-overview {
    gap: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-subtitle {
    font-size: 0.875rem;
  }

  .header-actions {
    width: 100%;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .kpi-section {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .kpi-card {
    padding: 1rem;
  }

  .kpi-icon {
    width: 36px;
    height: 36px;
  }

  .kpi-icon .icon {
    width: 18px;
    height: 18px;
  }

  .kpi-value {
    font-size: 1.25rem;
  }

  .kpi-title {
    font-size: 0.75rem;
  }

  .kpi-subtitle {
    font-size: 0.6875rem;
  }

  .card-header {
    padding: 1.25rem 1.25rem 0.875rem 1.25rem;
  }

  .card-title {
    font-size: 1rem;
  }

  .chart-tabs {
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 0.25rem 0.625rem;
    font-size: 0.75rem;
  }

  .chart-container {
    padding: 1rem;
  }

  .stats-list,
  .activity-list,
  .alerts-list {
    padding: 0.75rem;
  }

  .stat-item,
  .activity-item,
  .alert-item {
    padding: 0.875rem;
  }

  .stat-icon,
  .activity-icon,
  .alert-icon {
    width: 32px;
    height: 32px;
  }

  .stat-icon .icon,
  .activity-icon .icon,
  .alert-icon .icon {
    width: 16px;
    height: 16px;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .kpi-section {
    grid-template-columns: 1fr;
  }

  .action-btn span {
    display: none;
  }

  .action-btn {
    padding: 0.625rem;
    min-width: 44px;
  }
}
</style>
