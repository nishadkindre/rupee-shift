import { motion } from 'framer-motion';
import { ExternalLink, GitBranch } from 'lucide-react';
import RupeeShiftLogo from '../logo/RupeeShiftLogo';
import { VARIANTS, TRANSITIONS } from '../../utils/animations';

export default function Footer() {
  return (
    <footer className="bg-cream-deeper text-ink-base border-t border-ink-base/10 pt-14 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={VARIANTS.staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12"
        >
          {/* Brand */}
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal} className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center gap-2">
              {/* <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-rupee to-amber-deep flex items-center justify-center"> */}
                <RupeeShiftLogo size={24} />
              {/* </div> */}
              <span className="font-sans text-base font-semibold tracking-tight">
                Rupee<span className="text-amber-rupee">Shift</span>
              </span>
            </div>
            <p className="font-sans text-sm text-ink-muted leading-relaxed max-w-sm">
              Visualising the silent impact of USD/INR exchange rate movements on Indian businesses and professionals. Real numbers, real decisions.
            </p>
            <a
              href="https://github.com/nishadkindre/rupee-shift"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm text-ink-muted hover:text-ink-base transition-colors duration-150 w-fit"
            >
              <GitBranch size={14} />
              View on GitHub
              <ExternalLink size={11} className="text-amber-600" />
            </a>
          </motion.div>

          {/* Data Sources */}
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal} className="flex flex-col gap-3">
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-ink-light mb-1">Data Sources</p>
            <a
              href="https://www.frankfurter.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-sans text-sm text-ink-muted hover:text-ink-base transition-colors"
            >
              Frankfurter API
              <ExternalLink size={11} className="opacity-60" />
            </a>
            <p className="font-sans text-xs text-ink-light leading-relaxed">
              Exchange rates published by the European Central Bank. Daily USD/INR fixing rates, monthly averaged.
            </p>
          </motion.div>

          {/* About */}
          <motion.div variants={VARIANTS.staggerItem} transition={TRANSITIONS.normal} className="flex flex-col gap-3">
            <p className="font-sans text-xs font-bold uppercase tracking-wider text-ink-light mb-1">About</p>
            <p className="font-sans text-xs text-ink-muted leading-relaxed">
              A project built to make FX impact visible and understandable for everyday financial decisions.
            </p>
            <a
              href="https://github.com/nishadkindre"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm text-amber-rupee hover:text-amber-deep transition-colors"
            >
              @nishadkindre
            </a>
          </motion.div>
        </motion.div>

        <div className="border-t border-ink-base/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-sans text-xs text-ink-light">
            © {new Date().getFullYear()} RupeeShift. For informational purposes only — not financial advice.
          </p>
          <p className="font-sans text-xs text-ink-light">
            Made with <span aria-label="love" role="img">💖</span> by{' '}
            <a
              href="https://github.com/nishadkindre"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-rupee hover:text-amber-deep transition-colors"
            >
              Nishad Kindre
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

