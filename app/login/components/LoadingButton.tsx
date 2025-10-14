/**
 * LoadingButton Component
 * 
 * Button with loading state and spinner animation.
 * Automatically disables during loading state.
 * 
 * @component
 */

import { ButtonHTMLAttributes } from 'react'

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean
  loadingText?: string
  children: React.ReactNode
}

export function LoadingButton({ 
  isLoading, 
  loadingText = 'Loading...',
  children,
  className = '',
  ...buttonProps 
}: LoadingButtonProps) {
  return (
    <button
      disabled={isLoading}
      className={`w-full mt-3 py-2.5 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-semibold shadow-lg shadow-purple-600/20 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${className}`}
      {...buttonProps}
    >
      {isLoading ? (
        <div className="flex items-center justify-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span>{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}
