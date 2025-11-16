<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  label: string
  value: string | number
  change?: number | null
  changeLabel?: string
  variant?: 'default' | 'compact'
}

const props = withDefaults(defineProps<Props>(), {
  change: null,
  changeLabel: 'vs last period',
  variant: 'default'
})

const trendClass = computed(() => {
  if (props.change === null || props.change === undefined) return 'neutral'
  if (props.change > 0) return 'positive'
  if (props.change < 0) return 'negative'
  return 'neutral'
})
</script>

<template>
  <div
    class="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700/50"
    :class="{ 'p-3': variant === 'compact' }"
  >
    <div class="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
      {{ label }}
    </div>
    <div
      class="font-bold text-slate-900 dark:text-white"
      :class="variant === 'compact' ? 'text-xl' : 'text-2xl'"
    >
      {{ value }}
    </div>
    <div
      v-if="change !== null && change !== undefined"
      class="flex items-center gap-1 mt-2 text-xs"
      :class="{
        'text-green-600 dark:text-green-400': trendClass === 'positive',
        'text-red-600 dark:text-red-400': trendClass === 'negative',
        'text-slate-600 dark:text-slate-400': trendClass === 'neutral'
      }"
    >
      <span class="font-semibold">
        {{ change > 0 ? '+' : '' }}{{ change }}%
      </span>
      <span class="text-slate-500 dark:text-slate-500">{{ changeLabel }}</span>
    </div>
  </div>
</template>
