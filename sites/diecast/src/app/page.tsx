import type { Metadata } from 'next'
import { DIECAST_META, DIECAST_RECORDS, getFeaturedSeries, getFamilySummaries, getMakeSummaries } from '@/data/diecast'
import SeriesSearch from './_components/SeriesSearch'
import GarageIntro from './_components/GarageIntro'

export const metadata: Metadata = {
  title: 'Die Cast Price Guide - Hot Wheels, Matchbox & 1:64 Values',
  description: 'Browse Hot Wheels, Matchbox, Jada, and premium 1:64 die-cast families with casting variants, condition seed values, card regions, chase tags, and photo confidence.',
}

export default function HomePage() {
  const featured = getFeaturedSeries()
  const all = getFamilySummaries()
  const makes = getMakeSummaries().slice(0, 10)
  const photoCount = DIECAST_RECORDS.filter(record => record.photo_url).length
  const exactPhotoCount = DIECAST_RECORDS.filter(record => record.photo_match_level === 'variant_exact').length
  const heroFamilies = featured.filter(family => family.photoUrl).slice(0, 3)

  return (
    <main className="track-page">
      <div className="container">
        <section className="hero-band race-hero">
          <div className="hero-copy">
            <div className="eyebrow">Welcome lap / Vertical 3</div>
            <h1>Die Cast Pit Lane</h1>
            <p>
              Start in the collector garage, then roll into a race-grid catalog for castings, deco variants,
              card regions, wheel/base differences, and condition ladders across Hot Wheels, Matchbox, Jada, and premium 1:64 lanes.
            </p>
            <div className="hero-tags" aria-label="Collector lanes">
              <span>carded comps</span>
              <span>variant exact photos</span>
              <span>Real Riders / mainline / chase</span>
            </div>
            <div className="hero-actions">
              <a href="/license/" className="btn btn-accent">Get Your License</a>
              <a href="/garage/" className="btn btn-license">Load My Garage</a>
            </div>
          </div>
          <GarageIntro families={heroFamilies} />
          <div className="stat-grid timing-board">
            <Stat label="Records" value={DIECAST_META.total_records.toLocaleString()} />
            <Stat label="Families" value={all.length.toLocaleString()} />
            <Stat label="Exact photos" value={exactPhotoCount.toLocaleString()} />
            <Stat label="Photo records" value={photoCount.toLocaleString()} />
          </div>
        </section>

        <section style={{ marginBottom: 44 }}>
          <div className="section-head">Pit Wall Brands</div>
          <div className="make-grid">
            {makes.map(({ make, count }) => (
              <a key={make} href={`/browse/?make=${encodeURIComponent(make)}`} className="series-card">
                <div className="name">{make}</div>
                <div className="count">{count.toLocaleString()} records</div>
              </a>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 44 }}>
          <div className="section-head">Starting Grid Families</div>
          <div className="family-grid">
            {featured.map(family => (
              <a key={family.series} href={`/series/${family.series}/`} className="series-card family-card">
                {family.photoUrl ? <img src={family.photoUrl} alt="" /> : <div className="photo-tile">No photo</div>}
                <div className="name">{family.label}</div>
                <div className="count">{family.count} variant{family.count === 1 ? '' : 's'} · {family.scale}</div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="section-head">Full Paddock ({all.length})</div>
          <SeriesSearch all={all} />
        </section>
      </div>
    </main>
  )
}

function Stat({ label, value }: { label: string, value: string }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}



