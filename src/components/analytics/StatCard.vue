<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/vue/24/solid'
import type { Component } from 'vue'

interface Props {
  title: string
  value: string | number
  growth?: number | null
  subtitle?: string
  icon: Component
  color?: 'blue' | 'purple' | 'green' | 'orange' | 'teal' | 'indigo' | 'red' | 'pink'
  animationDelay?: number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: 'blue',
  animationDelay: 0,
  loading: false,
  growth: null,
  subtitle: ''
})

const trendClass = computed(() => {
  if (props.growth === null || props.growth === undefined) return 'neutral'
  if (props.growth > 0) return 'positive'
  if (props.growth < 0) return 'negative'
  return 'neutral'
})

const iconBgClass = computed(() => `bg-${props.color}-100 dark:bg-${props.color}-900/30`)
const iconTextClass = computed(() => `text-${props.color}-600 dark:text-${props.color}-400`)
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-600"
    :style="{ animationDelay: `${animationDelay}s` }"
    :class="{ 'animate-pulse': loading }"
  >
    <div class="flex items-start justify-between mb-4">
      <div
        class="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300"
        :class="[iconBgClass, iconTextClass]"
      >
        <component :is="icon" class="w-6 h-6" />
      </div>
      <div
        v-if="growth !== null && growth !== undefined"
        class="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold"
        :class="{
          'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400': trendClass === 'positive',
          'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400': trendClass === 'negative',
          'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400': trendClass === 'neutral'
        }"
      >
        <ArrowUpIcon v-if="growth > 0" class="w-3 h-3" />
        <ArrowDownIcon v-else-if="growth < 0" class="w-3 h-3" />
        <MinusIcon v-else class="w-3 h-3" />
        <span>{{ Math.abs(growth) }}%</span>
      </div>
    </div>
    <div class="space-y-1">
      <div class="text-3xl font-bold text-slate-900 dark:text-white">
        {{ loading ? '...' : value }}
      </div>
      <div class="text-sm font-medium text-slate-600 dark:text-slate-300">
        {{ title }}
      </div>
      <div v-if="subtitle" class="text-xs text-slate-500 dark:text-slate-400">
        {{ subtitle }}
      </div>
    </div>
  </div>
</template>
