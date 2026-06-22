import type { Metadata } from 'next'
import { DIECAST_GENERATED_AT, DIECAST_META, DIECAST_PRICING_MODE } from '@/data/diecast'

export const metadata: Metadata = {
  title: 'Die Cast Data & Value Methodology',
  description: 'How GrailPulse Die Cast treats phase-zero identity records, modeled seed estimates, photo confidence, limitations, and collector corrections.',
  alternates: { canonical: '/methodology/' },
}

export default function MethodologyPage() {
  return (
    <main id="main-content" className="track-page">
      <div className="container">
        <section className="page-hero compact-hero"><div className="eyebrow">Trust and data state</div><h1>Methodology</h1><p>GrailPulse Die Cast is a collector reference surface in an early data phase. It separates identity and condition signals while keeping the limits of the current evidence visible.</p></section>
        <section className="series-context-grid">
          <article className="card readable">
            <h2>Current data status</h2>
            <p>All {DIECAST_META.total_records.toLocaleString()} current records are <strong>phase-zero reference records</strong>. They help model casting, color, card, wheel, base, chase, and condition fields, but they are not an authoritative release checklist. Exact years, mixes, series numbers, decos, and chase labels should be independently verified before publication or purchase decisions.</p>

            <h2>Seed estimates—not sold comps</h2>
            <p>Current pricing mode is <strong>{DIECAST_PRICING_MODE}</strong>. The condition ladder is a modeled comparison tool: carded is the base estimate, with loose, mint-loose, damaged-card, and mint-on-mint-card values derived as relative condition bands. These numbers do not come from completed marketplace transactions and are not appraisals.</p>

            <h2>When sold comps arrive</h2>
            <p>A record should only be promoted to comp-backed pricing after completed sales are matched to the correct casting and variant, obvious outliers and lots are reviewed, condition and packaging are separated, sample size and date range are shown, and a refreshed timestamp is published. Active asking prices are not sold value. The current evidence gate requires at least three accepted single-item sales in a condition lane before that lane can replace its seed estimate.</p>

            <h2>Photo confidence</h2>
            <p>Marketplace images are provisional visual references through a cache proxy. “Exact photo” means the matcher found strong title signals for the modeled record; it does not authenticate the item, establish ownership of the image, prove the modeled value, or replace inspection of card, blister, base, wheels, and tampo details. Collector-owned, permission-backed, and documented editorial images override marketplace references when they pass the photo-rights intake.</p>

            <h2>Indexing policy</h2>
            <p>Casting-family pages remain discoverable because they provide brand, line, scale, photo coverage, and collector context. Phase-zero exact-record pages are excluded from the sitemap and marked noindex until release identity and market evidence become defensible.</p>

            <h2>Corrections</h2>
            <p>Every family and record page includes a correction link. Include the page URL and the field that looks wrong—especially generation, card region, wheel/base detail, chase status, photo match, or a seed estimate that could be mistaken for market evidence.</p>
          </article>
          <aside className="card">
            <div className="section-head">Published data state</div>
            <dl className="fact-list">
              <div><dt>Generated</dt><dd>{DIECAST_GENERATED_AT ? formatDate(DIECAST_GENERATED_AT) : 'Pending'}</dd></div>
              <div><dt>Records</dt><dd>{DIECAST_META.total_records.toLocaleString()} phase-zero references</dd></div>
              <div><dt>Pricing</dt><dd>Modeled seed estimates</dd></div>
              <div><dt>Sold comps</dt><dd>{DIECAST_META.comp_backed_records || 0} comp-backed records</dd></div>
              <div><dt>Approved photos</dt><dd>{DIECAST_META.owner_photo_records || 0} owner/editorial records</dd></div>
              <div><dt>Buying decision</dt><dd>Verify recent completed sales independently</dd></div>
            </dl>
            <div className="note-box"><strong>Correction inbox</strong><span>Use a page-level report link or email bubs960@gmail.com with the exact URL and evidence.</span></div>
          </aside>
        </section>
      </div>
    </main>
  )
}

function formatDate(value: string): string { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value)) }
