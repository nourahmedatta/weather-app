# Weatherly

A weather forecast web app built with React, Vite, TypeScript and Tailwind CSS. It uses the public Open-Meteo Geocoding and Forecast APIs. No API key is needed.

## Features

- Search any city worldwide
- Current temperature, feels-like, humidity, wind and UV index
- Next 24 hours temperature chart
- 7-day forecast
- Celsius / Fahrenheit switch
- Recent searches, saved in the browser
- Light and dark mode
- Loading, empty and error states
- Responsive layout for phones, tablets and desktops

## Stack

- React 18 with Vite and TypeScript
- Tailwind CSS
- Axios for HTTP
- Recharts for the hourly chart
- Lucide React icons

## Setup

Requires Node.js 18 or later.

```bash
cd weatherly
npm install
npm run dev
```

Open the local address Vite prints (usually http://localhost:5173).

To create a production build:

```bash
npm run build
npm run preview
```

## Environment variables

None are required. Open-Meteo is free and needs no key.

## Project structure

```
src/
  services/weatherApi.ts   Open-Meteo calls and conversion to app models
  types/weather.ts         TypeScript types for API responses and app models
  hooks/                   useWeather, useTheme, useRecentCities
  utils/weather.ts         Unit conversion, WMO weather codes, formatting
  components/              Header, SearchBar, CurrentWeather, HourlyChart, DailyForecast, and others
  App.tsx                  App shell and state wiring
```

## Deploying to Vercel

1. Push this project to a Git repository (or import the folder directly).
2. In Vercel, choose **Add New Project** and select the repository.
3. Set the root directory to `weatherly` if the repository contains other folders.
4. Vercel detects Vite. The build command is `npm run build` and the output directory is `dist`.
5. `vercel.json` is included for single-page routing. Deploy.

## Data source

Weather data and geocoding are provided by [Open-Meteo](https://open-meteo.com/).
