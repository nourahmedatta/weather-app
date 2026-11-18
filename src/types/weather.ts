// Response shapes for Open-Meteo Geocoding and Forecast APIs.

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

// Open-Meteo returns an array of results, or omits the key when nothing matches.
export type GeocodingSearchResponse = {
  results?: GeocodingResult[];
  generationtime_ms?: number;
};

export interface CurrentWeatherRaw {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  weather_code: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
}

export interface HourlyRaw {
  time: string[];
  temperature_2m: number[];
  apparent_temperature: number[];
  relative_humidity_2m: number[];
  precipitation_probability: number[];
  weather_code: number[];
  uv_index: number[];
  wind_speed_10m: number[];
}

export interface DailyRaw {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
}

export interface ForecastResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  utc_offset_seconds: number;
  elevation: number;
  current: CurrentWeatherRaw;
  current_units: Record<string, string>;
  hourly: HourlyRaw;
  daily: DailyRaw;
  error?: boolean;
  reason?: string;
}

// Normalised, UI-ready models. Temperatures are always stored in Celsius;
// the UI converts for display.

export interface Location {
  name: string;
  region?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface CurrentConditions {
  time: string;
  temperatureC: number;
  feelsLikeC: number;
  humidity: number;
  windSpeedKmh: number;
  windDirection: number;
  weatherCode: number;
  isDay: boolean;
  uvIndex: number | null;
}

export interface HourlyPoint {
  time: string;
  temperatureC: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface DailyPoint {
  date: string;
  weatherCode: number;
  maxC: number;
  minC: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationProbabilityMax: number;
  windSpeedMaxKmh: number;
}

export interface WeatherReport {
  location: Location;
  current: CurrentConditions;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
  fetchedAt: number;
}

export interface RecentCity {
  name: string;
  region?: string;
  country?: string;
  latitude: number;
  longitude: number;
  timezone: string;
}
