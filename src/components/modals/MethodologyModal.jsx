import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { VARIANTS, TRANSITIONS } from '../../utils/animations';

export default function MethodologyModal({ onClose }) {
  useEffect(() => {
    const handleKey = e => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Methodology">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={TRANSITIONS.fast} className="absolute inset-0 bg-ink/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={TRANSITIONS.normal}
        className="relative bg-cream rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-cream border-b border-cream-dark z-10 flex items-center justify-between px-6 py-4">
          <h2 className="font-display text-xl text-ink">Methodology</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink p-1 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-rupee" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-7">
          <section>
            <h3 className="font-display text-lg text-ink mb-2">Exchange Rates</h3>
            <p className="font-sans text-sm text-ink-muted leading-relaxed">
              Daily USD/INR exchange rates are sourced from the{' '}
              <a href="https://www.frankfurter.app" target="_blank" rel="noopener noreferrer" className="text-amber-rupee hover:text-amber-light underline">
                Frankfurter API
              </a>
              , which publishes ECB (European Central Bank) fixing rates. Monthly averages are computed by taking the arithmetic mean of all daily rates within each calendar month. For any month where
              live data is unavailable, a pre-configured fallback rate is used.
            </p>
          </section>

          <section>
            <h3 className="font-display text-lg text-ink mb-2">Financial Year Definition</h3>
            <p className="font-sans text-sm text-ink-muted leading-relaxed">
              RupeeShift uses the Indian Financial Year convention: April 1 to March 31. "FY start rate" refers to the average rate for April of the FY's first year. "FY end rate" refers to the
              average rate for March of the FY's second year. The "next FY rate" is the projected or actual rate at the start of the following financial year.
            </p>
          </section>

          <section>
            <h3 className="font-display text-lg text-ink mb-2">Break-Even Calculation</h3>
            <p className="font-sans text-sm text-ink-muted leading-relaxed">
              The break-even salary increment is the percentage increase in INR salary required to maintain the same USD purchasing power as at the FY start. It equals the percentage change in the
              USD/INR rate over the FY period:
            </p>
            <div className="bg-cream-dark rounded-xl px-4 py-3 mt-2 font-mono text-sm text-ink">Break-Even % = ((FY End Rate − FY Start Rate) / FY Start Rate) × 100</div>
          </section>

          <section>
            <h3 className="font-display text-lg text-ink mb-2">Scenario Formulas</h3>
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-amber-rupee mb-1">Indian Subsidiary</p>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">
                  Monthly INR payroll is converted to USD at the month's average rate. Baseline uses the FY start rate for all months. The difference is the FX gain/loss from currency movement.
                </p>
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-amber-rupee mb-1">IT Exporter</p>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">
                  Monthly USD revenue is converted to INR at the month's average rate. The FX gain is the difference between actual INR and the baseline INR at FY start rate. Net margin impact
                  accounts for both INR cost base and FX gain.
                </p>
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-amber-rupee mb-1">Freelancer</p>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">
                  Monthly USD billing converted at each month's rate, versus a flat FY-start-rate baseline. The "invisible raise" is the annual uplift this produces. "Hold and convert" applies the
                  full year's USD balance to the FY-end rate.
                </p>
              </div>
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-amber-rupee mb-1">INR Employee</p>
                <p className="font-sans text-sm text-ink-muted leading-relaxed">
                  Fixed INR salary divided by the monthly rate to get USD value each month. The baseline is INR salary ÷ FY start rate. Erosion is the accumulated difference in USD value throughout
                  the year.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-display text-lg text-ink mb-2">Rate Types</h3>
            <p className="font-sans text-sm text-ink-muted leading-relaxed">
              All rates used are <strong>monthly averages of daily ECB mid-market rates</strong>. These are mid-market reference rates, not buy/sell rates. Actual transaction rates at banks or
              currency dealers will differ due to spread. The analysis does not account for TDS, GST, banking charges, remittance fees, or hedging costs.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
