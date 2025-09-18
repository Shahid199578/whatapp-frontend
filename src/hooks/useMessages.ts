// src/hooks/useMessages.ts
import { useState, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Message } from '@/types';

export function useMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0,
  });

  const fetchMessages = useCallback(async (params?: any) => {
    try {
      setLoading(true);
      const response = await apiClient.getMessages(params);
      setMessages(response.messages);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const sendMessage = useCallback(async (messageData: any) => {
    try {
      const response = await apiClient.sendMessage(messageData);
      return response;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  }, []);

  return {
    messages,
    loading,
    pagination,
    fetchMessages,
    sendMessage,
  };
}
