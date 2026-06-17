/**
 * /go/[retailer] — affiliate-aware tracked redirect
 *
 * Pattern:  /go/apmex?url=https%3A%2F%2Fwww.apmex.com%2Fproduct%2F12345&ref=melt-floor
 *
 * Why a tracked redirect (not a direct affiliate link in the <a href>):
 *   1. Single source of truth for affiliate IDs — swap one config when accepted
 *      to a program; every link on the site starts earning instantly
 *   2. Click logging — see which placements drive revenue
 *   3. Allowlist — prevents the route from being weaponized as an open redirect
 *   4. Pre-wired — pages can ship /go/ links today; commission starts the day
 *      Steve gets accepted (no second deploy)
 *
 * IMPORTANT: every retailer in the live KB must appear in RETAILERS below,
 * even with no affiliate params yet — otherwise the redirect 400s.
 */

import type { EventContext } from '@cloudflare/workers-types'

// ── Retailer config ─────────────────────────────────────────────────────────
//
// Each retailer entry tells the route:
//   1. The exact hostname(s) we'll accept in ?url= (defense against open
//      redirect — only the retailer's own domain is allowed)
//   2. How to inject affiliate params once accepted to their program
//
// Leave `affiliate: null` for retailers with no program signed up yet —
// the click still passes through (we log it) but goes through as a clean URL.
// When Steve gets accepted, swap `affiliate` for the right shape and every
// existing /go/<retailer> link starts earning immediately.

interface RetailerConfig {
  hosts: string[]                        // allowlist of destination hostnames
  affiliate: null | AffiliateInjector    // null = no program yet
}

type AffiliateInjector =
  | { kind: 'querystring'; params: Record<string, string> }     // append ?k=v
  | { kind: 'wrap'; template: string }                          // wrap URL e.g. partner.com/redirect?u={url}
  | { kind: 'epn'; campid: string }                             // eBay Partner Network

const RETAILERS: Record<string, RetailerConfig> = {
  // ── ACTIVE ─────────────────────────────────────────────────────────
  ebay: {
    hosts: ['ebay.com', 'www.ebay.com'],
    affiliate: { kind: 'epn', campid: '5339147406' },
  },

  // ── PENDING APPLICATION (placeholder — swap when accepted) ─────────
  // Coins
  apmex: { hosts: ['apmex.com', 'www.apmex.com'], affiliate: null },
  kitco: { hosts: ['kitco.com', 'www.kitco.com'], affiliate: null },         // no affiliate program — spot reference
  jmbullion: { hosts: ['jmbullion.com', 'www.jmbullion.com'], affiliate: null },
  sdbullion: { hosts: ['sdbullion.com', 'www.sdbullion.com'], affiliate: null },
  goldsilver: { hosts: ['goldsilver.com', 'www.goldsilver.com'], affiliate: null },
  littleton: { hosts: ['littletoncoin.com', 'www.littletoncoin.com'], affiliate: null },
  pcgs: { hosts: ['pcgs.com', 'www.pcgs.com'], affiliate: null },
  ngc: { hosts: ['ngccoin.com', 'www.ngccoin.com'], affiliate: null },
  heritage: { hosts: ['ha.com', 'www.ha.com', 'coins.ha.com'], affiliate: null },
  stacksbowers: { hosts: ['stacksbowers.com', 'www.stacksbowers.com'], affiliate: null },

  // Cross-vertical
  ee: { hosts: ['entertainmentearth.com', 'www.entertainmentearth.com'], affiliate: null },
  sideshow: { hosts: ['sideshow.com', 'www.sideshow.com', 'www.sideshowtoy.com'], affiliate: null },
  amazon: { hosts: ['amazon.com', 'www.amazon.com', 'smile.amazon.com'], affiliate: null },
  whatnot: { hosts: ['whatnot.com', 'www.whatnot.com'], affiliate: null },   // existing referral handled separately
}

// ── Build the final URL with affiliate params ───────────────────────────────

function buildAffiliateUrl(retailer: RetailerConfig, dest: URL): string {
  if (!retailer.affiliate) return dest.toString()

  const aff = retailer.affiliate
  if (aff.kind === 'querystring') {
    for (const [k, v] of Object.entries(aff.params)) {
      dest.searchParams.set(k, v)
    }
    return dest.toString()
  }
  if (aff.kind === 'wrap') {
    return aff.template.replace('{url}', encodeURIComponent(dest.toString()))
  }
  if (aff.kind === 'epn') {
    dest.searchParams.set('mkcid', '1')
    dest.searchParams.set('mkrid', '711-53200-19255-0')
    dest.searchParams.set('campid', aff.campid)
    dest.searchParams.set('toolid', '10001')
    return dest.toString()
  }
  return dest.toString()
}

// ── Pages Function handler ──────────────────────────────────────────────────

export async function onRequest(ctx: EventContext<unknown, 'retailer', unknown>): Promise<Response> {
  const { params, request } = ctx
  const retailerKey = String(params.retailer ?? '').toLowerCase()
  const retailer = RETAILERS[retailerKey]

  if (!retailer) {
    return new Response(`Unknown retailer: ${retailerKey}`, { status: 404 })
  }

  const url = new URL(request.url)
  const rawDest = url.searchParams.get('url')
  const ref     = url.searchParams.get('ref') ?? 'unknown'

  if (!rawDest) {
    return new Response('Missing ?url=', { status: 400 })
  }

  let dest: URL
  try {
    dest = new URL(rawDest)
  } catch {
    return new Response('Invalid ?url=', { status: 400 })
  }

  // Allowlist — refuse to redirect anywhere outside the retailer's own domains
  const hostOk = retailer.hosts.some(h => dest.hostname === h)
  if (!hostOk) {
    return new Response(
      `Destination host "${dest.hostname}" not in allowlist for ${retailerKey}`,
      { status: 400 }
    )
  }

  const finalUrl = buildAffiliateUrl(retailer, dest)

  // Click log — visible in CF dashboard logs.
  // TODO: persist to D1 once a clicks table exists (currently zero-cost console.log)
  console.log(JSON.stringify({
    type: 'go_click',
    retailer: retailerKey,
    ref,
    has_affiliate: retailer.affiliate !== null,
    dest_host: dest.hostname,
    ua: request.headers.get('user-agent')?.slice(0, 120) ?? null,
    ts: Date.now(),
  }))

  return Response.redirect(finalUrl, 302)
}
