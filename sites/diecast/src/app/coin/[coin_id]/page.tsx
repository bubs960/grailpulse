import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { type DiecastRecord, conditionLabel, diecastDisplayName, familySlugFor, getAllDiecastIds, getDiecast, photoProxyUrl, seriesLabel, sortedConditions, topConditionValue } from '@/data/diecast'
import DiecastActions from '../../_components/DiecastActions'

const SITE_URL = 'https://diecast.grailpulse.com'

export async function generateStaticParams() {
  return getAllDiecastIds().map(coin_id => ({ coin_id }))
}

export async function generateMetadata({ params }: { params: Promise<{ coin_id: string }> }): Promise<Metadata> {
  const { coin_id } = await params
  const record = getDiecast(coin_id)
  if (!record) return {}
  const name = diecastDisplayName(record)
  return {
    title: `${name} Value & Condition Guide`,
    description: `${name} diecast identity and value guide with condition seed values, card region, wheel/base details, chase status, and photo confidence.`,
    alternates: { canonical: `/coin/${coin_id}/` },
  }
}

export default async function DiecastDetailPage({ params }: { params: Promise<{ coin_id: string }> }) {
  const { coin_id } = await params
  const record = getDiecast(coin_id)
  if (!record) notFound()

  const family = familySlugFor(record)
  const name = diecastDisplayName(record)
  const prices = sortedConditions(record.condition_values)
  const topValue = topConditionValue(record)
  const photoQuality = photoQualityLabel(record)
  const photoSource = photoSourceLabel(record.photo_source)
  const photoUrl = photoProxyUrl(record.photo_url)
  const facts = [
    ['Manufacturer', record.brand],
    ['Line', record.line],
    ['Casting', record.casting],
    ['Year', String(record.year_release)],
    ['Scale', record.scale || 'Unknown'],
    ['Photo', photoFact(record)],
    ['Mix', record.mix || 'Unknown'],
    ['Card region', record.card_region || 'Unknown'],
    ['Wheel', record.wheel_type || 'Unknown'],
    ['Base', record.base || 'Unknown'],
    ['Country', record.country || 'Unknown'],
    ['Chase', record.chase_type || 'None'],
  ]

  return (
    <main className="track-page">
      <JsonLd data={breadcrumbSchema(record, family)} />
      <JsonLd data={productSchema(record, name, photoUrl, topValue)} />
      <div className="container">
        <nav className="breadcrumb">
          <a href="/">Die Cast</a>
          <a href={`/series/${family}/`}>{seriesLabel(family)}</a>
          <span>{record.year_release}</span>
        </nav>

        <section className="detail-hero collection-hero detail-cockpit">
          <div className="detail-photo">
            {photoUrl ? <img src={photoUrl} alt={name} /> : <div className="photo-tile">Photo pending</div>}
            <div className={`photo-badge ${record.photo_url ? 'ready' : 'pending'}`}>
              <span>{photoQuality}</span>
              {photoSource && <small>{photoSource}</small>}
            </div>
          </div>
          <div>
            <div className="eyebrow">{record.brand} · {record.line}</div>
            <h1>{name}</h1>
            <div className="meta-row">
              <span>{record.scale || 'Scale unknown'}</span>
              <span>{record.color || 'Color unknown'}</span>
              <span>{record.card_region || 'Region unknown'}</span>
              <span>{photoQuality}</span>
              {topValue > 0 && <span>Top seed ${topValue.toLocaleString()}</span>}
            </div>
            <p className="detail-lede">
              Variant identity, card state, and condition value sit together here so a carded collector, loose-display builder, or peg hunter can compare the exact lane without flattening the casting.
            </p>
            <p className="data-freshness">
              Seed pricing · {record.updated_at ? `updated ${formatDate(record.updated_at)}` : 'refresh pending'} · verify rare or chase examples against recent sold comps.
            </p>
          </div>
        </section>

        <div className="detail-grid">
          <div className="detail-main-stack">
            <DiecastActions id={record.diecast_id} />
            <section className="card">
              <div className="section-head">Condition Timing</div>
              {prices.length > 0 ? (
                <table className="price-table">
                  <thead>
                    <tr>
                      <th>Condition</th>
                      <th>Meaning</th>
                      <th>Seed value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map(([condition, value]) => (
                      <tr key={condition}>
                        <td><span className="grade-chip">{conditionLabel(condition)}</span></td>
                        <td>{conditionText(condition)}</td>
                        <td>${value.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No condition pricing is available for this record yet.</p>
              )}
            </section>
          </div>

          <aside className="card">
            <div className="section-head">Build Sheet</div>
            <dl className="fact-list">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <div className="note-box">
              <strong>Source quality</strong>
              <span>{record.pricing_quality || 'seed'} pricing · {record.verify_status || 'test'} verification{record.updated_at ? ` · ${formatDate(record.updated_at)}` : ''}</span>
              <span className="trust-actions">
                <a href="/methodology/">Read methodology</a>
                <a href={correctionHref(name, `/coin/${record.diecast_id}/`)}>Report a bad match or wrong price</a>
              </span>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

function productSchema(record: DiecastRecord, name: string, photoUrl: string | undefined, topValue: number) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    brand: {
      '@type': 'Brand',
      name: record.brand,
    },
    category: 'Die-cast model vehicle',
    image: photoUrl ? [photoUrl] : undefined,
    description: `${record.scale || 'Scale unknown'} ${record.brand} ${record.line} ${record.casting} variant with ${record.color || 'unknown color'}, ${record.card_region || 'unknown region'} card region, and ${record.chase_type || 'standard'} chase status.`,
    sku: record.diecast_id,
    additionalProperty: [
      property('Line', record.line),
      property('Casting', record.casting),
      property('Year', String(record.year_release)),
      property('Scale', record.scale),
      property('Color', record.color),
      property('Wheel type', record.wheel_type),
      property('Card region', record.card_region),
      property('Chase type', record.chase_type || 'none'),
      property('Pricing mode', record.pricing_quality || 'seed'),
      topValue > 0 ? property('Top seed value', `$${topValue.toLocaleString()}`) : null,
    ].filter(Boolean),
  }
}

function breadcrumbSchema(record: DiecastRecord, family: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Die Cast', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: seriesLabel(family), item: `${SITE_URL}/series/${family}/` },
      { '@type': 'ListItem', position: 3, name: diecastDisplayName(record), item: `${SITE_URL}/coin/${record.diecast_id}/` },
    ],
  }
}

function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

function property(name: string, value?: string | null) {
  return value ? { '@type': 'PropertyValue', name, value } : null
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(value))
}


function photoQualityLabel(record: DiecastRecord): string {
  if (!record.photo_url) return 'Photo pending'
  if (record.photo_match_level === 'variant_exact') return 'Exact variant photo'
  if (record.photo_match_level === 'family') return 'Family photo'
  return 'Reference photo'
}

function photoSourceLabel(source?: string): string | null {
  const labels: Record<string, string> = {
    'ebay-api': 'eBay marketplace',
    'mercari-marketplace': 'Mercari marketplace',
    'ebay-browse': 'eBay marketplace',
    seed: 'Seeded photo',
    manual: 'Manual photo',
  }
  return source ? labels[source] || source.replace(/-/g, ' ') : null
}

function photoFact(record: DiecastRecord): string {
  const source = photoSourceLabel(record.photo_source)
  return source ? `${photoQualityLabel(record)} · ${source}` : photoQualityLabel(record)
}

function conditionText(condition: string): string {
  const text: Record<string, string> = {
    loose: 'Opened vehicle with normal handling risk.',
    mint_loose: 'Loose example with minimal visible wear.',
    damaged_card: 'Sealed or attached, but package has visible damage.',
    carded: 'Packaged example with ordinary shelf wear.',
    momc: 'Mint on mint card collector condition.',
  }
  return text[condition] || 'Condition value'
}

function correctionHref(label: string, path: string): string {
  const subject = encodeURIComponent(`Die Cast correction: ${label}`)
  const body = encodeURIComponent(`Page: ${SITE_URL}${path}\n\nWhat looks wrong?\n`)
  return `mailto:bubs960@gmail.com?subject=${subject}&body=${body}`
}
