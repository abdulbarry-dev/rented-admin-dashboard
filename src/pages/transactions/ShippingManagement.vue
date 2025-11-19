<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  MapPinIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline'
import ItemStatsCard from '@/components/items/ItemStatsCard.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseBadge from '@/components/ui/BaseBadge.vue'
import EmptyState from '@/components/ui/EmptyState.vue'
import SkeletonLoader from '@/components/ui/SkeletonLoader.vue'

interface Shipment {
  id: number
  transactionId: string
  itemTitle: string
  buyer: {
    id: number
    name: string
    email: string
    address: string
  }
  seller: {
    id: number
    name: string
    email: string
    address: string
  }
  carrier: string
  trackingNumber?: string
  status: 'pending' | 'confirmed' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'lost'
  shippingDate?: string
  estimatedDelivery?: string
  actualDelivery?: string
  address: string
  orderDate: string
}

const router = useRouter()
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 15

// Filters
const searchQuery = ref('')
const selectedStatus = ref<'all' | 'pending' | 'confirmed' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'returned' | 'lost'>('all')
const selectedCarrier = ref<'all' | 'USPS' | 'UPS' | 'FedEx' | 'DHL' | 'Other'>('all')
const sortBy = ref<'newest' | 'oldest' | 'delivery-date'>('newest')

// Mock shipment data
const shipments = ref<Shipment[]>([
  {
    id: 1,
    transactionId: 'TXN-2024-001234',
    itemTitle: 'Premium Wireless Headphones',
    buyer: {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      address: '123 Main St, New York, NY 10001'
    },
    seller: {
      id: 2,
      name: 'Tech Store',
      email: 'tech@example.com',
      address: '456 Business Ave, Los Angeles, CA 90001'
    },
    carrier: 'USPS',
    trackingNumber: '9400111899223197428490',
    status: 'delivered',
    shippingDate: '2024-11-20',
    estimatedDelivery: '2024-11-22',
    actualDelivery: '2024-11-22',
    address: '123 Main St, New York, NY 10001',
    orderDate: '2024-11-20'
  },
  {
    id: 2,
    transactionId: 'TXN-2024-001236',
    itemTitle: 'Designer Leather Jacket',
    buyer: {
      id: 5,
      name: 'Robert Johnson',
      email: 'robert@example.com',
      address: '789 Oak St, Chicago, IL 60601'
    },
    seller: {
      id: 6,
      name: 'Fashion Boutique',
      email: 'fashion@example.com',
      address: '321 Fashion Blvd, Miami, FL 33101'
    },
    carrier: 'FedEx',
    trackingNumber: '123456789012',
    status: 'in_transit',
    shippingDate: '2024-11-19',
    estimatedDelivery: '2024-11-23',
    address: '789 Oak St, Chicago, IL 60601',
    orderDate: '2024-11-19'
  },
  {
    id: 3,
    transactionId: 'TXN-2024-001241',
    itemTitle: 'Electric Guitar with Amp',
    buyer: {
      id: 15,
      name: 'Lisa Anderson',
      email: 'lisa@example.com',
      address: '555 Music St, Nashville, TN 37201'
    },
    seller: {
      id: 16,
      name: 'Music Store',
      email: 'music@example.com',
      address: '789 Sound Ave, Los Angeles, CA 90028'
    },
    carrier: 'UPS',
    trackingNumber: '1Z999AA10123456784',
    status: 'delivered',
    shippingDate: '2024-11-15',
    estimatedDelivery: '2024-11-18',
    actualDelivery: '2024-11-18',
    address: '555 Music St, Nashville, TN 37201',
    orderDate: '2024-11-15'
  },
  {
    id: 4,
    transactionId: 'TXN-2024-001242',
    itemTitle: 'Smart Home Security System',
    buyer: {
      id: 17,
      name: 'Tom Wilson',
      email: 'tom@example.com',
      address: '888 Security Dr, San Francisco, CA 94102'
    },
    seller: {
      id: 18,
      name: 'Home Security Co',
      email: 'security@example.com',
      address: '222 Tech Park, San Jose, CA 95110'
    },
    carrier: 'USPS',
    trackingNumber: '9400111899223197428491',
    status: 'out_for_delivery',
    shippingDate: '2024-11-21',
    estimatedDelivery: '2024-11-23',
    address: '888 Security Dr, San Francisco, CA 94102',
    orderDate: '2024-11-21'
  },
  {
    id: 5,
    transactionId: 'TXN-2024-001243',
    itemTitle: 'Professional Camera Lens',
    buyer: {
      id: 19,
      name: 'Alex Johnson',
      email: 'alex@example.com',
      address: '777 Photo Ave, Seattle, WA 98101'
    },
    seller: {
      id: 20,
      name: 'Photo Rentals',
      email: 'photo@example.com',
      address: '444 Lens St, Portland, OR 97201'
    },
    carrier: 'FedEx',
    trackingNumber: '987654321098',
    status: 'confirmed',
    shippingDate: '2024-11-21',
    estimatedDelivery: '2024-11-24',
    address: '777 Photo Ave, Seattle, WA 98101',
    orderDate: '2024-11-21'
  },
  {
    id: 6,
    transactionId: 'TXN-2024-001245',
    itemTitle: 'Vintage Camera Collection',
    buyer: {
      id: 9,
      name: 'Michael Brown',
      email: 'michael@example.com',
      address: '333 Vintage Ln, Houston, TX 77001'
    },
    seller: {
      id: 10,
      name: 'Antique Dealer',
      email: 'antique@example.com',
      address: '666 History Blvd, Austin, TX 78701'
    },
    carrier: 'DHL',
    trackingNumber: '567890123456',
    status: 'pending',
    address: '333 Vintage Ln, Houston, TX 77001',
    orderDate: '2024-11-17'
  },
  {
    id: 7,
    transactionId: 'TXN-2024-001246',
    itemTitle: 'Gaming Console Bundle',
    buyer: {
      id: 11,
      name: 'Sarah Wilson',
      email: 'sarah@example.com',
      address: '999 Game St, Austin, TX 78701'
    },
    seller: {
      id: 12,
      name: 'Game Zone',
      email: 'game@example.com',
      address: '111 Console Rd, Dallas, TX 75201'
    },
    carrier: 'UPS',
    trackingNumber: '1Z888AA10987654321',
    status: 'returned',
    shippingDate: '2024-11-16',
    estimatedDelivery: '2024-11-19',
    actualDelivery: '2024-11-19',
    address: '999 Game St, Austin, TX 78701',
    orderDate: '2024-11-16'
  }
])

// Filtered shipments
const filteredShipments = computed(() => {
  let result = [...shipments.value]

  // Search filter
  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(
      s =>
        s.transactionId.toLowerCase().includes(search) ||
        s.itemTitle.toLowerCase().includes(search) ||
        s.buyer.name.toLowerCase().includes(search) ||
        s.seller.name.toLowerCase().includes(search) ||
        s.trackingNumber?.toLowerCase().includes(search) ||
        s.carrier.toLowerCase().includes(search)
    )
  }

  // Status filter
  if (selectedStatus.value !== 'all') {
    result = result.filter(s => s.status === selectedStatus.value)
  }

  // Carrier filter
  if (selectedCarrier.value !== 'all') {
    result = result.filter(s => s.carrier === selectedCarrier.value)
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'newest':
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
      case 'oldest':
        return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime()
      case 'delivery-date':
        const dateA = a.estimatedDelivery ? new Date(a.estimatedDelivery).getTime() : 0
        const dateB = b.estimatedDelivery ? new Date(b.estimatedDelivery).getTime() : 0
        return dateA - dateB
      default:
        return 0
    }
  })

  return result
})

// Paginated shipments
const paginatedShipments = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredShipments.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredShipments.value.length / itemsPerPage))

// Stats
const stats = computed(() => ({
  total: shipments.value.length,
  pending: shipments.value.filter(s => s.status === 'pending' || s.status === 'confirmed').length,
  inTransit: shipments.value.filter(s => s.status === 'in_transit' || s.status === 'out_for_delivery').length,
  delivered: shipments.value.filter(s => s.status === 'delivered').length,
  issues: shipments.value.filter(s => s.status === 'returned' || s.status === 'lost').length
}))

// Status variant
const getStatusVariant = (status: string) => {
  const statusMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'default'> = {
    pending: 'warning',
    confirmed: 'info',
    in_transit: 'info',
    out_for_delivery: 'info',
    delivered: 'success',
    returned: 'warning',
    lost: 'danger'
  }
  return statusMap[status] || 'default'
}

const getStatusLabel = (status: string) => {
  const labelMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_transit: 'In Transit',
    out_for_delivery: 'Out for Delivery',
    delivered: 'Delivered',
    returned: 'Returned',
    lost: 'Lost'
  }
  return labelMap[status] || status
}

// Reset page when filters change
watch([searchQuery, selectedStatus, selectedCarrier, sortBy], () => {
  currentPage.value = 1
})

// Actions
const handleViewDetail = (transactionId: string) => {
  router.push(`/transactions/${transactionId}`)
}

const handleUpdateTracking = (shipmentId: number) => {
  console.log('Update tracking for shipment:', shipmentId)
  // Open modal or navigate to update form
}

const handleMarkDelivered = (shipmentId: number) => {
  const shipment = shipments.value.find(s => s.id === shipmentId)
  if (shipment) {
    shipment.status = 'delivered'
    shipment.actualDelivery = new Date().toISOString().split('T')[0]
  }
}

const handleExport = () => {
  console.log('Exporting shipments...')
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedCarrier.value = 'all'
  sortBy.value = 'newest'
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Shipping Management
          </h1>
          <p class="text-slate-600 dark:text-slate-400">
            Track and manage shipping for all orders
          </p>
        </div>
        <BaseButton variant="ghost" @click="handleExport">
          <ArrowDownTrayIcon class="w-5 h-5" />
          Export
        </BaseButton>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <ItemStatsCard
        label="Total Shipments"
        :value="stats.total.toLocaleString()"
        :icon="TruckIcon"
        color="blue"
      />
      <ItemStatsCard
        label="Pending/Confirmed"
        :value="stats.pending.toLocaleString()"
        :icon="ClockIcon"
        color="orange"
      />
      <ItemStatsCard
        label="In Transit"
        :value="stats.inTransit.toLocaleString()"
        :icon="TruckIcon"
        color="purple"
      />
      <ItemStatsCard
        label="Delivered"
        :value="stats.delivered.toLocaleString()"
        :icon="CheckCircleIcon"
        color="green"
      />
    </div>

    <!-- Filters -->
    <div class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 md:p-6 mb-6">
      <div class="flex items-center gap-2 mb-4">
        <FunnelIcon class="w-5 h-5 text-slate-600 dark:text-slate-400" />
        <h3 class="font-semibold text-slate-900 dark:text-white">Filters</h3>
      </div>
      
      <!-- Search Bar -->
      <div class="mb-4">
        <div class="relative">
          <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by transaction ID, item, buyer, seller, carrier, or tracking number..."
            class="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Shipping Status
          </label>
          <select
            v-model="selectedStatus"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="in_transit">In Transit</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <!-- Carrier Filter -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Carrier
          </label>
          <select
            v-model="selectedCarrier"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Carriers</option>
            <option value="USPS">USPS</option>
            <option value="UPS">UPS</option>
            <option value="FedEx">FedEx</option>
            <option value="DHL">DHL</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <!-- Sort -->
        <div>
          <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            Sort By
          </label>
          <select
            v-model="sortBy"
            class="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="delivery-date">Delivery Date</option>
          </select>
        </div>
      </div>

      <!-- Clear Filters -->
      <div class="mt-4 flex justify-end">
        <BaseButton variant="ghost" size="sm" @click="clearFilters">
          Clear Filters
        </BaseButton>
      </div>

      <!-- Results Count -->
      <div class="mt-4 text-sm text-slate-600 dark:text-slate-400">
        Showing {{ filteredShipments.length }} of {{ shipments.length }} shipments
      </div>
    </div>

    <!-- Loading State -->
    <SkeletonLoader v-if="loading" variant="list" :count="6" />

    <!-- Shipments List -->
    <div v-else-if="paginatedShipments.length > 0" class="space-y-4">
      <div
        v-for="shipment in paginatedShipments"
        :key="shipment.id"
        class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-shadow duration-200"
      >
        <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <!-- Shipment Info -->
          <div class="flex-1">
            <div class="flex items-start gap-3 mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold text-slate-900 dark:text-white">
                    {{ shipment.transactionId }}
                  </h3>
                  <BaseBadge :variant="getStatusVariant(shipment.status)" size="sm">
                    {{ getStatusLabel(shipment.status) }}
                  </BaseBadge>
                </div>
                <div class="text-base font-medium text-slate-900 dark:text-white mb-2">
                  {{ shipment.itemTitle }}
                </div>
                
                <!-- Tracking Info -->
                <div v-if="shipment.trackingNumber" class="mb-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                  <div class="flex items-center gap-2 mb-2">
                    <TruckIcon class="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span class="text-sm font-medium text-slate-900 dark:text-white">{{ shipment.carrier }}</span>
                  </div>
                  <div class="text-sm text-slate-600 dark:text-slate-400 font-mono">
                    {{ shipment.trackingNumber }}
                  </div>
                  <div v-if="shipment.shippingDate" class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Shipped: {{ shipment.shippingDate }}
                  </div>
                  <div v-if="shipment.estimatedDelivery" class="text-xs text-slate-500 dark:text-slate-400">
                    Estimated: {{ shipment.estimatedDelivery }}
                  </div>
                  <div v-if="shipment.actualDelivery" class="text-xs text-green-600 dark:text-green-400 font-medium">
                    Delivered: {{ shipment.actualDelivery }}
                  </div>
                </div>

                <!-- Address Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div class="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <div class="flex items-center gap-2 mb-2">
                      <MapPinIcon class="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span class="text-sm font-medium text-slate-900 dark:text-white">Delivery Address</span>
                    </div>
                    <div class="text-sm text-slate-600 dark:text-slate-400">
                      {{ shipment.address }}
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Buyer: {{ shipment.buyer.name }}
                    </div>
                  </div>
                  <div class="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                    <div class="flex items-center gap-2 mb-2">
                      <BuildingStorefrontIcon class="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      <span class="text-sm font-medium text-slate-900 dark:text-white">Seller</span>
                    </div>
                    <div class="text-sm text-slate-600 dark:text-slate-400">
                      {{ shipment.seller.name }}
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {{ shipment.seller.address }}
                    </div>
                  </div>
                </div>

                <div class="text-xs text-slate-500 dark:text-slate-400">
                  Order Date: {{ shipment.orderDate }}
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 lg:flex-col">
            <BaseButton variant="primary" size="sm" @click="handleViewDetail(shipment.transactionId)">
              View Transaction
            </BaseButton>
            <BaseButton
              v-if="!shipment.trackingNumber || shipment.status === 'pending' || shipment.status === 'confirmed'"
              variant="warning"
              size="sm"
              @click="handleUpdateTracking(shipment.id)"
            >
              Update Tracking
            </BaseButton>
            <BaseButton
              v-if="shipment.status === 'out_for_delivery' || shipment.status === 'in_transit'"
              variant="success"
              size="sm"
              @click="handleMarkDelivered(shipment.id)"
            >
              <CheckCircleIcon class="w-4 h-4" />
              Mark Delivered
            </BaseButton>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between">
        <div class="text-sm text-slate-600 dark:text-slate-400">
          Page {{ currentPage }} of {{ totalPages }}
        </div>
        <div class="flex gap-2">
          <BaseButton
            variant="outline"
            size="sm"
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
          >
            Previous
          </BaseButton>
          <BaseButton
            variant="outline"
            size="sm"
            :disabled="currentPage === totalPages"
            @click="handlePageChange(currentPage + 1)"
          >
            Next
          </BaseButton>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      :icon="TruckIcon"
      title="No shipments found"
      description="No shipments match your current filters. Try adjusting your search criteria."
    />
  </div>
</template>