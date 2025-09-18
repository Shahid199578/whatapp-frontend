// src/components/templates/CreateTemplateModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api';
import { PhoneNumber } from '@/types';

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (templateData: any) => Promise<void>;
}

interface Button {
  type: 'QUICK_REPLY' | 'URL' | 'PHONE_NUMBER';
  text: string;
  url?: string;
  phone_number?: string;
}

export function CreateTemplateModal({ isOpen, onClose, onSave }: CreateTemplateModalProps) {
  const [loading, setLoading] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [formData, setFormData] = useState({
    phoneNumberId: '',
    templateName: '',
    language: 'en',
    category: 'UTILITY',
    headerType: '',
    headerText: '',
    bodyText: '',
    footerText: '',
    buttons: [] as Button[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      fetchPhoneNumbers();
    }
  }, [isOpen]);

  const fetchPhoneNumbers = async () => {
    try {
      const response = await apiClient.getPhoneNumbers();
      setPhoneNumbers(response.filter((p: PhoneNumber) => p.status === 'active'));
    } catch (error) {
      console.error('Failed to fetch phone numbers:', error);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.phoneNumberId) {
      newErrors.phoneNumberId = 'Please select a phone number';
    }
    if (!formData.templateName.trim()) {
      newErrors.templateName = 'Template name is required';
    }
    if (!formData.bodyText.trim()) {
      newErrors.bodyText = 'Body text is required';
    }
    if (formData.bodyText.length > 1024) {
      newErrors.bodyText = 'Body text must be less than 1024 characters';
    }
    if (formData.headerText && formData.headerText.length > 60) {
      newErrors.headerText = 'Header text must be less than 60 characters';
    }
    if (formData.footerText && formData.footerText.length > 60) {
      newErrors.footerText = 'Footer text must be less than 60 characters';
    }

    // Validate buttons
    formData.buttons.forEach((button, index) => {
      if (!button.text.trim()) {
        newErrors[`button_${index}_text`] = 'Button text is required';
      }
      if (button.type === 'URL' && !button.url?.trim()) {
        newErrors[`button_${index}_url`] = 'URL is required for URL buttons';
      }
      if (button.type === 'PHONE_NUMBER' && !button.phone_number?.trim()) {
        newErrors[`button_${index}_phone`] = 'Phone number is required';
      }
    });

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
      const templateData = {
        ...formData,
        buttons: formData.buttons.length > 0 ? formData.buttons : undefined,
        headerType: formData.headerText ? 'TEXT' : undefined,
      };
      
      await onSave(templateData);
      
      // Reset form
      setFormData({
        phoneNumberId: '',
        templateName: '',
        language: 'en',
        category: 'UTILITY',
        headerType: '',
        headerText: '',
        bodyText: '',
        footerText: '',
        buttons: [],
      });
      setErrors({});
    } catch (error) {
      console.error('Failed to create template:', error);
    } finally {
      setLoading(false);
    }
  };

  const addButton = () => {
    if (formData.buttons.length < 3) {
      setFormData(prev => ({
        ...prev,
        buttons: [...prev.buttons, { type: 'QUICK_REPLY', text: '' }]
      }));
    }
  };

  const removeButton = (index: number) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  const updateButton = (index: number, field: keyof Button, value: string) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons.map((button, i) => 
        i === index ? { ...button, [field]: value } : button
      )
    }));
  };

  // Extract variables from body text
  const extractVariables = (text: string) => {
    const matches = text.match(/\{\{(\d+)\}\}/g);
    return matches ? matches.map(match => match.replace(/[{}]/g, '')) : [];
  };

  const variables = extractVariables(formData.bodyText);

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
                >
                  Create Message Template
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  {/* Phone Number Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <select
                      value={formData.phoneNumberId}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumberId: e.target.value }))}
                      className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                        errors.phoneNumberId ? 'border-red-300' : ''
                      }`}
                      required
                    >
                      <option value="">Select phone number</option>
                      {phoneNumbers.map((phone) => (
                        <option key={phone.id} value={phone.id}>
                          {phone.displayPhoneNumber} ({phone.qualityRating} quality)
                        </option>
                      ))}
                    </select>
                    {errors.phoneNumberId && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumberId}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Template Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Template Name *
                      </label>
                      <input
                        type="text"
                        value={formData.templateName}
                        onChange={(e) => setFormData(prev => ({ ...prev, templateName: e.target.value }))}
                        className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                          errors.templateName ? 'border-red-300' : ''
                        }`}
                        placeholder="my_template_name"
                        required
                      />
                      {errors.templateName && (
                        <p className="mt-1 text-sm text-red-600">{errors.templateName}</p>
                      )}
                      <p className="mt-1 text-xs text-gray-500">
                        Lowercase, numbers, and underscores only
                      </p>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                        className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="it">Italian</option>
                        <option value="pt">Portuguese</option>
                        <option value="ru">Russian</option>
                        <option value="ar">Arabic</option>
                        <option value="hi">Hindi</option>
                      </select>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="UTILITY">Utility</option>
                      <option value="MARKETING">Marketing</option>
                      <option value="AUTHENTICATION">Authentication</option>
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Utility: Account updates, alerts. Marketing: Promotions, offers. Authentication: OTP, verification.
                    </p>
                  </div>

                  {/* Header Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Header Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.headerText}
                      onChange={(e) => setFormData(prev => ({ ...prev, headerText: e.target.value }))}
                      className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                        errors.headerText ? 'border-red-300' : ''
                      }`}
                      placeholder="Header text"
                      maxLength={60}
                    />
                    {errors.headerText && (
                      <p className="mt-1 text-sm text-red-600">{errors.headerText}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.headerText.length}/60 characters
                    </p>
                  </div>

                  {/* Body Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Body Text *
                    </label>
                    <textarea
                      value={formData.bodyText}
                      onChange={(e) => setFormData(prev => ({ ...prev, bodyText: e.target.value }))}
                      rows={4}
                      className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                        errors.bodyText ? 'border-red-300' : ''
                      }`}
                      placeholder="Your message body text. Use {{1}}, {{2}} for variables."
                      maxLength={1024}
                      required
                    />
                    {errors.bodyText && (
                      <p className="mt-1 text-sm text-red-600">{errors.bodyText}</p>
                    )}
                    <div className="flex justify-between mt-1">
                      <p className="text-xs text-gray-500">
                        Use {"{{1}}"}, {"{{2}}"} for dynamic content
                      </p>
                      <p className="text-xs text-gray-500">
                        {formData.bodyText.length}/1024 characters
                      </p>
                    </div>
                    
                    {/* Show detected variables */}
                    {variables.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700">Detected variables:</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {variables.map((variable, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800"
                            >
                              {`{{${variable}}}`}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Text */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Footer Text (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.footerText}
                      onChange={(e) => setFormData(prev => ({ ...prev, footerText: e.target.value }))}
                      className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                        errors.footerText ? 'border-red-300' : ''
                      }`}
                      placeholder="Footer text"
                      maxLength={60}
                    />
                    {errors.footerText && (
                      <p className="mt-1 text-sm text-red-600">{errors.footerText}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      {formData.footerText.length}/60 characters
                    </p>
                  </div>

                  {/* Buttons */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Buttons (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={addButton}
                        disabled={formData.buttons.length >= 3}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Add Button
                      </button>
                    </div>

                    {formData.buttons.map((button, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-lg mb-3">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="text-sm font-medium text-gray-700">Button {index + 1}</h4>
                          <button
                            type="button"
                            onClick={() => removeButton(index)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Button Type
                            </label>
                            <select
                              value={button.type}
                              onChange={(e) => updateButton(index, 'type', e.target.value)}
                              className="w-full text-sm rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                              <option value="QUICK_REPLY">Quick Reply</option>
                              <option value="URL">URL</option>
                              <option value="PHONE_NUMBER">Phone Number</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Button Text *
                            </label>
                            <input
                              type="text"
                              value={button.text}
                              onChange={(e) => updateButton(index, 'text', e.target.value)}
                              className={`w-full text-sm rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                errors[`button_${index}_text`] ? 'border-red-300' : ''
                              }`}
                              placeholder="Button text"
                              maxLength={20}
                            />
                            {errors[`button_${index}_text`] && (
                              <p className="mt-1 text-xs text-red-600">{errors[`button_${index}_text`]}</p>
                            )}
                          </div>
                        </div>

                        {button.type === 'URL' && (
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              URL *
                            </label>
                            <input
                              type="url"
                              value={button.url || ''}
                              onChange={(e) => updateButton(index, 'url', e.target.value)}
                              className={`w-full text-sm rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                errors[`button_${index}_url`] ? 'border-red-300' : ''
                              }`}
                              placeholder="https://example.com"
                            />
                            {errors[`button_${index}_url`] && (
                              <p className="mt-1 text-xs text-red-600">{errors[`button_${index}_url`]}</p>
                            )}
                          </div>
                        )}

                        {button.type === 'PHONE_NUMBER' && (
                          <div className="mt-3">
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              Phone Number *
                            </label>
                            <input
                              type="tel"
                              value={button.phone_number || ''}
                              onChange={(e) => updateButton(index, 'phone_number', e.target.value)}
                              className={`w-full text-sm rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                errors[`button_${index}_phone`] ? 'border-red-300' : ''
                              }`}
                              placeholder="+1234567890"
                            />
                            {errors[`button_${index}_phone`] && (
                              <p className="mt-1 text-xs text-red-600">{errors[`button_${index}_phone`]}</p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    <p className="text-xs text-gray-500 mt-2">
                      Maximum 3 buttons allowed. Quick Reply buttons allow users to respond quickly.
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
                      className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Creating...' : 'Create Template'}
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
