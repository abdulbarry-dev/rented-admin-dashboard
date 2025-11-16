<template>
  <div class="stat-item">
    <div class="stat-icon" :class="`bg-${color}`">
      <component :is="icon" class="icon" />
    </div>
    <div class="stat-info">
      <div class="stat-value">{{ value }}</div>
      <div class="stat-label">{{ label }}</div>
    </div>
    <div class="stat-change" :class="changeType">
      {{ change }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  label: string
  value: string | number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: Component
  color: string
}

defineProps<Props>()
</script>

<style scoped>
.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: var(--bg-color);
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.stat-item:hover {
  background: var(--bg-secondary);
  border-color: var(--border-color);
  transform: translateX(4px);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon .icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  color: white;
}

.stat-icon.bg-blue { background: #3b82f6; }
.stat-icon.bg-green { background: #22c55e; }
.stat-icon.bg-purple { background: #8b5cf6; }
.stat-icon.bg-orange { background: #f59e0b; }

.stat-info {
  flex: 1;
  min-width: 0;
}

.stat-value {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text-primary);
  transition: color 0.3s ease;
}

.stat-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.stat-change {
  font-size: 0.8125rem;
  font-weight: 600;
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
}

.stat-change.positive {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.stat-change.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.stat-change.neutral {
  background: var(--bg-secondary);
  color: var(--text-muted);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .stat-item {
    padding: 0.875rem;
  }

  .stat-icon {
    width: 32px;
    height: 32px;
  }

  .stat-icon .icon {
    width: 16px;
    height: 16px;
  }
}
</style>
