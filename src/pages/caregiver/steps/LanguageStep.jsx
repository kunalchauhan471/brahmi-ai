import { useState } from 'react'
import { motion } from 'framer-motion'
import { Globe, Check, Mic, Gauge } from 'lucide-react'
import { useData } from '../../../context/DataContext'
import { useLanguage, LANGUAGES } from '../../../i18n/LanguageContext'
import Card from '../../../components/ui/Card'

const voiceOptions = [
  { id: 'female', label: 'Sakshi', desc: 'Female voice', emoji: '👩', color: 'from-pink-400 to-rose-500' },
  { id: 'male', label: 'Krishna', desc: 'Male voice', emoji: '👨', color: 'from-blue-400 to-indigo-500' },
]

const speedOptions = [
  { id: 'normal', label: 'Normal', desc: 'Standard speaking pace' },
  { id: 'slow', label: 'Slow', desc: 'Easier to understand' },
]

export default function LanguageStep() {
  const { patientData, setPatientData } = useData()
  const { setLanguage } = useLanguage()

  const handleSelectLanguage = (langCode) => {
    setPatientData(prev => ({ ...prev, language: langCode }))
    setLanguage(langCode)
  }

  const handleSelectVoice = (voiceId) => {
    setPatientData(prev => ({ ...prev, voice: voiceId }))
  }

  const handleSelectSpeed = (speedId) => {
    setPatientData(prev => ({ ...prev, speechSpeed: speedId }))
  }

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Globe size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Preferred Language</h2>
            <p className="text-gray-500 text-sm">Choose the language the patient is most comfortable with.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {LANGUAGES.map((lang) => (
            <motion.button
              key={lang.code}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleSelectLanguage(lang.code)}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                patientData.language === lang.code
                  ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-500/10'
                  : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                patientData.language === lang.code
                  ? 'bg-gradient-to-br from-primary-500 to-teal-500'
                  : 'bg-gray-100'
              }`}>
                {patientData.language === lang.code ? (
                  <Check size={18} className="text-white" />
                ) : (
                  <Globe size={18} className="text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{lang.name}</div>
                <div className="text-xs text-gray-400">{lang.native}</div>
              </div>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Voice Selection */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
            <Mic size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Choose Sakshi's Voice</h2>
            <p className="text-gray-500 text-sm">Select who the patient will hear when Sakshi speaks.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {voiceOptions.map((voice) => (
            <motion.button
              key={voice.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectVoice(voice.id)}
              className={`relative p-5 rounded-2xl border-2 text-center transition-all ${
                (patientData.voice || 'female') === voice.id
                  ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10'
                  : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {(patientData.voice || 'female') === voice.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${voice.color} flex items-center justify-center mx-auto mb-3 text-3xl shadow-md`}>
                {voice.emoji}
              </div>
              <div className="font-bold text-gray-900 text-lg">{voice.label}</div>
              <div className="text-sm text-gray-400 mt-1">{voice.desc}</div>
            </motion.button>
          ))}
        </div>
      </Card>

      {/* Speed Selection */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Gauge size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Speaking Speed</h2>
            <p className="text-gray-500 text-sm">Choose how fast Sakshi speaks.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {speedOptions.map((speed) => (
            <motion.button
              key={speed.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectSpeed(speed.id)}
              className={`relative p-5 rounded-2xl border-2 text-center transition-all ${
                (patientData.speechSpeed || 'normal') === speed.id
                  ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10'
                  : 'border-gray-100 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {(patientData.speechSpeed || 'normal') === speed.id && (
                <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
              <div className="text-3xl mb-3">{speed.id === 'normal' ? '⚡' : '🐢'}</div>
              <div className="font-bold text-gray-900 text-lg">{speed.label}</div>
              <div className="text-sm text-gray-400 mt-1">{speed.desc}</div>
            </motion.button>
          ))}
        </div>
      </Card>

      <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
        <div className="flex items-start gap-3">
          <Globe size={20} className="text-indigo-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-indigo-700">
            These settings will be used for the patient's entire experience including 
            Sakshi AI voice assistant, game instructions, and all interface text.
          </p>
        </div>
      </div>
    </div>
  )
}
