/**
 * Login Page
 * 
 * Authentication page for HR Manager admin dashboard.
 * Features include:
 * - Email/password authentication
 * - Remember me functionality
 * - Password visibility toggle
 * - Mobile help drawer
 * - Responsive design with branding sidebar
 * 
 * @page
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLoginForm } from './hooks/useLoginForm'
import {
  BackgroundEffects,
  BrandingSidebar,
  FormInput,
  HelpDrawer,
  LoadingButton,
  MobileLogo,
  PasswordInput,
  RememberMeSwitch,
} from './components'

export default function LoginPage() {
  const router = useRouter()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  const {
    formData,
    formErrors,
    isLoading,
    handleInputChange,
    handleSwitchChange,
    handleInputBlur,
    handleSubmit,
  } = useLoginForm()

  return (
    <div className="min-h-screen h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center overflow-hidden">
      <BackgroundEffects />

      <div className="w-full h-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 xl:gap-8 items-center relative z-10 p-3 md:p-4 lg:p-6">
        <BrandingSidebar />

        {/* Login Form Container */}
        <div className="w-full max-w-lg mx-auto h-full flex flex-col justify-center">
          <div className="bg-[#141414] border border-gray-800 rounded-xl lg:rounded-2xl p-4 md:p-5 lg:p-6 shadow-2xl backdrop-blur-xl max-h-[calc(100vh-1.5rem)] md:max-h-[calc(100vh-2rem)] lg:max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
            <MobileLogo />

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
              <FormInput
                label="Email or Phone Number"
                type="text"
                name="login"
                value={formData.login}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur('login')}
                placeholder="your.email@company.com or +1234567890"
                error={formErrors.login}
                required
              />

              <PasswordInput
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                onBlur={() => handleInputBlur('password')}
                placeholder="Enter your password"
                error={formErrors.password}
                required
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between pt-0.5">
                <RememberMeSwitch
                  checked={formData.rememberMe}
                  onCheckedChange={handleSwitchChange}
                />
                
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(true)}
                  className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <LoadingButton
                type="submit"
                isLoading={isLoading}
                loadingText="Signing in..."
              >
                Sign In
              </LoadingButton>
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

      <HelpDrawer isOpen={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  )
}