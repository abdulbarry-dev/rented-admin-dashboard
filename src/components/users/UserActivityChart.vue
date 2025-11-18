<script setup lang="ts">
import { computed } from 'vue'
import LineChart from '@/components/charts/LineChart.vue'

interface Props {
  title: string
  subtitle?: string
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
}

const props = withDefaults(defineProps<Props>(), {
  subtitle: '',
  height: 300
})
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
    <div class="mb-6">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="text-sm text-slate-600 dark:text-slate-400 mt-1">
        {{ subtitle }}
      </p>
    </div>
    <LineChart :labels="labels" :datasets="datasets" :height="height" />
  </div>
</template>
