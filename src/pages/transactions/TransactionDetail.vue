<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  BanknotesIcon,
  CreditCardIcon,
  UserIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/vue/24/outline'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import BaseCard from '@/components/ui/BaseCard.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

interface TransactionDetail {
  id: number
  transactionId: string
  type: 'purchase' | 'rental'
  itemTitle: string
  itemId: number
  itemImage?: string
  buyer: {
    id: number
    name: string
    email: string
    phone?: string
    address?: string
  }
  seller: {
    id: number
    name: string
    email: string
    phone?: string
    address?: string
  }
  amount: number
  fee: number
  total: number
  status: 'completed' | 'pending' | 'cancelled' | 'refunded' | 'disputed'
  date: string
  paymentMethod: string
  paymentStatus: 'paid' | 'pending' | 'failed' | 'refunded'
  timeline: Array<{
    date: string
    action: string
    description: string
    user?: string
  }>
  shipping?: {
    carrier: string
    trackingNumber: string
    status: 'pending' | 'in_transit' | 'delivered' | 'returned'
    address: string
  }
  rentalPeriod?: {
    startDate: string
    endDate: string
    securityDeposit: number
    returnStatus?: 'pending' | 'returned' | 'overdue'
  }
}

const router = useRouter()
const route = useRoute()
const loading = ref(true)
const transaction = ref<TransactionDetail | null>(null)

// Mock transaction detail data
const fetchTransaction = async (id: string) => {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    transaction.value = {
      id: Number(id),
      transactionId: 'TXN-2024-001234',
      type: 'purchase',
      itemTitle: 'Premium Wireless Headphones',
      itemId: 1,
      buyer: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St, New York, NY 10001'
      },
      seller: {
        id: 2,
        name: 'Tech Store',
        email: 'tech@example.com',
        phone: '+1 (555) 987-6543',
        address: '456 Business Ave, Los Angeles, CA 90001'
      },
      amount: 299.00,
      fee: 29.90,
      total: 328.90,
      status: 'completed',
      date: '2024-11-20',
      paymentMethod: 'Credit Card •••• 4242',
      paymentStatus: 'paid',
      timeline: [
        {
          date: '2024-11-20 10:00 AM',
          action: 'Transaction Created',
          description: 'Payment initiated by buyer',
          user: 'John Doe'
        },
        {
          date: '2024-11-20 10:05 AM',
          action: 'Payment Received',
          description: 'Payment confirmed and processed',
          user: 'System'
        },
        {
          date: '2024-11-20 11:30 AM',
          action: 'Order Confirmed',
          description: 'Seller confirmed the order',
          user: 'Tech Store'
        },
        {
          date: '2024-11-20 2:00 PM',
          action: 'Shipped',
          description: 'Item shipped via USPS',
          user: 'Tech Store'
        },
        {
          date: '2024-11-22 3:45 PM',
          action: 'Delivered',
          description: 'Package delivered to buyer',
          user: 'USPS'
        },
        {
          date: '2024-11-23 9:00 AM',
          action: 'Completed',
          description: 'Transaction marked as completed',
          user: 'System'
        }
      ],
      shipping: {
        carrier: 'USPS',
        trackingNumber: '9400111899223197428490',
        status: 'delivered',
        address: '123 Main St, New York, NY 10001'
      }
    }
    loading.value = false
  }, 500)
}

const getStatusVariant = (status: string) => {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    completed: 'success',
    pending: 'warning',
    cancelled: 'default',
    refunded: 'info',
    disputed: 'danger'
  }
  return statusMap[status] || 'default'
}

const getPaymentStatusVariant = (status: string) => {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
    paid: 'success',
    pending: 'warning',
    failed: 'danger',
    refunded: 'info'
  }
  return statusMap[status] || 'default'
}

const handleBack = () => {
  router.push('/transactions')
}

const handleRefund = () => {
  router.push(`/transactions/refunds?transaction=${transaction.value?.id}`)
}

const handleDispute = () => {
  router.push(`/transactions/disputes?transaction=${transaction.value?.id}`)
}

const handleUpdateShipping = () => {
  router.push(`/transactions/shipping?transaction=${transaction.value?.id}`)
}

const handleViewItem = () => {
  if (transaction.value) {
    router.push(`/items/${transaction.value.itemId}`)
  }
}

const handleViewBuyer = () => {
  if (transaction.value) {
    router.push(`/users/${transaction.value.buyer.id}`)
  }
}

const handleViewSeller = () => {
  if (transaction.value) {
    router.push(`/users/${transaction.value.seller.id}`)
  }
}

onMounted(() => {
  const id = route.params.id as string
  if (id) {
    fetchTransaction(id)
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-6">
      <BaseButton variant="ghost" size="sm" @click="handleBack" class="mb-4">
        <ArrowLeftIcon class="w-4 h-4 mr-2" />
        Back to Transactions
      </BaseButton>
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Transaction Details
          </h1>
          <p v-if="transaction" class="text-slate-600 dark:text-slate-400">
            {{ transaction.transactionId }}
          </p>
        </div>
        <div v-if="transaction" class="flex gap-2 flex-wrap">
          <BaseBadge :variant="getStatusVariant(transaction.status)" size="lg">
            {{ transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1) }}
          </BaseBadge>
          <BaseButton
            v-if="transaction.status !== 'completed' && transaction.status !== 'cancelled'"
            variant="warning"
            size="sm"
            @click="handleRefund"
          >
            Process Refund
          </BaseButton>
          <BaseButton
            v-if="transaction.status === 'pending'"
            variant="success"
            size="sm"
            @click="handleUpdateShipping"
          >
            Update Shipping
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <SkeletonLoader v-if="loading" variant="list" :count="6" />

    <!-- Transaction Details -->
    <div v-else-if="transaction" class="space-y-6">
      <!-- Main Info Cards -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Payment Summary -->
        <BaseCard class="lg:col-span-1">
          <template #header>
            <div class="flex items-center gap-2">
              <BanknotesIcon class="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Payment Summary</h2>
            </div>
          </template>
          <div class="space-y-4">
            <div class="flex justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-400">Item Amount</span>
              <span class="text-sm font-medium text-slate-900 dark:text-white">
                ${{ transaction.amount.toFixed(2) }}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-sm text-slate-600 dark:text-slate-400">Platform Fee</span>
              <span class="text-sm font-medium text-slate-900 dark:text-white">
                ${{ transaction.fee.toFixed(2) }}
              </span>
            </div>
            <div class="border-t border-slate-200 dark:border-slate-700 pt-4">
              <div class="flex justify-between items-center">
                <span class="text-base font-semibold text-slate-900 dark:text-white">Total</span>
                <span class="text-xl font-bold text-slate-900 dark:text-white">
                  ${{ transaction.total.toFixed(2) }}
                </span>
              </div>
            </div>
            <div class="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-slate-600 dark:text-slate-400">Payment Method</span>
                <CreditCardIcon class="w-4 h-4 text-slate-400" />
              </div>
              <div class="text-sm font-medium text-slate-900 dark:text-white">
                {{ transaction.paymentMethod }}
              </div>
              <div class="mt-2">
                <BaseBadge :variant="getPaymentStatusVariant(transaction.paymentStatus)" size="sm">
                  {{ transaction.paymentStatus.charAt(0).toUpperCase() + transaction.paymentStatus.slice(1) }}
                </BaseBadge>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Buyer & Seller Info -->
        <BaseCard class="lg:col-span-2">
          <template #header>
            <div class="flex items-center gap-2">
              <UserIcon class="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Parties</h2>
            </div>
          </template>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Buyer -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <UserIcon class="w-4 h-4 text-slate-400" />
                <span class="text-sm font-medium text-slate-600 dark:text-slate-400">Buyer</span>
              </div>
              <div class="space-y-2">
                <div class="text-base font-semibold text-slate-900 dark:text-white">
                  {{ transaction.buyer.name }}
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400">
                  {{ transaction.buyer.email }}
                </div>
                <div v-if="transaction.buyer.phone" class="text-sm text-slate-600 dark:text-slate-400">
                  {{ transaction.buyer.phone }}
                </div>
                <BaseButton variant="outline" size="xs" @click="handleViewBuyer">
                  View Profile
                </BaseButton>
              </div>
            </div>

            <!-- Seller -->
            <div>
              <div class="flex items-center gap-2 mb-3">
                <BuildingStorefrontIcon class="w-4 h-4 text-slate-400" />
                <span class="text-sm font-medium text-slate-600 dark:text-slate-400">Seller</span>
              </div>
              <div class="space-y-2">
                <div class="text-base font-semibold text-slate-900 dark:text-white">
                  {{ transaction.seller.name }}
                </div>
                <div class="text-sm text-slate-600 dark:text-slate-400">
                  {{ transaction.seller.email }}
                </div>
                <div v-if="transaction.seller.phone" class="text-sm text-slate-600 dark:text-slate-400">
                  {{ transaction.seller.phone }}
                </div>
                <BaseButton variant="outline" size="xs" @click="handleViewSeller">
                  View Profile
                </BaseButton>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Item & Shipping Info -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Item Details -->
        <BaseCard>
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <DocumentTextIcon class="w-5 h-5 text-slate-600 dark:text-slate-400" />
                <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Item Details</h2>
              </div>
              <BaseButton variant="ghost" size="xs" @click="handleViewItem">
                View Item
              </BaseButton>
            </div>
          </template>
          <div class="space-y-3">
            <div>
              <span class="text-sm text-slate-600 dark:text-slate-400">Item Title</span>
              <div class="text-base font-medium text-slate-900 dark:text-white mt-1">
                {{ transaction.itemTitle }}
              </div>
            </div>
            <div>
              <span class="text-sm text-slate-600 dark:text-slate-400">Transaction Type</span>
              <div class="mt-1">
                <BaseBadge :variant="transaction.type === 'purchase' ? 'primary' : 'info'" size="sm">
                  {{ transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1) }}
                </BaseBadge>
              </div>
            </div>
            <div>
              <span class="text-sm text-slate-600 dark:text-slate-400">Transaction Date</span>
              <div class="text-base text-slate-900 dark:text-white mt-1">
                {{ transaction.date }}
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Shipping/Rental Info -->
        <BaseCard v-if="transaction.shipping || transaction.rentalPeriod">
          <template #header>
            <div class="flex items-center gap-2">
              <TruckIcon v-if="transaction.shipping" class="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <CalendarIcon v-else class="w-5 h-5 text-slate-600 dark:text-slate-400" />
              <h2 class="text-lg font-semibold text-slate-900 dark:text-white">
                {{ transaction.shipping ? 'Shipping Info' : 'Rental Period' }}
              </h2>
            </div>
          </template>
          <div v-if="transaction.shipping" class="space-y-3">
            <div>
              <span class="text-sm text-slate-600 dark:text-slate-400">Carrier</span>
              <div class="text-base font-medium text-slate-900 dark:text-white mt-1">
                {{ transaction.shipping.carrier }}
              </div>
            </div>
            <div>
              <span class="text-sm text-slate-600 dark:text-slate-400">Tracking Number</span>
              <div class="text-base font-medium text-slate-900 dark:text-white mt-1 font-mono">
                {{ transaction.shipping.trackingNumber }}
              </div>
            </div>
            <div>
              <span class="text-sm text-slate-600 dark:text-slate-400">Status</span>
              <div class="mt-1">
                <BaseBadge
                  :variant="
                    transaction.shipping.status === 'delivered'
                      ? 'success'
                      : transaction.shipping.status === 'in_transit'
                      ? 'info'
                      : transaction.shipping.status === 'returned'
                      ? 'warning'
                      : 'default'
                  "
                  size="sm"
                >
                  {{ transaction.shipping.status.replace('_', ' ').charAt(0).toUpperCase() + transaction.shipping.status.replace('_', ' ').slice(1) }}
                </BaseBadge>
              </div>
            </div>
            <div>
              <span class="text-sm text-slate-600 dark:text-slate-400">Delivery Address</span>
              <div class="text-sm text-slate-900 dark:text-white mt-1">
                {{ transaction.shipping.address }}
              </div>
            </div>
          </div>
          <div v-else-if="transaction.rentalPeriod" class="space-y-3">
            <div>
              <span class="text-sm text-slate-600 dark:text-slate-400">Start Date</span>
              <div class="text-base font-medium text-slate-900 dark:text-white mt-1">
                {{ transaction.rentalPeriod.startDate }}
              </div>
            </div>
            <div>
              <span class="text-sm text-slate-600 dark:text-slate-400">End Date</span>
              <div class="text-base font-medium text-slate-900 dark:text-white mt-1">
                {{ transaction.rentalPeriod.endDate }}
              </div>
            </div>
            <div>
              <span class="text-sm text-slate-600 dark:text-slate-400">Security Deposit</span>
              <div class="text-base font-medium text-slate-900 dark:text-white mt-1">
                ${{ transaction.rentalPeriod.securityDeposit.toFixed(2) }}
              </div>
            </div>
            <div v-if="transaction.rentalPeriod.returnStatus">
              <span class="text-sm text-slate-600 dark:text-slate-400">Return Status</span>
              <div class="mt-1">
                <BaseBadge
                  :variant="
                    transaction.rentalPeriod.returnStatus === 'returned'
                      ? 'success'
                      : transaction.rentalPeriod.returnStatus === 'overdue'
                      ? 'danger'
                      : 'warning'
                  "
                  size="sm"
                >
                  {{ transaction.rentalPeriod.returnStatus.charAt(0).toUpperCase() + transaction.rentalPeriod.returnStatus.slice(1) }}
                </BaseBadge>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>

      <!-- Timeline -->
      <BaseCard>
        <template #header>
          <div class="flex items-center gap-2">
            <ClockIcon class="w-5 h-5 text-slate-600 dark:text-slate-400" />
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Transaction Timeline</h2>
          </div>
        </template>
        <div class="space-y-4">
          <div
            v-for="(event, index) in transaction.timeline"
            :key="index"
            class="flex gap-4 pb-4 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0"
          >
            <div class="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between mb-1">
                <div class="text-sm font-semibold text-slate-900 dark:text-white">
                  {{ event.action }}
                </div>
                <div class="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-4">
                  {{ event.date }}
                </div>
              </div>
              <div class="text-sm text-slate-600 dark:text-slate-400">
                {{ event.description }}
              </div>
              <div v-if="event.user" class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                by {{ event.user }}
              </div>
            </div>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      :icon="DocumentTextIcon"
      title="Transaction not found"
      description="The transaction you're looking for doesn't exist or has been removed."
    />
  </div>
</template>