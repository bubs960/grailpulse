"use client"

export interface LicenseProfile {
  handle: string
  lane: string
  licenseId: string
  garageKey?: string
  createdAt: string
}

export interface GarageEntry {
  id: string
  condition: string
  addedAt: string
}

export interface HuntEntry {
  id: string
  addedAt: string
}

export interface GarageState {
  license?: LicenseProfile
  garage: Record<string, GarageEntry>
  hunt: Record<string, HuntEntry>
}

const STORAGE_KEY = 'grailpulse-diecast-garage-v1'
const SYNC_DEBOUNCE_MS = 450

let syncTimer: number | undefined

export const CONDITION_OPTIONS = [
  { value: 'carded', label: 'Carded' },
  { value: 'momc', label: 'MOMC' },
  { value: 'loose', label: 'Loose' },
  { value: 'mint_loose', label: 'Mint loose' },
  { value: 'damaged_card', label: 'Damaged card' },
]

export function emptyGarageState(): GarageState {
  return { garage: {}, hunt: {} }
}

export function loadGarageState(): GarageState {
  if (typeof window === 'undefined') return emptyGarageState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyGarageState()
    const parsed = JSON.parse(raw) as Partial<GarageState>
    return {
      license: parsed.license,
      garage: parsed.garage ?? {},
      hunt: parsed.hunt ?? {},
    }
  } catch {
    return emptyGarageState()
  }
}

export function saveGarageState(state: GarageState, options: { sync?: boolean } = {}): GarageState {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    window.dispatchEvent(new CustomEvent('diecast-garage-updated'))
    if (options.sync !== false) queueGarageSync(state)
  }
  return state
}

function queueGarageSync(state: GarageState) {
  if (!state.license?.garageKey) return
  window.clearTimeout(syncTimer)
  syncTimer = window.setTimeout(() => {
    syncGarageState(state).catch(() => {
      window.dispatchEvent(new CustomEvent('diecast-garage-sync-error'))
    })
  }, SYNC_DEBOUNCE_MS)
}

export function makeLicenseId(handle: string, lane: string): string {
  const seed = `${handle}:${lane}:${Date.now()}`
  let hash = 0
  for (let index = 0; index < seed.length; index += 1) {
    hash = ((hash << 5) - hash + seed.charCodeAt(index)) | 0
  }
  return `DC-${Math.abs(hash).toString(36).toUpperCase().padStart(6, '0').slice(0, 6)}`
}

export function upsertLicense(handle: string, lane: string): GarageState {
  const state = loadGarageState()
  const license: LicenseProfile = {
    handle: handle.trim() || 'Pit Lane Collector',
    lane,
    licenseId: state.license?.licenseId ?? makeLicenseId(handle.trim() || 'collector', lane),
    createdAt: state.license?.createdAt ?? new Date().toISOString(),
  }
  return saveGarageState({ ...state, license })
}

export async function createCloudLicense(handle: string, lane: string): Promise<GarageState> {
  const response = await fetch('/api/license', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ handle, lane }),
  })
  if (!response.ok) throw new Error('license_create_failed')
  const payload = await response.json() as GarageState
  return saveGarageState(normalizeGarageState(payload), { sync: false })
}

export async function loadCloudGarage(licenseId: string, garageKey: string): Promise<GarageState> {
  const response = await fetch('/api/garage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ licenseId, garageKey }),
  })
  if (!response.ok) throw new Error(response.status === 401 ? 'invalid_license' : 'garage_load_failed')
  const payload = await response.json() as GarageState
  return saveGarageState(normalizeGarageState(payload), { sync: false })
}

export async function syncGarageState(state = loadGarageState()): Promise<void> {
  if (!state.license?.garageKey) return
  const response = await fetch('/api/garage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'save',
      licenseId: state.license.licenseId,
      garageKey: state.license.garageKey,
      garage: state.garage,
      hunt: state.hunt,
    }),
  })
  if (!response.ok) throw new Error('garage_sync_failed')
}

function normalizeGarageState(state: GarageState): GarageState {
  return {
    license: state.license,
    garage: state.garage ?? {},
    hunt: state.hunt ?? {},
  }
}

export function parkInGarage(id: string, condition = 'carded'): GarageState {
  const state = loadGarageState()
  const next: GarageState = {
    ...state,
    garage: {
      ...state.garage,
      [id]: { id, condition, addedAt: state.garage[id]?.addedAt ?? new Date().toISOString() },
    },
  }
  return saveGarageState(next)
}

export function updateGarageCondition(id: string, condition: string): GarageState {
  const state = loadGarageState()
  const existing = state.garage[id]
  if (!existing) return state
  return saveGarageState({
    ...state,
    garage: {
      ...state.garage,
      [id]: { ...existing, condition },
    },
  })
}

export function removeFromGarage(id: string): GarageState {
  const state = loadGarageState()
  const { [id]: _removed, ...garage } = state.garage
  return saveGarageState({ ...state, garage })
}

export function addToHuntList(id: string): GarageState {
  const state = loadGarageState()
  return saveGarageState({
    ...state,
    hunt: {
      ...state.hunt,
      [id]: { id, addedAt: state.hunt[id]?.addedAt ?? new Date().toISOString() },
    },
  })
}

export function removeFromHuntList(id: string): GarageState {
  const state = loadGarageState()
  const { [id]: _removed, ...hunt } = state.hunt
  return saveGarageState({ ...state, hunt })
}

export function garageRating(ownedCount: number, huntCount: number, chaseCount: number, exactPhotoCount: number, completeFamilyCount: number): number {
  return ownedCount + huntCount + chaseCount * 5 + exactPhotoCount * 3 + completeFamilyCount * 10
}
