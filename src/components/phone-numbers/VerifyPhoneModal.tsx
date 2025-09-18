// src/components/phone-numbers/VerifyPhoneModal.tsx
'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { PhoneNumber } from '@/types';
import { apiClient } from '@/lib/api';

interface VerifyPhoneModalProps {
  isOpen: boolean;
  phoneNumber: PhoneNumber;
  onClose: () => void;
  onVerified: () => void;
}

export function VerifyPhoneModal({ isOpen, phoneNumber, onClose, onVerified }: VerifyPhoneModalProps) {
  const [loading, setLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');

  const handleRequestCode = async () => {
    setLoading(true);
    setError('');
    
    try {
      await apiClient.client.post(`/phone-numbers/${phoneNumber.id}/request-verification`);
      setStep('verify');
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to request verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await apiClient.client.post(`/phone-numbers/${phoneNumber.id}/verify`, {
        verificationCode: verificationCode
      });
      
      onVerified();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('request');
    setVerificationCode('');
    setError('');
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-6 w-6 text-blue-600 mr-2" />
                    Verify Phone Number
                  </div>
                  <button
                    onClick={handleClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <div className="mt-4">
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>Phone Number:</strong> {phoneNumber.displayPhoneNumber}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      WhatsApp ID: {phoneNumber.whatsappBusinessPhoneNumberId}
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  {step === 'request' ? (
                    <div>
                      <p className="text-sm text-gray-600 mb-6">
                        WhatsApp will send a verification code to your phone number. 
                        Make sure you can receive messages on this number.
                      </p>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={handleClose}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleRequestCode}
                          disabled={loading}
                          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? 'Requesting...' : 'Request Verification Code'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleVerifyCode}>
                      <p className="text-sm text-gray-600 mb-4">
                        Enter the 6-digit verification code sent to your WhatsApp number.
                      </p>
                      
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Verification Code
                        </label>
                        <input
                          type="text"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          className="w-full text-center text-2xl tracking-widest rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          placeholder="000000"
                          maxLength={6}
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setStep('request')}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          disabled={loading || verificationCode.length !== 6}
                          className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          {loading ? 'Verifying...' : 'Verify'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
