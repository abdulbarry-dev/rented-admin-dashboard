/**
 * BrandingSidebar Component
 * 
 * Displays branding information and key features on the login page.
 * Hidden on mobile devices, visible on large screens (lg breakpoint and above).
 * 
 * @component
 */

import { Sparkles } from 'lucide-react'

interface Feature {
  id: string
  text: string
}

const FEATURES: Feature[] = [
  { id: 'secure-auth', text: 'Secure authentication system' },
  { id: 'any-device', text: 'Access from any device' },
  { id: '24-7-support', text: '24/7 support available' },
]

export function BrandingSidebar() {
  return (
    <div className="hidden lg:flex flex-col gap-4 xl:gap-5 justify-center max-w-lg mx-auto">
      {/* Logo and Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg xl:text-xl font-bold leading-tight">HR Manager</h1>
          <p className="text-xs text-gray-400">Admin Dashboard</p>
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="space-y-3 xl:space-y-4">
        <h2 className="text-2xl xl:text-3xl font-bold leading-tight">
          Welcome Back<br />
          <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            to Your Dashboard
          </span>
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          Access your HR management tools and continue managing your workforce with ease.
        </p>
        
        {/* Features List */}
        <ul className="space-y-2.5 pt-1" role="list">
          {FEATURES.map((feature) => (
            <li key={feature.id} className="flex items-center gap-2.5 text-gray-300 text-sm">
              <div className="w-6 h-6 rounded-full bg-purple-600/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-500 text-xs" aria-hidden="true">✓</span>
              </div>
              <span>{feature.text}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
