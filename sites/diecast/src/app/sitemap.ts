import type { MetadataRoute } from 'next'
import { DIECAST_GENERATED_AT, getAllSeries, getDiecastsBySeries } from '@/data/diecast'

const SITE_URL = 'https://diecast.grailpulse.com'
const generated = DIECAST_GENERATED_AT ? new Date(DIECAST_GENERATED_AT) : new Date('2026-06-18T00:00:00Z')

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { path: '', lastModified: generated, changeFrequency: 'weekly' as const, priority: 1.0 },
    { path: '/browse/', lastModified: generated, changeFrequency: 'weekly' as const, priority: 0.9 },
    { path: '/methodology/', lastModified: new Date('2026-06-22T00:00:00Z'), changeFrequency: 'monthly' as const, priority: 0.65 },
    { path: '/privacy/', lastModified: new Date('2026-06-22T00:00:00Z'), changeFrequency: 'yearly' as const, priority: 0.3 },
  ].map(({ path, ...entry }) => ({ url: `${SITE_URL}${path}`, ...entry }))

  const seriesRoutes: MetadataRoute.Sitemap = getAllSeries().map(series => {
    const dates = getDiecastsBySeries(series).map(record => record.updated_at ? Date.parse(record.updated_at) : NaN).filter(Number.isFinite)
    return { url: `${SITE_URL}/series/${series}/`, lastModified: dates.length ? new Date(Math.max(...dates)) : generated, changeFrequency: 'monthly' as const, priority: 0.7 }
  })

  return [...staticRoutes, ...seriesRoutes]
}