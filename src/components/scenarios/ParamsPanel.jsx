import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { useAnimation } from '../../context/AnimationContext';
import { VARIANTS, TRANSITIONS } from '../../utils/animations';

export default function ParamsPanel({ children, title = 'Parameters' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { shouldAnimate } = useAnimation();

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden mb-4">
        <motion.button
          whileTap={shouldAnimate ? { scale: 0.97 } : {}}
          transition={TRANSITIONS.fast}
          onClick={() => setMobileOpen(v => !v)}
          className="flex items-center justify-between w-full gap-2 text-sm font-sans font-semibold text-ink-base border border-ink-base/12 rounded-xl px-4 py-3 bg-white shadow-card focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-rupee"
          aria-expanded={mobileOpen}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-rupee" />
            <span>{mobileOpen ? 'Hide Parameters' : 'Adjust Parameters'}</span>
          </div>
          {mobileOpen ? <ChevronUp className="w-4 h-4 text-ink-muted" /> : <ChevronDown className="w-4 h-4 text-ink-muted" />}
        </motion.button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={TRANSITIONS.normal}
              className="overflow-hidden"
            >
              <div className="mt-2 bg-white border border-ink-base/8 rounded-2xl p-5 shadow-card">
                <PanelContent title={title}>{children}</PanelContent>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop panel */}
      <div className="hidden md:block">
        <div className="bg-white border border-ink-base/8 rounded-2xl p-5 sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto shadow-panel">
          <PanelContent title={title}>{children}</PanelContent>
        </div>
      </div>
    </>
  );
}

function PanelContent({ title, children }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-5 pb-4 border-b border-ink-base/8">
        <SlidersHorizontal className="w-4 h-4 text-amber-rupee" />
        <p className="font-sans text-xs font-bold tracking-wider uppercase text-ink-muted">{title}</p>
      </div>
      <div className="flex flex-col gap-5">{children}</div>
    </>
  );
}

export function ParamField({ label, children, hint }) {
  return (
    <div>
      <label className="font-sans text-sm font-semibold text-ink-base block mb-2">{label}</label>
      {children}
      {hint && <p className="font-sans text-xs text-ink-light mt-1.5">{hint}</p>}
    </div>
  );
}

export function ParamInput({ value, onChange, prefix, suffix, min, step = 'any', type = 'number' }) {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3.5 font-mono text-sm text-ink-muted pointer-events-none select-none">{prefix}</span>
      )}
      <input
        type={type}
        value={value}
        min={min}
        step={step}
        onChange={e => onChange(type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value)}
        className={`w-full font-mono text-sm bg-surface-subtle border border-ink-base/12 rounded-xl py-2.5 focus:outline-none focus:border-amber-rupee focus:ring-2 focus:ring-amber-rupee/20 text-ink-base transition-all duration-150 ${prefix ? 'pl-9 pr-3' : 'px-3.5'} ${suffix ? 'pr-12' : ''}`}
      />
      {suffix && (
        <span className="absolute right-3.5 font-mono text-sm text-ink-muted pointer-events-none select-none">{suffix}</span>
      )}
    </div>
  );
}
