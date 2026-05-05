import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';
import RupeeShiftLogo from '../logo/RupeeShiftLogo';
import { TRANSITIONS } from '../../utils/animations';

export default function AboutModal({ onClose }) {
  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="About RupeeShift">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={TRANSITIONS.fast} className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={TRANSITIONS.normal}
        className="relative bg-cream rounded-2xl shadow-2xl max-w-lg w-full"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream-dark">
          <div className="flex items-center gap-2">
            <RupeeShiftLogo size={24} />
            <h2 className="font-display text-xl text-ink">About RupeeShift</h2>
          </div>
          <button onClick={onClose} className="text-ink-muted hover:text-ink p-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-rupee" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-5">
          <p className="font-sans text-sm text-ink leading-relaxed">
            <strong>RupeeShift</strong> is an interactive tool that makes the invisible impact of USD/INR exchange rate movements visible — for businesses, exporters, freelancers, and employees.
          </p>

          <p className="font-sans text-sm text-ink-muted leading-relaxed">
            Currency fluctuations quietly affect every rupee you earn or spend when there's a USD link. RupeeShift quantifies that impact across four real-world scenarios, using actual ECB/RBI-proxied
            exchange rate data.
          </p>

          <div className="bg-cream-dark rounded-xl px-4 py-4 flex flex-col gap-2">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-light">Tech Stack</p>
            <div className="flex flex-wrap gap-2">
              {['React 19', 'Vite', 'Tailwind CSS v4', 'Recharts', 'Framer Motion', 'SheetJS', 'Lucide React', 'Frankfurter API'].map(tech => (
                <span key={tech} className="font-mono text-xs bg-cream text-ink border border-cream-dark px-2 py-0.5 rounded-md">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <p className="font-sans text-xs text-ink-muted leading-relaxed">
            This is a capstone project. All calculations are for informational and educational purposes only, and do not constitute financial advice.
          </p>

          <div className="flex items-center gap-4 pt-1">
            <a
              href="https://github.com/nishadkindre/rupeeshift"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-sans text-sm text-amber-rupee hover:text-amber-light transition-colors"
            >
              {/* <Github size={15} /> */}
              GitHub
              <ExternalLink size={11} className="opacity-60" />
            </a>
            <a href="https://github.com/nishadkindre" target="_blank" rel="noopener noreferrer" className="font-sans text-sm text-ink-muted hover:text-ink transition-colors">
              by Nishad Kindre
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
