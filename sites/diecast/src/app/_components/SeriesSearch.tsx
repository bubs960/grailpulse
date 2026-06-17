'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FamilySummary } from '@/data/diecast'

interface Props {
  all: FamilySummary[]
  makes?: string[]
  scales?: string[]
  initialMake?: string
  initialScale?: string
}

export default function SeriesSearch({ all, makes = [], scales = [], initialMake = '', initialScale = '' }: Props) {
  const [query, setQuery] = useState('')
  const [make, setMake] = useState(initialMake)
  const [scale, setScale] = useState(initialScale)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const makeParam = params.get('make')
    const scaleParam = params.get('scale')
    if (makeParam) setMake(makeParam)
    if (scaleParam) setScale(scaleParam)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all.filter(family => {
      const text = `${family.label} ${family.make} ${family.line} ${family.scale}`.toLowerCase()
      const queryOk = !q || text.includes(q)
      const makeOk = !make || family.make === make
      const scaleOk = !scale || family.scale === scale
      return queryOk && makeOk && scaleOk
    })
  }, [all, query, make, scale])

  return (
    <div style={{ marginBottom: 32 }}>
      <div className="filter-row">
        <input
          type="text"
          placeholder="Search brand, casting, line..."
          value={query}
          onChange={event => setQuery(event.target.value)}
          aria-label="Search diecast families"
          className="filter-input"
        />
        {makes.length > 0 && (
          <select value={make} onChange={event => setMake(event.target.value)} className="filter-select" aria-label="Filter by brand">
            <option value="">All brands</option>
            {makes.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        )}
        {scales.length > 0 && (
          <select value={scale} onChange={event => setScale(event.target.value)} className="filter-select" aria-label="Filter by scale">
            <option value="">All scales</option>
            {scales.map(item => <option key={item} value={item}>{item}</option>)}
          </select>
        )}
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 16 }}>
        {filtered.length.toLocaleString()} of {all.length.toLocaleString()} families
      </div>

      {filtered.length > 0 ? (
        <div className="family-grid">
          {filtered.map(family => (
            <a key={family.series} href={`/series/${family.series}/`} className="series-card family-card">
              {family.photoUrl ? <img src={family.photoUrl} alt="" /> : <div className="photo-tile">No photo</div>}
              <div className="name">{family.label}</div>
              <div className="count">{family.count} variant{family.count === 1 ? '' : 's'} · {family.line} · {family.scale}</div>
              {family.topPrice > 0 && <div className="price-line">Top seed value ${family.topPrice.toLocaleString()}</div>}
            </a>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center' }}>
          <p>No diecast families match the current filters.</p>
        </div>
      )}
    </div>
  )
}




