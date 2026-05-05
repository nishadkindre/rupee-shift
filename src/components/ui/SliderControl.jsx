import { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAnimation } from '../../context/AnimationContext';

export default function SliderControl({ label, min = 0, max = 50, step = 1, value, onChange, unit = '%' }) {
  const { shouldAnimate } = useAnimation();
  const rangeRef = useRef(null);

  // Update CSS custom property for progress fill
  useEffect(() => {
    if (rangeRef.current) {
      const pct = ((value - min) / (max - min)) * 100;
      rangeRef.current.style.setProperty('--range-progress', `${pct}%`);
    }
  }, [value, min, max]);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <label className="font-sans text-sm font-semibold text-ink-base">{label}</label>
        <AnimatePresence mode="wait">
          <motion.span
            key={value}
            animate={shouldAnimate ? { scale: [1, 1.12, 1] } : {}}
            transition={{ duration: 0.18 }}
            className="font-mono text-sm font-bold bg-amber-light text-amber-rupee border border-amber-rupee/25 rounded-full px-3 py-0.5 min-w-[3rem] text-center"
          >
            {value}
            {unit}
          </motion.span>
        </AnimatePresence>
      </div>
      <div className="relative py-1">
        <input
          ref={rangeRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-cream-deeper rounded-full appearance-none cursor-pointer focus:outline-none"
          aria-label={label}
        />
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="font-mono text-xs text-ink-faint">
          {min}
          {unit}
        </span>
        <span className="font-mono text-xs text-ink-faint">
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}
