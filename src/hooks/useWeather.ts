import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchForecast, WeatherApiError } from '../services/weatherApi';
import type { Location, WeatherReport } from '../types/weather';

export type WeatherStatus = 'idle' | 'loading' | 'success' | 'error';

interface WeatherState {
  status: WeatherStatus;
  report: WeatherReport | null;
  error: string | null;
}

/**
 * Loads the forecast for a location. Cancels stale requests when the
 * location changes so an older response cannot overwrite a newer one.
 */
export function useWeather(location: Location | null) {
  const [state, setState] = useState<WeatherState>({
    status: 'idle',
    report: null,
    error: null,
  });
  const requestId = useRef(0);

  const load = useCallback(async (target: Location) => {
    const id = ++requestId.current;
    setState((prev) => ({ ...prev, status: 'loading', error: null }));
    try {
      const report = await fetchForecast(target);
      if (id !== requestId.current) return;
      setState({ status: 'success', report, error: null });
    } catch (err) {
      if (id !== requestId.current) return;
      const message =
        err instanceof WeatherApiError ? err.message : 'Something went wrong. Please try again.';
      setState({ status: 'error', report: null, error: message });
    }
  }, []);

  useEffect(() => {
    if (!location) {
      setState({ status: 'idle', report: null, error: null });
      return;
    }
    void load(location);
  }, [location, load]);

  const retry = useCallback(() => {
    if (location) void load(location);
  }, [location, load]);

  return { ...state, retry };
}
