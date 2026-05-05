import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { CHART_COLORS, CustomTooltip } from './chartUtils';
import { monthKeyToShort, formatRate } from '../../utils/formatters';

export default function RateLineChart({ monthlyAverages, fyMonthKeys, title }) {
  const data = fyMonthKeys.map(key => ({
    month: monthKeyToShort(key),
    rate: parseFloat((monthlyAverages[key] || 0).toFixed(4))
  }));

  return (
    <div>
      {title && <p className="font-sans text-sm font-semibold text-ink mb-3">{title}</p>}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#C8702A" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#C8702A" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#EDE9E1" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{
              fontFamily: 'DM Mono, monospace',
              fontSize: 11,
              fill: '#A39E98'
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={['auto', 'auto']}
            tickFormatter={v => `₹${v.toFixed(0)}`}
            tick={{
              fontFamily: 'DM Mono, monospace',
              fontSize: 11,
              fill: '#A39E98'
            }}
            axisLine={false}
            tickLine={false}
            width={50}
          />
          <Tooltip content={<CustomTooltip formatValue={v => formatRate(v)} />} />
          <Area type="monotone" dataKey="rate" name="Rate (₹/$)" stroke={CHART_COLORS.amber} strokeWidth={2} fill="url(#rateGradient)" isAnimationActive animationDuration={800} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
