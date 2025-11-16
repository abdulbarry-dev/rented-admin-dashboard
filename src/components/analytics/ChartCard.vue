<script setup lang="ts">
import { ArrowDownTrayIcon } from '@heroicons/vue/24/outline'

interface Props {
  title: string
  subtitle?: string
  loading?: boolean
  showDownload?: boolean
}

interface Emits {
  (e: 'download'): void
}

withDefaults(defineProps<Props>(), {
  subtitle: '',
  loading: false,
  showDownload: true
})

const emit = defineEmits<Emits>()

const handleDownload = () => {
  emit('download')
}
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all duration-300">
    <div class="flex items-start justify-between mb-6">
      <div>
        <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
          {{ title }}
        </h3>
        <p v-if="subtitle" class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {{ subtitle }}
        </p>
      </div>
      <button
        v-if="showDownload && !loading"
        @click="handleDownload"
        class="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200"
        title="Download Chart"
      >
        <ArrowDownTrayIcon class="w-5 h-5" />
      </button>
    </div>
    <div v-if="loading" class="flex items-center justify-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-blue-600 dark:border-t-blue-400"></div>
    </div>
    <div v-else>
      <slot />
    </div>
  </div>
</template>
