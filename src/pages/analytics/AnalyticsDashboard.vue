<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon
} from '@heroicons/vue/24/outline'
import StatCard from '@/components/analytics/StatCard.vue'
import ChartCard from '@/components/analytics/ChartCard.vue'
import PeriodSelector, { type Period } from '@/components/analytics/PeriodSelector.vue'
import MetricCard from '@/components/analytics/MetricCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'

const router = useRouter()
const selectedPeriod = ref<Period>('30d')
const loading = ref(false)

// Mock KPI data
const kpiData = [
  {
    title: 'Total Revenue',
    value: '$847,392',
    growth: 12.5,
    subtitle: 'Last 30 days',
    icon: CurrencyDollarIcon,
    color: 'blue' as const
  },
  {
    title: 'Active Users',
    value: '24,583',
    growth: 8.3,
    subtitle: 'Currently active',
    icon: UserGroupIcon,
    color: 'purple' as const
  },
  {
    title: 'Total Transactions',
    value: '12,847',
    growth: -2.4,
    subtitle: 'This month',
    icon: ShoppingBagIcon,
    color: 'green' as const
  },
  {
    title: 'Avg Transaction',
    value: '$65.93',
    growth: 15.8,
    subtitle: 'Per transaction',
    icon: ChartBarIcon,
    color: 'orange' as const
  },
  {
    title: 'Growth Rate',
    value: '23.4%',
    growth: 5.2,
    subtitle: 'Month over month',
    icon: ArrowTrendingUpIcon,
    color: 'teal' as const
  },
  {
    title: 'Commission Earned',
    value: '$84,739',
    growth: 18.9,
    subtitle: 'Platform fees',
    icon: BanknotesIcon,
    color: 'indigo' as const
  }
]

// Revenue chart data
const revenueChartData = computed(() => {
  const labels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  return {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: [45000, 52000, 48000, 61000, 58000, 67000, 72000, 78000, 71000, 82000, 79000, 84739],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Profit',
        data: [28000, 31000, 29000, 38000, 36000, 42000, 45000, 48000, 44000, 51000, 49000, 52847],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// User growth chart data
const userGrowthData = computed(() => {
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

  return {
    labels,
    datasets: [
      {
        label: 'New Users',
        data: [1240, 1580, 1893, 2156],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Active Users',
        data: [18453, 19834, 21257, 22890],
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// Category performance chart data
const categoryData = computed(() => {
  return {
    labels: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys'],
    datasets: [
      {
        label: 'Sales',
        data: [12847, 10234, 8945, 7823, 5678, 4321],
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

// Category distribution pie chart
const categoryDistribution = computed(() => {
  return {
    labels: ['Electronics', 'Fashion', 'Home & Garden', 'Sports', 'Books', 'Toys'],
    data: [12847, 10234, 8945, 7823, 5678, 4321],
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

// Quick metrics
const quickMetrics = [
  { label: 'Conversion Rate', value: '3.24%', change: 0.8 },
  { label: 'Avg Session Duration', value: '8m 32s', change: 12 },
  { label: 'Bounce Rate', value: '42.3%', change: -5.2 },
  { label: 'Customer Satisfaction', value: '4.8/5', change: 3.5 }
]

const navigateToPage = (route: string) => {
  router.push(route)
}

const downloadChart = (chartName: string) => {
  console.log(`Downloading ${chartName} chart...`)
  // Implementation for chart download
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Analytics Dashboard
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Comprehensive business intelligence and performance metrics
          </p>
        </div>
        <PeriodSelector v-model="selectedPeriod" />
      </div>
    </div>

    <!-- KPI Cards Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <StatCard
        v-for="(kpi, index) in kpiData"
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

    <!-- Revenue & Profit Chart -->
    <div class="mb-8">
      <ChartCard
        title="Revenue & Profit Overview"
        subtitle="Monthly revenue and profit trends"
        @download="downloadChart('revenue')"
      >
        <LineChart
          :labels="revenueChartData.labels"
          :datasets="revenueChartData.datasets"
          :height="350"
        />
      </ChartCard>
    </div>

    <!-- User Growth & Category Performance -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- User Growth Chart -->
      <ChartCard
        title="User Growth Trends"
        subtitle="New and active users over time"
        @download="downloadChart('user-growth')"
      >
        <LineChart
          :labels="userGrowthData.labels"
          :datasets="userGrowthData.datasets"
          :height="300"
        />
      </ChartCard>

      <!-- Category Performance Bar Chart -->
      <ChartCard
        title="Category Performance"
        subtitle="Sales by product category"
        @download="downloadChart('category-performance')"
      >
        <BarChart
          :labels="categoryData.labels"
          :datasets="categoryData.datasets"
          :height="300"
        />
      </ChartCard>
    </div>

    <!-- Category Distribution & Quick Links -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Category Distribution Pie Chart -->
      <div class="lg:col-span-1">
        <ChartCard
          title="Category Distribution"
          subtitle="Sales distribution by category"
          @download="downloadChart('category-distribution')"
        >
          <DoughnutChart
            :labels="categoryDistribution.labels"
            :data="categoryDistribution.data"
            :colors="categoryDistribution.colors"
            :height="300"
            cutout="60%"
          />
        </ChartCard>
      </div>

      <!-- Quick Links to Detailed Pages -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Detailed Analytics
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              @click="navigateToPage('/analytics/sales-trends')"
              class="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-600 transition-all duration-200 text-left group"
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-200">
                  <ArrowTrendingUpIcon class="w-5 h-5" />
                </div>
                <h4 class="font-semibold text-slate-900 dark:text-white">Sales Trends</h4>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                Detailed sales analysis and forecasts
              </p>
            </button>

            <button
              @click="navigateToPage('/analytics/user-growth')"
              class="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 dark:hover:border-purple-600 transition-all duration-200 text-left group"
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-200">
                  <UserGroupIcon class="w-5 h-5" />
                </div>
                <h4 class="font-semibold text-slate-900 dark:text-white">User Growth</h4>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                User acquisition and retention metrics
              </p>
            </button>

            <button
              @click="navigateToPage('/analytics/revenue-reports')"
              class="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-green-500 dark:hover:border-green-600 transition-all duration-200 text-left group"
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform duration-200">
                  <BanknotesIcon class="w-5 h-5" />
                </div>
                <h4 class="font-semibold text-slate-900 dark:text-white">Revenue Reports</h4>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                Financial performance and forecasts
              </p>
            </button>

            <button
              @click="navigateToPage('/analytics/popular-categories')"
              class="p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-600 transition-all duration-200 text-left group"
            >
              <div class="flex items-center gap-3 mb-2">
                <div class="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-200">
                  <ChartBarIcon class="w-5 h-5" />
                </div>
                <h4 class="font-semibold text-slate-900 dark:text-white">Popular Categories</h4>
              </div>
              <p class="text-sm text-slate-600 dark:text-slate-400">
                Category trends and performance
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
