import type { D1Database, EventContext } from '@cloudflare/workers-types'
import { checkRequestOrigin, enforceRateLimit, isRecordMap, json, readJsonBody } from '../_lib/requestSecurity'

interface Env { USER_DB?: D1Database }
const TABLE_SQL = `CREATE TABLE IF NOT EXISTS diecast_licenses (license_id TEXT PRIMARY KEY, key_hash TEXT NOT NULL, handle TEXT NOT NULL, lane TEXT NOT NULL, garage_json TEXT NOT NULL DEFAULT '{}', hunt_json TEXT NOT NULL DEFAULT '{}', created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`
interface LicenseRow { license_id: string; key_hash: string; handle: string; lane: string; garage_json: string; hunt_json: string; created_at: string; updated_at: string }

async function hashKey(licenseId: string, garageKey: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${licenseId}:${garageKey}`))
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2, '0')).join('')
}
function safeParseJson(value: string) { try { return JSON.parse(value || '{}') } catch { return {} } }
async function getAuthedRow(db: D1Database, licenseId: string, garageKey: string): Promise<LicenseRow | null> { const row = await db.prepare('SELECT * FROM diecast_licenses WHERE license_id = ?').bind(licenseId).first<LicenseRow>(); if (!row) return null; return row.key_hash === await hashKey(licenseId, garageKey) ? row : null }

export async function onRequestPost(ctx: EventContext<Env, string, unknown>): Promise<Response> {
  const originError = checkRequestOrigin(ctx.request)
  if (originError) return originError
  const db = ctx.env.USER_DB
  if (!db) return json({ error: 'user_db_unavailable' }, { status: 503 })
  await db.prepare(TABLE_SQL).run()
  const rateError = await enforceRateLimit(db, ctx.request, 'garage-access', 30, 60_000, promise => ctx.waitUntil(promise))
  if (rateError) return rateError

  const parsed = await readJsonBody<{ action?: string; licenseId?: string; garageKey?: string; garage?: unknown; hunt?: unknown }>(ctx.request, 64 * 1024)
  if ('response' in parsed) return parsed.response
  const body = parsed.data
  const licenseId = String(body.licenseId || '').trim().toUpperCase()
  const garageKey = String(body.garageKey || '').trim().toUpperCase()
  if (!/^DC-[A-F0-9]{8}$/.test(licenseId) || !/^[A-Z0-9]{12,40}$/.test(garageKey)) return json({ error: 'invalid_license_format' }, { status: 400 })
  const row = await getAuthedRow(db, licenseId, garageKey)
  if (!row) return json({ error: 'invalid_license' }, { status: 401 })

  if (body.action === 'save') {
    if (!isRecordMap(body.garage) || !isRecordMap(body.hunt)) return json({ error: 'invalid_garage_payload' }, { status: 400 })
    const garageJson = JSON.stringify(body.garage)
    const huntJson = JSON.stringify(body.hunt)
    if (garageJson.length + huntJson.length > 60_000) return json({ error: 'garage_too_large' }, { status: 413 })
    const now = new Date().toISOString()
    await db.prepare('UPDATE diecast_licenses SET garage_json = ?, hunt_json = ?, updated_at = ? WHERE license_id = ?').bind(garageJson, huntJson, now, licenseId).run()
    return json({ ok: true, updatedAt: now })
  }
  if (body.action) return json({ error: 'unknown_action' }, { status: 400 })

  return json({ license: { licenseId: row.license_id, garageKey, handle: row.handle, lane: row.lane, createdAt: row.created_at }, garage: safeParseJson(row.garage_json), hunt: safeParseJson(row.hunt_json) })
}