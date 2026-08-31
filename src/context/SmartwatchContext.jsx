import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'

const SmartwatchContext = createContext()

export const useSmartwatch = () => {
  const context = useContext(SmartwatchContext)
  if (!context) {
    throw new Error('useSmartwatch must be used within a SmartwatchProvider')
  }
  return context
}

// ── BLE UUIDs ──
const HEART_RATE_SERVICE = 0x180D
const HEART_RATE_MEASUREMENT = 0x2A37
const BATTERY_SERVICE = 0x180F
const BATTERY_LEVEL = 0x2A19

// Generate realistic simulated heart rate
function generateHeartRate(prevRate = 72) {
  const change = (Math.random() - 0.5) * 8
  return Math.round(Math.max(55, Math.min(120, prevRate + change)))
}

function generateSteps(prev = 0) {
  return prev + Math.floor(Math.random() * 50) + 10
}

function calculateCalories(steps) {
  return Math.round(steps * 0.05)
}

function getHeartRateStatus(bpm) {
  if (bpm < 50) return { label: 'Very Low', color: 'text-red-500', bg: 'bg-red-50', urgent: true }
  if (bpm < 60) return { label: 'Slightly Low', color: 'text-amber-500', bg: 'bg-amber-50', urgent: false }
  if (bpm <= 100) return { label: 'Normal', color: 'text-emerald-500', bg: 'bg-emerald-50', urgent: false }
  if (bpm <= 110) return { label: 'Slightly High', color: 'text-amber-500', bg: 'bg-amber-50', urgent: false }
  return { label: 'Very High', color: 'text-red-500', bg: 'bg-red-50', urgent: true }
}

// ── Parse BLE Heart Rate Measurement characteristic ──
// Format: flags (1 byte) + heart rate value (1 or 2 bytes) + optional extras
function parseHeartRate(dataView) {
  const flags = dataView.getUint8(0)
  const is16Bit = flags & 0x01  // bit 0: 0=UINT8, 1=UINT16
  const hasEnergyExpended = flags & 0x08  // bit 3
  const hasRRInterval = flags & 0x10  // bit 4

  let offset = 1
  let heartRate
  if (is16Bit) {
    heartRate = dataView.getUint16(offset, true) // little-endian
    offset += 2
  } else {
    heartRate = dataView.getUint8(offset)
    offset += 1
  }

  // Skip energy expended if present
  if (hasEnergyExpended) {
    offset += 2
  }

  return { heartRate, hasRRInterval, flags }
}

const initialHealthData = {
  heartRate: 72,
  steps: 3245,
  calories: 162,
  sleepHours: 7.2,
  activityMinutes: 45,
  waterGlasses: 4,
  lastSync: new Date().toISOString(),
  battery: 78,
  signalStrength: 85,
  connected: false,
  watchName: 'Brahmi Band',
  isRealData: false, // true when BLE is streaming real data
}

const initialTimeline = [
  { id: 1, time: '08:00', event: 'Heart Rate Normal', type: 'health', bpm: 68 },
  { id: 2, time: '08:00', event: 'Morning Medicine Taken', type: 'medication' },
  { id: 3, time: '08:30', event: 'Breakfast Completed', type: 'activity' },
  { id: 4, time: '09:30', event: 'Walk Completed (15 min)', type: 'activity' },
  { id: 5, time: '10:15', event: 'Heart Rate Normal', type: 'health', bpm: 74 },
  { id: 6, time: '11:00', event: 'Water Reminder Sent', type: 'reminder' },
  { id: 7, time: '12:30', event: 'Heart Rate Slightly Elevated', type: 'health', bpm: 105 },
]

const initialInsights = [
  { id: 1, text: "Today's activity is better than yesterday! Keep it up.", type: 'positive' },
  { id: 2, text: 'Heart rate has remained stable throughout the morning.', type: 'positive' },
  { id: 3, text: 'Medicine schedule completed on time.', type: 'positive' },
  { id: 4, text: 'You slept slightly less than usual last night.', type: 'info' },
]

export function SmartwatchProvider({ children }) {
  const [healthData, setHealthData] = useState(initialHealthData)
  const [timeline, setTimeline] = useState(initialTimeline)
  const [insights, setInsights] = useState(initialInsights)
  const [alerts, setAlerts] = useState([])
  const [emergencyActive, setEmergencyActive] = useState(false)
  const [emergencyEvents, setEmergencyEvents] = useState([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [bleDevice, setBleDevice] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [bleError, setBleError] = useState(null)
  const [weeklyData] = useState([
    { day: 'Mon', heartRate: [68, 72, 75, 70, 73], steps: 4200, calories: 210 },
    { day: 'Tue', heartRate: [65, 70, 68, 72, 71], steps: 3800, calories: 190 },
    { day: 'Wed', heartRate: [70, 78, 82, 76, 74], steps: 5100, calories: 255 },
    { day: 'Thu', heartRate: [66, 71, 69, 73, 72], steps: 4500, calories: 225 },
    { day: 'Fri', heartRate: [68, 73, 70, 74, 72], steps: 3900, calories: 195 },
    { day: 'Sat', heartRate: [72, 75, 78, 76, 74], steps: 5600, calories: 280 },
    { day: 'Sun', heartRate: [65, 68, 70, 67, 69], steps: 3200, calories: 160 },
  ])

  const prevHeartRateRef = useRef(72)
  const inactiveTimeRef = useRef(0)
  const bleCharacteristicRef = useRef(null)
  const batteryCharacteristicRef = useRef(null)
  const bleServerRef = useRef(null)
  const autoReconnectRef = useRef(true)
  const bleReadingCountRef = useRef(0)

  // ── Simulated data (only when NOT using real BLE data) ──
  useEffect(() => {
    if (!healthData.connected || healthData.isRealData) return

    const interval = setInterval(() => {
      setHealthData(prev => {
        const newHR = generateHeartRate(prev.heartRate)
        prevHeartRateRef.current = newHR
        return {
          ...prev,
          heartRate: newHR,
          steps: generateSteps(prev.steps),
          calories: calculateCalories(generateSteps(prev.steps)),
          lastSync: new Date().toISOString(),
          battery: Math.max(5, prev.battery - (Math.random() > 0.9 ? 1 : 0)),
        }
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [healthData.connected, healthData.isRealData])

  // ── Timeline entries periodically ──
  useEffect(() => {
    if (!healthData.connected) return

    const interval = setInterval(() => {
      const now = new Date()
      const timeStr = now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
      const hr = healthData.heartRate
      const status = getHeartRateStatus(hr)

      setTimeline(prev => {
        const newEntry = {
          id: Date.now(),
          time: timeStr,
          event: `Heart Rate ${status.label} (${hr} BPM)`,
          type: 'health',
          bpm: hr,
        }
        return [...prev.slice(-14), newEntry]
      })
    }, 15000)

    return () => clearInterval(interval)
  }, [healthData.connected, healthData.heartRate])

  // ── Emergency detection ──
  useEffect(() => {
    if (!healthData.connected) return

    const hr = healthData.heartRate
    const status = getHeartRateStatus(hr)

    if (status.urgent) {
      const newAlert = {
        id: Date.now(),
        time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        parameter: 'Heart Rate',
        value: `${hr} BPM`,
        priority: hr < 50 || hr > 115 ? 'Critical' : 'Warning',
        action: hr < 50 ? 'Sit down and rest. Seek help immediately.' : 'Please sit and relax for a few minutes.',
        patientName: 'Patient',
      }
      setAlerts(prev => [...prev.slice(-19), newAlert])

      if (hr < 45 || hr > 120) {
        setEmergencyActive(true)
        setEmergencyEvents(prev => [...prev, {
          id: Date.now(),
          time: new Date().toISOString(),
          type: 'heart_rate_critical',
          value: hr,
          resolved: false,
        }])
        // Emergency SMS is handled by SakshiAssistant via emergencyActive state
      }
    }

    if (healthData.battery < 10) {
      setAlerts(prev => [...prev, {
        id: Date.now(),
        time: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
        parameter: 'Battery',
        value: `${healthData.battery}%`,
        priority: 'Critical',
        action: 'Please charge the smartwatch.',
        patientName: 'Patient',
      }])
    }
  }, [healthData.heartRate, healthData.battery, healthData.connected])

  // ── Inactivity detection ──
  useEffect(() => {
    if (!healthData.connected) return

    const interval = setInterval(() => {
      inactiveTimeRef.current += 1
      if (inactiveTimeRef.current > 60) {
        setInsights(prev => [...prev, {
          id: Date.now(),
          text: "You've been inactive for a while. Time for a short walk!",
          type: 'warning',
        }])
        inactiveTimeRef.current = 0
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [healthData.connected])

  // ── Connect simulated watch ──
  const connectSimulated = useCallback(() => {
    setConnecting(true)
    setBleError(null)
    autoReconnectRef.current = false
    setTimeout(() => {
      setHealthData(prev => ({
        ...prev,
        connected: true,
        isRealData: false,
        lastSync: new Date().toISOString(),
      }))
      setConnecting(false)
    }, 2000)
  }, [])

  // ── Connect REAL BLE device ──
  const connectBLE = useCallback(async () => {
    if (!navigator.bluetooth) {
      const msg = 'Web Bluetooth is not supported in this browser. Use Chrome, Edge, or Opera on desktop.'
      setBleError(msg)
      return { error: msg }
    }

    setConnecting(true)
    setBleError(null)
    autoReconnectRef.current = true

    try {
      // Request device — broad filter to find any BLE heart rate monitor
      const device = await navigator.bluetooth.requestDevice({
        filters: [
          { services: [HEART_RATE_SERVICE] },
          { namePrefix: 'Brahmi' },
          { namePrefix: 'MI Band' },
          { namePrefix: 'Amazfit' },
          { namePrefix: 'Fitbit' },
          { namePrefix: 'Galaxy' },
          { namePrefix: 'Honor' },
          { namePrefix: 'Huawei' },
          { namePrefix: 'GOQii' },
          { namePrefix: 'Noise' },
          { namePrefix: 'Fire-Boltt' },
          { namePrefix: 'boAt' },
          { namePrefix: 'Samsung' },
          { namePrefix: 'Apple' },
          { namePrefix: 'Polar' },
          { namePrefix: 'Garmin' },
          { namePrefix: 'Wahoo' },
        ],
        optionalServices: [HEART_RATE_SERVICE, BATTERY_SERVICE, 'device_information'],
      })

      // Listen for disconnect
      device.addEventListener('gattserverdisconnected', () => {
        console.log('[BLE] Device disconnected:', device.name)
        setHealthData(prev => ({
          ...prev,
          connected: false,
          isRealData: false,
          signalStrength: 0,
        }))
        bleCharacteristicRef.current = null
        batteryCharacteristicRef.current = null
        bleServerRef.current = null
        bleReadingCountRef.current = 0

        // Auto-reconnect
        if (autoReconnectRef.current) {
          setTimeout(() => {
            reconnectBLE(device)
          }, 2000)
        }
      })

      // Connect to GATT server
      const server = await device.gatt.connect()
      bleServerRef.current = server

      setHealthData(prev => ({
        ...prev,
        connected: true,
        watchName: device.name || 'Smartwatch',
        lastSync: new Date().toISOString(),
        signalStrength: 95,
      }))

      // ── Subscribe to Heart Rate Measurement ──
      try {
        const hrService = await server.getPrimaryService(HEART_RATE_SERVICE)
        const hrCharacteristic = await hrService.getCharacteristic(HEART_RATE_MEASUREMENT)

        // Enable notifications
        await hrCharacteristic.startNotifications()

        hrCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
          const data = parseHeartRate(event.target.value)
          bleReadingCountRef.current++

          setHealthData(prev => ({
            ...prev,
            heartRate: data.heartRate,
            isRealData: true,
            lastSync: new Date().toISOString(),
          }))
        })

        bleCharacteristicRef.current = hrCharacteristic
        console.log('[BLE] Heart Rate notifications started')
      } catch (hrErr) {
        console.warn('[BLE] Could not subscribe to heart rate:', hrErr)
        // Fall back to simulated data
        setHealthData(prev => ({
          ...prev,
          isRealData: false,
        }))
      }

      // ── Try to read Battery Level ──
      try {
        const battService = await server.getPrimaryService(BATTERY_SERVICE)
        const battChar = await battService.getCharacteristic(BATTERY_LEVEL)
        const battValue = await battChar.readValue()
        const batteryLevel = battValue.getUint8(0)

        setHealthData(prev => ({
          ...prev,
          battery: batteryLevel,
        }))

        // Subscribe to battery notifications
        try {
          await battChar.startNotifications()
          battChar.addEventListener('characteristicvaluechanged', (event) => {
            const level = event.target.value.getUint8(0)
            setHealthData(prev => ({ ...prev, battery: level }))
          })
        } catch (_) { /* battery notifications not critical */ }

        batteryCharacteristicRef.current = battChar
        console.log('[BLE] Battery level:', batteryLevel + '%')
      } catch (battErr) {
        console.warn('[BLE] Battery service not available:', battErr)
      }

      setConnecting(false)
      return { success: true, name: device.name }

    } catch (err) {
      setConnecting(false)
      if (err.name === 'NotFoundError') {
        setBleError('No device selected. Make sure your smartwatch is paired and nearby.')
        return { error: 'No device selected.' }
      }
      setBleError(err.message || 'Connection failed.')
      return { error: err.message || 'Connection failed.' }
    }
  }, [])

  // ── Auto-reconnect ──
  const reconnectBLE = useCallback(async (device) => {
    if (!autoReconnectRef.current) return
    try {
      console.log('[BLE] Attempting auto-reconnect...')
      const server = await device.gatt.connect()
      bleServerRef.current = server

      setHealthData(prev => ({
        ...prev,
        connected: true,
        isRealData: true,
        lastSync: new Date().toISOString(),
        signalStrength: 80,
      }))

      // Re-subscribe to heart rate
      const hrService = await server.getPrimaryService(HEART_RATE_SERVICE)
      const hrCharacteristic = await hrService.getCharacteristic(HEART_RATE_MEASUREMENT)
      await hrCharacteristic.startNotifications()

      hrCharacteristic.addEventListener('characteristicvaluechanged', (event) => {
        const data = parseHeartRate(event.target.value)
        setHealthData(prev => ({
          ...prev,
          heartRate: data.heartRate,
          isRealData: true,
          lastSync: new Date().toISOString(),
        }))
      })

      bleCharacteristicRef.current = hrCharacteristic
      console.log('[BLE] Reconnected successfully')
    } catch (err) {
      console.warn('[BLE] Reconnect failed:', err)
      // Try again after a delay
      if (autoReconnectRef.current) {
        setTimeout(() => reconnectBLE(device), 3000)
      }
    }
  }, [])

  const disconnect = useCallback(() => {
    autoReconnectRef.current = false
    if (bleDevice) {
      try { bleDevice.gatt?.disconnect() } catch (_) {}
      setBleDevice(null)
    }
    bleCharacteristicRef.current = null
    batteryCharacteristicRef.current = null
    bleServerRef.current = null
    bleReadingCountRef.current = 0
    setHealthData(prev => ({
      ...prev,
      connected: false,
      isRealData: false,
      signalStrength: 0,
    }))
  }, [bleDevice])

  const resolveEmergency = useCallback(() => {
    setEmergencyActive(false)
  }, [])

  const clearAlert = useCallback((alertId) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId))
  }, [])

  const value = {
    healthData,
    setHealthData,
    connected: healthData.connected,
    timeline,
    setTimeline,
    insights,
    setInsights,
    alerts,
    setAlerts,
    emergencyActive,
    setEmergencyActive,
    emergencyEvents,
    setEmergencyEvents,
    panelOpen,
    setPanelOpen,
    bleDevice,
    connecting,
    bleError,
    weeklyData,
    connectSimulated,
    connectBLE,
    disconnect,
    resolveEmergency,
    clearAlert,
    getHeartRateStatus,
  }

  return (
    <SmartwatchContext.Provider value={value}>
      {children}
    </SmartwatchContext.Provider>
  )
}
