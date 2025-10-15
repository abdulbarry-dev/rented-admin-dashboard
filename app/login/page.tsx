/**
 * Login Page
 * 
 * Consolidated authentication page for HR Manager admin dashboard.
 * Features:
 * - Email/phone + password authentication
 * - Remember me functionality
 * - Password visibility toggle
 * - Mobile help drawer (Vaul)
 * - Radix UI components (Label, Switch, Dialog)
 * - Responsive design with branding sidebar
 * 
 * @page
 */

'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LoginController } from '@/lib/controllers/LoginController'
import { LoadingState } from '@/lib/types'
import { Eye, EyeOff, Loader2, Shield, Mail, Smartphone, HelpCircle, Sparkles } from 'lucide-react'
import * as Label from '@radix-ui/react-label'
import * as Switch from '@radix-ui/react-switch'
import { Drawer } from 'vaul'

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormData {
  login: string
  password: string
  rememberMe: boolean
}

// ============================================================================
// CONSTANTS
// ============================================================================

const QUICK_ACTIONS = [
  {
    id: 'reset-password',
    icon: Shield,
    title: 'Reset Password',
    description: 'Get help accessing your account',
    bgColor: 'bg-blue-600/20',
    borderColor: 'border-blue-600/30',
    iconColor: 'text-blue-400',
  },
  {
    id: 'contact-support',
    icon: Mail,
    title: 'Contact Support',
    description: 'Get in touch with our team',
    bgColor: 'bg-green-600/20',
    borderColor: 'border-green-600/30',
    iconColor: 'text-green-400',
  },
  {
    id: 'mobile-app',
    icon: Smartphone,
    title: 'Mobile App',
    description: 'Download our mobile app',
    bgColor: 'bg-purple-600/20',
    borderColor: 'border-purple-600/30',
    iconColor: 'text-purple-400',
  },
]

const LOGIN_TIPS = [
  'Use your company email address to sign in',
  'Enable "Remember me" for faster future logins',
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function LoginPage() {
  const router = useRouter()
  const controllerRef = useRef<LoginController | null>(null)
  
  // State
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE)
  const [formData, setFormData] = useState<FormData>({
    login: '',
    password: '',
    rememberMe: false
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Initialize controller
  useEffect(() => {
    if (!controllerRef.current) {
      const controller = new LoginController()
      
      controller.setStateChangeHandler((state) => {
        setLoadingState(state)
      })
      
      controller.setSuccessHandler(() => {
        router.push('/dashboard')
      })
      
      controllerRef.current = controller
    }
  }, [router])

  // Handlers
  const getController = (): LoginController => {
    if (!controllerRef.current) {
      throw new Error('Controller not initialized')
    }
    return controllerRef.current
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const fieldName = name as 'login' | 'password' | 'rememberMe'
    const finalValue = type === 'checkbox' ? checked : value
    
    getController().setFieldValue(fieldName, finalValue)
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSwitchChange = (checked: boolean) => {
    const fieldName = 'rememberMe'
    
    getController().setFieldValue(fieldName, checked)
    
    setFormData(prev => ({
      ...prev,
      rememberMe: checked
    }))
  }

  const handleInputBlur = (fieldName: string) => {
    const typedFieldName = fieldName as 'login' | 'password' | 'rememberMe'
    getController().touchField(typedFieldName)
    
    const error = getController().getFieldError(typedFieldName)
    if (error) {
      setFormErrors(prev => ({
        ...prev,
        [fieldName]: error
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const success = await getController().submitForm()
    
    if (!success) {
      setFormErrors(getController().getFormErrors())
    }
  }

  const isLoading = loadingState === LoadingState.LOADING

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full h-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 items-center relative z-10 p-3 md:p-4 lg:p-6">
        
        {/* Branding Sidebar */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 lg:space-y-8">
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl">
                <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  HR Manager
                </h1>
                <p className="text-sm lg:text-base text-gray-400">Admin Dashboard</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <h2 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight">
              Streamline your HR operations with powerful tools
            </h2>
            
            <ul className="space-y-3 lg:space-y-4">
              {[
                'Comprehensive employee management',
                'Real-time analytics and insights',
                'Secure document handling',
                'Automated workflows',
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3 text-gray-300">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm lg:text-base">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="w-full max-w-lg mx-auto h-full flex flex-col justify-center">
          <div className="bg-[#141414] border border-gray-800 rounded-xl lg:rounded-2xl p-4 md:p-5 lg:p-6 shadow-2xl backdrop-blur-xl max-h-[calc(100vh-1.5rem)] md:max-h-[calc(100vh-2rem)] lg:max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  HR Manager
                </h1>
              </div>
            </div>

            {/* Form Header */}
            <div className="text-center mb-4 md:mb-5">
              <h2 className="text-lg md:text-xl font-bold text-white mb-1">
                Welcome Back
              </h2>
              <p className="text-gray-400 text-xs">
                Sign in to your HR Manager account
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-3">
              
              {/* Login Field */}
              <div>
                <Label.Root htmlFor="login" className="block text-xs font-medium text-gray-300 mb-1.5">
                  Email or Phone Number <span className="text-red-500">*</span>
                </Label.Root>
                <input
                  id="login"
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleInputChange}
                  onBlur={() => handleInputBlur('login')}
                  placeholder="your.email@company.com or +1234567890"
                  className={`w-full px-3 py-2 bg-[#1a1a1a] border ${
                    formErrors.login ? 'border-red-500' : 'border-gray-700'
                  } rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all`}
                  required
                />
                {formErrors.login && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.login}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label.Root htmlFor="password" className="block text-xs font-medium text-gray-300 mb-1.5">
                  Password <span className="text-red-500">*</span>
                </Label.Root>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onBlur={() => handleInputBlur('password')}
                    placeholder="Enter your password"
                    className={`w-full px-3 py-2 pr-10 bg-[#1a1a1a] border ${
                      formErrors.password ? 'border-red-500' : 'border-gray-700'
                    } rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {formErrors.password && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-0.5">
                <div className="flex items-center gap-2">
                  <Switch.Root
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={handleSwitchChange}
                    className="w-9 h-5 bg-gray-700 rounded-full relative data-[state=checked]:bg-purple-600 transition-colors"
                  >
                    <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[18px]" />
                  </Switch.Root>
                  <Label.Root htmlFor="rememberMe" className="text-xs text-gray-400 cursor-pointer">
                    Remember me
                  </Label.Root>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full font-medium py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  isLoading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-600/20'
                }`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center mt-3 text-xs text-gray-400">
              Don't have an account?{' '}
              <button 
                onClick={() => router.push('/register')}
                className="text-purple-400 hover:text-purple-300 font-medium transition-colors"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Help Drawer */}
      <Drawer.Root open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50" />
          <Drawer.Content className="bg-[#141414] border-t border-gray-800 flex flex-col rounded-t-[20px] h-fit mt-24 max-h-[80vh] fixed bottom-0 left-0 right-0 z-50">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-700 mt-4" />
            
            <div className="p-6 pb-4">
              <Drawer.Title className="text-xl font-semibold text-white mb-2">
                Need Help?
              </Drawer.Title>
              <p className="text-gray-400 text-sm">
                Get help with your login or learn more about HR Manager
              </p>
            </div>

            <div className="px-6 pb-6 overflow-y-auto">
              <div className="space-y-4">
                {/* Quick Actions */}
                <section className="space-y-3">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Quick Actions
                  </h3>
                  
                  {QUICK_ACTIONS.map((action) => {
                    const Icon = action.icon
                    return (
                      <button 
                        key={action.id}
                        className="w-full p-4 rounded-lg bg-[#1a1a1a] border border-gray-800 hover:bg-gray-800 transition-colors flex items-center space-x-3"
                      >
                        <div className={`p-2 rounded-lg ${action.bgColor} border ${action.borderColor}`}>
                          <Icon className={`w-5 h-5 ${action.iconColor}`} />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-white">{action.title}</p>
                          <p className="text-sm text-gray-400">{action.description}</p>
                        </div>
                      </button>
                    )
                  })}
                </section>

                {/* About */}
                <section className="space-y-3">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    About HR Manager
                  </h3>
                  
                  <div className="p-4 rounded-lg bg-gradient-to-br from-purple-600/10 to-blue-600/10 border border-purple-600/20">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                        <HelpCircle className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-medium text-white">Enterprise HR Solution</h4>
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      Streamline your HR processes with our comprehensive dashboard. 
                      Manage employees, track performance, and gain insights with powerful analytics.
                    </p>
                  </div>
                </section>

                {/* Login Tips */}
                <section className="space-y-3">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Login Tips
                  </h3>
                  
                  <ul className="space-y-2" role="list">
                    {LOGIN_TIPS.map((tip, index) => (
                      <li 
                        key={index} 
                        className="flex items-start space-x-3 p-3 rounded-lg bg-[#1a1a1a]"
                      >
                        <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0" />
                        <p className="text-sm text-gray-400">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>

            <div className="p-6 pt-4 border-t border-gray-800">
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-3 px-4 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  )
}