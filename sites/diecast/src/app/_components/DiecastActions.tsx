"use client"

import { useEffect, useState } from 'react'
import { addToHuntList, CONDITION_OPTIONS, loadGarageState, parkInGarage, removeFromGarage, removeFromHuntList, type GarageState } from './garageStorage'

interface Props {
  id: string
  defaultCondition?: string
}

export default function DiecastActions({ id, defaultCondition = 'carded' }: Props) {
  const [state, setState] = useState<GarageState>(() => ({ garage: {}, hunt: {} }))
  const [condition, setCondition] = useState(defaultCondition)

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

  const inGarage = Boolean(state.garage[id])
  const inHunt = Boolean(state.hunt[id])

  return (
    <div className="garage-action-panel">
      <div>
        <div className="section-head">Garage Actions</div>
        <p>Park this reference record in your garage or mark it as a future hunt target.</p>
      </div>

      <div className="garage-action-row">
        <select
          className="filter-select"
          value={condition}
          onChange={event => setCondition(event.target.value)}
          aria-label="Garage condition"
        >
          {CONDITION_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <button
          type="button"
          className={`btn ${inGarage ? 'btn-ghost' : 'btn-accent'}`}
          onClick={() => setState(inGarage ? removeFromGarage(id) : parkInGarage(id, condition))}
        >
          {inGarage ? 'Remove from Garage' : 'Park in Garage'}
        </button>
        <button
          type="button"
          className={`btn ${inHunt ? 'btn-ghost' : 'btn-license'}`}
          onClick={() => setState(inHunt ? removeFromHuntList(id) : addToHuntList(id))}
        >
          {inHunt ? 'Remove Hunt' : 'Add to Hunt List'}
        </button>
      </div>

      <div className="garage-action-links">
        <a href="/license/">Get Your License</a>
        <a href="/garage/">View My Garage</a>
      </div>
    </div>
  )
}
