import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'How GrailPulse Die Cast handles browser garage data, optional D1 garage sync, correction emails, image requests, and future advertising.',
  alternates: { canonical: '/privacy/' },
}

export default function PrivacyPage() {
  return (
    <main id="main-content" className="track-page">
      <div className="container privacy-container">
        <section className="page-hero compact-hero"><div className="eyebrow">Privacy</div><h1>Die Cast privacy notes</h1><p>The public guide can be browsed without creating a collector license. Garage sync is optional.</p></section>
        <article className="card readable">
          <h2>Public guide</h2><p>Catalog and methodology pages are public. Standard hosting and security logs may include IP address, browser and device information, requested URL, timestamps, and Cloudflare security signals.</p>
          <h2>Local browser garage</h2><p>Parked cars, hunt-list targets, condition choices, and a local collector profile are stored in your browser using local storage. Clearing site data removes that local copy.</p>
          <h2>Optional garage sync</h2><p>If you issue a collector license, GrailPulse stores the chosen handle, favorite lane, hashed garage key, parked-car IDs, hunt-list IDs, and timestamps in a Cloudflare D1 database. The plain garage key is returned to your browser so you can load the garage later; keep it private. Do not use sensitive personal information as a collector handle.</p>
          <h2>Photos and external services</h2><p>Reference photos may be fetched from allowed marketplace image hosts through the GrailPulse photo cache. Those requests are made by the service rather than directly exposing every image host to the page.</p>
          <h2>Corrections and email</h2><p>Correction links open your email application. If you send a message, the email provider receives the information you choose to include.</p>
          <h2>Advertising and affiliate links</h2><p>No advertising placements are currently rendered on the Die Cast guide. Future ads or affiliate links will be disclosed when introduced; those partners may use their own measurement technologies.</p>
          <h2>Contact</h2><p>Privacy questions can be sent to privacy@grailpulse.com.</p>
          <p className="updated">Last updated: June 22, 2026</p>
        </article>
      </div>
    </main>
  )
}