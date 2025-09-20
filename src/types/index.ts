// src/types/index.ts
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'client';
  tenant: Tenant;
}

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  planType: string;
  status: string;
}

export interface PhoneNumber {
  id: string;
  phoneNumber: string;
  displayPhoneNumber: string;
  verificationStatus: 'pending' | 'verified' | 'failed';
  qualityRating: 'high' | 'medium' | 'low' | 'unknown';
  messagingLimit: number;
  status: 'active' | 'inactive';
}

export interface Message {
  id: string;
  recipientPhone: string;
  messageType: 'text' | 'template' | 'media';
  content: any;
  status: 'queued' | 'sent' | 'delivered' | 'read' | 'failed';
  createdAt: string;
  sentAt?: string;
  deliveredAt?: string;
  errorMessage?: string;
}

export interface MessageTemplate {
  rejectionReason: ReactNode;
  id: string;
  templateName: string;
  language: string;
  category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
  status: 'pending' | 'approved' | 'rejected';
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttons?: any[];
}

export interface UsageStats {
  totalMessages: number;
  deliveredMessages: number;
  failedMessages: number;
  totalCost: number;
  dailyStats: Array<{
    date: string;
    messageCount: number;
    cost: number;
  }>;
}
