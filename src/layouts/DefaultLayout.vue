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
    <AppSidebar
      :mobile-open="mobileSidebarOpen"
      @close-mobile="closeMobileSidebar"
      @toggle-collapse="handleSidebarCollapse"
    />

    <!-- MAIN CONTENT WRAPPER -->
    <div class="main-wrapper">
      <!-- HEADER COMPONENT -->
      <AppHeader
        :user="currentUser"
        :notifications-count="unreadNotificationsCount"
        @open-notifications="openNotifications"
        @toggle-mobile-menu="toggleMobileSidebar"
      />

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
        <!-- Ensure RouterView renders content -->
        <transition name="page-fade" mode="out-in">
          <router-view />
        </transition>

        <!-- Fallback message for empty content -->
        <div v-if="!route.matched.length" class="empty-content">
          <p>No content available. Please check your route configuration.</p>
        </div>
      </main>

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
  </div>
</template>

<script setup lang="ts">
// SCRIPT PURPOSE: Layout state management and logic
//
// IMPLEMENTATION NOTES:

import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppSidebar from '../components/AppSidebar.vue'
import AppHeader from '../components/AppHeader.vue'
import NotificationPanel from '../components/NotificationPanel.vue'

// REACTIVE STATE:

// Notification panel state
const notificationPanelOpen = ref(false)
// Mobile sidebar state
const mobileSidebarOpen = ref(false)
// Sidebar collapsed state
const sidebarCollapsed = ref(false)
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

// METHODS:

// Open notification panel
function openNotifications() {
  notificationPanelOpen.value = true
}

// Close notification panel
function closeNotifications() {
  notificationPanelOpen.value = false
}

// Toggle mobile sidebar
function toggleMobileSidebar() {
  mobileSidebarOpen.value = !mobileSidebarOpen.value
}

// Close mobile sidebar
function closeMobileSidebar() {
  mobileSidebarOpen.value = false
}

// Handle sidebar collapse
function handleSidebarCollapse(collapsed: boolean) {
  sidebarCollapsed.value = collapsed
}

// LIFECYCLE HOOKS:

onMounted(() => {
  // INITIALIZATION:
  // 1. Connect to WebSocket for real-time notifications
  // 2. Load initial notification count
})

// RESPONSIVE HANDLING removed - sidebar always visible on desktop
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
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  position: relative;
}

/* MAIN WRAPPER */
.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-left: 260px; /* Sidebar width - always visible on desktop */
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  width: calc(100% - 260px);
  max-width: 100%;
  overflow-x: hidden;
}

.default-layout:has(.app-sidebar.collapsed) .main-wrapper {
  margin-left: 70px;
  width: calc(100% - 70px);
}

/* Tablet */
@media (max-width: 1024px) {
  .main-wrapper {
    margin-left: 240px;
    width: calc(100% - 240px);
  }
}

/* Mobile */
@media (max-width: 768px) {
  .main-wrapper {
    margin-left: 0;
    width: 100%;
  }
}

/* MAIN CONTENT */
.main-content {
  flex: 1;
  padding: 2rem;
  position: relative;
  background-color: var(--bg-color);
  min-height: calc(100vh - 73px); /* Desktop header height */
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* Tablet */
@media (max-width: 1024px) {
  .main-content {
    padding: 1.5rem;
    min-height: calc(100vh - 64px); /* Tablet header height */
  }
}

/* Mobile */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
    min-height: calc(100vh - 56px); /* Mobile header height */
  }
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
  background: var(--card-bg);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
  transition: background-color 0.3s ease, border-color 0.3s ease;
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
  transition: color 0.2s ease;
}

.footer-links a:hover {
  color: var(--primary-color);
}

/* EMPTY CONTENT STYLES */
.empty-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
  color: #94a3b8;
}

.empty-content::before {
  content: "📋";
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-content p {
  font-size: 1rem;
  font-weight: 500;
  margin: 0;
}
</style>
