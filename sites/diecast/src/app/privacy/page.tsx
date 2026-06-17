import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'GrailPulse Die Cast MVP privacy notes.',
}

export default function PrivacyPage() {
  return (
    <main style={{ padding: '40px 0 80px' }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="eyebrow">Privacy</div>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, marginBottom: 24 }}>
          GrailPulse Die Cast privacy notes
        </h1>
        <div className="card readable">
          <h2>Current MVP</h2>
          <p>
            This diecast site is a public static catalog surface. It does not include accounts,
            vault storage, subscriptions, or collection export in this MVP.
          </p>
          <h2>Catalog data</h2>
          <p>
            The pages render a test knowledge base with diecast identity fields, condition values,
            and photo URLs used for vertical testing.
          </p>
          <h2>Advertising</h2>
          <p>
            GrailPulse Die Cast may show third-party advertising or affiliate links in future
            placements. Those partners may use cookies, device signals, and impression or click
            data to deliver and measure ads.
          </p>
          <h2>Contact</h2>
          <p>Questions about GrailPulse privacy can be sent to privacy@grailpulse.com.</p>
          <p className="updated">Last updated: June 7, 2026</p>
        </div>
      </div>
    </main>
  )
}
