// src/components/dashboard/RecentMessages.tsx
'use client';

import React from 'react';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  XCircleIcon,
  PaperAirplaneIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface RecentMessage {
  _id: string;
  recipientPhone: string;
  messageType: string;
  status: string;
  content: any;
  createdAt: string;
  sentAt?: string;
  deliveredAt?: string;
  phoneNumberId?: {
    displayPhoneNumber: string;
    phoneNumber: string;
  };
}

interface RecentMessagesProps {
  messages: RecentMessage[];
}

export function RecentMessages({ messages }: RecentMessagesProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">💬</div>
          <p>No recent messages</p>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
      case 'sent':
        return <PaperAirplaneIcon className="h-4 w-4 text-blue-500" />;
      case 'read':
        return <EyeIcon className="h-4 w-4 text-purple-500" />;
      case 'failed':
        return <XCircleIcon className="h-4 w-4 text-red-500" />;
      case 'queued':
      default:
        return <ClockIcon className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600 bg-green-50';
      case 'sent':
        return 'text-blue-600 bg-blue-50';
      case 'read':
        return 'text-purple-600 bg-purple-50';
      case 'failed':
        return 'text-red-600 bg-red-50';
      case 'queued':
      default:
        return 'text-yellow-600 bg-yellow-50';
    }
  };

  const formatPhoneNumber = (phone: string) => {
    // Format phone number for display
    if (phone.startsWith('+')) {
      const cleaned = phone.substring(1);
      if (cleaned.length >= 10) {
        return `+${cleaned.substring(0, cleaned.length - 10)} ${cleaned.substring(cleaned.length - 10, cleaned.length - 7)} ${cleaned.substring(cleaned.length - 7, cleaned.length - 4)} ${cleaned.substring(cleaned.length - 4)}`;
      }
    }
    return phone;
  };

  const getMessagePreview = (message: RecentMessage) => {
    if (message.messageType === 'text' && message.content?.text) {
      return message.content.text.length > 50 
        ? `${message.content.text.substring(0, 50)}...`
        : message.content.text;
    } else if (message.messageType === 'template' && message.content?.template?.name) {
      return `Template: ${message.content.template.name}`;
    } else if (message.messageType === 'media') {
      return `Media message (${message.content?.mediaType || 'unknown'})`;
    }
    return 'Message content';
  };

  return (
    <div className="space-y-4 max-h-64 overflow-y-auto">
      {messages.slice(0, 10).map((message) => (
        <div key={message._id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          {/* Status Icon */}
          <div className="flex-shrink-0 mt-0.5">
            {getStatusIcon(message.status)}
          </div>

          {/* Message Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {formatPhoneNumber(message.recipientPhone)}
                </p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(message.status)}`}>
                  {message.status}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(message.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <p className="text-sm text-gray-600 truncate mt-1">
              {getMessagePreview(message)}
            </p>
            
            {message.phoneNumberId && (
              <p className="text-xs text-gray-400 mt-1">
                From: {message.phoneNumberId.displayPhoneNumber}
              </p>
            )}
          </div>
        </div>
      ))}

      {messages.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          <p>No recent messages found</p>
        </div>
      )}
    </div>
  );
}
