import { useCallback, useState } from 'react';
import type { RecentCity } from '../types/weather';

const STORAGE_KEY = 'weatherly:recent-cities';
const MAX_ITEMS = 5;

function readStored(): RecentCity[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as RecentCity[]).slice(0, MAX_ITEMS) : [];
  } catch {
    return [];
  }
}

function sameCity(a: RecentCity, b: RecentCity): boolean {
  return a.latitude === b.latitude && a.longitude === b.longitude;
}

export function useRecentCities() {
  const [cities, setCities] = useState<RecentCity[]>(readStored);

  const add = useCallback((city: RecentCity) => {
    setCities((prev) => {
      const next = [city, ...prev.filter((c) => !sameCity(c, city))].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Storage unavailable; keep the list in memory for this session.
      }
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setCities([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore.
    }
  }, []);

  return { cities, add, clear };
}
