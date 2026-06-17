"use client"

import { useEffect, useState } from 'react'
import {
  createCloudLicense,
  loadCloudGarage,
  loadGarageState,
  upsertLicense,
  type LicenseProfile,
} from './garageStorage'

const LANES = [
  'JDM / Tuner',
  'Premium 1:64',
  'Mainline Hunter',
  'Matchbox Realism',
  'WWE / WCW Oddball',
  'Muscle & Hot Rod',
  'Movie / TV',
]

export default function LicenseBuilder() {
  const [handle, setHandle] = useState('Pit Lane Collector')
  const [lane, setLane] = useState(LANES[0])
  const [license, setLicense] = useState<LicenseProfile | undefined>()
  const [loginId, setLoginId] = useState('')
  const [garageKey, setGarageKey] = useState('')
  const [status, setStatus] = useState('Ready to issue a collector license.')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    const state = loadGarageState()
    if (state.license) {
      setLicense(state.license)
      setHandle(state.license.handle)
      setLane(state.license.lane)
      setLoginId(state.license.licenseId)
      setGarageKey(state.license.garageKey ?? '')
      setStatus(state.license.garageKey ? 'Cloud garage loaded on this browser.' : 'Local garage loaded on this browser.')
    }
  }, [])

  async function save() {
    setBusy(true)
    setStatus('Issuing license...')
    try {
      const next = await createCloudLicense(handle, lane)
      setLicense(next.license)
      setLoginId(next.license?.licenseId ?? '')
      setGarageKey(next.license?.garageKey ?? '')
      setStatus('License issued. Keep the garage key so you can load this garage again.')
    } catch {
      const next = upsertLicense(handle, lane)
      setLicense(next.license)
      setLoginId(next.license?.licenseId ?? '')
      setGarageKey('')
      setStatus('Saved locally. Cloud license desk was not available in this environment.')
    } finally {
      setBusy(false)
    }
  }

  async function load() {
    if (!loginId.trim() || !garageKey.trim()) {
      setStatus('Enter both the license ID and garage key.')
      return
    }
    setBusy(true)
    setStatus('Opening garage...')
    try {
      const next = await loadCloudGarage(loginId, garageKey)
      setLicense(next.license)
      setHandle(next.license?.handle ?? handle)
      setLane(next.license?.lane ?? lane)
      setStatus('Garage loaded. Your parked cars and hunt list are ready.')
    } catch {
      setStatus('Could not load that license. Check the ID and garage key.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="license-grid">
      <section className="card license-form">
        <div className="section-head">License Desk</div>
        <label>
          Collector handle
          <input className="filter-input" value={handle} onChange={event => setHandle(event.target.value)} />
        </label>
        <label>
          Favorite lane
          <select className="filter-select" value={lane} onChange={event => setLane(event.target.value)}>
            {LANES.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <button type="button" className="btn btn-accent" onClick={save} disabled={busy}>
          {busy ? 'Working...' : 'Issue License'}
        </button>
        <p>{status}</p>
        {license?.garageKey ? (
          <div className="license-key-box">
            <span>Garage key</span>
            <code>{license.garageKey}</code>
          </div>
        ) : null}
      </section>

      <section className="card license-form">
        <div className="section-head">Load Garage</div>
        <label>
          License ID
          <input className="filter-input" value={loginId} onChange={event => setLoginId(event.target.value)} placeholder="DC-1234ABCD" />
        </label>
        <label>
          Garage key
          <input className="filter-input" value={garageKey} onChange={event => setGarageKey(event.target.value)} placeholder="Your private garage key" />
        </label>
        <button type="button" className="btn btn-license" onClick={load} disabled={busy}>Load My Garage</button>
      </section>

      <section className="collector-license" aria-label="Collector license preview">
        <div className="license-top">
          <span>GrailPulse Die Cast</span>
          <strong>{license?.licenseId ?? 'DC-PENDING'}</strong>
        </div>
        <div className="license-mark">GP</div>
        <div>
          <span className="garage-kicker">Collector</span>
          <h2>{license?.handle ?? (handle || 'Pit Lane Collector')}</h2>
        </div>
        <div className="license-bottom">
          <span>{license?.lane ?? lane}</span>
          <span>{license?.garageKey ? 'Cloud garage' : license ? 'Local garage' : 'Ready to issue'}</span>
        </div>
      </section>
    </div>
  )
}
