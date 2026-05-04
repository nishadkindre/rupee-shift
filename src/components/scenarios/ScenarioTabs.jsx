import { motion } from 'framer-motion';
import { useAppContext } from '../../context/AppContext';
import { useAnimation } from '../../context/AnimationContext';
import { TRANSITIONS } from '../../utils/animations';

const SCENARIOS = [
  { key: 'subsidiary', label: 'Indian Subsidiary', emoji: '🏢', badge: 'Saves in USD', badgeClass: 'bg-gain-light text-gain' },
  { key: 'itExporter', label: 'IT Exporter', emoji: '💼', badge: 'Revenue uplift', badgeClass: 'bg-info-light text-info' },
  { key: 'freelancer', label: 'Freelancer', emoji: '💻', badge: 'Silent raise', badgeClass: 'bg-amber-light text-amber-rupee' },
  { key: 'inrEmployee', label: 'INR Employee', emoji: '👤', badge: 'USD erosion', badgeClass: 'bg-loss-light text-loss' },
];

export default function ScenarioTabs() {
  const { state, dispatch } = useAppContext();
  const { activeScenario } = state;
  const { shouldAnimate } = useAnimation();

  return (
    <div className="overflow-x-auto -mx-1 px-1 pb-1">
      <div className="flex gap-2 min-w-max">
        {SCENARIOS.map(({ key, label, emoji, badge, badgeClass }) => {
          const isActive = activeScenario === key;
          return (
            <motion.button
              key={key}
              onClick={() => dispatch({ type: 'SET_SCENARIO', payload: key })}
              whileTap={shouldAnimate ? { scale: 0.97 } : {}}
              transition={TRANSITIONS.fast}
              className={`relative flex flex-col items-start px-4 py-3.5 rounded-2xl border transition-all duration-200 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-rupee min-w-44 ${
                isActive
                  ? 'bg-ink-base text-white border-ink-base shadow-md'
                  : 'bg-white border-ink-base/10 text-ink-muted hover:border-ink-base/20 hover:bg-surface-subtle shadow-card'
              }`}
              aria-pressed={isActive}
              aria-label={`Select ${label} scenario`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base leading-none">{emoji}</span>
                <span className={`font-sans text-sm font-semibold leading-tight ${isActive ? 'text-white' : 'text-ink-base'}`}>
                  {label}
                </span>
              </div>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass} ${isActive ? 'opacity-90' : ''}`}>
                {badge}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
