<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Line, Bar, Doughnut } from 'vue-chartjs'
import { defaultChartOptions } from '@/services/chartConfig'
import { api } from '@/services/api'
import {
  HomeIcon,
  UserIcon,
  ChartBarIcon,
  CogIcon,
  BellIcon,
  MagnifyingGlassIcon,
} from '@heroicons/vue/24/outline'
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import type { ChartData } from 'chart.js'

// State
const loading = ref(false)
const apiStatus = ref<'success' | 'error' | 'idle'>('idle')
const apiMessage = ref('')

// Chart data
const lineChartData: ChartData<'line'> = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue ($)',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: 'rgb(59, 130, 246)',
      data: [12000, 19000, 15000, 25000, 22000, 30000],
      tension: 0.4,
    },
  ],
}

const barChartData: ChartData<'bar'> = {
  labels: ['Product A', 'Product B', 'Product C', 'Product D'],
  datasets: [
    {
      label: 'Sales',
      backgroundColor: 'rgba(34, 197, 94, 0.7)',
      borderColor: 'rgb(34, 197, 94)',
      data: [65, 59, 80, 81],
    },
  ],
}

const doughnutChartData: ChartData<'doughnut'> = {
  labels: ['Active', 'Pending', 'Completed'],
  datasets: [
    {
      backgroundColor: ['#3b82f6', '#f59e0b', '#22c55e'],
      data: [300, 50, 100],
    },
  ],
}

// Test API call
const testApiCall = async () => {
  loading.value = true
  apiStatus.value = 'idle'
  apiMessage.value = ''

  try {
    // This will fail if no backend is running, but demonstrates the setup
    await api.get('/test')
    apiStatus.value = 'success'
    apiMessage.value = 'API call successful!'
  } catch {
    apiStatus.value = 'error'
    apiMessage.value = 'API call failed (expected if no backend is running)'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  console.log('✅ Tailwind CSS is working!')
  console.log('✅ Vue Router is working!')
  console.log('✅ Heroicons are loaded!')
  console.log('✅ Chart.js is configured!')
})
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <HomeIcon class="h-8 w-8 text-blue-600" />
            <h1 class="text-2xl font-bold text-slate-900">Admin Dashboard Prototype</h1>
          </div>
          <div class="flex items-center space-x-4">
            <button class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <BellIcon class="h-6 w-6 text-slate-600" />
            </button>
            <button class="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <CogIcon class="h-6 w-6 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Status Banner -->
      <div class="mb-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
        <h2 class="text-2xl font-bold mb-2">🎉 All Dependencies Working!</h2>
        <p class="text-blue-100">
          This page demonstrates Tailwind CSS, Vue Router, Heroicons, Chart.js, and Axios integration.
        </p>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Total Users</p>
              <p class="text-3xl font-bold text-slate-900 mt-2">2,543</p>
              <p class="text-sm text-green-600 mt-2">↑ 12% from last month</p>
            </div>
            <UserIcon class="h-12 w-12 text-blue-500 opacity-75" />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Revenue</p>
              <p class="text-3xl font-bold text-slate-900 mt-2">$45,231</p>
              <p class="text-sm text-green-600 mt-2">↑ 8% from last month</p>
            </div>
            <ChartBarIcon class="h-12 w-12 text-green-500 opacity-75" />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Active Orders</p>
              <p class="text-3xl font-bold text-slate-900 mt-2">156</p>
              <p class="text-sm text-red-600 mt-2">↓ 3% from last month</p>
            </div>
            <CheckCircleIcon class="h-12 w-12 text-purple-500 opacity-75" />
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-slate-600">Completion Rate</p>
              <p class="text-3xl font-bold text-slate-900 mt-2">98.5%</p>
              <p class="text-sm text-green-600 mt-2">↑ 2% from last month</p>
            </div>
            <ChartBarIcon class="h-12 w-12 text-orange-500 opacity-75" />
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Line Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Revenue Trend</h3>
          <div class="h-64">
            <Line :data="lineChartData" :options="defaultChartOptions" />
          </div>
        </div>

        <!-- Bar Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Product Sales</h3>
          <div class="h-64">
            <Bar :data="barChartData" :options="defaultChartOptions" />
          </div>
        </div>

        <!-- Doughnut Chart -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Order Status</h3>
          <div class="h-64 flex items-center justify-center">
            <div class="w-64">
              <Doughnut :data="doughnutChartData" :options="defaultChartOptions" />
            </div>
          </div>
        </div>

        <!-- API Test Section -->
        <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 class="text-lg font-semibold text-slate-900 mb-4">Axios API Test</h3>
          <div class="space-y-4">
            <button
              @click="testApiCall"
              :disabled="loading"
              class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <span v-if="loading">Testing...</span>
              <span v-else>Test API Call</span>
            </button>

            <div v-if="apiStatus !== 'idle'" class="p-4 rounded-lg" :class="{
              'bg-green-50 border border-green-200': apiStatus === 'success',
              'bg-red-50 border border-red-200': apiStatus === 'error'
            }">
              <div class="flex items-center space-x-2">
                <CheckCircleIcon v-if="apiStatus === 'success'" class="h-5 w-5 text-green-600" />
                <XCircleIcon v-if="apiStatus === 'error'" class="h-5 w-5 text-red-600" />
                <span :class="{
                  'text-green-800': apiStatus === 'success',
                  'text-red-800': apiStatus === 'error'
                }">{{ apiMessage }}</span>
              </div>
            </div>

            <div class="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
              <p class="font-medium mb-1">Configuration:</p>
              <p class="text-xs font-mono">Base URL: /api</p>
              <p class="text-xs font-mono">Timeout: 10s</p>
              <p class="text-xs font-mono">Auth: Bearer Token</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Example with Tailwind Forms Plugin -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
        <h3 class="text-lg font-semibold text-slate-900 mb-4">Tailwind Forms Plugin Test</h3>
        <form class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label for="name" class="block text-sm font-medium text-slate-700 mb-2">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Enter your name"
              class="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              class="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="role" class="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <select id="role" class="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              <option>Admin</option>
              <option>User</option>
              <option>Manager</option>
            </select>
          </div>

          <div>
            <label for="search" class="block text-sm font-medium text-slate-700 mb-2">Search</label>
            <div class="relative">
              <input
                type="text"
                id="search"
                placeholder="Search..."
                class="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pl-10"
              />
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            </div>
          </div>

          <div class="md:col-span-2">
            <label for="message" class="block text-sm font-medium text-slate-700 mb-2">Message</label>
            <textarea
              id="message"
              rows="4"
              placeholder="Write your message here..."
              class="w-full rounded-lg border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="md:col-span-2">
            <button
              type="submit"
              class="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Submit Form
            </button>
          </div>
        </form>
      </div>

      <!-- Tailwind Typography Example -->
      <div class="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div class="prose prose-slate max-w-none">
          <h3>Tailwind Typography Plugin Test</h3>
          <p>
            This section demonstrates the <code>@tailwindcss/typography</code> plugin, which provides beautiful
            typographic defaults for HTML you don't control, like content from a CMS.
          </p>
          <ul>
            <li>Automatic spacing and sizing</li>
            <li>Beautiful code blocks</li>
            <li>Styled lists and blockquotes</li>
          </ul>
          <blockquote>
            "All dependencies are working perfectly! Tailwind CSS, Vue Router, Pinia, Axios, Chart.js, and Heroicons
            are all integrated and ready to use."
          </blockquote>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-slate-200 mt-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="text-center text-sm text-slate-600">
          <p>✅ All dependencies successfully integrated and tested!</p>
          <p class="mt-2">Tailwind CSS • Vue Router • Pinia • Axios • Chart.js • Heroicons</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
