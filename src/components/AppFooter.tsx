import React from 'react';
import { Settings, List, Printer, Save, LogOut, KeyRound } from 'lucide-react';

interface AppFooterProps {
  onSettings: () => void;
  onInvoices: () => void;
  onPrint: () => void;
  onSave: () => void;
  onLogout?: () => void;
  onToggleChangeCredentials: () => void;
  adminToken?: string | null;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  onSettings,
  onInvoices,
  onPrint,
  onSave,
  onLogout,
  onToggleChangeCredentials,
  adminToken
}) => {
  return (
    <footer className="w-full bg-white border-t shadow-2xl py-3 fixed bottom-0 left-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-2">
          <button
            onClick={onInvoices}
            className="flex items-center space-x-1.5 bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-gray-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Rechnungen</span>
          </button>
          
          <button
            onClick={onSettings}
            className="flex items-center space-x-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Einstellungen</span>
          </button>
          
          <button
            onClick={onPrint}
            className="flex items-center space-x-1.5 bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">Drucken</span>
          </button>
          
          <button
            onClick={onSave}
            className="flex items-center space-x-1.5 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            <span className="hidden sm:inline">Speichern</span>
          </button>
          
          {adminToken && (
            <>
              <button
                onClick={onToggleChangeCredentials}
                className="flex items-center space-x-1.5 bg-amber-500 text-white px-3 py-2 rounded-lg hover:bg-amber-600 transition-all shadow-sm hover:shadow-md text-sm font-medium"
              >
                <KeyRound className="w-4 h-4" />
                <span className="hidden sm:inline">Passwort</span>
              </button>
              
              <button
                onClick={onLogout}
                className="flex items-center space-x-1.5 bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-all shadow-sm hover:shadow-md text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
