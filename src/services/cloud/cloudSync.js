/**
 * Cloud sync helpers. All functions no-op gracefully in LOCAL MODE,
 * so the app behaves identically whether or not Supabase is configured.
 */
import { getSupabase, isCloudEnabled } from './cloudClient'

const TABLE = 'patient_profiles'
const STORAGE_BUCKET = 'memory-photos'

/**
 * Save a full patient profile (caregiver + patient + schedule + memories + emergency contact)
 * to the cloud keyed by an owner id. Returns { ok, id } — in local mode returns { ok: false, offline: true }.
 */
export async function saveProfileToCloud(ownerId, profile) {
  if (!isCloudEnabled) return { ok: false, offline: true }
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from(TABLE)
      .upsert({ owner_id: ownerId, profile, updated_at: new Date().toISOString() })
      .select('id')
      .single()
    if (error) throw error
    return { ok: true, id: data?.id || null }
  } catch (err) {
    console.error('Cloud save failed:', err.message)
    return { ok: false, offline: true }
  }
}

/**
 * Load all patient profiles for an owner (facility/staff member).
 * Returns [] in local mode.
 */
export async function loadProfilesFromCloud(ownerId) {
  if (!isCloudEnabled || !ownerId) return []
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from(TABLE)
      .select('id, profile, updated_at')
      .eq('owner_id', ownerId)
      .order('updated_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Cloud load failed:', err.message)
    return []
  }
}

/**
 * Upload a memory photo (base64 data URL) to Supabase Storage.
 * Falls back to returning the base64 itself when not in cloud mode,
 * so uploaded photos always work.
 */
export async function uploadMemoryPhoto(base64Data, folder = 'memories') {
  if (!isCloudEnabled) return base64Data
  try {
    const supabase = getSupabase()
    const extMatch = base64Data.match(/^data:image\/(\w+);base64,/)
    if (!extMatch) return base64Data
    const ext = extMatch[1] === 'jpeg' ? 'jpg' : extMatch[1]
    const b64 = base64Data.split(',')[1]
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(`${folder}/${name}`, bytes, { contentType: `image/${ext}` })
    if (error) throw error
    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(`${folder}/${name}`)
    return urlData?.publicUrl || base64Data
  } catch (err) {
    console.error('Photo upload failed:', err.message)
    return base64Data
  }
}
