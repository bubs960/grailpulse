import { writeFileSync } from 'node:fs'
import kb from '../src/data/diecast-kb.json' with { type: 'json' }

function slugPart(value) {
  return String(value ?? 'unknown').toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'unknown'
}

function familySlug(record) {
  return [record.brand, record.line, record.casting].map(slugPart).join('__')
}

function displayName(record) {
  return record.title || [record.year_release, record.brand, record.casting].filter(Boolean).join(' ')
}

function topValue(record) {
  return Math.max(0, ...Object.values(record.condition_values || {}).filter(value => typeof value === 'number'))
}

const catalog = Object.fromEntries(kb.records.map(record => [record.diecast_id, [
  displayName(record), familySlug(record), record.brand, record.line, record.scale || 'Unknown',
  record.color || 'Unknown color', record.chase_type || 'none', record.photo_url || '',
  record.photo_match_level || '', topValue(record),
]]))

writeFileSync(new URL('../public/garage-catalog.json', import.meta.url), JSON.stringify({
  generatedAt: kb.meta.generated_at,
  totalRecords: kb.meta.total_records,
  records: catalog,
}))

console.log(`Garage catalog built: ${Object.keys(catalog).length} compact records.`)