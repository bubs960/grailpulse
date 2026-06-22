'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FamilySummary } from '@/data/diecast'

interface Props { all: FamilySummary[]; makes?: string[]; scales?: string[]; lines?: string[]; initialMake?: string; initialScale?: string; initialLine?: string }

export default function SeriesSearch({ all, makes = [], scales = [], lines = [], initialMake = '', initialScale = '', initialLine = '' }: Props) {
  const [query, setQuery] = useState('')
  const [make, setMake] = useState(initialMake)
  const [scale, setScale] = useState(initialScale)
  const [line, setLine] = useState(initialLine)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setQuery(params.get('q') || '')
    setMake(params.get('make') || initialMake)
    setScale(params.get('scale') || initialScale)
    setLine(params.get('line') || initialLine)
  }, [initialLine, initialMake, initialScale])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return all.filter(family => {
      const text = `${family.label} ${family.make} ${family.line} ${family.scale}`.toLowerCase()
      return (!q || text.includes(q)) && (!make || family.make === make) && (!scale || family.scale === scale) && (!line || family.line === line)
    })
  }, [all, query, make, scale, line])

  const hasFilters = Boolean(query || make || scale || line)

  return (
    <div className="browse-filters">
      <div className="filter-row filter-row-wide">
        <input type="search" placeholder="Search brand, casting, line, chase..." value={query} onChange={event => setQuery(event.target.value)} aria-label="Search diecast families" className="filter-input" />
        {makes.length > 0 && <select value={make} onChange={event => setMake(event.target.value)} className="filter-select" aria-label="Filter by brand"><option value="">All brands</option>{makes.map(item => <option key={item}>{item}</option>)}</select>}
        {lines.length > 0 && <select value={line} onChange={event => setLine(event.target.value)} className="filter-select" aria-label="Filter by line"><option value="">All lines</option>{lines.map(item => <option key={item}>{item}</option>)}</select>}
        {scales.length > 0 && <select value={scale} onChange={event => setScale(event.target.value)} className="filter-select" aria-label="Filter by scale"><option value="">All scales</option>{scales.map(item => <option key={item}>{item}</option>)}</select>}
      </div>

      <div className="filter-summary">
        <span><strong>{filtered.length.toLocaleString()}</strong> of {all.length.toLocaleString()} casting families</span>
        {hasFilters && <button type="button" className="filter-clear" onClick={() => { setQuery(''); setMake(''); setScale(''); setLine('') }}>Clear filters</button>}
      </div>

      {filtered.length > 0 ? (
        <div className="family-grid">
          {filtered.map(family => (
            <a key={family.series} href={`/series/${family.series}/`} className="series-card family-card">
              {family.photoUrl ? <img src={family.photoUrl} alt={`${family.label} representative die-cast`} loading="lazy" /> : <div className="photo-tile">Photo pending</div>}
              <div className="name">{family.label}</div>
              <div className="count">{family.count} variant{family.count === 1 ? '' : 's'} · {family.line} · {family.scale}</div>
              {family.topPrice > 0 && <div className="price-line">Top seed estimate ${family.topPrice.toLocaleString()}</div>}
            </a>
          ))}
        </div>
      ) : <div className="card empty-results"><strong>No casting family matches those filters.</strong><p>Try a broader model name, brand, or collector line.</p></div>}
    </div>
  )
}