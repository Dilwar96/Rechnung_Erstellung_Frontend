import { useState, useEffect } from 'react';
import { useInvoice } from './hooks/useInvoice';
import { useInvoiceActions } from './hooks/useInvoiceActions';
import { ToastContainer } from './components/Toast';
import { AdminLogin } from './components/AdminLogin';
import { AdminChangeCredentials } from './components/AdminChangeCredentials';

import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import InvoicePage from './views/InvoicePage';
import InvoicesPage from './views/InvoicesPage';
import SettingsPage from './views/SettingsPage';

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
    return <SettingsPage onBack={() => setCurrentView('invoice')} />;
  }

  // Show Invoice List view
  if (currentView === 'invoices') {
    return <InvoicesPage onBack={() => {
      setInvoice(prev => ({ ...prev, invoiceNumber: '' }));
      setCurrentView('invoice');
    }} />;
  }

  // Show Invoice view (Hauptanwendung)
  return (
    <>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />

        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <InvoicePage
            invoice={invoice}
            updateCustomerInfo={updateCustomerInfo}
            updateInvoiceNumber={updateInvoiceNumber}
            updateDate={updateDate}
            updateDeliveryDate={updateDeliveryDate}
            addItem={addItem}
            updateItem={updateItem}
            removeItem={removeItem}
            calculateTotals={calculateTotals}
            saveInvoice={saveInvoice}
            loading={loading}
            updatePaymentMethod={updatePaymentMethod}
            updateGlobalDiscount={updateGlobalDiscount}
            updateGlobalTip={updateGlobalTip}
          />
        </div>

        <AppFooter
          onSettings={() => setCurrentView('settings')}
          onInvoices={() => setCurrentView('invoices')}
          onPrint={handlePrint}
          onSave={handleSave}
          onLogout={handleAdminLogout}
          onToggleChangeCredentials={() => setShowChangeCredentials(v => !v)}
          adminToken={adminToken}
        />

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