import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'
import StepIndicator from '../../components/ui/StepIndicator'
import BrahmiLogo from '../../components/ui/BrahmiLogo'
import CaregiverInfoStep from './steps/CaregiverInfoStep'
import PatientInfoStep from './steps/PatientInfoStep'
import EmergencyContactStep from './steps/EmergencyContactStep'
import DailyScheduleStep from './steps/DailyScheduleStep'
import MemoryVaultStep from './steps/MemoryVaultStep'
import ReviewStep from './steps/ReviewStep'
const STEPS = ['Caregiver', 'Patient', 'Emergency', 'Schedule', 'Memories', 'Review']

const stepComponents = [
  CaregiverInfoStep,
  PatientInfoStep,
  EmergencyContactStep,
  DailyScheduleStep,
  MemoryVaultStep,
  ReviewStep,
]

export default function SetupPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { setPatientMode } = useData()

  const StepComponent = stepComponents[currentStep]

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleActivate = () => {
    setPatientMode(true)
    navigate('/patient')
  }

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <div className="glass shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => currentStep === 0 ? navigate('/') : handlePrev()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="text-sm font-medium">
                {currentStep === 0 ? t('common.home') : t('common.back')}
              </span>
            </button>
            <div className="flex items-center gap-2">
              <BrahmiLogo size={32} />
              <span className="font-bold text-gray-900">
                {t('common.appName')}
              </span>
            </div>
          </div>
          <StepIndicator steps={STEPS} currentStep={currentStep} />
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
              transition-all duration-200
              ${currentStep === 0
                ? 'text-gray-300 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <ArrowLeft size={18} />
            {t('common.previous')}
          </button>

          {currentStep === STEPS.length - 1 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleActivate}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-shadow"
            >
              <Check size={18} />
              {t('setup.activate')}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl transition-shadow"
            >
              {t('common.next')}
              <ArrowRight size={18} />
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
