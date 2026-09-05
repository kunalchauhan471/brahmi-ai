import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getSupabase, isCloudEnabled } from '../services/cloud/cloudClient'
import { saveProfileToCloud, loadProfilesFromCloud } from '../services/cloud/cloudSync'
import { useData } from './DataContext'

const FacilityContext = createContext(null)

const FACILITY_SESSION_KEY = 'brahmi-facility-session'
const FACILITY_STAFF_KEY = 'brahmi-facility-staff'

export const useFacility = () => {
  const ctx = useContext(FacilityContext)
  if (!ctx) throw new Error('useFacility must be used within FacilityProvider')
  return ctx
}

/** Demo accounts usable even without Supabase, so the NGO pitch always works. */
const DEMO_ACCOUNTS = [
  { email: 'facility@brahmi.ai', password: 'brahmi123', name: 'Demo Facility Admin', facilityName: 'Sunrise Eldercare Home' },
]

function readSession() {
  try { return JSON.parse(localStorage.getItem(FACILITY_SESSION_KEY)) || null } catch { return null }
}

function readStaff() {
  try { return JSON.parse(localStorage.getItem(FACILITY_STAFF_KEY)) || [] } catch { return [] }
}

export function FacilityProvider({ children }) {
  const { patientData, caregiverData, emergencyContact, schedule, memories, setPatientData, setCaregiverData, setEmergencyContact, setSchedule, setMemories } = useData()
  const [session, setSession] = useState(readSession)
  const [staff, setStaff] = useState(readStaff)
  const [patients, setPatients] = useState([])
  const [cloudMode, setCloudMode] = useState(isCloudEnabled)

  // Persist demo staff + session
  useEffect(() => {
    localStorage.setItem(FACILITY_STAFF_KEY, JSON.stringify(staff))
  }, [staff])
  useEffect(() => {
    if (session) localStorage.setItem(FACILITY_SESSION_KEY, JSON.stringify(session))
    else localStorage.removeItem(FACILITY_SESSION_KEY)
  }, [session])

  // When logged in and in cloud mode, load patient records
  useEffect(() => {
    if (session) {
      loadProfilesFromCloud(session.email).then(records => {
        const mapped = (records || []).map(r => ({
          id: r.id,
          ...(r.profile || {}),
          updatedAt: r.updated_at,
        }))
        setPatients(mapped)
      })
    } else {
      setPatients([])
    }
  }, [session, cloudMode])

  const signIn = useCallback(async (email, password) => {
    // Try Supabase auth when configured
    if (isCloudEnabled) {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error && data?.user) {
        const meta = data.user.user_metadata || {}
        const newSession = { email, name: meta.name || email.split('@')[0], facilityName: meta.facilityName || 'My Facility', provider: 'supabase' }
        setSession(newSession)
        return { ok: true }
      }
    }
    // Demo / local accounts
    const match = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password)
    if (match) {
      setSession({ email, name: match.name, facilityName: match.facilityName, provider: 'demo' })
      return { ok: true }
    }
    // Facility-created local accounts
    const local = staff.find(a => a.email === email && a.password === password)
    if (local) {
      setSession({ email, name: local.name, facilityName: local.facilityName, provider: 'local' })
      return { ok: true }
    }
    return { ok: false, error: 'Invalid email or password.' }
  }, [staff])

  const signUp = useCallback(async ({ name, email, password, facilityName }) => {
    if (isCloudEnabled) {
      const supabase = getSupabase()
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, facilityName } },
      })
      if (!error && data?.user) {
        setSession({ email, name, facilityName, provider: 'supabase' })
        return { ok: true }
      }
      // Supabase may require email confirmation; keep local fallback informative
      if (error) return { ok: false, error: error.message }
    }
    // Local mode — create the account on this device
    const exists = staff.some(s => s.email === email)
    if (exists) return { ok: false, error: 'An account with this email already exists.' }
    const newAccount = { name, email, password, facilityName: facilityName || 'My Facility', provider: 'local' }
    setStaff(prev => [...prev, newAccount])
    setSession({ email, name, facilityName: newAccount.facilityName, provider: 'local' })
    return { ok: true }
  }, [staff])

  const signOut = useCallback(async () => {
    if (isCloudEnabled) {
      try { await getSupabase().auth.signOut() } catch { /* ignore */ }
    }
    setSession(null)
    setPatients([])
  }, [])

  /** Load a saved patient profile into the live app state (for viewing / editing). */
  const openPatient = useCallback((patient) => {
    const p = patient.patient || {}
    if (p.patientData) setPatientData(p.patientData)
    if (p.caregiverData) setCaregiverData(p.caregiverData)
    if (p.emergencyContact) setEmergencyContact(p.emergencyContact)
    if (p.schedule) setSchedule(p.schedule)
    if (p.memories) setMemories(p.memories)
  }, [setPatientData, setCaregiverData, setEmergencyContact, setSchedule, setMemories])

  /** Save the current live setup as a patient record for this facility. */
  const saveCurrentAsPatient = useCallback(async (label) => {
    const profile = {
      label: label || patientData.name || 'Unnamed patient',
      patientData,
      caregiverData,
      emergencyContact,
      schedule,
      memories,
    }
    // Always keep a local copy so demo works offline
    setPatients(prev => {
      const next = [{ id: 'local-' + Date.now(), ...profile, updatedAt: new Date().toISOString() }, ...prev]
      localStorage.setItem('brahmi-facility-patients', JSON.stringify(next))
      return next
    })
    if (isCloudEnabled && session) {
      return saveProfileToCloud(session.email, profile)
    }
    return { ok: true, offline: !isCloudEnabled }
  }, [patientData, caregiverData, emergencyContact, schedule, memories, session])

  // Restore locally-saved patient list for demo mode
  useEffect(() => {
    if (!isCloudEnabled) {
      try {
        const raw = localStorage.getItem('brahmi-facility-patients')
        if (raw) setPatients(JSON.parse(raw))
      } catch { /* ignore */ }
    }
  }, [])

  const value = {
    session, staff, patients, cloudMode,
    signIn, signUp, signOut, openPatient, saveCurrentAsPatient,
    demoAccounts: DEMO_ACCOUNTS,
  }

  return <FacilityContext.Provider value={value}>{children}</FacilityContext.Provider>
}
