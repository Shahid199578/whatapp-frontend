// src/components/dashboard/UsageChart.tsx
'use client';

import React from 'react';

interface UsageTrend {
  date: string;
  total: number;
  sent: number;
  delivered: number;
  failed: number;
}

interface UsageChartProps {
  data: UsageTrend[];
}

export function UsageChart({ data }: UsageChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p>No usage data available</p>
        </div>
      </div>
    );
  }

  // Simple bar chart representation
  const maxValue = Math.max(...data.map(d => d.total));

  return (
    <div className="h-64 space-y-4">
      {/* Chart Header */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Total</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Delivered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded"></div>
            <span>Failed</span>
          </div>
        </div>
      </div>

      {/* Simple Bar Chart */}
      <div className="flex items-end space-x-2 h-48">
        {data.slice(-7).map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center space-y-1">
            {/* Bars */}
            <div className="w-full flex flex-col items-center space-y-1">
              {/* Total bar */}
              <div 
                className="w-full bg-blue-500 rounded-t"
                style={{ height: `${(item.total / maxValue) * 160}px`, minHeight: '2px' }}
                title={`Total: ${item.total}`}
              ></div>
              
              {/* Delivered section */}
              <div 
                className="w-3/4 bg-green-500"
                style={{ height: `${(item.delivered / maxValue) * 160}px`, minHeight: '1px' }}
                title={`Delivered: ${item.delivered}`}
              ></div>
              
              {/* Failed section */}
              {item.failed > 0 && (
                <div 
                  className="w-1/2 bg-red-500"
                  style={{ height: `${(item.failed / maxValue) * 160}px`, minHeight: '1px' }}
                  title={`Failed: ${item.failed}`}
                ></div>
              )}
            </div>
            
            {/* Date label */}
            <div className="text-xs text-gray-500 transform rotate-45 origin-left">
              {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center">
          <div className="font-semibold text-blue-600">{data.reduce((sum, d) => sum + d.total, 0)}</div>
          <div className="text-gray-500">Total Messages</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-green-600">{data.reduce((sum, d) => sum + d.delivered, 0)}</div>
          <div className="text-gray-500">Delivered</div>
        </div>
        <div className="text-center">
          <div className="font-semibold text-red-600">{data.reduce((sum, d) => sum + d.failed, 0)}</div>
          <div className="text-gray-500">Failed</div>
        </div>
      </div>
    </div>
  );
}
