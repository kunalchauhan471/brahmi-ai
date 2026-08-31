import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Brain, ArrowLeft, Camera, LayoutGrid, Users,
  ListOrdered, Eye, Heart, Star, ArrowRight, Trophy
} from 'lucide-react'
import { useData } from '../../context/DataContext'
import { useLanguage } from '../../i18n/LanguageContext'
import Card from '../../components/ui/Card'

const gameIcons = {
  1: Camera,
  2: LayoutGrid,
  3: Users,
  4: ListOrdered,
  5: Eye,
  6: Heart,
}

const difficultyColors = {
  Easy: 'text-emerald-600 bg-emerald-50',
  Medium: 'text-amber-600 bg-amber-50',
  Hard: 'text-red-600 bg-red-50',
}

export default function GameDashboard() {
  const navigate = useNavigate()
  const { games, completedGames } = useData()
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-mesh pb-24">
      {/* Header */}
      <div className="glass shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/patient')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Brain size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('games.title')}</h1>
                <p className="text-sm text-gray-400">{t('games.chooseGame')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-gradient-to-r from-primary-50 to-teal-50 border-primary-100">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Trophy size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-gray-900">{t('games.yourProgress')}</h2>
                <p className="text-sm text-gray-500">
                  {t('games.completedOf', { done: Object.keys(completedGames).length, total: games.length })}
                </p>
              </div>
              <div className="text-3xl font-bold gradient-text">
                {Math.round((Object.keys(completedGames).length / games.length) * 100)}%
              </div>
            </div>
            <div className="mt-4 h-2 bg-primary-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(Object.keys(completedGames).length / games.length) * 100}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-primary-500 to-teal-500 rounded-full"
              />
            </div>
          </Card>
        </motion.div>

        {/* Game Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game, index) => {
            const Icon = gameIcons[game.id] || Brain
            const isCompleted = completedGames[game.id]

            return (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full flex flex-col">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4 shadow-lg`}>
                    <Icon size={28} className="text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2">{game.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 flex-1">{game.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${difficultyColors[game.difficulty]}`}>
                      {game.difficulty}
                    </span>
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-emerald-600">
                        <Star size={14} className="fill-emerald-400" />
                        <span className="text-xs font-medium">Completed</span>
                      </div>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="mb-4">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${game.color} transition-all duration-500`}
                        style={{ width: `${isCompleted ? 100 : game.progress}%` }}
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/games/${game.id}`)}
                    className={`
                      w-full py-3 rounded-xl font-semibold text-sm
                      flex items-center justify-center gap-2 transition-all
                      ${isCompleted
                        ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                        : `bg-gradient-to-r ${game.color} text-white shadow-md hover:shadow-lg`
                      }
                    `}
                  >
                    {isCompleted ? t('games.playAgain') : t('games.startGame')}
                    <ArrowRight size={16} />
                  </motion.button>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
