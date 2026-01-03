import React from 'react';
import { InvoiceHeader } from '../components/InvoiceHeader';
import { InvoiceItems } from '../components/InvoiceItems';
import { InvoiceFooter } from '../components/InvoiceFooter';
import { PrintLayout } from '../components/PrintLayout';

export const InvoicePage: React.FC<any> = ({
  invoice,
  updateCustomerInfo,
  updateInvoiceNumber,
  updateDate,
  updateDeliveryDate,
  addItem,
  updateItem,
  removeItem,
  calculateTotals,
  saveInvoice,
  loading,
  updatePaymentMethod,
  updateGlobalDiscount,
  updateGlobalTip
}) => {
  const totals = calculateTotals();

  return (
    <>
      <div className="invoice-content">
        <InvoiceHeader
          invoice={invoice}
          updateCustomerInfo={updateCustomerInfo}
          updateInvoiceNumber={updateInvoiceNumber}
          updateDate={updateDate}
          updateDeliveryDate={updateDeliveryDate}
        />

        <InvoiceItems
          items={invoice.items}
          onAddItem={addItem}
          onUpdateItem={updateItem}
          onRemoveItem={removeItem}
        />

        <InvoiceFooter
          totals={totals}
          invoice={invoice}
          onPaymentMethodChange={updatePaymentMethod}
          onGlobalDiscountChange={updateGlobalDiscount}
          onGlobalTipChange={updateGlobalTip}
        />
      </div>

      <div className="print-layout" style={{ display: 'none' }}>
        <PrintLayout invoice={invoice} totals={totals} />
      </div>
    </>
  );
};

export default InvoicePage;
