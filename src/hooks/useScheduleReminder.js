import { useState, useEffect, useRef } from 'react'
import { getISTTotalMinutes, parseTimeToMinutes } from '../utils/timezone'

export default function useScheduleReminder(schedule, onReminder) {
  const [firedReminders, setFiredReminders] = useState(new Set())

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

    // Check immediately, then every 20 seconds
    checkSchedule()
    const interval = setInterval(checkSchedule, 20000)

    return () => clearInterval(interval)
  }, [schedule, firedReminders, onReminder])

  return { firedReminders }
}
