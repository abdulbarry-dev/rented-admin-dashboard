"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  UserPlus,
  Mail,
  Lock,
  User,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import TermsModal from '../components/TermsModal'
import PrivacyModal from '../components/PrivacyModal'
import { toast } from 'sonner'
import { registerSchema } from './../../lib/validation/register.schema'
import { z } from 'zod'
import { register } from '@/lib/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showTermsModal, setShowTermsModal] = useState(false)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: '',
      })
    }
  }

  const handleBlur = (fieldName: string) => {
    setTouched({
      ...touched,
      [fieldName]: true,
    })
    
    try {
      registerSchema.pick({ [fieldName]: true } as any).parse({ [fieldName]: formData[fieldName as keyof typeof formData] })
      setFieldErrors({
        ...fieldErrors,
        [fieldName]: '',
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setFieldErrors({
          ...fieldErrors,
          [fieldName]: error.issues[0]?.message || '',
        })
      }
    }
  }

  const getHttpErrorMessage = (statusCode: number): string => {
    switch (statusCode) {
      case 400:
        return 'Invalid request. Please check your input and try again.'
      case 401:
        return 'Authentication failed. Please try again.'
      case 403:
        return 'Access denied. You do not have permission to perform this action.'
      case 404:
        return 'Service not found. Please contact support.'
      case 409:
        return 'This account already exists. Please try logging in.'
      case 422:
        return 'Validation failed. Please check your input.'
      case 429:
        return 'Too many requests. Please try again later.'
      case 500:
        return 'Server error. Please try again later.'
      case 502:
        return 'Service temporarily unavailable. Please try again.'
      case 503:
        return 'Service maintenance in progress. Please try again later.'
      default:
        return 'Registration failed. Please try again.'
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate form data
      registerSchema.parse(formData)
      setFieldErrors({})
      
      // Prepare registration payload
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        passwordConfirmation: formData.confirmPassword,
        gender: formData.gender,
      }

      // Make API call using the register function from auth.ts
      await register(payload)

      // Success - show message and redirect
      toast.success('Account created successfully! Please sign in.')
      
      // Redirect to login page after a brief delay
      setTimeout(() => {
        router.push('/login')
      }, 1500)
      
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        // Handle Zod validation errors
        const errors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message
          }
        })
        setFieldErrors(errors)
        setTouched({
          fullName: true,
          email: true,
          phone: true,
          password: true,
          confirmPassword: true,
          gender: true,
        })
        toast.error('Please fix the errors in the form')
      } else if (error?.response?.data?.errors) {
        // Handle backend validation errors
        const backendErrors: Record<string, string> = {}
        const errors = error.response.data.errors
        
        Object.keys(errors).forEach((key) => {
          const errorMessages = Array.isArray(errors[key]) ? errors[key] : [errors[key]]
          const mappedKey = key === 'name' ? 'fullName' 
            : key === 'password_confirmation' ? 'confirmPassword'
            : key === 'phone_number' ? 'phone'
            : key
          backendErrors[mappedKey] = errorMessages[0]
        })
        
        setFieldErrors(backendErrors)
        toast.error('Please fix the validation errors')
      } else if (error?.response?.data?.message) {
        // Handle error messages from backend
        toast.error(error.response.data.message)
      } else if (error?.response?.status) {
        // Handle HTTP status errors
        const message = getHttpErrorMessage(error.response.status)
        toast.error(message)
      } else {
        // Handle network errors
        toast.error('Network error. Please check your connection and try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full h-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 items-center relative z-10 p-3 md:p-4 lg:p-6">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col gap-4 xl:gap-5 justify-center max-w-lg mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg xl:text-xl font-bold leading-tight">HR Manager</h1>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>
          </div>
          
          <div className="space-y-3 xl:space-y-4">
            <h2 className="text-2xl xl:text-3xl font-bold leading-tight">
              Join Our<br />
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                HR Platform
              </span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Manage your workforce efficiently with our comprehensive HR management system.
            </p>
            
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-gray-300 text-sm">
                <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-500 text-xs">✓</span>
                </div>
                <span>Real-time employee tracking</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-300 text-sm">
                <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-500 text-xs">✓</span>
                </div>
                <span>Advanced analytics & reporting</span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-300 text-sm">
                <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-purple-500 text-xs">✓</span>
                </div>
                <span>Secure & compliant platform</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full max-w-lg mx-auto h-full flex flex-col justify-center">
          <div className="bg-[#141414] border border-gray-800 rounded-xl lg:rounded-2xl p-4 md:p-5 lg:p-6 shadow-2xl backdrop-blur-xl max-h-[calc(100vh-1.5rem)] md:max-h-[calc(100vh-2rem)] lg:max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-base font-bold">HR Manager</span>
            </div>

            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <UserPlus className="w-4 h-4 text-purple-500" />
                <h2 className="text-lg font-bold">Create Account</h2>
              </div>
              <p className="text-gray-400 text-xs">Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2.5">
              {/* Full Name Field */}
              <div className="space-y-0.5">
                <label htmlFor="fullName" className="text-xs font-medium text-gray-300">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    onBlur={() => handleBlur('fullName')}
                    className={`w-full bg-[#1a1a1a] border ${
                      touched.fullName && fieldErrors.fullName
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500'
                    } rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all`}
                    placeholder="John Doe"
                    required
                    aria-invalid={touched.fullName && !!fieldErrors.fullName}
                    aria-describedby={fieldErrors.fullName ? 'fullName-error' : undefined}
                  />
                </div>
                {touched.fullName && fieldErrors.fullName && (
                  <div className="flex items-center gap-1 text-red-500 text-xs" id="fullName-error" role="alert">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{fieldErrors.fullName}</span>
                  </div>
                )}
              </div>

              {/* Email & Phone in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Email */}
                <div className="space-y-0.5">
                  <label htmlFor="email" className="text-xs font-medium text-gray-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={() => handleBlur('email')}
                      className={`w-full bg-[#1a1a1a] border ${
                        touched.email && fieldErrors.email
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500'
                      } rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all`}
                      placeholder="john@example.com"
                      required
                      aria-invalid={touched.email && !!fieldErrors.email}
                      aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    />
                  </div>
                  {touched.email && fieldErrors.email && (
                    <div className="flex items-center gap-1 text-red-500 text-xs" id="email-error" role="alert">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{fieldErrors.email}</span>
                    </div>
                  )}
                </div>

                {/* Phone Number */}
                <div className="space-y-0.5">
                  <label htmlFor="phone" className="text-xs font-medium text-gray-300">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      onBlur={() => handleBlur('phone')}
                      className={`w-full bg-[#1a1a1a] border ${
                        touched.phone && fieldErrors.phone
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500'
                      } rounded-lg pl-8 pr-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all`}
                      placeholder="+1 (555) 000-0000"
                      required
                      aria-invalid={touched.phone && !!fieldErrors.phone}
                      aria-describedby={fieldErrors.phone ? 'phone-error' : undefined}
                    />
                  </div>
                  {touched.phone && fieldErrors.phone && (
                    <div className="flex items-center gap-1 text-red-500 text-xs" id="phone-error" role="alert">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{fieldErrors.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-0.5">
                <label className="text-xs font-medium text-gray-300">
                  Gender
                </label>
                <div className="flex gap-3">
                  {/* Male Option */}
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value="H"
                      checked={formData.gender === 'H'}
                      onChange={handleChange}
                      onBlur={() => handleBlur('gender')}
                      className="w-4 h-4 text-purple-600 bg-[#1a1a1a] border-gray-700 focus:ring-purple-500 focus:ring-2 cursor-pointer"
                      required
                      aria-invalid={touched.gender && !!fieldErrors.gender}
                    />
                    <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                      Male
                    </span>
                  </label>

                  {/* Female Option */}
                  <label className="flex items-center gap-1.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="gender"
                      value="F"
                      checked={formData.gender === 'F'}
                      onChange={handleChange}
                      onBlur={() => handleBlur('gender')}
                      className="w-4 h-4 text-purple-600 bg-[#1a1a1a] border-gray-700 focus:ring-purple-500 focus:ring-2 cursor-pointer"
                      aria-invalid={touched.gender && !!fieldErrors.gender}
                    />
                    <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                      Female
                    </span>
                  </label>
                </div>
                {touched.gender && fieldErrors.gender && (
                  <div className="flex items-center gap-1 text-red-500 text-xs" id="gender-error" role="alert">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{fieldErrors.gender}</span>
                  </div>
                )}
              </div>

              {/* Password Fields in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Password */}
                <div className="space-y-0.5">
                  <label htmlFor="password" className="text-xs font-medium text-gray-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      onBlur={() => handleBlur('password')}
                      className={`w-full bg-[#1a1a1a] border ${
                        touched.password && fieldErrors.password
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500'
                      } rounded-lg pl-8 pr-9 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all`}
                      placeholder="Strong password"
                      required
                      aria-invalid={touched.password && !!fieldErrors.password}
                      aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors z-10 cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {touched.password && fieldErrors.password && (
                    <div className="flex items-center gap-1 text-red-500 text-xs" id="password-error" role="alert">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{fieldErrors.password}</span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="space-y-0.5">
                  <label htmlFor="confirmPassword" className="text-xs font-medium text-gray-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      onBlur={() => handleBlur('confirmPassword')}
                      className={`w-full bg-[#1a1a1a] border ${
                        touched.confirmPassword && fieldErrors.confirmPassword
                          ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                          : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500'
                      } rounded-lg pl-8 pr-9 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 transition-all`}
                      placeholder="Re-enter password"
                      required
                      aria-invalid={touched.confirmPassword && !!fieldErrors.confirmPassword}
                      aria-describedby={fieldErrors.confirmPassword ? 'confirmPassword-error' : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors z-10 cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {touched.confirmPassword && fieldErrors.confirmPassword && (
                    <div className="flex items-center gap-1 text-red-500 text-xs" id="confirmPassword-error" role="alert">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{fieldErrors.confirmPassword}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start gap-1.5">
                <input
                  type="checkbox"
                  id="terms"
                  className="mt-0.5 w-4 h-4 rounded border-gray-600 bg-[#1a1a1a] text-purple-600 focus:ring-purple-500 focus:ring-offset-0 flex-shrink-0"
                  required
                />
                <label htmlFor="terms" className="text-xs text-gray-400 leading-tight">
                  I agree to the{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-purple-500 hover:text-purple-400 underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded"
                  >
                    Terms & Conditions
                  </button>{' '}
                  and{' '}
                  <button
                    type="button"
                    onClick={() => setShowPrivacyModal(true)}
                    className="text-purple-500 hover:text-purple-400 underline focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded"
                  >
                    Privacy Policy
                  </button>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-medium py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2 group shadow-lg shadow-purple-600/20 text-sm ${
                  loading
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Sign In Link */}
              <div className="text-center pt-0.5">
                <p className="text-gray-400 text-xs">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="text-purple-500 hover:text-purple-400 font-medium transition-colors"
                  >
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      <PrivacyModal isOpen={showPrivacyModal} onClose={() => setShowPrivacyModal(false)} />
    </div>
  );
}
