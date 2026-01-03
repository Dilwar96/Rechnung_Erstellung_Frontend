import { useState, useEffect } from 'react';
import { Invoice, InvoiceItem, CompanyInfo, CustomerInfo } from '../types/invoice';
import { apiService } from '../services/api';
import { showToast } from '../services/toast';

const defaultCompany: CompanyInfo = {
  name: 'Your Company Name',
  address: '123 Business Street',
  city: 'Berlin',
  postalCode: '10115',
  phone: '+49 30 12345678',
  email: 'info@yourcompany.com',
  taxNumber: 'DE123456789',
  bankName: 'Deutsche Bank',
  accountNumber: '1234567890',
  iban: 'DE89370400440532013000',
  swift: 'DEUTDEFF'
};

const defaultCustomer: CustomerInfo = {
  name: 'Customer Name',
  address: '456 Customer Street',
  city: 'Munich',
  postalCode: '80331',
  customField1: '',
  customField2: ''
};

export const useInvoice = () => {
  const [invoice, setInvoice] = useState<Invoice>({
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    company: defaultCompany,
    customer: defaultCustomer,
    items: [],
    paymentMethod: 'card',
    currency: 'EUR',
    globalDiscount: 0,
    globalTip: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load company information from MongoDB
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        setLoading(true);
        const response = await apiService.getCompany();
        
        if (response.error) {
          setError(response.error);
          showToast.error('companyDataLoadError');
        } else if (response.data) {
          setInvoice(prev => ({
            ...prev,
            company: response.data as CompanyInfo
          }));
          showToast.success('companyDataLoaded');
        }
      } catch (error) {
        setError('Failed to load company data');
        showToast.error('companyDataLoadError');
      } finally {
        setLoading(false);
      }
    };

    loadCompanyData();
  }, []);

  const updateCompanyInfo = async (field: keyof CompanyInfo, value: string) => {
    try {
      const updatedCompany = { ...invoice.company, [field]: value };
      
      // Update local state immediately
      setInvoice(prev => ({
        ...prev,
        company: updatedCompany
      }));

      // Save to MongoDB
      const response = await apiService.updateCompany(updatedCompany);
      
      if (response.error) {
        setError('Failed to save company data');
        showToast.error('companyDataUpdateError');
      } else {
        showToast.success('companyDataUpdated');
      }
    } catch (error) {
      setError('Failed to save company data');
      showToast.error('companyDataUpdateError');
    }
  };

  const updateCustomerInfo = (field: keyof CustomerInfo, value: string) => {
    setInvoice(prev => ({
      ...prev,
      customer: { ...prev.customer, [field]: value }
    }));
  };

  const updateGlobalDiscount = (value: number) => {
    setInvoice(prev => ({
      ...prev,
      globalDiscount: value
    }));
  };

  const updateGlobalTip = (value: number) => {
    setInvoice(prev => ({
      ...prev,
      globalTip: value
    }));
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      name: '',
      quantity: 1,
      price: 0,
      tax1: 19
    };
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
    showToast.success('itemAdded');
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
    showToast.success('itemRemoved');
  };

  const calculateItemTotal = (item: InvoiceItem) => {
    const subtotal = item.quantity * item.price;
    const tax1Amount = subtotal * (item.tax1 / 100);
    return subtotal + tax1Amount;
  };

  const calculateTotals = () => {
    // Bruttosumme aller Positionen
    const bruttoSum = invoice.items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    // Steuergruppen berechnen (optional, für spätere Erweiterung)
    let nettoSum = 0;
    let steuerSum = 0;
    invoice.items.forEach(item => {
      const brutto = item.quantity * item.price;
      const tax = item.tax1;
      const netto = brutto / (1 + tax / 100);
      const steuer = brutto - netto;
      nettoSum += netto;
      steuerSum += steuer;
    });
    const rabatt = invoice.globalDiscount || 0;
    const tip = invoice.globalTip || 0;
    const total = bruttoSum - rabatt + tip;
    return {
      subtotal: nettoSum,
      totalDiscount: rabatt,
      totalTax1: steuerSum,
      totalTip: tip,
      total
    };
  };

  const saveInvoice = async () => {
    // Pflichtfeld: Rechnungsnummer
    if (!invoice.invoiceNumber || invoice.invoiceNumber.trim() === '') {
      showToast.error('Bitte geben Sie eine Rechnungsnummer ein und füllen Sie alle Pflichtfelder mit Informationen!');
      return false;
    }
    // Filter out items with empty names
    const validItems = invoice.items.filter(item => item.name && item.name.trim() !== '');
    
    if (validItems.length === 0) {
      showToast.error('Eine Rechnung muss mindestens eine Position mit Namen enthalten!');
      return false;
    }

    // Validate that all items have required fields
    const invalidItems = validItems.filter(item => 
      !item.name || item.name.trim() === '' || 
      item.quantity <= 0 || 
      item.price < 0
    );

    if (invalidItems.length > 0) {
      showToast.error('Alle Positionen müssen einen Namen, eine Menge > 0 und einen Preis >= 0 haben!');
      return false;
    }

    // Pflichtfelder: Kundeninformationen
    const missingCustomerFields = [];
    if (!invoice.customer.name || invoice.customer.name.trim() === '') missingCustomerFields.push('Name');
    if (!invoice.customer.address || invoice.customer.address.trim() === '') missingCustomerFields.push('Adresse');
    if (!invoice.customer.city || invoice.customer.city.trim() === '') missingCustomerFields.push('Stadt');
    if (!invoice.customer.postalCode || invoice.customer.postalCode.trim() === '') missingCustomerFields.push('PLZ');
    if (missingCustomerFields.length > 0) {
      showToast.error('Bitte füllen Sie alle Kundenfelder aus: ' + missingCustomerFields.join(', '));
      return false;
    }

    try {
      const totals = calculateTotals();
      // Remove 'id' from each item before sending to backend and ensure all required fields are present
      const itemsForBackend = validItems.map(({ id, ...rest }) => ({
        ...rest,
        name: rest.name.trim(),
        quantity: rest.quantity || 1,
        price: rest.price || 0,
        tax1: rest.tax1 || 19,
        discount: 0, // Default value for backend
        tip: 0 // Default value for backend
      }));

      const invoiceData = {
        ...invoice,
        items: itemsForBackend,
        totals,
        globalDiscount: undefined, // nicht doppelt speichern
        globalTip: undefined,
        customer: {
          name: invoice.customer.name,
          address: invoice.customer.address,
          city: invoice.customer.city,
          postalCode: invoice.customer.postalCode,
          customField1: invoice.customer.customField1 || '',
          customField2: invoice.customer.customField2 || ''
        }
      };

      const response = await apiService.createInvoice(invoiceData);
      
      if (response.error) {
        // Check if it's a duplicate invoice number error
        if (response.error.includes('DUPLICATE_INVOICE_NUMBER') || response.error.includes('existiert bereits')) {
          showToast.error('duplicateInvoiceNumber');
          return false;
        } else if (response.error.includes('validation failed') || response.error.includes('required')) {
          showToast.error('validationError');
          return false;
        } else {
          showToast.error('invoiceSaveError');
        return false;
        }
      } else {
        showToast.success('invoiceSaved');
        
        // Nach dem Speichern Felder zurücksetzen
        setInvoice({
          invoiceNumber: `INV-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          company: invoice.company, // Firma bleibt gleich
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
        });
        return true;
      }
    } catch (error) {
      showToast.error('invoiceSaveError');
      return false;
    }
  };

  return {
    invoice,
    setInvoice,
    updateCompanyInfo,
    updateCustomerInfo,
    updateGlobalDiscount,
    updateGlobalTip,
    addItem,
    updateItem,
    removeItem,
    calculateItemTotal,
    calculateTotals,
    saveInvoice,
    loading,
    error
  };
};