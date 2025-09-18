// src/components/settings/IntegrationSettings.tsx
'use client';

import { useState } from 'react';
import { 
  CogIcon,
  LinkIcon,
  KeyIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api';

interface IntegrationSettingsProps {
  data: {
    webhookUrl: string;
    webhookSecret: string;
    metaBusinessId: string;
    stripeCustomerId: string;
  };
  onUpdate: (data: any) => Promise<void>;
  loading: boolean;
}

export function IntegrationSettings({ data, onUpdate, loading }: IntegrationSettingsProps) {
  const [formData, setFormData] = useState(data);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [testingWebhook, setTestingWebhook] = useState(false);
  const [webhookTestResult, setWebhookTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.webhookUrl && !/^https?:\/\/.+/.test(formData.webhookUrl)) {
      newErrors.webhookUrl = 'Please enter a valid URL (http:// or https://)';
    }

    if (formData.metaBusinessId && !/^\d+$/.test(formData.metaBusinessId)) {
      newErrors.metaBusinessId = 'Meta Business ID should contain only numbers';
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
      setErrors({});
    } catch (error: any) {
      setErrors({ 
        general: error.response?.data?.message || 'Failed to update integration settings' 
      });
    }
  };

  const generateWebhookSecret = () => {
    const secret = Array.from(crypto.getRandomValues(new Uint8Array(32)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
    setFormData(prev => ({ ...prev, webhookSecret: secret }));
  };

  const testWebhook = async () => {
    if (!formData.webhookUrl) {
      setWebhookTestResult({
        success: false,
        message: 'Please enter a webhook URL first'
      });
      return;
    }

    try {
      setTestingWebhook(true);
      const response = await apiClient.client.post('/integrations/test-webhook', {
        url: formData.webhookUrl,
        secret: formData.webhookSecret
      });
      
      setWebhookTestResult({
        success: true,
        message: response.data.message || 'Webhook test successful'
      });
    } catch (error: any) {
      setWebhookTestResult({
        success: false,
        message: error.response?.data?.message || 'Webhook test failed'
      });
    } finally {
      setTestingWebhook(false);
    }
  };

  const toggleSecretVisibility = (field: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const maskSecret = (secret: string) => {
    if (!secret) return '';
    return secret.slice(0, 8) + '•'.repeat(24) + secret.slice(-8);
  };

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Integration Settings</h3>
        <p className="text-sm text-gray-600 mt-1">
          Configure external integrations and webhook endpoints
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {errors.general}
          </div>
        )}

        {/* Webhooks Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <LinkIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">Webhook Configuration</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <div className="flex space-x-2">
                <input
                  type="url"
                  value={formData.webhookUrl}
                  onChange={(e) => setFormData(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  className={`flex-1 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                    errors.webhookUrl ? 'border-red-300' : ''
                  }`}
                  placeholder="https://your-app.com/webhooks/whatsapp"
                />
                <button
                  type="button"
                  onClick={testWebhook}
                  disabled={testingWebhook || !formData.webhookUrl}
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {testingWebhook ? (
                    <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  ) : (
                    'Test'
                  )}
                </button>
              </div>
              {errors.webhookUrl && (
                <p className="mt-1 text-sm text-red-600">{errors.webhookUrl}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                URL where WhatsApp webhook events will be sent
              </p>
            </div>

            {webhookTestResult && (
              <div className={`p-3 rounded-lg ${
                webhookTestResult.success 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center">
                  {webhookTestResult.success ? (
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                  ) : (
                    <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                  )}
                  <span className={`text-sm ${
                    webhookTestResult.success ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {webhookTestResult.message}
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Webhook Secret
              </label>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type={showSecrets.webhookSecret ? 'text' : 'password'}
                    value={formData.webhookSecret}
                    onChange={(e) => setFormData(prev => ({ ...prev, webhookSecret: e.target.value }))}
                    className="w-full pr-10 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Enter webhook secret"
                  />
                  <button
                    type="button"
                    onClick={() => toggleSecretVisibility('webhookSecret')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showSecrets.webhookSecret ? (
                      <EyeSlashIcon className="h-4 w-4 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={generateWebhookSecret}
                  className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Generate
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Secret key used to verify webhook authenticity
              </p>
            </div>

            {/* Webhook Events Info */}
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Webhook Events</h5>
              <p className="text-sm text-blue-800 mb-3">
                Your webhook endpoint will receive the following events:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <code>message.delivered</code> - When a message is delivered</li>
                <li>• <code>message.read</code> - When a message is read by recipient</li>
                <li>• <code>message.failed</code> - When message delivery fails</li>
                <li>• <code>template.approved</code> - When a template is approved</li>
                <li>• <code>template.rejected</code> - When a template is rejected</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Meta Business Integration */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">Meta Business Integration</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meta Business Manager ID
              </label>
              <input
                type="text"
                value={formData.metaBusinessId}
                onChange={(e) => setFormData(prev => ({ ...prev, metaBusinessId: e.target.value }))}
                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                  errors.metaBusinessId ? 'border-red-300' : ''
                }`}
                placeholder="123456789012345"
              />
              {errors.metaBusinessId && (
                <p className="mt-1 text-sm text-red-600">{errors.metaBusinessId}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Your Meta Business Manager ID for WhatsApp Business API access
              </p>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                <div>
                  <h6 className="text-sm font-medium text-yellow-800">Important</h6>
                  <p className="text-sm text-yellow-700 mt-1">
                    Make sure your Meta Business Manager ID is correct. This is required for 
                    phone number verification and message template approval.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stripe Integration */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <CogIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">Payment Integration</h4>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stripe Customer ID
              </label>
              <input
                type="text"
                value={formData.stripeCustomerId}
                onChange={(e) => setFormData(prev => ({ ...prev, stripeCustomerId: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="cus_xxxxxxxxxxxxxxxx"
                readOnly
              />
              <p className="mt-1 text-xs text-gray-500">
                This is automatically generated when you add a payment method
              </p>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex">
                <CheckCircleIcon className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <div>
                  <h6 className="text-sm font-medium text-blue-800">Billing Integration</h6>
                  <p className="text-sm text-blue-700 mt-1">
                    Your billing is automatically handled through Stripe. 
                    Add payment methods in the Billing section.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* API Documentation Link */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <KeyIcon className="h-5 w-5 text-gray-400 mr-2" />
            <h4 className="text-base font-medium text-gray-900">API Documentation</h4>
          </div>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              For detailed information about webhook payloads, API endpoints, and integration examples:
            </p>
            
            <div className="flex flex-wrap gap-3">
              <a
                href="/docs/webhooks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                Webhook Documentation
              </a>
              <a
                href="/docs/api"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
              >
                API Reference
              </a>
              <a
                href="/docs/examples"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                Code Examples
              </a>
            </div>
          </div>
        </div>

        {/* Example Webhook Payload */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h4 className="text-base font-medium text-gray-900 mb-4">Example Webhook Payload</h4>
          <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
            <pre className="text-sm text-gray-300">
{`{
  "event": "message.delivered",
  "timestamp": "2025-09-17T12:50:00Z",
  "data": {
    "messageId": "msg_abc123",
    "whatsappMessageId": "wamid.xxx",
    "recipientPhone": "+1234567890",
    "status": "delivered",
    "deliveredAt": "2025-09-17T12:50:00Z",
    "phoneNumberId": "phone_123",
    "tenantId": "tenant_456"
  },
  "signature": "sha256=..."
}`}
            </pre>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            All webhook requests include a signature header for verification
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Saving...' : 'Save Integration Settings'}
          </button>
        </div>
      </form>
    </div>
  );
}
