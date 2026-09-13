/**
 * Emergency SMS Service for Brahmi AI
 *
 * 100% FREE — No API, no signup, no payment
 *
 * MOBILE: Opens native SMS app → patient taps Send → real SMS via cellular
 * DESKTOP: Opens phone dialer to call caretaker directly
 *
 * The SMS goes through the patient's own SIM card.
 * Caretaker receives it WITHOUT internet.
 */

function buildEmergencyMessage(patientName, reason) {
  const now = new Date()
  const timeStr = now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: 'numeric',
    month: 'short',
  })

  return `URGENT EMERGENCY from ${patientName}! ${reason} Time: ${timeStr}. Please come immediately or call ${patientName}. This is an automated emergency alert from Brahmi AI.`
}

function formatPhone(phone) {
  let clean = phone.replace(/[\s\-()]/g, '')
  if (!clean.startsWith('+')) {
    if (clean.length === 10) clean = '+91' + clean
    else if (clean.length === 12 && clean.startsWith('91')) clean = '+' + clean
    else if (clean.length > 10) clean = '+' + clean
  }
  return clean
}

export async function sendEmergencySMS(phone, patientName, reason = 'Patient pressed the emergency button — they need immediate help.') {
  if (!phone || phone.trim() === '') {
    return {
      success: false,
      message: 'No emergency phone number set. Please ask your caregiver to add one.',
      method: 'none'
    }
  }

  const message = buildEmergencyMessage(patientName, reason)
  const formattedPhone = formatPhone(phone)
  const isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  // ── MOBILE: Open native SMS app ──
  if (isMobile) {
    const smsUri = `sms:${formattedPhone}?body=${encodeURIComponent(message)}`
    window.location.href = smsUri
    return {
      success: true,
      message: `Your messaging app is opening with the emergency message. Tap Send to deliver SMS to your caregiver through the cellular network — no internet needed.`,
      method: 'native_sms',
    }
  }

  // ── DESKTOP: Open phone dialer to call caretaker ──
  // If patient is on laptop, calling is more useful than SMS
  window.location.href = `tel:${formattedPhone}`
  return {
    success: true,
    message: `Opening phone dialer to call ${phone}. You can also send SMS from your phone.`,
    method: 'phone_call',
  }
}

export function isValidPhone(phone) {
  if (!phone) return false
  const cleaned = phone.replace(/[\s\-()]/g, '')
  return /^[+]?91?[6-9]\d{9}$/.test(cleaned) || /^\d{10,15}$/.test(cleaned)
}
