"use client"

import { useEffect, useState } from "react"
import { Monitor, Smartphone, MapPin, Shield, AlertTriangle } from "lucide-react"

export function DeviceDetector() {
  const [deviceType, setDeviceType] = useState<"desktop" | "mobile" | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locationPermission, setLocationPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [networkSecurity, setNetworkSecurity] = useState<"secure" | "warning" | "checking">("checking")

  useEffect(() => {
    const checkDevice = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      setDeviceType(isMobile ? "mobile" : "desktop")
    }
    checkDevice()

    const checkNetworkSecurity = () => {
      const isSecure = window.location.protocol === "https:"
      const hasServiceWorker = "serviceWorker" in navigator
      const hasSecureContext = window.isSecureContext

      if (isSecure && hasServiceWorker && hasSecureContext) {
        setNetworkSecurity("secure")
      } else {
        setNetworkSecurity("warning")
      }
    }
    checkNetworkSecurity()
  }, [])

  const requestLocation = async () => {
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
        setLocationPermission("granted")
      } catch (error) {
        setLocationPermission("denied")
      }
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {/* Device Type Indicator */}
      <div className="bg-[#0f0f0f] border-2 border-primary/50 p-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {deviceType === "desktop" ? (
            <Monitor className="w-4 h-4 text-primary" />
          ) : (
            <Smartphone className="w-4 h-4 text-primary" />
          )}
          <span className="text-xs font-mono uppercase tracking-wider">
            {deviceType === "desktop" ? "DESKTOP" : "MOBILE"}
          </span>
        </div>
      </div>

      {/* Network Security Indicator */}
      <div
        className={`bg-[#0f0f0f] border-2 p-3 backdrop-blur-sm ${
          networkSecurity === "secure" ? "border-green-500/50" : "border-yellow-500/50"
        }`}
      >
        <div className="flex items-center gap-2">
          {networkSecurity === "secure" ? (
            <Shield className="w-4 h-4 text-green-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
          )}
          <span className="text-xs font-mono uppercase tracking-wider">
            {networkSecurity === "secure" ? "SECURE" : "CHECK CONNECTION"}
          </span>
        </div>
      </div>

      {/* GPS Location */}
      {locationPermission === "prompt" && (
        <button
          onClick={requestLocation}
          className="bg-[#0f0f0f] border-2 border-primary/50 p-3 backdrop-blur-sm hover:border-primary transition-colors w-full"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-wider">ENABLE GPS</span>
          </div>
        </button>
      )}

      {location && (
        <div className="bg-[#0f0f0f] border-2 border-green-500/50 p-3 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-500" />
            <span className="text-xs font-mono uppercase tracking-wider">GPS ACTIVE</span>
          </div>
        </div>
      )}
    </div>
  )
}
