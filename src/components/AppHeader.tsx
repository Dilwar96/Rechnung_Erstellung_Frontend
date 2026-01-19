import React from 'react';
import { FileText } from 'lucide-react';

export const AppHeader: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-white" strokeWidth={2.5} />
            <div>
              <h1 className="font-bold text-xl text-white tracking-tight">Rechnungserstellung</h1>
              <p className="text-blue-100 text-xs font-medium">Professionelle Rechnungen erstellen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
