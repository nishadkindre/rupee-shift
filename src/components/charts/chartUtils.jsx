export const CHART_COLORS = {
  actual: '#378ADD',
  baseline: '#C8C4BA',
  gain: '#2A7A52',
  loss: '#B84024',
  amber: '#C8702A',
  line: '#1A1814'
};

export function CustomTooltip({ active, payload, label, formatValue }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-ink-light/20 rounded-xl shadow-lg p-3 text-xs font-mono min-w-40">
      <p className="font-sans font-semibold text-ink mb-2 text-xs">{label}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex justify-between gap-4 text-xs">
          <span style={{ color: entry.color }} className="font-sans">
            {entry.name}
          </span>
          <span className="text-ink font-medium">{formatValue ? formatValue(entry.value, entry.unit) : entry.value}</span>
        </div>
      ))}
    </div>
  );
}
