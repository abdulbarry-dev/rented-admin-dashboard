<!-- LAYOUT FILE PURPOSE: Main admin layout with sidebar, header, and content area -->
<!--
LAYOUT STRUCTURE:
- AppSidebar: Left navigation menu
- AppHeader: Top header with user info, notifications, search
- Main Content Area: Router view for page content
- Breadcrumb Navigation: Shows current page hierarchy
- Notification Bell: Real-time alerts and messages

LAYOUT RESPONSIBILITIES:
- Provide consistent navigation across all admin pages
- Display user session information
- Show notification badges and alerts
- Render breadcrumbs based on current route
- Handle responsive layout (mobile/tablet/desktop)
- Manage sidebar collapse/expand state
-->

<template>
  <div class="default-layout">
    <!-- SIDEBAR COMPONENT -->
    <!--
    IMPLEMENTATION NOTES:
    - Display navigation menu with routes based on user role
    - Show active route highlighting
    - Support nested menu items with expand/collapse
    - Display menu icons and badge counts
    - Collapsible on mobile devices
    - Persist collapse state in localStorage
    - Filter menu items based on user permissions
    -->
    <AppSidebar
      :collapsed="sidebarCollapsed"
      @toggle="toggleSidebar"
    />

    <!-- MAIN CONTENT WRAPPER -->
    <div class="main-wrapper" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
      <!-- HEADER COMPONENT -->
      <!--
      IMPLEMENTATION NOTES:
      - Display app logo/title
      - Show current user info (name, avatar, role)
      - Notification bell with badge count
      - Quick search functionality
      - User dropdown menu (profile, settings, logout)
      - Breadcrumb navigation
      - Mobile menu toggle button
      -->
      <AppHeader
        :user="currentUser"
        :notifications-count="unreadNotificationsCount"
        @toggle-sidebar="toggleSidebar"
        @open-notifications="openNotifications"
      />

      <!-- BREADCRUMB NAVIGATION -->
      <!--
      IMPLEMENTATION NOTES:
      - Generate breadcrumbs from route meta
      - Support custom breadcrumb labels
      - Clickable breadcrumb items for navigation
      - Show current page as last item (not clickable)
      - Hide on mobile devices to save space
      -->
      <nav class="breadcrumb-nav" aria-label="Breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <router-link to="/">
              <!-- Home icon -->
              Dashboard
            </router-link>
          </li>
          <li
            v-for="(crumb, index) in breadcrumbs"
            :key="index"
            class="breadcrumb-item"
            :class="{ active: index === breadcrumbs.length - 1 }"
          >
            <router-link
              v-if="index < breadcrumbs.length - 1"
              :to="crumb.path"
            >
              {{ crumb.label }}
            </router-link>
            <span v-else>{{ crumb.label }}</span>
          </li>
        </ol>
      </nav>

      <!-- MAIN CONTENT AREA -->
      <!--
      IMPLEMENTATION NOTES:
      - Render current route component
      - Provide padding and consistent spacing
      - Handle loading states during route transitions
      - Show error boundary for component errors
      - Support page transitions/animations
      - Responsive padding for mobile devices
      -->
      <main class="main-content">
        <!-- Loading indicator during route changes -->
        <div v-if="isLoading" class="loading-overlay">
          <div class="spinner"></div>
          <p>Loading...</p>
        </div>

        <!-- Route view with transition -->
        <transition name="page-fade" mode="out-in">
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </transition>
      </main>

      <!-- FOOTER (Optional) -->
      <!--
      IMPLEMENTATION NOTES:
      - Show copyright information
      - Display version number
      - Links to documentation, support
      - Privacy policy and terms links
      -->
      <footer class="layout-footer">
        <div class="footer-content">
          <p>&copy; {{ currentYear }} Rented Admin Dashboard. All rights reserved.</p>
          <div class="footer-links">
            <a href="/docs" target="_blank">Documentation</a>
            <a href="/support" target="_blank">Support</a>
            <a href="/privacy" target="_blank">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>

    <!-- NOTIFICATION PANEL (Slide-in from right) -->
    <!--
    IMPLEMENTATION NOTES:
    - Slide-in panel showing notifications
    - List of unread and recent notifications
    - Click to mark as read
    - Click notification to navigate to relevant page
    - Filter by notification type
    - "Mark all as read" action
    - Real-time updates via WebSocket
    -->
    <NotificationPanel
      :open="notificationPanelOpen"
      @close="closeNotifications"
    />
  </div>
</template>

<script setup lang="ts">
// SCRIPT PURPOSE: Layout state management and logic
//
// IMPLEMENTATION NOTES:

import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
// import { useAuthStore } from '@/stores/auth'
// import { useNotificationStore } from '@/stores/notifications'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import NotificationPanel from '@/components/NotificationPanel.vue'

// REACTIVE STATE:

// Sidebar collapse state
// - Default to false (expanded)
// - Persist to localStorage
// - Auto-collapse on mobile devices
const sidebarCollapsed = ref(false)

// Notification panel state
const notificationPanelOpen = ref(false)

// Loading state for route transitions
const isLoading = ref(false)

// Current route
const route = useRoute()

// COMPUTED PROPERTIES:

// Get current user from auth store
// - Display name, avatar, role in header
const currentUser = computed(() => {
  // return useAuthStore().user
  return {
    name: 'Admin User',
    avatar: '/default-avatar.png',
    role: 'Super Administrator'
  }
})

// Get unread notification count
// - Display badge on notification bell
// - Real-time updates from notification store
const unreadNotificationsCount = computed(() => {
  // return useNotificationStore().unreadCount
  return 5 // Placeholder
})

// Generate breadcrumbs from current route
// - Extract from route meta.breadcrumb
// - Build hierarchy from parent routes
const breadcrumbs = computed(() => {
  // IMPLEMENTATION:
  // 1. Get all matched routes
  // 2. Extract breadcrumb from each route meta
  // 3. Build array of { label, path }
  // 4. Filter out routes without breadcrumbs

  const crumbs: Array<{ label: string; path: string }> = []

  route.matched.forEach((match) => {
    if (match.meta.breadcrumb) {
      crumbs.push({
        label: match.meta.breadcrumb as string,
        path: match.path
      })
    }
  })

  return crumbs
})

// Current year for footer
const currentYear = computed(() => new Date().getFullYear())

// METHODS:

// Toggle sidebar collapse state
// - Save state to localStorage
// - Emit event for animations
function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
  localStorage.setItem('sidebarCollapsed', String(sidebarCollapsed.value))
}

// Open notification panel
function openNotifications() {
  notificationPanelOpen.value = true
}

// Close notification panel
function closeNotifications() {
  notificationPanelOpen.value = false
}

// LIFECYCLE HOOKS:

onMounted(() => {
  // INITIALIZATION:
  // 1. Restore sidebar state from localStorage
  // 2. Connect to WebSocket for real-time notifications
  // 3. Check screen size and auto-collapse on mobile
  // 4. Load initial notification count

  const savedState = localStorage.getItem('sidebarCollapsed')
  if (savedState !== null) {
    sidebarCollapsed.value = savedState === 'true'
  }

  // Auto-collapse on mobile
  if (window.innerWidth < 768) {
    sidebarCollapsed.value = true
  }
})

// ROUTE WATCHERS:

// Watch route changes
// - Show loading state during navigation
// - Close mobile sidebar after navigation
// - Update page title
watch(
  () => route.path,
  (newPath) => {
    // IMPLEMENTATION:
    // 1. Set loading state to true
    // 2. Close sidebar on mobile after navigation
    // 3. Scroll to top of page
    // 4. Update document title from route meta

    isLoading.value = true

    // Close sidebar on mobile
    if (window.innerWidth < 768) {
      sidebarCollapsed.value = true
    }

    // Scroll to top
    window.scrollTo(0, 0)

    // Update title
    document.title = `${route.meta.title || 'Admin'} - Rented Dashboard`

    // Hide loading after a delay (component should be loaded)
    setTimeout(() => {
      isLoading.value = false
    }, 300)
  }
)

// RESPONSIVE HANDLING:

// Listen for window resize
// - Auto-collapse sidebar on mobile
// - Adjust layout spacing
window.addEventListener('resize', () => {
  if (window.innerWidth < 768 && !sidebarCollapsed.value) {
    sidebarCollapsed.value = true
  }
})
</script>

<style scoped>
/* LAYOUT STYLES */
/*
IMPLEMENTATION NOTES:
- Use flexbox for layout structure
- Sidebar fixed on left, main content on right
- Header fixed at top with shadow
- Responsive breakpoints for mobile/tablet
- Smooth transitions for sidebar collapse
- Z-index layering for overlays
*/

.default-layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-color);
}

/* MAIN WRAPPER */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 250px; /* Sidebar width */
  transition: margin-left 0.3s ease;
}

.main-wrapper.sidebar-collapsed {
  margin-left: 60px; /* Collapsed sidebar width */
}

/* BREADCRUMB NAVIGATION */
.breadcrumb-nav {
  padding: 1rem 2rem;
  background: white;
  border-bottom: 1px solid var(--border-color);
}

.breadcrumb {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item:not(:last-child)::after {
  content: '/';
  margin-left: 0.5rem;
  color: var(--text-muted);
}

.breadcrumb-item a {
  color: var(--primary-color);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.breadcrumb-item.active span {
  color: var(--text-muted);
}

/* MAIN CONTENT */
.main-content {
  flex: 1;
  padding: 2rem;
  position: relative;
}

/* LOADING OVERLAY */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid var(--border-color);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* PAGE TRANSITIONS */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* FOOTER */
.layout-footer {
  padding: 1.5rem 2rem;
  background: white;
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-links {
  display: flex;
  gap: 1.5rem;
}

.footer-links a {
  color: var(--text-secondary);
  text-decoration: none;
}

.footer-links a:hover {
  color: var(--primary-color);
}

/* RESPONSIVE STYLES */
@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 0;
  }

  .breadcrumb-nav {
    display: none; /* Hide on mobile to save space */
  }

  .main-content {
    padding: 1rem;
  }

  .footer-content {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
