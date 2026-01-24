import React from 'react';
import { InvoiceList } from '../components/InvoiceList';

export const InvoicesPage: React.FC<{onBack: () => void; onEdit: (id: string) => void}> = ({ onBack, onEdit }) => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <InvoiceList onEdit={onEdit} />
          <div className="mt-8 flex justify-center">
            <button
              onClick={onBack}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Zurück zur Rechnungserstellung
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoicesPage;
