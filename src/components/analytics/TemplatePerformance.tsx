// src/components/analytics/TemplatePerformance.tsx
'use client';

interface TemplatePerformanceProps {
  data: Array<{
    templateName: string;
    messages: number;
    deliveryRate: number;
    category: string;
  }>;
}

export function TemplatePerformance({ data }: TemplatePerformanceProps) {
  const getDeliveryRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600 bg-green-50';
    if (rate >= 85) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getCategoryBadge = (category: string) => {
    const baseClasses = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (category) {
      case 'AUTHENTICATION':
        return `${baseClasses} text-blue-800 bg-blue-100`;
      case 'MARKETING':
        return `${baseClasses} text-purple-800 bg-purple-100`;
      case 'UTILITY':
        return `${baseClasses} text-indigo-800 bg-indigo-100`;
      default:
        return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No template data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 font-medium text-gray-700">Template</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Messages</th>
            <th className="text-left py-3 px-4 font-medium text-gray-700">Delivery Rate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((template, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-3 px-4">
                <div className="font-medium text-gray-900">{template.templateName}</div>
              </td>
              <td className="py-3 px-4">
                <span className={getCategoryBadge(template.category)}>
                  {template.category}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="text-gray-900">{template.messages.toLocaleString()}</div>
              </td>
              <td className="py-3 px-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDeliveryRateColor(template.deliveryRate)}`}>
                  {template.deliveryRate.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
