# Scenario Reference

## Table of Contents

1. [Overview](#1-overview)
2. [Scenario 1 — Indian Subsidiary](#2-scenario-1--indian-subsidiary)
3. [Scenario 2 — IT Exporter](#3-scenario-2--it-exporter)
4. [Scenario 3 — Freelancer](#4-scenario-3--freelancer)
5. [Scenario 4 — INR Employee](#5-scenario-4--inr-employee)
6. [Shared Behaviour](#6-shared-behaviour)
7. [Adding a New Scenario](#7-adding-a-new-scenario)

---

## 1. Overview

RupeeShift analyses the USD/INR exchange rate impact across four distinct economic perspectives. Each scenario has a different stakeholder, a different direction of financial impact, and its own set of user-adjustable parameters.

| Scenario | Stakeholder | Impact Direction | Badge |
|---|---|---|---|
| Indian Subsidiary | Foreign MNC with Indian operations | Rupee weakening = **parent saves USD** | Saves in USD |
| IT Exporter | Indian IT/SaaS company with USD clients | Rupee weakening = **revenue boost in INR** | Revenue uplift |
| Freelancer | Independent professional billing in USD | Rupee weakening = **silent INR raise** | Silent raise |
| INR Employee | Salaried employee at a USD-earning company | Rupee weakening = **USD-equivalent erosion** | USD erosion |

---

## 2. Scenario 1 — Indian Subsidiary

### Business Context

A multinational corporation (MNC) maintains an Indian subsidiary that employs staff paid in INR. The parent company funds operations in USD — the subsidiary converts USD to INR to meet payroll. When the Indian Rupee weakens, the subsidiary needs fewer USD to cover the same INR payroll.

This scenario answers: *"How many dollars did our India operations actually cost us this year vs. what we budgeted at the April start rate?"*

### User Parameters

| Parameter | Default | Description |
|---|---|---|
| Annual INR Payroll | ₹4,02,32,000 (~₹4 Cr) | Total gross INR payroll for the FY |
| Next FY Rate | From `fyConfig.nextYearStartRate` | Expected USD/INR rate at start of next FY; used in increment analysis |
| Proposed Increment | 10% | Salary hike % to evaluate in the increment table |

### Key Metrics Displayed

| Metric | Colour | Meaning |
|---|---|---|
| Total USD Cost (Actual) | Neutral | USD actually spent on payroll at monthly average rates |
| Baseline USD Cost | Neutral | USD that would have been spent at the April start rate throughout |
| Total USD Saved | Gain (green) | USD saved due to rupee weakening |
| FX Appreciation | Gain or Loss | % movement of USD/INR over the FY |
| Break-Even Hike | Amber | % increment at which next year's USD cost equals this year's baseline |

### Insight Logic

- If USD saved > 0 → *"The rupee's depreciation reduced your dollar payroll cost by $X, the equivalent of ₹Y."*
- If USD saved < 0 → *"The rupee's appreciation increased your dollar payroll cost by $X."*

### Increment Analysis

The increment table shows, for hike percentages from 0–30%:
- New Annual INR after increment
- New Annual USD cost at `nextFYRate`
- USD difference vs. this FY's baseline
- Verdict: `savings` / `breakeven` / `costlier`

The break-even percentage is automatically inserted as a table row and highlighted.

### Files

| File | Purpose |
|---|---|
| `src/components/scenarios/SubsidiaryScenario.jsx` | Full UI component |
| `src/utils/calculations.js` → `calcSubsidiary` | Monthly breakdown |
| `src/utils/calculations.js` → `calcSubsidiaryIncrementTable` | Increment table |

---

## 3. Scenario 2 — IT Exporter

### Business Context

An Indian IT services or SaaS company invoices foreign clients in USD. USD remittances are converted to INR upon receipt. When the rupee weakens, each dollar of revenue converts to more rupees. The company's INR revenue grows without any change to its billing rates.

This scenario answers two questions:
1. *"How much extra INR did we earn this year purely from the exchange rate?"*
2. *"Can we afford to give salary hikes this year, and by how much, given this FX windfall?"*

### User Parameters

| Parameter | Default | Description |
|---|---|---|
| Annual USD Revenue | $1,000,000 | Total USD billed/received during the FY |
| Annual INR Employee Cost | ₹4,02,32,000 | Total INR payroll cost base; used in hike affordability calculation |
| Next FY Rate | From `fyConfig.nextYearStartRate` | Used in contract renewal table |
| Proposed Hike | 12% | Salary hike % to evaluate in the affordability table |

### Key Metrics Displayed

| Metric | Colour | Meaning |
|---|---|---|
| Actual INR Revenue | Info (blue) | INR realised at monthly average rates |
| Baseline INR Revenue | Neutral | INR that would have been realised at April start rate |
| FX Gain in INR | Gain (green) | Extra INR earned due to rupee weakening |
| FX Gain % | Gain (green) | FX gain as % of baseline revenue |
| Hike Funded by FX | Amber | % of proposed hike cost covered by FX gain |

### Hike Affordability Table

For hike percentages from 0–30%, shows:
- Hike cost in INR
- % of hike cost funded by FX gain
- Net margin impact (FX gain minus hike cost)
- Verdict: `gain` / `breakeven` / `loss`

A positive net margin impact means the company can give the hike and still improve margins.

### Contract Renewal Table

Shows what a USD contract renewal at ±10/5/0/5/10/15/20% of the current value means in INR at the next FY rate. Demonstrates that a USD rate reduction can still yield INR growth if the rupee continues to weaken.

### Files

| File | Purpose |
|---|---|
| `src/components/scenarios/ITExporterScenario.jsx` | Full UI component |
| `src/utils/calculations.js` → `calcITExporter` | Monthly breakdown and FX gain |
| `src/utils/calculations.js` → `calcITExporterHikeTable` | Hike affordability table |
| `src/utils/calculations.js` → `calcContractRenewalTable` | Contract renewal table |

---

## 4. Scenario 3 — Freelancer

### Business Context

An independent professional bills clients in USD on a fixed monthly retainer. Their INR bank account receives the converted amount each month. When the rupee weakens, they receive more INR per dollar — a "silent raise" that requires no negotiation.

This scenario answers: *"How much more INR did I earn this year compared to what I expected at the start of the year? And what should I charge to protect my income next year?"*

### User Parameters

| Parameter | Default | Description |
|---|---|---|
| Monthly USD Retainer | $5,000 | Fixed monthly USD invoice / retainer amount |
| Next FY Rate | From `fyConfig.nextYearStartRate` | Used in rate card renewal analysis |
| Rate Increase % | 10% | Proposed USD rate increase for renewal analysis |

### Key Metrics Displayed

| Metric | Colour | Meaning |
|---|---|---|
| Actual Annual INR | Gain (green) | Total INR received at monthly average rates |
| Baseline Annual INR | Neutral | INR that would have been received at April start rate |
| Annual FX Uplift | Gain (green) | Extra INR earned due to rupee weakening |
| Hold & Convert INR | Info (blue) | Hypothetical INR if all USD were held and converted at FY-end rate |
| FY Appreciation % | Gain or Loss | Total FX movement over the year |

### Rate Card Renewal Analysis

Shows what a proposed USD rate increase means for annual INR income at the next FY rate:
- New monthly and annual USD
- New annual INR at next FY rate
- Effective INR growth vs. this year's baseline
- Reversion loss — how much annual INR income depends on the exchange rate holding

This helps the freelancer understand how much of their planned income growth is real (from rate increase) vs. exchange-rate dependent.

### Files

| File | Purpose |
|---|---|
| `src/components/scenarios/FreelancerScenario.jsx` | Full UI component |
| `src/utils/calculations.js` → `calcFreelancer` | Monthly breakdown and uplift |
| `src/utils/calculations.js` → `calcFreelancerRateCardTable` | Rate card renewal table |

---

## 5. Scenario 4 — INR Employee

### Business Context

A salaried employee works at a company that earns significant USD revenue (an IT services firm, a BPO, or an export-oriented business). The employee is paid in INR. When the rupee weakens, their employer's USD revenue converts to more INR — but the employee's salary stays the same. In dollar terms, the employee is now "cheaper to employ" than they were at the start of the year. Their real value has quietly eroded.

This scenario answers: *"By how much has my USD-equivalent salary declined this year? What increment do I need just to get back to where I was?"*

### User Parameters

| Parameter | Default | Description |
|---|---|---|
| Monthly Gross Salary | ₹85,600 (~₹10.3 LPA) | Current monthly INR take-home / gross salary |
| Next FY Rate | From `fyConfig.nextYearStartRate` | Used in increment table |
| Proposed Increment | 12% | Increment % to evaluate |

### Key Metrics Displayed

| Metric | Colour | Meaning |
|---|---|---|
| Annual USD Equivalent (FY Start) | Info (blue) | Annual salary in USD at April start rate |
| Annual USD Equivalent (FY End) | Loss (red) | Annual salary in USD at March end rate |
| USD Erosion | Loss (red) | Dollar-terms salary decline |
| Erosion % | Loss (red) | Erosion as % of baseline USD salary |
| Break-Even Hike | Amber | % increment needed to restore USD-equivalent salary to baseline |

### Increment Table

For increments from 0–30%, shows:
- New annual INR salary after increment
- New annual USD equivalent at `nextFYRate`
- USD difference vs. FY start baseline
- Verdict: `gain` (exceeds baseline) / `breakeven` / `loss` (below baseline)

The break-even row is auto-inserted and highlighted. Any increment below break-even is a real-terms pay cut in USD terms.

### Files

| File | Purpose |
|---|---|
| `src/components/scenarios/INREmployeeScenario.jsx` | Full UI component |
| `src/utils/calculations.js` → `calcINREmployee` | Monthly USD erosion tracking |
| `src/utils/calculations.js` → `calcINREmployeeIncrementTable` | Increment table |

---

## 6. Shared Behaviour

All four scenario components share these patterns:

### Data Dependency

All scenario components depend on `ratesData.fyStartRate` being non-null. While rates are loading, a `<LoadingSpinner />` is displayed. If rates are unavailable, components render with fallback data.

### Responsive Layout

- **Desktop (md+):** Metric cards in a 3–4 column grid; charts and tables side by side or full width
- **Mobile (<md):** Metric cards stack vertically; wide tables are hidden (`hidden md:block`) and replaced with a mobile-friendly card summary

### Export

Each scenario has an export button that generates:
- **Excel (.xlsx):** 3–4 sheets — Summary, Monthly Breakdown, Increment/Renewal Table, Exchange Rates
- **CSV:** Monthly breakdown table only (simple format for spreadsheet import)

Export filenames follow the pattern: `RupeeShift_{ScenarioName}_{FYLabel}.xlsx`

### Next FY Rate Override

Each scenario shows a "Next FY Rate" field that defaults to `fyConfig.nextYearStartRate`. Users can override this to model custom projections. The override is stored in that scenario's params (`nextFYRate: null` = use config default, `nextFYRate: number` = use override).

### Insight Banner

Each scenario opens with an `<InsightBanner />` that states the key finding in one plain-English sentence before any chart or table. The insight is computed from the calculation results — it adapts dynamically as the user adjusts sliders.

---

## 7. Adding a New Scenario

See [development-guide.md — Adding a New Scenario](./development-guide.md#6-adding-a-new-scenario) for step-by-step instructions.

Key checklist:
- [ ] Pure calculation function(s) added to `calculations.js`
- [ ] Params shape added to `AppContext` initial state
- [ ] Reducer case added for `UPDATE_*_PARAMS`
- [ ] Scenario UI component created in `src/components/scenarios/`
- [ ] Scenario registered in `ScenarioSection.jsx` (`SCENARIO_COMPONENTS` map)
- [ ] Tab added to `ScenarioTabs.jsx` (`SCENARIOS` array)
- [ ] Export handler added in `App.jsx`
- [ ] Scenario documented in this file
