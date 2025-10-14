'use client'

import { useEffect, useState, useRef } from 'react'
import { 
  Upload, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  FileImage,
  Sparkles,
  RefreshCw,
  ShieldCheck
} from 'lucide-react'
import { useVerification } from '../../lib/hooks/useVerification'
import ImagePreview from '../components/ImagePreview'
import { validateFileType, validateFileSize } from '../../lib/utils/file.utils'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export default function VerificationPage() {
  const { requirements, loading, submitting, fetchRequirements, handleSubmit, handleResubmit } = useVerification()
  
  const [frontFile, setFrontFile] = useState<File | null>(null)
  const [backFile, setBackFile] = useState<File | null>(null)
  const [frontError, setFrontError] = useState<string>('')
  const [backError, setBackError] = useState<string>('')
  
  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchRequirements()
  }, [fetchRequirements])

  const validateFile = (file: File): string => {
    if (!validateFileType(file, ALLOWED_TYPES)) {
      return 'Only JPEG, PNG, and WebP images are allowed'
    }
    if (!validateFileSize(file, MAX_FILE_SIZE)) {
      return `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
    }
    return ''
  }

  const handleFileSelect = (file: File, side: 'front' | 'back') => {
    const error = validateFile(file)
    
    if (side === 'front') {
      setFrontError(error)
      if (!error) setFrontFile(file)
    } else {
      setBackError(error)
      if (!error) setBackFile(file)
    }
  }

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file, 'front')
  }

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file, 'back')
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!frontFile || !backFile) {
      if (!frontFile) setFrontError('Front ID image is required')
      if (!backFile) setBackError('Back ID image is required')
      return
    }

    const isResubmit = requirements?.can_resubmit && requirements?.status === 'rejected'
    const success = isResubmit
      ? await handleResubmit({ front: frontFile, back: backFile })
      : await handleSubmit({ front: frontFile, back: backFile })

    if (success) {
      setFrontFile(null)
      setBackFile(null)
      if (frontInputRef.current) frontInputRef.current.value = ''
      if (backInputRef.current) backInputRef.current.value = ''
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-600/20 border border-green-600/50 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm font-medium text-green-400">Approved</span>
          </div>
        )
      case 'rejected':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-600/20 border border-red-600/50 rounded-lg">
            <XCircle className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-red-400">Rejected</span>
          </div>
        )
      case 'pending':
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-600/20 border border-yellow-600/50 rounded-lg">
            <Clock className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-400">Under Review</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-600/20 border border-gray-600/50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-400">Not Submitted</span>
          </div>
        )
    }
  }

  const canUpload = requirements?.status === 'not_submitted' || 
                    (requirements?.status === 'rejected' && requirements?.can_resubmit)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading verification status...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] p-4 sm:p-6 lg:p-8">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">ID Verification</h1>
              <p className="text-gray-400">Upload your identification documents for verification</p>
            </div>
          </div>
        </div>

        {/* Current Status Card */}
        {requirements && requirements.status !== 'not_submitted' && (
          <div className="bg-[#141414] border border-gray-800 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Verification Status</h2>
              {getStatusBadge(requirements.status)}
            </div>

            {requirements.remarks && (
              <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-300 mb-1">Admin Remarks</p>
                    <p className="text-sm text-gray-400">{requirements.remarks}</p>
                  </div>
                </div>
              </div>
            )}

            {requirements.documents && requirements.documents.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Submitted Documents</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {requirements.documents.map((doc, index) => (
                    <ImagePreview
                      key={index}
                      file={null}
                      imageUrl={doc.url || doc.path}
                      label={doc.type === 'front' ? 'Front ID' : 'Back ID'}
                      readonly={true}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload Form */}
        {canUpload ? (
          <div className="bg-[#141414] border border-gray-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Upload className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold">
                {requirements?.status === 'rejected' ? 'Resubmit Documents' : 'Upload Documents'}
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Front ID Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Front of ID Card <span className="text-red-500">*</span>
                  </label>
                  
                  {frontFile ? (
                    <ImagePreview
                      file={frontFile}
                      label="Front ID"
                      onRemove={() => {
                        setFrontFile(null)
                        setFrontError('')
                        if (frontInputRef.current) frontInputRef.current.value = ''
                      }}
                    />
                  ) : (
                    <div
                      onClick={() => frontInputRef.current?.click()}
                      className="aspect-[3/2] border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-lg bg-[#1a1a1a] flex flex-col items-center justify-center cursor-pointer transition-colors group"
                    >
                      <FileImage className="w-12 h-12 text-gray-600 group-hover:text-purple-500 transition-colors mb-2" />
                      <p className="text-sm text-gray-400 group-hover:text-gray-300">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP (Max 5MB)</p>
                    </div>
                  )}
                  
                  <input
                    ref={frontInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleFrontChange}
                    className="hidden"
                  />
                  
                  {frontError && (
                    <div className="flex items-center gap-1.5 text-red-500 text-sm mt-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{frontError}</span>
                    </div>
                  )}
                </div>

                {/* Back ID Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Back of ID Card <span className="text-red-500">*</span>
                  </label>
                  
                  {backFile ? (
                    <ImagePreview
                      file={backFile}
                      label="Back ID"
                      onRemove={() => {
                        setBackFile(null)
                        setBackError('')
                        if (backInputRef.current) backInputRef.current.value = ''
                      }}
                    />
                  ) : (
                    <div
                      onClick={() => backInputRef.current?.click()}
                      className="aspect-[3/2] border-2 border-dashed border-gray-700 hover:border-purple-500 rounded-lg bg-[#1a1a1a] flex flex-col items-center justify-center cursor-pointer transition-colors group"
                    >
                      <FileImage className="w-12 h-12 text-gray-600 group-hover:text-purple-500 transition-colors mb-2" />
                      <p className="text-sm text-gray-400 group-hover:text-gray-300">Click to upload</p>
                      <p className="text-xs text-gray-500 mt-1">JPEG, PNG, WebP (Max 5MB)</p>
                    </div>
                  )}
                  
                  <input
                    ref={backInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleBackChange}
                    className="hidden"
                  />
                  
                  {backError && (
                    <div className="flex items-center gap-1.5 text-red-500 text-sm mt-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{backError}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting || !frontFile || !backFile}
                className={`w-full font-medium py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2 ${
                  submitting || !frontFile || !backFile
                    ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-600/20'
                }`}
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {requirements?.status === 'rejected' ? 'Resubmitting...' : 'Submitting...'}
                  </>
                ) : (
                  <>
                    {requirements?.status === 'rejected' ? (
                      <>
                        <RefreshCw className="w-5 h-5" />
                        Resubmit Verification
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Submit for Verification
                      </>
                    )}
                  </>
                )}
              </button>

              {/* Info Notice */}
              <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-300">
                    <p className="font-medium mb-1">Important Information</p>
                    <ul className="list-disc list-inside space-y-1 text-gray-400">
                      <li>Ensure your ID is valid and not expired</li>
                      <li>Images should be clear and readable</li>
                      <li>All text and photos must be visible</li>
                      <li>Verification typically takes 24-48 hours</li>
                    </ul>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : requirements?.status === 'pending' ? (
          <div className="bg-[#141414] border border-gray-800 rounded-xl p-8 text-center">
            <Clock className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verification in Progress</h3>
            <p className="text-gray-400">
              Your documents are being reviewed. You'll be notified once the verification is complete.
            </p>
          </div>
        ) : requirements?.status === 'approved' ? (
          <div className="bg-[#141414] border border-gray-800 rounded-xl p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Verification Complete</h3>
            <p className="text-gray-400">
              Your identity has been successfully verified. You have full access to all features.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
