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
            :class="{ active: isActive(item.route), 'has-children': item.children }"
          >
            <!-- Parent item with children -->
            <template v-if="item.children">
              <div class="nav-link parent-link" @click="toggleExpand(item.name)">
                <component :is="item.icon" class="nav-icon" />
                <transition name="fade">
                  <span v-if="!isCollapsed" class="nav-text">{{ item.name }}</span>
                </transition>
                <transition name="fade">
                  <span v-if="item.badge && !isCollapsed" class="badge">{{ item.badge }}</span>
                </transition>
                <transition name="fade">
                  <ChevronDownIcon
                    v-if="!isCollapsed"
                    class="expand-icon"
                    :class="{ 'expanded': isExpanded(item.name) }"
                  />
                </transition>
              </div>
              <!-- Submenu -->
              <transition name="submenu">
                <ul v-if="isExpanded(item.name) && !isCollapsed" class="submenu">
                  <li
                    v-for="child in item.children"
                    :key="child.name"
                    class="submenu-item"
                    :class="{ active: route.path === child.route }"
                  >
                    <router-link :to="child.route" class="submenu-link" @click="closeMobileSidebar">
                      <component :is="child.icon" class="submenu-icon" />
                      <span class="submenu-text">{{ child.name }}</span>
                      <span v-if="child.badge" class="badge">{{ child.badge }}</span>
                    </router-link>
                  </li>
                </ul>
              </transition>
            </template>
            <!-- Regular link without children -->
            <router-link v-else :to="item.route" class="nav-link" @click="closeMobileSidebar">
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
            :class="{ active: isActive(item.route), 'has-children': item.children }"
          >
            <!-- Parent item with children -->
            <template v-if="item.children">
              <div class="nav-link parent-link" @click="toggleExpand(item.name)">
                <component :is="item.icon" class="nav-icon" />
                <transition name="fade">
                  <span v-if="!isCollapsed" class="nav-text">{{ item.name }}</span>
                </transition>
                <transition name="fade">
                  <span v-if="item.badge && !isCollapsed" class="badge">{{ item.badge }}</span>
                </transition>
                <transition name="fade">
                  <ChevronDownIcon
                    v-if="!isCollapsed"
                    class="expand-icon"
                    :class="{ 'expanded': isExpanded(item.name) }"
                  />
                </transition>
              </div>
              <!-- Submenu -->
              <transition name="submenu">
                <ul v-if="isExpanded(item.name) && !isCollapsed" class="submenu">
                  <li
                    v-for="child in item.children"
                    :key="child.name"
                    class="submenu-item"
                    :class="{ active: route.path === child.route }"
                  >
                    <router-link :to="child.route" class="submenu-link" @click="closeMobileSidebar">
                      <component :is="child.icon" class="submenu-icon" />
                      <span class="submenu-text">{{ child.name }}</span>
                      <span v-if="child.badge" class="badge">{{ child.badge }}</span>
                    </router-link>
                  </li>
                </ul>
              </transition>
            </template>
            <!-- Regular link without children -->
            <router-link v-else :to="item.route" class="nav-link" @click="closeMobileSidebar">
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
  ChevronRightIcon,
  ClockIcon,
  DocumentTextIcon,
  QueueListIcon,
  ExclamationTriangleIcon,
  ChevronDownIcon,
  PresentationChartLineIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  BanknotesIcon,
  TagIcon,
  CpuChipIcon,
  FlagIcon,
  ShoppingBagIcon,
  CalendarDaysIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  TruckIcon
} from '@heroicons/vue/24/outline'

interface MenuItem {
  name: string
  route: string
  icon: Component
  badge?: number
  children?: MenuItem[]
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
const expandedItems = ref<string[]>([])

// Main menu items
const mainMenuItems = ref<MenuItem[]>([
  { name: 'Dashboard', route: '/', icon: HomeIcon },
  {
    name: 'Verification',
    route: '/verification/queue',
    icon: ShieldCheckIcon,
    badge: 5,
    children: [
      { name: 'Queue', route: '/verification/queue', icon: ClockIcon, badge: 5 },
      { name: 'History', route: '/verification/history', icon: DocumentTextIcon },
      { name: 'Fraud Alerts', route: '/verification/fraud', icon: ExclamationTriangleIcon, badge: 8 }
    ]
  },
  {
    name: 'Analytics',
    route: '/analytics',
    icon: ChartBarIcon,
    children: [
      { name: 'Overview', route: '/analytics', icon: PresentationChartLineIcon },
      { name: 'Sales Trends', route: '/analytics/sales-trends', icon: ArrowTrendingUpIcon },
      { name: 'User Growth', route: '/analytics/user-growth', icon: UserGroupIcon },
      { name: 'Revenue Reports', route: '/analytics/revenue-reports', icon: BanknotesIcon },
      { name: 'Popular Categories', route: '/analytics/popular-categories', icon: TagIcon },
      { name: 'Performance Metrics', route: '/analytics/performance-metrics', icon: CpuChipIcon }
    ]
  }
])

// Management menu items
const managementMenuItems = ref<MenuItem[]>([
  { name: 'Users', route: '/users', icon: UsersIcon },
  {
    name: 'Items',
    route: '/items',
    icon: CubeIcon,
    children: [
      { name: 'All Items', route: '/items', icon: QueueListIcon },
      { name: 'Reported', route: '/items/reported', icon: FlagIcon, badge: 6 }
    ]
  },
  {
    name: 'Transactions',
    route: '/transactions',
    icon: ArrowsRightLeftIcon,
    children: [
      { name: 'All Transactions', route: '/transactions', icon: ArrowsRightLeftIcon },
      { name: 'Purchases', route: '/transactions/purchases', icon: ShoppingBagIcon },
      { name: 'Rentals', route: '/transactions/rentals', icon: CalendarDaysIcon },
      { name: 'Disputes', route: '/transactions/disputes', icon: ExclamationCircleIcon, badge: 3 },
      { name: 'Refunds', route: '/transactions/refunds', icon: ArrowPathIcon },
      { name: 'Shipping', route: '/transactions/shipping', icon: TruckIcon }
    ]
  },
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

const toggleExpand = (itemName: string) => {
  const index = expandedItems.value.indexOf(itemName)
  if (index > -1) {
    expandedItems.value.splice(index, 1)
  } else {
    expandedItems.value.push(itemName)
  }
}

const isExpanded = (itemName: string) => {
  return expandedItems.value.includes(itemName)
}

// Load collapse state from localStorage
onMounted(() => {
  const saved = localStorage.getItem('sidebar-collapsed')
  if (saved) {
    isCollapsed.value = JSON.parse(saved)
  }
  // Auto-expand verification menu if on verification page
  if (route.path.startsWith('/verification')) {
    expandedItems.value.push('Verification')
  }
  // Auto-expand analytics menu if on analytics page
  if (route.path.startsWith('/analytics')) {
    expandedItems.value.push('Analytics')
  }
  // Auto-expand items menu if on items page
  if (route.path.startsWith('/items')) {
    expandedItems.value.push('Items')
  }
  // Auto-expand transactions menu if on transactions page
  if (route.path.startsWith('/transactions')) {
    expandedItems.value.push('Transactions')
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

  .sidebar-header {
    min-height: 64px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .app-sidebar {
    transform: translateX(-100%);
    width: 280px;
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);
    max-width: 85vw;
  }

  .app-sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar-header {
    min-height: 56px;
    padding: 1rem;
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
    padding: 0.875rem 1rem;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .logo-text {
    font-size: 1.125rem;
  }
}

/* Parent link with children */
.parent-link {
  cursor: pointer;
}

.expand-icon {
  width: 16px;
  height: 16px;
  margin-left: auto;
  transition: transform 0.2s ease;
}

.expand-icon.expanded {
  transform: rotate(180deg);
}

/* Submenu styles */
.submenu {
  list-style: none;
  padding: 0;
  margin: 0.25rem 0 0.5rem 0;
  overflow: hidden;
}

.submenu-item {
  margin: 0.125rem 0;
}

.submenu-link {
  display: flex;
  align-items: center;
  padding: 0.625rem 0.875rem 0.625rem 3rem;
  text-decoration: none;
  color: var(--sidebar-text);
  border-radius: 8px;
  transition: all 0.2s ease;
  gap: 0.75rem;
  font-size: 0.8125rem;
}

.submenu-link:hover {
  background: var(--sidebar-hover-bg);
  color: var(--sidebar-text-active);
}

.submenu-item.active .submenu-link {
  background: var(--sidebar-active-bg);
  color: var(--sidebar-text-active);
  font-weight: 600;
}

.submenu-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  stroke-width: 2;
}

.submenu-text {
  font-weight: 500;
  white-space: nowrap;
}

/* Submenu transition */
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.3s ease;
}

.submenu-enter-from,
.submenu-leave-to {
  max-height: 0;
  opacity: 0;
}

.submenu-enter-to,
.submenu-leave-from {
  max-height: 300px;
  opacity: 1;
}
</style>
