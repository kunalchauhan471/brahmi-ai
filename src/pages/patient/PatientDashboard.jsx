import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Brain, Sun, Calendar, Clock, Gamepad2, Heart,
  Phone, AlertTriangle, Sparkles, ArrowRight,
  Pill, UtensilsCrossed, Activity, Bell, Moon,
  Camera, Star, Trophy
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import Card from '../../components/ui/Card'
import SakshiAssistant from '../../components/sakshi/SakshiAssistant'
import useScheduleReminder from '../../hooks/useScheduleReminder'

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

const gameCards = [
  {
    id: 1,
    name: 'Memory Album',
    icon: Camera,
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
  },
  {
    id: 2,
    name: 'Memory Tray',
    icon: Sparkles,
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
  },
  {
    id: 3,
    name: 'Face Match',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
  },
  {
    id: 4,
    name: 'Routine Order',
    icon: Calendar,
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
  },
]

export default function PatientDashboard() {
  const navigate = useNavigate()
  const { patientData, schedule, memories, completedGames } = useData()
  const [reminderMessage, setReminderMessage] = useState(null)

  const handleReminder = useCallback((reminder) => {
    setReminderMessage(reminder)
    setTimeout(() => setReminderMessage(null), 5000)
  }, [])

  useScheduleReminder(schedule, handleReminder)

  const greeting = getGreeting()
  const completedCount = Object.keys(completedGames).length
  const totalMemories = memories.length

  return (
    <div className="min-h-screen bg-mesh pb-24">
      {/* Header */}
      <div className="glass shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Brain size={20} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-gray-900 text-lg">
                  Cogni<span className="gradient-text">Care</span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/caregiver')}
                className="px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
              >
                Caregiver
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
                  <div className="font-semibold">⏰ Reminder: {reminderMessage.title}</div>
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
          <p className="text-lg text-gray-500">How are you feeling today?</p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'Games Played', value: completedCount, icon: Gamepad2, color: 'from-blue-500 to-indigo-500' },
            { label: 'Memories', value: totalMemories, icon: Heart, color: 'from-rose-500 to-pink-500' },
            { label: 'Today\'s Reminders', value: schedule.length, icon: Clock, color: 'from-amber-500 to-orange-500' },
            { label: 'Score', value: '120', icon: Trophy, color: 'from-emerald-500 to-teal-500' },
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
              Today's Schedule
            </h2>
            <span className="text-sm text-gray-400">{schedule.length} items</span>
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
              Fun Activities
            </h2>
            <button
              onClick={() => navigate('/games')}
              className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors"
            >
              View All
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {gameCards.map((game, index) => (
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
                <h3 className="font-semibold text-gray-900 text-lg">{game.name}</h3>
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
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full p-6 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white shadow-xl shadow-red-500/25 flex items-center justify-center gap-4"
          >
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
              <Phone size={28} />
            </div>
            <div className="text-left">
              <div className="text-xl font-bold">Emergency Call</div>
              <div className="text-red-100 text-sm">Tap to call your emergency contact</div>
            </div>
          </motion.button>
        </motion.div>
      </div>

      {/* Sakshi AI Assistant */}
      <SakshiAssistant triggerReminder={reminderMessage} />
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}
