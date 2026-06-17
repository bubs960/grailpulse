# Photo Metadata Origin Audit - 2026-06-17

Scope: strict audit and cleanup of photo-related metadata in `src/data/diecast-kb.json` for references that imply origin before GrailPulse.

## Summary

- Total records: 11724
- Records with photo metadata: 4124
- Old workspace/project fingerprints found in photo fields: 0
- Local Windows paths found in photo fields: 0
- Prior-project names found in photo fields: 0
- Open fix items remaining: 0
- Records normalized this pass: 1544

## Photo Source Counts After Cleanup

- `ebay-browse`: 2580
- `mercari-marketplace`: 1544

## Photo Host Counts

- `i.ebayimg.com`: 2580
- `u-mercari-images.mercdn.net`: 1544

## Resolved Finding

### P1 - Collection-method label leaked into public metadata

- Field: `photo_source`
- Old value: `mercari-scrape`
- New value: `mercari-marketplace`
- Count: 1544
- Status: resolved
- Code follow-up completed: `photoSourceLabel()` now maps marketplace values to public-facing labels, and Mercari image proxy allow-lists include `u-mercari-images.mercdn.net`.
- Full affected-record list: `docs/photo-metadata-origin-audit-2026-06-17.csv`

## Accepted Marketplace Attribution Fields

These are not old-origin references and should remain as attribution/search context:

- `photo_source: ebay-browse` (2580)
- `photo_source: mercari-marketplace` (1544)
- `photo_url` hosts `i.ebayimg.com` and `u-mercari-images.mercdn.net`
- `photo_item_id` marketplace item URLs
- `photo_query` and `photo_family_key` matching/search context

## Search Patterns Checked

No hits in photo fields for: `C:\Users`, `C:/Users`, `bubs9`, `Claude`, `Bridge`, `Fig Pinner`, `fgurepinner`, `HotWheelsMatchboxPinner`, `hotwheels-matchbox-pinner`, `CoinSpinner`, `coinspinner`, `source_version`, `seed_source`, `seed_family`, `research_basis`, `popular-template`, `popular-expansion`, or `scrape`.
