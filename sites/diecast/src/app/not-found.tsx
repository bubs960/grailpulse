import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Not Found',
  description: 'The requested diecast record could not be found.',
}

export default function NotFound() {
  return (
    <main style={{ padding: '80px 0 120px', textAlign: 'center' }}>
      <div className="container" style={{ maxWidth: 620 }}>
        <div className="eyebrow">Not found</div>
        <h1 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, marginBottom: 16 }}>
          Diecast record not found
        </h1>
        <p style={{ marginBottom: 30 }}>
          This MVP has a focused test KB. Browse the current families or jump back to the main index.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" className="btn btn-accent">Home</a>
          <a href="/browse/" className="btn btn-ghost">Browse</a>
        </div>
      </div>
    </main>
  )
}
