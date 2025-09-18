// src/components/billing/UsageMetrics.tsx
'use client';

import { CalendarIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';

interface UsageMetricsProps {
  usage: {
    messagesThisMonth: number;
    costThisMonth: number;
    messagesLimit: number;
    daysInBillingCycle: number;
    daysRemaining: number;
  };
}

export function UsageMetrics({ usage }: UsageMetricsProps) {
  const usagePercentage = (usage.messagesThisMonth / usage.messagesLimit) * 100;
  const averageDaily = usage.messagesThisMonth / (usage.daysInBillingCycle - usage.daysRemaining);
  const projectedMonthly = averageDaily * usage.daysInBillingCycle;

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Usage Metrics</h3>

      {/* Usage Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Message Usage</span>
          <span className="text-sm text-gray-500">
            {usage.messagesThisMonth.toLocaleString()} / {usage.messagesLimit.toLocaleString()}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              usagePercentage > 100 ? 'bg-red-600' :
              usagePercentage > 80 ? 'bg-yellow-600' : 'bg-green-600'
            }`}
            style={{ width: `${Math.min(usagePercentage, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {usagePercentage.toFixed(1)}% of monthly limit used
        </p>
      </div>

      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <CalendarIcon className="h-5 w-5 text-gray-400 mr-1" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(averageDaily)}</p>
          <p className="text-sm text-gray-500">Daily Average</p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-2">
            <ArrowTrendingUpIcon className="h-5 w-5 text-gray-400 mr-1" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{Math.round(projectedMonthly).toLocaleString()}</p>
          <p className="text-sm text-gray-500">Projected Monthly</p>
        </div>

        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{usage.daysRemaining}</p>
          <p className="text-sm text-gray-500">Days Remaining</p>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="mt-6 p-4 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">This Month's Charges</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Plan subscription</span>
            <span className="text-gray-900">Included</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Message charges</span>
            <span className="text-gray-900">${(usage.costThisMonth / 100).toFixed(2)}</span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between font-medium">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">${(usage.costThisMonth / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
