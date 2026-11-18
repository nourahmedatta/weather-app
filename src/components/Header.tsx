import { CloudSun, Moon, Sun } from 'lucide-react';
import type { Theme } from '../hooks/useTheme';
import type { TempUnit } from '../utils/weather';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
  unit: TempUnit;
  onToggleUnit: () => void;
}

export default function Header({ theme, onToggleTheme, unit, onToggleUnit }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white shadow-md shadow-sky-500/30">
            <CloudSun className="h-5 w-5" aria-hidden />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Weatherly</span>
        </div>

        <div className="flex items-center gap-2">
          <div
            role="group"
            aria-label="Temperature unit"
            className="flex rounded-full border border-slate-200 bg-white/80 p-0.5 text-xs font-semibold dark:border-white/10 dark:bg-white/5"
          >
            {(['C', 'F'] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => unit !== u && onToggleUnit()}
                aria-pressed={unit === u}
                className={`rounded-full px-3 py-1.5 transition ${
                  unit === u
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                °{u}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>
    </header>
  );
}
