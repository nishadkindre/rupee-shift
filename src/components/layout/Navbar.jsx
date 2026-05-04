import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download } from 'lucide-react';
import RupeeShiftLogo from '../logo/RupeeShiftLogo';
import ExportButton from '../ui/ExportButton';
import { useAnimation } from '../../context/AnimationContext';
import { TRANSITIONS } from '../../utils/animations';

export default function Navbar({ onProject, onMethodology, onAbout, onExportExcel, onExportCSV }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { shouldAnimate } = useAnimation();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-ink-base/8 h-16 flex items-center px-4 md:px-8" style={{ boxShadow: '0 1px 0 0 rgba(24,22,18,0.07)' }}>
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">

        {/* Logo + Wordmark */}
        <a href="#top" className="flex items-end gap-2 group shrink-0" aria-label="RupeeShift home">
          {/* <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-rupee to-amber-deep flex items-center justify-center shadow-sm"> */}
            <RupeeShiftLogo size={28} className="text-white" />
          {/* </div> */}
          <span className="font-sans text-xl font-semibold tracking-tight text-ink-base">
            Rupee<span className="text-amber-rupee">Shift</span>
          </span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink onClick={() => document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth' })}>
            Scenarios
          </NavLink>
          {/* <NavLink onClick={onAbout}>Project</NavLink> */}
          <NavLink onClick={onMethodology}>Methodology</NavLink>
          <NavLink onClick={onProject}>About</NavLink>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <ExportButton onExportExcel={onExportExcel} onExportCSV={onExportCSV} />
        </div>

        {/* Mobile: export + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <ExportButton onExportExcel={onExportExcel} onExportCSV={onExportCSV} />
          <motion.button
            whileTap={shouldAnimate ? { scale: 0.94 } : {}}
            transition={TRANSITIONS.fast}
            onClick={() => setMobileOpen(v => !v)}
            className="w-9 h-9 flex items-center justify-center rounded-xl border border-ink-base/12 bg-surface-raised text-ink-muted hover:text-ink-base hover:border-ink-base/20 transition-colors"
            aria-label="Open navigation menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </motion.button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={TRANSITIONS.fast}
            className="absolute top-16 left-0 right-0 bg-white border-b border-ink-base/8 px-4 py-3 flex flex-col gap-1 shadow-lg"
          >
            <MobileNavLink onClick={() => { document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); }}>Scenarios</MobileNavLink>
            {/* <MobileNavLink onClick={() => { onAbout?.(); setMobileOpen(false); }}>Project</MobileNavLink> */}
            <MobileNavLink onClick={() => { onMethodology?.(); setMobileOpen(false); }}>Methodology</MobileNavLink>
            <MobileNavLink onClick={() => { onProject?.(); setMobileOpen(false); }}>About</MobileNavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="font-sans text-sm font-medium text-ink-muted hover:text-ink-base px-3 py-2 rounded-lg hover:bg-surface-subtle transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-rupee"
    >
      {children}
    </button>
  );
}

function MobileNavLink({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="font-sans text-sm font-medium text-ink-muted hover:text-ink-base text-left px-3 py-2.5 rounded-lg hover:bg-surface-subtle transition-colors w-full"
    >
      {children}
    </button>
  );
}
