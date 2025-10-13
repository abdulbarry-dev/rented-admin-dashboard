'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      // Focus on close button when modal opens
      closeButtonRef.current?.focus();
    }

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#141414] border border-gray-800 rounded-2xl shadow-2xl flex flex-col animate-slideUp"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800">
          <h2
            id="modal-title"
            className="text-xl sm:text-2xl font-bold text-white pr-8"
          >
            {title}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700 text-gray-400 hover:text-white transition-all focus:outline-none focus:ring-2 focus:ring-purple-500"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-4 sm:p-6 prose prose-invert prose-sm sm:prose-base max-w-none scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {children}
        </div>

        {/* Footer with Close Button */}
        <div className="flex justify-end p-4 sm:p-6 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#141414]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
