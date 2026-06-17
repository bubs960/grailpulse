import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  DIECAST_PRICING_MODE,
  type DiecastRecord,
  diecastDisplayName,
  getAllSeries,
  getDiecastsBySeries,
  getFamilySummary,
  sortedConditions,
  topConditionValue,
} from '@/data/diecast'

const SITE_URL = 'https://diecast.grailpulse.com'

export async function generateStaticParams() {
  return getAllSeries().map(series => ({ series }))
}

export async function generateMetadata({ params }: { params: Promise<{ series: string }> }): Promise<Metadata> {
  const { series } = await params
  const family = getFamilySummary(series)
  if (!family) return {}
  const title = `${family.label} Variants & Values - ${family.make} Diecast Price Guide`
  return {
    title,
    description: `${family.label} value guide with ${family.count} ${family.make} ${family.line} variant records, condition seed values, card regions, chase tags, wheel/base details, and photo confidence.`,
    alternates: { canonical: `/series/${series}/` },
  }
}

export default async function SeriesPage({ params }: { params: Promise<{ series: string }> }) {
  const { series } = await params
  const family = getFamilySummary(series)
  const records = getDiecastsBySeries(series)
  if (!family || records.length === 0) notFound()

  const years = Array.from(new Set(records.map(record => String(record.year_release)))).sort()
  const context = familyContext(family, records)
  const breadcrumbs = [
    { name: 'Die Cast', url: SITE_URL },
    { name: 'Browse', url: `${SITE_URL}/browse/` },
    { name: family.label, url: `${SITE_URL}/series/${series}/` },
  ]

  return (
    <main className="track-page">
      <JsonLd data={breadcrumbSchema(breadcrumbs)} />
      <JsonLd data={itemListSchema(family, records, series)} />
      <div className="container">
        <nav className="breadcrumb">
          <a href="/">Die Cast</a>
          <a href="/browse/">Browse</a>
          <span>{family.label}</span>
        </nav>

        <section className="series-hero collection-hero">
          {family.photoUrl ? <img src={family.photoUrl} alt="" /> : <div className="photo-tile">No photo</div>}
          <div>
            <div className="eyebrow">Casting lane / {family.make} · {family.line}</div>
            <h1>{family.label}</h1>
            <div className="meta-row">
              <span>{family.count} variant{family.count === 1 ? '' : 's'}</span>
              <span>{family.scale}</span>
              {family.yearLow > 0 && <span>{family.yearLow}-{family.yearHigh}</span>}
              {family.topPrice > 0 && <span>Top seed ${family.topPrice.toLocaleString()}</span>}
              {family.updatedAt && <span>Updated {formatDate(family.updatedAt)}</span>}
            </div>
          </div>
        </section>

        <section className="series-context-grid">
          <article className="card series-copy">
            <div className="section-head">About this casting lane</div>
            <p>{context.summary}</p>
            <p>{context.collectorNote}</p>
          </article>
          <aside className="card">
            <div className="section-head">Price Data Status</div>
            <dl className="fact-list">
              <div>
                <dt>Pricing mode</dt>
                <dd>{DIECAST_PRICING_MODE} values</dd>
              </div>
              <div>
                <dt>Latest refresh</dt>
                <dd>{family.updatedAt ? formatDate(family.updatedAt) : 'Pending'}</dd>
              </div>
              <div>
                <dt>Photo coverage</dt>
                <dd>{context.photoCount} of {family.count} variants</dd>
              </div>
              <div>
                <dt>Chase variants</dt>
                <dd>{context.chaseCount}</dd>
              </div>
            </dl>
            <div className="note-box">
              <strong>Trust note</strong>
              <span>Seed values are early guide estimates, not a guarantee of current sold market value. Verify rare carded, chase, or high-value examples against recent sold comps before buying.</span>
              <span className="trust-actions">
                <a href="/methodology/">Read methodology</a>
                <a href={correctionHref(family.label, `/series/${series}/`)}>Report a bad match or wrong price</a>
              </span>
            </div>
          </aside>
        </section>

        <div className="card variant-board" style={{ padding: 0, overflow: 'hidden' }}>
          {years.map((year, index) => {
            const byYear = records.filter(record => String(record.year_release) === year)
            return (
              <div key={year} className="variant-year-row" style={{ borderTop: index === 0 ? 'none' : '1px solid var(--border)' }}>
                <div className="year-label">{year}</div>
                <div className="variant-list">
                  {byYear.map(record => <VariantPill key={record.diecast_id} record={record} />)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}

function VariantPill({ record }: { record: DiecastRecord }) {
  const low = sortedConditions(record.condition_values)[0]?.[1]
  const high = topConditionValue(record)
  return (
    <a href={`/coin/${record.diecast_id}/`} className="variant-pill" title={diecastDisplayName(record)}>
      <span className="variant-main">{record.color || 'Unknown color'}</span>
      <span>{record.card_region || 'region?'}</span>
      <span>{record.chase_type || 'standard'}</span>
      {low ? <strong>${low.toLocaleString()}-{high.toLocaleString()}</strong> : <strong>No price</strong>}
    </a>
  )
}

type FamilyLike = NonNullable<ReturnType<typeof getFamilySummary>>

function familyContext(family: FamilyLike, records: DiecastRecord[]) {
  const colors = unique(records.map(record => record.color).filter(Boolean) as string[])
  const regions = unique(records.map(record => record.card_region).filter(Boolean) as string[])
  const wheelTypes = unique(records.map(record => record.wheel_type).filter(Boolean) as string[])
  const chaseTypes = unique(records.map(record => record.chase_type).filter(Boolean) as string[])
    .filter(chase => !/^none$/i.test(chase))
  const photoCount = records.filter(record => record.photo_url).length
  const top = family.topPrice > 0 ? ` Top seed value currently reaches $${family.topPrice.toLocaleString()}.` : ''
  const yearText = family.yearLow && family.yearHigh
    ? family.yearLow === family.yearHigh ? `${family.yearLow}` : `${family.yearLow}-${family.yearHigh}`
    : 'unknown years'

  return {
    photoCount,
    chaseCount: chaseTypes.length,
    summary: `${family.label} is tracked here as a ${family.scale} ${family.make} ${family.line} casting lane across ${family.count} variant records from ${yearText}. The guide separates color, card region, wheel/base details, chase tags, and condition seed values so collectors can compare the exact version in hand instead of flattening every release into one generic listing.${top}`,
    collectorNote: `Known signals on this page include ${listPhrase(colors.slice(0, 5)) || 'color variants'}, ${listPhrase(regions) || 'card regions'}, and ${listPhrase(wheelTypes.slice(0, 4)) || 'wheel types'}. ${chaseTypes.length ? `Chase tagging includes ${listPhrase(chaseTypes)}.` : 'No chase subtype is currently flagged for this family.'} Use the variant grid below to move from the family overview into the exact carded or loose record.`,
  }
}

function itemListSchema(family: FamilyLike, records: DiecastRecord[], series: string) {
  const listedRecords = records.slice(0, 50)
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${family.label} diecast variants`,
    description: `${family.count} ${family.make} ${family.line} variant records for ${family.label}.`,
    url: `${SITE_URL}/series/${series}/`,
    numberOfItems: records.length,
    itemListElement: listedRecords.map((record, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/coin/${record.diecast_id}/`,
      name: diecastDisplayName(record),
    })),
  }
}

function breadcrumbSchema(items: Array<{ name: string, url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)))
}

function listPhrase(values: string[]): string {
  if (values.length === 0) return ''
  if (values.length === 1) return values[0]
  return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value))
}

function correctionHref(label: string, path: string): string {
  const subject = encodeURIComponent(`Die Cast correction: ${label}`)
  const body = encodeURIComponent(`Page: ${SITE_URL}${path}\n\nWhat looks wrong?\n`)
  return `mailto:bubs960@gmail.com?subject=${subject}&body=${body}`
}

