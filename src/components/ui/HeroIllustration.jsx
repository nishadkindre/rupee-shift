import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

// FY 2025-26 approximate monthly USD/INR averages (Apr → Mar)
const FY_RATES = [85.63, 84.52, 84.9, 84.06, 84.55, 84.48, 85.86, 86.59, 86.83, 87.51, 87.92, 93.83];

const W = 316;
const H = 152;
const PX = 10;
const PY = 14;

function buildChart() {
  const lo = Math.min(...FY_RATES);
  const hi = Math.max(...FY_RATES);
  const span = hi - lo;
  const uw = W - PX * 2;
  const uh = H - PY * 2;

  const pts = FY_RATES.map((r, i) => [parseFloat((PX + (i / (FY_RATES.length - 1)) * uw).toFixed(2)), parseFloat((PY + uh - ((r - lo) / span) * uh).toFixed(2))]);

  let line = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const mx = parseFloat(((pts[i - 1][0] + pts[i][0]) / 2).toFixed(2));
    line += ` C${mx} ${pts[i - 1][1]} ${mx} ${pts[i][1]} ${pts[i][0]} ${pts[i][1]}`;
  }

  const area = `${line} L${pts[pts.length - 1][0]} ${H} L${pts[0][0]} ${H} Z`;

  return { line, area, start: pts[0], end: pts[pts.length - 1] };
}

const { line, area, start, end } = buildChart();

export default function HeroIllustration() {
  return (
    <div className="relative select-none">
      {/* Ambient glow */}
      <div className="absolute -inset-16 rounded-full bg-amber-glow/50 blur-3xl pointer-events-none" />

      {/* Main analytics card */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white border border-ink-base/8 rounded-3xl p-5 w-[356px] shadow-[0_24px_64px_-16px_rgba(24,22,18,0.15),0_8px_24px_-8px_rgba(24,22,18,0.06)]"
      >
        {/* Card header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-ink-light mb-1.5">USD / INR · FY 2025–26</p>
            <p className="font-mono text-[30px] font-semibold text-ink-base leading-none tracking-tight">₹93.83</p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 2.1,
              duration: 0.4,
              ease: [0.34, 1.56, 0.64, 1]
            }}
            className="flex items-center gap-1.5 bg-loss-light text-loss border border-loss/15 px-2.5 py-1.5 rounded-full"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-sans text-xs font-bold">+9.58%</span>
          </motion.div>
        </div>

        {/* SVG chart */}
        <div className="rounded-2xl overflow-hidden border border-ink-base/5 bg-cream/60 mb-4">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full block" height={H}>
            <defs>
              <linearGradient id="hi-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C8702A" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#C8702A" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Subtle dashed grid lines */}
            {[0.33, 0.66].map(t => (
              <line
                key={t}
                x1={PX}
                x2={W - PX}
                y1={parseFloat((PY + (H - PY * 2) * (1 - t)).toFixed(1))}
                y2={parseFloat((PY + (H - PY * 2) * (1 - t)).toFixed(1))}
                stroke="#181612"
                strokeOpacity="0.05"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
            ))}

            {/* Gradient area fill */}
            <path d={area} fill="url(#hi-fill)" />

            {/* Animated line */}
            <motion.path
              d={line}
              fill="none"
              stroke="#C8702A"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.0, ease: 'easeInOut', delay: 0.3 }}
            />

            {/* Start dot */}
            <motion.circle
              cx={start[0]}
              cy={start[1]}
              r={4}
              fill="#C8C3BC"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.4,
                duration: 0.3,
                ease: [0.34, 1.56, 0.64, 1]
              }}
            />

            {/* End dot with pulse ring */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }}>
              <motion.circle
                cx={end[0]}
                cy={end[1]}
                r={8}
                fill="none"
                stroke="#C8702A"
                strokeWidth="1.5"
                animate={{ r: [7, 15], opacity: [0.5, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  repeatDelay: 1.0,
                  ease: 'easeOut'
                }}
              />
              <circle cx={end[0]} cy={end[1]} r={5} fill="#C8702A" />
              <circle cx={end[0]} cy={end[1]} r={2} fill="white" />
            </motion.g>
          </svg>
        </div>

        {/* Footer: start → end */}
        <div className="flex items-center justify-between px-0.5">
          <div>
            <p className="font-sans text-[10px] text-ink-light leading-none mb-1">Apr 2025</p>
            <p className="font-mono text-sm font-medium text-ink-muted">₹85.63</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-px bg-ink-faint/30" />
            <span className="font-sans text-[9px] tracking-widest uppercase text-ink-faint">FY 25–26</span>
            <div className="w-10 h-px bg-ink-faint/30" />
          </div>
          <div className="text-right">
            <p className="font-sans text-[10px] text-ink-light leading-none mb-1">Mar 2026</p>
            <p className="font-mono text-sm font-semibold text-amber-rupee">₹93.83</p>
          </div>
        </div>
      </motion.div>

      {/* Floating chip: Break-Even Hike */}
      <motion.div
        // initial={{ opacity: 0, y: 12 }}
        // animate={{ opacity: 1, y: 0 }}
        // transition={{ delay: 0.75, duration: 0.5, ease: 'easeOut' }}
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-9 -right-4 bg-white border border-ink-base/8 rounded-2xl px-3.5 py-2.5 shadow-[0_8px_24px_-6px_rgba(24,22,18,0.13)]"
      >
        <p className="font-sans text-[9px] font-bold uppercase tracking-widest text-ink-light mb-0.5">Break-Even Hike</p>
        <p className="font-mono text-[17px] font-semibold text-amber-rupee leading-none">+10.94%</p>
      </motion.div>

      {/* Floating chip: Data source indicator */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5, ease: 'easeOut' }}
        className="absolute -bottom-4 left-6 bg-surface-subtle border border-ink-base/6 rounded-xl px-3 py-2 flex items-center gap-2 shadow-[0_4px_12px_-4px_rgba(24,22,18,0.08)]"
      >
        <motion.div className="w-1.5 h-1.5 rounded-full bg-gain shrink-0" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2.0, repeat: Infinity, ease: 'easeInOut' }} />
        <span className="font-sans text-[10px] text-ink-muted whitespace-nowrap">ECB · Daily fixing rates</span>
      </motion.div>
    </div>
  );
}
