import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Building2, Mail, Lock, User, LogIn, UserPlus, LogOut,
  Users, Plus, ArrowLeft, CheckCircle2, Shield, Database,
  Cloud, Server, Smartphone, Clock, ChevronRight
} from 'lucide-react'
import BrahmiLogo from '../components/ui/BrahmiLogo'
import { useFacility } from '../context/FacilityContext'
import Card from '../components/ui/Card'

export default function FacilityPage() {
  const navigate = useNavigate()
  const { session, patients, cloudMode, signIn, signUp, signOut, openPatient, saveCurrentAsPatient, demoAccounts } = useFacility()

  const [mode, setMode] = useState('login') // login | signup
  const [form, setForm] = useState({ name: '', email: '', password: '', facilityName: '' })
  const [error, setError] = useState(null)
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setBusy(true)
    const res = mode === 'login'
      ? await signIn(form.email, form.password)
      : await signUp(form)
    setBusy(false)
    if (!res.ok) {
      setError(res.error || 'Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-mesh">
      {/* Header */}
      <div className="glass shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Home</span>
          </button>
          <div className="flex items-center gap-2">
            <BrahmiLogo size={32} />
            <span className="text-lg font-bold text-gray-900">Brahmi <span className="text-primary-500">AI</span></span>
          </div>
          <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${cloudMode ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            {cloudMode ? <Cloud size={13} /> : <Server size={13} />}
            {cloudMode ? 'Cloud Connected' : 'Demo Mode'}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {!session ? (
          /* ============ AUTH SCREEN ============ */
          <div className="max-w-md mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/25">
                <Building2 size={36} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Facility Login</h1>
              <p className="text-gray-500 mt-2">For orphanages, eldercare homes & NGO staff</p>
            </motion.div>

            <Card className="p-6">
              {/* Tabs */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-xl mb-6">
                {['login', 'signup'].map(m => (
                  <button
                    key={m}
                    onClick={() => { setMode(m); setError(null) }}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    {m === 'login' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        required
                        placeholder="Staff name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                      />
                    </div>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                      <input
                        placeholder="Facility / organization name"
                        value={form.facilityName}
                        onChange={e => setForm({ ...form, facilityName: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                      />
                    </div>
                  </>
                )}
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                  />
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
                  <input
                    required
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-400"
                  />
                </div>

                {error && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-primary-500/25 hover:shadow-xl transition-shadow disabled:opacity-60"
                >
                  {busy ? 'Please wait...' : mode === 'login' ? (
                    <><LogIn size={18} /> Sign In</>
                  ) : (
                    <><UserPlus size={18} /> Create Account</>
                  )}
                </button>
              </form>

              {/* Demo hint */}
              <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 mb-2 flex items-center gap-1.5">
                  <CheckCircle2 size={13} /> Try the demo account
                </p>
                <p className="text-xs text-blue-600 mb-1">Email: {demoAccounts[0].email}</p>
                <p className="text-xs text-blue-600 mb-3">Password: {demoAccounts[0].password}</p>
                <button
                  onClick={() => { setForm({ ...form, email: demoAccounts[0].email, password: demoAccounts[0].password }); setMode('login'); setError(null) }}
                  className="text-xs font-semibold text-blue-700 underline underline-offset-2 hover:text-blue-800"
                >
                  Auto-fill demo credentials →
                </button>
              </div>
            </Card>
          </div>
        ) : (
          /* ============ FACILITY CONSOLE ============ */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            {/* Welcome bar */}
            <Card className="mb-6 bg-gradient-to-r from-primary-50 to-teal-50 border-primary-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome, {session.name} 👋</h1>
                  <p className="text-gray-500 mt-1">{session.facilityName} — {patients.length} patient record{patients.length !== 1 ? 's' : ''} on file</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate('/setup')}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 text-white text-sm font-semibold flex items-center gap-2 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <Plus size={16} /> New Patient Setup
                  </button>
                  <button
                    onClick={signOut}
                    className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 text-sm font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            </Card>

            {/* Save current live setup */}
            <Card className="mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Database size={18} className="text-primary-500" />
                    Current Patient Setup
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Save the setup that's currently in this browser as a facility record.
                  </p>
                </div>
                <button
                  onClick={() => saveCurrentAsPatient()}
                  className="px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <CheckCircle2 size={16} /> Save as Patient Record
                </button>
              </div>
            </Card>

            {/* Patients list */}
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users size={20} className="text-teal-500" /> Patient Records
            </h2>

            {patients.length === 0 ? (
              <Card className="text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Users size={28} className="text-gray-300" />
                </div>
                <h3 className="font-semibold text-gray-700">No patient records yet</h3>
                <p className="text-sm text-gray-400 mt-1 mb-5">Complete a caregiver setup, then save it as a patient record here.</p>
                <button
                  onClick={() => navigate('/setup')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 text-white text-sm font-semibold flex items-center gap-2 mx-auto shadow-md"
                >
                  <Plus size={16} /> Start First Setup
                </button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {patients.map((p) => {
                  const pd = p.patientData || {}
                  const count = (p.memories || []).length
                  const sched = (p.schedule || []).length
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card hover className="cursor-pointer" >
                        <button onClick={() => { openPatient(p); navigate('/caregiver') }} className="w-full text-left">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 flex items-center justify-center text-white text-xl font-bold shadow-md flex-shrink-0">
                              {(pd.name || 'P')[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-gray-900 truncate">{pd.name || 'Unnamed patient'}</h3>
                              <p className="text-sm text-gray-400">{p.label || 'Saved setup'}</p>
                            </div>
                            <ChevronRight size={18} className="text-gray-300" />
                          </div>
                          <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                            <span>{pd.age ? `${pd.age} yrs` : '—'}</span>
                            <span>{count} memories</span>
                            <span>{sched} reminders</span>
                            <span className="ml-auto flex items-center gap-1">
                              <Clock size={12} />
                              {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString() : 'Today'}
                            </span>
                          </div>
                        </button>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {/* Info strip */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Shield, title: 'Secure access', desc: 'Only authorized facility staff can open patient records.' },
                { icon: Smartphone, title: 'Works on any device', desc: 'Tablets, phones, and desktops stay in sync through the cloud.' },
                { icon: Database, title: cloudMode ? 'Cloud backed up' : 'Demo storage', desc: cloudMode ? 'Patient data is safely stored in your facility cloud.' : 'Add Supabase keys to enable real cloud storage & sync.' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white border border-gray-100 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <item.icon size={16} className="text-primary-500" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{item.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
