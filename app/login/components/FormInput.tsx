/**
 * FormInput Component
 * 
 * Reusable form input with label, error display, and validation states.
 * Supports all standard input types and includes accessibility features.
 * 
 * @component
 */

import { InputHTMLAttributes } from 'react'

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  name: string
  onBlur?: () => void
}

export function FormInput({ 
  label, 
  error, 
  name, 
  onBlur,
  className = '',
  ...inputProps 
}: FormInputProps) {
  const hasError = Boolean(error)
  const inputId = inputProps.id || name
  const errorId = `${name}-error`

  return (
    <div className="space-y-0.5">
      <label 
        htmlFor={inputId} 
        className="block text-xs font-medium text-gray-300"
      >
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        onBlur={onBlur}
        className={`w-full px-3 py-1.5 rounded-lg border bg-[#1a1a1a] text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
          hasError 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-700 focus:ring-purple-500'
        } ${className}`}
        aria-invalid={hasError}
        aria-describedby={hasError ? errorId : undefined}
        {...inputProps}
      />
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
