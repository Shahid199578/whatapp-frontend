// src/components/dashboard/DashboardHeader.tsx
'use client';

import { BellIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

export function DashboardHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}
            </h2>
            <p className="text-gray-600">
              {user?.tenant?.name} - {user?.tenant?.planType} Plan
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <BellIcon className="w-6 h-6" />
            </button>
            
            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <Cog6ToothIcon className="w-6 h-6" />
            </button>
            
            {/* User Menu */}
            <div className="relative">
              <button 
                onClick={logout}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 rounded-lg border border-red-200 hover:bg-red-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
