import { useState, useEffect, useRef } from 'react'
import { useInView } from 'framer-motion'

const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

export default function TextScramble({ text, className = '', as: Tag = 'span', delay = 0 }) {
  const [display, setDisplay] = useState('')
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const hasRun = useRef(false)

  useEffect(() => {
    if (!isInView || hasRun.current) return
    hasRun.current = true

    const timer = setTimeout(() => {
      let iteration = 0
      const interval = setInterval(() => {
        setDisplay(
          text
            .split('')
            .map((char, i) => {
              if (i < iteration) return text[i]
              if (char === ' ') return ' '
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
        )
        iteration += 1 / 2
        if (iteration >= text.length) {
          setDisplay(text)
          clearInterval(interval)
        }
      }, 30)
      return () => clearInterval(interval)
    }, delay)

    return () => clearTimeout(timer)
  }, [isInView, text, delay])

  return <Tag ref={ref} className={className}>{display || text}</Tag>
}
