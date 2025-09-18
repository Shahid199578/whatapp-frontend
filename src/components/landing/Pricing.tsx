// src/components/landing/Pricing.tsx
import Link from 'next/link';
import { CheckIcon } from '@heroicons/react/24/outline';

const plans = [
  {
    name: 'Starter',
    price: '$29',
    description: 'Perfect for small businesses',
    features: [
      'Up to 1,000 messages/month',
      '1 phone number',
      '5 message templates',
      'Basic analytics',
      'Email support'
    ],
    cta: 'Get Started',
    href: '/auth/register?plan=starter',
    popular: false
  },
  {
    name: 'Professional',
    price: '$99',
    description: 'For growing businesses',
    features: [
      'Up to 10,000 messages/month',
      '5 phone numbers',
      'Unlimited templates',
      'Advanced analytics',
      'Priority support',
      'Webhooks & API access'
    ],
    cta: 'Get Started',
    href: '/auth/register?plan=professional',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations',
    features: [
      'Unlimited messages',
      'Unlimited phone numbers',
      'White-label solution',
      'Custom integrations',
      'Dedicated support',
      'SLA guarantee'
    ],
    cta: 'Contact Sales',
    href: '/contact',
    popular: false
  }
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-gray-600">
            Pay only for what you use. No hidden fees or long-term commitments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              className={`bg-white p-8 rounded-2xl border ${
                plan.popular ? 'border-2 border-primary-500 relative' : 'border border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="text-4xl font-bold text-gray-900">
                  {plan.price}{plan.price !== 'Custom' && <span className="text-lg text-gray-500">/month</span>}
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                href={plan.href}
                className={`w-full inline-flex items-center justify-center px-6 py-3 font-medium rounded-lg transition-colors ${
                  plan.popular
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            All plans include: SSL encryption, 99.9% uptime SLA, and 24/7 monitoring
          </p>
        </div>
      </div>
    </section>
  );
}
