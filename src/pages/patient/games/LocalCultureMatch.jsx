import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Trophy, RotateCcw, Heart, Star } from 'lucide-react'

const allPairs = [
  { id: 1, emoji: '👨', label: 'Father' },
  { id: 2, emoji: '👩', label: 'Mother' },
  { id: 3, emoji: '👦', label: 'Son' },
  { id: 4, emoji: '👧', label: 'Daughter' },
  { id: 5, emoji: '👴', label: 'Grandpa' },
  { id: 6, emoji: '👵', label: 'Grandma' },
  { id: 7, emoji: '🪔', label: 'Diya' },
  { id: 8, emoji: '🕌', label: 'Temple' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function LocalCultureMatch() {
  const navigate = useNavigate()
  const [gameState, setGameState] = useState('setup')
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [isChecking, setIsChecking] = useState(false)

  const startGame = useCallback(() => {
    const selectedPairs = shuffle(allPairs).slice(0, 6)
    const deck = shuffle(
      selectedPairs.flatMap(pair => [
        { ...pair, cardId: pair.id + '-a' },
        { ...pair, cardId: pair.id + '-b' },
      ])
    )
    setCards(deck)
    setFlipped([])
    setMatched([])
    setScore(0)
    setMoves(0)
    setGameState('playing')
  }, [])

  const handleFlip = (index) => {
    if (isChecking) return
    if (flipped.includes(index)) return
    if (matched.includes(cards[index].id)) return
    if (flipped.length >= 2) return

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setIsChecking(true)
      setMoves(prev => prev + 1)
      const [first, second] = newFlipped

      if (cards[first].id === cards[second].id) {
        // Match found
        setTimeout(() => {
          setMatched(prev => [...prev, cards[first].id])
          setScore(prev => prev + 20)
          setFlipped([])
          setIsChecking(false)
        }, 500)
      } else {
        // No match
        setTimeout(() => {
          setFlipped([])
          setIsChecking(false)
        }, 900)
      }
    }
  }

  const isGameComplete = matched.length === allPairs.slice(0, 6).length

  useEffect(() => {
    if (isGameComplete && gameState === 'playing') {
      setTimeout(() => setGameState('gameover'), 800)
    }
  }, [isGameComplete, gameState])

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
            <h1 className="text-lg font-bold text-gray-900">Pair Matcher</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-cyan-500/25">
              <Heart size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Pair Matcher</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Flip the cards and find matching pairs! Remember where each card is to match them all.
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="px-4 py-2 rounded-xl bg-cyan-50 text-cyan-600 text-sm font-medium">
                6 pairs to find
              </div>
              <div className="px-4 py-2 rounded-xl bg-primary-50 text-primary-600 text-sm font-medium">
                Fewest moves wins
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startGame}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-lg shadow-xl shadow-cyan-500/25"
            >
              Start Game
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">All Pairs Found!</h2>
            <p className="text-gray-500 mb-2">Great memory and matching skills!</p>
            <p className="text-sm text-gray-400 mb-6">Completed in {moves} moves</p>
            <div className="flex justify-center gap-6 mb-8">
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">{score}</div>
                <div className="text-xs text-gray-400">Points</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">{moves}</div>
                <div className="text-xs text-gray-400">Moves</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold gradient-text">
                  {moves <= 12 ? '⭐⭐⭐' : moves <= 18 ? '⭐⭐' : '⭐'}
                </div>
                <div className="text-xs text-gray-400">Rating</div>
              </div>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold"
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
              <h1 className="text-lg font-bold text-gray-900">Pair Matcher</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">{matched.length}/6 pairs</span>
              <div className="px-3 py-1 rounded-lg bg-cyan-50 text-cyan-600 font-semibold text-sm">{score} pts</div>
            </div>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${(matched.length / 6) * 100}%` }}
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
            />
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Stats */}
        <div className="flex justify-center gap-6 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{moves}</div>
            <div className="text-xs text-gray-400">Moves</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{matched.length}/6</div>
            <div className="text-xs text-gray-400">Pairs</div>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {cards.map((card, index) => {
            const isFlipped = flipped.includes(index) || matched.includes(card.cardId) || matched.includes(card.id)
            const isMatched = matched.includes(card.id)

            return (
              <motion.button
                key={card.cardId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                whileHover={!isFlipped ? { scale: 1.05 } : {}}
                whileTap={!isFlipped ? { scale: 0.95 } : {}}
                onClick={() => handleFlip(index)}
                className={`
                  aspect-square rounded-2xl border-2 transition-all duration-300 flex items-center justify-center
                  ${isMatched
                    ? 'bg-emerald-50 border-emerald-400 shadow-md'
                    : isFlipped
                      ? 'bg-white border-primary-300 shadow-lg'
                      : 'bg-gradient-to-br from-primary-500 to-teal-500 border-primary-400 shadow-md hover:shadow-lg'
                  }
                `}
              >
                <AnimatePresence mode="wait">
                  {isFlipped ? (
                    <motion.div
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center"
                    >
                      <span className="text-3xl">{card.emoji}</span>
                      <span className="text-[10px] text-gray-500 mt-1">{card.label}</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ rotateY: -90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                        <span className="text-xl text-white font-bold">?</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
