<script setup lang="ts">
export interface CardProps {
  title?: string
  subtitle?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  clickable?: boolean
}

const props = withDefaults(defineProps<CardProps>(), {
  padding: 'md',
  hoverable: false,
  clickable: false
})

const emit = defineEmits<{
  click: []
}>()

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
}
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-200"
    :class="[
      paddingClasses[padding],
      hoverable ? 'hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600' : '',
      clickable ? 'cursor-pointer active:scale-[0.99]' : ''
    ]"
    @click="clickable ? emit('click') : undefined"
  >
    <!-- Header -->
    <div v-if="title || subtitle || $slots.header" class="mb-4">
      <slot name="header">
        <div v-if="title" class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-white transition-colors duration-200">
              {{ title }}
            </h3>
            <p v-if="subtitle" class="text-sm text-slate-600 dark:text-slate-400 mt-1 transition-colors duration-200">
              {{ subtitle }}
            </p>
          </div>
          <slot name="header-action"></slot>
        </div>
      </slot>
    </div>

    <!-- Content -->
    <div>
      <slot />
    </div>

    <!-- Footer -->
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 transition-colors duration-200">
      <slot name="footer" />
    </div>
  </div>
</template>
