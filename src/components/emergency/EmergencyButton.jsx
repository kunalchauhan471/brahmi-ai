import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, Phone, MessageSquare } from 'lucide-react'
import { useEmergency } from '../../context/EmergencyContext'
import { useData } from '../../context/DataContext'
import { useSmartwatch } from '../../context/SmartwatchContext'

export default function EmergencyButton() {
  const { patientData, emergencyContact, hasEmergencyContact } = useData()
  const { healthData, connected: watchConnected } = useSmartwatch()
  const { triggerEmergency, isProcessing, activeEmergency } = useEmergency()
  const [showConfirm, setShowConfirm] = useState(false)
  const [result, setResult] = useState(null)

  const handlePress = () => {
    if (isProcessing || activeEmergency || result) return
    // If no emergency contact is set, show a setup message instead
    if (!hasEmergencyContact) {
      alert('No emergency contact found! Please go to Setup and add an emergency contact number first.')
      return
    }
    setShowConfirm(true)
  }

  const handleConfirm = async () => {
    setShowConfirm(false)

    const smartwatchData = watchConnected ? healthData : null
    const emergency = await triggerEmergency(patientData, smartwatchData, emergencyContact)

    if (emergency) {
      setResult(emergency)

      // After EmergencyContext finishes, also try to notify caregiver directly
      // through the phone's native channels (WhatsApp + SMS + call)
      if (emergencyContact?.phone) {
        let phone = emergencyContact.phone.replace(/[^\d]/g, '')
        if (phone.length === 10) phone = '91' + phone

        const smsMessage = `🚨 EMERGENCY from ${patientData.name || 'Patient'}! Help needed immediately. Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: true })}. Location: ${emergency.location?.available ? `https://www.google.com/maps?q=${emergency.location.latitude},${emergency.location.longitude}` : 'Unavailable'}. Please come immediately!`

        // 1. Open WhatsApp (if message was prepared by EmergencyContext)
        if (emergency.whatsappMessage) {
          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(emergency.whatsappMessage)}`, '_blank')
        }

        // 2. Open SMS app (goes through cellular — no internet needed)
        setTimeout(() => {
          window.location.href = `sms:${emergencyContact.phone}?body=${encodeURIComponent(smsMessage)}`
        }, 1500)

        // 3. Open phone dialer (call as backup)
        setTimeout(() => {
          window.location.href = `tel:${emergencyContact.phone}`
        }, 3000)
      }
    }
  }

  const handleCancel = () => {
    setShowConfirm(false)
  }

  // Show result after emergency is sent
  if (result && !showConfirm) {
    return <EmergencyResult result={result} onDismiss={() => setResult(null)} />
  }

  return (
    <>
      {/* Emergency Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePress}
        disabled={isProcessing}
        className="w-full p-6 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/25 flex items-center justify-center gap-4 disabled:opacity-70"
      >
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
          {isProcessing ? (
            <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <AlertTriangle size={28} />
          )}
        </div>
        <div className="text-left">
          <div className="text-xl font-bold">
            {isProcessing ? 'Sending Emergency Alert...' : '🚨 EMERGENCY'}
          </div>
          <div className="text-red-100 text-sm">
            {isProcessing
              ? 'Capturing location and sending alert...'
              : 'Tap to alert your caregiver immediately'}
          </div>
        </div>
      </motion.button>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
            onClick={handleCancel}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            >
              <div className="text-center mb-5">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle size={32} className="text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Send Emergency Alert?</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {hasEmergencyContact
                    ? `This will alert ${emergencyContact.name || 'your caregiver'} via WhatsApp, SMS, and phone call.`
                    : 'No emergency contact found. Please go to Setup first.'
                  }
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-5 text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-500">📍 Location</span>
                  <span className="text-gray-700">Will be captured</span>
                </div>
                {watchConnected && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">❤️ Heart Rate</span>
                    <span className="text-gray-700">{healthData.heartRate} BPM</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">📞 Contact</span>
                  <span className="text-gray-700">{emergencyContact?.name || 'Not set'}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
                >
                  🚨 Send Alert
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function EmergencyResult({ result, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Status Card */}
      <div className={`rounded-2xl p-5 border ${
        result.status === 'pending'
          ? 'bg-amber-50 border-amber-200 text-amber-800'
          : 'bg-green-50 border-green-200 text-green-800'
      }`}>
        <div className="flex items-start gap-3">
          {result.status === 'pending' ? (
            <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mt-0.5 flex-shrink-0" />
          ) : (
            <CheckCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <div className="font-semibold text-base">
              {result.status === 'pending'
                ? '⚠️ Emergency Saved — Retrying...'
                : '✅ Emergency Alert Sent'}
            </div>
            <div className="text-sm opacity-80 mt-1">
              {result.status === 'pending'
                ? 'No communication channel available. Will retry when online.'
                : 'WhatsApp + SMS + phone call — all 3 channels activated'}
            </div>
          </div>
        </div>
      </div>

      {/* Communication Status */}
      {result.communication && (
        <div className="rounded-xl bg-white border border-gray-100 p-4">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-2">📡 Communication</div>
          <div className="space-y-2">
            <ChannelRow label="Internet" available={result.communication.channels.internet.available} />
            <ChannelRow label="Cellular*" available={result.communication.channels.cellular.available} note="Requires native integration" />
            <ChannelRow label="Bluetooth" available={result.communication.channels.bluetooth.available} />
            <div className="pt-2 border-t border-gray-100 mt-2">
              <div className="text-sm font-medium text-gray-700">
                Preferred Route: {result.communication.preferredRoute === 'internet' ? '🌐 WhatsApp' : result.communication.preferredRoute === 'sms' ? '📱 SMS' : result.communication.preferredRoute === 'bluetooth' ? '📶 Bluetooth' : '💾 Offline'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      {result.timeline && result.timeline.length > 0 && (
        <div className="rounded-xl bg-white border border-gray-100 p-4">
          <div className="text-xs font-semibold text-gray-400 uppercase mb-3">⏱ Timeline</div>
          <div className="space-y-2">
            {result.timeline.map((event, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-gray-400 text-xs font-mono whitespace-nowrap">{event.time}</span>
                <span className="text-gray-700">{event.event}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dismiss */}
      <button
        onClick={onDismiss}
        className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 text-sm font-medium hover:bg-gray-50 transition-colors"
      >
        Dismiss
      </button>
    </motion.div>
  )
}

function ChannelRow({ label, available, note }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full ${available ? 'bg-green-500' : 'bg-red-400'}`} />
        <span className={available ? 'text-green-700' : 'text-red-600'}>
          {available ? 'Available' : 'Unavailable'}
        </span>
        {note && <span className="text-[10px] text-gray-400">*</span>}
      </div>
    </div>
  )
}
