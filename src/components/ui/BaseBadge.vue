<script setup lang="ts">
import { computed } from 'vue'

export interface BadgeProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  dot?: boolean
  outline?: boolean
}

const props = withDefaults(defineProps<BadgeProps>(), {
  variant: 'default',
  size: 'md',
  dot: false,
  outline: false
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center font-medium rounded-full transition-all duration-200'

  const variants = props.outline ? {
    default: 'border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 bg-transparent',
    primary: 'border-2 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-300 bg-transparent',
    success: 'border-2 border-green-500 dark:border-green-400 text-green-700 dark:text-green-300 bg-transparent',
    warning: 'border-2 border-yellow-500 dark:border-yellow-400 text-yellow-700 dark:text-yellow-300 bg-transparent',
    danger: 'border-2 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300 bg-transparent',
    info: 'border-2 border-cyan-500 dark:border-cyan-400 text-cyan-700 dark:text-cyan-300 bg-transparent'
  } : {
    default: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    primary: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    info: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300'
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2'
  }

  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})

const dotClasses = computed(() => {
  const colors = {
    default: 'bg-slate-500 dark:bg-slate-400',
    primary: 'bg-blue-500 dark:bg-blue-400',
    success: 'bg-green-500 dark:bg-green-400',
    warning: 'bg-yellow-500 dark:bg-yellow-400',
    danger: 'bg-red-500 dark:bg-red-400',
    info: 'bg-cyan-500 dark:bg-cyan-400'
  }

  const sizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  }

  return `rounded-full ${colors[props.variant]} ${sizes[props.size]}`
})
</script>

<template>
  <span :class="badgeClasses">
    <span v-if="dot" :class="dotClasses"></span>
    <slot />
  </span>
</template>
