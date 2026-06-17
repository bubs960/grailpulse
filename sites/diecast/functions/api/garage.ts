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

interface LicenseRow {
  license_id: string
  key_hash: string
  handle: string
  lane: string
  garage_json: string
  hunt_json: string
  created_at: string
  updated_at: string
}

async function ensureSchema(db: D1Database) {
  await db.prepare(TABLE_SQL).run()
}

async function hashKey(licenseId: string, garageKey: string): Promise<string> {
  const input = new TextEncoder().encode(`${licenseId}:${garageKey}`)
  const digest = await crypto.subtle.digest('SHA-256', input)
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('')
}

function safeParseJson(value: string) {
  try {
    return JSON.parse(value || '{}')
  } catch {
    return {}
  }
}

function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init)
}

async function getAuthedRow(db: D1Database, licenseId: string, garageKey: string): Promise<LicenseRow | null> {
  const row = await db.prepare('SELECT * FROM diecast_licenses WHERE license_id = ?').bind(licenseId).first<LicenseRow>()
  if (!row) return null
  const keyHash = await hashKey(licenseId, garageKey)
  if (row.key_hash !== keyHash) return null
  return row
}

export async function onRequestPost(ctx: EventContext<Env, string, unknown>): Promise<Response> {
  const db = ctx.env.USER_DB
  if (!db) return json({ error: 'user_db_unavailable' }, { status: 503 })
  await ensureSchema(db)

  let body: { action?: string; licenseId?: string; garageKey?: string; garage?: unknown; hunt?: unknown }
  try {
    body = await ctx.request.json()
  } catch {
    return json({ error: 'invalid_json' }, { status: 400 })
  }

  const licenseId = (body.licenseId || '').trim().toUpperCase()
  const garageKey = (body.garageKey || '').trim()
  if (!licenseId || !garageKey) return json({ error: 'missing_license' }, { status: 400 })

  const row = await getAuthedRow(db, licenseId, garageKey)
  if (!row) return json({ error: 'invalid_license' }, { status: 401 })

  if (body.action === 'save') {
    const garageJson = JSON.stringify(body.garage ?? {})
    const huntJson = JSON.stringify(body.hunt ?? {})
    const now = new Date().toISOString()
    await db.prepare('UPDATE diecast_licenses SET garage_json = ?, hunt_json = ?, updated_at = ? WHERE license_id = ?')
      .bind(garageJson, huntJson, now, licenseId)
      .run()
    return json({ ok: true, updatedAt: now })
  }

  return json({
    license: {
      licenseId: row.license_id,
      garageKey,
      handle: row.handle,
      lane: row.lane,
      createdAt: row.created_at,
    },
    garage: safeParseJson(row.garage_json),
    hunt: safeParseJson(row.hunt_json),
  })
}
