import type { Metadata } from 'next'
import LicenseBuilder from '../_components/LicenseBuilder'

export const metadata: Metadata = {
  title: 'Get Your License',
  description: 'Claim a Die Cast collector license, load your garage, and start building your GrailPulse pit lane.',
}

export default function LicensePage() {
  return (
    <main className="track-page">
      <div className="container">
        <section className="page-hero compact-hero">
          <div className="eyebrow">Collector license</div>
          <h1>Get Your License</h1>
          <p>
            Stamp your diecast identity, pick a favorite lane, then start parking cars in your garage.
            The License Locker gives you a garage key for MVP return access, with browser fallback while we tune the loop.
          </p>
        </section>
        <LicenseBuilder />
      </div>
    </main>
  )
}
