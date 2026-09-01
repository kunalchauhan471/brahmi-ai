import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, Phone, MessageSquare, MapPin, Bell, X } from 'lucide-react'
import { useEmergency } from '../../context/EmergencyContext'
import EmergencyLocationMap from './EmergencyLocationMap'
import EmergencyTimeline from './EmergencyTimeline'

export default function CaregiverEmergencyPanel() {
  const { activeEmergency, acknowledged, acknowledgeEmergency, clearEmergency } = useEmergency()
  const [alertPlayed, setAlertPlayed] = useState(false)
  const audioRef = useRef(null)

  // Play alert sound when new emergency arrives
  useEffect(() => {
    if (activeEmergency && activeEmergency.status === 'active' && !acknowledged && !alertPlayed) {
      // Try to play alert sound
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        // Play 3 short beeps
        for (let i = 0; i < 3; i++) {
          const osc = audioCtx.createOscillator()
          const gain = audioCtx.createGain()
          osc.connect(gain)
          gain.connect(audioCtx.destination)
          osc.frequency.value = 800
          osc.type = 'sine'
          gain.gain.value = 0.3
          const startTime = audioCtx.currentTime + i * 0.3
          osc.start(startTime)
          osc.stop(startTime + 0.15)
        }
        setAlertPlayed(true)
      } catch {
        setAlertPlayed(true)
      }
    }
  }, [activeEmergency, acknowledged, alertPlayed])

  if (!activeEmergency) return null

  const isPending = activeEmergency.status === 'pending'

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="space-y-4"
      >
        {/* Emergency Alert Banner */}
        {!acknowledged && (
          <motion.div
            animate={{ scale: [1, 1.01, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="rounded-2xl bg-gradient-to-r from-red-500 to-red-600 p-5 text-white shadow-xl shadow-red-500/25"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold">🔴 EMERGENCY ALERT</h3>
                <p className="text-red-100 text-sm">Immediate Assistance Required</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-red-200 text-xs">Patient</div>
                <div className="font-semibold">{activeEmergency.patientName}</div>
              </div>
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-red-200 text-xs">⏰ Time</div>
                <div className="font-semibold">{activeEmergency.timestamp}</div>
              </div>
              {activeEmergency.smartwatch?.connected && (
                <div className="bg-white/10 rounded-lg p-2">
                  <div className="text-red-200 text-xs">❤️ Heart Rate</div>
                  <div className="font-semibold">{activeEmergency.smartwatch.heartRate} BPM</div>
                </div>
              )}
              <div className="bg-white/10 rounded-lg p-2">
                <div className="text-red-200 text-xs">📍 Location</div>
                <div className="font-semibold">{activeEmergency.location?.available ? 'Available' : 'Unavailable'}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-4">
              {activeEmergency.emergencyContactPhone && (
                <a
                  href={`tel:${activeEmergency.emergencyContactPhone}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors"
                >
                  <Phone size={14} /> Call {activeEmergency.emergencyContactName || 'Contact'}
                </a>
              )}
              {activeEmergency.location?.available && (
                <a
                  href={`https://www.google.com/maps?q=${activeEmergency.location.latitude},${activeEmergency.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors"
                >
                  <MapPin size={14} /> Open Location
                </a>
              )}
              {activeEmergency.whatsappMessage && activeEmergency.emergencyContactPhone && (
                <button
                  onClick={() => {
                    let phone = activeEmergency.emergencyContactPhone.replace(/[^\d]/g, '')
                    if (phone.length === 10) phone = '91' + phone
                    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(activeEmergency.whatsappMessage)}`, '_blank')
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors"
                >
                  <MessageSquare size={14} /> WhatsApp
                </button>
              )}
            </div>
          </motion.div>
        )}

        {/* Acknowledged Status */}
        {acknowledged && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl bg-green-50 border border-green-200 p-4 flex items-center gap-3"
          >
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <div className="font-semibold text-green-800">✓ Emergency Acknowledged</div>
              <div className="text-sm text-green-600">Caregiver responding • {activeEmergency.timestamp}</div>
            </div>
            <button onClick={clearEmergency} className="ml-auto p-1 hover:bg-green-100 rounded-lg">
              <X size={16} className="text-green-600" />
            </button>
          </motion.div>
        )}

        {/* Communication Status */}
        {activeEmergency.communication && (
          <div className="rounded-xl bg-white border border-gray-100 p-4">
            <div className="text-xs font-semibold text-gray-400 uppercase mb-3">📡 Communication Status</div>
            <div className="space-y-2">
              <CommRow
                label="Internet"
                available={activeEmergency.communication.channels.internet.available}
              />
              <CommRow
                label="Cellular*"
                available={activeEmergency.communication.channels.cellular.available}
                note="Requires native integration"
              />
              <CommRow
                label="Bluetooth"
                available={activeEmergency.communication.channels.bluetooth.available}
              />
              <div className="pt-2 border-t border-gray-100 mt-2 flex items-center justify-between">
                <span className="text-sm text-gray-500">Preferred Route:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {activeEmergency.communication.preferredRoute === 'internet' ? '🌐 WhatsApp' :
                   activeEmergency.communication.preferredRoute === 'sms' ? '📱 SMS via Cellular' :
                   activeEmergency.communication.preferredRoute === 'bluetooth' ? '📶 Bluetooth' : '💾 Offline'}
                </span>
              </div>
            </div>

            {/* WhatsApp / SMS Status */}
            <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">📱 WhatsApp</span>
                <StatusBadge status={activeEmergency.whatsappStatus} />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">💬 SMS</span>
                <StatusBadge status={activeEmergency.smsStatus} />
              </div>
            </div>
          </div>
        )}

        {/* Location Map */}
        {activeEmergency.location && (
          <div>
            <div className="text-xs font-semibold text-gray-400 uppercase mb-2 px-1">📍 Patient Location</div>
            <EmergencyLocationMap
              location={activeEmergency.location}
              patientName={activeEmergency.patientName}
            />
          </div>
        )}

        {/* Timeline */}
        <EmergencyTimeline timeline={activeEmergency.timeline} />

        {/* Acknowledge Button */}
        {!acknowledged && activeEmergency.status !== 'pending' && (
          <button
            onClick={acknowledgeEmergency}
            className="w-full py-3 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle size={18} /> Acknowledge Emergency
          </button>
        )}

        {/* Pending retry notice */}
        {isPending && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
            <div className="font-semibold mb-1">⚠️ Emergency Pending</div>
            <div>No communication channel available. Will retry automatically when connection is restored.</div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

function CommRow({ label, available, note }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${available ? 'bg-green-500' : 'bg-red-400'}`} />
        <span className={available ? 'text-green-700' : 'text-red-600'}>
          {available ? 'Available' : 'Unavailable'}
        </span>
        {note && <span className="text-[10px] text-gray-400" title={note}>*</span>}
      </div>
    </div>
  )
}

function StatusBadge({ status }) {
  const config = {
    prepared: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Prepared' },
    sent: { bg: 'bg-green-100', text: 'text-green-700', label: 'Sent' },
    simulated: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Simulation' },
    pending: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Pending' },
    unavailable: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Unavailable' },
  }
  const c = config[status] || config.pending
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  )
}
