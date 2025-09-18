// src/components/phone-numbers/PhoneNumbersList.tsx
'use client';

import React from 'react';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  PhoneIcon,
  SignalIcon
} from '@heroicons/react/24/outline';

interface PhoneNumber {
  _id: string;
  phoneNumber: string;
  displayPhoneNumber: string;
  whatsappBusinessPhoneNumberId: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  status: 'active' | 'inactive';
  qualityRating: 'high' | 'medium' | 'low' | 'unknown';
  messagingLimit: number;
  throughputLevel: number;
  tierLevel: string;
  createdAt: string;
  updatedAt: string;
}

interface PhoneNumbersListProps {
  phoneNumbers: PhoneNumber[];
  loading: boolean;
  onRefresh: () => void;
  onVerify: (phoneNumber: PhoneNumber) => void;
}

export function PhoneNumbersList({ phoneNumbers, loading, onRefresh, onVerify }: PhoneNumbersListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'verified':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getQualityBadge = (rating: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (rating) {
      case 'high':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'medium':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'low':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (phoneNumbers.length === 0) {
    return (
      <div className="p-12 text-center">
        <PhoneIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No phone numbers</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding a WhatsApp Business phone number.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Phone Numbers</h3>
          <button
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {phoneNumbers.map((phoneNumber) => (
          <div key={phoneNumber._id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {getStatusIcon(phoneNumber.verificationStatus)}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {phoneNumber.displayPhoneNumber}
                    </h4>
                    <span className={getStatusBadge(phoneNumber.verificationStatus)}>
                      {phoneNumber.verificationStatus}
                    </span>
                  </div>
                  
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>ID: {phoneNumber.whatsappBusinessPhoneNumberId}</span>
                    <span>•</span>
                    <span>Limit: {phoneNumber.messagingLimit.toLocaleString()}/day</span>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <SignalIcon className="h-4 w-4" />
                      <span className={getQualityBadge(phoneNumber.qualityRating)}>
                        {phoneNumber.qualityRating}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {phoneNumber.verificationStatus === 'pending' && (
                  <button
                    onClick={() => onVerify(phoneNumber)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                  >
                    Verify
                  </button>
                )}
                
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  phoneNumber.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {phoneNumber.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
