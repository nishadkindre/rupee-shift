import { motion } from 'framer-motion';
import { useAnimation } from '../../context/AnimationContext';

export default function LoadingSpinner({ text = 'Loading exchange rates…' }) {
  const { shouldAnimate } = useAnimation();
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <motion.div
        animate={shouldAnimate ? { rotate: 360 } : {}}
        transition={{ repeat: Infinity, duration: 0.85, ease: 'linear' }}
        className="w-9 h-9 border-2 border-surface-subtle border-t-amber-rupee rounded-full"
      />
      <p className="font-sans text-sm text-ink-light">{text}</p>
    </div>
  );
}
