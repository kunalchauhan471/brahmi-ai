import { motion, AnimatePresence } from 'framer-motion'
import { Watch, Wifi, WifiOff, Battery, BatteryLow, BatteryWarning } from 'lucide-react'
import { useSmartwatch } from '../../context/SmartwatchContext'

export default function SmartwatchIcon() {
  const { healthData, setPanelOpen, connecting } = useSmartwatch()
  const { connected, battery, signalStrength } = healthData

  const getBatteryIcon = () => {
    if (battery > 50) return Battery
    if (battery > 20) return BatteryLow
    return BatteryWarning
  }

  const BatteryIcon = getBatteryIcon()

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setPanelOpen(true)}
      className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
      title={connected ? 'Smartwatch Connected' : 'Connect Smartwatch'}
    >
      <Watch size={20} className={connected ? 'text-primary-500' : 'text-gray-400'} />

      {/* Connection indicator dot */}
      <AnimatePresence>
        {connected ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-1 right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white"
          >
            <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-40" />
          </motion.span>
        ) : (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-1 right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white"
          />
        )}
      </AnimatePresence>

      {/* Connecting spinner */}
      {connecting && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-xl border-2 border-primary-300 border-t-transparent animate-spin"
        />
      )}
    </motion.button>
  )
}
