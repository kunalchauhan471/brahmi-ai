/**
 * SMS Service — modular and replaceable
 *
 * Current: Simulation (for prototype)
 * Future: Replace with real Android SMS Gateway (TextBee, etc.)
 *
 * The Emergency Engine calls this service.
 * Changing this service doesn't affect the rest of the system.
 */

import { getLocationLink } from './locationService'

/**
 * Build SMS payload
 */
export function buildSMSMessage(patientData, emergency) {
  const locationLink = emergency.location?.available
    ? getLocationLink(emergency.location.latitude, emergency.location.longitude)
    : 'Location unavailable'

  const heartRate = emergency.smartwatch?.heartRate
    ? `${emergency.smartwatch.heartRate} BPM`
    : 'Unavailable'

  return [
    '🚨 BRAHMI AI EMERGENCY',
    '',
    `Patient: ${patientData.name || 'Unknown'}`,
    `Emergency: ${emergency.reason || 'Emergency button activated'}`,
    `Time: ${emergency.timestamp}`,
    `Heart Rate: ${heartRate}`,
    `Location: ${locationLink || 'Unavailable'}`,
    '',
    'Please reach the patient immediately.',
  ].join('\n')
}

/**
 * Send SMS — currently simulated
 * To connect a real gateway, replace this function's internals.
 *
 * Real gateway example (TextBee):
 *   const response = await fetch('https://api.textbee.dev/api/v1/send', {
 *     method: 'POST',
 *     headers: { 'x-auth-key': API_KEY },
 *     body: JSON.stringify({ gateway: GATEWAY_ID, to: phone, message })
 *   })
 */
export async function sendSMS(phone, message) {
  // SIMULATION — no real SMS is sent
  // The UI will show "Simulation" status
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        simulated: true,
        message: `SMS prepared for ${phone} (simulation)`,
        timestamp: new Date().toISOString(),
      })
    }, 1500)
  })
}

export function getSMSStatus(route) {
  if (route === 'sms') return 'simulated'
  return 'unavailable'
}
