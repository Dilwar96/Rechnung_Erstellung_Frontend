const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  error?: string;
}

class ApiService {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('adminToken');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 401 Unauthorized - token expired or invalid
        if (response.status === 401) {
          // Only redirect if there was actually a token (user was logged in)
          const hadToken = localStorage.getItem('adminToken');
          localStorage.removeItem('adminToken');
          
          if (hadToken) {
            // Avoid redirect loop by checking current path
            if (window.location.pathname !== '/') {
              window.location.href = '/';
            }
          }
          return { error: 'Sitzung abgelaufen. Bitte erneut anmelden.' };
        }
        
        // For 409 status (duplicate invoice number), return the specific error message
        if (response.status === 409) {
          return { error: data.message || 'Eine Rechnung mit dieser Rechnungsnummer existiert bereits.' };
        }
        throw new Error(data.message || 'API request failed');
      }

      return { data };
    } catch (error) {
      console.error('API Error:', error);
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Company API
  async getCompany() {
    return this.request('/company');
  }

  async updateCompany(companyData: any) {
    return this.request('/company', {
      method: 'PUT',
      body: JSON.stringify(companyData),
    });
  }

  // Invoice API
  async getInvoices() {
    return this.request('/invoices');
  }

  async getInvoice(id: string) {
    return this.request(`/invoices/${id}`);
  }

  async createInvoice(invoiceData: any) {
    return this.request('/invoices', {
      method: 'POST',
      body: JSON.stringify(invoiceData),
    });
  }

  async updateInvoice(id: string, invoiceData: any) {
    return this.request(`/invoices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(invoiceData),
    });
  }

  async deleteInvoice(id: string) {
    return this.request(`/invoices/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService(); 