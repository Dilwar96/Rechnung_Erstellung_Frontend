import React from 'react';
import { Plus, Trash2, Package, Hash, Euro, Percent } from 'lucide-react';
import { InvoiceItem } from '../types/invoice';

interface InvoiceItemsProps {
  items: InvoiceItem[];
  onAddItem: () => void;
  onUpdateItem: (id: string, field: keyof InvoiceItem, value: string | number) => void;
  onRemoveItem: (id: string) => void;
}

export const InvoiceItems: React.FC<InvoiceItemsProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onRemoveItem
}) => {
  return (
    <div className="space-y-6">
      {/* Add Item Button */}
      <div className="flex justify-center sm:justify-center">
        <button
          type="button"
          onClick={onAddItem}
          className="w-full sm:w-auto flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 text-base rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105
            sm:px-8 sm:py-4 sm:text-lg"
          aria-label="Artikel hinzufügen"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-semibold">Artikel hinzufügen</span>
        </button>
      </div>

      {/* Items Table - Desktop/Tablet */}
      {items.length > 0 && (
        <>
          {/* Mobile Ansicht: Blöcke */}
          <div className="block sm:hidden space-y-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow p-3 flex flex-col gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Artikelname</label>
                  <input
                    id={`item-name-${item.id}`}
                    type="text"
                    value={item.name}
                    onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white"
                    placeholder="Artikelname eingeben"
                    aria-label="Artikelname"
                  />
                </div>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Menge</label>
                    <input
                      id={`item-qty-${item.id}`}
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 hover:bg-white text-center"
                      min="0"
                      step="0.01"
                      aria-label="Menge"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Bruttopreis</label>
                    <input
                      id={`item-price-${item.id}`}
                      type="number"
                      value={item.price}
                      onChange={(e) => onUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-50 hover:bg-white text-right"
                      min="0"
                      step="0.01"
                      aria-label="Preis"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Steuer (19%)</label>
                  <input
                    id={`item-tax1-${item.id}`}
                    type="number"
                    value={item.tax1}
                    onChange={(e) => onUpdateItem(item.id, 'tax1', parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 hover:bg-white text-center"
                    min="0"
                    step="0.01"
                    aria-label="Steuer"
                  />
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="font-bold text-base text-gray-900 bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1 rounded-lg">
                    €{(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 hover:scale-110"
                    title="Artikel entfernen"
                    aria-label="Artikel entfernen"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet Tabelle */}
          <div className="hidden sm:block bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                    <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-blue-600" />
                      <span>Artikelname</span>
                    </div>
                  </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Hash className="w-4 h-4 text-green-600" />
                      <span>Menge</span>
                    </div>
                  </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Euro className="w-4 h-4 text-purple-600" />
                        <span>Bruttopreis</span>
                    </div>
                  </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Percent className="w-4 h-4 text-orange-600" />
                      <span>Steuer</span>
                    </div>
                  </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <span className="text-gray-800">Total</span>
                  </th>
                    <th className="px-2 sm:px-6 py-2 sm:py-4 text-left font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                    <span>Aktionen</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200">
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <input
                          id={`item-name-${item.id}`}
                        type="text"
                        value={item.name}
                        onChange={(e) => onUpdateItem(item.id, 'name', e.target.value)}
                          className="w-full px-2 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                        placeholder="Artikelname eingeben"
                          aria-label="Artikelname"
                      />
                    </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <input
                          id={`item-qty-${item.id}`}
                        type="number"
                        value={item.quantity}
                        onChange={(e) => onUpdateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-center"
                        min="0"
                        step="0.01"
                          aria-label="Menge"
                      />
                    </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <input
                          id={`item-price-${item.id}`}
                        type="number"
                        value={item.price}
                        onChange={(e) => onUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-right"
                        min="0"
                        step="0.01"
                          aria-label="Preis"
                      />
                    </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <input
                          id={`item-tax1-${item.id}`}
                        type="number"
                        value={item.tax1}
                        onChange={(e) => onUpdateItem(item.id, 'tax1', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white text-center"
                        min="0"
                        step="0.01"
                          aria-label="Steuer"
                      />
                    </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                        <span className="font-bold text-xs sm:text-lg text-gray-900 bg-gradient-to-r from-blue-100 to-indigo-100 px-2 sm:px-4 py-2 rounded-lg">
                          €{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </td>
                      <td className="px-2 sm:px-6 py-2 sm:py-4">
                      <button
                          type="button"
                        onClick={() => onRemoveItem(item.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200 hover:scale-110"
                        title="Artikel entfernen"
                          aria-label="Artikel entfernen"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </>
      )}
    </div>
  );
};