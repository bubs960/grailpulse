import type { Metadata } from 'next'
import GarageDashboard from '../_components/GarageDashboard'

export const metadata: Metadata = {
  title: 'My Die Cast Garage',
  description: 'Park exact die-cast variants, track hunt-list targets, compare condition-based seed estimates, and optionally sync with a private garage key.',
  alternates: { canonical: '/garage/' },
  robots: { index: false, follow: true },
}

export default function GaragePage() {
  return (
    <main id="main-content" className="track-page">
      <div className="container">
        <section className="page-hero compact-hero"><div className="eyebrow">My garage</div><h1>Your die-cast display and hunt board</h1><p>Park the exact carded or loose variant, keep future hunts in one place, and enable a private garage key only when you want cross-device sync.</p></section>
        <GarageDashboard />
      </div>
    </main>
  )
}