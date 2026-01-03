import { useCallback } from 'react';
import { showToast } from '../services/toast';

export const useInvoiceActions = (saveInvoice?: () => Promise<boolean>) => {
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleSave = useCallback(async () => {
    if (saveInvoice) {
      const loadingToast = showToast.loading('invoiceSaveLoading');
      
      try {
        await saveInvoice();
        showToast.dismiss(loadingToast);
      } catch (error) {
        showToast.dismiss(loadingToast);
        showToast.error('generalError');
      }
    }
  }, [saveInvoice]);

  return {
    handlePrint,
    handleSave
  };
};