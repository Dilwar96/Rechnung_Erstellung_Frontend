import { useState, useEffect } from 'react';
import { useInvoice } from './hooks/useInvoice';
import { useInvoiceActions } from './hooks/useInvoiceActions';
import { InvoiceHeader } from './components/InvoiceHeader';
import { InvoiceItems } from './components/InvoiceItems';
import { InvoiceFooter } from './components/InvoiceFooter';
import { PrintLayout } from './components/PrintLayout';
import { CompanySettings } from './components/CompanySettings';
import { ToastContainer } from './components/Toast';
import { AdminLogin } from './components/AdminLogin';
import { AdminChangeCredentials } from './components/AdminChangeCredentials';
import { InvoiceList } from './components/InvoiceList';

function App() {
  const [currentView, setCurrentView] = useState<'invoice' | 'settings' | 'invoices'>('invoice');
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [adminUsername, setAdminUsername] = useState<string | null>(null);
  const [showChangeCredentials, setShowChangeCredentials] = useState(false);
  
  const {
    invoice,
    setInvoice,
    updateCustomerInfo,
    updateGlobalDiscount,
    updateGlobalTip,
    addItem,
    updateItem,
    removeItem,
    calculateTotals,
    saveInvoice,
    loading
  } = useInvoice();

  const { handlePrint, handleSave } = useInvoiceActions(saveInvoice);

  const totals = calculateTotals();

  // Event listener to clear admin token when page is closed or refreshed
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('adminToken');
    };

    const handlePageHide = () => {
      localStorage.removeItem('adminToken');
    };

    // Add event listeners
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);

    // Cleanup event listeners on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, []);

  const updateInvoiceNumber = (value: string) => {
    setInvoice(prev => ({
      ...prev,
      invoiceNumber: value
    }));
  };

  const updateDate = (value: string) => {
    setInvoice(prev => ({
      ...prev,
      date: value
    }));
  };

  const updateDeliveryDate = (value: string) => {
    setInvoice(prev => ({
      ...prev,
      deliveryDate: value
    }));
  };

  const updatePaymentMethod = (method: 'card' | 'cash') => {
    setInvoice(prev => ({
      ...prev,
      paymentMethod: method
    }));
  };

  const handleAdminLogin = (token: string, username: string) => {
    setAdminToken(token);
    setAdminUsername(username);
    // Nach Login: Felder zurücksetzen (außer company)
    setInvoice(prev => ({
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      company: prev.company, // Firma bleibt gleich
      customer: {
        name: '',
        address: '',
        city: '',
        postalCode: '',
        customField1: '',
        customField2: ''
      },
      items: [],
      paymentMethod: 'card',
      currency: 'EUR',
      globalDiscount: 0,
      globalTip: 0
    }));
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    setAdminUsername(null);
  };

  if (!adminToken) {
    return <AdminLogin onLoginSuccess={handleAdminLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company data...</p>
        </div>
      </div>
    );
  }

  // Show Company Settings view
  if (currentView === 'settings') {
    return (
      <>
        <CompanySettings 
          onBack={() => setCurrentView('invoice')} 
        />
        <ToastContainer />
      </>
    );
  }

  // Show Invoice List view
  if (currentView === 'invoices') {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <InvoiceList />
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  setInvoice(prev => ({
                    ...prev,
                    invoiceNumber: '', // Rechnungsnummer leeren
                  }));
                  setCurrentView('invoice');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Zurück zur Rechnungserstellung
              </button>
            </div>
          </div>
        </div>
        <ToastContainer />
      </>
    );
  }

  // Show Invoice view (Hauptanwendung)
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header bleibt minimal */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-4">
                <span className="font-bold text-lg">Rechnungserstellung</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="invoice-content">
            {/* Invoice Header */}
            <InvoiceHeader
              invoice={invoice}
              updateCustomerInfo={updateCustomerInfo}
              updateInvoiceNumber={updateInvoiceNumber}
              updateDate={updateDate}
              updateDeliveryDate={updateDeliveryDate}
            />

            {/* Invoice Items */}
            <InvoiceItems
              items={invoice.items}
              onAddItem={addItem}
              onUpdateItem={updateItem}
              onRemoveItem={removeItem}
            />

            {/* Invoice Footer */}
            <InvoiceFooter
              totals={totals}
              invoice={invoice}
              onPaymentMethodChange={updatePaymentMethod}
              onGlobalDiscountChange={updateGlobalDiscount}
              onGlobalTipChange={updateGlobalTip}
            />
          </div>

          {/* Print Layout (Hidden) */}
          <div className="print-layout" style={{ display: 'none' }}>
            <PrintLayout
              invoice={invoice}
              totals={totals}
            />
          </div>
        </div>
        {/* Footer mit allen Buttons (ohne E-Mail) */}
        <footer className="w-full bg-white border-t py-4 flex flex-wrap justify-center space-x-4 fixed bottom-0 left-0 z-40">
          <button
            onClick={() => setCurrentView('settings')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Einstellungen</span>
          </button>
          <button
            onClick={() => setCurrentView('invoices')}
            className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Rechnungen
          </button>
          {adminToken && (
            <button
              onClick={() => setShowChangeCredentials(v => !v)}
              className="flex items-center space-x-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              Passwort ändern
            </button>
          )}
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Drucken
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Speichern
          </button>
          {adminToken && (
            <button
              onClick={handleAdminLogout}
              className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          )}
        </footer>
        {/* AdminChangeCredentials Modal */}
        {showChangeCredentials && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded shadow-lg p-6 relative">
              <button
                onClick={() => setShowChangeCredentials(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
              <AdminChangeCredentials token={adminToken} />
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
}

export default App;