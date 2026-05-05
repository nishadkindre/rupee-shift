import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import HeroIllustration from '../components/ui/HeroIllustration';
import { useAppContext } from '../context/AppContext';
import { FY_CONFIG } from '../data/fyConfig';
import { formatRate, formatPct } from '../utils/formatters';
import { useAnimation } from '../context/AnimationContext';
import { VARIANTS, TRANSITIONS } from '../utils/animations';

export default function HeroSection() {
  const { state } = useAppContext();
  const { selectedFY, ratesData } = state;
  const fyConfig = FY_CONFIG[selectedFY];
  const { shouldAnimate } = useAnimation();

  const startYear = fyConfig?.startDate?.slice(0, 4) || '2025';
  const endYear = fyConfig?.endDate?.slice(0, 4) || '2026';
  const fyStartRate = ratesData.fyStartRate;
  const fyEndRate = ratesData.fyEndRate;

  const appreciationPct = useMemo(() => {
    if (!fyStartRate || !fyEndRate) return null;
    return ((fyEndRate - fyStartRate) / fyStartRate) * 100;
  }, [fyStartRate, fyEndRate]);

  const breakEvenPct = useMemo(() => {
    const nextRate = fyConfig?.nextYearStartRate;
    if (!fyStartRate || !nextRate) return null;
    return ((nextRate - fyStartRate) / fyStartRate) * 100;
  }, [fyStartRate, fyConfig]);

  const isDepreciation = appreciationPct !== null && appreciationPct > 0;

  const stats = [
    {
      id: 'start',
      label: 'FY Start Rate',
      value: fyStartRate ? formatRate(fyStartRate) : '—',
      sub: `Apr ${startYear}`,
      icon: <Activity className="w-4 h-4" />,
      color: 'text-ink-base',
      bg: 'bg-surface-subtle'
    },
    {
      id: 'end',
      label: 'FY End Rate',
      value: fyEndRate ? formatRate(fyEndRate) : '—',
      sub: `Mar ${endYear}`,
      icon: <Activity className="w-4 h-4" />,
      color: 'text-ink-base',
      bg: 'bg-surface-subtle'
    },
    {
      id: 'move',
      label: 'FX Movement',
      value: appreciationPct !== null ? formatPct(appreciationPct, { showSign: true }) : '—',
      sub: isDepreciation ? 'Rupee weakened' : 'Rupee strengthened',
      icon: isDepreciation ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />,
      color: isDepreciation ? 'text-loss' : 'text-gain',
      bg: isDepreciation ? 'bg-loss-light' : 'bg-gain-light'
    },
    {
      id: 'breakeven',
      label: 'Break-Even Hike',
      value: breakEvenPct !== null ? formatPct(breakEvenPct) : '—',
      sub: 'Needed to hold USD value',
      icon: <TrendingUp className="w-4 h-4" />,
      color: 'text-amber-rupee',
      bg: 'bg-amber-light'
    }
  ];

  return (
    <section id="top" className="relative overflow-hidden bg-cream px-4 md:px-8 pt-14 pb-20">
      {/* Decorative background blobs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-amber-glow/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-gain-glow/20 blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">
          <div>
            {/* Eyebrow badge */}
            <motion.div
              variants={VARIANTS.fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...TRANSITIONS.normal, delay: 0.05 }}
              className="inline-flex items-center gap-2 bg-amber-light border border-amber-rupee/20 text-amber-rupee font-sans text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 tracking-wide"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-rupee animate-pulse" />
              FY {startYear}–{endYear} · USD/INR Impact Analysis
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={VARIANTS.fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...TRANSITIONS.slow, delay: 0.1 }}
              className="font-display text-4xl md:text-6xl tracking-tight text-ink-base leading-[1.1] mb-5 max-w-3xl"
            >
              The dollar moved.
              <br />
              <span className="text-amber-rupee italic">Did</span> your numbers?
            </motion.h1>

            {/* Sub-copy */}
            <motion.p
              variants={VARIANTS.fadeUp}
              initial="hidden"
              animate="visible"
              transition={{ ...TRANSITIONS.normal, delay: 0.2 }}
              className="font-sans text-base text-ink-muted leading-relaxed max-w-2xl mb-10"
            >
              RupeeShift quantifies exactly how USD/INR exchange rate movement in <span className="text-ink-base font-medium">{fyConfig?.label}</span> affected your costs, revenues, or salary — in
              real rupee and dollar terms.
              {fyStartRate && fyEndRate && (
                <>
                  {' '}
                  The rupee moved from <span className="font-mono font-medium text-ink-base">{formatRate(fyStartRate)}</span> to{' '}
                  <span className="font-mono font-medium text-ink-base">{formatRate(fyEndRate)}</span> — a shift most people felt but couldn't quantify.
                </>
              )}
            </motion.p>

            {/* Stats grid */}
            <motion.div variants={VARIANTS.fadeUp} initial="hidden" animate="visible" transition={{ ...TRANSITIONS.normal, delay: 0.28 }} className="grid grid-cols-2 gap-3">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.id}
                  initial={shouldAnimate ? { opacity: 0, y: 16 } : {}}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.3 + i * 0.06,
                    duration: 0.4,
                    ease: 'easeOut'
                  }}
                  className="bg-white rounded-2xl border border-ink-base/8 p-4 flex flex-col gap-2 shadow-card hover:shadow-card-hover transition-shadow duration-200"
                >
                  <div className={`inline-flex items-center gap-1.5 ${stat.color} ${stat.bg} rounded-lg px-2 py-1 w-fit`}>
                    {stat.icon}
                    <span className="font-sans text-xs font-semibold">{stat.label}</span>
                  </div>
                  <p className={`font-mono text-lg md:text-xl font-semibold ${stat.color} leading-tight`}>{stat.value}</p>
                  <p className="font-sans text-xs text-ink-light">{stat.sub}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right: Illustration */}
          <div className="hidden lg:flex items-center justify-center py-10">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
