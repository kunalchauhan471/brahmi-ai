import { motion } from 'framer-motion'

const variants = {
  primary: 'bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 text-black font-semibold hover:shadow-gold-lg',
  secondary: 'glass text-luxury-light hover:text-white hover:border-gold-500/20',
  ghost: 'text-luxury-text hover:text-white hover:bg-white/5',
  outline: 'border border-luxury-border text-luxury-light hover:border-gold-500/30 hover:text-white',
  danger: 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20',
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
        btn-premium
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
