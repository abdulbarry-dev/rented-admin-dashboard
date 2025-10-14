'use client'

import { useState, useCallback } from 'react'
import {
  getVerificationRequirements,
  submitVerification,
  resubmitVerification,
  VerificationRequirements,
  VerificationSubmitPayload,
  VerificationStatus,
} from '../../../lib/verification'
import { toast } from 'sonner'

interface UseVerificationReturn {
  requirements: VerificationRequirements | null
  loading: boolean
  submitting: boolean
  error: string | null
  fetchRequirements: () => Promise<void>
  handleSubmit: (payload: VerificationSubmitPayload) => Promise<boolean>
  handleResubmit: (payload: VerificationSubmitPayload) => Promise<boolean>
}

export function useVerification(): UseVerificationReturn {
  const [requirements, setRequirements] = useState<VerificationRequirements | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRequirements = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await getVerificationRequirements()
      setRequirements(data)
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to fetch verification requirements'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSubmit = useCallback(async (payload: VerificationSubmitPayload): Promise<boolean> => {
    setSubmitting(true)
    setError(null)

    try {
      const response = await submitVerification(payload)
      
      if (response.success) {
        toast.success(response.message || 'Verification submitted successfully')
        await fetchRequirements()
        return true
      } else {
        toast.error(response.message || 'Verification submission failed')
        return false
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to submit verification'
      setError(errorMessage)
      
      if (err?.response?.data?.errors) {
        const errors = err.response.data.errors
        Object.keys(errors).forEach((key) => {
          const messages = Array.isArray(errors[key]) ? errors[key] : [errors[key]]
          toast.error(messages[0])
        })
      } else {
        toast.error(errorMessage)
      }
      
      return false
    } finally {
      setSubmitting(false)
    }
  }, [fetchRequirements])

  const handleResubmit = useCallback(async (payload: VerificationSubmitPayload): Promise<boolean> => {
    setSubmitting(true)
    setError(null)

    try {
      const response = await resubmitVerification(payload)
      
      if (response.success) {
        toast.success(response.message || 'Verification resubmitted successfully')
        await fetchRequirements()
        return true
      } else {
        toast.error(response.message || 'Verification resubmission failed')
        return false
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to resubmit verification'
      setError(errorMessage)
      
      if (err?.response?.data?.errors) {
        const errors = err.response.data.errors
        Object.keys(errors).forEach((key) => {
          const messages = Array.isArray(errors[key]) ? errors[key] : [errors[key]]
          toast.error(messages[0])
        })
      } else {
        toast.error(errorMessage)
      }
      
      return false
    } finally {
      setSubmitting(false)
    }
  }, [fetchRequirements])

  return {
    requirements,
    loading,
    submitting,
    error,
    fetchRequirements,
    handleSubmit,
    handleResubmit,
  }
}
