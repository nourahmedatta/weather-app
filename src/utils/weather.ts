import type { LucideIcon } from 'lucide-react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSnow, Moon, Sun, CloudSun, CloudMoon } from 'lucide-react';

export type TempUnit = 'C' | 'F';

export function convertTemp(celsius: number, unit: TempUnit): number {
  return unit === 'C' ? celsius : celsius * (9 / 5) + 32;
}

export function formatTemp(celsius: number, unit: TempUnit): string {
  return `${Math.round(convertTemp(celsius, unit))}°${unit}`;
}

/** Human-readable description from a WMO weather code (Open-Meteo). */
export function describeWeatherCode(code: number): string {
  if (code === 0) return 'Clear sky';
  if (code === 1) return 'Mainly clear';
  if (code === 2) return 'Partly cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Fog';
  if (code >= 51 && code <= 57) return 'Drizzle';
  if (code >= 61 && code <= 67) return 'Rain';
  if (code >= 71 && code <= 77) return 'Snow';
  if (code >= 80 && code <= 82) return 'Rain showers';
  if (code === 85 || code === 86) return 'Snow showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm';
  return 'Unknown';
}

/** Icon for a WMO weather code, using day/night variants where they exist. */
export function weatherIcon(code: number, isDay = true): LucideIcon {
  if (code === 0) return isDay ? Sun : Moon;
  if (code === 1 || code === 2) return isDay ? CloudSun : CloudMoon;
  if (code === 3) return Cloud;
  if (code === 45 || code === 48) return CloudFog;
  if (code >= 51 && code <= 57) return CloudDrizzle;
  if (code >= 61 && code <= 67) return CloudRain;
  if (code >= 71 && code <= 77) return CloudSnow;
  if (code >= 80 && code <= 82) return CloudRain;
  if (code === 85 || code === 86) return CloudSnow;
  if (code >= 95 && code <= 99) return CloudLightning;
  return Cloud;
}

/** UV index risk label (WHO scale). */
export function uvLabel(uv: number): string {
  if (uv < 3) return 'Low';
  if (uv < 6) return 'Moderate';
  if (uv < 8) return 'High';
  if (uv < 11) return 'Very high';
  return 'Extreme';
}

export function compassDirection(degrees: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(degrees / 45) % 8];
}

/** Format an Open-Meteo local ISO time like "2026-11-18T15:00" in its own timezone. */
export function formatHour(localIso: string): string {
  const d = new Date(localIso.length === 16 ? `${localIso}:00` : localIso);
  return d.toLocaleTimeString([], { hour: 'numeric' });
}

export function formatDayLabel(dateIso: string, index: number): string {
  if (index === 0) return 'Today';
  const [y, m, day] = dateIso.split('-').map(Number);
  const d = new Date(y, m - 1, day);
  return d.toLocaleDateString([], { weekday: 'short' });
}

export function formatLongDate(localIso: string): string {
  const d = new Date(localIso.length === 16 ? `${localIso}:00` : localIso);
  return d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' });
}

export function formatClock(localIso: string): string {
  const d = new Date(localIso.length === 16 ? `${localIso}:00` : localIso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
