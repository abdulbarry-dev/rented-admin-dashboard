/**
 * MobileLogo Component
 * 
 * Displays the application logo on mobile devices.
 * Hidden on large screens where the branding sidebar is visible.
 * 
 * @component
 */

import { Sparkles } from 'lucide-react'

export function MobileLogo() {
  return (
    <div className="lg:hidden flex items-center justify-center gap-2 mb-3">
      <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-white" />
      </div>
      <span className="text-base font-bold">HR Manager</span>
    </div>
  )
}
