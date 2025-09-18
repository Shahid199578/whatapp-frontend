// src/components/billing/PaymentMethods.tsx
'use client';

import { 
  CreditCardIcon,
  PlusIcon,
  CheckCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { apiClient } from '@/lib/api';

interface PaymentMethodsProps {
  paymentMethods: Array<{
    id: string;
    type: 'card' | 'bank';
    last4: string;
    brand: string;
    expiryMonth?: number;
    expiryYear?: number;
    isDefault: boolean;
  }>;
  onAddPaymentMethod: () => void;
  onRefresh: () => void;
}

export function PaymentMethods({ paymentMethods, onAddPaymentMethod, onRefresh }: PaymentMethodsProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleSetDefault = async (paymentMethodId: string) => {
    try {
      setLoading(paymentMethodId);
      await apiClient.client.patch(`/billing/payment-methods/${paymentMethodId}/default`);
      onRefresh();
    } catch (error) {
      console.error('Failed to set default payment method:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (paymentMethodId: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) {
      return;
    }

    try {
      setLoading(paymentMethodId);
      await apiClient.client.delete(`/billing/payment-methods/${paymentMethodId}`);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete payment method:', error);
    } finally {
      setLoading(null);
    }
  };

  const getBrandIcon = (brand: string) => {
    return <CreditCardIcon className="h-6 w-6 text-gray-400" />;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
        <button
          onClick={onAddPaymentMethod}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Add Method
        </button>
      </div>

      <div className="space-y-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 border rounded-lg ${
              method.isDefault ? 'border-primary-200 bg-primary-50' : 'border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {getBrandIcon(method.brand)}
                <div className="ml-3">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-gray-900">
                      {method.brand.toUpperCase()} •••• {method.last4}
                    </p>
                    {method.isDefault && (
                      <div className="ml-2 flex items-center">
                        <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 font-medium">Default</span>
                      </div>
                    )}
                  </div>
                  {method.expiryMonth && method.expiryYear && (
                    <p className="text-xs text-gray-500">
                      Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {!method.isDefault && (
                  <button
                    onClick={() => handleSetDefault(method.id)}
                    disabled={loading === method.id}
                    className="px-2 py-1 text-xs font-medium text-primary-600 bg-white border border-primary-200 rounded hover:bg-primary-50 disabled:opacity-50 transition-colors"
                  >
                    {loading === method.id ? 'Setting...' : 'Set Default'}
                  </button>
                )}
                
                <button
                  onClick={() => handleDelete(method.id)}
                  disabled={loading === method.id || method.isDefault}
                  className="p-1 text-red-600 hover:text-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  title={method.isDefault ? 'Cannot delete default payment method' : 'Delete payment method'}
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {paymentMethods.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <CreditCardIcon className="mx-auto h-8 w-8 text-gray-400" />
            <h4 className="mt-2 text-sm font-medium text-gray-900">No payment methods</h4>
            <p className="mt-1 text-sm text-gray-500">
              Add a payment method to enable automatic billing.
            </p>
            <button
              onClick={onAddPaymentMethod}
              className="mt-3 inline-flex items-center px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Payment Method
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
