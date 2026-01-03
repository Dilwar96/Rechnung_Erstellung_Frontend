import React from 'react';
import { Printer, Save, RotateCcw } from 'lucide-react';

interface InvoiceActionsProps {
  onPrint: () => void;
  onSave: () => void;
  onResetData?: () => void;
}

export const InvoiceActions: React.FC<InvoiceActionsProps> = ({
  onPrint,
  onSave,
  onResetData
}) => {
  const handleResetData = () => {
    if (onResetData && window.confirm('Sind Sie sicher, dass Sie alle gespeicherten Firmen- und Kundeninformationen zurücksetzen möchten?')) {
      onResetData();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={onPrint}
        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Printer className="w-4 h-4" />
        <span>Drucken</span>
      </button>
      
      <button
        onClick={onSave}
        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
      >
        <Save className="w-4 h-4" />
        <span>Speichern</span>
      </button>

      {/* E-Mail Versand entfernt */}

      {onResetData && (
        <button
          onClick={handleResetData}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Daten Zurücksetzen</span>
        </button>
      )}
    </div>
  );
};