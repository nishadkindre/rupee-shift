import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, Cell,
} from 'recharts';
import { CHART_COLORS, CustomTooltip } from './chartUtils';

export default function IncrementBarChart({ data, xKey, barKey, referenceValue, yFormatter, title, getBarColor }) {
  return (
    <div>
      {title && <p className="font-sans text-sm font-semibold text-ink mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E1" vertical={false} />
          <XAxis
            dataKey={xKey}
            tick={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fill: '#A39E98' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={yFormatter}
            tick={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fill: '#A39E98' }}
            axisLine={false}
            tickLine={false}
            width={72}
          />
          <Tooltip content={<CustomTooltip formatValue={(v) => yFormatter ? yFormatter(v) : v} />} />
          {referenceValue !== undefined && (
            <ReferenceLine
              y={referenceValue}
              stroke={CHART_COLORS.amber}
              strokeDasharray="6 3"
              strokeWidth={2}
              label={{ value: 'Baseline', fill: CHART_COLORS.amber, fontFamily: 'DM Mono, monospace', fontSize: 11 }}
            />
          )}
          <Bar dataKey={barKey} isAnimationActive animationDuration={600} radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={getBarColor ? getBarColor(entry) : CHART_COLORS.actual}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
