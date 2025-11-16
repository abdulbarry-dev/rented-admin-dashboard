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
      <KPICard
        v-for="(kpi, index) in kpiMetrics"
        :key="kpi.title"
        :title="kpi.title"
        :value="kpi.value"
        :growth="kpi.growth"
        :subtitle="kpi.subtitle"
        :icon="kpi.icon"
        :color="kpi.color"
        :animation-delay="index * 0.1"
      />
    </section>    <!-- Charts Section -->
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
          <QuickStatCard
            v-for="stat in quickStats"
            :key="stat.label"
            :label="stat.label"
            :value="stat.value"
            :change="stat.change"
            :change-type="stat.changeType"
            :icon="stat.icon"
            :color="stat.color"
          />
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
          <ActivityItem
            v-for="activity in recentActivity"
            :key="activity.id"
            :action="activity.action"
            :admin="activity.admin"
            :timestamp="activity.timestamp"
            :icon="activity.icon"
            :color="activity.color"
          />
        </div>
      </section>

      <!-- Alerts & Notifications -->
      <section class="alerts-card">
        <div class="card-header">
          <h2 class="card-title">Alerts</h2>
          <span class="alert-count">{{ alerts.length }}</span>
        </div>
        <div class="alerts-list">
          <AlertItem
            v-for="alert in alerts"
            :key="alert.id"
            :message="alert.message"
            :severity="alert.severity"
            :timestamp="alert.timestamp"
            @dismiss="dismissAlert(alert.id)"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
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
  DocumentTextIcon
} from '@heroicons/vue/24/outline'
import LineChart from '@/components/charts/LineChart.vue'
import KPICard from '@/components/dashboard/KPICard.vue'
import QuickStatCard from '@/components/dashboard/QuickStatCard.vue'
import ActivityItem from '@/components/dashboard/ActivityItem.vue'
import AlertItem from '@/components/dashboard/AlertItem.vue'
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

const dismissAlert = (id: number) => {
  const index = alerts.value.findIndex(alert => alert.id === id)
  if (index !== -1) {
    alerts.value.splice(index, 1)
  }
}
</script><style scoped>
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

/* Tablet Responsive */
@media (max-width: 1024px) {
  .kpi-section {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
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
