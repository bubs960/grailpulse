# GrailPulse Die Cast Backup

Snapshot source: `C:\Users\bubs9\diecast-site`

Captured as a source backup for the GrailPulse Die Cast vertical after the KB expansion sync.

## Contents

- Next.js app source in `src/`
- Cloudflare Pages Functions in `functions/`
- operational scripts in `scripts/`
- project docs in `docs/`
- public files and headers in `public/`
- expanded die-cast KB at `src/data/diecast-kb.json`

Generated folders such as `.next/`, `out/`, `.wrangler/`, `node_modules/`, and Playwright output are intentionally excluded.

## Restore

```powershell
cd "sites\diecast"
npm install
npm test
npm run build
npm run deploy:prep
```

Current backed-up KB baseline: 11,724 records, 126 families, 10 brands.
