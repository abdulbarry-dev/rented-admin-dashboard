<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const frontIdFile = ref<File | null>(null)
const backIdFile = ref<File | null>(null)
const frontIdPreview = ref<string | null>(null)
const backIdPreview = ref<string | null>(null)
const idType = ref('national-id')
const loading = ref(false)
const dragoverFront = ref(false)
const dragoverBack = ref(false)

const handleFileSelect = (event: Event, side: 'front' | 'back') => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    processFile(file, side)
  }
}

const handleDrop = (event: DragEvent, side: 'front' | 'back') => {
  event.preventDefault()
  if (side === 'front') dragoverFront.value = false
  else dragoverBack.value = false

  const file = event.dataTransfer?.files[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file, side)
  }
}

const processFile = (file: File, side: 'front' | 'back') => {
  if (side === 'front') {
    frontIdFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      frontIdPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  } else {
    backIdFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      backIdPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeFile = (side: 'front' | 'back') => {
  if (side === 'front') {
    frontIdFile.value = null
    frontIdPreview.value = null
  } else {
    backIdFile.value = null
    backIdPreview.value = null
  }
}

const handleSubmit = async () => {
  if (!frontIdFile.value || !backIdFile.value) {
    alert('Please upload both sides of your ID')
    return
  }

  loading.value = true
  // Simulate API call
  setTimeout(() => {
    // Mark ID as verified
    localStorage.setItem('idVerified', 'true')

    loading.value = false
    router.push('/')
  }, 2000)
}

const skipForNow = () => {
  // Skip verification, but mark as not verified
  localStorage.setItem('idVerified', 'false')
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 flex items-center justify-center p-4">
    <div class="w-full max-w-3xl">
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-slate-900">Verify Your Identity</h1>
          <p class="text-slate-600 mt-2">Upload a valid government-issued ID to complete your registration</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- ID Type Selection -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-3">ID Type</label>
            <div class="grid grid-cols-3 gap-3">
              <button
                type="button"
                @click="idType = 'national-id'"
                :class="idType === 'national-id' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                class="py-3 px-4 rounded-lg font-medium transition-colors"
              >
                National ID
              </button>
              <button
                type="button"
                @click="idType = 'passport'"
                :class="idType === 'passport' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                class="py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Passport
              </button>
              <button
                type="button"
                @click="idType = 'drivers-license'"
                :class="idType === 'drivers-license' ? 'bg-cyan-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'"
                class="py-3 px-4 rounded-lg font-medium transition-colors"
              >
                Driver's License
              </button>
            </div>
          </div>

          <!-- Upload Areas -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Front Side -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-3">Front Side</label>
              <div
                @drop="handleDrop($event, 'front')"
                @dragover.prevent="dragoverFront = true"
                @dragleave="dragoverFront = false"
                :class="dragoverFront ? 'border-cyan-500 bg-cyan-50' : 'border-slate-300'"
                class="border-2 border-dashed rounded-lg p-6 text-center transition-colors"
              >
                <div v-if="!frontIdPreview">
                  <svg class="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p class="text-sm text-slate-600 mb-2">Drop image here or</p>
                  <label class="cursor-pointer text-cyan-600 hover:text-cyan-700 font-medium">
                    <span>Browse</span>
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleFileSelect($event, 'front')"
                    />
                  </label>
                  <p class="text-xs text-slate-500 mt-2">PNG, JPG up to 10MB</p>
                </div>
                <div v-else class="relative">
                  <img :src="frontIdPreview" alt="Front ID" class="w-full h-48 object-cover rounded-lg" />
                  <button
                    type="button"
                    @click="removeFile('front')"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  <div class="mt-2 text-xs text-slate-600 truncate">{{ frontIdFile?.name }}</div>
                </div>
              </div>
            </div>

            <!-- Back Side -->
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-3">Back Side</label>
              <div
                @drop="handleDrop($event, 'back')"
                @dragover.prevent="dragoverBack = true"
                @dragleave="dragoverBack = false"
                :class="dragoverBack ? 'border-cyan-500 bg-cyan-50' : 'border-slate-300'"
                class="border-2 border-dashed rounded-lg p-6 text-center transition-colors"
              >
                <div v-if="!backIdPreview">
                  <svg class="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                  </svg>
                  <p class="text-sm text-slate-600 mb-2">Drop image here or</p>
                  <label class="cursor-pointer text-cyan-600 hover:text-cyan-700 font-medium">
                    <span>Browse</span>
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleFileSelect($event, 'back')"
                    />
                  </label>
                  <p class="text-xs text-slate-500 mt-2">PNG, JPG up to 10MB</p>
                </div>
                <div v-else class="relative">
                  <img :src="backIdPreview" alt="Back ID" class="w-full h-48 object-cover rounded-lg" />
                  <button
                    type="button"
                    @click="removeFile('back')"
                    class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                  <div class="mt-2 text-xs text-slate-600 truncate">{{ backIdFile?.name }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Important Note -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex gap-3">
              <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="text-sm text-blue-800">
                <p class="font-semibold mb-1">Important:</p>
                <ul class="list-disc list-inside space-y-1 text-blue-700">
                  <li>Make sure all text is clearly visible</li>
                  <li>Ensure there's no glare or shadows</li>
                  <li>Upload original, unedited photos</li>
                  <li>ID must be valid and not expired</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="loading || !frontIdFile || !backIdFile"
              class="flex-1 py-3 bg-cyan-600 text-white font-semibold rounded-lg hover:bg-cyan-700 disabled:bg-slate-400 transition-colors"
            >
              {{ loading ? 'Uploading...' : 'Submit for Verification' }}
            </button>
            <button
              type="button"
              @click="skipForNow"
              class="px-6 py-3 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-colors"
            >
              Skip for Now
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <p class="text-xs text-slate-500">
            Your information is secure and will only be used for verification purposes
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
