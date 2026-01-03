# Frontend — Ausschreibung

Projekt: React + Vite UI für Rechnungserstellung

Zweck
- Ein reaktionsschnelles Web‑Interface zur Erstellung, Vorschau, PDF‑Export und Verwaltung von Rechnungen.
- Verbindung zur Backend‑API (siehe server/README.md).

Wichtige Dateien
- App-Entry: src/App.tsx
- Hooks / Business-Logic: src/hooks/useInvoice.ts, src/hooks/useInvoiceActions.ts
- API-Service: src/services/api.ts
- Toaster: src/services/toast.ts
- Komponenten: src/components/PrintLayout.tsx, src/components/InvoiceList.tsx, src/components/InvoiceHeader.tsx

Technologie-Stack
- React 18, TypeScript, Vite, TailwindCSS
- html2pdf.js / html2canvas für PDF-Export
- react-hot-toast für UX‑Feedback

Aufgaben / Anforderungen
- UX & Validierung: Formulare clientseitig validieren, hilfreiche Fehlermeldungen/Toasts anzeigen.
- Konsistenter State: Business‑Logik in Hooks (`useInvoice`).
- PDF & Print: Hochwertige A4‑PDFs erzeugen (PrintLayout). Der PDF‑Export läuft clientseitig; der Server sendet keine E‑Mails mehr.
- Integration: Kommunikation mit Backend via src/services/api.ts (VITE_API_URL).
- Responsiveness & Accessibility: Mobil‑ und Druckansicht optimieren.
- Tests: Komponententests / Integrations-Checks (optional).

Run & Build
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Env: setze `VITE_API_URL` in `.env`

Akzeptanzkriterien
- Rechnungen können erstellt, validiert und an das Backend gesendet werden.
- PDF‑Download & Drucken liefern korrekt formatiertes A4‑Dokument.
- Firmeninfos sind editierbar und werden per API persistiert.
