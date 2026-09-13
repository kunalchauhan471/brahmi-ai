import { motion } from 'framer-motion'
import { Siren, User, Phone, HeartHandshake } from 'lucide-react'
import { useData } from '../../../context/DataContext'
import { useLanguage } from '../../../i18n/LanguageContext'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Card from '../../../components/ui/Card'

const relationshipOptions = [
  { value: 'Son', label: 'Son' },
  { value: 'Daughter', label: 'Daughter' },
  { value: 'Spouse', label: 'Spouse' },
  { value: 'Grandchild', label: 'Grandchild' },
  { value: 'Sibling', label: 'Sibling' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Neighbor', label: 'Neighbor' },
  { value: 'Other', label: 'Other' },
]

export default function EmergencyContactStep() {
  const { emergencyContact, setEmergencyContact } = useData()
  const { t } = useLanguage()

  return (
    <div>
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg shadow-red-500/20">
            <Siren size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('setup.emergency.title')}</h2>
            <p className="text-gray-500 text-sm">{t('setup.emergency.desc')}</p>
          </div>
        </div>

        <div className="space-y-5">
          <Input
            label={t('setup.emergency.name')}
            placeholder={t('setup.emergency.namePlaceholder')}
            value={emergencyContact.name}
            onChange={(e) => setEmergencyContact(prev => ({ ...prev, name: e.target.value }))}
            icon={User}
            required
          />

          <Select
            label={t('setup.emergency.relationship')}
            value={emergencyContact.relationship}
            onChange={(e) => setEmergencyContact(prev => ({ ...prev, relationship: e.target.value }))}
            options={relationshipOptions}
            placeholder={t('setup.emergency.relationshipPlaceholder')}
            required
          />

          <Input
            label={t('setup.emergency.phone')}
            type="tel"
            placeholder={t('setup.emergency.phonePlaceholder')}
            value={emergencyContact.phone}
            onChange={(e) => setEmergencyContact(prev => ({ ...prev, phone: e.target.value }))}
            icon={Phone}
            required
          />
        </div>
      </Card>

      <div className="p-4 rounded-xl bg-red-50 border border-red-100">
        <div className="flex items-start gap-3">
          <HeartHandshake size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-700">
            {t('setup.emergency.note')}
          </p>
        </div>
      </div>
    </div>
  )
}
