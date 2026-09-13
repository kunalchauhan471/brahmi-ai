import { motion } from 'framer-motion'

export default function Card({
  children,
  className = '',
  hover = false,
  glass = false,
  onClick,
  padding = true,
}) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={hover ? { y: -2, scale: 1.01 } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      className={`
        rounded-2xl
        ${glass ? 'glass shadow-glass' : 'bg-white shadow-card border border-gray-100'}
        ${padding ? 'p-6' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${hover ? 'transition-shadow duration-300 hover:shadow-card-hover' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  )
}
