import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Building2, Tablet, Cloud, Database, Shield,
  Smartphone, Wifi, WifiOff, Users, HeartPulse, Check, ArrowRight,
  IndianRupee, GraduationCap, PhoneCall
} from 'lucide-react'
import BrahmiLogo from '../components/ui/BrahmiLogo'
import Card from '../components/ui/Card'

const setupSteps = [
  {
    icon: Building2,
    title: 'We create your facility account',
    desc: 'One staff login for your whole team — manager, nurses, caretakers.',
    detail: 'No technical knowledge needed. Works in your browser.',
  },
  {
    icon: Users,
    title: 'Each patient gets a profile',
    desc: 'Upload family photos, set medicine & meal schedules, add emergency contacts.',
    detail: 'Takes about 10 minutes per patient, done once.',
  },
  {
    icon: Tablet,
    title: 'Patients use the app daily',
    desc: 'Hand a patient a tablet — Brahmi AI opens in their preferred language with Sakshi guiding them.',
    detail: 'Games, reminders, health monitoring, and a big friendly emergency button.',
  },
  {
    icon: HeartPulse,
    title: 'Your staff sees everything',
    desc: 'A single dashboard shows all patients — progress, health alerts, emergencies.',
    detail: 'Caregivers get SMS + WhatsApp + live location when a patient needs help.',
  },
]

const storageFacts = [
  { icon: Cloud, title: 'Secure cloud database', desc: 'All patient data is stored in an encrypted, ISO-certified cloud database with automatic daily backups.' },
  { icon: Tablet, title: 'Works on any device', desc: 'Broken tablet? Log in on a new one and every patient profile is instantly back. Nothing is lost.' },
  { icon: Shield, title: 'Privacy by design', desc: 'Data is only visible to your facility staff. We never sell or share patient information — ever.' },
  { icon: WifiOff, title: 'Works offline too', desc: 'Core games and reminders function without internet, so rural and low-connectivity areas still work.' },
]

const planRows = [
  { feature: 'Facility staff logins', free: '1 admin', paid: 'Unlimited' },
  { feature: 'Patient profiles', free: '1', paid: 'Unlimited' },
  { feature: 'Cloud storage & backup', free: '—', paid: '✓' },
  { feature: 'Memory photos (per patient)', free: '5', paid: 'Unlimited' },
  { feature: 'Sakshi AI voice assistant', free: '—', paid: '✓' },
  { feature: 'Smartwatch monitoring', free: '—', paid: '✓ (Family)' },
  { feature: 'Emergency SMS + location', free: '—', paid: '✓' },
]

export default function ForOrganizationsPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <div className="glass shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Home</span>
          </button>
          <div className="flex items-center gap-2">
            <BrahmiLogo size={32} />
            <span className="text-lg font-bold text-gray-900">Brahmi <span className="text-primary-500">AI</span></span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-primary-50 text-primary-600">
            <Building2 size={13} /> For Organizations
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-medium mb-5">
            <GraduationCap size={14} /> Built for orphanages, eldercare homes & NGOs
          </span>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Bringing Brahmi AI to <span className="gradient-text">Your Facility</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mt-4">
            How installation works, where data is stored, and what it costs —
            everything your team needs to say yes.
          </p>
        </motion.div>

        {/* Setup steps */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How Installation Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {setupSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Card hover className="h-full">
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-md">
                        <step.icon size={20} className="text-white" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{step.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">{step.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">{step.detail}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Data storage */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center gap-2">
            <Database size={24} className="text-primary-500" /> Where Your Data Lives
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {storageFacts.map((fact, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl bg-white border border-gray-100 flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <fact.icon size={18} className="text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{fact.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 leading-relaxed">{fact.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Cost / plans */}
        <div className="mb-14">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">What It Costs</h2>
          <p className="text-gray-500 text-center mb-8 max-w-xl mx-auto">
            For a small NGO facility, Brahmi AI runs on free tiers — you pay less than the price of a daily cup of tea.
          </p>
          <Card className="max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-4 pb-3 border-b border-gray-100 text-sm font-semibold text-gray-500">
              <div>Feature</div>
              <div className="text-center text-emerald-600">Free</div>
              <div className="text-center text-primary-600">Premium</div>
            </div>
            {planRows.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 gap-4 py-3 text-sm ${i !== planRows.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="font-medium text-gray-700">{row.feature}</div>
                <div className={`text-center ${row.free === '—' ? 'text-gray-300' : 'text-gray-600 font-medium'}`}>{row.free}</div>
                <div className="text-center text-gray-600 font-medium">{row.paid}</div>
              </div>
            ))}
            <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-primary-50 to-teal-50 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <IndianRupee size={18} className="text-primary-600" />
                <span className="text-sm text-gray-700">
                  Premium: <strong className="text-gray-900">₹299/patient/month</strong> — discounts for NGOs
                </span>
              </div>
              <button
                onClick={() => navigate('/payment')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 text-white text-sm font-semibold flex items-center gap-1.5 shadow-md"
              >
                See Plans <ArrowRight size={14} />
              </button>
            </div>
          </Card>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-10 rounded-3xl bg-gradient-to-br from-primary-500 to-teal-500 text-white text-center shadow-2xl shadow-primary-500/20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Ready to try it at your facility?</h2>
          <p className="text-white/85 max-w-xl mx-auto mb-8">
            Try the facility console right now with our demo account — no setup, no cost, no commitment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/facility')}
              className="px-8 py-3.5 bg-white text-primary-600 font-bold rounded-xl flex items-center gap-2 shadow-xl hover:scale-105 transition-transform"
            >
              <Building2 size={18} /> Open Facility Console
            </button>
            <button
              onClick={() => navigate('/setup')}
              className="px-8 py-3.5 bg-white/20 text-white font-semibold rounded-xl flex items-center gap-2 border border-white/30 hover:bg-white/30 transition-colors"
            >
              Start Patient Setup <ArrowRight size={18} />
            </button>
          </div>
          <p className="text-xs text-white/70 mt-6 flex items-center justify-center gap-1.5">
            <PhoneCall size={12} /> Questions? Our team helps you onboard — setup support is always free.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
