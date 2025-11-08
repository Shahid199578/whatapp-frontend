// src/components/landing/Testimonials.tsx
import { StarIcon } from '@heroicons/react/24/outline';

import Link from 'next/link';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const testimonials = [
  {
    content: "WhatsApp Portal has transformed our customer communication. The multi-tenant architecture is perfect for our agency.",
    author: {
      name: "Sarah Johnson",
      role: "CEO, Digital Agency",
      avatar: "/images/avatars/sarah.jpg"
    },
    rating: 5
  },
  {
    content: "The analytics and reporting features help us optimize our messaging campaigns. Excellent ROI!",
    author: {
      name: "Michael Chen",
      role: "Marketing Director",
      avatar: "/images/avatars/michael.jpg"
    },
    rating: 5
  },
  {
    content: "Reliable, scalable, and easy to integrate. The best WhatsApp API solution we've used.",
    author: {
      name: "Emma Davis",
      role: "CTO, E-commerce",
      avatar: "/images/avatars/emma.jpg"
    },
    rating: 5
  }
];

export function Testimonials() {
  return (
    <section id="testimonial" className="py-20 bg-grey mb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by businesses worldwide
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-2xl">
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 text-lg">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {testimonial.author.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="ml-4">
                  <p className="font-medium text-gray-900">{testimonial.author.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.author.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <section className="py-20 bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-xl text-black mb-8 max-w-3xl mx-auto">
          Join thousands of businesses using WhatsApp Portal to scale their messaging.
          Start your free trial today.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Link
            href="/auth/register"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-blue-200 text-black text-lg font-medium rounded-xl hover:bg-blue-400 transition-colors shadow-lg"
          >
            Start Free Trial
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
          <Link
            href="/contact"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-blue-200 text-black text-lg font-medium rounded-xl hover:bg-blue-400 transition-colors shadow-lg"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
    </section>
  );
}
