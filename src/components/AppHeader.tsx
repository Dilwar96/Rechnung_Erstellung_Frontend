import React from 'react';

export const AppHeader: React.FC = () => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-lg">Rechnungserstellung</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
