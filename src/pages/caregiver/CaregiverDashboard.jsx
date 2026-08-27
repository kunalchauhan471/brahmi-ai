import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Brain, ArrowLeft, Users, Calendar, Clock, Gamepad2,
  Camera, Heart, TrendingUp, Activity, Pill, UtensilsCrossed,
  Bell, Moon, Settings, ChevronRight, Star, BarChart3
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import Card from '../../components/ui/Card'

const typeIcons = {
  medicine: Pill,
  meal: UtensilsCrossed,
  activity: Activity,
  reminder: Bell,
  routine: Moon,
  walk: Activity,
  drink: Bell,
}

const weeklyData = [
  { day: 'Mon', games: 3, score: 60 },
  { day: 'Tue', games: 4, score: 85 },
  { day: 'Wed', games: 2, score: 40 },
  { day: 'Thu', games: 5, score: 100 },
  { day: 'Fri', games: 3, score: 75 },
  { day: 'Sat', games: 4, score: 90 },
  { day: 'Sun', games: 2, score: 50 },
]

const recentActivity = [
  { id: 1, action: 'Completed Memory Album', time: '2 hours ago', score: 20, icon: Camera, color: 'text-blue-500 bg-blue-50' },
  { id: 2, action: 'Played Memory Tray', time: '3 hours ago', score: 30, icon: Gamepad2, color: 'text-emerald-500 bg-emerald-50' },
  { id: 3, action: 'Morning Medicine reminder', time: '5 hours ago', score: null, icon: Pill, color: 'text-red-500 bg-red-50' },
  { id: 4, action: 'Completed Face Match', time: 'Yesterday', score: 40, icon: Users, color: 'text-rose-500 bg-rose-50' },
  { id: 5, action: 'Played Routine Sequencer', time: 'Yesterday', score: 25, icon: Calendar, color: 'text-amber-500 bg-amber-50' },
]

const gameStats = [
  { name: 'Memory Album', played: 12, best: 80, icon: Camera, color: 'from-blue-500 to-indigo-600' },
  { name: 'Memory Tray', played: 8, best: 90, icon: Heart, color: 'from-emerald-500 to-teal-600' },
  { name: 'Face Match', played: 15, best: 75, icon: Users, color: 'from-rose-500 to-pink-600' },
  { name: 'Routine Seq.', played: 6, best: 60, icon: Calendar, color: 'from-amber-500 to-orange-600' },
  { name: 'What Changed', played: 10, best: 85, icon: Activity, color: 'from-violet-500 to-purple-600' },
  { name: 'Culture Match', played: 5, best: 70, icon: Star, color: 'from-cyan-500 to-blue-600' },
]

export default function CaregiverDashboard() {
  const navigate = useNavigate()
  const { patientData, schedule, memories, completedGames } = useData()

  const totalGamesPlayed = gameStats.reduce((acc, g) => acc + g.played, 0)
  const avgScore = Math.round(gameStats.reduce((acc, g) => acc + g.best, 0) / gameStats.length)

  return (
    <div className="min-h-screen bg-mesh pb-24">
      {/* Header */}
      <div className="glass shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </motion.button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                  <Brain size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">Caregiver Dashboard</h1>
                  <p className="text-xs text-gray-400">Monitor patient progress</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => navigate('/patient')}
              className="px-4 py-2 rounded-xl bg-primary-50 text-primary-600 font-medium text-sm hover:bg-primary-100 transition-colors"
            >
              Patient View
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Patient Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-primary-50 to-teal-50 border-primary-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-primary-500/20">
                {(patientData.name || 'P')[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">{patientData.name || 'Patient Name'}</h2>
                <p className="text-gray-500">
                  Age {patientData.age || '—'} · {patientData.gender || '—'} · {patientData.language || 'English'}
                </p>
              </div>
              <div className="flex gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold gradient-text">{totalGamesPlayed}</div>
                  <div className="text-xs text-gray-400">Games Played</div>
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text">{avgScore}%</div>
                  <div className="text-xs text-gray-400">Avg Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold gradient-text">{memories.length}</div>
                  <div className="text-xs text-gray-400">Memories</div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Weekly Progress Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-primary-500" />
                  <h3 className="font-semibold text-gray-900">Weekly Activity</h3>
                </div>
                <span className="text-xs text-gray-400">This week</span>
              </div>
              <div className="flex items-end gap-3 h-40">
                {weeklyData.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-gray-500">{day.score}</span>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(day.score / 100) * 100}%` }}
                      transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-primary-500 to-teal-400 min-h-[4px]"
                    />
                    <span className="text-xs text-gray-400">{day.day}</span>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Today's Schedule */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <div className="flex items-center gap-2 mb-4">
                <Clock size={18} className="text-amber-500" />
                <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
              </div>
              <div className="space-y-3">
                {schedule.slice(0, 5).map((reminder) => {
                  const TypeIcon = typeIcons[reminder.type] || Bell
                  return (
                    <div key={reminder.id} className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                        <TypeIcon size={14} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-700 truncate">{reminder.title}</div>
                      </div>
                      <span className="text-xs text-gray-400 flex-shrink-0">{reminder.time}</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Game Performance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <Gamepad2 size={18} className="text-teal-500" />
                <h3 className="font-semibold text-gray-900">Game Performance</h3>
              </div>
              <div className="space-y-3">
                {gameStats.map((game, i) => {
                  const Icon = game.icon
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${game.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={14} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{game.name}</span>
                          <span className="text-xs text-gray-400">{game.played} plays</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${game.color}`}
                            style={{ width: `${game.best}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-gray-500">{game.best}%</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp size={18} className="text-rose-500" />
                <h3 className="font-semibold text-gray-900">Recent Activity</h3>
              </div>
              <div className="space-y-3">
                {recentActivity.map((activity) => {
                  const Icon = activity.icon
                  return (
                    <div key={activity.id} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg ${activity.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon size={14} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-700 truncate">{activity.action}</div>
                        <div className="text-xs text-gray-400">{activity.time}</div>
                      </div>
                      {activity.score && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                          +{activity.score} pts
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Memory Vault Quick View */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Camera size={18} className="text-pink-500" />
                <h3 className="font-semibold text-gray-900">Memory Vault</h3>
                <span className="text-xs text-gray-400">({memories.length} memories)</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {memories.map((memory) => (
                <div key={memory.id} className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${memory.color} flex items-center justify-center text-sm shadow-sm`}>
                    {memory.emoji}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">{memory.name}</div>
                    <div className="text-xs text-gray-400">{memory.relationship}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
