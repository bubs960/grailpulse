/**
 * coins.ts — typed data access over coins-reference.js + coins-pricing.js
 *
 * The source files live at C:\Users\bubs9\CoinsSPinner\kb\
 * and are copied into this project as src/data/coins-reference.js
 * and src/data/coins-pricing.js during setup.
 *
 * Both files are large (~2.6MB and ~3.4MB). They are read at build time
 * only (static export) — no runtime cost.
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const raw = require('./coins-reference.js') as { COINS_REFERENCE: CoinEntry[] }
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pricingRaw = require('./coins-pricing.js') as { COINS_PRICING: Record<string, CoinPricing> }

export interface CoinEntry {
  coin_id: string
  denomination: string
  series: string
  year: string
  mint_mark: string
  variety: string
  strike: string           // 'business' | 'proof' | 'specimen'
  composition: string      // e.g. '.9000 silver', '.9999 gold'
  asw_ozt: number          // actual silver/gold weight in troy oz (0 = base metal)
  mintage: number          // 0 = not separately documented
  search_hints: string[]
}

export interface CoinPricing {
  coin_id: string
  series: string
  year: string
  mint_mark: string
  variety: string
  prices: Record<string, number | null>  // grade → USD
  source: string
  approx_base_year: boolean
  asw_ozt: number
  melt_dominated: boolean
}

const ALL_COINS: CoinEntry[] = raw.COINS_REFERENCE
const ALL_PRICING: Record<string, CoinPricing> = pricingRaw.COINS_PRICING

/** Look up a single coin by coin_id */
export function getCoin(coinId: string): CoinEntry | null {
  return ALL_COINS.find(c => c.coin_id === coinId) ?? null
}

/** Look up pricing for a coin */
export function getCoinPricing(coinId: string): CoinPricing | null {
  return ALL_PRICING[coinId] ?? null
}

/** All coin IDs (for generateStaticParams) */
export function getAllCoinIds(): string[] {
  return ALL_COINS.map(c => c.coin_id)
}

/** Coins in a given series */
export function getCoinsBySeries(series: string): CoinEntry[] {
  return ALL_COINS.filter(c => c.series === series)
}

/** All unique series names */
export function getAllSeries(): string[] {
  return [...new Set(ALL_COINS.map(c => c.series))].sort()
}

/** Build a human-readable display name for a coin */
export function coinDisplayName(coin: CoinEntry): string {
  const year = coin.year
  const mm = coin.mint_mark && coin.mint_mark !== 'none' ? `-${coin.mint_mark.toUpperCase()}` : ''
  const series = seriesLabel(coin.series)
  const variety = coin.variety && coin.variety !== 'None' ? ` (${coin.variety})` : ''
  return `${year}${mm} ${series}${variety}`
}

/** Pretty-print a series slug */
export function seriesLabel(series: string): string {
  return series
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** Denomination label */
export function denominationLabel(d: string): string {
  const map: Record<string, string> = {
    'one-cent': '1¢', 'five-cent': '5¢', 'dime': '10¢',
    'quarter': '25¢', 'half': '50¢', 'dollar': '$1',
    'two-dollar-fifty': '$2.50', 'three-dollar': '$3',
    'five-dollar': '$5', 'ten-dollar': '$10',
    'twenty-dollar': '$20', 'fifty-dollar': '$50',
  }
  return map[d] ?? d
}

/** Grade ordering for display — circulated first, then uncirculated */
const GRADE_ORDER = [
  'Poor-1','Fair-2','AG-3','G-4','G-6','VG-8','VG-10','F-12','F-15',
  'VF-20','VF-25','VF-30','VF-35','EF-40','EF-45','AU-50','AU-55','AU-58',
  'MS-60','MS-61','MS-62','MS-63','MS-64','MS-65','MS-66','MS-67','MS-68','MS-69','MS-70',
  'PR-60','PR-63','PR-65','PR-67','PR-68','PR-69','PR-70',
  'PF-60','PF-63','PF-65','PF-67','PF-68','PF-69','PF-70',
  'SP-60','SP-63','SP-65','SP-67','SP-68',
]

export function sortedGrades(prices: Record<string, number | null>): [string, number | null][] {
  const entries = Object.entries(prices).filter(([, v]) => v !== null)
  return entries.sort(([a], [b]) => {
    const ai = GRADE_ORDER.indexOf(a)
    const bi = GRADE_ORDER.indexOf(b)
    if (ai === -1 && bi === -1) return a.localeCompare(b)
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}
