import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, Check, X, Trophy, RotateCcw } from 'lucide-react'

const scenes = [
  {
    id: 1,
    title: 'Morning Kitchen',
    left: [
      { emoji: '☀️', label: 'Sun', x: 50, y: 8 },
      { emoji: '🪟', label: 'Window', x: 15, y: 15 },
      { emoji: '🪟', label: 'Window', x: 85, y: 15 },
      { emoji: '☕', label: 'Kettle', x: 25, y: 40 },
      { emoji: '🍳', label: 'Pan', x: 50, y: 40 },
      { emoji: '🥣', label: 'Bowl', x: 75, y: 40 },
      { emoji: '🍞', label: 'Bread', x: 25, y: 70 },
      { emoji: '🥛', label: 'Milk', x: 50, y: 70 },
      { emoji: '🍎', label: 'Fruit', x: 75, y: 70 },
    ],
    missing: { emoji: '🍳', label: 'Pan', x: 50, y: 40 },
    right: [
      { emoji: '☀️', label: 'Sun', x: 50, y: 8 },
      { emoji: '🪟', label: 'Window', x: 15, y: 15 },
      { emoji: '🪟', label: 'Window', x: 85, y: 15 },
      { emoji: '☕', label: 'Kettle', x: 25, y: 40 },
      { emoji: '🥣', label: 'Bowl', x: 75, y: 40 },
      { emoji: '🍞', label: 'Bread', x: 25, y: 70 },
      { emoji: '🥛', label: 'Milk', x: 50, y: 70 },
      { emoji: '🍎', label: 'Fruit', x: 75, y: 70 },
    ],
    options: ['🍳 Pan', '☕ Kettle', '🍞 Bread'],
  },
  {
    id: 2,
    title: 'Garden Scene',
    left: [
      { emoji: '🌳', label: 'Tree', x: 20, y: 20 },
      { emoji: '🌺', label: 'Flowers', x: 50, y: 50 },
      { emoji: '🦋', label: 'Butterfly', x: 75, y: 25 },
      { emoji: '🐦', label: 'Bird', x: 35, y: 10 },
      { emoji: '🪑', label: 'Chair', x: 80, y: 65 },
      { emoji: '💧', label: 'Watering Can', x: 50, y: 75 },
      { emoji: '🌻', label: 'Sunflower', x: 15, y: 55 },
      { emoji: '🐱', label: 'Cat', x: 65, y: 70 },
    ],
    missing: { emoji: '🦋', label: 'Butterfly', x: 75, y: 25 },
    right: [
      { emoji: '🌳', label: 'Tree', x: 20, y: 20 },
      { emoji: '🌺', label: 'Flowers', x: 50, y: 50 },
      { emoji: '🐦', label: 'Bird', x: 35, y: 10 },
      { emoji: '🪑', label: 'Chair', x: 80, y: 65 },
      { emoji: '💧', label: 'Watering Can', x: 50, y: 75 },
      { emoji: '🌻', label: 'Sunflower', x: 15, y: 55 },
      { emoji: '🐱', label: 'Cat', x: 65, y: 70 },
    ],
    options: ['🐦 Bird', '🌺 Flowers', '🦋 Butterfly'],
  },
  {
    id: 3,
    title: 'Living Room',
    left: [
      { emoji: '🛋️', label: 'Sofa', x: 25, y: 50 },
      { emoji: '📺', label: 'TV', x: 70, y: 20 },
      { emoji: '🖼️', label: 'Frame', x: 70, y: 8 },
      { emoji: '🪴', label: 'Plant', x: 15, y: 20 },
      { emoji: '🕯️', label: 'Candle', x: 85, y: 65 },
      { emoji: '📚', label: 'Books', x: 50, y: 65 },
      { emoji: '🕐', label: 'Clock', x: 40, y: 10 },
      { emoji: '🧸', label: 'Teddy', x: 35, y: 70 },
    ],
    missing: { emoji: '🕯️', label: 'Candle', x: 85, y: 65 },
    right: [
      { emoji: '🛋️', label: 'Sofa', x: 25, y: 50 },
      { emoji: '📺', label: 'TV', x: 70, y: 20 },
      { emoji: '🖼️', label: 'Frame', x: 70, y: 8 },
      { emoji: '🪴', label: 'Plant', x: 15, y: 20 },
      { emoji: '📚', label: 'Books', x: 50, y: 65 },
      { emoji: '🕐', label: 'Clock', x: 40, y: 10 },
      { emoji: '🧸', label: 'Teddy', x: 35, y: 70 },
    ],
    options: ['📚 Books', '🪴 Plant', '🕯️ Candle'],
  },
]

function SceneDisplay({ items, highlight }) {
  return (
    <div className="relative w-full aspect-square rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 overflow-hidden">
      {items.map((item, i) => (
        <motion.div
          key={`${item.label}-${i}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06 }}
          className="absolute flex flex-col items-center"
          style={{ left: `${item.x}%`, top: `${item.y}%`, transform: 'translate(-50%, -50%)' }}
        >
          <span className="text-2xl">{item.emoji}</span>
          <span className="text-[10px] text-gray-500 mt-0.5 whitespace-nowrap">{item.label}</span>
        </motion.div>
      ))}
      {highlight && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute w-10 h-10 rounded-full border-2 border-red-500 bg-red-500/10"
          style={{ left: `${highlight.x}%`, top: `${highlight.y}%`, transform: 'translate(-50%, -50%)' }}
        />
      )}
    </div>
  )
}

export default function WhatChanged() {
  const navigate = useNavigate()
  const [gameState, setGameState] = useState('setup')
  const [round, setRound] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [feedback, setFeedback] = useState(null)

  const scene = scenes[round]

  const startGame = () => {
    setRound(0)
    setScore(0)
    setSelected(null)
    setFeedback(null)
    setGameState('playing')
  }

  const handleSelect = (option) => {
    if (selected !== null) return
    setSelected(option)
    const correct = option === `${scene.missing.emoji} ${scene.missing.label}`
    setFeedback(correct ? 'correct' : 'wrong')
    if (correct) setScore(prev => prev + 25)

    setTimeout(() => {
      if (round < scenes.length - 1) {
        setRound(prev => prev + 1)
        setSelected(null)
        setFeedback(null)
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
            <h1 className="text-lg font-bold text-gray-900">Spot the Difference</h1>
          </div>
        </div>
        <div className="max-w-lg mx-auto px-4 py-12 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-6 shadow-xl shadow-violet-500/25">
              <Eye size={36} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Spot the Difference</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              Compare two scenes side by side. One item is missing from the right scene — can you find it?
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startGame}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold text-lg shadow-xl shadow-violet-500/25"
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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Sharp Observer!</h2>
            <p className="text-gray-500 mb-6">You spotted all the differences!</p>
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-primary-50 to-teal-50 border border-primary-100 mb-8">
              <span className="text-3xl font-bold gradient-text">{score}</span>
              <span className="text-gray-500">total points</span>
            </div>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startGame}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold"
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
              <h1 className="text-lg font-bold text-gray-900">Spot the Difference</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">Scene {round + 1}/{scenes.length}</span>
              <div className="px-3 py-1 rounded-lg bg-violet-50 text-violet-600 font-semibold text-sm">{score} pts</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={round}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{scene.title}</h2>
              <p className="text-sm text-gray-500">Compare the two scenes — what's missing on the right?</p>
            </div>

            {/* Side-by-side scenes */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="text-center text-sm font-medium text-gray-500 mb-2">Original</div>
                <SceneDisplay items={scene.left} />
              </div>
              <div>
                <div className="text-center text-sm font-medium text-gray-500 mb-2">Changed</div>
                <SceneDisplay
                  items={scene.right}
                  highlight={feedback === 'correct' ? scene.missing : null}
                />
              </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-3 gap-3">
              {scene.options.map((option, i) => {
                const isSelected = selected === option
                const isCorrect = option === `${scene.missing.emoji} ${scene.missing.label}`

                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={!selected ? { scale: 1.03 } : {}}
                    whileTap={!selected ? { scale: 0.98 } : {}}
                    onClick={() => handleSelect(option)}
                    disabled={selected !== null}
                    className={`
                      p-3 rounded-xl font-medium text-sm border-2 transition-all text-center
                      ${isSelected && isCorrect
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                        : isSelected && !isCorrect
                          ? 'bg-red-50 border-red-500 text-red-700'
                          : isCorrect && feedback
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                            : 'bg-white border-gray-100 text-gray-700 hover:border-violet-300'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {(isSelected || (isCorrect && feedback)) && (
                        isCorrect ? <Check size={16} /> : <X size={16} />
                      )}
                      {option}
                    </div>
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
