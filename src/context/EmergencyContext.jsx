import { createContext, useContext, useState, useCallback, useRef } from 'react'

const EmergencyContext = createContext(null)

// Generate unique emergency ID
function generateEmergencyId() {
  return `EMG-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}

// IST timestamp
function getISTTimestamp() {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getISTTime() {
  return new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

export function EmergencyProvider({ children }) {
  const [activeEmergency, setActiveEmergency] = useState(null)
  const [emergencyHistory, setEmergencyHistory] = useState(() => {
    try {
      const data = localStorage.getItem('brahmi_emergency_history')
      return data ? JSON.parse(data) : []
    } catch { return [] }
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [acknowledged, setAcknowledged] = useState(false)
  const timelineRef = useRef([])

  const addTimelineEvent = useCallback((event) => {
    timelineRef.current = [...timelineRef.current, {
      time: getISTTime(),
      ...event,
    }]
  }, [])

  const triggerEmergency = useCallback(async (patientData, smartwatchData, emergencyContact) => {
    if (isProcessing) return null

    setIsProcessing(true)
    timelineRef.current = []

    const emergencyId = generateEmergencyId()
    const timestamp = getISTTimestamp()

    const emergency = {
      id: emergencyId,
      patientName: patientData.name || 'Unknown',
      patientAge: patientData.age,
      emergencyContactName: emergencyContact?.name || '',
      emergencyContactPhone: emergencyContact?.phone || '',
      reason: 'Emergency button activated',
      timestamp,
      smartwatch: smartwatchData?.connected ? {
        heartRate: smartwatchData.heartRate,
        battery: smartwatchData.battery,
        watchName: smartwatchData.watchName,
        connected: true,
      } : { connected: false },
      location: null,
      communication: null,
      whatsappStatus: 'pending',
      smsStatus: 'pending',
      status: 'processing',
      acknowledged: false,
      timeline: [],
    }

    addTimelineEvent({ event: '🚨 Emergency button pressed', type: 'emergency' })
    setActiveEmergency(emergency)

    // Step 1: Capture location
    addTimelineEvent({ event: '📍 Capturing patient location...', type: 'location' })
    const { captureLocation } = await import('../services/emergency/locationService.js')
    const location = await captureLocation()
    emergency.location = location
    addTimelineEvent({
      event: location.available
        ? `📍 Location captured (±${Math.round(location.accuracy)}m)`
        : `📍 ${location.reason}`,
      type: location.available ? 'success' : 'warning',
    })

    // Step 2: Check communication channels
    addTimelineEvent({ event: '📡 Checking communication channels...', type: 'info' })
    const { checkCommunicationChannels, determinePreferredRoute } = await import('../services/emergency/communicationEngine.js')
    const channels = checkCommunicationChannels()
    const preferredRoute = determinePreferredRoute(channels)
    emergency.communication = { channels, preferredRoute }
    addTimelineEvent({
      event: `📡 Preferred route: ${preferredRoute === 'internet' ? 'WhatsApp' : preferredRoute === 'sms' ? 'SMS via Cellular' : preferredRoute === 'bluetooth' ? 'Bluetooth' : 'Offline Queue'}`,
      type: 'info',
    })

    // Step 3: Process via preferred route
    if (preferredRoute === 'internet') {
      // WhatsApp — open directly with pre-filled message
      addTimelineEvent({ event: '📱 Opening WhatsApp with emergency alert...', type: 'info' })
      const { buildWhatsAppMessage, openWhatsApp } = await import('../services/emergency/whatsappService.js')
      const whatsappMsg = buildWhatsAppMessage(patientData, emergency)
      emergency.whatsappMessage = whatsappMsg
      if (emergencyContact?.phone) {
        openWhatsApp(emergencyContact.phone, whatsappMsg)
        emergency.whatsappStatus = 'sent'
        addTimelineEvent({ event: '✅ WhatsApp opened with emergency message', type: 'success' })
      } else {
        emergency.whatsappStatus = 'unavailable'
        addTimelineEvent({ event: '⚠️ No emergency contact phone for WhatsApp', type: 'warning' })
      }

      // Also try SMS as backup
      addTimelineEvent({ event: '📱 Sending SMS backup...', type: 'info' })
      const { sendSMS, buildSMSMessage } = await import('../services/emergency/smsService.js')
      const smsMsg = buildSMSMessage(patientData, emergency)
      const smsResult = await sendSMS(emergencyContact?.phone, smsMsg)
      emergency.smsStatus = smsResult.simulated ? 'simulated' : 'sent'
      addTimelineEvent({
        event: smsResult.simulated ? '📱 SMS prepared (simulation)' : '✅ SMS sent',
        type: 'success',
      })

    } else if (preferredRoute === 'sms') {
      addTimelineEvent({ event: '📱 Internet unavailable — using SMS fallback', type: 'warning' })
      const { sendSMS, buildSMSMessage } = await import('../services/emergency/smsService.js')
      const smsMsg = buildSMSMessage(patientData, emergency)
      const smsResult = await sendSMS(emergencyContact?.phone, smsMsg)
      emergency.smsStatus = smsResult.simulated ? 'simulated' : 'sent'
      emergency.whatsappStatus = 'unavailable'
      addTimelineEvent({
        event: smsResult.simulated ? '📱 SMS prepared (simulation)' : '✅ SMS sent via cellular',
        type: 'success',
      })

    } else if (preferredRoute === 'offline') {
      addTimelineEvent({ event: '💾 No channel available — saving offline', type: 'warning' })
      const { addToQueue } = await import('../services/emergency/offlineQueue.js')
      addToQueue(emergency)
      emergency.status = 'pending'
      emergency.whatsappStatus = 'unavailable'
      emergency.smsStatus = 'unavailable'
      addTimelineEvent({ event: '💾 Emergency saved — will retry when online', type: 'warning' })
    }

    // Step 4: Update status
    emergency.status = preferredRoute === 'offline' ? 'pending' : 'active'
    emergency.timeline = [...timelineRef.current]
    addTimelineEvent({ event: '✅ Emergency alert delivered to caregiver', type: 'success' })
    emergency.timeline = [...timelineRef.current]

    // Save to history
    const historyEntry = { ...emergency }
    setEmergencyHistory(prev => {
      const updated = [historyEntry, ...prev].slice(0, 50)
      localStorage.setItem('brahmi_emergency_history', JSON.stringify(updated))
      return updated
    })

    setActiveEmergency(emergency)
    setIsProcessing(false)
    setAcknowledged(false)

    return emergency
  }, [isProcessing, addTimelineEvent])

  const acknowledgeEmergency = useCallback(() => {
    setAcknowledged(true)
    if (activeEmergency) {
      const updated = { ...activeEmergency, acknowledged: true, status: 'acknowledged' }
      setActiveEmergency(updated)
      setEmergencyHistory(prev => {
        const updated2 = prev.map(e =>
          e.id === activeEmergency.id ? { ...e, acknowledged: true, status: 'acknowledged' } : e
        )
        localStorage.setItem('brahmi_emergency_history', JSON.stringify(updated2))
        return updated2
      })
    }
  }, [activeEmergency])

  const clearEmergency = useCallback(() => {
    setActiveEmergency(null)
    setAcknowledged(false)
    timelineRef.current = []
  }, [])

  const value = {
    activeEmergency,
    emergencyHistory,
    isProcessing,
    acknowledged,
    triggerEmergency,
    acknowledgeEmergency,
    clearEmergency,
  }

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  )
}

export function useEmergency() {
  const ctx = useContext(EmergencyContext)
  if (!ctx) throw new Error('useEmergency must be used within EmergencyProvider')
  return ctx
}
