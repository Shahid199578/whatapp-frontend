// src/components/phone-numbers/AddPhoneNumberModal.tsx
'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

interface AddPhoneNumberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (phoneData: any) => Promise<void>;
}

export function AddPhoneNumberModal({ isOpen, onClose, onSave }: AddPhoneNumberModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    displayPhoneNumber: '',
    whatsappBusinessPhoneNumberId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^\+\d{10,15}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Invalid phone number format (use +1234567890)';
    }

    if (!formData.displayPhoneNumber.trim()) {
      newErrors.displayPhoneNumber = 'Display phone number is required';
    }

    if (!formData.whatsappBusinessPhoneNumberId.trim()) {
      newErrors.whatsappBusinessPhoneNumberId = 'WhatsApp Business Phone Number ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      
      // Reset form
      setFormData({
        phoneNumber: '',
        displayPhoneNumber: '',
        whatsappBusinessPhoneNumberId: '',
      });
      setErrors({});
    } catch (error: any) {
      setErrors({ 
        general: error.response?.data?.message || 'Failed to add phone number' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
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
                  Add Phone Number
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                {/* Info Alert */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex">
                    <InformationCircleIcon className="h-5 w-5 text-blue-400 flex-shrink-0" />
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        You'll need your WhatsApp Business Phone Number ID from Meta Business Manager. 
                        After adding, you'll need to verify the number.
                      </p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                      {errors.general}
                    </div>
                  )}

                  {/* Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                        errors.phoneNumber ? 'border-red-300' : ''
                      }`}
                      placeholder="+1234567890"
                      required
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Enter in international format (e.g., +1234567890)
                    </p>
                  </div>

                  {/* Display Phone Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.displayPhoneNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, displayPhoneNumber: e.target.value }))}
                      className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                        errors.displayPhoneNumber ? 'border-red-300' : ''
                      }`}
                      placeholder="+1 (234) 567-8900"
                      required
                    />
                    {errors.displayPhoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.displayPhoneNumber}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Formatted number for display purposes
                    </p>
                  </div>

                  {/* WhatsApp Business Phone Number ID */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      WhatsApp Business Phone Number ID *
                    </label>
                    <input
                      type="text"
                      value={formData.whatsappBusinessPhoneNumberId}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsappBusinessPhoneNumberId: e.target.value }))}
                      className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                        errors.whatsappBusinessPhoneNumberId ? 'border-red-300' : ''
                      }`}
                      placeholder="102290129340398"
                      required
                    />
                    {errors.whatsappBusinessPhoneNumberId && (
                      <p className="mt-1 text-sm text-red-600">{errors.whatsappBusinessPhoneNumberId}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Find this in your Meta Business Manager under WhatsApp Business API
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-grey bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Adding...' : 'Add Phone Number'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
