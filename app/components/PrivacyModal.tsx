'use client';

import Modal from './Modal';
import { privacyContent } from '../content/privacy';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrivacyModal({ isOpen, onClose }: PrivacyModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Privacy Policy">
      <div className="text-gray-300 space-y-6">
        <div className="bg-blue-600/10 border border-blue-600/20 rounded-lg p-4">
          <p className="text-sm text-blue-300">
            <strong>Last Updated:</strong> {privacyContent.lastUpdated}
          </p>
          <p className="text-sm text-blue-300 mt-2">
            Your privacy is important to us. This policy outlines how we collect, 
            use, and protect your information.
          </p>
        </div>

        {privacyContent.sections.map((section, index) => (
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
            We are committed to protecting your privacy and ensuring the security 
            of your personal information. If you have any questions or concerns, 
            please don't hesitate to contact us.
          </p>
        </div>
      </div>
    </Modal>
  );
}
