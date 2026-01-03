import React from 'react';
import { Building2 } from 'lucide-react';
import { Invoice, CustomerInfo } from '../types/invoice';
import { EditableField } from './EditableField';

interface InvoiceHeaderProps {
  invoice: Invoice;
  updateCustomerInfo: (field: keyof CustomerInfo, value: string) => void;
  updateInvoiceNumber: (value: string) => void;
  updateDate: (value: string) => void;
  updateDeliveryDate: (value: string) => void;
}

export const InvoiceHeader: React.FC<InvoiceHeaderProps> = ({
  invoice,
  updateCustomerInfo,
  updateInvoiceNumber,
  updateDate,
  updateDeliveryDate
}) => {
  const { customer, invoiceNumber, date, deliveryDate } = invoice;

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Auto-save notification */}
      {/* Hinweis entfernt */}

      {/* Logo and Title */}
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex flex-col items-center space-y-3 sm:space-y-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg sm:rounded-xl flex items-center justify-center shadow-md sm:shadow-lg">
            <Building2 className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 tracking-wide">
            RECHNUNG
          </h1>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-white border border-gray-200 rounded-md sm:rounded-lg p-3 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Rechnungsnummer
            </label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => updateInvoiceNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Datum
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => updateDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Lieferdatum
            </label>
            <input
              type="date"
              value={deliveryDate || ''}
              onChange={(e) => updateDeliveryDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Customer Info Only */}
      <div className="bg-gray-50 rounded-md sm:rounded-lg p-3 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
          Kundeninformationen
        </h2>
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-2">
            <EditableField
              label="Name"
              value={customer.name}
              onChange={(value) => updateCustomerInfo('name', value)}
            />
            <div className="sm:grid-cols-2 grid grid-cols-1 gap-2">
              <input
                type="text"
                value={customer.customField1 || ''}
                onChange={(e) => updateCustomerInfo('customField1', e.target.value)}
                placeholder="Zusatzfeld 1"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
              />
              <input
                type="text"
                value={customer.customField2 || ''}
                onChange={(e) => updateCustomerInfo('customField2', e.target.value)}
                placeholder="Zusatzfeld 2"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-sm"
              />
            </div>
          </div>
          <EditableField
            label="Adresse"
            value={customer.address}
            onChange={(value) => updateCustomerInfo('address', value)}
          />
          <div className="sm:grid-cols-2 grid grid-cols-1 gap-3 sm:gap-4">
            <EditableField
              label="Stadt"
              value={customer.city}
              onChange={(value) => updateCustomerInfo('city', value)}
            />
            <EditableField
              label="PLZ"
              value={customer.postalCode}
              onChange={(value) => updateCustomerInfo('postalCode', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};