<script setup lang="ts">
import { ref } from 'vue'
import { ShieldCheckIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/vue/24/outline'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

interface Role {
  id: number
  name: string
  description: string
  userCount: number
  permissions: string[]
}

const roles = ref<Role[]>([
  {
    id: 1,
    name: 'Administrator',
    description: 'Full system access with all permissions',
    userCount: 2,
    permissions: ['all']
  },
  {
    id: 2,
    name: 'Manager',
    description: 'Can manage products, orders, and users',
    userCount: 5,
    permissions: ['products.view', 'products.edit', 'orders.view', 'orders.edit', 'users.view']
  },
  {
    id: 3,
    name: 'Support',
    description: 'Can view and respond to customer inquiries',
    userCount: 8,
    permissions: ['orders.view', 'users.view', 'support.manage']
  },
  {
    id: 4,
    name: 'Viewer',
    description: 'Read-only access to most areas',
    userCount: 12,
    permissions: ['products.view', 'orders.view', 'users.view']
  }
])

const availablePermissions = [
  { id: 'products.view', name: 'View Products', category: 'Products' },
  { id: 'products.edit', name: 'Edit Products', category: 'Products' },
  { id: 'products.delete', name: 'Delete Products', category: 'Products' },
  { id: 'orders.view', name: 'View Orders', category: 'Orders' },
  { id: 'orders.edit', name: 'Edit Orders', category: 'Orders' },
  { id: 'orders.delete', name: 'Delete Orders', category: 'Orders' },
  { id: 'users.view', name: 'View Users', category: 'Users' },
  { id: 'users.edit', name: 'Edit Users', category: 'Users' },
  { id: 'users.delete', name: 'Delete Users', category: 'Users' },
  { id: 'support.manage', name: 'Manage Support', category: 'Support' },
  { id: 'settings.manage', name: 'Manage Settings', category: 'Settings' },
  { id: 'reports.view', name: 'View Reports', category: 'Reports' }
]

const selectedRole = ref<Role | null>(null)
const showRoleModal = ref(false)

const openRoleModal = (role?: Role) => {
  selectedRole.value = role ? { ...role } : {
    id: Date.now(),
    name: '',
    description: '',
    userCount: 0,
    permissions: []
  }
  showRoleModal.value = true
}

const saveRole = () => {
  if (selectedRole.value) {
    const index = roles.value.findIndex((r) => r.id === selectedRole.value?.id)
    if (index >= 0) {
      roles.value[index] = selectedRole.value
    } else {
      roles.value.push(selectedRole.value)
    }
  }
  showRoleModal.value = false
  selectedRole.value = null
}

const deleteRole = (roleId: number) => {
  if (confirm('Are you sure you want to delete this role? Users with this role will need to be reassigned.')) {
    roles.value = roles.value.filter((r) => r.id !== roleId)
  }
}

const togglePermission = (permissionId: string) => {
  if (!selectedRole.value) return

  const index = selectedRole.value.permissions.indexOf(permissionId)
  if (index >= 0) {
    selectedRole.value.permissions.splice(index, 1)
  } else {
    selectedRole.value.permissions.push(permissionId)
  }
}

const hasPermission = (permissionId: string) => {
  return selectedRole.value?.permissions.includes(permissionId) || selectedRole.value?.permissions.includes('all')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">Roles & Permissions</h2>
        <p class="mt-1" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">Manage user roles and their permissions</p>
      </div>
      <button
        @click="openRoleModal()"
        class="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
      >
        <PlusIcon class="w-5 h-5" />
        Add New Role
      </button>
    </div>

    <!-- Roles Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="role in roles"
        :key="role.id"
        :class="themeStore.isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'"
        class="rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow"
      >
        <div class="flex justify-between items-start mb-4">
          <div class="flex-1">
            <h3 class="text-lg font-semibold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">{{ role.name }}</h3>
            <p class="text-sm mt-1" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">{{ role.description }}</p>
          </div>
          <div class="flex gap-2 ml-4">
            <button
              @click="openRoleModal(role)"
              class="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button
              v-if="role.name !== 'Administrator'"
              @click="deleteRole(role.id)"
              class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <TrashIcon class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="flex items-center gap-2 text-sm mb-4" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-600'">
          <ShieldCheckIcon class="w-4 h-4" />
          <span>{{ role.userCount }} user{{ role.userCount !== 1 ? 's' : '' }}</span>
        </div>

        <div class="border-t pt-4" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-200'">
          <p class="text-xs font-medium mb-2" :class="themeStore.isDark ? 'text-slate-300' : 'text-slate-700'">Permissions:</p>
          <div class="flex flex-wrap gap-2">
            <span
              v-if="role.permissions.includes('all')"
              class="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
            >
              All Permissions
            </span>
            <template v-else>
              <span
                v-for="permission in role.permissions.slice(0, 3)"
                :key="permission"
                class="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
              >
                {{ permission.split('.').join(' ').replace(/\b\w/g, (l) => l.toUpperCase()) }}
              </span>
              <span
                v-if="role.permissions.length > 3"
                class="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs"
              >
                +{{ role.permissions.length - 3 }} more
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>

    <!-- Role Modal -->
    <div
      v-if="showRoleModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="showRoleModal = false"
    >
      <div class="rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" :class="themeStore.isDark ? 'bg-slate-800' : 'bg-white'">
        <div class="p-6 border-b" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-200'">
          <h2 class="text-2xl font-bold" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">
            {{ selectedRole?.name ? 'Edit Role' : 'Create New Role' }}
          </h2>
        </div>

        <div class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Role Name</label>
            <input
              v-model="selectedRole!.name"
              type="text"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Content Manager"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Description</label>
            <textarea
              v-model="selectedRole!.description"
              rows="3"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe the role's purpose and responsibilities"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">Permissions</label>
            <div class="space-y-2 max-h-64 overflow-y-auto border border-slate-200 rounded-lg p-4">
              <div v-for="permission in availablePermissions" :key="permission.id" class="flex items-center">
                <input
                  :id="permission.id"
                  type="checkbox"
                  :checked="hasPermission(permission.id)"
                  @change="togglePermission(permission.id)"
                  class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  :class="themeStore.isDark ? 'border-slate-600 bg-slate-700' : 'border-slate-300'"
                />
                <label :for="permission.id" class="ml-3 text-sm">
                  <span class="font-medium" :class="themeStore.isDark ? 'text-white' : 'text-slate-900'">{{ permission.name }}</span>
                  <span class="ml-2" :class="themeStore.isDark ? 'text-slate-400' : 'text-slate-500'">({{ permission.category }})</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="p-6 border-t flex justify-end gap-3" :class="themeStore.isDark ? 'border-slate-700' : 'border-slate-200'">
          <button
            @click="showRoleModal = false"
            :class="themeStore.isDark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-50'"
            class="px-6 py-2 border rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveRole"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
          >
            Save Role
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
