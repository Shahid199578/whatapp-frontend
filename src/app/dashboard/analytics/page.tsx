// src/app/dashboard/analytics/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { MessageAnalyticsChart } from '@/components/analytics/MessageAnalyticsChart';
import { DeliveryRatesChart } from '@/components/analytics/DeliveryRatesChart';
import { CostAnalyticsChart } from '@/components/analytics/CostAnalyticsChart';
import { PhoneNumberPerformance } from '@/components/analytics/PhoneNumberPerformance';
import { TemplatePerformance } from '@/components/analytics/TemplatePerformance';
import { DateRangeSelector } from '@/components/analytics/DateRangeSelector';
import { apiClient } from '@/lib/api';

interface AnalyticsData {
  totalMessages: number;
  deliveredMessages: number;
  failedMessages: number;
  totalCost: number;
  averageDeliveryTime: number;
  deliveryRate: number;
  costPerMessage: number;
  dailyStats: Array<{
    date: string;
    messages: number;
    delivered: number;
    failed: number;
    cost: number;
  }>;
  phoneNumberStats: Array<{
    phoneNumber: string;
    messages: number;
    deliveryRate: number;
    cost: number;
  }>;
  templateStats: Array<{
    templateName: string;
    messages: number;
    deliveryRate: number;
    category: string;
  }>;
  previousPeriod: {
    totalMessages: number;
    deliveredMessages: number;
    totalCost: number;
    deliveryRate: number;
  };
}

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    period: '30d' as '7d' | '30d' | '90d' | 'custom'
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.client.get('/analytics', {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          period: dateRange.period
        }
      });
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-lg mt-8"></div>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No analytics data</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start sending messages to see analytics.
        </p>
      </div>
    );
  }

  const messageGrowth = calculatePercentageChange(
    analyticsData.totalMessages,
    analyticsData.previousPeriod.totalMessages
  );
  const deliveryRateChange = calculatePercentageChange(
    analyticsData.deliveryRate,
    analyticsData.previousPeriod.deliveryRate
  );
  const costChange = calculatePercentageChange(
    analyticsData.totalCost,
    analyticsData.previousPeriod.totalCost
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-1">Track your WhatsApp messaging performance</p>
        </div>
        <DateRangeSelector
          dateRange={dateRange}
          onChange={setDateRange}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Messages */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Messages</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analyticsData.totalMessages.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                {messageGrowth >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  messageGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(messageGrowth).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Delivery Rate */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Delivery Rate</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {analyticsData.deliveryRate.toFixed(1)}%
              </p>
              <div className="flex items-center mt-2">
                {deliveryRateChange >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  deliveryRateChange >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(deliveryRateChange).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Total Cost */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Cost</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(analyticsData.totalCost)}
              </p>
              <div className="flex items-center mt-2">
                {costChange >= 0 ? (
                  <ArrowUpIcon className="h-4 w-4 text-red-500 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4 text-green-500 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  costChange >= 0 ? 'text-red-600' : 'text-green-600'
                }`}>
                  {Math.abs(costChange).toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Cost Per Message */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Cost Per Message</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(analyticsData.costPerMessage)}
              </p>
              <div className="flex items-center mt-2">
                <span className="text-sm text-gray-500">
                  {analyticsData.deliveredMessages} delivered
                </span>
              </div>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Message Volume Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Message Volume Over Time
          </h3>
          <MessageAnalyticsChart data={analyticsData.dailyStats} />
        </div>

        {/* Delivery Rates Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Delivery Rates
          </h3>
          <DeliveryRatesChart data={analyticsData.dailyStats} />
        </div>
      </div>

      {/* Cost Analytics */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Cost Analytics
        </h3>
        <CostAnalyticsChart data={analyticsData.dailyStats} />
      </div>

      {/* Performance Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Phone Number Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Phone Number Performance
          </h3>
          <PhoneNumberPerformance data={analyticsData.phoneNumberStats} />
        </div>

        {/* Template Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Template Performance
          </h3>
          <TemplatePerformance data={analyticsData.templateStats} />
        </div>
      </div>
    </div>
  );
}
