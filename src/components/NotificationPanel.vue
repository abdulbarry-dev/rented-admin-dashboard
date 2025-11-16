<template>
  <transition name="slide">
    <div v-if="open" class="notification-panel">
      <div class="panel-overlay" @click="handleClose"></div>

      <div class="panel-content">
        <div class="panel-header">
          <div class="header-title">
            <BellIcon class="icon" />
            <h2>Notifications</h2>
            <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
          </div>
          <button class="close-btn" @click="handleClose" title="Close">
            <XMarkIcon class="icon" />
          </button>
        </div>

        <div class="panel-tabs">
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'all' }"
            @click="activeTab = 'all'"
          >
            All
          </button>
          <button
            class="tab-btn"
            :class="{ active: activeTab === 'unread' }"
            @click="activeTab = 'unread'"
          >
            Unread
          </button>
        </div>

        <div class="notification-list">
          <div v-if="filteredNotifications.length === 0" class="empty-state">
            <InboxIcon class="empty-icon" />
            <p>No notifications</p>
          </div>

          <div
            v-for="notification in filteredNotifications"
            :key="notification.id"
            class="notification-item"
            :class="{ unread: !notification.read }"
            @click="markAsRead(notification.id)"
          >
            <div class="notification-icon" :class="`type-${notification.type}`">
              <component :is="getNotificationIcon(notification.type)" class="icon" />
            </div>

            <div class="notification-content">
              <p class="notification-message">{{ notification.message }}</p>
              <div class="notification-meta">
                <span class="timestamp">
                  <ClockIcon class="icon" />
                  {{ notification.timestamp }}
                </span>
              </div>
            </div>

            <div v-if="!notification.read" class="unread-indicator"></div>
          </div>
        </div>

        <div class="panel-footer">
          <button class="footer-btn" @click="markAllAsRead">
            <CheckCircleIcon class="icon" />
            Mark all as read
          </button>
          <button class="footer-btn" @click="clearAll">
            <TrashIcon class="icon" />
            Clear all
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Component } from 'vue'
import {
  BellIcon,
  XMarkIcon,
  InboxIcon,
  ClockIcon,
  CheckCircleIcon,
  TrashIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/vue/24/solid'

interface Notification {
  id: number
  message: string
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
}

defineProps<{
  open?: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const activeTab = ref<'all' | 'unread'>('all')

const notifications = ref<Notification[]>([
  {
    id: 1,
    message: 'New user registered: John Doe',
    timestamp: '2 mins ago',
    type: 'info',
    read: false
  },
  {
    id: 2,
    message: 'Verification approved successfully',
    timestamp: '10 mins ago',
    type: 'success',
    read: false
  },
  {
    id: 3,
    message: 'High priority verification pending',
    timestamp: '1 hour ago',
    type: 'warning',
    read: true
  },
  {
    id: 4,
    message: 'Failed login attempt detected',
    timestamp: '2 hours ago',
    type: 'error',
    read: true
  },
  {
    id: 5,
    message: 'New item listing created',
    timestamp: '3 hours ago',
    type: 'info',
    read: true
  }
])

const unreadCount = computed(() =>
  notifications.value.filter(n => !n.read).length
)

const filteredNotifications = computed(() => {
  if (activeTab.value === 'unread') {
    return notifications.value.filter(n => !n.read)
  }
  return notifications.value
})

const handleClose = () => {
  emit('close')
}

const markAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const clearAll = () => {
  notifications.value = []
}

const getNotificationIcon = (type: string): Component => {
  const icons: Record<string, Component> = {
    info: InformationCircleIcon,
    success: CheckCircleIconSolid,
    warning: ExclamationTriangleIcon,
    error: XCircleIcon
  }
  return icons[type] || BellIcon
}
</script>

<style scoped>
.notification-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.panel-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(2px);
  cursor: pointer;
}

.panel-content {
  position: relative;
  width: 100%;
  max-width: 400px;
  background: white;
  box-shadow: -4px 0 24px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  z-index: 1;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 1.25rem;
  border-bottom: 1px solid #e2e8f0;
  background: white;
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-title .icon {
  width: 20px;
  height: 20px;
  color: #3b82f6;
  stroke-width: 2;
}

.header-title h2 {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

.unread-badge {
  background: #ef4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.125rem 0.5rem;
  border-radius: 12px;
  min-width: 20px;
  text-align: center;
}

.close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.close-btn .icon {
  width: 20px;
  height: 20px;
  stroke-width: 2;
}

.panel-tabs {
  display: flex;
  padding: 0.5rem 1.25rem;
  gap: 0.5rem;
  border-bottom: 1px solid #e2e8f0;
  background: #f8fafc;
}

.tab-btn {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-radius: 6px;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: white;
  color: #1e293b;
}

.tab-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.notification-list {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.notification-list::-webkit-scrollbar {
  width: 6px;
}

.notification-list::-webkit-scrollbar-track {
  background: transparent;
}

.notification-list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.notification-list::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  color: #94a3b8;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
  stroke-width: 1.5;
}

.empty-state p {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 0.875rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  border-bottom: 1px solid #f1f5f9;
}

.notification-item:hover {
  background: #f8fafc;
}

.notification-item.unread {
  background: #eff6ff;
}

.notification-item.unread:hover {
  background: #dbeafe;
}

.notification-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.notification-icon .icon {
  width: 18px;
  height: 18px;
  stroke-width: 2;
}

.notification-icon.type-info {
  background: #dbeafe;
  color: #3b82f6;
}

.notification-icon.type-success {
  background: #dcfce7;
  color: #22c55e;
}

.notification-icon.type-warning {
  background: #fef3c7;
  color: #f59e0b;
}

.notification-icon.type-error {
  background: #fee2e2;
  color: #ef4444;
}

.notification-content {
  flex: 1;
  min-width: 0;
}

.notification-message {
  margin: 0 0 0.375rem 0;
  font-size: 0.875rem;
  color: #1e293b;
  line-height: 1.5;
}

.notification-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.timestamp {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #64748b;
}

.timestamp .icon {
  width: 12px;
  height: 12px;
  stroke-width: 2;
}

.unread-indicator {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 0.5rem;
}

.panel-footer {
  display: flex;
  gap: 0.5rem;
  padding: 1rem 1.25rem;
  border-top: 1px solid #e2e8f0;
  background: #f8fafc;
}

.footer-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  color: #64748b;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.footer-btn:hover {
  background: #f1f5f9;
  color: #1e293b;
  border-color: #cbd5e1;
}

.footer-btn .icon {
  width: 16px;
  height: 16px;
  stroke-width: 2;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-active .panel-content,
.slide-leave-active .panel-content {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-active .panel-overlay,
.slide-leave-active .panel-overlay {
  transition: opacity 0.3s ease;
}

.slide-enter-from .panel-overlay,
.slide-leave-to .panel-overlay {
  opacity: 0;
}

.slide-enter-from .panel-content,
.slide-leave-to .panel-content {
  transform: translateX(100%);
}

/* Tablet styles */
@media (max-width: 1024px) {
  .panel-content {
    max-width: 380px;
  }
}

/* Mobile styles */
@media (max-width: 768px) {
  .panel-content {
    max-width: 100%;
  }

  .panel-header {
    padding: 1.25rem 1rem;
  }

  .header-title h2 {
    font-size: 1rem;
  }

  .panel-tabs {
    padding: 0.5rem 1rem;
  }

  .notification-item {
    padding: 0.875rem 1rem;
  }

  .notification-icon {
    width: 32px;
    height: 32px;
  }

  .notification-icon .icon {
    width: 16px;
    height: 16px;
  }

  .notification-message {
    font-size: 0.8125rem;
  }

  .panel-footer {
    padding: 0.875rem 1rem;
    flex-direction: column;
  }

  .footer-btn {
    width: 100%;
  }
}
</style>
