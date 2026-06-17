import kb from '../src/data/diecast-kb.json' with { type: 'json' }

const records = kb.records || []
if (kb.meta?.total_records < 11724) {
  throw new Error(`Expected expanded KB baseline of at least 11724 records, saw ${kb.meta?.total_records}`)
}
if (records.length !== kb.meta?.total_records) {
  throw new Error(`Record array does not match meta count: ${records.length} vs ${kb.meta?.total_records}`)
}
const families = new Set(records.map(record => `${record.brand}::${record.line}::${record.casting}`))
if (families.size < 126) {
  throw new Error(`Expected expanded KB baseline of at least 126 families, saw ${families.size}`)
}
const priced = records.filter(record => record.condition_values && Object.values(record.condition_values).some(value => typeof value === 'number'))
if (priced.length !== records.length) {
  throw new Error(`Expected pricing on every record, saw ${priced.length}/${records.length}`)
}
const photoFamilies = new Set(records.filter(record => record.photo_url).map(record => `${record.brand}::${record.line}::${record.casting}`))
if (photoFamilies.size < 50) {
  throw new Error(`Expected photo coverage on at least 50 families, saw ${photoFamilies.size}`)
}
console.log(`Smoke tests passed: ${records.length} records, ${families.size} families, ${priced.length} priced records, ${photoFamilies.size} photo families.`)
