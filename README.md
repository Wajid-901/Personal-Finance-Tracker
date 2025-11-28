# Personal Finance Tracker (Frontend-Only)

A modern, offline-first personal finance tracker built with React + Vite + TypeScript, Tailwind CSS, Recharts, and PWA support. Data persists in the browser via IndexedDB (with LocalStorage fallback).

## Features

- Dashboard: balance, monthly income/expenses, charts (line, pie, bar)
- Transactions: add/edit/delete, search, filter (type/category), sorting
- Categories: create/edit/delete with color and icon
- Settings: dark/light theme, currency, export JSON/CSV, reset sample data
- Offline-first and installable (PWA)

## Tech Stack

- React 18, TypeScript, Vite 5
- Tailwind CSS 3
- Recharts for charts
- idb (IndexedDB) with LocalStorage fallback
- Vite PWA plugin

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build && npm run preview
```

## Project Structure

```
src/
  main.tsx                 # Entry
  index.css                # Tailwind
  modules/
    app/App.tsx            # Shell + routing
    state/                 # Global state, storage, sample data
      AppProvider.tsx
      storage.ts           # IndexedDB + LocalStorage fallback
      sampleData.ts
      types.ts
    utils/money.ts         # Currency + aggregations
    ui/Header.tsx          # Top nav + theme toggle
    dashboard/             # Dashboard widgets + charts
      Dashboard.tsx
      IncomeExpenseChart.tsx
      CategoryBarChart.tsx
      MonthlyPie.tsx
    transactions/          # CRUD + filters/sorting
      TransactionsPage.tsx
    categories/            # Category manager
      CategoriesPage.tsx
    settings/              # Export, theme, currency
      SettingsPage.tsx
      exportUtil.ts
```

## Data Flow & Persistence

- The `AppProvider` holds global state: `transactions`, `categories`, and `preferences`.
- On load, it attempts to `loadState()` from IndexedDB, falling back to LocalStorage; otherwise seeds `sampleState`.
- On any change, `saveState()` writes to IndexedDB (with LocalStorage fallback). Theme class on `<html>` syncs to preferences.
- Components read/update via `useApp()` actions.

Sequence:
1. App mounts → load persisted state or samples
2. User performs actions → state updates in context
3. Side effect persists changes to IndexedDB/LocalStorage

## PWA

- Configured via `vite-plugin-pwa` in `vite.config.ts` with `registerType: 'autoUpdate'`.
- Add icons `pwa-192x192.png` and `pwa-512x512.png` to the public root for best results.

## Notes

- All values are stored in integer cents for precision.
- Charts use aggregated, memoized data transformations from `utils/money.ts`.
- This app is frontend-only; no backend or external storage required.
