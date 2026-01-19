import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useInvoice } from './hooks/useInvoice';
import { useInvoiceActions } from './hooks/useInvoiceActions';
import { ToastContainer } from './components/Toast';
import { AdminChangeCredentials } from './components/AdminChangeCredentials';
import { ProtectedRoute } from './components/ProtectedRoute';

import AppHeader from './components/AppHeader';
import AppFooter from './components/AppFooter';
import InvoicePage from './views/InvoicePage';
import InvoicesPage from './views/InvoicesPage';
import SettingsPage from './views/SettingsPage';
import LoginPage from './views/LoginPage';

function App() {
  const navigate = useNavigate();
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
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

  // Update token state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('adminToken');
      setAdminToken(token);
    };
    
    // Listen for custom storage event (for same tab)
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('localStorageChange', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleStorageChange);
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

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    // Trigger custom event for same-tab localStorage update
    window.dispatchEvent(new Event('localStorageChange'));
    navigate('/login');
  };

  // Main Layout Component for Protected Routes
  const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <AppHeader />
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {children}
      </div>
      <AppFooter
        onSettings={() => navigate('/settings')}
        onInvoices={() => navigate('/invoices')}
        onPrint={handlePrint}
        onSave={handleSave}
        onLogout={handleAdminLogout}
        onToggleChangeCredentials={() => setShowChangeCredentials(v => !v)}
        adminToken={adminToken}
      />
      
      {/* AdminChangeCredentials Modal */}
      {showChangeCredentials && adminToken && (
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
  );

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

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
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
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <MainLayout>
                <InvoicesPage onBack={() => {
                  setInvoice(prev => ({ ...prev, invoiceNumber: '' }));
                  navigate('/');
                }} />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SettingsPage onBack={() => navigate('/')} />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;