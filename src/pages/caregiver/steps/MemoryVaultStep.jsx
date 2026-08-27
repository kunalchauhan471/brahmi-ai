import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera, Plus, Trash2, User, Heart, FileText, ImagePlus
} from 'lucide-react'
import { useData } from '../../../context/DataContext'
import Input from '../../../components/ui/Input'
import Select from '../../../components/ui/Select'
import Card from '../../../components/ui/Card'

const relationshipOptions = [
  { value: 'Son', label: 'Son' },
  { value: 'Daughter', label: 'Daughter' },
  { value: 'Wife', label: 'Wife' },
  { value: 'Husband', label: 'Husband' },
  { value: 'Grandson', label: 'Grandson' },
  { value: 'Granddaughter', label: 'Granddaughter' },
  { value: 'Brother', label: 'Brother' },
  { value: 'Sister', label: 'Sister' },
  { value: 'Friend', label: 'Friend' },
  { value: 'Doctor', label: 'Doctor' },
  { value: 'Neighbor', label: 'Neighbor' },
  { value: 'Other', label: 'Other' },
]

const emojiOptions = [
  '👨', '👩', '👦', '👧', '👴', '👵',
  '👨‍⚕️', '👩‍⚕️', '👨‍🍳', '👩‍🎓', '🧑', '👶',
]

const colorOptions = [
  'from-blue-400 to-blue-600',
  'from-pink-400 to-pink-600',
  'from-green-400 to-green-600',
  'from-purple-400 to-purple-600',
  'from-rose-400 to-rose-600',
  'from-amber-400 to-amber-600',
  'from-teal-400 to-teal-600',
  'from-indigo-400 to-indigo-600',
]

export default function MemoryVaultStep() {
  const { memories, addMemory, removeMemory } = useData()
  const [showForm, setShowForm] = useState(false)
  const [newMemory, setNewMemory] = useState({
    name: '',
    relationship: '',
    description: '',
    emoji: '👨',
    color: 'from-blue-400 to-blue-600',
  })

  const handleAdd = () => {
    if (newMemory.name && newMemory.relationship) {
      addMemory({ ...newMemory })
      setNewMemory({
        name: '',
        relationship: '',
        description: '',
        emoji: '👨',
        color: 'from-blue-400 to-blue-600',
      })
      setShowForm(false)
    }
  }

  return (
    <div>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Camera size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Memory Vault</h2>
              <p className="text-gray-500 text-sm">Add family members and loved ones for memory games.</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-50 text-pink-600 font-medium text-sm hover:bg-pink-100 transition-colors"
          >
            <Plus size={16} />
            Add Memory
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
              <div className="p-5 rounded-xl bg-gray-50 border border-gray-200 space-y-4">
                {/* Photo placeholder */}
                <div className="flex items-center gap-4">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${newMemory.color} flex items-center justify-center text-3xl shadow-lg`}>
                    {newMemory.emoji}
                  </div>
                  <div>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                      <ImagePlus size={16} />
                      Upload Photo
                    </button>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG (max 5MB)</p>
                  </div>
                </div>

                {/* Emoji selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Choose Avatar</label>
                  <div className="flex gap-2 flex-wrap">
                    {emojiOptions.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setNewMemory(prev => ({ ...prev, emoji }))}
                        className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                          newMemory.emoji === emoji
                            ? 'bg-primary-100 border-2 border-primary-500 scale-110'
                            : 'bg-white border border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Name"
                    placeholder="e.g., Amit"
                    value={newMemory.name}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, name: e.target.value }))}
                    icon={User}
                    required
                  />
                  <Select
                    label="Relationship"
                    value={newMemory.relationship}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, relationship: e.target.value }))}
                    options={relationshipOptions}
                    placeholder="Select relationship"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    placeholder="e.g., Lives in Delhi and visits every Sunday. Works as a software engineer."
                    value={newMemory.description}
                    onChange={(e) => setNewMemory(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="
                      w-full rounded-xl border border-gray-200 bg-white
                      px-4 py-3 text-base text-gray-900
                      placeholder:text-gray-400
                      focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400
                      transition-all duration-200 resize-none
                    "
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleAdd}
                    className="px-4 py-2 rounded-lg bg-pink-500 text-white text-sm font-medium hover:bg-pink-600 transition-colors"
                  >
                    Add to Vault
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

        {/* Memory Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {memories.map((memory, index) => (
              <motion.div
                key={memory.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="relative group p-4 rounded-2xl bg-white border border-gray-100 hover:shadow-card transition-all"
              >
                <button
                  onClick={() => removeMemory(memory.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg bg-white/80 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 z-10"
                >
                  <Trash2 size={14} />
                </button>

                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${memory.color} flex items-center justify-center text-2xl shadow-md`}>
                    {memory.emoji}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{memory.name}</h3>
                    <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                      {memory.relationship}
                    </span>
                  </div>
                </div>

                {memory.description && (
                  <p className="text-sm text-gray-500 leading-relaxed">{memory.description}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {memories.length === 0 && (
          <div className="text-center py-12">
            <Camera size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">No memories added yet. Start by adding family members!</p>
          </div>
        )}
      </Card>
    </div>
  )
}
