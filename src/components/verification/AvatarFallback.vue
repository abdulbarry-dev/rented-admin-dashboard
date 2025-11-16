<template>
  <div
    :class="avatarClasses"
    class="flex items-center justify-center font-semibold text-white rounded-full"
    :title="fullName"
  >
    {{ initials }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  fullName: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md'
})

const initials = computed(() => {
  const names = props.fullName.trim().split(' ')
  if (names.length >= 2) {
    return ((names[0]?.[0] ?? '') + (names[names.length - 1]?.[0] ?? '')).toUpperCase()
  }
  return props.fullName.substring(0, 2).toUpperCase()
})

const avatarClasses = computed(() => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  }

  // Generate consistent color based on name
  const colors = [
    'bg-gradient-to-br from-blue-500 to-blue-600',
    'bg-gradient-to-br from-green-500 to-green-600',
    'bg-gradient-to-br from-purple-500 to-purple-600',
    'bg-gradient-to-br from-pink-500 to-pink-600',
    'bg-gradient-to-br from-indigo-500 to-indigo-600',
    'bg-gradient-to-br from-red-500 to-red-600',
    'bg-gradient-to-br from-amber-500 to-amber-600',
    'bg-gradient-to-br from-teal-500 to-teal-600',
  ]

  const charCode = props.fullName.charCodeAt(0)
  const colorIndex = charCode % colors.length

  return `${sizes[props.size]} ${colors[colorIndex]}`
})
</script>
