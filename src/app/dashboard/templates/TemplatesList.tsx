// src/components/templates/TemplatesList.tsx
'use client';

import React from 'react';
import { DocumentTextIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface MessageTemplate {
  _id: string;
  templateName: string;
  language: string;
  category: 'AUTHENTICATION' | 'MARKETING' | 'UTILITY';
  status: 'pending' | 'approved' | 'rejected';
  headerText?: string;
  bodyText: string;
  footerText?: string;
  buttons?: any[];
  variables?: string[];
  rejectionReason?: string;
  whatsappTemplateId?: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplatesListProps {
  templates: MessageTemplate[];
  loading: boolean;
  onRefresh: () => void;
}

export function TemplatesList({ templates, loading, onRefresh }: TemplatesListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getCategoryBadge = (category: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (category) {
      case 'MARKETING':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'AUTHENTICATION':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'UTILITY':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="p-12 text-center">
        <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No templates</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first message template.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Message Templates</h3>
          <button
            onClick={onRefresh}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {templates.map((template) => (
          <div key={template._id} className="p-6 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(template.status)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {template.templateName}
                    </h4>
                    <span className={getStatusBadge(template.status)}>
                      {template.status}
                    </span>
                    <span className={getCategoryBadge(template.category)}>
                      {template.category}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {template.bodyText.length > 100 
                      ? `${template.bodyText.substring(0, 100)}...`
                      : template.bodyText
                    }
                  </p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Language: {template.language}</span>
                    {template.variables && template.variables.length > 0 && (
                      <>
                        <span>•</span>
                        <span>Variables: {template.variables.length}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                  </div>

                  {template.status === 'rejected' && template.rejectionReason && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                      <strong>Rejection reason:</strong> {template.rejectionReason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
