import {
  ResponsiveContainer, ComposedChart, Bar, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { CHART_COLORS, CustomTooltip } from './chartUtils';
import { monthKeyToShort } from '../../utils/formatters';

export default function MonthlyBarChart({ data, barKey, baselineKey, lineKey, barLabel, baselineLabel, lineLabel, yFormatter, lineFormatter, title }) {
  const chartData = data.map(row => ({
    month: monthKeyToShort(row.monthKey),
    [barKey]: parseFloat(row[barKey]?.toFixed(2) || 0),
    [baselineKey]: parseFloat(row[baselineKey]?.toFixed(2) || 0),
    ...(lineKey ? { [lineKey]: parseFloat(row[lineKey]?.toFixed(2) || 0) } : {}),
  }));

  return (
    <div>
      {title && <p className="font-sans text-sm font-semibold text-ink mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={chartData} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E1" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fill: '#A39E98' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tickFormatter={yFormatter}
            tick={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fill: '#A39E98' }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          {lineKey && (
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={lineFormatter || yFormatter}
              tick={{ fontFamily: 'DM Mono, monospace', fontSize: 11, fill: '#A39E98' }}
              axisLine={false}
              tickLine={false}
              width={70}
            />
          )}
          <Tooltip
            content={<CustomTooltip formatValue={(v) => yFormatter ? yFormatter(v) : v} />}
          />
          <Legend
            iconType="rect"
            iconSize={10}
            wrapperStyle={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12 }}
          />
          <Bar yAxisId="left" dataKey={barKey} name={barLabel} fill={CHART_COLORS.actual} isAnimationActive animationDuration={600} radius={[3, 3, 0, 0]} />
          <Bar yAxisId="left" dataKey={baselineKey} name={baselineLabel} fill={CHART_COLORS.baseline} isAnimationActive animationDuration={600} radius={[3, 3, 0, 0]} />
          {lineKey && (
            <Line yAxisId="right" type="monotone" dataKey={lineKey} name={lineLabel} stroke={CHART_COLORS.gain} strokeWidth={2} dot={false} isAnimationActive animationDuration={600} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
