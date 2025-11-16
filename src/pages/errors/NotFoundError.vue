<template>
  <div class="error-page">
    <div class="error-container">
      <div class="error-card">
        <div class="error-icon">
          <DocumentMagnifyingGlassIcon class="icon" />
        </div>

        <div class="error-code">404</div>
        <h1 class="error-title">Page Not Found</h1>
        <p class="error-description">
          The page you're looking for doesn't exist or has been moved to a different location.
        </p>

        <div class="error-actions">
          <button class="btn primary" @click="goHome">
            <HomeIcon class="icon" />
            Back to Dashboard
          </button>
          <button class="btn secondary" @click="goBack">
            <ArrowLeftIcon class="icon" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  HomeIcon,
  ArrowLeftIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--bg-color);
}

.error-container {
  max-width: 600px;
  width: 100%;
}

.error-card {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: var(--shadow-sm);
}

.error-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  border-radius: 50%;
  background: rgba(99, 102, 241, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-icon .icon {
  width: 64px;
  height: 64px;
  color: var(--primary-color);
}

.error-code {
  font-size: 5rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  line-height: 1;
  opacity: 0.3;
}

.error-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.error-description {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 2.5rem 0;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  border-radius: var(--radius-md);
  border: none;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.btn .icon {
  width: 20px;
  height: 20px;
}

.btn.primary {
  background: var(--primary-color);
  color: white;
}

.btn.primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn.secondary:hover {
  background: var(--bg-color);
  color: var(--text-primary);
  border-color: var(--primary-color);
}

@media (max-width: 768px) {
  .error-page {
    padding: 1.5rem;
  }

  .error-card {
    padding: 2rem 1.5rem;
  }

  .error-icon {
    width: 100px;
    height: 100px;
  }

  .error-icon .icon {
    width: 48px;
    height: 48px;
  }

  .error-code {
    font-size: 4rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-description {
    font-size: 0.9375rem;
  }

  .error-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
