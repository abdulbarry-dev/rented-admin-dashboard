<template>
  <div class="dashboard-overview">
    <!-- KPI Cards Section -->
    <section class="kpi-cards">
      <div v-for="kpi in kpiMetrics" :key="kpi.title" class="kpi-card">
        <div class="kpi-value">{{ kpi.value }}</div>
        <div class="kpi-title">{{ kpi.title }}</div>
        <div class="kpi-growth" :class="{ positive: kpi.growth > 0, negative: kpi.growth < 0 }">
          <ArrowUpIcon v-if="kpi.growth > 0" class="growth-icon" />
          <ArrowDownIcon v-else-if="kpi.growth < 0" class="growth-icon" />
          {{ Math.abs(kpi.growth) }}%
        </div>
      </div>
    </section>

    <!-- Revenue Trend Chart -->
    <section class="revenue-chart">
      <h2>Revenue Trend</h2>
      <line-chart
        :labels="revenueData.labels"
        :datasets="revenueData.datasets"
        :height="300"
      />
    </section>

    <!-- Recent Activity Timeline -->
    <section class="recent-activity">
      <h2>Recent Activity</h2>
      <ul>
        <li v-for="activity in recentActivity" :key="activity.id">
          <span class="activity-action">{{ activity.action }}</span>
          <span class="activity-admin">by {{ activity.admin }}</span>
          <span class="activity-timestamp">{{ activity.timestamp }}</span>
        </li>
      </ul>
    </section>

    <!-- Alerts Section -->
    <section class="alerts">
      <h2>Alerts</h2>
      <div v-for="alert in alerts" :key="alert.id" class="alert" :class="alert.severity">
        <p>{{ alert.message }}</p>
        <span class="alert-timestamp">{{ alert.timestamp }}</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/solid'
import LineChart from '@/components/charts/LineChart.vue'

const kpiMetrics = ref([
  { title: 'Total Users', value: 1200, growth: 5 },
  { title: 'Pending Verifications', value: 45, growth: -10 },
  { title: 'Active Listings', value: 320, growth: 2 },
  { title: 'Ongoing Transactions', value: 75, growth: 8 },
  { title: 'Daily Revenue', value: '$1,200', growth: 15 },
  { title: 'System Health', value: 'Good', growth: 0 }
])

const revenueData = ref({
  labels: ['2025-11-01', '2025-11-02', '2025-11-03', '2025-11-04', '2025-11-05'],
  datasets: [
    {
      label: 'Revenue',
      data: [1000, 1200, 900, 1100, 1300],
      borderColor: '#3498db',
      backgroundColor: 'rgba(52, 152, 219, 0.2)',
      fill: true,
      tension: 0.4
    }
  ]
})

const recentActivity = ref([
  { id: 1, action: 'User Registered', admin: 'Admin1', timestamp: '2 mins ago' },
  { id: 2, action: 'Verification Approved', admin: 'Admin2', timestamp: '10 mins ago' },
  { id: 3, action: 'Item Listed', admin: 'Admin3', timestamp: '1 hour ago' }
])

const alerts = ref([
  { id: 1, message: 'Server downtime detected', severity: 'critical', timestamp: '5 mins ago' },
  { id: 2, message: 'High priority verification pending', severity: 'warning', timestamp: '15 mins ago' }
])
</script>

<style scoped>
.dashboard-overview {
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.kpi-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.25rem;
}

.kpi-card {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 1.25rem;
  text-align: center;
  transition: all var(--transition-fast);
  border: 1px solid var(--border-color);
}

.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.kpi-value {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.kpi-title {
  font-size: 0.875rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: 0.75rem;
}

.kpi-growth {
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  font-weight: 600;
}

.kpi-growth.positive {
  color: var(--success-color);
}

.kpi-growth.negative {
  color: var(--error-color);
}

.growth-icon {
  width: 14px;
  height: 14px;
}

.revenue-chart,
.recent-activity,
.alerts {
  background: white;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.revenue-chart h2,
.recent-activity h2,
.alerts h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1.25rem;
}

.recent-activity ul {
  list-style: none;
}

.recent-activity li {
  padding: 0.875rem 0;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.recent-activity li:last-child {
  border-bottom: none;
}

.activity-action {
  font-weight: 600;
  color: var(--text-primary);
}

.activity-admin {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.activity-timestamp {
  color: var(--text-muted);
  font-size: 0.875rem;
  margin-left: auto;
}

.alert {
  padding: 1rem;
  border-radius: var(--radius-sm);
  margin-bottom: 0.875rem;
  position: relative;
}

.alert:last-child {
  margin-bottom: 0;
}

.alert p {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.alert.critical {
  background: #fef2f2;
  border-left: 4px solid var(--error-color);
  color: #991b1b;
}

.alert.warning {
  background: #fffbeb;
  border-left: 4px solid var(--warning-color);
  color: #92400e;
}

.alert-timestamp {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Tablet styles */
@media (max-width: 1024px) {
  .kpi-cards {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .kpi-value {
    font-size: 1.5rem;
  }

  .revenue-chart,
  .recent-activity,
  .alerts {
    padding: 1.25rem;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .dashboard-overview {
    gap: 1rem;
  }

  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .kpi-card {
    padding: 1rem;
  }

  .kpi-value {
    font-size: 1.25rem;
  }

  .kpi-title {
    font-size: 0.75rem;
  }

  .kpi-growth {
    font-size: 0.75rem;
  }

  .revenue-chart,
  .recent-activity,
  .alerts {
    padding: 1rem;
  }

  .revenue-chart h2,
  .recent-activity h2,
  .alerts h2 {
    font-size: 1rem;
  }

  .recent-activity li {
    flex-direction: column;
    align-items: flex-start;
  }

  .activity-timestamp {
    margin-left: 0;
  }

  .alert {
    padding: 0.875rem;
  }
}

/* Small mobile */
@media (max-width: 480px) {
  .kpi-cards {
    grid-template-columns: 1fr;
  }
}
</style>
