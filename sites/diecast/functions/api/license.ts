import type { D1Database, EventContext } from '@cloudflare/workers-types'
import { checkRequestOrigin, cleanText, enforceRateLimit, json, readJsonBody } from '../_lib/requestSecurity'

interface Env { USER_DB?: D1Database }
const TABLE_SQL = `CREATE TABLE IF NOT EXISTS diecast_licenses (license_id TEXT PRIMARY KEY, key_hash TEXT NOT NULL, handle TEXT NOT NULL, lane TEXT NOT NULL, garage_json TEXT NOT NULL DEFAULT '{}', hunt_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`
const ALLOWED_LANES = new Set(['JDM / Tuner', 'Premium 1:64', 'Mainline Hunter', 'Matchbox Realism', 'WWE / WCW Oddball', 'Muscle & Hot Rod', 'Movie / TV'])

async function hashKey(licenseId: string, garageKey: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${licenseId}:${garageKey}`))
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function onRequestPost(ctx: EventContext<Env, string, unknown>): Promise<Response> {
  const originError = checkRequestOrigin(ctx.request)
  if (originError) return originError
  const db = ctx.env.USER_DB
  if (!db) return json({ error: 'user_db_unavailable' }, { status: 503 })
  await db.prepare(TABLE_SQL).run()
  const rateError = await enforceRateLimit(db, ctx.request, 'license-create', 5, 60_000, promise => ctx.waitUntil(promise))
  if (rateError) return rateError

  const parsed = await readJsonBody<{ handle?: string; lane?: string }>(ctx.request, 4096)
  if ('response' in parsed) return parsed.response
  const handle = cleanText(parsed.data.handle, 'Pit Lane Collector', 40)
  const requestedLane = cleanText(parsed.data.lane, 'JDM / Tuner', 40)
  const lane = ALLOWED_LANES.has(requestedLane) ? requestedLane : 'JDM / Tuner'
  const licenseId = `DC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const garageKey = crypto.randomUUID().replace(/-/g, '').slice(0, 16).toUpperCase()
  const keyHash = await hashKey(licenseId, garageKey)
  const now = new Date().toISOString()

  await db.prepare(`INSERT INTO diecast_licenses (license_id, key_hash, handle, lane, garage_json, hunt_json, created_at, updated_at) VALUES (?, ?, ?, ?, '{}', '{}', ?, ?)`)
    .bind(licenseId, keyHash, handle, lane, now, now).run()

  return json({ license: { licenseId, garageKey, handle, lane, createdAt: now }, garage: {}, hunt: {} })
}