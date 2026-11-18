import { useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RecentCities, { cityKey } from './components/RecentCities';
import StateMessage from './components/StateMessage';
import CurrentWeather from './components/CurrentWeather';
import HourlyChart from './components/HourlyChart';
import DailyForecast from './components/DailyForecast';
import { useWeather } from './hooks/useWeather';
import { useRecentCities } from './hooks/useRecentCities';
import { useTheme } from './hooks/useTheme';
import type { Location, RecentCity } from './types/weather';
import type { TempUnit } from './utils/weather';

const UNIT_STORAGE_KEY = 'weatherly:unit';

function readUnit(): TempUnit {
  try {
    const saved = localStorage.getItem(UNIT_STORAGE_KEY);
    if (saved === 'C' || saved === 'F') return saved;
  } catch {
    // Storage blocked; default below.
  }
  return 'C';
}

export default function App() {
  const { theme, toggle: toggleTheme } = useTheme();
  const [unit, setUnit] = useState<TempUnit>(readUnit);
  const [location, setLocation] = useState<Location | null>(null);
  const { status, report, error, retry } = useWeather(location);
  const { cities, add: addRecent, clear: clearRecent } = useRecentCities();

  function toggleUnit() {
    setUnit((u) => {
      const next: TempUnit = u === 'C' ? 'F' : 'C';
      try {
        localStorage.setItem(UNIT_STORAGE_KEY, next);
      } catch {
        // Ignore storage failures; the choice still applies this session.
      }
      return next;
    });
  }

  function selectLocation(next: Location | RecentCity) {
    const clean: Location = {
      name: next.name,
      region: next.region,
      country: next.country,
      latitude: next.latitude,
      longitude: next.longitude,
      timezone: next.timezone,
    };
    setLocation(clean);
    addRecent(clean);
  }

  const activeKey = location ? cityKey(location) : null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-96 bg-gradient-to-b from-sky-200/50 to-transparent dark:from-sky-500/10" aria-hidden />

      <Header theme={theme} onToggleTheme={toggleTheme} unit={unit} onToggleUnit={toggleUnit} />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto max-w-2xl space-y-4">
          <SearchBar onSelect={selectLocation} />
          <RecentCities cities={cities} activeKey={activeKey} onSelect={selectLocation} onClear={clearRecent} />
        </div>

        {status === 'idle' && <StateMessage kind="empty" />}
        {status === 'loading' && <StateMessage kind="loading" />}
        {status === 'error' && <StateMessage kind="error" message={error ?? undefined} onRetry={retry} />}

        {status === 'success' && report && (
          <div className="space-y-6">
            <CurrentWeather report={report} unit={unit} />
            <div className="grid gap-6 lg:grid-cols-2">
              <HourlyChart hourly={report.hourly} unit={unit} isDark={theme === 'dark'} />
              <DailyForecast daily={report.daily} unit={unit} />
            </div>
            <p className="text-center text-xs text-slate-500 dark:text-slate-400">
              Weather data by Open-Meteo.com
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
