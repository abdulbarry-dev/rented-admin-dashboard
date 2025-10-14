'use client'

import { X, FileImage } from 'lucide-react'

interface ImagePreviewProps {
  file: File | null
  imageUrl?: string
  label: string
  onRemove?: () => void
  readonly?: boolean
}

export default function ImagePreview({ file, imageUrl, label, onRemove, readonly = false }: ImagePreviewProps) {
  const getPreviewUrl = () => {
    if (file) {
      return URL.createObjectURL(file)
    }
    return imageUrl
  }

  const previewUrl = getPreviewUrl()

  if (!previewUrl && !file) {
    return null
  }

  return (
    <div className="relative group">
      <div className="aspect-[3/2] rounded-lg overflow-hidden border-2 border-gray-700 bg-[#1a1a1a]">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={label}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileImage className="w-12 h-12 text-gray-600" />
          </div>
        )}
      </div>
      
      <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs font-medium text-white">
        {label}
      </div>

      {!readonly && onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100"
          aria-label={`Remove ${label}`}
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {file && (
        <div className="mt-2 text-xs text-gray-400">
          <p className="truncate">{file.name}</p>
          <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
        </div>
      )}
    </div>
  )
}
