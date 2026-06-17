import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'GrailPulse Die Cast Price Guide', template: '%s | GrailPulse Die Cast' },
  description: 'A die-cast price and identity surface for Hot Wheels, Matchbox, Jada, and premium 1:64 collectible vehicle lines.',
  metadataBase: new URL('https://diecast.grailpulse.com'),
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
        <nav className="cs-nav">
          <div className="cs-nav-inner">
            <a href="/" className="cs-wordmark">
              <span className="gp-mark">GP</span>
              GrailPulse
              <span className="slash">/</span>
              <span className="section">Die Cast</span>
            </a>
            <div className="cs-nav-links">
              <a href="/browse/">Browse Grid</a>
              <a href="/garage/">My Garage</a>
              <a href="/license/">Get Your License</a>
              <a href="/methodology/">Methodology</a>
              <a href="https://grailpulse.com" target="_blank" rel="noopener noreferrer">All Vaults</a>
              <a href="/privacy/">Privacy</a>
            </div>
          </div>
        </nav>
        {children}

        <footer className="cs-footer">
          <div className="cs-footer-inner">
            <p>2026 GrailPulse · Die Cast Pit Lane</p>
            <div style={{ display: 'flex', gap: 20 }}>
              <a href="https://grailpulse.com" target="_blank" rel="noopener noreferrer">GrailPulse</a>
              <a href="https://coins.grailpulse.com" target="_blank" rel="noopener noreferrer">CoinSpinner</a>
              <a href="/garage/">My Garage</a>
              <a href="/methodology/">Methodology</a>
              <a href="/privacy/">Privacy</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
