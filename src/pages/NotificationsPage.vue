<script setup lang="ts">
import { ref } from 'vue'
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

const notifications = ref<Notification[]>([
  {
    id: 1,
    title: 'New Order Received',
    message: 'Order #1234 has been placed by John Doe. Please review and process the order.',
    time: '5 minutes ago',
    read: false,
    type: 'success'
  },
  {
    id: 2,
    title: 'Low Stock Alert',
    message: 'Product "Wireless Headphones" is running low on stock. Only 5 units remaining.',
    time: '1 hour ago',
    read: false,
    type: 'warning'
  },
  {
    id: 3,
    title: 'Payment Received',
    message: 'Payment of $299.99 received for order #1233 via credit card.',
    time: '2 hours ago',
    read: false,
    type: 'success'
  },
  {
    id: 4,
    title: 'System Update',
    message: 'A new system update is available for installation. Please update at your earliest convenience.',
    time: '3 hours ago',
    read: true,
    type: 'info'
  },
  {
    id: 5,
    title: 'Failed Delivery',
    message: 'Order #1230 delivery attempt failed. Customer was not available at the address.',
    time: '5 hours ago',
    read: true,
    type: 'error'
  },
  {
    id: 6,
    title: 'New User Registration',
    message: 'A new user "Sarah Smith" has registered on your marketplace.',
    time: '6 hours ago',
    read: true,
    type: 'info'
  },
  {
    id: 7,
    title: 'Product Review',
    message: 'New 5-star review received for "Smart Watch Pro".',
    time: '8 hours ago',
    read: true,
    type: 'success'
  },
  {
    id: 8,
    title: 'Refund Request',
    message: 'Customer requested a refund for order #1225. Reason: Product defect.',
    time: '10 hours ago',
    read: true,
    type: 'warning'
  },
  {
    id: 9,
    title: 'Inventory Updated',
    message: 'Inventory has been updated for 15 products. Please review the changes.',
    time: '1 day ago',
    read: true,
    type: 'info'
  },
  {
    id: 10,
    title: 'Monthly Report Ready',
    message: 'Your monthly sales report for October is now available for download.',
    time: '2 days ago',
    read: true,
    type: 'success'
  },
])

const filterType = ref<'all' | 'unread' | 'success' | 'warning' | 'info' | 'error'>('all')

const filteredNotifications = ref(notifications.value)

const filterNotifications = (type: typeof filterType.value) => {
  filterType.value = type
  if (type === 'all') {
    filteredNotifications.value = notifications.value
  } else if (type === 'unread') {
    filteredNotifications.value = notifications.value.filter((n) => !n.read)
  } else {
    filteredNotifications.value = notifications.value.filter((n) => n.type === type)
  }
}

const markAsRead = (id: number) => {
  const notification = notifications.value.find((n) => n.id === id)
  if (notification) {
    notification.read = true
    if (filterType.value === 'unread') {
      filterNotifications('unread')
    }
  }
}

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.read = true))
  if (filterType.value === 'unread') {
    filterNotifications('unread')
  }
}

const deleteNotification = (id: number) => {
  notifications.value = notifications.value.filter((n) => n.id !== id)
  filterNotifications(filterType.value)
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
      return 'text-green-500 bg-green-50'
    case 'error':
      return 'text-red-500 bg-red-50'
    case 'warning':
      return 'text-yellow-500 bg-yellow-50'
    default:
      return 'text-blue-500 bg-blue-50'
  }
}

const unreadCount = ref(notifications.value.filter((n) => !n.read).length)
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Notifications</h1>
        <p class="mt-1" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">
          You have {{ unreadCount }} unread notification{{ unreadCount !== 1 ? 's' : '' }}
        </p>
      </div>
      <button
        v-if="unreadCount > 0"
        @click="markAllAsRead"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
      >
        Mark all as read
      </button>
    </div>

    <!-- Filters -->
    <div class="rounded-lg shadow-sm border p-4" :class="themeStore.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center gap-3 flex-wrap">
        <button
          @click="filterNotifications('all')"
          :class="filterType === 'all' ? 'bg-blue-600 text-white' : themeStore.isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          class="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          All
        </button>
        <button
          @click="filterNotifications('unread')"
          :class="filterType === 'unread' ? 'bg-blue-600 text-white' : themeStore.isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          class="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          Unread
        </button>
        <button
          @click="filterNotifications('success')"
          :class="filterType === 'success' ? 'bg-green-600 text-white' : themeStore.isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          class="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          Success
        </button>
        <button
          @click="filterNotifications('warning')"
          :class="filterType === 'warning' ? 'bg-yellow-600 text-white' : themeStore.isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          class="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          Warnings
        </button>
        <button
          @click="filterNotifications('info')"
          :class="filterType === 'info' ? 'bg-blue-600 text-white' : themeStore.isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          class="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          Info
        </button>
        <button
          @click="filterNotifications('error')"
          :class="filterType === 'error' ? 'bg-red-600 text-white' : themeStore.isDark ? 'bg-slate-700 text-slate-200 hover:bg-slate-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
          class="px-4 py-2 rounded-lg font-medium text-sm transition-colors"
        >
          Errors
        </button>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="rounded-lg shadow-sm border overflow-hidden" :class="themeStore.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <div v-if="filteredNotifications.length === 0" class="p-12 text-center">
        <svg class="w-20 h-20 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
        <p class="text-slate-500 text-lg">No notifications found</p>
        <p class="text-slate-400 text-sm mt-1">Try adjusting your filters</p>
      </div>

      <div
        v-for="notification in filteredNotifications"
        :key="notification.id"
        :class="[
          notification.read
            ? themeStore.isDark ? 'bg-slate-800' : 'bg-white'
            : themeStore.isDark ? 'bg-blue-900/30' : 'bg-blue-50',
          themeStore.isDark ? 'border-slate-700 hover:bg-slate-700/50' : 'border-slate-100 hover:bg-slate-50',
          'border-b transition-colors'
        ]"
      >
        <div class="p-6 flex gap-4">
          <div :class="getIconColor(notification.type)" class="p-3 rounded-full flex-shrink-0 h-fit">
            <component :is="getIcon(notification.type)" class="w-6 h-6" />
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-1">
                  <h4 class="text-base font-semibold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">
                    {{ notification.title }}
                  </h4>
                  <span
                    v-if="!notification.read"
                    class="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"
                  ></span>
                </div>
                <p class="text-sm leading-relaxed" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-600'">{{ notification.message }}</p>
                <div class="flex items-center gap-4 mt-3">
                  <span class="text-xs" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-500'">{{ notification.time }}</span>
                  <span
                    :class="{
                      'text-green-600': notification.type === 'success',
                      'text-red-600': notification.type === 'error',
                      'text-yellow-600': notification.type === 'warning',
                      'text-blue-600': notification.type === 'info'
                    }"
                    class="text-xs font-semibold uppercase"
                  >
                    {{ notification.type }}
                  </span>
                </div>
              </div>

              <div class="flex items-start gap-2">
                <button
                  v-if="!notification.read"
                  @click="markAsRead(notification.id)"
                  class="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Mark as read
                </button>
                <button
                  @click="deleteNotification(notification.id)"
                  :class="themeStore.isDark ? 'text-slate-500 hover:text-red-400 hover:bg-red-900/30' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'"
                  class="p-2 rounded-lg transition-colors"
                >
                  <XMarkIcon class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
