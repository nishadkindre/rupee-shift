import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import { useAnimation } from '../../context/AnimationContext';
import { TRANSITIONS } from '../../utils/animations';

export default function ExportButton({ onExportExcel, onExportCSV }) {
  const [open, setOpen] = useState(false);
  const { shouldAnimate } = useAnimation();
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileTap={shouldAnimate ? { scale: 0.97 } : {}}
        transition={TRANSITIONS.fast}
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 bg-amber-rupee hover:bg-amber-deep text-white font-sans text-sm font-semibold px-3.5 py-2 rounded-xl transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-rupee focus-visible:ring-offset-2 shadow-sm"
        aria-label="Export report"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Export</span>
        <ChevronDown className={`w-3 h-3 opacity-80 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </motion.button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={TRANSITIONS.fast}
            className="absolute right-0 mt-2 w-52 bg-white border border-ink-base/10 rounded-2xl shadow-card-hover overflow-hidden z-50"
          >
            <button
              onClick={() => {
                onExportExcel?.();
                setOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-ink-base hover:bg-surface-subtle font-sans text-left transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-gain-light flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-3.5 h-3.5 text-gain" />
              </div>
              <span>Export as Excel</span>
            </button>
            <button
              onClick={() => {
                onExportCSV?.();
                setOpen(false);
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm text-ink-base hover:bg-surface-subtle font-sans text-left border-t border-ink-base/6 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-info-light flex items-center justify-center shrink-0">
                <FileText className="w-3.5 h-3.5 text-info" />
              </div>
              <span>Export as CSV</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
