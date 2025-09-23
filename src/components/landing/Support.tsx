'use client';

import { PhoneIcon, EnvelopeIcon, UserIcon } from '@heroicons/react/24/outline';

export function Support() {
  const team = [
    {
      name: 'Vikash Kumar',
      phone: '0000000000',
      email: 'vikash.kumar@example.com',
    },
    {
      name: 'Mohd Shahid',
      phone: '1111111111',
      email: 'mohd.shahid@example.com',
    },
    {
      name: 'Gopal Singh',
      phone: '2222222222',
      email: 'gopal.singh@example.com',
    },
  ];

  return (
    <div id = "support" className="bg-gray-50 min-h-screen py-16 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mt-12 mb-12 text-gray-900 mb-4">Support Team</h1>
          <p className="text-lg text-gray-600">
            Reach out to our support representatives directly for assistance.
          </p>
        </div>

        {/* Team Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-center"
            >
              <UserIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>

              <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                <PhoneIcon className="w-5 h-5 text-green-600" />
                <span>{member.phone}</span>
              </div>

              <div className="flex items-center justify-center space-x-1 text-gray-600">
                <EnvelopeIcon className="w-5 h-5 text-red-600" />
                <a
                  href={`mailto:${member.email}`}
                  className="hover:underline text-blue-500"
                >
                  {member.email}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
