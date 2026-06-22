import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const kbPath = resolve(root, "kb/generated/kb-diecast.json");
const outputPath = resolve(root, "output/sold-comp-query-queue.json");
if (!existsSync(kbPath)) throw new Error("Build the KB before generating the comp query queue.");
const records = JSON.parse(readFileSync(kbPath, "utf8")).records;
const families = new Map();

for (const record of records) {
  const key = [record.brand, record.line, record.casting].join("::");
  if (!families.has(key)) {
    families.set(key, {
      family_key: key,
      brand: record.brand,
      line: record.line,
      casting: record.casting,
      scale: record.scale,
      query: `${record.brand} ${record.casting} ${record.line} sold`,
      candidate_record_ids: []
    });
  }
  families.get(key).candidate_record_ids.push(record.diecast_id);
}

const queue = {
  meta: {
    generated_at: new Date().toISOString(),
    family_count: families.size,
    instructions: "External collector-approved comp runner output must be normalized into kb/sold-comps.ndjson and pass npm run comps:validate. This queue performs no network requests."
  },
  queries: [...families.values()].sort((a, b) => a.family_key.localeCompare(b.family_key))
};
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Comp query queue built: ${queue.queries.length} family queries.`);
