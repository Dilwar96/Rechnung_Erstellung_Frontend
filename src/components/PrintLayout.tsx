import React from 'react';
import { Building2, CreditCard } from 'lucide-react';
import { Invoice } from '../types/invoice';

interface PrintLayoutProps {
  invoice: Invoice;
  totals: {
    subtotal: number;
    totalDiscount: number;
    totalTax1: number;
    totalTip: number;
    total: number;
  };
}

export const PrintLayout: React.FC<PrintLayoutProps> = ({
  invoice,
  totals
}) => {
  const { company, customer, items, invoiceNumber, date, paymentMethod, deliveryDate } = invoice;

  return (
    <div id="invoice-pdf" className="print-layout bg-white p-4 w-[210mm] max-w-[210mm] min-w-[210mm] mx-auto">
      {/* Header - Title on left bottom, Logo large on right */}
      <div className="mb-6">
        <div className="flex justify-between items-end h-32">
          {/* Title Section - positioned at bottom */}
          <div className="flex-1 flex items-end">
            <h1 className="text-3xl font-bold text-gray-900 tracking-wide">
              RECHNUNG
            </h1>
          </div>
          
          {/* Logo Section - large and centered */}
          <div className="flex-1 flex justify-center items-end">
            {company.logo ? (
              <img
                src={company.logo}
                alt="Firmenlogo"
                className="h-32 max-h-32 w-auto object-contain"
                style={{ maxWidth: 220 }}
              />
            ) : (
              <div className="w-36 h-32 bg-blue-700 rounded flex items-center justify-center">
                <Building2 className="w-16 h-16 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area with Customer Info and Company/Bank Data */}
      <div className="flex flex-row gap-12 mb-4">
        {/* Customer Info - Left Side */}
        <div className="bg-gray-50 rounded p-3 flex-1 h-fit">
          <h2 className="text-sm font-semibold text-gray-900 mb-2">
            Kundeninformationen
          </h2>
          <div className="space-y-1 text-xs">
            <div><strong>Name:</strong> {customer.name}</div>
            {/* Zusatzfelder untereinander */}
            {customer.customField1 && customer.customField1.trim() !== '' && (
              <div className='ml-10'>{customer.customField1}</div>
            )}
            {customer.customField2 && customer.customField2.trim() !== '' && (
              <div className='ml-10'>{customer.customField2}</div>
            )}
            <div><strong>Adresse:</strong> {customer.address}</div>
            <div><strong>Stadt:</strong> {customer.postalCode} {customer.city}</div>
          </div>
        </div>

        {/* Company Info and Bank Details - Right Side */}
        <div className="bg-blue-50 rounded p-3 flex-1">
          <h2 className="text-sm font-semibold text-blue-900 mb-2">
            Firmeninformationen
          </h2>
          <div className="space-y-1 text-xs mb-3">
            <div><strong>Name:</strong> {company.name}</div>
            {company.owner && (
              <div><strong>Inhaber:</strong> {company.owner}</div>
            )}
            <div><strong>Adresse:</strong> {company.address}</div>
            <div><strong>Stadt:</strong> {company.postalCode} {company.city}</div>
            <div><strong>Telefon:</strong> {company.phone}</div>
            <div><strong>E-Mail:</strong> {company.email}</div>
            <div><strong>Steuernummer:</strong> {company.taxNumber}</div>
          </div>
          {/* Bank Details Section */}
          <div className="pt-2 border-t border-blue-200">
            <div className="flex items-center space-x-1 mb-2">
              <CreditCard className="w-4 h-4 text-blue-600" />
              <h3 className="text-xs font-semibold text-blue-900">
                Bankverbindung
              </h3>
            </div>
            <div className="space-y-1 text-xs">
              <div><strong>Bank Name:</strong> {company.bankName}</div>
              <div><strong>Kontonummer:</strong> {company.accountNumber}</div>
              <div><strong>IBAN:</strong> {company.iban}</div>
              <div><strong>SWIFT/BIC:</strong> {company.swift}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Datum und Lieferdatum als eigene Zeilen über den Rechnungsdetails */}
      <div className="flex flex-row gap-12 mb-2 -mt-4">
        <div className="flex-1 text-xs text-gray-800">
          <div className="flex flex-col gap-1">
            <div><strong>Datum:</strong> {date}</div>
            {deliveryDate && (
              <div><strong>Lieferdatum:</strong> {deliveryDate}</div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Details - Immer untereinander */}
      <div className="bg-white border border-gray-200 rounded p-3 mb-4">
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex justify-between">
            <strong>Rechnungsnummer:</strong>
            <span>{invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <strong>Zahlungsart:</strong>
            <span>{paymentMethod === 'card' ? 'Überweisung' : 'Barzahlung'}</span>
          </div>
        </div>
      </div>

      {/* Items Table - Compact for A4 */}
      {items.length > 0 && (
        <div className="mb-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 text-xs">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-2 py-2 text-left font-medium text-gray-500 uppercase align-middle">
                    Artikelname
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-medium text-gray-500 uppercase align-middle">
                    Menge
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-medium text-gray-500 uppercase align-middle">
                    Bruttopreis
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-medium text-gray-500 uppercase align-middle">
                    Steuer (%)
                  </th>
                  <th className="border border-gray-300 px-2 py-2 text-center font-medium text-gray-500 uppercase align-middle">
                    Gesamtbetrag
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-gray-300 px-2 py-2 text-left align-middle">{item.name}</td>
                    <td className="border border-gray-300 px-2 py-2 text-center align-middle">{item.quantity}</td>
                    <td className="border border-gray-300 px-2 py-2 text-center align-middle">{item.price.toFixed(2)}</td>
                    <td className="border border-gray-300 px-2 py-2 text-center align-middle">{item.tax1} %</td>
                    <td className="border border-gray-300 px-2 py-2 text-center align-middle">{(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Section mit mehr Abstand zwischen Text und Betrag */}
      <div className="flex flex-col items-end gap-1 mt-2 text-xs">
        {/* Korrigierte Reihenfolge: Rabatt nach Steuern abziehen, mit Abstand */}
        {(() => {
          const bruttoSum = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const taxGroups: { [tax: string]: { steuer: number, netto: number, brutto: number } } = {};
          let nettoSum = 0;
          let steuerSum = 0;
          items.forEach(item => {
            const brutto = item.price * item.quantity;
            const tax = item.tax1;
            const netto = brutto / (1 + tax / 100);
            const steuer = brutto - netto;
            nettoSum += netto;
            steuerSum += steuer;
            if (!taxGroups[tax]) taxGroups[tax] = { steuer: 0, netto: 0, brutto: 0 };
            taxGroups[tax].steuer += steuer;
            taxGroups[tax].netto += netto;
            taxGroups[tax].brutto += brutto;
          });
          const rabatt = totals.totalDiscount || 0;
          const tip = totals.totalTip || 0;
          return <>
            <div className="flex justify-between w-full text-gray-600">
              <span>Netto:</span>
              <span className="font-medium">{nettoSum.toFixed(2)} €</span>
            </div>
            {Object.entries(taxGroups).map(([tax, val]) => (
              <div key={tax} className="flex justify-between w-full text-gray-600">
                <span>Steuer {tax}%:</span>
                <span className="font-medium">{val.steuer.toFixed(2)} €</span>
              </div>
            ))}
            {rabatt > 0 && (
              <div className="flex justify-between w-full text-gray-600">
                <span>Rabatt:</span>
                <span className="font-medium">- {rabatt.toFixed(2)} €</span>
            </div>
          )}
            {tip > 0 && (
              <div className="flex justify-between w-full text-gray-600">
                <span>Trinkgeld:</span>
                <span className="font-medium">{tip.toFixed(2)} €</span>
            </div>
          )}
            <div className="flex justify-between w-full text-base font-bold mt-2">
              <span>Gesamtbetrag (Brutto):</span>
              <span>{(bruttoSum - rabatt + tip).toFixed(2)} €</span>
            </div>
          </>;
        })()}
      </div>

      {/* Thank You Message - Will appear on last page */}
      <div className="mt-8 flex justify-center">
        <div className="bg-blue-50 rounded-lg p-4 text-center max-w-2xl">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Vielen Dank!
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Vielen Dank für Ihr Vertrauen. Wir schätzen Ihr Geschäft und freuen uns darauf, Sie wieder bedienen zu dürfen.
          </p>
        </div>
      </div>
    </div>
  );
};