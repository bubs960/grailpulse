# Die Cast Sold-Comp Evidence Pipeline

The public guide remains seed-mode until completed-sale evidence is normalized and passes this gate.

## Input contract

Append one JSON object per completed sale to `kb/sold-comps.ndjson`:

```json
{"source":"ebay","source_id":"example-123","sold_url":"https://www.ebay.com/itm/example-123","sold_at":"2026-06-01","price":18.5,"shipping":5.25,"currency":"USD","quantity":1,"lot_size":1,"condition":"carded","packaging":"carded","title":"Hot Wheels Nissan Skyline GT-R R34 blue","diecast_id":"exact-generated-id","match_confidence":0.94,"match_basis":"casting, color, card region, wheels and base visible"}
```

Rules:

- Completed sales only. Active listings are not comps.
- One vehicle per sale. Lots and multi-quantity listings are rejected.
- Exact `diecast_id` only; ambiguous matches stay out of the accepted file.
- USD only until currency normalization exists.
- Total realized amount includes shipping.
- Confidence must be at least `0.8`, with a written match basis.
- Condition and packaging are explicit. Do not infer MOMC from “new.”
- Duplicate marketplace IDs fail validation.

## Workflow

```powershell
npm run build
npm run comps:queries
# Run an approved external comp collector against output/sold-comp-query-queue.json.
# Normalize reviewed results into kb/sold-comps.ndjson.
npm run comps:validate
npm run comps:build
npm run build
npm test
```

A condition lane requires at least three accepted sales before its median can replace the seed estimate. Records with only some qualified lanes are labeled `sold_comps_partial`; all other lanes remain visibly seed-derived. No remote D1 write is part of this pipeline.
