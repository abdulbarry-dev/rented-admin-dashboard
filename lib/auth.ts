import api from './apiClient'

export interface RegisterPayload {
  fullName: string
  email: string
  phone: string
  password: string
  passwordConfirmation: string
  gender: string
}

export interface RegisterWithDocumentsPayload extends RegisterPayload {
  idFront: File
  idBack: File
}

export async function register(payload: RegisterPayload) {
  const body = {
    name: payload.fullName,
    email: payload.email,
    phone_number: payload.phone,
    password: payload.password,
    password_confirmation: payload.passwordConfirmation,
    gender: payload.gender,
  }

  const res = await api.post('/admin/register', body)
  return res.data
}

/**
 * Register admin with ID documents in a single atomic transaction
 * This ensures the user is only created if documents are successfully uploaded
 */
export async function registerWithDocuments(payload: RegisterWithDocumentsPayload) {
  const formData = new FormData()
  
  // User data
  formData.append('name', payload.fullName)
  formData.append('email', payload.email)
  formData.append('phone_number', payload.phone)
  formData.append('password', payload.password)
  formData.append('password_confirmation', payload.passwordConfirmation)
  formData.append('gender', payload.gender)
  
  // ID documents
  formData.append('id_front', payload.idFront)
  formData.append('id_back', payload.idBack)

  const res = await api.post('/admin/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  
  return res.data
}
