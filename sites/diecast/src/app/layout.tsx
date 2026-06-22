import type { Metadata, Viewport } from 'next'
import './globals.css'

const SITE_URL = 'https://diecast.grailpulse.com'
const SITE_DESCRIPTION = 'A collector-first die-cast identity and seed-value guide for Hot Wheels, Matchbox, Jada, Auto World, MINI GT, Tarmac Works, and premium 1:64 vehicles.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'GrailPulse Die Cast Guide', template: '%s | GrailPulse Die Cast' },
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: 'GrailPulse Die Cast Guide', description: SITE_DESCRIPTION, url: SITE_URL,
    siteName: 'GrailPulse Die Cast', type: 'website', images: [{ url: '/og-diecast.png', width: 1200, height: 630, alt: 'GrailPulse Die Cast collector garage' }],
  },
  twitter: {
    card: 'summary_large_image', title: 'GrailPulse Die Cast Guide', description: SITE_DESCRIPTION,
    images: ['/og-diecast.png'],
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#0b0c0b' }

const websiteSchema = {
  '@context': 'https://schema.org', '@type': 'WebSite', name: 'GrailPulse Die Cast', url: SITE_URL,
  description: SITE_DESCRIPTION,
  potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/browse/?q={search_term_string}`, 'query-input': 'required name=search_term_string' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <nav className="cs-nav" aria-label="Primary navigation">
          <div className="cs-nav-inner">
            <a href="/" className="cs-wordmark"><span className="gp-mark">GP</span>GrailPulse<span className="slash">/</span><span className="section">Die Cast</span></a>
            <div className="cs-nav-links">
              <a href="/browse/">Browse</a><a href="/garage/">My Garage</a><a href="/methodology/">Methodology</a><a href="https://grailpulse.com">All Guides</a><a href="/privacy/">Privacy</a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="cs-footer">
          <div className="cs-footer-inner">
            <p>2026 GrailPulse · Collector garage for castings, variants, and condition context.</p>
            <nav className="footer-links" aria-label="Footer navigation">
              <a href="https://grailpulse.com">GrailPulse</a><a href="https://coins.grailpulse.com">CoinSpinner</a><a href="https://figurepinner.com">FigurePinner</a><a href="/garage/">My Garage</a><a href="/methodology/">Methodology</a><a href="/privacy/">Privacy</a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  )
}