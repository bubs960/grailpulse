import type { D1Database } from '@cloudflare/workers-types'

const RATE_TABLE_SQL = `CREATE TABLE IF NOT EXISTS diecast_rate_limits (bucket TEXT PRIMARY KEY, count INTEGER NOT NULL, created_at INTEGER NOT NULL)`
const ALLOWED_ORIGINS = new Set(['https://diecast.grailpulse.com'])

export function json(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers)
  headers.set('cache-control', 'no-store')
  headers.set('content-type', 'application/json; charset=utf-8')
  headers.set('x-content-type-options', 'nosniff')
  headers.set('x-frame-options', 'DENY')
  headers.set('referrer-policy', 'no-referrer')
  return Response.json(data, { ...init, headers })
}

export function checkRequestOrigin(request: Request): Response | null {
  const origin = request.headers.get('origin')
  const fetchSite = request.headers.get('sec-fetch-site')
  if (fetchSite === 'cross-site') return json({ error: 'cross_site_request' }, { status: 403 })
  if (!origin) return null
  try {
    const parsed = new URL(origin)
    if (parsed.origin === new URL(request.url).origin || ALLOWED_ORIGINS.has(parsed.origin) || parsed.hostname.endsWith('.grailpulse-diecast.pages.dev')) return null
  } catch {}
  return json({ error: 'origin_not_allowed' }, { status: 403 })
}

export async function readJsonBody<T>(request: Request, maxBytes: number): Promise<{ data: T } | { response: Response }> {
  const declared = Number(request.headers.get('content-length') || 0)
  if (declared > maxBytes) return { response: json({ error: 'payload_too_large' }, { status: 413 }) }
  const text = await request.text()
  if (new TextEncoder().encode(text).byteLength > maxBytes) return { response: json({ error: 'payload_too_large' }, { status: 413 }) }
  try { return { data: JSON.parse(text) as T } } catch { return { response: json({ error: 'invalid_json' }, { status: 400 }) } }
}

async function digest(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value)
  const result = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(result)).map(byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function enforceRateLimit(
  db: D1Database,
  request: Request,
  route: string,
  limit: number,
  windowMs: number,
  waitUntil: (promise: Promise<unknown>) => void,
): Promise<Response | null> {
  await db.prepare(RATE_TABLE_SQL).run()
  const now = Date.now()
  const windowStart = Math.floor(now / windowMs) * windowMs
  const client = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const bucket = await digest(`${route}:${client}:${windowStart}`)
  const row = await db.prepare(`
    INSERT INTO diecast_rate_limits (bucket, count, created_at) VALUES (?, 1, ?)
    ON CONFLICT(bucket) DO UPDATE SET count = count + 1
    RETURNING count
  `).bind(bucket, windowStart).first<{ count: number }>()
  waitUntil(db.prepare('DELETE FROM diecast_rate_limits WHERE created_at < ?').bind(now - 86_400_000).run())
  if ((row?.count ?? 1) <= limit) return null
  return json({ error: 'rate_limited' }, { status: 429, headers: { 'retry-after': String(Math.ceil(windowMs / 1000)) } })
}

export function cleanText(value: unknown, fallback: string, maxLength: number): string {
  return String(value ?? '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength) || fallback
}

export function isRecordMap(value: unknown, maxEntries = 500): value is Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const entries = Object.entries(value)
  return entries.length <= maxEntries && entries.every(([key, entry]) => key.length <= 260 && entry && typeof entry === 'object' && !Array.isArray(entry))
}