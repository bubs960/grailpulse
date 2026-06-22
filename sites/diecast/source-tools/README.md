# HotWheelsMatchboxPinner

Test spoke for valuing Hot Wheels, Matchbox, and adjacent 1:64 diecast using the FigurePinner/CoinSpinner pipeline shape.

This fork follows `fork-playbook.md`: diecast is a hard category, so Phase 0 is explicit. The identity key is combinatorial, not just `brand + series + vehicle`.

## Current Scope

- Brands: Hot Wheels, Matchbox, Jada Toys, Racing Champions, GreenLight, M2 Machines, Johnny Lightning, MINI GT, Tarmac Works, and INNO64
- Slice: modern mainline / premium / moving-parts examples, entertainment cars, racing-interest castings, and premium 1:64 collector-demand seeds
- Generated KB: 11,724 records across 126 families after the 2026-06-08 expansion pass
- Condition states: `loose`, `mint_loose`, `carded`, `momc`, `damaged_card`
- Pricing: seed/test values only, shaped like future eBay sold-comp output

## Folder Map

- `memory/decisions.md` - append-only decisions for this fork
- `docs/phase-0-taxonomy-spike.md` - identity-key stress test and pitfalls
- `kb/source.catalog.json` - editable source catalog with variation fields
- `kb/photo-map.json` - optional photo enrichment map written by the eBay photo hydrator
- `scripts/build-kb.mjs` - builds generated KB, search index, and portable export
- `scripts/hydrate-photos.mjs` - pulls photo URLs from eBay Browse API into `kb/photo-map.json`
- `scripts/enrich_photos.py` - richer photo enrichment pass with extra listing metadata
- `scripts/photo_coverage_report.py` - no-network photo coverage report and next-family queue
- `scripts/photo_quality_audit.py` - no-network family-primary photo quality audit
- `api/index.mjs` - importable `lookup / match / price / valuate` API
- `app/index.html` - standalone local MVP
- `export/hotwheels-matchbox-pinner.json` - generated app/API payload

## Workflow

```bash
cd hotwheels-matchbox-pinner
npm run build
npm run serve
```

Then open the printed local URL and test title matching.

## Contract

Every record emits a stable `diecast_id` and the same spoke API surface expected by GrailPinner:

- `lookup(id)`
- `match(title)`
- `price(id, condition)`
- `valuate({ title | id, condition })`

The matching layer should expose ambiguity. If a title lacks color, wheel, card, or country details needed to distinguish variants, it returns candidates with lower confidence instead of forcing a fake exact match.

Photo enrichment is optional but useful for real testing. When `kb/photo-map.json` exists, the build merges `photo_url` and related metadata into the generated KB and the browser MVP renders thumbnails on cards.

Approved owner/fair-use photos override marketplace references through `kb/owner-photo-map.json`. See `owner-photos/README.md`; never move a marketplace image into the owner workflow without a documented rights basis.

Sold comps are evidence-gated rather than scraped directly into public values. See `docs/sold-comp-pipeline.md`. The default KB remains seed-mode until reviewed completed sales pass validation and the minimum per-condition sample.

For variant-level eBay photo passes, prefer the QA flag while broadening coverage:

```powershell
cd "C:\Users\bubs9\Fig Pinner Dev - Claude\hotwheels-matchbox-pinner"
python .\variant_photo_scrub.py --apply --limit 50 --minimum-score 10 --reject-watermarks
```

The watermark filter rejects obvious stock/sample/custom/listing-risk candidates and tags accepted records with `photo_qa`.

For Mercari photo work, run the family-primary pass first, then variant-exact passes:

```powershell
cd "C:\Users\bubs9\Fig Pinner Dev - Claude\hotwheels-matchbox-pinner"
python .\mercari_family_photo_scrub.py --apply --limit 100 --minimum-score 10 --sleep 3 --reject-watermarks
npm run build
npm test
python .\mercari_family_photo_scrub.py --stats
```

```powershell
cd "C:\Users\bubs9\Fig Pinner Dev - Claude\hotwheels-matchbox-pinner"
python .\mercari_photo_scrub.py --apply --limit 1000 --minimum-score 10 --sleep 2 --reject-watermarks
npm run build
npm test
python .\variant_photo_scrub.py --stats
```

Refresh the no-network coverage note after any run:

```powershell
cd "C:\Users\bubs9\Fig Pinner Dev - Claude\hotwheels-matchbox-pinner"
python .\photo_coverage_report.py --write
```

Audit family-primary photos after tightening match rules:

```powershell
cd "C:\Users\bubs9\Fig Pinner Dev - Claude\hotwheels-matchbox-pinner"
python .\photo_quality_audit.py --fail-on-suspect
```

If variant-exact pruning removes a bad exact match, restore any available family-primary fallback:

```powershell
cd "C:\Users\bubs9\Fig Pinner Dev - Claude\hotwheels-matchbox-pinner"
python .\photo_quality_audit.py --repair-family-fallbacks
```
