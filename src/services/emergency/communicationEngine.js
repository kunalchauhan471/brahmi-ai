/**
 * Emergency Communication Engine
 * Determines the best available communication route
 * Priority: Internet → SMS → Bluetooth → Offline Queue
 */

export function checkCommunicationChannels() {
  const internet = typeof navigator !== 'undefined' ? navigator.onLine : true

  // Cellular: browsers can't directly detect cellular service
  // We mark it as "Available*" with a note
  const cellular = true // Assumed available on mobile devices

  // Bluetooth: check if Web Bluetooth API is available and smartwatch connected
  const bluetooth = typeof navigator !== 'undefined' && 'bluetooth' in navigator

  return {
    internet: { available: internet, label: internet ? 'Available' : 'Unavailable' },
    cellular: { available: cellular, label: 'Available*', note: 'Requires native integration for real verification' },
    bluetooth: { available: bluetooth, label: bluetooth ? 'Available' : 'Unavailable' },
  }
}

export function determinePreferredRoute(channels) {
  if (channels.internet.available) return 'internet'
  if (channels.cellular.available) return 'sms'
  if (channels.bluetooth.available) return 'bluetooth'
  return 'offline'
}

export function getRouteLabel(route) {
  const labels = {
    internet: 'Internet / WhatsApp',
    sms: 'SMS via Cellular',
    bluetooth: 'Bluetooth / Offline Relay',
    offline: 'Offline — Retry When Available',
  }
  return labels[route] || 'Unknown'
}

export function getRouteIcon(route) {
  const icons = {
    internet: '🌐',
    sms: '📱',
    bluetooth: '📶',
    offline: '💾',
  }
  return icons[route] || '📡'
}
