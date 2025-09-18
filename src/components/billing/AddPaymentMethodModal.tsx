// src/components/billing/AddPaymentMethodModal.tsx
'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  XMarkIcon,
  CreditCardIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (paymentData: any) => Promise<void>;
}

export function AddPaymentMethodModal({ isOpen, onClose, onAdd }: AddPaymentMethodModalProps) {
  const [paymentType, setPaymentType] = useState<'card' | 'bank'>('card');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Card form data
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    saveAsDefault: true,
  });

  // Bank form data
  const [bankData, setBankData] = useState({
    accountHolderName: '',
    routingNumber: '',
    accountNumber: '',
    accountType: 'checking',
    bankName: '',
    saveAsDefault: true,
  });

  const validateCardForm = () => {
    const newErrors: Record<string, string> = {};

    // Card number validation (basic Luhn algorithm check could be added)
    if (!cardData.cardNumber.replace(/\s/g, '')) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{13,19}$/.test(cardData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Invalid card number';
    }

    // Expiry validation
    if (!cardData.expiryMonth || !cardData.expiryYear) {
      newErrors.expiry = 'Expiry date is required';
    } else {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;
      const expMonth = parseInt(cardData.expiryMonth);
      const expYear = parseInt(cardData.expiryYear);
      
      if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
        newErrors.expiry = 'Card has expired';
      }
    }

    // CVV validation
    if (!cardData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
      newErrors.cvv = 'Invalid CVV';
    }

    // Cardholder name
    if (!cardData.cardholderName.trim()) {
      newErrors.cardholderName = 'Cardholder name is required';
    }

    // Billing address
    if (!cardData.billingAddress.street.trim()) {
      newErrors.street = 'Street address is required';
    }
    if (!cardData.billingAddress.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!cardData.billingAddress.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }
    if (!cardData.billingAddress.country) {
      newErrors.country = 'Country is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateBankForm = () => {
    const newErrors: Record<string, string> = {};

    if (!bankData.accountHolderName.trim()) {
      newErrors.accountHolderName = 'Account holder name is required';
    }

    if (!bankData.routingNumber) {
      newErrors.routingNumber = 'Routing number is required';
    } else if (!/^\d{9}$/.test(bankData.routingNumber)) {
      newErrors.routingNumber = 'Routing number must be 9 digits';
    }

    if (!bankData.accountNumber) {
      newErrors.accountNumber = 'Account number is required';
    } else if (!/^\d{4,17}$/.test(bankData.accountNumber)) {
      newErrors.accountNumber = 'Invalid account number';
    }

    if (!bankData.bankName.trim()) {
      newErrors.bankName = 'Bank name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = paymentType === 'card' ? validateCardForm() : validateBankForm();
    
    if (!isValid) {
      return;
    }

    setLoading(true);
    try {
      const paymentData = {
        type: paymentType,
        ...(paymentType === 'card' ? { card: cardData } : { bank: bankData }),
      };
      
      await onAdd(paymentData);
      
      // Reset forms
      setCardData({
        cardNumber: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: '',
        cardholderName: '',
        billingAddress: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
        },
        saveAsDefault: true,
      });
      setBankData({
        accountHolderName: '',
        routingNumber: '',
        accountNumber: '',
        accountType: 'checking',
        bankName: '',
        saveAsDefault: true,
      });
      setErrors({});
    } catch (error: any) {
      setErrors({ 
        general: error.response?.data?.message || 'Failed to add payment method' 
      });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 19) {
      setCardData(prev => ({ ...prev, cardNumber: formatted }));
    }
  };

  const countries = [
    'United States',
    'Canada',
    'United Kingdom',
    'Germany',
    'France',
    'Australia',
    'Other'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, '0'),
    label: (i + 1).toString().padStart(2, '0')
  }));

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex items-center justify-between"
                >
                  Add Payment Method
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                {/* Security Notice */}
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex">
                    <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-green-800">Secure Payment Processing</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Your payment information is encrypted and securely processed by Stripe. 
                        We never store your complete card details on our servers.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Type Selection */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Payment Method Type
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPaymentType('card')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        paymentType === 'card'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <CreditCardIcon className={`h-6 w-6 mr-2 ${
                          paymentType === 'card' ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <span className={`font-medium ${
                          paymentType === 'card' ? 'text-primary-900' : 'text-gray-700'
                        }`}>
                          Credit/Debit Card
                        </span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentType('bank')}
                      className={`p-4 border-2 rounded-lg transition-colors ${
                        paymentType === 'bank'
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <BanknotesIcon className={`h-6 w-6 mr-2 ${
                          paymentType === 'bank' ? 'text-primary-600' : 'text-gray-400'
                        }`} />
                        <span className={`font-medium ${
                          paymentType === 'bank' ? 'text-primary-900' : 'text-gray-700'
                        }`}>
                          Bank Account
                        </span>
                      </div>
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                      {errors.general}
                    </div>
                  )}

                  {/* Card Form */}
                  {paymentType === 'card' && (
                    <div className="space-y-6">
                      {/* Card Details */}
                      <div>
                        <h4 className="text-base font-medium text-gray-900 mb-4">Card Information</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Card Number *
                            </label>
                            <input
                              type="text"
                              value={cardData.cardNumber}
                              onChange={handleCardNumberChange}
                              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                errors.cardNumber ? 'border-red-300' : ''
                              }`}
                              placeholder="1234 5678 9012 3456"
                              maxLength={23} // 19 digits + 4 spaces
                              required
                            />
                            {errors.cardNumber && (
                              <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Month *
                              </label>
                              <select
                                value={cardData.expiryMonth}
                                onChange={(e) => setCardData(prev => ({ ...prev, expiryMonth: e.target.value }))}
                                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                  errors.expiry ? 'border-red-300' : ''
                                }`}
                                required
                              >
                                <option value="">MM</option>
                                {months.map((month) => (
                                  <option key={month.value} value={month.value}>
                                    {month.label}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year *
                              </label>
                              <select
                                value={cardData.expiryYear}
                                onChange={(e) => setCardData(prev => ({ ...prev, expiryYear: e.target.value }))}
                                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                  errors.expiry ? 'border-red-300' : ''
                                }`}
                                required
                              >
                                <option value="">YYYY</option>
                                {years.map((year) => (
                                  <option key={year} value={year}>
                                    {year}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                CVV *
                              </label>
                              <input
                                type="text"
                                value={cardData.cvv}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  if (value.length <= 4) {
                                    setCardData(prev => ({ ...prev, cvv: value }));
                                  }
                                }}
                                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                  errors.cvv ? 'border-red-300' : ''
                                }`}
                                placeholder="123"
                                maxLength={4}
                                required
                              />
                            </div>
                          </div>
                          
                          {errors.expiry && (
                            <p className="text-sm text-red-600">{errors.expiry}</p>
                          )}
                          {errors.cvv && (
                            <p className="text-sm text-red-600">{errors.cvv}</p>
                          )}

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Cardholder Name *
                            </label>
                            <input
                              type="text"
                              value={cardData.cardholderName}
                              onChange={(e) => setCardData(prev => ({ ...prev, cardholderName: e.target.value }))}
                              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                errors.cardholderName ? 'border-red-300' : ''
                              }`}
                              placeholder="John Doe"
                              required
                            />
                            {errors.cardholderName && (
                              <p className="mt-1 text-sm text-red-600">{errors.cardholderName}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Billing Address */}
                      <div>
                        <h4 className="text-base font-medium text-gray-900 mb-4">Billing Address</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Street Address *
                            </label>
                            <input
                              type="text"
                              value={cardData.billingAddress.street}
                              onChange={(e) => setCardData(prev => ({
                                ...prev,
                                billingAddress: { ...prev.billingAddress, street: e.target.value }
                              }))}
                              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                errors.street ? 'border-red-300' : ''
                              }`}
                              placeholder="123 Main Street"
                              required
                            />
                            {errors.street && (
                              <p className="mt-1 text-sm text-red-600">{errors.street}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                City *
                              </label>
                              <input
                                type="text"
                                value={cardData.billingAddress.city}
                                onChange={(e) => setCardData(prev => ({
                                  ...prev,
                                  billingAddress: { ...prev.billingAddress, city: e.target.value }
                                }))}
                                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                  errors.city ? 'border-red-300' : ''
                                }`}
                                placeholder="San Francisco"
                                required
                              />
                              {errors.city && (
                                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                State/Province
                              </label>
                              <input
                                type="text"
                                value={cardData.billingAddress.state}
                                onChange={(e) => setCardData(prev => ({
                                  ...prev,
                                  billingAddress: { ...prev.billingAddress, state: e.target.value }
                                }))}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                placeholder="CA"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP/Postal Code *
                              </label>
                              <input
                                type="text"
                                value={cardData.billingAddress.zipCode}
                                onChange={(e) => setCardData(prev => ({
                                  ...prev,
                                  billingAddress: { ...prev.billingAddress, zipCode: e.target.value }
                                }))}
                                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                  errors.zipCode ? 'border-red-300' : ''
                                }`}
                                placeholder="94105"
                                required
                              />
                              {errors.zipCode && (
                                <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Country *
                              </label>
                              <select
                                value={cardData.billingAddress.country}
                                onChange={(e) => setCardData(prev => ({
                                  ...prev,
                                  billingAddress: { ...prev.billingAddress, country: e.target.value }
                                }))}
                                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                  errors.country ? 'border-red-300' : ''
                                }`}
                                required
                              >
                                <option value="">Select Country</option>
                                {countries.map((country) => (
                                  <option key={country} value={country}>
                                    {country}
                                  </option>
                                ))}
                              </select>
                              {errors.country && (
                                <p className="mt-1 text-sm text-red-600">{errors.country}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bank Form */}
                  {paymentType === 'bank' && (
                    <div className="space-y-6">
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex">
                          <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-yellow-800">ACH Payment Notice</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              Bank transfers may take 3-5 business days to process. 
                              Please ensure your account has sufficient funds.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-base font-medium text-gray-900 mb-4">Bank Account Information</h4>
                        
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Account Holder Name *
                            </label>
                            <input
                              type="text"
                              value={bankData.accountHolderName}
                              onChange={(e) => setBankData(prev => ({ ...prev, accountHolderName: e.target.value }))}
                              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                errors.accountHolderName ? 'border-red-300' : ''
                              }`}
                              placeholder="John Doe"
                              required
                            />
                            {errors.accountHolderName && (
                              <p className="mt-1 text-sm text-red-600">{errors.accountHolderName}</p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Bank Name *
                            </label>
                            <input
                              type="text"
                              value={bankData.bankName}
                              onChange={(e) => setBankData(prev => ({ ...prev, bankName: e.target.value }))}
                              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                errors.bankName ? 'border-red-300' : ''
                              }`}
                              placeholder="Chase Bank"
                              required
                            />
                            {errors.bankName && (
                              <p className="mt-1 text-sm text-red-600">{errors.bankName}</p>
                            )}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Routing Number *
                              </label>
                              <input
                                type="text"
                                value={bankData.routingNumber}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  if (value.length <= 9) {
                                    setBankData(prev => ({ ...prev, routingNumber: value }));
                                  }
                                }}
                                className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                  errors.routingNumber ? 'border-red-300' : ''
                                }`}
                                placeholder="123456789"
                                maxLength={9}
                                required
                              />
                              {errors.routingNumber && (
                                <p className="mt-1 text-sm text-red-600">{errors.routingNumber}</p>
                              )}
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Account Type *
                              </label>
                              <select
                                value={bankData.accountType}
                                onChange={(e) => setBankData(prev => ({ ...prev, accountType: e.target.value }))}
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                                required
                              >
                                <option value="checking">Checking</option>
                                <option value="savings">Savings</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Account Number *
                            </label>
                            <input
                              type="text"
                              value={bankData.accountNumber}
                              onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length <= 17) {
                                  setBankData(prev => ({ ...prev, accountNumber: value }));
                                }
                              }}
                              className={`w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 ${
                                errors.accountNumber ? 'border-red-300' : ''
                              }`}
                              placeholder="1234567890"
                              maxLength={17}
                              required
                            />
                            {errors.accountNumber && (
                              <p className="mt-1 text-sm text-red-600">{errors.accountNumber}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Set as Default */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={paymentType === 'card' ? cardData.saveAsDefault : bankData.saveAsDefault}
                      onChange={(e) => {
                        if (paymentType === 'card') {
                          setCardData(prev => ({ ...prev, saveAsDefault: e.target.checked }));
                        } else {
                          setBankData(prev => ({ ...prev, saveAsDefault: e.target.checked }));
                        }
                      }}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Set as default payment method
                    </label>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? 'Adding...' : `Add ${paymentType === 'card' ? 'Card' : 'Bank Account'}`}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
