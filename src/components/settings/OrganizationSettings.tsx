// src/components/settings/OrganizationSettings.tsx
'use client';

import { useState } from 'react';
import { 
  BuildingOfficeIcon,
  MapPinIcon,
  GlobeAltIcon,
  UserGroupIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface OrganizationSettingsProps {
  data: {
    name: string;
    domain: string;
    industry: string;
    size: string;
    address: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  onUpdate: (data: any) => Promise<void>;
  loading: boolean;
}

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'E-commerce',
  'Education',
  'Marketing & Advertising',
  'Real Estate',
  'Manufacturing',
  'Retail',
  'Food & Beverage',
  'Transportation',
  'Entertainment',
  'Non-profit',
  'Government',
  'Other'
];

const companySizes = [
  '1-10 employees',
  '11-50 employees',
  '51-200 employees',
  '201-500 employees',
  '501-1000 employees',
  '1000+ employees'
];

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Germany',
  'France',
  'Spain',
  'Italy',
  'Netherlands',
  'Australia',
  'New Zealand',
  'India',
  'Singapore',
  'Japan',
  'South Korea',
  'Brazil',
  'Mexico',
  'Other'
];

export function OrganizationSettings({ data, onUpdate, loading }: OrganizationSettingsProps) {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDirty, setIsDirty] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = 'Organization name is required';
    }

    if (!formData.domain.trim()) {
      newErrors.domain = 'Domain is required';
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.([a-zA-Z]{2,})+$/.test(formData.domain)) {
      newErrors.domain = 'Please enter a valid domain (e.g., company.com)';
    }

    if (!formData.industry) {
      newErrors.industry = 'Please select an industry';
    }

    if (!formData.size) {
      newErrors.size = 'Please select company size';
    }

    // Address validation
    if (!formData.address.country) {
      newErrors.country = 'Please select a country';
    }

    if (formData.address.zipCode && !/^[\w\s-]{3,10}$/.test(formData.address.zipCode)) {
      newErrors.zipCode = 'Please enter a valid zip/postal code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onUpdate(formData);
      setIsDirty(false);
      setErrors({});
    } catch (error: any) {
      setErrors({ 
        general: error.response?.data?.message || 'Failed to update organization settings' 
      });
    }
  };

  const handleInputChange = (field: string, value: string, isNested = false, parentField = '') => {
    setIsDirty(true);
    
    if (isNested) {
      setFormData(prev => ({
        ...prev,
        [parentField]: {
          ...prev[parentField as keyof typeof prev],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleReset = () => {
    setFormData(data);
    setErrors({});
    setIsDirty(false);
  };

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Organization Settings</h3>
        <p className="text-sm text-gray-600 mt-1">
          Manage your organization's profile and business information
        </p>
      </div>

      {/* Admin Notice */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex">
          <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Admin Access</h4>
            <p className="text-sm text-blue-700 mt-1">
              These settings affect all users in your organization and are only accessible by administrators.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Basic Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">Basic Information</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  errors.name ? 'border-red-300' : ''
                }`}
                placeholder="Acme Corporation"
                required
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Domain *
              </label>
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => handleInputChange('domain', e.target.value)}
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  errors.domain ? 'border-red-300' : ''
                }`}
                placeholder="acme.com"
                required
              />
              {errors.domain && (
                <p className="mt-1 text-sm text-red-600">{errors.domain}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Your company's primary domain (without www)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry *
              </label>
              <select
                value={formData.industry}
                onChange={(e) => handleInputChange('industry', e.target.value)}
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  errors.industry ? 'border-red-300' : ''
                }`}
                required
              >
                <option value="">Select an industry</option>
                {industries.map((industry) => (
                  <option key={industry} value={industry}>
                    {industry}
                  </option>
                ))}
              </select>
              {errors.industry && (
                <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Size *
              </label>
              <select
                value={formData.size}
                onChange={(e) => handleInputChange('size', e.target.value)}
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  errors.size ? 'border-red-300' : ''
                }`}
                required
              >
                <option value="">Select company size</option>
                {companySizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              {errors.size && (
                <p className="mt-1 text-sm text-red-600">{errors.size}</p>
              )}
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">Address Information</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => handleInputChange('street', e.target.value, true, 'address')}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="123 Business Street, Suite 100"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.address.city}
                  onChange={(e) => handleInputChange('city', e.target.value, true, 'address')}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="San Francisco"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange('state', e.target.value, true, 'address')}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  placeholder="California"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  value={formData.address.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value, true, 'address')}
                  className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                    errors.zipCode ? 'border-red-300' : ''
                  }`}
                  placeholder="94105"
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country *
              </label>
              <select
                value={formData.address.country}
                onChange={(e) => handleInputChange('country', e.target.value, true, 'address')}
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  errors.country ? 'border-red-300' : ''
                }`}
                required
              >
                <option value="">Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
              )}
            </div>
          </div>
        </div>

        {/* Compliance & Verification */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <GlobeAltIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">Compliance & Verification</h4>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                <div>
                  <h5 className="text-sm font-medium text-yellow-800">Business Verification</h5>
                  <p className="text-sm text-yellow-700 mt-1">
                    Accurate business information is required for WhatsApp Business API verification 
                    and compliance with Meta's policies.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Domain Verification</h5>
                <p className="text-sm text-gray-600 mb-2">
                  Status: <span className="text-green-600 font-medium">Verified ✓</span>
                </p>
                <p className="text-xs text-gray-500">
                  Your domain ownership has been verified
                </p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h5 className="text-sm font-medium text-gray-900 mb-2">Business Information</h5>
                <p className="text-sm text-gray-600 mb-2">
                  Status: <span className="text-blue-600 font-medium">Under Review</span>
                </p>
                <p className="text-xs text-gray-500">
                  Business details are being verified by Meta
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Data Usage Notice */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex">
            <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
            <div>
              <h5 className="text-sm font-medium text-blue-800">Data Usage</h5>
              <p className="text-sm text-blue-700 mt-1">
                This information is used for:
              </p>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• WhatsApp Business API verification with Meta</li>
                <li>• Compliance with local regulations and tax requirements</li>
                <li>• Billing and invoicing (if applicable)</li>
                <li>• Customer support and account management</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-200">
          <div>
            {isDirty && (
              <p className="text-sm text-amber-600 flex items-center">
                <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                You have unsaved changes
              </p>
            )}
          </div>
          
          <div className="flex space-x-3">
            {isDirty && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
              >
                Reset Changes
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading || !isDirty}
              className="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              {loading ? 'Saving...' : 'Save Organization Settings'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
