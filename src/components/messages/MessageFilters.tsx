// src/components/messages/MessageFilters.tsx
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { PhoneNumber } from '@/types';

interface MessageFiltersProps {
  filters: {
    status: string;
    phoneNumber: string;
    dateRange: string;
    search: string;
  };
  onChange: (filters: any) => void;
}

export function MessageFilters({ filters, onChange }: MessageFiltersProps) {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const fetchPhoneNumbers = async () => {
    try {
      const response = await apiClient.getPhoneNumbers();
      setPhoneNumbers(response);
    } catch (error) {
      console.error('Failed to fetch phone numbers:', error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <div className="flex flex-wrap items-center gap-4">
      {/* Status Filter */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 mb-1">Status</label>
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Status</option>
          <option value="queued">Queued</option>
          <option value="sent">Sent</option>
          <option value="delivered">Delivered</option>
          <option value="read">Read</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Phone Number Filter */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 mb-1">Phone Number</label>
        <select
          value={filters.phoneNumber}
          onChange={(e) => handleFilterChange('phoneNumber', e.target.value)}
          className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Numbers</option>
          {phoneNumbers.map((phone) => (
            <option key={phone.id} value={phone.id}>
              {phone.displayPhoneNumber}
            </option>
          ))}
        </select>
      </div>

      {/* Date Range Filter */}
      <div className="flex flex-col">
        <label className="text-xs font-medium text-gray-700 mb-1">Date Range</label>
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          className="text-sm border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="1d">Last 24 hours</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Clear Filters */}
      <div className="flex flex-col justify-end">
        <button
          onClick={() => onChange({
            status: 'all',
            phoneNumber: 'all',
            dateRange: '7d',
            search: '',
          })}
          className="text-sm text-gray-600 hover:text-gray-900 underline"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
