<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  CurrencyDollarIcon,
  BanknotesIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  CreditCardIcon,
  DocumentArrowDownIcon
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
const revenueKpis = [
  {
    title: 'Total Revenue',
    value: '$2,847,392',
    growth: 15.8,
    subtitle: 'Year to date',
    icon: CurrencyDollarIcon,
    color: 'blue' as const
  },
  {
    title: 'Gross Profit',
    value: '$1,423,696',
    growth: 12.3,
    subtitle: '50% profit margin',
    icon: BanknotesIcon,
    color: 'green' as const
  },
  {
    title: 'Commission Earned',
    value: '$284,739',
    growth: 18.9,
    subtitle: '10% platform fee',
    icon: ChartPieIcon,
    color: 'purple' as const
  },
  {
    title: 'Net Revenue',
    value: '$2,278,053',
    growth: 14.2,
    subtitle: 'After expenses',
    icon: ArrowTrendingUpIcon,
    color: 'orange' as const
  }
]

// Revenue & profit trend
const revenueTrendData = computed(() => {
  const labels = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  return {
    labels,
    datasets: [
      {
        label: 'Revenue',
        data: [185000, 198000, 212000, 228000, 245000, 267000, 289000, 312000, 298000, 334000, 321000, 284739],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Profit',
        data: [92500, 99000, 106000, 114000, 122500, 133500, 144500, 156000, 149000, 167000, 160500, 142369],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Expenses',
        data: [92500, 99000, 106000, 114000, 122500, 133500, 144500, 156000, 149000, 167000, 160500, 142370],
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }
})

// Revenue by payment method
const paymentMethodData = computed(() => {
  return {
    labels: ['Credit Card', 'PayPal', 'Bank Transfer', 'Crypto', 'Mobile Wallet'],
    datasets: [
      {
        label: 'Revenue',
        data: [1247392, 834739, 423847, 198234, 143180],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(6, 182, 212, 0.8)'
        ]
      }
    ]
  }
})

// Revenue forecast
const revenueForecastData = computed(() => {
  const labels = ['Oct', 'Nov', 'Dec', 'Jan (F)', 'Feb (F)', 'Mar (F)']

  return {
    labels,
    datasets: [
      {
        label: 'Actual Revenue',
        data: [334000, 321000, 284739, null, null, null],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Forecasted Revenue',
        data: [null, null, 284739, 342000, 358000, 375000],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: true,
        tension: 0.4,
        borderDash: [5, 5]
      }
    ]
  }
})

// Revenue distribution
const revenueDistribution = computed(() => {
  return {
    labels: ['Product Sales', 'Service Fees', 'Subscriptions', 'Advertising', 'Other'],
    data: [1423696, 712000, 427000, 213196, 71500],
    colors: [
      '#3b82f6',
      '#8b5cf6',
      '#10b981',
      '#f59e0b',
      '#06b6d4'
    ]
  }
})

// Monthly comparison
const monthlyComparisonData = computed(() => {
  const labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4']

  return {
    labels,
    datasets: [
      {
        label: 'This Month',
        data: [68450, 72800, 71234, 72255],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      },
      {
        label: 'Last Month',
        data: [64200, 69500, 68900, 70400],
        backgroundColor: 'rgba(148, 163, 184, 0.8)'
      }
    ]
  }
})

// Quick metrics
const quickMetrics = [
  { label: 'MRR Growth', value: '+$45K', change: 12.5 },
  { label: 'ARR', value: '$3.4M', change: 18.9 },
  { label: 'ARPU', value: '$127', change: 8.3 },
  { label: 'Profit Margin', value: '50%', change: 2.1 }
]

const downloadChart = (chartName: string) => {
  console.log(`Downloading ${chartName} chart...`)
}

const exportReport = (format: string) => {
  console.log(`Exporting report as ${format}...`)
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Revenue Reports
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Financial performance analysis with forecasts and profit margins
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-4">
          <PeriodSelector v-model="selectedPeriod" />
          <button
            @click="exportReport('pdf')"
            class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
          >
            <DocumentArrowDownIcon class="w-5 h-5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        v-for="(kpi, index) in revenueKpis"
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

    <!-- Revenue & Profit Trend -->
    <div class="mb-8">
      <ChartCard
        title="Revenue, Profit & Expenses Overview"
        subtitle="Year-to-date financial performance breakdown"
        @download="downloadChart('revenue-profit-trend')"
      >
        <LineChart
          :labels="revenueTrendData.labels"
          :datasets="revenueTrendData.datasets"
          :height="400"
        />
      </ChartCard>
    </div>

    <!-- Revenue Forecast & Payment Methods -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <!-- Revenue Forecast Chart -->
      <ChartCard
        title="Revenue Forecast"
        subtitle="Projected revenue for next 3 months"
        @download="downloadChart('revenue-forecast')"
      >
        <LineChart
          :labels="revenueForecastData.labels"
          :datasets="revenueForecastData.datasets"
          :height="300"
        />
      </ChartCard>

      <!-- Payment Methods Chart -->
      <ChartCard
        title="Revenue by Payment Method"
        subtitle="Transaction volume by payment type"
        @download="downloadChart('payment-methods')"
      >
        <BarChart
          :labels="paymentMethodData.labels"
          :datasets="paymentMethodData.datasets"
          :height="300"
        />
      </ChartCard>
    </div>

    <!-- Distribution & Comparison -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Revenue Distribution -->
      <div class="lg:col-span-1">
        <ChartCard
          title="Revenue Distribution"
          subtitle="Revenue streams breakdown"
          @download="downloadChart('revenue-distribution')"
        >
          <DoughnutChart
            :labels="revenueDistribution.labels"
            :data="revenueDistribution.data"
            :colors="revenueDistribution.colors"
            :height="300"
            cutout="60%"
          />
        </ChartCard>
      </div>

      <!-- Monthly Comparison -->
      <div class="lg:col-span-2">
        <ChartCard
          title="Monthly Revenue Comparison"
          subtitle="Weekly revenue this month vs last month"
          @download="downloadChart('monthly-comparison')"
        >
          <BarChart
            :labels="monthlyComparisonData.labels"
            :datasets="monthlyComparisonData.datasets"
            :height="300"
          />
        </ChartCard>
      </div>
    </div>

    <!-- Financial Summary -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Financial Summary & Insights
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div class="flex items-center gap-2 mb-2">
            <CurrencyDollarIcon class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 class="font-semibold text-blue-900 dark:text-blue-200">
              Strong Revenue Growth
            </h4>
          </div>
          <p class="text-sm text-blue-700 dark:text-blue-300">
            YTD revenue of $2.85M represents 15.8% growth, with consistent month-over-month increases.
          </p>
        </div>
        <div class="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div class="flex items-center gap-2 mb-2">
            <BanknotesIcon class="w-5 h-5 text-green-600 dark:text-green-400" />
            <h4 class="font-semibold text-green-900 dark:text-green-200">
              Healthy Profit Margin
            </h4>
          </div>
          <p class="text-sm text-green-700 dark:text-green-300">
            Maintaining 50% gross profit margin with $1.42M in profit, showing efficient operations.
          </p>
        </div>
        <div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div class="flex items-center gap-2 mb-2">
            <CreditCardIcon class="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h4 class="font-semibold text-purple-900 dark:text-purple-200">
              Diverse Payment Mix
            </h4>
          </div>
          <p class="text-sm text-purple-700 dark:text-purple-300">
            Credit cards lead at 44%, with growing adoption of digital wallets and crypto payments.
          </p>
        </div>
        <div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <div class="flex items-center gap-2 mb-2">
            <ArrowTrendingUpIcon class="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h4 class="font-semibold text-orange-900 dark:text-orange-200">
              Positive Forecast
            </h4>
          </div>
          <p class="text-sm text-orange-700 dark:text-orange-300">
            Q1 forecast projects $1.08M revenue, indicating 20% quarterly growth trajectory.
          </p>
        </div>
        <div class="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg border border-teal-200 dark:border-teal-800">
          <div class="flex items-center gap-2 mb-2">
            <ChartPieIcon class="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h4 class="font-semibold text-teal-900 dark:text-teal-200">
              Revenue Diversification
            </h4>
          </div>
          <p class="text-sm text-teal-700 dark:text-teal-300">
            Product sales account for 50% of revenue, balanced with service fees and subscriptions.
          </p>
        </div>
        <div class="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <div class="flex items-center gap-2 mb-2">
            <BanknotesIcon class="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h4 class="font-semibold text-indigo-900 dark:text-indigo-200">
              MRR Acceleration
            </h4>
          </div>
          <p class="text-sm text-indigo-700 dark:text-indigo-300">
            Monthly recurring revenue grew $45K this month, contributing to $3.4M annual run rate.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
