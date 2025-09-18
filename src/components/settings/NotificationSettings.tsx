// src/components/settings/NotificationSettings.tsx
'use client';

import { useState } from 'react';
import { BellIcon, EnvelopeIcon, DevicePhoneMobileIcon } from '@heroicons/react/24/outline';

interface NotificationSettingsProps {
  data: {
    email: {
      messageDelivery: boolean;
      templateApproval: boolean;
      billingAlerts: boolean;
      securityAlerts: boolean;
    };
    sms: {
      criticalAlerts: boolean;
    };
    inApp: {
      allNotifications: boolean;
    };
  };
  onUpdate: (data: any) => Promise<void>;
  loading: boolean;
}

export function NotificationSettings({ data, onUpdate, loading }: NotificationSettingsProps) {
  const [formData, setFormData] = useState(data);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
  };

  const updateSetting = (category: keyof typeof formData, setting: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
        <p className="text-sm text-gray-600 mt-1">
          Choose how you want to be notified about account activity
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Email Notifications */}
        <div>
          <div className="flex items-center mb-4">
            <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">Email Notifications</h4>
          </div>
          <div className="space-y-4 ml-7">
            {Object.entries(formData.email).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    {key === 'messageDelivery' && 'Message Delivery Updates'}
                    {key === 'templateApproval' && 'Template Approval Status'}
                    {key === 'billingAlerts' && 'Billing & Usage Alerts'}
                    {key === 'securityAlerts' && 'Security Alerts'}
                  </label>
                  <p className="text-sm text-gray-500">
                    {key === 'messageDelivery' && 'Get notified about message delivery status'}
                    {key === 'templateApproval' && 'Notifications when templates are approved or rejected'}
                    {key === 'billingAlerts' && 'Alerts about billing issues and usage limits'}
                    {key === 'securityAlerts' && 'Important security notifications'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => updateSetting('email', key, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div>
          <div className="flex items-center mb-4">
            <DevicePhoneMobileIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">SMS Notifications</h4>
          </div>
          <div className="space-y-4 ml-7">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Critical Alerts</label>
                <p className="text-sm text-gray-500">
                  Only critical security and service alerts via SMS
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sms.criticalAlerts}
                  onChange={(e) => updateSetting('sms', 'criticalAlerts', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* In-App Notifications */}
        <div>
          <div className="flex items-center mb-4">
            <BellIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">In-App Notifications</h4>
          </div>
          <div className="space-y-4 ml-7">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">All Notifications</label>
                <p className="text-sm text-gray-500">
                  Show notifications in the dashboard
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.inApp.allNotifications}
                  onChange={(e) => updateSetting('inApp', 'allNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </form>
    </div>
  );
}
