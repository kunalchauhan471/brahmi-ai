import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  CreditCard,
  Check,
  ArrowRight,
  ArrowLeft,
  Shield,
  Sparkles,
  Star,
  Heart,
  Users,
  Lock,
  ChevronRight,
} from 'lucide-react'
import Button from '../components/ui/Button'
import BrahmiLogo from '../components/ui/BrahmiLogo'
import { useLanguage } from '../i18n/LanguageContext'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: '₹0',
    period: 'forever',
    description: 'Basic cognitive games for getting started',
    icon: Heart,
    color: 'from-gray-400 to-gray-500',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    features: [
      '3 cognitive games',
      'Basic memory vault (5 photos)',
      'Daily schedule reminders',
    ],
    notIncluded: [
      'Sakshi AI voice assistant',
      'Emergency system & live location',
      'Smartwatch health monitoring',
      'Family sharing & reports',
      'Priority support',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '₹299',
    period: '/month',
    description: 'Full access to all cognitive training tools',
    icon: Sparkles,
    color: 'from-primary-500 to-teal-500',
    bgColor: 'bg-primary-50',
    borderColor: 'border-primary-200',
    popular: true,
    features: [
      'All 6 cognitive games',
      'Unlimited memory vault',
      'Advanced progress analytics',
      'AI-powered personalized activities',
      '✨ Sakshi AI voice assistant',
      'Daily schedule & reminders',
      '🚨 Emergency system with live location',
      '📱 WhatsApp + SMS alerts to caregiver',
    ],
    notIncluded: [
      'Smartwatch health monitoring',
      'Family sharing (up to 5 members)',
    ],
  },
  {
    id: 'family',
    name: 'Family',
    price: '₹599',
    period: '/month',
    description: 'Complete care with family collaboration',
    icon: Users,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    features: [
      'Everything in Premium',
      '⌚ Smartwatch health monitoring',
      '❤️ Real-time heart rate & health alerts',
      '📍 Live GPS tracking with interactive map',
      '🚨 Emergency system with 3-channel alerts',
      'Family sharing (up to 5 members)',
      'Multi-patient support',
      'Caregiver collaboration tools',
      'Weekly progress reports via email',
      'Priority support',
    ],
    notIncluded: [],
  },
]

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export default function PaymentPage() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [step, setStep] = useState('plans') // plans | form | success
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    email: '',
  })

  const handleSelectPlan = (plan) => {
    if (plan.id === 'free') {
      navigate('/setup')
      return
    }
    setSelectedPlan(plan)
    setStep('form')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setStep('success')
  }

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(' ') : v
  }

  const formatExpiry = (value) => {
    const v = value.replace(/[^0-9]/g, '')
    if (v.length >= 2) return v.slice(0, 2) + '/' + v.slice(2, 4)
    return v
  }

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => step === 'plans' ? navigate('/') : setStep('plans')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">{t('common.back')}</span>
          </button>

          <div className="flex items-center gap-2">
            <BrahmiLogo size={32} />
            <span className="text-lg font-bold text-gray-900">
              Brahmi <span className="text-primary-500">AI</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Lock size={12} />
            <span>{t('common.secure')}</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {/* Step 1: Plan Selection */}
          {step === 'plans' && (
            <motion.div key="plans" {...fadeUp}>
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 mb-6">
                  <CreditCard size={14} className="text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">{t('payment.choosePlan')}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
                  {t('payment.startJourney')} <span className="gradient-text">{t('payment.journeyHighlight')}</span> {t('payment.journeySuffix')}
                </h1>
                <p className="text-gray-500 text-lg max-w-2xl mx-auto">
                  {t('payment.planDesc')}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, index) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -4 }}
                    className={`relative rounded-2xl border-2 bg-white p-6 transition-all duration-300 cursor-pointer ${
                      plan.popular
                        ? `${plan.borderColor} shadow-lg shadow-primary-500/10`
                        : 'border-gray-100 shadow-card hover:shadow-card-hover'
                    }`}
                    onClick={() => handleSelectPlan(plan)}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 text-white text-xs font-semibold shadow-lg">
                        {t('payment.mostPopular')}
                      </div>
                    )}

                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4 shadow-md`}>
                      <plan.icon size={22} className="text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 mb-4">{plan.description}</p>

                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-sm text-gray-400">{plan.period}</span>
                    </div>

                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check size={12} className="text-emerald-600" />
                          </div>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature, i) => (
                        <div key={i} className="flex items-start gap-2.5 opacity-40">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs text-gray-400">—</span>
                          </div>
                          <span className="text-sm text-gray-500 line-through">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-primary-500 to-teal-500 text-white hover:shadow-lg hover:shadow-primary-500/25'
                          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      {plan.id === 'free' ? t('payment.getStartedFree') : t('payment.choosePlanBtn', { name: plan.name })}
                    </button>
                  </motion.div>
                ))}
              </div>

              <div className="mt-10 text-center">
                <div className="inline-flex items-center gap-6 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <Shield size={14} />
                    {t('payment.encryption')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Lock size={14} />
                    {t('payment.securePayments')}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Star size={14} />
                    {t('payment.cancelAnytime')}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Payment Form */}
          {step === 'form' && (
            <motion.div key="form" {...fadeUp} className="max-w-xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {t('payment.paymentDetails')}
                </h2>
                <p className="text-gray-500">
                  {t('payment.subscribingTo')} <span className="font-semibold text-gray-700">{selectedPlan?.name}</span> {t('payment.plan')}
                </p>
              </div>

              {/* Order Summary */}
              <Card className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedPlan?.color} flex items-center justify-center`}>
                      {selectedPlan?.icon && <selectedPlan.icon size={18} className="text-white" />}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">Brahmi AI — {selectedPlan?.name}</div>
                      <div className="text-sm text-gray-500">{t('payment.billedMonthly')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">{selectedPlan?.price}</div>
                    <div className="text-xs text-gray-400">{selectedPlan?.period}</div>
                  </div>
                </div>
              </Card>

              {/* Payment Form */}
              <form onSubmit={handleSubmit}>
                <Card className="space-y-5">
                  <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
                    <CreditCard size={18} className="text-primary-500" />
                    <span className="font-semibold text-gray-900">{t('payment.cardInfo')}</span>
                  </div>

                  <Input
                    label={t('payment.nameOnCard')}
                    placeholder="Kunal Chauhan"
                    value={formData.cardName}
                    onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                    required
                  />

                  <Input
                    label={t('payment.cardNumber')}
                    placeholder="4242 4242 4242 4242"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                    icon={CreditCard}
                    maxLength={19}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label={t('payment.expiryDate')}
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={(e) => setFormData({ ...formData, expiry: formatExpiry(e.target.value) })}
                      maxLength={5}
                      required
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/[^0-9]/g, '') })}
                      maxLength={4}
                      required
                    />
                  </div>

                  <Input
                    label={t('payment.emailReceipt')}
                    placeholder="kunal@example.com"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </Card>

                <div className="mt-6 space-y-3">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    icon={Lock}
                  >
                    {t('payment.paySecurely', { price: selectedPlan?.price })}
                  </Button>

                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                    <Lock size={12} />
                    {t('payment.paymentEncrypted')}
                  </p>
                </div>
              </form>

              <div className="mt-8 flex items-center justify-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Shield size={14} />
                  {t('payment.ssl256')}
                </span>
                <span>•</span>
                <span>{t('payment.pciCompliant')}</span>
                <span>•</span>
                <span>{t('payment.cancelAnytime')}</span>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <motion.div key="success" {...fadeUp} className="max-w-lg mx-auto text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-emerald-500/30"
              >
                <Check size={48} className="text-white" strokeWidth={3} />
              </motion.div>

              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                {t('payment.paymentSuccess')}
              </h2>
              <p className="text-gray-500 text-lg mb-8">
                {t('payment.welcomeMessage', { name: selectedPlan?.name })}
              </p>

              <Card className="mb-8 text-left">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('payment.plan')}</span>
                    <span className="font-medium text-gray-900">{selectedPlan?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('payment.amount')}</span>
                    <span className="font-medium text-gray-900">{selectedPlan?.price}{selectedPlan?.period}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('payment.status')}</span>
                    <span className="font-medium text-emerald-600">{t('payment.active')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t('payment.receipt')}</span>
                    <span className="font-medium text-gray-900">{formData.email || 'kunal@example.com'}</span>
                  </div>
                </div>
              </Card>

              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/setup')}
                icon={ArrowRight}
              >
                {t('payment.startSetup')}
              </Button>

              <button
                onClick={() => navigate('/')}
                className="mt-4 text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                {t('payment.goHome')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
