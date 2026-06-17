import type { Metadata } from 'next'
import { getAllMakes, getAllScales, getFamilySummaries } from '@/data/diecast'
import SeriesSearch from '../_components/SeriesSearch'

export const metadata: Metadata = {
  title: 'Browse Die Cast',
  description: 'Filter diecast families by make, scale, line, and casting.',
}

export default function BrowsePage() {
  const all = getFamilySummaries()

  return (
    <main className="track-page">
      <div className="container">
        <nav className="breadcrumb">
          <a href="/">Die Cast</a>
          <span>Browse</span>
        </nav>

        <section className="page-hero compact-hero">
          <div className="eyebrow">Timing tower</div>
          <h1>Browse the grid</h1>
          <p>
            Filter the paddock by brand and scale, then jump into casting families for variants,
            card regions, condition ladders, and sold-price seed values.
          </p>
        </section>

        <SeriesSearch all={all} makes={getAllMakes()} scales={getAllScales()} />
      </div>
    </main>
  )
}
