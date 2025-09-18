// src/app/dashboard/phone-numbers/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { AddPhoneNumberModal } from '@/components/phone-numbers/AddPhoneNumberModal';
import { PhoneNumbersList } from '@/components/phone-numbers/PhoneNumbersList';
import { VerifyPhoneModal } from '@/components/phone-numbers/VerifyPhoneModal';
import { apiClient } from '@/lib/api';
import { PhoneNumber } from '@/types';

export default function PhoneNumbersPage() {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<PhoneNumber | null>(null);

  useEffect(() => {
    fetchPhoneNumbers();
  }, []);

  const fetchPhoneNumbers = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getPhoneNumbers();
      setPhoneNumbers(response);
    } catch (error) {
      console.error('Failed to fetch phone numbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPhoneNumber = async (phoneData: any) => {
    try {
      await apiClient.addPhoneNumber(phoneData);
      setShowAddModal(false);
      fetchPhoneNumbers(); // Refresh list
    } catch (error) {
      console.error('Failed to add phone number:', error);
      throw error;
    }
  };

  const handleVerifyNumber = (phoneNumber: PhoneNumber) => {
    setSelectedNumber(phoneNumber);
    setShowVerifyModal(true);
  };

  const phoneNumberStats = {
    total: phoneNumbers.length,
    verified: phoneNumbers.filter(p => p.verificationStatus === 'verified').length,
    pending: phoneNumbers.filter(p => p.verificationStatus === 'pending').length,
    active: phoneNumbers.filter(p => p.status === 'active').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phone Numbers</h1>
          <p className="text-gray-600 mt-1">Manage your WhatsApp Business phone numbers</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-grey text-sm font-medium rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Phone Number
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PhoneIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Numbers</p>
              <p className="text-2xl font-semibold text-gray-900">{phoneNumberStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <PhoneIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Verified</p>
              <p className="text-2xl font-semibold text-gray-900">{phoneNumberStats.verified}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <PhoneIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{phoneNumberStats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <PhoneIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Active</p>
              <p className="text-2xl font-semibold text-gray-900">{phoneNumberStats.active}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phone Numbers List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <PhoneNumbersList 
          phoneNumbers={phoneNumbers} 
          loading={loading}
          onRefresh={fetchPhoneNumbers}
          onVerify={handleVerifyNumber}
        />
      </div>

      {/* Add Phone Number Modal */}
      {showAddModal && (
        <AddPhoneNumberModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleAddPhoneNumber}
        />
      )}

      {/* Verify Phone Modal */}
      {showVerifyModal && selectedNumber && (
        <VerifyPhoneModal
          isOpen={showVerifyModal}
          phoneNumber={selectedNumber}
          onClose={() => {
            setShowVerifyModal(false);
            setSelectedNumber(null);
          }}
          onVerified={() => {
            setShowVerifyModal(false);
            setSelectedNumber(null);
            fetchPhoneNumbers();
          }}
        />
      )}
    </div>
  );
}
