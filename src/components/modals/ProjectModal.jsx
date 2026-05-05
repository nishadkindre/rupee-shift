import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  X, Lightbulb, TrendingDown, TrendingUp, Building2, Code2, Laptop, User,
  ListChecks, Scale, ShieldAlert, Globe, CheckCircle, ArrowRight, Zap,
  Users, DollarSign, BarChart3, Info
} from 'lucide-react';
import RupeeShiftLogo from '../logo/RupeeShiftLogo';
import { TRANSITIONS } from '../../utils/animations';

export default function ProjectModal({ onClose }) {
  useEffect(() => {
    const handleKey = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6" role="dialog" aria-modal="true" aria-label="About RupeeShift Project">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={TRANSITIONS.fast}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        transition={TRANSITIONS.normal}
        className="relative bg-cream rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col"
      >
        {/* Sticky header */}
        <div className="sticky top-0 bg-cream border-b border-cream-dark z-10 flex items-center justify-between px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <RupeeShiftLogo size={26} />
            <h2 className="font-display text-xl text-ink">What is RupeeShift?</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink p-1.5 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-rupee"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 px-6 py-6 flex flex-col gap-8">

          {/* ── The Big Idea ── */}
          <Section icon={<Lightbulb size={18} />} iconClass="text-amber-rupee" title="The Big Idea">
            <p className="font-sans text-sm text-ink-muted leading-relaxed">
              Every year, the Indian Rupee quietly shifts against the US Dollar. Most years it weakens — meaning one dollar buys more rupees than it did the year before. This sounds like an abstract economic headline. But it has very real, very personal consequences for millions of Indians.
            </p>
            <p className="font-sans text-sm text-ink-muted leading-relaxed mt-2">
              <strong className="text-ink">RupeeShift takes that invisible shift and puts a concrete number to it — for your specific situation.</strong>
            </p>
            <Callout icon={<Info size={14} />} color="amber">
              It answers the question: <em>"The dollar moved. What did that silently do to your money?"</em>
            </Callout>
          </Section>

          {/* ── Why It Matters ── */}
          <Section icon={<TrendingDown size={18} />} iconClass="text-loss" title="Why Does This Matter?">
            <p className="font-sans text-sm text-ink-muted leading-relaxed">
              Suppose one dollar bought <strong className="text-ink">₹83</strong> at the start of the financial year and <strong className="text-ink">₹87</strong> by the end — that's roughly a 5% shift. Depending on who you are, this same 5% movement could mean very different things:
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <ImpactChip color="gain" label="Saved money in dollars" desc="If you pay salaries in rupees but account in USD" />
              <ImpactChip color="gain" label="Boosted rupee revenue" desc="If you earn in USD and spend in INR" />
              <ImpactChip color="gain" label="Gave you a quiet raise" desc="If you invoice clients in dollars" />
              <ImpactChip color="loss" label="Quietly cut your value" desc="If you're a rupee-paid employee at a USD-earning company" />
            </div>
            <Callout icon={<Zap size={14} />} color="neutral">
              The problem is — nobody shows you this clearly. Your payslip looks the same. Your invoice looks the same. But in dollar terms, your situation has changed. <strong className="text-ink">RupeeShift makes that change visible.</strong>
            </Callout>
          </Section>

          {/* ── The Four Stories ── */}
          <div>
            <SectionHeader icon={<BarChart3 size={18} />} iconClass="text-amber-rupee" title="The Four Stories RupeeShift Tells" />
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <ScenarioCard
                icon={<Building2 size={20} />}
                color="gain"
                badge="Saves in USD"
                title="Indian Subsidiary"
                who="Foreign MNC with an Indian team"
                tagline="Our parent company funds us in dollars. We pay salaries in rupees. Did the currency shift reduce their dollar cost?"
                detail="When the rupee weakens, the same INR payroll costs fewer dollars to fund from HQ. RupeeShift calculates the exact USD savings month by month, and shows what hike you can give while keeping dollar costs flat."
              />
              <ScenarioCard
                icon={<Code2 size={20} />}
                color="amber"
                badge="Revenue uplift"
                title="IT Exporter"
                who="Indian IT/SaaS company with USD clients"
                tagline="We earn in dollars, we spend in rupees. Did the currency shift pad our margins?"
                detail="The same $1M contract converts to more rupees when the rupee weakens. RupeeShift shows the extra INR earned, how much of it can fund salary hikes, and what a lower-dollar contract renewal really means in rupee terms."
              />
              <ScenarioCard
                icon={<Laptop size={20} />}
                color="info"
                badge="Silent raise"
                title="Freelancer"
                who="Independent professional billing in USD"
                tagline="I charge clients in dollars. Did the rupee weakening give me a raise I didn't ask for?"
                detail="A fixed $5,000/month retainer earns more rupees when the rupee falls. RupeeShift shows your 'silent raise', how much of it depends on exchange rates staying where they are, and helps you plan your next rate card."
              />
              <ScenarioCard
                icon={<User size={20} />}
                color="loss"
                badge="USD erosion"
                title="INR Employee"
                who="Salaried employee at a USD-earning company"
                tagline="My company earns in dollars. I get paid in rupees. Am I falling behind?"
                detail="When the rupee weakens, your employer's dollar revenue grows in rupee terms — but your salary stays fixed. In dollar terms, you become cheaper to employ. RupeeShift calculates your exact erosion and the minimum hike needed to break even."
              />
            </div>
          </div>

          {/* ── Who Is This For? ── */}
          <Section icon={<Users size={18} />} iconClass="text-info" title="Who Should Use RupeeShift?">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {[
                { role: 'HR & Finance leads at Indian subsidiaries', use: 'Justify payroll budgets to global HQ' },
                { role: 'Business development at IT/SaaS exporters', use: 'Model contract renewals with confidence' },
                { role: 'Freelancers & consultants', use: 'Negotiate next year\'s rate with real data' },
                { role: 'Employees at export-oriented companies', use: 'Make the case for a meaningful increment' },
              ].map(p => (
                <div key={p.role} className="flex items-start gap-2.5 bg-surface-raised rounded-xl px-3 py-3">
                  <CheckCircle size={14} className="text-gain mt-0.5 shrink-0" />
                  <div>
                    <p className="font-sans text-xs font-semibold text-ink leading-snug">{p.role}</p>
                    <p className="font-sans text-xs text-ink-muted mt-0.5">{p.use}</p>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* ── How to Use ── */}
          <Section icon={<ListChecks size={18} />} iconClass="text-amber-rupee" title="How to Use RupeeShift">
            <ol className="flex flex-col gap-2.5 mt-1">
              {[
                { n: '1', text: 'Pick a financial year — FY 2021–22 through FY 2025–26, with live ECB exchange rate data' },
                { n: '2', text: 'Choose your scenario — Subsidiary, IT Exporter, Freelancer, or INR Employee' },
                { n: '3', text: 'Enter your numbers — salary, revenue, or contract value using the sliders' },
                { n: '4', text: 'Read the insight — a plain-English sentence at the top summarises the impact immediately' },
                { n: '5', text: 'Explore the details — month-by-month charts show exactly when the shift happened' },
                { n: '6', text: 'Use the increment table — see break-even percentages for planning hikes or renewals' },
                { n: '7', text: 'Export — download the full analysis as Excel or CSV for presentations' },
              ].map(s => (
                <li key={s.n} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-amber-rupee/15 text-amber-rupee font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">{s.n}</span>
                  <span className="font-sans text-sm text-ink-muted leading-relaxed">{s.text}</span>
                </li>
              ))}
            </ol>
          </Section>

          {/* ── Break-Even Concept ── */}
          <Section icon={<Scale size={18} />} iconClass="text-amber-rupee" title="Understanding the Break-Even Number">
            <p className="font-sans text-sm text-ink-muted leading-relaxed">
              One of the most important outputs in RupeeShift is the <strong className="text-ink">break-even percentage</strong>. Think of it this way:
            </p>
            <div className="mt-3 bg-cream-dark rounded-xl px-4 py-3 flex flex-col gap-1.5">
              <p className="font-mono text-xs text-ink-muted">If the rupee weakened by 5% this year...</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <ArrowRight size={12} className="text-loss shrink-0" />
                  <span className="font-sans text-sm text-ink">A <strong>5% salary hike</strong> restores your dollar value to exactly where it was — no better, no worse.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight size={12} className="text-loss shrink-0" />
                  <span className="font-sans text-sm text-ink">Anything <strong>below 5%</strong> is a real-terms pay cut in dollar terms.</span>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowRight size={12} className="text-gain shrink-0" />
                  <span className="font-sans text-sm text-ink">Anything <strong>above 5%</strong> is a genuine raise.</span>
                </div>
              </div>
            </div>
            <p className="font-sans text-xs text-ink-muted mt-2 leading-relaxed">
              RupeeShift highlights this break-even number prominently so you can have an informed, data-backed conversation with your employer, HR team, or client.
            </p>
          </Section>

          {/* ── Quick Facts ── */}
          <div>
            <SectionHeader icon={<Zap size={18} />} iconClass="text-amber-rupee" title="Quick Facts" />
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <FactCard
                stat="₹10+"
                desc="How much the rupee has weakened per dollar since FY 2021–22. What was ₹74/$ is now near ₹85/$."
              />
              <FactCard
                stat="~12%"
                desc="The approximate cumulative depreciation over the last 4 financial years — a silent tax on your dollar-linked income."
              />
              <FactCard
                stat="0 data stored"
                desc="All calculations happen in your browser. No numbers you enter are ever sent to a server."
              />
            </div>
          </div>

          {/* ── What It's Not ── */}
          <Section icon={<ShieldAlert size={18} />} iconClass="text-ink-muted" title="What RupeeShift Is NOT">
            <div className="flex flex-col gap-1.5 mt-1">
              {[
                'Investment advice or a buy/sell recommendation',
                'A currency prediction or forecasting tool — it only analyses historical data',
                'A tax or compliance calculator',
                'A substitute for professional financial advice',
              ].map(item => (
                <div key={item} className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded-full bg-loss/10 text-loss text-xs flex items-center justify-center shrink-0 font-bold">✕</span>
                  <span className="font-sans text-sm text-ink-muted">{item}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* ── Data Source ── */}
          <Section icon={<Globe size={18} />} iconClass="text-info" title="Data Source">
            <p className="font-sans text-sm text-ink-muted leading-relaxed">
              Exchange rates are sourced from the{' '}
              <a
                href="https://www.frankfurter.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-rupee hover:text-amber-light underline underline-offset-2"
              >
                Frankfurter API
              </a>
              , which publishes official daily rates from the <strong className="text-ink">European Central Bank (ECB)</strong>. These are mid-market reference rates — not buy/sell rates. Monthly averages are the arithmetic mean of all daily rates within the month.
            </p>
            <p className="font-sans text-sm text-ink-muted leading-relaxed mt-2">
              Rates are cached in your browser session after the first load, so the app continues to work even if you go offline.
            </p>
          </Section>

        </div>

        {/* Footer */}
        <div className="border-t border-cream-dark px-6 py-3 flex items-center justify-between rounded-b-2xl shrink-0">
          <p className="font-sans text-xs text-ink-muted">Built by <a href="mailto:nishadkindre@gmail.com" className="text-amber-rupee hover:text-amber-800">Nishad Kindre</a></p>
          {/* <a
            href="https://rupee-shift.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs text-amber-rupee hover:text-amber-light transition-colors"
          >
            rupee-shift.vercel.app ↗
          </a> */}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Sub-components ── */

function SectionHeader({ icon, iconClass, title }) {
  return (
    <div className="flex items-center gap-2">
      <span className={iconClass}>{icon}</span>
      <h3 className="font-display text-lg text-ink">{title}</h3>
    </div>
  );
}

function Section({ icon, iconClass, title, children }) {
  return (
    <section className="flex flex-col gap-3">
      <SectionHeader icon={icon} iconClass={iconClass} title={title} />
      <div>{children}</div>
    </section>
  );
}

function Callout({ icon, color, children }) {
  const styles = {
    amber: 'bg-amber-rupee/8 border-amber-rupee/25 text-amber-rupee',
    neutral: 'bg-surface-raised border-ink-base/10 text-ink-muted',
    info: 'bg-info/8 border-info/25 text-info',
  };
  return (
    <div className={`flex items-start gap-2.5 mt-3 rounded-xl border px-4 py-3 ${styles[color]}`}>
      <span className="mt-0.5 shrink-0">{icon}</span>
      <p className="font-sans text-sm leading-relaxed">{children}</p>
    </div>
  );
}

function ImpactChip({ color, label, desc }) {
  const colors = {
    gain: 'bg-gain/8 border-gain/20 text-gain',
    loss: 'bg-loss/8 border-loss/20 text-loss',
  };
  return (
    <div className={`flex items-start gap-2 rounded-xl border px-3 py-2.5 ${colors[color]}`}>
      <TrendingUp size={13} className={`mt-0.5 shrink-0 ${color === 'loss' ? 'rotate-180' : ''}`} />
      <div>
        <p className="font-sans text-xs font-semibold leading-snug">{label}</p>
        <p className="font-sans text-xs opacity-75 mt-0.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ScenarioCard({ icon, color, badge, title, who, tagline, detail }) {
  const colors = {
    gain: { border: 'border-gain/30', icon: 'bg-gain/10 text-gain', badge: 'bg-gain/10 text-gain' },
    amber: { border: 'border-amber-rupee/30', icon: 'bg-amber-rupee/10 text-amber-rupee', badge: 'bg-amber-rupee/10 text-amber-rupee' },
    info: { border: 'border-info/30', icon: 'bg-info/10 text-info', badge: 'bg-info/10 text-info' },
    loss: { border: 'border-loss/30', icon: 'bg-loss/10 text-loss', badge: 'bg-loss/10 text-loss' },
  };
  const c = colors[color];
  return (
    <div className={`bg-surface-raised rounded-xl border ${c.border} p-4 flex flex-col gap-2.5`}>
      <div className="flex items-start justify-between gap-2">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
          {icon}
        </div>
        <span className={`font-sans text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>{badge}</span>
      </div>
      <div>
        <p className="font-display text-base text-ink leading-tight">{title}</p>
        <p className="font-sans text-xs text-ink-muted mt-0.5">{who}</p>
      </div>
      <p className="font-sans text-xs text-ink italic leading-relaxed border-l-2 border-ink-base/15 pl-3">{tagline}</p>
      <p className="font-sans text-xs text-ink-muted leading-relaxed">{detail}</p>
    </div>
  );
}

function FactCard({ stat, desc }) {
  return (
    <div className="bg-surface-raised rounded-xl px-4 py-4 flex flex-col gap-1.5">
      <p className="font-mono text-2xl font-semibold text-amber-rupee">{stat}</p>
      <p className="font-sans text-xs text-ink-muted leading-relaxed">{desc}</p>
    </div>
  );
}
