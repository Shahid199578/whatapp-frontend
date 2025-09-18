// src/components/phone-numbers/PhoneNumbersList.tsx
'use client';

import { 
  PhoneIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  ShieldCheckIcon,
  CogIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { PhoneNumber } from '@/types';

interface PhoneNumbersListProps {
  phoneNumbers: PhoneNumber[];
  loading: boolean;
  onRefresh: () => void;
  onVerify: (phoneNumber: PhoneNumber) => void;
}

export function PhoneNumbersList({ phoneNumbers, loading, onRefresh, onVerify }: PhoneNumbersListProps) {
  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getVerificationStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case 'verified':
        return `${baseClasses} text-green-800 bg-green-100`;
      case 'pending':
        return `${baseClasses} text-yellow-800 bg-yellow-100`;
      case 'failed':
        return `${baseClasses} text-red-800 bg-red-100`;
      default:
        return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  const getQualityRatingBadge = (rating: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize";
    switch (rating) {
      case 'high':
        return `${baseClasses} text-green-800 bg-green-100`;
      case 'medium':
        return `${baseClasses} text-yellow-800 bg-yellow-100`;
      case 'low':
        return `${baseClasses} text-red-800 bg-red-100`;
      default:
        return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize";
    return status === 'active' 
      ? `${baseClasses} text-green-800 bg-green-100`
      : `${baseClasses} text-gray-800 bg-gray-100`;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {phoneNumbers.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {phoneNumbers.map((phoneNumber) => (
            <div key={phoneNumber.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      phoneNumber.verificationStatus === 'verified' ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <PhoneIcon className={`w-6 h-6 ${
                        phoneNumber.verificationStatus === 'verified' ? 'text-green-600' : 'text-gray-600'
                      }`} />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {phoneNumber.displayPhoneNumber}
                      </h3>
                      <span className={getStatusBadge(phoneNumber.status)}>
                        {phoneNumber.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        {getVerificationStatusIcon(phoneNumber.verificationStatus)}
                        <span className={getVerificationStatusBadge(phoneNumber.verificationStatus)}>
                          {phoneNumber.verificationStatus}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <ShieldCheckIcon className="h-4 w-4 text-gray-400" />
                        <span className={getQualityRatingBadge(phoneNumber.qualityRating)}>
                          {phoneNumber.qualityRating} quality
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Messaging Limit: {phoneNumber.messagingLimit.toLocaleString()}/day</p>
                      <p>Throughput: {phoneNumber.throughputLevel} messages/second</p>
                      {phoneNumber.whatsappBusinessPhoneNumberId && (
                        <p className="text-xs text-gray-400 truncate">
                          WhatsApp ID: {phoneNumber.whatsappBusinessPhoneNumberId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {phoneNumber.verificationStatus === 'pending' && (
                    <button
                      onClick={() => onVerify(phoneNumber)}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <ShieldCheckIcon className="h-4 w-4 mr-1" />
                      Verify
                    </button>
                  )}
                  
                  <button
                    className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    title="Settings"
                  >
                    <CogIcon className="h-5 w-5" />
                  </button>
                  
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Tier Level:</span>
                    <span className="ml-2 text-gray-600">Tier {phoneNumber.tierLevel}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Added:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(phoneNumber.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <span className="ml-2 text-gray-600">
                      {new Date(phoneNumber.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <PhoneIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No phone numbers</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first WhatsApp Business phone number.
          </p>
        </div>
      )}
    </div>
  );
}
