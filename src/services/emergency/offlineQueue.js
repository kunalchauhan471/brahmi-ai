/**
 * Offline Emergency Queue
 * Stores emergencies locally when no communication channel is available
 * Auto-retries when internet becomes available
 */

const QUEUE_KEY = 'brahmi_emergency_queue'

export function getPendingEmergencies() {
  try {
    const data = localStorage.getItem(QUEUE_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

export function addToQueue(emergency) {
  const queue = getPendingEmergencies()
  queue.push({ ...emergency, queuedAt: new Date().toISOString() })
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function removeFromQueue(emergencyId) {
  const queue = getPendingEmergencies().filter(e => e.id !== emergencyId)
  localStorage.setItem(QUEUE_KEY, JSON.stringify(queue))
}

export function hasPendingEmergencies() {
  return getPendingEmergencies().length > 0
}

/**
 * Set up auto-retry when internet comes back
 */
export function setupAutoRetry(onRetry) {
  const handler = () => {
    if (navigator.onLine) {
      const pending = getPendingEmergencies()
      pending.forEach(emergency => {
        onRetry(emergency)
        removeFromQueue(emergency.id)
      })
    }
  }
  window.addEventListener('online', handler)
  return () => window.removeEventListener('online', handler)
}
