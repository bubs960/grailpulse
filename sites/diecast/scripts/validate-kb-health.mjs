import kb from '../src/data/diecast-kb.json' with { type: 'json' }

const ORIGINAL_RECORD_COUNT = 4124
const MIN_GROWTH_RATE = 0.10
const MIN_EXPANDED_RECORDS = Math.ceil(ORIGINAL_RECORD_COUNT * (1 + MIN_GROWTH_RATE))
const REQUIRED_FIELDS = [
  'diecast_id',
  'identity_key_fields',
  'brand',
  'year_release',
  'line',
  'segment',
  'mix',
  'series_number',
  'casting',
  'color',
  'deco',
  'wheel_type',
  'base',
  'country',
  'card_region',
  'scale',
  'chase_type',
  'condition_values',
  'pricing_quality',
  'verify_status',
  'title',
  'searchable',
  'conditions',
  'flags',
]
const REQUIRED_CONDITIONS = ['loose', 'mint_loose', 'carded', 'momc', 'damaged_card']
const IDENTITY_FIELDS = kb.meta?.identity_key_fields || []
const records = kb.records || []

function fail(message) {
  throw new Error(message)
}

if (records.length !== kb.meta?.total_records) {
  fail(`Record count does not match meta.total_records: ${records.length} vs ${kb.meta?.total_records}`)
}

if (records.length < MIN_EXPANDED_RECORDS) {
  fail(`Expected at least 10% growth from ${ORIGINAL_RECORD_COUNT}; need ${MIN_EXPANDED_RECORDS}, saw ${records.length}`)
}

if (!Array.isArray(IDENTITY_FIELDS) || IDENTITY_FIELDS.length < 10) {
  fail('Missing healthy identity_key_fields metadata')
}

const ids = new Set()
const missing = []
const badPricing = []
const badIdentity = []

for (const record of records) {
  if (ids.has(record.diecast_id)) {
    fail(`Duplicate diecast_id: ${record.diecast_id}`)
  }
  ids.add(record.diecast_id)

  const missingFields = REQUIRED_FIELDS.filter(field => {
    const value = record[field]
    return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
  })
  if (missingFields.length) {
    missing.push({ id: record.diecast_id, fields: missingFields })
  }

  const recordIdentity = record.identity_key_fields || []
  if (JSON.stringify(recordIdentity) !== JSON.stringify(IDENTITY_FIELDS)) {
    badIdentity.push(record.diecast_id)
  }

  const values = record.condition_values || {}
  const missingConditions = REQUIRED_CONDITIONS.filter(condition => typeof values[condition] !== 'number')
  if (missingConditions.length) {
    badPricing.push({ id: record.diecast_id, conditions: missingConditions })
  }
}

if (missing.length) {
  fail(`Records missing required fields: ${JSON.stringify(missing.slice(0, 5))}`)
}
if (badIdentity.length) {
  fail(`Records with mismatched identity fields: ${badIdentity.slice(0, 5).join(', ')}`)
}
if (badPricing.length) {
  fail(`Records missing required condition prices: ${JSON.stringify(badPricing.slice(0, 5))}`)
}

const families = new Set(records.map(record => `${record.brand}::${record.line}::${record.casting}`))
const brands = new Set(records.map(record => record.brand))
const photoRecords = records.filter(record => record.photo_url)
const photoFamilies = new Set(photoRecords.map(record => `${record.brand}::${record.line}::${record.casting}`))

console.log(
  `KB health passed: ${records.length} records (${Math.round(((records.length - ORIGINAL_RECORD_COUNT) / ORIGINAL_RECORD_COUNT) * 100)}% growth), ${families.size} families, ${brands.size} brands, ${photoRecords.length} photo records, ${photoFamilies.size} photo families.`
)
