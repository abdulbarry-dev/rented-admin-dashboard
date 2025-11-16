<template>
  <aside class="app-sidebar" :class="{ 'collapsed': isCollapsed, 'mobile-open': mobileOpen }">
    <div class="sidebar-header">
      <div class="logo-wrapper">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" class="logo-svg">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
        </div>
        <transition name="fade">
          <h2 v-if="!isCollapsed" class="logo-text">Rented</h2>
        </transition>
      </div>
      <button class="mobile-close" @click="closeMobileSidebar">
        <XMarkIcon class="icon" />
      </button>
    </div>

    <nav class="sidebar-nav">
      <!-- Main Section -->
      <div class="nav-section">
        <transition name="fade">
          <div v-if="!isCollapsed" class="section-label">MAIN</div>
        </transition>
        <ul class="nav-list">
          <li
            v-for="item in mainMenuItems"
            :key="item.name"
            class="nav-item"
            :class="{ active: isActive(item.route) }"
          >
            <router-link :to="item.route" class="nav-link" @click="closeMobileSidebar">
              <component :is="item.icon" class="nav-icon" />
              <transition name="fade">
                <span v-if="!isCollapsed" class="nav-text">{{ item.name }}</span>
              </transition>
              <transition name="fade">
                <span v-if="item.badge && !isCollapsed" class="badge">{{ item.badge }}</span>
              </transition>
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Management Section -->
      <div class="nav-section">
        <transition name="fade">
          <div v-if="!isCollapsed" class="section-label">MANAGEMENT</div>
        </transition>
        <ul class="nav-list">
          <li
            v-for="item in managementMenuItems"
            :key="item.name"
            class="nav-item"
            :class="{ active: isActive(item.route) }"
          >
            <router-link :to="item.route" class="nav-link" @click="closeMobileSidebar">
              <component :is="item.icon" class="nav-icon" />
              <transition name="fade">
                <span v-if="!isCollapsed" class="nav-text">{{ item.name }}</span>
              </transition>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Sidebar Footer with Toggle -->
    <div class="sidebar-footer">
      <button class="collapse-btn" @click="toggleCollapse" title="Toggle Sidebar">
        <ChevronLeftIcon v-if="!isCollapsed" class="icon" />
        <ChevronRightIcon v-else class="icon" />
      </button>
    </div>
  </aside>

  <!-- Mobile overlay -->
  <div v-if="mobileOpen" class="sidebar-overlay" @click="closeMobileSidebar"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import type { Component } from 'vue'
import {
  HomeIcon,
  ShieldCheckIcon,
  UsersIcon,
  CubeIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

interface MenuItem {
  name: string
  route: string
  icon: Component
  badge?: number
}

defineProps<{
  mobileOpen?: boolean
}>()

const emit = defineEmits<{
  'close-mobile': []
  'toggle-collapse': [collapsed: boolean]
}>()

const route = useRoute()
const isCollapsed = ref(false)

// Main menu items
const mainMenuItems = ref<MenuItem[]>([
  { name: 'Dashboard', route: '/', icon: HomeIcon },
  { name: 'Verification', route: '/verification/queue', icon: ShieldCheckIcon, badge: 5 },
  { name: 'Analytics', route: '/analytics', icon: ChartBarIcon }
])

// Management menu items
const managementMenuItems = ref<MenuItem[]>([
  { name: 'Users', route: '/users', icon: UsersIcon },
  { name: 'Items', route: '/items', icon: CubeIcon },
  { name: 'Transactions', route: '/transactions', icon: ArrowsRightLeftIcon },
  { name: 'Audit Logs', route: '/audit', icon: ClipboardDocumentListIcon },
  { name: 'Settings', route: '/settings', icon: Cog6ToothIcon }
])

const isActive = (itemRoute: string) => {
  if (itemRoute === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(itemRoute)
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  localStorage.setItem('sidebar-collapsed', JSON.stringify(isCollapsed.value))
  emit('toggle-collapse', isCollapsed.value)
}

const closeMobileSidebar = () => {
  emit('close-mobile')
}

// Load collapse state from localStorage
onMounted(() => {
  const saved = localStorage.getItem('sidebar-collapsed')
  if (saved) {
    isCollapsed.value = JSON.parse(saved)
  }
})

// Watch for collapse changes
watch(isCollapsed, (newVal) => {
  emit('toggle-collapse', newVal)
})
</script>

<style scoped>
.app-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 260px;
  height: 100vh;
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  display: flex;
  flex-direction: column;
  z-index: 1000;
  box-shadow: none;
  border-right: 1px solid var(--sidebar-border);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              background-color 0.3s ease,
              border-color 0.3s ease;
}

.app-sidebar.collapsed {
  width: 70px;
}

.sidebar-header {
  padding: 1.25rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 73px;
}

.mobile-close {
  display: none;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--sidebar-hover-bg);
  border: none;
  border-radius: 6px;
  color: var(--sidebar-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-close:hover {
  background: var(--sidebar-active-bg);
  color: var(--sidebar-text-active);
}

.mobile-close .icon {
  width: 18px;
  height: 18px;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  padding: 7px;
}

.logo-svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--sidebar-text-active);
  margin: 0;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem 0;
}

.sidebar-nav::-webkit-scrollbar {
  width: 4px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: var(--sidebar-hover-bg);
  border-radius: 2px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: var(--sidebar-active-bg);
}

.nav-section {
  margin-bottom: 1.5rem;
}

.section-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--sidebar-section-label);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.5rem 1.25rem;
  margin-bottom: 0.25rem;
  transition: color 0.3s ease;
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0.125rem 0.75rem;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 0.75rem 0.875rem;
  text-decoration: none;
  color: var(--sidebar-text);
  border-radius: 8px;
  transition: all 0.2s ease;
  position: relative;
  gap: 0.875rem;
}

.collapsed .nav-link {
  justify-content: center;
  padding: 0.75rem;
}

.nav-link:hover {
  background: var(--sidebar-hover-bg);
  color: var(--sidebar-text-active);
}

.nav-item.active .nav-link {
  background: var(--sidebar-active-bg);
  color: var(--sidebar-text-active);
  font-weight: 600;
}

.nav-item.active .nav-link::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: var(--sidebar-active-indicator);
  border-radius: 0 2px 2px 0;
}

.collapsed .nav-item.active .nav-link::before {
  display: none;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  stroke-width: 2;
}

.nav-text {
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
}

.badge {
  margin-left: auto;
  background: var(--primary-color);
  color: white;
  font-size: 0.6875rem;
  padding: 0.125rem 0.5rem;
  border-radius: 10px;
  font-weight: 600;
  min-width: 18px;
  text-align: center;
  transition: background-color 0.3s ease;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--sidebar-border);
  transition: border-color 0.3s ease;
}

.collapse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.625rem;
  background: var(--sidebar-hover-bg);
  border: none;
  border-radius: 8px;
  color: var(--sidebar-text);
  cursor: pointer;
  transition: all 0.2s ease;
}

.collapse-btn:hover {
  background: var(--sidebar-active-bg);
  color: var(--sidebar-text-active);
}

.collapse-btn .icon {
  width: 18px;
  height: 18px;
  stroke-width: 2.5;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.sidebar-overlay {
  display: none;
}

/* Tablet styles */
@media (max-width: 1024px) {
  .app-sidebar {
    width: 240px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
    width: 280px;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
  }

  .app-sidebar.mobile-open {
    transform: translateX(0);
  }

  .mobile-close {
    display: flex;
  }

  .sidebar-overlay {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    z-index: 999;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .nav-link {
    padding: 1rem;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
    font-size: 1.125rem;
  }

  .logo-text {
    font-size: 1.25rem;
  }
}
</style>
