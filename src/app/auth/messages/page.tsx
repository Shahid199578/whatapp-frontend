// src/app/dashboard/messages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PaperAirplaneIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { MessagesList } from '@/components/messages/MessagesList';
import { SendMessageModal } from '@/components/messages/SendMessageModal';
import { MessageFilters } from '@/components/messages/MessageFilters';
import { useMessages } from '@/hooks/useMessages';

export default function MessagesPage() {
  const [showSendModal, setShowSendModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    phoneNumber: 'all',
    dateRange: '7d',
  });

  const { 
    messages, 
    loading, 
    pagination, 
    sendMessage, 
    fetchMessages 
  } = useMessages();

  useEffect(() => {
    fetchMessages(filters);
  }, [filters]);

  const handleSendMessage = async (messageData: any) => {
    try {
      await sendMessage(messageData);
      setShowSendModal(false);
      fetchMessages(filters); // Refresh list
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-500">Send and manage WhatsApp messages</p>
        </div>
        <button
          onClick={() => setShowSendModal(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <PaperAirplaneIcon className="mr-2 h-4 w-4" />
          Send Message
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-md">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Messages</p>
              <p className="text-2xl font-semibold text-gray-900">
                {pagination?.total || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-md">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-semibold text-gray-900">1,234</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-md">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">56</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-md">
              <XCircleIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Failed</p>
              <p className="text-2xl font-semibold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <MessageFilters filters={filters} onChange={setFilters} />
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <MessagesList 
          messages={messages} 
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => fetchMessages({ ...filters, page })}
        />
      </div>

      {/* Send Message Modal */}
      {showSendModal && (
        <SendMessageModal
          isOpen={showSendModal}
          onClose={() => setShowSendModal(false)}
          onSend={handleSendMessage}
        />
      )}
    </div>
  );
}

