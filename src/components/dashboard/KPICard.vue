<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '@/stores/theme'

interface Props {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: any
  iconColor?: string
  darkMode?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  iconColor: 'blue',
  darkMode: false,
  loading: false
})

const themeStore = useThemeStore()

// Use themeStore.isDark if darkMode prop is not explicitly provided
const isDark = computed(() => props.darkMode ?? themeStore.isDark)

const colorClasses = computed(() => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500/90 text-white dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-500/90 text-white dark:bg-purple-900/30 dark:text-purple-400',
    green: 'bg-green-500/90 text-white dark:bg-green-900/30 dark:text-green-400',
    amber: 'bg-amber-500/90 text-white dark:bg-amber-900/30 dark:text-amber-400',
    red: 'bg-red-500/90 text-white dark:bg-red-900/30 dark:text-red-400',
    cyan: 'bg-cyan-500/90 text-white dark:bg-cyan-900/30 dark:text-cyan-400',
  }
  return colors[props.iconColor] || colors.blue
})

const isPositive = computed(() => props.change && props.change > 0)
const isNegative = computed(() => props.change && props.change < 0)
</script>

<template>
  <div
    :class="isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'"
    class="rounded-xl border shadow-sm p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-in"
  >
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <p :class="isDark ? 'text-slate-400' : 'text-slate-600'" class="text-sm font-medium">
          {{ title }}
        </p>
        <div class="mt-2">
          <div v-if="loading" class="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          <h3
            v-else
            :class="isDark ? 'text-white' : 'text-slate-900'"
            class="text-3xl font-bold"
          >
            {{ value }}
          </h3>
        </div>
        <div v-if="change !== undefined" class="mt-3 flex items-center gap-2">
          <span
            :class="[
              isPositive ? 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400' : '',
              isNegative ? 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400' : '',
              !isPositive && !isNegative ? 'text-slate-600 bg-slate-50 dark:bg-slate-700 dark:text-slate-400' : ''
            ]"
            class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold"
          >
            <ArrowUpIcon v-if="isPositive" class="w-3 h-3" />
            <ArrowDownIcon v-if="isNegative" class="w-3 h-3" />
            {{ Math.abs(change) }}%
          </span>
          <span :class="isDark ? 'text-slate-500' : 'text-slate-600'" class="text-xs">
            {{ changeLabel || 'vs last period' }}
          </span>
        </div>
      </div>
      <div :class="colorClasses" class="rounded-lg p-3">
        <component :is="icon" class="w-6 h-6" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

.animate-fade-in:nth-child(1) { animation-delay: 0.1s; opacity: 0; }
.animate-fade-in:nth-child(2) { animation-delay: 0.2s; opacity: 0; }
.animate-fade-in:nth-child(3) { animation-delay: 0.3s; opacity: 0; }
.animate-fade-in:nth-child(4) { animation-delay: 0.4s; opacity: 0; }
</style>
