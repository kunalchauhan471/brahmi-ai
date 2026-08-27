import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, Plus, Trash2, Pill, UtensilsCrossed, Footprints,
  Droplets, Moon, Bell, Coffee, Sun, Activity
} from 'lucide-react'
import { useData } from '../../../context/DataContext'
import Input from '../../../components/ui/Input'
import Card from '../../../components/ui/Card'

const typeIcons = {
  medicine: Pill,
  meal: UtensilsCrossed,
  activity: Activity,
  reminder: Bell,
  routine: Moon,
  walk: Footprints,
  drink: Droplets,
}

const typeColors = {
  medicine: 'from-red-400 to-red-600',
  meal: 'from-amber-400 to-orange-600',
  activity: 'from-green-400 to-emerald-600',
  reminder: 'from-blue-400 to-indigo-600',
  routine: 'from-purple-400 to-violet-600',
  walk: 'from-teal-400 to-cyan-600',
  drink: 'from-cyan-400 to-blue-600',
}

export default function DailyScheduleStep() {
  const { schedule, addReminder, removeReminder } = useData()
  const [showForm, setShowForm] = useState(false)
  const [newReminder, setNewReminder] = useState({
    title: '',
    time: '',
    notes: '',
    type: 'reminder',
  })

  const handleAdd = () => {
    if (newReminder.title && newReminder.time) {
      addReminder({ ...newReminder })
      setNewReminder({ title: '', time: '', notes: '', type: 'reminder' })
      setShowForm(false)
    }
  }

  return (
    <div>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Clock size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Daily Schedule</h2>
              <p className="text-gray-500 text-sm">Set up gentle reminders for the patient.</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-50 text-primary-600 font-medium text-sm hover:bg-primary-100 transition-colors"
          >
            <Plus size={16} />
            Add
          </motion.button>
        </div>

        {/* Add Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Title"
                    placeholder="e.g., Morning Medicine"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    required
                  />
                  <Input
                    label="Time"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, time: e.target.value }))}
                    required
                  />
                </div>
                <Input
                  label="Notes (optional)"
                  placeholder="Any special instructions..."
                  value={newReminder.notes}
                  onChange={(e) => setNewReminder(prev => ({ ...prev, notes: e.target.value }))}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors"
                  >
                    Add Reminder
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Schedule Timeline */}
        <div className="space-y-3">
          <AnimatePresence>
            {schedule.map((reminder, index) => {
              const TypeIcon = typeIcons[reminder.type] || Bell
              const color = typeColors[reminder.type] || 'from-blue-400 to-indigo-600'

              return (
                <motion.div
                  key={reminder.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100 hover:shadow-sm transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                    <TypeIcon size={18} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900">{reminder.title}</div>
                    {reminder.notes && (
                      <div className="text-sm text-gray-400 truncate">{reminder.notes}</div>
                    )}
                  </div>
                  <div className="text-sm font-medium text-gray-500 flex-shrink-0">
                    {reminder.time}
                  </div>
                  <button
                    onClick={() => removeReminder(reminder.id)}
                    className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </Card>
    </div>
  )
}
