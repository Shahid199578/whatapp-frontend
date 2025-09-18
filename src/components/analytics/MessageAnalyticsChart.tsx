// src/components/analytics/MessageAnalyticsChart.tsx
'use client';

interface MessageAnalyticsChartProps {
  data: Array<{
    date: string;
    messages: number;
    delivered: number;
    failed: number;
    cost: number;
  }>;
}

export function MessageAnalyticsChart({ data }: MessageAnalyticsChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const maxMessages = Math.max(...data.map(d => d.messages));

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-center space-x-6 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Total Messages</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Delivered</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-gray-600">Failed</span>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 flex items-end space-x-1">
        {data.map((item, index) => {
          const totalHeight = (item.messages / maxMessages) * 100;
          const deliveredHeight = (item.delivered / maxMessages) * 100;
          const failedHeight = (item.failed / maxMessages) * 100;

          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full max-w-6 relative" style={{ height: '200px' }}>
                {/* Failed messages */}
                <div
                  className="absolute bottom-0 w-full bg-red-500 rounded-t"
                  style={{ height: `${failedHeight}%` }}
                  title={`${item.failed} failed messages on ${new Date(item.date).toLocaleDateString()}`}
                ></div>
                {/* Delivered messages */}
                <div
                  className="absolute bottom-0 w-full bg-green-500 rounded-t"
                  style={{ height: `${deliveredHeight}%` }}
                  title={`${item.delivered} delivered messages on ${new Date(item.date).toLocaleDateString()}`}
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
          <p className="text-2xl font-bold text-blue-600">
            {data.reduce((sum, item) => sum + item.messages, 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Total Messages</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {data.reduce((sum, item) => sum + item.delivered, 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Delivered</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-red-600">
            {data.reduce((sum, item) => sum + item.failed, 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Failed</p>
        </div>
      </div>
    </div>
  );
}
