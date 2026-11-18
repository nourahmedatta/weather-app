import { AlertTriangle, Loader2, MapPinned, RotateCw } from 'lucide-react';

type StateKind = 'loading' | 'empty' | 'error';

interface StateMessageProps {
  kind: StateKind;
  message?: string;
  onRetry?: () => void;
}

export default function StateMessage({ kind, message, onRetry }: StateMessageProps) {
  if (kind === 'loading') {
    return (
      <div role="status" aria-live="polite" className="animate-fade-up space-y-4">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-sky-500" aria-hidden />
          Fetching the latest forecast…
        </div>
        <div className="space-y-3" aria-hidden>
          <div className="h-44 rounded-3xl bg-slate-200/70 animate-shimmer bg-[length:800px_100%] bg-gradient-to-r from-slate-200/70 via-white/80 to-slate-200/70 dark:from-white/5 dark:via-white/10 dark:to-white/5" />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-slate-200/70 dark:bg-white/5" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'error') {
    return (
      <div role="alert" className="animate-fade-up flex flex-col items-center gap-4 rounded-3xl border border-rose-200 bg-rose-50/80 p-8 text-center dark:border-rose-500/20 dark:bg-rose-500/10">
        <AlertTriangle className="h-10 w-10 text-rose-500" aria-hidden />
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">We couldn’t load the weather</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{message ?? 'Please try again.'}</p>
        </div>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg dark:bg-white dark:text-slate-900"
          >
            <RotateCw className="h-4 w-4" aria-hidden />
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="animate-fade-up flex flex-col items-center gap-4 rounded-3xl border border-dashed border-slate-300 bg-white/50 p-10 text-center dark:border-white/15 dark:bg-white/5">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 text-white shadow-lg shadow-sky-500/30">
        <MapPinned className="h-7 w-7" aria-hidden />
      </span>
      <div>
        <p className="text-lg font-semibold text-slate-900 dark:text-white">Search for a city to get started</p>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Current conditions, a 24-hour chart and a 7-day outlook for anywhere in the world.
        </p>
      </div>
    </div>
  );
}
