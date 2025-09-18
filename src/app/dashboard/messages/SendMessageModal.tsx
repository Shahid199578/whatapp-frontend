// src/components/messages/SendMessageModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api';
import { PhoneNumber, MessageTemplate } from '@/types';

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (messageData: any) => Promise<void>;
}

export function SendMessageModal({ isOpen, onClose, onSend }: SendMessageModalProps) {
  const [formData, setFormData] = useState({
    phoneNumberId: '',
    to: '',
    type: 'text' as 'text' | 'template',
    content: {
      text: '',
    },
    templateId: '',
  });
  const [loading, setLoading] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      const [phoneNumbersData, templatesData] = await Promise.all([
        apiClient.getPhoneNumbers(),
        apiClient.getTemplates(),
      ]);
      setPhoneNumbers(phoneNumbersData.filter((p: PhoneNumber) => p.status === 'active'));
      setTemplates(templatesData.filter((t: MessageTemplate) => t.status === 'approved'));
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSend(formData);
      setFormData({
        phoneNumberId: '',
        to: '',
        type: 'text',
        content: { text: '' },
        templateId: '',
      });
    } catch (error) {
      console.error('Failed to send message:', error);
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
                  Send WhatsApp Message
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {/* Phone Number Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Phone Number
                    </label>
                    <select
                      value={formData.phoneNumberId}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    >
                      <option value="">Select phone number</option>
                      {phoneNumbers.map((phone) => (
                        <option key={phone.id} value={phone.id}>
                          {phone.displayPhoneNumber} ({phone.qualityRating} quality)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Recipient */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To
                    </label>
                    <input
                      type="tel"
                      value={formData.to}
                      onChange={(e) => setFormData(prev => ({ ...prev, to: e.target.value }))}
                      placeholder="+1234567890"
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      required
                    />
                  </div>

                  {/* Message Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        type: e.target.value as 'text' | 'template' 
                      }))}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="text">Text Message</option>
                      <option value="template">Template Message</option>
                    </select>
                  </div>

                  {/* Template Selection (if template type) */}
                  {formData.type === 'template' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Template
                      </label>
                      <select
                        value={formData.templateId}
                        onChange={(e) => setFormData(prev => ({ ...prev, templateId: e.target.value }))}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        required
                      >
                        <option value="">Select template</option>
                        {templates.map((template) => (
                          <option key={template.id} value={template.id}>
                            {template.templateName} ({template.category})
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Message Content (if text type) */}
                  {formData.type === 'text' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message
                      </label>
                      <textarea
                        value={formData.content.text}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          content: { ...prev.content, text: e.target.value }
                        }))}
                        rows={4}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        placeholder="Type your message here..."
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {formData.content.text.length}/1000 characters
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Send Message'}
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
