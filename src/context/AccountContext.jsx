import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'
import { useData } from './DataContext'
import { getSupabase, isCloudEnabled } from '../services/cloud/cloudClient'
import { saveProfileToCloud, loadProfilesFromCloud } from '../services/cloud/cloudSync'

const AccountContext = createContext(null)

export const useAccount = () => {
  const ctx = useContext(AccountContext)
  if (!ctx) throw new Error('useAccount must be used within AccountProvider')
  return ctx
}

const ACCOUNTS_KEY = 'brahmi_accounts'
const SESSION_KEY = 'brahmi_session'
const LEGACY_DATA_KEY = 'brahmi_data'
const GUEST_KEY = 'brahmi_guest'

const accountDataKey = (email) => `brahmi_data_${(email || '').toLowerCase().trim()}`

function readAccounts() {
  try { return JSON.parse(localStorage.getItem(ACCOUNTS_KEY)) || [] } catch { return [] }
}

function readSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)) || null } catch { return null }
}

function writeAccounts(list) {
  try { localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list)) } catch { /* ignore */ }
}

function writeSession(session) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(SESSION_KEY)
  } catch { /* ignore */ }
}

function loadLocalBundle(email) {
  try {
    const raw = localStorage.getItem(accountDataKey(email))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function saveLocalBundle(email, bundle) {
  try { localStorage.setItem(accountDataKey(email), JSON.stringify(bundle)) } catch { /* ignore */ }
}

function loadLegacyBundle() {
  try {
    const raw = localStorage.getItem(LEGACY_DATA_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

/** Read a bundle key only when it exists and has content. */
function pick(bundle, key) {
  return bundle && bundle[key] && Object.keys(bundle[key]).length > 0 ? bundle[key] : undefined
}

export function AccountProvider({ children }) {
  const {
    patientData, setPatientData,
    caregiverData, setCaregiverData,
    emergencyContact, setEmergencyContact,
    schedule, setSchedule,
    memories, setMemories,
    completedGames, setCompletedGames,
  } = useData()

  const [accounts, setAccounts] = useState(readAccounts)
  const [user, setUser] = useState(readSession)
  const cloudMode = isCloudEnabled
  const saveTimer = useRef(null)
  const booted = useRef(false)

  /** Push the live setup into the DataContext (used when signing in / restoring). */
  const hydrate = useCallback((bundle) => {
    if (!bundle) return
    const p = pick(bundle, 'patientData');   if (p) setPatientData(p)
    const c = pick(bundle, 'caregiverData'); if (c) setCaregiverData(c)
    const e = pick(bundle, 'emergencyContact'); if (e) setEmergencyContact(e)
    const s = pick(bundle, 'schedule');      if (s && s.length) setSchedule(s)
    const m = pick(bundle, 'memories');      if (m && m.length) setMemories(m)
    const g = pick(bundle, 'completedGames'); if (g) setCompletedGames(g)
  }, [setPatientData, setCaregiverData, setEmergencyContact, setSchedule, setMemories, setCompletedGames])

  // On first load, restore the signed-in account's data (if any).
  useEffect(() => {
    if (booted.current) return
    booted.current = true
    const session = readSession()
    if (session && session.email) {
      const local = loadLocalBundle(session.email)
      if (local) hydrate(local)
    }
  }, [hydrate])

  // Keep the session + account registry persisted.
  useEffect(() => { writeAccounts(accounts) }, [accounts])
  useEffect(() => { writeSession(user) }, [user])

  const currentBundle = {
    patientData,
    caregiverData,
    emergencyContact,
    schedule,
    memories,
    completedGames,
  }

  // Auto-save every change to the signed-in account (device key always; cloud when enabled).
  useEffect(() => {
    if (!user || !user.email) return
    saveLocalBundle(user.email, currentBundle)
    if (cloudMode) {
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        saveProfileToCloud(user.email, currentBundle)
      }, 900)
    }
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, patientData, caregiverData, emergencyContact, schedule, memories, completedGames])

  /** Where should new sign-ins pull data from? Own cloud profile → own device key → legacy device data. */
  const resolveSourceData = useCallback(async (email, role) => {
    if (cloudMode) {
      const rows = await loadProfilesFromCloud(email)
      if (rows && rows.length) {
        const profile = rows[0].profile
        if (profile && (pick(profile, 'patientData') || pick(profile, 'schedule') || pick(profile, 'memories'))) {
          return profile
        }
      }
    }
    const local = loadLocalBundle(email)
    if (local) return local
    // First caregiver on this device adopts whatever was set up before accounts existed.
    if (role === 'caregiver') return loadLegacyBundle()
    return null
  }, [cloudMode])

  const signUp = useCallback(async ({ name, email, password, role }) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    if (!name || !cleanEmail || !password) return { ok: false, error: 'Please fill in your name, email and password.' }
    if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' }
    if (accounts.some(a => a.email === cleanEmail)) return { ok: false, error: 'An account with this email already exists. Please sign in.' }

    let provider = 'local'
    if (cloudMode) {
      try {
        const supabase = getSupabase()
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: { data: { name, role } },
        })
        if (!error && data?.user) provider = 'supabase'
      } catch { /* cloud unreachable — keep local account so the app still works */ }
    }

    const account = { name: name.trim(), email: cleanEmail, password, role, provider, createdAt: new Date().toISOString() }
    setAccounts(prev => [...prev, account])
    setUser({ name: account.name, email: cleanEmail, role, provider })
    try { localStorage.removeItem(GUEST_KEY) } catch { /* ignore */ }

    // Pull in existing data (new account on a device that already has setup done).
    const source = await resolveSourceData(cleanEmail, role)
    if (source) hydrate(source)
    return { ok: true }
  }, [accounts, cloudMode, hydrate, resolveSourceData])

  const signIn = useCallback(async (email, password) => {
    const cleanEmail = (email || '').trim().toLowerCase()
    if (!cleanEmail || !password) return { ok: false, error: 'Please enter your email and password.' }

    const account = accounts.find(a => a.email === cleanEmail && a.password === password)
    if (!account) return { ok: false, error: 'No account found with that email and password. Please create an account first.' }

    let provider = account.provider || 'local'
    if (cloudMode && provider !== 'supabase') {
      try {
        const supabase = getSupabase()
        const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
        if (!error && data?.user) provider = 'supabase'
      } catch { /* cloud unreachable — local sign-in still works */ }
    }

    setUser({ name: account.name, email: cleanEmail, role: account.role, provider })
    try { localStorage.removeItem(GUEST_KEY) } catch { /* ignore */ }
    const source = await resolveSourceData(cleanEmail, account.role)
    if (source) hydrate(source)
    return { ok: true }
  }, [accounts, cloudMode, hydrate, resolveSourceData])

  const signOut = useCallback(async () => {
    if (user && user.email) saveLocalBundle(user.email, currentBundle)
    if (cloudMode) {
      try { await getSupabase().auth.signOut() } catch { /* ignore */ }
    }
    try { localStorage.removeItem(GUEST_KEY) } catch { /* ignore */ }
    setUser(null)
  }, [user, cloudMode]) // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    user,
    accounts,
    cloudMode,
    signUp,
    signIn,
    signOut,
  }

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}
