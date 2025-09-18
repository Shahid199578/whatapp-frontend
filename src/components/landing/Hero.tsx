// src/components/landing/Hero.tsx
import Link from 'next/link';
import { ArrowRightIcon, ShieldCheckIcon, BoltIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-blue-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Scale Your Business with
            <span className="text-primary-600 block">
              WhatsApp API
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professional multi-tenant WhatsApp Business API platform. Send messages, 
            manage templates, handle webhooks, and track analytics with enterprise-grade security.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12">
            <Link
              href="/auth/register"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-grey text-lg font-medium rounded-xl hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors shadow-lg"
            >
              Start Free Trial
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="#demo"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 text-lg font-medium rounded-xl border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              View Demo
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-500" />
              SOC 2 Compliant
            </div>
            <div className="flex items-center">
              <BoltIcon className="h-5 w-5 mr-2 text-yellow-500" />
              99.9% Uptime
            </div>
            <div className="flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2 text-blue-500" />
              1000+ Businesses
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
