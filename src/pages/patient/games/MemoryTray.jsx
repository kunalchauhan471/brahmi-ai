import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Eye, EyeOff, Check, Trophy, RotateCcw, LayoutGrid
} from 'lucide-react'
import { useLanguage } from '../../../i18n/LanguageContext'

const allObjects = [
  { id: 1, emoji: '🔑', name: 'Key' },
  { id: 2, emoji: '📚', name: 'Book' },
  { id: 3, emoji: '☕', name: 'Cup' },
  { id: 4, emoji: '🧸', name: 'Teddy' },
  { id: 5, emoji: '🌸', name: 'Flower' },
  { id: 6, emoji: '🎵', name: 'Music' },
  { id: 7, emoji: '📷', name: 'Camera' },
  { id: 8, emoji: '🧣', name: 'Scarf' },
  { id: 9, emoji: '🪴', name: 'Plant' },
  { id: 10, emoji: '⌚', name: 'Watch' },
  { id: 11, emoji: '🎒', name: 'Bag' },
  { id: 12, emoji: '🕶️', name: 'Glasses' },
]

export default function MemoryTray() {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [gameState, setGameState] = useState('setup') // setup, showing, hiding, selecting, result
  const [roundObjects, setRoundObjects] = useState([])
  const [selectedObjects, setSelectedObjects] = useState([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(1)
  const [totalRounds] = useState(3)
  const [showCount, setShowCount] = useState(0)
  const [countdown, setCountdown] = useState(5)

  const startGame = useCallback(() => {
    const shuffled = [...allObjects].sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, 4 + Math.floor(Math.random() * 2))
    setRoundObjects(selected)
    setSelectedObjects([])
    setGameState('showing')
    setCountdown(5)

    // Countdown
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setGameState('hiding')
          setTimeout(() => setGameState('selecting'), 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleSelectObject = (obj) => {
    if (gameState !== 'selecting') return

    setSelectedObjects(prev => {
      const exists = prev.find(o => o.id === obj.id)
      if (exists) return prev.filter(o => o.id !== obj.id)
      return [...prev, obj]
    })
  }

  const handleSubmit = () => {
    const correct = roundObjects.filter(obj =>
      selectedObjects.some(sel => sel.id === obj.id)
    ).length
    const points = correct * 10
    setScore(prev => prev + points)
    setGameState('result')

    setTimeout(() => {
      if (round < totalRounds) {
        setRound(prev => prev + 1)
        startGame()
      } else {
        setGameState('gameover')
      }
    }, 2500)
  }

  const correctInRound = roundObjects.filter(obj =>
    selectedObjects.some(sel => sel.id === obj.id)
  ).length

  return (
    <div className="min-h-screen bg-mesh pb-24">
      {/* Header */}
      <div className="glass shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/games')}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </motion.button>
              <h1 className="text-lg font-bold text-gray-900">{t('games.memoryTray.name')}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Round {round}/{totalRounds}</span>
              <div className="px-3 py-1 rounded-lg bg-teal-50 text-teal-600 font-semibold text-sm">{score} pts</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Setup */}
        {gameState === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/25">
              <LayoutGrid size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('games.memoryTray.name')}</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {t('games.memoryTray.description')}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startGame}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-xl shadow-emerald-500/25"
            >
              {t('common.startGame')}
            </motion.button>
          </motion.div>
        )}

        {/* Showing Objects */}
        {gameState === 'showing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-2 mb-6 text-emerald-600">
              <Eye size={20} />
              <span className="text-lg font-semibold">{t('games.memoryTray.memorize')}</span>
            </div>
            <div className="text-3xl font-bold text-primary-500 mb-8">{countdown}</div>
            <div className="grid grid-cols-3 gap-4">
              {roundObjects.map((obj, i) => (
                <motion.div
                  key={obj.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-2xl bg-white border-2 border-emerald-200 shadow-lg"
                >
                  <div className="text-3xl mb-2">{obj.emoji}</div>
                  <div className="text-sm font-medium text-gray-600">{obj.name}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Hiding */}
        {gameState === 'hiding' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <EyeOff size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 font-semibold">{t('games.memoryTray.hideEyes')}</p>
          </motion.div>
        )}

        {/* Selecting */}
        {gameState === 'selecting' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('games.memoryTray.whichObjects')}</h2>
              <p className="text-gray-500">{t('games.memoryTray.tapObjects')}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {allObjects.map((obj, i) => {
                const isSelected = selectedObjects.some(o => o.id === obj.id)

                return (
                  <motion.button
                    key={obj.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelectObject(obj)}
                    className={`
                      p-4 rounded-2xl border-2 transition-all
                      ${isSelected
                        ? 'bg-primary-50 border-primary-500 shadow-lg shadow-primary-500/20'
                        : 'bg-white border-gray-100 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="text-4xl mb-1">{obj.emoji}</div>
                    <div className="text-xs font-medium text-gray-500">{obj.name}</div>
                  </motion.button>
                )
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              disabled={selectedObjects.length === 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg shadow-lg shadow-emerald-500/25 disabled:opacity-50"
            >
              {t('games.memoryTray.submit', { count: selectedObjects.length })}
            </motion.button>
          </motion.div>
        )}

        {/* Result */}
        {gameState === 'result' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Check size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('games.memoryTray.roundComplete', { round })}</h2>
            <p className="text-gray-500 mb-4">
              You remembered <span className="font-bold text-emerald-600">{correctInRound}</span> out of{' '}
              <span className="font-bold">{roundObjects.length}</span> objects
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-600 font-bold">
              +{correctInRound * 10} points
            </div>
          </motion.div>
        )}

        {/* Game Over */}
        {gameState === 'gameover' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/25">
              <Trophy size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('games.memoryTray.greatMemory')}</h2>
            <p className="text-gray-500 mb-6">{t('games.memoryTray.completedAll')}</p>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-50 to-teal-50 border border-primary-100 mb-8">
              <span className="text-3xl font-bold gradient-text">{score}</span>
              <span className="text-gray-500">total points</span>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setGameState('setup'); setScore(0); setRound(1) }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold"
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
        )}
      </div>
    </div>
  )
}
