// src/components/billing/PlanManagement.tsx
'use client';

import { CheckIcon, ArrowUpIcon } from '@heroicons/react/24/outline';

interface PlanManagementProps {
  currentPlan: {
    name: string;
    price: number;
    features: string[];
    messagesIncluded: number;
    billingCycle: 'monthly' | 'yearly';
  };
  onUpgrade: () => void;
}

export function PlanManagement({ currentPlan, onUpgrade }: PlanManagementProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Current Plan Details</h3>
        <button
          onClick={onUpgrade}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <ArrowUpIcon className="h-4 w-4 mr-1" />
          Upgrade Plan
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-xl font-bold text-gray-900">{currentPlan.name} Plan</h4>
            <p className="text-gray-600">
              ${currentPlan.price}/{currentPlan.billingCycle === 'monthly' ? 'month' : 'year'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600">
              {currentPlan.messagesIncluded.toLocaleString()}
            </p>
            <p className="text-sm text-gray-500">messages/month</p>
          </div>
        </div>

        <div className="space-y-2">
          <h5 className="font-medium text-gray-900">Included Features:</h5>
          <ul className="space-y-1">
            {currentPlan.features.map((feature, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600">
                <CheckIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h5 className="font-medium text-blue-900 mb-2">Need more messages?</h5>
        <p className="text-sm text-blue-800 mb-3">
          Upgrade to a higher plan for more messages and additional features. 
          All plans include unlimited templates and priority support.
        </p>
        <button
          onClick={onUpgrade}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          View Plans & Pricing
        </button>
      </div>
    </div>
  );
}
