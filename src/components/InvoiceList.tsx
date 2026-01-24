import React, { useEffect, useState } from 'react';
import ReactDOMServer from 'react-dom/server';
import { PrintLayout } from './PrintLayout';
import { showToast } from '../services/toast';
import { apiService } from '../services/api';

interface Invoice {
  _id: string;
  invoiceNumber: string;
  date: string;
  customer: {
    name: string;
    address?: string;
    city?: string;
    postalCode?: string;
    customField1?: string;
    customField2?: string;
  };
  items?: Array<{ name: string; quantity: number; price: number; tax1: number; }>;
  totals: {
    total: number;
    subtotal?: number;
    totalDiscount?: number;
    totalTax1?: number;
    totalTip?: number;
  };
  company?: {
    name?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    taxNumber?: string;
    bankName?: string;
    accountNumber?: string;
    iban?: string;
    swift?: string;
    logo?: string;
    owner?: string;
  };
  paymentMethod: string;
  deliveryDate?: string;
}

export const InvoiceList: React.FC<{ onEdit: (id: string) => void }> = ({ onEdit }) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Invoice | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const pageSize = 10;

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await apiService.getInvoices();
      if (response.error) {
        showToast.error(response.error);
        setInvoices([]);
      } else if (response.data) {
        setInvoices(response.data as Invoice[]);
      }
    } catch (error) {
      showToast.error('Fehler beim Laden der Rechnungen');
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await apiService.deleteInvoice(id);
      if (res.error) {
        showToast.error(res.error);
      } else {
        setInvoices(invoices => invoices.filter(inv => inv._id !== id));
        showToast.success('Rechnung wurde gelöscht.');
      }
    } catch {
      showToast.error('Fehler beim Löschen der Rechnung');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  const handlePrint = (inv: Invoice) => {
    // Fallbacks für fehlende Felder (currency, globalDiscount, globalTip)
    const invoiceWithDefaults = {
      currency: 'EUR',
      globalDiscount: 0,
      globalTip: 0,
      ...inv,
      company: {
        name: inv.company?.name ?? '',
        address: inv.company?.address ?? '',
        city: inv.company?.city ?? '',
        postalCode: inv.company?.postalCode ?? '',
        phone: inv.company?.phone ?? '',
        email: inv.company?.email ?? '',
        taxNumber: inv.company?.taxNumber ?? '',
        bankName: inv.company?.bankName ?? '',
        accountNumber: inv.company?.accountNumber ?? '',
        iban: inv.company?.iban ?? '',
        swift: inv.company?.swift ?? '',
        logo: inv.company?.logo ?? '',
        owner: inv.company?.owner ?? '',
      },
      customer: {
        name: inv.customer?.name ?? '',
        address: inv.customer?.address ?? '',
        city: inv.customer?.city ?? '',
        postalCode: inv.customer?.postalCode ?? '',
        customField1: inv.customer?.customField1 ?? '',
        customField2: inv.customer?.customField2 ?? '',
      },
      items: Array.isArray(inv.items)
        ? inv.items.map((item, idx) => ({ id: (item as any).id || `${item.name || 'item'}-${idx}`, ...item }))
        : [],
      paymentMethod: (inv.paymentMethod === 'card' || inv.paymentMethod === 'cash' ? inv.paymentMethod : 'card') as 'card' | 'cash',
    };
    const totals = {
      subtotal: inv.totals?.subtotal ?? 0,
      totalDiscount: inv.totals?.totalDiscount ?? 0,
      totalTax1: inv.totals?.totalTax1 ?? 0,
      totalTip: inv.totals?.totalTip ?? 0,
      total: inv.totals?.total ?? 0,
    };
    const html = ReactDOMServer.renderToString(
      <PrintLayout invoice={invoiceWithDefaults} totals={totals} />
    );
    // Suche explizit nach dem gebauten CSS-Link (index-xxxx.css)
    const appCss = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .find(link => (link as HTMLLinkElement).href.includes('index') && (link as HTMLLinkElement).href.endsWith('.css')) as HTMLLinkElement | undefined;
    const styles = appCss ? `<link rel="stylesheet" href="${appCss.href}">` : '';
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`<!DOCTYPE html><html><head><title>Rechnung</title>${styles}</head><body>${html}<script>window.onload = function() { window.print(); }</script></body></html>`);
      printWindow.document.close();
    }
  };

  // PDF-Download-Funktion
  const handleDownloadPdf = async (inv: Invoice) => {
    const html2pdf = (await import('html2pdf.js')).default;
    // Unsichtbares iframe als Container
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-9999px';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument || (iframe.contentWindow ? iframe.contentWindow.document : null);
    if (!doc) {
      document.body.removeChild(iframe);
      throw new Error('Could not access iframe document');
    }
    // CSS-Link übernehmen
    const appCss = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .find(link => (link as HTMLLinkElement).href.includes('index') && (link as HTMLLinkElement).href.endsWith('.css')) as HTMLLinkElement | undefined;
    if (appCss) {
      doc.head.innerHTML = `<link rel="stylesheet" href="${appCss.href}">`;
    }
    const invoiceWithDefaults = {
      currency: 'EUR',
      globalDiscount: 0,
      globalTip: 0,
      ...inv,
      company: {
        name: inv.company?.name ?? '',
        address: inv.company?.address ?? '',
        city: inv.company?.city ?? '',
        postalCode: inv.company?.postalCode ?? '',
        phone: inv.company?.phone ?? '',
        email: inv.company?.email ?? '',
        taxNumber: inv.company?.taxNumber ?? '',
        bankName: inv.company?.bankName ?? '',
        accountNumber: inv.company?.accountNumber ?? '',
        iban: inv.company?.iban ?? '',
        swift: inv.company?.swift ?? '',
        logo: inv.company?.logo ?? '',
        owner: inv.company?.owner ?? '',
      },
      customer: {
        name: inv.customer?.name ?? '',
        address: inv.customer?.address ?? '',
        city: inv.customer?.city ?? '',
        postalCode: inv.customer?.postalCode ?? '',
        customField1: inv.customer?.customField1 ?? '',
        customField2: inv.customer?.customField2 ?? '',
      },
      items: Array.isArray(inv.items)
        ? inv.items.map((item, idx) => ({ id: (item as any).id || `${item.name || 'item'}-${idx}`, ...item }))
        : [],
      paymentMethod: (inv.paymentMethod === 'card' || inv.paymentMethod === 'cash' ? inv.paymentMethod : 'card') as 'card' | 'cash',
    };
    const totals = {
      subtotal: inv.totals?.subtotal ?? 0,
      totalDiscount: inv.totals?.totalDiscount ?? 0,
      totalTax1: inv.totals?.totalTax1 ?? 0,
      totalTip: inv.totals?.totalTip ?? 0,
      total: inv.totals?.total ?? 0,
    };
    // PrintLayout als HTML-String rendern
    doc.body.innerHTML = ReactDOMServer.renderToString(
      <PrintLayout invoice={invoiceWithDefaults} totals={totals} />
    );
    setTimeout(() => {
      html2pdf().set({
        margin: 0,
        filename: `Rechnung_${inv.invoiceNumber || 'Unbenannt'}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      }).from(doc.body).save().then(() => {
        document.body.removeChild(iframe);
      });
    }, 400);
  };

  // Filtered invoices based on search
  const filteredInvoices = invoices.filter(inv => {
    const searchLower = search.trim().toLowerCase();
    if (!searchLower) return true;
    const name = inv.customer?.name?.toLowerCase() || '';
    const invoiceNumber = inv.invoiceNumber?.toLowerCase() || '';
    return name.includes(searchLower) || invoiceNumber.includes(searchLower);
  });

  // Pagination logic
  const pageCount = Math.ceil(filteredInvoices.length / pageSize) || 1;
  const paginatedInvoices = filteredInvoices.slice((page - 1) * pageSize, page * pageSize);
  // Reset page to 1 if search or invoices change and Seite zu groß ist
  React.useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [search, invoices, pageCount]);

  if (loading) return <div className="text-center py-8">Lade Rechnungen...</div>;

  return (
    <div className="overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Gespeicherte Rechnungen</h2>
      {/* Suchleiste: mobil untereinander, ab sm nebeneinander */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
        <input
          type="text"
          className="border rounded px-3 py-2 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Suche nach Kunde oder Rechnungsnummer..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {search && (
          <button
            className="sm:ml-2 text-sm text-blue-600 hover:underline"
            onClick={() => setSearch('')}
          >
            Suche zurücksetzen
          </button>
        )}
      </div>

      {/* Mobile Ansicht: Karten/Blöcke */}
      <div className="block sm:hidden space-y-3">
        {paginatedInvoices.map(inv => (
          <div key={inv._id} className="bg-white rounded-lg shadow p-3 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-700">{inv.invoiceNumber}</span>
              <span className="text-xs text-gray-500">{inv.date}</span>
            </div>
            <div className="text-sm text-gray-700">{inv.customer?.name || '-'}</div>
            <div className="text-base font-bold text-right">{inv.totals?.total?.toFixed(2)} €</div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <button
                className="flex-1 min-w-[90px] bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-blue-700"
                onClick={() => setSelected(inv)}
                title="Details anzeigen"
              >
                Details
              </button>
              <button
                className="flex-1 min-w-[90px] bg-yellow-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-yellow-700"
                onClick={() => onEdit(inv._id)}
                title="Bearbeiten"
              >
                Bearbeiten
              </button>
              <button
                className="flex-1 min-w-[90px] bg-gray-700 text-white px-2 py-1 rounded text-xs font-medium hover:bg-gray-800"
                onClick={() => handlePrint(inv)}
                title="Drucken"
              >
                Drucken
              </button>
              <button
                className="flex-1 min-w-[90px] bg-emerald-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-emerald-700"
                onClick={() => handleDownloadPdf(inv)}
                title="PDF herunterladen"
              >
                PDF herunterladen
              </button>
              <button
                className="flex-1 min-w-[90px] bg-red-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-700"
                onClick={() => setConfirmDeleteId(inv._id)}
                title="Löschen"
              >
                Löschen
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop/Tablet Tabelle */}
      <table className="hidden sm:table min-w-full bg-white border rounded shadow text-sm">
        <thead className="bg-blue-50 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 border font-semibold text-blue-700">Rechnungsnummer</th>
            <th className="px-4 py-2 border font-semibold text-blue-700">Datum</th>
            <th className="px-4 py-2 border font-semibold text-blue-700">Lieferdatum</th>
            <th className="px-4 py-2 border font-semibold text-blue-700">Kunde</th>
            <th className="px-4 py-2 border font-semibold text-blue-700">Gesamtbetrag (€)</th>
            <th className="px-4 py-2 border font-semibold text-blue-700">Zahlungsart</th>
            <th className="px-4 py-2 border font-semibold text-blue-700">Aktionen</th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map((inv, idx) => (
            <tr key={inv._id} className={
              `transition-colors ${(idx % 2 === 0 ? 'bg-gray-50' : 'bg-white')} hover:bg-blue-50`
            }>
              <td className="px-4 py-2 border whitespace-nowrap">{inv.invoiceNumber}</td>
              <td className="px-4 py-2 border whitespace-nowrap">{inv.date}</td>
              <td className="px-4 py-2 border whitespace-nowrap">{inv.deliveryDate || '-'}</td>
              <td className="px-4 py-2 border">{inv.customer?.name || '-'}</td>
              <td className="px-4 py-2 border font-semibold text-right">{inv.totals?.total?.toFixed(2) || '-'} €</td>
              <td className="px-4 py-2 border text-center">{inv.paymentMethod === 'card' ? 'Überweisung' : 'Barzahlung'}</td>
              <td className="px-4 py-2 border space-x-2 text-center">
                <button
                  className="inline-flex items-center bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                  onClick={() => setSelected(inv)}
                  title="Details anzeigen"
                >
                  <span className="material-icons text-base mr-1"></span> Details
                </button>
                <button
                  className="inline-flex items-center bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
                  onClick={() => onEdit(inv._id)}
                  title="Bearbeiten"
                >
                  <span className="material-icons text-base mr-1"></span> Bearbeiten
                </button>
                <button
                  className="inline-flex items-center bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 transition-colors"
                  onClick={() => handlePrint(inv)}
                  title="Drucken"
                >
                  <span className="material-icons text-base mr-1"></span> Drucken
                </button>
                <button
                  className="inline-flex items-center bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700 transition-colors"
                  onClick={() => handleDownloadPdf(inv)}
                  title="PDF herunterladen"
                >
                  <span className="material-icons text-base mr-1"></span> PDF herunterladen
                </button>
                <button
                  className="inline-flex items-center bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                  onClick={() => setConfirmDeleteId(inv._id)}
                  title="Löschen"
                >
                  <span className="material-icons text-base mr-1"></span> Löschen
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(page - 1)}
          disabled={page <= 1}
        >
          Zurück
        </button>
        <span className="text-sm">Seite {page} von {pageCount}</span>
        <button
          className="px-3 py-1 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage(page + 1)}
          disabled={page >= pageCount}
        >
          Weiter
        </button>
      </div>

      {/* Modal für Details */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-lg w-full relative animate-fade-in">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              title="Schließen"
            >
              ×
            </button>
            <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2">
              <span className="material-icons text-lg">receipt_long</span>Rechnung {selected.invoiceNumber}
            </h3>
            <div className="mb-2 flex flex-wrap gap-4">
              <div className="flex-1 min-w-[160px]">
                <div className="mb-1 text-gray-500 text-xs">Datum</div>
                <div className="font-medium">{selected.date}</div>
                {selected.deliveryDate && (
                  <div>
                    <div className="mb-1 text-gray-500 text-xs">Lieferdatum</div>
                    <div className="font-medium">{selected.deliveryDate}</div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-[160px]">
                <div className="mb-1 text-gray-500 text-xs">Kunde</div>
                <div className="font-medium">{selected.customer?.name}</div>
                {selected.customer?.address && <div className="text-xs text-gray-600">{selected.customer.address}</div>}
                {(selected.customer?.city || selected.customer?.postalCode) && <div className="text-xs text-gray-600">{selected.customer?.postalCode} {selected.customer?.city}</div>}

              </div>
            </div>
            <div className="my-4">
              <div className="font-semibold mb-2">Positionen</div>
              <table className="w-full text-xs border rounded">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 border">Bezeichnung</th>
                    <th className="p-2 border">Menge</th>
                    <th className="p-2 border">Preis (€)</th>
                    <th className="p-2 border">Gesamt (€)</th>
                  </tr>
                </thead>
                <tbody>
                  {(selected.items as any[])?.map((item, idx) => (
                    <tr key={item.id || idx} className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="p-2 border">{item.name}</td>
                      <td className="p-2 border text-center">{item.quantity}</td>
                      <td className="p-2 border text-right">{item.price.toFixed(2)}</td>
                      <td className="p-2 border text-right">{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-col items-end gap-1 mt-2">
              {typeof selected.totals?.subtotal === 'number' && (
                <div className="text-xs text-gray-600">Netto: <span className="font-medium">{selected.totals.subtotal.toFixed(2)} €</span></div>
              )}
              {typeof selected.totals?.totalTax1 === 'number' && (
                <div className="text-xs text-gray-600">Steuer: <span className="font-medium">{selected.totals.totalTax1.toFixed(2)} €</span></div>
              )}
              {typeof selected.totals?.totalDiscount === 'number' && selected.totals.totalDiscount > 0 && (
                <div className="text-xs text-gray-600">Rabatt: <span className="font-medium">- {selected.totals.totalDiscount.toFixed(2)} €</span></div>
              )}
              {typeof selected.totals?.totalTip === 'number' && selected.totals.totalTip > 0 && (
                <div className="text-xs text-gray-600">Trinkgeld: <span className="font-medium">{selected.totals.totalTip.toFixed(2)} €</span></div>
              )}
              <div className="text-base font-bold text-blue-700 mt-2">Gesamtbetrag: {selected.totals?.total?.toFixed(2)} €</div>
            </div>
          </div>
              </div>
            )}

      {/* Modal für Lösch-Bestätigung */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-sm w-full relative animate-fade-in">
            <h3 className="text-lg font-bold mb-4 text-red-700 flex items-center gap-2">
              <span className="material-icons text-lg">warning</span>
              Rechnung wirklich löschen?
            </h3>
            <p className="mb-6 text-gray-700">Diese Aktion kann nicht rückgängig gemacht werden.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                disabled={deletingId === confirmDeleteId}
              >
                {deletingId === confirmDeleteId ? 'Lösche...' : 'Löschen'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 