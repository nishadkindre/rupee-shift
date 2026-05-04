import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { FY_CONFIG } from '../../data/fyConfig';
import {
  calcITExporter,
  calcITExporterHike,
  calcITExporterHikeTable,
  calcContractRenewalTable,
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

export default function ITExporterScenario() {
  const { state, dispatch } = useAppContext();
  const { itExporterParams, ratesData, selectedFY } = state;
  const fyConfig = FY_CONFIG[selectedFY];

  const fyStartRate = ratesData.fyStartRate;
  const fyEndRate = ratesData.fyEndRate;
  const nextFYRate = itExporterParams.nextFYRate ?? fyConfig?.nextYearStartRate ?? 90;
  const monthKeys = useMemo(() => getFYMonthKeys(fyConfig), [fyConfig]);

  const calc = useMemo(() => {
    if (!fyStartRate || !fyEndRate) return null;
    return calcITExporter({
      annualUSD: itExporterParams.annualUSD,
      annualINRCost: itExporterParams.annualINRCost,
      monthlyAverages: ratesData.monthlyAverages,
      fyStartRate,
      fyEndRate,
      nextFYRate,
      fyConfig,
    });
  }, [itExporterParams, ratesData.monthlyAverages, fyStartRate, fyEndRate, nextFYRate, fyConfig]);

  const hikeResult = useMemo(() => {
    if (!calc) return null;
    return calcITExporterHike({
      annualINRCost: itExporterParams.annualINRCost,
      fxGainINR: calc.fxGainINR,
      hikePct: itExporterParams.hikePct,
    });
  }, [calc, itExporterParams]);

  const hikeTable = useMemo(() => {
    if (!calc) return [];
    return calcITExporterHikeTable({
      annualINRCost: itExporterParams.annualINRCost,
      fxGainINR: calc.fxGainINR,
    });
  }, [calc, itExporterParams.annualINRCost]);

  const renewalTable = useMemo(() => {
    if (!calc) return [];
    return calcContractRenewalTable({
      annualUSD: itExporterParams.annualUSD,
      fyStartRate,
      nextFYRate,
      baselineAnnualINR: calc.baselineAnnualINR,
    });
  }, [calc, itExporterParams.annualUSD, fyStartRate, nextFYRate]);

  if (!calc) return null;
  const startYear = fyConfig?.startDate?.slice(0, 4) || '2024';

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-[30%] lg:sticky lg:top-20 self-start">
        <ParamsPanel title="Scenario 2 of 4 · IT Exporter">
          <ParamField label="Annual USD revenue ($)" hint="Total contract / billing revenue">
            <ParamInput value={itExporterParams.annualUSD} onChange={v => dispatch({ type: 'UPDATE_IT_EXPORTER_PARAMS', payload: { annualUSD: v } })} prefix="$" min={0} />
          </ParamField>

          <ParamField label="Annual INR cost base (₹)" hint="Salaries, rent, operations">
            <ParamInput value={itExporterParams.annualINRCost} onChange={v => dispatch({ type: 'UPDATE_IT_EXPORTER_PARAMS', payload: { annualINRCost: v } })} prefix="₹" min={0} />
          </ParamField>

          <ParamField label="Projected rate for next FY (₹/$)">
            <ParamInput value={nextFYRate} onChange={v => dispatch({ type: 'UPDATE_IT_EXPORTER_PARAMS', payload: { nextFYRate: v } })} suffix="₹/$" min={0} />
          </ParamField>

          <SliderControl
            label="Planned employee hike %"
            min={0}
            max={30}
            value={itExporterParams.hikePct}
            onChange={v => dispatch({ type: 'UPDATE_IT_EXPORTER_PARAMS', payload: { hikePct: v } })}
          />
        </ParamsPanel>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <div>
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ink-light mb-1">Scenario 2 of 4</p>
          <h2 className="font-display text-2xl md:text-3xl tracking-tight text-ink">IT Exporter</h2>
          <p className="font-sans text-sm text-ink-muted mt-1">Indian company earns USD revenue, spends INR. Dollar appreciation silently expands margins.</p>
        </div>

        <InsightBanner>
          Your <strong className="font-mono">{formatUSD(itExporterParams.annualUSD, { compact: true })}</strong> USD contract delivered{' '}
          <strong className="font-mono text-gain">{formatINR(calc.actualAnnualINR, { compact: true })}</strong> in INR this year —{' '}
          <strong className="font-mono text-gain">{formatINR(calc.fxGainINR, { compact: true })}</strong> more than the{' '}
          <strong className="font-mono">{formatINR(calc.baselineAnnualINR, { compact: true })}</strong> baseline at the April {startYear} rate of{' '}
          <strong className="font-mono">{formatRate(fyStartRate)}</strong>. This{' '}
          <strong className="font-mono">{formatPct(calc.fxGainPct, { showSign: true })}</strong> FX uplift required no new business or pricing change.
        </InsightBanner>

        <motion.div variants={VARIANTS.staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="FX Gain (INR)" value={calc.fxGainINR} formatter={v => formatINR(v, { compact: true })} variant="gain" />
          </motion.div>
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="FX Gain %" value={calc.fxGainPct} formatter={v => formatPct(v, { showSign: true })} variant="gain" />
          </motion.div>
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="Actual INR Revenue" value={calc.actualAnnualINR} formatter={v => formatINR(v, { compact: true })} variant="info" />
          </motion.div>
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="FX Appreciation" value={calc.fyAppreciationPct} formatter={v => formatPct(v, { showSign: true })} variant="amber" />
          </motion.div>
        </motion.div>

        <SectionCard>
          <div className="p-5">
            <MonthlyBarChart
              data={calc.monthlyData}
              barKey="inrRealised"
              baselineKey="baselineINR"
              lineKey="fxGain"
              barLabel="Actual INR Revenue"
              baselineLabel="Baseline INR"
              lineLabel="FX Gain (₹)"
              yFormatter={v => formatINR(v, { compact: true })}
              title="Monthly INR Realisation vs Baseline"
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
                    {['Month', 'Rate (₹/$)', 'USD received', 'INR realised', 'Baseline INR', 'FX Gain (₹)', 'Cumulative'].map(h => (
                      <th key={h} className={`${h === 'Month' ? 'text-left' : 'text-right'} px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calc.monthlyData.map((row, i) => (
                    <tr key={row.monthKey} className={i % 2 === 0 ? '' : 'bg-cream/50'}>
                      <td className="px-3 py-2 font-sans text-sm text-ink font-medium">{monthKeyToLabel(row.monthKey)}</td>
                      <td className="px-3 py-2 text-right">{formatRate(row.rate)}</td>
                      <td className="px-3 py-2 text-right">{formatUSD(row.monthlyUSD)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.inrRealised, { compact: true })}</td>
                      <td className="px-3 py-2 text-right text-ink-muted">{formatINR(row.baselineINR, { compact: true })}</td>
                      <td className={`px-3 py-2 text-right font-medium ${row.fxGain >= 0 ? 'text-gain' : 'text-loss'}`}>{formatINR(row.fxGain, { compact: true })}</td>
                      <td className="px-3 py-2 text-right text-ink-muted">{formatINR(row.cumulativeGain, { compact: true })}</td>
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
                    <span className="text-ink-muted">INR: {formatINR(row.inrRealised, { compact: true })}</span>
                    <span className={row.fxGain >= 0 ? 'text-gain' : 'text-loss'}>FX: {formatINR(row.fxGain, { compact: true })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Hike Section */}
        <div className="mt-2">
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ink-light mb-2">Employee Hike Analysis</p>
          <InsightBanner>
            Your FX tailwind on the same <strong className="font-mono">{formatUSD(itExporterParams.annualUSD, { compact: true })}</strong> contract delivered{' '}
            <strong className="font-mono text-gain">{formatINR(calc.fxGainINR, { compact: true })}</strong> more INR this year. At{' '}
            <strong className="font-mono">{itExporterParams.hikePct}%</strong> salary hike,{' '}
            <strong className="font-mono text-amber-rupee">{hikeResult ? formatPct(hikeResult.fxFundedPortion) : '—'}</strong>{' '}
            of that cost increase is funded by dollar appreciation alone.
          </InsightBanner>

          <div className="mt-4 bg-white border border-ink-light/20 rounded-2xl p-5">
            <SliderControl label="Employee salary hike %" min={0} max={30} value={itExporterParams.hikePct} onChange={v => dispatch({ type: 'UPDATE_IT_EXPORTER_PARAMS', payload: { hikePct: v } })} />
            {hikeResult && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                <MetricCard label="FX Gain (INR)" value={calc.fxGainINR} formatter={v => formatINR(v, { compact: true })} variant="gain" />
                <MetricCard label="Hike Cost (INR)" value={hikeResult.hikeCostINR} formatter={v => formatINR(v, { compact: true })} variant="info" />
                <MetricCard label="% Funded by FX" value={hikeResult.fxFundedPortion} formatter={v => formatPct(v)} variant="amber" />
                <MetricCard label="Net Margin Impact" value={hikeResult.netMarginImpact} formatter={v => formatINR(v, { compact: true })} variant={hikeResult.netMarginImpact >= 0 ? 'gain' : 'loss'} />
              </div>
            )}
          </div>

          {/* Hike Table */}
          <SectionCard className="mt-4">
            <div className="p-5">
              <p className="font-sans text-sm font-semibold text-ink mb-3">Hike Scenario Table</p>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="bg-cream-dark">
                      {['Hike %', 'INR Payroll Increase', 'FX Covers (%)', 'Net Margin Change', 'Verdict'].map(h => (
                        <th key={h} className={`${h === 'Hike %' ? 'text-left' : h === 'Verdict' ? 'text-center' : 'text-right'} px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hikeTable.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? '' : 'bg-cream/50'}>
                        <td className="px-3 py-2 font-medium">{row.pct}%</td>
                        <td className="px-3 py-2 text-right">{formatINR(row.hikeCostINR, { compact: true })}</td>
                        <td className="px-3 py-2 text-right text-amber-rupee">{formatPct(row.fxFundedPortion)}</td>
                        <td className={`px-3 py-2 text-right font-medium ${row.netMarginImpact >= 0 ? 'text-gain' : 'text-loss'}`}>{formatINR(row.netMarginImpact, { compact: true })}</td>
                        <td className="px-3 py-2 text-center"><StatusTag variant={row.verdict} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>

          {/* Contract Renewal Table */}
          <SectionCard className="mt-4">
            <div className="p-5">
              <p className="font-sans text-sm font-semibold text-ink mb-1">Contract Renewal Scenarios</p>
              <p className="font-sans text-xs text-ink-muted mb-3">INR revenue at different USD contract change scenarios, at {formatRate(nextFYRate)}</p>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="bg-cream-dark">
                      {['USD Change', 'New USD Contract', 'INR at Next FY', 'vs FY Start INR', 'Effective INR Growth'].map(h => (
                        <th key={h} className={`${h === 'USD Change' ? 'text-left' : 'text-right'} px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {renewalTable.map((row, i) => (
                      <tr key={i} className={`${row.changePct === 0 ? 'bg-info-light/30' : i % 2 === 0 ? '' : 'bg-cream/50'}`}>
                        <td className="px-3 py-2 font-medium">{row.changePct === 0 ? 'Flat' : formatPct(row.changePct, { showSign: true })}</td>
                        <td className="px-3 py-2 text-right">{formatUSD(row.newUSD, { compact: true })}</td>
                        <td className="px-3 py-2 text-right">{formatINR(row.inrAtNextFY, { compact: true })}</td>
                        <td className={`px-3 py-2 text-right font-medium ${row.vsBaseline >= 0 ? 'text-gain' : 'text-loss'}`}>{formatINR(row.vsBaseline, { compact: true })}</td>
                        <td className={`px-3 py-2 text-right font-medium ${row.effectiveGrowth >= 0 ? 'text-gain' : 'text-loss'}`}>{formatPct(row.effectiveGrowth, { showSign: true })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
