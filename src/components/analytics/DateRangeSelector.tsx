// src/components/analytics/DateRangeSelector.tsx
'use client';

import { CalendarIcon } from '@heroicons/react/24/outline';

interface DateRangeSelectorProps {
  dateRange: {
    startDate: string;
    endDate: string;
    period: '7d' | '30d' | '90d' | 'custom';
  };
  onChange: (dateRange: any) => void;
}

export function DateRangeSelector({ dateRange, onChange }: DateRangeSelectorProps) {
  const handlePeriodChange = (period: '7d' | '30d' | '90d' | 'custom') => {
    const endDate = new Date().toISOString().split('T')[0];
    let startDate: string;

    switch (period) {
      case '7d':
        startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case '30d':
        startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case '90d':
        startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      default:
        startDate = dateRange.startDate;
    }

    onChange({ startDate, endDate, period });
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Quick Period Selector */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        {(['7d', '30d', '90d'] as const).map((period) => (
          <button
            key={period}
            onClick={() => handlePeriodChange(period)}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
              dateRange.period === period
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {period === '7d' && 'Last 7 days'}
            {period === '30d' && 'Last 30 days'}
            {period === '90d' && 'Last 90 days'}
          </button>
        ))}
      </div>

      {/* Custom Date Range */}
      <div className="flex items-center space-x-2">
        <CalendarIcon className="h-5 w-5 text-gray-400" />
        <input
          type="date"
          value={dateRange.startDate}
          onChange={(e) => onChange({ ...dateRange, startDate: e.target.value, period: 'custom' })}
          className="text-sm border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
        />
        <span className="text-gray-500">to</span>
        <input
          type="date"
          value={dateRange.endDate}
          onChange={(e) => onChange({ ...dateRange, endDate: e.target.value, period: 'custom' })}
          className="text-sm border-gray-300 rounded-md focus:border-primary-500 focus:ring-primary-500"
        />
      </div>
    </div>
  );
}
