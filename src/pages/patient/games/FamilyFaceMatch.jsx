import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Check, X, Trophy, RotateCcw, Users, Star
} from 'lucide-react'
import { useData } from '../../../context/DataContext'
import { useLanguage } from '../../../i18n/LanguageContext'

export default function FamilyFaceMatch() {
  const navigate = useNavigate()
  const { memories, completeGame } = useData()
  const { t } = useLanguage()
  const [gameState, setGameState] = useState('setup') // setup, playing, gameover
  const [currentTarget, setCurrentTarget] = useState(null)
  const [options, setOptions] = useState([])
  const [score, setScore] = useState(0)
  const [round, setRound] = useState(0)
  const [totalRounds] = useState(5)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [usedIds, setUsedIds] = useState([])

  const generateRound = useCallback(() => {
    // Pick a target that hasn't been used
    const available = memories.filter(m => !usedIds.includes(m.id))
    if (available.length === 0) {
      setGameState('gameover')
      return
    }

    const target = available[Math.floor(Math.random() * available.length)]
    setCurrentTarget(target)
    setUsedIds(prev => [...prev, target.id])

    // Generate 4 options including the correct one
    const others = memories.filter(m => m.id !== target.id)
    const shuffled = others.sort(() => Math.random() - 0.5).slice(0, 3)
    const allOptions = [...shuffled, target].sort(() => Math.random() - 0.5)
    setOptions(allOptions)
    setSelectedAnswer(null)
    setFeedback(null)
  }, [memories, usedIds])

  const startGame = () => {
    setGameState('playing')
    setScore(0)
    setRound(1)
    setUsedIds([])
    setTimeout(() => generateRound(), 100)
  }

  const handleSelect = (option) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(option.id)

    const correct = option.id === currentTarget.id
    setFeedback(correct ? 'correct' : 'wrong')
    if (correct) setScore(prev => prev + 20)

    setTimeout(() => {
      if (round < totalRounds) {
        setRound(prev => prev + 1)
        generateRound()
      } else {
        setGameState('gameover')
      }
    }, 1500)
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
            <h1 className="text-xl font-bold text-gray-900">{t('games.faceMatch.name')}</h1>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-rose-500/25">
              <Users size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('games.faceMatch.name')}</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {t('games.faceMatch.instructions')}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startGame}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg shadow-xl shadow-rose-500/25"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('games.faceMatch.amazing')}</h2>
            <p className="text-gray-500 mb-6">{t('games.faceMatch.betterAtFaces')}</p>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-50 to-teal-50 border border-primary-100 mb-8">
              <Star size={24} className="text-amber-400 fill-amber-400" />
              <span className="text-3xl font-bold gradient-text">{score}</span>
              <span className="text-gray-500">points</span>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold"
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
              <h1 className="text-lg font-bold text-gray-900">{t('games.faceMatch.shortName')}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Round {round}/{totalRounds}</span>
              <div className="px-3 py-1 rounded-lg bg-rose-50 text-rose-600 font-semibold text-sm">{score} pts</div>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(round / totalRounds) * 100}%` }}
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={round}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('games.faceMatch.findPerson', { name: currentTarget?.name })}
              </h2>
              <p className="text-gray-500">Tap the correct photo below</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {options.map((option, i) => {
                const isSelected = selectedAnswer === option.id
                const isCorrect = option.id === currentTarget?.id

                return (
                  <motion.button
                    key={option.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={!selectedAnswer ? { scale: 1.03 } : {}}
                    whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(option)}
                    disabled={selectedAnswer !== null}
                    className={`
                      p-6 rounded-2xl border-2 transition-all text-center
                      ${isSelected && isCorrect
                        ? 'bg-emerald-50 border-emerald-500 shadow-lg shadow-emerald-500/20'
                        : isSelected && !isCorrect
                          ? 'bg-red-50 border-red-500 shadow-lg shadow-red-500/20'
                          : isCorrect && feedback
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-white border-gray-100 hover:border-rose-200 hover:shadow-md'
                      }
                    `}
                  >
                    <div className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${option.color} flex items-center justify-center mx-auto mb-3 text-4xl shadow-md`}>
                      {option.emoji}
                    </div>
                    <div className="font-semibold text-gray-900 text-lg">{option.name}</div>
                    <div className="text-sm text-gray-400">{option.relationship}</div>
                    {isSelected && isCorrect && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                        <Check size={24} className="text-emerald-500 mx-auto" />
                      </motion.div>
                    )}
                    {isSelected && !isCorrect && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2">
                        <X size={24} className="text-red-500 mx-auto" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
