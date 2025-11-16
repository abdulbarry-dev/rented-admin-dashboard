<script setup lang="ts">
export type Period = '7d' | '30d' | '90d' | '1y' | 'all'

interface Props {
  modelValue: Period
}

interface Emits {
  (e: 'update:modelValue', value: Period): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const periods = [
  { value: '7d' as Period, label: '7 Days' },
  { value: '30d' as Period, label: '30 Days' },
  { value: '90d' as Period, label: '90 Days' },
  { value: '1y' as Period, label: '1 Year' },
  { value: 'all' as Period, label: 'All Time' }
]

const isActive = (period: Period) => props.modelValue === period

const selectPeriod = (period: Period) => {
  emit('update:modelValue', period)
}
</script>

<template>
  <div class="inline-flex items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
    <button
      v-for="period in periods"
      :key="period.value"
      @click="selectPeriod(period.value)"
      class="px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
      :class="{
        'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm': isActive(period.value),
        'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white': !isActive(period.value)
      }"
    >
      {{ period.label }}
    </button>
  </div>
</template>
