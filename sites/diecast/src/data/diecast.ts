import kb from './diecast-kb.json'

export type ConditionValues = Record<string, number | null | undefined>

export interface DiecastRecord {
  diecast_id: string
  brand: string
  year_release: string | number
  line: string
  segment?: string
  mix?: string
  series_number?: string
  casting: string
  color?: string
  deco?: string
  wheel_type?: string
  base?: string
  country?: string
  card_region?: string
  scale?: string
  chase_type?: string
  aliases?: string[]
  condition_values?: ConditionValues
  pricing_quality?: string
  verify_status?: string
  updated_at?: string
  title?: string
  photo_url?: string
  photo_source?: string
  photo_match_level?: string
  photo_score?: number
  family_key?: string
}

export interface FamilySummary {
  series: string
  label: string
  make: string
  line: string
  scale: string
  count: number
  photoUrl?: string
  yearLow: number
  yearHigh: number
  sampleId: string
  topPrice: number
  updatedAt?: string
}

const payload = kb as { meta: { total_records: number, generated_at?: string, pricing_mode?: string }, records: DiecastRecord[] }
export const DIECAST_META = payload.meta
export const DIECAST_RECORDS: DiecastRecord[] = payload.records
export const DIECAST_GENERATED_AT = payload.meta.generated_at
export const DIECAST_PRICING_MODE = payload.meta.pricing_mode || 'seed'

const PHOTO_PROXY_HOSTS = new Set([
  'i.ebayimg.com',
  'images.mercari.com',
  'static.mercdn.net',
])

export function photoProxyUrl(url?: string): string | undefined {
  if (!url) return undefined
  if (process.env.NODE_ENV !== 'production') return url
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' || !PHOTO_PROXY_HOSTS.has(parsed.hostname)) return url
    return `/photo?src=${encodeURIComponent(url)}`
  } catch {
    return url
  }
}

function slugPart(value: unknown): string {
  return String(value ?? 'unknown')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'unknown'
}

export function familySlugFor(record: DiecastRecord): string {
  return [record.brand, record.line, record.casting].map(slugPart).join('__')
}

const RECORD_BY_ID = new Map(DIECAST_RECORDS.map(record => [record.diecast_id, record]))
const SERIES_RECORDS = buildSeriesRecords()
const ALL_SERIES = Array.from(SERIES_RECORDS.keys()).sort()
const FAMILY_SUMMARIES = new Map(
  ALL_SERIES.map(series => [series, buildFamilySummary(series, SERIES_RECORDS.get(series) || [])] as const)
)
const ALL_MAKES = Array.from(new Set(DIECAST_RECORDS.map(record => record.brand))).sort()
const ALL_SCALES = Array.from(new Set(DIECAST_RECORDS.map(record => record.scale || 'Unknown'))).sort()

export function seriesLabel(series: string): string {
  const family = getFamilySummary(series)
  if (family) return family.label
  return series.split('__').map(part => part.replace(/-/g, ' ')).join(' / ')
}

export function diecastDisplayName(record: DiecastRecord): string {
  return record.title || [record.year_release, record.brand, record.casting].filter(Boolean).join(' ')
}

export function conditionLabel(condition: string): string {
  const labels: Record<string, string> = {
    loose: 'Loose',
    mint_loose: 'Mint loose',
    carded: 'Carded',
    momc: 'MOMC',
    damaged_card: 'Damaged card',
  }
  return labels[condition] || condition.replace(/_/g, ' ')
}

export function sortedConditions(values?: ConditionValues): [string, number][] {
  if (!values) return []
  const order = ['loose', 'mint_loose', 'damaged_card', 'carded', 'momc']
  return order
    .map(key => [key, values[key]] as [string, number | null | undefined])
    .filter((item): item is [string, number] => typeof item[1] === 'number')
}

export function topConditionValue(record: DiecastRecord): number {
  const values = sortedConditions(record.condition_values).map(([, value]) => value)
  return values.length ? Math.max(...values) : 0
}

export function getAllDiecastIds(): string[] {
  return DIECAST_RECORDS.map(record => record.diecast_id)
}

export function getDiecast(id: string): DiecastRecord | undefined {
  return RECORD_BY_ID.get(id)
}

export function getDiecastPricing(id: string): ConditionValues | undefined {
  return getDiecast(id)?.condition_values
}

export function getAllSeries(): string[] {
  return ALL_SERIES
}

export function getDiecastsBySeries(series: string): DiecastRecord[] {
  return SERIES_RECORDS.get(series) || []
}

export function getAllMakes(): string[] {
  return ALL_MAKES
}

export function getAllScales(): string[] {
  return ALL_SCALES
}

export function getMakeSummaries() {
  return ALL_MAKES.map(make => ({
    make,
    count: DIECAST_RECORDS.filter(record => record.brand === make).length,
  }))
}

export function getFamilySummary(series: string): FamilySummary | undefined {
  return FAMILY_SUMMARIES.get(series)
}

function buildSeriesRecords(): Map<string, DiecastRecord[]> {
  const bySeries = new Map<string, DiecastRecord[]>()
  for (const record of DIECAST_RECORDS) {
    const series = familySlugFor(record)
    const records = bySeries.get(series) || []
    records.push(record)
    bySeries.set(series, records)
  }
  for (const records of bySeries.values()) {
    records.sort((a, b) => String(a.year_release).localeCompare(String(b.year_release)) || diecastDisplayName(a).localeCompare(diecastDisplayName(b)))
  }
  return bySeries
}

function buildFamilySummary(series: string, records: DiecastRecord[]): FamilySummary | undefined {
  if (!records.length) return undefined
  const first = records[0]
  const years = records.map(record => Number(record.year_release)).filter(Number.isFinite)
  const updatedTimes = records
    .map(record => record.updated_at ? Date.parse(record.updated_at) : NaN)
    .filter(Number.isFinite)
  return {
    series,
    label: `${first.brand} ${first.casting}`,
    make: first.brand,
    line: first.line,
    scale: first.scale || 'Unknown',
    count: records.length,
    photoUrl: photoProxyUrl(records.find(record => record.photo_url)?.photo_url),
    yearLow: years.length ? Math.min(...years) : 0,
    yearHigh: years.length ? Math.max(...years) : 0,
    sampleId: first.diecast_id,
    topPrice: Math.max(...records.map(topConditionValue)),
    updatedAt: updatedTimes.length ? new Date(Math.max(...updatedTimes)).toISOString() : DIECAST_GENERATED_AT,
  }
}

export function getFamilySummaries(): FamilySummary[] {
  return ALL_SERIES
    .map(series => FAMILY_SUMMARIES.get(series))
    .filter((summary): summary is FamilySummary => Boolean(summary))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
}

export function getFeaturedSeries(): FamilySummary[] {
  return getFamilySummaries().slice(0, 12)
}

export function getFilteredFamilies(make?: string, scale?: string): FamilySummary[] {
  return getFamilySummaries().filter(family => {
    const makeOk = !make || family.make === make
    const scaleOk = !scale || family.scale === scale
    return makeOk && scaleOk
  })
}
