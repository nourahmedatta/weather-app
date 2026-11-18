import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { HourlyPoint } from '../types/weather';
import { convertTemp, formatHour, type TempUnit } from '../utils/weather';

interface HourlyChartProps {
  hourly: HourlyPoint[];
  unit: TempUnit;
  isDark: boolean;
}

interface ChartRow {
  label: string;
  temp: number;
  precip: number;
  time: string;
}

export default function HourlyChart({ hourly, unit, isDark }: HourlyChartProps) {
  const rows: ChartRow[] = hourly.map((h) => ({
    label: formatHour(h.time),
    temp: Math.round(convertTemp(h.temperatureC, unit)),
    precip: h.precipitationProbability,
    time: h.time,
  }));

  const gridColour = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const tickColour = isDark ? '#94a3b8' : '#64748b';

  return (
    <section aria-labelledby="hourly-heading" className="animate-fade-up rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-6">
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <h2 id="hourly-heading" className="text-lg font-semibold text-slate-900 dark:text-white">
          Next 24 hours
        </h2>
        <span className="text-xs text-slate-500 dark:text-slate-400">Temperature</span>
      </div>

      <div className="h-56 w-full sm:h-64" role="img" aria-label="Hourly temperature chart for the next 24 hours">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={rows} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
            <defs>
              <linearGradient id="tempFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColour} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: tickColour, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={18}
            />
            <YAxis
              tick={{ fill: tickColour, fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={(v: number) => `${v}°`}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip
              cursor={{ stroke: '#38bdf8', strokeOpacity: 0.3 }}
              contentStyle={{
                borderRadius: 12,
                border: 'none',
                background: isDark ? '#0f172a' : '#ffffff',
                color: isDark ? '#f1f5f9' : '#0f172a',
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              }}
              formatter={(value: number, _name, item) => {
                const p = (item.payload as ChartRow).precip;
                return [`${value}°${unit} · ${p}% rain`, 'Temp'];
              }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#0ea5e9"
              strokeWidth={2.5}
              fill="url(#tempFill)"
              animationDuration={900}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
