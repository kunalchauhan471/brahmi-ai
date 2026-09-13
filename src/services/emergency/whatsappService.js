/**
 * WhatsApp Service — opens WhatsApp with pre-filled emergency message
 * Uses WhatsApp's click-to-chat API (no backend needed)
 * Clearly distinguishes "Message Prepared" from "Message Delivered"
 */

import { getLocationLink } from './locationService'

export function buildWhatsAppMessage(patientData, emergency) {
  const locationLink = emergency.location?.available
    ? getLocationLink(emergency.location.latitude, emergency.location.longitude)
    : 'Location unavailable'

  const heartRate = emergency.smartwatch?.heartRate
    ? `${emergency.smartwatch.heartRate} BPM`
    : 'Unavailable'

  return [
    '🚨 *BRAHMI AI EMERGENCY*',
    '',
    `*Patient:* ${patientData.name || 'Unknown'}`,
    `*Emergency:* ${emergency.reason || 'Emergency button activated'}`,
    `*Time:* ${emergency.timestamp}`,
    `*Heart Rate:* ${heartRate}`,
    `*Location:* ${locationLink || 'Unavailable'}`,
    '',
    'Please reach the patient immediately.',
  ].join('\n')
}

export function openWhatsApp(phone, message) {
  let cleanPhone = phone.replace(/[\s\-()+]/g, '')
  if (!cleanPhone.startsWith('+')) {
    if (cleanPhone.length === 10) cleanPhone = '91' + cleanPhone
  }

  const encoded = encodeURIComponent(message)
  const url = `https://wa.me/${cleanPhone}?text=${encoded}`
  window.open(url, '_blank')
}

export function getWhatsAppStatus(route) {
  if (route === 'internet') return 'prepared'
  return 'unavailable'
}
