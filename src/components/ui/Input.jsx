import { forwardRef } from 'react'

const Input = forwardRef(({ label, icon: Icon, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-luxury-light">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-text">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-luxury-card border border-luxury-border rounded-xl
            px-4 py-3 text-sm text-white placeholder:text-luxury-text
            focus:outline-none focus:border-gold-500/30 focus:ring-1 focus:ring-gold-500/20
            transition-all duration-300
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-red-500/30' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
