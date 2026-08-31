import { motion } from 'framer-motion'
import { User, Mail, Phone, Heart } from 'lucide-react'
import { useData } from '../../../context/DataContext'
import { useLanguage } from '../../../i18n/LanguageContext'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'

export default function CaregiverInfoStep() {
  const { caregiverData, setCaregiverData } = useData()
  const { t } = useLanguage()

  return (
    <div>
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Heart size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('setup.caregiverInfo.title')}</h2>
            <p className="text-gray-500 text-sm">{t('setup.caregiverInfo.desc')}</p>
          </div>
        </div>

        <div className="space-y-5">
          <Input
            label={t('setup.caregiverInfo.name')}
            placeholder={t('setup.caregiverInfo.namePlaceholder')}
            value={caregiverData.name}
            onChange={(e) => setCaregiverData(prev => ({ ...prev, name: e.target.value }))}
            icon={User}
            required
          />

          <Input
            label={t('setup.caregiverInfo.email')}
            type="email"
            placeholder={t('setup.caregiverInfo.emailPlaceholder')}
            value={caregiverData.email}
            onChange={(e) => setCaregiverData(prev => ({ ...prev, email: e.target.value }))}
            icon={Mail}
            required
          />

          <Input
            label={t('setup.caregiverInfo.phone')}
            type="tel"
            placeholder={t('setup.caregiverInfo.phonePlaceholder')}
            value={caregiverData.phone}
            onChange={(e) => setCaregiverData(prev => ({ ...prev, phone: e.target.value }))}
            icon={Phone}
            required
          />
        </div>
      </Card>

      <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
        <p className="text-sm text-primary-700">
          {t('setup.caregiverInfo.note')}
        </p>
      </div>
    </div>
  )
}
