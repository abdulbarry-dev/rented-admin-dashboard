<script setup lang="ts">
import { ref } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const notificationSettings = ref({
  email: {
    newOrders: true,
    orderUpdates: true,
    newUsers: false,
    lowStock: true,
    systemAlerts: true,
    marketingUpdates: false,
    weeklyReport: true
  },
  push: {
    newOrders: true,
    orderUpdates: false,
    newUsers: false,
    lowStock: true,
    systemAlerts: true
  },
  inApp: {
    newOrders: true,
    orderUpdates: true,
    newUsers: true,
    lowStock: true,
    systemAlerts: true,
    messages: true
  }
})

const notificationFrequency = ref('instant')
const quietHoursEnabled = ref(false)
const quietHours = ref({
  start: '22:00',
  end: '08:00'
})

const saveNotificationSettings = () => {
  console.log('Notification settings saved:', notificationSettings.value)
  // API call here
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Notification Settings</h2>
      <p class="mt-1" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Control how and when you receive notifications</p>
    </div>

    <!-- Email Notifications -->
    <div class="rounded-lg shadow-sm border p-6" :class="themeStore.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <h3 class="text-lg font-semibold mb-6" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Email Notifications</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">New Orders</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Receive notifications when new orders are placed</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.email.newOrders" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Order Updates</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Get notified when order status changes</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.email.orderUpdates" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">New Users</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Alert when new users register</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.email.newUsers" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Low Stock Alerts</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Notify when products are running low</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.email.lowStock" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">System Alerts</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Important system notifications and updates</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.email.systemAlerts" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Marketing Updates</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Promotional emails and feature announcements</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.email.marketingUpdates" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Weekly Report</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Summary of weekly activity and analytics</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.email.weeklyReport" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Push Notifications -->
    <div class="rounded-lg shadow-sm border p-6" :class="themeStore.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <h3 class="text-lg font-semibold mb-6" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Push Notifications</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">New Orders</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Browser push for new orders</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.push.newOrders" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Order Updates</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Status change notifications</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.push.orderUpdates" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Low Stock Alerts</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Inventory warnings</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.push.lowStock" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">System Alerts</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Critical system notifications</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.push.systemAlerts" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- In-App Notifications -->
    <div class="rounded-lg shadow-sm border p-6" :class="themeStore.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <h3 class="text-lg font-semibold mb-6" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">In-App Notifications</h3>
      <div class="space-y-4">
        <div class="flex items-center justify-between py-3 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">New Orders</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Show in notification center</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.inApp.newOrders" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Order Updates</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Activity feed updates</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.inApp.orderUpdates" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-100'">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">New Users</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">User registration alerts</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.inApp.newUsers" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div class="flex items-center justify-between py-3">
          <div>
            <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Messages</p>
            <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Direct messages and replies</p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input v-model="notificationSettings.inApp.messages" type="checkbox" class="sr-only peer" />
            <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>

    <!-- Notification Preferences -->
    <div class="rounded-lg shadow-sm border p-6" :class="themeStore.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <h3 class="text-lg font-semibold mb-6" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Notification Preferences</h3>

      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium mb-3" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">Notification Frequency</label>
          <div class="space-y-3">
            <label class="flex items-start">
              <input
                v-model="notificationFrequency"
                type="radio"
                value="instant"
                class="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 mt-0.5"
              />
              <span class="ml-3">
                <span class="block text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Instant</span>
                <span class="block text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Receive notifications immediately</span>
              </span>
            </label>
            <label class="flex items-start">
              <input
                v-model="notificationFrequency"
                type="radio"
                value="hourly"
                class="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 mt-0.5"
              />
              <span class="ml-3">
                <span class="block text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Hourly Digest</span>
                <span class="block text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Batched notifications every hour</span>
              </span>
            </label>
            <label class="flex items-start">
              <input
                v-model="notificationFrequency"
                type="radio"
                value="daily"
                class="w-4 h-4 text-blue-600 border-slate-300 focus:ring-blue-500 mt-0.5"
              />
              <span class="ml-3">
                <span class="block text-sm font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Daily Summary</span>
                <span class="block text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">One email per day with all updates</span>
              </span>
            </label>
          </div>
        </div>

        <div class="border-t pt-6" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-200'">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Quiet Hours</p>
              <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Pause notifications during specific hours</p>
            </div>
            <label class="relative inline-flex items-center cursor-pointer">
              <input v-model="quietHoursEnabled" type="checkbox" class="sr-only peer" />
              <div class="w-11 h-6 bg-slate-200 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div v-if="quietHoursEnabled" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">Start Time</label>
              <input
                v-model="quietHours.start"
                type="time"
                :class="themeStore.isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">End Time</label>
              <input
                v-model="quietHours.end"
                type="time"
                :class="themeStore.isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
                class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end">
      <button
        @click="saveNotificationSettings"
        class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
      >
        Save Notification Settings
      </button>
    </div>
  </div>
</template>
