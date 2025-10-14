/**
 * useLoginForm Hook
 * 
 * Custom hook for managing login form state and controller integration.
 * Handles form data, errors, validation, and submission.
 * 
 * @hook
 */

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LoginController } from '@/lib/controllers/LoginController'
import { LoadingState } from '@/lib/types'

interface FormData {
  login: string
  password: string
  rememberMe: boolean
}

interface UseLoginFormReturn {
  formData: FormData
  formErrors: Record<string, string>
  loadingState: LoadingState
  isLoading: boolean
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSwitchChange: (checked: boolean) => void
  handleInputBlur: (fieldName: string) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  getController: () => LoginController
}

export function useLoginForm(): UseLoginFormReturn {
  const router = useRouter()
  const controllerRef = useRef<LoginController | null>(null)
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE)
  const [formData, setFormData] = useState<FormData>({
    login: '',
    password: '',
    rememberMe: false
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Initialize controller
  useEffect(() => {
    if (!controllerRef.current) {
      const controller = new LoginController()
      
      // Setup event handlers
      controller.setStateChangeHandler((state) => {
        setLoadingState(state)
      })
      
      controller.setSuccessHandler(() => {
        router.push('/dashboard')
      })
      
      controllerRef.current = controller
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
    const fieldName = name as 'login' | 'password' | 'rememberMe'
    const finalValue = type === 'checkbox' ? checked : value
    
    // Update controller
    getController().setFieldValue(fieldName, finalValue)
    
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

  const handleSwitchChange = (checked: boolean) => {
    const mockEvent = {
      target: {
        name: 'rememberMe',
        type: 'checkbox',
        checked: checked,
        value: String(checked)
      }
    } as React.ChangeEvent<HTMLInputElement>
    
    handleInputChange(mockEvent)
  }

  const handleInputBlur = (fieldName: string) => {
    const typedFieldName = fieldName as 'login' | 'password' | 'rememberMe'
    getController().touchField(typedFieldName)
    
    // Update errors state
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
      // Update form errors
      setFormErrors(getController().getFormErrors())
    }
  }

  const isLoading = loadingState === LoadingState.LOADING

  return {
    formData,
    formErrors,
    loadingState,
    isLoading,
    handleInputChange,
    handleSwitchChange,
    handleInputBlur,
    handleSubmit,
    getController,
  }
}
