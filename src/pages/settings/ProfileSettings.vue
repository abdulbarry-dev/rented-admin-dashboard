<script setup lang="ts">
import { ref } from 'vue'
import { CameraIcon, KeyIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const profile = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  role: 'Administrator',
  avatar: '',
  bio: 'Experienced marketplace administrator with a passion for e-commerce.',
  timezone: 'America/New_York',
  language: 'en'
})

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleAvatarUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profile.value.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const updateProfile = () => {
  console.log('Profile updated:', profile.value)
  // API call here
}

const updatePassword = () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Passwords do not match!')
    return
  }
  console.log('Password updated')
  // API call here
  passwordForm.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
}

const deactivateAccount = () => {
  if (confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
    console.log('Account deactivated')
    // API call here
  }
}
</script>

<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-bold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Profile & Account</h2>
      <p class="mt-1" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Manage your personal information and account settings</p>
    </div>

    <!-- Profile Information -->
    <div class="rounded-lg shadow-sm border p-6" :class="themeStore.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <h3 class="text-lg font-semibold mb-6" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Profile Information</h3>

      <!-- Avatar Upload -->
      <div class="flex items-center gap-6 mb-6">
        <div class="relative">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
            <img v-if="profile.avatar" :src="profile.avatar" alt="Avatar" class="w-full h-full object-cover" />
            <span v-else>{{ profile.firstName[0] }}{{ profile.lastName[0] }}</span>
          </div>
          <label class="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-slate-50 transition-colors">
            <CameraIcon class="w-4 h-4 text-slate-600" />
            <input type="file" accept="image/*" @change="handleAvatarUpload" class="hidden" />
          </label>
        </div>
        <div>
          <h4 class="font-semibold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">{{ profile.firstName }} {{ profile.lastName }}</h4>
          <p class="text-sm" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">{{ profile.email }}</p>
          <p class="text-xs mt-1" :class="themeStore.isDark ? 'text-slate-500' : 'text-slate-500'">{{ profile.role }}</p>
        </div>
      </div>

      <!-- Form Fields -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">First Name</label>
          <input
            v-model="profile.firstName"
            type="text"
            :class="themeStore.isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">Last Name</label>
          <input
            v-model="profile.lastName"
            type="text"
            :class="themeStore.isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900'"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">Email Address</label>
          <input
            v-model="profile.email"
            type="email"
            :class="themeStore.isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900'"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">Phone Number</label>
          <input
            v-model="profile.phone"
            type="tel"
            :class="themeStore.isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900'"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">Timezone</label>
          <select
            v-model="profile.timezone"
            :class="themeStore.isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="America/New_York">Eastern Time (ET)</option>
            <option value="America/Chicago">Central Time (CT)</option>
            <option value="America/Denver">Mountain Time (MT)</option>
            <option value="America/Los_Angeles">Pacific Time (PT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="Europe/Paris">Paris (CET)</option>
            <option value="Asia/Tokyo">Tokyo (JST)</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">Language</label>
          <select
            v-model="profile.language"
            :class="themeStore.isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300 text-slate-900'"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="ja">Japanese</option>
          </select>
        </div>
      </div>

      <div class="mt-6">
        <label class="block text-sm font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">Bio</label>
        <textarea
          v-model="profile.bio"
          rows="3"
          :class="themeStore.isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900'"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about yourself..."
        ></textarea>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="updateProfile"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>

    <!-- Change Password -->
    <div class="rounded-lg shadow-sm border p-6" :class="themeStore.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'">
      <div class="flex items-center gap-3 mb-6">
        <KeyIcon class="w-6 h-6" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'" />
        <h3 class="text-lg font-semibold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Change Password</h3>
      </div>

      <div class="space-y-4 max-w-md">
        <div>
          <label class="block text-sm font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">Current Password</label>
          <input
            v-model="passwordForm.currentPassword"
            type="password"
            :class="themeStore.isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900'"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">New Password</label>
          <input
            v-model="passwordForm.newPassword"
            type="password"
            :class="themeStore.isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900'"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label class="block text-sm font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">Confirm New Password</label>
          <input
            v-model="passwordForm.confirmPassword"
            type="password"
            :class="themeStore.isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-white border-slate-300 text-slate-900'"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="mt-6">
        <button
          @click="updatePassword"
          class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
        >
          Update Password
        </button>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="rounded-lg shadow-sm border p-6" :class="themeStore.isDark ? 'bg-slate-800 border-red-800' : 'bg-white border-red-200'">
      <div class="flex items-center gap-3 mb-4">
        <TrashIcon class="w-6 h-6 text-red-600" />
        <h3 class="text-lg font-semibold" :class="themeStore.isDark ? 'text-red-400' : 'text-red-900'">Danger Zone</h3>
      </div>
      <p class="text-sm mb-4" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">
        Once you deactivate your account, there is no going back. Please be certain.
      </p>
      <button
        @click="deactivateAccount"
        class="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
      >
        Deactivate Account
      </button>
    </div>
  </div>
</template>
