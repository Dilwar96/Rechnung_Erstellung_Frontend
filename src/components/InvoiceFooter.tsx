import React from 'react';
import { CreditCard, Banknote, Gift } from 'lucide-react';
import { Invoice } from '../types/invoice';

interface InvoiceFooterProps {
  invoice: Invoice;
  totals: {
    subtotal: number;
    totalDiscount: number;
    totalTax1: number;
    totalTip: number;
    total: number;
  };
  onPaymentMethodChange: (method: 'card' | 'cash') => void;
  onGlobalDiscountChange: (value: number) => void;
  onGlobalTipChange: (value: number) => void;
}

export const InvoiceFooter: React.FC<InvoiceFooterProps> = ({
  invoice,
  totals,
  onPaymentMethodChange,
  onGlobalDiscountChange,
  onGlobalTipChange
}) => {
  return (
    <div className="space-y-8">
      {/* Global Discount and Tip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Global Discount */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Gift className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Gesamtrabatt
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">€</span>
            <input
              type="number"
              value={invoice.globalDiscount}
              onChange={(e) => onGlobalDiscountChange(parseFloat(e.target.value) || 0)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Global Tip */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Gift className="w-5 h-5 text-pink-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Gesamttrinkgeld
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">€</span>
            <input
              type="number"
              value={invoice.globalTip}
              onChange={(e) => onGlobalTipChange(parseFloat(e.target.value) || 0)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </div>
        </div>
      </div>

      {/* Payment Method and Bank Details */}
      <div className="grid grid-cols-1 gap-8">
        {/* Payment Method */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 max-w-full sm:max-w-xs mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Zahlungsart
          </h3>
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                checked={invoice.paymentMethod === 'card'}
                onChange={() => onPaymentMethodChange('card')}
                className="w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                <span className="text-gray-900">Überweisung</span>
              </div>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                checked={invoice.paymentMethod === 'cash'}
                onChange={() => onPaymentMethodChange('cash')}
                className="w-4 h-4 text-green-600 focus:ring-green-500"
              />
              <div className="flex items-center space-x-2">
                <Banknote className="w-5 h-5 text-green-600" />
                <span className="text-gray-900">Barzahlung</span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Zusammenfassung
        </h3>
        <div className="space-y-3">
          {/* Korrigierte Reihenfolge: Rabatt nach Steuern abziehen */}
          {(() => {
            const items = invoice.items || [];
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
            return (
              <>
          <div className="flex justify-between">
                  <span className="text-gray-600">Netto:</span>
                  <span className="font-medium">€{nettoSum.toFixed(2)}</span>
          </div>
                {Object.entries(taxGroups).map(([tax, val]) => (
                  <div key={tax} className="flex justify-between">
                    <span className="text-gray-600">Steuer {tax}%:</span>
                    <span className="font-medium">€{val.steuer.toFixed(2)}</span>
            </div>
                ))}
            <div className="flex justify-between">
                  <span className="text-gray-600">Brutto:</span>
                  <span className="font-medium">€{bruttoSum.toFixed(2)}</span>
                </div>
                {rabatt > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Gesamtrabatt:</span>
                    <span>-€{rabatt.toFixed(2)}</span>
            </div>
          )}
                {tip > 0 && (
            <div className="flex justify-between text-green-600">
                    <span>Gesamttrinkgeld:</span>
                    <span>+€{tip.toFixed(2)}</span>
            </div>
          )}
              </>
            );
          })()}
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Gesamtbetrag:</span>
              <span>€{(invoice.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) - (totals.totalDiscount || 0) + (totals.totalTip || 0)).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thank You Message - Will appear on last page */}
      <div className="mt-8 flex justify-center">
        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8 text-center max-w-3xl">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Vielen Dank!
          </h3>
          <p className="text-gray-600 leading-relaxed text-lg">
            Vielen Dank für Ihr Vertrauen. Wir schätzen Ihr Geschäft und freuen uns darauf, Sie wieder bedienen zu dürfen.
          </p>
        </div>
      </div>
    </div>
  );
};