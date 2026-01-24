import { ReactNode } from 'react';
import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import { AdminChangeCredentials } from './AdminChangeCredentials';

interface PageLayoutProps {
  children: ReactNode;
  onSettings: () => void;
  onInvoices: () => void;
  onPrint: () => void;
  onSave: () => void;
  onLogout: () => void;
  onToggleChangeCredentials: () => void;
  adminToken: string | null;
  showChangeCredentials: boolean;
  onCloseChangeCredentials: () => void;
}

export const PageLayout = ({
  children,
  onSettings,
  onInvoices,
  onPrint,
  onSave,
  onLogout,
  onToggleChangeCredentials,
  adminToken,
  showChangeCredentials,
  onCloseChangeCredentials
}: PageLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col">
      <AppHeader />
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
        {children}
      </div>
      <AppFooter
        onSettings={onSettings}
        onInvoices={onInvoices}
        onPrint={onPrint}
        onSave={onSave}
        onLogout={onLogout}
        onToggleChangeCredentials={onToggleChangeCredentials}
        adminToken={adminToken}
      />
      
      {/* AdminChangeCredentials Modal */}
      {showChangeCredentials && adminToken && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 relative">
            <button
              onClick={onCloseChangeCredentials}
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
};
