'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Moon, Sun, X } from 'lucide-react'
import * as Switch from '@radix-ui/react-switch'
import { LoginController } from '@/lib/controllers/LoginController'
import { LoadingState } from '@/lib/types'

export default function LoginPage() {
  const router = useRouter()
  const controllerRef = useRef<LoginController | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>('system')
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Initialize controller
  useEffect(() => {
    if (!controllerRef.current) {
      const controller = new LoginController()
      
      // Setup event handlers
      controller.onStateChange((state) => {
        setLoadingState(state)
      })
      
      controller.onSuccess(() => {
        router.push('/dashboard')
      })
      
      // Subscribe to theme changes
      const unsubscribeTheme = controller.subscribeToTheme((theme, resolved) => {
        setCurrentTheme(theme as 'light' | 'dark' | 'system')
        setResolvedTheme(resolved as 'light' | 'dark')
      })
      
      controllerRef.current = controller
      
      // Cleanup on unmount
      return () => {
        unsubscribeTheme()
        controller.dispose()
      }
    }
  }, [router])

  const getController = (): LoginController => {
    if (!controllerRef.current) {
      throw new Error('Controller not initialized')
    }
    return controllerRef.current
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const finalValue = type === 'checkbox' ? String(checked) : value
    
    // Update controller
    getController().setFieldValue(name, finalValue)
    
    // Update local state for UI
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleInputBlur = (fieldName: string) => {
    getController().touchField(fieldName)
    
    // Update errors state
    const error = getController().getFieldError(fieldName)
    if (error) {
      setFormErrors(prev => ({
        ...prev,
        [fieldName]: error
      }))
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await getController().submitForm()
    
    if (!success) {
      // Update form errors
      setFormErrors(getController().getFormErrors())
    }
  }

  const handleGoogleLogin = async () => {
    await getController().handleGoogleLogin()
  }

  const toggleTheme = () => {
    getController().toggleTheme()
  }

  const togglePasswordVisibility = () => {
    getController().togglePasswordVisibility()
  }

  const isLoading = loadingState === LoadingState.LOADING
  const showPassword = controllerRef.current?.isPasswordVisible() || false

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 flex items-center justify-center p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:20px_20px] opacity-50" />
      
      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700"
      >
        {resolvedTheme === 'dark' ? (
          <Sun className="w-5 h-5 text-amber-500" />
        ) : (
          <Moon className="w-5 h-5 text-slate-600" />
        )}
      </button>

      {/* Main Login Container */}
      <div className="w-full max-w-md relative">
        {/* Background Blur Card */}
        <div className="absolute inset-0 bg-white/20 dark:bg-slate-800/20 backdrop-blur-xl rounded-3xl border border-white/30 dark:border-slate-700/30 shadow-2xl" />
        
        {/* Content */}
        <div className="relative p-8 md:p-10">
          {/* Logo & Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-6 shadow-lg">
              <X className="w-8 h-8 text-white rotate-45" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              HR Manager
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to access your dashboard
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur('email')}
                placeholder="Enter your email"
                className={`w-full px-4 py-3 rounded-xl border backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                  formErrors.email 
                    ? 'border-red-500 focus:ring-red-500 bg-red-50/50 dark:bg-red-900/20' 
                    : 'border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-violet-500'
                }`}
                required
              />
              {formErrors.email && (
                <p className="text-sm text-red-600 mt-1">{formErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  onBlur={() => handleInputBlur('password')}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border backdrop-blur-sm text-slate-900 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    formErrors.password 
                      ? 'border-red-500 focus:ring-red-500 bg-red-50/50 dark:bg-red-900/20' 
                      : 'border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 focus:ring-violet-500'
                  }`}
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formErrors.password && (
                <p className="text-sm text-red-600 mt-1">{formErrors.password}</p>
              )}
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Switch.Root
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => {
                    handleInputChange({
                      target: {
                        name: 'rememberMe',
                        type: 'checkbox',
                        checked: checked
                      }
                    } as any)
                  }}
                  className="w-11 h-6 bg-slate-300 dark:bg-slate-600 rounded-full relative data-[state=checked]:bg-violet-500 transition-colors duration-200"
                >
                  <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 data-[state=checked]:translate-x-5 translate-x-0.5" />
                </Switch.Root>
                <label className="text-sm text-slate-600 dark:text-slate-400">
                  Remember me
                </label>
              </div>
              
              <button
                type="button"
                className="text-sm text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-50/80 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 backdrop-blur-sm rounded-full">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm hover:bg-white/70 dark:hover:bg-slate-800/70 text-slate-700 dark:text-slate-300 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-sm text-slate-600 dark:text-slate-400">
            Don't have an account?{' '}
            <button className="text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 font-medium transition-colors">
              Sign up here
            </button>
          </p>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
    </div>
  )
}