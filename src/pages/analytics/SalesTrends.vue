<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ArrowTrendingUpIcon,
  CalendarIcon,
  ShoppingCartIcon,
  CurrencyDollarIcon
} from '@heroicons/vue/24/outline'
import StatCard from '@/components/analytics/StatCard.vue'
import ChartCard from '@/components/analytics/ChartCard.vue'
import PeriodSelector, { type Period } from '@/components/analytics/PeriodSelector.vue'
import MetricCard from '@/components/analytics/MetricCard.vue'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

const selectedPeriod = ref<Period>('30d')
const comparisonMode = ref<'yoy' | 'mom' | 'wow'>('mom')
const loading = ref(false)

// KPI Data
const salesKpis = [
  {
    title: 'Total Sales',
    value: '$847,392',
    growth: 12.5,
    subtitle: 'Last 30 days',
    icon: CurrencyDollarIcon,
    color: 'blue' as const
  },
  {
    title: 'Sales Count',
    value: '12,847',
    growth: 8.3,
    subtitle: 'Total transactions',
    icon: ShoppingCartIcon,
    color: 'green' as const
  },
  {
    title: 'Avg Order Value',
    value: '$65.93',
    growth: 15.8,
    subtitle: 'Per transaction',
    icon: ArrowTrendingUpIcon,
    color: 'purple' as const
  },
  {
    title: 'Peak Sales Day',
    value: 'Monday',
    growth: null,
    subtitle: 'Best performing day',
    icon: CalendarIcon,
    color: 'orange' as const
  }
]

// Sales trend data
const salesTrendData = computed(() => {
  const labels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  return {
    labels,
    datasets: [
      {
        label: '2024 Sales',
        data: [45000, 52000, 48000, 61000, 58000, 67000, 72000, 78000, 71000, 82000, 79000, 84739],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: '2023 Sales',
        data: [38000, 42000, 40000, 51000, 48000, 55000, 59000, 63000, 58000, 67000, 64000, 69000],
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(148, 163, 184, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// Daily sales data
const dailySalesData = computed(() => {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return {
    labels,
    datasets: [
      {
        label: 'Average Daily Sales',
        data: [32450, 28900, 31200, 35600, 38200, 41500, 29800],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      }
    ]
  }
})

// Hourly sales data
const hourlySalesData = computed(() => {
  const labels = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ]

  return {
    labels,
    datasets: [
      {
        label: 'Sales by Hour',
        data: [1200, 800, 600, 1500, 3200, 4500, 5800, 6200, 7100, 8200, 6500, 3800],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// Regional sales data
const regionalSalesData = computed(() => {
  return {
    labels: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'],
    datasets: [
      {
        label: 'Sales by Region',
        data: [284500, 198400, 165800, 89200, 56300, 53192],
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

// Quick metrics
const quickMetrics = [
  { label: 'Sales Velocity', value: '32.4/hr', change: 12.5 },
  { label: 'Peak Sales Hour', value: '8 PM', change: null },
  { label: 'Weekend vs Weekday', value: '+18%', change: 5.2 },
  { label: 'YoY Growth', value: '+23.8%', change: 8.9 }
]

const downloadChart = (chartName: string) => {
  console.log(`Downloading ${chartName} chart...`)
}

const setComparisonMode = (mode: 'yoy' | 'mom' | 'wow') => {
  comparisonMode.value = mode
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Sales Trends Analysis
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Track sales performance, identify trends, and forecast future growth
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <PeriodSelector v-model="selectedPeriod" />
          <div class="inline-flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              @click="setComparisonMode('yoy')"
              class="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
              :class="{
                'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm': comparisonMode === 'yoy',
                'text-slate-600 dark:text-slate-400': comparisonMode !== 'yoy'
              }"
            >
              YoY
            </button>
            <button
              @click="setComparisonMode('mom')"
              class="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
              :class="{
                'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm': comparisonMode === 'mom',
                'text-slate-600 dark:text-slate-400': comparisonMode !== 'mom'
              }"
            >
              MoM
            </button>
            <button
              @click="setComparisonMode('wow')"
              class="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200"
              :class="{
                'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm': comparisonMode === 'wow',
                'text-slate-600 dark:text-slate-400': comparisonMode !== 'wow'
              }"
            >
              WoW
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        v-for="(kpi, index) in salesKpis"
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

    <!-- Sales Trend Chart -->
    <div class="mb-8">
      <ChartCard
        title="Sales Trend Overview"
        subtitle="Year-over-year comparison of sales performance"
        @download="downloadChart('sales-trend')"
      >
        <LineChart
          :labels="salesTrendData.labels"
          :datasets="salesTrendData.datasets"
          :height="400"
        />
      </ChartCard>
    </div>

    <!-- Daily & Hourly Analysis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Daily Sales Chart -->
      <ChartCard
        title="Daily Sales Distribution"
        subtitle="Average sales by day of week"
        @download="downloadChart('daily-sales')"
      >
        <BarChart
          :labels="dailySalesData.labels"
          :datasets="dailySalesData.datasets"
          :height="300"
        />
      </ChartCard>

      <!-- Hourly Sales Chart -->
      <ChartCard
        title="Hourly Sales Pattern"
        subtitle="Sales volume by hour of day"
        @download="downloadChart('hourly-sales')"
      >
        <LineChart
          :labels="hourlySalesData.labels"
          :datasets="hourlySalesData.datasets"
          :height="300"
        />
      </ChartCard>
    </div>

    <!-- Regional Sales -->
    <div class="mb-8">
      <ChartCard
        title="Regional Sales Performance"
        subtitle="Sales distribution across different regions"
        @download="downloadChart('regional-sales')"
      >
        <BarChart
          :labels="regionalSalesData.labels"
          :datasets="regionalSalesData.datasets"
          :height="300"
        />
      </ChartCard>
    </div>

    <!-- Sales Insights -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Key Insights & Trends
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 class="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            📈 Strong Growth Trajectory
          </h4>
          <p class="text-sm text-blue-700 dark:text-blue-300">
            Sales have increased by 23.8% year-over-year, with consistent month-over-month growth averaging 12.5%.
          </p>
        </div>
        <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <h4 class="font-semibold text-purple-900 dark:text-purple-200 mb-2">
            🕐 Peak Performance Hours
          </h4>
          <p class="text-sm text-purple-700 dark:text-purple-300">
            Evening hours (6 PM - 10 PM) show the highest sales activity, accounting for 35% of daily transactions.
          </p>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <h4 class="font-semibold text-green-900 dark:text-green-200 mb-2">
            📅 Weekend Advantage
          </h4>
          <p class="text-sm text-green-700 dark:text-green-300">
            Weekend sales outperform weekdays by 18%, particularly on Saturdays with peak average daily sales.
          </p>
        </div>
        <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <h4 class="font-semibold text-orange-900 dark:text-orange-200 mb-2">
            🌍 Regional Opportunities
          </h4>
          <p class="text-sm text-orange-700 dark:text-orange-300">
            North America leads in sales volume, while Asian markets show the fastest growth rate at 45% YoY.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
