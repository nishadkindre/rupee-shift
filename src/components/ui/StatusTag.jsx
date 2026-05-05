const variants = {
  gain: 'bg-gain-light text-gain border border-gain/20',
  loss: 'bg-loss-light text-loss border border-loss/20',
  breakeven: 'bg-info-light text-info border border-info/20',
  neutral: 'bg-surface-subtle text-ink-muted border border-ink-base/10',
  savings: 'bg-gain-light text-gain border border-gain/20',
  costlier: 'bg-loss-light text-loss border border-loss/20',
  raise: 'bg-gain-light text-gain border border-gain/20',
  paycut: 'bg-loss-light text-loss border border-loss/20'
};

const labels = {
  gain: 'Gain',
  loss: 'Loss',
  breakeven: '≈ Break-Even',
  neutral: 'Neutral',
  savings: 'Savings',
  costlier: 'Costlier',
  raise: '✓ Real Raise',
  paycut: '⚠ Pay Cut'
};

export default function StatusTag({ variant = 'neutral', children }) {
  const cls = variants[variant] || variants.neutral;
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${cls}`} role="status" aria-label={labels[variant] || String(children)}>
      {children || labels[variant]}
    </span>
  );
}
