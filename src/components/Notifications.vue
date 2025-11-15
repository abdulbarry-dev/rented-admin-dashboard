<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { XMarkIcon, CheckCircleIcon, ExclamationCircleIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

interface Notification {
  id: number
  title: string
  message: string
  time: string
  read: boolean
  type: 'success' | 'warning' | 'info' | 'error'
}

const emit = defineEmits(['close'])
const isOpen = ref(false)
const notifications = ref<Notification[]>([
  {
    id: 1,
    title: 'New Order Received',
    message: 'Order #1234 has been placed by John Doe',
    time: '5 minutes ago',
    read: false,
    type: 'success'
  },
  {
    id: 2,
    title: 'Low Stock Alert',
    message: 'Product "Wireless Headphones" is running low on stock',
    time: '1 hour ago',
    read: false,
    type: 'warning'
  },
  {
    id: 3,
    title: 'Payment Received',
    message: 'Payment of $299.99 received for order #1233',
    time: '2 hours ago',
    read: true,
    type: 'success'
  },
  {
    id: 4,
    title: 'System Update',
    message: 'A new system update is available for installation',
    time: '3 hours ago',
    read: true,
    type: 'info'
  },
  {
    id: 5,
    title: 'Failed Delivery',
    message: 'Order #1230 delivery attempt failed',
    time: '5 hours ago',
    read: true,
    type: 'error'
  },
])

const unreadCount = ref(notifications.value.filter(n => !n.read).length)

const togglePopup = () => {
  isOpen.value = !isOpen.value
}

const markAsRead = (id: number) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
    updateUnreadCount()
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
  updateUnreadCount()
}

const deleteNotification = (id: number) => {
  notifications.value = notifications.value.filter(n => n.id !== id)
  updateUnreadCount()
}

const updateUnreadCount = () => {
  unreadCount.value = notifications.value.filter(n => !n.read).length
}

const getIcon = (type: string) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon
    case 'error':
    case 'warning':
      return ExclamationCircleIcon
    default:
      return InformationCircleIcon
  }
}

const getIconColor = (type: string) => {
  switch (type) {
    case 'success':
      return 'text-green-500'
    case 'error':
      return 'text-red-500'
    case 'warning':
      return 'text-yellow-500'
    default:
      return 'text-blue-500'
  }
}

// Close popup when clicking outside
const popupRef = ref<HTMLElement | null>(null)
const handleClickOutside = (event: MouseEvent) => {
  if (popupRef.value && !popupRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({ togglePopup })
</script>

<template>
  <div class="relative" ref="popupRef">
    <!-- Notification Bell Button -->
    <button
      @click="togglePopup"
      :class="themeStore.isDark ? 'hover:bg-slate-700' : 'hover:bg-slate-100'"
      class="relative p-2 rounded-lg transition-colors"
    >
      <svg :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-600'" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
      </svg>
      <span
        v-if="unreadCount > 0"
        class="absolute top-1 right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <!-- Notification Popup -->
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        :class="themeStore.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'"
        class="absolute right-0 top-12 w-96 rounded-xl shadow-2xl border z-50"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-4 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-200'">
          <div>
            <h3 class="text-lg font-semibold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Notifications</h3>
            <p class="text-xs mt-0.5" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-500'">You have {{ unreadCount }} unread messages</p>
          </div>
          <button
            v-if="unreadCount > 0"
            @click="markAllAsRead"
            class="text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Mark all as read
          </button>
        </div>

        <!-- Notifications List -->
        <div class="max-h-[400px] overflow-y-auto">
          <div v-if="notifications.length === 0" class="p-8 text-center">
            <svg class="w-16 h-16 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p class="text-slate-500 text-sm">No notifications yet</p>
          </div>

          <div
            v-for="notification in notifications"
            :key="notification.id"
            @click="markAsRead(notification.id)"
            :class="[
              notification.read
                ? themeStore.isDark ? 'bg-slate-800' : 'bg-white'
                : themeStore.isDark ? 'bg-blue-900/30' : 'bg-blue-50',
              themeStore.isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50',
              'border-b transition-colors cursor-pointer'
            ]"
          >
            <div class="p-4 flex gap-3">
              <component
                :is="getIcon(notification.type)"
                :class="getIconColor(notification.type)"
                class="w-6 h-6 flex-shrink-0 mt-0.5"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2">
                  <h4 class="text-sm font-semibold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">
                    {{ notification.title }}
                  </h4>
                  <button
                    @click.stop="deleteNotification(notification.id)"
                    :class="themeStore.isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'"
                    class="transition-colors"
                  >
                    <XMarkIcon class="w-4 h-4" />
                  </button>
                </div>
                <p class="text-sm mt-1" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-600'">{{ notification.message }}</p>
                <div class="flex items-center gap-3 mt-2">
                  <span class="text-xs" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-500'">{{ notification.time }}</span>
                  <span
                    v-if="!notification.read"
                    class="w-2 h-2 bg-blue-600 rounded-full"
                  ></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-3 border-t text-center" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-200'">
          <RouterLink
            to="/notifications"
            @click="isOpen = false"
            :class="themeStore.isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'"
            class="text-sm font-medium"
          >
            View all notifications
          </RouterLink>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
.max-h-\[400px\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-\[400px\]::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.max-h-\[400px\]::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.max-h-\[400px\]::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
