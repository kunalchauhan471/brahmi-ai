import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Brain, Sun, Calendar, Clock, Gamepad2, Heart,
  MessageSquare, AlertTriangle, Sparkles, ArrowRight,
  Pill, UtensilsCrossed, Activity, Bell, Moon,
  Camera, Star, Trophy, CheckCircle, MessageCircle,
  Copy, Check
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useLanguage } from '../../i18n/LanguageContext'
import Card from '../../components/ui/Card'
import LanguageSelector from '../../components/ui/LanguageSelector'
import SakshiAssistant from '../../components/sakshi/SakshiAssistant'
import SmartwatchFloating from '../../components/smartwatch/SmartwatchFloating'
import SmartwatchPanel from '../../components/smartwatch/SmartwatchPanel'
import useScheduleReminder from '../../hooks/useScheduleReminder'
import { getISTHour } from '../../utils/timezone'
import BrahmiLogo from '../../components/ui/BrahmiLogo'
import { sendEmergencySMS, isValidPhone } from '../../utils/emergencyService'

const typeIcons = {
  medicine: Pill,
  meal: UtensilsCrossed,
  activity: Activity,
  reminder: Bell,
  routine: Moon,
  walk: Activity,
  drink: Bell,
}

const typeColors = {
  medicine: 'from-red-400 to-red-600',
  meal: 'from-amber-400 to-orange-600',
  activity: 'from-green-400 to-emerald-600',
  reminder: 'from-blue-400 to-indigo-600',
  routine: 'from-purple-400 to-violet-600',
  walk: 'from-teal-400 to-cyan-600',
  drink: 'from-cyan-400 to-blue-600',
}

const gameCardConfigs = [
  { id: 1, titleKey: 'games.memoryAlbum.shortName', icon: Camera, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50' },
  { id: 2, titleKey: 'games.memoryTray.name', icon: Sparkles, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-50' },
  { id: 3, titleKey: 'games.faceMatch.shortName', icon: Heart, color: 'from-rose-500 to-pink-600', bgColor: 'bg-rose-50' },
  { id: 4, titleKey: 'games.routineSequencer.shortName', icon: Calendar, color: 'from-amber-500 to-orange-600', bgColor: 'bg-amber-50' },
]

export default function PatientDashboard() {
  const navigate = useNavigate()
  const { patientData, schedule, memories, completedGames, emergencyContact } = useData()
  const { t } = useLanguage()
  const [reminderMessage, setReminderMessage] = useState(null)

  const handleReminder = useCallback((reminder) => {
    setReminderMessage(reminder)
    setTimeout(() => setReminderMessage(null), 5000)
  }, [])

  useScheduleReminder(schedule, handleReminder)

  const greeting = getGreeting(t)
  const completedCount = Object.keys(completedGames).length
  const totalMemories = memories.length

  return (
    <div className="min-h-screen bg-mesh pb-24">
      {/* Header */}
      <div className="glass shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BrahmiLogo size={40} />
              <div>
                <span className="font-bold text-gray-900 text-lg">
                  {t('common.appName')}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <LanguageSelector compact />
              <button
                onClick={() => navigate('/caregiver')}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              >
                {t('patient.caregiver')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Reminder Banner */}
        <AnimatePresence>
          {reminderMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-primary-500 to-teal-500 text-white shadow-lg shadow-primary-500/25"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bell size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-semibold">{t('patient.reminder', { title: reminderMessage.title })}</div>
                  {reminderMessage.notes && (
                    <div className="text-sm text-white/80">{reminderMessage.notes}</div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Sun size={28} className="text-amber-500" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {greeting}, {patientData.name || 'Friend'}!
            </h1>
          </div>
          <p className="text-lg text-gray-500">{t('patient.howFeeling')}</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: t('patient.gamesPlayed'), value: completedCount, icon: Gamepad2, color: 'from-blue-500 to-indigo-500' },
            { label: t('patient.memories'), value: totalMemories, icon: Heart, color: 'from-rose-500 to-pink-500' },
            { label: t('patient.todaysReminders'), value: schedule.length, icon: Clock, color: 'from-amber-500 to-orange-500' },
            { label: t('patient.score'), value: '120', icon: Trophy, color: 'from-emerald-500 to-teal-500' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
            >
              <Card hover className="text-center">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3 shadow-md`}>
                  <stat.icon size={22} className="text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Today's Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={22} className="text-primary-500" />
              {t('patient.todaySchedule')}
            </h2>
            <span className="text-sm text-gray-400">{schedule.length} {t('common.items')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {schedule.slice(0, 6).map((reminder, index) => {
              const TypeIcon = typeIcons[reminder.type] || Bell
              const color = typeColors[reminder.type] || 'from-blue-400 to-indigo-600'

              return (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 shadow-sm"
                >
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <TypeIcon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-lg">{reminder.title}</div>
                    {reminder.notes && (
                      <div className="text-sm text-gray-400 truncate">{reminder.notes}</div>
                    )}
                  </div>
                  <div className="text-base font-semibold text-primary-600 bg-primary-50 px-3 py-1 rounded-lg">
                    {reminder.time}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Games Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Gamepad2 size={22} className="text-teal-500" />
              {t('patient.funActivities')}
            </h2>
            <button
              onClick={() => navigate('/games')}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
              {t('patient.viewAll')}
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gameCardConfigs.map((game, index) => (
              <motion.button
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 + index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/games/${game.id}`)}
                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover transition-all text-left"
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-3 shadow-md`}>
                  <game.icon size={24} className="text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{t(game.titleKey)}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <Star size={14} className="text-gray-200" />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Emergency Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <EmergencyButton
            patientName={patientData.name}
            emergencyContact={emergencyContact}
          />
        </motion.div>
      </div>

      {/* Smartwatch Floating Widget */}
      <SmartwatchFloating />

      {/* Smartwatch Full Panel */}
      <SmartwatchPanel />

      {/* Sakshi AI Assistant */}
      <SakshiAssistant triggerReminder={reminderMessage} />
    </div>
  )
}

function EmergencyButton({ patientName, emergencyContact }) {
  const { t } = useLanguage()
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleEmergency = async () => {
    if (sending || sent) return
    setSending(true)
    setResult(null)

    try {
      const phone = emergencyContact?.phone
      if (!phone || !isValidPhone(phone)) {
        setResult({
          success: false,
          message: 'No emergency phone number set. Please ask your caregiver to add one in settings.',
        })
        setSending(false)
        return
      }

      const smsResult = await sendEmergencySMS(
        phone,
        patientName || 'Patient',
        'Patient pressed the emergency button — they need immediate help. Please come right away!'
      )

      setResult(smsResult)
      if (smsResult.success) {
        setSent(true)
        setTimeout(() => setSent(false), 15000)
      }
    } catch (err) {
      setResult({ success: false, message: 'Could not send SMS. Please try again.' })
    } finally {
      setSending(false)
    }
  }

  const handleCopyMessage = () => {
    if (result?.manualMessage) {
      navigator.clipboard.writeText(result.manualMessage).then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
    }
  }

  return (
    <div className="space-y-3">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleEmergency}
        disabled={sending}
        className="w-full p-6 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/25 flex items-center justify-center gap-4 disabled:opacity-70"
      >
        <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
          {sending ? (
            <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : sent ? (
            <CheckCircle size={28} />
          ) : (
            <MessageSquare size={28} />
          )}
        </div>
        <div className="text-left">
          <div className="text-xl font-bold">
            {sending ? 'Sending Emergency SMS...' : sent ? '✅ SMS Sent Successfully!' : '🚨 Emergency SMS'}
          </div>
          <div className="text-red-100 text-sm">
            {sent
              ? `Alert sent to ${emergencyContact?.name || 'your caregiver'} via SMS`
              : sending
                ? 'Sending emergency SMS...'
                : 'Tap to send emergency SMS to your contact'}
          </div>
        </div>
      </motion.button>

      {/* SMS Result Feedback */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            className={`rounded-xl p-4 text-sm flex items-start gap-3 ${
              result.success
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-amber-50 border border-amber-200 text-amber-800'
            }`}
          >
            {result.success ? (
              <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertTriangle size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <div className="font-medium">{result.message}</div>
              {result.method === 'manual' && (
                <div className="mt-2">
                  <p className="text-xs opacity-80 mb-2">Please send this message to {result.phone}:</p>
                  <div className="bg-white rounded-lg p-2 text-xs font-mono border border-amber-200 mb-2 whitespace-pre-wrap">{result.manualMessage}</div>
                  <button
                    onClick={handleCopyMessage}
                    className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 transition-colors"
                  >
                    {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy Message</>}
                  </button>
                </div>
              )}
              {result.quotaRemaining !== undefined && (
                <div className="text-xs mt-1 opacity-60">
                  SMS quota remaining today: {result.quotaRemaining}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function getGreeting(t) {
  const hour = getISTHour()
  if (hour < 12) return t('patient.greeting.morning')
  if (hour < 17) return t('patient.greeting.afternoon')
  return t('patient.greeting.evening')
}
