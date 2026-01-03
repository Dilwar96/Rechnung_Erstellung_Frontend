export interface InvoiceItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  tax1: number;
}

export interface CompanyInfo {
  name: string;
  owner?: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
  taxNumber: string;
  bankName: string;
  accountNumber: string;
  iban: string;
  swift: string;
  logo?: string;
}

export interface CustomerInfo {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  customField1?: string;
  customField2?: string;
}

export interface Invoice {
  invoiceNumber: string;
  date: string;
  deliveryDate?: string;
  company: CompanyInfo;
  customer: CustomerInfo;
  items: InvoiceItem[];
  paymentMethod: 'card' | 'cash';
  currency: string;
  globalDiscount: number;
  globalTip: number;
}

export type Language = 'en' | 'de';