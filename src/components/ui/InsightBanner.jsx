import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';
import { useAnimation } from '../../context/AnimationContext';
import { VARIANTS, TRANSITIONS } from '../../utils/animations';

export default function InsightBanner({ children, className = '' }) {
  const { shouldAnimate } = useAnimation();

  const inner = (
    <div className={`relative bg-amber-glow/60 border border-amber-rupee/20 rounded-2xl px-5 py-4 text-sm text-ink-base leading-relaxed ${className}`}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <div className="w-7 h-7 rounded-lg bg-amber-rupee/10 border border-amber-rupee/20 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-amber-rupee" />
          </div>
        </div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );

  if (!shouldAnimate) return inner;

  return (
    <motion.div
      variants={VARIANTS.fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      transition={TRANSITIONS.normal}
      className={`relative bg-amber-glow/60 border border-amber-rupee/20 rounded-2xl px-5 py-4 text-sm text-ink-base leading-relaxed ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">
          <div className="w-7 h-7 rounded-lg bg-amber-rupee/10 border border-amber-rupee/20 flex items-center justify-center">
            <Lightbulb className="w-3.5 h-3.5 text-amber-rupee" />
          </div>
        </div>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </motion.div>
  );
}
