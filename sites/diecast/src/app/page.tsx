import type { Metadata } from 'next'
import { DIECAST_META, DIECAST_RECORDS, getFeaturedSeries, getFamilySummaries, getMakeSummaries } from '@/data/diecast'
import GarageIntro from './_components/GarageIntro'
import HomeSearch from './_components/HomeSearch'

export const metadata: Metadata = {
  title: 'Die Cast Guide - Castings, Variants & Seed Values',
  description: 'Browse 13,000+ Hot Wheels, Matchbox, Jada, Auto World, MINI GT, Tarmac Works, and premium 1:64 records with variant identity, photo confidence, and condition-based seed estimates.',
  alternates: { canonical: '/' },
}

export default function HomePage() {
  const featured = getFeaturedSeries()
  const all = getFamilySummaries()
  const makes = getMakeSummaries()
  const photoCount = DIECAST_RECORDS.filter(record => record.photo_url).length
  const exactPhotoCount = DIECAST_RECORDS.filter(record => record.photo_match_level === 'variant_exact').length
  const heroFamilies = featured.filter(family => family.photoUrl).slice(0, 4)

  return (
    <main id="main-content" className="track-page">
      <div className="container">
        <section className="hero-band collector-hero">
          <div className="hero-copy">
            <div className="eyebrow">Collector garage</div>
            <h1>Know the car before you price the card.</h1>
            <p>
              Search casting families, separate carded from loose, inspect wheel and base differences,
              and follow mainlines, premiums, chases, and display-scale favorites without flattening every release into one listing.
            </p>
            <HomeSearch families={all} />
            <div className="hero-tags" aria-label="Guide data status">
              <span>condition-based seed estimates</span>
              <span>{exactPhotoCount.toLocaleString()} strong photo matches</span>
              <span>corrections open</span>
            </div>
            <div className="hero-actions">
              <a href="/browse/" className="btn btn-accent">Browse castings</a>
              <a href="/methodology/" className="btn btn-ghost">How values work</a>
            </div>
          </div>

          <div className="hero-object-grid" aria-label="Featured die-cast casting families">
            {heroFamilies.map((family, index) => (
              <a key={family.series} href={`/series/${family.series}/`} className={`hero-object hero-object-${index + 1}`}>
                <span className="object-bay">Bay {String(index + 1).padStart(2, '0')}</span>
                <img src={family.photoUrl} alt={`${family.label} representative die-cast`} loading={index < 2 ? 'eager' : 'lazy'} />
                <strong>{family.label}</strong>
                <small>{family.line} · {family.count} reference records</small>
              </a>
            ))}
          </div>
        </section>

        <section className="trust-rail" aria-label="Current guide status">
          <div><strong>{DIECAST_META.total_records.toLocaleString()}</strong><span>reference records</span></div>
          <div><strong>{all.length.toLocaleString()}</strong><span>casting families</span></div>
          <div><strong>{makes.length}</strong><span>collector brands</span></div>
          <div><strong>{photoCount.toLocaleString()}</strong><span>photo records</span></div>
          <p><strong>Pricing status:</strong> seed estimates for comparison—not verified sold comps or appraisals.</p>
        </section>

        <section className="collector-paths" aria-labelledby="collector-paths-title">
          <div className="section-head" id="collector-paths-title">Choose your shelf</div>
          <div className="collector-path-grid">
            <a href="/browse/?q=mainline" className="collector-path-card">
              <span>Mainline wall</span><strong>Case codes, colors, wheel swaps, and peg-hunt favorites.</strong>
            </a>
            <a href="/browse/?q=premium" className="collector-path-card">
              <span>Premium case</span><strong>Real Riders, metal bases, true-scale detail, and display pieces.</strong>
            </a>
            <a href="/browse/?q=chase" className="collector-path-card">
              <span>Chase board</span><strong>Treasure Hunts and chase tags—with rarity claims kept in check.</strong>
            </a>
          </div>
        </section>

        <section className="home-garage-section">
          <div>
            <div className="section-head">Open the garage</div>
            <h2>Park specific records. Keep the hunt list honest.</h2>
            <p>Build a browser garage first, then issue a private garage key only if you want it available on another device.</p>
            <div className="hero-actions">
              <a href="/garage/" className="btn btn-license">View my garage</a>
              <a href="/license/" className="btn btn-ghost">Garage sync options</a>
            </div>
          </div>
          <GarageIntro families={heroFamilies.slice(0, 3)} />
        </section>

        <section className="home-section">
          <div className="section-head">Brand bays</div>
          <div className="make-grid">
            {makes.map(({ make, count }) => (
              <a key={make} href={`/browse/?make=${encodeURIComponent(make)}`} className="series-card">
                <div className="name">{make}</div><div className="count">{count.toLocaleString()} records</div>
              </a>
            ))}
          </div>
        </section>

        <section className="home-section">
          <div className="section-head">Casting families worth opening</div>
          <div className="family-grid featured-family-grid">
            {featured.slice(0, 8).map(family => (
              <a key={family.series} href={`/series/${family.series}/`} className="series-card family-card">
                {family.photoUrl ? <img src={family.photoUrl} alt={`${family.label} representative die-cast`} loading="lazy" /> : <div className="photo-tile">Photo pending</div>}
                <div className="name">{family.label}</div>
                <div className="count">{family.count} variant{family.count === 1 ? '' : 's'} · {family.line} · {family.scale}</div>
              </a>
            ))}
          </div>
          <div className="browse-all-row">
            <div><strong>All {all.length} families are in the garage.</strong><p>Filter by brand, line, scale, casting, or collector keyword.</p></div>
            <a href="/browse/" className="btn btn-accent">Browse the full garage</a>
          </div>
        </section>
      </div>
    </main>
  )
}
