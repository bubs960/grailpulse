import type { Metadata } from 'next'
import { getAllLines, getAllMakes, getAllScales, getFamilySummaries } from '@/data/diecast'
import SeriesSearch from '../_components/SeriesSearch'

export const metadata: Metadata = {
  title: 'Browse Die Cast Castings & Variants',
  description: 'Search and filter die-cast casting families by brand, line, scale, model, and collector lane.',
  alternates: { canonical: '/browse/' },
}

export default function BrowsePage() {
  return (
    <main id="main-content" className="track-page">
      <div className="container">
        <nav className="breadcrumb" aria-label="Breadcrumb"><a href="/">Die Cast</a><span>Browse</span></nav>
        <section className="page-hero compact-hero">
          <div className="eyebrow">Casting directory</div>
          <h1>Browse the collector garage</h1>
          <p>Move from a broad brand or line into the exact casting family, then compare colors, card regions, wheel and base details, chase tags, photo confidence, and condition-based seed estimates.</p>
        </section>
        <SeriesSearch all={getFamilySummaries()} makes={getAllMakes()} scales={getAllScales()} lines={getAllLines()} />
      </div>
    </main>
  )
}