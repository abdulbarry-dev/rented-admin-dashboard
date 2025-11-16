<script setup lang="ts">
import { computed } from 'vue'
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/vue/24/solid'
import type { Component } from 'vue'

interface Props {
  title: string
  value: string | number
  growth: number
  subtitle: string
  icon: Component
  color: string
  animationDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  animationDelay: 0
})

const trendClass = computed(() => {
  if (props.growth > 0) return 'positive'
  if (props.growth < 0) return 'negative'
  return 'neutral'
})
</script>

<template>
  <div
    class="kpi-card"
    :style="{ animationDelay: `${animationDelay}s` }"
  >
    <div class="kpi-header">
      <div class="kpi-icon" :class="`icon-${color}`">
        <component :is="icon" class="icon" />
      </div>
      <div class="kpi-trend" :class="trendClass">
        <ArrowUpIcon v-if="growth > 0" class="trend-icon" />
        <ArrowDownIcon v-else-if="growth < 0" class="trend-icon" />
        <MinusIcon v-else class="trend-icon" />
        <span>{{ Math.abs(growth) }}%</span>
      </div>
    </div>
    <div class="kpi-body">
      <div class="kpi-value">{{ value }}</div>
      <div class="kpi-title">{{ title }}</div>
      <div class="kpi-subtitle">{{ subtitle }}</div>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.kpi-card {
  background: var(--card-bg);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.5s ease-out backwards;
}

.kpi-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.kpi-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.kpi-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.kpi-icon .icon {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

.kpi-icon.icon-blue {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.kpi-icon.icon-purple {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.kpi-icon.icon-green {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.kpi-icon.icon-orange {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.kpi-icon.icon-teal {
  background: rgba(20, 184, 166, 0.1);
  color: #14b8a6;
}

.kpi-icon.icon-indigo {
  background: rgba(99, 102, 241, 0.1);
  color: #6366f1;
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.kpi-trend .trend-icon {
  width: 12px;
  height: 12px;
}

.kpi-trend.positive {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.kpi-trend.negative {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.kpi-trend.neutral {
  background: var(--bg-color);
  color: var(--text-muted);
}

.kpi-body {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
  transition: color 0.3s ease;
}

.kpi-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.kpi-subtitle {
  font-size: 0.75rem;
  color: var(--text-muted);
  transition: color 0.3s ease;
}

/* Tablet Responsive */
@media (max-width: 1024px) {
  .kpi-card {
    padding: 1.25rem;
  }

  .kpi-icon {
    width: 40px;
    height: 40px;
  }

  .kpi-icon .icon {
    width: 20px;
    height: 20px;
  }

  .kpi-value {
    font-size: 1.5rem;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .kpi-card {
    padding: 1rem;
  }

  .kpi-icon {
    width: 36px;
    height: 36px;
  }

  .kpi-icon .icon {
    width: 18px;
    height: 18px;
  }

  .kpi-value {
    font-size: 1.25rem;
  }

  .kpi-title {
    font-size: 0.75rem;
  }

  .kpi-subtitle {
    font-size: 0.6875rem;
  }
}
</style>
