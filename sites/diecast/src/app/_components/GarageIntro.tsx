"use client"

import { useState } from 'react'
import type { FamilySummary } from '@/data/diecast'

interface Props {
  families: FamilySummary[]
}

export default function GarageIntro({ families }: Props) {
  const [open, setOpen] = useState(false)
  const visible = families.slice(0, 3)

  return (
    <div className={`garage-bay ${open ? 'open' : ''}`}>
      <div className="garage-header">
        <div>
          <span className="garage-kicker">Collector garage</span>
          <strong>Start your engines</strong>
        </div>
        <button type="button" onClick={() => setOpen(value => !value)} aria-pressed={open}>
          {open ? 'Close bay' : 'Open bay'}
        </button>
      </div>

      <div className="garage-window" aria-live="polite">
        <div className="garage-door" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>

        <div className="garage-floor">
          <div className="lane-copy">
            <span className="lane-light" aria-hidden="true" />
            <div>
              <strong>Welcome to the paddock</strong>
              <p>Pick a lane: peg-hunt mainlines, premium Real Riders, carded condition comps, or oddball licensed diecast.</p>
            </div>
          </div>

          <div className="garage-family-strip">
            {visible.map((family, index) => (
              <a key={family.series} href={`/series/${family.series}/`} className="garage-family-card">
                <span className="bay-slot">BAY {index + 1}</span>
                {family.photoUrl ? <img src={family.photoUrl} alt="" /> : <span className="garage-placeholder">No photo</span>}
                <strong>{family.label}</strong>
                <small>{family.count} variants · {family.scale}</small>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
