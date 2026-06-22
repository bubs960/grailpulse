'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FamilySummary } from '@/data/diecast'

export default function HomeSearch({ families }: { families: FamilySummary[] }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const value = new URLSearchParams(window.location.search).get('q')
    if (value) setQuery(value)
  }, [])

  const matches = useMemo(() => {
    const value = query.trim().toLowerCase()
    if (!value) return []
    return families.filter(family => `${family.label} ${family.make} ${family.line} ${family.scale}`.toLowerCase().includes(value)).slice(0, 6)
  }, [families, query])

  return (
    <div className="hero-search">
      <label htmlFor="garage-search">Find a casting, brand, or line</label>
      <div className="hero-search-row">
        <input id="garage-search" className="filter-input" value={query} onChange={event => setQuery(event.target.value)} placeholder="Try Skyline, Matchbox, Car Culture..." autoComplete="off" />
        <a className="btn btn-accent" href={`/browse/${query ? `?q=${encodeURIComponent(query)}` : ''}`}>Browse garage</a>
      </div>
      {query && (
        <div className="hero-search-results" aria-live="polite">
          {matches.length ? matches.map(family => (
            <a key={family.series} href={`/series/${family.series}/`}>
              <span>{family.label}</span><small>{family.line} · {family.count} reference records</small>
            </a>
          )) : <p>No family match yet. Open the full garage to widen the search.</p>}
        </div>
      )}
    </div>
  )
}