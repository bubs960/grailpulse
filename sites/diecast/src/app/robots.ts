import type { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/sign-in/'],
      },
    ],
    sitemap: 'https://diecast.grailpulse.com/sitemap.xml',
    host: 'https://diecast.grailpulse.com',
  }
}
