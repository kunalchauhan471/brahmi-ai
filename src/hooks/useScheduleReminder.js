import { useState, useEffect, useRef, useCallback } from 'react'
import { getISTTotalMinutes, parseTimeToMinutes } from '../utils/timezone'

/**
 * Scheduled reminders.
 *
 * Every reminder fires exactly THREE times each day, giving the patient a
 * gentle heads-up without any continuous pestering:
 *
 *   Reminder at 10:00 PM (Sleep Time)
 *     1. 60 minutes before  → 9:00 PM   "Sleep time is in about an hour"
 *     2. 30 minutes before  → 9:30 PM   "Sleep time is in 30 minutes"
 *     3. at the time        → 10:00 PM  "It's sleep time now"
 *
 * Each (reminder × stage) key is recorded per IST day, so a reminder can
 * never re-fire during that day — even across page reloads or re-renders.
 */

const STAGES = [
  { lead: 60, stage: '1h' },   // 1 hour before
  { lead: 30, stage: '30m' },  // 30 minutes before
  { lead: 0, stage: 'now' },   // exactly at the time
]

const FIRED_KEY = 'brahmi-fired-reminders'

function istDayKey() {
  // Format current date in IST as YYYY-MM-DD
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' })
}

function loadFired() {
  try {
    const raw = JSON.parse(localStorage.getItem(FIRED_KEY)) || {}
    // Reset if stored from a previous day
    if (raw.date !== istDayKey()) {
      const fresh = { date: istDayKey(), keys: [] }
      localStorage.setItem(FIRED_KEY, JSON.stringify(fresh))
      return fresh
    }
    return { date: raw.date, keys: raw.keys || [] }
  } catch {
    return { date: istDayKey(), keys: [] }
  }
}

function saveFired(fired) {
  try {
    localStorage.setItem(FIRED_KEY, JSON.stringify(fired))
  } catch { /* ignore quota errors */ }
}

export default function useScheduleReminder(schedule, onReminder) {
  // fired keys live in a ref + localStorage so state changes never cause
  // the polling loop to re-subscribe (which previously caused repeat pings).
  const firedRef = useRef(loadFired())
  const [tick, setTick] = useState(0)
  const onReminderRef = useRef(onReminder)
  const scheduleRef = useRef(schedule)
  const startedRef = useRef(false)

  useEffect(() => {
    onReminderRef.current = onReminder
  }, [onReminder])

  useEffect(() => {
    scheduleRef.current = schedule
  }, [schedule])

  const markFired = useCallback((key) => {
    firedRef.current = {
      date: istDayKey(),
      keys: [...firedRef.current.keys, key],
    }
    saveFired(firedRef.current)
  }, [])

  const isFired = useCallback((key) => {
    if (firedRef.current.date !== istDayKey()) {
      firedRef.current = { date: istDayKey(), keys: [] }
    }
    return firedRef.current.keys.includes(key)
  }, [])

  useEffect(() => {
    if (!schedule || schedule.length === 0) return

    // Gentle start-up delay: never fire a reminder the moment the page opens.
    const initTimer = setTimeout(() => {
      startedRef.current = true
    }, 20000)

    const checkSchedule = () => {
      if (!startedRef.current) return
      const currentMinutes = getISTTotalMinutes()

      scheduleRef.current.forEach((reminder) => {
        const reminderMinutes = parseTimeToMinutes(reminder.time)
        if (reminderMinutes === null) return

        STAGES.forEach(({ lead, stage }) => {
          const fireAt = reminderMinutes - lead
          if (fireAt < 0) return // before midnight — skip

          const key = `${reminder.id || reminder.title}-${stage}-${istDayKey()}`
          if (isFired(key)) return

          // Fire only inside a small 2-minute window around the stage time
          const diff = Math.abs(currentMinutes - fireAt)
          if (diff <= 2) {
            markFired(key)
            onReminderRef.current?.({
              ...reminder,
              stage, // '1h' | '30m' | 'now'
            })
          }
        })
      })
    }

    checkSchedule()
    const interval = setInterval(checkSchedule, 30000)

    return () => {
      clearTimeout(initTimer)
      clearInterval(interval)
    }
  }, [schedule, isFired, markFired])

  // tick is unused by consumers; kept to allow manual re-check if needed.
  void tick
  return { setTick }
}
