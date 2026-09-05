import { useState } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Users, Heart, Mail, Lock, User, CloudOff, CheckCircle2, Loader2 } from 'lucide-react'
import BrahmiLogo from '../components/ui/BrahmiLogo'
import { useAccount } from '../context/AccountContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const nextPath = params.get('next')

  const { user, accounts, cloudMode, signIn, signUp, signOut } = useAccount()

  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [role, setRole] = useState('caregiver')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [justSignedUp, setJustSignedUp] = useState(false)

  const defaultNext = (r) => (r === 'patient' ? '/patient' : '/caregiver')

  const finish = (r) => {
    navigate(nextPath || defaultNext(r))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setBusy(true)
    let res
    let targetRole = role
    if (mode === 'signup') {
      res = await signUp({ name, email, password, role })
      if (res.ok) setJustSignedUp(true)
    } else {
      const acct = accounts.find(a => a.email === email.trim().toLowerCase())
      targetRole = acct ? acct.role : 'caregiver'
      res = await signIn(email, password)
    }
    setBusy(false)
    if (res && !res.ok) {
      setError(res.error || 'Something went wrong. Please try again.')
      return
    }
    if (mode === 'signup') {
      // Give the "account created" state a moment so the user sees it.
      setTimeout(() => finish(targetRole), 900)
    } else {
      finish(targetRole)
    }
  }

  const switchMode = (m) => {
    setMode(m)
    setError('')
  }

  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      {/* Header */}
      <div className="glass shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Home</span>
          </button>
          <div className="flex items-center gap-2">
            <BrahmiLogo size={32} />
            <span className="font-bold text-gray-900">Brahmi <span className="text-primary-500">AI</span></span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md"
        >
          <div className="glass-strong rounded-3xl p-7 sm:p-8 shadow-card">
            {/* Heading */}
            <div className="text-center mb-6">
              <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-teal-500 items-center justify-center mb-4 shadow-lg shadow-primary-500/25">
                <User size={26} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {mode === 'signup' ? 'Create your free account' : 'Welcome back'}
              </h1>
              <p className="text-sm text-gray-500 mt-1.5">
                Sign in on any phone or tablet to open the same setup, schedule and memories.
              </p>
            </div>

            {/* Mode toggle */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-gray-100 mb-5">
              {['signin', 'signup'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${
                    mode === m
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {m === 'signin' ? 'Sign In' : 'Create Account'}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode + role}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                {/* Role picker (sign-up only) */}
                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">I am a…</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'caregiver', icon: Users, title: 'Caregiver', desc: 'I look after a patient' },
                        { key: 'patient', icon: Heart, title: 'Patient', desc: 'I use Brahmi AI myself' },
                      ].map((r) => (
                        <button
                          key={r.key}
                          type="button"
                          onClick={() => setRole(r.key)}
                          className={`text-left p-3 rounded-2xl border-2 transition-all ${
                            role === r.key
                              ? 'border-primary-500 bg-primary-50 shadow-sm'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <r.icon size={20} className={role === r.key ? 'text-primary-600' : 'text-gray-400'} />
                          <div className={`mt-2 text-sm font-bold ${role === r.key ? 'text-gray-900' : 'text-gray-700'}`}>{r.title}</div>
                          <div className="text-[11px] text-gray-400 leading-snug">{r.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={role === 'caregiver' ? 'e.g. Priya Sharma' : 'e.g. Ram Singh'}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={mode === 'signup' ? 'At least 6 characters' : 'Your password'}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-gray-900 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                {justSignedUp && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium">
                    <CheckCircle2 size={16} /> Account created! Taking you to your dashboard…
                  </div>
                )}

                <button
                  type="submit"
                  disabled={busy}
                  className="btn-sheen w-full py-3 rounded-xl bg-gradient-to-r from-primary-500 to-teal-500 text-white font-semibold shadow-lg shadow-primary-500/25 hover:shadow-xl transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {busy ? <Loader2 size={18} className="animate-spin" /> : null}
                  {busy
                    ? 'Please wait…'
                    : mode === 'signup'
                      ? 'Create Account & Continue'
                      : 'Sign In'}
                </button>
              </motion.form>
            </AnimatePresence>

            {/* Cloud mode notice */}
            {!cloudMode && (
              <div className="mt-5 p-3.5 rounded-xl bg-amber-50 border border-amber-100 flex gap-2.5 items-start">
                <CloudOff size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  <span className="font-semibold">Cloud sync is not connected yet.</span>{' '}
                  Accounts currently store data on this device. When an organization connects the cloud, the same
                  account opens the full setup on any phone.
                </p>
              </div>
            )}

            <div className="mt-5 text-center">
              <button
                onClick={() => navigate(nextPath || '/setup')}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Skip for now — continue on this device only
              </button>
            </div>
          </div>

          {user && (
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <span className="text-gray-500">
                Signed in as <span className="font-semibold text-gray-800">{user.name}</span>
              </span>
              <button
                onClick={() => { signOut(); setJustSignedUp(false) }}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign out
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <Link to="/for-organizations" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              Looking to deploy at a facility? See For Organizations →
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
