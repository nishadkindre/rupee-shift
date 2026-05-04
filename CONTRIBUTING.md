# Contributing to RupeeShift

Thank you for your interest in contributing to RupeeShift! We welcome all contributions — bug fixes, new features, documentation improvements, new financial year data, or design suggestions.

## How to Contribute

1. **Fork the Repository**
   - Click the "Fork" button at the top of the repository page to create your own copy.

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/nishadkindre/rupee-shift.git
   cd rupee-shift
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Start the Dev Server**
   ```bash
   npm run dev
   ```

6. **Make Your Changes**
   - Follow the code style and design guidelines described below.
   - Write clear, concise commit messages.

7. **Lint Your Code**
   ```bash
   npm run lint
   ```

8. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

9. **Open a Pull Request**
   - Go to the original repository and open a pull request from your branch.
   - Provide a clear description of what you changed and why.

---

## Code Style & Guidelines

### General
- All UI must be built using **Tailwind CSS classes only** — no inline styles except for dynamic CSS custom properties or runtime-computed chart colours
- All numerical data displayed to users must use `font-mono`
- All animations must use **Framer Motion** — do not add CSS `transition` or `animation` properties for things Framer Motion can handle
- Components must be responsive — minimum supported width is 375px
- Use semantic HTML and add `aria-label` to all icon-only buttons

### React
- Use **functional components and hooks** throughout — no class components
- State management uses **React Context + useReducer** — do not introduce Redux or other state libraries
- Exchange rate fetches must be cached in `sessionStorage` — do not bypass the cache layer in `useExchangeRates.js`

### Styling
- This project uses **Tailwind CSS v4** with `@tailwindcss/vite`
- Custom design tokens (colours, fonts, shadows) are defined in `src/index.css` inside `@theme {}` — this is how v4 generates utility classes
- Do **not** add custom colours only to `tailwind.config.js` in v4 — they will not generate utility classes

### File Conventions
- New scenario components go in `src/components/scenarios/`
- New chart components go in `src/components/charts/`
- Calculation logic belongs in `src/utils/calculations.js`
- Financial year definitions and fallback rates belong in `src/data/fyConfig.js`

---

## Adding a New Financial Year

1. Open `src/data/fyConfig.js`
2. Add a new entry following the existing `FY****` pattern — include `startDate`, `endDate`, `nextYearStartRate`, and `fallbackRates` for all 12 months
3. The `fallbackRates` values are monthly averages used when the Frankfurter API is unavailable — source these from RBI or ECB historical data

---

## Reporting Issues

- Use the [GitHub Issues](https://github.com/nishadkindre/rupee-shift/issues) tab to report bugs or request features
- For bugs, include: steps to reproduce, expected behaviour, actual behaviour, browser/OS, and a screenshot if relevant
- For feature requests, describe the scenario or use case you want to address

---

## Community Standards

- Be respectful and inclusive
- Follow the [Code of Conduct](./CODE_OF_CONDUCT.md)

---

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
