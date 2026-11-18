import { Droplets, Thermometer, Wind, Sun } from 'lucide-react';
import type { WeatherReport } from '../types/weather';
import type { TempUnit } from '../utils/weather';
import {
  compassDirection,
  describeWeatherCode,
  formatClock,
  formatLongDate,
  formatTemp,
  uvLabel,
  weatherIcon,
} from '../utils/weather';
import MetricCard from './MetricCard';

interface CurrentWeatherProps {
  report: WeatherReport;
  unit: TempUnit;
}

export default function CurrentWeather({ report, unit }: CurrentWeatherProps) {
  const { location, current } = report;
  const Icon = weatherIcon(current.weatherCode, current.isDay);
  const place = [location.name, location.region, location.country].filter(Boolean).join(', ');
  const uv = current.uvIndex;

  return (
    <section aria-labelledby="current-heading" className="space-y-4">
      <div className="animate-fade-up relative overflow-hidden rounded-3xl border border-slate-200/70 bg-gradient-to-br from-sky-400 via-sky-500 to-indigo-600 p-6 text-white shadow-xl sm:p-8 dark:border-white/10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" aria-hidden />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h2 id="current-heading" className="truncate text-2xl font-bold tracking-tight sm:text-3xl">
              {place}
            </h2>
            <p className="mt-1 text-sm text-white/80">
              {formatLongDate(current.time)} · {formatClock(current.time)} local time
            </p>
            <p className="mt-6 text-7xl font-extrabold tracking-tighter sm:text-8xl" aria-live="polite">
              {formatTemp(current.temperatureC, unit)}
            </p>
            <p className="mt-2 text-lg font-medium text-white/90">
              {describeWeatherCode(current.weatherCode)}
            </p>
          </div>
          <Icon className="h-28 w-28 shrink-0 drop-shadow-lg sm:h-36 sm:w-36" strokeWidth={1.25} aria-hidden />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MetricCard
          index={0}
          icon={Thermometer}
          label="Feels like"
          value={formatTemp(current.feelsLikeC, unit)}
          hint={current.feelsLikeC < current.temperatureC ? 'Wind or humidity lowers it' : 'Close to the actual temperature'}
        />
        <MetricCard
          index={1}
          icon={Droplets}
          label="Humidity"
          value={`${Math.round(current.humidity)}%`}
          hint={current.humidity > 70 ? 'Humid' : current.humidity < 30 ? 'Dry' : 'Comfortable'}
        />
        <MetricCard
          index={2}
          icon={Wind}
          label="Wind"
          value={`${Math.round(current.windSpeedKmh)} km/h`}
          hint={`From the ${compassDirection(current.windDirection)}`}
        />
        <MetricCard
          index={3}
          icon={Sun}
          label="UV index"
          value={uv === null ? '—' : `${Math.round(uv)}`}
          hint={uv === null ? 'Not available' : uvLabel(uv)}
        />
      </div>
    </section>
  );
}
