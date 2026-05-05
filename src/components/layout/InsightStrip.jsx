import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { FY_CONFIG } from '../../data/fyConfig';
import { formatRate, formatPct, formatINR, formatUSD } from '../../utils/formatters';
import { VARIANTS, TRANSITIONS } from '../../utils/animations';

export default function InsightStrip() {
  const { state } = useAppContext();
  const { ratesData, selectedFY, activeScenario, subsidiaryParams, itExporterParams, freelancerParams, inrEmployeeParams } = state;
  const fyConfig = FY_CONFIG[selectedFY];

  const insights = useMemo(() => {
    const { fyStartRate, fyEndRate } = ratesData;
    if (!fyStartRate || !fyEndRate) return [];

    const appreciationPct = ((fyEndRate - fyStartRate) / fyStartRate) * 100;
    const list = [
      {
        id: 'rate-move',
        label: 'FX Movement',
        text: `The rupee weakened ${formatPct(Math.abs(appreciationPct))} against the dollar in ${fyConfig?.label} — from ${formatRate(fyStartRate)} to ${formatRate(fyEndRate)}.`,
        color: 'text-loss',
        bg: 'bg-loss-light/60'
      },
      {
        id: 'break-even',
        label: 'Break-Even Hike',
        text: `An INR employee needed a ${formatPct(appreciationPct)} salary raise just to maintain the same USD purchasing power as April ${fyConfig?.startDate?.slice(0, 4)}.`,
        color: 'text-amber-rupee',
        bg: 'bg-amber-light/50'
      }
    ];

    if (activeScenario === 'subsidiary') {
      list.push({
        id: 'subsidiary-insight',
        label: 'Subsidiary Impact',
        text: `On a ${formatINR(subsidiaryParams.annualINR, { compact: true })} payroll, a ${formatPct(appreciationPct)} FX shift means your dollar-denominated cost dropped by roughly ${formatPct(appreciationPct)} even if rupee costs held flat.`,
        color: 'text-gain',
        bg: 'bg-gain-light/50'
      });
    }

    if (activeScenario === 'itExporter') {
      list.push({
        id: 'exporter-insight',
        label: 'Exporter Margin',
        text: `IT exporters collecting $${(itExporterParams.annualUSD / 1_000).toFixed(0)}k annually saw silent margin expansion of ${formatPct(appreciationPct)} — no new contracts, no pricing renegotiation.`,
        color: 'text-info',
        bg: 'bg-info-light/50'
      });
    }

    if (activeScenario === 'freelancer') {
      const invisibleRaise = (freelancerParams.monthlyUSD * fyEndRate - freelancerParams.monthlyUSD * fyStartRate) * 12;
      list.push({
        id: 'freelancer-insight',
        label: 'Invisible Raise',
        text: `Your ${formatUSD(freelancerParams.monthlyUSD)}/month billing delivered ${formatINR(invisibleRaise, { compact: true })} extra INR this year — an invisible raise you never asked for.`,
        color: 'text-amber-rupee',
        bg: 'bg-amber-light/50'
      });
    }

    if (activeScenario === 'inrEmployee') {
      const erosionUSD = (inrEmployeeParams.monthlyINR / fyStartRate - inrEmployeeParams.monthlyINR / fyEndRate) * 12;
      list.push({
        id: 'employee-insight',
        label: 'USD Erosion',
        text: `Your ${formatINR(inrEmployeeParams.monthlyINR)}/month salary lost ${formatUSD(erosionUSD)} in annualised USD value over ${fyConfig?.label} — without any pay cut.`,
        color: 'text-loss',
        bg: 'bg-loss-light/60'
      });
    }

    list.push({
      id: 'data-source',
      label: 'Data Source',
      text: `Exchange rates sourced from the European Central Bank via Frankfurter API. Monthly averages computed from daily fixing rates.`,
      color: 'text-ink-light',
      bg: 'bg-surface-subtle'
    });

    return list;
  }, [ratesData, selectedFY, activeScenario, subsidiaryParams, itExporterParams, freelancerParams, inrEmployeeParams, fyConfig]);

  return (
    <div className="bg-cream-dark py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 mb-8">
          <Sparkles className="w-4 h-4 text-amber-rupee" />
          <p className="font-sans text-xs font-bold tracking-wider uppercase text-ink-light">Key Insights</p>
        </div>
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {insights.map(insight => (
            <motion.div key={insight.id} variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal} className={`${insight.bg || 'bg-surface-subtle'} rounded-2xl p-5 border border-ink-base/8`}>
              <span className={`font-sans text-xs font-bold uppercase tracking-wider ${insight.color || 'text-white/60'} mb-2 block`}>{insight.label}</span>
              <p className="font-sans text-sm text-ink-muted leading-relaxed">{insight.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
