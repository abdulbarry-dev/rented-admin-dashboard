<template>
  <div class="activity-item">
    <div class="activity-icon" :class="`bg-${color}`">
      <component :is="icon" class="icon" />
    </div>
    <div class="activity-content">
      <div class="activity-text">
        <span class="activity-action">{{ action }}</span>
        <span class="activity-admin">by {{ admin }}</span>
      </div>
      <div class="activity-time">{{ timestamp }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  action: string
  admin: string
  timestamp: string
  icon: Component
  color: string
}

defineProps<Props>()
</script>

<style scoped>
.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--bg-color);
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.activity-item:hover {
  background: var(--bg-secondary);
  border-color: var(--border-color);
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon .icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
  color: white;
}

.activity-icon.bg-blue { background: #3b82f6; }
.activity-icon.bg-green { background: #22c55e; }
.activity-icon.bg-purple { background: #8b5cf6; }
.activity-icon.bg-teal { background: #14b8a6; }
.activity-icon.bg-indigo { background: #6366f1; }

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-text {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.25rem;
}

.activity-action {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.activity-admin {
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.activity-time {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .activity-item {
    padding: 0.875rem;
  }

  .activity-icon {
    width: 32px;
    height: 32px;
  }

  .activity-icon .icon {
    width: 16px;
    height: 16px;
  }
}
</style>
