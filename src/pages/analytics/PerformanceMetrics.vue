<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ServerIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CpuChipIcon,
  CircleStackIcon,
  SignalIcon
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
const performanceKpis = [
  {
    title: 'System Uptime',
    value: '99.98%',
    growth: 0.02,
    subtitle: 'Last 30 days',
    icon: ServerIcon,
    color: 'green' as const
  },
  {
    title: 'Avg Response Time',
    value: '142ms',
    growth: -8.3,
    subtitle: 'API endpoints',
    icon: ClockIcon,
    color: 'blue' as const
  },
  {
    title: 'Error Rate',
    value: '0.12%',
    growth: -25.4,
    subtitle: 'All requests',
    icon: ExclamationTriangleIcon,
    color: 'red' as const
  },
  {
    title: 'Concurrent Users',
    value: '8,234',
    growth: 18.9,
    subtitle: 'Peak capacity',
    icon: SignalIcon,
    color: 'purple' as const
  }
]

// Response time trend
const responseTimeData = computed(() => {
  const labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '23:59']

  return {
    labels,
    datasets: [
      {
        label: 'API Response Time (ms)',
        data: [98, 105, 142, 168, 189, 156, 112],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Database Query Time (ms)',
        data: [45, 52, 68, 82, 91, 73, 56],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// System uptime
const uptimeData = computed(() => {
  const labels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  return {
    labels,
    datasets: [
      {
        label: 'Uptime %',
        data: [99.95, 99.97, 99.98, 99.96, 99.99, 99.98, 99.97, 99.98, 99.99, 99.98, 99.97, 99.98],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// Error distribution
const errorDistribution = computed(() => {
  return {
    labels: ['4xx Client Errors', '5xx Server Errors', 'Timeouts', 'Network Errors', 'Other'],
    data: [1247, 234, 189, 156, 98],
    colors: [
      '#ef4444',
      '#f59e0b',
      '#f97316',
      '#ec4899',
      '#64748b'
    ]
  }
})

// Resource utilization
const resourceUtilizationData = computed(() => {
  return {
    labels: ['CPU', 'Memory', 'Disk', 'Network'],
    datasets: [
      {
        label: 'Utilization %',
        data: [42, 58, 35, 28],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)'
        ]
      }
    ]
  }
})

// API endpoint performance
const endpointPerformanceData = computed(() => {
  return {
    labels: ['/api/users', '/api/items', '/api/orders', '/api/analytics', '/api/search', '/api/auth'],
    datasets: [
      {
        label: 'Avg Response Time (ms)',
        data: [98, 145, 178, 234, 189, 67],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      }
    ]
  }
})

// Traffic volume
const trafficVolumeData = computed(() => {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return {
    labels,
    datasets: [
      {
        label: 'Requests (thousands)',
        data: [542, 589, 612, 634, 678, 723, 589],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// System health metrics
const healthMetrics = [
  { service: 'API Server', status: 'healthy', uptime: '99.98%', response: '142ms', requests: '4.2M' },
  { service: 'Database', status: 'healthy', uptime: '99.99%', response: '68ms', requests: '8.7M' },
  { service: 'Cache Server', status: 'healthy', uptime: '99.97%', response: '12ms', requests: '12.3M' },
  { service: 'File Storage', status: 'healthy', uptime: '99.95%', response: '234ms', requests: '1.8M' },
  { service: 'Search Engine', status: 'degraded', uptime: '99.89%', response: '456ms', requests: '2.1M' },
  { service: 'Email Service', status: 'healthy', uptime: '99.96%', response: '89ms', requests: '456K' }
]

// Quick metrics
const quickMetrics = [
  { label: 'Total Requests', value: '29.5M', change: 12.4 },
  { label: 'Successful Requests', value: '99.88%', change: 0.5 },
  { label: 'Peak Load', value: '12.4K/s', change: 8.9 },
  { label: 'Avg Bandwidth', value: '2.8 GB/s', change: 15.2 }
]

const downloadChart = (chartName: string) => {
  console.log(`Downloading ${chartName} chart...`)
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'healthy':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
    case 'degraded':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
    case 'down':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
    default:
      return 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300'
  }
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Performance Metrics
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            System performance indicators, uptime monitoring, and resource utilization
          </p>
        </div>
        <PeriodSelector v-model="selectedPeriod" />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        v-for="(kpi, index) in performanceKpis"
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

    <!-- Response Time & Uptime -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Response Time Chart -->
      <ChartCard
        title="API Response Time Trends"
        subtitle="Average response time throughout the day"
        @download="downloadChart('response-time')"
      >
        <LineChart
          :labels="responseTimeData.labels"
          :datasets="responseTimeData.datasets"
          :height="300"
        />
      </ChartCard>

      <!-- System Uptime Chart -->
      <ChartCard
        title="System Uptime Percentage"
        subtitle="Monthly uptime tracking"
        @download="downloadChart('uptime')"
      >
        <LineChart
          :labels="uptimeData.labels"
          :datasets="uptimeData.datasets"
          :height="300"
        />
      </ChartCard>
    </div>

    <!-- Error Distribution & Resource Utilization -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Error Distribution -->
      <div class="lg:col-span-1">
        <ChartCard
          title="Error Distribution"
          subtitle="Breakdown of error types"
          @download="downloadChart('error-distribution')"
        >
          <DoughnutChart
            :labels="errorDistribution.labels"
            :data="errorDistribution.data"
            :colors="errorDistribution.colors"
            :height="300"
            cutout="60%"
          />
        </ChartCard>
      </div>

      <!-- Resource Utilization -->
      <div class="lg:col-span-2">
        <ChartCard
          title="Resource Utilization"
          subtitle="Current system resource usage"
          @download="downloadChart('resource-utilization')"
        >
          <BarChart
            :labels="resourceUtilizationData.labels"
            :datasets="resourceUtilizationData.datasets"
            :height="300"
          />
        </ChartCard>
      </div>
    </div>

    <!-- API Endpoint Performance & Traffic Volume -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Endpoint Performance -->
      <ChartCard
        title="API Endpoint Performance"
        subtitle="Average response time by endpoint"
        @download="downloadChart('endpoint-performance')"
      >
        <BarChart
          :labels="endpointPerformanceData.labels"
          :datasets="endpointPerformanceData.datasets"
          :height="300"
        />
      </ChartCard>

      <!-- Traffic Volume -->
      <ChartCard
        title="Weekly Traffic Volume"
        subtitle="Request volume by day of week"
        @download="downloadChart('traffic-volume')"
      >
        <LineChart
          :labels="trafficVolumeData.labels"
          :datasets="trafficVolumeData.datasets"
          :height="300"
        />
      </ChartCard>
    </div>

    <!-- System Health Status Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
          System Health Status
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Real-time health monitoring for all system services
        </p>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Service
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Uptime
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Avg Response
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Requests
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr
              v-for="metric in healthMetrics"
              :key="metric.service"
              class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-slate-900 dark:text-white">
                  {{ metric.service }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                  :class="getStatusColor(metric.status)"
                >
                  {{ metric.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                {{ metric.uptime }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                {{ metric.response }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                {{ metric.requests }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Performance Insights -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Performance Insights & Recommendations
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div class="flex items-center gap-2 mb-2">
            <ServerIcon class="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 class="font-semibold text-green-900 dark:text-green-200">
              Excellent Uptime
            </h4>
          </div>
          <p class="text-sm text-green-700 dark:text-green-300">
            99.98% uptime exceeds SLA requirements. System reliability is excellent with minimal downtime.
          </p>
        </div>
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div class="flex items-center gap-2 mb-2">
            <ClockIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 class="font-semibold text-blue-900 dark:text-blue-200">
              Fast Response Times
            </h4>
          </div>
          <p class="text-sm text-blue-700 dark:text-blue-300">
            Average API response time of 142ms is well below 200ms target. Performance is optimal.
          </p>
        </div>
        <div class="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div class="flex items-center gap-2 mb-2">
            <CpuChipIcon class="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            <h4 class="font-semibold text-yellow-900 dark:text-yellow-200">
              Monitor CPU Usage
            </h4>
          </div>
          <p class="text-sm text-yellow-700 dark:text-yellow-300">
            CPU utilization at 42% during peak hours. Consider scaling if it exceeds 60% consistently.
          </p>
        </div>
        <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div class="flex items-center gap-2 mb-2">
            <CircleStackIcon class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 class="font-semibold text-purple-900 dark:text-purple-200">
              Database Performance
            </h4>
          </div>
          <p class="text-sm text-purple-700 dark:text-purple-300">
            Database query time averaging 68ms. Consider query optimization for /api/analytics endpoint.
          </p>
        </div>
        <div class="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div class="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon class="w-5 h-5 text-red-600 dark:text-red-400" />
            <h4 class="font-semibold text-red-900 dark:text-red-200">
              Low Error Rate
            </h4>
          </div>
          <p class="text-sm text-red-700 dark:text-red-300">
            Error rate of 0.12% is excellent. Most errors are 4xx client errors, indicating proper validation.
          </p>
        </div>
        <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div class="flex items-center gap-2 mb-2">
            <SignalIcon class="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h4 class="font-semibold text-orange-900 dark:text-orange-200">
              Search Service Alert
            </h4>
          </div>
          <p class="text-sm text-orange-700 dark:text-orange-300">
            Search engine showing degraded performance at 456ms. Investigate indexing and query optimization.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
