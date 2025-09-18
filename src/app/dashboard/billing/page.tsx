// src/app/dashboard/billing/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { 
  CreditCardIcon,
  DocumentTextIcon,
  CalendarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { BillingOverview } from '@/components/billing/BillingOverview';
import { UsageMetrics } from '@/components/billing/UsageMetrics';
import { InvoicesList } from '@/components/billing/InvoicesList';
import { PaymentMethods } from '@/components/billing/PaymentMethods';
import { PlanManagement } from '@/components/billing/PlanManagement';
import { UpgradePlanModal } from '@/components/billing/UpgradePlanModal';
import { AddPaymentMethodModal } from '@/components/billing/AddPaymentMethodModal';
import { apiClient } from '@/lib/api';

interface BillingData {
  currentPlan: {
    name: string;
    price: number;
    features: string[];
    messagesIncluded: number;
    messagesUsed: number;
    billingCycle: 'monthly' | 'yearly';
  };
  currentUsage: {
    messagesThisMonth: number;
    costThisMonth: number;
    messagesLimit: number;
    daysInBillingCycle: number;
    daysRemaining: number;
  };
  upcomingInvoice: {
    amount: number;
    dueDate: string;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
  };
  paymentMethods: Array<{
    id: string;
    type: 'card' | 'bank';
    last4: string;
    brand: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
  }>;
  invoices: Array<{
    id: string;
    number: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    date: string;
    dueDate: string;
    downloadUrl: string;
  }>;
}

export default function BillingPage() {
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);

  useEffect(() => {
    fetchBillingData();
  }, []);

  const fetchBillingData = async () => {
    try {
      setLoading(true);
      const response = await apiClient.client.get('/billing');
      setBillingData(response.data);
    } catch (error) {
      console.error('Failed to fetch billing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlanUpgrade = async (planData: any) => {
    try {
      await apiClient.client.post('/billing/upgrade-plan', planData);
      setShowUpgradeModal(false);
      fetchBillingData(); // Refresh data
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      throw error;
    }
  };

  const handleAddPaymentMethod = async (paymentData: any) => {
    try {
      await apiClient.client.post('/billing/payment-methods', paymentData);
      setShowAddPaymentModal(false);
      fetchBillingData(); // Refresh data
    } catch (error) {
      console.error('Failed to add payment method:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg mt-8"></div>
        </div>
      </div>
    );
  }

  if (!billingData) {
    return (
      <div className="text-center py-12">
        <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No billing data</h3>
        <p className="mt-1 text-sm text-gray-500">
          Unable to load billing information.
        </p>
      </div>
    );
  }

  const usagePercentage = (billingData.currentUsage.messagesThisMonth / billingData.currentUsage.messagesLimit) * 100;
  const isOverLimit = usagePercentage > 100;
  const isNearLimit = usagePercentage > 80;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Billing & Usage</h1>
          <p className="text-gray-600 mt-1">Manage your subscription, usage, and payment methods</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setShowAddPaymentModal(true)}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <CreditCardIcon className="mr-2 h-4 w-4" />
            Add Payment Method
          </button>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Usage Alert */}
      {(isOverLimit || isNearLimit) && (
        <div className={`rounded-lg p-4 ${isOverLimit ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <div className="flex">
            <ExclamationTriangleIcon className={`h-5 w-5 ${isOverLimit ? 'text-red-400' : 'text-yellow-400'}`} />
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${isOverLimit ? 'text-red-800' : 'text-yellow-800'}`}>
                {isOverLimit ? 'Usage Limit Exceeded' : 'Approaching Usage Limit'}
              </h3>
              <p className={`text-sm mt-1 ${isOverLimit ? 'text-red-700' : 'text-yellow-700'}`}>
                {isOverLimit 
                  ? `You've used ${billingData.currentUsage.messagesThisMonth.toLocaleString()} messages, which exceeds your plan limit of ${billingData.currentUsage.messagesLimit.toLocaleString()}. Additional charges may apply.`
                  : `You've used ${usagePercentage.toFixed(1)}% of your monthly message limit. Consider upgrading your plan.`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Current Plan */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Current Plan</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{billingData.currentPlan.name}</p>
            <p className="text-gray-600">
              ${billingData.currentPlan.price}/{billingData.currentPlan.billingCycle === 'monthly' ? 'month' : 'year'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {billingData.currentPlan.messagesIncluded.toLocaleString()} messages included
            </p>
          </div>
        </div>

        {/* Monthly Usage */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">This Month</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {billingData.currentUsage.messagesThisMonth.toLocaleString()}
            </p>
            <p className="text-gray-600">messages sent</p>
            <div className="mt-3">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Usage</span>
                <span>{usagePercentage.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isOverLimit ? 'bg-red-600' : isNearLimit ? 'bg-yellow-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Cost */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Monthly Cost</h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCardIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              ${(billingData.currentUsage.costThisMonth / 100).toFixed(2)}
            </p>
            <p className="text-gray-600">total charges</p>
            <p className="text-sm text-gray-500 mt-2">
              {billingData.currentUsage.daysRemaining} days remaining in cycle
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Plan Management & Usage */}
        <div className="lg:col-span-2 space-y-8">
          {/* Plan Management */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <PlanManagement 
              currentPlan={billingData.currentPlan}
              onUpgrade={() => setShowUpgradeModal(true)}
            />
          </div>

          {/* Usage Metrics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <UsageMetrics usage={billingData.currentUsage} />
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <InvoicesList 
              invoices={billingData.invoices}
              upcomingInvoice={billingData.upcomingInvoice}
            />
          </div>
        </div>

        {/* Right Column - Billing Overview & Payment Methods */}
        <div className="space-y-8">
          {/* Billing Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <BillingOverview 
              upcomingInvoice={billingData.upcomingInvoice}
              currentUsage={billingData.currentUsage}
            />
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <PaymentMethods 
              paymentMethods={billingData.paymentMethods}
              onAddPaymentMethod={() => setShowAddPaymentModal(true)}
              onRefresh={fetchBillingData}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      {showUpgradeModal && (
        <UpgradePlanModal
          isOpen={showUpgradeModal}
          currentPlan={billingData.currentPlan}
          onClose={() => setShowUpgradeModal(false)}
          onUpgrade={handlePlanUpgrade}
        />
      )}

      {showAddPaymentModal && (
        <AddPaymentMethodModal
          isOpen={showAddPaymentModal}
          onClose={() => setShowAddPaymentModal(false)}
          onAdd={handleAddPaymentMethod}
        />
      )}
    </div>
  );
}
