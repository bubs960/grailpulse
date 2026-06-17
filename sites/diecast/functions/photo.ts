import type { EventContext } from '@cloudflare/workers-types'

const ALLOWED_IMAGE_HOSTS = new Set([
  'i.ebayimg.com',
  'images.mercari.com',
  'static.mercdn.net',
])

const CACHE_SECONDS = 60 * 60 * 24 * 30
const STALE_SECONDS = 60 * 60 * 24 * 7

export async function onRequest(ctx: EventContext<unknown, string, unknown>): Promise<Response> {
  const requestUrl = new URL(ctx.request.url)
  const rawSrc = requestUrl.searchParams.get('src')

  if (!rawSrc) {
    return new Response('Missing ?src=', { status: 400 })
  }

  let src: URL
  try {
    src = new URL(rawSrc)
  } catch {
    return new Response('Invalid ?src=', { status: 400 })
  }

  if (src.protocol !== 'https:' || !ALLOWED_IMAGE_HOSTS.has(src.hostname)) {
    return new Response('Image host not allowed', { status: 400 })
  }

  const cache = caches.default
  const cacheKey = new Request(requestUrl.toString(), ctx.request)
  const cached = await cache.match(cacheKey)
  if (cached) {
    const response = new Response(cached.body, cached)
    response.headers.set('x-diecast-photo-cache', 'hit')
    return response
  }

  const upstream = await fetch(src.toString(), {
    headers: {
      referer: 'https://www.ebay.com/',
      'user-agent': 'Mozilla/5.0 GrailPulseDiecastImageCache/1.0',
    },
    cf: {
      cacheEverything: true,
      cacheTtl: CACHE_SECONDS,
    },
  })

  if (!upstream.ok) {
    return new Response(`Image fetch failed: ${upstream.status}`, { status: 502 })
  }

  const contentType = upstream.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('image/')) {
    return new Response('Upstream response is not an image', { status: 415 })
  }

  const response = new Response(upstream.body, upstream)
  response.headers.set('cache-control', `public, max-age=${CACHE_SECONDS}, s-maxage=${CACHE_SECONDS}, stale-while-revalidate=${STALE_SECONDS}`)
  response.headers.set('x-diecast-photo-cache', 'miss')
  response.headers.delete('set-cookie')

  ctx.waitUntil(cache.put(cacheKey, response.clone()))
  return response
}
