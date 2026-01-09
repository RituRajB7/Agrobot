"use client"
import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface WeatherMapProps {
  latitude: number
  longitude: number
  onLocationSelect: (lat: number, lon: number) => void
}

export default function WeatherMap({ latitude, longitude, onLocationSelect }: WeatherMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const marker = useRef<L.Marker | null>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !mapContainer.current) return

    // Initialize map only once
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([latitude, longitude], 10)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map.current)

      // Add click handler to map
      map.current.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng
        updateMarker(lat, lng)
        onLocationSelect(lat, lng)
      })
    }

    // Update marker position
    updateMarker(latitude, longitude)

    // Update map view
    if (map.current) {
      map.current.setView([latitude, longitude], 10)
    }
  }, [isClient, latitude, longitude, onLocationSelect])

  const updateMarker = (lat: number, lng: number) => {
    if (!map.current) return

    if (marker.current) {
      marker.current.setLatLng([lat, lng])
    } else {
      marker.current = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        }),
      })
        .bindPopup(
          `<div class="text-sm"><strong>Location</strong><br/>Lat: ${lat.toFixed(4)}<br/>Lon: ${lng.toFixed(4)}</div>`,
        )
        .addTo(map.current)
    }
  }

  if (!isClient) {
    return <div className="h-96 bg-muted rounded-lg flex items-center justify-center">Loading map...</div>
  }

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">Click on the map to select a location</p>
      <div ref={mapContainer} className="h-96 rounded-lg border border-border overflow-hidden shadow-md" />
    </div>
  )
}
