// src/lib/api.ts
import axios,{ AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// Define TypeScript interfaces for better type safety
interface MessageStats {
  total: number;
  queued: number;
  sent: number;
  delivered: number;
  read: number;
  failed: number;
}

interface DashboardStats {
  messageStats: {
    totalMessages: number;
    deliveredMessages: number;
    sentMessages: number;
    pendingMessages: number;
    failedMessages: number;
    readMessages: number;
  };
  phoneNumberStats: {
    total: number;
    active: number;
    verified: number;
    pending: number;
  };
  templateStats: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  recentMessages: any[];
  usageTrends: any[];
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

class ApiClient {
  public client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to attach token
    this.client.interceptors.request.use((config: any) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor for global error handling
    this.client.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ===== Auth =====
  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    return response.data;
  }

  async register(userData: any) {
    const response = await this.client.post('/auth/register', userData);
    return response.data;
  }

  // ===== Dashboard =====
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await this.client.get('/dashboard/stats');
      return response.data;
    } catch (error: any) {
      console.error('Dashboard stats error:', error);
      
      // Fallback: try to get individual stats if dashboard endpoint fails
      try {
        const [messageStats, messages, phoneNumbers, templates] = await Promise.all([
          this.getMessageStats(30).catch(() => ({ total: 0, queued: 0, sent: 0, delivered: 0, read: 0, failed: 0 })),
          this.getMessages({ page: 1, limit: 5 }).catch(() => ({ messages: [] })),
          this.getPhoneNumbers().catch(() => []),
          this.getTemplates().catch(() => []),
        ]);

        // Map old format to new format
        return {
          messageStats: {
            totalMessages: messageStats.total || 0,
            deliveredMessages: messageStats.delivered || 0,
            sentMessages: messageStats.sent || 0,
            pendingMessages: messageStats.queued || 0,
            failedMessages: messageStats.failed || 0,
            readMessages: messageStats.read || 0,
          },
          phoneNumberStats: {
            total: phoneNumbers?.length || 0,
            active: phoneNumbers?.filter((p: any) => p.status === 'active').length || 0,
            verified: phoneNumbers?.filter((p: any) => p.verificationStatus === 'verified').length || 0,
            pending: phoneNumbers?.filter((p: any) => p.verificationStatus === 'pending').length || 0,
          },
          templateStats: {
            total: templates?.length || 0,
            approved: templates?.filter((t: any) => t.status === 'approved').length || 0,
            pending: templates?.filter((t: any) => t.status === 'pending').length || 0,
            rejected: templates?.filter((t: any) => t.status === 'rejected').length || 0,
          },
          recentMessages: messages.messages || [],
          usageTrends: [],
        };
      } catch (fallbackError) {
        console.error('Fallback dashboard stats error:', fallbackError);
        // Return default empty data
        return {
          messageStats: {
            totalMessages: 0,
            deliveredMessages: 0,
            sentMessages: 0,
            pendingMessages: 0,
            failedMessages: 0,
            readMessages: 0,
          },
          phoneNumberStats: {
            total: 0,
            active: 0,
            verified: 0,
            pending: 0,
          },
          templateStats: {
            total: 0,
            approved: 0,
            pending: 0,
            rejected: 0,
          },
          recentMessages: [],
          usageTrends: [],
        };
      }
    }
  }

  async getDashboardAnalytics(period: string = '30d') {
    try {
      const response = await this.client.get(`/dashboard/analytics?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Dashboard analytics error:', error);
      return {
        messageVolume: [],
        deliveryRates: { total: 0, sentRate: 0, deliveryRate: 0, readRate: 0, failureRate: 0 },
        phoneNumberPerformance: [],
        templatePerformance: [],
        period: { start: new Date(), end: new Date(), days: 30 }
      };
    }
  }

  // ===== Messages =====
  async getMessages(params?: any) {
    const response = await this.client.get('/messages', { params });
    return response.data;
  }

  async sendMessage(messageData: any) {
    const response = await this.client.post('/messages', messageData);
    return response.data;
  }

  async getMessageStats(days = 30): Promise<MessageStats> {
    const response = await this.client.get(`/messages/stats?days=${days}`);
    return response.data;
  }

  async getMessage(id: string) {
    const response = await this.client.get(`/messages/${id}`);
    return response.data;
  }

  async retryMessage(id: string) {
    const response = await this.client.post(`/messages/${id}/retry`);
    return response.data;
  }

  async bulkSendMessages(messages: any[]) {
    const response = await this.client.post('/messages/bulk', messages);
    return response.data;
  }

  // ===== Phone Numbers =====
  async getPhoneNumbers() {
    const response = await this.client.get('/phone-numbers');
    return response.data;
  }

  async addPhoneNumber(phoneData: any) {
    const response = await this.client.post('/phone-numbers', phoneData);
    return response.data;
  }

  async getPhoneNumber(id: string) {
    const response = await this.client.get(`/phone-numbers/${id}`);
    return response.data;
  }

  async updatePhoneNumber(id: string, phoneData: any) {
    const response = await this.client.put(`/phone-numbers/${id}`, phoneData);
    return response.data;
  }

  async deletePhoneNumber(id: string) {
    const response = await this.client.delete(`/phone-numbers/${id}`);
    return response.data;
  }

  // ===== Templates =====
  async getTemplates() {
    const response = await this.client.get('/templates');
    return response.data;
  }

  async createTemplate(templateData: any) {
    const response = await this.client.post('/templates', templateData);
    return response.data;
  }

  async getTemplate(id: string) {
    const response = await this.client.get(`/templates/${id}`);
    return response.data;
  }

  async updateTemplate(id: string, templateData: any) {
    const response = await this.client.put(`/templates/${id}`, templateData);
    return response.data;
  }

  async deleteTemplate(id: string) {
    const response = await this.client.delete(`/templates/${id}`);
    return response.data;
  }

  // ===== Usage / Billing =====
  async getUsageStats(dateRange?: string) {
    // Use dashboard stats for backward compatibility
    const dashboardStats = await this.getDashboardStats();
    return {
      totalMessages: dashboardStats.messageStats.totalMessages,
      deliveredMessages: dashboardStats.messageStats.deliveredMessages,
      failedMessages: dashboardStats.messageStats.failedMessages,
      // Map to old format for backward compatibility
      total: dashboardStats.messageStats.totalMessages,
      delivered: dashboardStats.messageStats.deliveredMessages,
      failed: dashboardStats.messageStats.failedMessages,
      sent: dashboardStats.messageStats.sentMessages,
      queued: dashboardStats.messageStats.pendingMessages,
      read: dashboardStats.messageStats.readMessages,
    };
  }

  async getInvoices() {
    try {
      const response = await this.client.get('/billing/invoices');
      return response.data;
    } catch (error) {
      // Return mock data for now since billing endpoints might not exist yet
      return {
        invoices: [],
        total: 0,
        pagination: { page: 1, limit: 10, total: 0, pages: 0, hasNext: false, hasPrev: false }
      };
    }
  }

  async getBillingOverview() {
    try {
      const response = await this.client.get('/billing/overview');
      return response.data;
    } catch (error) {
      console.error('Billing overview error:', error);
      return {
        currentPlan: 'starter',
        usageThisMonth: 0,
        usageLimit: 1000,
        costThisMonth: 0,
        nextBillingDate: new Date(),
      };
    }
  }

  // ===== Analytics =====
  async getAnalytics(params?: any) {
    try {
      const response = await this.client.get('/analytics', { params });
      return response.data;
    } catch (error) {
      console.error('Analytics error:', error);
      return {
        messageVolume: [],
        deliveryRates: [],
        templatePerformance: [],
        phoneNumberPerformance: [],
      };
    }
  }

  // ===== Webhooks =====
  async getWebhooks() {
    const response = await this.client.get('/webhooks');
    return response.data;
  }

  async createWebhook(webhookData: any) {
    const response = await this.client.post('/webhooks', webhookData);
    return response.data;
  }

  // ===== Settings =====
  async getProfile() {
    const response = await this.client.get('/auth/profile');
    return response.data;
  }

  async updateProfile(profileData: any) {
    const response = await this.client.put('/auth/profile', profileData);
    return response.data;
  }

  async changePassword(passwordData: any) {
    const response = await this.client.post('/auth/change-password', passwordData);
    return response.data;
  }

  // ===== Tenants (for admin users) =====
  async getTenants() {
    const response = await this.client.get('/tenants');
    return response.data;
  }

  async getTenant(id: string) {
    const response = await this.client.get(`/tenants/${id}`);
    return response.data;
  }

  async updateTenant(id: string, tenantData: any) {
    const response = await this.client.put(`/tenants/${id}`, tenantData);
    return response.data;
  }

  // ===== Utility methods =====
  async healthCheck() {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      return { status: 'error', message: 'API is not reachable' };
    }
  }
}

export const apiClient = new ApiClient();

// Export types for use in components
export type { MessageStats, DashboardStats, PaginatedResponse };
