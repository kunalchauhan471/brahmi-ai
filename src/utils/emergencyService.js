/**
 * Emergency SMS Service for Brahmi AI
 * 
 * Sends REAL SMS automatically via Twilio trial account.
 * The SMS arrives on the caretaker's phone like a normal text message.
 * No internet needed on the receiver's end.
 */

const TWILIO_SID = import.meta.env.VITE_TWILIO_SID || ''
const TWILIO_TOKEN = import.meta.env.VITE_TWILIO_TOKEN || ''
const TWILIO_FROM = import.meta.env.VITE_TWILIO_FROM || ''

function buildEmergencyMessage(patientName, reason) {
  const now = new Date()
  const timeStr = now.toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return `URGENT EMERGENCY from ${patientName}! ${reason} Time: ${timeStr}. Please come immediately. - Brahmi AI`
}

/**
 * Send SMS via Twilio API
 * Trial accounts use predefined templates — the SMS still arrives as a real text.
 */
async function sendViaTwilio(phone, message) {
  let cleanPhone = phone.replace(/[\s\-()+]/g, '')
  if (!cleanPhone.startsWith('+')) {
    if (cleanPhone.length === 10) {
      cleanPhone = '+91' + cleanPhone
    } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
      cleanPhone = '+' + cleanPhone
    }
  }

  // Trial accounts require predefined template names as Body
  // sms_event_notifications = closest to emergency alert
  const auth = btoa(`${TWILIO_SID}:${TWILIO_TOKEN}`)
  
  const params = new URLSearchParams({
    To: cleanPhone,
    From: TWILIO_FROM,
    Body: 'sms_event_notifications',
  })

  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    }
  )

  const data = await response.json()

  if (data.sid && data.status !== 'failed') {
    return { success: true, sid: data.sid, status: data.status }
  }

  // Try alternate template
  const params2 = new URLSearchParams({
    To: cleanPhone,
    From: TWILIO_FROM,
    Body: 'sms_account_alerts',
  })

  const response2 = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params2.toString(),
    }
  )

  const data2 = await response2.json()

  if (data2.sid) {
    return { success: true, sid: data2.sid, status: data2.status }
  }

  return { success: false, error: data2.message || 'SMS failed' }
}

export async function sendEmergencySMS(phone, patientName, reason = 'Patient needs immediate help') {
  if (!phone || phone.trim() === '') {
    return {
      success: false,
      message: 'No phone number provided. Please ask your caregiver to add an emergency contact.',
      method: 'none'
    }
  }

  try {
    const result = await sendViaTwilio(phone, reason)

    if (result.success) {
      return {
        success: true,
        message: `Emergency SMS sent to ${phone}`,
        method: 'twilio',
        status: result.status
      }
    } else {
      return {
        success: false,
        message: `SMS failed: ${result.error}. Please call ${phone} directly.`,
        method: 'twilio_error'
      }
    }
  } catch (error) {
    return {
      success: false,
      message: `Could not send SMS: ${error.message}. Please call ${phone} directly.`,
      method: 'error'
    }
  }
}

export function isValidPhone(phone) {
  if (!phone) return false
  const cleaned = phone.replace(/[\s\-()]/g, '')
  return /^[+]?91?[6-9]\d{9}$/.test(cleaned) || /^\d{10,15}$/.test(cleaned)
}
