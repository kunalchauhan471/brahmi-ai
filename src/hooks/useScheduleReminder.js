import { useState, useEffect, useRef } from 'react'
import { getISTTotalMinutes, parseTimeToMinutes } from '../utils/timezone'

export default function useScheduleReminder(schedule, onReminder) {
  const [firedReminders, setFiredReminders] = useState(new Set())
  const hasCompletedFirstCycle = useRef(false)

  useEffect(() => {
    if (!schedule || schedule.length === 0) return

    const checkSchedule = () => {
      const currentMinutes = getISTTotalMinutes()

      schedule.forEach((reminder) => {
        if (firedReminders.has(reminder.id)) return

        const reminderMinutes = parseTimeToMinutes(reminder.time)
        if (reminderMinutes === null) return

        // Fire if within a 2-minute window of the scheduled time (IST)
        const diff = Math.abs(currentMinutes - reminderMinutes)
        if (diff <= 2) {
          setFiredReminders(prev => new Set([...prev, reminder.id]))
          onReminder?.(reminder)
        }
      })
    }

    // First cycle: mark as done but DON'T fire any reminders
    // This prevents Sakshi from auto-opening when the page loads
    const initTimeout = setTimeout(() => {
      hasCompletedFirstCycle.current = true

      // Now start periodic checking (every 20 seconds)
      const interval = setInterval(() => {
        if (hasCompletedFirstCycle.current) {
          checkSchedule()
        }
      }, 20000)

      // Store interval for cleanup
      initTimeout._interval = interval
    }, 25000)

    return () => {
      clearTimeout(initTimeout)
      if (initTimeout._interval) clearInterval(initTimeout._interval)
    }
  }, [schedule, firedReminders, onReminder])

  return { firedReminders }
}
