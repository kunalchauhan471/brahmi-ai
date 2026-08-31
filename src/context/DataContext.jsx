import React, { createContext, useContext, useState } from 'react'

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

const initialCaregiverData = {
  name: '',
  email: '',
  phone: '',
}

const initialPatientData = {
  name: '',
  age: '',
  gender: '',
  language: 'English',
  voice: 'female',
  speechSpeed: 'normal',
}

const initialEmergencyContact = {
  name: '',
  relationship: '',
  phone: '',
}

const initialSchedule = [
  { id: 1, title: 'Morning Medicine', time: '08:00 AM', notes: 'Take with warm water', type: 'medicine' },
  { id: 2, title: 'Breakfast', time: '08:30 AM', notes: 'Oats or porridge preferred', type: 'meal' },
  { id: 3, title: 'Morning Walk', time: '09:30 AM', notes: '15 minutes in the garden', type: 'activity' },
  { id: 4, title: 'Water Reminder', time: '11:00 AM', notes: 'Drink a full glass', type: 'reminder' },
  { id: 5, title: 'Lunch', time: '01:00 PM', notes: 'Light meal, low spice', type: 'meal' },
  { id: 6, title: 'Evening Tea', time: '04:00 PM', notes: 'Herbal tea with biscuits', type: 'meal' },
  { id: 7, title: 'Evening Walk', time: '05:00 PM', notes: '20 minutes, gentle pace', type: 'activity' },
  { id: 8, title: 'Dinner', time: '07:30 PM', notes: 'Light dinner before 8 PM', type: 'meal' },
  { id: 9, title: 'Bedtime Medicine', time: '09:00 PM', notes: 'As prescribed by doctor', type: 'medicine' },
  { id: 10, title: 'Sleep Time', time: '10:00 PM', notes: 'Ensure room is dark and quiet', type: 'routine' },
]

const initialMemories = [
  {
    id: 1,
    name: 'Amit',
    relationship: 'Son',
    description: 'Lives in Delhi and visits every Sunday. Works as a software engineer.',
    emoji: '👨',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 2,
    name: 'Simran',
    relationship: 'Daughter',
    description: 'Lives in Mumbai. Calls every evening at 7 PM. Loves to cook.',
    emoji: '👩',
    color: 'from-pink-400 to-pink-600',
  },
  {
    id: 3,
    name: 'Raj',
    relationship: 'Grandson',
    description: 'Age 8. Visits during summer holidays. Loves playing cricket.',
    emoji: '👦',
    color: 'from-green-400 to-green-600',
  },
  {
    id: 4,
    name: 'Priya',
    relationship: 'Granddaughter',
    description: 'Age 12. Very studious. Wants to become a doctor.',
    emoji: '👧',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 5,
    name: 'Meera',
    relationship: 'Wife',
    description: 'Together for 45 years. Loves gardening and listening to old songs.',
    emoji: '👩‍🦳',
    color: 'from-rose-400 to-rose-600',
  },
  {
    id: 6,
    name: 'Dr. Sharma',
    relationship: 'Doctor',
    description: 'Family physician for 20 years. Visits every Monday.',
    emoji: '👨‍⚕️',
    color: 'from-teal-400 to-teal-600',
  },
]

const gamesData = [
  {
    id: 1,
    name: 'My Memory Album',
    description: 'Look at family photos and identify who they are. Test your memory of loved ones.',
    icon: 'Album',
    difficulty: 'Easy',
    color: 'from-blue-500 to-indigo-600',
    bgColor: 'bg-blue-50',
    progress: 0,
  },
  {
    id: 2,
    name: 'Memory Tray',
    description: 'Remember the objects shown and pick them from the tray. Sharpens visual memory.',
    icon: 'LayoutGrid',
    difficulty: 'Medium',
    color: 'from-emerald-500 to-teal-600',
    bgColor: 'bg-emerald-50',
    progress: 0,
  },
  {
    id: 3,
    name: 'Family Face Match',
    description: 'Match family members with their names. Great for strengthening face recognition.',
    icon: 'Users',
    difficulty: 'Easy',
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-50',
    progress: 0,
  },
  {
    id: 4,
    name: 'Daily Routine Sequencer',
    description: 'Put your daily activities in the correct order. Helps with routine memory.',
    icon: 'ListOrdered',
    difficulty: 'Medium',
    color: 'from-amber-500 to-orange-600',
    bgColor: 'bg-amber-50',
    progress: 0,
  },
  {
    id: 5,
    name: 'Spot the Difference',
    description: 'Compare two scenes side by side and find what\'s missing. Sharpens attention.',
    icon: 'Eye',
    difficulty: 'Medium',
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-50',
    progress: 0,
  },
  {
    id: 6,
    name: 'Pair Matcher',
    description: 'Flip cards and find matching pairs. A classic memory matching game.',
    icon: 'Heart',
    difficulty: 'Easy',
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-50',
    progress: 0,
  },
]

export function DataProvider({ children }) {
  const [caregiverData, setCaregiverData] = useState(initialCaregiverData)
  const [patientData, setPatientData] = useState(initialPatientData)
  const [emergencyContact, setEmergencyContact] = useState(initialEmergencyContact)
  const [schedule, setSchedule] = useState(initialSchedule)
  const [memories, setMemories] = useState(initialMemories)
  const [games, setGames] = useState(gamesData)
  const [completedGames, setCompletedGames] = useState({})
  const [patientMode, setPatientMode] = useState(false)

  const addMemory = (memory) => {
    setMemories(prev => [...prev, { ...memory, id: Date.now() }])
  }

  const removeMemory = (id) => {
    setMemories(prev => prev.filter(m => m.id !== id))
  }

  const addReminder = (reminder) => {
    setSchedule(prev => [...prev, { ...reminder, id: Date.now() }])
  }

  const removeReminder = (id) => {
    setSchedule(prev => prev.filter(r => r.id !== id))
  }

  const completeGame = (gameId, score) => {
    setCompletedGames(prev => ({
      ...prev,
      [gameId]: {
        completed: true,
        score: score,
        completedAt: new Date().toISOString(),
      }
    }))
  }

  const updateGameProgress = (gameId, progress) => {
    setGames(prev => prev.map(g =>
      g.id === gameId ? { ...g, progress } : g
    ))
  }

  const value = {
    caregiverData,
    setCaregiverData,
    patientData,
    setPatientData,
    emergencyContact,
    setEmergencyContact,
    schedule,
    setSchedule,
    addReminder,
    removeReminder,
    memories,
    setMemories,
    addMemory,
    removeMemory,
    games,
    completedGames,
    completeGame,
    updateGameProgress,
    patientMode,
    setPatientMode,
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}
