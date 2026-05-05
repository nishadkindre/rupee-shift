export const TRANSITIONS = {
  fast: { duration: 0.15, ease: 'easeOut' },
  normal: { duration: 0.3, ease: 'easeOut' },
  slow: { duration: 0.5, ease: 'easeOut' },
  spring: { type: 'spring', stiffness: 300, damping: 30 },
  springGentle: { type: 'spring', stiffness: 120, damping: 20 }
};

export const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -24 },
    visible: { opacity: 1, x: 0 }
  },
  slideInRight: {
    hidden: { opacity: 0, x: 24 },
    visible: { opacity: 1, x: 0 }
  },
  staggerContainer: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
  },
  staggerItem: {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 }
  }
};
