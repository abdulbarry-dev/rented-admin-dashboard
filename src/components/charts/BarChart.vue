<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartOptions
} from 'chart.js'
import { useThemeStore } from '@/stores/theme'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Props {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }>
  height?: number
  darkMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  darkMode: false,
})

const themeStore = useThemeStore()
const isDark = computed(() => props.darkMode ?? themeStore.isDark)

const chartOptions = computed<ChartOptions<'bar'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: isDark.value ? '#e2e8f0' : '#475569',
        usePointStyle: true,
        padding: 16
      }
    },
    tooltip: {
      backgroundColor: isDark.value ? '#1e293b' : '#ffffff',
      titleColor: isDark.value ? '#f1f5f9' : '#0f172a',
      bodyColor: isDark.value ? '#cbd5e1' : '#475569',
      borderColor: isDark.value ? '#334155' : '#e2e8f0',
      borderWidth: 1,
      padding: 12,
      displayColors: true,
      callbacks: {
        label: function (context: any) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            label += context.parsed.y.toLocaleString()
          }
          return label
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: isDark.value ? '#334155' : '#f1f5f9'
      },
      ticks: {
        color: isDark.value ? '#94a3b8' : '#64748b',
      }
    },
    y: {
      beginAtZero: true,
      grid: {
        color: isDark.value ? '#1e293b' : '#f1f5f9',
      },
      ticks: {
        color: isDark.value ? '#94a3b8' : '#64748b',
      }
    }
  }
}))

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets
}))
</script>

<template>
  <div :style="{ height: `${height}px` }">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>
