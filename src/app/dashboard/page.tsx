// src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  PhoneIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { RecentMessages } from '@/components/dashboard/RecentMessages';
import { UsageChart } from '@/components/dashboard/UsageChart';
import { apiClient } from '@/lib/api';

interface DashboardStats {
  messageStats: {
    totalMessages: number;
    deliveredMessages: number;
    sentMessages: number;
    pendingMessages: number;
    failedMessages: number;
    readMessages: number;
  };
  phoneNumberStats: {
    total: number;
    active: number;
    verified: number;
    pending: number;
  };
  templateStats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  recentMessages: any[];
  usageTrends: any[];
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const dashboardStats = await apiClient.getDashboardStats();
      console.log('Dashboard stats received:', dashboardStats);
      setStats(dashboardStats);
      setError('');
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No dashboard data available</p>
        <button
          onClick={fetchDashboardData}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Load Data
        </button>
      </div>
    );
  }

  const calculateChange = (current: number, total: number) => {
    if (total === 0) return '0%';
    const percentage = Math.round((current / total) * 100);
    return `${percentage}%`;
  };

  const statsCards = [
    {
      title: 'Total Messages',
      value: stats.messageStats.totalMessages.toLocaleString(),
      icon: ChatBubbleLeftRightIcon,
      color: 'blue' as const,
      change: '+12%',
      changeType: 'increase' as const,
    },
    {
      title: 'Delivered',
      value: stats.messageStats.deliveredMessages.toLocaleString(),
      icon: CheckCircleIcon,
      color: 'green' as const,
      change: calculateChange(stats.messageStats.deliveredMessages, stats.messageStats.totalMessages),
      changeType: 'increase' as const,
    },
    {
      title: 'Pending',
      value: stats.messageStats.pendingMessages.toLocaleString(),
      icon: ClockIcon,
      color: 'yellow' as const,
      change: calculateChange(stats.messageStats.pendingMessages, stats.messageStats.totalMessages),
      changeType: 'increase' as const,
    },
    {
      title: 'Failed',
      value: stats.messageStats.failedMessages.toLocaleString(),
      icon: XCircleIcon,
      color: 'red' as const,
      change: calculateChange(stats.messageStats.failedMessages, stats.messageStats.totalMessages),
      changeType: 'decrease' as const,
    },
    {
      title: 'Active Numbers',
      value: stats.phoneNumberStats.active.toString(),
      icon: PhoneIcon,
      color: 'indigo' as const,
      change: `${stats.phoneNumberStats.total} total`,
      changeType: 'increase' as const,
    },
    {
      title: 'Approved Templates',
      value: stats.templateStats.approved.toString(),
      icon: DocumentTextIcon,
      color: 'purple' as const,
      change: `${stats.templateStats.total} total`,
      changeType: 'increase' as const,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-1">
            Monitor your WhatsApp messaging performance and usage
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Usage Trends (Last 7 Days)
          </h3>
          <UsageChart data={stats.usageTrends} />
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Messages
          </h3>
          <RecentMessages messages={stats.recentMessages} />
        </div>
      </div>
    </div>
  );
}
