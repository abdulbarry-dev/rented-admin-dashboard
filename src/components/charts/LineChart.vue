<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions
} from 'chart.js'
import { useThemeStore } from '@/stores/theme'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface Props {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    borderColor?: string
    backgroundColor?: string
    fill?: boolean
    tension?: number
  }>
  height?: number
  darkMode?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  height: 300,
  darkMode: false
})

const themeStore = useThemeStore()
const isDark = computed(() => props.darkMode ?? themeStore.isDark)

const chartOptions = computed<ChartOptions<'line'>>(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
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
      mode: 'index',
      intersect: false,
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
            label += new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(context.parsed.y)
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
  },
  animation: {
    duration: 1500,
    easing: 'easeInOutQuart'
  }
}))

const chartData = computed(() => ({
  labels: props.labels,
  datasets: props.datasets
}))
</script>

<template>
  <div :style="{ height: `${height}px` }">
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>
