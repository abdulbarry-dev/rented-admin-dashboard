<script setup lang="ts">
export interface SkeletonProps {
  variant?: 'text' | 'rect' | 'circle' | 'card' | 'table' | 'list'
  count?: number
  height?: string
  width?: string
  animated?: boolean
}

const props = withDefaults(defineProps<SkeletonProps>(), {
  variant: 'text',
  count: 1,
  animated: true
})
</script>

<template>
  <!-- Text Skeleton -->
  <div v-if="variant === 'text'" class="space-y-3">
    <div
      v-for="i in count"
      :key="i"
      class="rounded bg-slate-200 dark:bg-slate-700 transition-colors duration-200"
      :class="animated ? 'animate-pulse' : ''"
      :style="{
        height: height || '12px',
        width: width || (i === count ? '80%' : '100%')
      }"
    ></div>
  </div>

  <!-- Rectangle Skeleton -->
  <div v-else-if="variant === 'rect'">
    <div
      class="rounded-lg bg-slate-200 dark:bg-slate-700 transition-colors duration-200"
      :class="animated ? 'animate-pulse' : ''"
      :style="{
        height: height || '200px',
        width: width || '100%'
      }"
    ></div>
  </div>

  <!-- Circle Skeleton -->
  <div v-else-if="variant === 'circle'">
    <div
      class="rounded-full bg-slate-200 dark:bg-slate-700 transition-colors duration-200"
      :class="animated ? 'animate-pulse' : ''"
      :style="{
        height: height || '48px',
        width: width || '48px'
      }"
    ></div>
  </div>

  <!-- Card Skeleton -->
  <div v-else-if="variant === 'card'" class="space-y-4">
    <div
      v-for="i in count"
      :key="i"
      class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all duration-200"
      :class="animated ? 'animate-pulse' : ''"
    >
      <!-- Card Header -->
      <div class="flex items-center gap-4 mb-4">
        <div class="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-full transition-colors duration-200"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 transition-colors duration-200"></div>
          <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 transition-colors duration-200"></div>
        </div>
      </div>
      <!-- Card Body -->
      <div class="space-y-2">
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded transition-colors duration-200"></div>
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-5/6 transition-colors duration-200"></div>
      </div>
    </div>
  </div>

  <!-- Table Skeleton -->
  <div v-else-if="variant === 'table'">
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-200">
      <!-- Table Header -->
      <div class="grid grid-cols-12 gap-4 p-4 border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
        <div v-for="col in 5" :key="col" class="col-span-2">
          <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded transition-colors duration-200" :class="animated ? 'animate-pulse' : ''"></div>
        </div>
      </div>
      <!-- Table Rows -->
      <div class="divide-y divide-slate-200 dark:divide-slate-700 transition-colors duration-200">
        <div
          v-for="row in (count || 5)"
          :key="row"
          class="grid grid-cols-12 gap-4 p-4"
        >
          <div v-for="col in 5" :key="col" class="col-span-2">
            <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded transition-colors duration-200" :class="animated ? 'animate-pulse' : ''"></div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- List Skeleton -->
  <div v-else-if="variant === 'list'" class="space-y-3">
    <div
      v-for="i in (count || 5)"
      :key="i"
      class="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 transition-all duration-200"
      :class="animated ? 'animate-pulse' : ''"
    >
      <div class="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0 transition-colors duration-200"></div>
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 transition-colors duration-200"></div>
        <div class="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 transition-colors duration-200"></div>
      </div>
    </div>
  </div>
</template>
