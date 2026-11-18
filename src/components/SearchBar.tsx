import { useEffect, useRef, useState } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { searchCities, toLocation } from '../services/weatherApi';
import type { GeocodingResult, Location } from '../types/weather';

interface SearchBarProps {
  onSelect: (location: Location) => void;
}

export default function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Debounced live search so the API is not hit on every keystroke.
  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setSearched(false);
      setSearchError(null);
      return;
    }

    let cancelled = false;
    setSearching(true);
    const timer = window.setTimeout(async () => {
      try {
        const found = await searchCities(term);
        if (cancelled) return;
        setResults(found);
        setSearchError(null);
      } catch (err) {
        if (cancelled) return;
        setResults([]);
        setSearchError(err instanceof Error ? err.message : 'Search failed.');
      } finally {
        if (!cancelled) {
          setSearching(false);
          setSearched(true);
        }
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query]);

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  function pick(result: GeocodingResult) {
    onSelect(toLocation(result));
    setQuery('');
    setResults([]);
    setSearched(false);
    setOpen(false);
  }

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div ref={wrapRef} className="relative w-full">
      <label htmlFor="city-search" className="sr-only">
        Search for a city
      </label>
      <div className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 shadow-sm backdrop-blur transition focus-within:border-sky-400 focus-within:ring-4 focus-within:ring-sky-400/20 dark:border-white/10 dark:bg-white/5">
        <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
        <input
          id="city-search"
          type="search"
          autoComplete="off"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && results[0]) pick(results[0]);
            if (e.key === 'Escape') setOpen(false);
          }}
          placeholder="Search any city worldwide…"
          className="w-full bg-transparent text-base text-slate-900 placeholder:text-slate-400 outline-none dark:text-slate-100"
        />
        {searching && <Loader2 className="h-5 w-5 shrink-0 animate-spin text-sky-500" aria-label="Searching" />}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-80 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-xl dark:border-white/10 dark:bg-slate-900">
          {searchError && <p className="px-3 py-2 text-sm text-rose-500">{searchError}</p>}

          {!searchError && results.length > 0 && (
            <ul role="listbox" className="flex flex-col">
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => pick(r)}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-slate-100 dark:hover:bg-white/10"
                  >
                    <MapPin className="h-4 w-4 shrink-0 text-sky-500" aria-hidden />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {r.name}
                      </span>
                      <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                        {[r.admin1, r.country].filter(Boolean).join(', ')}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {!searchError && !searching && searched && results.length === 0 && (
            <p className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
              No cities match “{query.trim()}”. Try another spelling.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
