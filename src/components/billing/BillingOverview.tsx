// src/components/billing/BillingOverview.tsx
'use client';

import { CalendarIcon, CreditCardIcon } from '@heroicons/react/24/outline';

interface BillingOverviewProps {
  upcomingInvoice: {
    amount: number;
    dueDate: string;
  };
  currentUsage: {
    messagesThisMonth: number;
    costThisMonth: number;
    daysRemaining: number;
  };
}

export function BillingOverview({ upcomingInvoice, currentUsage }: BillingOverviewProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Billing Overview</h3>
      
      <div className="space-y-6">
        {/* Next Billing Date */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Next Billing Date</p>
              <p className="text-sm text-gray-500">
                {new Date(upcomingInvoice.dueDate).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(upcomingInvoice.amount)}
            </p>
          </div>
        </div>

        {/* Current Month Usage */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center">
            <CreditCardIcon className="h-5 w-5 text-gray-400 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-900">Current Month</p>
              <p className="text-sm text-gray-500">
                {currentUsage.messagesThisMonth.toLocaleString()} messages sent
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(currentUsage.costThisMonth)}
            </p>
          </div>
        </div>

        {/* Billing Cycle Info */}
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Billing Cycle</h4>
          <p className="text-sm text-gray-600 mb-2">
            Your billing cycle resets in {currentUsage.daysRemaining} days.
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="h-2 bg-primary-600 rounded-full"
              style={{ width: `${((30 - currentUsage.daysRemaining) / 30) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {30 - currentUsage.daysRemaining} of 30 days elapsed
          </p>
        </div>
      </div>
    </div>
  );
}
