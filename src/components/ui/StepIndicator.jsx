import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function StepIndicator({ steps, currentStep }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex items-center gap-2">
            <motion.div
              initial={false}
              animate={{
                backgroundColor: index <= currentStep ? '#3b82f6' : '#e2e8f0',
                scale: index === currentStep ? 1.1 : 1,
              }}
              className={`
                w-10 h-10 rounded-full flex items-center justify-center
                text-sm font-semibold transition-all duration-300
                ${index <= currentStep ? 'text-white shadow-lg shadow-primary-500/25' : 'text-gray-400'}
              `}
            >
              {index < currentStep ? (
                <Check size={18} strokeWidth={3} />
              ) : (
                index + 1
              )}
            </motion.div>
            <span className={`
              text-sm font-medium hidden sm:block
              ${index <= currentStep ? 'text-primary-600' : 'text-gray-400'}
            `}>
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`
              w-8 sm:w-12 h-0.5 mx-2
              ${index < currentStep ? 'bg-primary-500' : 'bg-gray-200'}
              transition-colors duration-300
            `} />
          )}
        </div>
      ))}
    </div>
  )
}
