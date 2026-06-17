import type { MetadataRoute } from 'next'
import { getAllDiecastIds, getAllSeries, getDiecastPricing, getDiecastsBySeries } from '@/data/diecast'

const SITE_URL = 'https://diecast.grailpulse.com'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: '', changeFrequency: 'daily' as const, priority: 1.0 },
    { path: '/browse/', changeFrequency: 'weekly' as const, priority: 0.85 },
    { path: '/garage/', changeFrequency: 'weekly' as const, priority: 0.55 },
    { path: '/methodology/', changeFrequency: 'monthly' as const, priority: 0.5 },
    { path: '/privacy/', changeFrequency: 'yearly' as const, priority: 0.2 },
  ].map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const seriesRoutes: MetadataRoute.Sitemap = getAllSeries()
    .filter(series => getDiecastsBySeries(series).some(record => getDiecastPricing(record.diecast_id)))
    .map(series => ({
      url: `${SITE_URL}/series/${series}/`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

  const diecastRoutes: MetadataRoute.Sitemap = getAllDiecastIds()
    .filter(id => getDiecastPricing(id))
    .map(id => ({
      url: `${SITE_URL}/coin/${id}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  return [...staticRoutes, ...seriesRoutes, ...diecastRoutes]
}
