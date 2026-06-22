import type { Metadata } from 'next'
import LicenseBuilder from '../_components/LicenseBuilder'

export const metadata: Metadata = {
  title: 'Garage Sync', description: 'Optionally create or load a private garage key for cross-device die-cast garage sync.',
  alternates: { canonical: '/license/' }, robots: { index: false, follow: true },
}

export default function LicensePage() {
  return <main id="main-content" className="track-page"><div className="container"><section className="page-hero compact-hero"><div className="eyebrow">Optional garage sync</div><h1>Carry your garage to another device</h1><p>Your garage works locally without a license. Issue a private garage key only if you want to reload parked cars and hunt targets elsewhere.</p></section><LicenseBuilder /></div></main>
}