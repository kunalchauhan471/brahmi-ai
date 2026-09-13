import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ── Gradient palettes that cycle on each click ── */
const gradients = [
  'radial-gradient(ellipse at 20% 50%, rgba(14,165,233,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(20,184,166,0.06) 0%, transparent 50%)',
  'radial-gradient(ellipse at 70% 60%, rgba(99,102,241,0.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(236,72,153,0.06) 0%, transparent 50%)',
  'radial-gradient(ellipse at 50% 30%, rgba(16,185,129,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.06) 0%, transparent 50%)',
  'radial-gradient(ellipse at 30% 70%, rgba(249,115,22,0.07) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(14,165,233,0.06) 0%, transparent 50%)',
  'radial-gradient(ellipse at 60% 40%, rgba(168,85,247,0.08) 0%, transparent 60%), radial-gradient(ellipse at 30% 90%, rgba(20,184,166,0.06) 0%, transparent 50%)',
]

/* ── Click Ripple ── */
function ClickRipple({ x, y, id }) {
  return (
    <motion.div
      key={id}
      initial={{ scale: 0, opacity: 0.6 }}
      animate={{ scale: 4, opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="absolute pointer-events-none rounded-full border-2 border-primary-400/30"
      style={{ left: x - 30, top: y - 30, width: 60, height: 60 }}
    />
  )
}

/* ── Particle Burst ── */
function ParticleBurst({ x, y, id }) {
  const particles = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2
    const distance = 40 + Math.random() * 60
    return {
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 0.1,
      color: ['bg-primary-400', 'bg-teal-400', 'bg-primary-300', 'bg-teal-300'][i % 4],
    }
  })

  return (
    <>
      {particles.map((p, i) => (
        <motion.div
          key={`${id}-${i}`}
          initial={{ x, y, scale: 1, opacity: 0.8 }}
          animate={{ x: x + p.dx, y: y + p.dy, scale: 0, opacity: 0 }}
          transition={{ duration: 0.6, delay: p.delay, ease: 'easeOut' }}
          className={`absolute pointer-events-none rounded-full ${p.color}`}
          style={{ width: p.size, height: p.size }}
        />
      ))}
    </>
  )
}

/* ── Mouse Glow Orb ── */
function MouseGlow({ mousePos }) {
  return (
    <motion.div
      className="pointer-events-none fixed z-50 rounded-full mix-blend-screen"
      animate={{
        x: mousePos.x - 150,
        y: mousePos.y - 150,
      }}
      transition={{ type: 'spring', damping: 25, stiffness: 150, mass: 0.5 }}
      style={{
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(14,165,233,0.06) 0%, transparent 70%)',
      }}
    />
  )
}

/* ── Floating Sparkles (ambient) ── */
function FloatingSparkles() {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 3,
    duration: 4 + Math.random() * 6,
    delay: Math.random() * 5,
  }))

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {sparkles.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-primary-400/20"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{
            y: [-20, 20, -20],
            opacity: [0, 0.6, 0],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/* ── Exported wrapper ── */
export default function InteractiveBackground({ children }) {
  const [gradientIndex, setGradientIndex] = useState(0)
  const [clicks, setClicks] = useState([])
  const [mousePos, setMousePos] = useState({ x: -300, y: -300 })
  const containerRef = useRef(null)
  const idCounter = useRef(0)

  const handleClick = useCallback((e) => {
    // Only fire on clicks on the background, not on interactive elements
    if (e.target.closest('button, a, input, textarea, select')) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Cycle gradient
    setGradientIndex((prev) => (prev + 1) % gradients.length)

    // Add ripple + particles
    const id = ++idCounter.current
    setClicks((prev) => [...prev.slice(-12), { x, y, id }])
  }, [])

  // Track mouse for glow
  useEffect(() => {
    const handler = (e) => setMousePos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', handler, { passive: true })
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  // Cleanup old clicks
  useEffect(() => {
    if (clicks.length > 0) {
      const timer = setTimeout(() => {
        setClicks((prev) => prev.slice(1))
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [clicks])

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className="relative min-h-screen"
    >
      {/* Animated background gradient */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-0"
        animate={{
          backgroundImage: gradients[gradientIndex],
        }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
        style={{ background: gradients[gradientIndex] }}
      />

      {/* Floating sparkles */}
      <FloatingSparkles />

      {/* Mouse glow */}
      <MouseGlow mousePos={mousePos} />

      {/* Click effects */}
      <AnimatePresence>
        {clicks.map((c) => (
          <ClickRipple key={c.id} x={c.x} y={c.y} id={c.id} />
        ))}
        {clicks.map((c) => (
          <ParticleBurst key={`p-${c.id}`} x={c.x} y={c.y} id={c.id} />
        ))}
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}
