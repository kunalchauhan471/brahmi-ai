import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import {
  Heart, Shield, ArrowRight, Play,
  Camera, Calendar, Gamepad2, Sparkles,
  ChevronRight, Globe, Building2
} from 'lucide-react'
import BrahmiLogo from '../components/ui/BrahmiLogo'
import ThemeToggle from '../components/ui/ThemeToggle'

const features = [
  {
    icon: Gamepad2,
    title: 'Personalized Memory Games',
    description: '6 cognitive games using family photos, familiar faces, and daily routines to keep minds active.',
  },
  {
    icon: Camera,
    title: 'Family Memory Vault',
    description: 'Upload family photos and memories. The app creates personalized activities from real relationships.',
  },
  {
    icon: Calendar,
    title: 'Daily Routine Assistance',
    description: 'Smart reminders for medicine, meals, walks, and sleep — all spoken by Sakshi AI.',
  },
  {
    icon: Globe,
    title: '11 Indian Languages',
    description: 'Hindi, Assamese, Bengali, Manipuri, Mizo, Khasi, Garo, Nepali, Bodo, Kokborok, and English.',
  },
  {
    icon: Heart,
    title: 'Smartwatch Health Monitor',
    description: 'Real-time heart rate, steps, and health alerts. Sakshi proactively cares for the patient.',
  },
  {
    icon: Shield,
    title: 'Emergency Response System',
    description: 'One-tap emergency with WhatsApp, SMS, phone call, and live GPS location to caregivers.',
  },
]

const steps = [
  { num: '01', title: 'Caregiver Setup', desc: 'Upload family photos, set schedule, add emergency contacts' },
  { num: '02', title: 'Patient Onboarding', desc: 'Patient gets their personalized dashboard with Sakshi AI' },
  { num: '03', title: 'Daily Engagement', desc: 'Games, reminders, health monitoring, and emergency support' },
]

const stats = [
  { value: '6', label: 'Cognitive Games' },
  { value: '11', label: 'Languages' },
  { value: '24/7', label: 'Sakshi AI Support' },
  { value: '3', label: 'Emergency Channels' },
]

function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[60] h-1 origin-left bg-gradient-to-r from-primary-500 via-teal-400 to-primary-500"
      style={{ scaleX }}
    />
  )
}

export default function LandingPage() {
  return (
    <div className="homepage min-h-screen bg-mesh overflow-hidden">
      {/* Scroll progress bar (homepage only) */}
      <ScrollProgress />

      {/* Navigation */}
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 glass shadow-sm"
        initial={{ y: -80 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BrahmiLogo size={36} />
            <span className="text-xl font-bold text-gray-900">
              Brahmi <span className="text-primary-500">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {['Features', 'How It Works', 'Contact'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, '-')}`} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/for-organizations">
              <motion.button
                className="hidden md:flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <Building2 size={14} />
                For NGOs
              </motion.button>
            </Link>
            <Link to="/facility">
              <motion.button
                className="hidden md:block px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                Staff Login
              </motion.button>
            </Link>
            <Link to="/payment">
              <motion.button
                className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                Pricing
              </motion.button>
            </Link>
            <Link to="/login">
              <motion.button
                className="px-5 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                Sign In
              </motion.button>
            </Link>
            <Link to="/setup">
              <motion.button
                className="px-5 py-2 text-sm font-medium bg-gradient-to-r from-primary-500 to-teal-500 text-white rounded-xl shadow-lg shadow-primary-500/25"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        {/* Soft floating decorative orbs (homepage only) */}
        <motion.div
          className="pointer-events-none absolute top-24 left-[8%] w-28 h-28 rounded-full bg-gradient-to-br from-primary-300/30 to-teal-300/20 blur-2xl"
          animate={{ y: [0, -18, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute bottom-32 right-[10%] w-36 h-36 rounded-full bg-gradient-to-br from-teal-300/25 to-primary-300/20 blur-2xl"
          animate={{ y: [0, 16, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <motion.div
          className="pointer-events-none absolute top-1/2 left-1/3 w-20 h-20 rounded-full bg-primary-200/20 blur-xl"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Cognitive Care for Elderly Patients
            </span>
          </motion.div>

          <motion.h1
            className="mt-8 text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 tracking-tight leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Helping Dementia Patients
            <br />
            <span className="gradient-text-flow">Stay Connected</span>
            <br />
            with Their Memories
          </motion.h1>

          <motion.p
            className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Personalized cognitive activities using family photos, familiar memories, and daily routines.
            <span className="text-gray-700 font-medium"> One caregiver setup. Daily patient engagement.</span>
          </motion.p>

          <motion.div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link to="/setup">
              <motion.button
                className="group px-8 py-4 bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold rounded-2xl shadow-xl shadow-primary-500/25 flex items-center gap-2"
                whileHover={{ scale: 1.03, boxShadow: '0 20px 40px rgba(14, 165, 233, 0.2)' }}
                whileTap={{ scale: 0.98 }}
              >
                I'm a Caregiver
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/patient">
              <motion.button
                className="group px-8 py-4 bg-white border-2 border-gray-200 text-gray-700 font-semibold rounded-2xl flex items-center gap-2 hover:border-primary-300 transition-colors"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                I'm a Patient
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
              >
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary-600 text-sm font-medium tracking-wider uppercase">How It Works</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-gray-900">
              Simple Setup, <span className="gradient-text-flow">Daily Impact</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative overflow-hidden p-8 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover gradient-ring transition-shadow duration-300 group"
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.12, duration: 0.5, ease: 'easeOut' }}
                whileHover={{ y: -8, scale: 1.02, boxShadow: '0 24px 48px -12px rgba(14, 165, 233, 0.18), 0 8px 20px -8px rgba(0, 0, 0, 0.08)' }}
              >
                {/* Top accent line on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 via-teal-400 to-primary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Number chip — fully visible with glow */}
                <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-teal-50 border border-primary-100 mb-6 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-primary-500/10 transition-all duration-300">
                  <span className="text-3xl font-extrabold gradient-text tracking-tight">{step.num}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>

                {/* Animated progress dots for the next steps */}
                <div className="flex items-center gap-1 mt-6">
                  {[0, 1, 2].map(dot => (
                    <motion.span
                      key={dot}
                      className={`w-1.5 h-1.5 rounded-full ${dot === i ? 'bg-primary-500' : 'bg-gray-200'} group-hover:bg-primary-300 transition-colors`}
                    />
                  ))}
                  <span className="ml-2 h-px flex-1 bg-gradient-to-r from-primary-200 to-transparent" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-primary-600 text-sm font-medium tracking-wider uppercase">Features</span>
            <h2 className="mt-4 text-3xl md:text-5xl font-bold text-gray-900">
              Everything Your Patient <span className="gradient-text-flow">Needs</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="group relative p-6 rounded-2xl bg-white border border-gray-200/70 shadow-card hover:border-primary-200 transition-colors duration-300 gradient-ring"
                initial={{ opacity: 0, y: 30, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, duration: 0.45, ease: 'easeOut' }}
                whileHover={{ y: -6, scale: 1.02, boxShadow: '0 20px 40px -12px rgba(14, 165, 233, 0.16), 0 6px 18px -8px rgba(0, 0, 0, 0.07)' }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center mb-4 shadow-md shadow-primary-500/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary-500/40 transition-all duration-300">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.description}</p>
                {/* Subtle bottom accent revealed on hover */}
                <div className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-primary-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-12 rounded-3xl bg-gradient-to-br from-primary-500 to-teal-500 text-white shadow-2xl shadow-primary-500/20"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to Help Someone Remember?
            </h2>
            <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
              Start personalized cognitive care in under 10 minutes. No technical knowledge needed.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/setup">
                <motion.button
                  className="px-8 py-4 bg-white text-primary-600 font-bold rounded-2xl shadow-xl flex items-center gap-2"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Free Setup
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/patient">
                <motion.button
                  className="px-8 py-4 bg-white/20 text-white font-semibold rounded-2xl flex items-center gap-2 border border-white/30"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Play className="w-4 h-4" />
                  Try Patient View
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-gray-200 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <BrahmiLogo size={28} />
              <span className="text-lg font-bold text-gray-900">
                Brahmi <span className="text-primary-500">AI</span>
              </span>
            </div>
            <p className="text-sm text-gray-400">
              © 2026 Brahmi AI. Making Memory Care Accessible.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Terms</a>
              <a href="#" className="text-sm text-gray-400 hover:text-gray-600 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
