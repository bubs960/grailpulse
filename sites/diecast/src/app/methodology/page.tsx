import type { Metadata } from 'next'
import { DIECAST_GENERATED_AT, DIECAST_PRICING_MODE } from '@/data/diecast'

export const metadata: Metadata = {
  title: 'Die Cast Value Methodology',
  description: 'How GrailPulse Die Cast treats seed pricing, photo confidence, verification status, and collector corrections.',
  alternates: { canonical: '/methodology/' },
}

export default function MethodologyPage() {
  return (
    <main className="track-page">
      <div className="container">
        <section className="page-hero compact-hero">
          <div className="eyebrow">Trust lane</div>
          <h1>Methodology</h1>
          <p>
            GrailPulse Die Cast is a collector reference surface first. Values are shown as
            working guide signals, not offers to buy, sale guarantees, or official brand pricing.
          </p>
        </section>

        <section className="series-context-grid">
          <article className="card readable">
            <h2>Pricing Status</h2>
            <p>
              Current pricing mode is {DIECAST_PRICING_MODE}. Seed values help compare condition
              lanes such as loose, carded, damaged card, and mint-on-card, but rare carded,
              chase, and high-value examples still need recent sold-comps review before a buying
              decision.
            </p>

            <h2>Identity Matching</h2>
            <p>
              Records are separated by manufacturer, line, casting, year, color, card region,
              wheel type, base, country, and chase tagging where available. The goal is to prevent
              one broad casting name from swallowing important variant differences.
            </p>

            <h2>Photo Confidence</h2>
            <p>
              Photos may be exact-variant, family-level, reference, or pending. A family photo is
              useful for browsing, but it should not be treated as proof that every tampo, wheel,
              base, card, or chase detail matches the exact record.
            </p>

            <h2>Corrections</h2>
            <p>
              Every series and item page includes a report link. Send the page URL plus what looks
              wrong, especially bad photo matches, mixed-up card regions, questionable chase tags,
              missing wheel/base detail, or values that need sold-comps review.
            </p>
          </article>

          <aside className="card">
            <div className="section-head">Data State</div>
            <dl className="fact-list">
              <div>
                <dt>Generated</dt>
                <dd>{DIECAST_GENERATED_AT ? formatDate(DIECAST_GENERATED_AT) : 'Pending'}</dd>
              </div>
              <div>
                <dt>Pricing mode</dt>
                <dd>{DIECAST_PRICING_MODE}</dd>
              </div>
              <div>
                <dt>Market check</dt>
                <dd>Recent sold comps required for purchase decisions</dd>
              </div>
            </dl>
            <div className="note-box">
              <strong>Correction inbox</strong>
              <span>Use the report links on item pages or email bubs960@gmail.com with the exact page URL.</span>
            </div>
          </aside>
        </section>
      </div>
    </main>
  )
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value))
}
