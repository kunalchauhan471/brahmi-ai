import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30',
  secondary: 'bg-white text-gray-700 border border-gray-200 font-semibold hover:bg-gray-50',
  ghost: 'text-gray-500 hover:text-gray-900 hover:bg-gray-50',
  outline: 'border border-gray-300 text-gray-700 hover:border-primary-400 hover:text-primary-600',
  danger: 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100',
  success: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
  xl: 'px-10 py-5 text-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  icon: Icon,
  iconRight: IconRight,
  loading = false,
  disabled = false,
  ...props
}) {
  return (
    <motion.button
      className={`
        relative inline-flex items-center justify-center gap-2
        rounded-xl font-medium
        transition-all duration-300 ease-out
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className="w-4 h-4" />}
    </motion.button>
  )
}
