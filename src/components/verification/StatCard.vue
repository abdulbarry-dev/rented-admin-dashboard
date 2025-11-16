<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
    <div class="flex items-center gap-4">
      <div :class="iconClasses">
        <component :is="icon" class="w-6 h-6" />
      </div>
      <div class="flex-1">
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ label }}</p>
        <p class="text-3xl font-bold text-gray-900 dark:text-white mt-1">{{ value }}</p>
        <p v-if="change" :class="changeClasses" class="text-xs font-medium mt-1">
          {{ change }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'

interface Props {
  label: string
  value: string | number
  icon: Component
  variant?: 'primary' | 'success' | 'danger' | 'warning'
  change?: string
  changeType?: 'positive' | 'negative'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  changeType: 'positive'
})

const iconClasses = computed(() => {
  const base = 'w-12 h-12 rounded-lg flex items-center justify-center'
  const variants = {
    primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
  }
  return `${base} ${variants[props.variant]}`
})

const changeClasses = computed(() => {
  return props.changeType === 'positive'
    ? 'text-green-600 dark:text-green-400'
    : 'text-red-600 dark:text-red-400'
})
</script>
