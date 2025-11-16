<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  UserGroupIcon,
  UserPlusIcon,
  ArrowPathIcon,
  ChartBarSquareIcon
} from '@heroicons/vue/24/outline'
import StatCard from '@/components/analytics/StatCard.vue'
import ChartCard from '@/components/analytics/ChartCard.vue'
import PeriodSelector, { type Period } from '@/components/analytics/PeriodSelector.vue'
import MetricCard from '@/components/analytics/MetricCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'

const selectedPeriod = ref<Period>('30d')
const loading = ref(false)

// KPI Data
const userKpis = [
  {
    title: 'Total Users',
    value: '124,583',
    growth: 18.4,
    subtitle: 'All time registrations',
    icon: UserGroupIcon,
    color: 'blue' as const
  },
  {
    title: 'New Users',
    value: '8,247',
    growth: 12.8,
    subtitle: 'Last 30 days',
    icon: UserPlusIcon,
    color: 'green' as const
  },
  {
    title: 'Active Users',
    value: '24,583',
    growth: 8.3,
    subtitle: 'Monthly active',
    icon: UserGroupIcon,
    color: 'purple' as const
  },
  {
    title: 'Retention Rate',
    value: '68.2%',
    growth: 5.7,
    subtitle: '30-day retention',
    icon: ArrowPathIcon,
    color: 'orange' as const
  }
]

// User growth trend data
const userGrowthData = computed(() => {
  const labels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  return {
    labels,
    datasets: [
      {
        label: 'New Users',
        data: [6200, 7100, 6800, 8300, 7900, 9100, 9800, 10200, 9600, 11100, 10700, 8247],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Active Users',
        data: [15200, 16800, 17100, 18900, 19300, 20800, 21500, 22400, 22100, 23800, 24100, 24583],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// Cohort retention data
const cohortRetentionData = computed(() => {
  const labels = ['Week 0', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7']

  return {
    labels,
    datasets: [
      {
        label: 'Cohort Retention',
        data: [100, 85, 73, 68, 64, 61, 59, 57],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// User acquisition channels
const acquisitionChannelsData = computed(() => {
  return {
    labels: ['Organic Search', 'Social Media', 'Direct', 'Referral', 'Paid Ads', 'Email'],
    datasets: [
      {
        label: 'New Users',
        data: [3247, 2156, 1893, 1456, 987, 508],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(6, 182, 212, 0.8)'
        ]
      }
    ]
  }
})

// User demographics - Age groups
const ageDistribution = computed(() => {
  return {
    labels: ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'],
    data: [18234, 42567, 31289, 19847, 9234, 3412],
    colors: [
      '#3b82f6',
      '#8b5cf6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#06b6d4'
    ]
  }
})

// User activity by day
const activityByDayData = computed(() => {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return {
    labels,
    datasets: [
      {
        label: 'Daily Active Users',
        data: [18234, 19567, 20123, 21456, 22890, 24567, 23123],
        backgroundColor: 'rgba(139, 92, 246, 0.8)'
      }
    ]
  }
})

// Quick metrics
const quickMetrics = [
  { label: 'Daily Active Users', value: '18,234', change: 8.4 },
  { label: 'Churn Rate', value: '2.3%', change: -15.2 },
  { label: 'Avg Session Time', value: '12m 34s', change: 18.9 },
  { label: 'User Lifetime Value', value: '$247', change: 23.5 }
]

const downloadChart = (chartName: string) => {
  console.log(`Downloading ${chartName} chart...`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            User Growth Analytics
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Track user acquisition, engagement, retention, and demographics
          </p>
        </div>
        <PeriodSelector v-model="selectedPeriod" />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        v-for="(kpi, index) in userKpis"
        :key="kpi.title"
        :title="kpi.title"
        :value="kpi.value"
        :growth="kpi.growth"
        :subtitle="kpi.subtitle"
        :icon="kpi.icon"
        :color="kpi.color"
        :animation-delay="index * 0.1"
        :loading="loading"
      />
    </div>

    <!-- Quick Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard
        v-for="metric in quickMetrics"
        :key="metric.label"
        :label="metric.label"
        :value="metric.value"
        :change="metric.change"
      />
    </div>

    <!-- User Growth Trend -->
    <div class="mb-8">
      <ChartCard
        title="User Growth Trend"
        subtitle="Monthly new user registrations and active user count"
        @download="downloadChart('user-growth')"
      >
        <LineChart
          :labels="userGrowthData.labels"
          :datasets="userGrowthData.datasets"
          :height="400"
        />
      </ChartCard>
    </div>

    <!-- Retention & Acquisition -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Cohort Retention Chart -->
      <ChartCard
        title="Cohort Retention Analysis"
        subtitle="User retention over 8-week period"
        @download="downloadChart('cohort-retention')"
      >
        <LineChart
          :labels="cohortRetentionData.labels"
          :datasets="cohortRetentionData.datasets"
          :height="300"
        />
      </ChartCard>

      <!-- Acquisition Channels Chart -->
      <ChartCard
        title="User Acquisition Channels"
        subtitle="New users by acquisition source"
        @download="downloadChart('acquisition-channels')"
      >
        <BarChart
          :labels="acquisitionChannelsData.labels"
          :datasets="acquisitionChannelsData.datasets"
          :height="300"
        />
      </ChartCard>
    </div>

    <!-- Demographics & Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Age Distribution -->
      <div class="lg:col-span-1">
        <ChartCard
          title="Age Distribution"
          subtitle="User demographics by age group"
          @download="downloadChart('age-distribution')"
        >
          <DoughnutChart
            :labels="ageDistribution.labels"
            :data="ageDistribution.data"
            :colors="ageDistribution.colors"
            :height="300"
            cutout="60%"
          />
        </ChartCard>
      </div>

      <!-- Activity by Day -->
      <div class="lg:col-span-2">
        <ChartCard
          title="User Activity by Day"
          subtitle="Average daily active users by day of week"
          @download="downloadChart('activity-by-day')"
        >
          <BarChart
            :labels="activityByDayData.labels"
            :datasets="activityByDayData.datasets"
            :height="300"
          />
        </ChartCard>
      </div>
    </div>

    <!-- Insights Grid -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Key User Insights
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 class="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            👥 Rapid User Growth
          </h4>
          <p class="text-sm text-blue-700 dark:text-blue-300">
            User base has grown by 18.4% this month, with organic search driving 39% of new registrations.
          </p>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 class="font-semibold text-green-900 dark:text-green-200 mb-2">
            🔄 Strong Retention
          </h4>
          <p class="text-sm text-green-700 dark:text-green-300">
            30-day retention rate of 68.2% exceeds industry average, with steady engagement over time.
          </p>
        </div>
        <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h4 class="font-semibold text-purple-900 dark:text-purple-200 mb-2">
            📊 Prime Demographics
          </h4>
          <p class="text-sm text-purple-700 dark:text-purple-300">
            25-34 age group represents 34% of user base and shows highest engagement and conversion rates.
          </p>
        </div>
        <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <h4 class="font-semibold text-orange-900 dark:text-orange-200 mb-2">
            📅 Weekend Engagement
          </h4>
          <p class="text-sm text-orange-700 dark:text-orange-300">
            Saturdays show peak user activity with 24,567 daily active users, 15% above weekday average.
          </p>
        </div>
        <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <h4 class="font-semibold text-red-900 dark:text-red-200 mb-2">
            📉 Low Churn Rate
          </h4>
          <p class="text-sm text-red-700 dark:text-red-300">
            Monthly churn rate of 2.3% has decreased by 15.2%, indicating improved user satisfaction.
          </p>
        </div>
        <div class="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
          <h4 class="font-semibold text-teal-900 dark:text-teal-200 mb-2">
            💰 High Lifetime Value
          </h4>
          <p class="text-sm text-teal-700 dark:text-teal-300">
            Average user lifetime value of $247 has increased 23.5%, driven by repeat transactions.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
