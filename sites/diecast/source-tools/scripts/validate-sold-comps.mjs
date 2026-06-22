import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const compsPath = resolve(root, "kb/sold-comps.ndjson");
const generatedPath = resolve(root, "kb/generated/kb-diecast.json");
const conditions = new Set(["loose", "mint_loose", "carded", "momc", "damaged_card"]);
const sources = new Set(["ebay", "auction-house", "collector-sale"]);

export function readValidatedSoldComps() {
  const knownIds = existsSync(generatedPath)
    ? new Set(JSON.parse(readFileSync(generatedPath, "utf8")).records.map((record) => record.diecast_id))
    : null;
  const rows = readFileSync(compsPath, "utf8").split(/\r?\n/).filter((line) => line.trim()).map((line, index) => {
    try {
      return { ...JSON.parse(line), _line: index + 1 };
    } catch (error) {
      throw new Error(`sold-comps.ndjson line ${index + 1}: invalid JSON (${error.message})`);
    }
  });
  const errors = [];
  const seen = new Set();
  const now = Date.now();

  for (const row of rows) {
    const label = `line ${row._line}`;
    const key = `${row.source}:${row.source_id}`;
    if (!sources.has(row.source)) errors.push(`${label}: unsupported source`);
    if (!row.source_id) errors.push(`${label}: source_id is required`);
    if (seen.has(key)) errors.push(`${label}: duplicate source/source_id ${key}`);
    seen.add(key);
    if (!row.diecast_id || (knownIds && !knownIds.has(row.diecast_id))) errors.push(`${label}: unknown diecast_id`);
    if (!conditions.has(row.condition)) errors.push(`${label}: invalid condition`);
    if (!["loose", "carded"].includes(row.packaging)) errors.push(`${label}: packaging must be loose or carded`);
    if (row.currency !== "USD") errors.push(`${label}: only USD is accepted until currency normalization exists`);
    if (!Number.isFinite(Number(row.price)) || Number(row.price) <= 0) errors.push(`${label}: price must be positive`);
    if (!Number.isFinite(Number(row.shipping)) || Number(row.shipping) < 0) errors.push(`${label}: shipping must be zero or positive`);
    if (Number(row.quantity || 1) !== 1 || Number(row.lot_size || 1) !== 1) errors.push(`${label}: lots and multi-quantity sales must be excluded`);
    if (!Number.isFinite(Number(row.match_confidence)) || Number(row.match_confidence) < 0.8 || Number(row.match_confidence) > 1) {
      errors.push(`${label}: match_confidence must be between 0.8 and 1`);
    }
    if (!row.match_basis) errors.push(`${label}: match_basis is required`);
    const soldAt = Date.parse(row.sold_at);
    if (!Number.isFinite(soldAt) || soldAt > now + 86400000) errors.push(`${label}: sold_at must be a valid non-future date`);
    if (!row.title) errors.push(`${label}: title is required`);
    if (!row.sold_url) errors.push(`${label}: sold_url is required`);
  }

  if (errors.length) throw new Error(`Sold comp validation failed:\n- ${errors.join("\n- ")}`);
  return rows.map(({ _line, ...row }) => row);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const rows = readValidatedSoldComps();
  console.log(`Sold comp validation passed: ${rows.length} accepted rows.`);
}
