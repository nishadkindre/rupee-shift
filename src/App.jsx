import { useState, useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppContext } from './context/AppContext';
import { FY_CONFIG } from './data/fyConfig';
import {
  calcSubsidiary,
  calcSubsidiaryIncrementTable,
  calcITExporter,
  calcITExporterHikeTable,
  calcContractRenewalTable,
  calcFreelancer,
  calcFreelancerRateCardTable,
  calcINREmployee,
  calcINREmployeeIncrementTable
} from './utils/calculations';
import { exportScenarioToExcel, exportScenarioToCSV } from './utils/exportExcel';
import { formatINR, formatUSD, formatRate, formatPct, monthKeyToLabel } from './utils/formatters';
import Navbar from './components/layout/Navbar';
import FYSelectorBar from './components/layout/FYSelectorBar';
import InsightStrip from './components/layout/InsightStrip';
import Footer from './components/layout/Footer';
import HeroSection from './sections/HeroSection';
import ScenarioSection from './sections/ScenarioSection';
import MethodologyModal from './components/modals/MethodologyModal';
import AboutModal from './components/modals/AboutModal';
import ProjectModal from './components/modals/ProjectModal';

function App() {
  const [showMethodology, setShowMethodology] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showProject, setShowProject] = useState(false);
  const { state } = useAppContext();
  const { activeScenario, selectedFY, ratesData, subsidiaryParams, itExporterParams, freelancerParams, inrEmployeeParams } = state;
  const fyConfig = FY_CONFIG[selectedFY];
  const fyLabel = fyConfig?.label || selectedFY;

  const handleExportExcel = () => {
    const { monthlyAverages, fyStartRate, fyEndRate } = ratesData;
    if (!fyStartRate) return;
    const nextFYRate = fyConfig?.nextYearStartRate || 90;

    let scenarioData = null;
    let scenarioName = '';

    if (activeScenario === 'subsidiary') {
      scenarioName = 'Indian Subsidiary';
      const calc = calcSubsidiary({
        ...subsidiaryParams,
        monthlyAverages,
        fyStartRate,
        fyEndRate,
        nextFYRate: subsidiaryParams.nextFYRate ?? nextFYRate,
        fyConfig
      });
      const table = calcSubsidiaryIncrementTable({
        annualINR: subsidiaryParams.annualINR,
        nextFYRate: subsidiaryParams.nextFYRate ?? nextFYRate,
        fyStartRate,
        breakEvenPct: calc.breakEvenPct
      });
      scenarioData = {
        summaryRows: [
          ['Annual INR Payroll', formatINR(subsidiaryParams.annualINR, { compact: true })],
          ['Total USD Cost (Actual)', formatUSD(calc.totalActualUSD, { compact: true })],
          ['Baseline USD Cost', formatUSD(calc.totalBaselineUSD, { compact: true })],
          ['Total USD Saved', formatUSD(calc.totalUSDSaved, { compact: true })],
          ['FX Appreciation', formatPct(calc.fyAppreciationPct, { showSign: true })]
        ],
        monthlyHeaders: ['Month', 'Rate (₹/$)', 'INR Payroll', 'USD Cost', 'Baseline USD', 'USD Saved', 'Cumulative USD'],
        monthlyBreakdown: calc.monthlyData.map(r => [
          monthKeyToLabel(r.monthKey),
          r.rate.toFixed(4),
          r.monthINR,
          r.monthlyUSD.toFixed(2),
          r.baselineUSD.toFixed(2),
          r.saving.toFixed(2),
          r.cumulativeUSD.toFixed(2)
        ]),
        incrementHeaders: ['Increment %', 'New Annual INR', 'New Annual USD', 'USD Diff', 'USD Diff %', 'Verdict'],
        incrementRows: table.map(r => [r.pct, r.newAnnualINR.toFixed(0), r.newAnnualUSD.toFixed(2), r.usdDiff.toFixed(2), r.usdDiffPct.toFixed(2), r.verdict]),
        exchangeRates: monthlyAverages
      };
    } else if (activeScenario === 'itExporter') {
      scenarioName = 'IT Exporter';
      const calc = calcITExporter({
        ...itExporterParams,
        monthlyAverages,
        fyStartRate,
        fyEndRate,
        nextFYRate: itExporterParams.nextFYRate ?? nextFYRate,
        fyConfig
      });
      const hike = calcITExporterHikeTable({
        annualINRCost: itExporterParams.annualINRCost,
        fxGainINR: calc.fxGainINR
      });
      const renewal = calcContractRenewalTable({
        annualUSD: itExporterParams.annualUSD,
        fyStartRate,
        nextFYRate: itExporterParams.nextFYRate ?? nextFYRate,
        baselineAnnualINR: calc.baselineAnnualINR
      });
      scenarioData = {
        summaryRows: [
          ['Annual USD Revenue', formatUSD(itExporterParams.annualUSD, { compact: true })],
          ['Actual INR Revenue', formatINR(calc.actualAnnualINR, { compact: true })],
          ['Baseline INR', formatINR(calc.baselineAnnualINR, { compact: true })],
          ['FX Gain (INR)', formatINR(calc.fxGainINR, { compact: true })],
          ['FX Gain %', formatPct(calc.fxGainPct, { showSign: true })]
        ],
        monthlyHeaders: ['Month', 'Rate (₹/$)', 'USD Revenue', 'INR Realised', 'Baseline INR', 'FX Gain', 'Cumulative Gain'],
        monthlyBreakdown: calc.monthlyData.map(r => [
          monthKeyToLabel(r.monthKey),
          r.rate.toFixed(4),
          r.monthlyUSD.toFixed(2),
          r.inrRealised.toFixed(0),
          r.baselineINR.toFixed(0),
          r.fxGain.toFixed(0),
          r.cumulativeGain.toFixed(0)
        ]),
        incrementHeaders: ['Hike %', 'Hike Cost INR', 'FX Funded %', 'Net Margin', 'Verdict'],
        incrementRows: hike.map(r => [r.pct, r.hikeCostINR.toFixed(0), r.fxFundedPortion.toFixed(1), r.netMarginImpact.toFixed(0), r.verdict]),
        exchangeRates: monthlyAverages
      };
    } else if (activeScenario === 'freelancer') {
      scenarioName = 'Freelancer';
      const calc = calcFreelancer({
        monthlyUSD: freelancerParams.monthlyUSD,
        monthlyAverages,
        fyStartRate,
        fyEndRate,
        fyConfig
      });
      const rateTable = calcFreelancerRateCardTable({
        monthlyUSD: freelancerParams.monthlyUSD,
        fyStartRate,
        nextFYRate: freelancerParams.nextFYRate ?? nextFYRate
      });
      scenarioData = {
        summaryRows: [
          ['Monthly USD Billing', formatUSD(freelancerParams.monthlyUSD)],
          ['Annual INR Income', formatINR(calc.actualAnnualINR, { compact: true })],
          ['Baseline INR', formatINR(calc.baselineAnnualINR, { compact: true })],
          ['Annual FX Uplift', formatINR(calc.annualFXUplift, { compact: true })],
          ['FX Appreciation', formatPct(calc.fyAppreciationPct, { showSign: true })]
        ],
        monthlyHeaders: ['Month', 'Rate (₹/$)', 'USD Billed', 'INR Received', 'Baseline INR', 'Uplift', 'Cumulative Uplift'],
        monthlyBreakdown: calc.monthlyData.map(r => [
          monthKeyToLabel(r.monthKey),
          r.rate.toFixed(4),
          r.monthlyUSD.toFixed(2),
          r.inrReceived.toFixed(0),
          r.baselineINR.toFixed(0),
          r.uplift.toFixed(0),
          r.cumulativeUplift.toFixed(0)
        ]),
        incrementHeaders: ['USD increase %', 'New USD/mo', 'New INR/mo', 'Annual INR Uplift', 'INR at Reversion'],
        incrementRows: rateTable.map(r => [
          ((r.newMonthlyUSD / freelancerParams.monthlyUSD - 1) * 100).toFixed(0),
          r.newMonthlyUSD.toFixed(2),
          (r.newAnnualINR / 12).toFixed(0),
          (r.newAnnualINR - r.baselineAnnualINR).toFixed(0),
          (r.reversionAnnualINR / 12).toFixed(0)
        ]),
        exchangeRates: monthlyAverages
      };
    } else if (activeScenario === 'inrEmployee') {
      scenarioName = 'INR Employee';
      const calc = calcINREmployee({
        ...inrEmployeeParams,
        monthlyAverages,
        fyStartRate,
        fyEndRate,
        nextFYRate: inrEmployeeParams.nextFYRate ?? nextFYRate,
        fyConfig
      });
      const table = calcINREmployeeIncrementTable({
        monthlyINR: inrEmployeeParams.monthlyINR,
        fyStartRate,
        nextFYRate: inrEmployeeParams.nextFYRate ?? nextFYRate,
        breakEvenPct: calc.breakEvenPct
      });
      scenarioData = {
        summaryRows: [
          ['Monthly INR Salary', formatINR(inrEmployeeParams.monthlyINR)],
          ['FY Start USD Value', formatUSD(calc.fyStartUSDSalary)],
          ['March USD Value', formatUSD(calc.marchUSDValue)],
          ['Annual USD Lost', formatUSD(calc.annualUSDLoss)],
          ['Break-Even Hike', formatPct(calc.breakEvenPct)]
        ],
        monthlyHeaders: ['Month', 'Rate (₹/$)', 'INR Salary', 'USD Value', 'Baseline USD', 'Erosion', 'Cumulative Erosion'],
        monthlyBreakdown: calc.monthlyData.map(r => [
          monthKeyToLabel(r.monthKey),
          r.rate.toFixed(4),
          r.monthlyINR.toFixed(0),
          r.usdValue.toFixed(2),
          r.baselineUSD.toFixed(2),
          r.erosion.toFixed(2),
          r.cumulativeErosion.toFixed(2)
        ]),
        incrementHeaders: ['Increment %', 'New INR/mo', 'USD Value', 'vs FY Start ($)', 'Real Change %', 'Verdict'],
        incrementRows: table.map(r => [r.pct, r.newMonthlyINR.toFixed(0), r.newUSDValue.toFixed(2), r.realUSDChange.toFixed(2), r.realUSDChangePct.toFixed(2), r.verdict]),
        exchangeRates: monthlyAverages
      };
    }

    if (scenarioData) {
      exportScenarioToExcel(scenarioData, fyLabel, scenarioName);
    }
  };

  const handleExportCSV = () => {
    const { monthlyAverages, fyStartRate, fyEndRate } = ratesData;
    if (!fyStartRate) return;

    let headers, rows, filename;
    if (activeScenario === 'subsidiary') {
      const calc = calcSubsidiary({
        ...subsidiaryParams,
        monthlyAverages,
        fyStartRate,
        fyEndRate,
        nextFYRate: subsidiaryParams.nextFYRate ?? fyConfig?.nextYearStartRate ?? 90,
        fyConfig
      });
      headers = ['Month', 'Rate', 'INR Payroll', 'USD Cost', 'Baseline USD', 'USD Saved'];
      rows = calc.monthlyData.map(r => [monthKeyToLabel(r.monthKey), r.rate.toFixed(4), r.monthINR.toFixed(0), r.monthlyUSD.toFixed(2), r.baselineUSD.toFixed(2), r.saving.toFixed(2)]);
      filename = `RupeeShift_Subsidiary_${fyLabel}.csv`;
    } else if (activeScenario === 'itExporter') {
      const calc = calcITExporter({
        ...itExporterParams,
        monthlyAverages,
        fyStartRate,
        fyEndRate,
        nextFYRate: itExporterParams.nextFYRate ?? fyConfig?.nextYearStartRate ?? 90,
        fyConfig
      });
      headers = ['Month', 'Rate', 'USD Revenue', 'INR Realised', 'Baseline INR', 'FX Gain'];
      rows = calc.monthlyData.map(r => [monthKeyToLabel(r.monthKey), r.rate.toFixed(4), r.monthlyUSD.toFixed(2), r.inrRealised.toFixed(0), r.baselineINR.toFixed(0), r.fxGain.toFixed(0)]);
      filename = `RupeeShift_ITExporter_${fyLabel}.csv`;
    } else if (activeScenario === 'freelancer') {
      const calc = calcFreelancer({
        monthlyUSD: freelancerParams.monthlyUSD,
        monthlyAverages,
        fyStartRate,
        fyEndRate,
        fyConfig
      });
      headers = ['Month', 'Rate', 'USD Billed', 'INR Received', 'Baseline INR', 'Uplift'];
      rows = calc.monthlyData.map(r => [monthKeyToLabel(r.monthKey), r.rate.toFixed(4), r.monthlyUSD.toFixed(2), r.inrReceived.toFixed(0), r.baselineINR.toFixed(0), r.uplift.toFixed(0)]);
      filename = `RupeeShift_Freelancer_${fyLabel}.csv`;
    } else {
      const calc = calcINREmployee({
        ...inrEmployeeParams,
        monthlyAverages,
        fyStartRate,
        fyEndRate,
        nextFYRate: inrEmployeeParams.nextFYRate ?? fyConfig?.nextYearStartRate ?? 90,
        fyConfig
      });
      headers = ['Month', 'Rate', 'INR Salary', 'USD Value', 'Baseline USD', 'Erosion'];
      rows = calc.monthlyData.map(r => [monthKeyToLabel(r.monthKey), r.rate.toFixed(4), r.monthlyINR.toFixed(0), r.usdValue.toFixed(2), r.baselineUSD.toFixed(2), r.erosion.toFixed(2)]);
      filename = `RupeeShift_INREmployee_${fyLabel}.csv`;
    }

    exportScenarioToCSV(headers, rows, filename);
  };

  return (
    <div className="min-h-screen bg-cream text-ink font-sans">
      <Navbar
        onProject={() => setShowProject(true)}
        onMethodology={() => setShowMethodology(true)}
        onAbout={() => setShowAbout(true)}
        onExportExcel={handleExportExcel}
        onExportCSV={handleExportCSV}
      />

      <FYSelectorBar />

      <main>
        <HeroSection />
        <ScenarioSection />
        <InsightStrip />
      </main>

      <Footer />

      <AnimatePresence>{showProject && <ProjectModal onClose={() => setShowProject(false)} />}</AnimatePresence>
      <AnimatePresence>{showMethodology && <MethodologyModal onClose={() => setShowMethodology(false)} />}</AnimatePresence>
      <AnimatePresence>{showAbout && <AboutModal onClose={() => setShowAbout(false)} />}</AnimatePresence>
    </div>
  );
}

export default App;
