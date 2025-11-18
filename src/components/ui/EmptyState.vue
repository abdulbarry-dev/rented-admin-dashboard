<script setup lang="ts">
import type { Component } from 'vue'

export interface EmptyStateProps {
  icon?: Component
  title: string
  description?: string
  actionText?: string
  compact?: boolean
}

defineProps<EmptyStateProps>()

const emit = defineEmits<{
  action: []
}>()
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-center transition-all duration-200"
    :class="compact ? 'p-8' : 'p-12'"
  >
    <!-- Icon -->
    <div class="mb-4 flex justify-center">
      <div
        class="rounded-full bg-slate-100 dark:bg-slate-900/50 p-4 transition-colors duration-200"
        :class="compact ? 'p-3' : 'p-4'"
      >
        <component
          v-if="icon"
          :is="icon"
          class="text-slate-400 dark:text-slate-500 transition-colors duration-200"
          :class="compact ? 'w-10 h-10' : 'w-12 h-12'"
        />
        <svg
          v-else
          class="text-slate-400 dark:text-slate-500 transition-colors duration-200"
          :class="compact ? 'w-10 h-10' : 'w-12 h-12'"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
      </div>
    </div>

    <!-- Title -->
    <h3
      class="font-semibold text-slate-900 dark:text-white mb-2 transition-colors duration-200"
      :class="compact ? 'text-base' : 'text-lg'"
    >
      {{ title }}
    </h3>

    <!-- Description -->
    <p
      v-if="description"
      class="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto transition-colors duration-200"
      :class="compact ? 'text-sm mb-4' : 'text-base mb-6'"
    >
      {{ description }}
    </p>

    <!-- Action Button -->
    <div v-if="actionText || $slots.action">
      <slot name="action">
        <button
          v-if="actionText"
          @click="emit('action')"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          :class="compact ? 'text-sm px-3 py-1.5' : 'text-sm px-4 py-2'"
        >
          {{ actionText }}
        </button>
      </slot>
    </div>
  </div>
</template>
