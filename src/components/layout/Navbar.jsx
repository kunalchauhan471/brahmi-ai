import { motion } from 'framer-motion'
import { Brain, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Navbar({ showBack = false, transparent = false }) {
  const navigate = useNavigate()

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`
        fixed top-0 left-0 right-0 z-50
        ${transparent ? 'bg-transparent' : 'glass shadow-sm'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {showBack && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </motion.button>
            )}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
                <Brain size={20} className="text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Cogni<span className="gradient-text">Care</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.nav>
  )
}
