# GrailPulse Die Cast KB Expansion Plan

## Current KB

- App KB: `src/data/diecast-kb.json`
- Current records: 11,724
- Current families: 126
- Current brands: Hot Wheels, Matchbox, Jada Toys, Racing Champions, M2 Machines, GreenLight, Johnny Lightning, MINI GT, Tarmac Works, INNO64
- Any-photo records: 4,124
- Any-photo families: 50
- Pricing coverage: 11,724 of 11,724 records
- Health gate: `npm test`

## Working Universe

The die-cast collector universe is broad, uneven, and variant-heavy. GrailPulse should grow deliberately around collector-useful lanes instead of pretending to cover every toy vehicle ever produced.

Practical targets:

- Current public test: 10,000+ records and 100+ families
- Collector test: 15,000 records and 150 families
- MVP dense: 25,000 records and 250 families
- Public v1: 50,000 records and 500 families

## Expansion Priorities

Hot Wheels:

- Mainline JDM/tuner lanes
- premium Car Culture, Boulevard, Team Transport, Pop Culture, Retro Entertainment, and Fast & Furious
- Treasure Hunts and Super Treasure Hunts
- Porsche, Euro performance, American muscle, trucks, and Hot Wheels originals

Matchbox:

- Basic/Mainline realism
- Moving Parts
- Matchbox Collectors
- Super Chase
- utility, rescue, fire, police, EV, and off-road lanes

Premium 1:64 and hobby brands:

- MINI GT and Kaido House
- Tarmac Works
- INNO64
- GreenLight
- Auto World
- Johnny Lightning
- M2 Machines

Oddball and licensed lanes:

- Jada WWE/WCW
- Racing Champions WCW Nitro Streetrods
- movie and TV licensed diecast
- promotional and unusual collector vehicles

## Batch Method

Use coherent family batches.

For each batch:

1. Add complete family lanes, not isolated random records.
2. Preserve identity fields for brand, year, line, segment, mix, series number, casting, color, deco, wheel, base, country, card region, and chase type.
3. Keep condition seed values on every record.
4. Prioritize exact photos for premium, chase, high-demand, and user-owned test lanes.
5. Keep family/reference photos clearly labeled where exact photos are not available yet.
6. Build and run `npm test` before publishing.

## Next Useful Batch

Target the move toward 15,000 records / 150 families:

- Hot Wheels JDM/tuner and Porsche/Euro families
- Matchbox realism and Moving Parts families
- premium hobby-brand families
- oddball/licensed families that improve recognition testing

Success criteria:

- all new records pass `scripts/validate-kb-health.mjs`
- all new family pages appear in browse and sitemap
- pricing coverage remains 100%
- photo coverage improves rather than regresses
