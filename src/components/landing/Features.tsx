// src/components/landing/Features.tsx
import { 
  CubeTransparentIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  DevicePhoneMobileIcon,
  ClockIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: CubeTransparentIcon,
    title: 'Multi-Tenant Platform',
    description: 'Isolate clients with secure tenant separation. Each client gets their own environment with dedicated phone numbers and templates.',
    color: 'blue'
  },
  {
    icon: ChatBubbleLeftRightIcon,
    title: 'Advanced Messaging',
    description: 'Send text, media, and template messages with delivery tracking, read receipts, and automatic retry logic.',
    color: 'green'
  },
  {
    icon: ChartBarIcon,
    title: 'Real-time Analytics',
    description: 'Track message delivery rates, costs, quality ratings, and usage patterns with detailed reporting.',
    color: 'purple'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Template Management',
    description: 'Create, submit, and manage WhatsApp message templates with approval status tracking and automated workflows.',
    color: 'orange'
  },
  {
    icon: ClockIcon,
    title: 'Smart Queue System',
    description: 'Handle rate limiting automatically with Redis-based queuing, retry logic, and exponential backoff.',
    color: 'blue'
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Scale',
    description: 'Deploy worldwide with Kubernetes, handle millions of messages, and scale automatically based on demand.',
    color: 'indigo'
  }
];

const colorClasses = {
  blue: 'bg-blue-100 text-blue-600',
  green: 'bg-green-100 text-green-600',
  purple: 'bg-purple-100 text-purple-600',
  orange: 'bg-orange-100 text-orange-600',
  indigo: 'bg-indigo-100 text-indigo-600',
};

export function Features() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built on Meta's official WhatsApp Cloud API with enterprise features 
            for businesses of all sizes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all duration-200">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colorClasses[feature.color as keyof typeof colorClasses]}`}>
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
