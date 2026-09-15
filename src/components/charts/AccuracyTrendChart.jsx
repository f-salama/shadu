import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import './charts.css';

const dayFormatter = new Intl.DateTimeFormat('ar-SA-u-ca-gregory', { day: 'numeric', month: 'short' });

function formatTick(dateStr) {
  return dayFormatter.format(new Date(dateStr));
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip-date">{formatTick(label)}</div>
      <div className="chart-tooltip-value">{payload[0].value}% دقة</div>
    </div>
  );
}

// Note: the plotting canvas is intentionally kept left-to-right (oldest → newest,
// left → right) even though the surrounding app is RTL. This mirrors how most
// Arabic-language analytics dashboards render time-series charts, since a
// reversed time axis is a common source of confusion. Axis labels, the legend
// and tooltip copy are all in Arabic.
export default function AccuracyTrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-state">
        <h3>لا توجد بيانات كافية بعد</h3>
        <p>سيظهر الرسم البياني بمجرد تسجيل جلسات ممارسة.</p>
      </div>
    );
  }

  return (
    <div dir="ltr" className="chart-canvas">
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="accuracyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3CB7BD" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#3CB7BD" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#E1E7E9" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatTick}
            tick={{ fill: '#7C8B90', fontSize: 12, fontFamily: 'IBM Plex Sans Arabic' }}
            axisLine={{ stroke: '#E1E7E9' }}
            tickLine={false}
            minTickGap={24}
          />
          <YAxis
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: '#7C8B90', fontSize: 12, fontFamily: 'IBM Plex Sans Arabic' }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="accuracy"
            stroke="#1F6E73"
            strokeWidth={2.5}
            fill="url(#accuracyFill)"
            dot={{ r: 3, fill: '#1F6E73', strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
