import { useState, useEffect, useRef } from 'react'

export default function useScheduleReminder(schedule, onReminder) {
  const [firedReminders, setFiredReminders] = useState(new Set())

  useEffect(() => {
    if (!schedule || schedule.length === 0) return

    const parseTime = (timeStr) => {
      // Handle "08:00 AM", "1:00 PM", "13:00" etc.
      const cleaned = timeStr.trim()
      const isPM = /PM/i.test(cleaned)
      const isAM = /AM/i.test(cleaned)
      const withoutMeridiem = cleaned.replace(/\s*(AM|PM)/i, '').trim()
      const parts = withoutMeridiem.split(':')
      if (parts.length !== 2) return null
      let hours = parseInt(parts[0], 10)
      const minutes = parseInt(parts[1], 10)
      if (isNaN(hours) || isNaN(minutes)) return null

      if (isPM && hours !== 12) hours += 12
      if (isAM && hours === 12) hours = 0

      return hours * 60 + minutes
    }

    const checkSchedule = () => {
      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()

      schedule.forEach((reminder) => {
        if (firedReminders.has(reminder.id)) return

        const reminderMinutes = parseTime(reminder.time)
        if (reminderMinutes === null) return

        // Fire if within a 2-minute window of the scheduled time
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
