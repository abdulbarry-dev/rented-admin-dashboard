<script setup lang="ts">
import { computed } from 'vue'

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'ghost' | 'outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  iconOnly?: boolean
}

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  iconOnly: false
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-slate-600 hover:bg-slate-700 active:bg-slate-800 text-white focus:ring-slate-500 shadow-sm hover:shadow-md',
    success: 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white focus:ring-green-500 shadow-sm hover:shadow-md',
    danger: 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white focus:ring-red-500 shadow-sm hover:shadow-md',
    warning: 'bg-yellow-600 hover:bg-yellow-700 active:bg-yellow-800 text-white focus:ring-yellow-500 shadow-sm hover:shadow-md',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-slate-500',
    outline: 'border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 bg-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 focus:ring-slate-500'
  }

  const sizes = props.iconOnly ? {
    xs: 'p-1',
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
    xl: 'p-3'
  } : {
    xs: 'px-2.5 py-1.5 text-xs gap-1.5',
    sm: 'px-3 py-2 text-sm gap-2',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-5 py-3 text-base gap-2.5',
    xl: 'px-6 py-3.5 text-lg gap-3'
  }

  const width = props.fullWidth ? 'w-full' : ''

  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${width}`
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
    type="button"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin h-4 w-4"
      :class="size === 'xs' ? 'h-3 w-3' : size === 'lg' || size === 'xl' ? 'h-5 w-5' : 'h-4 w-4'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <slot />
  </button>
</template>
