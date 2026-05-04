import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { FY_CONFIG } from '../../data/fyConfig';
import {
  calcINREmployee,
  calcINREmployeeIncrement,
  calcINREmployeeIncrementTable,
} from '../../utils/calculations';
import { getFYMonthKeys } from '../../utils/rateHelpers';
import { formatINR, formatUSD, formatRate, formatPct, monthKeyToLabel } from '../../utils/formatters';
import { CHART_COLORS } from '../charts/chartUtils';
import ParamsPanel, { ParamField, ParamInput } from './ParamsPanel';
import InsightBanner from '../ui/InsightBanner';
import MetricCard from '../ui/MetricCard';
import SectionCard from '../ui/SectionCard';
import SliderControl from '../ui/SliderControl';
import StatusTag from '../ui/StatusTag';
import MonthlyBarChart from '../charts/MonthlyBarChart';
import IncrementBarChart from '../charts/IncrementBarChart';
import { VARIANTS, TRANSITIONS } from '../../utils/animations';

export default function INREmployeeScenario() {
  const { state, dispatch } = useAppContext();
  const { inrEmployeeParams, ratesData, selectedFY } = state;
  const fyConfig = FY_CONFIG[selectedFY];

  const fyStartRate = ratesData.fyStartRate;
  const fyEndRate = ratesData.fyEndRate;
  const nextFYRate = inrEmployeeParams.nextFYRate ?? fyConfig?.nextYearStartRate ?? 90;
  const monthKeys = useMemo(() => getFYMonthKeys(fyConfig), [fyConfig]);

  const calc = useMemo(() => {
    if (!fyStartRate || !fyEndRate) return null;
    return calcINREmployee({
      monthlyINR: inrEmployeeParams.monthlyINR,
      billingRate: inrEmployeeParams.billingRate || 0,
      monthlyAverages: ratesData.monthlyAverages,
      fyStartRate,
      fyEndRate,
      nextFYRate,
      fyConfig,
    });
  }, [inrEmployeeParams, ratesData.monthlyAverages, fyStartRate, fyEndRate, nextFYRate, fyConfig]);

  const incrementResult = useMemo(() => {
    if (!fyStartRate) return null;
    return calcINREmployeeIncrement({
      monthlyINR: inrEmployeeParams.monthlyINR,
      fyStartRate,
      nextFYRate,
      incrementPct: inrEmployeeParams.incrementPct,
    });
  }, [inrEmployeeParams, fyStartRate, nextFYRate]);

  const incrementTable = useMemo(() => {
    if (!calc || !fyStartRate) return [];
    return calcINREmployeeIncrementTable({
      monthlyINR: inrEmployeeParams.monthlyINR,
      fyStartRate,
      nextFYRate,
      breakEvenPct: calc.breakEvenPct,
    });
  }, [calc, inrEmployeeParams.monthlyINR, fyStartRate, nextFYRate]);

  if (!calc) return null;
  const startYear = fyConfig?.startDate?.slice(0, 4) || '2024';
  const endYear = fyConfig?.endDate?.slice(0, 4) || '2025';

  const verdictColor = incrementResult
    ? incrementResult.realUSDChange > 0.01 ? 'text-gain' : incrementResult.realUSDChange < -0.01 ? 'text-loss' : 'text-amber-rupee'
    : 'text-ink';

  const verdictText = incrementResult
    ? incrementResult.realUSDChange > 0.01
      ? `✓ Real raise of ${formatPct(incrementResult.realUSDChangePct, { showSign: true })} in USD terms`
      : incrementResult.realUSDChange < -0.01
        ? `⚠ Real pay cut of ${formatPct(Math.abs(incrementResult.realUSDChangePct))} in USD terms`
        : `≈ Break-even. No real change in USD value.`
    : '';

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-[30%] lg:sticky lg:top-20 self-start">
        <ParamsPanel title="Scenario 4 of 4 · INR Employee">
          <ParamField label="Your monthly salary (₹)">
            <ParamInput value={inrEmployeeParams.monthlyINR} onChange={v => dispatch({ type: 'UPDATE_INR_EMPLOYEE_PARAMS', payload: { monthlyINR: v } })} prefix="₹" min={0} />
          </ParamField>

          <ParamField label="What company bills for you per month ($)" hint="Optional — enables pass-through analysis">
            <ParamInput value={inrEmployeeParams.billingRate} onChange={v => dispatch({ type: 'UPDATE_INR_EMPLOYEE_PARAMS', payload: { billingRate: v } })} prefix="$" min={0} />
          </ParamField>

          <ParamField label="Projected rate next FY (₹/$)">
            <ParamInput value={nextFYRate} onChange={v => dispatch({ type: 'UPDATE_INR_EMPLOYEE_PARAMS', payload: { nextFYRate: v } })} suffix="₹/$" min={0} />
          </ParamField>

          <SliderControl
            label="Your INR increment %"
            min={0}
            max={30}
            value={inrEmployeeParams.incrementPct}
            onChange={v => dispatch({ type: 'UPDATE_INR_EMPLOYEE_PARAMS', payload: { incrementPct: v } })}
          />
        </ParamsPanel>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <div>
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ink-light mb-1">Scenario 4 of 4</p>
          <h2 className="font-display text-2xl md:text-3xl tracking-tight text-ink">INR Employee</h2>
          <p className="font-sans text-sm text-ink-muted mt-1">You earn a fixed INR salary while your employer bills clients in USD. Your labour got more valuable in dollar terms — but your pay packet didn't change.</p>
        </div>

        <InsightBanner>
          The dollar moved <strong className="font-mono">{formatPct(calc.fyAppreciationPct, { showSign: true })}</strong> in {fyConfig?.label}.
          You need a <strong className="font-mono text-amber-rupee">{formatPct(calc.breakEvenPct)}</strong> INR raise just to earn the same in USD as you did in April {startYear}. Anything less is a real pay cut.
        </InsightBanner>

        {/* Erosion Card */}
        <div className="bg-loss-light border border-loss/20 rounded-2xl p-5">
          <p className="font-display text-lg text-loss mb-2">USD Erosion</p>
          <p className="font-sans text-sm text-ink leading-relaxed">
            By March {endYear}, your <strong className="font-mono">{formatINR(inrEmployeeParams.monthlyINR)}</strong> salary was worth{' '}
            <strong className="font-mono text-loss">{formatUSD(calc.marchUSDValue)}/month</strong> — down from{' '}
            <strong className="font-mono">{formatUSD(calc.fyStartUSDSalary)}</strong> in April {startYear}.
            Over the full year, your salary lost{' '}
            <strong className="font-mono text-loss">{formatUSD(calc.annualUSDLoss)}</strong> in cumulative USD value.
          </p>
        </div>

        <motion.div variants={VARIANTS.staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="Annual USD Lost" value={calc.annualUSDLoss} formatter={v => formatUSD(v)} variant="loss" />
          </motion.div>
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="March USD Value" value={calc.marchUSDValue} formatter={v => formatUSD(v)} variant="loss" />
          </motion.div>
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="April USD Value" value={calc.fyStartUSDSalary} formatter={v => formatUSD(v)} variant="info" />
          </motion.div>
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="Break-Even Hike" value={calc.breakEvenPct} formatter={v => formatPct(v)} variant="amber" />
          </motion.div>
        </motion.div>

        <SectionCard>
          <div className="p-5">
            <MonthlyBarChart
              data={calc.monthlyData}
              barKey="usdValue"
              baselineKey="baselineUSD"
              lineKey="erosion"
              barLabel="USD Value of Salary"
              baselineLabel="Baseline USD"
              lineLabel="Monthly Erosion ($)"
              yFormatter={v => formatUSD(v)}
              title="Monthly USD Value of Your Salary"
            />
          </div>
        </SectionCard>

        {/* Monthly Table */}
        <SectionCard>
          <div className="p-5">
            <p className="font-sans text-sm font-semibold text-ink mb-3">Monthly Breakdown</p>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-cream-dark">
                    {['Month', 'Rate (₹/$)', 'INR Salary', 'USD Value', 'Baseline USD', 'Erosion this month', 'Cumulative Erosion'].map(h => (
                      <th key={h} className={`${h === 'Month' ? 'text-left' : 'text-right'} px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calc.monthlyData.map((row, i) => (
                    <tr key={row.monthKey} className={i % 2 === 0 ? '' : 'bg-cream/50'}>
                      <td className="px-3 py-2 font-sans text-sm text-ink font-medium">{monthKeyToLabel(row.monthKey)}</td>
                      <td className="px-3 py-2 text-right">{formatRate(row.rate)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.monthlyINR)}</td>
                      <td className="px-3 py-2 text-right">{formatUSD(row.usdValue)}</td>
                      <td className="px-3 py-2 text-right text-ink-muted">{formatUSD(row.baselineUSD)}</td>
                      <td className={`px-3 py-2 text-right font-medium ${row.erosion > 0 ? 'text-loss' : 'text-gain'}`}>{formatUSD(row.erosion)}</td>
                      <td className="px-3 py-2 text-right text-loss">{formatUSD(row.cumulativeErosion)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden flex flex-col gap-2">
              {calc.monthlyData.map(row => (
                <div key={row.monthKey} className="bg-cream-dark rounded-xl px-4 py-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-sans text-sm font-medium text-ink">{monthKeyToLabel(row.monthKey)}</span>
                    <span className="font-mono text-xs text-ink-muted">{formatRate(row.rate)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-ink-muted">USD: {formatUSD(row.usdValue)}</span>
                    <span className="text-loss">Erosion: {formatUSD(row.erosion)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Increment Section */}
        <div className="mt-2">
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ink-light mb-2">Increment Analysis</p>
          <InsightBanner>
            You need a <strong className="font-mono text-amber-rupee">{formatPct(calc.breakEvenPct)}</strong> INR raise just to earn the same in USD as you did in April {startYear}. Anything less is a real pay cut.
          </InsightBanner>

          <div className="mt-4 bg-white border border-ink-light/20 rounded-2xl p-5">
            <SliderControl label="Your INR increment %" min={0} max={30} value={inrEmployeeParams.incrementPct} onChange={v => dispatch({ type: 'UPDATE_INR_EMPLOYEE_PARAMS', payload: { incrementPct: v } })} />

            {/* Real-time verdict */}
            {incrementResult && (
              <p className={`font-sans text-sm font-semibold mt-4 ${verdictColor}`}>{verdictText}</p>
            )}

            {incrementResult && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
                <MetricCard label="New INR Salary" value={incrementResult.newMonthlyINR} formatter={v => formatINR(v)} variant="info" />
                <MetricCard label="USD Value" value={incrementResult.newUSDValue} formatter={v => formatUSD(v)} variant={incrementResult.realUSDChange >= 0 ? 'gain' : 'loss'} />
                <MetricCard label="vs FY Start USD" value={incrementResult.realUSDChange} formatter={v => formatUSD(v, { showSign: true })} variant={incrementResult.realUSDChange >= 0 ? 'gain' : 'loss'} />
                <MetricCard label="Real Outcome" value={incrementResult.realUSDChangePct} formatter={v => formatPct(v, { showSign: true })} variant={incrementResult.realUSDChange >= 0 ? 'gain' : 'loss'} />
              </div>
            )}
          </div>

          {/* Increment Table */}
          <SectionCard className="mt-4">
            <div className="p-5">
              <p className="font-sans text-sm font-semibold text-ink mb-3">Increment Scenario Table</p>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="bg-cream-dark">
                      {['Increment %', 'New INR salary', 'USD value', 'vs $baseline', 'Real USD change', 'Verdict'].map(h => (
                        <th key={h} className={`${h === 'Increment %' || h === 'New INR salary' ? 'text-left' : h === 'Verdict' ? 'text-center' : 'text-right'} px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {incrementTable.map((row, i) => (
                      <tr key={i} className={`${row.isBreakEven ? 'bg-info-light/50' : row.verdict === 'paycut' ? 'bg-loss-light/20' : i % 2 === 0 ? '' : 'bg-cream/50'}`}>
                        <td className="px-3 py-2 font-medium text-ink">
                          {row.isBreakEven ? '★ ' : ''}{formatPct(row.pct, { decimals: row.isBreakEven ? 2 : 0 })}
                        </td>
                        <td className="px-3 py-2">{formatINR(row.newMonthlyINR)}</td>
                        <td className="px-3 py-2 text-right">{formatUSD(row.newUSDValue)}</td>
                        <td className={`px-3 py-2 text-right font-medium ${row.realUSDChange >= 0 ? 'text-gain' : 'text-loss'}`}>{formatUSD(row.realUSDChange, { showSign: true })}</td>
                        <td className={`px-3 py-2 text-right font-medium ${row.realUSDChangePct >= 0 ? 'text-gain' : 'text-loss'}`}>{formatPct(row.realUSDChangePct, { showSign: true })}</td>
                        <td className="px-3 py-2 text-center"><StatusTag variant={row.verdict} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>

          {/* Pass-Through Analysis */}
          {calc.passThroughData && (
            <SectionCard className="mt-4">
              <div className="p-5">
                <p className="font-sans text-sm font-semibold text-ink mb-3">Pass-Through Analysis</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <MetricCard label="Your billing rate/mo" value={calc.passThroughData.billingRate} formatter={v => formatUSD(v)} variant="info" />
                  <MetricCard label="Company FX gain/mo" value={calc.passThroughData.companyFXGainMonthly} formatter={v => formatINR(v)} variant="gain" />
                  <MetricCard label="Company FX gain/year" value={calc.passThroughData.companyFXGainAnnual} formatter={v => formatINR(v, { compact: true })} variant="gain" />
                  <MetricCard label="Cost to break-even you" value={calc.passThroughData.breakEvenCostToCompany} formatter={v => formatINR(v, { compact: true })} variant="amber" />
                </div>
                <p className="font-sans text-xs text-ink-muted mt-3 leading-relaxed">
                  At break-even increment of <strong className="font-mono text-amber-rupee">{formatPct(calc.breakEvenPct)}</strong>, it would cost the company <strong className="font-mono">{formatINR(calc.passThroughData.breakEvenCostToCompany, { compact: true })}</strong>/year to make your USD purchasing power whole — which is{' '}
                  <strong className="font-mono">{formatPct(calc.passThroughData.passThroughRatio)}</strong> of the company's annual FX windfall.
                </p>
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
