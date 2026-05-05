import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { useAnimation } from '../../context/AnimationContext';

export default function ErrorBanner({ message, onRetry }) {
  const { shouldAnimate } = useAnimation();

  return (
    <motion.div
      animate={shouldAnimate ? { x: [0, -6, 6, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
      className="flex items-start gap-3 bg-loss-light border border-loss/20 rounded-xl px-4 py-3"
      role="alert"
    >
      <AlertTriangle className="w-4 h-4 text-loss shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-sans text-sm text-loss font-medium">Could not load live rates.</p>
        <p className="font-sans text-xs text-loss/80 mt-0.5">{message || 'Showing approximate fallback values.'}</p>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="font-sans text-xs font-semibold text-loss border border-loss/30 rounded-lg px-3 py-1 hover:bg-loss/10 focus:outline-none focus:ring-2 focus:ring-loss">
          Retry
        </button>
      )}
    </motion.div>
  );
}
