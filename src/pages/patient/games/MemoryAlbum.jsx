import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Brain, ArrowLeft, ArrowRight, Check, X, Star,
  Trophy, RotateCcw, Camera, Heart
} from 'lucide-react'
import { useData } from '../../../context/DataContext'
import { useLanguage } from '../../../i18n/LanguageContext'
import MemoryPhoto from '../../../components/ui/MemoryPhoto'

const difficulties = [
  { level: 'Easy', key: 'easy', options: 2, label: '2 choices' },
  { level: 'Medium', key: 'medium', options: 4, label: '4 choices' },
  { level: 'Hard', key: 'hard', options: 0, label: 'No choices' },
]

export default function MemoryAlbum() {
  const navigate = useNavigate()
  const { memories, completeGame, completedGames } = useData()
  const { t } = useLanguage()
  const [difficulty, setDifficulty] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [gameOver, setGameOver] = useState(false)
  const [questions, setQuestions] = useState([])

  const startGame = (diff) => {
    setDifficulty(diff)
    const shuffled = [...memories].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.map(memory => {
      const otherNames = memories
        .filter(m => m.id !== memory.id)
        .map(m => m.name)
      const wrongOptions = otherNames.sort(() => Math.random() - 0.5).slice(0, diff.options - 1)
      const options = [...wrongOptions, memory.name].sort(() => Math.random() - 0.5)
      return { ...memory, options }
    }))
    setCurrentQuestion(0)
    setScore(0)
    setGameOver(false)
  }

  const handleAnswer = (answer) => {
    if (selectedAnswer !== null) return
    setSelectedAnswer(answer)
    const correct = answer === questions[currentQuestion].name
    setIsCorrect(correct)
    if (correct) setScore(prev => prev + 10)

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
      } else {
        setGameOver(true)
      }
    }, 1200)
  }

  const handleHardSubmit = (answer) => {
    handleAnswer(answer)
  }

  // Difficulty selection
  if (!difficulty) {
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
            <h1 className="text-xl font-bold text-gray-900">{t('games.memoryAlbum.name')}</h1>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-blue-500/25">
              <Camera size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('games.memoryAlbum.name')}</h2>
            <p className="text-gray-500">{t('games.memoryAlbum.difficultyDesc')}</p>
          </motion.div>

          <div className="space-y-4">
            {difficulties.map((diff, i) => (
              <motion.button
                key={diff.level}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => startGame(diff)}
                className="w-full p-5 rounded-2xl bg-white border border-gray-100 shadow-card hover:shadow-card-hover text-left flex items-center gap-4 transition-all"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                  i === 0 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600' :
                  i === 1 ? 'bg-gradient-to-br from-amber-400 to-orange-500' :
                  'bg-gradient-to-br from-red-400 to-red-600'
                }`}>
                  {diff.options || '?'}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{t(`games.memoryAlbum.${diff.key}`)}</h3>
                  <p className="text-sm text-gray-400">{t(`games.memoryAlbum.${diff.key}Label`)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Game Over
  if (gameOver) {
    return (
      <div className="min-h-screen bg-mesh pb-24">
        <div className="max-w-lg mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/25">
              <Trophy size={40} className="text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">{t('games.memoryAlbum.wellDone')}</h2>
            <p className="text-gray-500 mb-6">{t('games.memoryAlbum.completedMsg')}</p>

            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-50 to-teal-50 border border-primary-100 mb-8">
              <Star size={24} className="text-amber-400 fill-amber-400" />
              <span className="text-2xl font-bold gradient-text">{score}</span>
              <span className="text-gray-500">points</span>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setDifficulty(null); completeGame(1, score) }}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold shadow-lg shadow-primary-500/25"
              >
                <RotateCcw size={18} className="inline mr-2" />
                {t('common.playAgain')}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { completeGame(1, score); navigate('/games') }}
                className="flex-1 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold"
              >
                {t('common.backToGames')}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Game Play
  const question = questions[currentQuestion]
  if (!question) return null

  return (
    <div className="min-h-screen bg-mesh pb-24">
      <div className="glass shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setDifficulty(null) }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </motion.button>
              <h1 className="text-lg font-bold text-gray-900">Memory Album</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-500">
                {currentQuestion + 1} / {questions.length}
              </div>
              <div className="px-3 py-1 rounded-lg bg-primary-50 text-primary-600 font-semibold text-sm">
                {score} pts
              </div>
            </div>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-primary-500 to-teal-500 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            {/* Photo Display — shows uploaded photo if present */}
            <MemoryPhoto
              memory={question}
              className="w-40 h-40 rounded-3xl mx-auto mb-6 shadow-xl"
              emojiClassName="text-5xl"
            />

            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('games.memoryAlbum.whoIs')}</h2>
            <p className="text-gray-400 mb-8">{t('games.memoryAlbum.tapCorrect')}</p>

            {/* Options (Easy/Medium) */}
            {difficulty.options > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {question.options.map((option, i) => {
                  const isSelected = selectedAnswer === option
                  const isCorrectAnswer = option === question.name

                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={!selectedAnswer ? { scale: 1.03 } : {}}
                      whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                      onClick={() => handleAnswer(option)}
                      disabled={selectedAnswer !== null}
                      className={`
                        p-4 rounded-2xl font-semibold text-lg transition-all border-2
                        ${isSelected && isCorrectAnswer
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-lg shadow-emerald-500/20'
                          : isSelected && !isCorrectAnswer
                            ? 'bg-red-50 border-red-500 text-red-700 shadow-lg shadow-red-500/20'
                            : isCorrectAnswer && selectedAnswer
                              ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                              : 'bg-white border-gray-100 text-gray-700 hover:border-primary-300 hover:shadow-sm'
                        }
                      `}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isSelected && isCorrectAnswer && <Check size={20} />}
                        {isSelected && !isCorrectAnswer && <X size={20} />}
                        {option}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            )}

            {/* No options (Hard) */}
            {difficulty.options === 0 && (
              <div>
                <p className="text-gray-500 mb-4">Type the name from memory:</p>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter the name..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleHardSubmit(e.target.value.trim())
                      }
                    }}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 text-lg focus:outline-none focus:border-primary-400 transition-colors"
                  />
                  <button
                    onClick={(e) => {
                      const input = e.target.closest('div').querySelector('input')
                      if (input.value.trim()) handleHardSubmit(input.value.trim())
                    }}
                    className="px-6 py-3 rounded-xl bg-primary-500 text-white font-semibold"
                  >
                    Check
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
