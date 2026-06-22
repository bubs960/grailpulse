# GrailPulse Die Cast Authoritative Source

This subtree is the Git-backed rollback and review source for the live GrailPulse Die Cast vertical.

- Live deploy working directory: `C:\Users\bubs9\diecast-site`
- KB/taxonomy working vault: `C:\Users\bubs9\Fig Pinner Dev - Claude\hotwheels-matchbox-pinner`
- Cloudflare Pages project: `grailpulse-diecast`
- Homepage: direct Cloudflare Pages route; the temporary cache-containment Worker was retired after the corrected CSP reached the custom domain.

## Contents

- Next.js app code in `src/`
- Cloudflare Pages Functions in `functions/`
- operational scripts in `scripts/`
- project docs in `docs/`
- public files and headers in `public/`
- expanded die-cast KB at `src/data/diecast-kb.json`
- source generator and evidence-gated photo/comp tooling in `source-tools/`

Generated folders such as `.next/`, `out/`, `.wrangler/`, `node_modules/`, and Playwright output are intentionally excluded.
`public/garage-catalog.json` is generated during the production build and is also excluded.

## Restore

```powershell
cd "sites\diecast"
npm install
npm test
npm run build
npm run deploy:prep
```

Current backed-up KB baseline: 13,024 records, 139 families, 12 brands.

Pricing remains modeled seed estimates until reviewed completed sales pass the source-tool validation and minimum per-condition sample. Marketplace imagery remains provisional until an owner-created, permission-backed, or documented editorial replacement is applied through the owner-photo manifest.
