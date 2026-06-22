"use client"

import { useEffect, useMemo, useState } from 'react'
import { CONDITION_OPTIONS, garageRating, loadGarageState, removeFromGarage, removeFromHuntList, updateGarageCondition, type GarageState } from './garageStorage'

export interface GarageRecord { id: string; name: string; family: string; familyLabel: string; brand: string; line: string; scale: string; color: string; chase: string; photoUrl?: string; photoMatch?: string; topValue: number; detailUrl: string }
type CompactRecord = [string, string, string, string, string, string, string, string, string, number]
type CompactCatalog = { generatedAt?: string; totalRecords: number; records: Record<string, CompactRecord> }

function proxyPhoto(url: string) {
  if (!url) return undefined
  try {
    const host = new URL(url).hostname
    if (['i.ebayimg.com', 'images.mercari.com', 'u-mercari-images.mercdn.net', 'static.mercdn.net'].includes(host)) return `/photo?src=${encodeURIComponent(url)}`
  } catch {}
  return url
}

function expandRecord(id: string, value: CompactRecord): GarageRecord {
  const [name, family, brand, line, scale, color, chase, photo, photoMatch, topValue] = value
  return { id, name, family, familyLabel: name.replace(/^Reference\s+/, ''), brand, line, scale, color, chase, photoUrl: proxyPhoto(photo), photoMatch, topValue, detailUrl: `/coin/${id}/` }
}

export default function GarageDashboard() {
  const [state, setState] = useState<GarageState>(() => ({ garage: {}, hunt: {} }))
  const [catalog, setCatalog] = useState<CompactCatalog | null>(null)
  const [catalogStatus, setCatalogStatus] = useState<'idle' | 'loading' | 'ready' | 'error'>('idle')

  useEffect(() => {
    const sync = () => setState(loadGarageState())
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('diecast-garage-updated', sync)
    return () => { window.removeEventListener('storage', sync); window.removeEventListener('diecast-garage-updated', sync) }
  }, [])

  const savedIds = useMemo(() => Array.from(new Set([...Object.keys(state.garage), ...Object.keys(state.hunt)])), [state])

  useEffect(() => {
    if (!savedIds.length || catalog || catalogStatus === 'loading') return
    setCatalogStatus('loading')
    fetch('/garage-catalog.json').then(response => {
      if (!response.ok) throw new Error('catalog_load_failed')
      return response.json()
    }).then((data: CompactCatalog) => { setCatalog(data); setCatalogStatus('ready') }).catch(() => setCatalogStatus('error'))
  }, [catalog, catalogStatus, savedIds.length])

  const byId = useMemo(() => {
    const map = new Map<string, GarageRecord>()
    if (!catalog) return map
    for (const id of savedIds) if (catalog.records[id]) map.set(id, expandRecord(id, catalog.records[id]))
    return map
  }, [catalog, savedIds])

  const owned = Object.values(state.garage).map(entry => ({ entry, record: byId.get(entry.id) })).filter(item => item.record)
  const hunted = Object.values(state.hunt).map(entry => ({ entry, record: byId.get(entry.id) })).filter(item => item.record)
  const ownedFamilies = new Set(owned.map(item => item.record?.family))
  const chaseCount = owned.filter(item => item.record?.chase && item.record.chase !== 'none').length
  const exactPhotoCount = owned.filter(item => item.record?.photoMatch === 'variant_exact').length
  const rating = garageRating(owned.length, hunted.length, chaseCount, exactPhotoCount, 0)
  const estimatedValue = owned.reduce((sum, item) => sum + (item.record?.topValue ?? 0), 0)
  const badges = buildBadges(owned.length, hunted.length, ownedFamilies.size, chaseCount, exactPhotoCount, owned)
  const starterProgress = Math.min(owned.length, 50)
  const loadingSaved = savedIds.length > 0 && catalogStatus === 'loading'

  return (
    <div className="garage-dashboard">
      <section className="garage-license-strip">
        <div><span className="garage-kicker">Collector garage</span><strong>{state.license?.handle ?? 'Local Browser Garage'}</strong><small>{state.license?.garageKey ? `${state.license.licenseId} · private key sync enabled` : 'Stored on this browser unless you enable garage sync'}</small></div>
        <a href="/license/" className="btn btn-license">{state.license ? 'Manage Sync' : 'Enable Sync'}</a>
      </section>

      <section className="garage-score-grid">
        <GarageStat label="Garage Rating" value={rating.toLocaleString()} /><GarageStat label="Parked" value={Object.keys(state.garage).length.toLocaleString()} /><GarageStat label="Hunt List" value={Object.keys(state.hunt).length.toLocaleString()} /><GarageStat label="Seed Estimate" value={`$${estimatedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
      </section>

      <section className="card starter-card"><div className="starter-copy"><div className="section-head">Starter shelf</div><p>{starterProgress}/50 cars parked. Build around castings you actually care about—not a completion treadmill.</p></div><div className="progress-rail" aria-label={`${starterProgress} of 50 starter cars`}><span style={{ width: `${(starterProgress / 50) * 100}%` }} /></div></section>

      <section><div className="section-head">Garage badges</div><div className="badge-grid">{badges.map(badge => <div key={badge.name} className={`garage-badge ${badge.unlocked ? 'unlocked' : ''}`}><strong>{badge.name}</strong><span>{badge.detail}</span></div>)}</div></section>

      {loadingSaved && <div className="card garage-loading" role="status">Opening your saved garage…</div>}
      {catalogStatus === 'error' && <div className="card empty-garage"><strong>Garage index unavailable</strong><p>Your saved IDs are still safe in this browser. Reload to try opening their details again.</p></div>}

      {!loadingSaved && catalogStatus !== 'error' && <section className="garage-columns">
        <div><div className="section-head">Parked cars</div>{owned.length ? <div className="garage-list">{owned.map(({ entry, record }) => record && <GarageCard key={entry.id} record={record} condition={entry.condition} onCondition={condition => setState(updateGarageCondition(record.id, condition))} onRemove={() => setState(removeFromGarage(record.id))} />)}</div> : <EmptyGarage title="No cars parked yet" body="Open a reference record and park the first car in your display." href="/browse/" label="Browse castings" />}</div>
        <div><div className="section-head">Hunt list</div>{hunted.length ? <div className="garage-list">{hunted.map(({ record }) => record && <HuntCard key={record.id} record={record} onRemove={() => setState(removeFromHuntList(record.id))} />)}</div> : <EmptyGarage title="No hunts queued" body="Mark missing castings and turn this into your next peg, swap-meet, or show target list." href="/browse/" label="Find targets" />}</div>
      </section>}
      <p className="garage-data-note">Seed estimates compare condition lanes; they are not sold-comp valuations or appraisals.</p>
    </div>
  )
}

function GarageStat({ label, value }: { label: string, value: string }) { return <div className="garage-stat"><strong>{value}</strong><span>{label}</span></div> }
function GarageCard({ record, condition, onCondition, onRemove }: { record: GarageRecord; condition: string; onCondition: (condition: string) => void; onRemove: () => void }) { return <article className="garage-item">{record.photoUrl ? <img src={record.photoUrl} alt={`${record.name} die-cast`} loading="lazy" /> : <div className="photo-tile">Photo pending</div>}<div><a href={record.detailUrl}><strong>{record.name}</strong></a><span>{record.line} · {record.scale} · {record.color}</span><div className="garage-card-actions"><select className="filter-select" value={condition} onChange={event => onCondition(event.target.value)} aria-label={`Condition for ${record.name}`}>{CONDITION_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><button type="button" className="btn btn-ghost" onClick={onRemove}>Remove</button></div></div></article> }
function HuntCard({ record, onRemove }: { record: GarageRecord, onRemove: () => void }) { return <article className="garage-item hunt-item">{record.photoUrl ? <img src={record.photoUrl} alt={`${record.name} die-cast`} loading="lazy" /> : <div className="photo-tile">Photo pending</div>}<div><a href={record.detailUrl}><strong>{record.name}</strong></a><span>{record.line} · top seed estimate ${record.topValue.toLocaleString()}</span><div className="garage-card-actions"><a className="btn btn-license" href={record.detailUrl}>Inspect</a><button type="button" className="btn btn-ghost" onClick={onRemove}>Clear</button></div></div></article> }
function EmptyGarage({ title, body, href, label }: { title: string, body: string, href: string, label: string }) { return <div className="card empty-garage"><strong>{title}</strong><p>{body}</p><a className="btn btn-accent" href={href}>{label}</a></div> }
function buildBadges(ownedCount: number, huntCount: number, familyCount: number, chaseCount: number, exactPhotoCount: number, owned: Array<{ record?: GarageRecord }>) { const hasOddball = owned.some(item => /wwe|wcw|movie|entertainment/i.test(`${item.record?.line} ${item.record?.familyLabel}`)); return [
  { name: 'First Park', detail: ownedCount >= 1 ? 'First car parked' : 'Park 1 car', unlocked: ownedCount >= 1 },
  { name: 'Starter Shelf', detail: ownedCount >= 10 ? '10 cars parked' : `${ownedCount}/10 cars`, unlocked: ownedCount >= 10 },
  { name: 'Casting Loyalist', detail: familyCount >= 5 ? '5 families represented' : `${familyCount}/5 families`, unlocked: familyCount >= 5 },
  { name: 'Hunt Board', detail: huntCount >= 5 ? '5 targets queued' : `${huntCount}/5 targets`, unlocked: huntCount >= 5 },
  { name: 'Chase Spotter', detail: chaseCount >= 1 ? 'Chase in garage' : 'Park a chase', unlocked: chaseCount >= 1 },
  { name: 'Photo Bench', detail: exactPhotoCount >= 3 ? '3 strong photo matches' : `${exactPhotoCount}/3 strong matches`, unlocked: exactPhotoCount >= 3 },
  { name: 'Oddball Lane', detail: hasOddball ? 'Licensed oddball parked' : 'Park WWE/WCW/movie', unlocked: hasOddball },
] }