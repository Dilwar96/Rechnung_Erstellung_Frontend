import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { CompanyInfo } from '../types/invoice';
import { apiService } from '../services/api';
import { showToast } from '../services/toast';

interface CompanySettingsProps {
  onBack: () => void;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({ onBack }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState<CompanyInfo>({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    email: '',
    taxNumber: '',
    bankName: '',
    accountNumber: '',
    iban: '',
    swift: '',
    logo: '',
    owner: ''
  });

  useEffect(() => {
    // Only load company data if user is authenticated
    const token = localStorage.getItem('adminToken');
    if (token) {
      loadCompanyData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadCompanyData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getCompany();
      
      if (response.error) {
        console.error('Error loading company data:', response.error);
        showToast.error('companyDataLoadError');
      } else if (response.data) {
        setCompany(response.data as CompanyInfo);
        // Don't show success toast on initial load
      }
    } catch (error) {
      console.error('Error loading company data:', error);
      showToast.error('companyDataLoadError');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof CompanyInfo, value: string) => {
    setCompany(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setCompany(prev => ({ ...prev, logo: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await apiService.updateCompany(company);
      
      if (response.error) {
        console.error('Error updating company:', response.error);
        showToast.error('companyDataUpdateError');
      } else {
        showToast.success('companyDataUpdated');
      }
    } catch (error) {
      console.error('Error updating company:', error);
      showToast.error('companyDataUpdateError');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laden...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">Firmeneinstellungen</h1>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors w-full sm:w-auto mt-2 sm:mt-0"
              aria-label="Zurück zur Rechnung"
            >
              <span>Zurück zur Rechnung</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Company Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Firmeninformationen</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-name">Firmenname</label>
                <input
                  id="company-name"
                  type="text"
                  value={company.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-owner">Inhaber</label>
                <input
                  id="company-owner"
                  type="text"
                  value={company.owner || ''}
                  onChange={(e) => updateField('owner', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-address">Adresse</label>
                <input
                  id="company-address"
                  type="text"
                  value={company.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-city">Stadt</label>
                  <input
                    id="company-city"
                    type="text"
                    value={company.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-postal">PLZ</label>
                  <input
                    id="company-postal"
                    type="text"
                    value={company.postalCode}
                    onChange={(e) => updateField('postalCode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-phone">Telefon</label>
                  <input
                    id="company-phone"
                    type="tel"
                    value={company.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-email">E-Mail</label>
                  <input
                    id="company-email"
                    type="email"
                    value={company.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-tax">Steuernummer</label>
                <input
                  id="company-tax"
                  type="text"
                  value={company.taxNumber}
                  onChange={(e) => updateField('taxNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-logo">Firmenlogo</label>
                {company.logo && (
                  <div className="mb-2">
                    <img src={company.logo} alt="Firmenlogo" className="h-20 max-w-xs object-contain border rounded bg-gray-50 p-2" />
                  </div>
                )}
                <input
                  id="company-logo"
                  type="file"
                  accept="image/png,image/jpeg,image/svg+xml"
                  onChange={handleLogoChange}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <div className="text-xs text-gray-400 mt-1">Erlaubt: PNG, JPG, SVG. Wird in der Rechnung angezeigt.</div>
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center space-x-3 mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Bankinformationen</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-bank">Bank Name</label>
                <input
                  id="company-bank"
                  type="text"
                  value={company.bankName}
                  onChange={(e) => updateField('bankName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-account">Kontonummer</label>
                <input
                  id="company-account"
                  type="text"
                  value={company.accountNumber}
                  onChange={(e) => updateField('accountNumber', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-iban">IBAN</label>
                <input
                  id="company-iban"
                  type="text"
                  value={company.iban}
                  onChange={(e) => updateField('iban', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono"
                  placeholder="DE89 3704 0044 0532 0130 00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="company-swift">SWIFT/BIC</label>
                <input
                  id="company-swift"
                  type="text"
                  value={company.swift}
                  onChange={(e) => updateField('swift', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-mono"
                  placeholder="DEUTDEFF"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Button-Leiste: Speichern & Zurücksetzen */}
        <div className="flex flex-wrap gap-4 mt-8">
          <button
            type="button"
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center"
            disabled={saving}
            aria-label="Änderungen speichern"
          >
            <Save className="w-4 h-4 mr-2" /> Änderungen speichern
          </button>
          <button
            type="button"
            onClick={() => {
              setCompany({
                name: '',
                address: '',
                city: '',
                postalCode: '',
                phone: '',
                email: '',
                taxNumber: '',
                bankName: '',
                accountNumber: '',
                iban: '',
                swift: '',
                logo: '',
                owner: ''
              });
              setTimeout(() => {
                handleSave();
                showToast.success('Alle Felder wurden geleert und gespeichert.');
              }, 0);
            }}
            className="bg-red-100 hover:bg-red-200 text-red-700 px-6 py-2 rounded-lg font-semibold transition-colors flex items-center"
            aria-label="Felder leeren"
          >
            Felder leeren
          </button>
        </div>
      </div>
    </div>
  );
}; 