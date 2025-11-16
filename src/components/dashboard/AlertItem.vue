<template>
  <div class="alert-item" :class="severity">
    <div class="alert-icon">
      <ExclamationTriangleIcon v-if="severity === 'warning'" class="icon" />
      <ExclamationCircleIcon v-else-if="severity === 'critical'" class="icon" />
      <InformationCircleIcon v-else class="icon" />
    </div>
    <div class="alert-content">
      <p class="alert-message">{{ message }}</p>
      <span class="alert-time">{{ timestamp }}</span>
    </div>
    <button class="alert-dismiss" @click="$emit('dismiss')">
      <XMarkIcon class="icon" />
    </button>
  </div>
</template>

<script setup lang="ts">
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

interface Props {
  message: string
  severity: 'critical' | 'warning' | 'info'
  timestamp: string
}

defineProps<Props>()
defineEmits<{
  dismiss: []
}>()
</script>

<style scoped>
.alert-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid;
  transition: all 0.2s ease;
}

.alert-item.critical {
  background: rgba(239, 68, 68, 0.05);
  border-color: rgba(239, 68, 68, 0.2);
}

.alert-item.warning {
  background: rgba(245, 158, 11, 0.05);
  border-color: rgba(245, 158, 11, 0.2);
}

.alert-item.info {
  background: rgba(59, 130, 246, 0.05);
  border-color: rgba(59, 130, 246, 0.2);
}

.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon .icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.alert-item.critical .alert-icon {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.alert-item.warning .alert-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.alert-item.info .alert-icon {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-message {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin: 0 0 0.375rem 0;
  line-height: 1.5;
  transition: color 0.3s ease;
}

.alert-time {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

.alert-dismiss {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.alert-dismiss:hover {
  background: var(--bg-color);
  color: var(--text-primary);
}

.alert-dismiss .icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .alert-item {
    padding: 0.875rem;
  }

  .alert-icon {
    width: 32px;
    height: 32px;
  }

  .alert-icon .icon {
    width: 16px;
    height: 16px;
  }
}
</style>
