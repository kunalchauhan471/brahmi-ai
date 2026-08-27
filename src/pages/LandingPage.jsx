import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Brain,
  Heart,
  Camera,
  Calendar,
  WifiOff,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
  Users,
  ChevronRight,
} from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const features = [
  {
    icon: Sparkles,
    title: 'Personalized Memory Games',
    description: 'AI-powered cognitive activities using your own family photos and familiar memories.',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    icon: Camera,
    title: 'Family Memory Vault',
    description: 'Store precious family photos and stories to create meaningful cognitive exercises.',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    iconColor: 'text-rose-600',
  },
  {
    icon: Calendar,
    title: 'Daily Routine Assistance',
    description: 'Gentle reminders for medicine, meals, activities, and daily schedule management.',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
  },
  {
    icon: WifiOff,
    title: 'Offline Ready',
    description: 'Works without internet. Essential cognitive activities available anytime, anywhere.',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
  },
  {
    icon: Shield,
    title: 'Safe & Private',
    description: 'All data stays on the device. No cloud storage, no privacy concerns.',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    iconColor: 'text-violet-600',
  },
  {
    icon: Users,
    title: 'Easy Caregiver Setup',
    description: 'Simple setup by family members. Patient needs zero technical knowledge.',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
  },
]

const stats = [
  { value: '55M+', label: 'People with Dementia Worldwide' },
  { value: '10M', label: 'New Cases Each Year' },
  { value: '60%', label: 'Lack Proper Cognitive Care' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-mesh overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 px-4">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary-500/5 to-teal-500/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial="initial"
          animate="animate"
          variants={stagger}
          className="max-w-5xl mx-auto text-center relative"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            <span className="text-sm font-medium text-primary-700">Smart India Hackathon Project</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
          >
            <span className="text-gray-900">Cogni</span>
            <span className="gradient-text">Care</span>
            <span className="text-primary-500 ml-1">AI</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-xl sm:text-2xl text-gray-500 max-w-3xl mx-auto mb-4 font-light"
          >
            Helping Dementia Patients Stay Connected with Their Memories
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-base text-gray-400 max-w-2xl mx-auto mb-12"
          >
            A cognitive assistance platform that creates personalized activities using family photos, 
            familiar objects, and daily routines — making memory care meaningful and accessible.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/setup')}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold text-lg shadow-xl shadow-primary-500/25 hover:shadow-2xl hover:shadow-primary-500/30 transition-shadow"
            >
              <Heart size={22} />
              I'm a Caregiver
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/patient')}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-gray-700 font-semibold text-lg border border-gray-200 shadow-lg hover:shadow-xl hover:border-primary-200 transition-all"
            >
              <Brain size={22} className="text-primary-500" />
              I'm a Patient
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Designed for <span className="gradient-text">Cognitive Wellness</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Every feature is crafted with empathy and understanding for dementia patients and their caregivers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}>
                  <feature.icon size={24} className={feature.iconColor} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-primary-50/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
            <p className="text-lg text-gray-500">
              Simple setup for caregivers, effortless use for patients.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Caregiver Setup',
                description: 'Add patient details, upload family photos, and create a daily schedule.',
                icon: Heart,
              },
              {
                step: '02',
                title: 'Memory Training',
                description: 'Patient engages with personalized cognitive games based on their own memories.',
                icon: Brain,
              },
              {
                step: '03',
                title: 'Track Progress',
                description: 'Monitor cognitive improvement through dashboards and activity reports.',
                icon: Clock,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative text-center"
              >
                <div className="text-4xl font-bold text-primary-400 mb-4">{item.step}</div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20">
                  <item.icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              Cogni<span className="gradient-text">Care</span> AI
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Smart India Hackathon 2026 — Making Memory Care Accessible
          </p>
        </div>
      </footer>
    </div>
  )
}
