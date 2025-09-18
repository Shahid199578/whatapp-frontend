// src/components/analytics/CostAnalyticsChart.tsx
'use client';

interface CostAnalyticsChartProps {
  data: Array<{
    date: string;
    messages: number;
    cost: number;
  }>;
}

export function CostAnalyticsChart({ data }: CostAnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const maxCost = Math.max(...data.map(d => d.cost));
  const totalCost = data.reduce((sum, item) => sum + item.cost, 0);

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="h-64 flex items-end space-x-1">
        {data.map((item, index) => {
          const height = maxCost > 0 ? (item.cost / maxCost) * 100 : 0;
          const costPerMessage = item.messages > 0 ? item.cost / item.messages : 0;

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full max-w-6 relative" style={{ height: '200px' }}>
                <div
                  className="absolute bottom-0 w-full bg-purple-500 rounded-t hover:bg-purple-600 transition-colors cursor-pointer"
                  style={{ height: `${height}%` }}
                  title={`${formatCurrency(item.cost)} (${formatCurrency(costPerMessage)} per message) on ${new Date(item.date).toLocaleDateString()}`}
                ></div>
              </div>
              <span className="text-xs text-gray-400 mt-2">
                {new Date(item.date).getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(totalCost)}
          </p>
          <p className="text-xs text-gray-500">Total Cost</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(totalCost / data.length)}
          </p>
          <p className="text-xs text-gray-500">Daily Average</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {formatCurrency(totalCost / data.reduce((sum, item) => sum + item.messages, 0))}
          </p>
          <p className="text-xs text-gray-500">Cost per Message</p>
        </div>
      </div>
    </div>
  );
}
