import { motion } from 'framer-motion';
import { useAnimation } from '../../context/AnimationContext';
import { VARIANTS, TRANSITIONS } from '../../utils/animations';

export default function SectionCard({ children, className = '' }) {
  const { shouldAnimate } = useAnimation();

  const inner = (
    <div className={`bg-white border border-ink-base/8 rounded-2xl overflow-hidden shadow-card ${className}`}>
      {children}
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
      whileHover={{ y: -2, boxShadow: '0 8px 32px rgba(24,22,18,0.09)' }}
      className={`bg-white border border-ink-base/8 rounded-2xl overflow-hidden shadow-card ${className}`}
    >
      {children}
    </motion.div>
  );
}
