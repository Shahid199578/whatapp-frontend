// src/components/settings/APIKeysSettings.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  KeyIcon,
  PlusIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api';

interface APIKey {
  id: string;
  name: string;
  key: string;
  permissions: string[];
  lastUsed?: string;
  expiresAt?: string;
  status: 'active' | 'expired' | 'revoked';
  createdAt: string;
}

interface APIKeysSettingsProps {
  onRefresh: () => void;
}

export function APIKeysSettings({ onRefresh }: APIKeysSettingsProps) {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyForm, setNewKeyForm] = useState({
    name: '',
    permissions: ['messages:send', 'messages:read'],
    expiresAt: '',
  });

  const availablePermissions = [
    { value: 'messages:send', label: 'Send Messages' },
    { value: 'messages:read', label: 'Read Messages' },
    { value: 'templates:read', label: 'Read Templates' },
    { value: 'templates:create', label: 'Create Templates' },
    { value: 'phone-numbers:read', label: 'Read Phone Numbers' },
    { value: 'analytics:read', label: 'Read Analytics' },
  ];

  useEffect(() => {
    fetchAPIKeys();
  }, []);

  const fetchAPIKeys = async () => {
    try {
      setLoading(true);
      const response = await apiClient.client.get('/api-keys');
      setApiKeys(response.data);
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await apiClient.client.post('/api-keys', newKeyForm);
      setApiKeys(prev => [response.data, ...prev]);
      setNewKeyForm({ name: '', permissions: ['messages:send', 'messages:read'], expiresAt: '' });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Failed to create API key:', error);
    }
  };

  const handleRevokeKey = async (keyId: string) => {
    if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      return;
    }

    try {
      await apiClient.client.delete(`/api-keys/${keyId}`);
      setApiKeys(prev => prev.filter(key => key.id !== keyId));
    } catch (error) {
      console.error('Failed to revoke API key:', error);
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const maskApiKey = (key: string) => {
    return key.slice(0, 8) + '•'.repeat(24) + key.slice(-8);
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'active':
        return `${baseClasses} text-green-800 bg-green-100`;
      case 'expired':
        return `${baseClasses} text-red-800 bg-red-100`;
      case 'revoked':
        return `${baseClasses} text-gray-800 bg-gray-100`;
      default:
        return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  return (
    <div className="p-6">
      <div className="border-b border-gray-200 pb-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
            <p className="text-sm text-gray-600 mt-1">
              Manage API keys for programmatic access to your account
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Create API Key
          </button>
        </div>
      </div>

      {/* Create API Key Form */}
      {showCreateForm && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <form onSubmit={handleCreateKey} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Name *
              </label>
              <input
                type="text"
                value={newKeyForm.name}
                onChange={(e) => setNewKeyForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                placeholder="My API Key"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availablePermissions.map((permission) => (
                  <label key={permission.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newKeyForm.permissions.includes(permission.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setNewKeyForm(prev => ({
                            ...prev,
                            permissions: [...prev.permissions, permission.value]
                          }));
                        } else {
                          setNewKeyForm(prev => ({
                            ...prev,
                            permissions: prev.permissions.filter(p => p !== permission.value)
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{permission.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expires At (Optional)
              </label>
              <input
                type="datetime-local"
                value={newKeyForm.expiresAt}
                onChange={(e) => setNewKeyForm(prev => ({ ...prev, expiresAt: e.target.value }))}
                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Key
              </button>
            </div>
          </form>
        </div>
      )}

      {/* API Keys List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : apiKeys.length > 0 ? (
          apiKeys.map((key) => (
            <div key={key.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{key.name}</h4>
                  <p className="text-xs text-gray-500">
                    Created {new Date(key.createdAt).toLocaleDateString()}
                    {key.lastUsed && ` • Last used ${new Date(key.lastUsed).toLocaleDateString()}`}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={getStatusBadge(key.status)}>{key.status}</span>
                  <button
                    onClick={() => handleRevokeKey(key.id)}
                    className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50 transition-colors"
                    title="Revoke API key"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-2 mb-3">
                <code className="flex-1 px-3 py-2 bg-gray-100 rounded text-sm font-mono">
                  {visibleKeys.has(key.id) ? key.key : maskApiKey(key.key)}
                </code>
                <button
                  onClick={() => toggleKeyVisibility(key.id)}
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  title={visibleKeys.has(key.id) ? 'Hide key' : 'Show key'}
                >
                  {visibleKeys.has(key.id) ? (
                    <EyeSlashIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => copyToClipboard(key.key)}
                  className="p-2 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Copy to clipboard"
                >
                  <DocumentDuplicateIcon className="h-4 w-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1">
                {key.permissions.map((permission) => (
                  <span
                    key={permission}
                    className="inline-flex items-center px-2 py-1 rounded text-xs bg-gray-100 text-gray-700"
                  >
                    {permission}
                  </span>
                ))}
              </div>

              {key.expiresAt && (
                <p className="text-xs text-gray-500 mt-2">
                  Expires {new Date(key.expiresAt).toLocaleDateString()}
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
            <KeyIcon className="mx-auto h-8 w-8 text-gray-400" />
            <h4 className="mt-2 text-sm font-medium text-gray-900">No API keys</h4>
            <p className="mt-1 text-sm text-gray-500">
              Create your first API key to start using our API.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
