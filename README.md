# RupeeShift — USD/INR Impact Analysis

<div align="center">
  <img src="./public/rupee-shift-icon-filled.svg" alt="RupeeShift Logo" width="80" height="80">

  <p><em>The dollar moved. What did that silently do to your money?</em></p>

  [![Live Demo](https://img.shields.io/badge/Live%20Demo-rupee--shift.vercel.app-C8702A?style=for-the-badge&logo=vercel)](https://rupee-shift.vercel.app)
  [![License: MIT](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
  [![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
  [![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vite.dev)
</div>

---

## What is RupeeShift?

RupeeShift is an interactive financial analysis tool that makes the impact of USD/INR exchange rate movements **visible, understandable, and actionable**. The Indian rupee has depreciated significantly against the dollar over successive financial years — most people feel this intuitively but cannot quantify it.

RupeeShift answers that question across four real-world scenarios, using live exchange rate data from the European Central Bank, beautiful charts, and plain-English insights.

---

## ✨ Features

### 📊 **Four Financial Scenarios**
- **Indian Subsidiary** — See how much USD your company actually saved (or spent extra) on your INR payroll when the rupee weakened
- **IT Exporter** — Understand the FX-driven INR revenue uplift on your USD contracts and what that means for salary hikes
- **Freelancer** — Discover the "silent raise" your USD invoices gave you and plan smarter rate card renewals
- **INR Employee** — Quantify the real-terms erosion of your salary against the dollar and find your break-even increment

### 📅 **Financial Year Selector**
- Covers FY 2021–22 through FY 2025–26
- Live USD/INR rate data via the Frankfurter API (ECB), with session-cached fallback rates
- Month-by-month rate breakdown for every FY

### 📈 **Interactive Charts**
- Monthly USD/INR rate line chart
- Month-by-month impact bar chart
- Increment/renewal scenario bar chart with break-even marker

### 🧮 **Increment & Renewal Analysis**
- For each scenario, see exactly what different % hikes or contract renewals mean in real USD/INR terms
- Break-even percentage clearly highlighted — the minimum needed to hold your position

### 📤 **Export**
- Download full scenario analysis as `.xlsx` (Excel) or `.csv`
- Includes monthly breakdown, summary, and increment table

### 🎨 **Premium, Accessible UI**
- Warm editorial design inspired by premium financial tools
- Fully responsive — works on mobile (375px) through large desktop
- Framer Motion animations with `prefers-reduced-motion` support
- Keyboard navigable, semantic HTML, ARIA labels throughout

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- A modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nishadkindre/rupee-shift.git
   cd rupee-shift
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Charts | Recharts |
| Animations | Framer Motion |
| Excel Export | SheetJS (`xlsx`) |
| Icons | Lucide React |
| Exchange Rate API | Frankfurter (ECB data, no auth required) |
| State Management | React Context + `useReducer` |
| Fonts | DM Serif Display, DM Sans, DM Mono (Google Fonts) |

---

## 📁 Project Structure

```
rupee-shift/
├── public/                  # Static assets (rupee-shift-icon-filled, etc.)
├── src/
│   ├── components/
│   │   ├── charts/          # Recharts-based chart components
│   │   ├── layout/          # Navbar, Footer, FYSelectorBar, InsightStrip
│   │   ├── logo/            # RupeeShiftLogo SVG component
│   │   ├── modals/          # About and Methodology modals
│   │   ├── scenarios/       # Scenario panels (Subsidiary, ITExporter, Freelancer, INREmployee)
│   │   └── ui/              # MetricCard, SliderControl, SectionCard, StatusTag, etc.
│   ├── context/             # AppContext (global state) + AnimationContext
│   ├── data/                # fyConfig.js — FY definitions and fallback rates
│   ├── docs/                # Product requirements document
│   ├── hooks/               # useExchangeRates, useCountUp
│   ├── sections/            # HeroSection, ScenarioSection (page-level sections)
│   └── utils/               # calculations, formatters, rateHelpers, exportExcel, animations
├── index.html
├── tailwind.config.js
└── vite.config.js
```

---

## 🎯 Usage

1. **Select a Financial Year** from the top selector bar (FY 2021–22 through FY 2025–26)
2. **Pick your scenario** — Subsidiary, IT Exporter, Freelancer, or INR Employee
3. **Adjust the sliders** — enter your salary, revenue, or contract value
4. **Read the insight** — the banner at the top of each scenario explains what happened in plain English
5. **Explore the charts and tables** — month-by-month breakdown with cumulative impact
6. **Use the increment analyser** — find your break-even hike percentage
7. **Export** your full analysis to Excel or CSV

---

## 🌐 Live Demo

**[rupee-shift.vercel.app](https://rupee-shift.vercel.app)**

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to get started.

---

## 📄 License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) for details.

---

## 📬 Contact

Built by [Nishad Kindre](mailto:nishadkindre@gmail.com)
