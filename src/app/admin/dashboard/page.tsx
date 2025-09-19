// src/app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  ChartBarIcon,
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { apiClient } from '@/lib/api';

// TypeScript interfaces
interface PlatformStats {
  tenants: {
    total: number;
    active: number;
    suspended: number;
    personal: number;
    business: number;
  };
  users: {
    total: number;
    active: number;
    inactive: number;
  };
  revenue: {
    total: number;
    average: number;
  };
  usage: {
    totalMessages: number;
    totalApiCalls: number;
    dailyAverage: number;
  };
  growth: {
    tenants: {
      thisMonth: number;
      lastMonth: number;
      growth: string;
    };
    users: {
      thisMonth: number;
      lastMonth: number;
      growth: string;
    };
  };
}

interface Tenant {
  _id: string;
  name: string;
  domain: string;
  type: 'personal' | 'business';
  status: 'active' | 'inactive' | 'suspended' | 'pending_verification' | 'payment_failed' | 'cancelled';
  planType: string;
  userCount: number;
  activeUsers: number;
  totalUsage: number;
  totalRevenue: number;
  createdAt: string;
  lastActivityAt?: string;
  suspensionReason?: string;
  adminNotes?: string;
}

export default function PlatformAdminDashboard() {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    planType: ''
  });

  useEffect(() => {
    fetchPlatformData();
  }, []);

  const fetchPlatformData = async () => {
    try {
      setLoading(true);
      const [platformStats, tenantsData] = await Promise.all([
        fetchPlatformStats(),
        fetchTenants()
      ]);
      setStats(platformStats);
      setTenants(tenantsData);
    } catch (error) {
      console.error('Failed to fetch platform data:', error);
      setError('Failed to load platform data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatformStats = async (): Promise<PlatformStats> => {
    try {
      // Replace with actual API endpoint for platform admin
      const response = await apiClient.client.get('/admin/dashboard');
      return response.data;
    } catch (error) {
      console.error('Platform stats error:', error);
      // Return mock data for development
      return {
        tenants: {
          total: 150,
          active: 120,
          suspended: 5,
          personal: 100,
          business: 50,
        },
        users: {
          total: 500,
          active: 450,
          inactive: 50,
        },
        revenue: {
          total: 25000,
          average: 166.67,
        },
        usage: {
          totalMessages: 50000,
          totalApiCalls: 150000,
          dailyAverage: 1667,
        },
        growth: {
          tenants: {
            thisMonth: 15,
            lastMonth: 12,
            growth: '25.0',
          },
          users: {
            thisMonth: 45,
            lastMonth: 38,
            growth: '18.4',
          },
        },
      };
    }
  };

  const fetchTenants = async (): Promise<Tenant[]> => {
    try {
      const response = await apiClient.client.get('/admin/tenants', {
        params: { page: 1, limit: 20, ...filters }
      });
      return response.data.tenants || [];
    } catch (error) {
      console.error('Tenants fetch error:', error);
      // Return mock data for development
      return [
        {
          _id: '1',
          name: 'Acme Corp',
          domain: 'acme-corp',
          type: 'business',
          status: 'active',
          planType: 'professional',
          userCount: 5,
          activeUsers: 5,
          totalUsage: 1500,
          totalRevenue: 299,
          createdAt: '2025-01-15T10:30:00Z',
          lastActivityAt: '2025-09-18T15:45:00Z',
        },
        {
          _id: '2',
          name: 'John\'s Workspace',
          domain: 'john-12345',
          type: 'personal',
          status: 'active',
          planType: 'starter',
          userCount: 1,
          activeUsers: 1,
          totalUsage: 250,
          totalRevenue: 0,
          createdAt: '2025-02-10T08:20:00Z',
          lastActivityAt: '2025-09-17T12:30:00Z',
        },
      ];
    }
  };

  const handleStatusUpdate = async (tenantId: string, newStatus: string, reason?: string) => {
    try {
      await apiClient.client.put(`/admin/tenants/${tenantId}/status`, {
        status: newStatus,
        reason
      });
      
      // Refresh tenants list
      const updatedTenants = await fetchTenants();
      setTenants(updatedTenants);
      
      // Show success message
      alert(`Tenant status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update tenant status:', error);
      alert('Failed to update tenant status');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
      pending_verification: 'bg-yellow-100 text-yellow-800',
      payment_failed: 'bg-orange-100 text-orange-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || badges.inactive;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'suspended':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case 'pending_verification':
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="mt-8 h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-lg">
        <div className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          {error}
        </div>
        <button 
          onClick={fetchPlatformData}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and manage your WhatsApp API platform</p>
        </div>
        <button
          onClick={fetchPlatformData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {/* Platform Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold">{stats?.users?.total || 0}</p>
              <p className="text-xs text-gray-500">
                {stats?.users?.active || 0} active
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Active Tenants</p>
              <p className="text-2xl font-bold">{stats?.tenants?.active || 0}</p>
              <p className="text-xs text-gray-500">
                {stats?.tenants?.total || 0} total
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">API Usage</p>
              <p className="text-2xl font-bold">{(stats?.usage?.totalMessages || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                {Math.round(stats?.usage?.dailyAverage || 0)} daily avg
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold">${(stats?.revenue?.total || 0).toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                ${Math.round(stats?.revenue?.average || 0)} avg/tenant
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tenant Growth</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">
                +{stats?.growth?.tenants?.growth || 0}%
              </p>
              <p className="text-sm text-gray-600">vs last month</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{stats?.growth?.tenants?.thisMonth || 0}</p>
              <p className="text-sm text-gray-600">new tenants</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Growth</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-blue-600">
                +{stats?.growth?.users?.growth || 0}%
              </p>
              <p className="text-sm text-gray-600">vs last month</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold">{stats?.growth?.users?.thisMonth || 0}</p>
              <p className="text-sm text-gray-600">new users</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tenant Management Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Tenant Management</h3>
        </div>
        
        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="inactive">Inactive</option>
            </select>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="personal">Personal</option>
              <option value="business">Business</option>
            </select>
            
            <select
              value={filters.planType}
              onChange={(e) => setFilters({...filters, planType: e.target.value})}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Plans</option>
              <option value="starter">Starter</option>
              <option value="professional">Professional</option>
              <option value="business">Business</option>
              <option value="enterprise">Enterprise</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tenant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr key={tenant._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {tenant.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {tenant.type} • {tenant.domain}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center">
                      <span className="font-medium">{tenant.userCount}</span>
                      <span className="ml-2 text-gray-500">
                        ({tenant.activeUsers} active)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {tenant.totalUsage.toLocaleString()} msgs
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tenant.planType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${tenant.totalRevenue}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(tenant.status)}
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(tenant.status)}`}>
                        {tenant.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {tenant.status === 'active' ? (
                        <button
                          onClick={() => handleStatusUpdate(tenant._id, 'suspended', 'Admin action')}
                          className="text-red-600 hover:text-red-900"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusUpdate(tenant._id, 'active')}
                          className="text-green-600 hover:text-green-900"
                        >
                          Activate
                        </button>
                      )}
                      <span className="text-gray-300">|</span>
                      <button className="text-blue-600 hover:text-blue-900">
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {tenants.length === 0 && (
          <div className="text-center py-12">
            <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tenants found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No tenants match the current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
