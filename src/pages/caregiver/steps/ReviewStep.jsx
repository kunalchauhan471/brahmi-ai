import { motion } from 'framer-motion'
import {
  User, Mail, Phone, UserCircle, Calendar, Globe,
  Siren, Clock, Camera, CheckCircle2, ArrowRight,
  Pill, UtensilsCrossed, Activity, Bell, Moon
} from 'lucide-react'
import { useData } from '../../../context/DataContext'
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

  const sections = [
    {
      title: 'Caregiver Details',
      icon: User,
      color: 'from-primary-500 to-teal-500',
      items: [
        { icon: User, label: 'Name', value: caregiverData.name || 'Not provided' },
        { icon: Mail, label: 'Email', value: caregiverData.email || 'Not provided' },
        { icon: Phone, label: 'Phone', value: caregiverData.phone || 'Not provided' },
      ],
    },
    {
      title: 'Patient Details',
      icon: UserCircle,
      color: 'from-rose-500 to-pink-500',
      items: [
        { icon: UserCircle, label: 'Name', value: patientData.name || 'Not provided' },
        { icon: Calendar, label: 'Age', value: patientData.age ? `${patientData.age} years` : 'Not provided' },
        { icon: User, label: 'Gender', value: patientData.gender || 'Not provided' },
        { icon: Globe, label: 'Language', value: patientData.language || 'English' },
      ],
    },
    {
      title: 'Emergency Contact',
      icon: Siren,
      color: 'from-red-500 to-orange-500',
      items: [
        { icon: User, label: 'Name', value: emergencyContact.name || 'Not provided' },
        { icon: User, label: 'Relationship', value: emergencyContact.relationship || 'Not provided' },
        { icon: Phone, label: 'Phone', value: emergencyContact.phone || 'Not provided' },
      ],
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Information</h2>
        <p className="text-gray-500">Please review all details before activating Patient Mode.</p>
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
            <h3 className="text-lg font-semibold text-gray-900">Daily Schedule ({schedule.length} reminders)</h3>
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
            <h3 className="text-lg font-semibold text-gray-900">Memory Vault ({memories.length} memories)</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {memories.map((memory) => (
              <div key={memory.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
                <span className="text-lg">{memory.emoji}</span>
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
        <h3 className="text-xl font-bold text-gray-900 mb-2">Everything Looks Great!</h3>
        <p className="text-gray-600 mb-4">
          Click "Activate Patient Mode" below to start the patient experience.
        </p>
        <div className="flex items-center justify-center gap-2 text-emerald-600 font-medium">
          <span>Ready to activate</span>
          <ArrowRight size={18} />
        </div>
      </motion.div>
    </div>
  )
}
