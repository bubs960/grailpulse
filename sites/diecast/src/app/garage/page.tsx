import type { Metadata } from 'next'
import GarageDashboard, { type GarageRecord } from '../_components/GarageDashboard'
import { DIECAST_RECORDS, diecastDisplayName, familySlugFor, photoProxyUrl, seriesLabel, topConditionValue } from '@/data/diecast'

export const metadata: Metadata = {
  title: 'My Garage',
  description: 'Track parked diecast cars, hunt-list targets, garage rating, badges, and collector license progress.',
}

export default function GaragePage() {
  const records: GarageRecord[] = DIECAST_RECORDS.map(record => {
    const family = familySlugFor(record)
    return {
      id: record.diecast_id,
      name: diecastDisplayName(record),
      family,
      familyLabel: seriesLabel(family),
      brand: record.brand,
      line: record.line,
      scale: record.scale || 'Unknown',
      color: record.color || 'Unknown color',
      chase: record.chase_type || 'none',
      photoUrl: photoProxyUrl(record.photo_url),
      photoMatch: record.photo_match_level,
      topValue: topConditionValue(record),
      detailUrl: `/coin/${record.diecast_id}/`,
    }
  })

  return (
    <main className="track-page">
      <div className="container">
        <section className="page-hero compact-hero">
          <div className="eyebrow">My Garage</div>
          <h1>Your Diecast Garage</h1>
          <p>
            Park owned cars, queue hunt-list targets, and watch your collector license build a rating.
            A licensed garage syncs through the MVP License Locker, with local browser fallback while we tune the feel fast.
          </p>
        </section>
        <GarageDashboard records={records} />
      </div>
    </main>
  )
}
