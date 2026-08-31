import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
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
import { useLanguage } from '../i18n/LanguageContext'
import InteractiveBackground from '../components/effects/InteractiveBackground'
import MagneticButton from '../components/effects/MagneticButton'
import TiltCard from '../components/effects/TiltCard'
import GradientBorder from '../components/effects/GradientBorder'
import TextScramble from '../components/effects/TextScramble'
import BrahmiLogo from '../components/ui/BrahmiLogo'

/* ── Animated counter hook ── */
function useCountUp(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const hasRun = useRef(false)

  useEffect(() => {
    if (!startOnView || !isInView || hasRun.current) return
    hasRun.current = true
    const numeric = parseInt(end.replace(/[^0-9]/g, ''), 10)
    const suffix = end.replace(/[0-9]/g, '')
    let start = 0
    const step = numeric / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= numeric) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start) + suffix)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, end, duration, startOnView])

  return { ref, count }
}

/* ── Floating orb for hero background ── */
function FloatingOrb({ className, delay = 0 }) {
  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
      animate={{
        y: [0, -30, 0, 20, 0],
        x: [0, 15, -10, 5, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    />
  )
}

/* ── Slide-in direction variants ── */
const slideFromLeft = {
  hidden: { opacity: 0, x: -60, rotateY: -5 },
  visible: { opacity: 1, x: 0, rotateY: 0 },
}

const slideFromRight = {
  hidden: { opacity: 0, x: 60, rotateY: 5 },
  visible: { opacity: 1, x: 0, rotateY: 0 },
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const statsData = [
  { value: '55M+', labelKey: 'landing.stat1Label' },
  { value: '10M', labelKey: 'landing.stat2Label' },
  { value: '60%', labelKey: 'landing.stat3Label' },
]

const featureConfigs = [
  { icon: Sparkles, titleKey: 'landing.feature1Title', descKey: 'landing.feature1Desc', color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50', iconColor: 'text-blue-600' },
  { icon: Camera, titleKey: 'landing.feature2Title', descKey: 'landing.feature2Desc', color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50', iconColor: 'text-rose-600' },
  { icon: Calendar, titleKey: 'landing.feature3Title', descKey: 'landing.feature3Desc', color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50', iconColor: 'text-amber-600' },
  { icon: WifiOff, titleKey: 'landing.feature4Title', descKey: 'landing.feature4Desc', color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50', iconColor: 'text-emerald-600' },
  { icon: Shield, titleKey: 'landing.feature5Title', descKey: 'landing.feature5Desc', color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-50', iconColor: 'text-violet-600' },
  { icon: Users, titleKey: 'landing.feature6Title', descKey: 'landing.feature6Desc', color: 'from-cyan-500 to-blue-600', bgColor: 'bg-cyan-50', iconColor: 'text-cyan-600' },
]

const stepsConfigs = [
  { step: '01', titleKey: 'landing.step1Title', descKey: 'landing.step1Desc', icon: Heart },
  { step: '02', titleKey: 'landing.step2Title', descKey: 'landing.step2Desc', icon: Brain },
  { step: '03', titleKey: 'landing.step3Title', descKey: 'landing.step3Desc', icon: Clock },
]

function StatCard({ stat, index, t }) {
  const { ref, count } = useCountUp(stat.value, 2000)
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="text-center"
    >
      <div className="text-3xl font-bold gradient-text">{count || stat.value}</div>
      <div className="text-sm text-gray-400 mt-1">{t(stat.labelKey)}</div>
    </motion.div>
  )
}

export default function LandingPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <InteractiveBackground>
      {/* ── Hero Section ── */}
      <section ref={heroRef} className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 px-4 overflow-hidden">
        {/* Floating orbs */}
        <FloatingOrb className="w-96 h-96 bg-primary-400/8 top-0 left-10" delay={0} />
        <FloatingOrb className="w-72 h-72 bg-teal-400/8 top-20 right-20" delay={2} />
        <FloatingOrb className="w-60 h-60 bg-primary-300/6 bottom-0 left-1/3" delay={4} />

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #0ea5e9 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}
        />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          initial="initial"
          animate="animate"
          variants={stagger}
          className="max-w-5xl mx-auto text-center relative"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-8">
            <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />              <span className="text-sm font-medium text-primary-700">{t('landing.badge')}</span>
          </motion.div>

          {/* Title */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-6">
            <BrahmiLogo size={48} />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-gray-900">Brahmi</span>
              <span className="text-primary-500 ml-1">AI</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            className="text-xl sm:text-2xl text-gray-500 max-w-3xl mx-auto mb-4 font-light"
          >
            {t('landing.title')}
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="text-base text-gray-400 max-w-2xl mx-auto mb-12"
          >
            {t('landing.subtitle')}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <motion.button
              whileHover={{ scale: 1.03, y: -2, boxShadow: '0 25px 50px -12px rgba(14,165,233,0.35)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/payment')}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold text-lg shadow-xl shadow-primary-500/25 transition-shadow overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-primary-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <span className="relative flex items-center gap-3">
                <Heart size={22} />
                {t('landing.imCaregiver')}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -2, boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/patient')}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-gray-700 font-semibold text-lg border border-gray-200 shadow-lg hover:shadow-xl hover:border-primary-200 transition-all"
            >
              <Brain size={22} className="text-primary-500" />
              {t('landing.imPatient')}
              <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {statsData.map((stat, i) => (
              <StatCard key={i} stat={stat} index={i} t={t} />
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-1 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 mx-auto mb-6"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.featuresTitle')}{' '}<span className="gradient-text">{t('landing.featuresHighlight')}</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              {t('landing.featuresDesc')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureConfigs.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-60px' }}
                variants={index % 2 === 0 ? slideFromLeft : slideFromRight}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <TiltCard className="h-full">
                  <div className="group p-6 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-300 h-full">
                    <motion.div
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4`}
                    >
                      <feature.icon size={24} className={feature.iconColor} />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t(feature.titleKey)}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">{t(feature.descKey)}</p>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works Section ── */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-primary-50/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-1 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 mx-auto mb-6"
            />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              {t('landing.howItWorks')} <span className="gradient-text">{t('landing.howItWorksHighlight')}</span>
            </h2>
            <p className="text-lg text-gray-500">
              {t('landing.howItWorksDesc')}
            </p>
          </motion.div>

          <div className="relative">
            {/* Connecting line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
              className="hidden md:block absolute top-24 left-[16.7%] right-[16.7%] h-[2px] bg-gradient-to-r from-primary-300 via-teal-400 to-primary-300 origin-left"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stepsConfigs.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: index * 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="relative text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15, delay: index * 0.2 + 0.3 }}
                    className="text-4xl font-bold text-primary-400 mb-4"
                  >
                    {item.step}
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/20"
                  >
                    <item.icon size={28} className="text-white" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{t(item.titleKey)}</h3>
                  <p className="text-gray-500">{t(item.descKey)}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing CTA Section ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
          <div className="relative rounded-3xl bg-gradient-to-br from-primary-500 to-teal-600 p-10 sm:p-14 text-center overflow-hidden">
            {/* Floating decorative circles */}
            <motion.div
              animate={{ y: [-10, 10, -10], x: [-5, 5, -5] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"
            />
            <motion.div
              animate={{ y: [10, -10, 10], x: [5, -5, 5] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4"
            />
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full"
            />

            <div className="relative">
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl sm:text-4xl font-bold text-white mb-4"
              >
                {t('landing.ctaTitle')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-primary-100 text-lg max-w-xl mx-auto mb-8"
              >
                {t('landing.ctaDesc')}
              </motion.p>
              <motion.button
                whileHover={{ scale: 1.03, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/payment')}
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-primary-600 font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow overflow-hidden"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-primary-100/40 to-transparent" />
                <span className="relative flex items-center gap-2">
                  {t('landing.viewPricing')}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            </div>
          </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 px-4">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-4">
            <BrahmiLogo size={32} />
            <span className="text-lg font-bold text-gray-900">
              Brahmi <span className="text-primary-500">AI</span>
            </span>
          </div>
          <p className="text-sm text-gray-400">
            {t('landing.footerText')}
          </p>
        </motion.div>
      </footer>
    </InteractiveBackground>
  )
}
