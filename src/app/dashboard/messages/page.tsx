// src/app/dashboard/messages/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PaperAirplaneIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { MessagesList } from '@/components/messages/MessagesList';
import { SendMessageModal } from '@/components/messages/SendMessageModal';
import { MessageFilters } from '@/components/messages/MessageFilters';
import { apiClient } from '@/lib/api';
import { Message } from '@/types';

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSendModal, setShowSendModal] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({
    status: 'all',
    phoneNumber: 'all',
    dateRange: '7d',
    search: '',
  });

  useEffect(() => {
    fetchMessages();
  }, [filters, pagination.page]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getMessages({
        ...filters,
        page: pagination.page,
        limit: pagination.limit,
      });
      setMessages(response.messages);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (messageData: any) => {
    try {
      await apiClient.sendMessage(messageData);
      setShowSendModal(false);
      fetchMessages(); // Refresh list
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">Send and manage WhatsApp messages</p>
        </div>
        <button
          onClick={() => setShowSendModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-grey text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <PaperAirplaneIcon className="mr-2 h-4 w-4" />
          Send Message
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          
          {/* Filters */}
          <MessageFilters filters={filters} onChange={setFilters} />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <MessagesList 
          messages={messages} 
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
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

