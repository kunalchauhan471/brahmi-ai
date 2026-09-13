/**
 * Location Service — captures patient's GPS location
 * Uses browser Geolocation API
 * Never blocks the emergency flow if location fails
 */

export function captureLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ available: false, reason: 'Geolocation not supported' })
      return
    }

    const timeout = setTimeout(() => {
      resolve({ available: false, reason: 'Location request timed out' })
    }, 8000)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeout)
        resolve({
          available: true,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        })
      },
      (error) => {
        clearTimeout(timeout)
        let reason = 'Location unavailable'
        if (error.code === 1) reason = 'Location permission denied'
        else if (error.code === 2) reason = 'Location unavailable'
        else if (error.code === 3) reason = 'Location request timed out'
        resolve({ available: false, reason })
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 0 }
    )
  })
}

export function getLocationLink(latitude, longitude) {
  if (!latitude || !longitude) return null
  return `https://www.google.com/maps?q=${latitude},${longitude}`
}

export function formatLocationAccuracy(accuracy) {
  if (!accuracy) return 'Unknown'
  if (accuracy < 50) return `High (~${Math.round(accuracy)}m)`
  if (accuracy < 200) return `Medium (~${Math.round(accuracy)}m)`
  return `Low (~${Math.round(accuracy)}m)`
}
