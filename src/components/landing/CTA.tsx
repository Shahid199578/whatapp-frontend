// src/components/landing/CTA.tsx
import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

export function CTA() {
  return (
    <section className="py-20 bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
          Join thousands of businesses using WhatsApp Portal to scale their messaging.
          Start your free trial today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/auth/register"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 text-lg font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
          >
            Start Free Trial
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-transparent text-white text-lg font-medium rounded-xl border-2 border-white hover:bg-white hover:text-primary-600 transition-colors"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
