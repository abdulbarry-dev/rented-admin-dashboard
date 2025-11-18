<script setup lang="ts">
import { computed } from 'vue'
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  CheckBadgeIcon
} from '@heroicons/vue/24/outline'

export interface User {
  id: string | number
  name: string
  email: string
  phone?: string
  avatar?: string
  role: 'super_admin' | 'admin' | 'vendor' | 'customer' | 'support_agent'
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  verified: boolean
  location?: string
  joinDate: string
  lastActive?: string
}

interface Props {
  user: User
  compact?: boolean
  showActions?: boolean
}

interface Emits {
  (e: 'view', userId: string | number): void
  (e: 'edit', userId: string | number): void
  (e: 'message', userId: string | number): void
  (e: 'suspend', userId: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  compact: false,
  showActions: true
})

const emit = defineEmits<Emits>()

const roleColors = {
  super_admin: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
  admin: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300',
  vendor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
  customer: 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-300',
  support_agent: 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300'
}

const statusColors = {
  active: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
  inactive: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400',
  suspended: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
}

const userInitials = computed(() => {
  return props.user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})
</script>

<template>
  <div
    class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 transition-all duration-200 hover:shadow-lg"
    :class="{ 'p-4': compact }"
  >
    <div class="flex items-start gap-4">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <div
          v-if="user.avatar"
          class="w-16 h-16 rounded-full overflow-hidden"
          :class="{ 'w-12 h-12': compact }"
        >
          <img :src="user.avatar" :alt="user.name" class="w-full h-full object-cover" />
        </div>
        <div
          v-else
          class="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg"
          :class="{ 'w-12 h-12 text-base': compact }"
        >
          {{ userInitials }}
        </div>
      </div>

      <!-- User Info -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2 mb-2">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-lg font-semibold text-slate-900 dark:text-white truncate" :class="{ 'text-base': compact }">
                {{ user.name }}
              </h3>
              <CheckBadgeIcon
                v-if="user.verified"
                class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0"
                :class="{ 'w-4 h-4': compact }"
              />
            </div>
            <div class="flex items-center gap-2 mt-1">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="roleColors[user.role]"
              >
                {{ user.role.replace('_', ' ') }}
              </span>
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                :class="statusColors[user.status]"
              >
                {{ user.status }}
              </span>
            </div>
          </div>
        </div>

        <!-- Contact Info -->
        <div v-if="!compact" class="space-y-1.5 mt-3">
          <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <EnvelopeIcon class="w-4 h-4 flex-shrink-0" />
            <span class="truncate">{{ user.email }}</span>
          </div>
          <div v-if="user.phone" class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <PhoneIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{ user.phone }}</span>
          </div>
          <div v-if="user.location" class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <MapPinIcon class="w-4 h-4 flex-shrink-0" />
            <span>{{ user.location }}</span>
          </div>
          <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <CalendarIcon class="w-4 h-4 flex-shrink-0" />
            <span>Joined {{ user.joinDate }}</span>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="showActions && !compact" class="flex items-center gap-2 mt-4">
          <button
            @click="emit('view', user.id)"
            class="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
          >
            View Profile
          </button>
          <button
            @click="emit('message', user.id)"
            class="px-3 py-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors duration-200"
          >
            Message
          </button>
          <button
            v-if="user.status === 'active'"
            @click="emit('suspend', user.id)"
            class="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
          >
            Suspend
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
