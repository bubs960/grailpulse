import type { D1Database, EventContext } from '@cloudflare/workers-types'

interface Env {
  USER_DB?: D1Database
}

const TABLE_SQL = `
CREATE TABLE IF NOT EXISTS diecast_licenses (
  license_id TEXT PRIMARY KEY,
  key_hash TEXT NOT NULL,
  handle TEXT NOT NULL,
  lane TEXT NOT NULL,
  garage_json TEXT NOT NULL DEFAULT '{}',
  hunt_json TEXT NOT NULL DEFAULT '{}',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
)`

async function ensureSchema(db: D1Database) {
  await db.prepare(TABLE_SQL).run()
}

async function hashKey(licenseId: string, garageKey: string): Promise<string> {
  const input = new TextEncoder().encode(`${licenseId}:${garageKey}`)
  const digest = await crypto.subtle.digest('SHA-256', input)
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('')
}

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init)
}

export async function onRequestPost(ctx: EventContext<Env, string, unknown>): Promise<Response> {
  const db = ctx.env.USER_DB
  if (!db) return json({ error: 'user_db_unavailable' }, { status: 503 })
  await ensureSchema(db)

  let body: { handle?: string; lane?: string; garageKey?: string }
  try {
    body = await ctx.request.json()
  } catch {
    return json({ error: 'invalid_json' }, { status: 400 })
  }

  const handle = (body.handle || 'Pit Lane Collector').trim().slice(0, 80) || 'Pit Lane Collector'
  const lane = (body.lane || 'JDM / Tuner').trim().slice(0, 80) || 'JDM / Tuner'
  const licenseId = `DC-${crypto.randomUUID().slice(0, 8).toUpperCase()}`
  const garageKey = (body.garageKey || crypto.randomUUID().slice(0, 12).toUpperCase()).trim().slice(0, 40)
  const keyHash = await hashKey(licenseId, garageKey)
  const now = new Date().toISOString()

  await db.prepare(`
    INSERT INTO diecast_licenses (license_id, key_hash, handle, lane, garage_json, hunt_json, created_at, updated_at)
    VALUES (?, ?, ?, ?, '{}', '{}', ?, ?)
  `).bind(licenseId, keyHash, handle, lane, now, now).run()

  return json({
    license: { licenseId, garageKey, handle, lane, createdAt: now },
    garage: {},
    hunt: {},
  })
}
