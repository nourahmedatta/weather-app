import axios from 'axios';
import type {
  DailyPoint,
  ForecastResponse,
  GeocodingResult,
  GeocodingSearchResponse,
  HourlyPoint,
  Location,
  WeatherReport,
} from '../types/weather';

// Public Open-Meteo endpoints. No API key is required, so no env variables are needed.
const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const http = axios.create({ timeout: 12000 });

export class WeatherApiError extends Error {
  constructor(message: string, public readonly kind: 'network' | 'not_found' | 'invalid') {
    super(message);
    this.name = 'WeatherApiError';
  }
}

/** Search cities worldwide. Returns up to `count` matches. */
export async function searchCities(query: string, count = 6): Promise<GeocodingResult[]> {
  const term = query.trim();
  if (!term) return [];

  try {
    const { data } = await http.get<GeocodingSearchResponse>(GEOCODING_URL, {
      params: { name: term, count, language: 'en', format: 'json' },
    });
    return data.results ?? [];
  } catch (err) {
    throw toApiError(err, 'Could not search for cities. Check your connection and try again.');
  }
}

/** Fetch current, hourly and daily forecast for coordinates. Always returns Celsius and km/h. */
export async function fetchForecast(location: Location): Promise<WeatherReport> {
  try {
    const { data } = await http.get<ForecastResponse>(FORECAST_URL, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        timezone: 'auto',
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'is_day',
          'weather_code',
          'wind_speed_10m',
          'wind_direction_10m',
        ].join(','),
        hourly: [
          'temperature_2m',
          'apparent_temperature',
          'relative_humidity_2m',
          'precipitation_probability',
          'weather_code',
          'uv_index',
          'wind_speed_10m',
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'sunrise',
          'sunset',
          'uv_index_max',
          'precipitation_probability_max',
          'wind_speed_10m_max',
        ].join(','),
        forecast_days: 7,
        wind_speed_unit: 'kmh',
        temperature_unit: 'celsius',
      },
    });

    if (data.error) {
      throw new WeatherApiError(data.reason ?? 'The weather service returned an error.', 'invalid');
    }

    return normaliseForecast(location, data);
  } catch (err) {
    if (err instanceof WeatherApiError) throw err;
    throw toApiError(err, 'Could not load the forecast. Please try again.');
  }
}

/** Convert a geocoding hit into the app's Location model. */
export function toLocation(result: GeocodingResult): Location {
  return {
    name: result.name,
    region: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone ?? 'auto',
  };
}

function normaliseForecast(location: Location, data: ForecastResponse): WeatherReport {
  const c = data.current;
  const h = data.hourly;
  const d = data.daily;

  const now = Date.now();
  const currentHourIndex = findCurrentHourIndex(h.time, c.time);

  const hourly: HourlyPoint[] = h.time
    .map((time, i): HourlyPoint => ({
      time,
      temperatureC: h.temperature_2m[i],
      weatherCode: h.weather_code[i],
      precipitationProbability: h.precipitation_probability[i] ?? 0,
    }))
    // Show the next 24 hours, starting from the current hour.
    .slice(Math.max(currentHourIndex, 0), Math.max(currentHourIndex, 0) + 24);

  const daily: DailyPoint[] = d.time.map((date, i): DailyPoint => ({
    date,
    weatherCode: d.weather_code[i],
    maxC: d.temperature_2m_max[i],
    minC: d.temperature_2m_min[i],
    sunrise: d.sunrise[i],
    sunset: d.sunset[i],
    uvIndexMax: d.uv_index_max[i] ?? 0,
    precipitationProbabilityMax: d.precipitation_probability_max[i] ?? 0,
    windSpeedMaxKmh: d.wind_speed_10m_max[i],
  }));

  const uvIndexNow = h.uv_index[currentHourIndex] ?? null;

  return {
    location: { ...location, timezone: data.timezone ?? location.timezone },
    current: {
      time: c.time,
      temperatureC: c.temperature_2m,
      feelsLikeC: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      windSpeedKmh: c.wind_speed_10m,
      windDirection: c.wind_direction_10m,
      weatherCode: c.weather_code,
      isDay: c.is_day === 1,
      uvIndex: uvIndexNow,
    },
    hourly,
    daily,
    fetchedAt: now,
  };
}

// Open-Meteo returns local times without offset (e.g. "2026-11-18T15:00").
// Find the index of the hour matching the current observation.
function findCurrentHourIndex(times: string[], currentTime: string): number {
  const target = currentTime.slice(0, 13);
  const idx = times.findIndex((t) => t.slice(0, 13) === target);
  return idx === -1 ? 0 : idx;
}

function toApiError(err: unknown, fallback: string): WeatherApiError {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 404) {
      return new WeatherApiError('No data was found for that location.', 'not_found');
    }
    return new WeatherApiError(fallback, 'network');
  }
  return new WeatherApiError(fallback, 'network');
}
