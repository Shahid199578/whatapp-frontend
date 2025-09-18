// src/components/phone-numbers/VerifyPhoneModal.tsx
'use client';

import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PhoneNumber {
  _id: string;
  phoneNumber: string;
  displayPhoneNumber: string;
  whatsappBusinessPhoneNumberId: string;
  verificationStatus: string;
}

interface VerifyPhoneModalProps {
  isOpen: boolean;
  phoneNumber: PhoneNumber;
  onClose: () => void;
  onVerified: () => void;
}

export function VerifyPhoneModal({ isOpen, phoneNumber, onClose, onVerified }: VerifyPhoneModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    setLoading(true);
    setError('');

    try {
      // In a real app, you'd call an API to verify the phone number
      // For now, we'll simulate verification
      setTimeout(() => {
        setLoading(false);
        onVerified();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'Failed to verify phone number');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h3 className="text-lg font-medium text-gray-900">Verify Phone Number</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Verify your WhatsApp Business phone number:
              </p>
              <p className="text-lg font-medium text-gray-900 mb-6">
                {phoneNumber.displayPhoneNumber}
              </p>
              
              <div className="space-y-4">
                <button
                  onClick={handleVerify}
                  disabled={loading}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Verifying...' : 'Start Verification'}
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
