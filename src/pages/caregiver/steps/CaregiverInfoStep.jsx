import { motion } from 'framer-motion'
import { User, Mail, Phone, Heart } from 'lucide-react'
import { useData } from '../../../context/DataContext'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'

export default function CaregiverInfoStep() {
  const { caregiverData, setCaregiverData } = useData()

  return (
    <div>
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Heart size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Caregiver Information</h2>
            <p className="text-gray-500 text-sm">Tell us about yourself so we can set things up.</p>
          </div>
        </div>

        <div className="space-y-5">
          <Input
            label="Your Full Name"
            placeholder="e.g., Anita Sharma"
            value={caregiverData.name}
            onChange={(e) => setCaregiverData(prev => ({ ...prev, name: e.target.value }))}
            icon={User}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="e.g., anita@example.com"
            value={caregiverData.email}
            onChange={(e) => setCaregiverData(prev => ({ ...prev, email: e.target.value }))}
            icon={Mail}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            placeholder="e.g., +91 98765 43210"
            value={caregiverData.phone}
            onChange={(e) => setCaregiverData(prev => ({ ...prev, phone: e.target.value }))}
            icon={Phone}
            required
          />
        </div>
      </Card>

      <div className="p-4 rounded-xl bg-primary-50 border border-primary-100">
        <p className="text-sm text-primary-700">
          <strong>Note:</strong> Your information is stored locally on this device only. 
          It is never sent to any server.
        </p>
      </div>
    </div>
  )
}
