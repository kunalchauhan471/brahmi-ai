import { useState } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Check, Trophy, RotateCcw, ListOrdered,
  GripVertical, Sun, Brush, Coffee, Pill, Footprints, Moon, Bed
} from 'lucide-react'
import { useLanguage } from '../../../i18n/LanguageContext'

const routineItems = [
  { id: 1, label: 'Wake Up', icon: Sun, emoji: '🌅', color: 'from-amber-400 to-orange-500' },
  { id: 2, label: 'Brush Teeth', icon: Brush, emoji: '🪥', color: 'from-blue-400 to-blue-600' },
  { id: 3, label: 'Breakfast', icon: Coffee, emoji: '🥣', color: 'from-amber-500 to-yellow-500' },
  { id: 4, label: 'Morning Medicine', icon: Pill, emoji: '💊', color: 'from-red-400 to-red-600' },
  { id: 5, label: 'Morning Walk', icon: Footprints, emoji: '🚶', color: 'from-green-400 to-emerald-600' },
  { id: 6, label: 'Lunch', icon: Coffee, emoji: '🍛', color: 'from-orange-400 to-red-500' },
  { id: 7, label: 'Evening Tea', icon: Coffee, emoji: '☕', color: 'from-teal-400 to-cyan-600' },
  { id: 8, label: 'Sleep', icon: Bed, emoji: '😴', color: 'from-indigo-400 to-purple-600' },
]

export default function RoutineSequencer() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [gameState, setGameState] = useState('setup')
  const [items, setItems] = useState([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [totalRounds] = useState(3)
  const [result, setResult] = useState(null)

  const startRound = () => {
    const subset = [...routineItems]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .sort(() => Math.random() - 0.5) // shuffle for display
    setItems(subset)
    setResult(null)
    setGameState('playing')
  }

  const startGame = () => {
    setScore(0)
    setRound(1)
    setGameState('playing')
    startRound()
  }

  const checkOrder = () => {
    const correctOrder = items
      .map(item => routineItems.find(r => r.id === item.id))
      .sort((a, b) => a.id - b.id)
      .map(r => r.id)

    const userOrder = items.map(item => item.id)

    const correctCount = correctOrder.reduce((acc, id, i) => {
      return acc + (userOrder[i] === id ? 1 : 0)
    }, 0)

    const points = correctCount * 20
    setScore(prev => prev + points)
    setResult({
      correct: correctCount === items.length,
      count: correctCount,
      total: items.length,
      points,
    })
  }

  if (gameState === 'setup') {
    return (
      <div className="min-h-screen bg-mesh pb-24">
        <div className="glass shadow-sm sticky top-0 z-40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/games')}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </motion.button>
            <h1 className="text-xl font-bold text-gray-900">{t('games.routineSequencer.name')}</h1>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/25">
              <ListOrdered size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('games.routineSequencer.name')}</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {t('games.routineSequencer.instructions')}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startGame}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-xl shadow-amber-500/25"
            >
              {t('common.startGame')}
            </motion.button>
          </motion.div>
        </div>
      </div>
    )
  }

  if (gameState === 'gameover') {
    return (
      <div className="min-h-screen bg-mesh pb-24">
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/25">
              <Trophy size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('games.routineSequencer.greatSequencing')}</h2>
            <p className="text-gray-500 mb-6">{t('games.routineSequencer.knowRoutine')}</p>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-50 to-teal-50 border border-primary-100 mb-8">
              <span className="text-3xl font-bold gradient-text">{score}</span>
              <span className="text-gray-500">total points</span>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold"
              >
                <RotateCcw size={16} className="inline mr-2" />
                Play Again
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/games')}
                className="flex-1 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold"
              >
                Back to Games
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-mesh pb-24">
      <div className="glass shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setGameState('setup')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </motion.button>
              <h1 className="text-lg font-bold text-gray-900">Routine Sequencer</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Round {round}/{totalRounds}</span>
              <div className="px-3 py-1 rounded-lg bg-amber-50 text-amber-600 font-semibold text-sm">{score} pts</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{t('games.routineSequencer.putOrder')}</h2>
          <p className="text-sm text-gray-500">{t('games.routineSequencer.tapSwap')}</p>
        </div>

        {/* Result overlay */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg text-center"
            >
              {result.correct ? (
                <>
                  <Check size={32} className="text-emerald-500 mx-auto mb-2" />
                  <p className="text-lg font-bold text-emerald-600">{t('games.routineSequencer.perfectOrder')}</p>
                </>
              ) : (
                <p className="text-lg font-semibold text-gray-700">
                  {result.count}/{result.total} in correct position
                </p>
              )}
              <p className="text-sm text-gray-400 mt-1">+{result.points} points</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Draggable list */}
        <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
          {items.map((item, index) => {
            const ItemIcon = item.icon || Sun
            return (
              <Reorder.Item key={item.id} value={item}>
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  className={`flex items-center gap-4 p-4 rounded-xl bg-white border shadow-sm cursor-grab active:cursor-grabbing ${
                    result ? 'border-gray-100' : 'border-gray-100 hover:border-amber-200'
                  }`}
                >
                  <GripVertical size={18} className="text-gray-300 flex-shrink-0" />
                  <span className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-500 flex-shrink-0">
                    {index + 1}
                  </span>
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <span className="text-lg">{item.emoji}</span>
                  </div>
                  <span className="font-semibold text-gray-900">{item.label}</span>
                </motion.div>
              </Reorder.Item>
            )
          })}
        </Reorder.Group>

        <div className="mt-6 space-y-3">
          {!result ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={checkOrder}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-lg shadow-amber-500/25"
            >
              {t('games.routineSequencer.checkOrder')}
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (round < totalRounds) {
                  setRound(prev => prev + 1)
                  startRound()
                } else {
                  setGameState('gameover')
                }
              }}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg shadow-lg shadow-amber-500/25"
            >
              {round < totalRounds ? t('games.routineSequencer.nextRound') : t('games.routineSequencer.seeResults')}
            </motion.button>
          )}
        </div>
      </div>
    </div>
  )
}
