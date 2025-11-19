<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

interface Props {
  label: string
  value: string | number
  icon: Component
  trend?: number | null
  trendLabel?: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'teal' | 'yellow' | 'indigo'
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  trend: null,
  trendLabel: 'vs last month'
})

const iconBgClass = computed(() => `bg-${props.color}-100 dark:bg-${props.color}-900/30`)
const iconTextClass = computed(() => `text-${props.color}-600 dark:text-${props.color}-400`)
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-lg">
    <div class="flex items-center justify-between mb-4">
      <div
        class="w-12 h-12 rounded-lg flex items-center justify-center transition-transform duration-200 hover:scale-110"
        :class="[iconBgClass, iconTextClass]"
      >
        <component :is="icon" class="w-6 h-6" />
      </div>
      <div
        v-if="trend !== null && trend !== undefined"
        class="text-sm font-semibold"
        :class="{
          'text-green-600 dark:text-green-400': trend > 0,
          'text-red-600 dark:text-red-400': trend < 0,
          'text-slate-600 dark:text-slate-400': trend === 0
        }"
      >
        {{ trend > 0 ? '+' : '' }}{{ trend }}%
      </div>
    </div>
    <div class="text-2xl font-bold text-slate-900 dark:text-white mb-1">
      {{ value }}
    </div>
    <div class="text-sm text-slate-600 dark:text-slate-400">
      {{ label }}
    </div>
    <div v-if="trend !== null && trend !== undefined" class="text-xs text-slate-500 dark:text-slate-500 mt-2">
      {{ trendLabel }}
    </div>
  </div>
</template>
