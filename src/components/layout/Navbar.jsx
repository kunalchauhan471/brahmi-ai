import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../i18n/LanguageContext'
import BrahmiLogo from '../ui/BrahmiLogo'

export default function Navbar({ showBack = false, transparent = false }) {
  const navigate = useNavigate()
  const { t } = useLanguage()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`
        fixed top-0 left-0 right-0 z-50
        ${transparent ? 'bg-transparent' : 'glass shadow-sm'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {showBack && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </motion.button>
            )}
            <div className="flex items-center gap-2">
              <BrahmiLogo size={36} />
              <span className="text-lg font-bold text-gray-900">
                {t('common.appName')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
