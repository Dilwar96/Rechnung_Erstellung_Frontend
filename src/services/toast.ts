import toast from 'react-hot-toast';

export const messages = {
    companyDataLoaded: 'Firmendaten erfolgreich geladen',
    companyDataLoadError: 'Fehler beim Laden der Firmendaten',
  companyDataUpdated: 'Firmeninformationen erfolgreich gespeichert',
    companyDataUpdateError: 'Fehler beim Speichern der Firmendaten',
  invoiceSaved: 'Rechnung erfolgreich gespeichert!',
    invoiceSaveError: 'Fehler beim Speichern der Rechnung. Bitte versuchen Sie es erneut.',
  invoiceSaveLoading: 'Rechnung wird gespeichert...',
  duplicateInvoiceNumber: 'Eine Rechnung mit dieser Rechnungsnummer existiert bereits.',
  validationError: 'Bitte prüfen Sie alle Pflichtfelder der Rechnungspositionen.',
  itemAdded: 'Neue Position hinzugefügt',
  itemRemoved: 'Position entfernt',
  pdfGenerating: 'PDF wird erstellt...',
  pdfGenerated: 'PDF erfolgreich erstellt!',
  pdfError: 'Fehler beim Erstellen des PDFs. Bitte versuchen Sie es erneut.',
    emailSending: 'E-Mail wird gesendet...',
    emailSent: 'E-Mail erfolgreich gesendet!',
    emailError: 'Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.',
    generalError: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
};

export const showToast = {
  success: (key: string) => {
    toast.success(messages[key as keyof typeof messages] || key);
  },
  error: (key: string) => {
    toast.error(messages[key as keyof typeof messages] || key);
  },
  loading: (key: string) => {
    return toast.loading(messages[key as keyof typeof messages] || key);
  },
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  }
}; 