import api from './api'

export interface LoginPayload {
  login: string  // Can be email or phone number
  password: string
  rememberMe?: boolean
}

export interface LoginResponse {
  success: boolean
  token?: string
  user?: {
    id: string
    name: string
    email: string
    phone?: string
    role?: string
    [key: string]: any
  }
  message?: string
}

export interface RegisterPayload {
  fullName: string
  email: string
  phone: string
  password: string
  passwordConfirmation: string
  gender: string
}

export interface RegisterWithDocumentsPayload extends RegisterPayload {
  idFront: File
  idBack: File
}

/**
 * Login with email or phone number
 * Returns Bearer token and user data
 */
export async function login(payload: LoginPayload): Promise<LoginResponse> {
  try {
    console.log('🎯 auth.ts login() - RECEIVED payload:', payload)
    console.log('🎯 auth.ts login() - payload.login:', payload.login)
    console.log('🎯 auth.ts login() - payload.password:', payload.password)
    console.log('🎯 auth.ts login() - payload.rememberMe:', payload.rememberMe)
    
    const body = {
      login: payload.login,
      password: payload.password,
    }

    console.log('🔐 Login Request Body:', body)
    console.log('🔐 Login Request Body (stringified):', JSON.stringify(body))
    
    const res = await api.post('/login', body)
    
    console.log('✅ Login Response Status:', res.status)
    console.log('✅ Login Response Data:', res.data)
    console.log('✅ Login Response Headers:', res.headers)
    
    // Store token and user data
    if (res.data.token) {
      console.log('💾 Storing token:', res.data.token)
      localStorage.setItem('auth_token', res.data.token)
      
      // Also store in cookies for server-side middleware access
      if (typeof document !== 'undefined') {
        const maxAge = 30 * 24 * 60 * 60 // 30 days
        document.cookie = `auth_token=${res.data.token}; path=/; max-age=${maxAge}; SameSite=Lax`
      }
    } else {
      console.warn('⚠️ No token in response!')
    }
    
    if (res.data.user) {
      console.log('💾 Storing user data:', res.data.user)
      localStorage.setItem('user_data', JSON.stringify(res.data.user))
    } else {
      console.warn('⚠️ No user data in response!')
    }

    return {
      success: true,
      token: res.data.token,
      user: res.data.user,
      message: res.data.message || 'Login successful',
    }
  } catch (error: any) {
    console.error('❌ Login Error:', error)
    console.error('❌ Error Response Status:', error.response?.status)
    console.error('❌ Error Response Data:', error.response?.data)
    console.error('❌ Error Response Headers:', error.response?.headers)
    console.error('❌ Error Message:', error.message)
    
    return {
      success: false,
      message: error.response?.data?.message || error.response?.data?.error || 'Login failed',
    }
  }
}

/**
 * Logout - Clear token and user data
 */
export async function logout(): Promise<void> {
  try {
    // Call logout endpoint if exists
    await api.post('/logout').catch(() => {
      // Ignore errors, still clear local data
    })
  } finally {
    // Always clear local storage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    
    // Clear cookie
    if (typeof document !== 'undefined') {
      document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
  }
}

/**
 * Get current authenticated user
 */
export function getCurrentUser(): any | null {
  if (typeof window === 'undefined') return null
  
  const userData = localStorage.getItem('user_data')
  if (!userData) return null
  
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false
  return !!localStorage.getItem('auth_token')
}

/**
 * Get authentication token
 */
export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

export async function register(payload: RegisterPayload) {
  const body = {
    name: payload.fullName,
    email: payload.email,
    phone_number: payload.phone,
    password: payload.password,
    password_confirmation: payload.passwordConfirmation,
    gender: payload.gender,
  }

  const res = await api.post('/admin/register', body)
  return res.data
}

/**
 * Register admin with ID documents in a single atomic transaction
 * This ensures the user is only created if documents are successfully uploaded
 */
export async function registerWithDocuments(payload: RegisterWithDocumentsPayload) {
  const formData = new FormData()
  
  // User data
  formData.append('name', payload.fullName)
  formData.append('email', payload.email)
  formData.append('phone_number', payload.phone)
  formData.append('password', payload.password)
  formData.append('password_confirmation', payload.passwordConfirmation)
  formData.append('gender', payload.gender)
  
  // ID documents
  formData.append('id_front', payload.idFront)
  formData.append('id_back', payload.idBack)

  const res = await api.post('/admin/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  return res.data
}
