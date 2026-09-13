/**
 * Timezone utilities for Asia/Kolkata (IST, UTC+05:30)
 * India does not observe Daylight Saving Time.
 */

const IST_TIMEZONE = 'Asia/Kolkata'

/**
 * Get the current date/time in IST
 */
export function getNowIST() {
  const now = new Date()
  const istString = now.toLocaleString('en-US', { timeZone: IST_TIMEZONE })
  return new Date(istString)
}

/**
 * Get current IST hour (0-23)
 */
export function getISTHour() {
  return getNowIST().getHours()
}

/**
 * Get current IST minutes (0-59)
 */
export function getISTMinutes() {
  return getNowIST().getMinutes()
}

/**
 * Get current IST hour and minutes as total minutes from midnight
 */
export function getISTTotalMinutes() {
  const ist = getNowIST()
  return ist.getHours() * 60 + ist.getMinutes()
}

/**
 * Get greeting based on IST time
 */
export function getGreetingIST() {
  const hour = getISTHour()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

/**
 * Parse a time string like "08:00 AM" or "1:00 PM" into total minutes from midnight
 * Uses IST assumption — no timezone conversion needed for schedule comparison
 */
export function parseTimeToMinutes(timeStr) {
  const cleaned = timeStr.trim()
  const isPM = /PM/i.test(cleaned)
  const isAM = /AM/i.test(cleaned)
  const withoutMeridiem = cleaned.replace(/\s*(AM|PM)/i, '').trim()
  const parts = withoutMeridiem.split(':')
  if (parts.length !== 2) return null
  let hours = parseInt(parts[0], 10)
  const minutes = parseInt(parts[1], 10)
  if (isNaN(hours) || isNaN(minutes)) return null

  if (isPM && hours !== 12) hours += 12
  if (isAM && hours === 12) hours = 0

  return hours * 60 + minutes
}

/**
 * Format IST date for display (e.g., "August 27, 2026, 2:30 PM")
 */
export function formatISTDate(date = new Date()) {
  return date.toLocaleString('en-IN', {
    timeZone: IST_TIMEZONE,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}
