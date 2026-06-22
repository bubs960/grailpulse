import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readValidatedSoldComps } from "./validate-sold-comps.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputPath = resolve(root, "kb/sold-comp-summaries.json");
const minimumConditionSample = 3;
const rows = readValidatedSoldComps();
const grouped = new Map();

function quantile(values, q) {
  const sorted = [...values].sort((a, b) => a - b);
  if (!sorted.length) return null;
  const position = (sorted.length - 1) * q;
  const base = Math.floor(position);
  const remainder = position - base;
  const value = sorted[base + 1] === undefined ? sorted[base] : sorted[base] + remainder * (sorted[base + 1] - sorted[base]);
  return Number(value.toFixed(2));
}

function summarize(items) {
  const totals = items.map((item) => Number(item.price) + Number(item.shipping || 0));
  const dates = items.map((item) => item.sold_at).sort();
  return {
    count: items.length,
    median_total: quantile(totals, 0.5),
    p25_total: quantile(totals, 0.25),
    p75_total: quantile(totals, 0.75),
    first_sold_at: dates[0] || null,
    last_sold_at: dates.at(-1) || null,
    source_count: new Set(items.map((item) => item.source)).size
  };
}

for (const row of rows) {
  if (!grouped.has(row.diecast_id)) grouped.set(row.diecast_id, []);
  grouped.get(row.diecast_id).push(row);
}

const records = {};
for (const [diecastId, items] of grouped) {
  const byCondition = {};
  for (const item of items) {
    byCondition[item.condition] ||= [];
    byCondition[item.condition].push(item);
  }
  records[diecastId] = {
    overall: summarize(items),
    conditions: Object.fromEntries(Object.entries(byCondition).map(([condition, conditionItems]) => [condition, summarize(conditionItems)]))
  };
}

const payload = {
  meta: {
    generated_at: new Date().toISOString(),
    minimum_condition_sample: minimumConditionSample,
    accepted_comp_count: rows.length,
    record_count: Object.keys(records).length,
    policy: "USD single-item completed sales; exact diecast_id; match confidence >= 0.8; shipping included"
  },
  records
};

writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Sold comp summaries built: ${rows.length} comps across ${Object.keys(records).length} records.`);
