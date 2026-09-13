export default function Select({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  className = '',
  required = false,
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className="
          w-full rounded-xl border border-gray-200 bg-white
          px-4 py-3 text-base text-gray-900
          focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
          transition-all duration-200 appearance-none
          bg-no-repeat bg-[right_1rem_center] bg-[length:1.25rem]
        "
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
