import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Get Your License',
  description: 'Claim a local Die Cast collector license and start building your GrailPulse garage.',
}

export default function SignInPage() {
  return (
    <main style={{ padding: '80px 0 120px', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: 620 }}>
        <div className="eyebrow">MVP access</div>
        <h1 style={{ fontSize: 'clamp(30px, 5vw, 44px)', fontWeight: 900, marginBottom: 14 }}>
          Get your collector license
        </h1>
        <p style={{ marginBottom: 28 }}>
          No account gate yet. Claim a local license, park cars in your garage, and start a hunt list
          while we tune the Die Cast loop.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/license/" className="btn btn-accent">Get Your License</a>
          <a href="/garage/" className="btn btn-ghost">My Garage</a>
        </div>
      </div>
    </main>
  )
}
