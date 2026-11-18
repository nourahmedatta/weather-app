import { Droplets, Wind } from 'lucide-react';
import type { DailyPoint } from '../types/weather';
import { describeWeatherCode, formatDayLabel, formatTemp, weatherIcon, type TempUnit } from '../utils/weather';

interface DailyForecastProps {
  daily: DailyPoint[];
  unit: TempUnit;
}

export default function DailyForecast({ daily, unit }: DailyForecastProps) {
  // Scale each bar against the whole week so the ranges are comparable.
  const weekMin = Math.min(...daily.map((d) => d.minC));
  const weekMax = Math.max(...daily.map((d) => d.maxC));
  const span = Math.max(weekMax - weekMin, 1);

  return (
    <section aria-labelledby="daily-heading" className="animate-fade-up rounded-3xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/5 sm:p-6">
      <h2 id="daily-heading" className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        7-day forecast
      </h2>

      <ul className="divide-y divide-slate-200/70 dark:divide-white/10">
        {daily.map((day, i) => {
          const Icon = weatherIcon(day.weatherCode, true);
          const left = ((day.minC - weekMin) / span) * 100;
          const width = Math.max(((day.maxC - day.minC) / span) * 100, 4);

          return (
            <li
              key={day.date}
              className="animate-fade-up grid grid-cols-[4.5rem_2rem_1fr] items-center gap-3 py-3 sm:grid-cols-[6rem_2.5rem_1fr_auto] sm:gap-4"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">
                  {formatDayLabel(day.date, i)}
                </p>
                <p className="hidden text-xs text-slate-500 sm:block dark:text-slate-400">
                  {describeWeatherCode(day.weatherCode)}
                </p>
              </div>

              <Icon className="h-7 w-7 text-sky-500" aria-label={describeWeatherCode(day.weatherCode)} role="img" />

              <div className="relative h-1.5 w-full rounded-full bg-slate-200 dark:bg-white/10" aria-hidden>
                <div
                  className="absolute top-0 h-full rounded-full bg-gradient-to-r from-sky-400 to-indigo-500"
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
              </div>

              <div className="col-span-3 flex items-center justify-between gap-3 text-sm sm:col-span-1 sm:justify-end">
                <span className="hidden items-center gap-1 text-xs text-slate-500 md:flex dark:text-slate-400">
                  <Droplets className="h-3.5 w-3.5" aria-hidden />
                  {Math.round(day.precipitationProbabilityMax)}%
                </span>
                <span className="hidden items-center gap-1 text-xs text-slate-500 md:flex dark:text-slate-400">
                  <Wind className="h-3.5 w-3.5" aria-hidden />
                  {Math.round(day.windSpeedMaxKmh)} km/h
                </span>
                <span className="font-semibold tabular-nums text-slate-900 dark:text-white">
                  {formatTemp(day.maxC, unit)}
                </span>
                <span className="tabular-nums text-slate-500 dark:text-slate-400">{formatTemp(day.minC, unit)}</span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
