<template>
  <header class="app-header">
    <div class="header-left">
      <button class="mobile-menu-btn" @click="handleToggleMobileMenu">
        <Bars3Icon class="icon" />
      </button>

      <!-- Search Bar -->
      <div class="search-wrapper">
        <MagnifyingGlassIcon class="search-icon" />
        <input
          type="text"
          class="search-input"
          placeholder="Search..."
          v-model="searchQuery"
        />
        <kbd class="search-kbd">⌘K</kbd>
      </div>
    </div>

    <div class="header-right">
      <!-- Theme Toggle -->
      <button class="icon-btn theme-btn" @click="toggleTheme" :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
        <MoonIcon v-if="!isDark" class="icon" />
        <SunIcon v-else class="icon" />
      </button>

      <!-- Notification Button -->
      <button class="icon-btn notification-btn" @click="handleOpenNotifications" title="Notifications">
        <BellIcon class="icon" />
        <span v-if="notificationsCount && notificationsCount > 0" class="badge">{{ notificationsCount }}</span>
      </button>

      <!-- User Menu -->
      <div class="user-menu" @click="toggleUserDropdown">
        <div class="user-avatar">
          <img
            v-if="user?.avatar && !avatarError"
            :src="user.avatar"
            :alt="user.name"
            @error="handleAvatarError"
          />
          <UserCircleIcon v-else class="avatar-icon" />
        </div>
        <div class="user-info">
          <span class="username">{{ user?.name || 'Admin User' }}</span>
          <span class="user-role">{{ user?.role || 'Administrator' }}</span>
        </div>
        <ChevronDownIcon class="dropdown-icon" :class="{ rotated: showUserDropdown }" />

        <!-- User Dropdown Menu -->
        <transition name="dropdown">
          <div v-if="showUserDropdown" class="user-dropdown">
            <div class="dropdown-header">
              <div class="dropdown-user-info">
                <div class="dropdown-avatar">
                  <img
                    v-if="user?.avatar && !dropdownAvatarError"
                    :src="user.avatar"
                    :alt="user.name"
                    @error="handleDropdownAvatarError"
                  />
                  <UserCircleIcon v-else class="dropdown-avatar-icon" />
                </div>
                <div class="dropdown-details">
                  <p class="dropdown-name">{{ user?.name || 'Admin User' }}</p>
                  <p class="dropdown-email">admin@rented.com</p>
                </div>
              </div>
            </div>

            <div class="dropdown-divider"></div>

            <nav class="dropdown-nav">
              <a href="/profile" class="dropdown-item">
                <UserCircleIcon class="icon" />
                <span>My Profile</span>
              </a>
              <a href="/settings" class="dropdown-item">
                <Cog6ToothIcon class="icon" />
                <span>Settings</span>
              </a>
              <a href="/settings/notifications" class="dropdown-item">
                <BellIcon class="icon" />
                <span>Notifications</span>
              </a>
              <a href="/help" class="dropdown-item">
                <QuestionMarkCircleIcon class="icon" />
                <span>Help & Support</span>
              </a>
            </nav>

            <div class="dropdown-divider"></div>

            <button class="dropdown-item logout-btn" @click="handleLogout">
              <ArrowRightOnRectangleIcon class="icon" />
              <span>Logout</span>
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme'
import {
  BellIcon,
  Bars3Icon,
  ChevronDownIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  SunIcon
} from '@heroicons/vue/24/outline'

interface User {
  name: string
  avatar?: string
  role: string
}

defineProps<{
  user?: User
  notificationsCount?: number
}>()

const emit = defineEmits<{
  'open-notifications': []
  'toggle-mobile-menu': []
}>()

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
const { toggleTheme: toggleThemeStore } = themeStore

const showUserDropdown = ref(false)
const searchQuery = ref('')
const avatarError = ref(false)
const dropdownAvatarError = ref(false)

const toggleTheme = () => {
  toggleThemeStore()
}

const handleAvatarError = () => {
  avatarError.value = true
}

const handleDropdownAvatarError = () => {
  dropdownAvatarError.value = true
}

const handleOpenNotifications = () => {
  emit('open-notifications')
}

const handleToggleMobileMenu = () => {
  emit('toggle-mobile-menu')
}

const toggleUserDropdown = () => {
  showUserDropdown.value = !showUserDropdown.value
}

const handleLogout = () => {
  // Handle logout logic
  console.log('Logging out...')
  showUserDropdown.value = false
}

// Close dropdown when clicking outside
if (typeof window !== 'undefined') {
  window.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    if (!target.closest('.user-menu')) {
      showUserDropdown.value = false
    }
  })
}
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.875rem 1.5rem;
  background: var(--header-bg);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
  height: 73px;
  box-sizing: border-box;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  max-width: 600px;
  min-width: 0; /* Allow flex shrinking */
}

.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-menu-btn:hover {
  background: var(--bg-color);
  color: var(--text-primary);
}

.mobile-menu-btn .icon {
  width: 24px;
  height: 24px;
  stroke-width: 2;
}

/* Search Bar */
.search-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  max-width: 500px;
  min-width: 0; /* Allow flex shrinking */
}

.search-icon {
  position: absolute;
  left: 1rem;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  stroke-width: 2;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.625rem 3rem 0.625rem 2.75rem;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  color: var(--text-primary);
  transition: all 0.2s ease;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-input:focus {
  background: var(--bg-secondary);
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-kbd {
  position: absolute;
  right: 0.75rem;
  padding: 0.25rem 0.5rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-family: monospace;
  pointer-events: none;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-color);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn .icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.icon-btn:hover {
  background: var(--bg-secondary);
  border-color: var(--text-muted);
  color: var(--text-primary);
}

.notification-btn .badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-color);
  color: white;
  border-radius: 9px;
  font-size: 0.625rem;
  font-weight: 600;
  border: 2px solid var(--header-bg);
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.375rem 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.user-menu:hover {
  background: var(--bg-color);
  border-color: var(--border-color);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  background: var(--sidebar-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--border-color);
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-icon {
  width: 100%;
  height: 100%;
  color: var(--text-muted);
  stroke-width: 1.5;
  transition: color 0.3s ease;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.username {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.2;
}

.user-role {
  font-size: 0.6875rem;
  color: var(--text-secondary);
  line-height: 1.2;
}

.dropdown-icon {
  width: 16px;
  height: 16px;
  color: var(--text-muted);
  stroke-width: 2;
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

.dropdown-icon.rotated {
  transform: rotate(180deg);
}

/* User Dropdown Menu */
.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 280px;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  z-index: 1000;
  overflow: hidden;
}

.dropdown-header {
  padding: 1.25rem;
  background: var(--primary-color);
}

.dropdown-user-info {
  display: flex;
  align-items: center;
  gap: 0.875rem;
}

.dropdown-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.dropdown-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.dropdown-avatar-icon {
  width: 100%;
  height: 100%;
  color: white;
  stroke-width: 1.5;
}

.dropdown-details {
  flex: 1;
  min-width: 0;
}

.dropdown-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-email {
  font-size: 0.8125rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0;
}

.dropdown-nav {
  padding: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.75rem 1rem;
  width: 100%;
  background: transparent;
  border: none;
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: var(--bg-color);
  color: var(--text-primary);
}

.dropdown-item .icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
  flex-shrink: 0;
}

.logout-btn {
  margin: 0.5rem;
  color: #ef4444;
}

.logout-btn:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* Dropdown Animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top right;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}

/* Tablet styles */
@media (max-width: 1024px) {
  .app-header {
    padding: 0.75rem 1.25rem;
    height: 64px;
  }

  .header-left {
    gap: 0.75rem;
    max-width: 450px;
  }

  .search-wrapper {
    max-width: 320px;
  }

  .search-input {
    padding: 0.5rem 2.5rem 0.5rem 2.5rem;
    font-size: 0.8125rem;
  }

  .search-icon {
    left: 0.75rem;
    width: 16px;
    height: 16px;
  }

  .header-right {
    gap: 0.5rem;
  }

  .icon-btn {
    width: 36px;
    height: 36px;
  }

  .icon-btn .icon {
    width: 16px;
    height: 16px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
  }

  .user-info {
    gap: 0.125rem;
  }

  .username {
    font-size: 0.75rem;
  }

  .user-role {
    font-size: 0.625rem;
  }

  .dropdown-icon {
    width: 14px;
    height: 14px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .app-header {
    padding: 0.625rem 0.875rem;
    height: 56px;
  }

  .header-left {
    gap: 0.5rem;
    max-width: none;
  }

  .mobile-menu-btn {
    display: flex;
    width: 36px;
    height: 36px;
    margin-right: 0.25rem;
  }

  .mobile-menu-btn .icon {
    width: 20px;
    height: 20px;
  }

  .search-wrapper {
    max-width: 100%;
  }

  .search-input {
    font-size: 0.8125rem;
    padding: 0.5rem 0.75rem 0.5rem 2.25rem;
  }

  .search-icon {
    left: 0.625rem;
    width: 15px;
    height: 15px;
  }

  .search-kbd {
    display: none;
  }

  .header-right {
    gap: 0.375rem;
  }

  .icon-btn {
    width: 36px;
    height: 36px;
  }

  .icon-btn .icon {
    width: 16px;
    height: 16px;
  }

  .notification-btn .badge {
    min-width: 16px;
    height: 16px;
    font-size: 0.5625rem;
    top: -3px;
    right: -3px;
  }

  .user-menu {
    padding: 0.25rem;
    gap: 0;
  }

  .user-info {
    display: none;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-width: 1.5px;
  }

  .dropdown-icon {
    display: none;
  }

  .user-dropdown {
    width: calc(100vw - 2rem);
    right: -0.5rem;
    max-width: 320px;
  }

  .dropdown-header {
    padding: 1rem;
  }

  .dropdown-avatar {
    width: 40px;
    height: 40px;
  }

  .dropdown-name {
    font-size: 0.875rem;
  }

  .dropdown-email {
    font-size: 0.75rem;
  }

  .dropdown-item {
    padding: 0.625rem 0.875rem;
    font-size: 0.8125rem;
  }

  .dropdown-item .icon {
    width: 18px;
    height: 18px;
  }
}

/* Small mobile screens */
@media (max-width: 480px) {
  .app-header {
    padding: 0.5rem 0.75rem;
  }

  .header-left {
    gap: 0.375rem;
  }

  .mobile-menu-btn {
    width: 32px;
    height: 32px;
    margin-right: 0;
  }

  .search-input {
    font-size: 0.75rem;
    padding: 0.5rem 0.625rem 0.5rem 2rem;
  }

  .search-icon {
    left: 0.5rem;
    width: 14px;
    height: 14px;
  }

  .header-right {
    gap: 0.25rem;
  }

  .icon-btn {
    width: 32px;
    height: 32px;
  }

  .icon-btn .icon {
    width: 15px;
    height: 15px;
  }

  .user-avatar {
    width: 28px;
    height: 28px;
  }
}
</style>
