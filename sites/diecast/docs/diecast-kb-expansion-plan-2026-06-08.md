# Diecast KB Expansion Plan - 2026-06-08

## Current KB

- Source KB: `C:\Users\bubs9\Fig Pinner Dev - Claude\hotwheels-matchbox-pinner\kb\generated\kb-diecast.json`
- Deployed app KB: `C:\Users\bubs9\diecast-site\src\data\diecast-kb.json`
- Current generated records: 11,724
- Current families: 126
- Current brands: Hot Wheels, Matchbox, Jada Toys, Racing Champions, M2 Machines, GreenLight, Johnny Lightning, MINI GT, Tarmac Works, INNO64
- Current photo state after the 10%+ expansion sync:
  - Any-photo records: 4,124
  - Any-photo families: 50
  - No-photo records: 7,600
  - Pricing coverage: 11,724 of 11,724 records
  - Growth from previous deployed baseline: 184.3%
- App-side health gate: `npm test` now runs `scripts/validate-kb-health.mjs` before the legacy smoke test.

## Research Notes

This vertical should not chase every diecast vehicle ever made. The universe is too large and too uneven.

Useful scale signals:

- hobbyDB wrote in 2021 that it was sorting through about 50,000 Hot Wheels pages, with Hot Wheels especially heavy in variants, card differences, decals, interiors, wheel variations, and subvariants.
- Hot Wheels Wiki lists the 2026 Hot Wheels mainline as 1-250, with color variations not receiving new numbers and Treasure Hunts/store exclusives still numbered.
- Hot Wheels Wiki shows more than 10,000 Hot Wheels wiki pages, which is useful as a casting/history breadth signal but not a clean item count.
- Matchbox Cars Wiki lists the 2025 Matchbox mainline as expanded from 100 to 125 models.
- Matchbox history keeps the regular-size range around the classic 1-75/75 model idea for decades, then expanded in modern Mattel years.

Source links:

- https://blog.hobbydb.com/2021/02/04/getting-hot-wheels-listings-right/
- https://hotwheels.fandom.com/wiki/List_of_2026_Hot_Wheels
- https://matchbox.fandom.com/wiki/List_of_2025_Matchbox
- https://en.wikipedia.org/wiki/Matchbox_(brand)
- https://creations.mattel.com/en-ca/collections/hot-wheels-red-line-club
- https://hotwheels.fandom.com/wiki/2025_Car_Culture

## Working Universe Estimate

Full diecast universe:

- Too broad: 250k+ records if all scales, brands, years, promos, NASCAR, trucking, military, customs, and international variants are included.

Hot Wheels-focused universe:

- 50k+ item-level records is already plausible for Hot Wheels alone when variants/subvariants are counted.
- Modern yearly intake is roughly 250 numbered mainline slots plus recolors, Treasure Hunts, store exclusives, premiums, RLC, entertainment, Team Transport, multipacks, and special series.

GrailPulse practical target:

- MVP testing target: 25,000 records / 250 families
- Serious public v1 target: 50,000 records / 500 families
- Do not chase beyond 75,000 records until garage usage proves which lanes collectors actually fill.

## Benchmark Ladder

### Benchmark 1 - Current Plus

- Target: 10,000 records / 100 families
- Photo target: 70% any photo, 25% exact photo
- Focus: finish current family expansion, improve missing photos, keep smoke tests green

### Benchmark 2 - Collector Test

- Target: 15,000 records / 150 families
- Photo target: 75% any photo, 30% exact photo
- Focus: Hot Wheels current demand, Matchbox realism, user-owned WWE/WCW/Jada/Racing Champions test lanes

### Benchmark 3 - MVP Dense

- Target: 25,000 records / 250 families
- Photo target: 80% any photo, 40% exact photo
- Focus: enough breadth for real garage filling, family completion, hunt lists, and eBay comps

### Benchmark 4 - Public v1

- Target: 50,000 records / 500 families
- Photo target: 90% any photo, 50% exact photo
- Pricing target: 100% seed pricing, 70% comp-backed pricing for top families
- Focus: strong enough to feel like a real collector database without pretending to be complete

## Expansion Priorities

### Hot Wheels - Highest Priority

Current/high-demand lines:

- Mainline: HW J-Imports, Factory Fresh, Then and Now, HW Exotics, Muscle Mania, HW Hot Trucks, HW Dream Garage
- Treasure Hunts and Super Treasure Hunts
- Premium: Car Culture, Boulevard, Team Transport, Pop Culture, Retro Entertainment, Fast & Furious, Premium Collector Sets
- RLC/Mattel Creations: collector drops, membership cars, sELECTIONs, Pink Editions

High-value family lanes:

- JDM/tuner: Nissan Skyline/GT-R R32/R33/R34, Datsun 510, Datsun 240Z, Nissan Z, Silvia S13/S14/S15, Toyota Supra A70/A80/GR, AE86, Mazda RX-7 FC/FD, Honda Civic/Integra/S2000/NSX, Mitsubishi Evo, Subaru WRX/STI
- Porsche/Euro: Porsche 911/934/935/959/Carrera GT/918, BMW M3 E30/E46, Mercedes 190E/AMG, Audi RS2/quattro, Lamborghini Countach/Huracan/Aventador, Ferrari F40/F50/Testarossa when licensing coverage is stable
- American muscle/trucks: Camaro, Mustang, Charger, Challenger, C10, Silverado, Ford Bronco, F-150/Raptor, Chevy Bel Air Gasser, Impala, lowriders
- Hot Wheels originals/icons: Bone Shaker, Twin Mill, Rodger Dodger, Deora II, Purple Passion, Kool Kombi, Drag Bus, Dairy Delivery
- Entertainment/licensed: Batmobile, Fast & Furious, Barbie, movie/TV cars, character/promo lines

### Matchbox - High Priority

Focus on realism, utility, and modern collector lines:

- Basic/Mainline
- Moving Parts
- Matchbox Collectors
- Super Chase
- Working Rigs / Hitch & Tow where collector demand supports it

Family lanes:

- Land Rover Defender/Range Rover
- Ford Bronco/F-Series/F-550
- Toyota Tacoma/4Runner/Land Cruiser
- Porsche, BMW, Mercedes, Lexus
- Rescue/fire/police/utility vehicles
- EV/current realism lanes such as Tesla, Rivian, Nissan, Toyota, Ford, Cadillac

### Premium 1:64 And Hobby Brands - Medium/High Priority

These should be family-limited but high quality:

- MINI GT / Kaido House
- Tarmac Works
- INNO64
- Pop Race
- GreenLight Hollywood, Hitch & Tow
- Auto World
- Johnny Lightning Classic Gold, Street Freaks
- M2 Machines Auto-Thentics, Auto-Drivers, Auto-Haulers

### Oddball / User-Test Lanes - Keep

These are culturally useful because the user owns examples and can test recognition:

- Jada WWE
- Jada WCW
- Racing Champions WCW Nitro Streetrods
- Movie/TV licensed diecast
- Promo/limited entertainment vehicles

## Expansion Method

Use 25-family batches.

For each batch:

1. Add 25 families.
2. Generate variant records for line/year/color/deco/wheel/base/card region/chase.
3. Keep family pages as the main grouping.
4. Use exact photos first for top families, chase variants, premiums, and user-owned test pieces.
5. Use family/inherited photos as acceptable temporary coverage only.
6. Add pricing in two layers:
   - seed condition ladder for every record
   - comp-backed price for top families and chase/premium variants
7. Build, smoke test, then sync to site only after the batch is coherent.

## Next Recommended Batch

Target: move from 76 to 100 families.

Add roughly:

- 10 Hot Wheels JDM/tuner families
- 5 Hot Wheels Porsche/Euro families
- 3 Hot Wheels muscle/truck/icon families
- 4 Matchbox realism/Moving Parts families
- 2 premium hobby-brand families
- 1 oddball/licensed family

Success for this batch:

- 10k generated records
- 100 families
- 70% any-photo coverage
- 25% exact-photo coverage
- all new families visible in family-first browse
