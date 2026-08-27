import { motion } from 'framer-motion'
import { UserCircle, Calendar, Globe } from 'lucide-react'
import { useData } from '../../../context/DataContext'
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
  { value: 'Tamil', label: 'Tamil' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Bengali', label: 'Bengali' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Gujarati', label: 'Gujarati' },
  { value: 'Kannada', label: 'Kannada' },
  { value: 'Malayalam', label: 'Malayalam' },
  { value: 'Punjabi', label: 'Punjabi' },
]

export default function PatientInfoStep() {
  const { patientData, setPatientData } = useData()

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center shadow-lg shadow-rose-500/20">
          <UserCircle size={24} className="text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Patient Information</h2>
          <p className="text-gray-500 text-sm">Tell us about the patient we're helping.</p>
        </div>
      </div>

      <div className="space-y-5">
        <Input
          label="Patient's Name"
          placeholder="e.g., Rajesh Sharma"
          value={patientData.name}
          onChange={(e) => setPatientData(prev => ({ ...prev, name: e.target.value }))}
          icon={UserCircle}
          required
        />

        <Input
          label="Age"
          type="number"
          placeholder="e.g., 72"
          value={patientData.age}
          onChange={(e) => setPatientData(prev => ({ ...prev, age: e.target.value }))}
          icon={Calendar}
          required
        />

        <Select
          label="Gender"
          value={patientData.gender}
          onChange={(e) => setPatientData(prev => ({ ...prev, gender: e.target.value }))}
          options={genderOptions}
          placeholder="Select gender"
          required
        />

        <Select
          label="Preferred Language"
          value={patientData.language}
          onChange={(e) => setPatientData(prev => ({ ...prev, language: e.target.value }))}
          options={languageOptions}
          placeholder="Select language"
          required
        />
      </div>
    </Card>
  )
}
