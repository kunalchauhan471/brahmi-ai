import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X, Watch, Wifi, WifiOff, Battery, BatteryLow, BatteryWarning,
  Signal, Bluetooth, BluetoothOff, Heart, Footprints, Flame, Moon,
  Droplets, Activity, Clock, TrendingUp, TrendingDown, AlertTriangle,
  Zap, RefreshCw, Phone, ShieldCheck, Brain, Sparkles, CheckCircle2,
  Info, ChevronRight, BarChart3, ArrowUp, ArrowDown
} from 'lucide-react'
import { useSmartwatch } from '../../context/SmartwatchContext'
import { useData } from '../../context/DataContext'
import { getISTHour } from '../../utils/timezone'

function AnimatedHeart({ bpm, status }) {
  const duration = bpm > 0 ? 60 / bpm : 1
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        animate={{
          scale: [1, 1.15, 1, 1.15, 1],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative"
      >
        <div className={`w-32 h-32 rounded-full flex items-center justify-center bg-gradient-to-br ${
          status.urgent ? 'from-red-100 to-red-200' : 'from-primary-100 to-teal-100'
        } shadow-lg`}>
          <Heart
            size={48}
            className={`${
              status.urgent ? 'text-red-500' : 'text-primary-500'
            } fill-current`}
          />
        </div>
        {/* Pulse rings */}
        <motion.div
          animate={{ scale: [1, 1.8], opacity: [0.3, 0] }}
          transition={{ duration: duration, repeat: Infinity, ease: 'easeOut' }}
          className={`absolute inset-0 rounded-full ${
            status.urgent ? 'bg-red-200' : 'bg-primary-200'
          }`}
        />
        <motion.div
          animate={{ scale: [1, 2.2], opacity: [0.15, 0] }}
          transition={{ duration: duration, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
          className={`absolute inset-0 rounded-full ${
            status.urgent ? 'bg-red-100' : 'bg-primary-100'
          }`}
        />
      </motion.div>
    </div>
  )
}

function StatusBadge({ label, color, bg }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${bg} ${color}`}>
      {label}
    </span>
  )
}

function HealthMetricCard({ icon: Icon, label, value, unit, color, bgColor }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bgColor} flex items-center justify-center flex-shrink-0`}>
          <Icon size={18} className={`text-white`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-gray-400 font-medium">{label}</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-gray-900">{value}</span>
            {unit && <span className="text-xs text-gray-400">{unit}</span>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function TimelineItem({ entry, index }) {
  const getTypeStyle = (type) => {
    switch (type) {
      case 'health': return 'bg-primary-100 text-primary-500'
      case 'medication': return 'bg-red-100 text-red-500'
      case 'activity': return 'bg-emerald-100 text-emerald-500'
      case 'reminder': return 'bg-amber-100 text-amber-500'
      default: return 'bg-gray-100 text-gray-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3"
    >
      <div className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getTypeStyle(entry.type)}`}>
          <Clock size={12} />
        </div>
        {index < 100 && <div className="w-px h-6 bg-gray-200 mt-1" />}
      </div>
      <div className="flex-1 pb-4">
        <div className="text-xs text-gray-400 font-medium">{entry.time}</div>
        <div className="text-sm font-medium text-gray-700">{entry.event}</div>
      </div>
    </motion.div>
  )
}

function InsightCard({ insight }) {
  const getStyle = (type) => {
    switch (type) {
      case 'positive': return 'bg-emerald-50 border-emerald-100 text-emerald-700'
      case 'warning': return 'bg-amber-50 border-amber-100 text-amber-700'
      case 'info': return 'bg-blue-50 border-blue-100 text-blue-700'
      default: return 'bg-gray-50 border-gray-100 text-gray-700'
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'positive': return CheckCircle2
      case 'warning': return AlertTriangle
      case 'info': return Info
      default: return Sparkles
    }
  }

  const Icon = getIcon(insight.type)

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2.5 p-3 rounded-xl border ${getStyle(insight.type)}`}
    >
      <Icon size={16} className="mt-0.5 flex-shrink-0" />
      <span className="text-sm">{insight.text}</span>
    </motion.div>
  )
}

function MiniChart({ data, color = 'primary' }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  return (
    <div className="flex items-end gap-1 h-12">
      {data.map((val, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${((val - min) / range) * 100}%` }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className={`flex-1 rounded-t bg-gradient-to-t from-primary-400 to-teal-300 min-h-[2px]`}
        />
      ))}
    </div>
  )
}

export default function SmartwatchPanel() {
  const {
    healthData, setHealthData, timeline, insights, alerts,
    panelOpen, setPanelOpen, connecting, weeklyData, bleError,
    connectSimulated, connectBLE, disconnect, resolveEmergency,
    emergencyActive, getHeartRateStatus,
  } = useSmartwatch()
  const { patientData } = useData()

  const    {heartRate, steps, calories, sleepHours, activityMinutes, waterGlasses,
    lastSync, battery, signalStrength, connected, watchName, isRealData } = healthData

  const hrStatus = getHeartRateStatus(heartRate)

  const getBatteryIcon = () => {
    if (battery > 50) return Battery
    if (battery > 20) return BatteryLow
    return BatteryWarning
  }
  const BatteryIcon = getBatteryIcon()

  const formatSyncTime = (iso) => {
    if (!iso) return 'Never'
    const d = new Date(iso)
    return d.toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    })
  }

  const avgHeartRate = weeklyData.length > 0
    ? Math.round(weeklyData.reduce((acc, d) => acc + d.heartRate.reduce((a, b) => a + b, 0) / d.heartRate.length, 0) / weeklyData.length)
    : 0

  const maxHeartRate = weeklyData.length > 0
    ? Math.max(...weeklyData.flatMap(d => d.heartRate))
    : 0

  const minHeartRate = weeklyData.length > 0
    ? Math.min(...weeklyData.flatMap(d => d.heartRate))
    : 0

  return (
    <AnimatePresence>
      {panelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPanelOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-white/95 backdrop-blur-xl shadow-2xl border-l border-gray-200 overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-lg border-b border-gray-100 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    connected
                      ? 'bg-gradient-to-br from-primary-500 to-teal-500 shadow-md shadow-primary-500/20'
                      : 'bg-gray-100'
                  }`}>
                    <Watch size={20} className={connected ? 'text-white' : 'text-gray-400'} />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">{watchName}</h2>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400' : 'bg-gray-300'}`} />
                      <span className="text-xs text-gray-400">
                        {connecting ? 'Connecting...' : connected ? 'Connected' : 'Disconnected'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setPanelOpen(false)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="px-6 py-6 space-y-6">
              {/* Connection Section */}
              {!connected ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <BluetoothOff size={32} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Watch</h3>
                  <p className="text-sm text-gray-400 mb-4 max-w-xs mx-auto">
                    Connect your smartwatch to start monitoring your health in real-time
                  </p>
                  {bleError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs text-left">
                      {bleError}
                    </div>
                  )}
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={connectBLE}
                      disabled={connecting}
                      className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold shadow-lg shadow-primary-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {connecting ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          Searching for devices...
                        </>
                      ) : (
                        <>
                          <Bluetooth size={16} />
                          Connect Bluetooth Watch
                        </>
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={connectSimulated}
                      disabled={connecting}
                      className="w-full py-3 px-4 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Zap size={16} />
                      Try Demo Mode
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Watch Status Row */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <Bluetooth size={14} className="text-primary-500" />
                        <span className="text-gray-500">BLE</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Signal size={14} className="text-emerald-500" />
                        <span className="text-gray-500">{signalStrength}%</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <BatteryIcon size={14} className={battery < 20 ? 'text-red-500' : 'text-emerald-500'} />
                        <span className="text-gray-500">{battery}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock size={12} />
                      <span className="text-xs">{formatSyncTime(lastSync)}</span>
                    </div>
                  </div>

                  {/* Heart Rate Card */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400 font-medium">Current Heart Rate</span>
                          {isRealData && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600 text-[10px] font-bold">
                              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                              LIVE
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl font-bold text-gray-900">{heartRate}</span>
                          <span className="text-sm text-gray-400">BPM</span>
                        </div>
                      </div>
                      <AnimatedHeart bpm={heartRate} status={hrStatus} />
                    </div>
                    <StatusBadge label={hrStatus.label} color={hrStatus.color} bg={hrStatus.bg} />

                    {/* Mini weekly chart */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="text-xs text-gray-400 mb-2">Weekly Heart Rate</div>
                      <MiniChart data={weeklyData.flatMap(d => d.heartRate)} />
                    </div>
                  </motion.div>

                  {/* Today's Health Summary */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Activity size={14} className="text-primary-500" />
                      Today's Health Summary
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <HealthMetricCard
                        icon={Heart}
                        label="Heart Rate"
                        value={heartRate}
                        unit="BPM"
                        color="text-red-500"
                        bgColor="from-red-400 to-rose-500"
                      />
                      <HealthMetricCard
                        icon={Footprints}
                        label="Steps"
                        value={steps.toLocaleString()}
                        unit="steps"
                        color="text-blue-500"
                        bgColor="from-blue-400 to-indigo-500"
                      />
                      <HealthMetricCard
                        icon={Flame}
                        label="Calories"
                        value={calories}
                        unit="kcal"
                        color="text-orange-500"
                        bgColor="from-orange-400 to-amber-500"
                      />
                      <HealthMetricCard
                        icon={Moon}
                        label="Sleep"
                        value={sleepHours}
                        unit="hrs"
                        color="text-purple-500"
                        bgColor="from-purple-400 to-violet-500"
                      />
                      <HealthMetricCard
                        icon={Activity}
                        label="Activity"
                        value={activityMinutes}
                        unit="min"
                        color="text-emerald-500"
                        bgColor="from-emerald-400 to-teal-500"
                      />
                      <HealthMetricCard
                        icon={Droplets}
                        label="Water"
                        value={waterGlasses}
                        unit="glasses"
                        color="text-cyan-500"
                        bgColor="from-cyan-400 to-blue-500"
                      />
                    </div>
                  </div>

                  {/* Health Timeline */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Clock size={14} className="text-primary-500" />
                      Health Timeline
                    </h3>
                    <div className="max-h-64 overflow-y-auto pr-1">
                      {timeline.slice().reverse().map((entry, i) => (
                        <TimelineItem key={entry.id} entry={entry} index={i} />
                      ))}
                    </div>
                  </div>

                  {/* AI Health Insights */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Brain size={14} className="text-primary-500" />
                      AI Health Insights
                    </h3>
                    <div className="space-y-2">
                      {insights.slice(-4).reverse().map((insight) => (
                        <InsightCard key={insight.id} insight={insight} />
                      ))}
                    </div>
                  </div>

                  {/* Daily Activity Chart */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <BarChart3 size={14} className="text-primary-500" />
                      Weekly Overview
                    </h3>
                    <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                      <div className="flex items-end gap-2 h-24">
                        {weeklyData.map((day, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[10px] text-gray-400">{day.steps / 1000}k</span>
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${(day.steps / 6000) * 100}%` }}
                              transition={{ delay: i * 0.05, duration: 0.4 }}
                              className="w-full rounded-t-lg bg-gradient-to-t from-primary-500 to-teal-400 min-h-[4px]"
                            />
                            <span className="text-[10px] text-gray-400">{day.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recent Alerts */}
                  {alerts.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-amber-500" />
                        Recent Alerts
                      </h3>
                      <div className="space-y-2">
                        {alerts.slice(-3).reverse().map((alert) => (
                          <motion.div
                            key={alert.id}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-3 rounded-xl border ${
                              alert.priority === 'Critical'
                                ? 'bg-red-50 border-red-200'
                                : 'bg-amber-50 border-amber-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs font-bold ${
                                alert.priority === 'Critical' ? 'text-red-600' : 'text-amber-600'
                              }`}>
                                {alert.priority}
                              </span>
                              <span className="text-[10px] text-gray-400">{alert.time}</span>
                            </div>
                            <div className="text-sm font-medium text-gray-700">{alert.parameter}: {alert.value}</div>
                            <div className="text-xs text-gray-500 mt-1">{alert.action}</div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Disconnect Button */}
                  <div className="pt-2 pb-4">
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={disconnect}
                      className="w-full py-3 rounded-xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <WifiOff size={16} />
                      Disconnect Watch
                    </motion.button>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Emergency Overlay */}
          <AnimatePresence>
            {emergencyActive && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-red-600/95 backdrop-blur-sm flex items-center justify-center p-6"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="text-center text-white max-w-sm"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6"
                  >
                    <AlertTriangle size={48} className="text-white" />
                  </motion.div>
                  <h2 className="text-3xl font-bold mb-3">Emergency Detected</h2>
                  <p className="text-red-100 text-lg mb-2">
                    Abnormal heart rate detected: <strong>{heartRate} BPM</strong>
                  </p>
                  <p className="text-red-200 text-sm mb-8">
                    Your caregiver has been notified. Please stay calm and sit down.
                  </p>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 px-6 rounded-xl bg-white text-red-600 font-bold text-lg shadow-xl flex items-center justify-center gap-2"
                    >
                      <Phone size={20} />
                      Call Emergency Contact
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resolveEmergency}
                      className="w-full py-4 px-6 rounded-xl bg-white/20 text-white font-semibold text-lg border border-white/30 flex items-center justify-center gap-2"
                    >
                      I'm Okay — Dismiss
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}
