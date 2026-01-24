import { useState, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useInvoice } from './hooks/useInvoice';
import { useInvoiceActions } from './hooks/useInvoiceActions';
import { ToastContainer } from './components/Toast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PageLayout } from './components/PageLayout';

import InvoicePage from './views/InvoicePage';
import InvoicesPage from './views/InvoicesPage';
import SettingsPage from './views/SettingsPage';
import LoginPage from './views/LoginPage';

function App() {
  const navigate = useNavigate();
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [showChangeCredentials, setShowChangeCredentials] = useState(false);
  const [editingInvoiceId, setEditingInvoiceId] = useState<string | undefined>(undefined);
  
  const handleSaveSuccess = () => {
    setEditingInvoiceId(undefined);
    navigate('/invoices');
  };

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
  } = useInvoice(editingInvoiceId, handleSaveSuccess);

  const { handlePrint, handleSave } = useInvoiceActions(saveInvoice);

  const updateInvoiceNumber = useCallback((value: string) => {
    setInvoice(prev => ({
      ...prev,
      invoiceNumber: value
    }));
  }, []);

  const updateDate = useCallback((value: string) => {
    setInvoice(prev => ({
      ...prev,
      date: value
    }));
  }, []);

  const updateDeliveryDate = useCallback((value: string) => {
    setInvoice(prev => ({
      ...prev,
      deliveryDate: value
    }));
  }, []);

  const updatePaymentMethod = useCallback((method: 'card' | 'cash') => {
    setInvoice(prev => ({
      ...prev,
      paymentMethod: method
    }));
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    setAdminToken(null);
    navigate('/login');
  };

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
    navigate('/');
  };

  const handleEditInvoice = (id: string) => {
    setEditingInvoiceId(id);
    navigate('/');
  };

  const handleNewInvoice = () => {
    setEditingInvoiceId(undefined);
    setInvoice(prev => ({
      invoiceNumber: `INV-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      date: new Date().toISOString().split('T')[0],
      company: prev.company,
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
        <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <PageLayout
                onSettings={() => navigate('/settings')}
                onInvoices={() => navigate('/invoices')}
                onPrint={handlePrint}
                onSave={handleSave}
                onLogout={handleAdminLogout}
                onToggleChangeCredentials={() => setShowChangeCredentials(v => !v)}
                adminToken={adminToken}
                showChangeCredentials={showChangeCredentials}
                onCloseChangeCredentials={() => setShowChangeCredentials(false)}
              >
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
              </PageLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/invoices"
          element={
            <ProtectedRoute>
              <PageLayout
                onSettings={() => navigate('/settings')}
                onInvoices={() => navigate('/invoices')}
                onPrint={handlePrint}
                onSave={handleSave}
                onLogout={handleAdminLogout}
                onToggleChangeCredentials={() => setShowChangeCredentials(v => !v)}
                adminToken={adminToken}
                showChangeCredentials={showChangeCredentials}
                onCloseChangeCredentials={() => setShowChangeCredentials(false)}
              >
                <InvoicesPage 
                  onBack={() => {
                    handleNewInvoice();
                    navigate('/');
                  }} 
                  onEdit={handleEditInvoice}
                />
              </PageLayout>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <PageLayout
                onSettings={() => navigate('/settings')}
                onInvoices={() => navigate('/invoices')}
                onPrint={handlePrint}
                onSave={handleSave}
                onLogout={handleAdminLogout}
                onToggleChangeCredentials={() => setShowChangeCredentials(v => !v)}
                adminToken={adminToken}
                showChangeCredentials={showChangeCredentials}
                onCloseChangeCredentials={() => setShowChangeCredentials(false)}
              >
                <SettingsPage onBack={() => navigate('/')} />
              </PageLayout>
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