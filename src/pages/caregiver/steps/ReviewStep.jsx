import { motion } from 'framer-motion'
import {
  User, Mail, Phone, UserCircle, Calendar, Globe,
  Siren, Clock, Camera, CheckCircle2, ArrowRight,
  Pill, UtensilsCrossed, Activity, Bell, Moon
} from 'lucide-react'
import { useData } from '../../../context/DataContext'
import { useLanguage } from '../../../i18n/LanguageContext'
import Card from '../../../components/ui/Card'

const typeIcons = {
  medicine: Pill,
  meal: UtensilsCrossed,
  activity: Activity,
  reminder: Bell,
  routine: Moon,
  walk: Activity,
  drink: Bell,
}

export default function ReviewStep() {
  const {
    caregiverData,
    patientData,
    emergencyContact,
    schedule,
    memories,
  } = useData()
  const { t } = useLanguage()

  const sections = [
    {
      title: t('setup.review.caregiverDetails'),
      icon: User,
      color: 'from-primary-500 to-teal-500',
      items: [
        { icon: User, label: t('setup.review.name'), value: caregiverData.name || t('setup.review.notProvided') },
        { icon: Mail, label: t('setup.review.email'), value: caregiverData.email || t('setup.review.notProvided') },
        { icon: Phone, label: t('setup.review.phone'), value: caregiverData.phone || t('setup.review.notProvided') },
      ],
    },
    {
      title: t('setup.review.patientDetails'),
      icon: UserCircle,
      color: 'from-rose-500 to-pink-500',
      items: [
        { icon: UserCircle, label: t('setup.review.name'), value: patientData.name || t('setup.review.notProvided') },
        { icon: Calendar, label: t('setup.review.age'), value: patientData.age ? `${patientData.age} ${t('setup.review.years')}` : t('setup.review.notProvided') },
        { icon: User, label: t('setup.review.gender'), value: patientData.gender || t('setup.review.notProvided') },
        { icon: Globe, label: t('setup.review.language'), value: patientData.language || 'English' },
      ],
    },
    {
      title: t('setup.review.emergencyContact'),
      icon: Siren,
      color: 'from-red-500 to-orange-500',
      items: [
        { icon: User, label: t('setup.review.name'), value: emergencyContact.name || t('setup.review.notProvided') },
        { icon: User, label: t('setup.review.relationship') || 'Relationship', value: emergencyContact.relationship || t('setup.review.notProvided') },
        { icon: Phone, label: t('setup.review.phone'), value: emergencyContact.phone || t('setup.review.notProvided') },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('setup.review.title')}</h2>
        <p className="text-gray-500">{t('setup.review.desc')}</p>
      </div>

      {/* Info Sections */}
      {sections.map((section, sIndex) => (
        <motion.div
          key={sIndex}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sIndex * 0.1 }}
        >
          <Card>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center shadow-sm`}>
                <section.icon size={18} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {section.items.map((item, iIndex) => (
                <div key={iIndex} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <item.icon size={16} className="text-gray-400 flex-shrink-0" />
                  <div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="text-sm font-medium text-gray-900">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      ))}

      {/* Schedule Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
              <Clock size={18} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{t('setup.review.dailySchedule', { count: schedule.length })}</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {schedule.slice(0, 6).map((reminder) => {
              const TypeIcon = typeIcons[reminder.type] || Bell
              return (
                <div key={reminder.id} className="flex items-center gap-3 p-2 rounded-lg">
                  <TypeIcon size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-700">{reminder.title}</span>
                  <span className="text-xs text-gray-400 ml-auto">{reminder.time}</span>
                </div>
              )
            })}
            {schedule.length > 6 && (
              <div className="text-sm text-gray-400 p-2">
                +{schedule.length - 6} more reminders...
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Memory Vault Summary */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-sm">
              <Camera size={18} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{t('setup.review.memoryVault', { count: memories.length })}</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {memories.map((memory) => (
              <div key={memory.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
                <div className={`w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 ${memory.photo ? '' : `bg-gradient-to-br ${memory.color}`} flex items-center justify-center text-base`}>
                  {memory.photo ? (
                    <img src={memory.photo} alt={memory.name} className="w-full h-full object-cover" />
                  ) : (
                    memory.emoji
                  )}
                </div>
                <span className="text-sm font-medium text-gray-700">{memory.name}</span>
                <span className="text-xs text-gray-400">({memory.relationship})</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Ready Message */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-center"
      >
        <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">{t('setup.review.everythingLooksGreat')}</h3>
        <p className="text-gray-600 mb-4">
          {t('setup.review.activateMsg')}
        </p>
        <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
          <span>{t('setup.review.readyToActivate')}</span>
          <ArrowRight size={18} />
        </div>
      </motion.div>
    </div>
  )
}
