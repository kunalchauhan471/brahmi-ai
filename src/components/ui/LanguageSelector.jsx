import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useLanguage, LANGUAGES } from '../../i18n/LanguageContext'

export default function LanguageSelector({ compact = false }) {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-xl border border-gray-200 bg-white hover:border-primary-300 transition-colors ${
          compact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2'
        }`}
      >
        <Globe size={compact ? 14 : 16} className="text-gray-500" />
        <span className="font-medium text-gray-700">{currentLang.native}</span>
        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 z-50 w-56 max-h-72 overflow-y-auto rounded-xl bg-white border border-gray-100 shadow-xl"
            >
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code)
                    setIsOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                    language === lang.code ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{lang.name}</div>
                    <div className="text-xs text-gray-400">{lang.native}</div>
                  </div>
                  {language === lang.code && (
                    <Check size={14} className="text-primary-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
