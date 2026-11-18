import { Clock } from 'lucide-react';
import type { RecentCity } from '../types/weather';

interface RecentCitiesProps {
  cities: RecentCity[];
  activeKey: string | null;
  onSelect: (city: RecentCity) => void;
  onClear: () => void;
}

export function cityKey(c: { latitude: number; longitude: number }): string {
  return `${c.latitude},${c.longitude}`;
}

export default function RecentCities({ cities, activeKey, onSelect, onClear }: RecentCitiesProps) {
  if (cities.length === 0) return null;

  return (
    <section aria-labelledby="recent-heading" className="animate-fade-up">
      <div className="mb-3 flex items-center justify-between">
        <h2 id="recent-heading" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
          <Clock className="h-4 w-4" aria-hidden />
          Recent searches
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-slate-500 transition hover:text-rose-500 dark:text-slate-400"
        >
          Clear
        </button>
      </div>
      <ul className="flex flex-wrap gap-2">
        {cities.map((city) => {
          const key = cityKey(city);
          const active = key === activeKey;
          return (
            <li key={key}>
              <button
                type="button"
                onClick={() => onSelect(city)}
                aria-current={active ? 'true' : undefined}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition hover:-translate-y-0.5 ${
                  active
                    ? 'border-sky-500 bg-sky-500 text-white shadow-md shadow-sky-500/30'
                    : 'border-slate-200 bg-white/70 text-slate-700 hover:border-sky-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200'
                }`}
              >
                {city.name}
                {city.country && <span className="ml-1.5 opacity-60">{city.country}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

