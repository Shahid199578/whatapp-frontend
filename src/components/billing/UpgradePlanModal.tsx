// src/components/billing/UpgradePlanModal.tsx
'use client';

import { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { 
  XMarkIcon,
  CheckIcon,
  SparklesIcon,
  ArrowUpIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

interface Plan {
  id: string;
  name: string;
  price: number;
  yearlyPrice?: number;
  messagesIncluded: number;
  features: string[];
  popular?: boolean;
  enterprise?: boolean;
}

interface UpgradePlanModalProps {
  isOpen: boolean;
  currentPlan: {
    name: string;
    price: number;
    billingCycle: 'monthly' | 'yearly';
  };
  onClose: () => void;
  onUpgrade: (upgradeData: any) => Promise<void>;
}

const plans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 29,
    yearlyPrice: 290, // ~17% discount
    messagesIncluded: 1000,
    features: [
      'Up to 1,000 messages/month',
      '1 phone number',
      '5 message templates',
      'Basic analytics',
      'Email support',
      'Webhook support'
    ]
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 99,
    yearlyPrice: 990, // ~17% discount
    messagesIncluded: 10000,
    features: [
      'Up to 10,000 messages/month',
      '5 phone numbers',
      'Unlimited templates',
      'Advanced analytics',
      'Priority support',
      'Webhooks & API access',
      'Custom integrations',
      'Team collaboration'
    ],
    popular: true
  },
  {
    id: 'business',
    name: 'Business',
    price: 299,
    yearlyPrice: 2990, // ~17% discount
    messagesIncluded: 50000,
    features: [
      'Up to 50,000 messages/month',
      '15 phone numbers',
      'Unlimited templates',
      'Advanced analytics & reporting',
      'Priority support',
      'Full API access',
      'Custom integrations',
      'Team collaboration',
      'Dedicated account manager',
      'SLA guarantee'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 0, // Custom pricing
    messagesIncluded: 0, // Unlimited
    features: [
      'Unlimited messages',
      'Unlimited phone numbers',
      'White-label solution',
      'Custom integrations',
      'Dedicated support team',
      'SLA guarantee',
      '24/7 phone support',
      'Custom contracts',
      'On-premise deployment option',
      'Advanced security features'
    ],
    enterprise: true
  }
];

export function UpgradePlanModal({ isOpen, currentPlan, onClose, onUpgrade }: UpgradePlanModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [prorationDetails, setProrationDetails] = useState<{
    immediateCharge: number;
    nextBilling: number;
    creditApplied: number;
  } | null>(null);

  const handlePlanSelect = (plan: Plan) => {
    if (plan.enterprise) {
      // Handle enterprise plan differently
      window.open('/contact?plan=enterprise', '_blank');
      return;
    }
    
    setSelectedPlan(plan);
    
    // Simulate proration calculation (in real app, this would be an API call)
    if (plan.price > currentPlan.price) {
      const monthlyDiff = plan.price - currentPlan.price;
      const daysRemaining = Math.floor(Math.random() * 30); // Simulate days remaining
      const prorationAmount = (monthlyDiff / 30) * daysRemaining;
      
      setProrationDetails({
        immediateCharge: Math.round(prorationAmount * 100) / 100,
        nextBilling: billingCycle === 'yearly' ? (plan.yearlyPrice || plan.price * 12) : plan.price,
        creditApplied: 0
      });
    }
    
    setShowConfirmation(true);
  };

  const handleConfirmUpgrade = async () => {
    if (!selectedPlan) return;

    setLoading(true);
    try {
      await onUpgrade({
        planId: selectedPlan.id,
        billingCycle: billingCycle,
        prorationAmount: prorationDetails?.immediateCharge || 0
      });
      
      onClose();
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      // Error would be handled by parent component
    } finally {
      setLoading(false);
    }
  };

  const getEffectivePrice = (plan: Plan) => {
    if (billingCycle === 'yearly' && plan.yearlyPrice) {
      return plan.yearlyPrice / 12; // Monthly equivalent
    }
    return plan.price;
  };

  const getSavingsPercentage = (plan: Plan) => {
    if (billingCycle === 'yearly' && plan.yearlyPrice) {
      const monthlyCost = plan.price * 12;
      const yearlyCost = plan.yearlyPrice;
      return Math.round(((monthlyCost - yearlyCost) / monthlyCost) * 100);
    }
    return 0;
  };

  const isCurrentPlan = (plan: Plan) => {
    return plan.name.toLowerCase() === currentPlan.name.toLowerCase();
  };

  const isPlanDowngrade = (plan: Plan) => {
    return plan.price < currentPlan.price;
  };

  const filteredPlans = plans.filter(plan => !isCurrentPlan(plan));

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
              <Dialog.Panel className="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-gray-900 flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <SparklesIcon className="h-6 w-6 text-primary-600 mr-2" />
                    Upgrade Your Plan
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                {!showConfirmation ? (
                  <div>
                    {/* Current Plan Info */}
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center">
                        <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <div>
                          <span className="text-sm text-blue-800">
                            Current Plan: <strong>{currentPlan.name}</strong> (${currentPlan.price}/{currentPlan.billingCycle === 'yearly' ? 'year' : 'month'})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Billing Cycle Toggle */}
                    <div className="mt-6 flex justify-center">
                      <div className="bg-gray-100 p-1 rounded-lg">
                        <button
                          onClick={() => setBillingCycle('monthly')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                            billingCycle === 'monthly'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Monthly
                        </button>
                        <button
                          onClick={() => setBillingCycle('yearly')}
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                            billingCycle === 'yearly'
                              ? 'bg-white text-gray-900 shadow-sm'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          Yearly
                          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-1 py-0.5 rounded-full">
                            Save 17%
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPlans.map((plan) => {
                        const effectivePrice = getEffectivePrice(plan);
                        const savings = getSavingsPercentage(plan);
                        const isDowngrade = isPlanDowngrade(plan);

                        return (
                          <div
                            key={plan.id}
                            className={`relative p-6 rounded-2xl border-2 transition-all hover:shadow-lg ${
                              plan.popular 
                                ? 'border-primary-500 bg-primary-50' 
                                : 'border-gray-200 bg-white'
                            } ${isDowngrade ? 'opacity-75' : ''}`}
                          >
                            {plan.popular && (
                              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                  Most Popular
                                </span>
                              </div>
                            )}

                            <div className="text-center">
                              <h3 className="text-xl font-bold text-gray-900 mb-2">
                                {plan.name}
                                {isDowngrade && (
                                  <span className="ml-2 text-sm text-amber-600">(Downgrade)</span>
                                )}
                              </h3>
                              
                              {plan.enterprise ? (
                                <div className="mb-4">
                                  <span className="text-3xl font-bold text-gray-900">Custom</span>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Contact sales for pricing
                                  </p>
                                </div>
                              ) : (
                                <div className="mb-4">
                                  <span className="text-4xl font-bold text-gray-900">
                                    ${effectivePrice}
                                  </span>
                                  <span className="text-gray-500">
                                    /{billingCycle === 'yearly' ? 'mo' : 'month'}
                                  </span>
                                  
                                  {billingCycle === 'yearly' && savings > 0 && (
                                    <div className="text-sm text-green-600 font-medium mt-1">
                                      Save {savings}% annually
                                    </div>
                                  )}
                                  
                                  {billingCycle === 'yearly' && plan.yearlyPrice && (
                                    <div className="text-sm text-gray-500 mt-1">
                                      ${plan.yearlyPrice} billed yearly
                                    </div>
                                  )}
                                </div>
                              )}

                              <p className="text-gray-600 mb-6">
                                {plan.enterprise 
                                  ? 'For large organizations with custom needs'
                                  : `${plan.messagesIncluded.toLocaleString()} messages included`
                                }
                              </p>
                            </div>

                            {/* Features List */}
                            <ul className="space-y-3 mb-6">
                              {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <CheckIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                                  <span className="text-sm text-gray-700">{feature}</span>
                                </li>
                              ))}
                            </ul>

                            {/* Action Button */}
                            <button
                              onClick={() => handlePlanSelect(plan)}
                              disabled={isDowngrade && !plan.enterprise}
                              className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                                plan.popular
                                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                                  : plan.enterprise
                                  ? 'bg-gray-800 text-white hover:bg-gray-900'
                                  : isDowngrade
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                              }`}
                            >
                              {plan.enterprise 
                                ? 'Contact Sales' 
                                : isDowngrade 
                                ? 'Downgrade Not Available'
                                : `Upgrade to ${plan.name}`
                              }
                            </button>

                            {isDowngrade && (
                              <p className="text-xs text-amber-600 mt-2 text-center">
                                Contact support for downgrades
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Additional Info */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">What happens when you upgrade?</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Immediate access to new features and higher limits</li>
                        <li>• Prorated billing based on remaining billing cycle</li>
                        <li>• No service interruption during the upgrade</li>
                        <li>• You can cancel or change plans anytime</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  /* Confirmation Step */
                  <div className="mt-6">
                    <div className="text-center mb-6">
                      <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                        <ArrowUpIcon className="h-8 w-8 text-primary-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Confirm Plan Upgrade
                      </h3>
                      <p className="text-gray-600">
                        You're upgrading from <strong>{currentPlan.name}</strong> to <strong>{selectedPlan?.name}</strong>
                      </p>
                    </div>

                    {/* Billing Summary */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                        <CreditCardIcon className="h-5 w-5 mr-2" />
                        Billing Summary
                      </h4>
                      
                      <div className="space-y-3">
                        {prorationDetails && prorationDetails.immediateCharge > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Prorated charge (today)</span>
                            <span className="text-sm font-medium text-gray-900">
                              ${prorationDetails.immediateCharge}
                            </span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">
                            Next billing ({billingCycle === 'yearly' ? 'yearly' : 'monthly'})
                          </span>
                          <span className="text-sm font-medium text-gray-900">
                            ${prorationDetails?.nextBilling}
                          </span>
                        </div>
                        
                        {billingCycle === 'yearly' && selectedPlan && getSavingsPercentage(selectedPlan) > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span className="text-sm">Annual savings</span>
                            <span className="text-sm font-medium">
                              {getSavingsPercentage(selectedPlan)}% off
                            </span>
                          </div>
                        )}
                        
                        <div className="border-t pt-3 flex justify-between">
                          <span className="font-medium text-gray-900">Total due today</span>
                          <span className="font-bold text-gray-900">
                            ${prorationDetails?.immediateCharge || 0}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Important Notice */}
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
                      <div className="flex">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
                        <div>
                          <h5 className="text-sm font-medium text-yellow-800">Important</h5>
                          <p className="text-sm text-yellow-700 mt-1">
                            Your new plan will be active immediately. You'll be charged the prorated amount today 
                            and the full amount on your next billing date.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => setShowConfirmation(false)}
                        className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                      >
                        Back to Plans
                      </button>
                      <button
                        onClick={handleConfirmUpgrade}
                        disabled={loading}
                        className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Processing...' : 'Confirm Upgrade'}
                      </button>
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
