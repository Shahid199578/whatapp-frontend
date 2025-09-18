// src/components/billing/InvoicesList.tsx
'use client';

import { 
  DocumentArrowDownIcon,
  CalendarIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

interface InvoicesListProps {
  invoices: Array<{
    id: string;
    number: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue';
    date: string;
    dueDate: string;
    downloadUrl: string;
  }>;
  upcomingInvoice: {
    amount: number;
    dueDate: string;
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
  };
}

export function InvoicesList({ invoices, upcomingInvoice }: InvoicesListProps) {
  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize";
    switch (status) {
      case 'paid':
        return `${baseClasses} text-green-800 bg-green-100`;
      case 'pending':
        return `${baseClasses} text-yellow-800 bg-yellow-100`;
      case 'overdue':
        return `${baseClasses} text-red-800 bg-red-100`;
      default:
        return `${baseClasses} text-gray-800 bg-gray-100`;
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const handleDownload = (downloadUrl: string, invoiceNumber: string) => {
    // Create a temporary link to download the invoice
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = `invoice-${invoiceNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Invoices</h3>

      {/* Upcoming Invoice */}
      {upcomingInvoice && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CalendarIcon className="h-5 w-5 text-blue-600 mr-2" />
              <div>
                <h4 className="font-medium text-blue-900">Upcoming Invoice</h4>
                <p className="text-sm text-blue-700">
                  Due {new Date(upcomingInvoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-blue-900">
                {formatCurrency(upcomingInvoice.amount)}
              </p>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-blue-200">
            <h5 className="text-sm font-medium text-blue-900 mb-2">Items:</h5>
            <div className="space-y-1">
              {upcomingInvoice.items.map((item, index) => (
                <div key={index} className="flex justify-between text-sm text-blue-800">
                  <span>{item.description} (×{item.quantity})</span>
                  <span>{formatCurrency(item.total)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invoices Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-medium text-gray-700">Invoice</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Due Date</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">{invoice.number}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-gray-900">
                    {new Date(invoice.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="text-gray-900">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </div>
                  {invoice.status === 'overdue' && (
                    <div className="flex items-center mt-1">
                      <ExclamationCircleIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-xs text-red-600">Overdue</span>
                    </div>
                  )}
                </td>
                <td className="py-3 px-4">
                  <div className="font-medium text-gray-900">
                    {formatCurrency(invoice.amount)}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className={getStatusBadge(invoice.status)}>
                    {invoice.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDownload(invoice.downloadUrl, invoice.number)}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 rounded hover:bg-primary-100 transition-colors"
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {invoices.length === 0 && (
          <div className="text-center py-8">
            <DocumentArrowDownIcon className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">No invoices yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
