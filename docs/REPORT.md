# Personal Finance Tracker – Project Report

Project: Personal Finance Tracker (PFT)
Author: [Your Name]
Institute: [Your Institute]
Course/Batch: [Course/Batch]
Date: [Month DD, YYYY]

---

## 1. Front Page
- Title: Personal Finance Tracker
- Subtitle: A local-first web app to manage income, expenses, and insights
- Author, Institute, Course, Date
- Recommended image: A clean dashboard screenshot of the app

> Place the image here (full-width) once captured:
> `docs/images/hero-dashboard.png`

---

## 2. Candidate Declaration
I, [Your Name], hereby declare that this project report titled “Personal Finance Tracker” is an original work carried out by me under the guidance of [Guide Name], and has not been submitted elsewhere for any award. The ideas, design decisions, implementation details, and analysis presented herein represent my own work, except where specific references are made and acknowledged. The project was conducted ethically and with academic integrity, adhering to the standards and expectations of [Your Institute].

I acknowledge that software development is inherently iterative and collaborative. While I received feedback and suggestions from mentors and peers, all final decisions, coding, documentation, and testing activities are my own responsibility and reflect my understanding of the subject matter and the problem domain of personal finance tracking applications.

Signature: _____________   Date: _____________

---

## 3. Acknowledgement
This project would not have reached its current shape without the sustained support and encouragement of several individuals and institutions. I would like to extend my heartfelt thanks to [Guide/Faculty] for their patient guidance, constructive critique, and timely feedback, which helped me refine both the user experience and the technical architecture. I am also grateful to the faculty members of [Department], whose lectures and coursework built my foundation in web technologies, human-computer interaction, and software engineering best practices.

I am thankful to my classmates and peers for participating in informal usability tests and for providing practical feedback on features such as category design, color choices, and the clarity of charts. Their insights led to meaningful improvements in accessibility, responsiveness, and layout. Finally, I appreciate the open-source community for providing robust tools—React, TypeScript, Tailwind CSS, Recharts, and Vite—that enabled a high-quality implementation in a relatively short time at zero licensing cost.

---

## 4. Training
### 4.1 Technologies Explored
- React and TypeScript: component-driven development, strong typing, and predictable state flows.
- Tailwind CSS: utility-first styling for rapid prototyping and consistent design tokens.
- Recharts: declarative charting to visualize time-series and categorical data responsively.
- Vite: modern dev server and build tool, fast HMR, optimal production builds.
- PWA basics: service worker, caching strategy, and manifest configuration.

### 4.2 Skills Acquired
- State management using React Context for global preferences, categories, and transactions.
- Local-first persistence patterns, primarily LocalStorage with potential IndexedDB extensions.
- UX for data-heavy interfaces: sorting, filtering, and visual affordances for quick scanning.
- Data visualization literacy: choosing appropriate charts and scale, formatting currency, and handling date aggregation.
- Build and deployment: environment configuration, bundling, tree-shaking, and asset optimization.

### 4.3 Learning Outcomes
The training phase allowed me to synthesize course knowledge into a single, coherent system. It improved my competence in writing clean, readable TypeScript, taught me to reason about performance and bundle sizes, and honed my judgment in making trade-offs between minimalism and feature richness. It also reinforced the importance of accessibility (contrast, keyboard navigation, semantic HTML) in real-world applications.

---

## 5. Certificate
This is to certify that [Your Name], [Roll/ID], has successfully completed the project titled “Personal Finance Tracker” under my supervision. The project demonstrates proficiency in modern front-end development practices, from requirements analysis and UI design to implementation, testing, and documentation. The student has shown diligence and the ability to apply theoretical concepts in a practical setting.

Supervisor: __________________  Date: _____________

---

## 6. Abstract
Personal Finance Tracker is a local-first, single-page web application that enables users to track income and expenses, categorize transactions, visualize spending patterns, and export data for archival or external analysis. The application focuses on privacy and simplicity: data never leaves the user’s device unless explicitly exported. The user interface is intentionally minimal yet expressive, with dashboards that highlight monthly trends and category-wise distributions.

The core technical contribution is a maintainable, type-safe frontend architecture that uses React and TypeScript to structure components and a context provider to manage state. Tailwind CSS supports a consistent design language, while Recharts provides responsive, accessible visualizations. The app is bundled with Vite and supports PWA features, enabling fast loading and offline capabilities. The report details the design rationale, implementation specifics, and evaluation through manual testing, and it concludes with a discussion of limitations and future enhancements.

---

## 7. Table of Contents
- 1. Front Page
- 2. Candidate Declaration
- 3. Acknowledgement
- 4. Training
- 5. Certificate
- 6. Abstract
- 7. Table of Contents
- 8. Overview
- 9. Objective
- 10. Requirements and Analysis
- 11. Software Requirements
- 12. Hardware Requirements
- 13. Software Features
- 14. Syntax
- 15. Justification of Technology Selection
- 16. Data Flow Diagram
- 17. System Design
- 18. Data Dictionary
- 19. Code and Testing
- 20. Implementation
- 21. Result and Discussion
- 22. Future Scope
- 23. Conclusion
- 24. Reference

---

## 8. Overview
### 8.1 Problem Context
Financial literacy and discipline often hinge on visibility—knowing where money comes from and where it goes. Many solutions exist, but they typically require user accounts, cloud storage, and complex feature sets. This project’s hypothesis is that a privacy-first, local-only, and highly usable tracker can serve a broad set of users who prefer simplicity and control over their data.

### 8.2 Solution Scope
The Personal Finance Tracker centers on four pillars: quick data entry, meaningful categorization, intuitive analysis via charts, and frictionless export. The app balances flexibility with guardrails; for instance, income transactions are not forced into expense categories, yet the interface encourages classification of expenses for better insights.

### 8.3 Audience and Use Cases
- Students monitoring monthly stipends and spending.
- Early professionals budgeting salaries and recurring expenses.
- Households organizing shared expense categories.
- Individuals seeking lightweight privacy without cloud services.

### 8.4 Key Design Principles
- Local-first: data remains on-device by default.
- Predictable performance: responsive interactions on low-end hardware.
- Accessibility: good contrast, clear affordances, keyboard navigation.
- Maintainability: typed code, modular structure, and cohesive styling.

---

## 9. Objective
### 9.1 Primary Objectives
- Offer a fast, private, and intuitive interface for recording transactions.
- Provide category-wise insights and temporal trends.
- Enable export in both CSV and JSON formats without vendor lock-in.

### 9.2 Secondary Objectives
- Support dark and light themes to reduce eye strain.
- Maintain low bundle sizes and high lighthouse scores.
- Provide PWA capabilities for installability and offline-first behavior.

### 9.3 Success Criteria
- Users can add transactions in under 10 seconds on average.
- Charts update immediately upon data changes.
- Data persists across sessions reliably and predictably.

---

## 10. Requirements and Analysis
### 10.1 Functional Requirements
1. Transactions: create, read, update, delete (CRUD) operations; fields include type, amount, category (optional for income), note, date.
2. Categories: CRUD with name, color, and icon; reusability across transactions.
3. Dashboard: three visualizations—income vs expense over time, category-wise expenses, and the current month’s distribution.
4. Filters and Search: search notes, filter by type/category, and sort by date/amount.
5. Preferences: toggle dark mode; select currency for display and formatting.
6. Data Operations: export to CSV/JSON; reset to sample dataset.

### 10.2 Non-Functional Requirements
- Performance: sub-100ms interaction response; fast cold start on mid-range devices.
- Reliability: deterministic data persistence; graceful handling of empty states.
- Usability: coherent information architecture; minimal cognitive load; clear error prevention.
- Security & Privacy: no network persistence; explicit export only.
- Portability: runs on any modern browser without plugins.

### 10.3 Constraints and Assumptions
- No backend services are used; all logic is client-side.
- Storage is limited by browser quotas; data volumes are expected to be modest.
- Charts are designed for readability over absolute precision (compact labels, tooltips for details).

---

## 11. Software Requirements
### 11.1 Runtime and Tooling
- Modern browser: Chrome/Edge/Firefox/Safari (latest)
- Node.js 18+ and npm for development
- OS agnostic: Windows, macOS, Linux

### 11.2 Libraries and Frameworks
- React + TypeScript for robust component architecture
- Tailwind CSS for a scalable, utility-first design system
- Recharts for responsive charting primitives
- Vite for fast development and optimized builds
- PWA plugin for service worker and manifest management

### 11.3 Quality and Observability
- TypeScript for type safety and maintainability
- Linting and formatting (configurable) for consistent code style

---

## 12. Hardware Requirements
### 12.1 Development Environment
- CPU: Multi-core processor
- RAM: 8 GB recommended (4 GB minimum)
- Disk: ~200–500 MB for node_modules and build artifacts

### 12.2 Execution Environment
- Mobile and desktop hardware supported via responsive layouts
- No GPU required; charts render efficiently on CPU

---

## 13. Software Features
### 13.1 Categories Management
- Create categories with human-readable names, distinct colors, and icons.
- Edit and delete with safeguards to prevent unintended loss of meaning in historical data.

### 13.2 Transactions Ledger
- Tabular view with sortable columns and filters.
- Modal form for adding and editing transactions with clear validations.
- Support for uncategorized income; optional notes for context.

### 13.3 Dashboards and Charts
- Income vs Expense: monthly aggregation line chart, capturing trend direction and seasonality.
- Category-wise: bar chart summing expenses per category to reveal spending patterns.
- Monthly Pie: current month’s breakdown by category, promoting budgeting awareness.

### 13.4 Preferences and Data
- Dark mode toggle and currency selection.
- Export to CSV/JSON for interoperability.
- Reset to sample data for demonstrations and testing.

---

## 14. Syntax
### 14.1 TypeScript Patterns
- Explicit typing of component props and context interfaces.
- Use of discriminated unions for transaction types (income/expense).
- Utility functions with clear input/output contracts.

### 14.2 React Conventions
- Functional components and hooks (useState, useMemo, custom hooks where appropriate).
- Context provider for global state; `useApp()` hook as a single entry point for consumers.

### 14.3 Tailwind Utilities
- Composable classes for spacing, color, typography, and state styles.
- Reusable design tokens via utility classes like `btn-primary`, `card`, `input`.

---

## 15. Justification of Selection of Technology
### 15.1 React + TypeScript
React’s component model aligns with the modular nature of the UI, enabling separation of concerns and reusability. TypeScript enforces contracts and reduces runtime errors, especially valuable in a data-sensitive domain like finance.

### 15.2 Tailwind CSS
Utility-first styling accelerates development, enforces consistency, and avoids CSS cascade pitfalls. Design tokens are applied uniformly, with dark mode handled predictably.

### 15.3 Recharts
Recharts provides responsive, accessible charts with a shallow learning curve. It integrates smoothly with the React render cycle and facilitates clear tooltips and legends.

### 15.4 Vite and PWA
Vite’s dev server delivers fast iteration, while its production build ensures optimal bundle sizes. PWA features enable installable, offline-friendly experiences with minimal configuration overhead.

### 15.5 Local-First Persistence
LocalStorage (and optional IndexedDB) ensures privacy. Users retain control and avoid sync conflicts, while still enabling export for portability.

---

## 16. Data Flow Diagram
High-level flow:
1. User interactions (UI) -> actions (add/update/delete)
2. App context (`AppProvider`) updates in-memory state
3. Persistence layer writes to LocalStorage/IndexedDB
4. Derived data (formatting, grouping) feeds charts and tables

> Insert DFD image after creation:
> `docs/images/dfd.png`

### 16.1 Narrative Explanation
When a user creates or modifies a transaction, an action is dispatched via the context provider. The provider updates the state in memory, then persists it to LocalStorage. Selectors and utility functions recompute aggregates—monthly totals and category sums—driving chart updates. This loop is synchronous and predictable, keeping mental models simple for both developers and users.

---

## 17. System Design
### 17.1 Architecture Overview
- SPA architecture hosted entirely on the client
- UI in `src/components/*`
- Shared logic in `src/modules/*` (state, utils, settings helpers)
- Routing handled via local `route` state instead of a router library

### 17.2 Modules
- `src/components/*`: pages and visual components
- `src/modules/state/*`: types, storage adapters, and `AppProvider`
- `src/modules/utils/money.ts`: currency formatting, aggregation, and date utilities
- `src/modules/settings/exportUtil.ts`: file download helper for exports

### 17.3 Theming and Accessibility
- Dark mode preference stored in state and applied via utility classes
- Focus states, adequate contrast, and semantic markup

> Insert architecture diagram:
> `docs/images/architecture.png`

---

## 18. Data Dictionary
### 18.1 Entities
- Transaction
  - `id: string` – unique id
  - `type: 'income' | 'expense'`
  - `amountCents: number` – integer cents
  - `categoryId?: string`
  - `note?: string`
  - `dateIso: string` – ISO date
- Category
  - `id: string`
  - `name: string`
  - `color: string` – hex color
  - `icon: string` – icon id
- Preferences
  - `darkMode: boolean`
  - `currency: string`

### 18.2 Invariants and Constraints
- `amountCents` must be non-negative
- Income transactions ignore `categoryId` for clarity
- `dateIso` normalized to UTC date boundaries for consistency

---

## 19. Code and Testing
### 19.1 Code Organization
- Components emphasize readability and single responsibility
- State logic centralized in provider to avoid prop drilling

### 19.2 Testing Strategy
- Manual exploratory testing for flows: add/edit/delete transactions, category CRUD, filtering and sorting
- UI tests checklist for responsiveness and dark mode
- Negative cases: empty states, invalid amounts, malformed dates

### 19.3 Sample Test Cases
- Add an expense with note and category; verify table and charts update
- Switch currency and confirm formatting changes across UI
- Export CSV and verify delimiter/escaping for notes with commas

---

## 20. Implementation
### 20.1 State Lifecycle
- Initialize from storage or seed with `sampleData`
- Mutations write back to storage
- Aggregates computed on demand for charts

### 20.2 Landing Page Gating
- Mock login; any input unlocks the app via `localStorage` flag
- No sensitive data captured; purely a UI gate

### 20.3 Performance and Bundling
- Vite code-splitting available if needed for growth
- Recharts kept lean with limited chart types and props

---

## 21. Result and Discussion
### 21.1 Outcomes
- Achieved a private, performant personal finance application
- Delivered clear insights via minimal yet effective visualizations

### 21.2 Limitations
- No multi-user or sync functionality by design
- No automated test harness in this iteration
- Relies on browser storage quotas

### 21.3 User Feedback (Informal)
- Users appreciated simplicity and speed
- Dark mode and currency settings increased comfort and relevance

---

## 22. Future Scope
### 22.1 Functional Enhancements
- Real authentication and optional cloud sync
- Recurring transactions and reminders
- Budgets per category with threshold alerts
- Bank statement importers for common CSV formats

### 22.2 Technical Enhancements
- IndexedDB for larger datasets
- Comprehensive unit and E2E test suites
- Internationalization for labels and currency formats

---

## 23. Conclusion
Personal Finance Tracker demonstrates that a local-first SPA can provide robust finance tracking with excellent UX, strong privacy, and low complexity. By focusing on a thoughtful data model, clear UI, and predictable state flows, the app forms a solid foundation for future extensions. The project attests to the effectiveness of modern web tooling in rapidly delivering high-quality user experiences.

---

## 24. Reference
- React documentation – `https://react.dev`
- TypeScript – `https://www.typescriptlang.org/`
- Tailwind CSS – `https://tailwindcss.com/`
- Recharts – `https://recharts.org/`
- Vite – `https://vitejs.dev/`
- Progressive Web Apps – `https://web.dev/progressive-web-apps/`
- MDN Web Docs (LocalStorage/IndexedDB) – `https://developer.mozilla.org/`

---

## Image Placement Guidance
- Front Page: full-width dashboard screenshot – `docs/images/hero-dashboard.png`
- Overview: landing page screenshot – `docs/images/landing.png`
- DFD/System Design: export diagrams – `docs/images/dfd.png`, `docs/images/architecture.png`
- Features: transactions table and categories grid – `docs/images/transactions.png`, `docs/images/categories.png`

Tips for selecting images:
- Use real screenshots from the dev server in dark and light modes
- Prefer balanced, uncluttered views; hide personal data if any
- Ensure high resolution (≥ 1440px wide) for print clarity
