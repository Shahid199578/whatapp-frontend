// src/app/dashboard/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  UserIcon,
  CogIcon,
  KeyIcon,
  BellIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { OrganizationSettings } from '@/components/settings/OrganizationSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { APIKeysSettings } from '@/components/settings/APIKeysSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { IntegrationSettings } from '@/components/settings/IntegrationSettings';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface SettingsData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    timezone: string;
    avatar?: string;
  };
  organization: {
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
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginSessions: Array<{
      id: string;
      device: string;
      location: string;
      lastActive: string;
      current: boolean;
    }>;
  };
  notifications: {
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
  integrations: {
    webhookUrl: string;
    webhookSecret: string;
    metaBusinessId: string;
    stripeCustomerId: string;
  };
}

const settingsTabs = [
  { id: 'profile', name: 'Profile', icon: UserIcon },
  { id: 'organization', name: 'Organization', icon: BuildingOfficeIcon },
  { id: 'security', name: 'Security', icon: ShieldCheckIcon },
  { id: 'api-keys', name: 'API Keys', icon: KeyIcon },
  { id: 'notifications', name: 'Notifications', icon: BellIcon },
  { id: 'integrations', name: 'Integrations', icon: CogIcon },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchSettingsData();
  }, []);

  const fetchSettingsData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.client.get('/settings');
      setSettingsData(response.data);
    } catch (error) {
      console.error('Failed to fetch settings data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingsUpdate = async (section: string, data: any) => {
    try {
      setSaving(true);
      await apiClient.client.patch(`/settings/${section}`, data);
      await fetchSettingsData(); // Refresh data
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="flex space-x-8">
            <div className="w-64 space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="flex-1 h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!settingsData) {
    return (
      <div className="text-center py-12">
        <CogIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Settings unavailable</h3>
        <p className="mt-1 text-sm text-gray-500">
          Unable to load settings data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and application preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-8 lg:space-y-0">
        {/* Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <nav className="space-y-1">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className={`mr-3 h-5 w-5 ${
                  activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'
                }`} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            {activeTab === 'profile' && (
              <ProfileSettings 
                data={settingsData.profile}
                onUpdate={(data) => handleSettingsUpdate('profile', data)}
                loading={saving}
              />
            )}
            
            {activeTab === 'organization' && user?.role === 'admin' && (
              <OrganizationSettings 
                data={settingsData.organization}
                onUpdate={(data) => handleSettingsUpdate('organization', data)}
                loading={saving}
              />
            )}
            
            {activeTab === 'security' && (
              <SecuritySettings 
                data={settingsData.security}
                onUpdate={(data) => handleSettingsUpdate('security', data)}
                loading={saving}
              />
            )}
            
            {activeTab === 'api-keys' && (
              <APIKeysSettings 
                onRefresh={fetchSettingsData}
              />
            )}
            
            {activeTab === 'notifications' && (
              <NotificationSettings 
                data={settingsData.notifications}
                onUpdate={(data) => handleSettingsUpdate('notifications', data)}
                loading={saving}
              />
            )}
            
            {activeTab === 'integrations' && user?.role === 'admin' && (
              <IntegrationSettings 
                data={settingsData.integrations}
                onUpdate={(data) => handleSettingsUpdate('integrations', data)}
                loading={saving}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
