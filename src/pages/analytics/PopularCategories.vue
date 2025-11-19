<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ChartBarIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'
import StatCard from '@/components/analytics/StatCard.vue'
import ChartCard from '@/components/analytics/ChartCard.vue'
import PeriodSelector, { type Period } from '@/components/analytics/PeriodSelector.vue'
import MetricCard from '@/components/analytics/MetricCard.vue'
import BarChart from '@/components/charts/BarChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'
import LineChart from '@/components/charts/LineChart.vue'

const selectedPeriod = ref<Period>('30d')
const loading = ref(false)

// KPI Data
const categoryKpis = [
  {
    title: 'Total Categories',
    value: '24',
    growth: null,
    subtitle: 'Active categories',
    icon: ChartBarIcon,
    color: 'blue' as const
  },
  {
    title: 'Top Category',
    value: 'Electronics',
    growth: 28.4,
    subtitle: '12,847 sales',
    icon: FireIcon,
    color: 'orange' as const
  },
  {
    title: 'Fastest Growing',
    value: 'Home & Garden',
    growth: 45.2,
    subtitle: '45% growth rate',
    icon: ArrowTrendingUpIcon,
    color: 'green' as const
  },
  {
    title: 'Total Listings',
    value: '49,848',
    growth: 18.9,
    subtitle: 'Across all categories',
    icon: CubeIcon,
    color: 'purple' as const
  }
]

// Top categories by sales
const topCategoriesData = computed(() => {
  return {
    labels: [
      'Electronics',
      'Fashion',
      'Home & Garden',
      'Sports & Outdoors',
      'Books & Media',
      'Toys & Games',
      'Health & Beauty',
      'Automotive'
    ],
    datasets: [
      {
        label: 'Sales Volume',
        data: [12847, 10234, 8945, 7823, 5678, 4321, 3456, 2890],
        backgroundColor: 'rgba(59, 130, 246, 0.8)'
      }
    ]
  }
})

// Category distribution
const categoryDistribution = computed(() => {
  return {
    labels: [
      'Electronics',
      'Fashion',
      'Home & Garden',
      'Sports',
      'Books',
      'Toys',
      'Health',
      'Auto',
      'Other'
    ],
    data: [12847, 10234, 8945, 7823, 5678, 4321, 3456, 2890, 3654],
    colors: [
      '#3b82f6',
      '#8b5cf6',
      '#10b981',
      '#f59e0b',
      '#ef4444',
      '#06b6d4',
      '#f97316',
      '#ec4899',
      '#64748b'
    ]
  }
})

// Category growth trends
const categoryGrowthData = computed(() => {
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

  return {
    labels,
    datasets: [
      {
        label: 'Electronics',
        data: [8200, 9100, 9800, 10500, 11400, 12847],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Fashion',
        data: [6800, 7400, 8100, 8700, 9400, 10234],
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        fill: false,
        tension: 0.4
      },
      {
        label: 'Home & Garden',
        data: [4200, 5100, 6300, 7200, 8100, 8945],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: false,
        tension: 0.4
      }
    ]
  }
})

// Average price by category
const avgPriceData = computed(() => {
  return {
    labels: [
      'Electronics',
      'Fashion',
      'Home & Garden',
      'Sports',
      'Books',
      'Toys',
      'Health',
      'Auto'
    ],
    datasets: [
      {
        label: 'Average Price ($)',
        data: [342, 89, 156, 124, 45, 67, 98, 234],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(6, 182, 212, 0.8)',
          'rgba(249, 115, 22, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ]
      }
    ]
  }
})

// Category performance metrics
const categoryMetrics = [
  { name: 'Electronics', sales: 12847, revenue: '$4,393,674', growth: 28.4, listings: 8234 },
  { name: 'Fashion', sales: 10234, revenue: '$911,026', growth: 22.1, listings: 12567 },
  { name: 'Home & Garden', sales: 8945, revenue: '$1,395,420', growth: 45.2, listings: 6789 },
  { name: 'Sports & Outdoors', sales: 7823, revenue: '$970,052', growth: 18.7, listings: 5432 },
  { name: 'Books & Media', sales: 5678, revenue: '$255,510', growth: 12.3, listings: 8901 },
  { name: 'Toys & Games', sales: 4321, revenue: '$289,507', growth: 8.9, listings: 3456 }
]

// Quick metrics
const quickMetrics = [
  { label: 'Avg Category Revenue', value: '$892K', change: 18.5 },
  { label: 'Avg Listings/Category', value: '2,077', change: 12.4 },
  { label: 'Category Engagement', value: '76.3%', change: 8.9 },
  { label: 'New Categories', value: '3', change: null }
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
            Popular Categories
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Category performance analysis and trending product categories
          </p>
        </div>
        <PeriodSelector v-model="selectedPeriod" />
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        v-for="(kpi, index) in categoryKpis"
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

    <!-- Top Categories & Distribution -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <!-- Top Categories -->
      <div class="lg:col-span-2">
        <ChartCard
          title="Top Categories by Sales Volume"
          subtitle="Best performing categories ranked by sales"
          @download="downloadChart('top-categories')"
        >
          <BarChart
            :labels="topCategoriesData.labels"
            :datasets="topCategoriesData.datasets"
            :height="350"
          />
        </ChartCard>
      </div>

      <!-- Category Distribution -->
      <div class="lg:col-span-1">
        <ChartCard
          title="Category Distribution"
          subtitle="Sales share by category"
          @download="downloadChart('category-distribution')"
        >
          <DoughnutChart
            :labels="categoryDistribution.labels"
            :data="categoryDistribution.data"
            :colors="categoryDistribution.colors"
            :height="350"
            cutout="60%"
          />
        </ChartCard>
      </div>
    </div>

    <!-- Category Growth Trends -->
    <div class="mb-8">
      <ChartCard
        title="Category Growth Trends"
        subtitle="Sales growth comparison for top 3 categories"
        @download="downloadChart('category-growth')"
      >
        <LineChart
          :labels="categoryGrowthData.labels"
          :datasets="categoryGrowthData.datasets"
          :height="300"
        />
      </ChartCard>
    </div>

    <!-- Average Price by Category -->
    <div class="mb-8">
      <ChartCard
        title="Average Price by Category"
        subtitle="Mean transaction value across categories"
        @download="downloadChart('avg-price')"
      >
        <BarChart
          :labels="avgPriceData.labels"
          :datasets="avgPriceData.datasets"
          :height="300"
        />
      </ChartCard>
    </div>

    <!-- Detailed Category Metrics Table -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div class="p-6 border-b border-slate-200 dark:border-slate-700">
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
          Category Performance Details
        </h3>
        <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
          Comprehensive metrics for each category
        </p>
      </div>
      <!-- Desktop Table -->
      <div class="hidden lg:block overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Category
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Sales Volume
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Revenue
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Growth Rate
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Total Listings
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr
              v-for="category in categoryMetrics"
              :key="category.name"
              class="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="font-medium text-slate-900 dark:text-white">
                    {{ category.name }}
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                {{ category.sales.toLocaleString() }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-white">
                {{ category.revenue }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300': category.growth > 20,
                    'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300': category.growth <= 20 && category.growth > 10,
                    'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300': category.growth <= 10
                  }"
                >
                  +{{ category.growth }}%
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                {{ category.listings.toLocaleString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile/Tablet Cards -->
      <div class="lg:hidden divide-y divide-slate-200 dark:divide-slate-700">
        <div
          v-for="category in categoryMetrics"
          :key="category.name"
          class="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
        >
          <div class="flex items-start justify-between mb-3">
            <h4 class="text-base font-medium text-slate-900 dark:text-white">
              {{ category.name }}
            </h4>
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300': category.growth > 20,
                'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300': category.growth <= 20 && category.growth > 10,
                'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300': category.growth <= 10
              }"
            >
              +{{ category.growth }}%
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">Sales Volume</div>
              <div class="text-sm font-medium text-slate-900 dark:text-white">
                {{ category.sales.toLocaleString() }}
              </div>
            </div>
            <div>
              <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">Revenue</div>
              <div class="text-sm font-medium text-slate-900 dark:text-white">
                {{ category.revenue }}
              </div>
            </div>
            <div class="col-span-2">
              <div class="text-xs text-slate-500 dark:text-slate-400 mb-1">Total Listings</div>
              <div class="text-sm font-medium text-slate-900 dark:text-white">
                {{ category.listings.toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
