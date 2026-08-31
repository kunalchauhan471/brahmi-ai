import { motion } from 'framer-motion'

export default function GradientBorder({ children, className = '', speed = 3 }) {
  return (
    <div className={`relative p-[2px] rounded-3xl overflow-hidden ${className}`}>
      {/* Rotating gradient border */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            'linear-gradient(0deg, #0ea5e9, #14b8a6, #6366f1, #0ea5e9)',
            'linear-gradient(120deg, #0ea5e9, #14b8a6, #6366f1, #0ea5e9)',
            'linear-gradient(240deg, #0ea5e9, #14b8a6, #6366f1, #0ea5e9)',
            'linear-gradient(360deg, #0ea5e9, #14b8a6, #6366f1, #0ea5e9)',
          ],
        }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
        style={{
          backgroundSize: '300% 300%',
        }}
      />

      {/* Inner content */}
      <div className="relative rounded-3xl overflow-hidden bg-white">
        {children}
      </div>
    </div>
  )
}
