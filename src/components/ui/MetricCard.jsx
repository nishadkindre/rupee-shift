import { motion } from 'framer-motion';
import { useAnimation } from '../../context/AnimationContext';
import { useCountUp } from '../../hooks/useCountUp';
import { VARIANTS, TRANSITIONS } from '../../utils/animations';

const variantConfig = {
  default: {
    value: 'text-ink-base',
    bg: 'bg-white',
    border: 'border-ink-base/10',
    dot: ''
  },
  gain: {
    value: 'text-gain',
    bg: 'bg-gain-light/60',
    border: 'border-gain/15',
    dot: 'bg-gain'
  },
  loss: {
    value: 'text-loss',
    bg: 'bg-loss-light/60',
    border: 'border-loss/15',
    dot: 'bg-loss'
  },
  info: {
    value: 'text-info',
    bg: 'bg-info-light/60',
    border: 'border-info/15',
    dot: 'bg-info'
  },
  amber: {
    value: 'text-amber-rupee',
    bg: 'bg-amber-light/60',
    border: 'border-amber-rupee/15',
    dot: 'bg-amber-rupee'
  }
};

function AnimatedValue({ value, formatter }) {
  const animated = useCountUp(typeof value === 'number' ? value : 0);
  if (typeof value === 'number' && formatter) {
    return <>{formatter(animated)}</>;
  }
  return <>{value}</>;
}

export default function MetricCard({ label, value, subNote, variant = 'default', formatter, animate = true }) {
  const { shouldAnimate } = useAnimation();
  const cfg = variantConfig[variant] || variantConfig.default;

  const content = (
    <div className={`${cfg.bg} border ${cfg.border} rounded-2xl p-4 h-full shadow-metric`}>
      <div className="flex items-center gap-1.5 mb-2.5">
        {cfg.dot && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} opacity-80`} />}
        <p className="font-sans text-xs font-semibold text-ink-muted uppercase tracking-wider">{label}</p>
      </div>
      <p className={`font-mono text-xl font-semibold ${cfg.value} leading-tight`}>{animate ? <AnimatedValue value={value} formatter={formatter} /> : formatter ? formatter(value) : value}</p>
      {subNote && <p className="font-sans text-xs text-ink-light mt-1.5 leading-snug">{subNote}</p>}
    </div>
  );

  if (!shouldAnimate) return content;

  return (
    <motion.div variants={VARIANTS.scaleIn} initial="hidden" animate="visible" transition={TRANSITIONS.normal} whileHover={{ y: -2, boxShadow: '0 6px 24px rgba(24,22,18,0.10)' }} className="h-full">
      {content}
    </motion.div>
  );
}
