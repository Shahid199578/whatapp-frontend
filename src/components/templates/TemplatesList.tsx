// src/components/templates/TemplatesList.tsx
'use client';

import { useState } from 'react';
import { 
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { MessageTemplate } from '@/types';

interface TemplatesListProps {
  templates: MessageTemplate[];
  loading: boolean;
  onRefresh: () => void;
}

export function TemplatesList({ templates, loading, onRefresh }: TemplatesListProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case 'approved':
        return `${baseClasses} text-green-800 bg-green-100`;
      case 'pending':
        return `${baseClasses} text-yellow-800 bg-yellow-100`;
      case 'rejected':
        return `${baseClasses} text-red-800 bg-red-100`;
      default:
        return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  const getCategoryBadge = (category: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (category) {
      case 'AUTHENTICATION':
        return `${baseClasses} text-blue-800 bg-blue-100`;
      case 'MARKETING':
        return `${baseClasses} text-purple-800 bg-purple-100`;
      case 'UTILITY':
        return `${baseClasses} text-indigo-800 bg-indigo-100`;
      default:
        return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  const handlePreview = (template: MessageTemplate) => {
    setSelectedTemplate(template);
    setShowPreview(true);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden">
        {templates.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {templates.map((template) => (
              <div key={template.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900 truncate">
                          {template.templateName}
                        </h3>
                        <span className={getCategoryBadge(template.category)}>
                          {template.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          {template.language}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {template.bodyText}
                      </p>
                      
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(template.status)}
                          <span className={getStatusBadge(template.status)}>
                            {template.status}
                          </span>
                        </div>
                        
                        {template.status === 'rejected' && template.rejectionReason && (
                          <div className="text-sm text-red-600">
                            Reason: {template.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePreview(template)}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                      title="Preview template"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                    
                    {template.status === 'rejected' && (
                      <button
                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Edit template"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    )}
                    
                    <button
                      className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete template"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                
                {/* Template structure preview */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm">
                    {template.headerText && (
                      <div className="mb-2">
                        <span className="font-medium text-gray-700">Header:</span>
                        <span className="ml-2 text-gray-600">{template.headerText}</span>
                      </div>
                    )}
                    
                    <div className="mb-2">
                      <span className="font-medium text-gray-700">Body:</span>
                      <span className="ml-2 text-gray-600">{template.bodyText.substring(0, 100)}...</span>
                    </div>
                    
                    {template.footerText && (
                      <div className="mb-2">
                        <span className="font-medium text-gray-700">Footer:</span>
                        <span className="ml-2 text-gray-600">{template.footerText}</span>
                      </div>
                    )}
                    
                    {template.buttons && template.buttons.length > 0 && (
                      <div>
                        <span className="font-medium text-gray-700">Buttons:</span>
                        <span className="ml-2 text-gray-600">
                          {template.buttons.length} button{template.buttons.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first message template.
            </p>
          </div>
        )}
      </div>

      {/* Template Preview Modal */}
      {showPreview && selectedTemplate && (
        <TemplatePreviewModal
          template={selectedTemplate}
          isOpen={showPreview}
          onClose={() => {
            setShowPreview(false);
            setSelectedTemplate(null);
          }}
        />
      )}
    </>
  );
}

// Template Preview Modal Component
interface TemplatePreviewModalProps {
  template: MessageTemplate;
  isOpen: boolean;
  onClose: () => void;
}

function TemplatePreviewModal({ template, isOpen, onClose }: TemplatePreviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Template Preview</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XCircleIcon className="h-6 w-6" />
            </button>
          </div>

          {/* WhatsApp-style preview */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="bg-white rounded-lg p-4 shadow-sm border max-w-xs">
              {template.headerText && (
                <div className="font-semibold text-gray-900 mb-2">
                  {template.headerText}
                </div>
              )}
              
              <div className="text-gray-800 mb-3 whitespace-pre-wrap">
                {template.bodyText}
              </div>
              
              {template.footerText && (
                <div className="text-gray-500 text-sm mb-3">
                  {template.footerText}
                </div>
              )}
              
              {template.buttons && template.buttons.length > 0 && (
                <div className="space-y-2">
                  {template.buttons.map((button: any, index: number) => (
                    <button
                      key={index}
                      className="w-full p-2 text-blue-600 border border-blue-200 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
                    >
                      {button.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Template details */}
          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Status:</span>
              <span className={`capitalize ${
                template.status === 'approved' ? 'text-green-600' :
                template.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {template.status}
              </span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Category:</span>
              <span className="text-gray-600">{template.category}</span>
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">Language:</span>
              <span className="text-gray-600">{template.language}</span>
            </div>
            
            {template.variables && template.variables.length > 0 && (
              <div className="text-sm">
                <span className="font-medium text-gray-700">Variables:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {template.variables.map((variable: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
