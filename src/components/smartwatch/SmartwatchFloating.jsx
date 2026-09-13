import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Watch, Heart, Footprints, Flame, Moon, Droplets, Activity,
  Bluetooth, BluetoothOff, Zap, ChevronUp, ChevronDown,
  Battery, BatteryLow, BatteryWarning, AlertTriangle,
  Phone, X
} from 'lucide-react'
import { useSmartwatch } from '../../context/SmartwatchContext'
import { getISTHour } from '../../utils/timezone'

function MiniHeartRate({ bpm, connected }) {
  const duration = bpm > 0 ? 60 / bpm : 1
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{ scale: [1, 1.2, 1, 1.2, 1] }}
        transition={{ duration: duration, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        <Heart
          size={connected ? 22 : 16}
          className={`transition-colors duration-300 ${
            connected ? 'text-red-400 fill-red-400' : 'text-gray-400'
          }`}
        />
      </motion.div>
      {connected && (
        <>
          <motion.div
            animate={{ scale: [1, 2], opacity: [0.3, 0] }}
            transition={{ duration: duration, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full bg-red-200"
          />
        </>
      )}
    </div>
  )
}

function HealthMiniCard({ icon: Icon, label, value, unit, color }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 border border-gray-100/80">
      <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
        <Icon size={13} className="text-white" />
      </div>
      <div className="min-w-0">
        <div className="text-[10px] text-gray-400 leading-none">{label}</div>
        <div className="text-sm font-bold text-gray-800 leading-tight">
          {value}<span className="text-[10px] text-gray-400 ml-0.5">{unit}</span>
        </div>
      </div>
    </div>
  )
}

export default function SmartwatchFloating() {
  const {
    healthData, setPanelOpen, connecting, emergencyActive,
    getHeartRateStatus, disconnect
  } = useSmartwatch()
  const { heartRate, connected, battery, steps, calories, isRealData } = healthData

  const [isExpanded, setIsExpanded] = useState(false)
  const [showPulse, setShowPulse] = useState(true)

  const hrStatus = connected ? getHeartRateStatus(heartRate) : null
  const hrDuration = heartRate > 0 ? 60 / heartRate : 1

  // Auto-collapse after 8 seconds
  useEffect(() => {
    if (!isExpanded) return
    const timer = setTimeout(() => setIsExpanded(false), 8000)
    return () => clearTimeout(timer)
  }, [isExpanded])

  // Battery icon
  const getBatteryIcon = () => {
    if (battery > 50) return Battery
    if (battery > 20) return BatteryLow
    return BatteryWarning
  }
  const BatteryIcon = getBatteryIcon()

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      {/* Expanded Health Mini-Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9, x: -10 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, x: -10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            className="w-72 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    connected
                      ? 'bg-gradient-to-br from-primary-500 to-teal-500'
                      : 'bg-gray-200'
                  }`}>
                    <Watch size={15} className={connected ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-800">Health Monitor</div>
                    <div className="flex items-center gap-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                      <span className="text-[10px] text-gray-400">
                        {connecting ? 'Connecting...' : connected ? 'Connected' : 'Disconnected'}
                      </span>
                      {isRealData && (
                        <span className="ml-1 inline-flex items-center gap-0.5 px-1.5 py-0 rounded-full bg-emerald-100 text-emerald-600 text-[9px] font-bold">
                          <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                          LIVE
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ChevronDown size={16} className="text-gray-400" />
                </button>
              </div>
            </div>

            {connected ? (
              <div className="p-3 space-y-3">
                {/* Heart Rate Hero */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 flex items-center justify-between"
                >
                  <div>
                    <div className="text-[10px] text-gray-400 mb-0.5">Heart Rate</div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold text-gray-900">{heartRate}</span>
                      <span className="text-xs text-gray-400">BPM</span>
                    </div>
                    <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${hrStatus?.bg} ${hrStatus?.color}`}>
                      {hrStatus?.label}
                    </span>
                  </div>
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1, 1.15, 1] }}
                      transition={{ duration: hrDuration, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-14 h-14 rounded-full bg-gradient-to-br from-red-100 to-rose-50 flex items-center justify-center"
                    >
                      <Heart size={24} className="text-red-400 fill-red-400" />
                    </motion.div>
                    <motion.div
                      animate={{ scale: [1, 1.6], opacity: [0.2, 0] }}
                      transition={{ duration: hrDuration, repeat: Infinity }}
                      className="absolute inset-0 rounded-full bg-red-100"
                    />
                  </div>
                </motion.div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  <HealthMiniCard
                    icon={Footprints}
                    label="Steps"
                    value={steps.toLocaleString()}
                    unit=""
                    color="from-blue-400 to-indigo-500"
                  />
                  <HealthMiniCard
                    icon={Flame}
                    label="Calories"
                    value={calories}
                    unit="kcal"
                    color="from-orange-400 to-amber-500"
                  />
                  <HealthMiniCard
                    icon={Moon}
                    label="Sleep"
                    value={healthData.sleepHours}
                    unit="hrs"
                    color="from-purple-400 to-violet-500"
                  />
                  <HealthMiniCard
                    icon={Activity}
                    label="Activity"
                    value={healthData.activityMinutes}
                    unit="min"
                    color="from-emerald-400 to-teal-500"
                  />
                </div>

                {/* Battery & Signal Row */}
                <div className="flex items-center justify-between px-1 text-[10px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <BatteryIcon size={12} className={battery < 20 ? 'text-red-400' : 'text-emerald-400'} />
                    <span>{battery}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bluetooth size={10} className="text-primary-400" />
                    <span>{healthData.signalStrength}%</span>
                  </div>
                </div>

                {/* View Full Panel */}
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => { setPanelOpen(true); setIsExpanded(false) }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-primary-50 to-teal-50 text-primary-600 text-xs font-semibold hover:from-primary-100 hover:to-teal-100 transition-colors"
                >
                  View Full Dashboard →
                </motion.button>
              </div>
            ) : (
              <div className="p-4 text-center">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                  <BluetoothOff size={20} className="text-gray-400" />
                </div>
                <p className="text-xs text-gray-400 mb-3">
                  Connect your smartwatch to see real-time health data
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => { setPanelOpen(true); setIsExpanded(false) }}
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 text-white text-xs font-semibold shadow-md"
                >
                  Connect Watch
                </motion.button>
              </div>
            )}

            {/* Emergency Banner */}
            {emergencyActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-4 py-2 bg-red-500 flex items-center gap-2"
              >
                <AlertTriangle size={14} className="text-white animate-pulse" />
                <span className="text-white text-xs font-bold">Emergency Active</span>
                <Phone size={12} className="text-white ml-auto" />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          if (!connected) {
            setPanelOpen(true)
          } else {
            setIsExpanded(!isExpanded)
          }
        }}
        className="relative group"
      >
        {/* Ray effects — always visible like Sakshi */}
        <>
          <motion.div
            animate={{ scale: [1, 1.4], opacity: [0.25, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full bg-primary-400"
          />
          <motion.div
            animate={{ scale: [1, 1.8], opacity: [0.12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            className="absolute inset-0 rounded-full bg-teal-400"
          />
          <motion.div
            animate={{ scale: [1, 2.2], opacity: [0.06, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: 1.0 }}
            className="absolute inset-0 rounded-full bg-primary-300"
          />
        </>

        {/* Emergency pulse ring */}
        {emergencyActive && (
          <>
            <motion.div
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full bg-red-500"
            />
            <motion.div
              animate={{ scale: [1, 2.5], opacity: [0.3, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'easeOut', delay: 0.2 }}
              className="absolute inset-0 rounded-full bg-red-400"
            />
          </>
        )}

        {/* Main button — always blue like Sakshi */}
        <div className={`
          relative w-16 h-16 rounded-full
          flex items-center justify-center
          shadow-xl transition-all duration-300
          ${emergencyActive
            ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-red-500/40'
            : 'bg-gradient-to-br from-primary-500 to-teal-500 shadow-primary-500/40'
          }
        `}>
          {connected ? (
            <div className="flex flex-col items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1, 1.2, 1] }}
                transition={{ duration: hrDuration, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Heart size={22} className="text-white fill-white" />
              </motion.div>
              <span className="text-[10px] font-bold text-white mt-0.5 leading-none">{heartRate}</span>
            </div>
          ) : (
            <Watch size={26} className="text-white" />
          )}

          {/* Connection dot */}
          <span className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
            connected ? 'bg-emerald-400' : 'bg-amber-400'
          }`}>
            {connected && (
              <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-40" />
            )}
          </span>
        </div>

        {/* Tooltip */}
        <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium whitespace-nowrap shadow-lg">
            {connected ? `Heart: ${heartRate} BPM` : 'Connect Smartwatch'}
          </div>
        </div>
      </motion.button>
    </div>
  )
}
