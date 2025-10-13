'use client';

import Modal from './Modal';
import { termsContent } from '../content/terms';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Terms & Conditions">
      <div className="text-gray-300 space-y-6">
        <div className="bg-purple-600/10 border border-purple-600/20 rounded-lg p-4">
          <p className="text-sm text-purple-300">
            <strong>Last Updated:</strong> {termsContent.lastUpdated}
          </p>
        </div>

        {termsContent.sections.map((section, index) => (
          <section key={index} className="space-y-3">
            <h3 className="text-lg font-semibold text-white">
              {section.title}
            </h3>
            <div className="text-gray-300 leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
          </section>
        ))}

        <div className="mt-8 pt-6 border-t border-gray-700">
          <p className="text-sm text-gray-400 italic">
            By using HR Manager, you acknowledge that you have read, understood, 
            and agree to be bound by these Terms & Conditions.
          </p>
        </div>
      </div>
    </Modal>
  );
}
