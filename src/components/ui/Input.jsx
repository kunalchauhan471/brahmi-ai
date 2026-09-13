import { forwardRef } from 'react'

const Input = forwardRef(({ label, icon: Icon, error, className = '', ...props }, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          className={`
            w-full bg-white border border-gray-200 rounded-xl
            px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400
            focus:outline-none focus:border-primary-400 focus:ring-1 focus:ring-primary-500/20
            transition-all duration-300
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-red-400' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
