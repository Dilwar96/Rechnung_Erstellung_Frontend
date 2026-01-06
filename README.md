# Frontend — Rechnungserstellung

## Übersicht

Dies ist das React + Vite TypeScript Frontend für die Rechnungsanwendung. Es bietet einen Editor, Vorschau und clientseitigen PDF-Export für Rechnungen und kommuniziert mit der Backend-API.

## Schnellstart

### Abhängigkeiten installieren und Entwicklungsserver starten:

```bash
npm install
npm run dev
```

### Für Produktion bauen:

```bash
npm run build
npm run preview
```

## Umgebung

Konfiguriere die Backend-URL in `.env`:

```
VITE_API_URL=http://localhost:5000
```

## Demo-Zugang

Für lokale Tests und Demo ist standardmäßig ein Admin-Account vorhanden:
- **Benutzername:** admin
- **Passwort:** admin123

⚠️ Bitte nur lokal verwenden und in Produktionsumgebungen ändern!

## Production-Demo

Produktions-Demo: https://rechnungersteller.netlify.app/

## Projektstruktur (wichtig)

- `src/App.tsx` — zentrale Anwendungszustand und View-Auswahl
- `src/views/` — Top-Level Views (InvoicePage, InvoicesPage, SettingsPage)
- `src/components/` — wiederverwendbare UI-Komponenten (AppHeader, AppFooter, PrintLayout, Invoice* Komponenten)
- `src/hooks/` — Business-Logic Hooks (`useInvoice`, `useInvoiceActions`)
- `src/services/api.ts` — API-Wrapper für Backend-Aufrufe

### Wichtige Dateien

- App-Entry: `src/App.tsx`
- Views: `src/views/*`
- Komponenten: `src/components/*`
- Hooks / Business-Logic: `src/hooks/useInvoice.ts`, `src/hooks/useInvoiceActions.ts`
- API-Service: `src/services/api.ts`
- Toast-Benachrichtigungen: `src/services/toast.ts`
- Druck/Export: `src/components/PrintLayout.tsx`

## Technologie-Stack

- React 18, TypeScript, Vite, TailwindCSS
- html2pdf.js / html2canvas für clientseitigen PDF-Export
- react-hot-toast für Benutzer-Feedback

## PDF-Export

Der PDF-Export läuft clientseitig mit `html2pdf.js` / `html2canvas`. Der Server sendet keine E-Mails.

## Fehlerbehebung

Falls `npm run dev` fehlschlägt:

1. Führe `npm install` aus.
2. Überprüfe, dass neu hinzugefügte Dateien vorhanden sind und Importe korrekt sind.
3. Überprüfe die Browser-Konsole auf Laufzeitfehler und das Terminal auf Build-Fehler.

## Beiträge & Best Practices

- Halte Hooks in `src/hooks`, Views in `src/views` und reine präsentationale Komponenten in `src/components`.
- Validiere Formulare clientseitig und zeige hilfreiche Fehlermeldungen/Toasts an.
- Nutze Business-Logik in Hooks für konsistenten State Management.
- Lint: `npm run lint` (falls konfiguriert)
- Env: setze `VITE_API_URL` in `.env`

Akzeptanzkriterien
- Rechnungen können erstellt, validiert und an das Backend gesendet werden.
- PDF‑Download & Drucken liefern korrekt formatiertes A4‑Dokument.
- Firmeninfos sind editierbar und werden per API persistiert.
