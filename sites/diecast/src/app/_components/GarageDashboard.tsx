"use client"

import { useEffect, useMemo, useState } from 'react'
import {
  CONDITION_OPTIONS,
  garageRating,
  loadGarageState,
  removeFromGarage,
  removeFromHuntList,
  updateGarageCondition,
  type GarageState,
} from './garageStorage'

export interface GarageRecord {
  id: string
  name: string
  family: string
  familyLabel: string
  brand: string
  line: string
  scale: string
  color: string
  chase: string
  photoUrl?: string
  photoMatch?: string
  topValue: number
  detailUrl: string
}

interface Props {
  records: GarageRecord[]
}

export default function GarageDashboard({ records }: Props) {
  const [state, setState] = useState<GarageState>(() => ({ garage: {}, hunt: {} }))

  useEffect(() => {
    const sync = () => setState(loadGarageState())
    sync()
    window.addEventListener('storage', sync)
    window.addEventListener('diecast-garage-updated', sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener('diecast-garage-updated', sync)
    }
  }, [])

  const byId = useMemo(() => new Map(records.map(record => [record.id, record])), [records])
  const owned = Object.values(state.garage).map(entry => ({ entry, record: byId.get(entry.id) })).filter(item => item.record)
  const hunted = Object.values(state.hunt).map(entry => ({ entry, record: byId.get(entry.id) })).filter(item => item.record)
  const ownedFamilies = new Set(owned.map(item => item.record?.family))
  const chaseCount = owned.filter(item => item.record?.chase && item.record.chase !== 'none').length
  const exactPhotoCount = owned.filter(item => item.record?.photoMatch === 'variant_exact').length
  const familyTotals = new Map<string, number>()
  for (const record of records) familyTotals.set(record.family, (familyTotals.get(record.family) ?? 0) + 1)
  const ownedByFamily = new Map<string, number>()
  for (const item of owned) {
    if (item.record) ownedByFamily.set(item.record.family, (ownedByFamily.get(item.record.family) ?? 0) + 1)
  }
  const completeFamilyCount = Array.from(ownedByFamily.entries()).filter(([family, count]) => count >= (familyTotals.get(family) ?? Infinity)).length
  const rating = garageRating(owned.length, hunted.length, chaseCount, exactPhotoCount, completeFamilyCount)
  const estimatedValue = owned.reduce((sum, item) => sum + (item.record?.topValue ?? 0), 0)
  const badges = buildBadges(owned.length, hunted.length, ownedFamilies.size, chaseCount, exactPhotoCount, completeFamilyCount, owned)
  const starterProgress = Math.min(owned.length, 50)

  return (
    <div className="garage-dashboard">
      <section className="garage-license-strip">
        <div>
          <span className="garage-kicker">Collector license</span>
          <strong>{state.license?.handle ?? 'Unlicensed Collector'}</strong>
          <small>
            {state.license
              ? `${state.license.licenseId} · ${state.license.garageKey ? 'cloud synced' : 'local browser garage'}`
              : 'Get your license to stamp this garage'}
          </small>
        </div>
        <a href="/license/" className="btn btn-license">{state.license ? 'Tune License' : 'Get Your License'}</a>
      </section>

      <section className="garage-score-grid">
        <GarageStat label="Garage Rating" value={rating.toLocaleString()} />
        <GarageStat label="Parked" value={owned.length.toLocaleString()} />
        <GarageStat label="Hunt List" value={hunted.length.toLocaleString()} />
        <GarageStat label="Seed Value" value={`$${estimatedValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
      </section>

      <section className="card starter-card">
        <div className="starter-copy">
          <div className="section-head">Starter Grid</div>
          <p>{starterProgress}/50 cars loaded. The first 50 turns the garage from a note pad into a real collector lane.</p>
        </div>
        <div className="progress-rail" aria-label="Starter grid progress">
          <span style={{ width: `${(starterProgress / 50) * 100}%` }} />
        </div>
      </section>

      <section>
        <div className="section-head">Badges</div>
        <div className="badge-grid">
          {badges.map(badge => (
            <div key={badge.name} className={`garage-badge ${badge.unlocked ? 'unlocked' : ''}`}>
              <strong>{badge.name}</strong>
              <span>{badge.detail}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="garage-columns">
        <div>
          <div className="section-head">Parked Cars</div>
          {owned.length ? (
            <div className="garage-list">
              {owned.map(({ entry, record }) => record && (
                <GarageCard
                  key={entry.id}
                  record={record}
                  condition={entry.condition}
                  onCondition={condition => setState(updateGarageCondition(record.id, condition))}
                  onRemove={() => setState(removeFromGarage(record.id))}
                />
              ))}
            </div>
          ) : (
            <EmptyGarage title="No cars parked yet" body="Open a variant page and park the first one in your garage." href="/browse/" label="Browse Grid" />
          )}
        </div>

        <div>
          <div className="section-head">Hunt List</div>
          {hunted.length ? (
            <div className="garage-list">
              {hunted.map(({ record }) => record && (
                <HuntCard key={record.id} record={record} onRemove={() => setState(removeFromHuntList(record.id))} />
              ))}
            </div>
          ) : (
            <EmptyGarage title="No hunts queued" body="Mark cars you want and this becomes your peg-wall target list." href="/browse/" label="Find Targets" />
          )}
        </div>
      </section>
    </div>
  )
}

function GarageStat({ label, value }: { label: string, value: string }) {
  return (
    <div className="garage-stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function GarageCard({ record, condition, onCondition, onRemove }: {
  record: GarageRecord
  condition: string
  onCondition: (condition: string) => void
  onRemove: () => void
}) {
  return (
    <article className="garage-item">
      {record.photoUrl ? <img src={record.photoUrl} alt="" /> : <div className="photo-tile">Photo pending</div>}
      <div>
        <a href={record.detailUrl}><strong>{record.name}</strong></a>
        <span>{record.line} · {record.scale} · {record.color}</span>
        <div className="garage-card-actions">
          <select className="filter-select" value={condition} onChange={event => onCondition(event.target.value)} aria-label={`Condition for ${record.name}`}>
            {CONDITION_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <button type="button" className="btn btn-ghost" onClick={onRemove}>Remove</button>
        </div>
      </div>
    </article>
  )
}

function HuntCard({ record, onRemove }: { record: GarageRecord, onRemove: () => void }) {
  return (
    <article className="garage-item hunt-item">
      {record.photoUrl ? <img src={record.photoUrl} alt="" /> : <div className="photo-tile">Photo pending</div>}
      <div>
        <a href={record.detailUrl}><strong>{record.name}</strong></a>
        <span>{record.familyLabel} · top seed ${record.topValue.toLocaleString()}</span>
        <div className="garage-card-actions">
          <a className="btn btn-license" href={record.detailUrl}>Open</a>
          <button type="button" className="btn btn-ghost" onClick={onRemove}>Clear</button>
        </div>
      </div>
    </article>
  )
}

function EmptyGarage({ title, body, href, label }: { title: string, body: string, href: string, label: string }) {
  return (
    <div className="card empty-garage">
      <strong>{title}</strong>
      <p>{body}</p>
      <a className="btn btn-accent" href={href}>{label}</a>
    </div>
  )
}

function buildBadges(
  ownedCount: number,
  huntCount: number,
  familyCount: number,
  chaseCount: number,
  exactPhotoCount: number,
  completeFamilyCount: number,
  owned: Array<{ record?: GarageRecord }>
) {
  const hasOddball = owned.some(item => /wwe|wcw|movie|entertainment/i.test(`${item.record?.line} ${item.record?.familyLabel}`))
  return [
    { name: 'First Park', detail: ownedCount >= 1 ? 'First car loaded' : 'Park 1 car', unlocked: ownedCount >= 1 },
    { name: 'Starter Grid', detail: ownedCount >= 10 ? '10 cars loaded' : `${ownedCount}/10 cars`, unlocked: ownedCount >= 10 },
    { name: 'Lane Builder', detail: familyCount >= 5 ? '5 families touched' : `${familyCount}/5 families`, unlocked: familyCount >= 5 },
    { name: 'Hunt Board', detail: huntCount >= 5 ? '5 targets queued' : `${huntCount}/5 targets`, unlocked: huntCount >= 5 },
    { name: 'Chase Spotter', detail: chaseCount >= 1 ? 'Chase in garage' : 'Park a chase', unlocked: chaseCount >= 1 },
    { name: 'Photo Scout', detail: exactPhotoCount >= 3 ? '3 exact-photo cars' : `${exactPhotoCount}/3 exact photos`, unlocked: exactPhotoCount >= 3 },
    { name: 'Oddball Lane', detail: hasOddball ? 'Licensed oddball found' : 'Park WWE/WCW/movie', unlocked: hasOddball },
    { name: 'Family Sweep', detail: completeFamilyCount >= 1 ? 'Completed a family' : 'Complete a family', unlocked: completeFamilyCount >= 1 },
  ]
}
