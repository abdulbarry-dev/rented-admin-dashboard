<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  UserGroupIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  UserMinusIcon,
  ArrowDownTrayIcon
} from '@heroicons/vue/24/outline'
import UserStatsCard from '@/components/users/UserStatsCard.vue'
import UserFilters, { type UserFilters as Filters } from '@/components/users/UserFilters.vue'
import UserTable from '@/components/users/UserTable.vue'
import UserActivityChart from '@/components/users/UserActivityChart.vue'
import type { User } from '@/components/users/UserCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 20

// Filters
const filters = ref<Filters>({
  search: '',
  role: '',
  status: '',
  verified: '',
  dateFrom: '',
  dateTo: ''
})

// Mock user data
const allUsers = ref<User[]>([
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    role: 'customer',
    status: 'active',
    verified: true,
    location: 'New York, USA',
    joinDate: '2024-01-15',
    lastActive: '2024-11-14'
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    role: 'vendor',
    status: 'active',
    verified: true,
    location: 'Los Angeles, USA',
    joinDate: '2024-02-20',
    lastActive: '2024-11-16'
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert.j@example.com',
    role: 'customer',
    status: 'inactive',
    verified: false,
    location: 'Chicago, USA',
    joinDate: '2024-03-10',
    lastActive: '2024-10-05'
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '+1 (555) 456-7890',
    role: 'vendor',
    status: 'active',
    verified: true,
    location: 'Miami, USA',
    joinDate: '2024-04-05',
    lastActive: '2024-11-15'
  },
  {
    id: 5,
    name: 'Michael Brown',
    email: 'michael.b@example.com',
    role: 'customer',
    status: 'suspended',
    verified: false,
    location: 'Houston, USA',
    joinDate: '2024-05-12',
    lastActive: '2024-09-20'
  },
  {
    id: 6,
    name: 'Sarah Wilson',
    email: 'sarah.w@example.com',
    phone: '+1 (555) 567-8901',
    role: 'admin',
    status: 'active',
    verified: true,
    location: 'San Francisco, USA',
    joinDate: '2024-01-01',
    lastActive: '2024-11-16'
  },
  {
    id: 7,
    name: 'David Martinez',
    email: 'david.m@example.com',
    role: 'customer',
    status: 'pending',
    verified: false,
    location: 'Phoenix, USA',
    joinDate: '2024-11-10',
    lastActive: '2024-11-12'
  },
  {
    id: 8,
    name: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    phone: '+1 (555) 678-9012',
    role: 'vendor',
    status: 'active',
    verified: true,
    location: 'Seattle, USA',
    joinDate: '2024-06-18',
    lastActive: '2024-11-16'
  }
])

// Filtered users
const filteredUsers = computed(() => {
  let result = [...allUsers.value]

  // Search filter
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    result = result.filter(
      user =>
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.id.toString().includes(search)
    )
  }

  // Role filter
  if (filters.value.role) {
    result = result.filter(user => user.role === filters.value.role)
  }

  // Status filter
  if (filters.value.status) {
    result = result.filter(user => user.status === filters.value.status)
  }

  // Verified filter
  if (filters.value.verified) {
    const isVerified = filters.value.verified === 'true'
    result = result.filter(user => user.verified === isVerified)
  }

  return result
})

// Paginated users
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage))

// Stats
const stats = computed(() => ({
  total: allUsers.value.length,
  active: allUsers.value.filter(u => u.status === 'active').length,
  verified: allUsers.value.filter(u => u.verified).length,
  suspended: allUsers.value.filter(u => u.status === 'suspended').length
}))

// Activity chart data
const activityChartData = computed(() => ({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'New Users',
      data: [12, 19, 15, 25, 22, 18, 14],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    },
    {
      label: 'Active Users',
      data: [145, 167, 159, 178, 192, 186, 174],
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    }
  ]
}))

// Reset page when filters change
watch(filters, () => {
  currentPage.value = 1
}, { deep: true })

// Actions
const clearFilters = () => {
  filters.value = {
    search: '',
    role: '',
    status: '',
    verified: '',
    dateFrom: '',
    dateTo: ''
  }
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleViewUser = (userId: string | number) => {
  router.push(`/users/${userId}`)
}

const handleSuspendUser = (userId: string | number) => {
  console.log('Suspend user:', userId)
  // Implementation for suspend action
}

const handleSelectUser = (userId: string | number) => {
  console.log('Select user:', userId)
  // Implementation for selection
}

const exportUsers = () => {
  console.log('Exporting users...')
  // Implementation for export
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            User Management
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Manage and monitor all platform users
          </p>
        </div>
        <BaseButton variant="ghost" @click="exportUsers">
          <ArrowDownTrayIcon class="w-5 h-5" />
          Export
        </BaseButton>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <UserStatsCard
        label="Total Users"
        :value="stats.total.toLocaleString()"
        :icon="UserGroupIcon"
        color="blue"
        :trend="12.5"
      />
      <UserStatsCard
        label="Active Users"
        :value="stats.active.toLocaleString()"
        :icon="UserPlusIcon"
        color="green"
        :trend="8.3"
      />
      <UserStatsCard
        label="Verified Users"
        :value="stats.verified.toLocaleString()"
        :icon="ShieldCheckIcon"
        color="purple"
        :trend="15.7"
      />
      <UserStatsCard
        label="Suspended Users"
        :value="stats.suspended.toLocaleString()"
        :icon="UserMinusIcon"
        color="red"
        :trend="-5.2"
      />
    </div>

    <!-- Activity Chart -->
    <div class="mb-8">
      <UserActivityChart
        title="User Activity Overview"
        subtitle="New user registrations and active users this week"
        :labels="activityChartData.labels"
        :datasets="activityChartData.datasets"
        :height="300"
      />
    </div>

    <!-- Filters -->
    <div class="mb-6">
      <UserFilters
        v-model="filters"
        :total-results="filteredUsers.length"
        @clear="clearFilters"
      />
    </div>

    <!-- Users Table -->
    <UserTable
      :users="paginatedUsers"
      :loading="loading"
      :current-page="currentPage"
      :total-pages="totalPages"
      @view="handleViewUser"
      @suspend="handleSuspendUser"
      @select="handleSelectUser"
      @page-change="handlePageChange"
    />
  </div>
</template>
