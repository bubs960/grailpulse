# GrailPulse Die Cast KB Expansion - 2026-06-18

## Result

- Baseline: 11,724 records, 126 families
- Expanded: 13,024 records, 139 families
- Record growth: 11.09%
- Family growth: 10.32%
- Net-new coverage: 1,300 records across 13 families
- Brands after expansion: 12
- Existing photo records preserved: 4,124

## Added Coverage

- Matchbox utility realism: Mercedes-Benz Unimog U1300, Ford Bronco 4-Door
- Hot Wheels collector reference: Mazda Autozam AZ-1, Nissan Stagea RS Four V, Porsche 944 Turbo, Ford Escort RS Cosworth, Chevrolet Monte Carlo SS, Jeep Cherokee XJ
- Premium 1:64 reference: MINI GT Nissan Skyline GT-R R33, Tarmac Works Porsche 911 GT3 R, INNO64 Toyota Chaser JZX100, Pop Race Honda Civic Type R EK9, Auto World Buick Grand National

## Trust Rules

- New records use `year_release: Reference`; they are category coverage, not confirmed current retail releases.
- New records use seed pricing and `phase0_seed` verification.
- No synthetic chase or Super Treasure Hunt status is generated for these families.
- Exact retail release, variation, rarity, and sold-comp claims still require verification.
- Public KB output omits internal generator provenance fields.

## Verification

- `npm test`: passed
- Production `npm run build`: passed
- Static pages generated: 13,176
- Duplicate IDs: 0
- Records missing five-condition price ladders: 0
- Old-origin/provenance scan: clean
