
'use client';

import { ClipboardDocumentIcon } from '@heroicons/react/24/outline';

export function Documents() {
  return (
    <section id="docs" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mt-[20px] text-gray-900 mb-4">Documentation</h2>
          <p className="text-gray-600 text-lg">
            Everything you need to get started, integrate, and use our WhatsApp Portal effectively.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 1 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <ClipboardDocumentIcon className="w-10 h-10 text-green-700 mb-4" />
            <h3 className="text-xl text-black font-semibold mb-2">Getting Started</h3>
            <p className="text-gray-500 mb-4">
              Learn how to set up your account and start using WhatsApp Portal in minutes.
            </p>
            <a
              href="/docs/getting-started"
              className="text-green-400 font-medium hover:underline"
            >
              Read More →
            </a>
          </div>

          {/* 2 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <ClipboardDocumentIcon className="w-10 h-10 text-green-700 mb-4" />
            <h3 className="text-xl text-black font-semibold mb-2">API Integration</h3>
            <p className="text-gray-500 mb-4">
              Connect your app or website with our WhatsApp API seamlessly.
            </p>
            <a
              href="/docs/api"
              className="text-green-400 font-medium hover:underline"
            >
              Read More →
            </a>
          </div>

          {/* 3 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <ClipboardDocumentIcon className="w-10 h-10 text-green-700 mb-4" />
            <h3 className="text-xl text-black font-semibold mb-2">FAQ & Support</h3>
            <p className="text-gray-500 mb-4">
              Find answers to common questions and troubleshoot common issues.
            </p>
            <a
              href="/docs/faq"
              className="text-green-400 font-medium hover:underline"
            >
              Read More →
            </a>
          </div>

          {/* 4 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <ClipboardDocumentIcon className="w-10 h-10 text-green-700 mb-4" />
            <h3 className="text-xl text-black font-semibold mb-2">User Guide</h3>
            <p className="text-gray-500 mb-4">
              Step-by-step instructions to explore all features of the portal.
            </p>
            <a
              href="/docs/user-guide"
              className="text-green-400 font-medium hover:underline"
            >
              Read More →
            </a>
          </div>

          {/* 5 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <ClipboardDocumentIcon className="w-10 h-10 text-green-700 mb-4" />
            <h3 className="text-xl text-black font-semibold mb-2">Advanced Features</h3>
            <p className="text-gray-500 mb-4">
              Learn about automation, analytics, and advanced integrations.
            </p>
            <a
              href="/docs/advanced-features"
              className="text-green-400 font-medium hover:underline"
            >
              Read More →
            </a>
          </div>

          {/* 6 */}
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
            <ClipboardDocumentIcon className="w-10 h-10 text-green-700 mb-4" />
            <h3 className="text-xl text-black font-semibold mb-2">Release Notes</h3>
            <p className="text-gray-500 mb-4">
              Stay updated with the latest improvements, fixes, and new features.
            </p>
            <a
              href="/docs/release-notes"
              className="text-green-400 font-medium hover:underline"
            >
              Read More →
            </a>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-20 mb-12">
          <a
            href="/docs"
            className="inline-block px-6 py-3 bg-blue-400 text-white font-medium rounded-lg hover:bg-primary-700 transition"
          >
            Explore Full Documentation
          </a>
        </div>
      </div>
    </section>
  );
}
