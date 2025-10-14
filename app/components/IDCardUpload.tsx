'use client';

import { useState, useEffect, useRef } from 'react';
import { Upload, X, CheckCircle2, FileText, AlertCircle } from 'lucide-react';
import { useFileUpload } from '../lib/hooks/useFileUpload';
import { FileUploadZone } from './FileUploadZone';
import { StepIndicators } from './StepIndicator';

interface IDCardUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (files: { front: File; back: File }) => void;
  isSubmitting?: boolean;
}

export default function IDCardUpload({ isOpen, onClose, onUploadComplete, isSubmitting = false }: IDCardUploadProps) {
  const [isValidConfirmed, setIsValidConfirmed] = useState(false);
  const [isDragging, setIsDragging] = useState<'front' | 'back' | null>(null);
  
  const frontUpload = useFileUpload();
  const backUpload = useFileUpload();
  
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Focus management and keyboard handling
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    const modalElement = modalRef.current;
    if (!modalElement) return;

    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    modalElement.addEventListener('keydown', handleTab as EventListener);
    return () => modalElement.removeEventListener('keydown', handleTab as EventListener);
  }, [isOpen]);

  const handleDrop = (e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    setIsDragging(null);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      if (side === 'front') {
        frontUpload.handleFileSelect(file);
      } else {
        backUpload.handleFileSelect(file);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent, side: 'front' | 'back') => {
    e.preventDefault();
    setIsDragging(side);
  };

  const handleDragLeave = () => {
    setIsDragging(null);
  };

  const handleSubmit = () => {
    if (!frontUpload.file || !backUpload.file || !isValidConfirmed) return;

    const frontFile = frontUpload.file.file;
    const backFile = backUpload.file.file;

    // Call parent callback with the files
    onUploadComplete({ front: frontFile, back: backFile });
  };

  const canSubmit = frontUpload.file && backUpload.file && isValidConfirmed && !frontUpload.isLoading && !backUpload.isLoading && !isSubmitting;

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div 
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#141414] border border-gray-800 rounded-2xl shadow-2xl flex flex-col animate-slideUp overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800">
          <h2 id="modal-title" className="text-xl sm:text-2xl font-bold text-white">
            Upload ID Card
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {/* Step Indicators */}
          <StepIndicators 
            frontCompleted={!!frontUpload.file}
            backCompleted={!!backUpload.file}
          />

          {/* Upload Areas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <FileUploadZone
              label="Front Page"
              file={frontUpload.file}
              error={frontUpload.error}
              isLoading={frontUpload.isLoading}
              isDragging={isDragging === 'front'}
              onFileSelect={frontUpload.handleFileSelect}
              onRemove={frontUpload.removeFile}
              onDrop={(e) => handleDrop(e, 'front')}
              onDragOver={(e) => handleDragOver(e, 'front')}
              onDragLeave={handleDragLeave}
              inputId="front-upload"
            />

            <FileUploadZone
              label="Back Page"
              file={backUpload.file}
              error={backUpload.error}
              isLoading={backUpload.isLoading}
              isDragging={isDragging === 'back'}
              onFileSelect={backUpload.handleFileSelect}
              onRemove={backUpload.removeFile}
              onDrop={(e) => handleDrop(e, 'back')}
              onDragOver={(e) => handleDragOver(e, 'back')}
              onDragLeave={handleDragLeave}
              inputId="back-upload"
            />
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-3 p-4 bg-gray-800/30 border border-gray-700 rounded-lg">
            <input
              type="checkbox"
              id="validity-confirm"
              checked={isValidConfirmed}
              onChange={(e) => setIsValidConfirmed(e.target.checked)}
              className="mt-0.5 w-5 h-5 rounded border-gray-600 bg-[#1a1a1a] text-purple-600 focus:ring-purple-500 focus:ring-offset-0 flex-shrink-0 cursor-pointer"
              aria-describedby="validity-description"
            />
            <label 
              htmlFor="validity-confirm" 
              id="validity-description"
              className="text-sm text-gray-300 cursor-pointer"
            >
              I confirm ID is valid until the expiry date and is in color.
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 sm:p-6 border-t border-gray-800 bg-[#0a0a0a]">
          <button
            onClick={onClose}
            className="px-4 sm:px-6 py-2.5 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`px-6 sm:px-8 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0a] ${
              canSubmit
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg shadow-purple-600/20 transform hover:scale-105'
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
            aria-disabled={!canSubmit}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" aria-hidden="true" />
                Submit Documents
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
