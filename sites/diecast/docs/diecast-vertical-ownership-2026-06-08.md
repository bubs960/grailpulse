# Diecast Vertical Ownership - 2026-06-08

Die Cast is a GrailPulse collector vertical with its own product direction.

## North Star

Diecast should feel like a collector garage: fast to browse, satisfying to fill, and useful enough that a Hot Wheels, Matchbox, Jada, Tomica, or premium 1:64 collector wants to keep their real collection organized here.

The core promise:

> Get your collector license, load your garage, track your variants, and turn a pile of carded/loose cars into a scored, valued, photo-rich pit lane.

## Product Identity

- Vertical name: GrailPulse Die Cast
- Primary user action: Get Your License
- Signed-in space: My Garage
- Collection unit: Casting family first, variant detail second
- Core collector language: casting, mainline, premium, chase, Super Treasure Hunt, Real Riders, deco, tampo, card region, blister, loose, carded, MOMC, damaged card, garage, hunt list, bay, pit lane
- Visual lane: dark GrailPulse base, red/chrome/yellow signal accents, garage/paddock/cardback energy

## Current State

- Live domain: https://diecast.grailpulse.com
- Current live site: MVP data surface with homepage, browse, family pages, and variant/detail pages
- Current deployed app dataset: 11,724 records, 126 families, 11,724 priced records, 50 photo families
- The 2026-06-16 expansion added a health validator for 10%+ growth, stable identity fields, required field completeness, duplicate IDs, and condition-pricing coverage
- Photo handling now uses `/photo?src=...` so eBay/Mercari images are cached through Cloudflare instead of raw hotlinks
- Cloudflare cache rules are live for `diecast.grailpulse.com`
- License Locker MVP is live: `/license` issues a collector license plus garage key, `/garage` shows cloud-synced garage state, and detail pages can park cars or add hunt-list targets
- Cloud persistence uses the shared Cloudflare D1 database `grailpulse-userdata` through the `USER_DB` binding and a `diecast_licenses` table created lazily by Pages Functions
- Verified on 2026-06-08: `npm run build`, `npm test`, `npx wrangler pages deploy out --project-name=grailpulse-diecast`, live `/api/license`, live `/api/garage`, and Playwright browser flow from license issue -> park car -> garage display

## Engagement Loop

The user should not feel like they are filling out a database. They should feel like they are building a garage.

1. Get Your License
2. Add first car to My Garage
3. See Garage Rating, total cars, estimated value, and completion meters
4. Add Hunt List targets from family/detail pages
5. Earn small badges for behavior that also improves the product
6. Return when values/photos/family coverage improve

## MVP Gamification

Keep the first pass light and useful. No heavy game economy yet.

- Garage Rating: simple score from owned cars, chase items, exact photos, family completion, and premium lines
- Starter Grid meter: first 10, 25, 50 cars loaded
- Family completion: "3/10 Skyline lane loaded"
- Hunt List: want-list targets with future eBay CTA potential
- Photo Scout badge: user contributes a missing exact photo
- Oddball Lane badge: WWE/WCW, movie, promotional, or unusual licensed diecast
- Premium Hunter badge: Real Riders / premium / chase coverage

## Completed Build Slice

The first garage layer is now live. It is not full auth yet, but it is more than local-only:

1. `/license` issues a cloud-backed collector license when Pages Functions/D1 are available
2. License ID plus garage key can reload the same garage on return
3. Browser localStorage remains as fallback for local dev or temporary API unavailability
4. `/garage` displays garage rating, parked count, hunt count, seed value, starter progress, and badges
5. Detail pages include `Park in Garage` and `Add to Hunt List`
6. Licensed garage edits auto-sync to D1 after local changes

## Next Build Slice

Now prove whether collectors want to fill the garage:

1. Add `Hunt this on eBay` CTA through the existing affiliate route
2. Add family completion meters on family pages and garage cards
3. Add import helpers for bulk test garages
4. Add exact-photo contribution placeholders for missing variants
5. Keep full auth/pro gate out until the License Locker loop is tested by real collectors

## Data Priorities

The KB should keep grouping by family because per-variant pages can get massive. Expansion priority:

1. Grow family count across Hot Wheels, Matchbox, Jada, Tomica, GreenLight, Auto World, Johnny Lightning, M2, MINI GT, Tarmac Works, INNO64
2. Preserve variant detail for color/deco/wheel/base/card region/chase
3. Prioritize variant-exact photos for high-value chase, premium, WWE/WCW, and user-owned test items
4. Add comp-backed pricing fields when eBay sold data is ready
5. Move long-term photo storage toward owned R2/public cache where possible

## Monetization Path

- Do not monetize image URLs.
- Product CTAs should use `/go/ebay?...` with the existing eBay EPN route.
- Best first CTA: `Check eBay comps` or `Hunt this on eBay` from detail and hunt-list pages.
- Pro value later: collection valuation history, alerts, bulk import, image-backed garage, export, and advanced condition tracking.

## Quality Rules

- Keep Diecast collector-literate, not generic toy-copy.
- Avoid fake rarity claims unless backed by trusted references/comps.
- Always distinguish exact variant photos from family/reference photos.
- Keep family-first navigation.
- Do not let gamification obscure practical utility.
- Document progress in this folder and Bridge after every meaningful vertical change.
