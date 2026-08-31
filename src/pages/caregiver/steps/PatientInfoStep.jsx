import { motion } from 'framer-motion'
import { UserCircle, Calendar, Globe } from 'lucide-react'
import { useData } from '../../../context/DataContext'
import { useLanguage } from '../../../i18n/LanguageContext'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Card from '../../../components/ui/Card'

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

const languageOptions = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Assamese', label: 'Assamese' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Manipuri', label: 'Manipuri (Meitei)' },
  { value: 'Mizo', label: 'Mizo' },
  { value: 'Khasi', label: 'Khasi' },
  { value: 'Garo', label: 'Garo' },
  { value: 'Nepali', label: 'Nepali' },
  { value: 'Bodo', label: 'Bodo' },
  { value: 'Kokborok', label: 'Kokborok' },
]

export default function PatientInfoStep() {
  const { patientData, setPatientData } = useData()
  const { t } = useLanguage()

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
          <UserCircle size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t('setup.patientInfo.title')}</h2>
          <p className="text-gray-500 text-sm">{t('setup.patientInfo.desc')}</p>
        </div>
      </div>

      <div className="space-y-5">
        <Input
          label={t('setup.patientInfo.name')}
          placeholder={t('setup.patientInfo.namePlaceholder')}
          value={patientData.name}
          onChange={(e) => setPatientData(prev => ({ ...prev, name: e.target.value }))}
          icon={UserCircle}
          required
        />

        <Input
          label={t('setup.patientInfo.age')}
          type="number"
          placeholder={t('setup.patientInfo.agePlaceholder')}
          value={patientData.age}
          onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
          icon={Calendar}
          required
        />

        <Select
          label={t('setup.patientInfo.gender')}
          value={patientData.gender}
          onChange={(e) => setPatientData(prev => ({ ...prev, gender: e.target.value }))}
          options={genderOptions}
          placeholder={t('setup.patientInfo.genderPlaceholder')}
          required
        />

        <Select
          label={t('setup.patientInfo.language')}
          value={patientData.language}
          onChange={(e) => setPatientData(prev => ({ ...prev, language: e.target.value }))}
          options={languageOptions}
          placeholder={t('setup.patientInfo.languagePlaceholder')}
          required
        />
      </div>
    </Card>
  )
}
