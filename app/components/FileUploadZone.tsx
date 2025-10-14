'use client';

import { useRef } from 'react';
import { FileText, X, AlertCircle } from 'lucide-react';
import { FILE_VALIDATION } from './../../lib/validation/id-upload.schema';
import { UploadedFile } from '../../lib/hooks/useFileUpload';
import { isImageFile } from '../../lib/utils/file.utils';

interface FileUploadZoneProps {
  label: string;
  file: UploadedFile | null;
  error: string | null;
  isLoading: boolean;
  isDragging: boolean;
  onFileSelect: (file: File) => void;
  onRemove: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  inputId: string;
}

export const FileUploadZone: React.FC<FileUploadZoneProps> = ({
  label,
  file,
  error,
  isLoading,
  isDragging,
  onFileSelect,
  onRemove,
  onDrop,
  onDragOver,
  onDragLeave,
  inputId,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} <span className="text-red-400">*</span>
      </label>
      
      <div
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
          isDragging
            ? 'border-purple-500 bg-purple-600/10 scale-[1.02]'
            : file
            ? 'border-green-500 bg-green-600/10'
            : error
            ? 'border-red-500 bg-red-600/10'
            : 'border-gray-700 hover:border-gray-600 bg-[#1a1a1a]'
        }`}
        role="button"
        tabIndex={0}
        aria-label={`Upload ${label}`}
      >
        {isLoading ? (
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Processing file...</p>
          </div>
        ) : file ? (
          <div className="space-y-3">
            {isImageFile(file.file) ? (
              <img
                src={file.preview}
                alt={`${label} preview`}
                className="w-full h-32 object-contain mx-auto rounded"
              />
            ) : (
              <FileText className="w-16 h-16 mx-auto text-purple-500" />
            )}
            <p className="text-sm text-gray-300 font-medium truncate px-4">
              {file.file.name}
            </p>
            <p className="text-xs text-gray-400">
              {(file.file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
            >
              <X className="w-4 h-4" />
              Remove
            </button>
          </div>
        ) : (
          <>
            <FileText className="w-16 h-16 mx-auto text-purple-500 mb-4" />
            <p className="text-sm text-gray-400 mb-4">
              Please upload a copy of your valid identification in
              <br />
              <span className="font-medium text-gray-300">
                PNG, JPEG or PDF format
              </span>
              , no larger than{' '}
              <span className="font-medium text-gray-300">4MB</span> in size
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Drag and drop or click to browse
            </p>
            <input
              ref={inputRef}
              type="file"
              accept={FILE_VALIDATION.ACCEPTED_EXTENSIONS.join(',')}
              onChange={handleInputChange}
              className="hidden"
              id={inputId}
              aria-label={`Select ${label}`}
            />
            <label
              htmlFor={inputId}
              className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full transition-all cursor-pointer font-medium shadow-lg shadow-purple-600/20 transform hover:scale-105"
            >
              Choose File
            </label>
          </>
        )}
      </div>
      
      {error && (
        <div
          className="flex items-center gap-2 mt-2 text-red-400 text-sm animate-slideUp"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
