import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { FY_CONFIG } from '../../data/fyConfig';
import { calcSubsidiary, calcSubsidiaryIncrement, calcSubsidiaryIncrementTable } from '../../utils/calculations';
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
import RateLineChart from '../charts/RateLineChart';
import IncrementBarChart from '../charts/IncrementBarChart';
import { VARIANTS, TRANSITIONS } from '../../utils/animations';
import { useAnimation } from '../../context/AnimationContext';

export default function SubsidiaryScenario() {
  const { state, dispatch } = useAppContext();
  const { subsidiaryParams, ratesData, selectedFY } = state;
  const fyConfig = FY_CONFIG[selectedFY];
  const { shouldAnimate } = useAnimation();

  const fyStartRate = ratesData.fyStartRate;
  const fyEndRate = ratesData.fyEndRate;
  const nextFYRate = subsidiaryParams.nextFYRate ?? fyConfig?.nextYearStartRate ?? 90;
  const monthKeys = useMemo(() => getFYMonthKeys(fyConfig), [fyConfig]);

  const calc = useMemo(() => {
    if (!fyStartRate || !fyEndRate) return null;
    return calcSubsidiary({
      annualINR: subsidiaryParams.annualINR,
      customMonthly: subsidiaryParams.expenseType === 'custom' ? subsidiaryParams.customMonthly : null,
      monthlyAverages: ratesData.monthlyAverages,
      fyStartRate,
      fyEndRate,
      nextFYRate,
      fyConfig
    });
  }, [subsidiaryParams, ratesData.monthlyAverages, fyStartRate, fyEndRate, nextFYRate, fyConfig]);

  const incrementResult = useMemo(() => {
    if (!calc || !fyStartRate) return null;
    return calcSubsidiaryIncrement({
      annualINR: subsidiaryParams.annualINR,
      nextFYRate,
      fyStartRate,
      incrementPct: subsidiaryParams.incrementPct
    });
  }, [calc, subsidiaryParams, fyStartRate, nextFYRate]);

  const incrementTable = useMemo(() => {
    if (!calc || !fyStartRate) return [];
    return calcSubsidiaryIncrementTable({
      annualINR: subsidiaryParams.annualINR,
      nextFYRate,
      fyStartRate,
      breakEvenPct: calc.breakEvenPct
    });
  }, [calc, subsidiaryParams.annualINR, fyStartRate, nextFYRate]);

  const startYear = fyConfig?.startDate?.slice(0, 4) || '2024';

  if (!calc) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Params Panel */}
      <div className="lg:w-[30%] lg:sticky lg:top-20 self-start">
        <ParamsPanel title="Scenario 1 of 4 · Indian Subsidiary">
          <ParamField label="Annual INR expense (₹)" hint="Total annual cost the parent must fund">
            <ParamInput
              value={subsidiaryParams.annualINR}
              onChange={v =>
                dispatch({
                  type: 'UPDATE_SUBSIDIARY_PARAMS',
                  payload: { annualINR: v }
                })
              }
              prefix="₹"
              min={0}
            />
          </ParamField>

          <ParamField label="How is this paid?">
            <div className="flex gap-2">
              {['equal', 'custom'].map(opt => (
                <button
                  key={opt}
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_SUBSIDIARY_PARAMS',
                      payload: { expenseType: opt }
                    })
                  }
                  className={`flex-1 text-xs font-sans py-2 rounded-lg border transition-colors ${
                    subsidiaryParams.expenseType === opt ? 'bg-ink text-cream border-ink' : 'border-ink-light/30 text-ink-muted hover:border-ink-muted'
                  } focus:outline-none focus:ring-2 focus:ring-amber-rupee`}
                >
                  {opt === 'equal' ? 'Monthly (equal)' : 'Custom split'}
                </button>
              ))}
            </div>
          </ParamField>

          {subsidiaryParams.expenseType === 'custom' && (
            <div className="grid grid-cols-2 gap-2">
              {monthKeys.map((key, i) => (
                <ParamField key={key} label={monthKeyToLabel(key)}>
                  <ParamInput
                    value={(subsidiaryParams.customMonthly?.[i] ?? subsidiaryParams.annualINR / 12).toFixed(0)}
                    onChange={v => {
                      const updated = [...(subsidiaryParams.customMonthly || Array(12).fill(subsidiaryParams.annualINR / 12))];
                      updated[i] = v;
                      dispatch({
                        type: 'UPDATE_SUBSIDIARY_PARAMS',
                        payload: { customMonthly: updated }
                      });
                    }}
                    prefix="₹"
                    min={0}
                  />
                </ParamField>
              ))}
            </div>
          )}

          <ParamField label="Projected rate for next FY (₹/$)" hint="Used for increment analysis">
            <ParamInput
              value={nextFYRate}
              onChange={v =>
                dispatch({
                  type: 'UPDATE_SUBSIDIARY_PARAMS',
                  payload: { nextFYRate: v }
                })
              }
              suffix="₹/$"
              min={0}
            />
          </ParamField>

          <SliderControl
            label="Expected INR cost growth next FY"
            min={0}
            max={50}
            step={1}
            value={subsidiaryParams.incrementPct}
            onChange={v =>
              dispatch({
                type: 'UPDATE_SUBSIDIARY_PARAMS',
                payload: { incrementPct: v }
              })
            }
          />
        </ParamsPanel>
      </div>

      {/* Output area */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        {/* Eyebrow */}
        <div>
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ink-light mb-1">Scenario 1 of 4</p>
          <h2 className="font-display text-2xl md:text-3xl tracking-tight text-ink">Indian Subsidiary</h2>
          <p className="font-sans text-sm text-ink-muted mt-1">Foreign parent company funds Indian operations in USD. Dollar appreciation = less USD spent for same INR obligations.</p>
        </div>

        {/* Insight Banner */}
        <InsightBanner>
          Your India operations cost the parent company <strong className="font-mono">{formatUSD(calc.totalActualUSD, { compact: true })}</strong> this year —{' '}
          <strong className="font-mono text-gain">{formatUSD(calc.totalUSDSaved)}</strong> less than the <strong className="font-mono">{formatUSD(calc.totalBaselineUSD, { compact: true })}</strong>{' '}
          budgeted at the April {startYear} rate of <strong className="font-mono">{formatRate(fyStartRate)}</strong>. This saving of{' '}
          <strong className="font-mono text-gain">{formatINR(calc.totalINREquivSaved, { compact: true })}</strong> required no renegotiation — it was delivered entirely by the rupee's depreciation.
        </InsightBanner>

        {/* Key Metrics */}
        <motion.div variants={VARIANTS.staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="USD Saved (FY)" value={calc.totalUSDSaved} formatter={v => formatUSD(v)} variant="gain" />
          </motion.div>
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="INR Equiv. Saved" value={calc.totalINREquivSaved} formatter={v => formatINR(v, { compact: true })} variant="gain" />
          </motion.div>
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="Actual USD Spent" value={calc.totalActualUSD} formatter={v => formatUSD(v, { compact: true })} variant="info" />
          </motion.div>
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="FX Appreciation" value={calc.fyAppreciationPct} formatter={v => formatPct(v, { showSign: true })} variant="amber" />
          </motion.div>
        </motion.div>

        {/* Monthly Chart + Rate Chart */}
        <SectionCard>
          <div className="p-5">
            <MonthlyBarChart
              data={calc.monthlyData}
              barKey="monthlyUSD"
              baselineKey="baselineUSD"
              lineKey="saving"
              barLabel="Actual USD"
              baselineLabel="Baseline USD"
              lineLabel="Monthly Saving ($)"
              yFormatter={v => formatUSD(v, { compact: true })}
              lineFormatter={v => formatUSD(v)}
              title="Monthly USD Cost vs Baseline"
            />
          </div>
        </SectionCard>

        <SectionCard>
          <div className="p-5">
            <RateLineChart monthlyAverages={ratesData.monthlyAverages} fyMonthKeys={monthKeys} title="USD/INR Exchange Rate (Monthly Average)" />
          </div>
        </SectionCard>

        {/* Monthly Breakdown Table */}
        <SectionCard>
          <div className="p-5">
            <p className="font-sans text-sm font-semibold text-ink mb-3">Monthly Breakdown</p>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-cream-dark">
                    <th className="text-left px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">Month</th>
                    <th className="text-right px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">Rate (₹/$)</th>
                    <th className="text-right px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">USD Sent</th>
                    <th className="text-right px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">Baseline USD</th>
                    <th className="text-right px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">Saving ($)</th>
                    <th className="text-right px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">Saving (₹)</th>
                    <th className="text-right px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">Cumulative USD</th>
                  </tr>
                </thead>
                <tbody>
                  {calc.monthlyData.map((row, i) => (
                    <tr key={row.monthKey} className={i % 2 === 0 ? '' : 'bg-cream/50'}>
                      <td className="px-3 py-2 font-sans text-sm text-ink font-medium">{monthKeyToLabel(row.monthKey)}</td>
                      <td className="px-3 py-2 text-right text-ink">{formatRate(row.rate)}</td>
                      <td className="px-3 py-2 text-right text-ink">{formatUSD(row.monthlyUSD)}</td>
                      <td className="px-3 py-2 text-right text-ink-muted">{formatUSD(row.baselineUSD)}</td>
                      <td className={`px-3 py-2 text-right font-medium ${row.saving > 0 ? 'text-gain' : 'text-loss'}`}>{formatUSD(row.saving)}</td>
                      <td className={`px-3 py-2 text-right font-medium ${row.savingINR > 0 ? 'text-gain' : 'text-loss'}`}>{formatINR(row.savingINR, { compact: true })}</td>
                      <td className="px-3 py-2 text-right text-ink-muted">{formatUSD(row.cumulativeUSD, { compact: true })}</td>
                    </tr>
                  ))}
                  <tr className="bg-cream-dark font-semibold border-t-2 border-ink-light/20">
                    <td className="px-3 py-2 font-sans text-sm text-ink font-bold">TOTAL</td>
                    <td className="px-3 py-2 text-right text-ink-muted">—</td>
                    <td className="px-3 py-2 text-right text-ink">{formatUSD(calc.totalActualUSD)}</td>
                    <td className="px-3 py-2 text-right text-ink-muted">{formatUSD(calc.totalBaselineUSD)}</td>
                    <td className="px-3 py-2 text-right text-gain">{formatUSD(calc.totalUSDSaved)}</td>
                    <td className="px-3 py-2 text-right text-gain">{formatINR(calc.totalINREquivSaved, { compact: true })}</td>
                    <td className="px-3 py-2 text-right text-ink-muted">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Mobile card list */}
            <div className="md:hidden flex flex-col gap-2">
              {calc.monthlyData.map(row => (
                <div key={row.monthKey} className="bg-cream-dark rounded-xl px-4 py-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-sans text-sm font-medium text-ink">{monthKeyToLabel(row.monthKey)}</span>
                    <span className="font-mono text-xs text-ink-muted">{formatRate(row.rate)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-ink-muted">USD sent: {formatUSD(row.monthlyUSD)}</span>
                    <span className={row.saving >= 0 ? 'text-gain' : 'text-loss'}>Saved: {formatUSD(row.saving)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* ─── Increment Section ─── */}
        <div className="mt-2">
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ink-light mb-2">Increment Analysis</p>
          <h3 className="font-display text-xl md:text-2xl tracking-tight text-ink mb-4">Next FY Cost Projection</h3>

          <InsightBanner>
            At <strong className="font-mono">{formatRate(nextFYRate)}</strong>, the break-even cost increase is <strong className="font-mono text-amber-rupee">{formatPct(calc.breakEvenPct)}</strong>.
            Below this, your India operations are still cheaper in USD terms than FY{startYear}.
          </InsightBanner>

          {/* Slider */}
          <div className="mt-5 bg-white border border-ink-light/20 rounded-2xl p-5">
            <SliderControl
              label="Expected INR cost growth next FY"
              min={0}
              max={50}
              value={subsidiaryParams.incrementPct}
              onChange={v =>
                dispatch({
                  type: 'UPDATE_SUBSIDIARY_PARAMS',
                  payload: { incrementPct: v }
                })
              }
            />

            {/* Live cards */}
            {incrementResult && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                <MetricCard label="New Annual INR" value={incrementResult.newAnnualINR} formatter={v => formatINR(v, { compact: true })} variant="info" />
                <MetricCard label="New Annual USD" value={incrementResult.newAnnualUSD} formatter={v => formatUSD(v, { compact: true })} variant="info" />
                <MetricCard label="vs FY Start Baseline" value={incrementResult.usdDiff} formatter={v => formatUSD(v, { showSign: true })} variant={incrementResult.usdDiff <= 0 ? 'gain' : 'loss'} />
                <div className="bg-cream-dark border border-ink-light/20 rounded-xl p-4">
                  <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ink-light mb-2">Verdict</p>
                  <StatusTag variant={incrementResult.usdDiff < -10 ? 'savings' : Math.abs(incrementResult.usdDiff) <= 50 ? 'breakeven' : 'costlier'}>
                    {incrementResult.usdDiff < -10 ? 'Still cheaper' : Math.abs(incrementResult.usdDiff) <= 50 ? 'Break-even' : 'Costlier than start'}
                  </StatusTag>
                </div>
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
                      <th className="text-left px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">Increment %</th>
                      <th className="text-right px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">Annual INR</th>
                      <th className="text-right px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">Annual USD</th>
                      <th className="text-right px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">Monthly USD</th>
                      <th className="text-right px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">vs Baseline</th>
                      <th className="text-center px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider">Verdict</th>
                    </tr>
                  </thead>
                  <tbody>
                    {incrementTable.map((row, i) => (
                      <tr key={i} className={`${row.isBreakEven ? 'bg-info-light/50' : i % 2 === 0 ? '' : 'bg-cream/50'}`}>
                        <td className="px-3 py-2 font-medium text-ink">
                          {row.isBreakEven ? '★ ' : ''}
                          {formatPct(row.pct, {
                            decimals: row.isBreakEven ? 2 : 0
                          })}
                        </td>
                        <td className="px-3 py-2 text-right">{formatINR(row.newAnnualINR, { compact: true })}</td>
                        <td className="px-3 py-2 text-right">{formatUSD(row.newAnnualUSD, { compact: true })}</td>
                        <td className="px-3 py-2 text-right">{formatUSD(row.newAnnualUSD / 12)}</td>
                        <td className={`px-3 py-2 text-right font-medium ${row.usdDiff <= 0 ? 'text-gain' : 'text-loss'}`}>{formatUSD(row.usdDiff, { showSign: true })}</td>
                        <td className="px-3 py-2 text-center">
                          <StatusTag variant={row.verdict} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Increment Bar Chart */}
              <div className="mt-4">
                <IncrementBarChart
                  data={incrementTable.map(r => ({
                    label: `${r.pct.toFixed(0)}%`,
                    annualUSD: r.newAnnualUSD,
                    ...r
                  }))}
                  xKey="label"
                  barKey="annualUSD"
                  referenceValue={calc.totalBaselineUSD}
                  yFormatter={v => formatUSD(v, { compact: true })}
                  title="Annual USD at Each Increment %"
                  getBarColor={entry => {
                    if (entry.verdict === 'savings') return CHART_COLORS.gain;
                    if (entry.verdict === 'breakeven') return CHART_COLORS.amber;
                    return CHART_COLORS.loss;
                  }}
                />
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
