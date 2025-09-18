// src/components/analytics/PhoneNumberPerformance.tsx
'use client';

interface PhoneNumberPerformanceProps {
  data: Array<{
    phoneNumber: string;
    messages: number;
    deliveryRate: number;
    cost: number;
  }>;
}

export function PhoneNumberPerformance({ data }: PhoneNumberPerformanceProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const getDeliveryRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600 bg-green-50';
    if (rate >= 85) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No phone number data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Phone Number</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Messages</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Delivery Rate</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Cost</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((phone, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{phone.phoneNumber}</div>
              </td>
              <td className="py-3 px-4">
                <div className="text-gray-900">{phone.messages.toLocaleString()}</div>
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeliveryRateColor(phone.deliveryRate)}`}>
                  {phone.deliveryRate.toFixed(1)}%
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="text-gray-900">{formatCurrency(phone.cost)}</div>
                <div className="text-xs text-gray-500">
                  {formatCurrency(phone.cost / phone.messages)} per msg
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
