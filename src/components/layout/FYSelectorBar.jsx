import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { FY_CONFIG, FY_ORDER } from '../../data/fyConfig';
import { formatRate } from '../../utils/formatters';
import { useAnimation } from '../../context/AnimationContext';
import { TRANSITIONS } from '../../utils/animations';
import { CalendarDays } from 'lucide-react';

export default function FYSelectorBar() {
  const { state, dispatch } = useAppContext();
  const { selectedFY, ratesData } = state;
  const { shouldAnimate } = useAnimation();
  const fyConfig = FY_CONFIG[selectedFY];

  const startRate = ratesData.fyStartRate;
  const endRate = ratesData.fyEndRate;
  const nextRate = state[`${selectedFY.toLowerCase()}Params`]?.nextFYRate || fyConfig?.nextYearStartRate;

  return (
    <div className="bg-white border-b border-ink-base/8 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">

        {/* Label with icon */}
        <div className="flex items-center gap-1.5 shrink-0">
          <CalendarDays className="w-3.5 h-3.5 text-ink-light" />
          <span className="font-sans text-xs font-semibold tracking-wider uppercase text-ink-light">
            Financial Year
          </span>
        </div>

        {/* FY Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FY_ORDER.map(fyKey => {
            const fy = FY_CONFIG[fyKey];
            const isActive = fyKey === selectedFY;
            return (
              <motion.button
                key={fyKey}
                onClick={() => dispatch({ type: 'SET_FY', payload: fyKey })}
                whileTap={shouldAnimate ? { scale: 0.96 } : {}}
                transition={TRANSITIONS.fast}
                className={`relative font-sans text-xs font-semibold px-3 py-1.5 rounded-full border transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-rupee ${
                  isActive
                    ? 'bg-amber-rupee text-white border-amber-rupee shadow-sm'
                    : 'border-ink-base/15 text-ink-muted bg-surface-raised hover:text-ink-base hover:border-ink-base/25 hover:bg-surface-subtle'
                }`}
                aria-pressed={isActive}
                aria-label={`Select ${fy.label}`}
              >
                {fy.shortLabel}
                {fy.isDefault && (
                  <span className={`ml-1 text-[10px] ${isActive ? 'opacity-80' : 'text-amber-rupee/60'}`}>★</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Rate display */}
        <div className="sm:ml-auto flex items-center gap-2 text-xs font-mono text-ink-light flex-wrap">
          {startRate && endRate ? (
            <>
              <span className="flex items-center gap-1">
                <span className="text-ink-faint">Apr</span>
                <span className="text-ink-muted font-medium">{formatRate(startRate)}</span>
              </span>
              <span className="text-ink-faint">→</span>
              <span className="flex items-center gap-1">
                <span className="text-ink-faint">Mar</span>
                <span className="text-ink-muted font-medium">{formatRate(endRate)}</span>
              </span>
              {nextRate && (
                <>
                  <span className="text-ink-faint/50 hidden sm:inline">·</span>
                  <span className="flex items-center gap-1 hidden sm:flex">
                    <span className="text-ink-faint">Next FY</span>
                    <span className="text-amber-rupee font-medium">{formatRate(nextRate)}</span>
                  </span>
                </>
              )}
            </>
          ) : (
            <span className="text-ink-faint">Loading rates…</span>
          )}
        </div>
      </div>
    </div>
  );
}
