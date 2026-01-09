"use client"

import type React from "react"
import useSWR from "swr"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import WeatherMap from "@/components/weather-map"
import { Cloud, CloudRain, Sun, Wind, Droplets, Gauge } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function WeatherClient() {
  const [latitude, setLatitude] = useState<string>("31.1471")
  const [longitude, setLongitude] = useState<string>("75.3412")
  const [submitted, setSubmitted] = useState<{ lat: number; lon: number } | null>(null)

  const query =
    submitted != null
      ? `https://api.open-meteo.com/v1/forecast?latitude=${submitted.lat}&longitude=${submitted.lon}&current_weather=true&hourly=temperature_2m,precipitation_probability,relative_humidity_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min`
      : null

  const { data, error, isLoading } = useSWR(query, fetcher)

  const current = data?.current_weather
  const hourly = data?.hourly
  const daily = data?.daily

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const lat = Number(latitude)
    const lon = Number(longitude)
    if (Number.isFinite(lat) && Number.isFinite(lon)) {
      setSubmitted({ lat, lon })
    }
  }

  const handleMapSelect = (lat: number, lon: number) => {
    setLatitude(lat.toFixed(4))
    setLongitude(lon.toFixed(4))
    setSubmitted({ lat, lon })
  }

  const getWeatherIcon = (code: number) => {
    if (code === 0 || code === 1) return <Sun className="w-12 h-12 text-yellow-500" />
    if (code === 2 || code === 3) return <Cloud className="w-12 h-12 text-gray-400" />
    if (code >= 45 && code <= 48) return <Cloud className="w-12 h-12 text-gray-500" />
    if (code >= 51 && code <= 67) return <CloudRain className="w-12 h-12 text-blue-500" />
    if (code >= 80 && code <= 82) return <CloudRain className="w-12 h-12 text-blue-600" />
    return <Cloud className="w-12 h-12 text-gray-400" />
  }

  const getWeatherDescription = (code: number) => {
    const descriptions: { [key: number]: string } = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Foggy",
      48: "Depositing rime fog",
      51: "Light drizzle",
      53: "Moderate drizzle",
      55: "Dense drizzle",
      61: "Slight rain",
      63: "Moderate rain",
      65: "Heavy rain",
      71: "Slight snow",
      73: "Moderate snow",
      75: "Heavy snow",
      80: "Slight rain showers",
      81: "Moderate rain showers",
      82: "Violent rain showers",
    }
    return descriptions[code] || "Unknown"
  }

  const humidity = hourly?.relative_humidity_2m?.[0] ?? null
  const precipProb = hourly?.precipitation_probability?.[0] ?? null
  const maxTemp = daily?.temperature_2m_max?.[0] ?? null
  const minTemp = daily?.temperature_2m_min?.[0] ?? null

  return (
    <div className="space-y-6">
      <Card className="border border-border bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-foreground">Weather Checker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <WeatherMap latitude={Number(latitude)} longitude={Number(longitude)} onLocationSelect={handleMapSelect} />

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <label htmlFor="lat" className="text-sm font-medium text-foreground">
                Latitude
              </label>
              <input
                id="lat"
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                step="0.0001"
                placeholder="e.g., 31.1471"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="lon" className="text-sm font-medium text-foreground">
                Longitude
              </label>
              <input
                id="lon"
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                step="0.0001"
                placeholder="e.g., 75.3412"
                className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" className="w-full">
                Check Weather
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {submitted && (
        <Card className="border border-border bg-card">
          <CardHeader>
            <CardTitle className="font-serif text-foreground">Current Weather</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && <p className="text-muted-foreground text-sm">Fetching latest weather...</p>}
            {error && submitted && (
              <p className="text-destructive text-sm">Couldn{"'"}t fetch weather. Please verify the coordinates.</p>
            )}
            {current && (
              <div className="space-y-6">
                {/* Main weather display */}
                <div className="flex items-center justify-between p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-4">
                    {getWeatherIcon(current.weather_code)}
                    <div>
                      <p className="text-3xl font-bold text-foreground">{current.temperature}°C</p>
                      <p className="text-muted-foreground">{getWeatherDescription(current.weather_code)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-sm font-medium text-foreground">
                      {submitted.lat.toFixed(4)}°N, {submitted.lon.toFixed(4)}°E
                    </p>
                  </div>
                </div>

                {/* Weather metrics grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Wind className="w-5 h-5 text-primary" />
                      <p className="text-xs text-muted-foreground">Wind Speed</p>
                    </div>
                    <p className="text-lg font-semibold text-foreground">{current.windspeed} km/h</p>
                  </div>

                  {humidity != null && (
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <p className="text-xs text-muted-foreground">Humidity</p>
                      </div>
                      <p className="text-lg font-semibold text-foreground">{humidity}%</p>
                    </div>
                  )}

                  {precipProb != null && (
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <CloudRain className="w-5 h-5 text-blue-600" />
                        <p className="text-xs text-muted-foreground">Precipitation</p>
                      </div>
                      <p className="text-lg font-semibold text-foreground">{precipProb}%</p>
                    </div>
                  )}

                  {maxTemp != null && minTemp != null && (
                    <div className="p-4 rounded-lg bg-muted/50 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Gauge className="w-5 h-5 text-orange-500" />
                        <p className="text-xs text-muted-foreground">Temp Range</p>
                      </div>
                      <p className="text-lg font-semibold text-foreground">
                        {maxTemp}° / {minTemp}°
                      </p>
                    </div>
                  )}
                </div>

                {/* Agricultural tips */}
                <div className="rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-4">
                  <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-2">🌾 Agricultural Tips</p>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    {precipProb != null && precipProb > 50 && (
                      <li>• High precipitation probability ({precipProb}%) - Delay pesticide application</li>
                    )}
                    {current.windspeed > 20 && <li>• Strong winds ({current.windspeed} km/h) - Avoid spraying</li>}
                    {current.temperature > 35 && <li>• High temperature - Increase irrigation frequency</li>}
                    {current.temperature < 5 && <li>• Low temperature - Risk of frost damage, protect seedlings</li>}
                    {humidity != null && humidity > 80 && (
                      <li>• High humidity ({humidity}%) - Monitor for fungal diseases</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
