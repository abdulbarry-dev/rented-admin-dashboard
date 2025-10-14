import api from './apiClient'

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'not_submitted'

export interface VerificationDocument {
  type: 'front' | 'back'
  path: string
  url?: string
}

export interface VerificationRequirements {
  status: VerificationStatus
  documents: VerificationDocument[]
  remarks: string | null
  can_resubmit: boolean
  required_documents: string[]
}

export interface VerificationSubmitPayload {
  front: File
  back: File
}

export interface VerificationResponse {
  success: boolean
  message: string
  data?: {
    status: VerificationStatus
    documents: VerificationDocument[]
  }
}

/**
 * Fetch verification requirements and current status
 */
export async function getVerificationRequirements(): Promise<VerificationRequirements> {
  const response = await api.get<VerificationRequirements>('/admin/verification/requirements')
  return response.data
}

/**
 * Submit ID verification for the first time
 */
export async function submitVerification(payload: VerificationSubmitPayload): Promise<VerificationResponse> {
  const formData = new FormData()
  formData.append('front', payload.front)
  formData.append('back', payload.back)

  const response = await api.post<VerificationResponse>('/admin/verification/submit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  return response.data
}

/**
 * Resubmit ID verification after rejection
 */
export async function resubmitVerification(payload: VerificationSubmitPayload): Promise<VerificationResponse> {
  const formData = new FormData()
  formData.append('front', payload.front)
  formData.append('back', payload.back)

  const response = await api.post<VerificationResponse>('/admin/verification/resubmit', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  return response.data
}
