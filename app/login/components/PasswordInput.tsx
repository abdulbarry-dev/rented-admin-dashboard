/**
 * PasswordInput Component
 * 
 * Password input field with visibility toggle functionality.
 * Includes label, error display, and accessibility features.
 * 
 * @component
 */

import { useState, InputHTMLAttributes } from 'react'
import { Eye, EyeOff } from 'lucide-react'

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string
  error?: string
  name: string
  onBlur?: () => void
}

export function PasswordInput({ 
  label, 
  error, 
  name, 
  onBlur,
  className = '',
  ...inputProps 
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const hasError = Boolean(error)
  const inputId = inputProps.id || name
  const errorId = `${name}-error`

  const toggleVisibility = () => {
    setShowPassword(prev => !prev)
  }

  return (
    <div className="space-y-0.5">
      <label 
        htmlFor={inputId} 
        className="block text-xs font-medium text-gray-300"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={showPassword ? 'text' : 'password'}
          onBlur={onBlur}
          className={`w-full px-3 py-1.5 pr-10 rounded-lg border bg-[#1a1a1a] text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
            hasError 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-700 focus:ring-purple-500'
          } ${className}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          {...inputProps}
        />
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-300 transition-colors z-10 cursor-pointer"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>
      {hasError && (
        <p 
          id={errorId}
          className="text-xs text-red-500 mt-1 flex items-center gap-1"
          role="alert"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
