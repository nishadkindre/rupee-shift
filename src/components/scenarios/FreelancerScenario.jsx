import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { FY_CONFIG } from '../../data/fyConfig';
import { calcFreelancer, calcFreelancerRateCard, calcFreelancerRateCardTable } from '../../utils/calculations';
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

export default function FreelancerScenario() {
  const { state, dispatch } = useAppContext();
  const { freelancerParams, ratesData, selectedFY } = state;
  const fyConfig = FY_CONFIG[selectedFY];

  const fyStartRate = ratesData.fyStartRate;
  const fyEndRate = ratesData.fyEndRate;
  const nextFYRate = freelancerParams.nextFYRate ?? fyConfig?.nextYearStartRate ?? 90;
  const monthKeys = useMemo(() => getFYMonthKeys(fyConfig), [fyConfig]);

  const calc = useMemo(() => {
    if (!fyStartRate || !fyEndRate) return null;
    return calcFreelancer({
      monthlyUSD: freelancerParams.monthlyUSD,
      monthlyAverages: ratesData.monthlyAverages,
      fyStartRate,
      fyEndRate,
      fyConfig
    });
  }, [freelancerParams.monthlyUSD, ratesData.monthlyAverages, fyStartRate, fyEndRate, fyConfig]);

  const rateCardResult = useMemo(() => {
    if (!fyStartRate) return null;
    return calcFreelancerRateCard({
      monthlyUSD: freelancerParams.monthlyUSD,
      fyStartRate,
      nextFYRate,
      increasePct: freelancerParams.rateIncreasePct
    });
  }, [freelancerParams, fyStartRate, nextFYRate]);

  const rateCardTable = useMemo(() => {
    if (!fyStartRate) return [];
    return calcFreelancerRateCardTable({
      monthlyUSD: freelancerParams.monthlyUSD,
      fyStartRate,
      nextFYRate
    });
  }, [freelancerParams.monthlyUSD, fyStartRate, nextFYRate]);

  if (!calc) return null;
  const startYear = fyConfig?.startDate?.slice(0, 4) || '2024';
  const endYear = fyConfig?.endDate?.slice(0, 4) || '2025';

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="lg:w-[30%] lg:sticky lg:top-20 self-start">
        <ParamsPanel title="Scenario 3 of 4 · Freelancer">
          <ParamField label="Monthly billing (USD)">
            <ParamInput
              value={freelancerParams.monthlyUSD}
              onChange={v =>
                dispatch({
                  type: 'UPDATE_FREELANCER_PARAMS',
                  payload: { monthlyUSD: v }
                })
              }
              prefix="$"
              min={0}
            />
          </ParamField>

          <ParamField label="When do you convert?">
            <div className="flex flex-col gap-2">
              {[
                { key: 'same_month', label: 'Same month' },
                { key: 'end_of_fy', label: 'End of FY (hold all year)' }
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() =>
                    dispatch({
                      type: 'UPDATE_FREELANCER_PARAMS',
                      payload: { conversionTiming: opt.key }
                    })
                  }
                  className={`text-xs font-sans py-2 px-3 rounded-lg border text-left transition-colors ${
                    freelancerParams.conversionTiming === opt.key ? 'bg-ink text-cream border-ink' : 'border-ink-light/30 text-ink-muted hover:border-ink-muted'
                  } focus:outline-none focus:ring-2 focus:ring-amber-rupee`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </ParamField>

          <ParamField label="Projected rate next FY (₹/$)">
            <ParamInput
              value={nextFYRate}
              onChange={v =>
                dispatch({
                  type: 'UPDATE_FREELANCER_PARAMS',
                  payload: { nextFYRate: v }
                })
              }
              suffix="₹/$"
              min={0}
            />
          </ParamField>

          <SliderControl
            label="USD rate increase you plan to ask for"
            min={0}
            max={50}
            value={freelancerParams.rateIncreasePct}
            onChange={v =>
              dispatch({
                type: 'UPDATE_FREELANCER_PARAMS',
                payload: { rateIncreasePct: v }
              })
            }
          />
        </ParamsPanel>
      </div>

      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <div>
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ink-light mb-1">Scenario 3 of 4</p>
          <h2 className="font-display text-2xl md:text-3xl tracking-tight text-ink">Freelancer</h2>
          <p className="font-sans text-sm text-ink-muted mt-1">You invoice in USD, spend in INR. Every rupee that falls against the dollar is an invisible income increase.</p>
        </div>

        <InsightBanner>
          Your <strong className="font-mono">{formatUSD(freelancerParams.monthlyUSD)}/month</strong> billing delivered{' '}
          <strong className="font-mono text-gain">{formatINR(calc.actualAnnualINR, { compact: true })}</strong> in INR this year —{' '}
          <strong className="font-mono text-gain">{formatINR(calc.annualFXUplift, { compact: true })}</strong> more than the{' '}
          <strong className="font-mono">{formatINR(calc.baselineAnnualINR, { compact: true })}</strong> you'd have earned at the April {startYear} rate of{' '}
          <strong className="font-mono">{formatRate(fyStartRate)}</strong>. You never negotiated for this.
        </InsightBanner>

        <motion.div variants={VARIANTS.staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="Annual FX Uplift" value={calc.annualFXUplift} formatter={v => formatINR(v, { compact: true })} variant="gain" />
          </motion.div>
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="Actual INR Income" value={calc.actualAnnualINR} formatter={v => formatINR(v, { compact: true })} variant="info" />
          </motion.div>
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard
              label={freelancerParams.conversionTiming === 'end_of_fy' ? 'Hold & Convert INR' : 'Baseline INR'}
              value={freelancerParams.conversionTiming === 'end_of_fy' ? calc.holdAndConvertINR : calc.baselineAnnualINR}
              formatter={v => formatINR(v, { compact: true })}
              variant="amber"
            />
          </motion.div>
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal}>
            <MetricCard label="FX Appreciation" value={calc.fyAppreciationPct} formatter={v => formatPct(v, { showSign: true })} variant="amber" />
          </motion.div>
        </motion.div>

        {freelancerParams.conversionTiming === 'end_of_fy' && (
          <div className="bg-info-light/40 border border-info/20 rounded-xl px-4 py-3">
            <p className="font-sans text-xs text-info-muted leading-relaxed">
              <strong>Holding USD all year</strong> would have given you <strong className="font-mono">{formatINR(calc.holdAndConvertINR, { compact: true })}</strong> at the end-of-year rate of{' '}
              <strong className="font-mono">{formatRate(fyEndRate)}</strong> — capturing the full year's appreciation in one conversion.
            </p>
          </div>
        )}

        <SectionCard>
          <div className="p-5">
            <MonthlyBarChart
              data={calc.monthlyData}
              barKey="inrReceived"
              baselineKey="baselineINR"
              lineKey="uplift"
              barLabel="INR Received"
              baselineLabel="Baseline INR"
              lineLabel="Monthly Uplift (₹)"
              yFormatter={v => formatINR(v, { compact: true })}
              title="Monthly INR Income vs Baseline"
            />
          </div>
        </SectionCard>

        <SectionCard>
          <div className="p-5">
            <p className="font-sans text-sm font-semibold text-ink mb-3">Monthly Breakdown</p>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="bg-cream-dark">
                    {['Month', 'Rate (₹/$)', 'USD billed', 'INR received', 'Baseline INR', 'Monthly uplift (₹)', 'Cumulative uplift'].map(h => (
                      <th key={h} className={`${h === 'Month' ? 'text-left' : 'text-right'} px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {calc.monthlyData.map((row, i) => (
                    <tr key={row.monthKey} className={i % 2 === 0 ? '' : 'bg-cream/50'}>
                      <td className="px-3 py-2 font-sans text-sm text-ink font-medium">{monthKeyToLabel(row.monthKey)}</td>
                      <td className="px-3 py-2 text-right">{formatRate(row.rate)}</td>
                      <td className="px-3 py-2 text-right">{formatUSD(row.monthlyUSD)}</td>
                      <td className="px-3 py-2 text-right">{formatINR(row.inrReceived, { compact: true })}</td>
                      <td className="px-3 py-2 text-right text-ink-muted">{formatINR(row.baselineINR, { compact: true })}</td>
                      <td className={`px-3 py-2 text-right font-medium ${row.uplift >= 0 ? 'text-gain' : 'text-loss'}`}>{formatINR(row.uplift, { compact: true })}</td>
                      <td className="px-3 py-2 text-right text-ink-muted">{formatINR(row.cumulativeUplift, { compact: true })}</td>
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
                    <span className="text-ink-muted">INR: {formatINR(row.inrReceived, { compact: true })}</span>
                    <span className={row.uplift >= 0 ? 'text-gain' : 'text-loss'}>Uplift: {formatINR(row.uplift, { compact: true })}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Invisible raise callout */}
        <div className="bg-gain-light/60 border border-gain/20 rounded-2xl p-5">
          <p className="font-display text-lg text-gain mb-1">"The invisible raise"</p>
          <p className="font-sans text-sm text-ink leading-relaxed">
            You received <strong className="font-mono">{formatINR(calc.annualFXUplift, { compact: true })}</strong> more INR this year compared to what the same USD billing would have been worth in
            April {startYear}. You never negotiated for this. But you also never had to.
          </p>
          <p className="font-display text-lg text-amber-rupee mt-4 mb-1">"The reversion risk"</p>
          <p className="font-sans text-sm text-ink leading-relaxed">
            If the rate returns to <strong className="font-mono">{formatRate(fyStartRate)}</strong>, your current billing of{' '}
            <strong className="font-mono">{formatUSD(freelancerParams.monthlyUSD)}/month</strong> would be worth{' '}
            <strong className="font-mono">
              {formatINR(freelancerParams.monthlyUSD * fyStartRate, {
                compact: false
              })}
              /month
            </strong>{' '}
            —{' '}
            <strong className="font-mono text-loss">
              {formatINR((calc.monthlyData[calc.monthlyData.length - 1]?.inrReceived || 0) - freelancerParams.monthlyUSD * fyStartRate, { compact: false })}
            </strong>{' '}
            less than today.
          </p>
        </div>

        {/* Rate Card Section */}
        <div className="mt-2">
          <p className="font-sans text-xs font-semibold tracking-widest uppercase text-ink-light mb-2">Rate Card Analysis</p>
          <InsightBanner>
            A <strong className="font-mono">{freelancerParams.rateIncreasePct}%</strong> USD rate increase at the new exchange rate gives you{' '}
            <strong className="font-mono text-gain">
              {rateCardResult
                ? formatPct(rateCardResult.effectiveINRGrowth, {
                    showSign: true
                  })
                : '—'}
            </strong>{' '}
            more INR income than your FY start baseline — combining both the USD raise and the FX gain.
          </InsightBanner>

          <div className="mt-4 bg-white border border-ink-light/20 rounded-2xl p-5">
            <SliderControl
              label="USD rate card increase %"
              min={0}
              max={50}
              value={freelancerParams.rateIncreasePct}
              onChange={v =>
                dispatch({
                  type: 'UPDATE_FREELANCER_PARAMS',
                  payload: { rateIncreasePct: v }
                })
              }
            />
            {rateCardResult && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
                <MetricCard label="New Monthly USD" value={rateCardResult.newMonthlyUSD} formatter={v => formatUSD(v)} variant="info" />
                <MetricCard label="New Monthly INR" value={rateCardResult.newAnnualINR / 12} formatter={v => formatINR(v)} variant="gain" />
                <MetricCard label="vs FY Start Baseline" value={rateCardResult.newAnnualINR - rateCardResult.baselineAnnualINR} formatter={v => formatINR(v, { compact: true })} variant="gain" />
                <MetricCard label="Effective INR Growth" value={rateCardResult.effectiveINRGrowth} formatter={v => formatPct(v, { showSign: true })} variant="gain" />
              </div>
            )}
          </div>

          <SectionCard className="mt-4">
            <div className="p-5">
              <p className="font-sans text-sm font-semibold text-ink mb-3">Rate Card Scenario Table</p>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="bg-cream-dark">
                      {['USD increase', 'New USD/mo', 'New INR/mo', 'Annual INR uplift', 'Risk: INR/mo if rate reverts'].map(h => (
                        <th key={h} className={`${h === 'USD increase' ? 'text-left' : 'text-right'} px-3 py-2 font-sans text-xs font-semibold text-ink-light uppercase tracking-wider`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rateCardTable.map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? '' : 'bg-cream/50'}>
                        <td className="px-3 py-2 font-medium">{formatPct((row.newMonthlyUSD / freelancerParams.monthlyUSD - 1) * 100, { showSign: true })}</td>
                        <td className="px-3 py-2 text-right">{formatUSD(row.newMonthlyUSD)}</td>
                        <td className="px-3 py-2 text-right">{formatINR(row.newAnnualINR / 12)}</td>
                        <td className="px-3 py-2 text-right text-gain">
                          {formatINR(row.newAnnualINR - row.baselineAnnualINR, {
                            compact: true
                          })}
                        </td>
                        <td className="px-3 py-2 text-right text-amber-rupee">{formatINR(row.reversionAnnualINR / 12)}</td>
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
