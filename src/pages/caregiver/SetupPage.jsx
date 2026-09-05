import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '../../i18n/LanguageContext'
import { useData } from '../../context/DataContext'
import { useAccount } from '../../context/AccountContext'
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
  const [showAccountBanner, setShowAccountBanner] = useState(true)
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { setPatientMode } = useData()
  const { user } = useAccount()

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

      {/* Account upsell banner — only when no account is signed in on this device */}
      {!user && showAccountBanner && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-teal-50 border border-primary-100">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800">
                Create a free account to keep this setup on any phone
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                Right now this data is saved only on this device. With an account, the caregiver can open the same
                schedule, memories and patient profile after signing in from another phone.
              </p>
              <div className="flex items-center gap-3 mt-2.5">
                <button
                  onClick={() => navigate('/login?next=/setup')}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-primary-500 to-teal-500 text-white text-xs font-semibold shadow-md shadow-primary-500/20 hover:shadow-lg transition-shadow"
                >
                  Create free account
                </button>
                <button
                  onClick={() => setShowAccountBanner(false)}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
