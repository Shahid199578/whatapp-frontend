// src/components/analytics/DeliveryRatesChart.tsx
'use client';

interface DeliveryRatesChartProps {
  data: Array<{
    date: string;
    messages: number;
    delivered: number;
    failed: number;
  }>;
}

export function DeliveryRatesChart({ data }: DeliveryRatesChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = data.map(item => ({
    ...item,
    deliveryRate: item.messages > 0 ? (item.delivered / item.messages) * 100 : 0
  }));

  const averageDeliveryRate = chartData.reduce((sum, item) => sum + item.deliveryRate, 0) / chartData.length;

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="h-64 flex items-end space-x-1">
        {chartData.map((item, index) => {
          const height = item.deliveryRate;
          const color = height >= 95 ? 'bg-green-500' : 
                       height >= 85 ? 'bg-yellow-500' : 'bg-red-500';

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full max-w-6 relative" style={{ height: '200px' }}>
                <div
                  className={`absolute bottom-0 w-full ${color} rounded-t hover:opacity-80 transition-opacity cursor-pointer`}
                  style={{ height: `${height}%` }}
                  title={`${item.deliveryRate.toFixed(1)}% delivery rate on ${new Date(item.date).toLocaleDateString()}`}
                ></div>
              </div>
              <span className="text-xs text-gray-400 mt-2">
                {new Date(item.date).getDate()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Average Line */}
      <div className="relative">
        <div 
          className="absolute w-full border-t-2 border-dashed border-gray-400"
          style={{ top: `${100 - averageDeliveryRate}%` }}
        ></div>
        <span className="absolute right-0 -top-2 text-xs text-gray-500 bg-white px-1">
          Avg: {averageDeliveryRate.toFixed(1)}%
        </span>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Excellent (95%+)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Good (85-94%)</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Needs Attention (&lt;85%)</span>
        </div>
      </div>
    </div>
  );
}
