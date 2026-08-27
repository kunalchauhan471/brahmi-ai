export default function Input({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Icon size={18} className="text-gray-400" />
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`
            w-full rounded-xl border border-gray-200 bg-white
            px-4 py-3 text-base text-gray-900
            placeholder:text-gray-400
            focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
            transition-all duration-200
            ${Icon ? 'pl-11' : ''}
          `}
          {...props}
        />
      </div>
    </div>
  )
}
