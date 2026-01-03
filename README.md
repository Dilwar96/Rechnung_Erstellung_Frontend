# Frontend — Developer README

Overview
- This is the React + Vite TypeScript frontend for the invoice application. It provides an editor, preview and client-side PDF export for invoices and communicates with the backend API.

Quick start
- Install dependencies and run dev server:

```bash
npm install
npm run dev
```

- Build for production:

```bash
npm run build
npm run preview
```

Environment
- Configure backend URL in `.env`:

```
VITE_API_URL=http://localhost:5000
```

Deployment / Demo
- Production demo: https://rechnungersteller.netlify.app/

Demo-Zugang
- Für lokale Tests / Demo gibt es standardmäßig einen Admin‑Account:
  - **username:** admin
  - **password:** admin123

- Bitte nur lokal verwenden und in Produktionsumgebungen ändern.

Project structure (important)
- `src/App.tsx` — central application state and view selection
- `src/views/` — top-level views (InvoicePage, InvoicesPage, SettingsPage)
- `src/components/` — reusable UI components (AppHeader, AppFooter, PrintLayout, Invoice* components)
- `src/hooks/` — business logic hooks (`useInvoice`, `useInvoiceActions`)
- `src/services/api.ts` — API wrapper for backend calls
.

PDF
- PDF export runs client-side using `html2pdf.js` / `html2canvas`.


Troubleshooting
- If `npm run dev` fails:
  1. Run `npm install`.
  2. Verify newly added files are present and imports are correct.
  3. Check the browser console for runtime errors and the terminal for build errors.

Contributing
- Keep hooks in `src/hooks`, views in `src/views`, and pure presentational components in `src/components`.
# Frontend — Ausschreibung

Projekt: React + Vite UI für Rechnungserstellung

Zweck
- Ein reaktionsschnelles Web‑Interface zur Erstellung, Vorschau, PDF‑Export und Verwaltung von Rechnungen.
- Verbindung zur Backend‑API (siehe `server/README.md`).

Kurze Projektübersicht
- `App.tsx` hält den zentralen State und verteilt Props an Views/Components.
- Wichtige neue Views/Components:
  - `src/components/AppHeader.tsx` — globaler Header
  - `src/components/AppFooter.tsx` — Footer mit Aktions-Buttons
  - `src/views/InvoicePage.tsx` — Hauptseite zur Rechnungserstellung
  - `src/views/InvoicesPage.tsx` — Liste aller Rechnungen
  - `src/views/SettingsPage.tsx` — Firmen-/Einstellungen

Wichtige Dateien
- App-Entry: `src/App.tsx`
- Views: `src/views/*`
- Components: `src/components/*`
- Hooks / Business-Logic: `src/hooks/useInvoice.ts`, `src/hooks/useInvoiceActions.ts`
- API-Service: `src/services/api.ts`
- Toaster: `src/services/toast.ts`
- Print/Export: `src/components/PrintLayout.tsx`

Technologie-Stack
- React 18, TypeScript, Vite, TailwindCSS
- html2pdf.js / html2canvas für clientseitigen PDF-Export
- react-hot-toast für UX‑Feedback

Aufgaben / Anforderungen
- UX & Validierung: Formulare clientseitig validieren, hilfreiche Fehlermeldungen/Toasts anzeigen.
- Konsistenter State: Business‑Logik in Hooks (`useInvoice`).
- PDF & Print: Hochwertige A4‑PDFs erzeugen (PrintLayout). Der PDF‑Export läuft clientseitig; der Server sendet keine E‑Mails mehr.
- Integration: Kommunikation mit Backend via `src/services/api.ts` (`VITE_API_URL`).
- Responsiveness & Accessibility: Mobil‑ und Druckansicht optimieren.

Run & Build
- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Preview: `npm run preview`
- Lint: `npm run lint` (falls konfiguriert)
- Env: setze `VITE_API_URL` in `.env`

Akzeptanzkriterien
- Rechnungen können erstellt, validiert und an das Backend gesendet werden.
- PDF‑Download & Drucken liefern korrekt formatiertes A4‑Dokument.
- Firmeninfos sind editierbar und werden per API persistiert.
